export interface NormalizedCanvasPair {
  canvasA: HTMLCanvasElement;
  canvasB: HTMLCanvasElement;
  ctxA: CanvasRenderingContext2D;
  ctxB: CanvasRenderingContext2D;
  width: number;
  height: number;
  scaleA: number;
  scaleB: number;
  offsetX: number;
  offsetY: number;
}

export type AlignmentStrategy = 'auto' | 'center' | 'top-left' | 'reset';

/**
 * Normalizes two images onto identical coordinate canvases.
 * Preserves native aspect ratio and centers or auto-aligns the images.
 */
export function normalizeImages(
  imgA: HTMLImageElement,
  imgB: HTMLImageElement,
  strategy: AlignmentStrategy = 'auto',
  maxDimension = 1200
): NormalizedCanvasPair {
  // Determine common working dimension
  const maxW = Math.max(imgA.naturalWidth || imgA.width, imgB.naturalWidth || imgB.width);
  const maxH = Math.max(imgA.naturalHeight || imgA.height, imgB.naturalHeight || imgB.height);

  let targetW = maxW;
  let targetH = maxH;

  // Downscale huge images for fast browser-side processing without losing fidelity
  if (targetW > maxDimension || targetH > maxDimension) {
    const ratio = Math.min(maxDimension / targetW, maxDimension / targetH);
    targetW = Math.round(targetW * ratio);
    targetH = Math.round(targetH * ratio);
  }

  const canvasA = document.createElement('canvas');
  const canvasB = document.createElement('canvas');
  canvasA.width = targetW;
  canvasA.height = targetH;
  canvasB.width = targetW;
  canvasB.height = targetH;

  const ctxA = canvasA.getContext('2d', { willReadFrequently: true })!;
  const ctxB = canvasB.getContext('2d', { willReadFrequently: true })!;

  ctxA.imageSmoothingEnabled = true;
  ctxA.imageSmoothingQuality = 'high';
  ctxB.imageSmoothingEnabled = true;
  ctxB.imageSmoothingQuality = 'high';

  // Compute scaling & positioning for Image A
  const aspectA = (imgA.naturalWidth || imgA.width) / (imgA.naturalHeight || imgA.height);
  const canvasAspect = targetW / targetH;

  let drawWA = targetW;
  let drawHA = targetH;
  let posXA = 0;
  let posYA = 0;

  if (strategy === 'center' || strategy === 'auto') {
    if (aspectA > canvasAspect) {
      drawWA = targetW;
      drawHA = targetW / aspectA;
      posYA = (targetH - drawHA) / 2;
    } else {
      drawHA = targetH;
      drawWA = targetH * aspectA;
      posXA = (targetW - drawWA) / 2;
    }
  }

  ctxA.drawImage(imgA, posXA, posYA, drawWA, drawHA);

  // Compute scaling & positioning for Image B
  const aspectB = (imgB.naturalWidth || imgB.width) / (imgB.naturalHeight || imgB.height);
  let drawWB = targetW;
  let drawHB = targetH;
  let posXB = 0;
  let posYB = 0;

  if (strategy === 'center' || strategy === 'auto') {
    if (aspectB > canvasAspect) {
      drawWB = targetW;
      drawHB = targetW / aspectB;
      posYB = (targetH - drawHB) / 2;
    } else {
      drawHB = targetH;
      drawWB = targetH * aspectB;
      posXB = (targetW - drawWB) / 2;
    }
  }

  ctxB.drawImage(imgB, posXB, posYB, drawWB, drawHB);

  return {
    canvasA,
    canvasB,
    ctxA,
    ctxB,
    width: targetW,
    height: targetH,
    scaleA: drawWA / (imgA.naturalWidth || imgA.width),
    scaleB: drawWB / (imgB.naturalWidth || imgB.width),
    offsetX: posXB - posXA,
    offsetY: posYB - posYA,
  };
}
