import type { FraudAnalysisResponse, ScamSignal } from './fraudDetectionSchema';
import { evaluateFraudPatterns } from '../analyzer/fraudPatternEngine';

export async function analyzeFraudWithMockLLM(
  ocrText: string,
  urls: string[] = [],
  phones: string[] = []
): Promise<FraudAnalysisResponse> {
  // Simulate rapid natural analysis delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Run the semantic fraud pattern engine against the reference knowledge base
  const engineResult = evaluateFraudPatterns(ocrText, urls, phones);

  // Map engine classification
  let classification: 'fraud' | 'suspicious' | 'legitimate' | 'unverifiable' | 'ocr_error' = 'unverifiable';
  if (engineResult.isOcrError || engineResult.verdict === 'OCR_ERROR') {
    classification = 'ocr_error';
  } else if (engineResult.verdict === 'CRITICAL_FRAUD' || engineResult.verdict === 'LIKELY_FRAUD') {
    classification = 'fraud';
  } else if (engineResult.verdict === 'SUSPICIOUS') {
    classification = 'suspicious';
  } else if (engineResult.verdict === 'INSUFFICIENT_EVIDENCE') {
    classification = 'unverifiable';
  } else {
    classification = 'legitimate';
  }

  // Format message type
  let messageType = engineResult.contentType ? `${engineResult.contentType} Message` : 'General Communication';
  if (engineResult.scamCategories.length > 0 && engineResult.scamCategories[0] !== 'INFORMATIONAL') {
    messageType = engineResult.scamCategories
      .map((c) => c.replace(/_/g, ' '))
      .join(' / ');
  }

  const signals: ScamSignal[] = engineResult.signals.map((s) => ({
    type: s.type.toLowerCase(),
    severity: s.severity,
    evidence: s.evidence,
    source: s.source,
  }));

  const verdictLabel =
    engineResult.verdict === 'CRITICAL_FRAUD'
      ? 'CRITICAL_FRAUD'
      : engineResult.verdict === 'LIKELY_FRAUD'
      ? 'LIKELY_FRAUD'
      : engineResult.verdict === 'SUSPICIOUS'
      ? 'SUSPICIOUS'
      : engineResult.verdict === 'OCR_ERROR'
      ? 'OCR_ERROR'
      : engineResult.verdict === 'INSUFFICIENT_EVIDENCE'
      ? 'INSUFFICIENT_EVIDENCE'
      : 'LIKELY_LEGITIMATE';

  return {
    verdict: verdictLabel,
    classification,
    risk_level: engineResult.riskLevel.toLowerCase() as any,
    risk_score: engineResult.riskScore,
    message_type: messageType,
    contentType: engineResult.contentType,
    scam_categories: engineResult.scamCategories,
    summary: engineResult.summary,
    claimed_organization: engineResult.entities.organization,
    requested_action: engineResult.requestedAction,
    signals,
    urls: engineResult.entities.urls,
    phone_numbers: engineResult.entities.phoneNumbers,
    attachments: engineResult.entities.attachments,
    recommendation: engineResult.recommendation,
    matched_pattern_id: engineResult.matchedPatternId,
    isOcrError: engineResult.isOcrError,
  };
}
