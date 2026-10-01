import { strict as assert } from 'node:assert';
import { LocalMultimodalObserver } from '../../ai/multimodalProvider';
import type { ImageInfo } from '../types';

// Authored synthetic text. URLs are inert strings: no destination is fetched.
const originalFetch = globalThis.fetch;
globalThis.fetch = async () => { throw new Error('Network access prohibited in evidence fixtures'); };
const observer = new LocalMultimodalObserver();
const image: ImageInfo = { width: 750, height: 900, aspectRatio: '5:6', sizeBytes: 10000, mimeType: 'image/png', name: 'synthetic.png' };
async function check(text: string, traceId: string, expected: boolean, url?: string, riskLevel = 'high', status: 'executed' | 'failed' | 'skipped' = 'executed') {
  const observation = await observer.observeImage(image, text);
  const tools = url ? [{ tool: 'url_analyzer' as const, status, summary: 'Synthetic URL indicator', data: { findings: [{ url, riskLevel }] } }] : [];
  const result = await observer.reasonOverEvidence(observation, tools, text);
  assert.equal(result.evidenceTraces.some(trace => trace.id === traceId), expected, text);
  if (expected) {
    assert.equal(result.authenticity.status, 'SUSPICIOUS');
    assert.ok(result.evidenceTraces.find(trace => trace.id === traceId)?.evidence.includes(text));
    assert.ok(result.evidenceTraces.find(trace => trace.id === traceId)?.limitation);
  } else {
    assert.notEqual(result.authenticity.status, 'SUSPICIOUS', `Benign/insufficient control: ${text}`);
  }
}
try {
  const bankTrace = 'trace_bank_credential_link';
  await check('CHASE ALERT: Your account is SUSPENDED. Unlock at http://192.0.2.1/auth to verify credentials.', bankTrace, true, 'http://192.0.2.1/auth', 'low');
  await check('Example Bank: account locked. Verify your account at https://verify.example/auth', bankTrace, true, 'https://verify.example/auth');
  await check('Example Bank: Your account is suspended. Open the official bank app to review it.', bankTrace, false);
  await check('Example Bank security advice: do not click https://verify.example/auth if a message says your account is locked. Verify through our app.', bankTrace, false, 'https://verify.example/auth');
  await check('Example Bank: account locked. Verify at https://bank.example/account', bankTrace, false, 'https://bank.example/account', 'low');
  await check('Example Bank: account locked. Verify using our app.', bankTrace, false, 'https://not-in-message.example');
  await check('Example Bank: your account is locked. Verify your account in the official app. An example phishing URL to report is https://verify.example/auth.', bankTrace, false, 'https://verify.example/auth');
  await check('Example Bank: your account is locked. Verify your account in the official app. Report https://verify.example/auth.', bankTrace, false, 'https://verify.example/auth');
  await check('Example Bank: account locked. Verify your account at https://verify.example/auth', bankTrace, false, 'https://verify.example/auth', 'high', 'failed');
  await check('Example Bank: account locked. Verify your account at https://verify.example/auth', bankTrace, false, 'https://verify.example/auth', 'high', 'skipped');
  const prizeTrace = 'trace_prize_fee_demand';
  await check('Congratulations! You won $10,000 in the International Lottery! Send $50 processing fee via Apple Gift Card to claim.', prizeTrace, true);
  await check('Prize winner: pay $12.50 processing fee to receive the prize.', prizeTrace, true);
  await check('You won the school raffle prize. Collect it at the school office. No fee required.', prizeTrace, false);
  await check('Lottery scam warning: never pay a processing fee to claim a prize.', prizeTrace, false);
  await check('Prize winner: pay no fee to claim your prize.', prizeTrace, false);
  await check('A gift card is enclosed for your birthday. Enjoy!', prizeTrace, false);
  await check('Please pay the $12 processing fee to receive your document.', prizeTrace, false);
  await check('Prize winner: you do not need to pay a processing fee to claim your prize.', prizeTrace, false);
  await check('Scam warning: criminals ask you to pay a processing fee to claim a prize. Report these messages.', prizeTrace, false);
  await check('Lottery warning: if asked to pay a fee to claim a prize, report it.', prizeTrace, false);
  await check('Prize winner: you are not required to pay a processing fee to claim your prize.', prizeTrace, false);
  await check('Prize winner: pay the shipping fee to receive the book you ordered. Collect your free prize at our office.', prizeTrace, false);
  await check('Prize winner: there is no need to pay a fee to receive your prize.', prizeTrace, false);
  await check('Beware: scammers tell you to pay a fee to receive your prize.', prizeTrace, false);
  await check('Fraudsters often ask you to pay a fee to receive your prize.', prizeTrace, false);
  await check('Prize winner: there is no obligation to pay a fee to receive your prize.', prizeTrace, false);
  console.log('Bank-link/prize-fee evidence regressions: 26 cases passed; network prohibited');
} finally {
  globalThis.fetch = originalFetch;
}
