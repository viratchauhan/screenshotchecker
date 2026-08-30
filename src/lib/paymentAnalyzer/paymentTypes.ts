export type PaymentReceiptType =
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_PROCESSING'
  | 'BANK_BALANCE'
  | 'TRANSACTION_HISTORY'
  | 'UPI_TRANSFER_DETAILS'
  | 'REFUND'
  | 'REFUND_RECEIVED'
  | 'COLLECT_REQUEST'
  | 'BANK_TRANSFER'
  | 'CARD_PAYMENT'
  | 'NOT_PAYMENT'
  | 'UNKNOWN';

export type PaymentApp =
  | 'PhonePe'
  | 'Google Pay'
  | 'Paytm'
  | 'BHIM UPI'
  | 'Pop UPI'
  | 'Bank UPI'
  | 'Other Payment App'
  | 'Not confidently identified';

export type PaymentProofStrength = 'NONE' | 'WEAK' | 'PARTIAL' | 'STRONG_VISUAL';

export type PaymentVerdict =
  | 'LOW_RISK'
  | 'CAUTION'
  | 'SUSPICIOUS'
  | 'HIGH_RISK'
  | 'VERY_HIGH_RISK'
  | 'NO_PAYMENT_PROOF'
  | 'NOT_A_PAYMENT';

export interface PaymentRiskFactor {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  explanation: string;
  where?: string;
  why?: string;
  valuesFound?: string[];
}

export interface ExtractedPaymentFact {
  label: string;
  value: string;
  source: 'OCR' | 'visual' | 'metadata' | 'inference';
  confidence: number;
}

export interface PaymentAnalysisResult {
  id: string;
  timestamp: string;
  domain: 'payment' | 'non_payment';
  isPaymentScreenshot: boolean;
  receiptType: PaymentReceiptType;
  receiptTypeLabel: string;
  paymentApp: PaymentApp;
  bank: string;
  amount: string;
  secondaryAmounts: string[];
  recipientName: string;
  upiId: string;
  transactionId: string;
  utr: string;
  date: string;
  time: string;
  paymentProofStrength: PaymentProofStrength;
  paymentProofExplanation: string;
  visualIntegrity: {
    status: 'NORMAL' | 'SUSPICIOUS' | 'INCONSISTENT';
    issues: PaymentRiskFactor[];
  };
  consistency: {
    status: 'CONSISTENT' | 'INCONSISTENT' | 'SUSPICIOUS';
    issues: PaymentRiskFactor[];
  };
  verdict: PaymentVerdict;
  verdictLabel: string;
  verdictDescription: string;
  riskScore: number;
  confidence: number;
  riskFactors: PaymentRiskFactor[];
  verificationStatus: string;
  whatWeFound: string[];
  whatConcernsUs: string[];
  recommendations: string[];
  groundedFacts: ExtractedPaymentFact[];
  rawOcrText: string;
  dataUrl: string;
  imageInfo: {
    name: string;
    sizeBytes: number;
    width: number;
    height: number;
    mimeType: string;
    aspectRatio: string;
  };
  forensics?: {
    compressionInconsistency: string;
    noiseVarianceScore: number;
    notes: string[];
  };
}
