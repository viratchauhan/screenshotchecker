import { extractDifferenceRegions } from '../regionDetector';
import { extractTextDifferences } from '../ocrDifferenceEngine';
import { SpotDifferenceGameEngine } from '../gameEngine';
import type { DifferenceRegion } from '../types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runComparisonEngineTests() {
  console.log('================================================================');
  console.log('--- RUNNING VISUAL COMPARISON WORKSPACE UNIT TESTS ---');
  console.log('================================================================\n');

  // Test 1: Connected-Component Region Detector
  console.log('[Test 1] Region Detector: Connected Components & Bounding Boxes:');
  const width = 100;
  const height = 100;
  const mask = new Uint8Array(width * height);

  // Place a 10x10 square of differing pixels at (20, 20)
  for (let y = 20; y < 30; y++) {
    for (let x = 20; x < 30; x++) {
      mask[y * width + x] = 1;
    }
  }

  // Place another 10x10 square at (70, 70)
  for (let y = 70; y < 80; y++) {
    for (let x = 70; x < 80; x++) {
      mask[y * width + x] = 1;
    }
  }

  const regions = extractDifferenceRegions(mask, width, height, 10, 5);
  assert(regions.length === 2, `Detected 2 distinct clusters (got ${regions.length})`);
  assert(regions[0].pixelX <= 20 && regions[0].pixelWidth >= 10, 'First region bounding box correct');
  assert(regions[1].pixelX <= 70 && regions[1].pixelWidth >= 10, 'Second region bounding box correct');

  // Test 2: OCR Difference Engine
  console.log('\n[Test 2] OCR Difference Engine:');
  const textA = 'Download Report\nBalance: $100\nClick Here';
  const textB = 'Download PDF\nBalance: $500\nClick Here';

  const textDiffs = extractTextDifferences(textA, textB);
  assert(textDiffs.length === 2, `Identified 2 text line differences (got ${textDiffs.length})`);
  assert(textDiffs[0].textA === 'Download Report' && textDiffs[0].textB === 'Download PDF', 'Detected report -> pdf change');
  assert(textDiffs[1].textA === 'Balance: $100' && textDiffs[1].textB === 'Balance: $500', 'Detected amount change');

  // Test 3: Spot-the-Difference Game Engine
  console.log('\n[Test 3] Spot-the-Difference Game Engine:');
  const mockRegions: DifferenceRegion[] = [
    {
      id: 'diff-1',
      index: 0,
      box: { x: 0.1, y: 0.1, width: 0.1, height: 0.1, pixelX: 100, pixelY: 100, pixelWidth: 100, pixelHeight: 100 },
      category: 'Text Changed',
      pixelCount: 50,
      intensity: 0.9,
      centroid: { x: 150, y: 150 },
      title: 'Header Text',
      description: 'Modified header',
      locationName: 'Top Header (Left)',
      confidence: 98,
    },
    {
      id: 'diff-2',
      index: 1,
      box: { x: 0.5, y: 0.5, width: 0.1, height: 0.1, pixelX: 500, pixelY: 500, pixelWidth: 100, pixelHeight: 100 },
      category: 'Color Changed',
      pixelCount: 80,
      intensity: 0.8,
      centroid: { x: 550, y: 550 },
      title: 'Button Color',
      description: 'Color modified',
      locationName: 'Center Area (Center)',
      confidence: 95,
    },
  ];

  const game = new SpotDifferenceGameEngine(mockRegions, 2);
  game.start();
  let state = game.getState();
  assert(state.isPlaying === true, 'Game started successfully');
  assert(state.targetCount === 2, 'Target count initialized to 2');

  // Test wrong click
  console.log('  Testing wrong click at (0.9, 0.9):');
  const wrongRes = game.handleClick(0.9, 0.9);
  assert(wrongRes.isCorrect === false, 'Wrong click rejected');
  state = game.getState();
  assert(state.wrongClicks === 1, 'Wrong clicks counter incremented');

  // Test Hint System (Level 1, Level 2, Level 3)
  console.log('  Testing progressive hint system:');
  const hint1 = game.useHint();
  assert(hint1.level === 1, `Hint 1 triggered (got level ${hint1.level})`);
  assert(hint1.text.includes('Top Header'), 'Hint 1 includes location name');

  const hint2 = game.useHint();
  assert(hint2.level === 2, `Hint 2 triggered (got level ${hint2.level})`);

  const hint3 = game.useHint();
  assert(hint3.level === 3, `Hint 3 triggered (got level ${hint3.level})`);
  state = game.getState();
  assert(state.hintsUsed === 3, 'Hints counter updated to 3');

  // Test correct clicks
  console.log('  Testing correct click at (0.12, 0.12):');
  const correct1 = game.handleClick(0.12, 0.12);
  assert(correct1.isCorrect === true, 'First difference found');
  state = game.getState();
  assert(state.foundCount === 1, 'Found count is 1');
  assert(state.score > 0, `Score incremented to ${state.score}`);

  console.log('  Testing second correct click at (0.52, 0.52):');
  const correct2 = game.handleClick(0.52, 0.52);
  assert(correct2.isCorrect === true, 'Second difference found');
  state = game.getState();
  assert(state.foundCount === 2, 'Found count is 2 / 2');
  assert(state.isCompleted === true, 'Game marked as completed!');
  assert(state.isPlaying === false, 'Game stopped playing');

  console.log('\n================================================================');
  console.log('✅ ALL VISUAL COMPARISON WORKSPACE UNIT TESTS PASSED 100%!');
  console.log('================================================================\n');
}

runComparisonEngineTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
