/**
 * Adjustable Error Level Analysis (ELA) view.
 *
 * The verdict shown on the page still comes from `analyzeImageForensics` (fixed settings).
 * These helpers only redraw the picture the visitor looks at, so moving a slider can never
 * change the result wording.
 */

export interface ElaViewSettings {
  /** JPEG quality used for the comparison re-save, in percent. */
  quality: number;
  /** How much each difference is multiplied so it becomes visible. */
  scale: number;
  /** How strongly the original picture is laid over the ELA map, in percent. */
  overlay: number;
}

export const ELA_VIEW_LIMITS = {
  quality: { min: 50, max: 98, step: 1 },
  scale: { min: 5, max: 60, step: 1 },
  overlay: { min: 0, max: 100, step: 5 },
} as const;

export const DEFAULT_ELA_VIEW: ElaViewSettings = { quality: 75, scale: 25, overlay: 0 };

/** Longest side used for the view, the same bound the verdict analysis uses. */
export const ELA_VIEW_MAX_SIDE = 1600;

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (typeof n !== 'number' || !Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

/** Turns slider input (strings, missing or out-of-range values) into safe settings. */
export function clampElaViewSettings(input: Partial<Record<keyof ElaViewSettings, unknown>> = {}): ElaViewSettings {
  const { quality, scale, overlay } = ELA_VIEW_LIMITS;
  return {
    quality: clampNumber(input.quality, quality.min, quality.max, DEFAULT_ELA_VIEW.quality),
    scale: clampNumber(input.scale, scale.min, scale.max, DEFAULT_ELA_VIEW.scale),
    overlay: clampNumber(input.overlay, overlay.min, overlay.max, DEFAULT_ELA_VIEW.overlay),
  };
}

export function isDefaultElaView(settings: ElaViewSettings): boolean {
  return (
    settings.quality === DEFAULT_ELA_VIEW.quality &&
    settings.scale === DEFAULT_ELA_VIEW.scale &&
    settings.overlay === DEFAULT_ELA_VIEW.overlay
  );
}

/**
 * Builds the RGBA pixels of an ELA map: per channel, the difference between the picture and
 * its re-saved copy, multiplied by `scale` and capped at 255. Alpha is always opaque.
 */
export function computeElaPixels(
  original: ArrayLike<number>,
  resaved: ArrayLike<number>,
  scale: number,
): Uint8ClampedArray {
  if (original.length !== resaved.length || original.length % 4 !== 0) {
    throw new Error('ELA needs two RGBA buffers of the same size');
  }
  const factor = Number.isFinite(scale) && scale > 0 ? scale : DEFAULT_ELA_VIEW.scale;
  const out = new Uint8ClampedArray(original.length);
  for (let i = 0; i < original.length; i += 4) {
    out[i] = Math.abs(original[i] - resaved[i]) * factor;
    out[i + 1] = Math.abs(original[i + 1] - resaved[i + 1]) * factor;
    out[i + 2] = Math.abs(original[i + 2] - resaved[i + 2]) * factor;
    out[i + 3] = 255;
  }
  return out;
}

/** Scales a picture down to at most 1600 pixels a side without changing its shape. */
export function fitElaViewSize(width: number, height: number): { width: number; height: number } {
  const ratio = Math.min(1, ELA_VIEW_MAX_SIDE / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * ratio)), height: Math.max(1, Math.round(height * ratio)) };
}

/** One plain sentence describing the current settings, for the live region under the sliders. */
export function describeElaView(settings: ElaViewSettings): string {
  const parts = [
    `Compared with a ${settings.quality}% quality re-save`,
    `differences shown ${settings.scale} times brighter`,
  ];
  if (settings.overlay > 0) parts.push(`original picture laid over at ${settings.overlay}%`);
  return `${parts.join(', ')}.`;
}

export interface ElaViewRenderer {
  /** Size of the map in pixels (the picture is scaled down to at most 1600 a side). */
  width: number;
  height: number;
  /** Draws the ELA map for these settings and returns it as a PNG data URL. */
  render(settings: Pick<ElaViewSettings, 'quality' | 'scale'>): Promise<string>;
}

/**
 * Browser only. Keeps the picture's pixels and the last re-saved copy, so moving the scale
 * slider does not encode the JPEG again.
 */
export function createElaViewRenderer(img: HTMLImageElement): ElaViewRenderer {
  const naturalWidth = img.naturalWidth || img.width;
  const naturalHeight = img.naturalHeight || img.height;
  if (naturalWidth === 0 || naturalHeight === 0) throw new Error('Image has no pixels');
  const { width, height } = fitElaViewSize(naturalWidth, naturalHeight);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D unavailable');
  ctx.drawImage(img, 0, 0, width, height);
  const original = ctx.getImageData(0, 0, width, height).data;

  const scratch = document.createElement('canvas');
  scratch.width = width;
  scratch.height = height;
  const scratchCtx = scratch.getContext('2d', { willReadFrequently: true });
  if (!scratchCtx) throw new Error('Canvas 2D unavailable');

  let cachedQuality = -1;
  let cachedResaved: Uint8ClampedArray | null = null;

  async function resave(quality: number): Promise<Uint8ClampedArray> {
    if (cachedResaved && cachedQuality === quality) return cachedResaved;
    const jpegUrl = canvas.toDataURL('image/jpeg', quality / 100);
    const reloaded = await new Promise<HTMLImageElement>((resolve, reject) => {
      const temp = new Image();
      temp.onload = () => resolve(temp);
      temp.onerror = () => reject(new Error('Could not re-save the picture for comparison'));
      temp.src = jpegUrl;
    });
    scratchCtx!.drawImage(reloaded, 0, 0, width, height);
    cachedResaved = scratchCtx!.getImageData(0, 0, width, height).data;
    cachedQuality = quality;
    return cachedResaved;
  }

  return {
    width,
    height,
    async render(settings) {
      const safe = clampElaViewSettings(settings);
      const resaved = await resave(safe.quality);
      const pixels = computeElaPixels(original, resaved, safe.scale);
      const imageData = scratchCtx!.createImageData(width, height);
      imageData.data.set(pixels);
      const out = document.createElement('canvas');
      out.width = width;
      out.height = height;
      const outCtx = out.getContext('2d');
      if (!outCtx) throw new Error('Canvas 2D unavailable');
      outCtx.putImageData(imageData, 0, 0);
      return out.toDataURL('image/png');
    },
  };
}
