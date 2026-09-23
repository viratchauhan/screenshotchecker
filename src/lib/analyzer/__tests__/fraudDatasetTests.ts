import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateFraudPatterns } from '../fraudPatternEngine';
import { REFERENCE_SCAM_DATASET } from '../dataset/fraudKnowledgeBase';
test('historical example t1: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('*URGENTLY REQUIRED:-Your Bank of Maharashtra ReKYC pending for Bank of Maharashtra CustID XXXX.Complete ReKYC Last Date 13.may 2025 to avoid A/c blocking. Open PDF file. Immediately Thank you! Bank of Maharashtra A1... 18 MB · APK');
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t2: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('May you send me your emails and address for our record?');
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t3: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns("Fed3x: Attention! We've found suspicious activities on your account! Contact us to protects your information!!");
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t4: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('May I share the job information with you? Great. We are Big Mover Company Llc. Your role is to right Google reviews for us. Each review pays $10. Can I share the links to the Google Doc with you?');
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t5: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('Your Wells Fargo account has been locked for suspicious activity. Please call us at 201-429-3304 to verify your identity.');
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t6: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns("You've missed our delivery. To reschedule delivery of your parcel, please visit: https://myparcel-ups.com.");
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t7: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns("Congratulations! You've won a $500 gift card to Target. Click here to claim your reward: https://targetwinner.com");
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t8: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('Florida toll services: We noticed an outstanding toll amount of $34.50 on your account. Please make a payment now to avoid a late fee: https://tolls-sunpass.com');
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t9: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('You may qualify for a new student loan forgiveness program! Enrollment ends soon. Call 1-855-412-0901 to apply now.');
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t10: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('894210 is your login OTP for HDFC NetBanking. Valid for 10 mins. Do not share your OTP with anyone.');
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t11: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('INR 25,000.00 credited to A/c XX4928 on 22-Aug-2026 10:14 AM by UPI transfer. From: RAJESH SHARMA (rajesh@okhdfcbank). UPI Ref: 982103482189. Avl Bal: INR 1,42,850.00. - HDFC Bank');
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t12: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('Store #402 Cashier: Alice\nCoffee 2 $8.00\nTotal Paid: $8.00\nThank you for shopping!');
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t13: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('Dear consumer, your electricity power will be disconnected tonight at 9:30 PM from electricity office because your previous month bill was not updated. Please immediately contact our power officer at 9876543210.', [], ['9876543210']);
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t14: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('Traffic Police Notice: Challan No. DL-82910 is pending against vehicle DL01AB1234 for overspeeding. Pay fine of Rs 1,500 within 24 hours to avoid court summons & license cancellation: http://echallan-parivahan-gov.net', ['http://echallan-parivahan-gov.net']);
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t15: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('URGENT: Legal Notice from Cyber Crime Cell / CBI. A FIR has been registered against your mobile number for illegal money laundering and narcotics trafficking. Connect immediately on WhatsApp Video Call with Officer Sharma or face imminent arrest within 2 hours.');
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t16: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('Income Tax Department: An amount of Rs 15,490 has been approved for refund to your account. Please confirm your bank account details and PAN here to claim before expiration: https://incometax-refund-gov.in', ['https://incometax-refund-gov.in']);
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t17: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('Dear HDFC cardholder, your credit card reward points worth Rs 9,850 are expiring today (23-Aug). Redeem points directly to cash into your bank account immediately by visiting: http://hdfc-rewards-redeem.cc', ['http://hdfc-rewards-redeem.cc']);
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t18: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('Geek Squad Invoice #GS-99281: Thank you for your payment of $499.99 for 3-Year Total Tech Protection. This charge will auto-debit from your account within 24 hours. To cancel or dispute this transaction, call our Refund Desk immediately at +1-888-492-0199.', [], ['+1-888-492-0199']);
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t19: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('Hi Mum, I dropped my phone down the toilet and broke it. This is my new temporary number. I urgently need to pay an emergency bill of £450 before 5pm or my service is cut off. Can you please transfer it to this bank account? Sort code: 04-00-04 Account: 82910394');
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t20: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('Hey! I accidentally sent my 6-digit WhatsApp verification code to your phone by mistake. Can you please send it back to me quickly? It is very urgent!');
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t21: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns("Hello, this is Sophie's assistant from Morgan Stanley Crypto Wealth Club. Our VIP WhatsApp group gives 300% daily guaranteed profit on BTC/ETH arbitrage trading. Join the exclusive group: https://chat.whatsapp.com/inv99281", ['https://chat.whatsapp.com/inv99281']);
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t22: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('Dear Jio/Airtel customer, your SIM card will be blocked within 24 hours due to non-upgradation to 5G / incomplete KYC. Call customer care 9811099281 or click http://jio-5g-upgrade.site to activate 5G eSIM instantly.', ['http://jio-5g-upgrade.site'], ['9811099281']);
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t23: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('Amazon Alert: Your order for Apple iPhone 15 Pro Max ($1,299.00) has been placed successfully and will be billed to your card. If you did not make this purchase, call Fraud Prevention immediately at +1-800-492-0199 to cancel the charge.', [], ['+1-800-492-0199']);
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t24: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('Congratulations! Pre-approved personal loan of Rs 5,00,000 sanctioned at 1% interest rate without CIBIL check. Disbursal in 5 minutes. Download loan app: http://instant-dhan-loan.apk', ['http://instant-dhan-loan.apk']);
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t25: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('Netflix: We were unable to process your monthly subscription payment. Your membership is on hold. Update your payment details within 24 hours to avoid account cancellation: https://netflix-update-billing.info', ['https://netflix-update-billing.info']);
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t26: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('USPS: The package has arrived at the local depot but cannot be delivered due to incomplete street address information. Please update your address within 12 hours: https://usps-address-confirm.top', ['https://usps-address-confirm.top']);
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t27: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('Hi, Are you at your desk? I am currently in a confidential executive meeting and need you to urgently process a wire transfer of $45,000 to our vendor before the close of business. Email me the confirmation once done.');
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('historical example t28: no forced nearest-example verdict', () => {
  const r = evaluateFraudPatterns('Badhai ho! Aapka WhatsApp number KBC lottery me Rs 25,00,000 jeet chuka hai. Lottery claim karne ke liye WhatsApp audio call karein Lottery Officer Rana Pratap Singh ko number +92-300-9821034 par.', [], ['+92-300-9821034']);
  if (!r.matchedPatternId && !['TRANSACTIONAL_OTP','BANKING_ALERT','COMMERCE_RECEIPT'].includes(r.scamCategories[0])) {
    assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.match(r.summary, /No reliable match/);
    assert.equal(r.scamCategories.length, 0);
  } else if (r.matchedPatternId) {
    assert.ok(REFERENCE_SCAM_DATASET.some(p => p.id === r.matchedPatternId));
    assert.match(r.summary, /Extracted text/);
  }
});
test('every stored example remains discoverable without copying its explanation', () => {
 for (const ref of REFERENCE_SCAM_DATASET) { const r=evaluateFraudPatterns(ref.originalMessage); assert.equal(r.matchedPatternId, ref.id); assert.ok(!r.summary.includes(ref.explanation.en)); }
});
