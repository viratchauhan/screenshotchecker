// Bounds canvas working buffers; browser decoding and OCR WASM have additional costs.
export function imageProcessingScale(width: number, height: number): number {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1)
    throw new Error('This image has invalid dimensions. Please upload another image.');
  if (width * height > 4_000_000 || Math.max(width, height) > 8192)
    throw new Error('This image is too large to process safely. Crop or resize it to 4 megapixels or less, with each side at most 8192 pixels, then try again.');
  const wanted = width < 1200 && height < 1200 ? 2 : width < 600 ? 3 : 1;
  // Integer scaling preserves exact OCR-to-original coordinate mapping.
  let scale = wanted;
  while (scale > 1 && (width * height * scale * scale > 4_000_000 || Math.max(width, height) * scale > 8192)) scale--;
  return scale;
}
