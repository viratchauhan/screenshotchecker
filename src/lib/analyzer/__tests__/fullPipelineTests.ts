import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeFraudWithMockLLM } from '../../ai/mockFraudAnalyzer';
import { REFERENCE_SCAM_DATASET } from '../dataset/fraudKnowledgeBase';
import { routeContent } from '../contentRouter';

for (const text of [
  'My first job interview is tomorrow. Please review my resume.',
  'The package was delivered. Thank you for the update.',
  'HMRC published its annual report. We discussed tax refunds in class.',
  'Hi Mum, see you at dinner. My new phone takes great photos.',
  'I am writing a review of a crypto book from the library.',
  'Our school is teaching children about digital arrest scams. Never transfer money to strangers.',
  'A new unfamiliar message asking for payment. It might be a scam; please investigate.',
]) test(`unmatched text stays unverifiable: ${text.slice(0,35)}`, async () => {
  const r = await analyzeFraudWithMockLLM(text);
  assert.equal(r.classification, 'unverifiable');
  assert.equal(r.verdict, 'INSUFFICIENT_EVIDENCE');
  assert.equal(r.matched_pattern_id, undefined);
  assert.deepEqual(r.scam_categories, []);
  assert.match(r.summary, /No reliable match/);
  assert.match(r.recommendation, /virat@screenshotchecker\.com/);
  assert.ok(r.summary.includes(`${REFERENCE_SCAM_DATASET.length} reference patterns`));
  assert.ok(!r.summary.includes('2000'));
  for (const signal of r.signals) assert.match(signal.evidence, /alone does not establish fraud/);
});
test('exact references match, but changed meaning cannot borrow their narrative', async () => {
  const ref = REFERENCE_SCAM_DATASET[0];
  const exact = await analyzeFraudWithMockLLM(ref.originalMessage);
  assert.equal(exact.matched_pattern_id, ref.id);
  assert.match(exact.summary, /Extracted text/);
  const changed = await analyzeFraudWithMockLLM(`Do not follow this scam example: ${ref.originalMessage}`);
  assert.equal(changed.classification, 'unverifiable');
  assert.equal(changed.matched_pattern_id, undefined);
});
test('empty OCR and recognizable informational OTP remain distinct from unmatched text', async () => {
  assert.equal((await analyzeFraudWithMockLLM('')).classification,'ocr_error');
  assert.equal((await analyzeFraudWithMockLLM('894210 is your login OTP for HDFC NetBanking. Valid for 10 mins. Do not share your OTP with anyone.')).classification,'legitimate');
  assert.equal(routeContent('Online\nTyping...\nHey, are you free for a job?').contentType,'WHATSAPP');
});
