import type {
  HierarchicalClassification,
  TopCategory,
  CategorySubtype,
  ConfidenceLevel,
  VisualFingerprint,
} from './types';

export function classifyHierarchical(
  text: string,
  fingerprint?: VisualFingerprint
): HierarchicalClassification {
  const lower = text.toLowerCase();
  const evidence: string[] = [];

  let topCategory: TopCategory = 'UNKNOWN';
  let subtype: CategorySubtype = 'unknown_image';
  let label = 'General Image / Unspecified Screenshot';
  let confidence: ConfidenceLevel = 'UNKNOWN';
  let numericConfidence = 0;

  // 1. EMAIL (Headers From/To/Subject)
  if (
    (/\bfrom:\s*[^\n]+@/i.test(text) && /\bto:\s*[^\n]+@/i.test(text)) ||
    (/\bfrom:\s*[^\n]+/i.test(text) && /\bsubject:\s*[^\n]+/i.test(text))
  ) {
    topCategory = 'EMAIL';
    if (/\b(?:suspended|locked|unauthorized|verify immediately|restore access)\b/i.test(lower)) {
      subtype = 'phishing_like_email';
      label = 'Suspicious Account Security Email';
    } else if (/\b(?:invoice|payment|subscription|order)\b/i.test(lower)) {
      subtype = 'order_email';
      label = 'E-Commerce / Subscription Email';
    } else {
      subtype = 'generic_email';
      label = 'Email Communication';
    }
    confidence = 'HIGH';
    numericConfidence = 88;
    evidence.push('Standard email headers (From/To/Subject) detected');
    return { topCategory, subtype, label, confidence, numericConfidence, evidence };
  }

  // 2. MESSAGING: WHATSAPP / CHAT (Check chat indicators first so chat-based payment scams remain in MESSAGING)
  if (
    /\b(?:whatsapp|online|typing\.\.\.|end-to-end encrypt|yesterday at \d|today at \d|voice message|read \d{1,2}:\d{2})\b/i.test(
      lower
    ) ||
    fingerprint?.hasChatBubbles
  ) {
    topCategory = 'MESSAGING';
    subtype = lower.includes('whatsapp') ? 'whatsapp_like' : 'generic_chat';
    label = 'Instant Messaging / Chat Capture';
    confidence = 'HIGH';
    numericConfidence = 88;
    evidence.push('Chat framing indicators (online status, timestamps, or read receipts) identified');
    return { topCategory, subtype, label, confidence, numericConfidence, evidence };
  }

  // 3. SECURITY / ACCOUNT ALERT / LOCKOUT
  if (
    /\b(?:account (?:ending \d+|is)? (?:suspended|blocked|locked|closed|terminated)|security alert|chase alert|bank alert|unauthorized (?:login|access)|compromised account|threat of legal action)\b/i.test(
      lower
    ) ||
    /\burgent:?\s*your (?:bank )?account\b/i.test(lower) ||
    (lower.includes('alert') && lower.includes('suspended')) ||
    (lower.includes('account') && lower.includes('suspended'))
  ) {
    topCategory = 'SECURITY';
    subtype = 'account_warning';
    label = 'Security Alert / Account Lockout Notice';
    confidence = 'HIGH';
    numericConfidence = 90;
    evidence.push('Account suspension, security alert, or urgent account block warning detected');
    return { topCategory, subtype, label, confidence, numericConfidence, evidence };
  }

  // 4. SECURITY: OTP / VERIFICATION CODE ISSUANCE
  if (
    /\b(?:(?:is|use)\s+your\s+(?:login|verification|security|one[- ]time)\s+(?:code|otp|passcode)|\b\d{4,8}\s+is\s+your\s+(?:otp|code)|do not share (?:your)? (?:otp|code)|login otp)\b/i.test(
      lower
    )
  ) {
    topCategory = 'SECURITY';
    subtype = 'otp_code';
    label = 'OTP / Security Verification Code';
    confidence = 'HIGH';
    numericConfidence = 90;
    evidence.push('One-time verification passcode (OTP) pattern and disclosure warnings detected');
    return { topCategory, subtype, label, confidence, numericConfidence, evidence };
  }

  // 5. BANKING SMS / NOTIFICATION / BALANCE UPDATE
  if (
    (/\b(?:a\/c|acct|account (?:no|number)?)\s*(?:[x*]{2,8}\d+|\d+)/i.test(lower) ||
      /\b(?:avl bal|available balance|credited to a\/c|debited from a\/c|refund processed|credited back to your visa|credited back to your card)\b/i.test(
        lower
      ) ||
      /\b(?:pending review by|wells fargo|hdfc bank|chase|sbi|icici bank|axis bank)\b/i.test(lower)) &&
    /\b(?:inr|usd|\$|₹|bank|ref no|transaction ref|ref:|avl bal|swiggy|amazon|wells fargo|sbi|hdfc)\b/i.test(
      lower
    ) &&
    !/\b(?:gpay|google pay|phonepe|bhim)\b/i.test(lower)
  ) {
    topCategory = 'BANKING';
    if (/\b(?:credited|received|deposit|refund processed|credited back)\b/i.test(lower)) {
      subtype = 'credit_notification';
      label = 'Bank Credit / Refund Transaction Notification';
    } else if (/\b(?:debited|withdrawn|paid)\b/i.test(lower)) {
      subtype = 'debit_notification';
      label = 'Bank Debit Transaction Notification';
    } else if (/\b(?:pending)\b/i.test(lower)) {
      subtype = 'payment_pending';
      label = 'Bank Transaction Pending Notice';
    } else {
      subtype = 'transaction_history';
      label = 'Bank Account Alert';
    }
    confidence = 'HIGH';
    numericConfidence = 88;
    evidence.push('Masked account number, institutional banking identity, or balance indicators detected');
    return { topCategory, subtype, label, confidence, numericConfidence, evidence };
  }

  // 6. UPI / DIGITAL PAYMENT CONFIRMATION / TRANSACTION STATUS
  if (
    /\b(?:gpay|google pay|phonepe|paytm|bhim|cred|amazon pay|upi id|vpa|paid to|payment successful|transferred to|transaction failed|payment details)\b/i.test(
      lower
    ) &&
    (/\b(?:₹|\$|€|£|inr|usd|amount paid|upi ref|fail-)\b/i.test(lower) || text.includes('₹'))
  ) {
    topCategory = 'PAYMENT';
    subtype = 'upi_receipt';
    label = 'UPI / Digital Payment Receipt';
    confidence = 'HIGH';
    numericConfidence = 88;
    evidence.push('Payment app receipt framing, UPI identifier, or transaction status detected');
    return { topCategory, subtype, label, confidence, numericConfidence, evidence };
  }

  // 7. COMMERCE: INVOICE / RECEIPT / ORDER
  if (/\b(?:tax invoice|invoice (?:no|number|#)|bill to|gstin|vat no|due date|subtotal)\b/i.test(lower)) {
    topCategory = 'COMMERCE';
    subtype = 'commercial_invoice';
    label = 'Commercial Tax Invoice';
    confidence = 'HIGH';
    numericConfidence = 88;
    evidence.push('Invoice numbering, GSTIN/VAT tax fields, and subtotal lines detected');
  } else if (
    /\b(?:store #|cashier|total paid|sales tax|change due|visa ending|receipt #|cash tender)\b/i.test(lower) ||
    fingerprint?.hasDividerRule
  ) {
    topCategory = 'COMMERCE';
    subtype = 'retail_receipt';
    label = 'Retail Store / POS Receipt';
    confidence = 'HIGH';
    numericConfidence = 85;
    evidence.push('POS cashier, store numbering, and payment tender lines detected');
  } else if (
    /\b(?:order confirmed|order placed|shipped|arriving (?:by|today|tomorrow)|track (?:order|package)|amazon order confirmed)\b/i.test(
      lower
    )
  ) {
    topCategory = 'COMMERCE';
    subtype = 'order_confirmation';
    label = 'E-Commerce Order Confirmation';
    confidence = 'HIGH';
    numericConfidence = 88;
    evidence.push('Order ID, shipping confirmation, and estimated delivery dates detected');
  }

  // 8. ADVERTISEMENT / PROMOTION
  else if (
    /\b(?:special offer|discount|save up to \d+%|use code|voucher|exclusive deal|buy 1 get 1|limited time only|lottery|congratulations you won|congratulations! you won)\b/i.test(
      lower
    )
  ) {
    topCategory = 'ADVERTISEMENT';
    subtype = 'promotional_email';
    label = 'Promotional Offer / Promotional Banner';
    confidence = 'MEDIUM';
    numericConfidence = 80;
    evidence.push('Discount codes, promotional terms, or lottery reward phrasing detected');
  }

  // 9. SOCIAL MEDIA
  else if (
    /\b(?:followers|following|posts|direct message|retweet|repost|instagram|threads|x\.com|twitter|tiktok)\b/i.test(
      lower
    )
  ) {
    topCategory = 'SOCIAL_MEDIA';
    subtype = 'social_post';
    label = 'Social Media Post / Feed Capture';
    confidence = 'MEDIUM';
    numericConfidence = 75;
    evidence.push('Social media metrics (followers, reposts, usernames) detected');
  }

  // 10. SMS
  else if (/\b(?:text message|sms|imessage|carrier|sim 1|sim 2|reply to|delivered)\b/i.test(lower)) {
    topCategory = 'SMS';
    subtype = 'generic_sms';
    label = 'SMS / Text Message Capture';
    confidence = 'MEDIUM';
    numericConfidence = 75;
    evidence.push('SMS carrier framing detected');
  }

  // 11. GENERAL UI / SETTINGS / DOCUMENT
  else if (
    /\b(?:settings|general|about|version|customer record|ssn|phone:|email:|http:\/\/|https:\/\/)\b/i.test(lower) ||
    (text.includes('>') && text.includes(':')) ||
    text.length > 80
  ) {
    topCategory = 'DOCUMENT';
    subtype = 'scanned_document';
    label = 'General UI / Document Capture';
    confidence = 'LOW';
    numericConfidence = 60;
    evidence.push('UI navigation breadcrumbs, settings list, or document records identified');
  }

  // DEFAULT IMAGE
  else {
    topCategory = 'IMAGE';
    subtype = 'unknown_image';
    label = 'General Photograph / Graphic';
    confidence = 'UNKNOWN';
    numericConfidence = 0;
    evidence.push('No specific text or UI structures identified');
  }

  return {
    topCategory,
    subtype,
    label,
    confidence,
    numericConfidence,
    evidence,
  };
}

export function classifyScreenshot(text: string): {
  category: any;
  label: string;
  confidence: number;
} {
  const result = classifyHierarchical(text);
  return {
    category: result.topCategory,
    label: result.label,
    confidence: result.numericConfidence,
  };
}
