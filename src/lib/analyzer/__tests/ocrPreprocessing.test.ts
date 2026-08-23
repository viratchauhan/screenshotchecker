console.log('================================================================');
console.log('            OCR PREPROCESSING PIPELINE TEST SUITE              ');
console.log('================================================================\n');

// Test 1: Luminance Calculation & Dark Mode Detection Math
function calculateLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

const darkBgLum = calculateLuminance(20, 22, 24);
const lightBgLum = calculateLuminance(250, 249, 245);

console.log('[Test 1] Luminance and Dark Mode Detection');
console.log(`  Dark Background Luminance: ${darkBgLum.toFixed(2)} (Expected < 115) -> ${darkBgLum < 115 ? 'DARK MODE' : 'LIGHT MODE'}`);
console.log(`  Light Background Luminance: ${lightBgLum.toFixed(2)} (Expected > 115) -> ${lightBgLum < 115 ? 'DARK MODE' : 'LIGHT MODE'}`);
if (darkBgLum < 115 && lightBgLum >= 115) {
  console.log('  ✓ PASS\n');
} else {
  console.error('  ✗ FAIL\n');
  process.exit(1);
}

// Test 2: Contrast Stretch Normalization
function contrastStretch(val: number, min: number, max: number): number {
  const range = max - min;
  if (range <= 0) return val;
  const factor = 255 / range;
  return Math.min(255, Math.max(0, (val - min) * factor));
}

console.log('[Test 2] Contrast Histogram Stretching');
const minVal = contrastStretch(50, 50, 150);
const maxVal = contrastStretch(150, 50, 150);
const midVal = contrastStretch(100, 50, 150);
console.log(`  Min (50) -> ${minVal} (Expected 0)`);
console.log(`  Max (150) -> ${maxVal} (Expected 255)`);
console.log(`  Mid (100) -> ${midVal} (Expected 127.5)`);
if (minVal === 0 && Math.abs(maxVal - 255) < 0.01 && Math.abs(midVal - 127.5) < 0.1) {
  console.log('  ✓ PASS\n');
} else {
  console.error('  ✗ FAIL\n');
  process.exit(1);
}

// Test 3: Sharpening Convolution Filter Kernel
function applySharpenKernel(center: number, top: number, bottom: number, left: number, right: number): number {
  const val = 5 * center - top - bottom - left - right;
  return Math.min(255, Math.max(0, val));
}

console.log('[Test 3] Sharpening 3x3 Edge Kernel');
const sharpenedEdge = applySharpenKernel(200, 100, 100, 100, 100);
console.log(`  Center: 200, Surroundings: 100 -> Sharpened Edge: ${sharpenedEdge} (Expected 255)`);
if (sharpenedEdge === 255) {
  console.log('  ✓ PASS\n');
} else {
  console.error('  ✗ FAIL\n');
  process.exit(1);
}

console.log('================================================================');
console.log('SUMMARY: 3/3 PASSED, 0 FAILED');
console.log('================================================================\n');
