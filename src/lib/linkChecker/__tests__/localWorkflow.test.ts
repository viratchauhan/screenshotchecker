import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { JSDOM } from 'jsdom';
import { checkLink } from '../client';

// Execute the unchanged production workspace script in a synthetic DOM. No page
// resources, analytics, clipboard or destination requests are loaded by jsdom.
const source = readFileSync(new URL('../../../components/workspaces/LinkCheckerWorkspace.astro', import.meta.url), 'utf8');
const script = source.split('<script>')[1].split('</script>')[0].replace(/^\s*import .*;$/gm, '');
const ids = [...source.matchAll(/\bid="([\w-]+)"/g)].map(match => match[1]);
const dom = new JSDOM(ids.map(id => {
  const tag = id === 'link-checker-form' ? 'form' : id === 'url-input' ? 'textarea' : id.endsWith('-btn') ? 'button' : 'div';
  return `<${tag} id="${id}" class="hidden"></${tag}>`;
}).join(''), { url: 'https://workspace.invalid/', runScripts: 'outside-only' });
const { window } = dom;
window.HTMLElement.prototype.scrollIntoView = () => {};
let fail = true;
let throwCheck = false;
const requests: { path: string; init?: RequestInit }[] = [];
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  requests.push({ path: String(input), init });
  if (fail) throw new Error('Synthetic outage');
  return Response.json({ urls: {}, hosts: { 'conflict.invalid': 'conflict' }, domains: {} });
};
const key = 'screenshotchecker_local_url_history_v1';
const element = (id: string) => window.document.getElementById(id)!;
const history = () => JSON.parse(window.localStorage.getItem(key) || '[]');
try {
  (window as any).checkLink = async (input: string) => {
    if (throwCheck) throw new Error('Synthetic check failure');
    return checkLink(input);
  };
  window.eval(stripTypeScriptTypes(script) + '\nwindow.runFixture = runVerification;');
  const run = (input: string) => (window as any).runFixture(input);
  await run('https://retry.invalid/');
  assert.equal(element('verdict-heading').textContent, 'Local Dataset Unavailable');
  assert.equal(history()[0].verdict, 'DATASET_UNAVAILABLE');
  assert.equal((element('check-link-btn') as HTMLButtonElement).disabled, false);
  fail = false;
  await run('https://retry.invalid/');
  assert.equal(history().length, 1, 'Recheck replaces duplicate history');
  assert.equal(history()[0].verdict, 'NO_LOCAL_MATCH');
  await run('Synthetic message https://conflict.invalid/ and https://second.invalid/');
  assert.equal(element('multi-url-buttons').children.length, 2);
  assert.equal(element('verdict-heading').textContent, 'Conflicting Local Data');
  (element('multi-url-buttons').children[1] as HTMLElement).click();
  assert.equal(element('verdict-heading').textContent, 'No Local Match');
  assert.equal(history()[0].url, 'https://conflict.invalid/', 'Only first result enters history, as before');
  for (let i = 0; i < 11; i++) await run(`https://history-${i}.invalid/`);
  assert.equal(history().length, 10);
  assert.equal(history()[0].url, 'https://history-10.invalid/');
  const input = element('url-input') as HTMLTextAreaElement;
  input.value = '  https://form-fixture.invalid/  ';
  element('link-checker-form').dispatchEvent(new window.Event('submit', { cancelable: true }));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(history()[0].url, 'https://form-fixture.invalid/');
  const recheck = window.document.querySelector('.recheck-history-btn') as HTMLElement;
  recheck.click();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(input.value, 'https://form-fixture.invalid/');
  assert.equal(history().length, 10);
  const saved = window.localStorage.getItem(key);
  throwCheck = true;
  await run('https://error.invalid/');
  assert.equal(element('error-state').classList.contains('hidden'), false);
  assert.equal((element('check-link-btn') as HTMLButtonElement).disabled, false);
  assert.equal(window.localStorage.getItem(key), saved);
  throwCheck = false;
  await run('https://recovered.invalid/');
  assert.equal(element('error-state').classList.contains('hidden'), true);
  element('clear-history-btn').click();
  assert.equal(window.localStorage.getItem(key), null);
  assert.equal(element('history-section').classList.contains('hidden'), true);
  for (const request of requests) {
    assert.match(request.path, /^\/urldataIndex\/shard_[0-9a-f]{2}\.json$/);
    assert.equal(request.init, undefined, 'No submitted text in request options');
  }
  console.log('Local workspace: unavailable/retry, conflict, picker, form/recheck, deduplication, ten-item history, error recovery and Clear History pass; intercepted shards only');
} finally {
  globalThis.fetch = originalFetch;
  dom.window.close();
}
