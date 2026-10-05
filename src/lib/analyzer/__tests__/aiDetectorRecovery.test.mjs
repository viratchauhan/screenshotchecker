import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { transformSync } from 'esbuild';
import { JSDOM } from 'jsdom';
import { imageProcessingScale } from '../imageLimits.ts';
import { recognizeWithCoordinates } from '../ocrCoordinates.ts';

const workspace = readFileSync(new URL('../../../components/workspaces/AIDetectorWorkspace.astro', import.meta.url), 'utf8');
const script = workspace.match(/<script>([\s\S]*?)<\/script>/)[1];
const transpile = (source) => transformSync(source.replace(/^import .*;\r?$/gm, '').replace(/^  import .*;\r?$/gm, ''), { loader: 'ts' }).code;
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
const deferred = () => { let resolve; let reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };

function harness({ dimensions = [512, 512], decodeFails = false, pipeline, handoff, fetch } = {}) {
  const dom = new JSDOM(workspace.replace(/^---[\s\S]*?---/, '').replace(/<script>[\s\S]*?<\/script>/, ''), { runScripts: 'outside-only' });
  const { window } = dom;
  window.Error = Error;
  let calls = 0;
  let renders = 0;
  window.Image = class {
    naturalWidth = dimensions[0]; naturalHeight = dimensions[1];
    set src(_value) { queueMicrotask(() => decodeFails ? this.onerror() : this.onload()); }
  };
  // Execute the real shared decode/limit helper in the same DOM environment.
  const decoder = readFileSync(new URL('../imageInfo.ts', import.meta.url), 'utf8').replace(/^export /gm, '');
  window.imageProcessingScale = imageProcessingScale;
  window.eval(`${transpile(decoder)}; window.decodeImage = loadImageFromDataUrl;`);
  window.dependencies = {
    loadImageFromDataUrl: window.decodeImage,
    runFullAIForensics: async (...args) => { calls++; return pipeline ? pipeline(...args) : {}; },
    escapeHtml: value => String(value),
    getHandoffImage: () => handoff,
    setHandoffImage: () => true,
  };
  if (fetch) window.fetch = fetch;
  window.eval(`const { loadImageFromDataUrl, runFullAIForensics, escapeHtml, getHandoffImage, setHandoffImage } = window.dependencies;
    ${transpile(script)}
    window.flow = { processImage, get active() { return activeRun; }, setRender(fn) { renderReport = fn; } };`);
  window.flow.setRender(() => { renders++; });
  const get = id => window.document.getElementById(`ai-${id}`);
  const visible = id => !get(id).classList.contains('hidden');
  const file = (bytes = 20) => new window.File([new Uint8Array(bytes)], 'synthetic.png', { type: 'image/png' });
  const paste = () => {
    const event = new window.Event('paste');
    Object.defineProperty(event, 'clipboardData', { value: { items: [{ type: 'image/png', getAsFile: () => file() }] } });
    window.document.dispatchEvent(event);
  };
  const drop = () => {
    const event = new window.Event('drop', { cancelable: true });
    Object.defineProperty(event, 'dataTransfer', { value: { files: [file()] } });
    get('upload-container').dispatchEvent(event);
  };
  return { window, get, visible, file, paste, drop, flow: window.flow, calls: () => calls, renders: () => renders, close: () => window.close() };
}

test('tiny compressed file above 4 MP rejects before forensic engines and recovers controls', async () => {
  const h = harness({ dimensions: [2100, 2100] });
  try {
    await h.flow.processImage(h.file(22615), 'synthetic');
    assert.equal(h.calls(), 0);
    assert.equal(h.renders(), 0);
    assert.match(h.get('error-message').textContent, /4 megapixels/);
    assert.ok(h.visible('error-message') && h.visible('upload-container'));
    assert.ok(!h.visible('loading-state') && !h.visible('active-dashboard'));
    assert.equal(h.get('file-input').disabled, false);
    assert.equal(h.flow.active, null);
    assert.equal(h.window.document.activeElement, h.get('browse-btn'));
  } finally { h.close(); }
});

test('valid image above 500 KB completes and the same file can be selected again', async () => {
  const h = harness();
  try {
    const file = h.file(788142);
    await h.flow.processImage(file);
    await h.flow.processImage(file);
    assert.equal(h.calls(), 2);
    assert.equal(h.renders(), 2);
    assert.ok(h.visible('active-dashboard') && h.visible('new-image-btn'));
    assert.ok(!h.visible('loading-state') && !h.visible('error-message'));
    assert.equal(h.get('file-input').value, '');
    assert.equal(h.get('file-input').disabled, false);
    assert.equal(h.window.document.activeElement, h.get('verdict-title'));
  } finally { h.close(); }
});

test('decode errors reject visibly without running the pipeline', async () => {
  const h = harness({ decodeFails: true });
  try {
    await h.flow.processImage(h.file(), 'broken');
    assert.match(h.get('error-message').textContent, /Failed to load image/);
    assert.equal(h.calls(), 0);
    assert.ok(h.visible('upload-container') && !h.visible('loading-state'));
  } finally { h.close(); }
});

test('FileReader errors recover instead of leaving a loader', async () => {
  const h = harness();
  try {
    h.window.FileReader = class { readAsDataURL() { queueMicrotask(() => this.onerror()); } };
    await h.flow.processImage(h.file());
    assert.match(h.get('error-message').textContent, /Could not read this file/);
    assert.equal(h.calls(), 0);
    assert.ok(h.visible('upload-container') && !h.visible('loading-state'));
  } finally { h.close(); }
});

test('pipeline failure is literal text, clears prior result and allows a successful retry', async () => {
  let fail = false;
  const h = harness({ pipeline: () => { if (fail) throw new Error('<img src=x onerror=alert(1)> engine unavailable'); return {}; } });
  try {
    await h.flow.processImage(h.file(), 'good');
    fail = true;
    await h.flow.processImage(h.file(), 'good');
    assert.equal(h.get('error-message').querySelectorAll('img').length, 0);
    assert.match(h.get('error-message').textContent, /engine unavailable/);
    assert.ok(!h.visible('active-dashboard') && h.visible('upload-container'));
    assert.equal(h.get('preview-img').getAttribute('src'), '');
    assert.equal(h.get('file-input').disabled, false);
    fail = false;
    await h.flow.processImage(h.file(), 'good');
    assert.ok(h.visible('active-dashboard') && !h.visible('error-message'));
  } finally { h.close(); }
});

test('render failure also restores the uploader', async () => {
  const h = harness();
  try {
    h.flow.setRender(() => { throw new Error('render failed'); });
    await h.flow.processImage(h.file(), 'good');
    assert.ok(h.visible('error-message') && h.visible('upload-container'));
    assert.ok(!h.visible('loading-state') && !h.visible('active-dashboard'));
  } finally { h.close(); }
});

test('repeat, paste and drop cannot overlap; Stop suppresses stale progress/results until engine settles', async () => {
  const pending = deferred();
  let progress;
  const h = harness({ pipeline: (_file, _img, options) => { progress = options.onProgress; progress('Reading text...'); return pending.promise; } });
  try {
    const first = h.flow.processImage(h.file(), 'good');
    await tick();
    assert.equal(h.get('loading-step').innerText, 'Reading text...');
    await h.flow.processImage(h.file(), 'other');
    h.paste(); h.drop();
    assert.equal(h.calls(), 1);
    h.get('cancel-btn').click();
    assert.ok(h.flow.active.signal.aborted);
    assert.equal(h.get('cancel-btn').disabled, true);
    progress('stale progress');
    assert.match(h.get('loading-step').innerText, /Stopping after the current step/);
    h.paste();
    assert.equal(h.calls(), 1);
    pending.resolve({});
    await first;
    assert.equal(h.renders(), 0);
    assert.ok(h.visible('upload-container') && !h.visible('loading-state') && !h.visible('error-message'));
    assert.equal(h.flow.active, null);
    await h.flow.processImage(h.file(), 'again');
    assert.equal(h.calls(), 2);
    assert.equal(h.renders(), 1);
  } finally { h.close(); }
});

test('Stop during file read never starts decoding or engines', async () => {
  const h = harness();
  try {
    const read = deferred();
    h.window.FileReader = class { readAsDataURL() { read.promise.then(() => { this.result = 'good'; this.onload(); }); } };
    const running = h.flow.processImage(h.file());
    h.get('cancel-btn').click();
    read.resolve();
    await running;
    assert.equal(h.calls(), 0);
    assert.ok(h.visible('upload-container') && !h.visible('loading-state'));
  } finally { h.close(); }
});

test('paste and drop each start a fresh idle run', async () => {
  const h = harness();
  try {
    for (const start of [h.paste, h.drop]) {
      start();
      for (let n = 0; h.flow.active && n < 50; n++) await tick();
      assert.equal(h.flow.active, null);
      assert.ok(h.visible('active-dashboard'));
    }
    assert.equal(h.calls(), 2);
  } finally { h.close(); }
});

test('a delayed cross-tool handoff cannot replace a newer user selection', async () => {
  const pending = deferred();
  const h = harness({ handoff: { dataUrl: 'handoff' }, fetch: () => pending.promise });
  try {
    await h.flow.processImage(h.file(), 'selected');
    pending.resolve({ blob: async () => new h.window.Blob(['fixture'], { type: 'image/png' }) });
    await tick();
    assert.equal(h.calls(), 1);
    assert.equal(h.renders(), 1);
  } finally { h.close(); }
});

test('text-free OCR and text recovered on the original retain existing fallback behavior', async () => {
  for (const recovered of ['', 'Recovered text']) {
    const calls = [];
    const worker = { recognize: async input => { calls.push(input); return { data: { text: input === 'original' ? recovered : '', blocks: [] } }; } };
    const result = await recognizeWithCoordinates(worker, 'processed', { scale: 2 }, 'original');
    assert.deepEqual(calls, ['processed', 'original']);
    assert.equal(result.data.text, recovered);
  }
});

test('pipeline validates before work, reports actual stage order and stops between stages', async () => {
  const source = readFileSync(new URL('../aiImageForensicsEngine.ts', import.meta.url), 'utf8').replace(/^export /gm, '');
  const steps = [];
  const provenance = { hasExif: false, isAISoftware: false, isEditingSoftware: false };
  const c2pa = { present: false, ai: { isAIGenerated: false }, validation: { isValid: false } };
  const texture = { smoothnessRatio: 0, colorVariance: 100, highFrequencyEnergy: 5 };
  const deps = {
    imageProcessingScale,
    analyzeC2PA: async () => { steps.push('c2pa'); return c2pa; },
    runClientOCR: async () => { steps.push('ocr'); return { text: '', confidence: 0, words: [], lines: [] }; },
    extractC2PAForensicSignals: () => ({ syntheticBonus: 0, editingBonus: 0, captureBonus: 0, signals: [] }),
    document: { createElement: () => ({ getContext: () => ({ drawImage() {} }) }) },
    metadata: async () => { steps.push('metadata'); return provenance; },
    texture: () => { steps.push('texture'); return texture; },
    ela: async () => { steps.push('ela'); return { anomaliesDetected: false, regionalVariance: 0, maxDisparity: 0 }; },
  };
  const run = new Function('deps', `const {imageProcessingScale, analyzeC2PA, runClientOCR, extractC2PAForensicSignals, document} = deps;
    ${transpile(source)}
    inspectProvenance = deps.metadata; analyzeTextureFrequency = deps.texture; computeELA = deps.ela;
    return runFullAIForensics;`)(deps);
  await assert.rejects(run({}, { naturalWidth: 2100, naturalHeight: 2100 }), /too large/);
  assert.deepEqual(steps, []);
  const stages = [];
  const result = await run({}, { naturalWidth: 512, naturalHeight: 512 }, { onProgress: message => { stages.push(message); steps.push('progress'); } });
  assert.deepEqual(steps, ['progress', 'c2pa', 'progress', 'metadata', 'progress', 'texture', 'progress', 'ela', 'progress', 'ocr', 'progress']);
  assert.equal(result.textAnalysis.textFound, false);
  assert.equal(stages.length, 6);
  for (let cancelAt = 0; cancelAt < stages.length; cancelAt++) {
    steps.length = 0;
    const controller = new AbortController();
    let stageIndex = 0;
    await assert.rejects(run({}, { naturalWidth: 512, naturalHeight: 512 }, {
      signal: controller.signal,
      onProgress: () => { if (stageIndex++ === cancelAt) controller.abort(); },
    }), { name: 'AbortError' });
    assert.equal(steps.length, cancelAt);
  }
});
