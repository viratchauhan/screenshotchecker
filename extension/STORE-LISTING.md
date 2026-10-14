# Chrome Web Store listing

**Name:** ScreenshotChecker: Is This Screenshot Real?

**Summary (132 chars max):**
Right-click any image to check it for signs of editing and scams. Free, private, runs in your browser. No signup.

**Category:** Tools (or Privacy & Security, if offered)

**Description:**

Got a screenshot of a chat, a payment or a social media post and not sure it is real? Right-click it and choose "Check this image with ScreenshotChecker".

ScreenshotChecker opens in a new tab and examines the image in your browser:
- reads the text with OCR and flags common scam patterns (urgency, payment or code requests, impersonation)
- shows metadata and editing clues such as error level analysis
- reviews Indian UPI payment receipt text with rule-based checks
- lists what it could not check

You can also right-click any page (or click the toolbar icon) to check a screenshot of what is on screen.

Honest limits: results are warning signs, not proof. No tool can confirm a payment or a sender from an image. Always confirm in your own bank or payment app, or find a message or post at its source.

Privacy: the extension only reads the image you choose, when you click. It hands the image to the ScreenshotChecker tab inside your browser and does not send it to a server. Open source: https://github.com/viratchauhan/screenshotchecker

**Single purpose statement:**
Send an image the user chooses, or a capture of the visible tab, to ScreenshotChecker so the user can check it for signs of editing or scams.

**Permission justifications:**
- contextMenus: adds the two right-click items.
- activeTab: reads the clicked image or captures the visible tab only after the user clicks.
- scripting: reads a blob: or same-site image from inside the page the user clicked, when the image cannot be fetched directly.
- storage: keeps the chosen image in session storage until the ScreenshotChecker tab collects it (deleted on collection, tab close, or after 5 minutes).
- Host permission https://screenshotchecker.com/*: runs a small script on ScreenshotChecker only, to deliver the image to the page.

**Data usage answers:** The extension does not collect or transmit user data. It does not sell data, use it for unrelated purposes, or use it for creditworthiness. (The website itself uses Google Analytics; link the site privacy policy: https://screenshotchecker.com/privacy/)

**Screenshots to prepare (1280x800):**
1. Right-click menu on an image showing "Check this image with ScreenshotChecker"
2. ScreenshotChecker result for a fictional scam SMS screenshot
3. Share result card
4. Payment receipt review for a fictional UPI screenshot
5. "Check a screenshot of this page" on a fictional social post

Use only fictional or synthetic example images.
