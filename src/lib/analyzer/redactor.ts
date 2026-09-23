export interface RedactionBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'blur' | 'pixelate' | 'blackout' | 'whiteout';
}

/**
 * Applies redactions (blur, pixelate, blackout, whiteout) directly onto an image canvas
 * and returns the clean, metadata-free resulting dataUrl and Blob.
 */
export async function renderRedactedImage(
  img: HTMLImageElement,
  boxes: RedactionBox[],
  format: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png',
  quality = 0.95
): Promise<{ dataUrl: string; blob: Blob }> {
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  // Draw base image
  ctx.drawImage(img, 0, 0, width, height);

  for (const box of boxes) {
    if (![box.x, box.y, box.width, box.height].every(Number.isFinite) || box.width <= 0 || box.height <= 0) continue;
    const bx = Math.max(0, Math.floor(box.x));
    const by = Math.max(0, Math.floor(box.y));
    const bw = Math.min(width, Math.ceil(box.x + box.width)) - bx;
    const bh = Math.min(height, Math.ceil(box.y + box.height)) - by;

    if (bw <= 0 || bh <= 0) continue;

    if (box.type === 'blackout') {
      ctx.fillStyle = '#141413';
      ctx.fillRect(bx, by, bw, bh);
    } else if (box.type === 'whiteout') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(bx, by, bw, bh);
    } else if (box.type === 'pixelate') {
      // Pixelate region
      const pixelSize = Math.max(8, Math.round(Math.min(bw, bh) / 8));
      const regionData = ctx.getImageData(bx, by, bw, bh);
      const data = regionData.data;

      for (let y = 0; y < bh; y += pixelSize) {
        for (let x = 0; x < bw; x += pixelSize) {
          const sampleX = Math.min(x + Math.floor(pixelSize / 2), bw - 1);
          const sampleY = Math.min(y + Math.floor(pixelSize / 2), bh - 1);
          const sampleIndex = (sampleY * bw + sampleX) * 4;

          const r = data[sampleIndex];
          const g = data[sampleIndex + 1];
          const b = data[sampleIndex + 2];
          const a = data[sampleIndex + 3];

          ctx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
          ctx.fillRect(
            bx + x,
            by + y,
            Math.min(pixelSize, bw - x),
            Math.min(pixelSize, bh - y)
          );
        }
      }
    } else if (box.type === 'blur') {
      // Fast Gaussian-like Box Blur on region
      const offCanvas = document.createElement('canvas');
      offCanvas.width = bw;
      offCanvas.height = bh;
      const offCtx = offCanvas.getContext('2d');
      if (offCtx) {
        offCtx.drawImage(canvas, bx, by, bw, bh, 0, 0, bw, bh);
        ctx.save();
        ctx.filter = 'blur(12px)';
        ctx.drawImage(offCanvas, bx, by, bw, bh);
        ctx.restore();
      }
    }
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Failed to create redacted image blob'));
        const dataUrl = canvas.toDataURL(format, quality);
        resolve({ dataUrl, blob });
      },
      format,
      quality
    );
  });
}
