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
