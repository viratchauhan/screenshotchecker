import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { PAYMENT_SAMPLE_PRESETS, SAMPLE_PRESETS } from '../../samples/sampleData.ts';
import { escapeHtml } from '../../utils/reportSafety.ts';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const layout = read('../../../components/PaymentToolLayout.astro');
const modal = read('../../../components/PaymentPreAnalysisModal.astro').replace(/^---[\s\S]*?---/, '');
const dashboard = read('../../../components/PaymentAnalysisDashboard.astro').replace(/^---[\s\S]*?---/, '');

test('payment sample buttons identify fictional examples without promising visual detection', () => {
  assert.deepEqual(PAYMENT_SAMPLE_PRESETS.map(preset => preset.id), ['fake_phonepe_sample', 'canara_bank_balance']);
  assert.deepEqual(PAYMENT_SAMPLE_PRESETS.map(preset => preset.name), [
    'Fictional PhonePe-style ₹500 receipt',
    'Fictional Canara-style balance screen',
  ]);
  for (const preset of PAYMENT_SAMPLE_PRESETS) {
    assert.equal(preset.generateDataUrl, SAMPLE_PRESETS.find(shared => shared.id === preset.id).generateDataUrl,
      'Payment examples retain their existing generator');
    assert.doesNotMatch(preset.name, /typography|icon inconsistency|genuine|legitimate|verified/i);
  }
  const button = layout.match(/<button\s+type="button"\s+data-sample-id=\{preset.id\}[\s\S]*?<\/button>/)?.[0];
  assert.ok(button, 'Existing sample button source is present');
  assert.match(button, /\{preset.name\}/);
  assert.doesNotMatch(button, /set:html|innerHTML/);
});

test('payment notice states text-rule limits and keeps the bilingual bank-confirmation warning', () => {
  const document = new JSDOM(modal).window.document;
  const dialog = document.querySelector('[role="dialog"]');
  assert.equal(dialog.getAttribute('aria-labelledby'), 'payment-modal-title');
  assert.match(dialog.textContent, /OCR\/text-rule clues cannot establish authenticity or bank settlement/);
  assert.match(dialog.textContent, /Fonts, icons and layout are not measured/);
  assert.match(dialog.textContent, /Financial screenshots are processed locally in your browser/);
  assert.doesNotMatch(dialog.textContent, /detects graphic tampering|100% Client-Side|never leave your device/);
  assert.match(dialog.textContent, /Do not release goods, services, refunds, or money based only on a payment screenshot/);
  assert.match(dialog.textContent, /केवल Payment Screenshot देखकर सामान, सेवा, Refund या पैसे जारी न करें/);
  const scrollRegion = document.getElementById('payment-modal-body');
  assert.equal(scrollRegion.tabIndex, 0, 'Scrollable warning remains reachable for keyboard reading');
  assert.equal(scrollRegion.getAttribute('aria-label'), 'Payment verification guidance');
  for (const id of ['close-payment-modal-btn', 'dismiss-payment-modal-btn', 'accept-payment-modal-btn']) {
    assert.equal(document.getElementById(id).tagName, 'BUTTON');
  }
});

// Run the production client script and actual modal/dashboard markup. Stub only
// browser image reading, sample raster output and the expensive OCR pipeline.
// jsdom loads no resources or analytics; fetch accepts only fixture data URLs.
function workflowFixture() {
  const sampleButtons = PAYMENT_SAMPLE_PRESETS.map(preset =>
    `<button type="button" class="payment-sample-btn" data-sample-id="${escapeHtml(preset.id)}">${escapeHtml(preset.name)}</button>`).join('');
  const dom = new JSDOM(`<header><a href="/" id="background-link">Home</a></header><main>
    <div id="drop-zone"><input id="file-input" type="file">
    <div id="upload-idle-state"><button id="browse-btn"></button></div><div id="upload-progress-state" class="hidden">
    <span id="progress-status-text"></span><div id="progress-bar-fill"></div></div></div>
    ${sampleButtons}${modal}${dashboard}</main><aside id="already-inert" inert></aside><footer>Footer</footer>`,
    { url: 'https://payment-fixture.invalid/', runScripts: 'outside-only' });
  const { window } = dom;
  const requests = [];
  const calls = [];
  const alerts = [];
  let fail = false;
  let analysisGate = null;
  const payload = '<img src=x onerror="alert(1)"><svg onload="alert(2)"> & "quoted"';
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.escapeHtml = escapeHtml;
  window.alert = message => alerts.push(message);
  window.console.error = () => {};
  window.FileReader = class {
    readAsDataURL(file) { this.onload({ target: { result: `data:image/png;base64,${Buffer.from(file.name).toString('base64')}` } }); }
  };
  window.fetch = async input => {
    assert.match(input, /^data:image\/png;base64,/);
    requests.push(input);
    return { blob: async () => new window.Blob(['synthetic'], { type: 'image/png' }) };
  };
  window.fixtureImport = async specifier => {
    if (specifier.endsWith('/sampleData')) return { PAYMENT_SAMPLE_PRESETS: PAYMENT_SAMPLE_PRESETS.map(preset => ({
      ...preset, generateDataUrl: async () => `data:image/png;base64,${Buffer.from(preset.id).toString('base64')}`,
    })) };
    assert.equal(specifier, '../lib/paymentAnalyzer/paymentPipeline');
    return { runPaymentAnalysis: async (file, dataUrl) => {
      calls.push({ file, dataUrl });
      if (analysisGate) await analysisGate;
      if (fail) throw new Error('Synthetic OCR failure');
      return {
        verdict: 'CAUTION', verdictLabel: payload, verdictDescription: payload, receiptTypeLabel: payload,
        riskScore: 25, dataUrl, imageInfo: { width: 600, height: 900, name: payload, sizeBytes: 100 },
        paymentProofStrength: 'WEAK', paymentProofExplanation: payload, paymentApp: payload,
        amount: payload, recipientName: payload, upiId: payload, bank: payload, utr: payload,
        transactionId: payload, date: payload, time: payload, rawOcrText: payload,
        riskFactors: [{ title: payload, severity: 'medium', explanation: payload, where: payload, why: payload }],
        whatWeFound: [payload],
      };
    } };
  };
  const sourceScript = layout.split('<script>')[1].split('</script>')[0];
  assert.equal((sourceScript.match(/await import\(/g) || []).length, 2, 'Explicit dynamic import boundary');
  const script = sourceScript.replace(/^\s*import .*;$/gm, '').replaceAll('await import(', 'await window.fixtureImport(');
  window.eval(stripTypeScriptTypes(script));
  return { dom, window, requests, calls, alerts, payload, setFail: value => { fail = value; },
    pauseAnalysis: () => { let resume; analysisGate = new Promise(resolve => { resume = resolve; }); return resume; } };
}

const settle = async () => { for (let i = 0; i < 4; i++) await new Promise(resolve => setImmediate(resolve)); };

test('notice close/cancel/backdrop/Escape and reopen preserve consent and scroll behavior', async () => {
  const { dom, window, calls, requests } = workflowFixture();
  try {
    const document = window.document;
    const dialog = document.getElementById('payment-pre-analysis-modal');
    const trigger = document.querySelector('.payment-sample-btn');
    for (const close of [
      () => document.getElementById('close-payment-modal-btn').click(),
      () => document.getElementById('dismiss-payment-modal-btn').click(),
      () => dialog.click(),
      () => window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' })),
    ]) {
      document.body.style.overflow = 'clip';
      trigger.focus();
      trigger.click();
      await settle();
      assert.equal(dialog.classList.contains('hidden'), false);
      assert.equal(document.body.style.overflow, 'hidden');
      assert.equal(document.activeElement.id, 'close-payment-modal-btn');
      assert.equal(trigger.hasAttribute('inert'), true);
      assert.equal(document.querySelector('header').hasAttribute('inert'), true);
      assert.equal(document.querySelector('main').hasAttribute('inert'), false, 'Dialog ancestors remain interactive');
      document.getElementById('payment-modal-title').click();
      assert.equal(dialog.classList.contains('hidden'), false, 'Clicking the dialog body must not cancel');
      close();
      assert.equal(dialog.classList.contains('hidden'), true);
      assert.equal(document.body.style.overflow, 'clip', 'Restore the original scroll state');
      assert.equal(document.activeElement, trigger);
      assert.equal(trigger.hasAttribute('inert'), false);
      assert.equal(document.querySelector('header').hasAttribute('inert'), false);
      assert.equal(document.getElementById('already-inert').hasAttribute('inert'), true);
      assert.equal(calls.length, 0, 'Dismissal must not start OCR');
    }
    assert.equal(requests.length, 4, 'Each repeated sample click still prepares its local image');
  } finally { dom.window.close(); }
});

test('notice contains forward/reverse Tab and recovers focus moved into the background', async () => {
  const { dom, window, calls } = workflowFixture();
  try {
    const document = window.document;
    const trigger = document.querySelectorAll('.payment-sample-btn')[1];
    trigger.focus();
    trigger.click();
    await settle();
    const tab = (shiftKey = false) => {
      const event = new window.KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, cancelable: true });
      document.activeElement.dispatchEvent(event);
      assert.equal(event.defaultPrevented, true);
      return document.activeElement.id;
    };
    assert.equal(document.activeElement.id, 'close-payment-modal-btn');
    assert.equal(tab(true), 'accept-payment-modal-btn');
    assert.equal(tab(), 'close-payment-modal-btn');
    assert.equal(tab(), 'payment-modal-body');
    assert.equal(tab(), 'dismiss-payment-modal-btn');
    assert.equal(tab(), 'accept-payment-modal-btn');
    assert.equal(tab(), 'close-payment-modal-btn');
    for (let index = 0; index < 6; index++) {
      tab(index % 2 === 0);
      assert.ok(document.getElementById('payment-pre-analysis-modal').contains(document.activeElement));
    }
    document.getElementById('dismiss-payment-modal-btn').disabled = true;
    document.getElementById('payment-modal-body').focus();
    assert.equal(tab(), 'accept-payment-modal-btn', 'Disabled controls are skipped');
    document.getElementById('background-link').focus();
    assert.equal(document.activeElement.id, 'close-payment-modal-btn', 'External focus is returned to the dialog');
    const escape = new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    document.activeElement.dispatchEvent(escape);
    assert.equal(escape.defaultPrevented, true);
    assert.equal(document.activeElement, trigger);
    assert.equal(calls.length, 0);
    const closedTab = new window.KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    trigger.dispatchEvent(closedTab);
    assert.equal(closedTab.defaultPrevented, false, 'Closed dialog does not intercept page navigation');
  } finally { dom.window.close(); }
});

test('notice accept moves focus through visible progress and results without retaining background locks', async () => {
  const { dom, window, calls, pauseAnalysis } = workflowFixture();
  try {
    const document = window.document;
    const browse = document.getElementById('browse-btn');
    const input = document.getElementById('file-input');
    browse.focus();
    Object.defineProperty(input, 'files', { value: [new window.File(['synthetic'], 'notice-fixture.png', { type: 'image/png' })] });
    input.dispatchEvent(new window.Event('change'));
    await settle();
    assert.equal(document.activeElement.id, 'close-payment-modal-btn');
    const resume = pauseAnalysis();
    document.getElementById('accept-payment-modal-btn').click();
    await settle();
    assert.equal(document.activeElement.id, 'progress-status-text');
    assert.equal(document.getElementById('upload-idle-state').classList.contains('hidden'), true);
    assert.equal(document.getElementById('upload-progress-state').classList.contains('hidden'), false);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].file.name, 'notice-fixture.png');
    assert.equal(document.querySelector('header').hasAttribute('inert'), false);
    assert.equal(document.body.style.overflow, '');
    resume();
    await settle();
    assert.equal(document.activeElement.id, 'payment-verdict-headline');
    assert.equal(document.activeElement.closest('.hidden'), null);
  } finally { dom.window.close(); }
});

test('failed analysis can retry another sample and render literal report text before reset', async () => {
  const { dom, window, calls, alerts, payload, setFail } = workflowFixture();
  try {
    const document = window.document;
    const element = id => document.getElementById(id);
    setFail(true);
    document.querySelectorAll('.payment-sample-btn')[0].click();
    await settle();
    element('accept-payment-modal-btn').click();
    await settle();
    assert.equal(calls.length, 1);
    assert.equal(calls[0].file.name, 'fake_phonepe_sample.png');
    assert.equal(element('payment-pre-analysis-modal').classList.contains('hidden'), true);
    assert.equal(document.body.style.overflow, '');
    assert.equal(element('upload-progress-state').classList.contains('hidden'), true);
    assert.equal(element('upload-idle-state').classList.contains('hidden'), false);
    assert.equal(element('payment-analysis-dashboard').classList.contains('hidden'), true);
    assert.match(alerts[0], /An error occurred/);
    assert.equal(document.activeElement.id, 'browse-btn', 'Failure returns focus to the visible retry control');

    setFail(false);
    document.querySelectorAll('.payment-sample-btn')[1].click();
    await settle();
    element('accept-payment-modal-btn').click();
    await settle();
    assert.equal(calls.length, 2);
    assert.equal(calls[1].file.name, 'canara_bank_balance.png');
    assert.notEqual(calls[1].dataUrl, calls[0].dataUrl, 'Retry uses the newly chosen example');
    assert.equal(element('payment-analysis-dashboard').classList.contains('hidden'), false);
    assert.equal(element('payment-risk-score').innerText, '25/100');
    assert.equal(element('field-recipient').innerText, payload);
    for (const id of ['payment-issues-list', 'payment-what-we-found-list']) {
      assert.ok(element(id).textContent.includes(payload));
      assert.equal(element(id).querySelectorAll('img,svg,script,[onerror],[onload]').length, 0, 'Report text stays inert');
    }
    element('payment-reset-btn').click();
    assert.equal(element('payment-analysis-dashboard').classList.contains('hidden'), true);
    element('accept-payment-modal-btn').click();
    await settle();
    assert.equal(calls.length, 2, 'Reset clears the pending image');
  } finally { dom.window.close(); }
});
