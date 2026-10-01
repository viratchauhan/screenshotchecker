import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { transformSync } from 'esbuild';
import { bindRedactionExport } from '../redactionExport';
import { renderRedactedImage } from '../../analyzer/redactor';

const image = { naturalWidth: 20, naturalHeight: 10 } as HTMLImageElement;
const mask = { id: 'synthetic', x: 2.1, y: 1.1, width: 4.1, height: 3.1, type: 'blackout' as const };
const flush = () => new Promise(resolve => setImmediate(resolve));

async function withCanvas(run: (env: any) => Promise<void>) {
  const dom = new JSDOM('<body><button>Export</button><p role="status"></p></body>');
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const createUrl = URL.createObjectURL;
  const revokeUrl = URL.revokeObjectURL;
  const previousFetch = globalThis.fetch;
  const previousTimeout = globalThis.setTimeout;
  const env = { mode: 'success', hold: false, pending: [] as Function[],
    encodes: 0, fills: [] as any[], downloads: [] as any[], urls: [] as Blob[],
    revokes: [] as string[], cleanup: [] as Function[], requests: 0, completed: 0 };
  const document = dom.window.document;
  const create = document.createElement.bind(document);
  document.createElement = ((name: string) => name !== 'canvas' ? create(name) : {
    width: 0, height: 0,
    getContext() { return {
      fillStyle: '', drawImage() {},
      fillRect(...rect: any[]) { env.fills.push([this.fillStyle, ...rect]); },
    }; },
    toBlob(callback: (blob: Blob | null) => void, format: string) {
      env.encodes++;
      const finish = () => callback(env.mode === 'null' ? null : new Blob(['masked-pixels'], { type: format }));
      if (env.hold) env.pending.push(finish); else queueMicrotask(finish);
    },
    toDataURL() {
      if (env.mode === 'dataUrl') throw new Error('synthetic private encoder details');
      return 'data:image/png;base64,bWFza2Vk';
    },
  }) as typeof document.createElement;
  dom.window.HTMLAnchorElement.prototype.click = function () {
    if (env.mode === 'click') throw new Error('synthetic download failure');
    env.downloads.push({ href: this.href, filename: this.download, attached: this.isConnected });
  };
  Object.defineProperty(globalThis, 'document', { configurable: true, value: document });
  URL.createObjectURL = (blob: Blob) => { env.urls.push(blob); return 'blob:synthetic-export'; };
  URL.revokeObjectURL = url => { env.revokes.push(url); };
  globalThis.fetch = (() => { env.requests++; throw new Error('Unexpected network request'); }) as typeof fetch;
  globalThis.setTimeout = ((callback: Function, delay?: number, ...args: any[]) => {
    if (delay === 60_000) { env.cleanup.push(callback); return 0; }
    return previousTimeout(callback as any, delay, ...args);
  }) as typeof setTimeout;
  try {
    await run({ ...env, env, document, button: document.querySelector('button')!, status: document.querySelector('p')! });
    assert.equal(env.requests, 0);
  } finally {
    URL.createObjectURL = createUrl; URL.revokeObjectURL = revokeUrl;
    globalThis.fetch = previousFetch; globalThis.setTimeout = previousTimeout;
    if (previousDocument) Object.defineProperty(globalThis, 'document', previousDocument);
    else Reflect.deleteProperty(globalThis, 'document');
    dom.window.close();
  }
}

test('renderer rejects asynchronous null-blob and data-URL encoding failures', async () => {
  await withCanvas(async ({ env }) => {
    env.mode = 'null';
    await assert.rejects(renderRedactedImage(image, [mask]), /Failed to create/);
    env.mode = 'dataUrl';
    await assert.rejects(renderRedactedImage(image, [mask]), /encoder details/);
    env.mode = 'success';
    const result = await renderRedactedImage(image, [mask]);
    assert.equal(await result.blob.text(), 'masked-pixels');
    assert.deepEqual(env.fills[0], ['#141413', 2, 1, 5, 4]);
  });
});

test('export failure is visible, retains state, never falls back to original and can retry', async () => {
  await withCanvas(async ({ env, button, status }) => {
    const state = { image, boxes: [mask] };
    bindRedactionExport(button, status, () => state, 'redacted', () => env.completed++);
    env.mode = 'null'; button.click(); await flush();
    assert.match(status.textContent, /Export failed/);
    assert.equal(button.disabled, false);
    assert.equal(env.urls.length, 0);
    assert.equal(env.completed, 0);
    assert.deepEqual(state.boxes, [mask]);
    env.mode = 'dataUrl'; button.click(); await flush();
    assert.match(status.textContent, /Export failed/);
    assert.doesNotMatch(status.textContent, /private encoder/);
    env.mode = 'success'; button.click(); await flush();
    assert.equal(env.downloads.length, 1);
    assert.equal(env.downloads[0].attached, true);
    assert.match(env.downloads[0].filename, /^redacted-\d+\.png$/);
    assert.equal(await env.urls[0].text(), 'masked-pixels');
    assert.match(status.textContent, /Download requested/);
    assert.doesNotMatch(status.textContent, /saved|completed/i);
    assert.equal(env.completed, 1);
    assert.equal(env.revokes.length, 0);
    env.cleanup.forEach((callback: Function) => callback());
    assert.deepEqual(env.revokes, ['blob:synthetic-export']);
  });
});

test('repeated export clicks produce only one request while encoding', async () => {
  await withCanvas(async ({ env, button, status, document }) => {
    env.hold = true;
    bindRedactionExport(button, status, () => ({ image, boxes: [mask] }), 'redacted');
    button.click();
    button.dispatchEvent(new document.defaultView.Event('click'));
    assert.equal(env.encodes, 1);
    assert.equal(button.disabled, true);
    env.pending.shift()(); await flush();
    assert.equal(env.downloads.length, 1);
    assert.equal(button.disabled, false);
  });
});

for (const change of ['new image', 'edited masks', 'closed editor']) {
  test(`no obsolete export after ${change}`, async () => {
    await withCanvas(async ({ env, button, status }) => {
      env.hold = true;
      let state: any = { image, boxes: [{ ...mask }] };
      bindRedactionExport(button, status, () => state, 'redacted', () => env.completed++);
      button.click();
      if (change === 'new image') state.image = { ...image };
      if (change === 'edited masks') state.boxes[0].x = 8;
      if (change === 'closed editor') state = null;
      env.pending.shift()(); await flush();
      assert.equal(env.urls.length, 0);
      assert.equal(env.completed, 0);
      assert.equal(button.disabled, false);
      assert.match(status.textContent, /cancelled/);
    });
  });
}

test('download request errors release the URL, retain editor and permit retry', async () => {
  await withCanvas(async ({ env, button, status, document }) => {
    env.mode = 'click';
    bindRedactionExport(button, status, () => ({ image, boxes: [mask] }), 'redacted', () => env.completed++);
    button.click(); await flush();
    assert.equal(env.completed, 0);
    assert.equal(button.disabled, false);
    assert.match(status.textContent, /Export failed/);
    assert.equal(document.querySelectorAll('a').length, 0);
    env.cleanup.forEach((callback: Function) => callback());
    assert.deepEqual(env.revokes, ['blob:synthetic-export']);
  });
});

test('all discovered redaction surfaces use the guarded export and accessible status', () => {
  const surfaces = [
    ['src/components/workspaces/RedactorWorkspace.astro', 'redact-status'],
    ['src/components/ToolLayout.astro', 'redactor-status'],
    ['src/pages/index.astro', 'redactor-status'],
  ];
  const astroFiles = ['src/components', 'src/pages'].flatMap(directory =>
    readdirSync(directory, { recursive: true }).filter(file => file.endsWith('.astro')).map(file => `${directory}/${file}`));
  const discovered = astroFiles.filter(file => /<RedactorModal\b|id="redact-export-png"/.test(readFileSync(file, 'utf8')));
  assert.deepEqual(discovered.map(file => file.replace(/\\/g, '/')).sort(), surfaces.map(([file]) => file).sort(), 'every redaction exporter must be covered');
  for (const [file, status] of surfaces) {
    const source = readFileSync(file, 'utf8');
    assert.match(source, /import \{ bindRedactionExport \}/);
    assert.match(source, /bindRedactionExport\(/);
    assert.ok(source.includes(`document.getElementById('${status}')`));
    assert.doesNotMatch(source, /download = `redacted/);
  }
});

// Execute the actual host scan/reset/open functions, with only I/O boundaries
// replaced. This covers state upstream of getState, not just the export helper.
function hostFunctions(file: string, document: Document, button: HTMLButtonElement) {
  const source = readFileSync(file, 'utf8');
  function extractFunction(name: string) {
    const start = source.search(new RegExp(`  (?:async )?function ${name}\\(`));
    assert.ok(start >= 0, name);
    const end = source.indexOf('\n  }', start);
    return source.slice(start, end + 4);
  }
  const analysisStart = source.indexOf('  let analysisGeneration = 0;');
  const analysisEnd = source.indexOf('  function renderDashboard(');
  assert.ok(analysisStart >= 0 && analysisEnd > analysisStart);
  const analysis = source.slice(analysisStart, analysisEnd)
    .replace("await import('../lib/analyzer/pipeline')", 'await Promise.resolve({ runFullAnalysis: deps.runFullAnalysis })');
  const reset = source.match(/  document\.getElementById\('reset-analysis-btn'\)\?\.addEventListener\('click', \(\) => \{[\s\S]*?\n  \}\);/)?.[0];
  assert.ok(reset);
  const binding = source.match(/  bindRedactionExport\([\s\S]*?\n  \);/)?.[0];
  assert.ok(binding);
  const factory = `function makeHost(deps) {
    const { document, button, FileReader, Image, runFullAnalysis, bindRedactionExport, initialImage } = deps;
    const idleState = document.createElement('div'), progressState = document.createElement('div');
    const progressBarFill = document.createElement('div'), progressText = document.createElement('div');
    const dashboard = document.createElement('div'), dropZone = document.createElement('div');
    dashboard.scrollIntoView = dropZone.scrollIntoView = () => {};
    const exportRedactedBtn = button;
    const redactorModal = { open: true, classList: document.createElement('div').classList,
      close() { this.open = false; }, showModal() { this.open = true; } };
    const redactorCanvas = { width: 20, height: 10 };
    let currentFile = null, currentDataUrl = 'data:A', currentResult = { dataUrl: 'data:A' };
    let redactorImage = initialImage, redactionBoxes = [{ id: 'mask', x: 1, y: 1, width: 5, height: 5, type: 'blackout' }];
    let renderVersion = 0, redactorOpenGeneration = 0;
    const rendered = [], errors = [];
    const alert = message => errors.push(message);
    const console = { error() {} };
    const renderDashboard = result => rendered.push(result);
    const redrawRedactorCanvas = () => {};
    ${analysis}
    ${extractFunction('closeRedactor')}
    ${extractFunction('invalidateRedactor')}
    ${extractFunction('initRedactorModal')}
    ${reset}
    ${binding}
    return { processImageFile, initRedactorModal, closeRedactor, rendered, errors,
      mask() { redactionBoxes = [{ id: 'new-mask', x: 2, y: 2, width: 6, height: 6, type: 'blackout' }]; },
      state() { return { currentResult, currentDataUrl, redactorImage, redactionBoxes, open: redactorModal.open }; } };
  }`;
  const makeHost = new Function(`${transformSync(factory, { loader: 'ts' }).code}; return makeHost;`)();
  const readers: any[] = [], scans: any[] = [], decodes: any[] = [];
  class Reader {
    onload: any;
    readAsDataURL(file: any) { readers.push({ file, finish: () => this.onload({ target: { result: `data:${file.name}` } }) }); }
  }
  class Img {
    src = ''; naturalWidth = 20; naturalHeight = 10;
    decode() { return new Promise(resolve => decodes.push({ image: this, finish: resolve })); }
  }
  const resetButton = document.createElement('button'); resetButton.id = 'reset-analysis-btn'; document.body.appendChild(resetButton);
  document.querySelector('p')!.id = 'redactor-status';
  return { readers, scans, decodes, resetButton, host: makeHost({ document, button, FileReader: Reader, Image: Img,
    bindRedactionExport, initialImage: image, runFullAnalysis: (file: any, dataUrl: string, progress: Function) =>
      new Promise((resolve, reject) => scans.push({ file, dataUrl, progress, finish: () => resolve({ dataUrl }), fail: () => reject(new Error('old scan failure')) })) }) };
}

for (const file of ['src/pages/index.astro', 'src/components/ToolLayout.astro']) {
  test(`${file}: new scan closes old masked editor and cancels its pending export`, async () => {
    await withCanvas(async ({ env, document, button }) => {
      env.hold = true;
      const { host, readers, scans } = hostFunctions(file, document, button);
      button.click();
      assert.equal(env.encodes, 1);
      host.processImageFile({ name: 'B' });
      assert.equal(host.state().open, false);
      assert.equal(host.state().redactorImage, null);
      env.pending.shift()(); await flush();
      assert.equal(env.urls.length, 0);
      readers.shift().finish(); await flush();
      scans.shift().finish(); await flush();
      assert.equal(host.state().currentResult.dataUrl, 'data:B');
      assert.equal(host.state().open, false);
      button.click(); await flush();
      assert.equal(env.encodes, 1, 'hidden stale editor must not export old image without its masks');
    });
  });

  test(`${file}: late reader/analysis completions cannot replace new source or clear its masks`, async () => {
    await withCanvas(async ({ document, button }) => {
      const { host, readers, scans, decodes } = hostFunctions(file, document, button);
      host.processImageFile({ name: 'ignored-reader' });
      host.processImageFile({ name: 'old-analysis' });
      readers[0].finish(); await flush(); assert.equal(scans.length, 0);
      readers[1].finish(); await flush();
      host.processImageFile({ name: 'new-analysis' }); readers[2].finish(); await flush();
      scans[1].finish(); await flush();
      const opening = host.initRedactorModal(); decodes.shift().finish(); await opening;
      host.mask();
      scans[0].finish(); await flush();
      assert.equal(host.state().currentResult.dataUrl, 'data:new-analysis');
      assert.equal(host.state().open, true);
      assert.equal(host.state().redactorImage.src, 'data:new-analysis');
      assert.equal(host.state().redactionBoxes[0].id, 'new-mask');
      assert.equal(host.rendered.length, 1);
    });
  });

  test(`${file}: reset invalidates pending scan and late decode cannot reopen dismissed editor`, async () => {
    await withCanvas(async ({ document, button }) => {
      const { host, readers, scans, decodes, resetButton } = hostFunctions(file, document, button);
      const first = host.initRedactorModal(), second = host.initRedactorModal();
      host.closeRedactor();
      decodes.splice(0).forEach(pending => pending.finish()); await Promise.all([first, second]);
      assert.equal(host.state().open, false);
      host.processImageFile({ name: 'pending' }); readers[0].finish(); await flush();
      resetButton.click(); scans[0].finish(); await flush();
      assert.equal(host.state().currentResult, null);
      assert.equal(host.state().redactorImage, null);
      assert.equal(host.state().open, false);
      assert.equal(host.rendered.length, 0);
      for (const interruption of ['reset', 'new scan']) {
        host.processImageFile({ name: `fresh-${interruption}` }); readers.at(-1).finish(); await flush();
        scans.at(-1).finish(); await flush();
        const opening = host.initRedactorModal();
        if (interruption === 'reset') resetButton.click();
        else host.processImageFile({ name: 'replacement' });
        decodes.shift().finish(); await opening;
        assert.equal(host.state().open, false, interruption);
        assert.equal(host.state().redactorImage, null, interruption);
      }
    });
  });
}
