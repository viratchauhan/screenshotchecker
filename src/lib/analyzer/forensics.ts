import type { ForensicsInfo } from './types';
import { fitElaViewSize } from './elaView';
import { describeElaGrid, elaGridSize, findUnevenElaCells, measureElaGrid } from './elaGrid';

/**
 * Performs Error Level Analysis (ELA) and noise variance checks in browser canvas.
 */
export async function analyzeImageForensics(img: HTMLImageElement): Promise<ForensicsInfo> {
  const naturalWidth = img.naturalWidth || img.width;
  const naturalHeight = img.naturalHeight || img.height;

  if (naturalWidth === 0 || naturalHeight === 0) {
    return {
      anomaliesDetected: false,
      compressionInconsistency: 'Insufficient image data',
      noiseVarianceScore: 0,
      cloneRegionsFound: false,
      notes: ['Image dimensions too small for forensic analysis.'],
    };
  }

  // Large pictures are scaled down to 1600 pixels on the longest side, keeping their shape.
  const { width, height } = fitElaViewSize(naturalWidth, naturalHeight);

  const canvasOrig = document.createElement('canvas');
  canvasOrig.width = width;
  canvasOrig.height = height;
  const ctxOrig = canvasOrig.getContext('2d');
  if (!ctxOrig) throw new Error('Canvas 2D unavailable');
  ctxOrig.drawImage(img, 0, 0, width, height);

  const origData = ctxOrig.getImageData(0, 0, width, height);
  const origPixels = origData.data;

  // Resave at 75% quality JPEG for ELA comparison
  const jpegUrl = canvasOrig.toDataURL('image/jpeg', 0.75);
  const reloadedJpeg = await new Promise<HTMLImageElement>((resolve, reject) => {
    const tempImg = new Image();
    tempImg.onload = () => resolve(tempImg);
    tempImg.onerror = reject;
    tempImg.src = jpegUrl;
  });

  const canvasResaved = document.createElement('canvas');
  canvasResaved.width = width;
  canvasResaved.height = height;
  const ctxResaved = canvasResaved.getContext('2d');
  if (!ctxResaved) throw new Error('Canvas 2D unavailable');
  ctxResaved.drawImage(reloadedJpeg, 0, 0, width, height);
  const resavedData = ctxResaved.getImageData(0, 0, width, height);
  const resavedPixels = resavedData.data;

  // Create ELA Output Canvas
  const canvasEla = document.createElement('canvas');
  canvasEla.width = width;
  canvasEla.height = height;
  const ctxEla = canvasEla.getContext('2d');
  if (!ctxEla) throw new Error('Canvas 2D unavailable');
  const elaImageData = ctxEla.createImageData(width, height);
  const elaPixels = elaImageData.data;

  let totalDiff = 0;
  let maxDiff = 0;
  const amplification = 25; // Scale difference for visibility

  // Subdivide image into 4 quadrants to compare noise distribution
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
    if (pixelDiff > maxDiff) maxDiff = pixelDiff;

    elaPixels[i] = Math.min(255, dr * amplification);
    elaPixels[i + 1] = Math.min(255, dg * amplification);
    elaPixels[i + 2] = Math.min(255, db * amplification);
    elaPixels[i + 3] = 255; // Alpha

    // Track quadrant
    const pixelIndex = i / 4;
    const px = pixelIndex % width;
    const py = Math.floor(pixelIndex / width);
    const qIndex = (px < midX ? 0 : 1) + (py < midY ? 0 : 2);
    quadDiffs[qIndex] += pixelDiff;
    quadCounts[qIndex]++;
  }

  ctxEla.putImageData(elaImageData, 0, 0);
  const elaDataUrl = canvasEla.toDataURL('image/png');

  const avgDiff = totalDiff / (width * height);
  const quadAverages = quadDiffs.map((d, idx) => (quadCounts[idx] > 0 ? d / quadCounts[idx] : 0));
  
  // Calculate variance across quadrants
  const meanQuad = quadAverages.reduce((a, b) => a + b, 0) / 4;
  const variance = quadAverages.reduce((sum, v) => sum + Math.pow(v - meanQuad, 2), 0) / 4;
  const stdDev = Math.sqrt(variance);

  // Finer comparison: every area against areas with similar detail (a small pasted patch
  // disappears in the four quadrant averages above).
  const gridSize = elaGridSize(width, height);
  const elaGrid = findUnevenElaCells(
    measureElaGrid(origPixels, resavedPixels, width, height, gridSize),
    gridSize.cols,
    gridSize.rows,
  );
  const unevenAreas = elaGrid.flagged.length > 0;

  const notes: string[] = [];
  let anomaliesDetected = false;

  if (stdDev > 4.5 && maxDiff > 35) {
    anomaliesDetected = true;
    notes.push('Localized compression level disparity detected across image regions.');
    notes.push('Highlighted high-contrast ELA areas may suggest spliced or re-compressed elements.');
  } else if (!unevenAreas) {
    notes.push('Compression error distribution is relatively uniform across the image plane.');
    notes.push('No obvious high-gradient compression boundary anomalies detected.');
  }
  if (unevenAreas) anomaliesDetected = true;
  notes.push(...describeElaGrid(elaGrid).notes);

  return {
    elaDataUrl,
    anomaliesDetected,
    compressionInconsistency: anomaliesDetected
      ? unevenAreas && !(stdDev > 4.5 && maxDiff > 35)
        ? 'Uneven areas observed'
        : 'Regional compression variance observed'
      : 'Uniform compression characteristics',
    noiseVarianceScore: Math.round(stdDev * 10) / 10,
    cloneRegionsFound: false,
    notes,
    elaGrid,
  };
}
