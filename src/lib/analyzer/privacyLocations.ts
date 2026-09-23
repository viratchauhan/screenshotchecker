import type { OCRWord, BoundingBox, PrivacyFinding } from './types';
import type { RedactionBox } from './redactor';

export function locateSensitiveText(value: string, words: OCRWord[]): BoundingBox[] {
  const normalize = (s: string) => s.replace(/\s/g, '').toLowerCase();
  const needle = normalize(value);
  if (!needle) return [];
  let text = '';
  const spans = words.map(word => {
    const start = text.length;
    text += normalize(word.text);
    return { word, start, end: text.length };
  });
  const boxes: BoundingBox[] = [];
  for (let at = text.indexOf(needle); at !== -1; at = text.indexOf(needle, at + needle.length)) {
    const matched = spans.filter(s => s.start < at + needle.length && s.end > at);
    if (matched.some(s => !s.word.bbox)) return []; // Do not claim partial coverage.
    for (const { word } of matched) {
      const b = word.bbox!;
      if (![b.x0, b.y0, b.x1, b.y1].every(Number.isFinite) || b.x1 <= b.x0 || b.y1 <= b.y0) return [];
      boxes.push({ x: b.x0, y: b.y0, width: b.x1 - b.x0, height: b.y1 - b.y0 });
    }
  }
  return boxes;
}

export function suggestedMasks(findings: PrivacyFinding[]) {
  let unavailable = 0;
  const boxes: RedactionBox[] = [];
  for (const finding of findings) {
    const locations = finding.bboxes ?? (finding.bbox ? [finding.bbox] : []);
    if (!locations.length) unavailable++;
    locations.forEach((b, i) => boxes.push({ id: `auto_${finding.id}_${i}`, x: b.x - 4, y: b.y - 4, width: b.width + 8, height: b.height + 8, type: 'blackout' }));
  }
  return { boxes, message: `${boxes.length} solid masks added. ${unavailable ? `${unavailable} finding(s) could not be located; draw masks manually.` : 'Review the entire image before sharing; detection can miss sensitive data.'}` };
}
