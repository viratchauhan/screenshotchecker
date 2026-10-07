import type { PaymentRiskFactor } from './paymentTypes';
import type { ExtractedPaymentData } from './paymentExtractor';

export interface VisualForensicsResult {
  visualIntegrityStatus: 'NORMAL' | 'SUSPICIOUS' | 'INCONSISTENT';
  consistencyStatus: 'CONSISTENT' | 'INCONSISTENT' | 'SUSPICIOUS';
  issues: PaymentRiskFactor[];
}

export function evaluatePaymentVisualForensics(
  rawText: string,
  extracted: ExtractedPaymentData,
  imageWidth: number = 0,
  imageHeight: number = 0
): VisualForensicsResult {
  const text = rawText || '';
  const lower = text.toLowerCase();
  const issues: PaymentRiskFactor[] = [];

  // Legacy weighted OCR-label rule. This function receives no pixels, font
  // metrics or text boxes; it cannot measure typography or layout.
  if (/\bBanking\s+name\s*:/i.test(text)) {
    issues.push({
      id: 'typography_inconsistency_label',
      type: 'TYPOGRAPHY_ANOMALY',
      severity: 'medium',
      title: 'Banking Label Text Rule',
      explanation:
        'OCR contains the label "Banking name:". Font family, rendering and layout were not measured; this label alone does not establish an edit.',
      where: 'Banking name / Account Details row',
      why: 'This is a legacy text-rule indicator. Compare the original with an official receipt; the rule is not validated as evidence of fraud.',
    });
  }

  // =========================================================================
  // 2. UNUSUAL ICON & UI ELEMENT PLACEMENT
  // =========================================================================
  // In the uploaded fake screenshot: "State [icon] Bank of India - 2845" has a bank icon awkwardly embedded inside the bank title text string.
  // Also check for misaligned badges or checkmarks rendered as text characters.
  const hasEmbeddedIconInText =
    /state\s*[^a-zA-Z0-9\s]\s*bank\s*of\s*india/i.test(text) ||
    /[a-zA-Z]+\s*[🏦🏛️💳💵🪙]\s*[a-zA-Z]+/u.test(text) ||
    /state\s*[\u2000-\u3300\uE000-\uF8FF\uD83C-\uDBFF\uDC00-\uDFFF\u25A0-\u25FF\u2600-\u26FF\u2700-\u27BF]+\s*bank/i.test(
      text
    ) ||
    /State\s+[\uFFFD\u25A1\u25A0\u25AD\u25AE\uE000-\uF8FF]\s+Bank/i.test(text);

  if (hasEmbeddedIconInText) {
    issues.push({
      id: 'icon_placement_in_bank_name',
      type: 'ICON_PLACEMENT_ANOMALY',
      severity: 'high',
      title: 'Symbol Within OCR Bank Text',
      explanation:
        'OCR contains a symbol within bank-name text. Icon position and alignment were not measured; OCR can merge nearby graphics into text.',
      where: 'Bank Account / Debited From section',
      why: 'Inspect the original image manually. A symbol in extracted text does not establish composite editing.',
    });
  }

  // Check for abnormal verified badge placement on non-standard fields
  if (/\bBanking\s*name\s*:?\s*[^\n]+[✓✔]/i.test(text) || /\bReviewCraft\s*Store\s*[✓✔]/i.test(text)) {
    issues.push({
      id: 'floating_badge_placement',
      type: 'UI_ELEMENT_ANOMALY',
      severity: 'medium',
      title: 'Checkmark Within OCR Name Text',
      explanation:
        'OCR contains a checkmark alongside name text. Badge position and authenticity were not assessed.',
      where: 'Banking Name field',
      why: 'OCR text alone cannot establish whether a badge is official or correctly positioned.',
    });
  }

  // =========================================================================
  // 3. AMOUNT CONSISTENCY CHECK
  // =========================================================================
  // Compare payment candidates only; labelled balance values stay in the report
  // but are not conflicting transfer amounts.
  const numericAmounts = extracted.paymentAmounts
    .map((a) => {
      const match = a.replace(/,/g, '').match(/[\d.]+/);
      return match ? parseFloat(match[0]) : null;
    })
    .filter((n): n is number => n !== null && n > 0);

  // If multiple distinct transaction amounts exist on the receipt (excluding small fees/balance)
  const distinctAmounts = Array.from(new Set(numericAmounts));
  // Filter out bank account ending digits (e.g. 2845) that might be confused with an amount
  const filteredAmounts = distinctAmounts.filter((amt) => {
    if (extracted.accountEndingDigits && Math.abs(amt - parseFloat(extracted.accountEndingDigits)) < 0.1) {
      return false;
    }
    return true;
  });

  if (filteredAmounts.length >= 2) {
    const minAmt = Math.min(...filteredAmounts);
    const maxAmt = Math.max(...filteredAmounts);
    // If the amounts differ significantly and both appear in transaction contexts
    if (maxAmt / minAmt > 1.05 && maxAmt / minAmt !== 100) {
      issues.push({
        id: 'amount_mismatch_detected',
        type: 'AMOUNT_MISMATCH',
        severity: 'critical',
        title: 'Internal Amount Discrepancy',
        explanation: `The screenshot displays conflicting payment amounts (${filteredAmounts.map((a) => '₹' + a).join(' vs ')}).`,
        where: 'Amount Banner / Transaction Summary',
        why: 'Genuine payment confirmation receipts show one unified debited/credited amount. Multiple conflicting amounts indicate digital tampering or template splicing.',
        valuesFound: filteredAmounts.map((a) => '₹' + a),
      });
    }
  }

  // =========================================================================
  // 4. UTR / TRANSACTION REFERENCE NUMBER AUDIT
  // =========================================================================
  if (extracted.utr !== 'Not detected') {
    // UPI UTRs are standardized 12-digit numeric sequences
    if (extracted.utr.length !== 12 || !/^\d{12}$/.test(extracted.utr)) {
      issues.push({
        id: 'invalid_utr_format',
        type: 'TRANSACTION_REF_ANOMALY',
        severity: 'high',
        title: 'Non-Standard UTR Number Format',
        explanation: `The extracted UTR reference (${extracted.utr}) is not standard. UPI transactions in India generate an exact 12-digit numeric UTR / RRN.`,
        where: 'UTR / Reference Number row',
        why: 'Fake payment screenshot generators often output shortened, alphanumeric, or placeholder reference numbers.',
        valuesFound: [extracted.utr],
      });
    }
  }

  // Check Transaction ID (if present and abnormally short)
  if (extracted.transactionId !== 'Not detected' && extracted.transactionId.length < 8) {
    issues.push({
      id: 'short_transaction_id',
      type: 'TRANSACTION_REF_ANOMALY',
      severity: 'medium',
      title: 'Suspiciously Short Transaction ID',
      explanation: `The transaction ID (${extracted.transactionId}) is unusually short for a modern UPI payment platform.`,
      where: 'Transaction ID field',
      why: 'Official UPI apps use lengthy cryptographically unique identifiers.',
      valuesFound: [extracted.transactionId],
    });
  }

  // =========================================================================
  // 5. RECIPIENT & UPI ID CONSISTENCY
  // =========================================================================
  if (extracted.recipientName !== 'Not detected' && extracted.upiId !== 'Not detected') {
    const cleanName = extracted.recipientName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanHandle = extracted.upiId.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

    // If both are reasonably long and have zero overlap (e.g. "Rahul Sharma" vs "xyzstore99@ybl")
    if (cleanName.length > 4 && cleanHandle.length > 4 && !cleanName.includes(cleanHandle) && !cleanHandle.includes(cleanName)) {
      // Note: this is not an error by itself (merchants can have different legal names), but an observation
    }
  }

  // Determine overall status
  const hasCritical = issues.some((i) => i.severity === 'critical');
  const hasHigh = issues.some((i) => i.severity === 'high');
  const hasMedium = issues.some((i) => i.severity === 'medium');

  const visualIntegrityStatus = hasCritical || hasHigh ? 'SUSPICIOUS' : hasMedium ? 'INCONSISTENT' : 'NORMAL';
  const consistencyStatus = hasCritical ? 'INCONSISTENT' : hasHigh || hasMedium ? 'SUSPICIOUS' : 'CONSISTENT';

  return {
    visualIntegrityStatus,
    consistencyStatus,
    issues,
  };
}
