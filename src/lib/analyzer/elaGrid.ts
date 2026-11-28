/**
 * Finer look at an Error Level Analysis (ELA) result.
 *
 * The first verdict compared four quadrants only, so a small pasted area disappeared in the
 * average. Here the picture is cut into a grid (8 x 8 on normal pictures). For every cell we
 * measure two things: how much it changed in the test re-save (error) and how much fine detail
 * it has (detail). Busy areas always change more than calm ones, so a cell is flagged only when
 * its error is far above what its own detail explains, judged against the other cells of the
 * same picture. Flat cells are set aside: ELA has nothing to say about them.
 *
 * Pure functions, no DOM, so they run in unit tests.
 */

export interface ElaGridCell {
  col: number;
  row: number;
  /** Mean per-channel difference between the picture and its re-saved copy (0 to 255). */
  error: number;
  /** Mean brightness step between neighbouring pixels of the picture (0 to 255). */
  detail: number;
  /** Share of pixels (0 to 1) with any visible brightness step to a neighbour. */
  edgeShare?: number;
  /** Share of pixels (0 to 1) with a very large brightness step to a neighbour. */
  hardEdgeShare?: number;
}

export interface ElaGridFlag extends ElaGridCell {
  /** The error the other cells predict for this amount of detail. */
  expected: number;
  /** True when the cell's edges are mostly hard and clean, as in added text, stickers and logos. */
  graphicLike: boolean;
}

export interface ElaGridFinding {
  cols: number;
  rows: number;
  cells: ElaGridCell[];
  /** Cells whose re-save error is far above what their detail explains. */
  flagged: ElaGridFlag[];
  /** Cells with almost no detail. ELA cannot judge them, so they are never flagged. */
  flatCells: number;
  /** Cells that were compared with each other. */
  judgedCells: number;
  /** False when the picture is too small or too flat for a fair comparison. */
  enoughData: boolean;
}

export const ELA_GRID = {
  maxCells: 8,
  /** Smallest cell side in pixels. Smaller cells are too noisy to compare. */
  minCellSide: 24,
  /** Below this detail a cell counts as flat. */
  flatDetail: 0.6,
  /** Fewest comparable cells needed before anything is flagged. */
  minJudged: 12,
  /** A flagged cell must be this many robust deviations above the fit ... */
  deviations: 4,
  /** ... and at least this many times the expected error ... */
  minRatio: 1.8,
  /** ... and at least this far above it in absolute terms. */
  minExcess: 0.8,
  /** More flagged cells than this share means the fit does not describe the picture. */
  maxFlaggedShare: 0.25,
} as const;

/**
 * Drawn shapes (letters, stickers, logos, app screens) have edges that jump from one colour to
 * another in a single pixel. Photographed things mostly have softer edges, with many gentle
 * steps for every abrupt one. The numbers come from fictional test pictures (photos with a
 * caption, a sticker, a badge and a watermark added); see the tests.
 */
export const ELA_GRAPHIC = {
  /** A brightness step above this counts as an edge at all ... */
  edgeStep: 20,
  /** ... and above this as a hard edge. */
  hardStep: 80,
  /** A graphic-like cell has at least this share of hard-edge pixels ... */
  minHardShare: 0.01,
  /** ... and at least this many hard edges for every edge of any kind. */
  minHardRatio: 0.35,
  /** Fewer graphic-like areas than this are not worth a line of their own. */
  severalAreas: 3,
  /**
   * From this share of the compared areas on, text or graphics are part of the picture's normal:
   * the fit absorbs them, so the check cannot single them out and the result is never green.
   */
  manyShare: 0.25,
  /** From this share on the picture reads as a screenshot, poster or other drawn graphic. */
  mostShare: 0.5,
} as const;

/** True when the edges in a cell look drawn (text, sticker, logo), not photographed. A hint, not proof. */
export function looksLikeGraphic(cell: ElaGridCell): boolean {
  const hard = cell.hardEdgeShare ?? 0;
  const edges = cell.edgeShare ?? 0;
  return hard >= ELA_GRAPHIC.minHardShare && edges > 0 && hard / edges >= ELA_GRAPHIC.minHardRatio;
}

export interface GraphicAreas {
  /** Compared areas that were not outlined and whose edges look drawn. */
  count: number;
  places: string[];
  /** none: too few to mention. some: worth a line. many: too many for the check to single out. most: the picture is mostly text or graphics. */
  level: 'none' | 'some' | 'many' | 'most';
}

/**
 * Looks for drawn edges in every compared area, outlined or not. A big caption or an app screen
 * covers so many areas that it becomes the picture's normal and nothing is outlined; this count
 * lets the result say so instead of reading as a plain "nothing found".
 */
export function findGraphicAreas(finding: ElaGridFinding, rules: ElaGridRules = ELA_GRID): GraphicAreas {
  const outlined = new Set(finding.flagged.map((c) => `${c.col},${c.row}`));
  const graphic = finding.cells.filter(
    (c) => c.detail >= rules.flatDetail && !outlined.has(`${c.col},${c.row}`) && looksLikeGraphic(c),
  );
  const count = graphic.length;
  const places = [...new Set(graphic.map((c) => describeCellPlace(c, finding.cols, finding.rows)))];
  const share = finding.judgedCells > 0 ? count / finding.judgedCells : 0;
  const level =
    !finding.enoughData || count < ELA_GRAPHIC.severalAreas
      ? 'none'
      : share >= ELA_GRAPHIC.mostShare
        ? 'most'
        : share >= ELA_GRAPHIC.manyShare
          ? 'many'
          : 'some';
  return { count, places, level };
}

/** One plain line about text or graphics that the area check did not outline. Empty when there is little of it. */
function describeGraphicAreas(finding: ElaGridFinding): string {
  const graphic = findGraphicAreas(finding);
  if (graphic.level === 'none') return '';
  const total = finding.cols * finding.rows;
  const other = finding.flagged.length > 0 ? ' that are not outlined' : '';
  if (graphic.level === 'most') {
    return `Most of this picture is text or drawn graphics (${graphic.count} of ${total} areas${other}), as in a screenshot, a poster or a meme. The check compares the areas of one picture with each other, so here it can only notice a part that was saved differently from the rest. Text that was changed and saved together with the whole picture looks even, so read the words and numbers themselves.`;
  }
  const where = graphic.places.length <= 4 ? ` (${graphic.places.join(', ')})` : '';
  const tail =
    graphic.level === 'many'
      ? 'That is too much of the picture for this check to single out: a large caption or banner becomes part of what the picture normally looks like, whether it was there from the start or added later.'
      : 'They did not stand out in the test re-save. That fits text that was always part of the picture, and also text that was added and then saved together with the rest.';
  return `${graphic.count} of ${total} areas${other}${where} carry hard, clean edges, the kind that letters, captions, stickers and logos have. ${tail}`;
}

export type ElaGridRules = { readonly [K in keyof typeof ELA_GRID]: number };

/** Grid size for a picture: up to 8 x 8, fewer cells when the picture is small. */
export function elaGridSize(width: number, height: number): { cols: number; rows: number } {
  const fit = (side: number) => Math.max(1, Math.min(ELA_GRID.maxCells, Math.floor(side / ELA_GRID.minCellSide)));
  return { cols: fit(width), rows: fit(height) };
}

/** Measures error and detail for every grid cell from two RGBA buffers of the same size. */
export function measureElaGrid(
  original: ArrayLike<number>,
  resaved: ArrayLike<number>,
  width: number,
  height: number,
  size: { cols: number; rows: number } = elaGridSize(width, height),
): ElaGridCell[] {
  if (original.length !== resaved.length || original.length !== width * height * 4) {
    throw new Error('The ELA grid needs two RGBA buffers that match the picture size');
  }
  const { cols, rows } = size;
  const count = cols * rows;
  const errorSum = new Float64Array(count);
  const detailSum = new Float64Array(count);
  const pixels = new Uint32Array(count);
  const detailPixels = new Uint32Array(count);
  const edgePixels = new Uint32Array(count);
  const hardPixels = new Uint32Array(count);
  const luma = (i: number) => 0.299 * original[i] + 0.587 * original[i + 1] + 0.114 * original[i + 2];

  for (let y = 0; y < height; y++) {
    const row = Math.min(rows - 1, Math.floor((y * rows) / height));
    for (let x = 0; x < width; x++) {
      const col = Math.min(cols - 1, Math.floor((x * cols) / width));
      const cell = row * cols + col;
      const i = (y * width + x) * 4;
      errorSum[cell] +=
        (Math.abs(original[i] - resaved[i]) +
          Math.abs(original[i + 1] - resaved[i + 1]) +
          Math.abs(original[i + 2] - resaved[i + 2])) /
        3;
      pixels[cell]++;
      if (x + 1 < width && y + 1 < height) {
        const here = luma(i);
        const right = Math.abs(here - luma(i + 4));
        const down = Math.abs(here - luma(i + width * 4));
        detailSum[cell] += (right + down) / 2;
        detailPixels[cell]++;
        const step = Math.max(right, down);
        if (step > ELA_GRAPHIC.edgeStep) edgePixels[cell]++;
        if (step > ELA_GRAPHIC.hardStep) hardPixels[cell]++;
      }
    }
  }

  const cells: ElaGridCell[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = row * cols + col;
      cells.push({
        col,
        row,
        error: pixels[cell] ? errorSum[cell] / pixels[cell] : 0,
        detail: detailPixels[cell] ? detailSum[cell] / detailPixels[cell] : 0,
        edgeShare: detailPixels[cell] ? edgePixels[cell] / detailPixels[cell] : 0,
        hardEdgeShare: detailPixels[cell] ? hardPixels[cell] / detailPixels[cell] : 0,
      });
    }
  }
  return cells;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Compares the cells of one picture with each other. A robust line (Theil-Sen) gives the error
 * to expect for a given amount of detail; a cell is flagged only when it sits far above it.
 */
export function findUnevenElaCells(
  cells: ElaGridCell[],
  cols: number,
  rows: number,
  rules: ElaGridRules = ELA_GRID,
): ElaGridFinding {
  const judged = cells.filter((c) => c.detail >= rules.flatDetail);
  const base: ElaGridFinding = {
    cols,
    rows,
    cells,
    flagged: [],
    flatCells: cells.length - judged.length,
    judgedCells: judged.length,
    enoughData: judged.length >= rules.minJudged,
  };
  if (!base.enoughData) return base;

  const slopes: number[] = [];
  for (let i = 0; i < judged.length; i++) {
    for (let j = i + 1; j < judged.length; j++) {
      const run = judged[j].detail - judged[i].detail;
      if (Math.abs(run) > 1e-6) slopes.push((judged[j].error - judged[i].error) / run);
    }
  }
  const slope = Math.max(0, median(slopes));
  const offset = median(judged.map((c) => c.error - slope * c.detail));
  const expectedFor = (c: ElaGridCell) => Math.max(0, offset + slope * c.detail);
  const residuals = judged.map((c) => c.error - expectedFor(c));
  const centre = median(residuals);
  // 1.4826 turns the median absolute deviation into a standard-deviation-like spread.
  const spread = Math.max(0.15, 1.4826 * median(residuals.map((r) => Math.abs(r - centre))));

  const flagged = judged
    .map((c) => ({ ...c, expected: expectedFor(c), graphicLike: looksLikeGraphic(c) }))
    .filter(
      (c) =>
        c.error - c.expected > rules.deviations * spread &&
        c.error - c.expected >= rules.minExcess &&
        c.error >= rules.minRatio * Math.max(c.expected, 0.5),
    );

  // When a large share of the picture "stands out", the picture is simply varied: flag nothing.
  if (flagged.length > judged.length * rules.maxFlaggedShare) return base;
  return { ...base, flagged };
}

/** Where a cell sits, in words a visitor can match to the picture. */
export function describeCellPlace(cell: { col: number; row: number }, cols: number, rows: number): string {
  const third = (index: number, total: number, names: [string, string, string]) =>
    total < 3 ? names[index < total / 2 ? 0 : 2] : names[Math.min(2, Math.floor((index * 3) / total))];
  const vertical = third(cell.row, rows, ['top', 'middle', 'bottom']);
  const horizontal = third(cell.col, cols, ['left', 'centre', 'right']);
  if (vertical === 'middle' && horizontal === 'centre') return 'centre';
  if (vertical === 'middle') return `middle ${horizontal}`;
  return `${vertical} ${horizontal}`;
}

/** Plain-language lines for the result card. Never claims an edit or a clean picture. */
export function describeElaGrid(finding: ElaGridFinding): { headline: string; notes: string[] } {
  const total = finding.cols * finding.rows;
  const notes: string[] = [];
  if (!finding.enoughData) {
    return {
      headline: 'Not enough detail to compare areas',
      notes: [
        finding.cells.length < ELA_GRID.minJudged
          ? 'The picture is too small to compare its parts with each other.'
          : 'Most of this picture is flat colour, and flat areas barely change in a re-save, so there is little to compare.',
      ],
    };
  }
  if (finding.flagged.length > 0) {
    const places = [...new Set(finding.flagged.map((c) => describeCellPlace(c, finding.cols, finding.rows)))];
    const n = finding.flagged.length;
    notes.push(
      `${n} of ${total} areas changed far more in the test re-save than areas with similar detail (${places.join(', ')}). They are outlined on the ELA map.`,
    );
    notes.push(
      'That can happen when something was pasted in or redrawn after the picture was first saved. Added text, stickers, watermarks and very sharp or brightly coloured objects do the same without any trickery, so look at what sits inside the outlines.',
    );
    const graphic = finding.flagged.filter((c) => c.graphicLike);
    if (graphic.length > 0) {
      const where = [...new Set(graphic.map((c) => describeCellPlace(c, finding.cols, finding.rows)))];
      const g = graphic.length;
      const subject =
        g < n
          ? `${g} of the ${n} outlined areas (${where.join(', ')}; dashed outline) ${g === 1 ? 'has' : 'have'}`
          : n === 1
            ? 'The outlined area (dashed outline) has'
            : `All ${n} outlined areas (dashed outline) have`;
      notes.push(
        `${subject} hard, clean edges, the kind that letters, stickers, logos and app screens have. If you can see a caption, sticker, logo or watermark there, that is most likely what this check picked up. It is still something added to the picture, so read it: on a receipt or a screenshot, the added text may be the part that matters.`,
      );
    }
  } else {
    notes.push(
      `${finding.judgedCells} of ${total} areas were compared and none changed far more than its detail explains.`,
    );
    notes.push(
      'This does not show the picture is untouched. An edit that was saved together with the rest, a re-save by a messaging app, or a careful edit leaves an even result too.',
    );
  }
  const graphicLine = describeGraphicAreas(finding);
  if (graphicLine) notes.push(graphicLine);
  if (finding.flatCells > 0) {
    notes.push(
      `${finding.flatCells} of ${total} areas are flat colour. Flat areas barely change in a re-save whether they are original or pasted, so this check cannot judge them.`,
    );
  }
  return {
    headline:
      finding.flagged.length > 0
        ? `${finding.flagged.length} uneven ${finding.flagged.length === 1 ? 'area' : 'areas'} found${describeGraphicShare(finding)}`
        : 'No uneven areas found',
    notes,
  };
}

/** Headline ending that says how many flagged areas look like added text or graphics. */
function describeGraphicShare(finding: ElaGridFinding): string {
  const n = finding.flagged.length;
  const graphic = finding.flagged.filter((c) => c.graphicLike).length;
  if (graphic === 0) return '';
  if (graphic === n) return n === 1 ? ', and it looks like added text or a graphic' : ', and they look like added text or graphics';
  return `, ${graphic} of them ${graphic === 1 ? 'looks' : 'look'} like added text or graphics`;
}

export type ForensicsTone = 'warning' | 'neutral' | 'clear';

export interface ForensicsStatus {
  /** Short text for the result pill. */
  pill: string;
  /** warning: look at the outlined areas. clear: areas were compared and none stood out. neutral: too little could be judged. */
  tone: ForensicsTone;
  /** Text for the "areas that stand out" figure. */
  areas: string;
  /** One line for summaries on other pages. */
  summary: string;
}

/**
 * The wording of the result. It says only what the comparison found: "no uneven areas found" is
 * not "consistent" or "untouched", and when half or more of the picture could not be judged
 * (flat colour, too small), or a quarter or more of the compared areas carry text or graphics
 * the check cannot single out, the result is neutral, never green.
 */
export function summarizeForensicsStatus(
  finding: ElaGridFinding | undefined,
  anomaliesDetected: boolean,
  unevenOnly: boolean,
): ForensicsStatus {
  if (anomaliesDetected) {
    const n = finding?.flagged.length ?? 0;
    return unevenOnly
      ? { pill: 'Uneven Areas', tone: 'warning', areas: `${n} outlined`, summary: 'Uneven areas observed' }
      : {
          pill: 'Compression Anomaly',
          tone: 'warning',
          areas: n > 0 ? `${n} outlined` : 'Uneven halves',
          summary: 'Regional compression variance observed',
        };
  }
  if (!finding || !finding.enoughData) {
    return {
      pill: 'Not Enough Detail',
      tone: 'neutral',
      areas: 'Could not compare',
      summary: 'Not enough detail to compare areas',
    };
  }
  const total = finding.cols * finding.rows;
  if (finding.flatCells * 2 >= total) {
    return {
      pill: 'No Uneven Areas Found',
      tone: 'neutral',
      areas: `None in ${finding.judgedCells} of ${total} compared`,
      summary: `No uneven areas found (${finding.judgedCells} of ${total} areas could be compared)`,
    };
  }
  const graphic = findGraphicAreas(finding);
  if (graphic.level === 'many' || graphic.level === 'most') {
    return {
      pill: 'No Uneven Areas Found',
      tone: 'neutral',
      areas: `None found, text in ${graphic.count} of ${total}`,
      summary: `No uneven areas found (text or graphics in ${graphic.count} of ${total} areas)`,
    };
  }
  return { pill: 'No Uneven Areas Found', tone: 'clear', areas: 'None found', summary: 'No uneven areas found' };
}
