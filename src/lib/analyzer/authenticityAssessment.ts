import type {
  AuthenticityAssessment,
  AuthenticityStatus,
  TopCategory,
  ConsistencyAudit,
  ExplainableRiskPattern,
  FinancialIntelligence,
  SemanticClaim,
} from './types';

export function assessAuthenticity(
  category: TopCategory,
  claims: SemanticClaim[],
  financial: FinancialIntelligence,
  consistency: ConsistencyAudit,
  riskPatterns: ExplainableRiskPattern[]
): AuthenticityAssessment {
  const hasContradiction = !consistency.isConsistent;
  const hasHighRisk = riskPatterns.some((r) => r.severity === 'high');
  const isFinancial = financial.financialType !== 'NOT_FINANCIAL';

  let status: AuthenticityStatus = 'NOT_DETERMINED';
  let headline = 'Analysis Complete';
  let rationale = 'Available image and text evidence reviewed.';
  const limitations: string[] = [
    'Authenticity cannot be authoritatively established from a standalone graphic without external cryptographic or banking verification APIs.',
    'Screenshots and receipts can be replicated using graphic design software or mock generation applications.',
  ];

  if (hasContradiction) {
    status = 'CONTRADICTED';
    headline = 'Internal Discrepancy Detected';
    rationale = `The screenshot contains contradictory internal data (${consistency.issues.map((i) => i.title).join(', ')}). This inconsistency strongly suggests modified or fabricated visual content.`;
  } else if (hasHighRisk) {
    status = 'SUSPICIOUS';
    headline = 'Suspicious Risk Signals Identified';
    rationale = `The content exhibits combined signals matching known deceptive patterns (${riskPatterns.filter((r) => r.severity === 'high').map((r) => r.title).join(', ')}).`;
  } else if (category === 'COMMERCE' || category === 'MESSAGING' || category === 'EMAIL' || (category === 'SECURITY' && claims[0]?.claimType === 'OTP_DELIVERY')) {
    status = 'CONSISTENT';
    headline = 'Internally Consistent Visual Capture';
    rationale =
      'The layout, structure, and text content appear internally consistent with expected document or messaging formatting. However, screenshot proof alone does not prove the underlying communication occurred.';
  } else if (isFinancial || category === 'BANKING' || category === 'PAYMENT') {
    status = 'UNVERIFIABLE';
    headline = 'Financial Claim (Unverifiable from Screenshot Alone)';
    rationale =
      'A transaction claim is visibly communicated, but the transfer of funds cannot be independently verified from the image alone. Confirmation requires viewing settled funds inside the official bank application.';
  } else {
    status = 'INSUFFICIENT_EVIDENCE';
    headline = 'Insufficient Authenticity Evidence';
    rationale =
      'The uploaded image does not provide sufficient unambiguous structural or cryptographic markers to assess authenticity.';
  }

  return {
    status,
    headline,
    rationale,
    limitations,
  };
}
