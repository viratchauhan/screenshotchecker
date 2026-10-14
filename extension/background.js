/*
 * ScreenshotChecker extension background worker.
 *
 * Flow: the user right-clicks an image (or the page) -> we read that one image
 * (or capture the visible tab) -> open screenshotchecker.com in a new tab ->
 * hand the image to that tab through chrome.storage.session and content.js.
 * The image is never sent to any server; ScreenshotChecker analyses it in the
 * browser. Pending images are deleted as soon as the site tab receives them.
 */

const SITE = 'https://screenshotchecker.com/?from=extension&utm_source=chrome_extension';
const MAX_BYTES = 10 * 1024 * 1024;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({ id: 'sc-check-image', title: 'Check this image with ScreenshotChecker', contexts: ['image'] });
    chrome.contextMenus.create({ id: 'sc-check-page', title: 'Check a screenshot of this page', contexts: ['page', 'selection', 'link'] });
  });
});

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function fetchImageDirect(srcUrl) {
  if (!/^https?:|^data:image\//i.test(srcUrl)) return null;
  const response = await fetch(srcUrl, { credentials: 'omit' });
  if (!response.ok) return null;
  const blob = await response.blob();
  if (!blob.type.startsWith('image/') || blob.size > MAX_BYTES) return null;
  return blobToDataUrl(blob);
}

/** Reads the image from inside the page (works for blob: URLs and same-site images). */
async function fetchImageInPage(tabId, frameId, srcUrl) {
  const [result] = await chrome.scripting.executeScript({
    target: { tabId, frameIds: [frameId ?? 0] },
    args: [srcUrl, MAX_BYTES],
    func: async (url, maxBytes) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        if (!blob.type.startsWith('image/') || blob.size > maxBytes) return null;
        return await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        });
      } catch {
        return null;
      }
    },
  });
  return result?.result || null;
}

async function openWithImage(dataUrl, method) {
  const tab = await chrome.tabs.create({ url: SITE });
  await chrome.storage.session.set({ [`pending:${tab.id}`]: { dataUrl, method, at: Date.now() } });
}

async function openWithError(message) {
  const tab = await chrome.tabs.create({ url: SITE });
  await chrome.storage.session.set({ [`pending:${tab.id}`]: { error: message, at: Date.now() } });
}

async function captureVisible(tab) {
  const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' });
  await openWithImage(dataUrl, 'page_capture');
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  try {
    if (info.menuItemId === 'sc-check-page' && tab) {
      await captureVisible(tab);
      return;
    }
    if (info.menuItemId === 'sc-check-image' && info.srcUrl) {
      let dataUrl = null;
      try { dataUrl = await fetchImageDirect(info.srcUrl); } catch { /* fall through */ }
      if (!dataUrl && tab?.id !== undefined) {
        try { dataUrl = await fetchImageInPage(tab.id, info.frameId, info.srcUrl); } catch { /* fall through */ }
      }
      if (dataUrl) await openWithImage(dataUrl, 'context_image');
      else await openWithError('This website does not let extensions read that image. Save the image (or take a screenshot) and upload it here instead.');
    }
  } catch {
    await openWithError('The image could not be opened. Save it and upload it here instead.');
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (tab && /^https?:/i.test(tab.url || '')) await captureVisible(tab);
    else await chrome.tabs.create({ url: SITE });
  } catch {
    await chrome.tabs.create({ url: SITE });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== 'sc-take-pending' || !sender.tab?.id) return false;
  const key = `pending:${sender.tab.id}`;
  chrome.storage.session.get(key).then(async (stored) => {
    await chrome.storage.session.remove(key);
    const pending = stored[key];
    sendResponse(pending && Date.now() - pending.at < 5 * 60 * 1000 ? pending : null);
  });
  return true;
});

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.session.remove(`pending:${tabId}`);
});
