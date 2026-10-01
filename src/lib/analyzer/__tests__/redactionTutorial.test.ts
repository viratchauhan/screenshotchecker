import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { getArticleBySlug, getAllArticles } from '../../../data/blogArticles';

const article = getArticleBySlug('redact-screenshot-before-sharing')!;
const hashes = {
  'synthetic-redaction-before.png': 'b91b35abef4d8e731c67321da0dbb755523c6287bc2bad17512a2d629b12057a',
  'synthetic-redaction-after.png': '9bf4e45286df5d6a3c99dbd3b5efbeb1c892de0c263b053b5c40c74a1568755e',
};
const read = (path: string) => readFileSync(new URL(`../../../../${path}`, import.meta.url));

test('one distinct redaction tutorial preserves the supplied example bytes and PNG metadata', () => {
  assert.equal(getAllArticles().filter(a => a.slug === article.slug).length, 1);
  const figures = article.contentSections.flatMap(section => section.figure ? [section.figure] : []);
  assert.equal(figures.length, 2);
  for (const figure of figures) {
    const filename = figure.src.split('/').at(-1)! as keyof typeof hashes;
    const bytes = read(`public${figure.src}`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), hashes[filename], `${filename}: exact inspected artifact`);
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(bytes.readUInt32BE(16), figure.width);
    assert.equal(bytes.readUInt32BE(20), figure.height);
    assert.deepEqual([figure.width, figure.height], [1200, 500]);
    const chunks: { type: string; data: Buffer }[] = [];
    for (let offset = 8; offset < bytes.length;) {
      const length = bytes.readUInt32BE(offset);
      chunks.push({ type: bytes.toString('ascii', offset + 4, offset + 8), data: bytes.subarray(offset + 8, offset + 8 + length) });
      offset += length + 12;
    }
    assert.ok(!chunks.some(chunk => chunk.type === 'eXIf'), 'Example is not an EXIF-removal test');
    if (filename.includes('before')) {
      assert.ok(chunks.some(chunk => chunk.type === 'tEXt' && chunk.data.toString().startsWith('Comment\0')), 'Deliberate fictional Comment marker retained');
    } else {
      assert.ok(chunks.every(chunk => ['IHDR', 'IDAT', 'IEND'].includes(chunk.type)), 'Supplied output contains only image chunks');
    }
    assert.ok(figure.alt.length > 30);
    assert.match(figure.caption, /^Figure [12]\./);
  }
  for (const section of article.contentSections.filter(section => section.figure)) {
    assert.ok(Number.isInteger(section.figure!.afterParagraph));
    assert.ok(section.figure!.afterParagraph >= 0 && section.figure!.afterParagraph < section.paragraphs.length);
  }
});

test('tutorial retains careful evidence boundaries, matching controls and contextual links', () => {
  assert.equal(article.authorName, 'ScreenshotChecker');
  const controls = read('src/components/workspaces/RedactorWorkspace.astro').toString()
    + read('src/lib/utils/redactionInput.ts').toString();
  for (const label of ['Select Image to Redact', 'Blackout', 'Whiteout', 'Add mask', 'Auto-Mask All', 'Export Clean PNG', 'Undo']) {
    assert.ok(controls.includes(label), `Documented control exists: ${label}`);
  }
  assert.equal(article.updatedAt, undefined, 'No invented substantive-update date');
  const text = JSON.stringify(article);
  for (const phrase of ['Select Image to Redact', 'Blackout', 'Whiteout', 'Add mask', 'Auto-Mask All', 'Export Clean PNG',
    'not an EXIF-removal test', 'session storage', 'does not mean that the entire website makes no network requests',
    'do not establish performance for every image', 'not a customer screenshot']) assert.ok(text.includes(phrase), phrase);
  assert.ok(text.includes('/screenshot-redactor/'));
  assert.ok(text.includes('/blog/screenshot-checker-online/'));
  assert.ok(text.includes('/privacy/'));
  assert.equal(article.contentSections.find(section => section.heading === 'Before you share')?.checklist?.length, 5);
  assert.equal(article.faq.length, 5);
  assert.ok(getArticleBySlug('screenshot-checker-online')!.contentSections.some(section => section.paragraphs.some(p => p.includes(`/blog/${article.slug}/`))));
  assert.match(read('src/components/RelatedLinks.astro').toString(), /'screenshot-redactor': \['redact-screenshot-before-sharing', 'exif-metadata'\]/);
});
