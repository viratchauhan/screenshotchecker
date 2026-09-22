import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { escapeHtml, renderPrivacyFindings } from '../reportSafety.ts';

const payload = `</span><img data-injected src=x onerror="alert(1)"><svg data-injected onload="alert(2)"></svg><script>alert(3)</script> & ' " \\`;
function fixture(text) {
  return {
    fraudAnalysis: { signals: [{ type: text, evidence: text, severity: text }] },
    plan: { steps: [{ tool: text, reason: text }] },
    humanReadable: { whatWeFound: [text], whatConcernsUs: [text] },
    evidenceTraces: [{ severity: text, observation: text, evidence: [text], interpretation: text, risk: text, limitation: text, recommendation: text }],
    links: { findings: [{ url: text, riskLevel: text, issues: [text] }] },
    forensics: { compressionInconsistency: text, noiseVarianceScore: 0.4, notes: [text] },
    riskFactors: [{ title: text, severity: text, explanation: text, where: text, why: text }],
    whatWeFound: [text],
  };
}

function assertNoInjectedMarkup(root) {
  assert.equal(root.querySelectorAll('img, script, iframe, [data-injected]').length, 0);
  for (const element of root.querySelectorAll('*')) {
    assert.ok([...element.attributes].every(attribute => !/^on/i.test(attribute.name)), 'no inline event handler');
  }
}

// Evaluate the actual production HTML expressions, not copies of the templates.
// This catches a missing escape in any nested evidence/issue/payment template.
for (const file of ['src/pages/index.astro', 'src/components/ToolLayout.astro', 'src/components/PaymentToolLayout.astro']) {
  const source = readFileSync(new URL(`../../../../${file}`, import.meta.url), 'utf8');
  const assignments = [...source.matchAll(/(\w+)\.innerHTML\s*=\s*([\s\S]*?);\r?\n/g)];
  test(`${file}: report templates preserve hostile and ordinary text`, () => {
    assert.ok(assignments.length > 0, 'template inventory must not be empty');
    const root = new JSDOM('<!doctype html><main></main>').window.document.querySelector('main');
    for (const text of [payload, 'PayPal £125.00 / USD 150 — O\'Brien & Sons <review> &lt;b&gt;']) {
      const result = fixture(text);
      for (const [, target, expression] of assignments) {
        const render = new Function('result', 'escapeHtml', `return (${expression});`);
        root.innerHTML = render(result, escapeHtml);
        assertNoInjectedMarkup(root);
        if (expression.includes('result.')) {
          assert.ok(root.textContent.includes(text), `${target}: preserve original text without double encoding`);
        }
        if (target === 'linksList' && expression.includes('result.')) {
          assert.equal(root.querySelectorAll('a').length, 0, 'suspicious URLs stay non-clickable');
        }
      }
    }
  });
  if (!file.includes('PaymentToolLayout')) {
    test(`${file}: privacy controls use listeners instead of interpolated JavaScript`, () => {
      assert.ok(source.includes('renderPrivacyFindings(privacyList, result.privacy.findings,'));
      assert.ok(!source.includes('privacyList.innerHTML'));
      assert.ok(!source.includes('onclick="window.redactSpecificItem'));
    });
  }
}

test('redact button passes the exact original value and labels remain literal', () => {
  const root = new JSDOM('<!doctype html><main></main>').window.document.querySelector('main');
  const values = [payload, `O'Brien \\ " onclick="alert(4)`, '&quot; &amp; 日本語'];
  const calls = [];
  renderPrivacyFindings(root, values.map(value => ({ label: payload, value, severity: payload })), value => calls.push(value));
  assertNoInjectedMarkup(root);
  const buttons = [...root.querySelectorAll('button')];
  assert.equal(buttons.length, values.length);
  buttons.forEach(button => button.click());
  assert.deepEqual(calls, values);
  assert.deepEqual([...root.querySelectorAll('p')].map(node => node.textContent), values);

  renderPrivacyFindings(root, [], value => calls.push(value));
  assert.equal(root.querySelectorAll('button').length, 0);
  assert.ok(root.textContent.includes('No sensitive personal information'));
  assert.ok(!root.textContent.includes(payload));
});

test('HTML encoding preserves null and numeric display values', () => {
  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml(0), '0');
  assert.equal(escapeHtml(0.4), '0.4');
});
