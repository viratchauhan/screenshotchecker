import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { renderMetadataSummary, renderMetadataGroups } from '../metadataRenderer.ts';

const markup = '<img src="invalid" onerror="alert(1)"><script>alert(2)</script><b>literal</b> & "quoted"';
const fixture = {
  hasExif: true,
  originalBlobSize: 100,
  camera: { make: markup, model: '<svg onload="alert(3)">' },
  software: markup,
  dateTime: '</span><iframe srcdoc="unexpected"></iframe>',
  gps: { lat: 51.5074, lng: -0.1278 },
  tags: [
    { group: markup, tag: markup, value: markup, description: markup },
    { group: '__proto__', tag: 'Software', value: '&lt;b&gt;not decoded&lt;/b&gt;', description: '' },
    { group: 'constructor', tag: 'Model', value: 'Canon & Nikon — 日本語', description: '' },
    { group: '', tag: 'Empty', value: '', description: '' },
  ],
};

function container() {
  const dom = new JSDOM('<!doctype html><main></main>');
  return dom.window.document.querySelector('main');
}

for (const render of [renderMetadataSummary, renderMetadataGroups]) {
  test(`${render.name}: metadata remains literal text, never markup`, () => {
    const root = container();
    render(root, fixture);
    assert.equal(root.querySelectorAll('img, script, svg, iframe, b').length, 0);
    assert.equal(root.querySelectorAll('[onerror], [onload], [srcdoc]').length, 0);
    assert.ok(root.textContent.includes(markup));
    assert.ok(root.textContent.includes('&lt;b&gt;not decoded&lt;/b&gt;'));
    assert.ok(root.textContent.includes('Canon & Nikon — 日本語'));
    const values = [...root.querySelectorAll('span')].map(node => node.textContent);
    assert.ok(values.includes(markup), 'tag value must be preserved exactly');
  });

  test(`${render.name}: a new scan removes all old metadata`, () => {
    const root = container();
    render(root, fixture);
    render(root, { hasExif: false, tags: [], originalBlobSize: 0 });
    assert.ok(root.textContent.includes('No '));
    assert.ok(!root.textContent.includes(markup));
    assert.equal(root.querySelectorAll('details').length, 0);
  });
}

test('summary preserves normal camera fields, coordinate precision, and expandable tags', () => {
  const root = container();
  renderMetadataSummary(root, { ...fixture, camera: { make: 'Canon', model: 'EOS' } });
  assert.ok(root.textContent.includes('Canon EOS'));
  assert.ok(root.textContent.includes('51.5074, -0.1278'));
  assert.equal(root.querySelector('summary').textContent, 'View all 4 metadata tags');
  assert.ok(root.textContent.includes(fixture.dateTime));
});

test('groups accept prototype-like names and provide the General fallback', () => {
  const root = container();
  renderMetadataGroups(root, fixture);
  assert.equal(root.children.length, 4);
  for (const group of ['__proto__', 'constructor', 'General']) {
    assert.ok(root.textContent.includes(`${group} Information (1)`));
  }
});

test('all three metadata surfaces use the tested renderer without old HTML sinks', () => {
  for (const [file, call, obsolete] of [
    ['src/pages/index.astro', 'renderMetadataSummary(metaContainer, result.metadata)', 'metaContainer.innerHTML'],
    ['src/components/ToolLayout.astro', 'renderMetadataSummary(metaContainer, result.metadata)', 'metaContainer.innerHTML'],
    ['src/components/workspaces/MetadataWorkspace.astro', 'renderMetadataGroups(tablesContainer, meta)', 'tablesContainer.innerHTML'],
  ]) {
    const source = readFileSync(new URL(`../../../../${file}`, import.meta.url), 'utf8');
    assert.ok(source.includes(call), file);
    assert.ok(!source.includes(obsolete), file);
  }
});
