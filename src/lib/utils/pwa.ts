/**
 * Installable-app helpers: service worker registration and the Android
 * share target. Shared images stay in the browser's Cache Storage only until
 * the homepage reads them, then the copy is deleted.
 */

const SHARE_CACHE = 'sc-share-v1';
const SHARE_KEY = '/__shared-image__';
const MAX_SHARE_AGE_MS = 10 * 60 * 1000;

export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return;
  // Capture the install prompt early; a page may bind its button later.
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    (window as unknown as { __scInstallPrompt?: Event }).__scInstallPrompt = event;
    window.dispatchEvent(new Event('sc:installable'));
  });
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') return;
  const register = () => navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => { /* optional feature */ });
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}

/** Clears the ?shared= marker so a reload does not repeat the import. */
function clearShareParam(): void {
  const url = new URL(location.href);
  url.searchParams.delete('shared');
  history.replaceState(history.state, '', url.pathname + (url.search ? url.search : '') + url.hash);
}

export type SharedImageResult =
  | { status: 'none' }
  | { status: 'ok'; file: File }
  | { status: 'error'; message: string };

/**
 * Reads (and deletes) an image delivered by the share target.
 * Returns status 'none' when the page was not opened from a share.
 */
export async function takeSharedImage(): Promise<SharedImageResult> {
  const marker = new URL(location.href).searchParams.get('shared');
  if (!marker) return { status: 'none' };
  clearShareParam();
  if (marker === 'none') return { status: 'error', message: 'The shared item did not include an image. Share a screenshot or photo.' };
  if (marker !== '1' || !('caches' in window)) return { status: 'error', message: 'The shared image could not be opened. Please choose it with the upload button instead.' };
  try {
    const cache = await caches.open(SHARE_CACHE);
    const response = await cache.match(SHARE_KEY);
    await cache.delete(SHARE_KEY);
    if (!response) return { status: 'error', message: 'The shared image was no longer available. Please share it again.' };
    const sharedAt = Number(response.headers.get('X-Shared-At'));
    if (!Number.isFinite(sharedAt) || Date.now() - sharedAt > MAX_SHARE_AGE_MS) {
      return { status: 'error', message: 'The shared image expired. Please share it again.' };
    }
    const blob = await response.blob();
    if (!blob.type.startsWith('image/')) return { status: 'error', message: 'The shared file is not an image.' };
    const ext = blob.type.split('/')[1]?.replace('jpeg', 'jpg') || 'png';
    return { status: 'ok', file: new File([blob], `shared-screenshot.${ext}`, { type: blob.type }) };
  } catch {
    return { status: 'error', message: 'The shared image could not be opened. Please choose it with the upload button instead.' };
  }
}

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Shows `container` when the browser offers app installation (Android Chrome,
 * desktop Chrome/Edge) and wires `button` to the native install prompt.
 */
export function bindInstallPrompt(container: HTMLElement | null, button: HTMLButtonElement | null): void {
  if (!container || !button || typeof window === 'undefined') return;
  const holder = window as unknown as { __scInstallPrompt?: Event };
  let deferred: InstallPromptEvent | null = null;
  const capture = () => {
    if (!holder.__scInstallPrompt) return;
    deferred = holder.__scInstallPrompt as InstallPromptEvent;
    container.hidden = false;
  };
  capture();
  window.addEventListener('sc:installable', capture);
  window.addEventListener('appinstalled', () => {
    container.hidden = true;
    (window as unknown as { scTrack?: (n: string, p?: Record<string, unknown>) => void }).scTrack?.('app_installed');
  });
  button.addEventListener('click', async () => {
    if (!deferred) return;
    const prompt = deferred;
    deferred = null;
    holder.__scInstallPrompt = undefined;
    await prompt.prompt();
    const choice = await prompt.userChoice.catch(() => ({ outcome: 'dismissed' as const }));
    (window as unknown as { scTrack?: (n: string, p?: Record<string, unknown>) => void }).scTrack?.('install_prompt', { result: choice.outcome });
    container.hidden = true;
  });
}
