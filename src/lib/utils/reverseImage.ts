import { loadImageFromDataUrl } from '../analyzer/imageInfo';

export function validateReverseFile(file: Pick<File, 'type' | 'size'>) {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new Error('Choose a PNG, JPEG or WebP image. Convert other formats first.');
  if (file.size <= 0 || file.size > 10 * 1024 * 1024) throw new Error('Choose a non-empty image no larger than 10 MB.');
}

export async function prepareReverseImage(source: File) {
  validateReverseFile(source);
  const url = URL.createObjectURL(source);
  try {
    const image = await loadImageFromDataUrl(url);
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Image preparation is unavailable in this browser.');
    context.drawImage(image, 0, 0);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(
      value => value ? resolve(value) : reject(new Error('Could not prepare a PNG. Try another image.')), 'image/png',
    ));
    return { file: new File([blob], 'search-image.png', { type: 'image/png' }), width: canvas.width, height: canvas.height };
  } finally { URL.revokeObjectURL(url); }
}

export interface CropRect { x: number; y: number; width: number; height: number }

/** Keeps a crop rectangle inside the image and at least `min` pixels on each side. */
export function clampCropRect(rect: CropRect, imageWidth: number, imageHeight: number, min = 16): CropRect {
  const x = Math.max(0, Math.min(Math.round(rect.x), imageWidth - min));
  const y = Math.max(0, Math.min(Math.round(rect.y), imageHeight - min));
  const width = Math.max(min, Math.min(Math.round(rect.width), imageWidth - x));
  const height = Math.max(min, Math.min(Math.round(rect.height), imageHeight - y));
  return { x, y, width, height };
}

/**
 * Finds the area inside solid-colour borders (letterboxing, plain bars, padding).
 * A row or column counts as border while every pixel stays within `tolerance` of the corner colour.
 * Returns the whole image when nothing can be trimmed or trimming would leave less than 10% of it.
 */
export function findTrimBounds(data: Uint8ClampedArray, width: number, height: number, tolerance = 12): CropRect {
  const at = (x: number, y: number) => (y * width + x) * 4;
  const base = at(0, 0);
  const ref = [data[base], data[base + 1], data[base + 2]];
  const same = (i: number) => Math.abs(data[i] - ref[0]) <= tolerance && Math.abs(data[i + 1] - ref[1]) <= tolerance && Math.abs(data[i + 2] - ref[2]) <= tolerance;
  const rowPlain = (y: number) => { for (let x = 0; x < width; x++) if (!same(at(x, y))) return false; return true; };
  const colPlain = (x: number, top: number, bottom: number) => { for (let y = top; y <= bottom; y++) if (!same(at(x, y))) return false; return true; };
  let top = 0; while (top < height - 1 && rowPlain(top)) top++;
  let bottom = height - 1; while (bottom > top && rowPlain(bottom)) bottom--;
  let left = 0; while (left < width - 1 && colPlain(left, top, bottom)) left++;
  let right = width - 1; while (right > left && colPlain(right, top, bottom)) right--;
  const trimmed = { x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
  if (trimmed.width * trimmed.height < width * height * 0.1) return { x: 0, y: 0, width, height };
  return trimmed;
}
