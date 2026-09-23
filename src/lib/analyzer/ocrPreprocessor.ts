import { imageProcessingScale } from './imageLimits';
export interface PreprocessedImageResult {
  canvas: HTMLCanvasElement;
  originalCanvas: HTMLCanvasElement;
  isDarkModeDetected: boolean;
  scaleFactor: number;
}

/**
 * Preprocesses an image before passing it to Tesseract OCR to drastically increase accuracy.
 * Handles auto-scaling, grayscale, dark-mode inversion, contrast stretch, and edge sharpening.
 */
export async function preprocessImageForOCR(
  imageSource: HTMLImageElement | string | File | Blob
): Promise<PreprocessedImageResult> {
  // 1. Resolve source to an HTMLImageElement
  let img: HTMLImageElement;
  if (imageSource instanceof HTMLImageElement) {
    img = imageSource;
  } else {
    img = new Image();
    const url = typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource);
    try {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Could not read this image. Try a PNG or JPEG file.'));
        img.src = url;
      });
    } finally {
      if (typeof imageSource !== 'string') URL.revokeObjectURL(url);
    }
  }

  const srcWidth = img.naturalWidth || img.width;
  const srcHeight = img.naturalHeight || img.height;

  const scale = imageProcessingScale(srcWidth, srcHeight);

  // Unprocessed original canvas copy
  const originalCanvas = document.createElement('canvas');
  originalCanvas.width = srcWidth;
  originalCanvas.height = srcHeight;
  const oCtx = originalCanvas.getContext('2d');
  if (!oCtx) throw new Error('Image processing is unavailable in this browser.');
  oCtx.drawImage(img, 0, 0);

  // 2. Intelligent Scaling (scale up smaller screenshots for crisp character recognition)
  const targetWidth = Math.round(srcWidth * scale);
  const targetHeight = Math.round(srcHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Image processing is unavailable in this browser.');

  // Draw scaled image with smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  // 3. Pixel Manipulation for Luminance, Contrast & Inversion
  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const data = imageData.data;
  const len = data.length;

  // Calculate average brightness
  let totalLuminance = 0;
  const sampleStep = 8; // sample every 8th pixel for speed
  let sampleCount = 0;
  for (let i = 0; i < len; i += 4 * sampleStep) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    totalLuminance += lum;
    sampleCount++;
  }
  const avgLuminance = totalLuminance / (sampleCount || 1);
  const isDarkMode = avgLuminance < 115; // Dark mode screenshot detected

  // Grayscale & Invert (if dark mode)
  for (let i = 0; i < len; i += 4) {
    let lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (isDarkMode) {
      lum = 255 - lum; // Invert so text is dark on white background
    }
    data[i] = lum;
    data[i + 1] = lum;
    data[i + 2] = lum;
  }

  // 4. Contrast Normalization / Dynamic Histogram Stretch
  let minLum = 255;
  let maxLum = 0;
  for (let i = 0; i < len; i += 4 * sampleStep) {
    const val = data[i];
    if (val < minLum) minLum = val;
    if (val > maxLum) maxLum = val;
  }

  const range = maxLum - minLum;
  if (range > 30 && range < 240) {
    const factor = 255 / range;
    for (let i = 0; i < len; i += 4) {
      const stretched = Math.min(255, Math.max(0, (data[i] - minLum) * factor));
      data[i] = stretched;
      data[i + 1] = stretched;
      data[i + 2] = stretched;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // 5. Sharpening Filter using 3x3 Convolution Kernel
  const sharpenCanvas = document.createElement('canvas');
  sharpenCanvas.width = targetWidth;
  sharpenCanvas.height = targetHeight;
  const sCtx = sharpenCanvas.getContext('2d');
  if (sCtx) {
    sCtx.drawImage(canvas, 0, 0);
    const srcData = ctx.getImageData(0, 0, targetWidth, targetHeight).data;
    const dstImageData = sCtx.getImageData(0, 0, targetWidth, targetHeight);
    const dstData = dstImageData.data;

    const w = targetWidth;
    const h = targetHeight;

    // Convolution: [ 0, -1, 0; -1, 5, -1; 0, -1, 0 ]
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = (y * w + x) * 4;
        const top = ((y - 1) * w + x) * 4;
        const bottom = ((y + 1) * w + x) * 4;
        const left = (y * w + (x - 1)) * 4;
        const right = (y * w + (x + 1)) * 4;

        const val =
          5 * srcData[idx] -
          srcData[top] -
          srcData[bottom] -
          srcData[left] -
          srcData[right];

        const clamped = Math.min(255, Math.max(0, val));
        dstData[idx] = clamped;
        dstData[idx + 1] = clamped;
        dstData[idx + 2] = clamped;
        dstData[idx + 3] = 255;
      }
    }
    sCtx.putImageData(dstImageData, 0, 0);
    return {
      canvas: sharpenCanvas,
      originalCanvas,
      isDarkModeDetected: isDarkMode,
      scaleFactor: scale,
    };
  }

  return {
    canvas,
    originalCanvas,
    isDarkModeDetected: isDarkMode,
    scaleFactor: scale,
  };
}
