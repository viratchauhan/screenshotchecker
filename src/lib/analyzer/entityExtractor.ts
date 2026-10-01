import { extractUnmarkedPaymentAmounts, labelledReferenceSpans, overlapsReference } from './paymentTextContext';
import type {
  StructuredEntity,
  ParsedAmount,
  MetadataInfo,
  EntityType,
  ConfidenceLevel,
} from './types';

const KNOWN_ORGANIZATIONS = [
  'Chase',
  'Bank of America',
  'Wells Fargo',
  'Citibank',
  'Capital One',
  'HDFC Bank',
  'HDFC',
  'ICICI Bank',
  'ICICI',
  'State Bank of India',
  'SBI',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Kotak',
  'Punjab National Bank',
  'PayPal',
  'Venmo',
  'Zelle',
  'Cash App',
  'Google Pay',
  'GPay',
  'PhonePe',
  'Paytm',
  'BHIM',
  'Stripe',
  'Amazon',
  'Apple',
  'Microsoft',
  'Netflix',
  'Spotify',
  'USPS',
  'FedEx',
  'DHL',
  'UPS',
  'Target',
  'Walmart',
  'SunPass',
  'Florida Toll Services',
  'Bank of Maharashtra',
  'Flipkart',
  'Swiggy',
  'Zomato',
  'Uber',
];

export interface ExtractedEntitiesResult {
  entities: StructuredEntity[];
  amounts: ParsedAmount[];
  organizations: string[];
  people: string[];
  dates: string[];
  times: string[];
  phoneNumbers: string[];
  emails: string[];
  urls: string[];
  upiIds: string[];
  transactionIds: string[];
  orderIds: string[];
  accounts: string[];
  locations: string[];
  usernames: string[];
}

export function extractEntitiesDetailed(
  text: string,
  metadata?: MetadataInfo
): ExtractedEntitiesResult {
  const entities: StructuredEntity[] = [];
  const amounts: ParsedAmount[] = [];
  const organizations: string[] = [];
  const people: string[] = [];
  const dates: string[] = [];
  const times: string[] = [];
  const phoneNumbers: string[] = [];
  const emails: string[] = [];
  const urls: string[] = [];
  const upiIds: string[] = [];
  const transactionIds: string[] = [];
  const orderIds: string[] = [];
  const accounts: string[] = [];
  const locations: string[] = [];
  const usernames: string[] = [];

  const seenValues = new Set<string>();

  const pushEntity = (
    type: EntityType,
    value: string,
    confidence: ConfidenceLevel = 'HIGH',
    evidence = 'Detected via text pattern matching',
    normalizedValue?: number | string
  ) => {
    const clean = value.trim();
    if (!clean) return;
    const key = `${type}:${clean.toLowerCase()}`;
    if (seenValues.has(key)) return;
    seenValues.add(key);

    entities.push({
      id: `ent_${entities.length + 1}`,
      type,
      value: clean,
      normalizedValue,
      source: 'ocr_text',
      confidence,
      evidence,
    });
  };

  // 1. Organizations & Banks
  for (const org of KNOWN_ORGANIZATIONS) {
    const regex = new RegExp(`\\b${org}\\b`, 'i');
    if (regex.test(text)) {
      organizations.push(org);
      const isBank = /bank|chase|wells|citi|hdfc|icici|sbi|axis|kotak|paypal|venmo|zelle|gpay|phonepe|paytm/i.test(org);
      pushEntity(isBank ? 'BANK' : 'ORGANIZATION', org, 'HIGH', `Recognized known institution entity: ${org}`);
    }
  }

  // 2. Amounts & Currencies
  const amountRegex = /(?:(?:\$|₹|€|£|Rs\.?|INR|USD|EUR|GBP)\s*([\d,]+(?:\.\d{1,2})?)|([\d,]+(?:\.\d{1,2})?)\s*(?:INR|USD|EUR|GBP|Rs\.?))\b/gi;
  let match;
  while ((match = amountRegex.exec(text)) !== null) {
    const rawMatch = match[0].trim();
    const numStr = (match[1] || match[2] || '').replace(/,/g, '');
    const numVal = parseFloat(numStr);

    if (!isNaN(numVal) && numVal > 0) {
      let currency = 'USD';
      if (rawMatch.includes('₹') || /INR|Rs/i.test(rawMatch)) currency = 'INR';
      else if (rawMatch.includes('$') || /USD/i.test(rawMatch)) currency = 'USD';
      else if (rawMatch.includes('€') || /EUR/i.test(rawMatch)) currency = 'EUR';
      else if (rawMatch.includes('£') || /GBP/i.test(rawMatch)) currency = 'GBP';

      const contextIndex = Math.max(0, match.index - 30);
      const surrounding = text.substring(contextIndex, match.index + rawMatch.length + 30).toLowerCase();
      let context = 'Amount mentioned';
      if (surrounding.includes('credit')) context = 'Credited amount';
      else if (surrounding.includes('debit')) context = 'Debited amount';
      else if (surrounding.includes('total')) context = 'Total amount';
      else if (surrounding.includes('paid')) context = 'Paid amount';
      else if (surrounding.includes('bal')) context = 'Account balance';

      const parsedAmt: ParsedAmount = {
        raw: rawMatch,
        value: numVal,
        currency,
        context,
      };

      amounts.push(parsedAmt);
      pushEntity('AMOUNT', rawMatch, 'HIGH', `Parsed ${currency} currency value: ${numVal} (${context})`, numVal);
    }
  }

  if (amounts.length === 0) {
    for (const raw of extractUnmarkedPaymentAmounts(text)) {
      const value = Number(raw.replace(/,/g, ''));
      amounts.push({ raw, value, currency: 'Unknown', context: 'Payment-context amount; currency not detected' });
      pushEntity('AMOUNT', raw, 'MEDIUM', 'Amount inferred from payment field context; currency unknown', value);
    }
  }

  // 3. UPI IDs
  const upiRegex = /\b[a-zA-Z0-9.\-_]{2,40}@(okhdfcbank|okaxis|oksbi|okicici|paytm|upi|ybl|axl|ibl|barodampay|fbl)\b/gi;
  while ((match = upiRegex.exec(text)) !== null) {
    upiIds.push(match[0]);
    pushEntity('UPI_ID', match[0], 'HIGH', 'Virtual Payment Address / UPI format pattern');
  }

  const referenceSpans = labelledReferenceSpans(text);
  for (const span of referenceSpans) {
    const reference = text.slice(span.start, span.end);
    transactionIds.push(reference);
    pushEntity('TRANSACTION_ID', reference, 'HIGH', 'Financial reference or authorization identifier');
  }

  // 4. Other Transaction / Reference IDs
  const txnRegex = /\b(?:UTR|RRN|UPI\s*Ref(?:\s*No)?|Txn\s*(?:ID|Ref|No)|Transaction\s*(?:ID|Ref|No|Number)|Ref\s*(?:ID|No|#)|Reference\s*(?:ID|No|#)|Auth\s*Code)[:\s-]*([A-Z0-9_-]{6,25})\b/gi;
  while ((match = txnRegex.exec(text)) !== null) {
    if (!overlapsReference(match.index, match[0].length, referenceSpans)) {
      transactionIds.push(match[0]);
      pushEntity('TRANSACTION_ID', match[0], 'HIGH', 'Financial reference or authorization identifier');
    }
  }

  // 5. Order / Invoice IDs
  const orderRegex = /\b(?:Order\s*(?:ID|No|#)|Invoice\s*(?:ID|No|#)|Receipt\s*(?:ID|No|#)|Tracking\s*(?:ID|No|#))[:\s-]*([A-Z0-9_-]{5,25})\b/gi;
  while ((match = orderRegex.exec(text)) !== null) {
    orderIds.push(match[0]);
    pushEntity('ORDER_ID', match[0], 'HIGH', 'Commercial invoice or order tracking reference');
  }

  // 6. Account & Card Identifiers
  const acctRegex = /\b(?:A\/c|Acct|Account|Card)\s*(?:No|Number|ending|#)?[:\s-]*([X*]{2,8}\d{3,6}|\d{4})\b/gi;
  while ((match = acctRegex.exec(text)) !== null) {
    accounts.push(match[0]);
    pushEntity('ACCOUNT_IDENTIFIER', match[0], 'HIGH', 'Masked account or payment card identifier');
  }

  // 7. Dates & Times
  const dateRegex = /\b(?:\d{1,2}[-/](?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[-/]\d{2,4}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})\b/gi;
  while ((match = dateRegex.exec(text)) !== null) {
    dates.push(match[0]);
    pushEntity('DATE', match[0], 'HIGH', 'Calendar timestamp / date representation');
  }

  const timeRegex = /\b(?:1[0-2]|0?[1-9]):[0-5][0-9]\s*(?:AM|PM|am|pm)\b|\b(?:[01]?[0-9]|2[0-3]):[0-5][0-9]\s*(?:hrs|hours)?\b/g;
  while ((match = timeRegex.exec(text)) !== null) {
    times.push(match[0]);
    pushEntity('TIME', match[0], 'HIGH', 'Time of day indicator');
  }

  // 8. Emails
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  while ((match = emailRegex.exec(text)) !== null) {
    emails.push(match[0]);
    pushEntity('EMAIL', match[0], 'HIGH', 'Standard RFC 5322 electronic mail address');
  }

  // 9. Phone numbers
  const phoneRegex = /(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*\d{3}\s*\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}\b|\b(?:\+91|0)?[6-9]\d{9}\b|\b\+?[0-9]{1,3}[-.\s]?(?:\(\d{2,4}\)|\d{2,4})[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g;
  while ((match = phoneRegex.exec(text)) !== null) {
    const cleanDigits = match[0].replace(/\D/g, '');
    if (
      cleanDigits.length >= 10 && cleanDigits.length <= 15 &&
      !overlapsReference(match.index, match[0].length, referenceSpans) &&
      !/\d/.test(text[match.index - 1] || '') &&
      !/\d/.test(text[match.index + match[0].length] || '')
    ) {
      phoneNumbers.push(match[0]);
      pushEntity('PHONE', match[0], 'HIGH', 'E.164 telecommunication phone sequence');
    }
  }

  // 10. URLs
  const urlRegex = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;
  while ((match = urlRegex.exec(text)) !== null) {
    const cleanUrl = match[0].replace(/[.,;:!?)]+$/, '');
    urls.push(cleanUrl);
    pushEntity('URL', cleanUrl, 'HIGH', 'Uniform Resource Locator');
  }

  // 11. People
  const personRegex = /\b(?:Customer|Paid to|Transfer to|Sent to|Received from|To|From)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b/g;
  while ((match = personRegex.exec(text)) !== null) {
    if (match[1] && !KNOWN_ORGANIZATIONS.includes(match[1])) {
      people.push(match[1]);
      pushEntity('PERSON', match[1], 'MEDIUM', `Person entity extracted from contextual prompt (${match[0].split(':')[0]})`);
    }
  }

  // 12. GPS from metadata
  if (metadata?.gps) {
    const gpsVal = `${metadata.gps.lat.toFixed(4)}, ${metadata.gps.lng.toFixed(4)}`;
    locations.push(gpsVal);
    pushEntity('LOCATION', gpsVal, 'HIGH', 'Exact GPS geolocation embedded in EXIF metadata tags');
  }

  return {
    entities,
    amounts,
    organizations,
    people,
    dates,
    times,
    phoneNumbers,
    emails,
    urls,
    upiIds,
    transactionIds,
    orderIds,
    accounts,
    locations,
    usernames,
  };
}

export function extractEntities(text: string, metadata?: MetadataInfo): ExtractedEntitiesResult {
  return extractEntitiesDetailed(text, metadata);
}
