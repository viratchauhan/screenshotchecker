import assert from 'node:assert/strict';
import { test } from 'node:test';
import { extractOCRWords, recognizeWithCoordinates } from '../ocrCoordinates';
import type { Page, Worker } from 'tesseract.js';
const box = { x0: 21, y0: 41, x1: 81, y1: 101 };
function page(text = 'hello', boxes: unknown[] = [box]) {
  return { text, confidence: 95, blocks: [{ paragraphs: [{ lines: [{ words: boxes.map(bbox => ({ text: 'hello', bbox })) }] }] }] } as Page;
}
test('nested words map to original pixels with outward rounding and bounds', () => {
  const words = extractOCRWords(page('hello', [box, { x0: -4, y0: -2, x1: 300, y1: 400 }]), { scale: 2, width: 100, height: 150 });
  assert.deepEqual(words.map(w => w.bbox), [{ x0: 10, y0: 20, x1: 41, y1: 51 }, { x0: 0, y0: 0, x1: 100, y1: 150 }]);
});
test('missing, reversed, nonfinite and off-image boxes never invent locations', () => {
  const boxes = [undefined, { ...box, x1: NaN }, { ...box, x1: 0 }, { ...box, x0: 200, x1: 300 }];
  assert.ok(extractOCRWords(page('hello', boxes), { scale: 1, width: 100 }).every(w => w.bbox === undefined));
  assert.equal(extractOCRWords(page(), { scale: 0 })[0].bbox, undefined);
  assert.deepEqual(extractOCRWords({ blocks: null }, { scale: 1 }), []);
});
test('recognition explicitly requests blocks and uses scaled first-pass geometry', async () => {
  const calls: unknown[][] = [];
  const worker = { recognize: async (...args: unknown[]) => { calls.push(args); return { data: page() }; } } as unknown as Worker;
  const result = await recognizeWithCoordinates(worker, 'scaled', { scale: 2 }, 'original');
  assert.deepEqual(calls, [['scaled', {}, { text: true, blocks: true }]]);
  assert.equal(result.words[0].bbox?.x0, 10);
});
test('fallback requests blocks and resets scale only when its result is selected', async () => {
  for (const retryText of ['hello', '']) {
    const calls: unknown[][] = [];
    const first = page('');
    const retry = page(retryText);
    const worker = { recognize: async (...args: unknown[]) => { calls.push(args); return { data: calls.length === 1 ? first : retry }; } } as unknown as Worker;
    const result = await recognizeWithCoordinates(worker, 'scaled', { scale: 3 }, 'original');
    assert.deepEqual(calls[1], ['original', {}, { text: true, blocks: true }]);
    assert.equal(result.data, retryText ? retry : first);
    assert.equal(result.words[0].bbox?.x0, retryText ? 21 : 7);
  }
});
