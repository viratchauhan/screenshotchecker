import type { ExtractedEntitiesResult } from './types';

export type DetectedContentType =
  | 'SMS'
  | 'WHATSAPP'
  | 'CHAT'
  | 'EMAIL'
  | 'DOCUMENT'
  | 'WEBPAGE'
  | 'RECEIPT'
  | 'PHOTOGRAPH'
  | 'OTHER';

export interface ChatMessageItem {
  speaker: 'sender' | 'recipient' | 'system' | 'unknown';
  text: string;
  timestamp?: string;
}

export interface StructuredMessageData {
  contentType: DetectedContentType;
  confidence: number;
  rawText: string;
  normalizedText: string;
  sender: string;
  phoneNumbers: string[];
  urls: string[];
  dates: string[];
  amounts: string[];
  organizations: string[];
  attachments: Array<{ filename: string; type: string }>;
  requestedActions: string[];
  messages: ChatMessageItem[];
  indicators: string[];
}

/**
 * Normalizes OCR extracted text while preserving key tokens like URLs, numbers, amounts, and dates.
 */
export function normalizeOCRText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\r\t]+/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/(\n\s*){3,}/g, '\n\n')
    .trim();
}

/**
 * Intelligent Content Router:
 * Analyzes OCR text and visual cues to classify the screenshot into SMS, WhatsApp, Chat, Email, Document, Receipt, etc.
 */
export function routeContent(
  rawText: string,
  imageWidth: number = 0,
  imageHeight: number = 0
): StructuredMessageData {
  const text = (rawText || '').trim();
  const lower = text.toLowerCase();
  const normalized = normalizeOCRText(text);

  // 1. Extract URLs
  const urlRegex = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;
  const urls = Array.from(new Set((text.match(urlRegex) || []).map((u) => u.replace(/[.,;:!?)]+$/, ''))));

  // 2. Extract Phone Numbers
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{3}-\d{3}-\d{4}\b|\b1-\d{3}-\d{3}-\d{4}\b|\b(?:\+91|0)?[6-9]\d{9}\b|\b\+234\s*\d{3,4}\s*\d{3,4}\b/g;
  const phoneNumbers = Array.from(new Set((text.match(phoneRegex) || []).map((p) => p.trim())));

  // 3. Extract Dates
  const dateRegex = /\b(?:\d{1,2}[./-]\d{1,2}[./-]\d{2,4}|\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{2,4})\b/gi;
  const dates = Array.from(new Set((text.match(dateRegex) || []).map((d) => d.trim())));

  // 4. Extract Stated Amounts
  const amountRegex = /(?:(?:\$|₹|€|£|Rs\.?|INR|USD)\s*[\d,]+(?:\.\d{1,2})?|[\d,]+(?:\.\d{1,2})?\s*(?:INR|USD|Rs\.?))\b/gi;
  const amounts = Array.from(new Set((text.match(amountRegex) || []).map((a) => a.trim())));

  // 5. Extract Organizations
  const organizations: string[] = [];
  const orgMap: Array<{ name: string; pattern: RegExp }> = [
    { name: 'Bank of Maharashtra', pattern: /bank of maharashtra/i },
    { name: 'Wells Fargo', pattern: /wells fargo/i },
    { name: 'Chase Bank', pattern: /\bchase\b/i },
    { name: 'Bank of America', pattern: /bank of america/i },
    { name: 'State Bank of India', pattern: /\bsbi\b|state bank of india/i },
    { name: 'HDFC Bank', pattern: /\bhdfc\b/i },
    { name: 'ICICI Bank', pattern: /\bicici\b/i },
    { name: 'Axis Bank', pattern: /\baxis bank\b/i },
    { name: 'Kotak Mahindra', pattern: /\bkotak\b/i },
    { name: 'Punjab National Bank', pattern: /\bpnb\b|punjab national bank/i },
    { name: 'Reserve Bank of India', pattern: /\brbi\b|reserve bank of india/i },
    { name: 'FedEx', pattern: /\bfed3x\b|\bfedex\b/i },
    { name: 'UPS', pattern: /\bups\b|myparcel-ups/i },
    { name: 'USPS', pattern: /\busps\b/i },
    { name: 'DHL', pattern: /\bdhl\b/i },
    { name: 'Target', pattern: /\btarget\b|targetwinner/i },
    { name: 'Walmart', pattern: /\bwalmart\b/i },
    { name: 'Amazon', pattern: /\bamazon\b/i },
    { name: 'Google', pattern: /\bgoogle\b/i },
    { name: 'Florida Toll Services / SunPass', pattern: /florida toll|sunpass|tolls-sunpass/i },
    { name: 'E-ZPass / DMV', pattern: /e-zpass|ezpass|dmv record|driver'?s license/i },
    { name: 'WhatsApp', pattern: /\bwhatsapp\b/i },
  ];
  for (const item of orgMap) {
    if (item.pattern.test(lower)) {
      organizations.push(item.name);
    }
  }

  // 6. Extract Attachments
  const attachments: Array<{ filename: string; type: string }> = [];
  if (/\b(?:18\s*mb\s*·\s*apk|\.apk|apk)\b/i.test(lower)) {
    const fnMatch = text.match(/([a-zA-Z0-9_\-.\s]+\.apk)/i) || text.match(/(Bank[a-zA-Z0-9_.\s]+)/i);
    attachments.push({
      filename: fnMatch ? fnMatch[0].trim() : 'Bank_Update.apk',
      type: 'APK',
    });
  }
  if (/\b\.exe\b/i.test(lower)) attachments.push({ filename: 'installer.exe', type: 'EXE' });
  if (/\b\.zip\b/i.test(lower)) attachments.push({ filename: 'archive.zip', type: 'ZIP' });
  if (/\b(?:open pdf file|\.pdf|pdf file)\b/i.test(lower)) attachments.push({ filename: 'document.pdf', type: 'PDF' });
  if (/\b(?:\.docx?|word document)\b/i.test(lower)) attachments.push({ filename: 'document.doc', type: 'DOC' });

  // 7. Extract Demanded / Requested Actions
  const requestedActions: string[] = [];
  if (/\b(?:open pdf|open attached file|open attachment|open file)\b/i.test(lower)) requestedActions.push('Open attachment');
  if (/\b(?:install application|install apk|download apk)\b/i.test(lower)) requestedActions.push('Install APK / application');
  if (/\b(?:rekyc|complete kyc|complete rekyc|update kyc|verify your identity)\b/i.test(lower)) requestedActions.push('Complete KYC / verify identity');
  if (/\b(?:click here|click to claim|visit:|click the link|click below)\b/i.test(lower)) requestedActions.push('Click web link');
  if (/\b(?:call us|call this number|call 1-|call \d+)\b/i.test(lower)) requestedActions.push('Call phone number');
  if (/\b(?:pay now|make a payment|pay the balance|complete payment)\b/i.test(lower)) requestedActions.push('Make payment / pay fee');
  if (/\b(?:send me your emails|send your address|share your personal details)\b/i.test(lower)) requestedActions.push('Share personal information (email/address)');
  if (/\b(?:share (?:the|your)? otp|tell us the otp|enter your otp)\b/i.test(lower)) requestedActions.push('Share secret OTP code');

  // 8. Indicators & Content Classification
  const indicators: string[] = [];
  let isWhatsApp = false;
  let isSMS = false;
  let isEmail = false;
  let isReceipt = false;
  let isDocument = false;

  // WhatsApp heuristics
  if (
    /\b(?:online|typing\.\.\.|last seen|message\.\.\.|type a message|whatsapp|chat|yesterday at \d|today at \d|\+234|\+91 \d{5}|\+1 \(\d{3}\))\b/i.test(lower) ||
    lower.includes('google reviews') ||
    lower.includes('google doc') ||
    (lower.includes('may i share') && lower.includes('job'))
  ) {
    isWhatsApp = true;
    indicators.push('WhatsApp conversation layout / chat phrasing detected');
  }

  // SMS / iMessage heuristics
  if (
    /\b(?:sms|imessage|text message|delivered|read \d{1,2}:\d{2}|custid|a\/c blocking|last date|unpaid toll|student loan|wells fargo|targetwinner|myparcel-ups)\b/i.test(lower) ||
    (/\b\d{5,6}\b/.test(text) && lower.includes('otp')) ||
    (/\b\d{3}-\d{3}-\d{4}\b/.test(text) && lower.includes('call'))
  ) {
    isSMS = true;
    indicators.push('SMS / mobile text messaging format detected');
  }

  // Email heuristics
  if (/\b(?:from:|to:|subject:|date:|dear customer|unsubscribe|view in browser|mail-tester)\b/i.test(lower)) {
    isEmail = true;
    indicators.push('Email header fields / newsletter layout detected');
  }

  // Receipt heuristics
  if (/\b(?:store #|cashier:|subtotal|tax:|total paid|invoice #|receipt)\b/i.test(lower) && amounts.length > 0) {
    isReceipt = true;
    indicators.push('POS / retail checkout receipt structure detected');
  }

  // Document heuristics
  if (text.length > 300 && !isWhatsApp && !isSMS) {
    isDocument = true;
    indicators.push('Long-form structured document text');
  }

  let contentType: DetectedContentType = 'OTHER';
  let confidence = 0.7;

  if (isWhatsApp) {
    contentType = 'WHATSAPP';
    confidence = 0.92;
  } else if (isSMS || (text.length > 0 && text.length < 350 && (phoneNumbers.length > 0 || urls.length > 0 || organizations.length > 0))) {
    contentType = 'SMS';
    confidence = 0.9;
  } else if (isEmail) {
    contentType = 'EMAIL';
    confidence = 0.88;
  } else if (isReceipt) {
    contentType = 'RECEIPT';
    confidence = 0.85;
  } else if (isDocument) {
    contentType = 'DOCUMENT';
    confidence = 0.82;
  } else if (text.length < 15 && (imageWidth > 0 && imageHeight > 0)) {
    contentType = 'PHOTOGRAPH';
    confidence = 0.65;
  } else if (text.length > 0) {
    contentType = 'SMS'; // Default readable short text to SMS/Chat channel
    confidence = 0.75;
  }

  // Extract Sender Name / Number
  let sender = 'Unknown Sender';
  const senderMatch = text.match(/^(?:From:|Sender:)?\s*([A-Za-z0-9_\-+ ()]{3,30})/i);
  if (organizations.length > 0) {
    sender = organizations[0];
  } else if (phoneNumbers.length > 0) {
    sender = phoneNumbers[0];
  } else if (senderMatch && senderMatch[1].length < 25) {
    sender = senderMatch[1].trim();
  }

  // Build sequential messages list for chat interfaces
  const messages: ChatMessageItem[] = [];
  const lines = text.split(/\n+/).map((l) => l.trim()).filter((l) => l.length > 0);
  for (const line of lines) {
    messages.push({
      speaker: line.includes('?') ? 'sender' : 'unknown',
      text: line,
    });
  }

  return {
    contentType,
    confidence,
    rawText: text,
    normalizedText: normalized,
    sender,
    phoneNumbers,
    urls,
    dates,
    amounts,
    organizations,
    attachments,
    requestedActions,
    messages,
    indicators,
  };
}
