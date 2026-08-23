import type { TextDifferenceItem } from './types';

/**
 * Tokenizes text into lines and words for comparison
 */
export function extractTextDifferences(
  textA: string,
  textB: string
): TextDifferenceItem[] {
  const items: TextDifferenceItem[] = [];

  const linesA = textA.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  const linesB = textB.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);

  // Line-by-line comparison
  const maxLines = Math.max(linesA.length, linesB.length);

  for (let i = 0; i < maxLines; i++) {
    const lineA = linesA[i];
    const lineB = linesB[i];

    if (lineA && lineB && lineA !== lineB) {
      items.push({
        type: 'changed',
        textA: lineA,
        textB: lineB,
        location: `Line ${i + 1}`,
      });
    } else if (lineA && !lineB) {
      items.push({
        type: 'removed',
        textA: lineA,
        location: `Line ${i + 1}`,
      });
    } else if (!lineA && lineB) {
      items.push({
        type: 'added',
        textB: lineB,
        location: `Line ${i + 1}`,
      });
    }
  }

  return items;
}
