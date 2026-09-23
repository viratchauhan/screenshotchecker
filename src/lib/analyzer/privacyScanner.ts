import { locateSensitiveText } from './privacyLocations';
import type { PrivacyFinding, MetadataInfo, OCRWord } from './types';
import { generateId } from '../utils/formatters';

// Luhn algorithm for credit card validation
function isValidLuhn(digits: string): boolean {
  const clean = digits.replace(/\D/g, '');
  if (clean.length < 13 || clean.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function scanPrivacyRisks(
  text: string,
  words: OCRWord[] = [],
  metadata?: MetadataInfo
): { findings: PrivacyFinding[]; score: number; totalItems: number } {
  const findings: PrivacyFinding[] = [];
  const seenValues = new Set<string>();

  const addFinding = (
    category: PrivacyFinding['category'],
    label: string,
    value: string,
    snippet: string,
    confidence: 'high' | 'medium' | 'low' = 'high',
    severity: 'low' | 'medium' | 'high' = 'medium',
    sourceValue: string = value
  ) => {
    const trimmedVal = value.trim();
    if (seenValues.has(sourceValue.toLowerCase())) return;
    seenValues.add(sourceValue.toLowerCase());

    const bboxes = category === 'gps' ? [] : locateSensitiveText(sourceValue, words);
    const bbox = bboxes[0];

    findings.push({
      id: generateId(),
      category,
      label,
      value: trimmedVal,
      snippet: snippet.trim(),
      confidence,
      severity,
      bbox,
      bboxes,
    });
  };

  // 1. Email Addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  let match;
  while ((match = emailRegex.exec(text)) !== null) {
    addFinding('email', 'Email Address', match[0], `Found email: ${match[0]}`, 'high', 'high');
  }

  // 2. Phone Numbers (US, International, E.164 formats)
  const phoneRegex = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})\b|\b(?:\+?[0-9]{1,3}[-.\s]?)?\(?[0-9]{2,4}\)?[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3,4}\b/g;
  while ((match = phoneRegex.exec(text)) !== null) {
    const clean = match[0].replace(/\D/g, '');
    if (clean.length >= 10 && clean.length <= 15) {
      addFinding('phone', 'Phone Number', match[0], `Phone pattern: ${match[0]}`, 'high', 'high');
    }
  }

  // 3. IPv4 and IPv6 Addresses
  const ipv4Regex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g;
  while ((match = ipv4Regex.exec(text)) !== null) {
    if (match[0] !== '0.0.0.0' && match[0] !== '127.0.0.1' && match[0] !== '255.255.255.255') {
      addFinding('ip', 'IP Address', match[0], `IP Address exposed: ${match[0]}`, 'high', 'medium');
    }
  }

  // 4. Credit / Debit Card Numbers (with Luhn verification)
  const cardRegex = /\b(?:\d[ -]*?){13,19}\b/g;
  while ((match = cardRegex.exec(text)) !== null) {
    const raw = match[0].replace(/[\s-]/g, '');
    if (isValidLuhn(raw)) {
      const masked = `${raw.slice(0, 4)} **** **** ${raw.slice(-4)}`;
      addFinding('card', 'Payment Card Number', masked, `Payment card number detected`, 'high', 'high', match[0]);
    }
  }

  // 5. Social Security Numbers / National IDs (e.g. XXX-XX-XXXX)
  const ssnRegex = /\b(?!000|666|9\d{2})\d{3}[- ](?!00)\d{2}[- ](?!0000)\d{4}\b/g;
  while ((match = ssnRegex.exec(text)) !== null) {
    addFinding('ssn', 'SSN / National ID Pattern', '***-**-****', `National ID/SSN pattern detected`, 'medium', 'high', match[0]);
  }

  // 6. Crypto Wallet Addresses (BTC, ETH, Solana)
  const ethRegex = /\b0x[a-fA-F0-9]{40}\b/g;
  while ((match = ethRegex.exec(text)) !== null) {
    addFinding('crypto', 'Ethereum / Web3 Wallet', match[0], `Crypto wallet address: ${match[0]}`, 'high', 'medium');
  }
  const btcRegex = /\b(?:1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,39}\b/g;
  while ((match = btcRegex.exec(text)) !== null) {
    addFinding('crypto', 'Bitcoin Wallet Address', match[0], `Bitcoin wallet address: ${match[0]}`, 'high', 'medium');
  }

  // 7. Order IDs / Invoices / Reference Numbers
  const orderRegex = /\b(?:Order|Invoice|Ref|Reference|Transaction|Tracking|Receipt)\s*(?:ID|Number|No|#)?[:\s-]*([A-Z0-9_-]{5,20})\b/gi;
  while ((match = orderRegex.exec(text)) !== null) {
    if (match[1] && !match[1].match(/^(the|and|for|with|from|this|your)$/i)) {
      addFinding('order_id', 'Order / Invoice ID', match[0], `Found reference: ${match[0]}`, 'medium', 'low');
    }
  }

  // 8. Auth Tokens / API Keys / Password Patterns
  const secretRegex = /\b(?:password|passwd|api[_-]?key|secret|token|bearer|auth|otp|pin)\s*[:=]\s*([^\s]{4,40})\b/gi;
  while ((match = secretRegex.exec(text)) !== null) {
    addFinding('auth_token', 'Potential Credential / Token', match[0], `Potential sensitive secret pattern`, 'high', 'high');
  }

  // 9. Physical Street Address Patterns
  const addressRegex = /\b\d{1,5}\s+(?:[A-Za-z0-9#.-]+\s+){1,4}(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Way|Court|Ct|Plaza|Parkway|Pkwy|Apt|Suite|Unit)\b/gi;
  while ((match = addressRegex.exec(text)) !== null) {
    addFinding('address', 'Street Address', match[0], `Physical address pattern: ${match[0]}`, 'medium', 'high');
  }

  // 10. GPS Metadata (if present)
  if (metadata?.gps) {
    const lat = metadata.gps.lat;
    const lng = metadata.gps.lng;
    addFinding(
      'gps',
      'Location / GPS Metadata',
      `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      `Precise GPS coordinates embedded in image metadata`,
      'high',
      'high'
    );
  }

  // Compute privacy risk score (0 - 100)
  let score = 0;
  for (const f of findings) {
    if (f.severity === 'high') score += 35;
    else if (f.severity === 'medium') score += 20;
    else score += 10;
  }
  score = Math.min(100, score);

  return {
    findings,
    score,
    totalItems: findings.length,
  };
}
