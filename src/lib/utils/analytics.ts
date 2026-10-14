/**
 * Privacy-safe product analytics.
 *
 * Only coarse, non-content parameters are ever sent: the tool page, an event
 * name and a few enumerated labels. Never pass screenshot text, file names,
 * URLs the user checked, extracted entities or image data to `track`.
 */

type Primitive = string | number | boolean;

const ALLOWED_PARAMS = new Set([
  'tool',
  'method',
  'result',
  'warning_count',
  'share_method',
  'file_kind',
]);

/** Maps a pathname to a short, stable tool label. */
export function toolFromPath(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '').replace(/^\//, '');
  if (!clean) return 'home';
  return clean.split('/')[0].slice(0, 40);
}

/** Restricts parameters to allowed keys and short primitive values. */
export function sanitizeParams(params: Record<string, unknown>): Record<string, Primitive> {
  const out: Record<string, Primitive> = {};
  for (const [key, value] of Object.entries(params)) {
    if (!ALLOWED_PARAMS.has(key)) continue;
    if (typeof value === 'number' && Number.isFinite(value)) out[key] = Math.round(value);
    else if (typeof value === 'boolean') out[key] = value;
    else if (typeof value === 'string') out[key] = value.toLowerCase().replace(/[^a-z0-9_-]/g, '_').slice(0, 40);
  }
  return out;
}

/** Sends a GA4 event when gtag is present. Never throws. */
export function track(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  try {
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag !== 'function') return;
    const tool = typeof params.tool === 'string' ? params.tool : toolFromPath(window.location.pathname);
    gtag('event', eventName, sanitizeParams({ ...params, tool }));
  } catch {
    // Analytics must never break a tool.
  }
}

let globalListenersBound = false;

/**
 * Site-wide listeners that need no per-tool wiring:
 * - `screenshot_uploaded` when any file input, drop or image paste receives a file
 * - `download_requested` for buttons/links marked with data-track-download
 */
export function bindGlobalAnalytics(): void {
  if (typeof document === 'undefined' || globalListenersBound) return;
  globalListenersBound = true;
  // Lets inline page scripts report completions without importing this module.
  (window as unknown as { scTrack?: typeof track }).scTrack = track;

  const kindOf = (file: File | null | undefined) =>
    !file ? 'none' : file.type.startsWith('image/') ? 'image' : 'other';

  document.addEventListener('change', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === 'file' && target.files?.length) {
      track('screenshot_uploaded', { method: 'picker', file_kind: kindOf(target.files[0]) });
    }
  }, true);

  document.addEventListener('drop', (event) => {
    const file = event.dataTransfer?.files?.[0];
    if (file) track('screenshot_uploaded', { method: 'drop', file_kind: kindOf(file) });
  }, true);

  document.addEventListener('paste', (event) => {
    const items = event.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        track('screenshot_uploaded', { method: 'paste', file_kind: 'image' });
        return;
      }
    }
  }, true);

  document.addEventListener('click', (event) => {
    const el = event.target instanceof Element ? event.target.closest('[data-track-download]') : null;
    if (el) track('download_requested', { result: el.getAttribute('data-track-download') || 'file' });
  }, true);
}
