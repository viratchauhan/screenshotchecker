import { classifyScreenshot } from '../screenshotClassifier';
import { extractEntities } from '../entityExtractor';
import { extractClaim } from '../claimExtractor';
import { extractRequestedAction } from '../actionExtractor';
import { analyzeFinancialContent } from '../financialAnalyzer';
import { evaluateContextualRisk } from '../contextualRiskEngine';
import { scanLinks } from '../linkScanner';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

console.log('--- RUNNING SEMANTIC INTELLIGENCE TESTS ---');

// TEST A: Genuine Bank Credit SMS
console.log('\n[Test A] Genuine Bank Credit SMS:');
const textA = 'INR 25,000.00 credited to A/c XX4928 on 22-Aug-2026 10:14 AM by UPI transfer. From: RAJESH SHARMA (rajesh@okhdfcbank). UPI Ref: 982103482189. Avl Bal: INR 1,42,850.00. - HDFC Bank';
const catA = classifyScreenshot(textA);
const entA = extractEntities(textA);
const claimA = extractClaim(textA, catA.category, entA);
const actionA = extractRequestedAction(textA, entA);
const finA = analyzeFinancialContent(textA, catA.category, entA);
const riskA = evaluateContextualRisk(catA.category, entA, claimA, actionA, finA, []);

assert(catA.category === 'BANKING', `Classified as BANKING (got: ${catA.category})`);
assert(claimA.claimType === 'MONEY_CREDITED', `Claim event is MONEY_CREDITED (got: ${claimA.claimType})`);
assert(claimA.amount?.value === 25000, `Extracted credited amount is 25000 (got: ${claimA.amount?.value})`);
assert(entA.organizations.includes('HDFC Bank') || entA.organizations.includes('HDFC'), 'Identified HDFC institution');
assert(entA.upiIds.includes('rajesh@okhdfcbank'), 'Extracted UPI ID');
assert(actionA.actionType === 'DO_NOTHING', `Action is DO_NOTHING (got: ${actionA.actionType})`);
assert(riskA.isPhishingPattern === false, 'Phishing is false');
assert(riskA.isUnverifiedFinancialClaim === true, 'Flagged as unverified financial claim (requires banking portal verification)');

// TEST B: Phishing Bank SMS
console.log('\n[Test B] Urgent Bank Phishing SMS:');
const textB = '🔴 CHASE ALERT 🔴 Your Chase Account ending 4928 has been temporarily SUSPENDED due to unauthorized access. IMMEDIATE ACTION REQUIRED within 24 hours. Verify your account now: http://192.168.1.99/chase-auth. Enter your password and OTP code.';
const catB = classifyScreenshot(textB);
const entB = extractEntities(textB);
const claimB = extractClaim(textB, catB.category, entB);
const actionB = extractRequestedAction(textB, entB);
const finB = analyzeFinancialContent(textB, catB.category, entB);
const linksB = scanLinks(textB);
const riskB = evaluateContextualRisk(catB.category, entB, claimB, actionB, finB, linksB.findings);

assert(catB.category === 'SECURITY', `Classified as SECURITY (got: ${catB.category})`);
assert(claimB.claimType === 'ACCOUNT_LOCKED', `Claim is ACCOUNT_LOCKED (got: ${claimB.claimType})`);
assert(claimB.timePressure?.includes('24 hours') || claimB.timePressure?.includes('Immediate'), `Detected time pressure: ${claimB.timePressure}`);
assert(
  actionB.actionType === 'LOGIN' || actionB.actionType === 'CLICK_LINK' || actionB.actionType === 'SHARE_OTP',
  `Action is credential/link extraction (got: ${actionB.actionType})`
);
assert(riskB.isPhishingPattern === true, 'Identified High-Risk Phishing pattern (Chase impersonation + Urgency + IP Link + Credential action)');

// TEST C: Inconsistent Payment Slip
console.log('\n[Test C] Inconsistent Payment Slip:');
const textC = 'Payment Successful ₹25,000 ... To: Karan Verma (karan@okhdfcbank) ... Amount Paid: ₹2,500 ... UPI Ref No: 982103482100';
const catC = classifyScreenshot(textC);
const entC = extractEntities(textC);
const claimC = extractClaim(textC, catC.category, entC);
const actionC = extractRequestedAction(textC, entC);
const finC = analyzeFinancialContent(textC, catC.category, entC);
const riskC = evaluateContextualRisk(catC.category, entC, claimC, actionC, finC, []);

assert(catC.category === 'PAYMENT', `Classified as PAYMENT (got: ${catC.category})`);
assert(finC.hasAmountInconsistency === true, 'Detected internal amount discrepancy (₹25,000 vs ₹2,500)');
assert(finC.amountInconsistencyNote !== undefined, 'Financial inconsistency note recorded');

// TEST D: Advance-Fee Lottery Scam
console.log('\n[Test D] Advance-Fee Lottery Scam:');
const textD = '🎉 CONGRATULATIONS! YOU WON $10,000 🎉 Send $50 processing fee via Apple Gift Card or call +1 (800) 555-0199 within 24 hours. Claim code: WIN-99281-LOTTO';
const catD = classifyScreenshot(textD);
const entD = extractEntities(textD);
const claimD = extractClaim(textD, catD.category, entD);
const actionD = extractRequestedAction(textD, entD);
const finD = analyzeFinancialContent(textD, catD.category, entD);
const riskD = evaluateContextualRisk(catD.category, entD, claimD, actionD, finD, []);

assert(claimD.claimType === 'PRIZE_WON', `Claim is PRIZE_WON (got: ${claimD.claimType})`);
assert(actionD.actionType === 'MAKE_PAYMENT', `Action is MAKE_PAYMENT (got: ${actionD.actionType})`);
assert(riskD.isAdvanceFeeScam === true, 'Identified Advance-Fee Scam (Prize + Upfront Fee)');

// TEST E: Clean E-Commerce Order Confirmation
console.log('\n[Test E] Clean E-Commerce Order:');
const textE = 'Amazon Order Confirmed! Order #112-90218-4920. Total: $149.99. Arriving tomorrow by 8 PM.';
const catE = classifyScreenshot(textE);
const entE = extractEntities(textE);
const claimE = extractClaim(textE, catE.category, entE);
const actionE = extractRequestedAction(textE, entE);
const finE = analyzeFinancialContent(textE, catE.category, entE);
const riskE = evaluateContextualRisk(catE.category, entE, claimE, actionE, finE, []);

assert(catE.category === 'COMMERCE', `Classified as COMMERCE (got: ${catE.category})`);
assert(claimE.claimType === 'ORDER_PLACED', `Claim is ORDER_PLACED (got: ${claimE.claimType})`);
assert(entE.organizations.includes('Amazon'), 'Identified Amazon platform');
assert(actionE.actionType === 'DO_NOTHING', 'Action is DO_NOTHING');
assert(riskE.isPhishingPattern === false && riskE.isAdvanceFeeScam === false, 'Clean order - no scam patterns');

console.log('\nALL 5 TEST CASES PASSED SUCCESSFULLY!');
