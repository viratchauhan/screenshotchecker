import type { SemanticClaim, ExtractedEntitiesResult, TopCategory, ClaimEventType, ConfidenceLevel } from './types';

export function extractClaims(
  text: string,
  category: TopCategory,
  entities: ExtractedEntitiesResult
): SemanticClaim[] {
  const claims: SemanticClaim[] = [];
  const lower = text.toLowerCase();
  const primaryOrg = entities.organizations[0];
  const primaryAmount = entities.amounts[0];

  let timePressure: string | undefined;
  const timeMatch = lower.match(/\b(?:within\s+(\d+\s*(?:hours?|hrs?|mins?|minutes?|days?))|immediate(?:ly)?|urgent(?:ly)?|action required)\b/i);
  if (timeMatch) {
    timePressure = timeMatch[1] || 'Immediate action demanded';
  }

  // 1. Prize / Lottery Won (Check first for scam claims)
  if (/\b(?:won|winner|lottery|reward of|gift card|selected for free|congratulations)\b/i.test(lower)) {
    claims.push({
      id: 'claim_prize',
      claimType: 'PRIZE_WON',
      primaryClaim: `You have supposedly won a prize or cash reward${primaryAmount ? ` of ${primaryAmount.raw}` : ''}.`,
      subject: 'Prize Promotion',
      event: 'Lottery / Prize Award',
      amount: primaryAmount,
      organization: primaryOrg,
      claimText: text.substring(0, 140),
      timePressure,
      evidence: 'Prize/lottery winning notification text pattern',
      confidence: 'HIGH',
    });
    return claims;
  }

  // 2. Account Threat / Lockout / Security Alert
  if (
    /\b(?:account (?:ending \d+|is)? (?:suspended|blocked|locked|terminated|frozen)|security alert|chase alert|unauthorized access|penalty)\b/i.test(
      lower
    ) ||
    (lower.includes('account') && (lower.includes('suspended') || lower.includes('blocked') || lower.includes('locked'))) ||
    (lower.includes('alert') && lower.includes('suspended'))
  ) {
    claims.push({
      id: 'claim_lockout',
      claimType: 'ACCOUNT_LOCKED',
      primaryClaim: `Your ${primaryOrg || 'service'} account is facing security lockout or suspension.`,
      subject: primaryOrg || 'User Account',
      event: 'Account Lockout Threat',
      organization: primaryOrg,
      claimText: text.substring(0, 140),
      timePressure: timePressure || 'Urgent timeframe claimed',
      evidence: 'Suspension, lockout, or security threat phrasing identified',
      confidence: 'HIGH',
    });
    return claims;
  }

  // 3. Payment Pending
  if (/\b(?:pending|processing|under review|in progress)\b/i.test(lower) && !lower.includes('refund processed') && (entities.amounts.length > 0 || category === 'BANKING')) {
    claims.push({
      id: 'claim_pending',
      claimType: 'PAYMENT_PENDING',
      primaryClaim: `A transaction of ${primaryAmount?.raw || 'funds'} is currently pending review or settlement.`,
      subject: primaryOrg || 'Payment',
      event: 'Payment Pending',
      amount: primaryAmount,
      organization: primaryOrg,
      claimText: text.substring(0, 140),
      timePressure,
      evidence: 'Pending settlement status keyword identified',
      confidence: 'HIGH',
    });
    return claims;
  }

  // 4. Payment Failed / Cancelled
  if (/\b(?:failed|declined|unsuccessful|rejected|cancelled)\b/i.test(lower) && (entities.amounts.length > 0 || category === 'PAYMENT' || category === 'BANKING' || category === 'MESSAGING')) {
    claims.push({
      id: 'claim_failed',
      claimType: 'PAYMENT_FAILED',
      primaryClaim: `A payment transaction${primaryAmount ? ` of ${primaryAmount.raw}` : ''} failed or was cancelled.`,
      subject: primaryOrg || 'Payment',
      event: 'Payment Failed',
      amount: primaryAmount,
      organization: primaryOrg,
      claimText: text.substring(0, 140),
      timePressure,
      evidence: 'Payment failure/cancellation indicator identified',
      confidence: 'HIGH',
    });
    return claims;
  }

  // 5. Money Credited / Refund
  if (/\b(?:credited|deposit(?:ed)?|cashback|refund processed|credited back)\b/i.test(lower) && entities.amounts.length > 0) {
    claims.push({
      id: 'claim_credit',
      claimType: 'MONEY_CREDITED',
      primaryClaim: `A financial account was credited with ${primaryAmount?.raw || 'funds'}.`,
      subject: primaryOrg || 'Financial Account',
      event: 'Money Credited',
      amount: primaryAmount,
      organization: primaryOrg,
      claimText: text.substring(0, 140),
      timePressure,
      evidence: 'Credited keyword associated with monetary currency value',
      confidence: 'HIGH',
    });
    return claims;
  }

  // 6. Money Debited / Transferred
  if (
    /\b(?:debited|paid|transferred to|sent to|payment successful|payment of|total paid|subscription payment)\b/i.test(lower) &&
    entities.amounts.length > 0
  ) {
    claims.push({
      id: 'claim_debit',
      claimType: 'MONEY_DEBITED',
      primaryClaim: `A payment or debit of ${primaryAmount?.raw || 'funds'} was processed.`,
      subject: primaryOrg || 'Payment Account',
      event: 'Payment Debited / Transferred',
      amount: primaryAmount,
      organization: primaryOrg,
      claimText: text.substring(0, 140),
      timePressure,
      evidence: 'Payment debit/transfer keyword associated with monetary currency value',
      confidence: 'HIGH',
    });
    return claims;
  }

  // 7. OTP / Verification Code
  if (/\b(?:otp|verification code|security pin|is your code|login otp)\b/i.test(lower)) {
    claims.push({
      id: 'claim_otp',
      claimType: 'OTP_DELIVERY',
      primaryClaim: `A one-time verification passcode (OTP) has been generated for authentication with ${primaryOrg || 'a service'}.`,
      subject: primaryOrg || 'Authentication Service',
      event: 'OTP Delivery',
      organization: primaryOrg,
      claimText: text.substring(0, 140),
      timePressure: 'Valid for a limited duration',
      evidence: 'OTP verification issuance format detected',
      confidence: 'HIGH',
    });
    return claims;
  }

  // 8. Delivery Update / Reschedule Notice
  if (/\b(?:missed (?:our )?delivery|reschedule delivery|parcel|package could not be delivered|track your parcel)\b/i.test(lower)) {
    claims.push({
      id: 'claim_delivery',
      claimType: 'DELIVERY_UPDATE',
      primaryClaim: `A parcel or delivery notification regarding a shipment from ${primaryOrg || 'a carrier'}.`,
      subject: primaryOrg || 'Courier Delivery',
      event: 'Delivery Update',
      organization: primaryOrg,
      claimText: text.substring(0, 140),
      timePressure,
      evidence: 'Parcel delivery or rescheduling prompt detected',
      confidence: 'HIGH',
    });
    return claims;
  }

  // 9. Payment Demand / Toll Invoice
  if (/\b(?:outstanding toll|unpaid toll|avoid a late fee|make a payment now|pay the balance|excessive fine|toll amount)\b/i.test(lower)) {
    claims.push({
      id: 'claim_payment_demand',
      claimType: 'PAYMENT_DEMAND',
      primaryClaim: `An urgent payment or debt demand${primaryAmount ? ` of ${primaryAmount.raw}` : ''} issued by ${primaryOrg || 'a billing authority'}.`,
      subject: primaryOrg || 'Billing Authority',
      event: 'Payment Demand',
      amount: primaryAmount,
      organization: primaryOrg,
      claimText: text.substring(0, 140),
      timePressure: timePressure || 'Payment deadline specified',
      evidence: 'Outstanding debt or fee demand phrasing identified',
      confidence: 'HIGH',
    });
    return claims;
  }

  // 10. Loan Forgiveness / Unsolicited Promotion
  if (/\b(?:loan forgiveness|enrollment ends soon|you may qualify|debt relief)\b/i.test(lower)) {
    claims.push({
      id: 'claim_promotional',
      claimType: 'PROMOTIONAL',
      primaryClaim: `An unsolicited financial promotion or loan forgiveness qualification claim.`,
      subject: 'Financial Program',
      event: 'Promotional Offer',
      organization: primaryOrg,
      claimText: text.substring(0, 140),
      timePressure: timePressure || 'Enrollment deadline specified',
      evidence: 'Loan relief or enrollment promotion pattern detected',
      confidence: 'HIGH',
    });
    return claims;
  }

  // 11. Order Placed
  if (/\b(?:order confirmed|order placed|purchase of|thank you for your order)\b/i.test(lower)) {
    claims.push({
      id: 'claim_order',
      claimType: 'ORDER_PLACED',
      primaryClaim: `An e-commerce order has been placed${primaryOrg ? ` with ${primaryOrg}` : ''}${primaryAmount ? ` for ${primaryAmount.raw}` : ''}.`,
      subject: primaryOrg || 'E-Commerce Order',
      event: 'Order Placed',
      amount: primaryAmount,
      organization: primaryOrg,
      claimText: text.substring(0, 140),
      timePressure,
      evidence: 'Order placement confirmation text detected',
      confidence: 'HIGH',
    });
    return claims;
  }

  // Fallback
  claims.push({
    id: 'claim_info',
    claimType: 'INFORMATIONAL',
    primaryClaim: `Informational graphic or message related to ${primaryOrg || 'general communication'}.`,
    subject: primaryOrg || 'Communication',
    event: 'Informational Notice',
    organization: primaryOrg,
    claimText: text.substring(0, 140),
    timePressure,
    evidence: 'General informational text capture',
    confidence: 'LOW',
  });

  return claims;
}

export function extractClaim(
  text: string,
  category: any,
  entities: ExtractedEntitiesResult
): SemanticClaim {
  const all = extractClaims(text, category, entities);
  return all[0];
}
