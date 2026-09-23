import { imageProcessingScale } from './imageLimits';
import type { ImageInfo } from './types';
import { formatAspectRatio } from '../utils/formatters';

export async function extractImageInfo(file: File, imgElement: HTMLImageElement): Promise<ImageInfo> {
  const width = imgElement.naturalWidth || imgElement.width || 0;
  const height = imgElement.naturalHeight || imgElement.height || 0;
  
  return {
    name: file.name || 'screenshot.png',
    sizeBytes: file.size || 0,
    width,
    height,
    aspectRatio: formatAspectRatio(width, height),
    mimeType: file.type || 'image/png',
    colorDepth: '24-bit sRGB (Truecolor)',
    orientation: 1,
  };
}

export function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try { imageProcessingScale(img.naturalWidth, img.naturalHeight); resolve(img); }
      catch (error) { reject(error); }
    };
    img.onerror = (err) => reject(new Error('Failed to load image from data URL'));
    img.src = dataUrl;
  });
}
