import type { TopCategory, CategorySubtype, ConfidenceLevel } from '../types';

export interface MLModelMetadata {
  id: string;
  name: string;
  version: string;
  runtime: 'wasm' | 'webgpu' | 'webgl' | 'cpu';
  sizeBytes: number;
  isLoaded: boolean;
}

export interface VisionClassificationResult {
  topCategory: TopCategory;
  subtype: CategorySubtype;
  confidence: ConfidenceLevel;
  numericScore: number;
  detectedFeatures: string[];
}

export interface SyntheticDetectionResult {
  isLikelySynthetic: boolean;
  score: number;
  indicators: string[];
  status: 'ANALYSIS_AVAILABLE' | 'MODEL_UNAVAILABLE' | 'FALLBACK_HEURISTIC';
}

export interface VisionClassifier {
  metadata: MLModelMetadata;
  load(): Promise<void>;
  classify(imageCanvas: HTMLCanvasElement | ImageData): Promise<VisionClassificationResult>;
}

export interface SyntheticImageDetector {
  metadata: MLModelMetadata;
  load(): Promise<void>;
  detect(imageCanvas: HTMLCanvasElement | ImageData): Promise<SyntheticDetectionResult>;
}

export interface LayoutClassifier {
  metadata: MLModelMetadata;
  analyzeLayout(imageCanvas: HTMLCanvasElement): Promise<{ layoutType: string; regions: any[] }>;
}

export class RuntimeCapabilities {
  static check(): {
    hasWebAssembly: boolean;
    hasWebWorker: boolean;
    hasWebGPU: boolean;
    hasOffscreenCanvas: boolean;
  } {
    const hasWebAssembly = typeof WebAssembly !== 'undefined';
    const hasWebWorker = typeof Worker !== 'undefined';
    const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator;
    const hasOffscreenCanvas = typeof OffscreenCanvas !== 'undefined';

    return {
      hasWebAssembly,
      hasWebWorker,
      hasWebGPU,
      hasOffscreenCanvas,
    };
  }
}
