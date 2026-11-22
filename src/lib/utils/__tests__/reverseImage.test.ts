import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prepareReverseImage, validateReverseFile } from '../reverseImage';

test('preparation accepts supported files and rejects empty, oversized and unsupported files', () => {
  for (const type of ['image/png', 'image/jpeg', 'image/webp']) validateReverseFile({ type, size: 1024 });
  for (const file of [{ type: 'image/svg+xml', size: 10 }, { type: 'image/png', size: 0 }, { type: 'image/jpeg', size: 10 * 1024 * 1024 + 1 }]) {
    assert.throws(() => validateReverseFile(file));
  }
});

test('preparation uses a PNG copy and releases source URL on success, decode failure and export failure', async () => {
  const oldImage = Object.getOwnPropertyDescriptor(globalThis, 'Image');
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const create = URL.createObjectURL; const revoke = URL.revokeObjectURL;
  let mode = 'success'; let releases = 0; let format = '';
  class FakeImage {
    naturalWidth = 20; naturalHeight = 10; onload!: () => void; onerror!: () => void;
    set src(_value: string) { queueMicrotask(() => mode === 'decode' ? this.onerror() : this.onload()); }
  }
  URL.createObjectURL = () => 'blob:synthetic'; URL.revokeObjectURL = () => { releases++; };
  Object.defineProperty(globalThis, 'Image', { configurable: true, value: FakeImage });
  Object.defineProperty(globalThis, 'document', { configurable: true, value: { createElement: () => ({
    width: 0, height: 0, getContext: () => ({ drawImage() {} }),
    toBlob(callback: (blob: Blob | null) => void, type: string) { format = type; callback(mode === 'export' ? null : new Blob(['pixels'], { type })); },
  }) } });
  try {
    const source = new File(['original-metadata'], 'private-name.jpg', { type: 'image/jpeg' });
    const prepared = await prepareReverseImage(source);
    assert.equal(prepared.file.name, 'search-image.png');
    assert.equal(prepared.file.type, 'image/png');
    assert.equal(await prepared.file.text(), 'pixels');
    assert.equal(format, 'image/png');
    assert.equal(prepared.width, 20);
    mode = 'decode'; await assert.rejects(prepareReverseImage(source), /Failed to load/);
    mode = 'export'; await assert.rejects(prepareReverseImage(source), /Could not prepare/);
    assert.equal(releases, 3);
  } finally {
    URL.createObjectURL = create; URL.revokeObjectURL = revoke;
    if (oldImage) Object.defineProperty(globalThis, 'Image', oldImage); else Reflect.deleteProperty(globalThis, 'Image');
    if (oldDocument) Object.defineProperty(globalThis, 'document', oldDocument); else Reflect.deleteProperty(globalThis, 'document');
  }
});

test('crop rectangles stay inside the image with a minimum size', async () => {
  const { clampCropRect } = await import('../reverseImage');
  assert.deepEqual(clampCropRect({ x: -10, y: -5, width: 500, height: 500 }, 200, 100), { x: 0, y: 0, width: 200, height: 100 });
  assert.deepEqual(clampCropRect({ x: 195, y: 10, width: 2, height: 2 }, 200, 100), { x: 184, y: 10, width: 16, height: 16 });
});

test('auto-trim removes solid borders and keeps the whole image when there are none', async () => {
  const { findTrimBounds } = await import('../reverseImage');
  const w = 10, h = 8; const px = new Uint8ClampedArray(w * h * 4).fill(255);
  for (let y = 2; y <= 5; y++) for (let x = 3; x <= 7; x++) { const i = (y * w + x) * 4; px[i] = 10; px[i + 1] = 20; px[i + 2] = 30; }
  assert.deepEqual(findTrimBounds(px, w, h), { x: 3, y: 2, width: 5, height: 4 });
  const noisy = new Uint8ClampedArray(w * h * 4); for (let i = 0; i < noisy.length; i += 4) { noisy[i] = (i * 7) % 255; noisy[i + 3] = 255; }
  assert.deepEqual(findTrimBounds(noisy, w, h), { x: 0, y: 0, width: w, height: h });
  const blank = new Uint8ClampedArray(w * h * 4).fill(255);
  assert.deepEqual(findTrimBounds(blank, w, h), { x: 0, y: 0, width: w, height: h });
});
