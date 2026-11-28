import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  STANDARD_CHROMINANCE_TABLE,
  STANDARD_LUMINANCE_TABLE,
  buildJpegQualityReport,
  dataUrlHeadBytes,
  detectImageFormat,
  matchTableQuality,
  parseJpegQuantTables,
  scaleStandardTable,
} from '../jpegQuality';

const ZIGZAG = [
  0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28,
  35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55,
  62, 63,
];

/** A table as the file stores it: slot byte, then 64 values in zigzag order. */
function dqtBody(id: number, natural: number[]): number[] {
  return [id, ...ZIGZAG.map((pos) => natural[pos])];
}

function segment(marker: number, body: number[]): number[] {
  const length = body.length + 2;
  return [0xff, marker, length >> 8, length & 0xff, ...body];
}

/** A fictional JPEG header: optional EXIF block, the tables, then the start of the picture data. */
function fakeJpeg(lum: number[], chroma: number[], options: { exifDecoy?: boolean; split?: boolean } = {}): Uint8Array {
  const bytes = [0xff, 0xd8];
  bytes.push(...segment(0xe0, [0x4a, 0x46, 0x49, 0x46, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0]));
  if (options.exifDecoy) {
    // An EXIF block holding a preview picture with its own (quality 30) tables.
    const preview = [0xff, 0xd8, ...segment(0xdb, dqtBody(0, scaleStandardTable(STANDARD_LUMINANCE_TABLE, 30))), 0xff, 0xd9];
    bytes.push(...segment(0xe1, [0x45, 0x78, 0x69, 0x66, 0, 0, ...preview]));
  }
  if (options.split) {
    bytes.push(...segment(0xdb, dqtBody(0, lum)), ...segment(0xdb, dqtBody(1, chroma)));
  } else {
    bytes.push(...segment(0xdb, [...dqtBody(0, lum), ...dqtBody(1, chroma)]));
  }
  bytes.push(...segment(0xda, [1, 2, 3]), 9, 9, 9, 0xff, 0xd9);
  return Uint8Array.from(bytes);
}

test('scaling follows libjpeg: quality 50 is the standard table, 100 is all ones', () => {
  assert.deepEqual(scaleStandardTable(STANDARD_LUMINANCE_TABLE, 50), STANDARD_LUMINANCE_TABLE);
  assert.ok(scaleStandardTable(STANDARD_LUMINANCE_TABLE, 100).every((v) => v === 1));
  assert.equal(scaleStandardTable(STANDARD_LUMINANCE_TABLE, 75)[0], 8);
  assert.equal(scaleStandardTable(STANDARD_LUMINANCE_TABLE, 10)[0], 80);
  assert.ok(scaleStandardTable(STANDARD_CHROMINANCE_TABLE, 1).every((v) => v <= 255 && v >= 1));
});

test('every quality from 10 to 99 is recovered exactly from its own tables', () => {
  for (let q = 10; q <= 99; q++) {
    const match = matchTableQuality(scaleStandardTable(STANDARD_LUMINANCE_TABLE, q), STANDARD_LUMINANCE_TABLE);
    assert.deepEqual(match, { quality: q, exact: true }, `quality ${q}`);
  }
});

test('tables are read from one segment or several, in row order', () => {
  const lum = scaleStandardTable(STANDARD_LUMINANCE_TABLE, 80);
  const chroma = scaleStandardTable(STANDARD_CHROMINANCE_TABLE, 80);
  for (const split of [false, true]) {
    const tables = parseJpegQuantTables(fakeJpeg(lum, chroma, { split }));
    assert.equal(tables.length, 2);
    assert.deepEqual(tables[0], { id: 0, precision: 8, values: lum });
    assert.deepEqual(tables[1].values, chroma);
  }
});

test('the preview picture inside the EXIF block is not mistaken for the picture', () => {
  const file = fakeJpeg(scaleStandardTable(STANDARD_LUMINANCE_TABLE, 92), scaleStandardTable(STANDARD_CHROMINANCE_TABLE, 92), {
    exifDecoy: true,
  });
  const report = buildJpegQualityReport(file);
  assert.equal(report.quality, 92);
  assert.equal(report.standardTables, true);
  assert.equal(report.headline, 'Last saved at 92% JPEG quality.');
});

test('custom tables give a nearest match and say so', () => {
  const lum = scaleStandardTable(STANDARD_LUMINANCE_TABLE, 88).map((v, i) => (i % 5 === 0 ? v + 1 : v));
  const report = buildJpegQualityReport(fakeJpeg(lum, scaleStandardTable(STANDARD_CHROMINANCE_TABLE, 88)));
  assert.equal(report.standardTables, false);
  assert.ok(report.quality !== null && Math.abs(report.quality - 88) <= 2);
  assert.match(report.headline, /about \d+% JPEG quality \(nearest match\)/);
  assert.ok(report.notes.some((n) => /nearest match only/.test(n)));
});

test('different brightness and colour levels are not called standard', () => {
  const report = buildJpegQualityReport(
    fakeJpeg(scaleStandardTable(STANDARD_LUMINANCE_TABLE, 90), scaleStandardTable(STANDARD_CHROMINANCE_TABLE, 70)),
  );
  assert.equal(report.quality, 90);
  assert.equal(report.standardTables, false);
});

test('each quality band gets its own plain note and every report states the limit', () => {
  const noteFor = (q: number) =>
    buildJpegQualityReport(fakeJpeg(scaleStandardTable(STANDARD_LUMINANCE_TABLE, q), scaleStandardTable(STANDARD_CHROMINANCE_TABLE, q)));
  assert.match(noteFor(97).notes[0], /very high quality/);
  assert.match(noteFor(90).notes[0], /high quality save/);
  assert.match(noteFor(75).notes[0], /medium quality.*A re-save alone is not editing\./);
  assert.match(noteFor(40).notes[0], /low quality/);
  for (const q of [97, 90, 75, 40]) {
    const notes = noteFor(q).notes;
    assert.match(notes[notes.length - 1], /last save only.*whether anything in it was changed/);
    assert.doesNotMatch(notes.join(' '), /100% accurate|proves|definitely|certainly/i);
  }
});

test('PNG, WebP, GIF and unknown files are named and give no quality', () => {
  const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]);
  const webp = Uint8Array.from([0x52, 0x49, 0x46, 0x46, 1, 2, 3, 4, 0x57, 0x45, 0x42, 0x50]);
  const gif = Uint8Array.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);
  assert.equal(detectImageFormat(png), 'png');
  assert.equal(detectImageFormat(webp), 'webp');
  assert.equal(detectImageFormat(gif), 'gif');
  assert.equal(detectImageFormat(new Uint8Array(0)), 'other');
  const report = buildJpegQualityReport(png);
  assert.equal(report.quality, null);
  assert.match(report.headline, /^This file is a PNG/);
  assert.match(report.notes[0], /screenshots are normally PNG/);
  assert.equal(buildJpegQualityReport(webp).quality, null);
});

test('cut-off and junk files never throw', () => {
  const full = fakeJpeg(scaleStandardTable(STANDARD_LUMINANCE_TABLE, 80), scaleStandardTable(STANDARD_CHROMINANCE_TABLE, 80));
  for (let cut = 0; cut < full.length; cut += 7) {
    assert.doesNotThrow(() => buildJpegQualityReport(full.slice(0, cut)));
  }
  const noTables = buildJpegQualityReport(full.slice(0, 22));
  assert.equal(noTables.quality, null);
  assert.match(noTables.headline, /no readable quality tables/);
  assert.doesNotThrow(() => buildJpegQualityReport(Uint8Array.from([0xff, 0xd8, 0xff, 0xdb, 0, 1, 0xff, 0xff, 0xff])));
});

test('the head of a data URL is decoded, junk gives no bytes', () => {
  const file = fakeJpeg(scaleStandardTable(STANDARD_LUMINANCE_TABLE, 85), scaleStandardTable(STANDARD_CHROMINANCE_TABLE, 85));
  const dataUrl = `data:image/jpeg;base64,${Buffer.from(file).toString('base64')}`;
  assert.deepEqual(Array.from(dataUrlHeadBytes(dataUrl)), Array.from(file));
  assert.equal(buildJpegQualityReport(dataUrlHeadBytes(dataUrl)).quality, 85);
  const head = dataUrlHeadBytes(dataUrl, 30);
  assert.ok(head.length <= 30 && head.length >= 27);
  assert.deepEqual(Array.from(head), Array.from(file.slice(0, head.length)));
  assert.equal(dataUrlHeadBytes('https://example.com/a.jpg').length, 0);
  assert.equal(dataUrlHeadBytes('data:image/svg+xml,<svg/>').length, 0);
});

test('the workspace shows the check with both interpretation lines', () => {
  const page = readFileSync(new URL('../../../components/workspaces/ForensicsWorkspace.astro', import.meta.url), 'utf8');
  assert.match(page, /id="jpeg-quality-card"/);
  assert.match(page, /id="jpeg-quality-headline"/);
  const card = page.slice(page.indexOf('id="jpeg-quality-card"'), page.indexOf('<!-- /JPEG quality card -->'));
  assert.match(card, /What this shows:/);
  assert.match(card, /What it cannot prove:/);
});
