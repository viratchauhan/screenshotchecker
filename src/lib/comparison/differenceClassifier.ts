import type { BoundingBox, DifferenceCategory, DifferenceRegion } from './types';
import type { RawDetectedRegion } from './regionDetector';

/**
 * Returns a human-friendly position descriptor for a bounding box.
 */
export function getLocationName(box: BoundingBox): string {
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  let v = 'Middle';
  if (cy < 0.22) v = 'Top Header';
  else if (cy < 0.42) v = 'Upper Section';
  else if (cy < 0.65) v = 'Center Area';
  else if (cy < 0.85) v = 'Lower Section';
  else v = 'Bottom Bar';

  let h = 'Center';
  if (cx < 0.33) h = 'Left';
  else if (cx > 0.67) h = 'Right';

  return `${v} (${h})`;
}

/**
 * Classifies a difference region into a semantic category based on pixel analysis.
 */
export function classifyDifferenceRegion(
  raw: RawDetectedRegion,
  ctxA: CanvasRenderingContext2D,
  ctxB: CanvasRenderingContext2D,
  index: number
): DifferenceRegion {
  const { box } = raw;
  const px = Math.round(box.pixelX);
  const py = Math.round(box.pixelY);
  const pw = Math.max(1, Math.round(box.pixelWidth));
  const ph = Math.max(1, Math.round(box.pixelHeight));

  const dataA = ctxA.getImageData(px, py, pw, ph).data;
  const dataB = ctxB.getImageData(px, py, pw, ph).data;

  let sumLumaA = 0, sumLumaB = 0;
  let rSumA = 0, gSumA = 0, bSumA = 0;
  let rSumB = 0, gSumB = 0, bSumB = 0;
  let edgeA = 0, edgeB = 0;
  let nonZeroA = 0, nonZeroB = 0;

  const count = dataA.length / 4;

  for (let i = 0; i < dataA.length; i += 4) {
    const lumaA = 0.299 * dataA[i] + 0.587 * dataA[i + 1] + 0.114 * dataA[i + 2];
    const lumaB = 0.299 * dataB[i] + 0.587 * dataB[i + 1] + 0.114 * dataB[i + 2];

    sumLumaA += lumaA;
    sumLumaB += lumaB;

    rSumA += dataA[i]; gSumA += dataA[i + 1]; bSumA += dataA[i + 2];
    rSumB += dataB[i]; gSumB += dataB[i + 1]; bSumB += dataB[i + 2];

    if (dataA[i + 3] > 20 && lumaA < 240) nonZeroA++;
    if (dataB[i + 3] > 20 && lumaB < 240) nonZeroB++;

    // High frequency horizontal edge count
    if (i > 4) {
      const prevLumaA = 0.299 * dataA[i - 4] + 0.587 * dataA[i - 3] + 0.114 * dataA[i - 2];
      const prevLumaB = 0.299 * dataB[i - 4] + 0.587 * dataB[i - 3] + 0.114 * dataB[i - 2];
      if (Math.abs(lumaA - prevLumaA) > 40) edgeA++;
      if (Math.abs(lumaB - prevLumaB) > 40) edgeB++;
    }
  }

  const avgLumaA = sumLumaA / count;
  const avgLumaB = sumLumaB / count;

  const meanRA = rSumA / count, meanGA = gSumA / count, meanBA = bSumA / count;
  const meanRB = rSumB / count, meanGB = gSumB / count, meanBB = bSumB / count;

  const colorDist = (Math.abs(meanRA - meanRB) + Math.abs(meanGA - meanGB) + Math.abs(meanBA - meanBB)) / 3;
  const ratioActive = nonZeroB / Math.max(1, nonZeroA);

  let category: DifferenceCategory = 'Other';
  let title = `Visual Difference #${index + 1}`;
  let description = 'Visual discrepancy detected between the two images.';
  let confidence = 85;

  const locationName = getLocationName(box);

  // 1. Text change heuristic (narrow height, high edge density, character-like aspect ratio)
  if ((edgeA > count * 0.12 || edgeB > count * 0.12) && ph < 80) {
    category = 'Text Changed';
    title = `Text or Label Modified`;
    description = `Textual characters or digits altered at ${locationName}.`;
    confidence = 94;
  }
  // 2. Added element (Image B has distinct element where A was background/empty)
  else if (ratioActive > 2.2 || (nonZeroA < count * 0.15 && nonZeroB > count * 0.4)) {
    category = 'Added';
    title = `New Element Present in Image B`;
    description = `An element, icon, or visual object was added in Image B.`;
    confidence = 92;
  }
  // 3. Removed element (Image A had element, Image B is empty/flat)
  else if (ratioActive < 0.45 || (nonZeroB < count * 0.15 && nonZeroA > count * 0.4)) {
    category = 'Removed';
    title = `Element Missing in Image B`;
    description = `An element or graphic visible in Image A is absent in Image B.`;
    confidence = 91;
  }
  // 4. Color change (high hue/saturation distance while structure remains similar)
  else if (colorDist > 45 && Math.abs(edgeA - edgeB) < count * 0.08) {
    category = 'Color Changed';
    title = `Color Scheme or Tint Altered`;
    description = `Color hue or background tone changed noticeably in this region.`;
    confidence = 96;
  }
  // 5. Moved or Layout Shift
  else if (Math.abs(avgLumaA - avgLumaB) > 30 && Math.abs(edgeA - edgeB) > 10) {
    category = 'Moved';
    title = `Element Position Shifted`;
    description = `A visual component or button appears displaced or shifted in coordinates.`;
    confidence = 88;
  } else {
    category = 'Shape Changed';
    title = `Geometry or Feature Modified`;
    description = `Shape contour or graphic feature modified between versions.`;
    confidence = 86;
  }

  return {
    id: `diff-region-${index + 1}`,
    index,
    box,
    category,
    pixelCount: raw.pixelCount,
    intensity: Math.min(1, colorDist / 150 + 0.3),
    centroid: { x: raw.centroidX, y: raw.centroidY },
    title,
    description,
    locationName,
    confidence,
  };
}
