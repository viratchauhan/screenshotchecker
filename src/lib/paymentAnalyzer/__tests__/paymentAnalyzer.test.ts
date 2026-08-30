import { classifyPaymentScreenshot } from '../paymentClassifier';
import { extractPaymentEntities } from '../paymentExtractor';
import { evaluatePaymentVisualForensics } from '../paymentVisualForensics';
import { computePaymentRisk } from '../paymentRiskEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

console.log('=== RUNNING SEPARATE PAYMENT SCREENSHOT CHECKER TEST MATRIX ===\n');

// -----------------------------------------------------------------------------
// TEST 1: Real-looking PhonePe Payment Receipt
// -----------------------------------------------------------------------------
console.log('[Test 1] Real-looking PhonePe Payment Receipt:');
const text1 = `
Transaction Successful
30 Aug 2026, 11:17 AM
ReviewCraft Store
reviewcraftstore@ybl
₹500.00
Payment for subscription
Transaction ID: TXN1JB2JWHL
Debited from: State Bank of India - 2845
UTR: 423189271602
Secured by PhonePe • BHIM UPI
`;

const class1 = classifyPaymentScreenshot(text1);
const ext1 = extractPaymentEntities(text1);
const fore1 = evaluatePaymentVisualForensics(text1, ext1);
const res1 = computePaymentRisk(class1, ext1, fore1, text1, '', {
  name: 'phonepe_real.png',
  sizeBytes: 120000,
  width: 600,
  height: 900,
  mimeType: 'image/png',
  aspectRatio: '2:3',
});

assert(res1.domain === 'payment', 'Domain is strictly payment');
assert(res1.isPaymentScreenshot === true, 'Identified as payment screenshot');
assert(res1.receiptType === 'PAYMENT_SUCCESS', `Receipt type is PAYMENT_SUCCESS (got: ${res1.receiptType})`);
assert(res1.paymentApp === 'PhonePe', `Payment app is PhonePe (got: ${res1.paymentApp})`);
assert(res1.amount === '₹500.00', `Amount is ₹500.00 (got: ${res1.amount})`);
assert(res1.recipientName.includes('ReviewCraft Store'), `Recipient is ReviewCraft Store (got: ${res1.recipientName})`);
assert(res1.upiId === 'reviewcraftstore@ybl', `UPI ID is reviewcraftstore@ybl (got: ${res1.upiId})`);
assert(res1.utr === '423189271602', `UTR is 423189271602 (got: ${res1.utr})`);
assert(res1.paymentProofStrength === 'STRONG_VISUAL', `Proof strength is STRONG_VISUAL (got: ${res1.paymentProofStrength})`);
assert(!res1.verdictLabel.includes('JOB SCAM'), 'Does NOT contain Job Scam');
assert(!res1.verdictLabel.includes('VISHING'), 'Does NOT contain Vishing');

// -----------------------------------------------------------------------------
// TEST 2: Fake PhonePe Screenshot with Typography & Icon Inconsistencies
// -----------------------------------------------------------------------------
console.log('\n[Test 2] Fake PhonePe Screenshot with Serif Text & Embedded Bank Icon:');
const text2 = `
Transaction Successful
30 Aug 2026, 11:17 AM
ReviewCraft Store
reviewcraftstore@ybl
₹500.00
Banking name: ReviewCraft Store ✓
Payment for subscription
Transaction ID: TXN1JB2JWHL
Debited from
State 🏦 Bank of India - 2845
UTR: 423189271602
Secured by PhonePe • BHIM UPI
`;

const class2 = classifyPaymentScreenshot(text2);
const ext2 = extractPaymentEntities(text2);
const fore2 = evaluatePaymentVisualForensics(text2, ext2);
const res2 = computePaymentRisk(class2, ext2, fore2, text2, '', {
  name: 'phonepe_fake.png',
  sizeBytes: 130000,
  width: 600,
  height: 900,
  mimeType: 'image/png',
  aspectRatio: '2:3',
});

assert(res2.isPaymentScreenshot === true, 'Identified as payment screenshot');
assert(res2.verdict === 'SUSPICIOUS' || res2.verdict === 'HIGH_RISK', `Verdict is SUSPICIOUS/HIGH_RISK (got: ${res2.verdict})`);
assert(res2.riskFactors.some((f) => f.type === 'TYPOGRAPHY_ANOMALY'), 'Detected Typography Anomaly');
assert(res2.riskFactors.some((f) => f.type === 'ICON_PLACEMENT_ANOMALY'), 'Detected Icon Placement Anomaly in Bank Name');

// -----------------------------------------------------------------------------
// TEST 3: Fake Receipt with Conflicting Spliced Amounts (₹500 vs ₹5,000)
// -----------------------------------------------------------------------------
console.log('\n[Test 3] Fake Receipt with Conflicting Spliced Amounts:');
const text3 = `
Transaction Successful
Paid to: ReviewCraft Store
₹5,000.00
Debited amount: ₹500.00
UTR: 423189271602
`;

const class3 = classifyPaymentScreenshot(text3);
const ext3 = extractPaymentEntities(text3);
const fore3 = evaluatePaymentVisualForensics(text3, ext3);
const res3 = computePaymentRisk(class3, ext3, fore3, text3, '', {
  name: 'amount_tampered.png',
  sizeBytes: 110000,
  width: 600,
  height: 800,
  mimeType: 'image/png',
  aspectRatio: '3:4',
});

assert(res3.verdict === 'HIGH_RISK' || res3.verdict === 'SUSPICIOUS', `Verdict is HIGH_RISK (got: ${res3.verdict})`);
assert(res3.riskFactors.some((f) => f.type === 'AMOUNT_MISMATCH'), 'Detected internal Amount Mismatch');

// -----------------------------------------------------------------------------
// TEST 4: Canara Bank Balance Screenshot (No Payment Proof)
// -----------------------------------------------------------------------------
console.log('\n[Test 4] Canara Bank Balance Screenshot:');
const text4 = `
Canara Bank UPI
✓ Bank balance fetched successfully
Canara Bank - Savings A/c (Ending 9012)
₹ 3,884.63
Available Balance at 30 Aug 2026, 11:20 AM
`;

const class4 = classifyPaymentScreenshot(text4);
const ext4 = extractPaymentEntities(text4);
const fore4 = evaluatePaymentVisualForensics(text4, ext4);
const res4 = computePaymentRisk(class4, ext4, fore4, text4, '', {
  name: 'canara_balance.png',
  sizeBytes: 90000,
  width: 600,
  height: 800,
  mimeType: 'image/png',
  aspectRatio: '3:4',
});

assert(res4.receiptType === 'BANK_BALANCE', `Classified as BANK_BALANCE (got: ${res4.receiptType})`);
assert(res4.paymentProofStrength === 'NONE', `Payment proof strength is NONE (got: ${res4.paymentProofStrength})`);
assert(res4.verdict === 'NO_PAYMENT_PROOF', `Verdict is NO_PAYMENT_PROOF (got: ${res4.verdict})`);
assert(res4.verdictDescription.includes('account balance check'), 'Explains this is an account balance check');

// -----------------------------------------------------------------------------
// TEST 5: Google Pay (GPay) Transfer Confirmation
// -----------------------------------------------------------------------------
console.log('\n[Test 5] Google Pay Transfer Confirmation:');
const text5 = `
Paid ₹1,250.00
To Sharma Enterprises
sharma@okhdfcbank
Google Pay
UPI transaction ID: 423189271602
12:45 PM, 28 Aug 2026
`;

const class5 = classifyPaymentScreenshot(text5);
const ext5 = extractPaymentEntities(text5);
assert(class5.paymentApp === 'Google Pay', `Identified Google Pay (got: ${class5.paymentApp})`);
assert(class5.receiptType === 'PAYMENT_SUCCESS', `Receipt type is PAYMENT_SUCCESS`);
assert(ext5.primaryAmount === '₹1,250.00', `Extracted amount ₹1,250.00`);

// -----------------------------------------------------------------------------
// TEST 6: Paytm Transfer Receipt
// -----------------------------------------------------------------------------
console.log('\n[Test 6] Paytm Transfer Receipt:');
const text6 = `
Payment Successful
₹750
Paid to Gupta Store
merchant@paytm
Paytm Payments Bank
Txn ID: PYTM998218001
`;

const class6 = classifyPaymentScreenshot(text6);
assert(class6.paymentApp === 'Paytm', `Identified Paytm (got: ${class6.paymentApp})`);
assert(class6.receiptType === 'PAYMENT_SUCCESS', `Receipt type is PAYMENT_SUCCESS`);

// -----------------------------------------------------------------------------
// TEST 7: BHIM UPI Confirmation
// -----------------------------------------------------------------------------
console.log('\n[Test 7] BHIM UPI Confirmation:');
const text7 = `
BHIM UPI
Money Sent Successfully
₹300.00
To: Rajesh Kumar
UPI Ref No: 423189271602
`;

const class7 = classifyPaymentScreenshot(text7);
assert(class7.paymentApp === 'BHIM UPI', `Identified BHIM UPI (got: ${class7.paymentApp})`);

// -----------------------------------------------------------------------------
// TEST 8: Pop UPI Transfer
// -----------------------------------------------------------------------------
console.log('\n[Test 8] Pop UPI Transfer:');
const text8 = `
Pop UPI
Payment of ₹450 Successful
To Coffee House
UPI ID: coffee@indus
`;

const class8 = classifyPaymentScreenshot(text8);
assert(class8.paymentApp === 'Pop UPI', `Identified Pop UPI (got: ${class8.paymentApp})`);

// -----------------------------------------------------------------------------
// TEST 9: Non-Payment Screenshot (Job Scam Message)
// -----------------------------------------------------------------------------
console.log('\n[Test 9] Completely Unrelated Job Scam Screenshot:');
const text9 = `
Part-time online job opportunity!
Earn ₹5000 daily by liking YouTube videos and Google reviews.
Contact HR on WhatsApp: +91 9876543210.
Join our Telegram group now.
`;

const class9 = classifyPaymentScreenshot(text9);
const ext9 = extractPaymentEntities(text9);
const fore9 = evaluatePaymentVisualForensics(text9, ext9);
const res9 = computePaymentRisk(class9, ext9, fore9, text9, '', {
  name: 'job_scam.png',
  sizeBytes: 80000,
  width: 600,
  height: 800,
  mimeType: 'image/png',
  aspectRatio: '3:4',
});

assert(res9.domain === 'non_payment', 'Domain is non_payment');
assert(res9.isPaymentScreenshot === false, 'isPaymentScreenshot is false');
assert(res9.verdict === 'NOT_A_PAYMENT', `Verdict is NOT_A_PAYMENT (got: ${res9.verdict})`);
assert(res9.verdictLabel === 'Payment Screenshot Not Detected', 'Verdict label is Payment Screenshot Not Detected');
assert(!res9.verdictLabel.includes('JOB SCAM'), 'Does NOT output generic Job Scam verdict');

// -----------------------------------------------------------------------------
// TEST 10: Collect Request Deception
// -----------------------------------------------------------------------------
console.log('\n[Test 10] UPI Collect Request:');
const text10 = `
Payment Request from Unknown Buyer
Requesting ₹2,000.00
Enter your UPI PIN to approve request and receive money.
Approve Request | Decline
`;

const class10 = classifyPaymentScreenshot(text10);
const ext10 = extractPaymentEntities(text10);
const fore10 = evaluatePaymentVisualForensics(text10, ext10);
const res10 = computePaymentRisk(class10, ext10, fore10, text10, '', {
  name: 'collect_request.png',
  sizeBytes: 85000,
  width: 600,
  height: 800,
  mimeType: 'image/png',
  aspectRatio: '3:4',
});

assert(res10.receiptType === 'COLLECT_REQUEST', 'Classified as COLLECT_REQUEST');
assert(res10.paymentProofStrength === 'NONE', 'Proof strength is NONE');
assert(res10.riskFactors.some((f) => f.type === 'COLLECT_REQUEST'), 'Flags money deduction risk');

console.log('\n=============================================================');
console.log('ALL 10 TESTS IN THE PAYMENT ANALYZER MATRIX PASSED CLEANLY! ✓');
console.log('=============================================================');
