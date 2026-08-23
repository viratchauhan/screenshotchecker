import type { VisualFingerprint, VisualFingerprintSignal, ImageInfo, OCRResult } from './types';

export function extractVisualFingerprint(
  imageInfo: ImageInfo,
  ocr: OCRResult
): VisualFingerprint {
  const signals: VisualFingerprintSignal[] = [];
  const text = ocr.text.toLowerCase();

  // 1. Mobile Status Bar & Navigation
  const hasStatusBar = /\b(?:5g|lte|4g|wifi|\d{1,2}:\d{2}\s*(?:am|pm)?|\d{1,3}%)\b/i.test(text);
  if (hasStatusBar) {
    signals.push({
      type: 'layout',
      signal: 'mobile_status_bar',
      strength: 'strong',
      description: 'Mobile operating system status bar indicators (clock, network, battery) detected.',
    });
  }

  // 2. Chat Bubble Layout
  const hasChatTerms = /\b(?:online|typing\.\.\.|end-to-end encrypt|yesterday at \d|today at \d|voice message|read \d{1,2}:\d{2})\b/i.test(text);
  const hasChatBubbles = hasChatTerms || (text.includes('whatsapp') || text.includes('telegram') || text.includes('imessage'));
  if (hasChatBubbles) {
    signals.push({
      type: 'layout',
      signal: 'chat_interface_signals',
      strength: 'strong',
      description: 'Instant messaging chat layout signals (timestamps, encryption tags, or read receipts) detected.',
    });
  }

  // 3. Transaction Card Layout
  const hasTransactionCard = /\b(?:transaction details|payment successful|payment details|upi ref|amount paid|paid to|auth code)\b/i.test(text);
  if (hasTransactionCard) {
    signals.push({
      type: 'layout',
      signal: 'transaction_card_structure',
      strength: 'strong',
      description: 'Structured financial transaction card or payment confirmation receipt framing detected.',
    });
  }

  // 4. Receipt / Invoice Table Rules
  const hasDividerRule = text.includes('---') || text.includes('===') || /\b(?:subtotal|sales tax|cashier|store #|item\s+qty|qty\s+price)\b/i.test(text);
  if (hasDividerRule) {
    signals.push({
      type: 'layout',
      signal: 'receipt_divider_structure',
      strength: 'strong',
      description: 'Point-of-sale receipt or invoice itemization structure detected.',
    });
  }

  // 5. Hero Amount Placement
  const hasHeroAmount = /(?:₹|\$|€|£|inr|usd)\s*[\d,]+(?:\.\d{2})?/i.test(text);
  if (hasHeroAmount) {
    signals.push({
      type: 'layout',
      signal: 'amount_hero_emphasis',
      strength: 'moderate',
      description: 'Prominent currency amount display detected in layout.',
    });
  }

  // 6. Avatar / Profile
  const hasAvatarOrProfile = /\b(?:followers|following|posts|profile|view profile|customer:)\b/i.test(text);

  // 7. Status Badge
  const hasStatusBadge = /\b(?:approved|successful|failed|pending|completed|declined|suspended)\b/i.test(text);

  let detectedUIPattern = 'General Graphic / Unspecified Image';
  if (hasChatBubbles) detectedUIPattern = 'Chat / Instant Messaging Interface';
  else if (hasTransactionCard) detectedUIPattern = 'Digital Payment Receipt / Transaction Card';
  else if (hasDividerRule) detectedUIPattern = 'Point-of-Sale / Commercial Receipt Layout';
  else if (hasStatusBar && hasHeroAmount) detectedUIPattern = 'Mobile Banking / Financial App Screen';
  else if (hasStatusBar) detectedUIPattern = 'Mobile Screen Capture';

  return {
    signals,
    hasHeader: hasStatusBar,
    hasChatBubbles,
    hasTransactionCard,
    hasStatusBadge,
    hasHeroAmount,
    hasDividerRule,
    hasAvatarOrProfile,
    detectedUIPattern,
  };
}
