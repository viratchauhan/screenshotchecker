import { strict as assert } from 'node:assert';
import { normalizeUrl } from '../urlNormalizer';
import { validateUrlForSsrf } from '../ssrfGuard';
import { checkLink, verifySingleUrl, getShardKey } from '../client';

// The UI uses client.checkLink; the Worker uses localDatasetService (tested in
// localDataset.test.ts). Legacy service.inspectUrl is not imported by either.
// Preserve relevant URL/security controls without reviving external providers.
// All examples are inert; even same-origin API/shard requests are intercepted.
type Label = 'bad' | 'good' | 'conflict';
type Shard = { urls: Record<string, Label>; hosts: Record<string, Label>; domains: Record<string, Label> };
const shards = new Map<string, Shard>();
function record(kind: keyof Shard, key: string, label: Label) {
  const id = getShardKey(key);
  const shard = shards.get(id) || { urls: {}, hosts: {}, domains: {} };
  shard[kind][key] = label;
  shards.set(id, shard);
}
record('urls', 'fixture.test/known?x=1', 'bad');
record('domains', 'fixture.test', 'good');
record('hosts', 'conflict.test', 'conflict');
record('hosts', 'host-only.test', 'bad');
record('domains', 'parent.test', 'bad');
const requested: string[] = [];
const unexpected: string[] = [];
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const target = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  requested.push(target);
  const match = target.match(/^\/urldataIndex\/shard_([0-9a-f]{2})\.json$/);
  if (match && (!init?.method || init.method === 'GET')) {
    return Response.json(shards.get(match[1]) || { urls: {}, hosts: {}, domains: {} });
  }
  unexpected.push(target);
  throw new Error(`Unexpected request prohibited: ${target}`);
};

try {
  // Prior brand/userinfo cases now assert destination identity, not unsupported
  // threat scores. Normalization must never credit the brand in an attack URL.
  const brand = normalizeUrl('https://bank.example.attacker.test/login');
  assert.equal(brand.hostname, 'bank.example.attacker.test');
  assert.equal(brand.registrableDomain, 'attacker.test');
  const userinfo = normalizeUrl('https://trusted.example@attacker.test/login');
  assert.equal(userinfo.hostname, 'attacker.test');
  assert.equal(userinfo.normalizedUrl, 'https://attacker.test/login');
  const unicode = normalizeUrl('https://bücher.example/');
  assert.equal(unicode.hostname, 'xn--bcher-kva.example');
  assert.equal(normalizeUrl('https://xn--bcher-kva.example/').hostname, unicode.hostname);
  const ip = normalizeUrl('http://192.0.2.5/bank/login');
  assert.equal(ip.isIpAddress, true);
  assert.equal(ip.hostname, '192.0.2.5');
  assert.equal(normalizeUrl('https://download.example/bank-update.apk').pathname, '/bank-update.apk');
  assert.equal(normalizeUrl('HTTPS://Fixture.Test:443/known/?x=1#fragment').normalizedUrl, 'https://fixture.test/known?x=1');
  assert.equal(normalizeUrl('ftp://fixture.test/file').isValid, false);
  assert.equal(normalizeUrl('').isValid, false);
  assert.equal(normalizeUrl('http://[invalid').isValid, false);

  // Preserve and strengthen legacy SSRF checks. No catch may swallow an
  // assertion failure, unlike the previous loop. Parsing is not a request.
  for (const target of [
    'http://127.0.0.1:8080/admin', 'http://localhost/secret',
    'http://169.254.169.254/latest/meta-data/', 'http://10.0.0.1/router',
    'http://192.168.1.1/gateway', 'http://172.16.0.1/intranet',
    'http://[::1]/', 'file:///etc/passwd', 'javascript:alert(1)',
  ]) assert.equal(validateUrlForSsrf(new URL(target)).isSafe, false, target);
  assert.equal(validateUrlForSsrf(new URL('https://public.example/')).isSafe, true);

  // Deterministic browser shard cases, independent of external reputation or
  // the changing bundled dataset. Exact URL precedence over broader record.
  const exact = await verifySingleUrl('https://fixture.test/known?x=1');
  assert.equal(exact.verdict, 'KNOWN_BAD');
  assert.equal(exact.matchLevel, 'EXACT_URL');
  assert.equal(exact.matchedValue, 'fixture.test/known?x=1');
  const good = await verifySingleUrl('https://fixture.test/elsewhere');
  assert.equal(good.verdict, 'GOOD');
  assert.equal(good.matchLevel, 'REGISTRABLE_DOMAIN');
  assert.match(good.explanation, /does not guarantee absolute safety/);
  const conflict = await verifySingleUrl('https://conflict.test/');
  assert.equal(conflict.verdict, 'CONFLICTING');
  assert.equal(conflict.matchLevel, 'EXACT_HOSTNAME');
  const host = await verifySingleUrl('https://host-only.test/other');
  assert.equal(host.verdict, 'KNOWN_BAD');
  assert.equal(host.matchLevel, 'EXACT_HOSTNAME');
  const domain = await verifySingleUrl('https://sub.parent.test/other');
  assert.equal(domain.verdict, 'KNOWN_BAD');
  assert.equal(domain.matchLevel, 'REGISTRABLE_DOMAIN');
  const unknown = await verifySingleUrl('https://unknown-fixture.test/');
  assert.equal(unknown.verdict, 'NO_LOCAL_MATCH');
  assert.equal(unknown.matched, false);
  assert.match(unknown.explanation, /does not guarantee.*safe/);
  const beforeInvalid = requested.length;
  assert.equal((await verifySingleUrl('ftp://fixture.test/')).verdict, 'INVALID_URL');
  assert.equal(requested.length, beforeInvalid, 'Invalid input must not request shards');

  // Exercise the local UI entrypoint and multi-URL extraction.
  const fallback = await checkLink('https://fixture.test/known?x=1');
  assert.equal(fallback.single.verdict, 'KNOWN_BAD');
  assert.equal(fallback.reports.length, 1);
  const multi = await checkLink('Check https://host-only.test and https://unknown-fixture.test');
  assert.equal(multi.reports.length, 2);
  assert.deepEqual(multi.reports.map(report => report.verdict), ['KNOWN_BAD', 'NO_LOCAL_MATCH']);
  assert.equal((await checkLink('https://conflict.test/')).single.verdict, 'CONFLICTING');
  await assert.rejects(checkLink('  '), /valid URL/);
  assert.deepEqual(unexpected, [], 'No destination/provider/other requests permitted');
  assert.ok(requested.some(path => path.startsWith('/urldataIndex/shard_')));
  console.log('Current link-client regression entrypoint passed: normalization, strict SSRF, deterministic dataset verdicts and local UI lookup; zero live requests');
} finally {
  globalThis.fetch = originalFetch;
}
