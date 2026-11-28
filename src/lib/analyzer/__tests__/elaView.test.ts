import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  DEFAULT_ELA_VIEW,
  ELA_VIEW_LIMITS,
  clampElaViewSettings,
  computeElaPixels,
  describeElaView,
  fitElaViewSize,
  isDefaultElaView,
} from '../elaView';

test('defaults match the fixed settings the verdict analysis uses', () => {
  assert.deepEqual(DEFAULT_ELA_VIEW, { quality: 75, scale: 25, overlay: 0 });
  const forensics = readFileSync(new URL('../forensics.ts', import.meta.url), 'utf8');
  assert.match(forensics, /toDataURL\('image\/jpeg', 0\.75\)/);
  assert.match(forensics, /const amplification = 25;/);
  assert.ok(isDefaultElaView(clampElaViewSettings()));
});

test('slider input is clamped, rounded and falls back on junk', () => {
  assert.deepEqual(clampElaViewSettings({ quality: '90', scale: '40', overlay: '50' }), { quality: 90, scale: 40, overlay: 50 });
  assert.deepEqual(clampElaViewSettings({ quality: 5, scale: 500, overlay: -20 }), {
    quality: ELA_VIEW_LIMITS.quality.min,
    scale: ELA_VIEW_LIMITS.scale.max,
    overlay: 0,
  });
  assert.deepEqual(clampElaViewSettings({ quality: 'abc', scale: NaN, overlay: '' }), DEFAULT_ELA_VIEW);
  assert.equal(clampElaViewSettings({ quality: 80.6 }).quality, 81);
  assert.equal(isDefaultElaView({ quality: 75, scale: 25, overlay: 10 }), false);
});

test('identical pictures give a black, opaque map', () => {
  const px = [10, 20, 30, 255, 200, 100, 0, 128];
  assert.deepEqual(Array.from(computeElaPixels(px, px, 25)), [0, 0, 0, 255, 0, 0, 0, 255]);
});

test('differences are multiplied by the scale, absolute, and capped at 255', () => {
  const original = [100, 100, 100, 255, 0, 255, 50, 0];
  const resaved = [102, 97, 100, 255, 30, 0, 50, 0];
  assert.deepEqual(Array.from(computeElaPixels(original, resaved, 10)), [20, 30, 0, 255, 255, 255, 0, 255]);
  // a larger scale never makes any pixel darker
  const low = computeElaPixels(original, resaved, 5);
  const high = computeElaPixels(original, resaved, 60);
  assert.ok(Array.from(low).every((v, i) => high[i] >= v));
});

test('an edited patch stays brighter than its surroundings at every scale', () => {
  // 2 pixels: untouched (diff 1) and pasted (diff 6)
  const original = [50, 50, 50, 255, 50, 50, 50, 255];
  const resaved = [51, 51, 51, 255, 56, 56, 56, 255];
  for (const scale of [5, 25, 40]) {
    const map = computeElaPixels(original, resaved, scale);
    assert.ok(map[4] > map[0], `scale ${scale}`);
  }
});

test('mismatched or non-RGBA buffers are rejected, a bad scale falls back', () => {
  assert.throws(() => computeElaPixels([1, 2, 3, 4], [1, 2, 3, 4, 5, 6, 7, 8], 25));
  assert.throws(() => computeElaPixels([1, 2, 3], [1, 2, 3], 25));
  assert.deepEqual(Array.from(computeElaPixels([10, 0, 0, 255], [11, 0, 0, 255], NaN)), [25, 0, 0, 255]);
});

test('the settings sentence is plain and mentions the overlay only when used', () => {
  assert.equal(
    describeElaView(DEFAULT_ELA_VIEW),
    'Compared with a 75% quality re-save, differences shown 25 times brighter.',
  );
  assert.match(describeElaView({ quality: 90, scale: 40, overlay: 35 }), /original picture laid over at 35%\.$/);
});

test('the workspace wires the three labelled sliders and keeps the limits honest', () => {
  const page = readFileSync(new URL('../../../components/workspaces/ForensicsWorkspace.astro', import.meta.url), 'utf8');
  for (const id of ['ela-quality', 'ela-scale', 'ela-overlay']) {
    assert.match(page, new RegExp(`<label[^>]+for="${id}"`), `label for ${id}`);
    assert.match(page, new RegExp(`<input[^>]+id="${id}"[^>]+type="range"`), `range ${id}`);
  }
  assert.match(page, /id="ela-reset"/);
  assert.match(page, /What it cannot prove/);
  assert.doesNotMatch(page, /100% accurate|proves? (that )?(the|a) (photo|image) (is|was)/i);
});

test('large pictures are scaled down without changing their shape', () => {
  assert.deepEqual(fitElaViewSize(800, 600), { width: 800, height: 600 });
  assert.deepEqual(fitElaViewSize(3200, 1600), { width: 1600, height: 800 });
  assert.deepEqual(fitElaViewSize(1080, 2400), { width: 720, height: 1600 });
  assert.deepEqual(fitElaViewSize(5000, 2), { width: 1600, height: 1 });
});
