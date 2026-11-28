import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  ELA_GRID,
  describeCellPlace,
  describeElaGrid,
  elaGridSize,
  findGraphicAreas,
  findUnevenElaCells,
  looksLikeGraphic,
  summarizeForensicsStatus,
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

test('result wording: green only when areas were compared and none stood out', () => {
  const cell = (i: number, detail: number, error: number): ElaGridCell => ({ col: i % 8, row: i >> 3, detail, error });
  const even = findUnevenElaCells(Array.from({ length: 64 }, (_, i) => cell(i, 3 + (i % 4), 1 + (i % 4) * 0.2)), 8, 8);
  const clear = summarizeForensicsStatus(even, false, false);
  assert.equal(clear.tone, 'clear');
  assert.equal(clear.pill, 'No Uneven Areas Found');
  assert.equal(clear.summary, 'No uneven areas found');

  // Half or more of the picture is flat colour: the same words, but never green.
  const halfFlat = findUnevenElaCells(
    Array.from({ length: 64 }, (_, i) => (i < 40 ? cell(i, 0.1, 0.1) : cell(i, 3 + (i % 4), 1 + (i % 4) * 0.2))),
    8,
    8,
  );
  assert.equal(halfFlat.enoughData, true);
  const flat = summarizeForensicsStatus(halfFlat, false, false);
  assert.equal(flat.tone, 'neutral');
  assert.match(flat.areas, /24 of 64/);
  assert.match(flat.summary, /24 of 64 areas could be compared/);

  // Too flat or too small to compare, or no grid at all: neutral, and it says so.
  const mostlyFlat = findUnevenElaCells(Array.from({ length: 64 }, (_, i) => cell(i, i < 60 ? 0.1 : 4, 0.2)), 8, 8);
  assert.equal(summarizeForensicsStatus(mostlyFlat, false, false).pill, 'Not Enough Detail');
  assert.equal(summarizeForensicsStatus(mostlyFlat, false, false).tone, 'neutral');
  assert.equal(summarizeForensicsStatus(undefined, false, false).tone, 'neutral');

  // Flagged areas keep the warning wording the page already used.
  const spliced = findUnevenElaCells(
    Array.from({ length: 64 }, (_, i) => cell(i, 3 + (i % 4), i === 27 || i === 28 ? 9 : 1 + (i % 4) * 0.2)),
    8,
    8,
  );
  assert.equal(spliced.flagged.length, 2);
  const uneven = summarizeForensicsStatus(spliced, true, true);
  assert.deepEqual([uneven.pill, uneven.tone, uneven.areas, uneven.summary], ['Uneven Areas', 'warning', '2 outlined', 'Uneven areas observed']);
  assert.equal(summarizeForensicsStatus(even, true, false).pill, 'Compression Anomaly');

  // No wording anywhere claims the picture is consistent, clean or untouched.
  for (const s of [clear, flat, uneven, summarizeForensicsStatus(mostlyFlat, false, false)]) {
    assert.doesNotMatch(`${s.pill} ${s.areas} ${s.summary}`, /consistent|uniform|clean|authentic|untouched|genuine/i);
  }
});

test('page wiring: the pill and figures use the shared wording and no green default', () => {
  const page = readFileSync(new URL('../../../components/workspaces/ForensicsWorkspace.astro', import.meta.url), 'utf8');
  assert.match(page, /summarizeForensicsStatus\(result\.elaGrid, result\.anomaliesDetected, unevenOnly\)/);
  assert.doesNotMatch(page, /Consistent Compression|Uniform Compression|None Detected/);
  assert.match(page, /id="forensics-status-pill" class="badge-status-neutral"/);
  const forensics = readFileSync(new URL('../forensics.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(forensics, /Uniform compression characteristics/);
  const css = readFileSync(new URL('../../../styles/global.css', import.meta.url), 'utf8');
  assert.match(css, /\.badge-status-neutral \{/);
});

/** The patch of the fictional picture redrawn as hard black and white bars, like big letters or a sticker. */
function withDrawnPatch(picture: ReturnType<typeof fictionalPicture>, error: number) {
  for (let y = 120; y < 180; y++) {
    for (let x = 80; x < 160; x++) {
      const value = (x >> 3) & 1 ? 230 : 30;
      const i = (y * picture.width + x) * 4;
      for (let c = 0; c < 3; c++) {
        picture.original[i + c] = value;
        picture.resaved[i + c] = value + ((x + y) & 1 ? -error : error);
      }
    }
  }
  return picture;
}

test('added text or graphics: hard, clean edges are told apart from photographed detail', () => {
  // Hand-made cells: many abrupt steps per edge is drawn, many gentle ones is photographed.
  const cell = (hardEdgeShare: number, edgeShare: number) => ({ col: 0, row: 0, error: 3, detail: 5, hardEdgeShare, edgeShare });
  assert.equal(looksLikeGraphic(cell(0.04, 0.08)), true, 'sticker-like');
  assert.equal(looksLikeGraphic(cell(0.04, 0.3)), false, 'busy photo texture: few of its edges are hard');
  assert.equal(looksLikeGraphic(cell(0.004, 0.006)), false, 'too few hard edges to say anything');
  assert.equal(looksLikeGraphic({ col: 0, row: 0, error: 3, detail: 5 }), false, 'cells without edge counts');

  // A pasted grainy patch (photographed material): flagged, but not called a graphic.
  const pasted = check(fictionalPicture((x, y, grain) => (inPatch(x, y) ? 12 : 1 + grain * 0.05)));
  assert.ok(pasted.flagged.length > 0);
  assert.ok(pasted.flagged.every((c) => !c.graphicLike));
  const pastedReport = describeElaGrid(pasted);
  assert.doesNotMatch(pastedReport.headline + pastedReport.notes.join(' '), /dashed|added text or/i);

  // The same patch drawn as hard bars: flagged, and every flagged cell is graphic-like.
  const drawn = check(withDrawnPatch(fictionalPicture((_x, _y, grain) => 1 + grain * 0.05), 14));
  assert.equal(drawn.flagged.length, 4);
  assert.ok(drawn.flagged.every((c) => c.graphicLike));
  const report = describeElaGrid(drawn);
  assert.match(report.headline, /^4 uneven areas found, and they look like added text or graphics$/);
  const hint = report.notes.find((note) => /dashed outline/.test(note));
  assert.ok(hint, 'a note explains the dashed outline');
  assert.match(hint, /^All 4 outlined areas/);
  assert.match(hint, /most likely/);
  // A hint only: never a statement that text was added, and the result stays a warning to look.
  assert.doesNotMatch(report.notes.join(' '), /(is|are) added text|proves|certainly|definitely/i);
  assert.equal(summarizeForensicsStatus(drawn, true, true).tone, 'warning');
});

test('added text or graphics: a mixed result names how many areas and where', () => {
  const drawn = check(withDrawnPatch(fictionalPicture((_x, _y, grain) => 1 + grain * 0.05), 14));
  const mixed = { ...drawn, flagged: drawn.flagged.map((c, i) => ({ ...c, graphicLike: i === 0 })) };
  const report = describeElaGrid(mixed);
  assert.match(report.headline, /^4 uneven areas found, 1 of them looks like added text or graphics$/);
  assert.match(report.notes.join(' '), /1 of the 4 outlined areas \([a-z ]+; dashed outline\) has hard, clean edges/);
  const one = describeElaGrid({ ...drawn, flagged: drawn.flagged.slice(0, 1) });
  assert.match(one.headline, /^1 uneven area found, and it looks like added text or a graphic$/);
  assert.match(one.notes.join(' '), /The outlined area \(dashed outline\) has hard, clean edges/);
});

test('page wiring: graphic-like areas get a dashed outline and the card explains it', () => {
  const page = readFileSync(new URL('../../../components/workspaces/ForensicsWorkspace.astro', import.meta.url), 'utf8');
  assert.match(page, /cell\.graphicLike \? 'dashed' : 'solid'/);
  assert.match(page, /A dashed outline means the area has hard, clean edges/);
  assert.match(page, /the dashed outline is a guess/);
});

/** Fictional cells for the text tests: photographed detail, with drawn edges where `drawn(i)` says so. */
function cellsWithText(drawn: (i: number) => boolean): ElaGridCell[] {
  return Array.from({ length: 64 }, (_, i) => ({
    col: i % 8,
    row: i >> 3,
    detail: 3 + (i % 4),
    error: 1 + (i % 4) * 0.2,
    edgeShare: drawn(i) ? 0.08 : 0.3,
    hardEdgeShare: drawn(i) ? 0.04 : 0.02,
  }));
}

test('text that is not outlined: a big caption or a screenshot is named and the result is never green', () => {
  // A photo with a sign in two areas: too little to mention, the result stays as it was.
  const sign = findUnevenElaCells(cellsWithText((i) => i < 2), 8, 8);
  assert.equal(findGraphicAreas(sign).level, 'none');
  assert.equal(summarizeForensicsStatus(sign, false, false).tone, 'clear');
  assert.doesNotMatch(describeElaGrid(sign).notes.join(' '), /hard, clean edges/);

  // Text in one row of eight areas: worth a line, still below a quarter of the picture.
  const strip = findUnevenElaCells(cellsWithText((i) => i < 8), 8, 8);
  assert.equal(strip.flagged.length, 0);
  assert.deepEqual([findGraphicAreas(strip).count, findGraphicAreas(strip).level], [8, 'some']);
  assert.match(describeElaGrid(strip).notes.join(' '), /8 of 64 areas \(top left, top centre, top right\) carry hard, clean edges/);
  assert.equal(summarizeForensicsStatus(strip, false, false).tone, 'clear');

  // A meme caption over the top three rows: nothing is outlined, and the result says why.
  const caption = findUnevenElaCells(cellsWithText((i) => i < 24), 8, 8);
  assert.equal(caption.flagged.length, 0);
  assert.equal(findGraphicAreas(caption).level, 'many');
  const captionReport = describeElaGrid(caption);
  assert.equal(captionReport.headline, 'No uneven areas found');
  assert.match(captionReport.notes.join(' '), /24 of 64 areas .*too much of the picture for this check to single out/);
  const captionStatus = summarizeForensicsStatus(caption, false, false);
  assert.deepEqual([captionStatus.pill, captionStatus.tone], ['No Uneven Areas Found', 'neutral']);
  assert.match(captionStatus.areas, /text in 24 of 64/);
  assert.match(captionStatus.summary, /text or graphics in 24 of 64 areas/);

  // An app screenshot: drawn edges everywhere.
  const screen = findUnevenElaCells(cellsWithText(() => true), 8, 8);
  assert.equal(findGraphicAreas(screen).level, 'most');
  assert.match(describeElaGrid(screen).notes.join(' '), /Most of this picture is text or drawn graphics \(64 of 64 areas\), as in a screenshot/);
  assert.equal(summarizeForensicsStatus(screen, false, false).tone, 'neutral');

  // Outlined areas are not counted twice, and the line says the others are not outlined.
  const mixed = { ...caption, flagged: [{ ...caption.cells[0], expected: 1, graphicLike: true }] };
  assert.equal(findGraphicAreas(mixed).count, 23);
  assert.match(describeElaGrid(mixed).notes.join(' '), /23 of 64 areas that are not outlined/);

  // A hint only: no certainty either way.
  for (const f of [strip, caption, screen, mixed]) {
    const s = summarizeForensicsStatus(f, false, false);
    assert.doesNotMatch(
      `${describeElaGrid(f).notes.join(' ')} ${s.pill} ${s.areas} ${s.summary}`,
      /proves|certainly|definitely|authentic|genuine|consistent/i,
    );
  }
});

test('page wiring: the card explains text that is not outlined', () => {
  const page = readFileSync(new URL('../../../components/workspaces/ForensicsWorkspace.astro', import.meta.url), 'utf8');
  assert.match(page, /a note says how many/);
  assert.match(page, /stays grey, not green/);
});
