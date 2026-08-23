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

console.log('\n✅ ALL 12 REFERENCE DATASET TEST CASES PASSED PERFECTLY!\n');
