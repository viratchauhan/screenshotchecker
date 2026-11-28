/**
 * Noise analysis view.
 *
 * Every pixel's brightness is compared with the median of its 3 by 3 neighbourhood. What is
 * left over (the residual) is the fine grain of the picture: sensor noise, compression grain,
 * and thin edges. The view shows that residual, brightened by an amplitude the visitor sets.
 *
 * Like the adjustable ELA view, this only draws a picture and a few plain notes. It never
 * changes the result pill.
 */

import { fitElaViewSize } from './elaView';

export const NOISE_VIEW_LIMITS = { amplitude: { min: 2, max: 60, step: 1 } } as const;
export const DEFAULT_NOISE_AMPLITUDE = 20;

/** Thresholds of the area comparison, in one place so the tests and the notes agree. */
export const NOISE_AREAS = {
  /** Up to this many areas along the longer side. */
  maxCells: 8,
  /** Smallest side of one area, in pixels. */
  minCellSide: 24,
  /** Below this typical grain (brightness levels) the picture has too little noise to compare. */
  quietPicture: 0.35,
  /** An area is "much smoother" when its grain is below this share of the typical area. */
  smoothShare: 0.3,
  /** An area is "much grainier" when its grain is above this multiple of the typical area. */
  grainyTimes: 3,
} as const;

export function clampNoiseAmplitude(value: unknown): number {
  const n = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (typeof n !== 'number' || !Number.isFinite(n)) return DEFAULT_NOISE_AMPLITUDE;
  const { min, max } = NOISE_VIEW_LIMITS.amplitude;
  return Math.min(max, Math.max(min, Math.round(n)));
}

/** Brightness (0 to 255) of each pixel of an RGBA buffer. */
export function toLuminance(rgba: ArrayLike<number>, width: number, height: number): Float32Array {
  if (rgba.length !== width * height * 4) throw new Error('Noise view needs an RGBA buffer that matches the size');
  const lum = new Float32Array(width * height);
  for (let i = 0, p = 0; p < lum.length; i += 4, p++) {
    lum[p] = 0.299 * rgba[i] + 0.587 * rgba[i + 1] + 0.114 * rgba[i + 2];
  }
  return lum;
}

/**
 * Brightness minus the 3 by 3 median around each pixel. Edge pixels use their nearest
 * neighbours. Positive and negative values are kept; the view and the notes use the size.
 */
export function medianResidual(lum: ArrayLike<number>, width: number, height: number): Float32Array {
  if (lum.length !== width * height) throw new Error('Brightness buffer does not match the size');
  const out = new Float32Array(width * height);
  const win = new Float32Array(9);
  for (let y = 0; y < height; y++) {
    const y0 = y > 0 ? y - 1 : y;
    const y2 = y < height - 1 ? y + 1 : y;
    for (let x = 0; x < width; x++) {
      const x0 = x > 0 ? x - 1 : x;
      const x2 = x < width - 1 ? x + 1 : x;
      win[0] = lum[y0 * width + x0];
      win[1] = lum[y0 * width + x];
      win[2] = lum[y0 * width + x2];
      win[3] = lum[y * width + x0];
      win[4] = lum[y * width + x];
      win[5] = lum[y * width + x2];
      win[6] = lum[y2 * width + x0];
      win[7] = lum[y2 * width + x];
      win[8] = lum[y2 * width + x2];
      // Insertion sort of nine values; the fifth is the median.
      for (let i = 1; i < 9; i++) {
        const v = win[i];
        let j = i - 1;
        while (j >= 0 && win[j] > v) {
          win[j + 1] = win[j];
          j--;
        }
        win[j + 1] = v;
      }
      out[y * width + x] = lum[y * width + x] - win[4];
    }
  }
  return out;
}

/** Grey RGBA pixels of the noise map: the size of the residual times the amplitude, capped at 255. */
export function renderNoisePixels(residual: ArrayLike<number>, amplitude: number): Uint8ClampedArray {
  const amp = clampNoiseAmplitude(amplitude);
  const out = new Uint8ClampedArray(residual.length * 4);
  for (let p = 0, i = 0; p < residual.length; p++, i += 4) {
    const v = Math.abs(residual[p]) * amp;
    out[i] = v;
    out[i + 1] = v;
    out[i + 2] = v;
    out[i + 3] = 255;
  }
  return out;
}

export interface NoiseCell {
  row: number;
  col: number;
  /** Mean size of the residual in this area, in brightness levels. */
  level: number;
}

export interface NoiseFinding {
  rows: number;
  cols: number;
  cells: NoiseCell[];
  /** Grain of the typical (median) area. */
  typical: number;
  /** Areas with far less grain than the typical area. */
  smooth: NoiseCell[];
  /** Areas with far more grain than the typical area. */
  grainy: NoiseCell[];
  /** True when the picture has too little grain anywhere for a comparison to mean something. */
  quiet: boolean;
}

/** Cuts the residual into up to 8 by 8 areas and compares each area's grain with the typical one. */
export function analyzeNoiseAreas(residual: ArrayLike<number>, width: number, height: number): NoiseFinding {
  if (residual.length !== width * height) throw new Error('Residual buffer does not match the size');
  const { maxCells, minCellSide, quietPicture, smoothShare, grainyTimes } = NOISE_AREAS;
  const longer = Math.max(width, height);
  const side = Math.max(minCellSide, Math.ceil(longer / maxCells));
  const cols = Math.max(1, Math.min(maxCells, Math.floor(width / side)));
  const rows = Math.max(1, Math.min(maxCells, Math.floor(height / side)));
  const cells: NoiseCell[] = [];
  for (let row = 0; row < rows; row++) {
    const yStart = Math.floor((row * height) / rows);
    const yEnd = Math.floor(((row + 1) * height) / rows);
    for (let col = 0; col < cols; col++) {
      const xStart = Math.floor((col * width) / cols);
      const xEnd = Math.floor(((col + 1) * width) / cols);
      let sum = 0;
      let count = 0;
      for (let y = yStart; y < yEnd; y++) {
        for (let x = xStart; x < xEnd; x++) {
          sum += Math.abs(residual[y * width + x]);
          count++;
        }
      }
      cells.push({ row, col, level: count ? sum / count : 0 });
    }
  }
  const sorted = cells.map((c) => c.level).sort((a, b) => a - b);
  const typical = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
  const quiet = typical < quietPicture;
  const comparable = !quiet && cells.length >= 4;
  return {
    rows,
    cols,
    cells,
    typical,
    quiet,
    smooth: comparable ? cells.filter((c) => c.level < typical * smoothShare) : [],
    grainy: comparable ? cells.filter((c) => c.level > typical * grainyTimes) : [],
  };
}

export interface NoiseReport {
  headline: string;
  notes: string[];
}

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/** Plain-language reading of the area comparison. Never says edited or untouched. */
export function describeNoise(finding: NoiseFinding): NoiseReport {
  const total = finding.cells.length;
  if (finding.quiet) {
    return {
      headline: 'This picture has almost no grain to compare.',
      notes: [
        'That is normal for screenshots, drawings, posters and pictures that an app has smoothed or compressed hard. The map will look mostly black with thin bright lines along edges and letters.',
        'With so little grain, this view cannot show whether one part came from somewhere else. The ELA view and the area by area check are more useful here.',
      ],
    };
  }
  if (total < 4) {
    return {
      headline: 'The picture is too small to compare the grain of its areas.',
      notes: ['You can still look at the map: grain should look alike across similar surfaces.'],
    };
  }
  const notes: string[] = [];
  const { smooth, grainy } = finding;
  let headline: string;
  if (!smooth.length && !grainy.length) {
    headline = `The grain looks alike across the picture (${total} areas compared).`;
    notes.push('No area is far smoother or far grainier than the typical one. An edit that kept or matched the grain, or a picture re-saved after the edit, looks the same.');
  } else {
    const parts: string[] = [];
    if (smooth.length) parts.push(`${plural(smooth.length, 'area is', 'areas are')} much smoother`);
    if (grainy.length) parts.push(`${plural(grainy.length, 'area is', 'areas are')} much grainier`);
    headline = `${parts.join(' and ')} than the typical area (${total} compared).`;
    headline = headline.charAt(0).toUpperCase() + headline.slice(1);
    if (smooth.length) {
      notes.push('Smooth areas appear dark on the map. Clear sky, plain walls, blurred backgrounds and blown-out highlights are smooth by themselves. Skin that is smoother than the rest of the same face, or a smooth patch with a sharp outline in the middle of a grainy surface, is what airbrushing and erased objects tend to leave.');
    }
    if (grainy.length) {
      notes.push('Grainy areas appear bright on the map. Hair, grass, fabric, text and other fine detail are bright by themselves. A block of grain with straight borders on a surface that is smooth elsewhere can be a pasted part or a sharpened one.');
    }
    if (smooth.length + grainy.length > total / 2) {
      notes.push('More than half of the areas differ from the typical one, so this picture simply mixes very smooth and very detailed parts. Compare like with like: one patch of sky with another, one cheek with the other.');
    }
  }
  notes.push('Look for a change of grain that follows the outline of an object or a straight box, not the natural border between two surfaces.');
  return { headline, notes };
}

/** One sentence for the live region under the slider. */
export function describeNoiseView(amplitude: number): string {
  return `Fine grain shown ${clampNoiseAmplitude(amplitude)} times brighter. Dark means smooth, bright means grain or a thin edge.`;
}

export interface NoiseViewRenderer {
  width: number;
  height: number;
  finding: NoiseFinding;
  /** Draws the noise map at this amplitude and returns it as a PNG data URL. */
  render(amplitude: number): string;
}

/** Browser only. The residual is computed once; moving the slider only redraws it. */
export function createNoiseViewRenderer(img: HTMLImageElement): NoiseViewRenderer {
  const naturalWidth = img.naturalWidth || img.width;
  const naturalHeight = img.naturalHeight || img.height;
  if (naturalWidth === 0 || naturalHeight === 0) throw new Error('Image has no pixels');
  const { width, height } = fitElaViewSize(naturalWidth, naturalHeight);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D unavailable');
  // A see-through picture is judged on white, the way it is usually shown.
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  const residual = medianResidual(toLuminance(ctx.getImageData(0, 0, width, height).data, width, height), width, height);
  const finding = analyzeNoiseAreas(residual, width, height);
  return {
    width,
    height,
    finding,
    render(amplitude) {
      const imageData = ctx.createImageData(width, height);
      imageData.data.set(renderNoisePixels(residual, amplitude));
      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL('image/png');
    },
  };
}
