import {
  inspectProvenance,
  analyzeTextTypography,
  determineVisualModality,
  type ProvenanceDetails,
  type TextureFrequencyMetrics,
} from '../aiImageForensicsEngine';
import type { OCRResult } from '../types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runAllTests() {
  console.log('================================================================');
  console.log('--- RUNNING AI IMAGE DETECTOR FORENSICS ENGINE UNIT TESTS ---');
  console.log('================================================================\n');

  // --------------------------------------------------------------------------
  // TEST 1: Provenance Check - AI Software Detection
  // --------------------------------------------------------------------------
  console.log('[Test 1] Provenance Inspection - Generative AI Software:');
  const dummyMidjourneyBlob = new Blob([
    'Fake header... Software: Midjourney v6.0 ... c2pa.actions.ai_generated ...'
  ], { type: 'image/jpeg' });

  const provRes = await inspectProvenance(dummyMidjourneyBlob);
  assert(provRes.c2paStatus === 'VERIFIED_AI_GENERATED' || provRes.isAISoftware === true, 'Identified AI software / C2PA manifest');

  // --------------------------------------------------------------------------
  // TEST 2: Text Typography Forensics - Malformed AI Words
  // --------------------------------------------------------------------------
  console.log('\n[Test 2] Text Typography Forensics - Malformed AI Text:');
  const aiOcrResult: OCRResult = {
    text: 'WELCOME TO MARKETNG STRATGY BZKPQ CORPRATON',
    confidence: 65,
    words: [],
    lines: [],
    paragraphs: [],
  };

  const textRes = analyzeTextTypography(aiOcrResult);
  assert(textRes.hasMalformedText === true, 'Detected malformed text anomaly');
  assert(textRes.anomalousWords.length >= 2, `Identified anomalous tokens (${textRes.anomalousWords.join(', ')})`);

  // --------------------------------------------------------------------------
  // TEST 3: Text Typography Forensics - Clean Real Signage
  // --------------------------------------------------------------------------
  console.log('\n[Test 3] Text Typography Forensics - Clean Natural Text:');
  const cleanOcrResult: OCRResult = {
    text: 'WELCOME TO COFFEE SHOP SPECIAL MENU TODAY',
    confidence: 94,
    words: [],
    lines: [],
    paragraphs: [],
  };

  const cleanTextRes = analyzeTextTypography(cleanOcrResult);
  assert(cleanTextRes.hasMalformedText === false, 'Clean text correctly marked as not malformed');

  // --------------------------------------------------------------------------
  // TEST 4: Visual Modality Classification - UI Screenshot
  // --------------------------------------------------------------------------
  console.log('\n[Test 4] Visual Modality Classification - UI Screenshot:');
  const dummyProvenance: ProvenanceDetails = {
    hasExif: false,
    isAISoftware: false,
    isEditingSoftware: false,
    c2paStatus: 'NO_CREDENTIALS_FOUND',
    c2paSummary: 'None',
  };

  const dummyTexture: TextureFrequencyMetrics = {
    noiseLevel: 20,
    highFrequencyEnergy: 2.1,
    smoothnessRatio: 0.7,
    colorVariance: 40,
    gradientUniformity: 1.2,
    hasOverSmoothing: true,
    hasBimodalTexture: false,
    isConsistentWithSensorNoise: false,
  };

  const screenshotModality = determineVisualModality(
    1080,
    2400,
    dummyProvenance,
    cleanTextRes,
    dummyTexture,
    '5G 10:45 AM 85% Messages Online Typing...'
  );
  assert(screenshotModality.modality === 'UI_SCREENSHOT', `Classified as UI_SCREENSHOT (got: ${screenshotModality.modality})`);

  // --------------------------------------------------------------------------
  // TEST 5: Visual Modality Classification - Digital Illustration
  // --------------------------------------------------------------------------
  console.log('\n[Test 5] Visual Modality Classification - Digital Illustration:');
  const illustrationTexture: TextureFrequencyMetrics = {
    noiseLevel: 15,
    highFrequencyEnergy: 2.5,
    smoothnessRatio: 0.65,
    colorVariance: 180,
    gradientUniformity: 2.0,
    hasOverSmoothing: true,
    hasBimodalTexture: false,
    isConsistentWithSensorNoise: false,
  };

  const illustrationModality = determineVisualModality(
    1920,
    1080,
    dummyProvenance,
    { textFound: false, charCount: 0, wordCount: 0, hasMalformedText: false, anomalousWords: [], ocrConfidenceAvg: 0, notes: [] },
    illustrationTexture,
    ''
  );
  assert(illustrationModality.modality === 'DIGITAL_ILLUSTRATION', `Classified as DIGITAL_ILLUSTRATION (got: ${illustrationModality.modality})`);

  // --------------------------------------------------------------------------
  // TEST 6: Visual Modality Classification - Camera Photograph
  // --------------------------------------------------------------------------
  console.log('\n[Test 6] Visual Modality Classification - Camera Photo:');
  const photoProvenance: ProvenanceDetails = {
    hasExif: true,
    cameraInfo: { make: 'Sony', model: 'ILCE-7M4' },
    isAISoftware: false,
    isEditingSoftware: false,
    c2paStatus: 'VERIFIED_CAMERA_CAPTURE',
    c2paSummary: 'Camera verified',
  };

  const photoTexture: TextureFrequencyMetrics = {
    noiseLevel: 65,
    highFrequencyEnergy: 6.8,
    smoothnessRatio: 0.15,
    colorVariance: 95,
    gradientUniformity: 2.1,
    hasOverSmoothing: false,
    hasBimodalTexture: false,
    isConsistentWithSensorNoise: true,
  };

  const photoModality = determineVisualModality(
    4000,
    3000,
    photoProvenance,
    cleanTextRes,
    photoTexture,
    'Sony photo'
  );
  assert(photoModality.modality === 'PHOTOGRAPH', `Classified as PHOTOGRAPH (got: ${photoModality.modality})`);

  console.log('\n================================================================');
  console.log('✅ ALL AI IMAGE DETECTOR FORENSIC UNIT TESTS PASSED 100%!');
  console.log('================================================================\n');
}

runAllTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
