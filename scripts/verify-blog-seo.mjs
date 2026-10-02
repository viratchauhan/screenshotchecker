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

// Task 17 EXIF slice: validate the built article and both direct workflow targets.
const exif = getAllArticles().find(article => article.slug === 'exif-metadata');
const exifDoc = new JSDOM(read(`blog/${exif.slug}/index.html`)).window.document;
const exifSchemas = [...exifDoc.querySelectorAll('script[type="application/ld+json"]')]
  .flatMap(script => { const value = JSON.parse(script.textContent); return value['@graph'] || [value]; });
const exifFAQ = exifSchemas.find(value => value['@type'] === 'FAQPage');
assert.equal(exifFAQ.mainEntity.length, exif.faq.length);
for (const [index, faq] of exif.faq.entries()) {
  assert.equal(exifFAQ.mainEntity[index].name, faq.question);
  assert.equal(exifFAQ.mainEntity[index].acceptedAnswer.text, faq.answer);
  const heading = [...exifDoc.querySelectorAll('h3')].find(node => node.textContent.trim() === faq.question);
  assert.equal(heading?.nextElementSibling?.textContent.trim(), faq.answer, 'EXIF visible FAQ matches structured answer');
}
assert.equal(exifSchemas.find(value => value['@type'] === 'BlogPosting').author.name, exif.authorName);
assert.equal(exifDoc.querySelector('[rel="author"]')?.textContent.trim(), exif.authorName);
assert.equal(exifDoc.querySelector('title').textContent, exif.seoTitle);
assert.equal(exifDoc.querySelector('meta[name="description"]').content, exif.metaDescription);
assert.equal(exif.publishedAt, '2026-08-22', 'EXIF historical publication date retained');
const exifText = exifDoc.querySelector('main').textContent.replace(/\s+/g, ' ');
for (const phrase of ['Embedded metadata:', 'Visible pixels:', 'Information outside the file:',
  'Missing parser data is not proof that all metadata is absent', 'not an EXIF-removal test',
  'nor a test of the metadata remover’s export path', 'does not certify the current stripping behavior']) {
  assert.ok(exifText.includes(phrase), `EXIF built evidence boundary: ${phrase}`);
}
assert.ok(!exifText.includes('People Also Search For'), 'EXIF keyword-only block is absent');
assert.equal(exifDoc.querySelectorAll('.article-checklist li').length, 8);
for (const path of ['/screenshot-metadata-checker/', '/image-metadata-remover/', '/blog/redact-screenshot-before-sharing/', '/privacy/']) {
  assert.ok(exifDoc.querySelector(`main a[href="${path}"]`), `EXIF contextual link: ${path}`);
}
assert.ok([...exifDoc.querySelectorAll('main a[href]')].some(link =>
  link.querySelector('span')?.textContent.trim() === exif.cta.label && link.getAttribute('href') === exif.cta.url), 'EXIF CTA goes directly to inspector');
for (const link of exifDoc.querySelectorAll('main a[href^="/"]')) {
  const pathname = link.getAttribute('href').split(/[?#]/)[0].replace(/^\//, '').replace(/\/$/, '');
  assert.doesNotThrow(() => read(pathname ? `${pathname}/index.html` : 'index.html'), `EXIF internal link resolves: ${pathname}`);
}
for (const host of ['www.w3.org', 'developer.android.com', 'support.apple.com']) {
  assert.ok([...exifDoc.querySelectorAll('main a[href]')].some(link => link.hostname === host), `EXIF primary source linked: ${host}`);
}
console.log('PASS EXIF guide: FAQ/byline parity, privacy boundaries, checklist, primary sources and direct workflow links');

// Task 17 discovery slice: inspect only the contextual card grid. Header/footer
// navigation and article-body links must not mask a fallback to unrelated cards.
function assertRelatedCards(doc, headingText, expectedPaths, label) {
  const headings = [...doc.querySelectorAll('section h3')]
    .filter(heading => heading.textContent.trim() === headingText);
  assert.equal(headings.length, 1, `${label}: one contextual card heading`);
  const grid = headings[0].nextElementSibling;
  assert.ok(grid?.classList.contains('grid'), `${label}: contextual card grid exists`);
  const cards = [...grid.querySelectorAll(':scope > a.feature-card')];
  assert.deepEqual(cards.map(card => card.getAttribute('href').replace(/\/$/, '')),
    expectedPaths, `${label}: exact contextual card targets and order`);
  for (const card of cards) {
    assert.ok(card.querySelector('h4')?.textContent.trim(), `${label}: named card`);
    const pathname = card.getAttribute('href').replace(/^\//, '').replace(/\/$/, '');
    assert.doesNotThrow(() => read(`${pathname}/index.html`), `${label}: card target resolves: ${pathname}`);
  }
}

const toolsHeading = 'Recommended Investigation Tools';
const articlesHeading = 'Related Forensic & Verification Guides';
assertRelatedCards(exifDoc, toolsHeading,
  ['/screenshot-metadata-checker', '/image-metadata-remover', '/screenshot-redactor'], 'EXIF guide tools');
assertRelatedCards(redactionDoc, toolsHeading,
  ['/screenshot-redactor', '/screenshot-metadata-checker', '/image-metadata-remover'], 'Redaction guide tools');
for (const path of ['screenshot-privacy-checker', 'screenshot-redactor']) {
  const doc = new JSDOM(read(`${path}/index.html`)).window.document;
  assertRelatedCards(doc, articlesHeading,
    ['/blog/redact-screenshot-before-sharing', '/blog/exif-metadata'], `${path} guides`);
}
console.log('PASS privacy discovery: exact contextual tool/guide cards, retained redactor guides and resolved targets');

// UPI guide correction: protect bank-first verification and honest text-rule limits
// in the generated page, including the same visible and structured FAQ answers.
const upi = getAllArticles().find(article => article.slug === 'fake-upi-payment-screenshot');
const upiDoc = new JSDOM(read(`blog/${upi.slug}/index.html`)).window.document;
const upiText = upiDoc.querySelector('main').textContent.replace(/\s+/g, ' ');
const upiSchemas = [...upiDoc.querySelectorAll('script[type="application/ld+json"]')]
  .flatMap(script => { const value = JSON.parse(script.textContent); return value['@graph'] || [value]; });
const upiFAQ = upiSchemas.find(value => value['@type'] === 'FAQPage');
assert.equal(upiFAQ.mainEntity.length, 6, 'UPI: six substantive FAQ answers');
assert.equal(upiFAQ.mainEntity.length, upi.faq.length);
for (const [index, faq] of upi.faq.entries()) {
  assert.equal(upiFAQ.mainEntity[index].name, faq.question);
  assert.equal(upiFAQ.mainEntity[index].acceptedAnswer.text, faq.answer);
  const headings = [...upiDoc.querySelectorAll('h3')].filter(node => node.textContent.trim() === faq.question);
  assert.equal(headings.length, 1, 'UPI: one visible heading per FAQ');
  assert.equal(headings[0].nextElementSibling?.textContent.trim(), faq.answer, 'UPI: visible/schema FAQ parity');
}
assert.equal(upi.publishedAt, '2026-08-22', 'UPI: original publication date retained');
assert.equal(upi.updatedAt, '2026-10-02', 'UPI: substantive correction date');
assert.equal(upi.title, 'Fake UPI Payment Screenshot: How to Check If a Payment Is Real');
assert.equal(upiDoc.querySelector('title').textContent, 'Fake UPI Payment Screenshots: Checks and Warning Signs');
assert.equal(upiDoc.querySelector('meta[name="description"]').content,
  'Review warning signs in UPI payment screenshots and learn why confirming the transaction in your own bank or payment app matters more than an image.');
assert.equal(upiSchemas.find(value => value['@type'] === 'BlogPosting').author.name, upi.authorName);
assert.equal(upiDoc.querySelector('[rel="author"]')?.textContent.trim(), upi.authorName);
const upiHeadings = [...upiDoc.querySelectorAll('main h2')].map(node => node.textContent.trim());
const verificationHeading = upiHeadings.indexOf('How to Verify a UPI Payment: Start With Your Own Records');
const toolHeading = upiHeadings.indexOf('What the Payment Screenshot Checker Actually Does');
assert.ok(verificationHeading >= 0 && toolHeading > verificationHeading, 'UPI: verification precedes tool advice');
assert.equal(upiDoc.querySelectorAll('.article-checklist li').length, 5, 'UPI: five verification steps');
for (const phrase of [
  'fictional teaching example, not a real customer case or a checker accuracy test',
  'A seller is waiting for ₹500',
  'amount, payment date, intended recipient and reference',
  'opens their own official payment history and bank records',
  'Outcome A: a matching credit is found.',
  'Outcome B: no matching credit is found.',
  'missing credit alone does not prove that the buyer forged the image',
  'cannot authenticate the displayed balance',
  'Capture time is not payment time',
  'OCR can change the apparent evidence',
  'payment text rules do not measure font families, icon positions, logo accuracy or layout alignment',
  'not calibrated probabilities',
  'not a measurement of visual authenticity or banking settlement',
  'not a universal refund deadline',
]) assert.ok(upiText.includes(phrase), `UPI: built evidence boundary: ${phrase}`);
for (const retiredClaim of [
  'Real Examples:', 'a calibrated verdict', 'catch most template flaws',
  'typically 24 to 48 hours', 'Every genuine UPI transfer',
  'Evaluates Google Sans typography', 'Typography & Font Family Audits',
  'People Also Search For',
]) assert.ok(!upiText.includes(retiredClaim), `UPI: retired claim stays absent: ${retiredClaim}`);
for (const href of [
  'https://www.phonepe.com/blog/trust-and-safety/heres-a-quick-guide-to-help-you-avoid-becoming-a-victim-of-fake-payment-screenshots-2/',
  'https://support.google.com/pay/india/answer/16919844?hl=en',
  'https://support.google.com/pay/india/answer/16920039?hl=en-IN',
  '/payment-screenshot-checker/', '/blog/redact-screenshot-before-sharing/', '/privacy/',
]) assert.ok(upiDoc.querySelector(`main a[href="${href}"]`), `UPI: relevant source/workflow link: ${href}`);
for (const link of upiDoc.querySelectorAll('main a[href^="/"]')) {
  const pathname = link.getAttribute('href').split(/[?#]/)[0].replace(/^\//, '').replace(/\/$/, '');
  assert.doesNotThrow(() => read(pathname ? `${pathname}/index.html` : 'index.html'), `UPI: internal link resolves: ${pathname}`);
}
console.log('PASS UPI guide: preserved snippet/date, FAQ/byline parity, fictional verification example, benign controls, text-rule limits and sources');
