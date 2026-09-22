import type { PrivacyFinding } from '../analyzer/types';

/** For text inside HTML templates only, never JavaScript, CSS, or URL contexts. */
export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!);
}

/** Keep original finding values in closures, never inline event handlers. */
export function renderPrivacyFindings(
  container: HTMLElement,
  findings: PrivacyFinding[],
  onRedact: (value: string) => void,
): void {
  const doc = container.ownerDocument;
  container.replaceChildren();
  if (!findings.length) {
    const empty = doc.createElement('p');
    empty.className = 'text-xs text-muted italic bg-canvas p-3 rounded-lg border border-hairline';
    empty.textContent = 'No sensitive personal information (emails, phones, credentials) detected.';
    container.append(empty);
    return;
  }
  for (const finding of findings) {
    const row = doc.createElement('div');
    row.className = 'bg-canvas border border-hairline rounded-lg p-3 flex items-center justify-between gap-3 text-xs';
    const content = doc.createElement('div');
    content.className = 'space-y-0.5';
    const heading = doc.createElement('div');
    heading.className = 'flex items-center gap-2';
    const label = doc.createElement('span');
    label.className = 'font-medium text-ink';
    label.textContent = finding.label;
    const severity = doc.createElement('span');
    severity.className = `${finding.severity === 'high' ? 'text-error bg-error/10 border-error/20' : 'text-warning bg-warning/10 border-warning/20'} border px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold`;
    severity.textContent = finding.severity;
    heading.append(label, severity);
    const value = doc.createElement('p');
    value.className = 'font-mono text-body truncate max-w-md';
    value.textContent = finding.value;
    content.append(heading, value);
    const button = doc.createElement('button');
    button.type = 'button';
    button.className = 'btn-secondary text-[11px] h-7 px-2.5 shrink-0';
    button.textContent = 'Hide / Redact';
    button.addEventListener('click', () => onRedact(finding.value));
    row.append(content, button);
    container.append(row);
  }
}
