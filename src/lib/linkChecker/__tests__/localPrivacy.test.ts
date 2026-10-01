import { strict as assert } from 'node:assert';
import { checkLink, getShardKey } from '../client';

// Never use live fetch, including for .invalid fixtures. Record violations outside
// fetch assertions because shard loading deliberately catches request failures.
const originalFetch = globalThis.fetch;
const requests: { path: string; init?: RequestInit }[] = [];
let fail = true;
globalThis.fetch = async (input, init) => {
  const path = String(input);
  requests.push({ path, init });
  if (fail) throw new Error('Synthetic resource outage');
  return Response.json({
    urls: { 'bad-fixture.invalid/private?token=SYNTHETIC_ONLY': 'bad' },
    hosts: { 'conflict-fixture.invalid': 'conflict', 'good-fixture.invalid': 'good' },
    domains: {},
  });
};
try {
  const url = 'https://bad-fixture.invalid/private?token=SYNTHETIC_ONLY';
  assert.equal((await checkLink(url)).single.verdict, 'DATASET_UNAVAILABLE');
  fail = false;
  assert.equal((await checkLink(url)).single.verdict, 'KNOWN_BAD', 'Failed shards remain retryable');
  const result = await checkLink(`  Synthetic private message: ${url}, https://conflict-fixture.invalid/ and https://good-fixture.invalid/ ${url}  `);
  assert.deepEqual(result.reports.map(r => r.verdict), ['KNOWN_BAD', 'CONFLICTING', 'GOOD']);
  assert.equal(result.single, result.reports[0]);
  assert.equal(result.single.target.originalUrl, url);
  assert.equal((await checkLink('https://unknown-fixture.invalid/')).single.verdict, 'NO_LOCAL_MATCH');
  const beforeInvalid = requests.length;
  assert.equal((await checkLink('http://[invalid')).single.verdict, 'INVALID_URL');
  await assert.rejects(checkLink('   '), /valid URL/);
  assert.equal(requests.length, beforeInvalid);
  assert.ok(requests.length > 0, 'Resource requests are permitted and exercised');
  assert.equal(requests[0].path, `/urldataIndex/shard_${getShardKey('bad-fixture.invalid/private?token=SYNTHETIC_ONLY')}.json`);
  for (const { path, init } of requests) {
    assert.match(path, /^\/urldataIndex\/shard_[0-9a-f]{2}\.json$/);
    assert.equal(init?.method ?? 'GET', 'GET');
    assert.equal(init?.body, undefined);
    assert.equal(init?.headers, undefined);
    assert.doesNotMatch(JSON.stringify({ path, init }), /SYNTHETIC_ONLY|\.invalid|private message|api\/check-link/);
  }
  console.log('Local privacy: synthetic single/multi extraction, verdicts, outage/retry, invalid/empty input; only bodyless static shard requests');
} finally {
  globalThis.fetch = originalFetch;
}
