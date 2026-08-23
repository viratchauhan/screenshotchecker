import type {
  ExplainableRiskPattern,
  TopCategory,
  StructuredEntity,
  SemanticClaim,
  RequestedAction,
  FinancialIntelligence,
  ConsistencyAudit,
  ChannelIntelligence,
  LinkFinding,
} from './types';

export function evaluateExplainableRisks(
  category: TopCategory,
  entities: StructuredEntity[],
  claims: SemanticClaim[],
  actions: RequestedAction[],
  financial: FinancialIntelligence,
  consistency: ConsistencyAudit,
  channel: ChannelIntelligence,
  links: LinkFinding[]
): ExplainableRiskPattern[] {
  const patterns: ExplainableRiskPattern[] = [];

  const orgNames = entities.filter((e) => e.type === 'BANK' || e.type === 'ORGANIZATION').map((e) => e.value);
  const urls = entities.filter((e) => e.type === 'URL').map((e) => e.value);
  const isUrgent = channel.isUrgent || Boolean(claims[0]?.timePressure);
  const primaryClaim = claims[0];
  const primaryAction = actions[0];

  const hasSuspiciousLink = links.some((l) => l.riskLevel === 'high' || l.riskLevel === 'medium');

  // 1. Bank Phishing Pattern: Org/Bank + Urgency + External Link + Auth Action
  if (
    (primaryClaim?.claimType === 'ACCOUNT_LOCKED' || orgNames.length > 0) &&
    isUrgent &&
    urls.length > 0 &&
    (actions.some((a) => a.actionType === 'LOGIN' || a.actionType === 'VERIFY_ACCOUNT' || a.actionType === 'SHARE_OTP') ||
      hasSuspiciousLink)
  ) {
    patterns.push({
      id: 'pattern_bank_phishing',
      title: 'Potential Phishing & Credential Theft Pattern',
      whatWasFound: `High-urgency notice invoking ${orgNames[0] || 'an organization'} demanding authentication via external link.`,
      whyItMatters:
        'Legitimate financial and security institutions do not send unencrypted messages urging users to click external links to resolve account lockout penalties within short deadlines.',
      supportingEvidence: [
        `Claimed Institution: ${orgNames.join(', ') || 'Financial Brand'}`,
        `Urgency Pressure: ${primaryClaim?.timePressure || 'Immediate timeframe claimed'}`,
        `External Link Target: ${urls[0]}`,
        `Action Requested: ${primaryAction?.label || 'Account Verification / Login'}`,
      ],
      severity: 'high',
      recommendedAction:
        'Do not click the provided link and do not enter any credentials. Access the official organization app or website directly from your browser.',
    });
  }

  // 2. Advance-Fee Scam: Prize/Lottery + Payment Demand
  if (
    primaryClaim?.claimType === 'PRIZE_WON' &&
    actions.some((a) => a.actionType === 'MAKE_PAYMENT' || a.actionType === 'CALL_NUMBER' || a.actionType === 'CLICK_LINK')
  ) {
    patterns.push({
      id: 'pattern_advance_fee_scam',
      title: 'Potential Advance-Fee / Lottery Scam Pattern',
      whatWasFound: 'Unsolicited prize or lottery claim paired with a fee payment or gift card demand.',
      whyItMatters:
        'Genuine sweepstakes and government lotteries never require winners to wire advance processing fees, release taxes, or buy retail gift cards to receive winnings.',
      supportingEvidence: [
        `Claim: ${primaryClaim.primaryClaim}`,
        `Action: ${primaryAction.label}`,
        'Evidence: Unsolicited winning notification paired with upfront fund transfer demand',
      ],
      severity: 'high',
      recommendedAction:
        'Do not send money, gift cards, or crypto to claim unsolicited prizes. Cease communication immediately.',
    });
  }

  // 3. Social Engineering / OTP Stealing: Security Threat + OTP Request
  if (
    (primaryClaim?.claimType === 'ACCOUNT_LOCKED' || channel.isThreatPresent) &&
    actions.some((a) => a.actionType === 'SHARE_OTP')
  ) {
    patterns.push({
      id: 'pattern_otp_takeover',
      title: 'High-Risk Account Takeover & Social Engineering',
      whatWasFound: 'Account security warning combined with a directive to share or enter an OTP code.',
      whyItMatters:
        'One-time passwords are secret second-factor keys. Genuine bank support staff and system alerts will never ask you to disclose or forward your OTP.',
      supportingEvidence: [
        'Security threat framing identified',
        'Direct prompt for OTP disclosure or transmission detected',
      ],
      severity: 'high',
      recommendedAction:
        'Never disclose your OTP to anyone, regardless of who they claim to represent.',
    });
  }

  // 4. Inconsistency / Discrepancy Findings
  for (const issue of consistency.issues) {
    patterns.push({
      id: `pattern_consistency_${issue.id}`,
      title: issue.title,
      whatWasFound: issue.explanation,
      whyItMatters:
        'Visual receipts with contradictory numbers or statuses strongly suggest manipulated or composited screenshot graphics.',
      supportingEvidence: issue.valuesFound,
      severity: issue.severity,
      recommendedAction:
        'Do not accept this screenshot as genuine proof of payment. Verify the settlement directly in your payment or banking portal.',
    });
  }

  // 5. Unverified Financial Claim
  if (
    financial.financialType === 'CREDIT' ||
    financial.financialType === 'DEBIT' ||
    category === 'PAYMENT' ||
    category === 'BANKING'
  ) {
    patterns.push({
      id: 'pattern_unverified_financial',
      title: 'Unverified Financial Transaction Claim',
      whatWasFound: `Visual claim that a financial transaction (${financial.primaryAmount?.raw || 'funds'}) occurred.`,
      whyItMatters:
        'A screenshot alone cannot prove that money was actually settled or transferred. Confirmation screens and receipts can be fabricated or altered using mock apps.',
      supportingEvidence: [
        `Transaction Event: ${financial.financialType}`,
        `Amount Stated: ${financial.primaryAmount?.raw || 'Not specified'}`,
        'Evidence Type: Third-party visual screenshot (Unverified)',
      ],
      severity: 'info',
      recommendedAction:
        'Verify the transaction directly in your official banking or UPI app before dispatching goods or considering funds settled.',
    });
  }

  return patterns;
}

// Backward compatibility alias
export function evaluateContextualRisk(
  category: any,
  entities: any,
  claim: any,
  action: any,
  financial: any,
  links: any[]
) {
  const structuredEntities = entities.entities || [];
  const riskPatterns = evaluateExplainableRisks(
    category,
    structuredEntities,
    claim ? [claim] : [],
    action ? [action] : [],
    financial,
    { isConsistent: !financial.hasAmountInconsistency && !financial.hasStatusContradiction, issues: [], disclaimer: '' },
    { channel: 'GENERAL', isUrgent: false, isThreatPresent: false, isPaymentRequested: false, isOtpRequested: false, notes: [] },
    links || []
  );

  return {
    riskPatterns: riskPatterns.map((p) => ({
      id: p.id,
      title: p.title,
      explanation: `${p.whatWasFound} ${p.whyItMatters}`,
      severity: p.severity,
    })),
    isPhishingPattern: riskPatterns.some((p) => p.id === 'pattern_bank_phishing'),
    isAdvanceFeeScam: riskPatterns.some((p) => p.id === 'pattern_advance_fee_scam'),
    isAccountTakeoverRisk: riskPatterns.some((p) => p.id === 'pattern_otp_takeover'),
    isUnverifiedFinancialClaim: riskPatterns.some((p) => p.id === 'pattern_unverified_financial'),
  };
}
