import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { escapeHtml } from '../reportSafety.ts';

const hostile = `"><img src=x onerror="alert(1)"><script>alert(2)</script> & ' \\`;
const inventory = {
  RedactorWorkspace: ['piiList'],
  ComparisonWorkspace: ['pillsList', 'cardsList'],
  AIDetectorWorkspace: ['c2paActionsList', 'c2paIngredientsList', 'c2paTechContent', 'whyList', 'syntheticList', 'editingList', 'limitationsList', 'debugPanel'],
};
for (const [file, targets] of Object.entries(inventory)) {
  test(`${file}: actual report templates preserve text and cannot inject elements or attributes`, () => {
    const source = readFileSync(new URL(`../../../../src/components/workspaces/${file}.astro`, import.meta.url), 'utf8');
    const assignments = [...source.matchAll(/(\w+)\.innerHTML\s*=\s*([\s\S]*?);\r?\n/g)].filter(([, target]) => targets.includes(target));
    assert.deepEqual([...new Set(assignments.map(([, target]) => target))].sort(), [...targets].sort());
    const root = new JSDOM('<main></main>').window.document.querySelector('main');
    for (const text of [hostile, 'PayPal £125 / USD 150 — O\'Brien & Sons <review> &lt;b&gt;']) {
      const findings = [{ label: text, value: text }];
      const res = { categoryCounts: { [text]: 2 }, regions: [{ index: 0, category: text, description: text, confidence: 90 }] };
      const c2pa = { actions: [{ action: text, softwareAgent: text, isAI: true }], ingredients: [{ title: text, format: text }], technicalDetails: { manifestCount: 1, activeLabel: text, signatureAlg: text }, activeManifest: { claimGenerator: text }, validation: { status: text, errors: [text], isValid: false, isTrusted: false }, present: true, ai: { aiState: text } };
      const diag = { imageDimensions: text, syntheticScore: 1, editingScore: 2, captureScore: 3, provenanceScore: 4 };
      const signal = { signal: text, strength: text, description: text, evidence: text };
      const report = { whyExplanation: [text], syntheticSignals: [signal], editingSignals: [signal], limitations: [text], modality: text, verdict: text, evidenceStrength: text };
      for (const [, target, expression] of assignments) {
        const render = new Function('findings', 'res', 'c2pa', 'diag', 'report', 'escapeHtml', `return (${expression});`);
        root.innerHTML = render(findings, res, c2pa, diag, report, escapeHtml);
        assert.equal(root.querySelectorAll('img,script,svg,iframe').length, 0, target);
        for (const el of root.querySelectorAll('*')) assert.ok([...el.attributes].every(a => !/^on/i.test(a.name)), target);
        if (/findings|res\.|c2pa\.|report\./.test(expression)) assert.ok(root.textContent.includes(text), target);
        if (target === 'piiList' && expression.includes('findings')) assert.equal(root.querySelector('button').dataset.idx, '0');
        if (target === 'cardsList' && expression.includes('res.regions')) {
          assert.equal(root.querySelector('button').dataset.regionIdx, '0');
          res.regions[0].index = hostile;
          root.innerHTML = render(findings, res, c2pa, diag, report, escapeHtml);
          assert.equal(root.querySelectorAll('img,script,[onerror]').length, 0);
          assert.equal(root.querySelector('button').dataset.regionIdx, hostile);
          res.regions[0].index = 0;
        }
      }
    }
  });
}
