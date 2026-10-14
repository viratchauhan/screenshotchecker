/**
 * Shareable result card.
 *
 * The card never contains the user's screenshot, extracted text, names, links
 * or numbers from the image. It only shows the coarse verdict label and the
 * count of warning signs, so it is safe to post publicly.
 */

export type ShareTone = 'risk' | 'warning' | 'safe' | 'neutral';

export interface ShareSummary {
  label: string;
  tone: ShareTone;
  warningCount: number | null;
}

const SITE_URL = 'https://screenshotchecker.com/';
const SHARE_URL = `${SITE_URL}?utm_source=share&utm_medium=result_card`;

/** Keeps a short, printable verdict label (drops emoji and stray symbols). */
export function cleanLabel(raw: string): string {
  const text = raw.replace(/[^\p{L}\p{N}\s/&+-]/gu, ' ').replace(/[_\s]+/g, ' ').trim();
  return (text || 'Checked').slice(0, 32).toUpperCase();
}

export function toneFor(label: string): ShareTone {
  const l = label.toLowerCase();
  if (/(high|critical|risk|suspicious|contradicted|fraud)/.test(l)) return 'risk';
  if (/(unverifiable|insufficient|ocr error|caution|unknown)/.test(l)) return 'warning';
  if (/(consistent|supported|low)/.test(l)) return 'safe';
  return 'neutral';
}

/** Reads the verdict currently shown in the analysis dashboard. */
export function readDashboardSummary(doc: Document = document): ShareSummary {
  const label = cleanLabel(doc.getElementById('authenticity-status-badge')?.textContent || '');
  const fraudSection = doc.getElementById('fraud-analysis-section');
  const signals = doc.getElementById('fraud-signals-list');
  const warningCount = fraudSection && !fraudSection.classList.contains('hidden') && signals
    ? signals.children.length
    : null;
  return { label, tone: toneFor(label), warningCount };
}

export function shareText(summary: ShareSummary): string {
  const signs = summary.warningCount === null
    ? ''
    : summary.warningCount === 0
      ? ' No rule-based warning signs came up, which is not proof it is genuine.'
      : ` It flagged ${summary.warningCount} warning sign${summary.warningCount === 1 ? '' : 's'}.`;
  return `I checked a screenshot before trusting it.${signs} Free and private, it runs in your browser: ${SHARE_URL}`;
}

const TONE_COLORS: Record<ShareTone, { bg: string; fg: string }> = {
  risk: { bg: '#c64545', fg: '#ffffff' },
  warning: { bg: '#d4a017', fg: '#141413' },
  safe: { bg: '#5db872', fg: '#141413' },
  neutral: { bg: '#e8e0d2', fg: '#141413' },
};

/** Draws a 1200x630 PNG card (Open Graph size). */
export async function renderShareCard(summary: ShareSummary): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  try { await document.fonts?.ready; } catch { /* fall back to system fonts */ }

  const sans = 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif';
  const serif = '"Cormorant Garamond", Georgia, serif';

  ctx.fillStyle = '#faf9f5';
  ctx.fillRect(0, 0, 1200, 630);
  ctx.fillStyle = '#cc785c';
  ctx.fillRect(0, 0, 1200, 12);

  ctx.fillStyle = '#6c6a64';
  ctx.font = `600 26px ${sans}`;
  ctx.fillText('SCREENSHOTCHECKER', 80, 100);

  ctx.fillStyle = '#141413';
  ctx.font = `500 64px ${serif}`;
  ctx.fillText('I checked this screenshot', 80, 210);
  ctx.fillText('before trusting it.', 80, 285);

  const pill = TONE_COLORS[summary.tone];
  ctx.font = `700 34px ${sans}`;
  const pillText = summary.label;
  const pillWidth = Math.min(1040, ctx.measureText(pillText).width + 64);
  ctx.fillStyle = pill.bg;
  const r = 30, x = 80, y = 335, h = 64;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + pillWidth, y, x + pillWidth, y + h, r);
  ctx.arcTo(x + pillWidth, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + pillWidth, y, r);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = pill.fg;
  ctx.fillText(pillText, x + 32, y + 44);

  if (summary.warningCount !== null) {
    ctx.fillStyle = '#3d3d3a';
    ctx.font = `500 32px ${sans}`;
    const signs = summary.warningCount === 0
      ? 'No rule-based warning signs found'
      : `${summary.warningCount} warning sign${summary.warningCount === 1 ? '' : 's'} found`;
    ctx.fillText(signs, 80, 460);
  }

  ctx.fillStyle = '#6c6a64';
  ctx.font = `400 24px ${sans}`;
  ctx.fillText('Warning signs are clues, not proof. Always confirm at the source.', 80, 530);
  ctx.fillStyle = '#141413';
  ctx.font = `600 28px ${sans}`;
  ctx.fillText('Free, private, in your browser: screenshotchecker.com', 80, 580);

  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Encoding failed'))), 'image/png'));
}

/** Wires every [data-share-result] button on the page. */
export function bindShareResultButtons(): void {
  const track = (name: string, params: Record<string, unknown>) =>
    (window as unknown as { scTrack?: (n: string, p?: Record<string, unknown>) => void }).scTrack?.(name, params);

  document.querySelectorAll<HTMLButtonElement>('[data-share-result]').forEach((button) => {
    if (button.dataset.shareBound) return;
    button.dataset.shareBound = '1';
    const status = document.getElementById(button.getAttribute('aria-describedby') || '');
    button.addEventListener('click', async () => {
      button.disabled = true;
      const setStatus = (text: string) => { if (status) status.textContent = text; };
      try {
        const summary = readDashboardSummary();
        const text = shareText(summary);
        const blob = await renderShareCard(summary);
        const file = new File([blob], 'screenshotchecker-result.png', { type: 'image/png' });
        const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
        if (nav.share && nav.canShare?.({ files: [file] })) {
          await nav.share({ files: [file], text, title: 'ScreenshotChecker result' });
          track('result_shared', { share_method: 'native_file', result: summary.tone, warning_count: summary.warningCount ?? -1 });
          setStatus('Shared. The card shows only the verdict, never your screenshot.');
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'screenshotchecker-result.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
        try { await navigator.clipboard?.writeText(text); } catch { /* clipboard may be blocked */ }
        track('result_shared', { share_method: 'download_card', result: summary.tone, warning_count: summary.warningCount ?? -1 });
        setStatus('Result card downloaded and share text copied. The card shows only the verdict, never your screenshot.');
      } catch (error) {
        if ((error as DOMException)?.name === 'AbortError') { setStatus(''); return; }
        setStatus('Could not create the share card. Please try again.');
      } finally {
        button.disabled = false;
      }
    });
  });
}
