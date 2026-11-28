import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  ELA_GRID,
  describeCellPlace,
  describeElaGrid,
  elaGridSize,
  findUnevenElaCells,
  measureElaGrid,
  type ElaGridCell,
} from '../elaGrid';

/** Small repeatable random numbers, so the fictional pictures are the same on every run. */
function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

/**
 * A fictional 320 x 240 picture: grainy everywhere, with the grain strength rising from left to
 * right. The "re-saved" copy differs from it by `errorOf(x, y)` per channel, which stands in for
 * what a JPEG re-save would do.
 */
function fictionalPicture(errorOf: (x: number, y: number, grain: number) => number, flatLeft = false) {
  const width = 320;
  const height = 240;
  const random = seeded(7);
  const original = new Uint8ClampedArray(width * height * 4);
  const resaved = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const grain = flatLeft && x < width / 2 ? 0 : 6 + (x / width) * 30;
      const value = 120 + (random() - 0.5) * 2 * grain;
      const error = errorOf(x, y, grain);
      const i = (y * width + x) * 4;
      for (let c = 0; c < 3; c++) {
        original[i + c] = value;
        resaved[i + c] = value + (random() < 0.5 ? -error : error);
      }
      original[i + 3] = 255;
      resaved[i + 3] = 255;
    }
  }
  return { original, resaved, width, height };
}

function check(picture: ReturnType<typeof fictionalPicture>) {
  const size = elaGridSize(picture.width, picture.height);
  const cells = measureElaGrid(picture.original, picture.resaved, picture.width, picture.height, size);
  return findUnevenElaCells(cells, size.cols, size.rows);
}

const inPatch = (x: number, y: number) => x >= 80 && x < 160 && y >= 120 && y < 180;

test('grid size: 8 x 8 on normal pictures, fewer cells on small ones, never zero', () => {
  assert.deepEqual(elaGridSize(1600, 1000), { cols: 8, rows: 8 });
  assert.deepEqual(elaGridSize(100, 60), { cols: 4, rows: 2 });
  assert.deepEqual(elaGridSize(10, 10), { cols: 1, rows: 1 });
});

test('measuring: cells cover the whole picture and report error and detail', () => {
  const picture = fictionalPicture(() => 2);
  const cells = measureElaGrid(picture.original, picture.resaved, picture.width, picture.height);
  assert.equal(cells.length, 64);
  for (const cell of cells) assert.ok(Math.abs(cell.error - 2) < 0.05, `error ${cell.error}`);
  // Grain rises from left to right, so detail does too.
  assert.ok(cells[7].detail > cells[0].detail * 2);
  assert.throws(() => measureElaGrid(picture.original, picture.resaved.slice(4), picture.width, picture.height));
});

test('untouched fictional picture: busier areas change more, nothing is flagged', () => {
  // Error follows the grain, as it does in a picture saved once.
  const finding = check(fictionalPicture((_x, _y, grain) => grain / 8));
  assert.equal(finding.enoughData, true);
  assert.equal(finding.flagged.length, 0);
  const report = describeElaGrid(finding);
  assert.equal(report.headline, 'No uneven areas found');
  assert.match(report.notes.join(' '), /does not show the picture is untouched/);
});

test('edited fictional picture: a pasted patch that changes far more than its detail is flagged where it sits', () => {
  // Same picture, but a patch of two by two cells (columns 2-3, rows 4-5) changes four times as much.
  const finding = check(fictionalPicture((x, y, grain) => (inPatch(x, y) ? grain / 2 : grain / 8)));
  assert.equal(finding.flagged.length, 4);
  for (const cell of finding.flagged) {
    assert.ok(cell.col >= 2 && cell.col <= 3 && cell.row >= 4 && cell.row <= 5, `cell ${cell.col},${cell.row}`);
    assert.ok(cell.error >= ELA_GRID.minRatio * cell.expected);
  }
  const report = describeElaGrid(finding);
  assert.equal(report.headline, '4 uneven areas found');
  assert.match(report.notes[0], /4 of 64 areas/);
  assert.match(report.notes[0], /outlined on the ELA map/);
  // Cautious wording: it names innocent causes and never states an edit as a fact.
  assert.match(report.notes[1], /Added text, stickers, watermarks/);
  assert.doesNotMatch(report.notes.join(' '), /was edited|is fake|100%|proves/i);
});

test('a slightly different patch stays below the thresholds (no hair-trigger)', () => {
  const finding = check(fictionalPicture((x, y, grain) => (inPatch(x, y) ? grain / 6 : grain / 8)));
  assert.equal(finding.flagged.length, 0);
});

test('flat areas are set aside and explained, never flagged', () => {
  const finding = check(fictionalPicture((_x, _y, grain) => grain / 8, true));
  assert.equal(finding.flatCells, 32);
  assert.equal(finding.judgedCells, 32);
  assert.equal(finding.flagged.length, 0);
  assert.match(describeElaGrid(finding).notes.join(' '), /32 of 64 areas are flat colour/);
});

test('too little to compare: says so instead of calling the picture even', () => {
  const flat: ElaGridCell[] = Array.from({ length: 64 }, (_, i) => ({ col: i % 8, row: i >> 3, error: 0, detail: 0 }));
  const finding = findUnevenElaCells(flat, 8, 8);
  assert.equal(finding.enoughData, false);
  assert.equal(describeElaGrid(finding).headline, 'Not enough detail to compare areas');
  const tiny = findUnevenElaCells([{ col: 0, row: 0, error: 3, detail: 5 }], 1, 1);
  assert.match(describeElaGrid(tiny).notes[0], /too small/);
});

test('a picture where a quarter or more stands out is treated as varied, not flagged', () => {
  const cells: ElaGridCell[] = Array.from({ length: 64 }, (_, i) => ({
    col: i % 8,
    row: i >> 3,
    detail: 4 + (i % 5),
    error: i % 3 === 0 ? 9 : 1 + (i % 5) * 0.2,
  }));
  assert.equal(findUnevenElaCells(cells, 8, 8).flagged.length, 0);
});

test('places are named so a visitor can find them', () => {
  assert.equal(describeCellPlace({ col: 0, row: 0 }, 8, 8), 'top left');
  assert.equal(describeCellPlace({ col: 4, row: 4 }, 8, 8), 'centre');
  assert.equal(describeCellPlace({ col: 7, row: 3 }, 8, 8), 'middle right');
  assert.equal(describeCellPlace({ col: 3, row: 7 }, 8, 8), 'bottom centre');
  assert.equal(describeCellPlace({ col: 1, row: 0 }, 2, 2), 'top right');
});

test('page wiring: the verdict uses the grid and the card states what it shows and cannot prove', () => {
  const forensics = readFileSync(new URL('../forensics.ts', import.meta.url), 'utf8');
  assert.match(forensics, /findUnevenElaCells\(/);
  assert.match(forensics, /if \(unevenAreas\) anomaliesDetected = true;/);
  const page = readFileSync(new URL('../../../components/workspaces/ForensicsWorkspace.astro', import.meta.url), 'utf8');
  assert.match(page, /id="ela-grid-card"/);
  assert.match(page, /id="forensics-grid-marks"/);
  const card = page.slice(page.indexOf('id="ela-grid-card"'), page.indexOf('id="jpeg-quality-card"'));
  assert.match(card, /What this shows:/);
  assert.match(card, /What it cannot prove:/);
});
