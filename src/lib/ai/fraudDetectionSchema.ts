export type RiskLevel = 'low' | 'caution' | 'suspicious' | 'high' | 'critical';

export interface ScamSignal {
  type: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  evidence: string;
  source?: string;
}

export interface AttachmentInfo {
  filename: string;
  type: string;
}

export interface FraudAnalysisResponse {
  verdict?: 'CRITICAL_FRAUD' | 'LIKELY_FRAUD' | 'SUSPICIOUS' | 'LIKELY_LEGITIMATE' | 'INSUFFICIENT_EVIDENCE' | 'OCR_ERROR' | string;
  classification: 'fraud' | 'suspicious' | 'legitimate' | 'unverifiable' | 'ocr_error';
  risk_level: RiskLevel;
  risk_score: number; // 0-100
  message_type: string;
  contentType?: string;
  scam_categories?: string[];
  summary: string; // The simple explanation in Hinglish/Hindi/English
  claimed_organization: string;
  requested_action: string;
  signals: ScamSignal[];
  urls: string[];
  phone_numbers: string[];
  attachments: AttachmentInfo[];
  recommendation: string;
  matched_pattern_id?: string;
  isOcrError?: boolean;
}
