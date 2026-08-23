import type {
  FinancialIntelligence,
  ConsistencyAudit,
  ConsistencyIssue,
  ExtractedEntitiesResult,
  TopCategory,
} from './types';

export function analyzeFinancialIntelligence(
  text: string,
  category: TopCategory,
  entities: ExtractedEntitiesResult
): { financial: FinancialIntelligence; consistency: ConsistencyAudit } {
  const lower = text.toLowerCase();
  const isFinancialCategory =
    ['BANKING', 'PAYMENT', 'COMMERCE'].includes(category) || entities.amounts.length > 0;

  const issues: ConsistencyIssue[] = [];

  if (!isFinancialCategory) {
    return {
      financial: {
        financialType: 'NOT_FINANCIAL',
        amounts: [],
        status: 'Not applicable',
        settledFundsVerified: false,
        verificationDisclaimer: 'No financial transaction detected in this image.',
      },
      consistency: {
        isConsistent: true,
        issues: [],
        disclaimer: 'No multi-variable transaction inconsistencies detected.',
      },
    };
  }

  // Determine Financial Type
  let financialType: FinancialIntelligence['financialType'] = 'NOT_FINANCIAL';
  let status = 'Stated';

  if (/\b(?:credited|deposit(?:ed)?|cashback received|refund processed|credited back)\b/i.test(lower)) {
    financialType = 'CREDIT';
    status = 'Credited';
  } else if (/\b(?:debited|paid|transferred to|sent to|payment successful|subscription payment of|total paid)\b/i.test(lower)) {
    financialType = 'DEBIT';
    status = 'Debited / Transferred';
  } else if (/\b(?:refund|chargeback)\b/i.test(lower)) {
    financialType = 'REFUND';
    status = 'Refunded';
  } else if (/\b(?:pending|processing|under review|in progress)\b/i.test(lower)) {
    financialType = 'PENDING';
    status = 'Pending Settlement';
  } else if (/\b(?:failed|declined|unsuccessful|rejected)\b/i.test(lower)) {
    financialType = 'FAILED';
    status = 'Payment Failed';
  } else if (/\b(?:reversed|cancelled)\b/i.test(lower)) {
    financialType = 'REVERSED';
    status = 'Payment Reversed';
  } else if (/\b(?:requested|pay request|collect request|please send)\b/i.test(lower)) {
    financialType = 'PAYMENT_REQUEST';
    status = 'Payment Requested';
  } else if (entities.amounts.length > 0) {
    financialType = 'DEBIT';
    status = 'Amount Stated';
  }

  // 1. AMOUNT CONSISTENCY AUDIT
  // Filter out amounts that represent Account Balances ("Avl Bal", "balance")
  const transactionAmounts = entities.amounts.filter((a) => {
    if (a.value < 1) return false;
    if (a.context === 'Account balance') return false;
    return true;
  });

  if (transactionAmounts.length >= 2) {
    const distinctValues = Array.from(new Set(transactionAmounts.map((a) => a.value)));
    if (
      distinctValues.length > 1 &&
      (category === 'PAYMENT' || category === 'BANKING' || category === 'MESSAGING') &&
      !lower.includes('avl bal') &&
      !lower.includes('available balance')
    ) {
      const ratio = Math.max(...distinctValues) / Math.min(...distinctValues);
      if (ratio === 10 || ratio === 100 || distinctValues.length === 2) {
        issues.push({
          id: 'amount_inconsistency',
          type: 'AMOUNT_INCONSISTENCY',
          title: 'Internal Amount Discrepancy',
          explanation: `Conflicting transaction amounts (${distinctValues.map((v) => transactionAmounts[0].currency + ' ' + v).join(' vs ')}) detected in the receipt. This discrepancy is a primary signal of manually edited screenshot graphics.`,
          valuesFound: distinctValues.map((v) => `${transactionAmounts[0].currency} ${v}`),
          severity: 'high',
        });
      }
    }
  }

  // 2. STATUS CONTRADICTION AUDIT
  const hasSuccess = /\b(?:successful|completed|approved|paid|credited)\b/i.test(lower);
  const hasFailure = /\b(?:failed|declined|rejected|cancelled|unsuccessful)\b/i.test(lower);
  const hasPending = /\b(?:pending|processing|under review)\b/i.test(lower);

  if (hasSuccess && hasFailure && category !== 'COMMERCE') {
    issues.push({
      id: 'status_contradiction_failed',
      type: 'STATUS_INCONSISTENCY',
      title: 'Contradictory Status Keywords (Success + Failure)',
      explanation: 'The screenshot contains both "successful/paid" and "failed/declined/cancelled" status terms.',
      valuesFound: ['Success keyword', 'Failure keyword'],
      severity: 'high',
    });
  } else if (hasSuccess && hasPending && category !== 'COMMERCE') {
    issues.push({
      id: 'status_contradiction_pending',
      type: 'STATUS_INCONSISTENCY',
      title: 'Contradictory Status Keywords (Success + Pending)',
      explanation: 'The screenshot contains both "successful" and "pending" indicators, suggesting incomplete settlement or composite edits.',
      valuesFound: ['Success keyword', 'Pending keyword'],
      severity: 'medium',
    });
  }

  const financial: FinancialIntelligence = {
    financialType,
    amounts: entities.amounts,
    primaryAmount: entities.amounts[0],
    sender: entities.people[1] || undefined,
    recipient: entities.people[0] || entities.organizations[0] || undefined,
    platform: entities.organizations.find((o) =>
      ['Google Pay', 'GPay', 'PhonePe', 'Paytm', 'BHIM', 'PayPal', 'Venmo', 'Zelle'].includes(o)
    ) || undefined,
    transactionId: entities.transactionIds[0] || undefined,
    accountIdentifier: entities.accounts[0] || undefined,
    date: entities.dates[0] || undefined,
    time: entities.times[0] || undefined,
    status,
    settledFundsVerified: false,
    verificationDisclaimer:
      'Payment claim detected, but transaction settlement cannot be verified from a screenshot alone. Confirm balance and credits directly through your official banking portal or payment app.',
  };

  const consistency: ConsistencyAudit = {
    isConsistent: issues.length === 0,
    issues,
    disclaimer:
      issues.length > 0
        ? 'Internal transaction inconsistencies were identified from the visual and textual evidence.'
        : 'No obvious internal amount or status contradictions detected.',
  };

  return { financial, consistency };
}

export function analyzeFinancialContent(
  text: string,
  category: any,
  entities: ExtractedEntitiesResult
) {
  const { financial, consistency } = analyzeFinancialIntelligence(text, category, entities);
  return {
    financialType: financial.financialType,
    amountsFound: financial.amounts,
    hasAmountInconsistency: consistency.issues.some((i) => i.type === 'AMOUNT_INCONSISTENCY'),
    amountInconsistencyNote: consistency.issues.find((i) => i.type === 'AMOUNT_INCONSISTENCY')?.explanation,
    hasStatusContradiction: consistency.issues.some((i) => i.type === 'STATUS_INCONSISTENCY'),
    statusContradictionNote: consistency.issues.find((i) => i.type === 'STATUS_INCONSISTENCY')?.explanation,
    verificationDisclaimer: financial.verificationDisclaimer,
  };
}
