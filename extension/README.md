# ScreenshotChecker Chrome extension

Right-click any image and choose **Check this image with ScreenshotChecker**, or right-click a page (or click the toolbar icon) to check a screenshot of what is on screen. The extension opens screenshotchecker.com in a new tab and hands the image to it inside the browser. Analysis runs in that tab, as it does on the website.

## How the hand-off works

1. `background.js` reads the right-clicked image. It tries a direct fetch first, then reads it from inside the page (this covers `blob:` images such as WhatsApp Web). For "Check a screenshot of this page" it uses `captureVisibleTab`.
2. It opens `https://screenshotchecker.com/?from=extension` and stores the image in `chrome.storage.session` under that tab's ID.
3. `content.js` (runs only on screenshotchecker.com) collects the image once and posts it to the page with `window.postMessage`. The pending copy is deleted when collected, when the tab closes, or after 5 minutes.

The image is not sent to any server by the extension.

## Permissions and why

| Permission | Why |
|---|---|
| `contextMenus` | The two right-click items |
| `activeTab` | Read the clicked image or capture the visible tab, only after you click |
| `scripting` | Read a `blob:` or same-site image from inside the page you clicked |
| `storage` | Hold the image briefly in session storage until the new tab collects it |
| `https://screenshotchecker.com/*` | Run `content.js` on the site to deliver the image |

No broad host permissions. Some websites do not allow images to be read; the site then asks the user to save and upload the image instead.

## Test locally

1. Open `chrome://extensions`, turn on **Developer mode**, click **Load unpacked** and pick this `extension` folder.
2. Right-click an image on any site and choose **Check this image with ScreenshotChecker**.
3. The homepage must be the version with the extension hand-off (this branch or later). Before release, test against the Cloudflare preview by temporarily changing `SITE` in `background.js` and the `matches`/`host_permissions` entries in `manifest.json` to the preview URL. Change them back before packaging.

## Publish to the Chrome Web Store

1. Zip the folder contents: `cd extension && zip -r ../screenshotchecker-extension.zip . -x README.md`
2. Register at https://chrome.google.com/webstore/devconsole (one-time developer fee) and upload the zip.
3. Store listing text, privacy answers and screenshots are in `STORE-LISTING.md`.
4. Bump `version` in `manifest.json` for every update.
