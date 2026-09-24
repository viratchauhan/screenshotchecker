import fs from 'node:fs';
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
