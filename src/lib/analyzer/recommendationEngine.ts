import type {
  ExplainableRiskPattern,
  ConsistencyAudit,
  FinancialIntelligence,
  PrivacyFinding,
} from './types';

export function generateRecommendations(
  riskPatterns: ExplainableRiskPattern[],
  consistency: ConsistencyAudit,
  financial: FinancialIntelligence,
  privacyFindings: PrivacyFinding[]
): string[] {
  const recs: string[] = [];

  // High priority risks
  for (const risk of riskPatterns.filter((r) => r.severity === 'high')) {
    recs.push(risk.recommendedAction);
  }

  // Consistency issues
  if (!consistency.isConsistent) {
    recs.push('Do not accept this screenshot as genuine proof of transfer due to internal data discrepancies. Check the bank app directly.');
  }

  // Financial verification
  if (financial.financialType === 'CREDIT' || financial.financialType === 'DEBIT' || financial.financialType === 'PENDING') {
    recs.push('Verify settled balances directly inside your official banking or UPI app before dispatching goods or considering payment finalized.');
  }

  // Privacy protection
  if (privacyFindings.length > 0) {
    recs.push('Use the built-in Redactor tool to blur or black out sensitive personal identifying information (card numbers, phone, emails) before sharing.');
  }

  // Default if clean
  if (recs.length === 0) {
    recs.push('No significant risk signals detected. Always maintain caution when sharing screenshots online.');
  }

  return Array.from(new Set(recs));
}
