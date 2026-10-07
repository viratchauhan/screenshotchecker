// Exclude only an amount directly attached to a recognizable balance label.
// A balance elsewhere on the same line must not hide a real payment conflict.
export function isLabelledBalanceAmount(text: string, start: number, end: number): boolean {
  const label = '(?:(?:available|account|bank|current|remaining|closing|your)\\s+)?balance(?:\\s+is)?|avl\\.?\\s+bal\\.?';
  const prefix = text.slice(0, start);
  const linePrefix = prefix.slice(prefix.lastIndexOf('\n') + 1);
  const lineSuffix = text.slice(end).split(/\r?\n/, 1)[0];
  if (new RegExp(`\\b(?:${label})\\s*[:=–-]?\\s*$`, 'i').test(linePrefix)) return true;
  if (!linePrefix.trim()) {
    const previousLine = prefix.trimEnd().split(/\r?\n/).at(-1) || '';
    if (new RegExp(`^(?:${label})\\s*[:=–-]?\\s*$`, 'i').test(previousLine.trim())) return true;
  }
  return new RegExp(`^\\s*(?:${label})\\s*$`, 'i').test(lineSuffix);
}
