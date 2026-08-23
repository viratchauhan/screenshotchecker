import type { ScamFinding } from './types';
import { generateId } from '../utils/formatters';

interface ScamPattern {
  id: string;
  category: ScamFinding['category'];
  title: string;
  description: string;
  regex: RegExp;
  severity: 'warning' | 'risk';
}

const SCAM_PATTERNS: ScamPattern[] = [
  {
    id: 'urgency_pressure',
    category: 'urgency',
    title: 'High Urgency & Time Pressure',
    description: 'Language creating intense urgency or threatening immediate penalty (e.g., "within 24 hours", "act now", "immediate action required").',
    regex: /\b(?:urgent(?:ly)?|immediate(?:ly)?|within (?:24|12|48) hours?|act now|limited time|before it(?:'s| is) too late|time[- ]sensitive|final notice|account suspended)\b/i,
    severity: 'warning',
  },
  {
    id: 'threat_legal',
    category: 'threat',
    title: 'Legal or Account Penalty Threat',
    description: 'Threats of legal consequences, police action, or immediate account termination.',
    regex: /\b(?:legal action|law enforcement|arrest warrant|court notice|penalty fee|frozen account|service termination|prosecution)\b/i,
    severity: 'risk',
  },
  {
    id: 'prize_lottery',
    category: 'prize',
    title: 'Unsolicited Prize or Giveaway Claim',
    description: 'Claims of winning a lottery, giveaway, cash reward, or inheritance requiring immediate claim.',
    regex: /\b(?:congratulations you won|winner of|claim your (?:gift card|reward|prize|\$|funds)|lottery payout|cash prize|selected for free)\b/i,
    severity: 'risk',
  },
  {
    id: 'otp_password_request',
    category: 'otp_request',
    title: 'Request for OTP, Passcode, or PIN',
    description: 'Requests to disclose or forward one-time passwords, verification codes, or personal PINs.',
    regex: /\b(?:send (?:the|your)? (?:otp|code|pin|passcode)|share (?:the|your)? (?:verification code|otp)|enter your (?:password|pin)|verify your 6-digit code)\b/i,
    severity: 'risk',
  },
  {
    id: 'giftcard_crypto_payment',
    category: 'payment_pressure',
    title: 'Unusual Payment Method Request',
    description: 'Demands for payment via gift cards (Apple, Google Play, Steam), wire transfers, or cryptocurrency.',
    regex: /\b(?:pay with (?:gift card|apple card|google play|steam)|send (?:bitcoin|btc|eth|crypto|usdt) to|wire (?:money|funds) to|untraceable payment)\b/i,
    severity: 'risk',
  },
  {
    id: 'impersonation_support',
    category: 'impersonation',
    title: 'Brand / Support Impersonation Pattern',
    description: 'Claims of representing official bank security, tech support, or delivery courier alerts.',
    regex: /\b(?:bank security department|fraud prevention team|amazon order support|paypal account team|usps delivery failed|courier package held|wells fargo account|florida toll services)\b/i,
    severity: 'warning',
  },
  {
    id: 'vishing_callback',
    category: 'impersonation',
    title: 'Unverified Security Callback Number (Vishing)',
    description: 'Account locked or suspicious activity alert directing the user to call an unverified telephone number.',
    regex: /\b(?:account (?:has been )?locked.*call (?:us at)?|suspicious activity.*call (?:us at)?|verify your identity.*call|call (?:us at)? \d{3}[-.\s]\d{3}[-.\s]\d{4})\b/i,
    severity: 'risk',
  },
  {
    id: 'loan_forgiveness_bait',
    category: 'prize',
    title: 'Student Loan Forgiveness / Debt Relief Bait',
    description: 'Unsolicited notification claiming recipient qualifies for loan forgiveness with urgent enrollment.',
    regex: /\b(?:qualify for (?:a )?new student loan forgiveness|loan forgiveness program|enrollment ends soon.*call|debt relief program)\b/i,
    severity: 'risk',
  },
  {
    id: 'delivery_reschedule_bait',
    category: 'impersonation',
    title: 'Missed Delivery / Reschedule Link Bait',
    description: 'Unsolicited missed package notification directing user to visit an external link to reschedule.',
    regex: /\b(?:missed our delivery|reschedule delivery of your parcel|parcel held|package pending.*reschedule)\b/i,
    severity: 'risk',
  },
  {
    id: 'toll_late_fee_smishing',
    category: 'threat',
    title: 'Toll Invoice & Late Fee Threat',
    description: 'Demands urgent payment for alleged outstanding toll balances under threat of penalties or license holds.',
    regex: /\b(?:outstanding toll amount|toll services|avoid a late fee|toll invoice|unpaid toll)\b/i,
    severity: 'risk',
  },
  {
    id: 'apk_malware_attachment',
    category: 'otp_request',
    title: 'Malicious Android APK Attachment for KYC/Banking',
    description: 'Distribution of an APK installer package disguised as banking security or ReKYC update.',
    regex: /\b(?:rekyc.*\.apk|\.apk.*kyc|download.*\.apk|install.*\.apk)\b/i,
    severity: 'risk',
  },
];

export function scanScamSignals(text: string): { findings: ScamFinding[]; score: number; hasSignals: boolean } {
  const findings: ScamFinding[] = [];
  const lowerText = text.toLowerCase();

  for (const pattern of SCAM_PATTERNS) {
    const match = pattern.regex.exec(lowerText);
    if (match) {
      findings.push({
        id: generateId(),
        title: pattern.title,
        category: pattern.category,
        description: pattern.description,
        matchedText: match[0],
        severity: pattern.severity,
      });
    }
  }

  let score = 0;
  for (const f of findings) {
    score += f.severity === 'risk' ? 35 : 20;
  }
  score = Math.min(100, score);

  return {
    findings,
    score,
    hasSignals: findings.length > 0,
  };
}
