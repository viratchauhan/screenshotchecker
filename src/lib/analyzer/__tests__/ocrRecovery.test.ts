import { test } from 'node:test';
import assert from 'node:assert/strict';
import { imageProcessingScale } from '../imageLimits';
import { retryableCache } from '../retryableCache';
import { runClientOCR } from '../ocr';
import { loadImageFromDataUrl } from '../imageInfo';
import { InvestigationAgent } from '../../ai/investigationAgent';
import { InvestigationToolRegistry } from '../../ai/investigationTools';

test('failed engine initialization can retry and concurrent startup is shared', async () => {
  const get = retryableCache<object>();
  let attempts = 0;
  const create = async () => { if (++attempts === 1) throw new Error('offline'); return {}; };
  const first = get('eng', create);
  assert.equal(get('eng', create), first);
  await assert.rejects(first, /offline/);
  const worker = await get('eng', create);
  assert.equal(await get('eng', create), worker);
  assert.equal(attempts, 2);
  assert.notEqual(await get('fra', create), worker);
});

test('canvas budget rejects invalid dimensions and bounds small and tall image scaling', () => {
  for (const [w, h] of [[0, 1], [NaN, 10], [10.5, 10], [Infinity, 1], [2001, 2000], [8193, 1]]) {
    assert.throws(() => imageProcessingScale(w, h));
  }
  assert.equal(imageProcessingScale(2000, 2000), 1);
  assert.equal(imageProcessingScale(600, 600), 2);
  assert.equal(imageProcessingScale(500, 8000), 1);
  for (const [w, h] of [[1199, 1199], [599, 5000], [300, 1200], [1, 8192]]) {
    const scale = imageProcessingScale(w, h);
    assert.ok(w * h * scale ** 2 <= 4_000_000);
    assert.ok(Math.max(w, h) * scale <= 8192);
  }
});

test('oversized OCR fails explicitly before any canvas allocation, without fallback bypass', async () => {
  class FakeImage { naturalWidth = 4000; naturalHeight = 4000; }
  const names = ['window', 'document', 'HTMLImageElement'];
  const old = names.map(name => Object.getOwnPropertyDescriptor(globalThis, name));
  try {
    Object.defineProperty(globalThis, 'window', { configurable: true, value: {} });
    Object.defineProperty(globalThis, 'HTMLImageElement', { configurable: true, value: FakeImage });
    Object.defineProperty(globalThis, 'document', { configurable: true, value: {
      createElement() { assert.fail('must reject before allocating a canvas'); },
    } });
    await assert.rejects(runClientOCR(new FakeImage() as any), /too large.*retry/);
  } finally {
    names.forEach((name, i) => old[i] ? Object.defineProperty(globalThis, name, old[i]!) : Reflect.deleteProperty(globalThis, name));
  }
});

test('image decode failure rejects instead of waiting forever; oversized images also reject', async () => {
  const old = Object.getOwnPropertyDescriptor(globalThis, 'Image');
  class FakeImage {
    naturalWidth = 5000; naturalHeight = 5000;
    onload: () => void; onerror: () => void;
    set src(value: string) { queueMicrotask(() => value === 'bad' ? this.onerror() : this.onload()); }
  }
  Object.defineProperty(globalThis, 'Image', { configurable: true, value: FakeImage });
  try {
    await assert.rejects(loadImageFromDataUrl('bad'), /Failed to load/);
    await assert.rejects(loadImageFromDataUrl('large'), /too large/);
  } finally {
    if (old) Object.defineProperty(globalThis, 'Image', old);
    else Reflect.deleteProperty(globalThis, 'Image');
  }
});

test('an OCR tool failure stops investigation before a fraud verdict is produced', async () => {
  const oldImage = Object.getOwnPropertyDescriptor(globalThis, 'Image');
  const execute = InvestigationToolRegistry.executeTool;
  class FakeImage {
    naturalWidth = 100; naturalHeight = 100;
    onload: () => void;
    set src(_value: string) { queueMicrotask(() => this.onload()); }
  }
  Object.defineProperty(globalThis, 'Image', { configurable: true, value: FakeImage });
  InvestigationToolRegistry.executeTool = async tool => ({ tool, status: 'failed', summary: 'offline' });
  try {
    const provider = {
      observeImage: async () => ({}),
      planInvestigation: async () => ({ steps: [{ tool: 'ocr_layout', reason: 'read text' }] }),
      reason: async () => assert.fail('must not reason from a failed OCR result'),
    };
    await assert.rejects(new InvestigationAgent(provider as any).investigate(
      { name: 'test.png', size: 100, type: 'image/png' } as File, 'test',
    ), /no fraud verdict was produced/);
  } finally {
    InvestigationToolRegistry.executeTool = execute;
    if (oldImage) Object.defineProperty(globalThis, 'Image', oldImage);
    else Reflect.deleteProperty(globalThis, 'Image');
  }
});
