import { evaluateFraudPatterns } from '../fraudPatternEngine';
import { routeContent } from '../contentRouter';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

console.log('================================================================');
console.log('--- RUNNING COMPREHENSIVE FRAUD DETECTION & PIPELINE TESTS ---');
console.log('================================================================\n');

// --------------------------------------------------------------------------
// TEST 1: Bank of Maharashtra ReKYC APK Malware Phishing
// --------------------------------------------------------------------------
console.log('[Test 1] Bank of Maharashtra ReKYC + 18 MB APK:');
const bomText = `
Bank of Maharashtra
Dear Customer, Your Bank A/c will be Blocked today.
Your ReKYC is URGENTLY REQUIRED to avoid A/c blocking.
Open PDF file and complete your verification.
Bank_ReKYC_Update.pdf
18 MB · APK
`;
const res1 = evaluateFraudPatterns(bomText, [], []);
assert(res1.verdict === 'CRITICAL_FRAUD' || res1.riskLevel === 'CRITICAL', `Verdict is CRITICAL (got: ${res1.verdict}, riskLevel: ${res1.riskLevel})`);
assert(res1.riskScore >= 90, `Risk score is >= 90 (got: ${res1.riskScore}/100)`);
assert(res1.entities.organization === 'Bank of Maharashtra', `Identified Bank of Maharashtra (got: ${res1.entities.organization})`);
assert(res1.entities.attachments.some((a) => a.type === 'APK'), `Detected APK attachment payload`);
assert(res1.signals.length >= 4, `Generated 4+ evidence traces (got: ${res1.signals.length})`);
assert(res1.scamCategories.includes('BANK_KYC_PHISHING'), `Category is BANK_KYC_PHISHING`);

// --------------------------------------------------------------------------
// TEST 2: Legitimate OTP Delivery Notification
// --------------------------------------------------------------------------
console.log('\n[Test 2] Legitimate OTP Notification:');
const otpText = 'Your OTP is 482931 for login at HDFC NetBanking. Valid for 5 mins. Do not share this OTP with anyone, including bank staff.';
const res2 = evaluateFraudPatterns(otpText, [], []);
assert(res2.verdict === 'LIKELY_LEGITIMATE', `Verdict is LIKELY_LEGITIMATE (got: ${res2.verdict})`);
assert(res2.riskScore <= 20, `Risk score is <= 20 (got: ${res2.riskScore}/100)`);
assert(res2.riskLevel === 'LOW', `Risk level is LOW (got: ${res2.riskLevel})`);

// --------------------------------------------------------------------------
// TEST 3: Fake Job WhatsApp Scam (Google Reviews Task)
// --------------------------------------------------------------------------
console.log('\n[Test 3] Fake Job WhatsApp Conversation:');
const waJobText = `
+234 803 123 4567
Online · Yesterday at 10:45 AM
Hello! I am Sarah from TalentRecruit.
We have a flexible part-time remote job reviewing Google businesses.
Earn $50 to $150 per day just by giving 5-star ratings!
May I share the full job details with you via Google Doc?
`;
const res3 = evaluateFraudPatterns(waJobText, [], ['+234 803 123 4567']);
assert(res3.contentType === 'WHATSAPP', `Content type is WHATSAPP (got: ${res3.contentType})`);
assert(res3.riskLevel === 'HIGH' || res3.riskLevel === 'CRITICAL', `Risk level is HIGH/CRITICAL (got: ${res3.riskLevel})`);
assert(res3.riskScore >= 75, `Risk score is >= 75 (got: ${res3.riskScore}/100)`);
assert(res3.scamCategories.includes('FAKE_JOB_SCAM'), `Scam category includes FAKE_JOB_SCAM`);
assert(res3.signals.some((s) => s.type.toLowerCase() === 'fake_job_bait' || s.type.toLowerCase() === 'social_engineering'), `Detected fake job bait signal`);

// --------------------------------------------------------------------------
// TEST 4: Fake Delivery Smishing (UPS Missed Parcel)
// --------------------------------------------------------------------------
console.log('\n[Test 4] Fake Delivery Smishing (UPS):');
const upsText = 'UPS Alert: We missed your parcel delivery today. To reschedule delivery and avoid return to sender, visit https://myparcel-ups.com/track';
const res4 = evaluateFraudPatterns(upsText, ['https://myparcel-ups.com/track'], []);
assert(res4.riskLevel === 'HIGH' || res4.riskLevel === 'CRITICAL', `Risk level is HIGH (got: ${res4.riskLevel})`);
assert(res4.riskScore >= 70, `Risk score is >= 70 (got: ${res4.riskScore}/100)`);
assert(res4.scamCategories.includes('DELIVERY_SCAM'), `Scam category is DELIVERY_SCAM`);

// --------------------------------------------------------------------------
// TEST 5: Fake Prize Scam (Target $500 Gift Card)
// --------------------------------------------------------------------------
console.log('\n[Test 5] Fake Prize Scam (Target $500):');
const targetText = '🎉 CONGRATULATIONS! You have won a $500 Target Gift Card! Claim your reward immediately at https://targetwinner.com/claim within 24 hours.';
const res5 = evaluateFraudPatterns(targetText, ['https://targetwinner.com/claim'], []);
assert(res5.riskLevel === 'HIGH' || res5.riskLevel === 'CRITICAL', `Risk level is HIGH/CRITICAL (got: ${res5.riskLevel})`);
assert(res5.riskScore >= 80, `Risk score is >= 80 (got: ${res5.riskScore}/100)`);
assert(res5.scamCategories.includes('PRIZE_SCAM'), `Scam category is PRIZE_SCAM`);

// --------------------------------------------------------------------------
// TEST 6: Bank Account Security Lock / Vishing (Wells Fargo)
// --------------------------------------------------------------------------
console.log('\n[Test 6] Bank Security Lock Vishing (Wells Fargo):');
const wfText = 'Wells Fargo Security Alert: Your debit card has been temporarily SUSPENDED due to suspicious activity. Call 1-800-555-0199 immediately to verify your identity.';
const res6 = evaluateFraudPatterns(wfText, [], ['1-800-555-0199']);
assert(res6.riskLevel === 'HIGH' || res6.riskLevel === 'CRITICAL', `Risk level is HIGH/CRITICAL (got: ${res6.riskLevel})`);
assert(res6.riskScore >= 80, `Risk score is >= 80 (got: ${res6.riskScore}/100)`);
assert(res6.signals.some((s) => s.type.toLowerCase() === 'vishing_callback' || s.type.toLowerCase() === 'account_threat'), `Detected vishing callback / account threat`);

// --------------------------------------------------------------------------
// TEST 7: Fake Road Toll Late Fee Scam (SunPass)
// --------------------------------------------------------------------------
console.log('\n[Test 7] Fake Toll Notice (SunPass):');
const tollText = 'Florida Toll Services: You have an unpaid toll invoice balance of $34.50. Final notice to pay before late fees apply: https://tolls-sunpass.com/pay';
const res7 = evaluateFraudPatterns(tollText, ['https://tolls-sunpass.com/pay'], []);
assert(res7.riskLevel === 'CRITICAL' || res7.riskLevel === 'HIGH', `Risk level is CRITICAL/HIGH (got: ${res7.riskLevel})`);
assert(res7.riskScore >= 85, `Risk score is >= 85 (got: ${res7.riskScore}/100)`);
assert(res7.scamCategories.includes('TOLL_SCAM'), `Scam category is TOLL_SCAM`);

// --------------------------------------------------------------------------
// TEST 8: Genuine Bank Credit Alert
// --------------------------------------------------------------------------
console.log('\n[Test 8] Genuine Bank Transaction Alert:');
const bankTxnText = 'INR 25,000.00 credited to A/c ending 4920 on 22-Aug-2026 by UPI/rajesh@okhdfcbank. Avl Bal: INR 64,300.00.';
const res8 = evaluateFraudPatterns(bankTxnText, [], []);
assert(res8.verdict === 'LIKELY_LEGITIMATE', `Verdict is LIKELY_LEGITIMATE (got: ${res8.verdict})`);
assert(res8.riskScore <= 20, `Risk score is <= 20 (got: ${res8.riskScore}/100)`);

// --------------------------------------------------------------------------
// TEST 9: OCR Error / 0 Extracted Characters
// --------------------------------------------------------------------------
console.log('\n[Test 9] OCR Error (0 extracted characters):');
const res9 = evaluateFraudPatterns('', [], []);
assert(res9.verdict === 'OCR_ERROR', `Verdict is OCR_ERROR (got: ${res9.verdict})`);
assert(res9.isOcrError === true, `isOcrError flag is true`);
assert(res9.summary.includes("Text couldn't be read"), `Helpful error message provided`);

// --------------------------------------------------------------------------
// TEST 10: Content Router Visual Cues
// --------------------------------------------------------------------------
console.log('\n[Test 10] Content Router Classification:');
const waRouted = routeContent('Online\nTyping...\nHey, are you free for a job?');
assert(waRouted.contentType === 'WHATSAPP', `Classified as WHATSAPP (got: ${waRouted.contentType})`);

const smsRouted = routeContent('From: SBI-ALERT\nYour OTP is 891203. Valid for 10 minutes.');
assert(smsRouted.contentType === 'SMS', `Classified as SMS (got: ${smsRouted.contentType})`);

console.log('\n================================================================');
console.log('✅ ALL 10 COMPREHENSIVE PIPELINE TESTS PASSED 100%!');
console.log('================================================================\n');
