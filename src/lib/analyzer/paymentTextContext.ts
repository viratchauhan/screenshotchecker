/** Conservative OCR fallbacks shared by the general and payment reports.
 * These are text heuristics, not evidence of payment settlement or currency.
 */
export function extractUnmarkedPaymentAmounts(text: string): string[] {
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const number = '(?:\\d{1,3}(?:,\\d{3})+|\\d{1,3}(?:,\\d{2})*,\\d{3}|\\d+)(?:\\.\\d{1,2})?';
  const labelled = new RegExp(`^(?:amount(?: paid| sent| received)?|paid|sent|received|total(?: amount)?)\\s*[:=]?\\s*(${number})$`, 'i');
  const amountOnly = new RegExp(`^${number}$`);
  const candidates: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(labelled);
    if (match) candidates.push(match[1]);
    else if (/^(?:amount(?: paid| sent| received)?|total(?: amount)?)\s*[:=]?$/i.test(lines[i]) && amountOnly.test(lines[i + 1] || '')) {
      candidates.push(lines[i + 1]);
    }
  }
  // Only infer an unlabelled decimal on a payment/transaction status screen.
  // A date, integer reference or balance must not become a payment amount.
  if (!candidates.length && /\b(?:payment|transaction|transfer)\s+(?:successful|success|completed|pending|failed)|\bpaid to\b/i.test(text)) {
    for (let i = 0; i < lines.length; i++) {
      if (amountOnly.test(lines[i]) && /\.\d{2}$/.test(lines[i]) &&
          !/\b(?:balance|fee|tax|cashback|refund|utr|rrn|reference|account|phone|mobile)\b/i.test(lines[i - 1] || '')) candidates.push(lines[i]);
    }
  }
  const unique = [...new Set(candidates)];
  // Competing unmarked values need review; don't silently choose the first.
  return unique.length === 1 ? unique : [];
}

export function labelledReferenceSpans(text: string): { start: number; end: number }[] {
  const regex = /\b(?:UTR|RRN|UPI\s*Ref(?:erence)?(?:\s*(?:No\.?|Number|ID))?|Txn\s*(?:ID|Ref|No)|Transaction\s*(?:ID|Ref|No|Number)|Ref(?:erence)?\s*(?:ID|No|#))\s*[:#-]?\s*([A-Z0-9_-]{6,35})\b/gi;
  return [...text.matchAll(regex)].map(match => ({ start: match.index!, end: match.index! + match[0].length }));
}

export function overlapsReference(start: number, length: number, spans: { start: number; end: number }[]): boolean {
  return spans.some(span => start < span.end && start + length > span.start);
}
