/*
 * Runs only on screenshotchecker.com. Hands an image chosen through the
 * extension to the page with window.postMessage (same tab, same origin).
 */
(() => {
  if (!new URL(location.href).searchParams.has('from')) return;
  let pending;
  let delivered = false;

  const deliver = () => {
    if (delivered || !pending) return;
    delivered = true;
    window.postMessage({ source: 'screenshotchecker-extension', type: pending.error ? 'error' : 'image', dataUrl: pending.dataUrl, method: pending.method, message: pending.error }, location.origin);
  };

  window.addEventListener('message', (event) => {
    if (event.source !== window || event.origin !== location.origin) return;
    if (event.data?.source === 'screenshotchecker-page' && event.data.type === 'ready') deliver();
  });

  chrome.runtime.sendMessage({ type: 'sc-take-pending' }, (response) => {
    if (chrome.runtime.lastError || !response) return;
    pending = response;
    window.postMessage({ source: 'screenshotchecker-extension', type: 'ping' }, location.origin);
  });
})();
