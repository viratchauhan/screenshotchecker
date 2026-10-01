import type {
  PaymentAnalysisResult,
  PaymentVerdict,
  PaymentRiskFactor,
} from './paymentTypes';
import type { ClassificationResult } from './paymentClassifier';
import type { ExtractedPaymentData } from './paymentExtractor';
import type { VisualForensicsResult } from './paymentVisualForensics';

export function computePaymentRisk(
  classification: ClassificationResult,
  extracted: ExtractedPaymentData,
  forensics: VisualForensicsResult,
  rawText: string,
  dataUrl: string,
  imageInfo: PaymentAnalysisResult['imageInfo'],
  compressionNotes: string[] = []
): PaymentAnalysisResult {
  const id = `payment-audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  // 1. NON-PAYMENT SCREENSHOT
  if (!classification.isPaymentScreenshot || classification.receiptType === 'NOT_PAYMENT') {
    return {
      id,
      timestamp,
      domain: 'non_payment',
      isPaymentScreenshot: false,
      receiptType: 'NOT_PAYMENT',
      receiptTypeLabel: 'Non-Payment Screenshot',
      paymentApp: 'Not confidently identified',
      bank: 'Not detected',
      amount: 'Not detected',
      secondaryAmounts: [],
      recipientName: 'Not detected',
      upiId: 'Not detected',
      transactionId: 'Not detected',
      utr: 'Not detected',
      date: 'Not detected',
      time: 'Not detected',
      paymentProofStrength: 'NONE',
      paymentProofExplanation:
        'This image does not contain recognizable payment confirmation, UPI transfer, or banking receipt elements.',
      visualIntegrity: { status: 'NORMAL', issues: [] },
      consistency: { status: 'CONSISTENT', issues: [] },
      verdict: 'NOT_A_PAYMENT',
      verdictLabel: 'Payment Screenshot Not Detected',
      verdictDescription:
        'The uploaded image does not appear to be a UPI or payment confirmation receipt. If you are analyzing a suspicious SMS, email, or job offer, please use the General Screenshot Analyzer.',
      riskScore: 0,
      confidence: 90,
      riskFactors: [],
      verificationStatus: 'NOT_APPLICABLE',
      whatWeFound: ['Image does not match standard UPI or banking transaction interfaces.'],
      whatConcernsUs: ['No financial transaction or receipt layout detected.'],
      recommendations: [
        'Upload a valid screenshot of a payment confirmation from Google Pay, PhonePe, Paytm, BHIM, or your bank.',
      ],
      groundedFacts: [],
      rawOcrText: rawText,
      dataUrl,
      imageInfo,
    };
  }

  // 2. BANK BALANCE SCREENSHOT
  if (classification.receiptType === 'BANK_BALANCE') {
    const whatWeFound = [
      `Receipt Type: ${classification.receiptTypeLabel}`,
      extracted.bankName !== 'Not detected' ? `Bank: ${extracted.bankName}` : 'Bank detected in balance summary',
      extracted.primaryAmount !== 'Not detected' ? `Account Balance Shown: ${extracted.primaryAmount}` : 'Balance figure displayed',
    ];

    return {
      id,
      timestamp,
      domain: 'payment',
      isPaymentScreenshot: true,
      receiptType: 'BANK_BALANCE',
      receiptTypeLabel: 'Bank Account Balance Screen',
      paymentApp: classification.paymentApp,
      bank: extracted.bankName,
      amount: extracted.primaryAmount,
      secondaryAmounts: extracted.allAmounts.filter((a) => a !== extracted.primaryAmount),
      recipientName: 'Not applicable (Self account balance)',
      upiId: 'Not applicable',
      transactionId: 'Not applicable',
      utr: 'Not applicable',
      date: extracted.date,
      time: extracted.time,
      paymentProofStrength: 'NONE',
      paymentProofExplanation:
        'An account balance screen only demonstrates existing funds in an account. It is NOT proof that money was sent, transferred, or received.',
      visualIntegrity: { status: 'NORMAL', issues: [] },
      consistency: { status: 'CONSISTENT', issues: [] },
      verdict: 'NO_PAYMENT_PROOF',
      verdictLabel: 'NO PAYMENT PROOF (Account Balance Only)',
      verdictDescription:
        'This screenshot shows an account balance check, not a payment transfer confirmation. It cannot be used as proof of payment.',
      riskScore: 10,
      confidence: 95,
      riskFactors: [],
      verificationStatus: 'CANNOT_VERIFY_ACTUAL_BANK_RECEIPT',
      whatWeFound,
      whatConcernsUs: [
        'Balance inquiries do not generate transfer settlement. Never accept a balance screenshot as proof of payment.',
      ],
      recommendations: [
        'Ask the sender for an official transaction receipt containing a 12-digit UPI UTR number and transfer confirmation.',
        'Check your own bank account to see if funds were actually received.',
      ],
      groundedFacts: extracted.groundedFacts,
      rawOcrText: rawText,
      dataUrl,
      imageInfo,
    };
  }

  // 3. PAYMENT RECEIPT ANALYSIS & SCORING
  let riskScore = 10;
  const riskFactors: PaymentRiskFactor[] = [...forensics.issues];

  // Calculate score based on issues
  for (const factor of riskFactors) {
    if (factor.severity === 'critical') riskScore += 35;
    else if (factor.severity === 'high') riskScore += 25;
    else if (factor.severity === 'medium') riskScore += 15;
    else if (factor.severity === 'low') riskScore += 5;
  }

  // Collect request penalty
  if (classification.receiptType === 'COLLECT_REQUEST') {
    riskScore = Math.max(riskScore, 65);
    riskFactors.unshift({
      id: 'collect_request_deception',
      type: 'COLLECT_REQUEST',
      severity: 'high',
      title: 'UPI Collect Request (Money Deduction Risk)',
      explanation:
        'This screen represents a money request (Collect Request) requiring a UPI PIN, NOT an incoming payment.',
      where: 'Screen action header',
      why: 'Fraudsters often send collect requests claiming they are sending money.',
    });
  }

  riskScore = Math.min(100, Math.max(0, riskScore));

  // Determine Verdict
  let verdict: PaymentVerdict = 'LOW_RISK';
  let verdictLabel = 'LOW RISK (Few Text-Rule Matches)';
  let verdictDescription =
    'Few configured receipt-text rules matched. This does not establish visual integrity, authenticity or settled funds.';

  if (riskScore >= 75) {
    verdict = 'HIGH_RISK';
    verdictLabel = 'HIGH RISK (Multiple Rule Indicators)';
    verdictDescription =
      'Several weighted receipt-text indicators matched. Review the cited OCR evidence and verify the payment independently.';
  } else if (riskScore >= 45) {
    verdict = 'SUSPICIOUS';
    verdictLabel = 'SUSPICIOUS (Text-Rule Indicators)';
    verdictDescription =
      'Receipt-text or reference-format rules matched. These rules do not measure fonts or layout and need manual verification.';
  } else if (riskScore >= 25) {
    verdict = 'CAUTION';
    verdictLabel = 'CAUTION (Minor Irregularities)';
    verdictDescription =
      'One or more receipt-text rules matched. Visual differences were not measured; verify official records before confirming receipt of funds.';
  }

  // Grounded What We Found summary
  const whatWeFound: string[] = [];
  whatWeFound.push(`Receipt Classification: ${classification.receiptTypeLabel}`);
  if (classification.paymentApp !== 'Not confidently identified') {
    whatWeFound.push(`Payment Ecosystem: ${classification.paymentApp}`);
  }
  if (extracted.primaryAmount !== 'Not detected') {
    whatWeFound.push(`Payment Amount: ${extracted.primaryAmount}`);
  }
  if (extracted.recipientName !== 'Not detected') {
    whatWeFound.push(`Recipient / Banking Name: ${extracted.recipientName}`);
  }
  if (extracted.upiId !== 'Not detected') {
    whatWeFound.push(`UPI ID (VPA): ${extracted.upiId}`);
  }
  if (extracted.bankName !== 'Not detected') {
    whatWeFound.push(`Bank Account: ${extracted.bankName}${extracted.accountEndingDigits ? ` (Ending ${extracted.accountEndingDigits})` : ''}`);
  }
  if (extracted.utr !== 'Not detected') {
    whatWeFound.push(`UPI UTR / Reference: ${extracted.utr}`);
  }
  if (extracted.transactionId !== 'Not detected') {
    whatWeFound.push(`Transaction ID: ${extracted.transactionId}`);
  }
  if (extracted.date !== 'Not detected' || extracted.time !== 'Not detected') {
    whatWeFound.push(`Timestamp: ${[extracted.date, extracted.time].filter((v) => v !== 'Not detected').join(', ')}`);
  }

  // Grounded What Concerns Us
  const whatConcernsUs: string[] = [];
  if (riskFactors.length > 0) {
    for (const factor of riskFactors) {
      whatConcernsUs.push(`${factor.title}: ${factor.explanation}`);
    }
  } else {
    whatConcernsUs.push('No configured receipt-text issues matched. Fonts, icon alignment and digital tampering were not assessed by these text rules.');
  }

  // Grounded Recommendations
  const recommendations: string[] = [
    'Check your official Bank Statement via your Bank App or Bank. This is the ONLY legit method to verify whether money was received.',
    'Do not release goods, services, tickets, or refunds based solely on a customer-presented screenshot.',
    'Listen for an official UPI Soundbox audio confirmation or verify the credit notification on your own merchant app.',
  ];

  return {
    id,
    timestamp,
    domain: 'payment',
    isPaymentScreenshot: true,
    receiptType: classification.receiptType,
    receiptTypeLabel: classification.receiptTypeLabel,
    paymentApp: classification.paymentApp,
    bank: extracted.bankName,
    amount: extracted.primaryAmount,
    secondaryAmounts: extracted.allAmounts.filter((a) => a !== extracted.primaryAmount),
    recipientName: extracted.recipientName,
    upiId: extracted.upiId,
    transactionId: extracted.transactionId,
    utr: extracted.utr,
    date: extracted.date,
    time: extracted.time,
    paymentProofStrength: classification.paymentProofStrength,
    paymentProofExplanation:
      'Even a visually pristine screenshot cannot prove funds cleared the banking network. Always confirm in your own account.',
    visualIntegrity: {
      status: forensics.visualIntegrityStatus,
      issues: riskFactors.filter((f) => f.type.includes('ANOMALY') || f.type.includes('TYPOGRAPHY')),
    },
    consistency: {
      status: forensics.consistencyStatus,
      issues: riskFactors.filter((f) => f.type.includes('MISMATCH') || f.type.includes('REF')),
    },
    verdict,
    verdictLabel,
    verdictDescription,
    riskScore,
    confidence: 88,
    riskFactors,
    verificationStatus: 'CANNOT_VERIFY_ACTUAL_BANK_RECEIPT',
    whatWeFound,
    whatConcernsUs,
    recommendations,
    groundedFacts: extracted.groundedFacts,
    rawOcrText: rawText,
    dataUrl,
    imageInfo,
    forensics: {
      compressionInconsistency: forensics.visualIntegrityStatus === 'NORMAL' ? 'Standard' : 'Elevated',
      noiseVarianceScore: riskScore,
      notes: compressionNotes.length > 0 ? compressionNotes : ['Receipt-text rules evaluated; no pixel, font or layout measurement performed.'],
    },
  };
}
