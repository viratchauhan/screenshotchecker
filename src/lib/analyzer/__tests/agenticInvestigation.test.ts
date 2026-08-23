import { InvestigationAgent } from '../../ai/investigationAgent';
import { LocalMultimodalObserver } from '../../ai/multimodalProvider';
import type { ImageInfo } from '../types';

async function runTests() {
  console.log('================================================================');
  console.log('   AGENTIC MULTIMODAL INVESTIGATION ARCHITECTURE TEST SUITE    ');
  console.log('================================================================\n');

  const observer = new LocalMultimodalObserver();
  let passed = 0;
  let failed = 0;

  // ----------------------------------------------------------------
  // 1. MANDATORY TEST: UNPAID TOLL ENFORCEMENT PHISHING SMS
  // ----------------------------------------------------------------
  console.log('[Test 1] MANDATORY TEST — Unpaid Toll Invoice Phishing SMS');
  const tollText = `Warm Reminder - You have unpaid toll invoices, please be sure to pay the balance by March 10, 2025. Otherwise, you will be charged an excessive fine. Please complete your payment on time. http://bit.ly/toll-pay. Failure to pay on time may also affect your DMV record and cause your driver's license to not be renewed.`;

  const dummyImageInfo: ImageInfo = {
    width: 750,
    height: 900,
    aspectRatio: '9:16',
    sizeBytes: 120000,
    mimeType: 'image/png',
    name: 'toll_sms.png',
  };

  const tollObservation = await observer.observeImage(dummyImageInfo, tollText);
  const tollPlan = await observer.planInvestigation(tollObservation);

  const mockToolOutputs = [
    {
      tool: 'url_analyzer' as any,
      status: 'executed' as any,
      summary: 'Shortened bit.ly URL detected',
      data: {
        totalUrls: 1,
        findings: [
          {
            url: 'http://bit.ly/toll-pay',
            hostname: 'bit.ly',
            protocol: 'http:',
            isShortener: true,
            riskLevel: 'high' as any,
            issues: ['URL uses a URL shortener domain (bit.ly) which hides the final web server destination.'],
          },
        ],
      },
    },
    {
      tool: 'financial_auditor' as any,
      status: 'executed' as any,
      summary: 'Payment demand detected',
      data: { financial: { financialType: 'PAYMENT_REQUEST', primaryAmount: undefined, status: 'Payment Demand' } },
    },
    {
      tool: 'channel_context' as any,
      status: 'executed' as any,
      summary: 'High urgency and threat signals detected',
      data: { isUrgent: true, isThreatPresent: true, isPaymentRequested: true },
    },
  ];

  const tollReasoning = await observer.reasonOverEvidence(tollObservation, mockToolOutputs, tollText);

  let test1Errors: string[] = [];
  if (!tollObservation.whatAmILookingAt.toLowerCase().includes('toll')) {
    test1Errors.push(`Observation did not capture toll context: "${tollObservation.whatAmILookingAt}"`);
  }
  if (!tollReasoning.whatIsItClaiming.toLowerCase().includes('toll') && !tollReasoning.whatIsItClaiming.toLowerCase().includes('license')) {
    test1Errors.push(`Claim did not identify toll/licensing consequence: "${tollReasoning.whatIsItClaiming}"`);
  }
  if (!tollReasoning.whatDoesItWantTheUserToDo.toLowerCase().includes('link') && !tollReasoning.whatDoesItWantTheUserToDo.toLowerCase().includes('pay')) {
    test1Errors.push(`Action directive did not capture payment/link navigation: "${tollReasoning.whatDoesItWantTheUserToDo}"`);
  }
  if (tollReasoning.authenticity.status !== 'SUSPICIOUS') {
    test1Errors.push(`Authenticity status expected SUSPICIOUS, got ${tollReasoning.authenticity.status}`);
  }
  if (tollReasoning.evidenceTraces.length === 0) {
    test1Errors.push('No structured evidence trace chain generated');
  } else {
    const trace = tollReasoning.evidenceTraces[0];
    if (!trace.observation || !trace.evidence || !trace.interpretation || !trace.risk || !trace.limitation || !trace.recommendation) {
      test1Errors.push('Evidence trace is missing required fields (Observation, Evidence, Interpretation, Risk, Limitation, Recommendation)');
    }
  }

  if (test1Errors.length === 0) {
    console.log('  ✓ Open-Ended Observation:', tollObservation.whatAmILookingAt);
    console.log('  ✓ Claim Identified:', tollReasoning.whatIsItClaiming);
    console.log('  ✓ Action Identified:', tollReasoning.whatDoesItWantTheUserToDo);
    console.log('  ✓ Authenticity Status:', tollReasoning.authenticity.status, `("${tollReasoning.authenticity.headline}")`);
    console.log('  ✓ Evidence-First Trace Generated:', tollReasoning.evidenceTraces[0].risk);
    console.log('  ✓ Recommendation:', tollReasoning.recommendations[0]);
    console.log('  ✓ PASS\n');
    passed++;
  } else {
    console.log('  ✗ FAIL:', test1Errors.join('; '), '\n');
    failed++;
  }

  // ----------------------------------------------------------------
  // 2. GENERALIZATION TEST: REAL BANK CREDIT NOTIFICATION
  // ----------------------------------------------------------------
  console.log('[Test 2] Real Bank Credit Notification');
  const creditText = 'INR 25,000.00 credited to A/c XX4928 on 22-Aug-2026 10:14 AM by UPI transfer. From: RAJESH SHARMA. Ref: 982103482189. Avl Bal: INR 1,42,850.00. - HDFC Bank';
  const creditObs = await observer.observeImage(dummyImageInfo, creditText);
  const creditReasoning = await observer.reasonOverEvidence(creditObs, [
    {
      tool: 'financial_auditor' as any,
      status: 'executed' as any,
      summary: 'Credit transaction',
      data: { financial: { financialType: 'CREDIT', primaryAmount: { raw: 'INR 25,000.00' }, status: 'Credited' } },
    },
  ], creditText);

  if (creditReasoning.authenticity.status === 'UNVERIFIABLE' && (creditReasoning.whatIsItClaiming.includes('INR 25,000.00') || creditReasoning.whatIsItClaiming.includes('credited'))) {
    console.log('  ✓ Observed:', creditObs.whatAmILookingAt);
    console.log('  ✓ Claim:', creditReasoning.whatIsItClaiming);
    console.log('  ✓ Authenticity:', creditReasoning.authenticity.status, '(Correctly states funds cannot be proven from screenshot alone)');
    console.log('  ✓ PASS\n');
    passed++;
  } else {
    console.log('  ✗ FAIL: Bank credit verification logic mismatch\n');
    failed++;
  }

  // ----------------------------------------------------------------
  // 3. GENERALIZATION TEST: INCONSISTENT RECEIPT (AMOUNT MISMATCH)
  // ----------------------------------------------------------------
  console.log('[Test 3] Fake Receipt with Internal Discrepancy');
  const fakeReceiptText = 'Payment Successful ₹25,000 ... To: Karan Verma ... Amount Paid: ₹2,500 ... UPI Ref: 982103482100';
  const fakeObs = await observer.observeImage(dummyImageInfo, fakeReceiptText);
  const fakeReasoning = await observer.reasonOverEvidence(fakeObs, [
    {
      tool: 'financial_auditor' as any,
      status: 'executed' as any,
      summary: 'Debit transaction',
      data: { financial: { financialType: 'DEBIT', primaryAmount: { raw: '₹25,000' }, status: 'Paid' } },
    },
    {
      tool: 'consistency_checker' as any,
      status: 'executed' as any,
      summary: 'Amount discrepancy',
      data: { isConsistent: false, issues: [{ title: 'Internal Amount Discrepancy', explanation: '₹25,000 header vs ₹2,500 details' }] },
    },
  ], fakeReceiptText);

  if (fakeReasoning.authenticity.status === 'CONTRADICTED') {
    console.log('  ✓ Discrepancy Caught:', fakeReasoning.authenticity.status);
    console.log('  ✓ Evidence Trace:', fakeReasoning.evidenceTraces[0]?.risk);
    console.log('  ✓ PASS\n');
    passed++;
  } else {
    console.log('  ✗ FAIL: Discrepancy not flagged as CONTRADICTED\n');
    failed++;
  }

  // ----------------------------------------------------------------
  // 4. GENERALIZATION TEST: BANK PHISHING SMS WITH IP LINK
  // ----------------------------------------------------------------
  console.log('[Test 4] Bank Phishing SMS with IP Link');
  const phishingText = 'CHASE ALERT: Your account is SUSPENDED. Action required. Unlock at http://192.168.1.99/auth to verify credentials.';
  const phishObs = await observer.observeImage(dummyImageInfo, phishingText);
  const phishReasoning = await observer.reasonOverEvidence(phishObs, [
    {
      tool: 'url_analyzer' as any,
      status: 'executed' as any,
      summary: 'Direct IP link detected',
      data: { totalUrls: 1, findings: [{ url: 'http://192.168.1.99/auth', hostname: '192.168.1.99', riskLevel: 'high' }] },
    },
  ], phishingText);

  if (phishReasoning.authenticity.status === 'SUSPICIOUS' && phishReasoning.whatDoesItWantTheUserToDo.includes('link')) {
    console.log('  ✓ Phishing Threat Caught:', phishReasoning.authenticity.status);
    console.log('  ✓ Action Directive:', phishReasoning.whatDoesItWantTheUserToDo);
    console.log('  ✓ PASS\n');
    passed++;
  } else {
    console.log('  ✗ FAIL: Phishing SMS not detected as SUSPICIOUS\n');
    failed++;
  }

  // ----------------------------------------------------------------
  // 5. GENERALIZATION TEST: NATURAL PHOTOGRAPH (NO CLAIMS)
  // ----------------------------------------------------------------
  console.log('[Test 5] Natural Photograph (Minimal Text)');
  const photoText = 'Pacific Coast Highway.';
  const photoObs = await observer.observeImage(dummyImageInfo, photoText);
  const photoReasoning = await observer.reasonOverEvidence(photoObs, [], photoText);

  if (photoReasoning.authenticity.status === 'INSUFFICIENT_EVIDENCE' && photoReasoning.whatDoesItWantTheUserToDo.includes('No action')) {
    console.log('  ✓ Natural Photo Handled:', photoReasoning.authenticity.status);
    console.log('  ✓ No false alarms triggered');
    console.log('  ✓ PASS\n');
    passed++;
  } else {
    console.log('  ✗ FAIL: Photograph triggered false positive claims\n');
    failed++;
  }

  // ----------------------------------------------------------------
  // 6. GENERALIZATION TEST: ADVANCE-FEE LOTTERY SCAM
  // ----------------------------------------------------------------
  console.log('[Test 6] Advance-Fee Prize / Gift Card Scam');
  const lotteryText = 'Congratulations! You won $10,000 in the International Lottery! Send $50 processing fee via Apple Gift Card to claim.';
  const lotteryObs = await observer.observeImage(dummyImageInfo, lotteryText);
  const lotteryReasoning = await observer.reasonOverEvidence(lotteryObs, [], lotteryText);

  if (lotteryReasoning.authenticity.status === 'SUSPICIOUS' && lotteryReasoning.whatDoesItWantTheUserToDo.includes('fee')) {
    console.log('  ✓ Advance-Fee Pattern Caught:', lotteryReasoning.authenticity.status);
    console.log('  ✓ Fee Demand Identified:', lotteryReasoning.whatDoesItWantTheUserToDo);
    console.log('  ✓ PASS\n');
    passed++;
  } else {
    console.log('  ✗ FAIL: Lottery fee demand not caught\n');
    failed++;
  }

  console.log('================================================================');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) process.exit(1);
}

runTests();
