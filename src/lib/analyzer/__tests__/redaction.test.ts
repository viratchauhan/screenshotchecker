import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scanPrivacyRisks } from '../privacyScanner';
import { locateSensitiveText, suggestedMasks } from '../privacyLocations';
const words = (text: string) => text.split(' ').map((text, i) => ({ text, bbox: { x0: i * 40, y0: 10, x1: i * 40 + 35, y1: 30 } }));
test('complete multiword card and SSN matches retain raw locations without exposing values', () => {
  const text = '4111 1111 1111 1111 123-45-6789';
  const findings = scanPrivacyRisks(text, words(text)).findings;
  const card = findings.find(f => f.category === 'card')!;
  assert.equal(card.bboxes?.length, 4);
  assert.ok(card.value.includes('****'));
  assert.equal(findings.find(f => f.category === 'ssn')?.bboxes?.length, 1);
  assert.ok(suggestedMasks([card]).boxes.every(b => b.type === 'blackout'));
});
test('all repeated occurrences are masked and partial or missing matches remain unavailable', () => {
  assert.equal(locateSensitiveText('a@example.com', words('a@example.com then a@example.com')).length, 2);
  assert.equal(locateSensitiveText('1111 2222', words('1111')).length, 0);
  assert.equal(locateSensitiveText('1111 2222', [{ text: '1111' }, ...words('2222')]).length, 0);
  const finding = scanPrivacyRisks('a@example.com', []).findings[0];
  assert.match(suggestedMasks([finding]).message, /could not be located/);
});
