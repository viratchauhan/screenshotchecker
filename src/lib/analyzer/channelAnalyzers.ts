import type { ChannelIntelligence, ExtractedEntitiesResult, TopCategory, LinkFinding } from './types';

export function analyzeChannelContext(
  text: string,
  category: TopCategory,
  entities: ExtractedEntitiesResult,
  links: LinkFinding[]
): ChannelIntelligence {
  const lower = text.toLowerCase();
  const notes: string[] = [];

  const isChat = category === 'MESSAGING';
  const isEmail = category === 'EMAIL';
  const isSms = category === 'SMS' || category === 'BANKING' || category === 'SECURITY';

  let channel: ChannelIntelligence['channel'] = 'GENERAL';
  if (isChat) channel = 'CHAT';
  else if (isEmail) channel = 'EMAIL';
  else if (isSms) channel = 'SMS';
  else if (category === 'COMMERCE') channel = 'COMMERCE';

  const isUrgent = /\b(?:urgently|immediate(?:ly)?|within 24 hours|action required|quick)\b/i.test(lower);
  const isThreatPresent = /\b(?:account suspended|blocked|legal action|penalty|police|terminated)\b/i.test(lower);
  const isPaymentRequested = /\b(?:send money|send (?:₹|\$)|transfer to upi|pay fee|gift card)\b/i.test(lower);
  const isOtpRequested = /\b(?:share (?:the|your)? otp|send (?:the)? code|forward (?:the)? otp)\b/i.test(lower);

  // 1. CHAT CHANNEL INTELLIGENCE
  if (channel === 'CHAT') {
    if (isPaymentRequested && isUrgent) {
      notes.push('Urgent payment request detected inside instant messaging conversation. High social-engineering risk.');
    } else if (isPaymentRequested) {
      notes.push('Casual or peer-to-peer payment request detected within messaging context.');
    }
    if (isOtpRequested) {
      notes.push('Direct request to share an OTP or passcode via chat. Extreme account takeover risk.');
    }
    if (text.includes('end-to-end encrypt')) {
      notes.push('WhatsApp-like encryption disclaimer visible in chat header.');
    }
  }

  // 2. EMAIL CHANNEL INTELLIGENCE
  let domainMatch: ChannelIntelligence['domainMatch'] = undefined;
  if (channel === 'EMAIL') {
    const claimedOrg = entities.organizations[0];
    const emailDomain = entities.emails[0]?.split('@')[1];
    if (claimedOrg && emailDomain) {
      const isAligned = emailDomain.toLowerCase().includes(claimedOrg.toLowerCase().replace(/\s+/g, ''));
      domainMatch = {
        claimedOrg,
        actualDomain: emailDomain,
        isAligned,
      };
      if (!isAligned) {
        notes.push(`Potential domain mismatch: Claimed organization "${claimedOrg}" does not match sender domain "${emailDomain}".`);
      }
    }
  }

  // 3. SMS CHANNEL INTELLIGENCE
  if (channel === 'SMS') {
    if (text.includes('otp') && !isOtpRequested && !isThreatPresent) {
      notes.push('Standard one-time verification passcode (OTP) issuance message with safety warnings.');
    } else if (text.includes('otp') && (isOtpRequested || isThreatPresent)) {
      notes.push('Security warning or threat combined with OTP disclosure prompt. High credential-stealing risk.');
    }
  }

  return {
    channel,
    senderIdentity: entities.people[1] || entities.organizations[0] || undefined,
    recipientIdentity: entities.people[0] || undefined,
    isUrgent,
    isThreatPresent,
    isPaymentRequested,
    isOtpRequested,
    domainMatch,
    notes,
  };
}
