import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getAllArticles, getArticleBySlug } from '../../../data/blogArticles';

const article = getArticleBySlug('exif-metadata')!;
const text = JSON.stringify(article);
const read = (path: string) => readFileSync(new URL(`../../../../${path}`, import.meta.url), 'utf8');

test('EXIF guide keeps its existing identity and provides task-specific next steps', () => {
  assert.equal(getAllArticles().filter(value => value.slug === 'exif-metadata').length, 1);
  assert.equal(article.publishedAt, '2026-08-22', 'Historical publication date is preserved');
  assert.equal(article.authorName, 'ScreenshotChecker');
  assert.equal(article.cta.url, '/screenshot-metadata-checker/');
  assert.deepEqual(article.peopleAlsoSearch, [], 'No keyword-only block');
  for (const path of ['/screenshot-metadata-checker/', '/image-metadata-remover/', '/blog/redact-screenshot-before-sharing/', '/privacy/']) {
    assert.ok(text.includes(`href=\\"${path}\\"`), `Contextual link: ${path}`);
  }
  assert.ok(article.relatedSlugs.includes('redact-screenshot-before-sharing'));
  const controls = read('src/components/workspaces/MetadataWorkspace.astro');
  for (const label of ['Select Image to Inspect', 'Strip &amp; Clean Image', 'Change Image']) {
    assert.ok(controls.includes(label.replace('&amp;', '&')), `Existing workspace control: ${label}`);
    assert.ok(text.includes(label), `Guide names control: ${label}`);
  }
  assert.equal(article.contentSections.find(section => section.heading === 'EXIF is only one part of image privacy')?.checklist?.length, 3);
  assert.equal(article.contentSections.find(section => section.heading === 'Before sharing a photo or screenshot')?.checklist?.length, 5);
});

test('EXIF guide distinguishes metadata, pixels and uncertain results without universal stripping claims', () => {
  for (const phrase of [
    'Embedded metadata:', 'Visible pixels:', 'Information outside the file:',
    'PNG is not a metadata-free format', 'format capabilities',
    'Missing parser data is not proof that all metadata is absent',
    'absent, unsupported or fails to parse',
    'does not mean the whole website makes no network requests',
    'not an EXIF-removal test', 'nor a test of the metadata remover’s export path',
    'does not certify the current stripping behavior', 'exact saved file',
  ]) assert.ok(text.includes(phrase), `Evidence boundary: ${phrase}`);
  for (const url of [
    'https://www.w3.org/TR/png-3/#11eXIf',
    'https://www.w3.org/TR/png-3/#11textinfo',
    'https://developer.android.com/reference/androidx/exifinterface/media/ExifInterface',
    'https://support.apple.com/guide/personal-safety/manage-location-metadata-in-photos-ips0d7a5df82/web',
  ]) assert.ok(text.includes(url), `Primary source: ${url}`);
  assert.ok(!text.includes('automatically strip EXIF metadata during compression'));
  assert.ok(!text.includes('so they lack camera hardware, lens, and GPS metadata'));
  assert.ok(!text.includes('Every time you take a picture'));
  assert.equal(article.faq.length, 6);
});
