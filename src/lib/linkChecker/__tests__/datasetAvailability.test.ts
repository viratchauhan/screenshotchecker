import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifySingleUrl, getShardKey } from '../client';
import { verifyUrlLocally } from '../localDatasetService';

const empty = () => ({ urls: {}, hosts: {}, domains: {} });
const originalFetch = globalThis.fetch;
const unexpected: string[] = [];
let respond: typeof fetch;
globalThis.fetch = async (input, init) => {
  const path = String(input);
  if (!/^\/(?:data\/)?urldataIndex\/shard_[0-9a-f]{2}\.json$/.test(path)) {
    unexpected.push(path);
    throw new Error('Non-shard request prohibited');
  }
  return respond(input, init);
};
const originalCwd = process.cwd();
const fixtureDir = mkdtempSync(join(tmpdir(), 'sc-shard-fixtures-'));
const used = new Set<string>();
let sequence = 0;
function freshTarget() {
  while (true) {
    const domain = `outage-${sequence++}.example`;
    const host = `sub.${domain}`;
    const keys = [getShardKey(`${host}/page`), getShardKey(host), getShardKey(domain)];
    if (new Set(keys).size === 3 && keys.every(key => !used.has(key))) {
      keys.forEach(key => used.add(key));
      return { host, domain, url: `https://${host}/page`, keys };
    }
  }
}
let scenarios = 0;
try {
  // Keep the Node/Worker service on mocked shard requests rather than real data.
  process.chdir(fixtureDir);
  for (const verify of [verifySingleUrl, verifyUrlLocally]) {
    for (const failure of ['http', 'network', 'json', 'schema', 'label']) {
      const { url } = freshTarget();
      respond = async input => {
        assert.match(String(input), /^\/(?:data\/)?(?:urldataIndex)\/shard_[0-9a-f]{2}\.json$/);
        if (failure === 'network') throw new Error('Synthetic offline fixture');
        if (failure === 'http') return new Response('', { status: 503 });
        if (failure === 'json') return new Response('{invalid', { status: 200 });
        if (failure === 'schema') return Response.json({ urls: [] });
        return Response.json({ urls: { 'fixture.example/': 'safe-ish' }, hosts: {}, domains: {} });
      };
      const report = await verify(url);
      assert.equal(report.verdict, 'DATASET_UNAVAILABLE', failure);
      assert.equal(report.matched, false);
      assert.equal(report.label, 'unknown');
      assert.match(report.explanation, /could not|unavailable|incomplete/i);
      scenarios++;
    }
    // Missing exact data must not fall through to a broader positive label.
    const partial = freshTarget();
    respond = async input => String(input).includes(`_${partial.keys[0]}.json`)
      ? new Response('', { status: 503 })
      : Response.json({ urls: {}, hosts: {}, domains: { [partial.domain]: 'good' } });
    assert.equal((await verify(partial.url)).verdict, 'DATASET_UNAVAILABLE'); scenarios++;
    // Missing hostname data after a valid empty URL lookup is also inconclusive.
    const later = freshTarget();
    respond = async input => String(input).includes(`_${later.keys[0]}.json`)
      ? Response.json(empty()) : new Response('', { status: 404 });
    assert.equal((await verify(later.url)).verdict, 'DATASET_UNAVAILABLE'); scenarios++;
    const domainFailure = freshTarget();
    respond = async input => String(input).includes(`_${domainFailure.keys[2]}.json`)
      ? new Response('', { status: 503 }) : Response.json(empty());
    assert.equal((await verify(domainFailure.url)).verdict, 'DATASET_UNAVAILABLE'); scenarios++;
    // Failed reads are not cached: retry succeeds after assets recover.
    respond = async () => Response.json(empty());
    assert.equal((await verify(later.url)).verdict, 'NO_LOCAL_MATCH'); scenarios++;
    const known = freshTarget();
    respond = async () => Response.json({ urls: { [`${known.host}/page`]: 'bad' }, hosts: {}, domains: {} });
    assert.equal((await verify(known.url)).verdict, 'KNOWN_BAD'); scenarios++;
  }
  assert.deepEqual(unexpected, [], 'No destination/provider requests permitted');
  console.log(`Dataset availability: ${scenarios} mocked client/server scenarios passed; no live requests`);
} finally {
  globalThis.fetch = originalFetch;
  process.chdir(originalCwd);
  rmSync(fixtureDir, { recursive: true, force: true });
}
