import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { getToolFaqs } from '../src/data/toolFaqs.ts';

const load = (route) => new JSDOM(readFileSync(new URL(`../dist/${route}/index.html`, import.meta.url), 'utf8')).window.document;
const normalize = (value) => value.replace(/\s+/g, ' ').trim();
function nodes(value) {
  if (Array.isArray(value)) return value.flatMap(nodes);
  if (!value || typeof value !== 'object') return [];
  return [value, ...Object.values(value).flatMap(nodes)];
}

for (const route of ['screenshot-ocr', 'screenshot-redactor', 'screenshot-privacy-checker', 'suspicious-link-checker']) {
  const document = load(route);
  const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(script => nodes(JSON.parse(script.textContent)));
  const questions = schemas.filter(node => node['@type'] === 'Question');
  for (const faq of getToolFaqs(route)) {
    assert.ok(normalize(document.body.textContent).includes(normalize(faq.answer)), `${route}: visible answer missing`);
    assert.ok(questions.some(q => q.name === faq.question && q.acceptedAnswer?.text === faq.answer), `${route}: FAQ/schema mismatch`);
  }
  console.log(`${route}: visible and structured FAQ parity passes`);
}

const policy = load('privacy');
assert.equal(policy.querySelectorAll('h1').length, 1);
assert.ok(normalize(policy.body.textContent).includes('not a scheduled deletion timer'));
assert.ok(normalize(policy.body.textContent).includes('Google Analytics'));
assert.ok(normalize(policy.body.textContent).includes('does not send the submitted URL or message text'));
assert.equal(policy.querySelector('link[rel="canonical"]').getAttribute('href'), 'https://screenshotchecker.com/privacy/');
console.log('Privacy page disclosure and canonical checks pass');
