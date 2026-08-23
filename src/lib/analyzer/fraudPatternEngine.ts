import {
  REFERENCE_SCAM_DATASET,
  FRAUD_SIGNAL_LIBRARY,
  type ReferenceScamPattern,
  type FraudVerdict,
  type RiskLevel,
} from './dataset/fraudKnowledgeBase';
import { routeContent, type DetectedContentType } from './contentRouter';

export interface FraudEngineOutput {
  verdict: FraudVerdict;
  riskScore: number;
  riskLevel: RiskLevel;
  summary: string;
  contentType: DetectedContentType;
  scamCategories: string[];
  signals: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    evidence: string;
    source?: string;
  }>;
  entities: {
    organization: string;
    phoneNumbers: string[];
    urls: string[];
    attachments: Array<{ filename: string; type: string }>;
    amounts: string[];
  };
  requestedAction: string;
  recommendation: string;
  matchedPatternId?: string;
  matchedConcepts: string[];
  isOcrError?: boolean;
}

/**
 * Semantic Fraud Pattern Engine
 * Compares OCR extracted text, entities, signals, and URLs against the reference knowledge base.
 */
export function evaluateFraudPatterns(
  rawText: string,
  detectedUrls: string[] = [],
  detectedPhones: string[] = [],
  imageWidth: number = 0,
  imageHeight: number = 0
): FraudEngineOutput {
  const text = (rawText || '').trim();

  // =========================================================================
  // 1. OCR ERROR & INSUFFICIENT EVIDENCE VALIDATION (Requirement 3, 18, 19)
  // =========================================================================
  if (text.length === 0) {
    return {
      verdict: 'OCR_ERROR',
      riskScore: 0,
      riskLevel: 'LOW',
      summary: "Text couldn't be read from this screenshot. Please upload a clearer, unblurred image.",
      contentType: 'PHOTOGRAPH',
      scamCategories: [],
      signals: [],
      entities: {
        organization: 'Unknown',
        phoneNumbers: [],
        urls: [],
        attachments: [],
        amounts: [],
      },
      requestedAction: 'Upload a clearer or higher-resolution screenshot for text extraction.',
      recommendation: 'Text could not be extracted. Please upload an unblurred image.',
      matchedConcepts: [],
      isOcrError: true,
    };
  }

  // Route content structure (SMS, WhatsApp, Chat, Email, Document, Receipt, etc.)
  const routed = routeContent(text, imageWidth, imageHeight);
  const lower = routed.normalizedText.toLowerCase();

  // Combine extracted URLs & Phones
  const allUrls = Array.from(new Set([...detectedUrls, ...routed.urls]));
  const allPhones = Array.from(new Set([...detectedPhones, ...routed.phoneNumbers]));
  const amounts = routed.amounts;
  const attachments = routed.attachments;
  const claimedOrg = routed.organizations.length > 0 ? routed.organizations[0] : 'Unknown / Personal Contact';

  // =========================================================================
  // 2. FALSE-POSITIVE PROTECTION LAYER (Requirement 30)
  // =========================================================================
  const isNegativeOtpWarning = /\b(?:do not share|never share|don't share)\b/i.test(lower);
  const hasSuspiciousLink = allUrls.some((u) => !u.includes('official') && !u.includes('gov.in') && !u.includes('.bank'));
  const hasAccountThreat = /\b(?:suspended|blocked|freeze|locked|disabled|avoid blocking|a\/c blocking)\b/i.test(lower);
  const hasCallbackRequest = /\b(?:call us|call \d|dial)\b/i.test(lower) && allPhones.length > 0;
  const hasApkAttachment = attachments.some((a) => a.type === 'APK');

  const isGenuineOtpDelivery =
    /\b(?:is your (?:login|verification|secret)? otp|otp is \d{4,8}|valid for \d+ mins)\b/i.test(lower) &&
    isNegativeOtpWarning &&
    !hasCallbackRequest &&
    !hasAccountThreat &&
    !hasApkAttachment &&
    allUrls.length === 0;

  const isGenuineBankTxn =
    /\b(?:credited to a\/c|debited from a\/c|avl bal:|available balance)\b/i.test(lower) &&
    !hasAccountThreat &&
    !lower.includes('rekyc') &&
    !hasApkAttachment &&
    allUrls.length === 0;

  const isGenuineCommerceReceipt =
    /\b(?:order confirmed|thank you for shopping|total paid:|store #|cashier:)\b/i.test(lower) &&
    !lower.includes('claim your reward') &&
    !lower.includes('won a $') &&
    !lower.includes('gift card');

  if (isGenuineOtpDelivery) {
    return {
      verdict: 'LIKELY_LEGITIMATE',
      riskScore: 10,
      riskLevel: 'LOW',
      summary: 'This message provides a one-time verification code (OTP) for account login or transaction authorization and reminds you not to share the code with anyone.',
      contentType: routed.contentType,
      scamCategories: ['TRANSACTIONAL_OTP'],
      signals: [{ type: 'INFORMATIONAL_OTP', severity: 'low', evidence: 'Standard OTP delivery format with explicit security warning ("Never share OTP")', source: 'OCR' }],
      entities: { organization: claimedOrg, phoneNumbers: allPhones, urls: [], attachments: [], amounts: [] },
      requestedAction: 'Use OTP directly in your official banking or application login session. Never share it over calls or SMS.',
      recommendation: 'Keep your OTP confidential. Do not forward or share this code with anyone claiming to be bank support.',
      matchedConcepts: ['legitimate otp'],
    };
  }

  if (isGenuineBankTxn) {
    return {
      verdict: 'LIKELY_LEGITIMATE',
      riskScore: 12,
      riskLevel: 'LOW',
      summary: `This message is a transaction notification from ${claimedOrg !== 'Unknown / Personal Contact' ? claimedOrg : 'your bank'} confirming a recent account balance or transaction update.`,
      contentType: routed.contentType,
      scamCategories: ['BANKING_ALERT'],
      signals: [{ type: 'TRANSACTION_NOTIFICATION', severity: 'low', evidence: 'Standard bank balance / transaction update format', source: 'OCR' }],
      entities: { organization: claimedOrg, phoneNumbers: allPhones, urls: [], attachments: [], amounts },
      requestedAction: 'None required. Retain for your personal financial records.',
      recommendation: 'Check your official bank mobile app to verify settled account balances.',
      matchedConcepts: ['bank transaction update'],
    };
  }

  if (isGenuineCommerceReceipt) {
    return {
      verdict: 'LIKELY_LEGITIMATE',
      riskScore: 14,
      riskLevel: 'LOW',
      summary: 'This message is an order confirmation and purchase receipt confirming transaction details.',
      contentType: routed.contentType,
      scamCategories: ['COMMERCE_RECEIPT'],
      signals: [{ type: 'PURCHASE_RECEIPT', severity: 'low', evidence: 'Verified order / receipt layout with stated amount', source: 'OCR' }],
      entities: { organization: claimedOrg, phoneNumbers: allPhones, urls: allUrls, attachments: [], amounts },
      requestedAction: 'None required.',
      recommendation: 'Retain receipt for invoice and product warranty records.',
      matchedConcepts: ['order receipt'],
    };
  }

  // =========================================================================
  // 3. SIGNAL EXTRACTION & SCORING (Requirement 11)
  // =========================================================================
  const detectedSignals: Array<{ type: string; severity: 'low' | 'medium' | 'high' | 'critical'; evidence: string; source?: string }> = [];
  const matchedConcepts: string[] = [];

  let urgencyScore = 0;
  let threatScore = 0;
  let moneyScore = 0;
  let sensitiveScore = 0;
  let attachmentScore = 0;
  let linkScore = 0;
  let impersonationScore = 0;
  let socialScore = 0;
  let unsolicitedOfferScore = 0;
  let vishingScore = 0;
  let kycScore = 0;

  // Check Signal Library keywords
  for (const item of FRAUD_SIGNAL_LIBRARY) {
    for (const kw of item.keywords) {
      if (lower.includes(kw)) {
        matchedConcepts.push(kw);
        switch (item.category) {
          case 'urgency':
            if (urgencyScore === 0) {
              urgencyScore = item.weight;
              detectedSignals.push({ type: 'URGENCY', severity: item.severity, evidence: `Urgency pressure detected: "${kw}"`, source: 'OCR' });
            }
            break;
          case 'threat':
            if (threatScore === 0) {
              threatScore = item.weight;
              detectedSignals.push({ type: 'ACCOUNT_THREAT', severity: item.severity, evidence: `Account threat / blocking framing: "${kw}"`, source: 'OCR' });
            }
            break;
          case 'payment':
            if (moneyScore === 0) {
              moneyScore = item.weight;
              detectedSignals.push({ type: 'PAYMENT_DEMAND', severity: item.severity, evidence: `Payment or fee demand: "${kw}"`, source: 'OCR' });
            }
            break;
          case 'sensitive_data':
          case 'sensitive_info':
            if (sensitiveScore === 0) {
              sensitiveScore = item.weight;
              detectedSignals.push({ type: 'CREDENTIAL_HARVESTING', severity: item.severity, evidence: `Request for secret credentials or PII: "${kw}"`, source: 'OCR' });
            }
            break;
          case 'attachment':
            if (attachmentScore === 0) {
              attachmentScore = item.weight;
              detectedSignals.push({ type: 'MALICIOUS_ATTACHMENT', severity: item.severity, evidence: `Dangerous executable/APK file attachment: "${kw}"`, source: 'OCR + Layout' });
            }
            break;
          case 'brand':
          case 'impersonation':
            if (impersonationScore === 0) {
              impersonationScore = item.weight;
              detectedSignals.push({ type: 'BRAND_IMPERSONATION', severity: item.severity, evidence: `Impersonation of established organization: "${kw}"`, source: 'OCR' });
            }
            break;
          case 'social_engineering':
            if (socialScore === 0) {
              socialScore = item.weight;
              detectedSignals.push({ type: 'SOCIAL_ENGINEERING', severity: item.severity, evidence: `Social engineering / conversational pretext: "${kw}"`, source: 'OCR' });
            }
            break;
        }
      }
    }
  }

  // Direct Attachment Signal if detected in entity extraction
  if (attachments.length > 0 && attachmentScore === 0) {
    const isApk = attachments.some((a) => a.type === 'APK');
    attachmentScore = isApk ? 25 : 15;
    detectedSignals.push({
      type: 'MALICIOUS_ATTACHMENT',
      severity: isApk ? 'critical' : 'high',
      evidence: `Attached file payload detected: ${attachments.map((a) => a.filename).join(', ')}`,
      source: 'OCR + Layout',
    });
  }

  // Direct URL Signal
  if (allUrls.length > 0) {
    linkScore = 15;
    const suspiciousDomains = allUrls.filter((u) => !u.includes('.gov') && !u.includes('.bank'));
    detectedSignals.push({
      type: 'SUSPICIOUS_LINK',
      severity: 'high',
      evidence: `External link destination identified: ${suspiciousDomains.join(', ')}`,
      source: 'OCR',
    });
  }

  // Vishing Signal (Callback phone number in security context)
  if (allPhones.length > 0 && (lower.includes('call') || lower.includes('toll free') || lower.includes('contact support') || lower.includes('phone:'))) {
    vishingScore = 15;
    detectedSignals.push({
      type: 'VISHING_CALLBACK',
      severity: 'high',
      evidence: `Direct phone callback number provided for verification: ${allPhones.join(', ')}`,
      source: 'OCR',
    });
  }

  // KYC Signal
  if (/\b(?:rekyc|re-kyc|ekyc|kyc|complete kyc|update kyc|verification)\b/i.test(lower)) {
    kycScore = 15;
    if (!detectedSignals.some((s) => s.type === 'KYC_REQUEST')) {
      detectedSignals.push({
        type: 'KYC_REQUEST',
        severity: 'high',
        evidence: 'Urgent KYC reverification directive detected in text',
        source: 'OCR',
      });
    }
  }

  // WhatsApp Fake Job / Review Scam Detection
  if (
    routed.contentType === 'WHATSAPP' &&
    (lower.includes('google reviews') || lower.includes('google doc') || lower.includes('job') || lower.includes('review') || lower.includes('pays')) &&
    (lower.includes('may i share') || lower.includes('part-time') || lower.includes('daily') || lower.includes('salary') || amounts.length > 0)
  ) {
    unsolicitedOfferScore = 20;
    detectedSignals.push({
      type: 'FAKE_JOB_BAIT',
      severity: 'high',
      evidence: 'Unsolicited WhatsApp job offering payment for simple online tasks / Google reviews',
      source: 'OCR + Channel',
    });
  }

  // =========================================================================
  // 4. REFERENCE DATASET COMPARISON (Requirement 9, 10, 15)
  // =========================================================================
  let highestMatchScore = 0;
  let bestMatch: ReferenceScamPattern | null = null;

  for (const ref of REFERENCE_SCAM_DATASET) {
    let matchScore = 0;

    // Check concept overlap
    for (const concept of ref.matchingConcepts) {
      if (lower.includes(concept.toLowerCase())) {
        matchScore += 10;
      }
    }

    // Check category correlation
    if (ref.categories.includes('BANK_KYC_PHISHING') && (lower.includes('kyc') || lower.includes('rekyc')) && (attachments.some((a) => a.type === 'APK') || lower.includes('bank'))) matchScore += 30;
    if (ref.categories.includes('PHONE_PHISHING') && allPhones.length > 0 && lower.includes('call')) matchScore += 25;
    if (ref.categories.includes('DELIVERY_SCAM') && (lower.includes('delivery') || lower.includes('parcel'))) matchScore += 25;
    if (ref.categories.includes('PRIZE_SCAM') && (lower.includes('won') || lower.includes('gift card') || lower.includes('reward'))) matchScore += 25;
    if (ref.categories.includes('TOLL_SCAM') && (lower.includes('toll') || lower.includes('sunpass') || lower.includes('ezpass'))) matchScore += 30;
    if (ref.categories.includes('LOAN_SCAM') && (lower.includes('loan') || lower.includes('forgiveness'))) matchScore += 25;
    if (ref.categories.includes('FAKE_JOB_SCAM') && (lower.includes('review') || lower.includes('job') || lower.includes('pays'))) matchScore += 30;
    if (ref.categories.includes('PERSONAL_DATA_HARVESTING') && (lower.includes('emails and address') || lower.includes('for our record'))) matchScore += 25;

    if (matchScore > highestMatchScore) {
      highestMatchScore = matchScore;
      bestMatch = ref;
    }
  }

  // =========================================================================
  // 5. CALCULATE 0–100 RISK SCORE
  // =========================================================================
  let totalScore = 0;
  if (highestMatchScore >= 20) totalScore += 25; // Known fraud-pattern similarity
  if (bestMatch) totalScore += 20; // Same scam category/intent
  totalScore += linkScore; // +15
  totalScore += attachmentScore; // +20 or +25
  totalScore += threatScore; // +15
  totalScore += urgencyScore; // +10
  totalScore += moneyScore; // +10
  totalScore += sensitiveScore; // +10
  totalScore += impersonationScore; // +10
  totalScore += vishingScore; // +15
  totalScore += socialScore; // +10
  totalScore += unsolicitedOfferScore; // +20
  totalScore += kycScore; // +15

  // =========================================================================
  // 6. HIGH-CONFIDENCE SAFETY OVERRIDES (Requirement 17, 28, 29)
  // =========================================================================
  let isCriticalOverride = false;
  let isHighOverride = false;

  // Rule A: Bank + KYC/ReKYC + Account Threat + Urgency + APK Attachment
  if (
    (lower.includes('bank') || claimedOrg.toLowerCase().includes('bank') || claimedOrg === 'Bank of Maharashtra') &&
    (lower.includes('kyc') || lower.includes('rekyc')) &&
    (hasAccountThreat || lower.includes('a/c blocking')) &&
    (attachmentScore > 0 || attachments.some((a) => a.type === 'APK'))
  ) {
    isCriticalOverride = true;
    totalScore = Math.max(totalScore, 96);
  }

  // Rule B: Toll Scam (SunPass / E-ZPass / DMV Threat + Payment / Link)
  if (
    (lower.includes('toll') || lower.includes('sunpass') || lower.includes('ezpass') || lower.includes('dmv')) &&
    (moneyScore > 0 || linkScore > 0 || lower.includes('pay') || lower.includes('late fee'))
  ) {
    isCriticalOverride = true;
    totalScore = Math.max(totalScore, 94);
  }

  // Rule C: Retail Prize Scam (Target / Walmart $500 Gift Card won + Link)
  if (
    (lower.includes('target') || lower.includes('walmart') || lower.includes('gift card') || lower.includes('won')) &&
    (lower.includes('500') || lower.includes('winner') || lower.includes('reward')) &&
    allUrls.length > 0
  ) {
    isHighOverride = true;
    totalScore = Math.max(totalScore, 90);
  }

  // Rule D: Bank Security Lock + Unverified Vishing Callback Number
  if (
    (lower.includes('wells fargo') || lower.includes('chase') || lower.includes('bank')) &&
    (hasAccountThreat || lower.includes('locked') || lower.includes('suspicious activity')) &&
    allPhones.length > 0
  ) {
    isHighOverride = true;
    totalScore = Math.max(totalScore, 90);
  }

  // Rule E: WhatsApp Fake Job / Review Scam
  if (
    routed.contentType === 'WHATSAPP' &&
    (lower.includes('google reviews') || lower.includes('job') || lower.includes('review task')) &&
    (lower.includes('may i share') || lower.includes('google doc') || amounts.length > 0)
  ) {
    isHighOverride = true;
    totalScore = Math.max(totalScore, 88);
  }

  // Cap at 100
  totalScore = Math.min(100, Math.max(10, totalScore));

  // Determine Risk Level & Verdict
  let riskLevel: RiskLevel = 'LOW';
  let verdict: FraudVerdict = 'LIKELY_LEGITIMATE';

  if (totalScore >= 81 || isCriticalOverride) {
    riskLevel = 'CRITICAL';
    verdict = 'CRITICAL_FRAUD' as any;
  } else if (totalScore >= 61 || isHighOverride) {
    riskLevel = 'HIGH';
    verdict = 'LIKELY_FRAUD';
  } else if (totalScore >= 41) {
    riskLevel = 'SUSPICIOUS';
    verdict = 'SUSPICIOUS';
  } else if (totalScore >= 21) {
    riskLevel = 'CAUTION';
    verdict = 'SUSPICIOUS';
  } else {
    riskLevel = 'LOW';
    verdict = 'LIKELY_LEGITIMATE';
  }

  // =========================================================================
  // 7. COMPOSE SUMMARY, INTENT & ACTION
  // =========================================================================
  const summary = generateMessageSummary(
    text,
    claimedOrg,
    routed,
    bestMatch && highestMatchScore >= 20 ? bestMatch : null,
    allUrls,
    allPhones,
    attachments,
    amounts
  );

  let requestedAction = routed.requestedActions.length > 0 ? routed.requestedActions.join(' / ') : 'Verify message sender independently.';
  let recommendation = 'Do not click external links, do not open attached files, and never disclose OTPs or passwords.';
  let scamCategories: string[] = [];

  if (bestMatch && highestMatchScore >= 20) {
    if (routed.requestedActions.length === 0) requestedAction = bestMatch.intent.wantsUserToDo;
    recommendation = bestMatch.recommendation;
    scamCategories = bestMatch.categories;
  } else if (verdict === 'CRITICAL_FRAUD' || verdict === 'LIKELY_FRAUD' || verdict === 'SUSPICIOUS') {
    if (routed.requestedActions.length === 0) {
      requestedAction = allUrls.length > 0 ? `Click provided link (${allUrls[0]})` : allPhones.length > 0 ? `Call phone number (${allPhones[0]})` : 'Perform requested verification';
    }
    recommendation = 'Do not follow the instructions in the message. Verify through official authorized channels only.';
    scamCategories = ['SOCIAL_ENGINEERING', 'SUSPICIOUS_COMMUNICATION'];
  } else {
    if (routed.requestedActions.length === 0) requestedAction = 'None detected.';
    recommendation = 'Appears legitimate based on visible information. Always exercise standard vigilance with unsolicited links.';
    scamCategories = ['INFORMATIONAL'];
  }

  return {
    verdict,
    riskScore: totalScore,
    riskLevel,
    summary,
    contentType: routed.contentType,
    scamCategories,
    signals: detectedSignals,
    entities: {
      organization: claimedOrg,
      phoneNumbers: allPhones,
      urls: allUrls,
      attachments,
      amounts,
    },
    requestedAction,
    recommendation,
    matchedPatternId: bestMatch?.id,
    matchedConcepts: Array.from(new Set(matchedConcepts)),
  };
}

export function generateMessageSummary(
  text: string,
  claimedOrg: string,
  routed: ContentTypeRoutingResult,
  bestMatch: ReferenceScamPattern | null,
  allUrls: string[],
  allPhones: string[],
  attachments: string[],
  amounts: string[]
): string {
  const lower = text.toLowerCase();

  // 1. If high-confidence match from reference knowledge base
  if (bestMatch && bestMatch.explanation && bestMatch.explanation.en) {
    let summaryEn = bestMatch.explanation.en;
    if (
      claimedOrg &&
      claimedOrg !== 'Unknown / Personal Contact' &&
      bestMatch.claimedOrganization &&
      claimedOrg.toLowerCase() !== bestMatch.claimedOrganization.toLowerCase()
    ) {
      summaryEn = summaryEn.replace(new RegExp(bestMatch.claimedOrganization, 'gi'), claimedOrg);
    }
    return summaryEn;
  }

  // 2. Specific Meaning Summaries
  const orgName = claimedOrg && claimedOrg !== 'Unknown / Personal Contact' ? claimedOrg : 'your bank';

  // Bank KYC / ReKYC / Account Blocking / APK
  if (
    lower.includes('rekyc') ||
    lower.includes('kyc') ||
    lower.includes('pan card') ||
    lower.includes('aadhaar') ||
    (lower.includes('account') && (lower.includes('block') || lower.includes('suspend') || lower.includes('deactivat')))
  ) {
    if (attachments.length > 0 || lower.includes('apk') || lower.includes('pdf file') || lower.includes('attached file')) {
      return `This message claims to be from ${orgName} and urges you to complete KYC immediately. It asks you to click an external link or download an attachment.`;
    }
    if (allUrls.length > 0) {
      return `This message claims that your ${orgName} KYC is incomplete and pressures you to complete it immediately to avoid account restrictions. It directs you to use a provided link to take action.`;
    }
    return `This message claims that your ${orgName} account or KYC requires immediate verification to prevent account blocking.`;
  }

  // Account Lock / Suspicious Activity / Phone Vishing
  if (
    (lower.includes('locked') || lower.includes('suspicious activit') || lower.includes('unauthorized')) &&
    (allPhones.length > 0 || lower.includes('call us') || lower.includes('call this number') || lower.includes('contact us'))
  ) {
    return `This message claims that your ${orgName} account has been locked due to suspicious activity and asks you to call a provided number to verify your identity.`;
  }

  // Package / Delivery / Courier
  if (
    lower.includes('parcel') ||
    lower.includes('package') ||
    lower.includes('delivery') ||
    lower.includes('courier') ||
    lower.includes('shipment') ||
    lower.includes('fedex') ||
    lower.includes('ups') ||
    lower.includes('usps') ||
    lower.includes('dhl')
  ) {
    if (amounts.length > 0 || lower.includes('pay') || lower.includes('fee')) {
      return `This message claims that a parcel delivery was missed and asks you to make a payment to reschedule the delivery.`;
    }
    return `This message claims that a parcel delivery was missed and directs you to a provided link to reschedule the delivery.`;
  }

  // Prize / Reward / Gift Card
  if (
    lower.includes('won a') ||
    lower.includes('you won') ||
    lower.includes('gift card') ||
    lower.includes('claim your reward') ||
    lower.includes('lottery') ||
    lower.includes('winner')
  ) {
    const rewardStr = amounts.length > 0 ? `a ${amounts[0]} gift card` : 'a reward';
    return `This message claims that you have won ${rewardStr} and asks you to click a link to claim the reward.`;
  }

  // Toll / Traffic / DMV Fine
  if (
    lower.includes('toll') ||
    lower.includes('sunpass') ||
    lower.includes('ezpass') ||
    lower.includes('e-zpass') ||
    lower.includes('dmv') ||
    lower.includes('fine') ||
    lower.includes('traffic violation')
  ) {
    return `This message claims that you have an outstanding toll or unpaid balance. It pressures you to make an immediate payment through a provided link to avoid penalties.`;
  }

  // Student Loan / Debt Relief
  if (lower.includes('student loan') || lower.includes('loan forgiveness') || lower.includes('debt relief')) {
    return `This message claims that you qualify for a student loan forgiveness program and asks you to call a provided number or use a link before enrollment ends.`;
  }

  // Job Offer / Review Tasks
  if (
    lower.includes('google review') ||
    lower.includes('job information') ||
    lower.includes('earn per day') ||
    lower.includes('daily income') ||
    lower.includes('part-time job') ||
    lower.includes('part time job')
  ) {
    return `This message offers an online job opportunity for writing reviews or completing tasks and asks for your permission to share task documents and links.`;
  }

  // Personal Info Request / Contact
  if (
    lower.includes('email and address') ||
    lower.includes('emails and address') ||
    lower.includes('for our record') ||
    lower.includes('send me your') ||
    lower.includes('share your address')
  ) {
    return `The sender is asking for your email address and physical address for record-keeping purposes.`;
  }

  // Utility / Electricity Disconnection
  if (lower.includes('electricity') || lower.includes('power connection') || lower.includes('bill overdue') || lower.includes('disconnection')) {
    return `This message claims that your electricity or utility service will be disconnected due to an unpaid bill and directs you to call a number or use a link to resolve it.`;
  }

  // If link or attachment with urgency
  if (allUrls.length > 0 || attachments.length > 0) {
    const orgPrefix = claimedOrg && claimedOrg !== 'Unknown / Personal Contact' ? `claims to be from ${claimedOrg} and ` : '';
    const actionTarget = attachments.length > 0 ? 'open an attached file' : 'click a provided link';
    return `This message ${orgPrefix}pressures you to take immediate action. It asks you to ${actionTarget} to proceed.`;
  }

  if (allPhones.length > 0) {
    return `This message asks you to call or contact a provided phone number (${allPhones[0]}) regarding your account.`;
  }

  return `This message appears to be standard communication without specific financial demands or account verification requests.`;
}
