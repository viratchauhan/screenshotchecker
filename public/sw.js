/*
 * ScreenshotChecker service worker.
 *
 * Its only job is the Android "Share to ScreenshotChecker" target. A shared
 * image is received here, inside the browser, and handed to the homepage via
 * Cache Storage. It is never sent to a server. The homepage deletes the copy
 * as soon as it reads it. Pages are not cached, so the site never goes stale.
 */
const SHARE_CACHE = 'sc-share-v1';
const SHARE_KEY = '/__shared-image__';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'POST' || url.origin !== self.location.origin) return;
  if (url.pathname !== '/share-target/' && url.pathname !== '/share-target') return;

  event.respondWith((async () => {
    try {
      const form = await event.request.formData();
      const file = form.getAll('image').find((value) => value && typeof value === 'object' && 'type' in value && String(value.type).startsWith('image/'));
      const cache = await caches.open(SHARE_CACHE);
      await cache.delete(SHARE_KEY);
      if (!file) return Response.redirect('/?shared=none', 303);
      await cache.put(SHARE_KEY, new Response(file, {
        headers: { 'Content-Type': file.type, 'X-Shared-At': String(Date.now()) },
      }));
      return Response.redirect('/?shared=1', 303);
    } catch {
      return Response.redirect('/?shared=error', 303);
    }
  })());
});
