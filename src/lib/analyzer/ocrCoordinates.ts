import type { Worker, ImageLike, Page } from 'tesseract.js';
import type { OCRWord } from './types';

export interface OCRGeometry {
  scale: number;
  width?: number;
  height?: number;
}

/** Flatten current Tesseract blocks; never invent a location for an invalid box. */
export function extractOCRWords(data: Pick<Page, 'blocks'>, geometry: OCRGeometry): OCRWord[] {
  const validScale = Number.isFinite(geometry.scale) && geometry.scale > 0;
  return (data.blocks ?? []).flatMap(block => block.paragraphs ?? [])
    .flatMap(paragraph => paragraph.lines ?? [])
    .flatMap(line => line.words ?? [])
    .filter(word => typeof word.text === 'string' && word.text.trim().length > 0)
    .map(word => {
      const result: OCRWord = { text: word.text };
      const b = word.bbox;
      if (!validScale || !b || ![b.x0, b.y0, b.x1, b.y1].every(Number.isFinite) || b.x1 <= b.x0 || b.y1 <= b.y0) return result;
      const bound = (value: number, max?: number) => Math.max(0, Math.min(value, max !== undefined && Number.isFinite(max) && max > 0 ? max : Infinity));
      // Round outward so fractional scaling does not cut off text at the edges.
      const bbox = {
        x0: bound(Math.floor(b.x0 / geometry.scale), geometry.width),
        y0: bound(Math.floor(b.y0 / geometry.scale), geometry.height),
        x1: bound(Math.ceil(b.x1 / geometry.scale), geometry.width),
        y1: bound(Math.ceil(b.y1 / geometry.scale), geometry.height),
      };
      if (bbox.x1 > bbox.x0 && bbox.y1 > bbox.y0) result.bbox = bbox;
      return result;
    });
}

export async function recognizeWithCoordinates(
  worker: Pick<Worker, 'recognize'>,
  input: ImageLike,
  geometry: OCRGeometry,
  fallback?: ImageLike,
) {
  let result = await worker.recognize(input, {}, { text: true, blocks: true });
  let selectedGeometry = geometry;
  if (!result.data.text.trim() && fallback) {
    const retry = await worker.recognize(fallback, {}, { text: true, blocks: true });
    if (retry.data.text.trim()) {
      result = retry;
      selectedGeometry = { ...geometry, scale: 1 };
    }
  }
  return { data: result.data, words: extractOCRWords(result.data, selectedGeometry) };
}
