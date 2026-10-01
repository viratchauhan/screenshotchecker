import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { getAllArticles, formatArticleDate } from '../src/data/blogArticles.ts';

// Inspect the actual generated output, not just the input records.
const read = path => readFileSync(new URL(`../dist/${path}`, import.meta.url), 'utf8');
const sitemap = new JSDOM(read('sitemap-0.xml'), { contentType: 'text/xml' }).window.document;
const index = new JSDOM(read('blog/index.html')).window.document;
const titles = new Set();
const descriptions = new Set();
for (const article of getAllArticles()) {
  const doc = new JSDOM(read(`blog/${article.slug}/index.html`)).window.document;
  const canonical = `https://screenshotchecker.com/blog/${article.slug}/`;
  const schemas = [...doc.querySelectorAll('script[type="application/ld+json"]')]
    .flatMap(script => { const value = JSON.parse(script.textContent); return value['@graph'] || [value]; });
  const schema = schemas.find(value => value['@type'] === 'BlogPosting');
  assert.ok(schema, `${article.slug}: BlogPosting exists`);
  assert.equal(schema.datePublished, article.publishedAt || undefined);
  assert.equal(schema.dateModified, article.updatedAt || article.publishedAt || undefined);
  assert.equal(doc.querySelector('link[rel="canonical"]')?.href, canonical);
  assert.equal(doc.querySelectorAll('h1').length, 1);
  assert.equal(doc.querySelector('h1')?.textContent.trim(), article.title);
  for (const date of [article.publishedAt, article.updatedAt].filter(Boolean)) {
    const time = doc.querySelector(`time[datetime="${date}"]`);
    assert.equal(time?.textContent, formatArticleDate(date), `${article.slug}: visible and machine dates agree`);
  }
  const link = [...index.querySelectorAll('a')].find(a => a.getAttribute('href') === `/blog/${article.slug}`);
  assert.ok(link, `${article.slug}: index link`);
  if (article.publishedAt) {
    assert.ok(link.querySelector(`time[datetime="${article.publishedAt}"]`), `${article.slug}: index date`);
  } else {
    assert.match(link.textContent, /Publication pending/, `${article.slug}: honest pending index date`);
    assert.match(doc.querySelector('main header').textContent, /Draft · Publication pending/);
    assert.equal(doc.querySelector('main header time'), null, `${article.slug}: no fabricated visible date`);
  }
  const entry = [...sitemap.querySelectorAll('url')].find(url => url.querySelector('loc')?.textContent === canonical);
  assert.ok(entry, `${article.slug}: sitemap entry`);
  assert.equal(entry.querySelector('lastmod')?.textContent?.slice(0, 10), article.updatedAt || article.publishedAt || undefined);
  const title = doc.querySelector('title')?.textContent;
  const description = doc.querySelector('meta[name="description"]')?.content;
  assert.ok(title && !titles.has(title), `${article.slug}: unique title`);
  assert.ok(description && !descriptions.has(description), `${article.slug}: unique description`);
  titles.add(title); descriptions.add(description);
  console.log(`PASS ${article.slug}: dates, sitemap, schema, canonical, heading, index and snippet metadata`);
}

// B2: inspect the published guide output so visible answers cannot drift from schema.
const analyzer = getAllArticles().find(article => article.slug === 'screenshot-analyzer-online');
const guide = new JSDOM(read(`blog/${analyzer.slug}/index.html`)).window.document;
const guideText = guide.querySelector('main').textContent.replace(/\s+/g, ' ');
const guideSchemas = [...guide.querySelectorAll('script[type="application/ld+json"]')]
  .flatMap(script => { const value = JSON.parse(script.textContent); return value['@graph'] || [value]; });
const guideFAQ = guideSchemas.find(value => value['@type'] === 'FAQPage');
assert.equal(guideFAQ.mainEntity.length, analyzer.faq.length);
for (const [index, faq] of analyzer.faq.entries()) {
  assert.equal(guideFAQ.mainEntity[index].name, faq.question);
  assert.equal(guideFAQ.mainEntity[index].acceptedAnswer.text, faq.answer);
  const heading = [...guide.querySelectorAll('h3')].find(node => node.textContent.trim() === faq.question);
  assert.equal(heading?.nextElementSibling?.textContent.trim(), faq.answer, 'Visible FAQ matches structured answer');
}
assert.equal(guideSchemas.find(value => value['@type'] === 'BlogPosting').author.name, analyzer.authorName);
assert.equal(guide.querySelector('[rel="author"]')?.textContent.trim(), analyzer.authorName);
assert.match(guideText, /synthetic teaching scenarios/);
assert.match(guideText, /failed or unavailable check/i);
assert.ok(!guideText.includes('People Also Search For'), 'No empty keyword block');
assert.ok(!guideText.includes('OCR typography validation'), 'No unsupported font measurement claim');
for (const link of guide.querySelectorAll('main a[href^="/"]')) {
  const pathname = link.getAttribute('href').split(/[?#]/)[0].replace(/^\//, '').replace(/\/$/, '');
  assert.doesNotThrow(() => read(pathname ? `${pathname}/index.html` : 'index.html'), `Internal link resolves: ${pathname}`);
}
for (const host of ['tesseract-ocr.github.io', 'spec.c2pa.org', '29a.ch']) {
  assert.ok([...guide.querySelectorAll('main a[href]')].some(link => link.hostname === host), `Primary source linked: ${host}`);
}
console.log('PASS analyzer guide: visible/schema FAQ and author parity, synthetic labels, source links and internal targets');

// Task 17: check actual article markup, unchanged public assets and incoming links.
const redaction = getAllArticles().find(article => article.slug === 'redact-screenshot-before-sharing');
const redactionDoc = new JSDOM(read(`blog/${redaction.slug}/index.html`)).window.document;
const redactionSchemas = [...redactionDoc.querySelectorAll('script[type="application/ld+json"]')]
  .flatMap(script => { const value = JSON.parse(script.textContent); return value['@graph'] || [value]; });
const redactionFAQ = redactionSchemas.find(value => value['@type'] === 'FAQPage');
assert.equal(redactionFAQ.mainEntity.length, redaction.faq.length);
for (const [index, faq] of redaction.faq.entries()) {
  assert.equal(redactionFAQ.mainEntity[index].name, faq.question);
  assert.equal(redactionFAQ.mainEntity[index].acceptedAnswer.text, faq.answer);
  const heading = [...redactionDoc.querySelectorAll('h3')].find(node => node.textContent.trim() === faq.question);
  assert.equal(heading?.nextElementSibling?.textContent.trim(), faq.answer, 'Redaction visible FAQ matches structured answer');
}
assert.equal(redactionSchemas.find(value => value['@type'] === 'BlogPosting').author.name, redaction.authorName);
assert.equal(redactionDoc.querySelector('[rel="author"]')?.textContent.trim(), redaction.authorName);
assert.equal(redactionDoc.querySelector('title').textContent, redaction.seoTitle);
assert.equal(redactionDoc.querySelector('meta[name="description"]').content, redaction.metaDescription);
const expectedFigures = redaction.contentSections.flatMap(section => section.figure ? [section.figure] : []);
const figures = [...redactionDoc.querySelectorAll('main figure')];
assert.equal(figures.length, 2);
for (const [index, figure] of figures.entries()) {
  const expected = expectedFigures[index];
  const img = figure.querySelector('img');
  assert.equal(img.getAttribute('src'), expected.src);
  assert.equal(img.alt, expected.alt);
  assert.equal(img.width, 1200);
  assert.equal(img.height, 500);
  assert.equal(figure.querySelector('figcaption')?.textContent.trim(), expected.caption);
  assert.deepEqual(readFileSync(new URL(`../dist${expected.src}`, import.meta.url)), readFileSync(new URL(`../public${expected.src}`, import.meta.url)), 'Build preserves PNG bytes and metadata');
}
assert.equal(redactionDoc.querySelectorAll('.article-checklist li').length, 5);
for (const link of redactionDoc.querySelectorAll('main a[href^="/"]')) {
  const pathname = link.getAttribute('href').split(/[?#]/)[0].replace(/^\//, '').replace(/\/$/, '');
  assert.doesNotThrow(() => read(pathname ? `${pathname}/index.html` : 'index.html'), `Redaction internal link resolves: ${pathname}`);
}
for (const path of ['screenshot-redactor', 'blog/screenshot-checker-online']) {
  const doc = new JSDOM(read(`${path}/index.html`)).window.document;
  assert.ok([...doc.querySelectorAll('a[href]')].some(link => link.getAttribute('href').replace(/\/$/, '') === `/blog/${redaction.slug}`), `${path}: contextual tutorial link`);
}
for (const host of ['bishopfox.com', 'tesseract-ocr.github.io', 'www.w3.org']) {
  assert.ok([...redactionDoc.querySelectorAll('main a[href]')].some(link => link.hostname === host), `Redaction primary source linked: ${host}`);
}
console.log('PASS redaction tutorial: FAQ/byline parity, figures/bytes/captions, checklist, source links and contextual internal links');
