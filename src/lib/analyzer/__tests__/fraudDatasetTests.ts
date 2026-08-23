import { evaluateFraudPatterns } from '../fraudPatternEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

console.log('=== RUNNING FRAUD REFERENCE DATASET VERIFICATION TESTS ===\n');

// 1. Bank KYC + APK
console.log('[Test 1] Bank KYC + APK:');
const t1 = evaluateFraudPatterns('*URGENTLY REQUIRED:-Your Bank of Maharashtra ReKYC pending for Bank of Maharashtra CustID XXXX.Complete ReKYC Last Date 13.may 2025 to avoid A/c blocking. Open PDF file. Immediately Thank you! Bank of Maharashtra A1... 18 MB · APK');
assert(t1.verdict === 'CRITICAL_FRAUD' || t1.verdict === 'LIKELY_FRAUD', `Verdict is CRITICAL/LIKELY_FRAUD (got: ${t1.verdict})`);
assert(t1.riskLevel === 'CRITICAL' || t1.riskLevel === 'HIGH', `Risk is CRITICAL/HIGH (got: ${t1.riskLevel})`);
assert(t1.riskScore >= 80, `Risk score >= 80 (got: ${t1.riskScore})`);
assert(t1.entities.attachments.some(a => a.type === 'APK'), 'Detected APK attachment');
assert(t1.entities.organization === 'Bank of Maharashtra', `Identified Bank of Maharashtra (got: ${t1.entities.organization})`);

// 2. Unknown Contact Personal Data Harvesting
console.log('\n[Test 2] Unknown Contact Info Harvesting:');
const t2 = evaluateFraudPatterns('May you send me your emails and address for our record?');
assert(t2.verdict === 'CRITICAL_FRAUD' || t2.verdict === 'LIKELY_FRAUD' || t2.verdict === 'SUSPICIOUS', `Verdict is FRAUD/SUSPICIOUS (got: ${t2.verdict})`);
assert(t2.riskScore >= 60, `Risk score >= 60 (got: ${t2.riskScore})`);

// 3. Fake Account Security Alert (FedEx)
console.log('\n[Test 3] Fake Security Alert (Fed3x):');
const t3 = evaluateFraudPatterns("Fed3x: Attention! We've found suspicious activities on your account! Contact us to protects your information!!");
assert(t3.verdict === 'CRITICAL_FRAUD' || t3.verdict === 'LIKELY_FRAUD', `Verdict is FRAUD (got: ${t3.verdict})`);
assert(t3.riskScore >= 65, `Risk score >= 65 (got: ${t3.riskScore})`);
assert(t3.entities.organization === 'FedEx', `Identified FedEx (got: ${t3.entities.organization})`);

// 4. Fake Job / Review Task Scam
console.log('\n[Test 4] Fake Job / Review Task:');
const t4 = evaluateFraudPatterns('May I share the job information with you? Great. We are Big Mover Company Llc. Your role is to right Google reviews for us. Each review pays $10. Can I share the links to the Google Doc with you?');
assert(t4.verdict === 'CRITICAL_FRAUD' || t4.verdict === 'LIKELY_FRAUD', `Verdict is FRAUD (got: ${t4.verdict})`);
assert(t4.riskScore >= 65, `Risk score >= 65 (got: ${t4.riskScore})`);

// 5. Fake Bank Account Lock Alert (Wells Fargo)
console.log('\n[Test 5] Wells Fargo Lockout Vishing:');
const t5 = evaluateFraudPatterns('Your Wells Fargo account has been locked for suspicious activity. Please call us at 201-429-3304 to verify your identity.');
assert(t5.verdict === 'CRITICAL_FRAUD' || t5.verdict === 'LIKELY_FRAUD', `Verdict is FRAUD (got: ${t5.verdict})`);
assert(t5.riskScore >= 80, `Risk score >= 80 (got: ${t5.riskScore})`);
assert(t5.entities.phoneNumbers.includes('201-429-3304'), 'Extracted callback phone number 201-429-3304');

// 6. Fake Delivery / Parcel Link (UPS)
console.log('\n[Test 6] UPS Missed Parcel Delivery:');
const t6 = evaluateFraudPatterns("You've missed our delivery. To reschedule delivery of your parcel, please visit: https://myparcel-ups.com.");
assert(t6.verdict === 'CRITICAL_FRAUD' || t6.verdict === 'LIKELY_FRAUD', `Verdict is FRAUD (got: ${t6.verdict})`);
assert(t6.riskScore >= 70, `Risk score >= 70 (got: ${t6.riskScore})`);

// 7. Fake Prize / Gift Card (Target)
console.log('\n[Test 7] Target $500 Gift Card Winner:');
const t7 = evaluateFraudPatterns("Congratulations! You've won a $500 gift card to Target. Click here to claim your reward: https://targetwinner.com");
assert(t7.verdict === 'CRITICAL_FRAUD' || t7.verdict === 'LIKELY_FRAUD', `Verdict is FRAUD (got: ${t7.verdict})`);
assert(t7.riskScore >= 80, `Risk score >= 80 (got: ${t7.riskScore})`);

// 8. Fake Toll / Payment Demand (SunPass)
console.log('\n[Test 8] Florida Toll SunPass Payment:');
const t8 = evaluateFraudPatterns('Florida toll services: We noticed an outstanding toll amount of $34.50 on your account. Please make a payment now to avoid a late fee: https://tolls-sunpass.com');
assert(t8.verdict === 'CRITICAL_FRAUD' || t8.verdict === 'LIKELY_FRAUD', `Verdict is FRAUD (got: ${t8.verdict})`);
assert(t8.riskScore >= 80, `Risk score >= 80 (got: ${t8.riskScore})`);

// 9. Fake Student Loan Forgiveness
console.log('\n[Test 9] Student Loan Forgiveness:');
const t9 = evaluateFraudPatterns('You may qualify for a new student loan forgiveness program! Enrollment ends soon. Call 1-855-412-0901 to apply now.');
assert(t9.verdict === 'CRITICAL_FRAUD' || t9.verdict === 'LIKELY_FRAUD', `Verdict is FRAUD (got: ${t9.verdict})`);
assert(t9.riskScore >= 65, `Risk score >= 65 (got: ${t9.riskScore})`);

// 10. Legitimate OTP (False-Positive Protection)
console.log('\n[Test 10] Legitimate OTP Message:');
const t10 = evaluateFraudPatterns('894210 is your login OTP for HDFC NetBanking. Valid for 10 mins. Do not share your OTP with anyone.');
assert(t10.verdict === 'LIKELY_LEGITIMATE', `Verdict is LIKELY_LEGITIMATE (got: ${t10.verdict})`);
assert(t10.riskScore <= 20, `Risk score <= 20 (got: ${t10.riskScore})`);

// 11. Legitimate Bank Transaction SMS (False-Positive Protection)
console.log('\n[Test 11] Legitimate Bank SMS:');
const t11 = evaluateFraudPatterns('INR 25,000.00 credited to A/c XX4928 on 22-Aug-2026 10:14 AM by UPI transfer. From: RAJESH SHARMA (rajesh@okhdfcbank). UPI Ref: 982103482189. Avl Bal: INR 1,42,850.00. - HDFC Bank');
assert(t11.verdict === 'LIKELY_LEGITIMATE', `Verdict is LIKELY_LEGITIMATE (got: ${t11.verdict})`);
assert(t11.riskScore <= 20, `Risk score <= 20 (got: ${t11.riskScore})`);

// 12. Legitimate Order Receipt (False-Positive Protection)
console.log('\n[Test 12] Legitimate Commerce Receipt:');
const t12 = evaluateFraudPatterns('Store #402 Cashier: Alice\nCoffee 2 $8.00\nTotal Paid: $8.00\nThank you for shopping!');
assert(t12.verdict === 'LIKELY_LEGITIMATE', `Verdict is LIKELY_LEGITIMATE (got: ${t12.verdict})`);
assert(t12.riskScore <= 20, `Risk score <= 20 (got: ${t12.riskScore})`);

// 13. Electricity Disconnection Threat
console.log('\n[Test 13] Electricity Power Disconnection Scam:');
const t13 = evaluateFraudPatterns('Dear consumer, your electricity power will be disconnected tonight at 9:30 PM from electricity office because your previous month bill was not updated. Please immediately contact our power officer at 9876543210.', [], ['9876543210']);
assert(t13.verdict === 'CRITICAL_FRAUD' || t13.verdict === 'LIKELY_FRAUD', `Verdict is CRITICAL/LIKELY_FRAUD (got: ${t13.verdict})`);
assert(t13.riskScore >= 80, `Risk score >= 80 (got: ${t13.riskScore})`);

// 14. Fake Traffic E-Challan / Parivahan
console.log('\n[Test 14] Traffic Police E-Challan:');
const t14 = evaluateFraudPatterns('Traffic Police Notice: Challan No. DL-82910 is pending against vehicle DL01AB1234 for overspeeding. Pay fine of Rs 1,500 within 24 hours to avoid court summons & license cancellation: http://echallan-parivahan-gov.net', ['http://echallan-parivahan-gov.net']);
assert(t14.verdict === 'CRITICAL_FRAUD' || t14.verdict === 'LIKELY_FRAUD', `Verdict is CRITICAL/LIKELY_FRAUD (got: ${t14.verdict})`);
assert(t14.riskScore >= 80, `Risk score >= 80 (got: ${t14.riskScore})`);

// 15. Digital Arrest / CBI Extortion
console.log('\n[Test 15] Digital Arrest / Law Enforcement:');
const t15 = evaluateFraudPatterns('URGENT: Legal Notice from Cyber Crime Cell / CBI. A FIR has been registered against your mobile number for illegal money laundering and narcotics trafficking. Connect immediately on WhatsApp Video Call with Officer Sharma or face imminent arrest within 2 hours.');
assert(t15.verdict === 'CRITICAL_FRAUD', `Verdict is CRITICAL_FRAUD (got: ${t15.verdict})`);
assert(t15.riskScore >= 90, `Risk score >= 90 (got: ${t15.riskScore})`);

// 16. Income Tax Refund Phishing
console.log('\n[Test 16] Income Tax Refund Phishing:');
const t16 = evaluateFraudPatterns('Income Tax Department: An amount of Rs 15,490 has been approved for refund to your account. Please confirm your bank account details and PAN here to claim before expiration: https://incometax-refund-gov.in', ['https://incometax-refund-gov.in']);
assert(t16.verdict === 'CRITICAL_FRAUD' || t16.verdict === 'LIKELY_FRAUD', `Verdict is FRAUD (got: ${t16.verdict})`);
assert(t16.riskScore >= 75, `Risk score >= 75 (got: ${t16.riskScore})`);

// 17. Credit Card Reward Points Expiry
console.log('\n[Test 17] Credit Card Reward Points:');
const t17 = evaluateFraudPatterns('Dear HDFC cardholder, your credit card reward points worth Rs 9,850 are expiring today (23-Aug). Redeem points directly to cash into your bank account immediately by visiting: http://hdfc-rewards-redeem.cc', ['http://hdfc-rewards-redeem.cc']);
assert(t17.verdict === 'CRITICAL_FRAUD' || t17.verdict === 'LIKELY_FRAUD', `Verdict is FRAUD (got: ${t17.verdict})`);
assert(t17.riskScore >= 80, `Risk score >= 80 (got: ${t17.riskScore})`);

// 18. Geek Squad / Tech Support Invoice Auto-Renewal
console.log('\n[Test 18] Geek Squad Invoice Auto-Renewal:');
const t18 = evaluateFraudPatterns('Geek Squad Invoice #GS-99281: Thank you for your payment of $499.99 for 3-Year Total Tech Protection. This charge will auto-debit from your account within 24 hours. To cancel or dispute this transaction, call our Refund Desk immediately at +1-888-492-0199.', [], ['+1-888-492-0199']);
assert(t18.verdict === 'CRITICAL_FRAUD' || t18.verdict === 'LIKELY_FRAUD', `Verdict is FRAUD (got: ${t18.verdict})`);
assert(t18.riskScore >= 85, `Risk score >= 85 (got: ${t18.riskScore})`);

// 19. Family Emergency / Hi Mum Scam
console.log('\n[Test 19] Hi Mum / Family Emergency:');
const t19 = evaluateFraudPatterns('Hi Mum, I dropped my phone down the toilet and broke it. This is my new temporary number. I urgently need to pay an emergency bill of £450 before 5pm or my service is cut off. Can you please transfer it to this bank account? Sort code: 04-00-04 Account: 82910394');
assert(t19.verdict === 'CRITICAL_FRAUD' || t19.verdict === 'LIKELY_FRAUD', `Verdict is FRAUD (got: ${t19.verdict})`);
assert(t19.riskScore >= 75, `Risk score >= 75 (got: ${t19.riskScore})`);

// 20. WhatsApp 6-digit Verification Code Hijack
console.log('\n[Test 20] WhatsApp Verification Code Takeover:');
const t20 = evaluateFraudPatterns('Hey! I accidentally sent my 6-digit WhatsApp verification code to your phone by mistake. Can you please send it back to me quickly? It is very urgent!');
assert(t20.verdict === 'CRITICAL_FRAUD', `Verdict is CRITICAL_FRAUD (got: ${t20.verdict})`);
assert(t20.riskScore >= 90, `Risk score >= 90 (got: ${t20.riskScore})`);

// 21. Crypto VIP Arbitrage Group
console.log('\n[Test 21] Crypto VIP Arbitrage Group:');
const t21 = evaluateFraudPatterns("Hello, this is Sophie's assistant from Morgan Stanley Crypto Wealth Club. Our VIP WhatsApp group gives 300% daily guaranteed profit on BTC/ETH arbitrage trading. Join the exclusive group: https://chat.whatsapp.com/inv99281", ['https://chat.whatsapp.com/inv99281']);
assert(t21.verdict === 'CRITICAL_FRAUD' || t21.verdict === 'LIKELY_FRAUD', `Verdict is FRAUD (got: ${t21.verdict})`);
assert(t21.riskScore >= 80, `Risk score >= 80 (got: ${t21.riskScore})`);

// 22. SIM Block / 5G eSIM KYC Upgradation
console.log('\n[Test 22] Telecom SIM 5G Upgrade Block:');
const t22 = evaluateFraudPatterns('Dear Jio/Airtel customer, your SIM card will be blocked within 24 hours due to non-upgradation to 5G / incomplete KYC. Call customer care 9811099281 or click http://jio-5g-upgrade.site to activate 5G eSIM instantly.', ['http://jio-5g-upgrade.site'], ['9811099281']);
assert(t22.verdict === 'CRITICAL_FRAUD' || t22.verdict === 'LIKELY_FRAUD', `Verdict is FRAUD (got: ${t22.verdict})`);
assert(t22.riskScore >= 80, `Risk score >= 80 (got: ${t22.riskScore})`);

// 23. Unauthorized iPhone Order Vishing
console.log('\n[Test 23] Unauthorized Amazon Order Vishing:');
const t23 = evaluateFraudPatterns('Amazon Alert: Your order for Apple iPhone 15 Pro Max ($1,299.00) has been placed successfully and will be billed to your card. If you did not make this purchase, call Fraud Prevention immediately at +1-800-492-0199 to cancel the charge.', [], ['+1-800-492-0199']);
assert(t23.verdict === 'CRITICAL_FRAUD' || t23.verdict === 'LIKELY_FRAUD', `Verdict is FRAUD (got: ${t23.verdict})`);
assert(t23.riskScore >= 80, `Risk score >= 80 (got: ${t23.riskScore})`);

// 24. Instant Personal Loan APK
console.log('\n[Test 24] Instant Loan 1% APK Spyware:');
const t24 = evaluateFraudPatterns('Congratulations! Pre-approved personal loan of Rs 5,00,000 sanctioned at 1% interest rate without CIBIL check. Disbursal in 5 minutes. Download loan app: http://instant-dhan-loan.apk', ['http://instant-dhan-loan.apk']);
assert(t24.verdict === 'CRITICAL_FRAUD', `Verdict is CRITICAL_FRAUD (got: ${t24.verdict})`);
assert(t24.riskScore >= 90, `Risk score >= 90 (got: ${t24.riskScore})`);

// 25. Netflix Subscription On Hold Phishing
console.log('\n[Test 25] Netflix Subscription Suspension:');
const t25 = evaluateFraudPatterns('Netflix: We were unable to process your monthly subscription payment. Your membership is on hold. Update your payment details within 24 hours to avoid account cancellation: https://netflix-update-billing.info', ['https://netflix-update-billing.info']);
assert(t25.verdict === 'CRITICAL_FRAUD' || t25.verdict === 'LIKELY_FRAUD', `Verdict is FRAUD (got: ${t25.verdict})`);
assert(t25.riskScore >= 75, `Risk score >= 75 (got: ${t25.riskScore})`);

// 26. USPS Incomplete Address Smishing
console.log('\n[Test 26] USPS Incomplete Address Smishing:');
const t26 = evaluateFraudPatterns('USPS: The package has arrived at the local depot but cannot be delivered due to incomplete street address information. Please update your address within 12 hours: https://usps-address-confirm.top', ['https://usps-address-confirm.top']);
assert(t26.verdict === 'CRITICAL_FRAUD' || t26.verdict === 'LIKELY_FRAUD', `Verdict is FRAUD (got: ${t26.verdict})`);
assert(t26.riskScore >= 75, `Risk score >= 75 (got: ${t26.riskScore})`);

// 27. Executive BEC Wire Transfer
console.log('\n[Test 27] Executive BEC Wire Transfer:');
const t27 = evaluateFraudPatterns('Hi, Are you at your desk? I am currently in a confidential executive meeting and need you to urgently process a wire transfer of $45,000 to our vendor before the close of business. Email me the confirmation once done.');
assert(t27.verdict === 'CRITICAL_FRAUD' || t27.verdict === 'LIKELY_FRAUD', `Verdict is FRAUD (got: ${t27.verdict})`);
assert(t27.riskScore >= 75, `Risk score >= 75 (got: ${t27.riskScore})`);

// 28. KBC WhatsApp Lottery Call Scam
console.log('\n[Test 28] KBC Lottery WhatsApp Call:');
const t28 = evaluateFraudPatterns('Badhai ho! Aapka WhatsApp number KBC lottery me Rs 25,00,000 jeet chuka hai. Lottery claim karne ke liye WhatsApp audio call karein Lottery Officer Rana Pratap Singh ko number +92-300-9821034 par.', [], ['+92-300-9821034']);
assert(t28.verdict === 'CRITICAL_FRAUD', `Verdict is CRITICAL_FRAUD (got: ${t28.verdict})`);
assert(t28.riskScore >= 90, `Risk score >= 90 (got: ${t28.riskScore})`);

console.log('\n✅ ALL 28 REFERENCE DATASET TEST CASES PASSED PERFECTLY!\n');
