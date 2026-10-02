import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const page = read('../../../pages/payment-screenshot-checker.astro');
const layout = read('../../../components/PaymentToolLayout.astro');
const related = read('../../../components/RelatedLinks.astro');
// Evaluate only this static object, not an Astro component or application script.
const props = runInNewContext(`(${page.match(/const props = (\{[\s\S]*?\n\});/)[1]})`);

const unsupported = /Google Sans patterns|typography mismatches|font alignment anomalies|inspects font families|known fake APK patterns|every genuine Indian UPI transfer|non-12-digit UTR|standard 12-digit numeric|verifying reference formatting and layout integrity/i;

test('payment landing copy describes OCR/text rules and independent credit checks', () => {
  assert.equal(props.heading, 'Fake UPI Screenshot Checker');
  assert.equal(props.howItWorksSteps.length, 4);
  assert.match(props.metaDescription, /OCR-based checks/);
  assert.match(props.metaDescription, /your own bank records/);
  assert.match(props.subheading, /cannot prove an image is genuine/);
  assert.match(props.howItWorksSteps[1].desc, /attempts to extract/);
  assert.match(props.howItWorksSteps[2].desc, /Fonts, icon positions and layout alignment are not measured/);
  assert.match(props.howItWorksSteps[3].desc, /No checker result confirms receipt of funds/);
  assert.doesNotMatch(JSON.stringify(props), unsupported);
});

test('FAQs preserve uncertainties and provider limits without universal reference claims', () => {
  assert.equal(props.faqs.length, 10);
  const answers = props.faqs.map(faq => faq.answer).join(' ');
  assert.match(answers, /does not measure fonts, icons or layout/);
  assert.match(answers, /text-based guess/);
  assert.match(answers, /Reference labels and formats can differ/);
  assert.match(answers, /digit count alone is not an authenticity test/);
  assert.match(answers, /without proving that the image was forged/);
  assert.match(answers, /capture time can differ from payment time/);
  assert.match(answers, /missing SMS or soundbox alert alone does not establish a fake/);
  assert.match(answers, /not calibrated accuracy or fraud probabilities/);
  assert.match(answers, /incomplete or unreadable check is not a clean result/);
  assert.match(props.limitations.join(' '), /STRONG VISUAL cannot establish that you received a payment/);
});

test('static review cards explain benign differences and source the verification guidance', () => {
  const staticLayout = layout.split('<script>')[0];
  assert.doesNotMatch(staticLayout, unsupported);
  assert.match(staticLayout, /Try synthetic payment examples/);
  assert.match(staticLayout, /fee or balance may legitimately differ/);
  assert.match(staticLayout, /amount-rule warning does not establish that pixels were edited/);
  assert.match(staticLayout, /A plausible reference can be copied/);
  assert.match(staticLayout, /https:\/\/support.google.com\/pay\/india\/answer\/16919844\?hl=en/);
  assert.match(staticLayout, /https:\/\/www.phonepe.com\/blog\/trust-and-safety\/heres-a-quick-guide-to-help-you-avoid-becoming-a-victim-of-fake-payment-screenshots-2\//);
});

test('shared payment recommendation describes only the implemented text review', () => {
  const card = related.match(/'payment-screenshot-checker': \{([\s\S]*?)\n  \},/)[1];
  assert.match(card, /Review UPI receipt text with OCR-based rules/);
  assert.match(card, /confirm the claimed payment in your own official records/);
  assert.match(card, /action: 'Review payment receipt text'/);
  assert.doesNotMatch(card, /PayPal|font alignment|layout|Verify payment receipt/);
});
