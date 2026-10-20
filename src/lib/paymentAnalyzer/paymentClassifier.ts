import { isLabelledBalanceAmount } from './paymentAmountContext';
import type { PaymentReceiptType, PaymentApp, PaymentProofStrength } from './paymentTypes';

export interface ClassificationResult {
  isPaymentScreenshot: boolean;
  receiptType: PaymentReceiptType;
  receiptTypeLabel: string;
  paymentApp: PaymentApp;
  paymentProofStrength: PaymentProofStrength;
  confidence: number;
  explanation: string;
}

export function classifyPaymentScreenshot(rawText: string): ClassificationResult {
  const text = (rawText || '').trim();
  const lower = text.toLowerCase();

  // If text is virtually empty, cannot classify as payment
  if (text.length < 5) {
    return {
      isPaymentScreenshot: false,
      receiptType: 'UNKNOWN',
      receiptTypeLabel: 'Unreadable or Empty Image',
      paymentApp: 'Not confidently identified',
      paymentProofStrength: 'NONE',
      confidence: 0,
      explanation: 'No readable textual elements detected to confirm a payment or UPI receipt.',
    };
  }

  // Detect Payment Ecosystem / App
  let paymentApp: PaymentApp = 'Not confidently identified';
  if (/\b(?:phonepe|secured by phonepe|ybl|axl|ibl)\b/i.test(lower)) {
    paymentApp = 'PhonePe';
  } else if (/\b(?:google pay|gpay|g pay|okhdfcbank|okaxis|okicici|oksbi)\b/i.test(lower)) {
    paymentApp = 'Google Pay';
  } else if (/\b(?:paytm|paytm payments bank|paytm qr)\b/i.test(lower)) {
    paymentApp = 'Paytm';
  } else if (/\b(?:bhim|bhim upi|bhim app|npci)\b/i.test(lower)) {
    paymentApp = 'BHIM UPI';
  } else if (/\b(?:pop upi|popclub|pop app)\b/i.test(lower)) {
    paymentApp = 'Pop UPI';
  } else if (/\b(?:upi|upi id|vpa|utr|rrn|imps|neft|rtgs)\b/i.test(lower)) {
    paymentApp = 'Bank UPI';
  }

  // Explicit transfer statuses outrank incidental balance fields. Keep broad
  // words such as "unsuccessful" / "waiting for bank" below the balance rule:
  // those can describe the balance inquiry itself rather than a transfer.
  const isExplicitFailure = /\b(?:payment failed|transaction failed|payment declined|transfer failed|(?:payment|transaction|transfer) unsuccessful)\b/i.test(lower);
  const isExplicitPending = /\b(?:payment pending|transaction pending|processing payment|payment in progress)\b/i.test(lower);
  const isExplicitSuccess = /\b(?:transaction successful|payment (?:of [^.\n]+ )?successful|payment successful|paid successfully|transfer successful|sent successfully|credited successfully|payment done|bill payment successful)\b/i.test(lower);
  const hasExplicitTransferStatus = isExplicitFailure || isExplicitPending || isExplicitSuccess;

  // A generic status remains conservative transfer evidence unless its direct
  // same-line / preceding-line label identifies a balance inquiry. Never ignore
  // it merely because another part of the screenshot contains a balance.
  const hasNonBalanceStatus = (pattern: RegExp): boolean => [...lower.matchAll(pattern)].some(match => {
    const before = lower.slice(0, match.index!);
    const linePrefix = before.slice(before.lastIndexOf('\n') + 1).trim();
    const context = linePrefix || before.trimEnd().split(/\r?\n/).at(-1) || '';
    return !/\b(?:balance (?:check|inquiry|enquiry)|(?:check(?:ing)?|fetch(?:ing)?) (?:bank )?balance)(?: (?:is|was))?\s*[:=–-]?\s*$/i.test(context);
  });

  // 1. RULE: BANK BALANCE SCREENSHOT
  // "Bank balance fetched successfully", "Available balance", "Canara Bank ₹3,884.63"
  const isBalanceScreen =
    /\b(?:bank balance fetched successfully|balance fetched successfully|check balance|available balance|avl bal|account balance|your balance is)\b/i.test(
      lower
    ) ||
    (/\b(?:balance|savings a\/c|primary a\/c)\b/i.test(lower) &&
      /(?:₹|rs\.?|inr)\s*[\d,]+(?:\.\d{1,2})?/i.test(lower) &&
      !/\b(?:paid to|transferred to|payment to|payment successful|transaction successful)\b/i.test(lower));

  if (isBalanceScreen && !hasExplicitTransferStatus) {
    return {
      isPaymentScreenshot: true,
      receiptType: 'BANK_BALANCE',
      receiptTypeLabel: 'Bank Account Balance Screen',
      paymentApp,
      paymentProofStrength: 'NONE',
      confidence: 94,
      explanation:
        'This screenshot displays an account balance inquiry, NOT confirmation that a financial transfer or payment was sent or received.',
    };
  }

  // 2. RULE: COLLECT REQUEST / PAYMENT REQUEST
  const isCollectRequest = /\b(?:collect request|payment request|requested money|requesting ₹|requesting rs|pay request|approve request)\b/i.test(
    lower
  );
  if (isCollectRequest) {
    return {
      isPaymentScreenshot: true,
      receiptType: 'COLLECT_REQUEST',
      receiptTypeLabel: 'UPI Collect / Payment Request',
      paymentApp,
      paymentProofStrength: 'NONE',
      confidence: 89,
      explanation:
        'This screenshot represents a collect request (asking you to send money), NOT an incoming payment.',
    };
  }

  // 3. RULE: PAYMENT FAILED / DECLINED
  const isFailed = isExplicitFailure || hasNonBalanceStatus(/\bunsuccessful\b/gi);
  if (isFailed) {
    return {
      isPaymentScreenshot: true,
      receiptType: 'PAYMENT_FAILED',
      receiptTypeLabel: 'Payment Failed / Declined Receipt',
      paymentApp,
      paymentProofStrength: 'NONE',
      confidence: 90,
      explanation: 'The screenshot explicitly indicates a failed, declined, or unsuccessful transaction.',
    };
  }

  // 4. RULE: PAYMENT PENDING / PROCESSING
  const isPending = isExplicitPending || hasNonBalanceStatus(/\b(?:under processing|waiting for bank)\b/gi);
  if (isPending) {
    return {
      isPaymentScreenshot: true,
      receiptType: 'PAYMENT_PENDING',
      receiptTypeLabel: 'Payment Pending / In-Progress',
      paymentApp,
      paymentProofStrength: 'WEAK',
      confidence: 88,
      explanation:
        'This screenshot indicates a transaction that is still pending or processing settlement with the bank.',
    };
  }

  // 5. RULE: PAYMENT SUCCESSFUL
  const isPaymentSuccess =
    isExplicitSuccess ||
    (/\b(?:paid|transferred|sent|credited|payment)\b/i.test(lower) &&
      /(?:₹|rs\.?|inr)\s*[\d,]+(?:\.\d{1,2})?/i.test(lower) &&
      (/\b(?:to|banking name|from|successful|completed)\b/i.test(lower) || lower.includes('@')) &&
      !/\b(?:failed|declined|unsuccessful|request)\b/i.test(lower));

  if (isPaymentSuccess) {
    const hasUtrOrTxn = /\b(?:utr|txn|transaction id|reference no|rrn)\b/i.test(lower);
    const hasAmount = [...lower.matchAll(/(?:₹|rs\.?|inr)\s*[\d,]+(?:\.\d{1,2})?/gi)]
      .some(match => !isLabelledBalanceAmount(lower, match.index!, match.index! + match[0].length));
    const hasRecipient = /\b(?:paid to|transferred to|sent to|banking name|to:)\b/i.test(lower) || lower.includes('@');

    const proofStrength: PaymentProofStrength =
      hasUtrOrTxn && hasAmount && hasRecipient ? 'STRONG_VISUAL' : hasAmount ? 'PARTIAL' : 'WEAK';

    return {
      isPaymentScreenshot: true,
      receiptType: 'PAYMENT_SUCCESS',
      receiptTypeLabel: 'UPI / Payment Transfer Confirmation',
      paymentApp,
      paymentProofStrength: proofStrength,
      confidence: 92,
      explanation:
        'The screenshot presents a payment completion screen. Note: visual proof alone cannot verify that funds actually cleared the banking network.',
    };
  }

  // 6. RULE: REFUND / CASHBACK
  const isRefund = /\b(?:refund (?:successful|processed|credited)|cashback credited|refund of)\b/i.test(lower);
  if (isRefund) {
    return {
      isPaymentScreenshot: true,
      receiptType: 'REFUND_RECEIVED',
      receiptTypeLabel: 'Refund / Cashback Notice',
      paymentApp,
      paymentProofStrength: 'PARTIAL',
      confidence: 85,
      explanation: 'This screenshot indicates a refund or cashback credit record.',
    };
  }

  // 7. RULE: GENERIC UPI TRANSFER / TRANSACTION DETAILS
  const isGenericUpi =
    (/\b(?:upi transaction id|google transaction id|debited from|credited to|utr no|rrn no|txn id)\b/i.test(
      lower
    ) ||
      (/\b(?:debited from|state bank of india|hdfc bank|icici bank|axis bank|canara bank|punjab national bank)\b/i.test(
        lower
      ) &&
        /\b(?:₹|rs\.?|inr)\s*[\d,]+\b/i.test(lower))) &&
    !lower.includes('job opportunity') &&
    !lower.includes('earn money daily') &&
    !lower.includes('telegram');

  if (isGenericUpi) {
    return {
      isPaymentScreenshot: true,
      receiptType: 'UPI_TRANSFER_DETAILS',
      receiptTypeLabel: 'UPI Transfer Record',
      paymentApp,
      paymentProofStrength: 'PARTIAL',
      confidence: 80,
      explanation: 'General UPI or bank transaction details detected in the screenshot.',
    };
  }

  // 8. NON-PAYMENT GUARD
  // If no payment/banking/receipt cues exist, classify as NOT_PAYMENT
  return {
    isPaymentScreenshot: false,
    receiptType: 'NOT_PAYMENT',
    receiptTypeLabel: 'Non-Payment Screenshot',
    paymentApp: 'Not confidently identified',
    paymentProofStrength: 'NONE',
    confidence: 10,
    explanation:
      'This image does not appear to contain a recognizable UPI receipt, bank transfer, or payment confirmation screen.',
  };
}
