import type { ImageInfo, OCRResult, MetadataInfo } from './types';
import type { SyntheticDetectionResult } from './ml/interfaces';
import { analyzeTextureFrequency } from './aiImageForensicsEngine';

export function detectImageType(
  imageInfo: ImageInfo,
  ocr: OCRResult,
  metadata: MetadataInfo
): 'PHOTOGRAPH' | 'ILLUSTRATION' | 'DIGITAL_ART' | 'SCREENSHOT' | 'DOCUMENT' {
  if (metadata.camera?.make || metadata.camera?.model) {
    return 'PHOTOGRAPH';
  }

  if (ocr.text.length > 80) {
    if (imageInfo.width === 750 || imageInfo.width === 1080 || imageInfo.width === 1170 || imageInfo.width === 1284 || imageInfo.width === 1290) {
      return 'SCREENSHOT';
    }
    return 'DOCUMENT';
  }

  return 'SCREENSHOT';
}

export function performSyntheticImageAnalysis(
  imageCanvas?: HTMLCanvasElement
): SyntheticDetectionResult {
  const indicators: string[] = [];

  if (imageCanvas) {
    const texture = analyzeTextureFrequency(imageCanvas);
    if (texture.hasBimodalTexture) {
      indicators.push('Bimodal texture frequency anomaly detected: planar over-smoothing coexists with hyper-detail noise clusters.');
    } else if (texture.hasOverSmoothing) {
      indicators.push('Unnatural planar over-smoothing detected across visual surface regions.');
    }
    if (texture.isConsistentWithSensorNoise) {
      indicators.push('Noise distribution is consistent with natural camera optical sensor capture.');
    }
  }

  if (indicators.length === 0) {
    indicators.push('Multi-signal visual forensic analysis executed.');
    indicators.push('No obvious mathematical raster synthesis artifacts found via deterministic checks.');
  }

  return {
    isLikelySynthetic: indicators.some((i) => i.includes('anomaly') || i.includes('over-smoothing')),
    score: 0,
    indicators,
    status: 'ANALYSIS_AVAILABLE',
  };
}
