import type { BoundingBox } from './types';

export interface RawDetectedRegion {
  pixelX: number;
  pixelY: number;
  pixelWidth: number;
  pixelHeight: number;
  pixelCount: number;
  centroidX: number;
  centroidY: number;
  box: BoundingBox;
}

/**
 * Connected-component clustering to extract distinct difference regions from binary mask.
 */
export function extractDifferenceRegions(
  diffMask: Uint8Array,
  width: number,
  height: number,
  minPixelSize = 15,
  mergeDistance = 18
): RawDetectedRegion[] {
  const visited = new Uint8Array(width * height);
  const rawClusters: Array<{
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    count: number;
    sumX: number;
    sumY: number;
  }> = [];

  // Downsampled grid scan for efficiency
  const step = 2;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = y * width + x;
      if (diffMask[idx] === 1 && visited[idx] === 0) {
        // BFS / Flood-fill to find connected cluster
        let minX = x, maxX = x, minY = y, maxY = y;
        let count = 0;
        let sumX = 0, sumY = 0;

        const queue: number[] = [x, y];
        visited[idx] = 1;

        let head = 0;
        while (head < queue.length) {
          const qx = queue[head++];
          const qy = queue[head++];

          count++;
          sumX += qx;
          sumY += qy;

          if (qx < minX) minX = qx;
          if (qx > maxX) maxX = qx;
          if (qy < minY) minY = qy;
          if (qy > maxY) maxY = qy;

          // 4-neighborhood
          const neighbors = [
            [qx + step, qy],
            [qx - step, qy],
            [qx, qy + step],
            [qx, qy - step],
          ];

          for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nIdx = ny * width + nx;
              if (diffMask[nIdx] === 1 && visited[nIdx] === 0) {
                visited[nIdx] = 1;
                queue.push(nx, ny);
              }
            }
          }
        }

        if (count >= minPixelSize / (step * step)) {
          rawClusters.push({ minX, minY, maxX, maxY, count, sumX, sumY });
        }
      }
    }
  }

  // Merge overlapping or adjacent clusters within mergeDistance
  const mergedClusters: Array<{
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    count: number;
    sumX: number;
    sumY: number;
  }> = [];

  for (const c of rawClusters) {
    let merged = false;
    for (const m of mergedClusters) {
      const xOverlap = !(c.maxX + mergeDistance < m.minX || c.minX - mergeDistance > m.maxX);
      const yOverlap = !(c.maxY + mergeDistance < m.minY || c.minY - mergeDistance > m.maxY);

      if (xOverlap && yOverlap) {
        m.minX = Math.min(m.minX, c.minX);
        m.minY = Math.min(m.minY, c.minY);
        m.maxX = Math.max(m.maxX, c.maxX);
        m.maxY = Math.max(m.maxY, c.maxY);
        m.count += c.count;
        m.sumX += c.sumX;
        m.sumY += c.sumY;
        merged = true;
        break;
      }
    }
    if (!merged) {
      mergedClusters.push({ ...c });
    }
  }

  // Convert to output format with padding
  const padding = 6;
  return mergedClusters.map((c) => {
    const px = Math.max(0, c.minX - padding);
    const py = Math.max(0, c.minY - padding);
    const pw = Math.min(width - px, c.maxX - c.minX + padding * 2);
    const ph = Math.min(height - py, c.maxY - c.minY + padding * 2);

    const centroidX = c.count > 0 ? Math.round(c.sumX / c.count) : px + pw / 2;
    const centroidY = c.count > 0 ? Math.round(c.sumY / c.count) : py + ph / 2;

    const box: BoundingBox = {
      x: px / width,
      y: py / height,
      width: pw / width,
      height: ph / height,
      pixelX: px,
      pixelY: py,
      pixelWidth: pw,
      pixelHeight: ph,
    };

    return {
      pixelX: px,
      pixelY: py,
      pixelWidth: pw,
      pixelHeight: ph,
      pixelCount: c.count,
      centroidX,
      centroidY,
      box,
    };
  });
}
