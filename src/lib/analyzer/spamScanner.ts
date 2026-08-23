import type { SpamFinding } from './types';
import { generateId } from '../utils/formatters';

export function scanSpamSignals(text: string): { findings: SpamFinding[]; score: number; hasSignals: boolean } {
  const findings: SpamFinding[] = [];
  const lower = text.toLowerCase();

  // 1. Promotional Density
  const promoKeywords = [
    'special promotion',
    'exclusive deal',
    'limited time offer',
    'discount code',
    'save up to',
    'free trial',
    'lowest price',
    'unbeatable offer',
    'earn from home',
    'guaranteed returns',
    '100% free',
  ];
  const matchedPromo = promoKeywords.filter((k) => lower.includes(k));
  if (matchedPromo.length >= 2) {
    findings.push({
      id: generateId(),
      title: 'High Promotional Language Density',
      description: 'Multiple promotional marketing buzzwords and discount phrases detected.',
      matchedTerms: matchedPromo,
      score: 30,
    });
  }

  // 2. Aggressive Marketing CTAs
  const ctaKeywords = [
    'click the link below',
    'reply stop to unsubscribe',
    'text yes to confirm',
    'tap here to claim',
    'don\'t miss out',
    'subscribe now',
  ];
  const matchedCTAs = ctaKeywords.filter((k) => lower.includes(k));
  if (matchedCTAs.length > 0) {
    findings.push({
      id: generateId(),
      title: 'Repetitive Call-To-Action (CTA) Pattern',
      description: 'Aggressive direct-response marketing commands common in mass SMS/messaging campaigns.',
      matchedTerms: matchedCTAs,
      score: 25,
    });
  }

  // 3. Formatting Anomalies (Excessive exclamation / Caps)
  const exclamationCount = (text.match(/!{2,}/g) || []).length;
  const uppercaseWords = (text.match(/\b[A-Z]{4,}\b/g) || []).filter(
    (w) => !['HTTP', 'HTTPS', 'HTML', 'JSON', 'EXIF', 'USPS', 'FedEx'].includes(w)
  );
  if (exclamationCount >= 2 || uppercaseWords.length >= 4) {
    findings.push({
      id: generateId(),
      title: 'Formatting Pressure (Excessive Caps / Exclamation)',
      description: 'Frequent multi-exclamation marks or capitalized words often characteristic of unsolicited promotional messages.',
      matchedTerms: uppercaseWords.slice(0, 5),
      score: 20,
    });
  }

  let score = 0;
  for (const f of findings) score += f.score;
  score = Math.min(100, score);

  return {
    findings,
    score,
    hasSignals: findings.length > 0,
  };
}
