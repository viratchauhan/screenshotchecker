import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const distDir = path.resolve(process.argv[2] || 'dist');

function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findHtmlFiles(fullPath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const htmlFiles = findHtmlFiles(distDir);
console.log(`Found ${htmlFiles.length} HTML files in dist/\n`);

const results = [];
let errorCount = htmlFiles.length ? 0 : 1;
let warnCount = 0;

for (const filePath of htmlFiles) {
  const relPath = path.relative(distDir, filePath).replace(/\\/g, '/');
  const html = fs.readFileSync(filePath, 'utf-8');

  // Title
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Meta Description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content="([^"]*)"/i) ||
                    html.match(/<meta\s+name=["']description["']\s+content='([^']*)'/i) ||
                    html.match(/<meta\s+content="([^"]*)"\s+name=["']description["']/i) ||
                    html.match(/<meta\s+content='([^']*)'\s+name=["']description["']/i);
  const description = descMatch ? descMatch[1].trim() : '';

  // Canonical
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i) ||
                        html.match(/<link\s+href=["']([^"']*)["']\s+rel=["']canonical["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : '';

  // Robots
  const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i);
  const robots = robotsMatch ? robotsMatch[1].trim() : 'index, follow';

  // JSON-LD Structured Data
  const jsonLdMatches = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  const schemas = [];
  for (const match of jsonLdMatches) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed['@graph']) {
        schemas.push(...parsed['@graph'].map((s) => s['@type']));
      } else if (Array.isArray(parsed)) {
        schemas.push(...parsed.map((s) => s['@type']));
      } else if (parsed['@type']) {
        schemas.push(parsed['@type']);
      }
    } catch (e) {
      schemas.push('JSON_PARSE_ERROR');
      errorCount++;
    }
  }

  // FAQs check (<details> and <summary>)
  const detailsCount = (html.match(/<details/gi) || []).length;
  const summaryCount = (html.match(/<summary/gi) || []).length;

  const isErrorPage = relPath === '404.html' || relPath === '500.html';

  const row = {
    file: relPath,
    titleLen: title.length,
    title,
    descLen: description.length,
    description,
    canonical,
    robots,
    schemas: [...new Set(schemas)].join(', '),
    faqCount: detailsCount,
  };

  // Validations
  const issues = [];
  if (!title) issues.push('Missing Title');
  else if (title.length > 60 && !isErrorPage) {
    issues.push(`Title > 60 chars (${title.length})`);
    warnCount++;
  }

  if (!description && !isErrorPage) issues.push('Missing Description');
  else if (description.length > 160 && !isErrorPage) {
    issues.push(`Description > 160 chars (${description.length})`);
    warnCount++;
  }

  if (!canonical && !isErrorPage) issues.push('Missing Canonical');
  if (isErrorPage && !robots.includes('noindex')) issues.push('Error page missing noindex');

  errorCount += issues.filter(issue => !issue.includes(' > ')).length;
  const dom = new JSDOM(html).window.document;
  if (!isErrorPage) {
    const route = relPath === 'index.html' ? '/' : '/' + relPath.replace(/index\.html$/, '');
    if (canonical !== `https://screenshotchecker.com${route}`) { issues.push('Canonical does not match published route'); errorCount++; }
    if (dom.querySelectorAll('h1').length !== 1) { issues.push('Expected exactly one H1'); errorCount++; }
    if (robots.includes('noindex')) { issues.push('Published page unexpectedly noindex'); errorCount++; }
  }
  row.issues = issues;
  results.push(row);
}

// Check that each indexable route is listed once and only canonical routes are listed.
try {
  const sitemap = new JSDOM(fs.readFileSync(path.join(distDir, 'sitemap-0.xml'), 'utf8'), { contentType: 'text/xml' }).window.document;
  const urls = [...sitemap.querySelectorAll('url > loc')].map(node => node.textContent);
  const expected = results.filter(row => !['404.html', '500.html'].includes(row.file)).map(row => row.canonical);
  if (new Set(urls).size !== urls.length) { console.error('Duplicate sitemap URLs'); errorCount++; }
  for (const url of expected) if (!urls.includes(url)) { console.error('Missing sitemap URL:', url); errorCount++; }
  for (const url of urls) if (!expected.includes(url)) { console.error('Unexpected sitemap URL:', url); errorCount++; }
  for (const field of ['title', 'description']) {
    const seen = new Set();
    for (const row of results.filter(row => !['404.html', '500.html'].includes(row.file))) {
      if (seen.has(row[field])) { console.error(`Duplicate ${field}: ${row.file}`); errorCount++; }
      seen.add(row[field]);
    }
  }
} catch (error) { console.error('Sitemap validation failed:', error.message); errorCount++; }

// Verify the generated payment landing copy and its shared FAQ/card source.
// Keep these checks scoped to marketing sections, not unrelated runtime reports.
try {
  const payment = new JSDOM(fs.readFileSync(path.join(distDir, 'payment-screenshot-checker/index.html'), 'utf8')).window.document;
  const norm = text => text.replace(/\s+/g, ' ').trim();
  const schemas = [...payment.querySelectorAll('script[type="application/ld+json"]')]
    .flatMap(script => { const data = JSON.parse(script.textContent); return data['@graph'] || [data]; });
  const app = schemas.find(schema => schema['@type'] === 'WebApplication');
  assert.equal(app.description, payment.querySelector('meta[name="description"]').content, 'payment metadata/schema description parity');
  assert.match(app.description, /OCR-based checks/);
  assert.match(app.description, /your own bank records/);
  assert.match(payment.querySelector('h1').closest('section').textContent, /cannot prove an image is genuine/);

  const samples = [...payment.querySelectorAll('button.payment-sample-btn')];
  assert.deepEqual(samples.map(button => button.dataset.sampleId), ['fake_phonepe_sample', 'canara_bank_balance'], 'payment sample IDs');
  assert.deepEqual(samples.map(button => norm(button.textContent)), [
    'Fictional PhonePe-style ₹500 receipt',
    'Fictional Canara-style balance screen',
  ], 'payment fictional sample labels');
  const notice = payment.querySelector('#payment-pre-analysis-modal');
  assert.equal(notice.getAttribute('role'), 'dialog', 'payment notice dialog remains present');
  assert.match(norm(notice.textContent), /OCR\/text-rule clues cannot establish authenticity or bank settlement/);
  assert.match(norm(notice.textContent), /Fonts, icons and layout are not measured/);
  assert.match(norm(notice.textContent), /Financial screenshots are processed locally in your browser/);
  assert.doesNotMatch(norm(notice.textContent), /detects graphic tampering|100% Client-Side|never leave your device/);
  for (const id of ['close-payment-modal-btn', 'dismiss-payment-modal-btn', 'accept-payment-modal-btn']) {
    assert.equal(notice.querySelector(`#${id}`).tagName, 'BUTTON', `payment notice control: ${id}`);
  }

  const faqSchema = schemas.find(schema => schema['@type'] === 'FAQPage');
  const visibleFaqs = [...payment.querySelectorAll('#tool-faq-accordion details')];
  assert.equal(visibleFaqs.length, 10, 'payment visible FAQ count');
  assert.equal(faqSchema.mainEntity.length, visibleFaqs.length, 'payment schema FAQ count');
  for (const [index, faq] of visibleFaqs.entries()) {
    assert.equal(norm(faq.querySelector('summary').textContent), faqSchema.mainEntity[index].name, 'payment FAQ question parity');
    assert.equal(norm(faq.querySelector('.tool-faq-answer').textContent), faqSchema.mainEntity[index].acceptedAnswer.text, 'payment FAQ answer parity');
  }
  const faqText = visibleFaqs.map(faq => norm(faq.textContent)).join(' ');
  for (const phrase of [
    'does not measure fonts, icons or layout',
    'Reference labels and formats can differ',
    'digit count alone is not an authenticity test',
    'without proving that the image was forged',
    'capture time can differ from payment time',
    'missing SMS or soundbox alert alone does not establish a fake',
    'not calibrated accuracy or fraud probabilities',
    'incomplete or unreadable check is not a clean result',
  ]) assert.ok(faqText.includes(phrase), `payment FAQ limit: ${phrase}`);

  const sections = [...payment.querySelectorAll('main > section')];
  const section = heading => sections.find(node => [...node.querySelectorAll('h2, h3')].some(h => norm(h.textContent) === heading));
  const reviewText = norm(section('Review Payment Screenshot Clues').textContent);
  assert.match(reviewText, /fee or balance may legitimately differ/);
  assert.match(reviewText, /amount-rule warning does not establish that pixels were edited/);
  assert.match(reviewText, /A plausible reference can be copied/);
  const workflowText = norm(section('How It Works').textContent);
  assert.match(workflowText, /Fonts, icon positions and layout alignment are not measured/);
  assert.match(workflowText, /No checker result confirms receipt of funds/);
  const limits = section('Technical Limitations & Essential Guidance');
  assert.match(norm(limits.textContent), /STRONG VISUAL cannot establish that you received a payment/);
  for (const url of [
    'https://support.google.com/pay/india/answer/16919844?hl=en',
    'https://www.phonepe.com/blog/trust-and-safety/heres-a-quick-guide-to-help-you-avoid-becoming-a-victim-of-fake-payment-screenshots-2/',
  ]) assert.ok([...limits.querySelectorAll('a')].some(link => link.href === url), `payment primary-source link: ${url}`);
  assert.doesNotMatch([app.description, faqText, reviewText, workflowText].join(' '), /Google Sans patterns|typography mismatches|font alignment anomalies|inspects font families|known fake APK patterns|every genuine Indian UPI transfer|non-12-digit UTR|standard 12-digit numeric/i);

  const guide = new JSDOM(fs.readFileSync(path.join(distDir, 'blog/fake-upi-payment-screenshot/index.html'), 'utf8')).window.document;
  const toolsHeading = [...guide.querySelectorAll('section h3')].find(heading => norm(heading.textContent) === 'Recommended Investigation Tools');
  assert.ok(toolsHeading?.nextElementSibling?.classList.contains('grid'), 'UPI guide contextual tools grid');
  const paymentCards = [...toolsHeading.nextElementSibling.querySelectorAll(':scope > a.feature-card')].filter(link => link.getAttribute('href')?.replace(/\/$/, '') === '/payment-screenshot-checker');
  assert.equal(paymentCards.length, 1, 'one contextual payment card on UPI guide');
  const cardText = norm(paymentCards[0].textContent);
  assert.match(cardText, /Review UPI receipt text with OCR-based rules/);
  assert.match(cardText, /confirm the claimed payment in your own official records/);
  assert.match(cardText, /Review payment receipt text/);
  assert.doesNotMatch(cardText, /PayPal|font alignment|layout|Verify payment receipt/);
  console.log('PASS payment landing: OCR limits, benign controls, primary sources, FAQ/schema parity and shared card');
} catch (error) {
  console.error('Payment landing copy validation failed:', error.message);
  errorCount++;
}

// Print report
console.log('='.repeat(100));
console.log('AUDIT REPORT SUMMARY:');
console.log('='.repeat(100));

for (const r of results) {
  console.log(`\nFile: /${r.file}`);
  console.log(`  Title (${r.titleLen} chars): "${r.title}"`);
  console.log(`  Desc  (${r.descLen} chars): "${r.description.slice(0, 80)}${r.descLen > 80 ? '...' : ''}"`);
  console.log(`  Canonical: ${r.canonical}`);
  console.log(`  Robots: ${r.robots}`);
  console.log(`  Schemas: [${r.schemas}]`);
  if (r.faqCount > 0) console.log(`  Semantic FAQs: ${r.faqCount} <details> elements`);
  if (r.issues.length > 0) {
    console.log(`  ⚠ ISSUES: ${r.issues.join(' | ')}`);
  }
}

console.log('\n' + '='.repeat(100));
console.log(`Total Pages: ${results.length} | Errors: ${errorCount} | Warnings: ${warnCount}`);
console.log('='.repeat(100));

// Check sitemap
const sitemapIndex = path.join(distDir, 'sitemap-index.xml');
const sitemapXml = path.join(distDir, 'sitemap.xml');
console.log('\nSitemap checks:');
console.log('sitemap-index.xml exists:', fs.existsSync(sitemapIndex));
console.log('sitemap.xml exists:', fs.existsSync(sitemapXml));
if (fs.existsSync(sitemapXml)) {
  const content = fs.readFileSync(sitemapXml, 'utf-8');
  console.log('sitemap.xml size:', content.length, 'bytes');
  console.log('sitemap.xml first 200 chars:', content.slice(0, 200).replace(/\n/g, ' '));
}

process.exitCode = errorCount ? 1 : 0;
