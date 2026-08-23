export type ComparisonMode =
  | 'side-by-side'
  | 'overlay'
  | 'flicker'
  | 'diff'
  | 'semantic'
  | 'game';

export type DifferenceSensitivity = 'low' | 'medium' | 'high';

export type DiffVisualizationType = 'heatmap' | 'boxes' | 'clean';

export type DifferenceCategory =
  | 'Added'
  | 'Removed'
  | 'Moved'
  | 'Resized'
  | 'Color Changed'
  | 'Text Changed'
  | 'Shape Changed'
  | 'Layout Shift'
  | 'Other';

export interface BoundingBox {
  x: number; // relative [0..1] or pixel coords
  y: number;
  width: number;
  height: number;
  pixelX: number;
  pixelY: number;
  pixelWidth: number;
  pixelHeight: number;
}

export interface DifferenceRegion {
  id: string;
  index: number;
  box: BoundingBox;
  category: DifferenceCategory;
  pixelCount: number;
  intensity: number; // 0..1
  centroid: { x: number; y: number };
  imageAExcerpt?: string;
  imageBExcerpt?: string;
  title: string;
  description: string;
  locationName: string;
  confidence: number; // 0..100
  isTextChange?: boolean;
  textA?: string;
  textB?: string;
  foundInGame?: boolean;
}

export interface TextDifferenceItem {
  type: 'added' | 'removed' | 'changed';
  textA?: string;
  textB?: string;
  location?: string;
  box?: BoundingBox;
}

export interface ComparisonAnalysisResult {
  similarityScore: number; // 0..100%
  totalDifferencesCount: number;
  categoryCounts: Record<DifferenceCategory, number>;
  regions: DifferenceRegion[];
  textDifferences: TextDifferenceItem[];
  noiseFilteredCount: number;
  isLikelyScreenshot: boolean;
  alignmentOffset: { dx: number; dy: number; scale: number };
  dimensions: {
    imageA: { width: number; height: number; aspectRatio: number };
    imageB: { width: number; height: number; aspectRatio: number };
    normalized: { width: number; height: number };
  };
  summary: string;
}

export interface GameState {
  targetCount: number;
  foundCount: number;
  score: number;
  wrongClicks: number;
  hintsUsed: number;
  elapsedSeconds: number;
  isCompleted: boolean;
  isPlaying: boolean;
  discoveredRegionIds: string[];
  activeHint?: {
    level: 1 | 2 | 3;
    regionId: string;
    text: string;
    broadArea?: BoundingBox;
    exactBox?: BoundingBox;
  };
}
