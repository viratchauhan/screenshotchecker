import { strict as assert } from 'node:assert';
import { extractEntitiesDetailed } from '../entityExtractor';
import { extractPaymentEntities } from '../../paymentAnalyzer/paymentExtractor';
import { scanPrivacyRisks } from '../privacyScanner';

// Synthetic, authored OCR text fixtures, version 1. No private screenshot data.
// These regression cases do not measure OCR quality or real-world accuracy.
const amountCases: [string, string][] = [
  ['₹500.00', '₹500.00'], ['Amount: 500.00', '500.00'],
  ['Amount\n500.00', '500.00'], ['Amount paid: 500', '500'],
  ['Total: 1,234.50', '1,234.50'], ['Amount: 1,23,456.78', '1,23,456.78'],
  ['Payment successful\n500.00\nUTR: 423189271602', '500.00'],
  ['Transaction Successful\n30 Aug 2026, 11:17 AM\nReviewCraft Store\nreviewcraftstore@ybl\n500.00\nPayment for subscription\nUTR: 423189271602', '500.00'],
  ['Payment pending\n500.00', '500.00'], ['Payment failed\n500.00', '500.00'],
  ['Amount -500.00', 'Not detected'], ['Total -500.00', 'Not detected'],
  ['Amount: -500.00', 'Not detected'], ['Amount = -500.00', 'Not detected'],
  ['500.00', 'Not detected'], ['500', 'Not detected'],
  ['Payment successful\nUTR: 423189271602', 'Not detected'],
  ['Payment successful\nBalance\n500.00', 'Not detected'],
  ['Payment successful\nFee\n10.00', 'Not detected'],
  ['Payment successful\n500.00\n600.00', 'Not detected'],
  ['Amount: 500.00\nAmount: 600.00', 'Not detected'],
  ['Amount: 12,34.56', 'Not detected'], ['Amount: 500.001', 'Not detected'],
  ['Payment successful\n30.09.2026\n11:17', 'Not detected'],
];
for (const [text, expected] of amountCases) {
  assert.equal(extractPaymentEntities(text).primaryAmount, expected, text);
  const general = extractEntitiesDetailed(text).amounts;
  assert.equal(general[0]?.raw || 'Not detected', expected, `general: ${text}`);
  if (expected !== 'Not detected' && !text.includes('₹')) assert.equal(general[0].currency, 'Unknown');
}
for (const label of ['UTR', 'RRN', 'UPI Ref No', 'UPI Reference Number', 'Txn ID', 'Transaction ID', 'Reference No']) {
  for (const separator of [': ', '\n']) {
    const text = `${label}${separator}423189271602`;
    assert.equal(extractEntitiesDetailed(text).phoneNumbers.length, 0, text);
    assert.equal(scanPrivacyRisks(text).findings.filter(f => f.category === 'phone').length, 0, text);
    assert.ok(extractEntitiesDetailed(text).transactionIds.includes(text), text);
    assert.ok(scanPrivacyRisks(text).findings.some(f => f.category === 'order_id' && f.value.includes('423189271602')), `reference must stay redactable: ${text}`);
    const words = text.split(/\s+/).map((word, i) => ({ text: word, bbox: { x0: i * 100, y0: 0, x1: (i + 1) * 100, y1: 20 } }));
    const referenceFinding = scanPrivacyRisks(text, words).findings.find(f => f.category === 'order_id' && f.value.includes('423189271602'));
    assert.ok(referenceFinding?.bboxes?.some(box => box.x === (words.length - 1) * 100 && box.width === 100), `mask must cover reference digits: ${text}`);
  }
}
for (const phone of ['9876543210', '+1 202-555-0123', '+44 7700 900123']) {
  const text = `UTR: 423189271602\nPhone: ${phone}`;
  assert.ok(extractEntitiesDetailed(text).phoneNumbers.length, text);
  assert.ok(scanPrivacyRisks(text).findings.some(f => f.category === 'phone'), text);
}
assert.ok(scanPrivacyRisks('UTR: 423189271602').findings.some(f => f.category === 'order_id'), 'References remain redactable');
for (const reference of ['123456789012345678901', '12345678901234567890123456789012345']) {
  const text = `UTR: ${reference}`;
  assert.ok(scanPrivacyRisks(text).findings.some(f => f.value.includes(reference)), 'Long labelled reference stays redactable');
  assert.ok(extractEntitiesDetailed(text).transactionIds.includes(text), 'Long labelled reference stays an entity');
}
console.log('Payment-context fixtures passed (24 amount cases, 14 labelled-reference cases, 2 long-reference cases, 3 phone controls); not an accuracy benchmark');
