import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { setHandoffImage, getHandoffImage } from '../toolHandoff';

const key = 'sc_handoff_image';
const image = 'data:image/png;base64,aGVsbG8=';
function browser() {
  const dom = new JSDOM('', { url: 'https://example.test' });
  Object.defineProperty(globalThis, 'window', { configurable: true, value: dom.window });
  const messages: string[] = [];
  dom.window.alert = (message) => { messages.push(String(message)); };
  return { dom, messages };
}

test('successful transfer replaces the previous image', () => {
  const { dom, messages } = browser();
  assert.equal(setHandoffImage(image, 'ocr'), true);
  assert.equal(getHandoffImage()?.sourceTool, 'ocr');
  assert.equal(setHandoffImage(image, 'redactor'), true);
  assert.equal(getHandoffImage()?.sourceTool, 'redactor');
  assert.equal(messages.length, 0);
  dom.window.close();
});

test('quota failure clears old image and explains how to recover', () => {
  const { dom, messages } = browser();
  setHandoffImage(image, 'old');
  dom.window.Storage.prototype.setItem = () => { throw new Error('QuotaExceededError'); };
  assert.equal(setHandoffImage(image, 'new'), false);
  assert.equal(getHandoffImage(), null);
  assert.match(messages[0], /upload the image there/);
  dom.window.close();
});

test('blocked storage fails visibly without throwing', () => {
  const { dom, messages } = browser();
  Object.defineProperty(dom.window, 'sessionStorage', { get() { throw new Error('SecurityError'); } });
  assert.equal(setHandoffImage(image), false);
  assert.equal(getHandoffImage(), null);
  assert.equal(messages.length, 1);
  dom.window.close();
});

test('invalid, expired and future payloads are discarded', () => {
  const { dom } = browser();
  for (const stored of ['{', 'null', '{}', ...[
    { dataUrl: image, timestamp: Date.now() - 3600001 },
    { dataUrl: image, timestamp: Date.now() + 60000 },
    { dataUrl: 'https://example.test/tracker.png', timestamp: Date.now() },
    { dataUrl: image, timestamp: 'today' },
  ].map(JSON.stringify)]) {
    dom.window.sessionStorage.setItem(key, stored);
    assert.equal(getHandoffImage(), null);
    assert.equal(dom.window.sessionStorage.getItem(key), null);
  }
  dom.window.close();
});

test('every transfer action stops before navigation on failure', () => {
  const files = ['pages/index.astro', 'components/ToolLayout.astro', ...[
    'Redactor', 'OCR', 'Forensics', 'AIDetector',
  ].map(name => `components/workspaces/${name}Workspace.astro`)];
  let actions = 0;
  for (const file of files) {
    const source = readFileSync(new URL(`../../../${file}`, import.meta.url), 'utf8');
    const calls = source.match(/setHandoffImage\(currentDataUrl[^;]+;/g) || [];
    const guards = source.match(/if \(!setHandoffImage\(currentDataUrl[^;]+return;/g) || [];
    assert.equal(calls.length, guards.length, file);
    actions += calls.length;
  }
  assert.equal(actions, 14);
});
