import ExifReader from 'exifreader';
import { runClientOCR } from './ocr';
import type { OCRResult } from './types';
import { analyzeC2PA } from './c2pa/c2paService';
import { extractC2PAForensicSignals } from './c2pa/c2paVerdict';
import type { C2PANormalizedResult } from './c2pa/c2paTypes';
import { imageProcessingScale } from './imageLimits';

export interface AIForensicsOptions {
  onProgress?: (stage: string) => void;
  signal?: AbortSignal;
}

export type AIMetaVerdict =
  | 'LIKELY_AI_GENERATED'
  | 'LIKELY_AI_ASSISTED'
  | 'LIKELY_EDITED'
  | 'LIKELY_AUTHENTIC_CAPTURE'
  | 'INCONCLUSIVE';

export type VisualModalityType =
  | 'PHOTOGRAPH'
  | 'DIGITAL_ILLUSTRATION'
  | 'UI_SCREENSHOT'
  | 'SCANNED_DOCUMENT'
  | 'DIGITAL_GRAPHIC'
  | 'UNKNOWN';

export type EvidenceStrength = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ForensicSignal {
  category: 'SYNTHETIC' | 'EDITING' | 'PROVENANCE' | 'CAPTURE' | 'TEXT' | 'TEXTURE';
  signal: string;
  strength: EvidenceStrength;
  description: string;
  evidence: string;
}

export interface ProvenanceDetails {
  hasExif: boolean;
  cameraInfo?: { make?: string; model?: string; lens?: string };
  softwareFound?: string;
  isAISoftware: boolean;
  isEditingSoftware: boolean;
  c2paStatus: 'VERIFIED_AI_GENERATED' | 'VERIFIED_CAMERA_CAPTURE' | 'VERIFIED_EDITED' | 'NO_CREDENTIALS_FOUND' | 'UNSUPPORTED';
  c2paSummary: string;
  dateTime?: string;
}

export interface TextureFrequencyMetrics {
  noiseLevel: number; // 0 - 100
  highFrequencyEnergy: number; // Edge energy
  smoothnessRatio: number; // Ratio of over-smoothed regions
  colorVariance: number;
  gradientUniformity: number;
  hasOverSmoothing: boolean;
  hasBimodalTexture: boolean;
  isConsistentWithSensorNoise: boolean;
}

export interface ElaAnalysisResult {
  elaDataUrl: string;
  anomaliesDetected: boolean;
  maxDisparity: number;
  regionalVariance: number;
  notes: string[];
}

export interface TextForensicsResult {
  textFound: boolean;
  charCount: number;
  wordCount: number;
  hasMalformedText: boolean;
  anomalousWords: string[];
  ocrConfidenceAvg: number;
  notes: string[];
}

export interface AIForensicsReport {
  modality: VisualModalityType;
  modalityLabel: string;
  verdict: AIMetaVerdict;
  verdictLabel: string;
  evidenceStrength: EvidenceStrength;
  executiveSummary: string;
  whyExplanation: string[];
  syntheticSignals: ForensicSignal[];
  editingSignals: ForensicSignal[];
  provenanceSignals: ForensicSignal[];
  captureSignals: ForensicSignal[];
  provenance: ProvenanceDetails;
  c2pa: C2PANormalizedResult;
  textureMetrics: TextureFrequencyMetrics;
  ela: ElaAnalysisResult;
  textAnalysis: TextForensicsResult;
  limitations: string[];
  debugDiagnostics?: {
    imageDimensions: string;
    syntheticScore: number;
    editingScore: number;
    captureScore: number;
    provenanceScore: number;
    analysisConfidence: string;
  };
}

// --------------------------------------------------------------------------
// 1. Provenance & Exif Metadata Extractor
// --------------------------------------------------------------------------

const AI_SOFTWARE_PATTERNS = [
  /\bmidjourney\b/i,
  /\b(stable\s*diffusion|sdxl|automatic1111|comfyui|novelai|invokeai)\b/i,
  /\bdall[-e\s]*\d?\b/i,
  /\b(firefly|adobe\s*firefly)\b/i,
  /\b(leonardo\.?ai|bing\s*image\s*creator|ideogram|flux(?:\.1)?|sora)\b/i,
  /\bgenerated\s*by\s*(?:ai|dall|midjourney|diffusion)\b/i,
  /\bc2pa\.actions\.ai_generated\b/i,
];

const EDITING_SOFTWARE_PATTERNS = [
  /\badobe\s*photoshop\b/i,
  /\badobe\s*lightroom\b/i,
  /\bcanva\b/i,
  /\bgimp\b/i,
  /\bpixelmator\b/i,
  /\baffinity\s*photo\b/i,
  /\bpicsart\b/i,
  /\bsnapseed\b/i,
];

export async function inspectProvenance(file: File | Blob): Promise<ProvenanceDetails> {
  const result: ProvenanceDetails = {
    hasExif: false,
    isAISoftware: false,
    isEditingSoftware: false,
    c2paStatus: 'NO_CREDENTIALS_FOUND',
    c2paSummary: 'No verifiable cryptographic provenance or Content Credentials found.',
  };

  try {
    const arrayBuffer = await file.arrayBuffer();

    try {
      const tags = ExifReader.load(arrayBuffer, { expanded: true });

      // Check EXIF camera info
      if (tags.exif) {
        result.hasExif = true;
        const make = tags.exif.Make?.description;
        const model = tags.exif.Model?.description;
        const lens = tags.exif.LensModel?.description;
        if (make || model || lens) {
          result.cameraInfo = { make, model, lens };
        }
      }

      // Check Software field across EXIF / XMP / PNG chunks
      const software =
        tags.exif?.Software?.description ||
        tags.xmp?.CreatorTool?.description ||
        tags.png?.Software?.description ||
        tags.file?.Software?.description;

      if (software) {
        result.softwareFound = String(software).trim();

        for (const pattern of AI_SOFTWARE_PATTERNS) {
          if (pattern.test(result.softwareFound)) {
            result.isAISoftware = true;
            break;
          }
        }

        for (const pattern of EDITING_SOFTWARE_PATTERNS) {
          if (pattern.test(result.softwareFound)) {
            result.isEditingSoftware = true;
            break;
          }
        }
      }

      // Check DateTime
      const dateTime =
        tags.exif?.DateTimeOriginal?.description ||
        tags.exif?.DateTime?.description ||
        tags.file?.['File Modified Date']?.description;
      if (dateTime) {
        result.dateTime = String(dateTime);
      }
    } catch (exifErr) {
      // ExifReader could not parse EXIF structure; continue to raw byte scan
    }

    // Direct fallback byte scan for raw software tags
    const rawBytes = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const rawText = decoder.decode(rawBytes.subarray(0, Math.min(rawBytes.length, 120000)));

    if (!result.softwareFound) {
      for (const pattern of AI_SOFTWARE_PATTERNS) {
        const match = rawText.match(pattern);
        if (match) {
          result.softwareFound = match[0];
          result.isAISoftware = true;
          break;
        }
      }
    }
  } catch (err) {
    // Normal fallback when files have stripped metadata
  }

  return result;
}

// --------------------------------------------------------------------------
// 2. Texture, Noise, Frequency & Gradient Forensic Analysis
// --------------------------------------------------------------------------

export function analyzeTextureFrequency(canvas: HTMLCanvasElement): TextureFrequencyMetrics {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');

  if (!ctx || width < 10 || height < 10) {
    return {
      noiseLevel: 0,
      highFrequencyEnergy: 0,
      smoothnessRatio: 0,
      colorVariance: 0,
      gradientUniformity: 0,
      hasOverSmoothing: false,
      hasBimodalTexture: false,
      isConsistentWithSensorNoise: false,
    };
  }

  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // Grid-based regional variance (16 cells: 4x4)
  const cols = 4;
  const rows = 4;
  const cellW = Math.floor(width / cols);
  const cellH = Math.floor(height / rows);

  const cellVariances: number[] = [];
  const cellHighFreqEnergies: number[] = [];
  let smoothCellCount = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const startX = c * cellW;
      const startY = r * cellH;
      let sumLum = 0;
      let sumSqLum = 0;
      let highFreqDiffSum = 0;
      let cellPixelCount = 0;

      for (let y = startY; y < startY + cellH && y < height - 1; y += 2) {
        for (let x = startX; x < startX + cellW && x < width - 1; x += 2) {
          const idx = (y * width + x) * 4;
          const lum = 0.299 * pixels[idx] + 0.587 * pixels[idx + 1] + 0.114 * pixels[idx + 2];
          sumLum += lum;
          sumSqLum += lum * lum;
          cellPixelCount++;

          // 2-pixel Laplacian difference
          const rightIdx = (y * width + (x + 1)) * 4;
          const downIdx = ((y + 1) * width + x) * 4;
          const lumRight = 0.299 * pixels[rightIdx] + 0.587 * pixels[rightIdx + 1] + 0.114 * pixels[rightIdx + 2];
          const lumDown = 0.299 * pixels[downIdx] + 0.587 * pixels[downIdx + 1] + 0.114 * pixels[downIdx + 2];

          const diff = Math.abs(lum - lumRight) + Math.abs(lum - lumDown);
          highFreqDiffSum += diff;
        }
      }

      if (cellPixelCount > 0) {
        const meanLum = sumLum / cellPixelCount;
        const variance = Math.max(0, sumSqLum / cellPixelCount - meanLum * meanLum);
        const highFreqAvg = highFreqDiffSum / cellPixelCount;

        cellVariances.push(variance);
        cellHighFreqEnergies.push(highFreqAvg);

        // A cell is over-smoothed if variance is low (< 45) or highFreqAvg is very low (< 2.0)
        if (variance < 45 || highFreqAvg < 2.0) {
          smoothCellCount++;
        }
      }
    }
  }

  const avgVariance = cellVariances.reduce((a, b) => a + b, 0) / Math.max(1, cellVariances.length);
  const avgHighFreq = cellHighFreqEnergies.reduce((a, b) => a + b, 0) / Math.max(1, cellHighFreqEnergies.length);
  const smoothnessRatio = smoothCellCount / Math.max(1, cellVariances.length);

  // Measure variance of high frequency energy across cells (bimodality check)
  const meanHighFreq = avgHighFreq;
  const hfVariance =
    cellHighFreqEnergies.reduce((acc, val) => acc + Math.pow(val - meanHighFreq, 2), 0) /
    Math.max(1, cellHighFreqEnergies.length);
  const hfStdDev = Math.sqrt(hfVariance);

  // Bimodality: mixture of super-flat regions and sharp hyper-detail peaks
  const hasBimodalTexture = smoothnessRatio >= 0.35 && hfStdDev >= 4.2;
  const hasOverSmoothing = smoothnessRatio >= 0.55 && avgHighFreq < 5.0;

  // Natural camera sensor noise: relatively uniform high-frequency distribution
  const isConsistentWithSensorNoise = avgHighFreq >= 4.0 && hfStdDev < 3.5 && smoothnessRatio < 0.25;

  return {
    noiseLevel: Math.min(100, Math.round(avgHighFreq * 10)),
    highFrequencyEnergy: Math.round(avgHighFreq * 10) / 10,
    smoothnessRatio: Math.round(smoothnessRatio * 100) / 100,
    colorVariance: Math.round(avgVariance),
    gradientUniformity: Math.round(hfStdDev * 10) / 10,
    hasOverSmoothing,
    hasBimodalTexture,
    isConsistentWithSensorNoise,
  };
}

// --------------------------------------------------------------------------
// 3. Error Level Analysis (ELA)
// --------------------------------------------------------------------------

export async function computeELA(img: HTMLImageElement): Promise<ElaAnalysisResult> {
  const width = Math.min(img.naturalWidth || img.width, 1400);
  const height = Math.min(img.naturalHeight || img.height, 1400);

  if (width < 20 || height < 20) {
    return {
      elaDataUrl: '',
      anomaliesDetected: false,
      maxDisparity: 0,
      regionalVariance: 0,
      notes: ['Image dimensions insufficient for Error Level Analysis.'],
    };
  }

  const canvasOrig = document.createElement('canvas');
  canvasOrig.width = width;
  canvasOrig.height = height;
  const ctxOrig = canvasOrig.getContext('2d');
  if (!ctxOrig) throw new Error('Canvas 2D unavailable');
  ctxOrig.drawImage(img, 0, 0, width, height);

  const origPixels = ctxOrig.getImageData(0, 0, width, height).data;

  // Resave at 75% JPEG quality
  const jpegUrl = canvasOrig.toDataURL('image/jpeg', 0.75);
  const reloadedJpeg = await new Promise<HTMLImageElement>((resolve, reject) => {
    const temp = new Image();
    temp.onload = () => resolve(temp);
    temp.onerror = reject;
    temp.src = jpegUrl;
  });

  const canvasResaved = document.createElement('canvas');
  canvasResaved.width = width;
  canvasResaved.height = height;
  const ctxResaved = canvasResaved.getContext('2d');
  if (!ctxResaved) throw new Error('Canvas 2D unavailable');
  ctxResaved.drawImage(reloadedJpeg, 0, 0, width, height);

  const resavedPixels = ctxResaved.getImageData(0, 0, width, height).data;

  // Build ELA Difference Map Canvas
  const canvasEla = document.createElement('canvas');
  canvasEla.width = width;
  canvasEla.height = height;
  const ctxEla = canvasEla.getContext('2d');
  if (!ctxEla) throw new Error('Canvas 2D unavailable');
  const elaImageData = ctxEla.createImageData(width, height);
  const elaPixels = elaImageData.data;

  let totalDiff = 0;
  let maxDisparity = 0;
  const amplification = 20;

  const quadDiffs = [0, 0, 0, 0];
  const quadCounts = [0, 0, 0, 0];
  const midX = width / 2;
  const midY = height / 2;

  for (let i = 0; i < origPixels.length; i += 4) {
    const dr = Math.abs(origPixels[i] - resavedPixels[i]);
    const dg = Math.abs(origPixels[i + 1] - resavedPixels[i + 1]);
    const db = Math.abs(origPixels[i + 2] - resavedPixels[i + 2]);

    const pixelDiff = (dr + dg + db) / 3;
    totalDiff += pixelDiff;
    if (pixelDiff > maxDisparity) maxDisparity = pixelDiff;

    elaPixels[i] = Math.min(255, dr * amplification);
    elaPixels[i + 1] = Math.min(255, dg * amplification);
    elaPixels[i + 2] = Math.min(255, db * amplification);
    elaPixels[i + 3] = 255;

    const pixelIndex = i / 4;
    const px = pixelIndex % width;
    const py = Math.floor(pixelIndex / width);
    const qIndex = (px < midX ? 0 : 1) + (py < midY ? 0 : 2);
    quadDiffs[qIndex] += pixelDiff;
    quadCounts[qIndex]++;
  }

  ctxEla.putImageData(elaImageData, 0, 0);
  const elaDataUrl = canvasEla.toDataURL('image/png');

  const quadAverages = quadDiffs.map((d, idx) => (quadCounts[idx] > 0 ? d / quadCounts[idx] : 0));
  const meanQuad = quadAverages.reduce((a, b) => a + b, 0) / 4;
  const variance = quadAverages.reduce((sum, v) => sum + Math.pow(v - meanQuad, 2), 0) / 4;
  const stdDev = Math.sqrt(variance);

  const notes: string[] = [];
  let anomaliesDetected = false;

  if (stdDev > 4.5 && maxDisparity > 38) {
    anomaliesDetected = true;
    notes.push('Localized compression level disparity detected across image regions.');
    notes.push('High-contrast ELA highlights suggest potential localized editing, splicing, or recompression.');
  } else {
    notes.push('Compression error distribution is relatively uniform across the visual plane.');
    notes.push('No extreme localized compression boundary discontinuities found.');
  }

  return {
    elaDataUrl,
    anomaliesDetected,
    maxDisparity: Math.round(maxDisparity * 10) / 10,
    regionalVariance: Math.round(stdDev * 10) / 10,
    notes,
  };
}

// --------------------------------------------------------------------------
// 4. Text & Typography Forensics (using OCR)
// --------------------------------------------------------------------------

export function analyzeTextTypography(ocr: OCRResult): TextForensicsResult {
  const text = ocr.text.trim();
  if (text.length === 0) {
    return {
      textFound: false,
      charCount: 0,
      wordCount: 0,
      hasMalformedText: false,
      anomalousWords: [],
      ocrConfidenceAvg: 0,
      notes: ['No legible typographic text detected in the image.'],
    };
  }

  // Tokenize words
  const rawWords = text
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z]/g, ''))
    .filter((w) => w.length >= 3);

  const anomalousWords: string[] = [];

  for (const word of rawWords) {
    const lower = word.toLowerCase();

    // Check for repetitive impossible consonant clusters (e.g. "fgtrw", "bzkpq")
    const hasConsonantCluster = /[^aeiouy]{5,}/i.test(lower);
    // Check for repetitive identical character sequence (e.g. "aaaa", "eeeey")
    const hasCharRepeat = /(.)\1{3,}/i.test(lower);
    // Check for known AI typo motifs
    const isKnownAiTypo = /\b(marketng|stratgy|congratultions|deliery|secuirty|accont|fiannce)\b/i.test(lower);

    if (hasConsonantCluster || hasCharRepeat || isKnownAiTypo) {
      anomalousWords.push(word);
    }
  }

  const hasMalformedText = anomalousWords.length >= 2;
  const notes: string[] = [];

  if (hasMalformedText) {
    notes.push(`Detected ${anomalousWords.length} malformed/non-dictionary word tokens (${anomalousWords.slice(0, 3).join(', ')}).`);
    notes.push('Malformed character sequences in signage/logos can be a strong visual indicator of generative rendering.');
  } else if (rawWords.length > 0) {
    notes.push(`Detected ${rawWords.length} legible words with consistent typographic structure.`);
  }

  return {
    textFound: true,
    charCount: text.length,
    wordCount: rawWords.length,
    hasMalformedText,
    anomalousWords,
    ocrConfidenceAvg: ocr.confidence,
    notes,
  };
}

// --------------------------------------------------------------------------
// 5. Visual Modality Detector
// --------------------------------------------------------------------------

export function determineVisualModality(
  width: number,
  height: number,
  provenance: ProvenanceDetails,
  textAnalysis: TextForensicsResult,
  texture: TextureFrequencyMetrics,
  rawText: string
): { modality: VisualModalityType; label: string } {
  const lower = rawText.toLowerCase();

  // 1. UI Screenshot Check
  const hasStatusBar = /\b(?:5g|lte|4g|wifi|\d{1,2}:\d{2}\s*(?:am|pm)?|\d{1,3}%)\b/i.test(lower);
  const hasChatBubbles = /\b(?:online|typing\.\.\.|yesterday at \d|today at \d|voice message|read \d{1,2}:\d{2})\b/i.test(lower);
  const isMobileAspectRatio =
    (width === 1080 && (height === 1920 || height === 2340 || height === 2400)) ||
    (width === 1170 && height === 2532) ||
    (width === 1284 && height === 2778) ||
    (width === 1290 && height === 2796) ||
    (width === 750 && height === 1334) ||
    (height > width * 1.7 && hasStatusBar);

  if ((hasStatusBar || hasChatBubbles || isMobileAspectRatio) && textAnalysis.wordCount > 5) {
    return { modality: 'UI_SCREENSHOT', label: 'UI / Screenshot Capture' };
  }

  // 2. Scanned Document Check
  if (textAnalysis.wordCount > 40 && texture.smoothnessRatio > 0.6 && texture.colorVariance < 20) {
    return { modality: 'SCANNED_DOCUMENT', label: 'Scanned Document' };
  }

  // 3. Digital Graphic / Banner Check
  if (textAnalysis.wordCount >= 10 && (texture.hasOverSmoothing || texture.smoothnessRatio > 0.4)) {
    return { modality: 'DIGITAL_GRAPHIC', label: 'Digital Graphic / Banner' };
  }

  // 4. Digital Illustration Check
  if (
    texture.smoothnessRatio >= 0.45 ||
    (texture.colorVariance > 120 && texture.highFrequencyEnergy < 3.2 && !provenance.cameraInfo)
  ) {
    return { modality: 'DIGITAL_ILLUSTRATION', label: 'Digital Illustration' };
  }

  // 5. Photograph Check
  if (provenance.cameraInfo || texture.isConsistentWithSensorNoise) {
    return { modality: 'PHOTOGRAPH', label: 'Camera Photograph' };
  }

  return { modality: 'PHOTOGRAPH', label: 'Photographic Visual' };
}

// --------------------------------------------------------------------------
// 6. Multi-Signal Fusion & Verdict Engine (with Real C2PA)
// --------------------------------------------------------------------------

export async function runFullAIForensics(
  file: File | Blob,
  imgElement: HTMLImageElement,
  options: AIForensicsOptions = {},
): Promise<AIForensicsReport> {
  const width = imgElement.naturalWidth || imgElement.width;
  const height = imgElement.naturalHeight || imgElement.height;
  // Reject before initializing engines or allocating forensic working buffers.
  imageProcessingScale(width, height);
  const stage = async (message: string) => {
    options.signal?.throwIfAborted();
    options.onProgress?.(message);
    // Give the browser an opportunity to display the current step before pixel work.
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    options.signal?.throwIfAborted();
  };

  // 1. Real C2PA Content Credentials Inspection (Runs directly on original bytes)
  await stage('Inspecting Content Credentials (first use may load the engine)...');
  const c2pa = await analyzeC2PA(file);

  // 2. Metadata / EXIF Provenance
  await stage('Reading image metadata...');
  const provenance = await inspectProvenance(file);

  // 3. Canvas & Texture/Frequency Analysis
  await stage('Analyzing noise and texture...');
  const canvas = document.createElement('canvas');
  canvas.width = Math.min(width, 1600);
  canvas.height = Math.min(height, 1600);
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
  }
  const texture = analyzeTextureFrequency(canvas);

  // 4. ELA Forensics
  await stage('Computing Error Level Analysis (ELA)...');
  const ela = await computeELA(imgElement);

  // 5. OCR & Text Typography
  await stage('Reading text (first use may load the OCR engine)...');
  const ocr = await runClientOCR(imgElement);
  await stage('Combining evidence and preparing the report...');
  const textAnalysis = analyzeTextTypography(ocr);

  // 6. Modality
  const { modality, label: modalityLabel } = determineVisualModality(
    width,
    height,
    provenance,
    textAnalysis,
    texture,
    ocr.text
  );

  // 7. Signal Collection
  const syntheticSignals: ForensicSignal[] = [];
  const editingSignals: ForensicSignal[] = [];
  const provenanceSignals: ForensicSignal[] = [];
  const captureSignals: ForensicSignal[] = [];

  let syntheticScore = 0;
  let editingScore = 0;
  let captureScore = 0;
  let provenanceScore = 0;

  // --- C2PA Cryptographic Signals (Highest Evidence Priority) ---
  const c2paForensics = extractC2PAForensicSignals(c2pa);
  syntheticScore += c2paForensics.syntheticBonus;
  editingScore += c2paForensics.editingBonus;
  captureScore += c2paForensics.captureBonus;

  for (const s of c2paForensics.signals) {
    if (s.category === 'SYNTHETIC') syntheticSignals.push(s);
    else if (s.category === 'EDITING') editingSignals.push(s);
    else if (s.category === 'CAPTURE') captureSignals.push(s);
    else provenanceSignals.push(s);
  }

  // --- Metadata Signals ---
  if (provenance.isAISoftware && provenance.softwareFound && !c2pa.ai.isAIGenerated) {
    syntheticScore += 50;
    syntheticSignals.push({
      category: 'SYNTHETIC',
      signal: 'Generative AI Software Metadata',
      strength: 'HIGH',
      description: `Metadata tags reference generative AI creation tools: "${provenance.softwareFound}".`,
      evidence: `Found tag: ${provenance.softwareFound}`,
    });
  }

  if (provenance.cameraInfo) {
    captureScore += 40;
    provenanceScore += 30;
    captureSignals.push({
      category: 'CAPTURE',
      signal: 'Camera Hardware Provenance',
      strength: 'HIGH',
      description: `Original camera hardware EXIF tags detected: ${provenance.cameraInfo.make || ''} ${provenance.cameraInfo.model || ''}.`,
      evidence: `Make: ${provenance.cameraInfo.make || 'Found'}, Model: ${provenance.cameraInfo.model || 'Found'}`,
    });
  } else if (!c2pa.present) {
    provenanceSignals.push({
      category: 'PROVENANCE',
      signal: 'No Camera Metadata',
      strength: 'LOW',
      description: 'No camera hardware metadata (EXIF/Make/Model) was found in the file container.',
      evidence: 'Standard for web exports, screenshots, and generative images. Not proof of AI by itself.',
    });
  }

  if (provenance.isEditingSoftware && provenance.softwareFound && !c2pa.ai.isAIEdited) {
    editingScore += 35;
    editingSignals.push({
      category: 'EDITING',
      signal: 'Digital Editing Software Tag',
      strength: 'MEDIUM',
      description: `Metadata indicates image was processed or saved using image editing software: "${provenance.softwareFound}".`,
      evidence: `Software: ${provenance.softwareFound}`,
    });
  }

  // --- Visual Texture & Frequency Signals ---
  if (texture.hasBimodalTexture) {
    syntheticScore += 25;
    syntheticSignals.push({
      category: 'TEXTURE',
      signal: 'Bimodal Texture Anomaly',
      strength: 'MEDIUM',
      description: 'Coexistence of unnaturally smooth planar regions alongside localized hyper-detail frequency clusters.',
      evidence: `Smoothness ratio: ${Math.round(texture.smoothnessRatio * 100)}%, High-frequency std dev: ${texture.gradientUniformity}`,
    });
  } else if (texture.hasOverSmoothing && modality === 'PHOTOGRAPH' && !c2pa.ai.isAIGenerated) {
    syntheticScore += 20;
    syntheticSignals.push({
      category: 'TEXTURE',
      signal: 'Unnatural Surface Smoothing',
      strength: 'LOW',
      description: 'Lacks expected camera sensor noise granularity; surface textures appear synthetically rendered.',
      evidence: `High-frequency energy: ${texture.highFrequencyEnergy} (below natural sensor threshold)`,
    });
  }

  if (texture.isConsistentWithSensorNoise && provenance.cameraInfo) {
    captureScore += 25;
    captureSignals.push({
      category: 'CAPTURE',
      signal: 'Natural Sensor Noise Distribution',
      strength: 'MEDIUM',
      description: 'Uniform Poisson-Gaussian noise distribution consistent with physical camera sensor capture.',
      evidence: `Noise level: ${texture.noiseLevel}/100, Uniformity index: ${texture.gradientUniformity}`,
    });
  }

  // --- Text Typography Signals ---
  if (textAnalysis.hasMalformedText) {
    syntheticScore += 30;
    syntheticSignals.push({
      category: 'TEXT',
      signal: 'Malformed Typographic Rendering',
      strength: 'HIGH',
      description: 'Non-dictionary word tokens and malformed character geometry characteristic of generative diffusion rendering.',
      evidence: `Anomalous tokens: ${textAnalysis.anomalousWords.slice(0, 4).join(', ')}`,
    });
  }

  // --- ELA & Compression Signals ---
  if (ela.anomaliesDetected) {
    editingScore += 30;
    editingSignals.push({
      category: 'EDITING',
      signal: 'Regional Compression Disparity (ELA)',
      strength: 'MEDIUM',
      description: 'Localized regions exhibit elevated recompression response compared to the background plane.',
      evidence: `Regional variance: ${ela.regionalVariance}, Max disparity: ${ela.maxDisparity}`,
    });
  } else {
    captureSignals.push({
      category: 'CAPTURE',
      signal: 'Uniform Compression Characteristic',
      strength: 'LOW',
      description: 'Error Level Analysis shows uniform compression response across the image plane.',
      evidence: `Standard deviation across quadrants: ${ela.regionalVariance}`,
    });
  }

  // Common AI dimension check
  const isDefaultAiDimension =
    (width === 1024 && height === 1024) ||
    (width === 512 && height === 512) ||
    (width === 1024 && height === 1792) ||
    (width === 1792 && height === 1024) ||
    (width === 896 && height === 1152);

  if (isDefaultAiDimension && !provenance.cameraInfo && !c2pa.present) {
    syntheticScore += 10;
    syntheticSignals.push({
      category: 'SYNTHETIC',
      signal: 'Standard Generative Resolution Ratio',
      strength: 'LOW',
      description: `Image dimensions (${width} × ${height}) match standard default generative AI canvas resolutions.`,
      evidence: `Exact canvas geometry: ${width}x${height}`,
    });
  }

  // --------------------------------------------------------------------------
  // 8. Decision Matrix & Verdict Derivation
  // --------------------------------------------------------------------------
  let verdict: AIMetaVerdict = 'INCONCLUSIVE';
  let verdictLabel = 'Inconclusive Analysis';
  let evidenceStrength: EvidenceStrength = 'LOW';
  const whyExplanation: string[] = [];

  // Case 1: Verified C2PA AI Provenance
  if (c2pa.present && c2pa.validation.isValid && c2pa.ai.isAIGenerated) {
    verdict = 'LIKELY_AI_GENERATED';
    verdictLabel = 'AI-Generated (Verified C2PA)';
    evidenceStrength = 'HIGH';
    whyExplanation.push(c2pa.summaryExplanation);
    if (c2pa.activeManifest.claimGenerator) {
      whyExplanation.push(`Claim Generator recorded: "${c2pa.activeManifest.claimGenerator}".`);
    }
  }
  // Case 2: Verified C2PA AI-Assisted Editing
  else if (c2pa.present && c2pa.validation.isValid && c2pa.ai.isAIEdited) {
    verdict = 'LIKELY_AI_ASSISTED';
    verdictLabel = 'AI-Assisted Editing (Verified C2PA)';
    evidenceStrength = 'HIGH';
    whyExplanation.push(c2pa.summaryExplanation);
  }
  // Case 3: Verified Camera Provenance via C2PA or Hardware EXIF
  else if (c2pa.present && c2pa.validation.isValid && c2pa.provenanceVerdict === 'VERIFIED_CAMERA_PROVENANCE') {
    verdict = 'LIKELY_AUTHENTIC_CAPTURE';
    verdictLabel = 'Authentic Capture (Verified C2PA)';
    evidenceStrength = 'HIGH';
    whyExplanation.push(c2pa.summaryExplanation);
  }
  // Case 4: High Multi-Signal Synthetic Evidence
  else if (syntheticScore >= 45 && syntheticSignals.filter((s) => s.strength === 'HIGH' || s.strength === 'MEDIUM').length >= 2) {
    verdict = 'LIKELY_AI_GENERATED';
    verdictLabel = 'Likely AI-Generated';
    evidenceStrength = syntheticScore >= 65 ? 'HIGH' : 'MEDIUM';
    whyExplanation.push('Multiple independent synthetic visual indicators detected across texture, typography, or frequency domains.');
    if (textAnalysis.hasMalformedText) {
      whyExplanation.push('Typographic rendering exhibits characteristic diffusion-model character distortions.');
    }
    if (texture.hasBimodalTexture) {
      whyExplanation.push('Surface textures display an unnatural combination of over-smoothed regions and synthetic micro-detail.');
    }
  }
  // Case 5: AI-Assisted / Synthetic Illustration
  else if (syntheticScore >= 25 && (modality === 'DIGITAL_ILLUSTRATION' || modality === 'DIGITAL_GRAPHIC')) {
    verdict = 'LIKELY_AI_ASSISTED';
    verdictLabel = 'Likely AI-Assisted / Synthetic';
    evidenceStrength = 'MEDIUM';
    whyExplanation.push('Visual characteristics and rendering structure suggest AI-assisted digital generation or stylized rendering.');
    whyExplanation.push('Evidence is suggestive but not fully conclusive without cryptographic provenance.');
  }
  // Case 6: Edited / Manipulated Photograph
  else if (editingScore >= 35 && syntheticScore < 25) {
    verdict = 'LIKELY_EDITED';
    verdictLabel = 'Likely Edited / Manipulated';
    evidenceStrength = editingScore >= 55 ? 'HIGH' : 'MEDIUM';
    whyExplanation.push('Image exhibits localized editing, splicing, or recompression indicators (ELA / software tags).');
    whyExplanation.push('Underlying capture appears photographic rather than purely AI-synthesized.');
  }
  // Case 7: Authentic Camera Capture
  else if (captureScore >= 45 && syntheticScore < 15 && editingScore < 20) {
    verdict = 'LIKELY_AUTHENTIC_CAPTURE';
    verdictLabel = 'Likely Authentic Capture';
    evidenceStrength = provenance.cameraInfo ? 'HIGH' : 'MEDIUM';
    whyExplanation.push('Visual noise, compression uniformity, and hardware provenance are consistent with standard camera capture.');
    whyExplanation.push('No meaningful synthetic raster artifacts or localized compositing anomalies were detected.');
  }
  // Case 8: Inconclusive
  else {
    verdict = 'INCONCLUSIVE';
    verdictLabel = 'Inconclusive';
    evidenceStrength = 'LOW';
    whyExplanation.push('Insufficient definitive forensic signals to reliably establish synthetic vs authentic origin.');
    whyExplanation.push('The image lacks both strong synthetic anomalies and verifiable hardware camera provenance.');
  }

  // Limitations
  const limitations = [
    'Content Credentials (C2PA) provide the strongest provenance evidence when present; however, most web images have metadata stripped.',
    'No visual detector can guarantee 100% certainty for generative AI detection without cryptographic provenance.',
    'Absence of Content Credentials does NOT imply an image is real or AI-generated.',
  ];

  const executiveSummary = whyExplanation.join(' ');

  return {
    modality,
    modalityLabel,
    verdict,
    verdictLabel,
    evidenceStrength,
    executiveSummary,
    whyExplanation,
    syntheticSignals,
    editingSignals,
    provenanceSignals,
    captureSignals,
    provenance,
    c2pa,
    textureMetrics: texture,
    ela,
    textAnalysis,
    limitations,
    debugDiagnostics: {
      imageDimensions: `${width} × ${height}`,
      syntheticScore,
      editingScore,
      captureScore,
      provenanceScore,
      analysisConfidence: evidenceStrength,
    },
  };
}
