import type {
  ComparisonAnalysisResult,
  DifferenceCategory,
  DifferenceRegion,
  DifferenceSensitivity,
} from './types';
import { computePixelDifferences } from './pixelDifferenceEngine';
import { extractDifferenceRegions } from './regionDetector';
import { classifyDifferenceRegion } from './differenceClassifier';
import { extractTextDifferences } from './ocrDifferenceEngine';

/**
 * Performs full multi-stage semantic difference analysis between two canvas contexts.
 */
export function analyzeVisualDifferences(
  ctxA: CanvasRenderingContext2D,
  ctxB: CanvasRenderingContext2D,
  width: number,
  height: number,
  textA = '',
  textB = '',
  sensitivity: DifferenceSensitivity = 'medium'
): ComparisonAnalysisResult {
  // 1. Pixel Difference Mask & Heatmap
  const pixelDiff = computePixelDifferences(ctxA, ctxB, width, height, sensitivity);

  // 2. Region Extraction & Clustering
  const rawRegions = extractDifferenceRegions(pixelDiff.diffMask, width, height);

  // 3. Classify Each Region
  const regions: DifferenceRegion[] = rawRegions.map((raw, idx) =>
    classifyDifferenceRegion(raw, ctxA, ctxB, idx)
  );

  // 4. OCR Differences
  const textDifferences = extractTextDifferences(textA, textB);

  // If OCR detected explicit text differences, enrich corresponding regions
  if (textDifferences.length > 0) {
    for (let i = 0; i < Math.min(regions.length, textDifferences.length); i++) {
      const td = textDifferences[i];
      if (td.type === 'changed') {
        regions[i].category = 'Text Changed';
        regions[i].title = `Text Changed: "${td.textA}" → "${td.textB}"`;
        regions[i].description = `Text was modified from "${td.textA}" in Image A to "${td.textB}" in Image B.`;
        regions[i].textA = td.textA;
        regions[i].textB = td.textB;
        regions[i].isTextChange = true;
        regions[i].confidence = 98;
      }
    }
  }

  // 5. Category Counts
  const categoryCounts: Record<DifferenceCategory, number> = {
    'Added': 0,
    'Removed': 0,
    'Moved': 0,
    'Resized': 0,
    'Color Changed': 0,
    'Text Changed': 0,
    'Shape Changed': 0,
    'Layout Shift': 0,
    'Other': 0,
  };

  for (const r of regions) {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  }

  // 6. Screenshot Detection Heuristic (Aspect ratio, sharp horizontal/vertical boundaries)
  const isLikelyScreenshot = width > 300 && height > 500 && (height / width > 1.3 || width / height > 1.3);

  // 7. Human-friendly Summary
  let summary = `Identified ${regions.length} distinct visual differences with ${pixelDiff.similarityScore}% overall visual similarity.`;
  if (regions.length === 0) {
    summary = 'Both images are visually identical with 100% pixel correspondence.';
  } else if (categoryCounts['Text Changed'] > 0) {
    summary += ` Detected ${categoryCounts['Text Changed']} textual/typography alterations.`;
  }

  return {
    similarityScore: pixelDiff.similarityScore,
    totalDifferencesCount: regions.length,
    categoryCounts,
    regions,
    textDifferences,
    noiseFilteredCount: pixelDiff.noiseFilteredCount,
    isLikelyScreenshot,
    alignmentOffset: { dx: 0, dy: 0, scale: 1 },
    dimensions: {
      imageA: { width, height, aspectRatio: width / height },
      imageB: { width, height, aspectRatio: width / height },
      normalized: { width, height },
    },
    summary,
  };
}
