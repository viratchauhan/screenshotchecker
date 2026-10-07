import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { classifyPaymentScreenshot } from '../paymentClassifier.ts';
import { extractPaymentEntities } from '../paymentExtractor.ts';
import { evaluatePaymentVisualForensics } from '../paymentVisualForensics.ts';
import { computePaymentRisk } from '../paymentRiskEngine.ts';
import { escapeHtml } from '../../utils/reportSafety.ts';

// Authored synthetic OCR fixtures v1. These exercise text rules, not OCR accuracy,
// authenticity or settlement. No private receipt or network service is used.
const image = { name: 'synthetic-balance-context.png', width: 600, height: 900,
  sizeBytes: 100, mimeType: 'image/png', aspectRatio: '2:3' };
const statuses = [
  ['Payment successful', 'PAYMENT_SUCCESS'],
  ['Transaction successful', 'PAYMENT_SUCCESS'],
  ['Transfer successful', 'PAYMENT_SUCCESS'],
  ['Payment pending', 'PAYMENT_PENDING'],
  ['Transaction pending', 'PAYMENT_PENDING'],
  ['Processing payment', 'PAYMENT_PENDING'],
  ['Payment in progress', 'PAYMENT_PENDING'],
  ['Payment failed', 'PAYMENT_FAILED'],
  ['Transaction failed', 'PAYMENT_FAILED'],
  ['Payment declined', 'PAYMENT_FAILED'],
  ['Transfer failed', 'PAYMENT_FAILED'],
];
const balances = ['Available balance: ₹1,250.00', 'Account balance\n₹1,250.00',
  'Avl Bal: ₹1,250.00', 'Your balance is ₹1,250.00', '₹1,250.00 Available Balance'];
const receipt = (status, balance, balanceFirst = false) => [status,
  ...(balanceFirst ? [balance] : []), '₹500.00', 'Paid to Example Shop',
  'UTR: 423189271602', ...(balanceFirst ? [] : [balance])].join('\n');
function report(text) {
  const extracted = extractPaymentEntities(text);
  return computePaymentRisk(classifyPaymentScreenshot(text), extracted,
    evaluatePaymentVisualForensics(text, extracted), text, '', image);
}

test('explicit transfer states survive balance fields in either order without a false amount conflict', () => {
  for (const [status, expected] of statuses) for (const balance of balances) for (const first of [false, true]) {
    const text = receipt(status, balance, first);
    const result = report(text);
    assert.equal(result.receiptType, expected, `${status}; ${balance}; balanceFirst=${first}`);
    assert.equal(result.amount, '₹500.00');
    assert.ok(result.secondaryAmounts.includes('₹1,250.00'), 'Balance remains visible as another extracted amount');
    assert.equal(result.riskFactors.some(factor => factor.type === 'AMOUNT_MISMATCH'), false);
    assert.notEqual(result.verdict, 'NO_PAYMENT_PROOF');
    assert.match(result.paymentProofExplanation, /cannot prove funds cleared/);
    assert.equal(result.verificationStatus, 'CANNOT_VERIFY_ACTUAL_BANK_RECEIPT');
    if (expected === 'PAYMENT_FAILED') assert.equal(result.paymentProofStrength, 'NONE');
    if (expected === 'PAYMENT_PENDING') assert.equal(result.paymentProofStrength, 'WEAK');
  }
});

test('balance-only and ambiguous balance messages retain the no-payment-proof result', () => {
  for (const text of [
    'Canara Bank UPI\nBank balance fetched successfully\n₹3,884.63',
    ...balances,
    'Balance check unsuccessful\nAvailable balance ₹1,250.00',
    'Check balance\nWaiting for bank\n₹1,250.00',
    'Account balance ₹1,250.00\nUPI transaction ID: 423189271602',
    'Available balance ₹1,250.00\nPayment help\nContact support@example.invalid',
  ]) {
    const result = report(text);
    assert.equal(result.receiptType, 'BANK_BALANCE', text);
    assert.equal(result.verdict, 'NO_PAYMENT_PROOF');
    assert.equal(result.paymentProofStrength, 'NONE');
    assert.notEqual(result.amount, 'Not detected');
  }
});

test('balance-only values are not invented payment amounts, and true conflicting payment values remain flagged', () => {
  for (const [status, expected] of statuses) {
    const result = report(`${status}\nAvailable balance: ₹1,250.00\nUTR: 423189271602`);
    assert.equal(result.receiptType, expected);
    assert.equal(result.amount, 'Not detected');
    if (expected === 'PAYMENT_SUCCESS') {
      assert.equal(result.paymentProofStrength, 'WEAK', 'A balance value cannot strengthen payment proof');
      assert.equal(classifyPaymentScreenshot(`${status}\nPaid to Example Shop\nUTR: 423189271602\nAvailable balance: ₹1,250.00`).paymentProofStrength, 'WEAK');
    }
  }
  for (const [status, expected] of statuses) {
    for (const inquiry of ['Balance check unsuccessful', 'Check balance\nWaiting for bank', 'Balance inquiry under processing']) {
      const result = report(receipt(status, `Available balance ₹1,250.00\n${inquiry}`));
      assert.equal(result.receiptType, expected, `Explicit ${status} must outrank inquiry: ${inquiry}`);
    }
  }
  for (const text of [
    'Payment successful\n500.00\nAvailable balance ₹1,250.00',
    'Available balance ₹1,250.00\nPayment pending\nAmount: 500.00',
  ]) {
    assert.equal(report(text).amount, '500.00', 'Currency-less payment amount stays currency-less beside a marked balance');
  }
  for (const text of [
    'Payment successful\nAmount paid: ₹500.00\nDebited amount: ₹5,000.00\nAvailable balance: ₹9,000.00',
    'Payment successful\nAvailable balance: ₹500.00\nAmount paid: ₹500.00\nDebited amount: ₹5,000.00',
    'Payment successful\n₹500.00\n₹5,000.00',
    'Payment successful\nAvailable balance: ₹9,000.00 | Amount paid: ₹500.00 | Debited amount: ₹5,000.00',
  ]) {
    const result = report(text);
    const conflict = result.riskFactors.find(factor => factor.type === 'AMOUNT_MISMATCH');
    assert.ok(conflict, 'Unrelated balance field must not suppress payment discrepancy');
    assert.deepEqual(new Set(conflict.valuesFound), new Set(['₹500', '₹5000']));
  }
  assert.equal(classifyPaymentScreenshot('Payment successful\nPayment failed\nAvailable balance ₹900').receiptType, 'PAYMENT_FAILED');
  assert.equal(classifyPaymentScreenshot('Payment successful\nPayment pending\nAvailable balance ₹900').receiptType, 'PAYMENT_PENDING');
  for (const [text, expected] of [
    ['Payment successful\nTransaction unsuccessful\n₹500', 'PAYMENT_FAILED'],
    ['Payment successful\nWaiting for bank\n₹500', 'PAYMENT_PENDING'],
    ['Payment pending\nUnsuccessful\n₹500', 'PAYMENT_FAILED'],
    ['Payment successful\nUnder processing\n₹500', 'PAYMENT_PENDING'],
    ['Payment unsuccessful\nAvailable balance ₹900', 'PAYMENT_FAILED'],
    ['Payment successful\nAvailable balance ₹900\nPayment unsuccessful', 'PAYMENT_FAILED'],
    ['Payment successful\nBalance check unsuccessful\nPayment unsuccessful\nAvailable balance ₹900', 'PAYMENT_FAILED'],
    ['Payment successful | Balance check unsuccessful\n₹500\nAvailable balance ₹900', 'PAYMENT_SUCCESS'],
    ['Payment successful\nCheck balance | Payment unsuccessful\nAvailable balance ₹900', 'PAYMENT_FAILED'],
  ]) assert.equal(classifyPaymentScreenshot(text).receiptType, expected, text);
  assert.equal(classifyPaymentScreenshot('Payment Request\nRequesting ₹500\nApprove request').receiptType, 'COLLECT_REQUEST');
  assert.equal(classifyPaymentScreenshot('Lunch at noon, bring a notebook.').receiptType, 'NOT_PAYMENT');
  assert.equal(classifyPaymentScreenshot('').receiptType, 'UNKNOWN');
});

test('production dashboard renders successive actual classification results and preserves uncertainty', () => {
  const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
  const layout = read('../../../components/PaymentToolLayout.astro');
  const markup = read('../../../components/PaymentAnalysisDashboard.astro').replace(/^---[\s\S]*?---/, '');
  const dom = new JSDOM(markup, { runScripts: 'outside-only', url: 'https://payment-fixture.invalid/' });
  try {
    const { window } = dom;
    window.escapeHtml = escapeHtml;
    window.fetch = () => { throw new Error('No network permitted'); };
    const source = layout.split('<script>')[1].split('</script>')[0].replace(/^\s*import .*;$/gm, '');
    window.eval(stripTypeScriptTypes(source) + '\nwindow.renderFixture = renderPaymentDashboard;');
    for (const text of [receipt('Payment successful', balances[0]), receipt('Payment pending', balances[0]),
      receipt('Payment failed', balances[0]), balances[0], receipt('Payment successful', balances[0], true)]) {
      const result = report(text);
      window.renderFixture(result);
      const element = id => window.document.getElementById(id);
      assert.equal(element('payment-receipt-type-pill').innerText, result.receiptTypeLabel);
      assert.equal(element('field-amount').innerText, result.amount);
      assert.equal(element('payment-proof-desc').innerText, result.paymentProofExplanation);
      assert.equal(element('payment-verdict-headline').innerText, result.verdictLabel);
      assert.ok(element('payment-what-we-found-list').textContent.includes(result.receiptTypeLabel));
      assert.doesNotMatch(element('payment-issues-list').textContent, /Internal Amount Discrepancy/);
    }
  } finally { dom.window.close(); }
});
