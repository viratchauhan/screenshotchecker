import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  DEFAULT_NOISE_AMPLITUDE,
  NOISE_VIEW_LIMITS,
  analyzeNoiseAreas,
  clampNoiseAmplitude,
  describeNoise,
  describeNoiseView,
  medianResidual,
  renderNoisePixels,
  toLuminance,
} from '../noiseView';

/** Small repeatable random numbers, so the fictional pictures are the same on every run. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** A made-up grey surface with even grain of the given strength. */
function grainy(width: number, height: number, strength: number, seed = 7): Float32Array {
  const next = rng(seed);
  const lum = new Float32Array(width * height);
  for (let i = 0; i < lum.length; i++) lum[i] = 120 + (next() - 0.5) * 2 * strength;
  return lum;
}

test('amplitude input is clamped, rounded and falls back on junk', () => {
  assert.equal(clampNoiseAmplitude('30'), 30);
  assert.equal(clampNoiseAmplitude(0), NOISE_VIEW_LIMITS.amplitude.min);
  assert.equal(clampNoiseAmplitude(999), NOISE_VIEW_LIMITS.amplitude.max);
  assert.equal(clampNoiseAmplitude('abc'), DEFAULT_NOISE_AMPLITUDE);
  assert.equal(clampNoiseAmplitude(''), DEFAULT_NOISE_AMPLITUDE);
  assert.equal(clampNoiseAmplitude(12.6), 13);
});

test('brightness uses the usual weights and checks the buffer size', () => {
  const lum = toLuminance([255, 255, 255, 255, 0, 0, 0, 255, 255, 0, 0, 255], 3, 1);
  assert.ok(Math.abs(lum[0] - 255) < 0.01);
  assert.equal(lum[1], 0);
  assert.ok(Math.abs(lum[2] - 76.245) < 0.01);
  assert.throws(() => toLuminance([1, 2, 3], 1, 1));
});

test('a flat surface and a clean step edge leave no residual; one odd pixel does', () => {
  const flat = new Float32Array(25).fill(90);
  assert.ok(medianResidual(flat, 5, 5).every((v) => v === 0));

  // Left half dark, right half bright: the median keeps a straight edge.
  const step = new Float32Array(36);
  for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) step[y * 6 + x] = x < 3 ? 20 : 220;
  assert.ok(medianResidual(step, 6, 6).every((v) => v === 0));

  const speck = new Float32Array(25).fill(90);
  speck[12] = 140;
  const res = medianResidual(speck, 5, 5);
  assert.equal(res[12], 50);
  assert.equal(res.filter((v) => v !== 0).length, 1);
  assert.throws(() => medianResidual(new Float32Array(3), 2, 2));
});

test('the map is grey, opaque, scaled by the amplitude and capped', () => {
  const px = renderNoisePixels([0, -2, 3, 100], 10);
  assert.deepEqual(Array.from(px), [0, 0, 0, 255, 20, 20, 20, 255, 30, 30, 30, 255, 255, 255, 255, 255]);
});

test('even grain: no area stands out', () => {
  const w = 160;
  const h = 120;
  const finding = analyzeNoiseAreas(medianResidual(grainy(w, h, 6), w, h), w, h);
  assert.equal(finding.quiet, false);
  assert.ok(finding.cells.length >= 12);
  assert.equal(finding.smooth.length, 0);
  assert.equal(finding.grainy.length, 0);
  const report = describeNoise(finding);
  assert.match(report.headline, /grain looks alike/);
});

test('a smoothed patch on a grainy surface is reported as much smoother', () => {
  const w = 160;
  const h = 160;
  const lum = grainy(w, h, 6, 11);
  // Fictional airbrushing: one 40 by 40 block painted flat.
  for (let y = 40; y < 80; y++) for (let x = 60; x < 100; x++) lum[y * w + x] = 120;
  const finding = analyzeNoiseAreas(medianResidual(lum, w, h), w, h);
  assert.ok(finding.smooth.length >= 1 && finding.smooth.length <= 6, `smooth areas: ${finding.smooth.length}`);
  assert.equal(finding.grainy.length, 0);
  const report = describeNoise(finding);
  assert.match(report.headline, /much smoother/);
  assert.ok(report.notes.some((n) => /sky/i.test(n) && /airbrushing/i.test(n)), 'names the innocent cause beside the suspicious one');
});

test('a grainy block on a calm surface is reported as much grainier', () => {
  const w = 160;
  const h = 160;
  const lum = grainy(w, h, 2, 3);
  const next = rng(99);
  // Fictional pasted part with far stronger grain.
  for (let y = 80; y < 120; y++) for (let x = 20; x < 60; x++) lum[y * w + x] = 120 + (next() - 0.5) * 60;
  const finding = analyzeNoiseAreas(medianResidual(lum, w, h), w, h);
  assert.ok(finding.grainy.length >= 1 && finding.grainy.length <= 6, `grainy areas: ${finding.grainy.length}`);
  const report = describeNoise(finding);
  assert.match(report.headline, /much grainier/);
});

test('a flat drawn picture is called too quiet, not clean', () => {
  const w = 120;
  const h = 120;
  const lum = new Float32Array(w * h).fill(250);
  for (let y = 30; y < 40; y++) for (let x = 10; x < 110; x++) lum[y * w + x] = 30; // a made-up title bar
  const finding = analyzeNoiseAreas(medianResidual(lum, w, h), w, h);
  assert.equal(finding.quiet, true);
  assert.equal(finding.smooth.length + finding.grainy.length, 0);
  const report = describeNoise(finding);
  assert.match(report.headline, /almost no grain/);
  assert.ok(report.notes.some((n) => /cannot show/.test(n)));
});

test('a tiny picture gets no area comparison', () => {
  const finding = analyzeNoiseAreas(medianResidual(grainy(30, 30, 6), 30, 30), 30, 30);
  assert.equal(finding.cells.length, 1);
  assert.match(describeNoise(finding).headline, /too small/);
});

test('no wording claims certainty', () => {
  const texts: string[] = [describeNoiseView(20)];
  const w = 160;
  const cases = [grainy(w, w, 6), grainy(w, w, 0.1), (() => {
    const l = grainy(w, w, 6, 5);
    for (let y = 0; y < 80; y++) for (let x = 0; x < w; x++) l[y * w + x] = 200;
    return l;
  })()];
  for (const lum of cases) {
    const r = describeNoise(analyzeNoiseAreas(medianResidual(lum, w, w), w, w));
    texts.push(r.headline, ...r.notes);
  }
  for (const t of texts) {
    assert.doesNotMatch(t, /100%|proves|definitely|certainly|guarantee|is fake|was edited|is edited|is untouched|is real\b/i, t);
    assert.doesNotMatch(t, /—/, t);
  }
});

test('the page wires the view: button, slider, both explanation lines, and no upload', () => {
  const page = readFileSync(new URL('../../../components/workspaces/ForensicsWorkspace.astro', import.meta.url), 'utf8');
  assert.match(page, /data-mode="noise"/);
  assert.match(page, /id="noise-amplitude"[^>]*min="2"[^>]*max="60"[^>]*value="20"/);
  assert.match(page, /createNoiseViewRenderer/);
  const card = page.slice(page.indexOf('id="noise-controls"'), page.indexOf('<!-- /noise controls -->'));
  assert.match(card, /What this shows:/);
  assert.match(card, /What it cannot prove:/);
  const lib = readFileSync(new URL('../noiseView.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(lib, /fetch\(|XMLHttpRequest|sendBeacon/);
});
