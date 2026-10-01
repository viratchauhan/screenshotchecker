import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { InvestigationAgent } from '../../ai/investigationAgent';
import { InvestigationToolRegistry } from '../../ai/investigationTools';
import { LocalMultimodalObserver } from '../../ai/multimodalProvider';
import { extractPaymentEntities } from '../../paymentAnalyzer/paymentExtractor';
import { classifyPaymentScreenshot } from '../../paymentAnalyzer/paymentClassifier';
import { evaluatePaymentVisualForensics } from '../../paymentAnalyzer/paymentVisualForensics';
import { computePaymentRisk } from '../../paymentAnalyzer/paymentRiskEngine';

const baseline = 'Transaction Successful\n30 Aug 2026, 11:17 AM\nPaid to\nExample Store\nexample.store@ybl\n₹500.00\nTransaction ID: TXN1JB2JWHL\nDebited from: State Bank of India - 2845\nUTR: 423189271602\nSecured by PhonePe';
const originalExecute = InvestigationToolRegistry.executeTool;
const originalImage = (globalThis as any).Image;
const originalFetch = globalThis.fetch;
let text = baseline;
let failedFinancial = false;
(globalThis as any).Image = class {
  naturalWidth = 600; naturalHeight = 900; width = 600; height = 900;
  onload?: () => void;
  set src(_value: string) { queueMicrotask(() => this.onload?.()); }
};
globalThis.fetch = async () => { throw new Error('No network permitted in synthetic agent test'); };
InvestigationToolRegistry.executeTool = async (tool, context) => {
  if (tool === 'ocr_layout') return { tool, status: 'executed', summary: 'Synthetic OCR boundary', data: { text, confidence: 90, words: [], lines: [] } };
  const output = await originalExecute.call(InvestigationToolRegistry, tool, context);
  return failedFinancial && tool === 'financial_auditor' ? { ...output, status: 'failed' } : output;
};
const observer = new LocalMultimodalObserver();
observer.planInvestigation = async () => ({ objective: 'Synthetic text-only payment evidence', steps: [
  { tool: 'ocr_layout', reason: 'Controlled text', priority: 'high' },
  { tool: 'financial_auditor', reason: 'Actual financial extraction', priority: 'high' },
  { tool: 'consistency_checker', reason: 'Actual consistency logic', priority: 'high' },
] });
const agent = new InvestigationAgent(observer);
const file = new File(['synthetic'], 'synthetic.png', { type: 'image/png' });
try {
  for (const amountText of [baseline, baseline.replace('₹500.00', '500.00')]) {
    text = amountText;
    const result = await agent.investigate(file, 'data:image/png;base64,synthetic');
    assert.equal(result.fraudAnalysis?.classification, 'unverifiable');
    assert.equal(result.authenticity.status, 'UNVERIFIABLE', 'No reference match must not erase executed financial uncertainty');
    assert.match(result.whatIsItClaiming, /500\.00/);
    assert.match(result.humanReadable.whatItClaims, /500\.00/);
    assert.match(result.humanReadable.canWeVerifyIt, /unverifiable|cannot/i);
    assert.doesNotMatch(result.humanReadable.whatWeThinkThisIs, /No reliable match/);
  }
  text = 'Lunch at noon. Bring the blue notebook.';
  assert.equal((await agent.investigate(file, 'data:image/png;base64,synthetic')).authenticity.status, 'INSUFFICIENT_EVIDENCE', 'Nonfinancial no-match fallback unchanged');
  text = baseline; failedFinancial = true;
  assert.equal((await agent.investigate(file, 'data:image/png;base64,synthetic')).authenticity.status, 'INSUFFICIENT_EVIDENCE', 'Failed tool data cannot establish preserved financial assessment');
  failedFinancial = false;
  text = baseline + '\nAmount paid: ₹50.00';
  assert.equal((await agent.investigate(file, 'data:image/png;base64,synthetic')).authenticity.status, 'INSUFFICIENT_EVIDENCE', 'Conflicting financial precedence is deliberately outside this narrow fix');

  const image = { name: 'synthetic.png', width: 600, height: 900, sizeBytes: 100, mimeType: 'image/png', aspectRatio: '2:3' };
  for (const [receipt, score] of [[baseline, 10], [baseline.replace('Paid to', 'Banking name:'), 25]] as const) {
    const extracted = extractPaymentEntities(receipt);
    const rules = evaluatePaymentVisualForensics(receipt, extracted);
    const result = computePaymentRisk(classifyPaymentScreenshot(receipt), extracted, rules, receipt, '', image);
    assert.equal(result.riskScore, score, 'Presentation correction must not recalibrate scores');
    assert.doesNotMatch(result.verdictDescription, /visual manipulation|visual variations|layout discrepancies/i);
    if (score === 25) {
      assert.match(rules.issues[0].explanation, /OCR.*Banking name/i);
      assert.match(rules.issues[0].explanation, /not (?:measured|assessed)/i);
      assert.doesNotMatch(rules.issues[0].explanation, /appears to use|font rendering from surrounding/i);
    }
  }
  const iconText = baseline.replace('State Bank of India', 'State 🏦 Bank of India');
  const iconRule = evaluatePaymentVisualForensics(iconText, extractPaymentEntities(iconText)).issues.find(issue => issue.id === 'icon_placement_in_bank_name');
  assert.match(iconRule?.explanation || '', /OCR contains a symbol/);
  assert.match(iconRule?.explanation || '', /not measured/);
  const badgeText = baseline.replace('Paid to\nExample Store', 'Banking name: Example Store ✓');
  const badgeRule = evaluatePaymentVisualForensics(badgeText, extractPaymentEntities(badgeText)).issues.find(issue => issue.id === 'floating_badge_placement');
  assert.match(badgeRule?.explanation || '', /OCR contains a checkmark/);
  assert.match(badgeRule?.explanation || '', /not assessed/);
  for (const component of ['PaymentAnalysisDashboard', 'AnalysisDashboard']) {
    const source = readFileSync(new URL(`../../../components/${component}.astro`, import.meta.url), 'utf8');
    assert.match(source, /not a probability/i);
    assert.match(source, /rule-based/i);
  }
  const paymentLayout = readFileSync(new URL('../../../components/PaymentToolLayout.astro', import.meta.url), 'utf8');
  assert.doesNotMatch(paymentLayout, /for typography flaws, altered amounts, and fake template artifacts/);
  assert.match(paymentLayout, /Fonts, layout and settled funds are not verified/);
  console.log('Q3 presentation/agent regressions passed; unchanged scores, synthetic image/OCR boundary, no live requests');
} finally {
  InvestigationToolRegistry.executeTool = originalExecute;
  (globalThis as any).Image = originalImage;
  globalThis.fetch = originalFetch;
}
