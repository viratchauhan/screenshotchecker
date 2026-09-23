import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessScreenshotSource, selectSourceMetadata } from '../screenshotSource';
const base = { width: 1080, height: 1920, format: 'image/png', metadataReadable: true, cameraTags: [], software: '' };
test('screen-sized PNG with no EXIF remains inconclusive', () => {
  assert.equal(assessScreenshotSource(base).verdict, 'Inconclusive');
});
test('camera metadata is a clue, not an authenticity verdict', () => {
  const report = assessScreenshotSource({ ...base, cameraTags: ['Make', 'Model'] });
  assert.equal(report.verdict, 'Camera metadata clues found');
  assert.match(report.limitation, /metadata can be changed/);
});
test('capture software is a clue and conflicting fields abstain', () => {
  assert.equal(assessScreenshotSource({ ...base, software: 'Snipping Tool' }).verdict, 'Screen-capture software clue found');
  assert.equal(assessScreenshotSource({ ...base, software: 'Snipping Tool', cameraTags: ['Make', 'Model'] }).verdict, 'Inconclusive');
});
test('unavailable metadata cannot be presented as absent or used for a verdict', () => {
  const report = assessScreenshotSource({ ...base, metadataReadable: false, software: 'screenshot' });
  assert.equal(report.verdict, 'Inconclusive');
  assert.ok(report.signals.some(s => s.includes('could not be read')));
  assert.ok(!report.signals.some(s => s.includes('No supported camera')));
});
test('editor metadata and single camera field are insufficient', () => {
  assert.equal(assessScreenshotSource({ ...base, software: 'Adobe Photoshop', cameraTags: ['Make'] }).verdict, 'Inconclusive');
});
test('metadata selection ignores unrelated fields and bounds external text', () => {
  const tags = selectSourceMetadata({ exif: { Make: {}, Model: {}, GPS: {}, Software: { description: 'x'.repeat(1000) } } });
  assert.deepEqual(tags.cameraTags, ['Make', 'Model']);
  assert.equal(tags.software.length, 240);
  assert.deepEqual(selectSourceMetadata({}), { cameraTags: [], software: '' });
});
