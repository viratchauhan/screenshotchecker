import type { DifferenceSensitivity } from './types';

export interface PixelDiffOutput {
  diffMask: Uint8Array; // 1 for significant diff, 0 for identical/noise
  diffHeatmapData: ImageData;
  diffPixelCount: number;
  totalPixelCount: number;
  similarityScore: number; // 0..100%
  noiseFilteredCount: number;
  width: number;
  height: number;
}

/**
 * Checks if a pixel difference is likely an anti-aliasing or subpixel rendering artifact
 */
function isAntiAliased(
  dataA: Uint8ClampedArray,
  dataB: Uint8ClampedArray,
  x: number,
  y: number,
  width: number,
  height: number
): boolean {
  // Check 3x3 local neighborhood
  let minA = 255, maxA = 0;
  let minB = 255, maxB = 0;

  for (let dy = -1; dy <= 1; dy++) {
    const ny = y + dy;
    if (ny < 0 || ny >= height) continue;
    for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx;
      if (nx < 0 || nx >= width) continue;

      const idx = (ny * width + nx) * 4;
      const lumaA = 0.299 * dataA[idx] + 0.587 * dataA[idx + 1] + 0.114 * dataA[idx + 2];
      const lumaB = 0.299 * dataB[idx] + 0.587 * dataB[idx + 1] + 0.114 * dataB[idx + 2];

      if (lumaA < minA) minA = lumaA;
      if (lumaA > maxA) maxA = lumaA;
      if (lumaB < minB) minB = lumaB;
      if (lumaB > maxB) maxB = lumaB;
    }
  }

  // If both local regions have high contrast (typical of text/edge transitions), it's anti-aliased
  return (maxA - minA > 30) && (maxB - minB > 30);
}

/**
 * Computes difference mask and heatmap with intelligent noise & anti-aliasing filtering.
 */
export function computePixelDifferences(
  ctxA: CanvasRenderingContext2D,
  ctxB: CanvasRenderingContext2D,
  width: number,
  height: number,
  sensitivity: DifferenceSensitivity = 'medium'
): PixelDiffOutput {
  const imgDataA = ctxA.getImageData(0, 0, width, height);
  const imgDataB = ctxB.getImageData(0, 0, width, height);
  const dataA = imgDataA.data;
  const dataB = imgDataB.data;

  const totalPixels = width * height;
  const diffMask = new Uint8Array(totalPixels);

  // Configure sensitivity thresholds
  let colorThreshold = 28;
  if (sensitivity === 'low') colorThreshold = 45; // Ignore compression/rendering differences
  if (sensitivity === 'high') colorThreshold = 14; // Detect tiny changes

  const heatmap = new ImageData(width, height);
  const heatData = heatmap.data;

  let diffCount = 0;
  let noiseFilteredCount = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const pixelIdx = y * width + x;

      const rA = dataA[i];
      const gA = dataA[i + 1];
      const bA = dataA[i + 2];
      const aA = dataA[i + 3];

      const rB = dataB[i];
      const gB = dataB[i + 1];
      const bB = dataB[i + 2];
      const aB = dataB[i + 3];

      // Alpha channel disparity
      const alphaDiff = Math.abs(aA - aB);

      // Color distance in RGB space
      const dr = Math.abs(rA - rB);
      const dg = Math.abs(gA - gB);
      const db = Math.abs(bA - bB);
      const colorDist = (dr + dg + db) / 3;

      const isDiff = colorDist > colorThreshold || alphaDiff > 35;

      if (isDiff) {
        // Test for anti-aliasing edge jitter
        if (colorDist < colorThreshold * 1.6 && isAntiAliased(dataA, dataB, x, y, width, height)) {
          noiseFilteredCount++;
          // Render subdued unchanged background
          const gray = Math.round((rA * 0.299 + gA * 0.587 + bA * 0.114) * 0.35);
          heatData[i] = gray;
          heatData[i + 1] = gray;
          heatData[i + 2] = gray;
          heatData[i + 3] = 255;
          continue;
        }

        diffMask[pixelIdx] = 1;
        diffCount++;

        // Heatmap color intensity based on difference magnitude
        const intensity = Math.min(255, Math.round((colorDist / 255) * 200 + 55));
        heatData[i] = intensity; // Red channel
        heatData[i + 1] = Math.max(0, 50 - intensity / 4); // Green channel
        heatData[i + 2] = Math.max(0, 50 - intensity / 4); // Blue channel
        heatData[i + 3] = 255;
      } else {
        // Subdued background for clear contrast
        const gray = Math.round((rA * 0.299 + gA * 0.587 + bA * 0.114) * 0.35);
        heatData[i] = gray;
        heatData[i + 1] = gray;
        heatData[i + 2] = gray;
        heatData[i + 3] = 255;
      }
    }
  }

  const similarityScore = Math.max(0, Math.min(100, Math.round(((totalPixels - diffCount) / totalPixels) * 1000) / 10));

  return {
    diffMask,
    diffHeatmapData: heatmap,
    diffPixelCount: diffCount,
    totalPixelCount: totalPixels,
    similarityScore,
    noiseFilteredCount,
    width,
    height,
  };
}
