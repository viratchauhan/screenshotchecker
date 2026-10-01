import { extractUnmarkedPaymentAmounts } from '../analyzer/paymentTextContext';
import type { ExtractedPaymentFact } from './paymentTypes';

export interface ExtractedPaymentData {
  primaryAmount: string;
  allAmounts: string[];
  recipientName: string;
  upiId: string;
  bankName: string;
  accountEndingDigits: string;
  transactionId: string;
  utr: string;
  date: string;
  time: string;
  paymentMessage: string;
  groundedFacts: ExtractedPaymentFact[];
}

export function extractPaymentEntities(rawText: string): ExtractedPaymentData {
  const text = rawText || '';
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const groundedFacts: ExtractedPaymentFact[] = [];

  // 1. AMOUNT EXTRACTION
  // Matches: ₹500.00, ₹ 500, Rs. 500.00, INR 500, 500.00 (in payment context)
  const amountRegex = /(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d{1,2})?)/gi;
  const rawAmounts: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = amountRegex.exec(text)) !== null) {
    const rawVal = match[0].trim();
    if (!rawAmounts.includes(rawVal)) {
      rawAmounts.push(rawVal);
    }
  }

  // OCR may lose a currency symbol. Preserve the visible value without inventing currency.
  const inferredAmounts = rawAmounts.length === 0 ? extractUnmarkedPaymentAmounts(text) : [];
  rawAmounts.push(...inferredAmounts);

  const primaryAmount = rawAmounts.length > 0 ? rawAmounts[0] : 'Not detected';
  if (primaryAmount !== 'Not detected') {
    groundedFacts.push({
      label: 'Primary Amount',
      value: primaryAmount,
      source: 'OCR',
      confidence: inferredAmounts.length ? 70 : 95,
    });
  }

  // 2. UPI ID / VPA EXTRACTION
  // Patterns like reviewcraftstore@ybl, user@okhdfcbank, merchant@paytm, 9876543210@ibl
  const upiRegex = /\b([a-zA-Z0-9.\-_]{2,40}@(ybl|axl|ibl|okhdfcbank|okaxis|okicici|oksbi|paytm|upi|apl|barodampay|mahb|federal|indus|postbank|idfcbank))\b/i;
  const upiMatch = text.match(upiRegex);
  const upiId = upiMatch ? upiMatch[1] : 'Not detected';
  if (upiId !== 'Not detected') {
    groundedFacts.push({
      label: 'UPI ID / VPA',
      value: upiId,
      source: 'OCR',
      confidence: 92,
    });
  }

  // 3. RECIPIENT NAME EXTRACTION
  let recipientName = 'Not detected';
  // Patterns:
  // "Paid to \n ReviewCraft Store"
  // "Banking name: \n ReviewCraft Store"
  // "ReviewCraft Store \n reviewcraftstore@ybl"
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^(?:paid to|transferred to|to:|banking name:?)\s*(.*)/i.test(line)) {
      const inlineMatch = line.replace(/^(?:paid to|transferred to|to:|banking name:?)\s*/i, '').trim();
      if (inlineMatch.length > 1 && !inlineMatch.includes('₹')) {
        recipientName = inlineMatch;
        break;
      } else if (i + 1 < lines.length && !lines[i + 1].includes('₹')) {
        recipientName = lines[i + 1];
        break;
      }
    }
  }

  // If still not found, check if line preceding a UPI ID contains a name
  if (recipientName === 'Not detected' && upiMatch) {
    const upiLineIdx = lines.findIndex((l) => l.includes(upiMatch[0]));
    if (upiLineIdx > 0 && !lines[upiLineIdx - 1].includes('₹') && lines[upiLineIdx - 1].length < 40) {
      recipientName = lines[upiLineIdx - 1];
    }
  }

  // Clean recipient name from trailing icons / badges
  if (recipientName !== 'Not detected') {
    recipientName = recipientName.replace(/[✓✔]/g, '').trim();
    groundedFacts.push({
      label: 'Recipient Name',
      value: recipientName,
      source: 'OCR',
      confidence: 90,
    });
  }

  // 4. BANK NAME & ACCOUNT IDENTIFIER
  let bankName = 'Not detected';
  const indianBanks = [
    'State Bank of India',
    'SBI',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Canara Bank',
    'Punjab National Bank',
    'PNB',
    'Bank of Baroda',
    'Kotak Mahindra Bank',
    'Union Bank of India',
    'IndusInd Bank',
    'Yes Bank',
    'IDFC FIRST Bank',
    'Paytm Payments Bank',
    'Airtel Payments Bank',
    'Indian Bank',
    'Central Bank of India',
  ];

  for (const bank of indianBanks) {
    const bankRegex = new RegExp(`\\b${bank.replace(/\s+/g, '\\s*[^a-zA-Z0-9]?\\s*')}\\b`, 'i');
    if (bankRegex.test(text)) {
      bankName = bank;
      break;
    }
  }

  if (bankName !== 'Not detected') {
    groundedFacts.push({
      label: 'Bank Name',
      value: bankName,
      source: 'OCR',
      confidence: 88,
    });
  }

  // Account Ending Digits (e.g. - 2845, XXXXXX2845, a/c ending 2845)
  const acctMatch = text.match(/(?:[-–—]\s*|\b(?:ending|a\/c|acct|x{2,8})\s*)(\d{3,4})\b/i);
  const accountEndingDigits = acctMatch ? acctMatch[1] : '';

  // 5. TRANSACTION ID / TXN ID
  const txnRegex = /\b(?:txn(?:\s*id)?|transaction\s*id)\s*[:#\-]?\s*([a-zA-Z0-9]{8,35})\b/i;
  const txnMatch = text.match(txnRegex);
  const transactionId = txnMatch ? txnMatch[1] : 'Not detected';
  if (transactionId !== 'Not detected') {
    groundedFacts.push({
      label: 'Transaction ID',
      value: transactionId,
      source: 'OCR',
      confidence: 94,
    });
  }

  // 6. UTR / RRN (Unique Transaction Reference - 12 digits in UPI)
  const utrRegex = /\b(?:utr|rrn|upi\s*ref(?:\s*no)?)\s*[:#\-]?\s*(\d{10,16})\b/i;
  const utrMatch = text.match(utrRegex);
  const utr = utrMatch ? utrMatch[1] : 'Not detected';
  if (utr !== 'Not detected') {
    groundedFacts.push({
      label: 'UTR / Reference Number',
      value: utr,
      source: 'OCR',
      confidence: 95,
    });
  }

  // 7. DATE AND TIME
  // Examples: 30 Aug 2026, 30/08/2026, 11:17 AM, 11:17:30
  const dateRegex = /\b(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4}|\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})\b/i;
  const dateMatch = text.match(dateRegex);
  const date = dateMatch ? dateMatch[1] : 'Not detected';

  const timeRegex = /\b(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)\b/;
  const timeMatch = text.match(timeRegex);
  const time = timeMatch ? timeMatch[1] : 'Not detected';

  if (date !== 'Not detected' || time !== 'Not detected') {
    groundedFacts.push({
      label: 'Timestamp',
      value: [date, time].filter((v) => v !== 'Not detected').join(', '),
      source: 'OCR',
      confidence: 90,
    });
  }

  // 8. PAYMENT MESSAGE / NOTE
  const msgRegex = /\b(?:message|note|for|remarks)\s*[:\-]?\s*([^\n\r]{3,60})/i;
  const msgMatch = text.match(msgRegex);
  const paymentMessage = msgMatch ? msgMatch[1].trim() : '';

  return {
    primaryAmount,
    allAmounts: rawAmounts,
    recipientName,
    upiId,
    bankName,
    accountEndingDigits,
    transactionId,
    utr,
    date,
    time,
    paymentMessage,
    groundedFacts,
  };
}
