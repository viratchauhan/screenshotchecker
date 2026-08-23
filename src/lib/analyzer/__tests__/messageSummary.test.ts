import { evaluateFraudPatterns } from '../fraudPatternEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

function assertNoHinglish(summary: string, testName: string) {
  const bannedHinglishPatterns = [
    /\bYe\b/i,
    /\bYeh\b/i,
    /\bIsme\b/i,
    /\bAap\b/i,
    /\bAapka\b/i,
    /\bAapki\b/i,
    /\bKar raha\b/i,
    /\bKarein\b/i,
    /\bHain\b/i,
    /\bHai\b/i,
    /\bLene ka\b/i,
    /\bLag raha\b/i,
    /\bBana raha\b/i,
    /\bBol raha\b/i,
    /\bKarni hai\b/i,
    /\bBina kisi\b/i,
    /\bChurane ke\b/i,
    /\bBalki\b/i,
  ];

  for (const pattern of bannedHinglishPatterns) {
    if (pattern.test(summary)) {
      throw new Error(`[${testName}] Detected forbidden Hinglish/Hindi pattern "${pattern}" in summary: "${summary}"`);
    }
  }
}

async function runMessageSummaryTests() {
  console.log('================================================================');
  console.log('--- RUNNING "WHAT IS THIS MESSAGE SAYING?" ENGLISH SUMMARY TESTS ---');
  console.log('================================================================\n');

  // Test 1: SBI / Bank ReKYC + APK
  console.log('[Test 1] Bank ReKYC + APK (State Bank of India):');
  const text1 = 'State Bank of India: Your SBI KYC is pending. Download SBI_KYC.apk to avoid account blocking immediately.';
  const res1 = evaluateFraudPatterns(text1, [], [], 1080, 2400);
  console.log('  Summary Output:', res1.summary);
  assertNoHinglish(res1.summary, 'Test 1');
  assert(res1.summary.includes('State Bank of India') || res1.summary.includes('bank'), 'Mentions bank name');
  assert(res1.summary.includes('KYC'), 'Mentions KYC');
  assert(res1.summary.includes('attachment') || res1.summary.includes('attached file'), 'Mentions attachment/APK');

  // Test 2: Bank of Maharashtra Dataset Example
  console.log('\n[Test 2] Bank of Maharashtra ReKYC (Dataset Match):');
  const text2 = '*URGENTLY REQUIRED:-Your Bank of Maharashtra ReKYC pending for Bank of Maharashtra CustID XXXX.Complete ReKYC Last Date 13.may 2025 to avoid A/c blocking. Open PDF file. Immediately Thank you! 18 MB · APK';
  const res2 = evaluateFraudPatterns(text2, [], [], 1080, 2400);
  console.log('  Summary Output:', res2.summary);
  assertNoHinglish(res2.summary, 'Test 2');
  assert(res2.summary.includes('Bank of Maharashtra'), 'Mentions Bank of Maharashtra');
  assert(res2.summary.includes('KYC') || res2.summary.includes('ReKYC'), 'Mentions KYC');

  // Test 3: Fake Delivery / Missed Parcel
  console.log('\n[Test 3] Fake Delivery / Missed Parcel (UPS):');
  const text3 = "You've missed our delivery. To reschedule delivery of your parcel, please visit: https://myparcel-ups.com.";
  const res3 = evaluateFraudPatterns(text3, ['https://myparcel-ups.com'], [], 1080, 2400);
  console.log('  Summary Output:', res3.summary);
  assertNoHinglish(res3.summary, 'Test 3');
  assert(res3.summary.toLowerCase().includes('parcel') || res3.summary.toLowerCase().includes('delivery'), 'Mentions parcel delivery');
  assert(res3.summary.toLowerCase().includes('reschedule') || res3.summary.toLowerCase().includes('link'), 'Mentions reschedule/link');

  // Test 4: Fake Prize / Gift Card
  console.log('\n[Test 4] Fake Prize / Gift Card (Target $500):');
  const text4 = "Congratulations! You've won a $500 gift card to Target. Click here to claim your reward: https://targetwinner.com";
  const res4 = evaluateFraudPatterns(text4, ['https://targetwinner.com'], [], 1080, 2400);
  console.log('  Summary Output:', res4.summary);
  assertNoHinglish(res4.summary, 'Test 4');
  assert(res4.summary.toLowerCase().includes('gift card') || res4.summary.toLowerCase().includes('reward'), 'Mentions gift card / reward');
  assert(res4.summary.toLowerCase().includes('claim'), 'Mentions claim');

  // Test 5: Wells Fargo Account Lock Vishing
  console.log('\n[Test 5] Bank Account Lock Vishing (Wells Fargo):');
  const text5 = 'Your Wells Fargo account has been locked for suspicious activity. Please call us at 201-429-3304 to verify your identity.';
  const res5 = evaluateFraudPatterns(text5, [], ['201-429-3304'], 1080, 2400);
  console.log('  Summary Output:', res5.summary);
  assertNoHinglish(res5.summary, 'Test 5');
  assert(res5.summary.toLowerCase().includes('locked') || res5.summary.toLowerCase().includes('suspicious activity'), 'Mentions account lock/suspicious activity');
  assert(res5.summary.toLowerCase().includes('call'), 'Mentions calling number');

  // Test 6: Unknown Contact Personal Data Request
  console.log('\n[Test 6] Personal Data Harvesting:');
  const text6 = 'May you send me your emails and address for our record?';
  const res6 = evaluateFraudPatterns(text6, [], [], 1080, 2400);
  console.log('  Summary Output:', res6.summary);
  assertNoHinglish(res6.summary, 'Test 6');
  assert(res6.summary.includes('email address') && res6.summary.includes('address'), 'Mentions email and physical address');

  // Test 7: Fake Toll Notice (SunPass / E-ZPass)
  console.log('\n[Test 7] Fake Toll Notice (SunPass):');
  const text7 = 'Florida toll services: We noticed an outstanding toll amount of $34.50 on your account. Please make a payment now to avoid a late fee: https://tolls-sunpass.com';
  const res7 = evaluateFraudPatterns(text7, ['https://tolls-sunpass.com'], [], 1080, 2400);
  console.log('  Summary Output:', res7.summary);
  assertNoHinglish(res7.summary, 'Test 7');
  assert(res7.summary.toLowerCase().includes('toll'), 'Mentions toll balance');
  assert(res7.summary.toLowerCase().includes('payment') || res7.summary.toLowerCase().includes('fee'), 'Mentions payment/fee');

  // Test 8: WhatsApp Job Scam
  console.log('\n[Test 8] WhatsApp Job Scam:');
  const text8 = 'May I share the job information with you? Great. We are Big Mover Company Llc. Your role is to right Google reviews for us. Each review pays $10. Can I share the links to the Google Doc with you?';
  const res8 = evaluateFraudPatterns(text8, [], [], 1080, 2400);
  console.log('  Summary Output:', res8.summary);
  assertNoHinglish(res8.summary, 'Test 8');
  assert(res8.summary.toLowerCase().includes('job') || res8.summary.toLowerCase().includes('reviews'), 'Mentions job / reviews');

  // Test 9: Legitimate OTP Notification
  console.log('\n[Test 9] Legitimate OTP Notification:');
  const text9 = 'Your OTP for ICICI NetBanking login is 849201. Valid for 5 mins. Do not share OTP with anyone including bank staff.';
  const res9 = evaluateFraudPatterns(text9, [], [], 1080, 2400);
  console.log('  Summary Output:', res9.summary);
  assertNoHinglish(res9.summary, 'Test 9');
  assert(res9.summary.toLowerCase().includes('one-time verification code') || res9.summary.toLowerCase().includes('otp'), 'Mentions OTP');

  // Test 10: Legitimate Bank Transaction Notification
  console.log('\n[Test 10] Legitimate Bank Transaction Alert:');
  const text10 = 'HDFC Bank: Rs 4,500.00 credited to A/C XX4920 on 12-FEB-26 by UPI/Salary. Avl Bal: Rs 52,430.00.';
  const res10 = evaluateFraudPatterns(text10, [], [], 1080, 2400);
  console.log('  Summary Output:', res10.summary);
  assertNoHinglish(res10.summary, 'Test 10');
  assert(res10.summary.toLowerCase().includes('transaction notification'), 'Mentions transaction notification');

  // Test 11: Multilingual / Hindi Source Text (Must produce English summary)
  console.log('\n[Test 11] Hindi Source Text -> English Summary:');
  const text11 = 'Aapka bank account block ho gaya hai. Turant diye gaye link par click karke KYC complete karein nahi to account band ho jayega: https://sbi-kyc-update.com';
  const res11 = evaluateFraudPatterns(text11, ['https://sbi-kyc-update.com'], [], 1080, 2400);
  console.log('  Summary Output:', res11.summary);
  assertNoHinglish(res11.summary, 'Test 11');
  assert(res11.summary.toLowerCase().includes('kyc') || res11.summary.toLowerCase().includes('account'), 'Explains meaning in English');

  // Test 12: Generic Personal Communication
  console.log('\n[Test 12] Generic Personal Message:');
  const text12 = 'Hey, what time are we meeting for lunch tomorrow? Let me know!';
  const res12 = evaluateFraudPatterns(text12, [], [], 1080, 2400);
  console.log('  Summary Output:', res12.summary);
  assertNoHinglish(res12.summary, 'Test 12');
  assert(res12.summary.toLowerCase().includes('standard communication'), 'Neutral summary for personal message');

  console.log('\n================================================================');
  console.log('✅ ALL "WHAT IS THIS MESSAGE SAYING?" ENGLISH SUMMARY TESTS PASSED 100%!');
  console.log('================================================================\n');
}

runMessageSummaryTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
