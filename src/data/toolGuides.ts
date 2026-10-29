// Explainer copy shown under each tool workspace (above its FAQ).
// Keep every claim in step with what the tool's code does; paragraphs may contain internal links.

export interface ToolGuideSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface ToolGuide {
  heading: string;
  intro: string;
  sections: ToolGuideSection[];
}

export const TOOL_GUIDES: Record<string, ToolGuide> = {
  'screenshot-metadata-checker': {
    heading: 'How to Read Screenshot and Photo Metadata',
    intro:
      'Metadata is information stored inside an image file next to the pixels: the device that made it, when it was made, the software that last saved it and sometimes a GPS location. This inspector reads those fields in your browser and groups them so you can see what the file says about itself.',
    sections: [
      {
        heading: 'What you can learn from the fields',
        paragraphs: [
          'Camera photos usually carry the most: make and model, lens, exposure settings, the original capture time and, if location was switched on, latitude and longitude. A Software field can name the editor or app that last saved the file. Screenshots usually carry much less, often just dimensions and a colour profile, and sometimes the name of the capture tool.',
        ],
        list: [
          '<strong>Capture time vs. file time:</strong> an original capture date that is far from when the image was supposedly taken deserves a question.',
          '<strong>Software:</strong> an editor name shows the file passed through that program. It does not show what was changed.',
          '<strong>GPS:</strong> coordinates reveal where a photo was taken. Remove them before sharing with the <a href="/image-metadata-remover/">metadata remover</a>.',
          '<strong>Dimensions:</strong> a screenshot whose size matches no common screen may have been cropped or resized.',
        ],
      },
      {
        heading: 'Why missing metadata proves nothing',
        paragraphs: [
          'WhatsApp, Instagram, X and most messaging and social apps strip metadata when an image is sent or uploaded, and screenshots start with very little. An empty result is normal for a forwarded image and is not a sign of editing. The reverse also holds: metadata can be written or copied with free tools, so a convincing camera model or date is a clue, not proof.',
          'Whenever you can, ask for the original file rather than a forwarded copy. For screenshots, the more useful question is usually whether the content is real, which the <a href="/screenshot-analyzer/">screenshot analyzer</a> and the <a href="/blog/screenshot-checker-online/">verification checklist</a> help with.',
        ],
      },
      {
        heading: 'A quick metadata check, step by step',
        paragraphs: [],
        list: [
          'Open the original file, not a screenshot of it or a copy saved from a chat.',
          'Look for capture time, software and GPS first; they answer most questions.',
          'Compare what the fields claim with what you were told about the image.',
          'Copy or download the fields as JSON if you need to keep a record.',
          'Treat conflicts as a reason to verify at the source, not as a verdict.',
        ],
      },
    ],
  },

  'image-metadata-remover': {
    heading: 'Remove Hidden Data From a Photo Before You Share It',
    intro:
      'Photos from phones and cameras can carry GPS coordinates, the device model and the exact time they were taken. Anyone who receives the original file can read that. This tool makes a clean copy that keeps the picture and leaves the hidden fields behind.',
    sections: [
      {
        heading: 'How the clean copy is made',
        paragraphs: [
          'Your image is drawn onto a canvas in the browser and saved again as a new PNG file. Only the pixels are copied, so EXIF, GPS, XMP and other embedded fields from the original are not carried into the download. Your original file is not changed.',
          'Because the copy is a PNG, it can be larger than a JPEG original, and an embedded colour profile may not carry over, so colours can shift slightly on wide-gamut photos. Check the result before you send it, and open it in the <a href="/screenshot-metadata-checker/">metadata checker</a> if you want to confirm what is left.',
        ],
      },
      {
        heading: 'When removing metadata matters',
        paragraphs: [
          'Many social apps strip metadata when you post, but plenty of routes keep the original file intact: email attachments, cloud-drive and file-sharing links, marketplace listings, forums, and "send as document" in chat apps. Those are the moments to clean a photo first.',
        ],
        list: [
          'Selling something online from a photo taken at home.',
          'Sending pictures of a rental, a car or a parcel to a stranger.',
          'Sharing photos of children, your street or your workplace.',
          'Reporting a scam with screenshots and photos as evidence.',
        ],
      },
      {
        heading: 'What metadata removal cannot hide',
        paragraphs: [
          'Removing metadata does not change what is visible. A house number, a street sign, a school logo, a reflection in a window or a face can reveal as much as GPS coordinates. Cover those with solid boxes in the <a href="/screenshot-redactor/">screenshot redactor</a>, and read <a href="/blog/exif-metadata/">what EXIF metadata is</a> for more on which fields give what away.',
        ],
      },
    ],
  },

  'screenshot-ocr': {
    heading: 'Copy Text From a Screenshot',
    intro:
      'OCR (optical character recognition) turns the words in a picture into text you can copy, search and paste. This tool runs Tesseract OCR inside your browser, in English or Hindi, so you can pull the text out of a chat, receipt, error message or document screenshot.',
    sections: [
      {
        heading: 'How to get the cleanest text',
        paragraphs: [
          'The first run downloads the OCR engine and the language data for the language you pick, so it takes a little longer than later runs. After that, results depend mostly on the picture itself.',
        ],
        list: [
          '<strong>Use the original screenshot.</strong> Images that were forwarded several times lose sharpness.',
          '<strong>Crop to the text you need.</strong> Status bars, icons and photos around the text add noise.',
          '<strong>Pick the right language.</strong> Choose Hindi for Devanagari text and English for Latin script.',
          '<strong>Bigger text reads better.</strong> Zoom in before taking the screenshot if the words are tiny.',
          '<strong>Check numbers and names by eye.</strong> OCR can confuse 0 and O, 1 and l, or drop a digit.',
        ],
      },
      {
        heading: 'Useful things to do with the text',
        paragraphs: [
          'Paste a link from a message into the <a href="/suspicious-link-checker/">suspicious link checker</a> instead of tapping it. Search a phone number or a company name to see whether others have reported it. Copy an error message to search for a fix, or paste a long chat into a translator. If you are checking a message that pressures you to act, the <a href="/screenshot-scam-checker/">scam checker</a> reads the text and flags common scam patterns.',
        ],
      },
      {
        heading: 'Where OCR struggles',
        paragraphs: [
          'Handwriting, stylised or very thin fonts, text on busy backgrounds, emoji, and lines that mix scripts are hard for any OCR engine. Low-contrast dark-mode screenshots can also lose characters. When the text matters, such as an amount, an account number or a reference, compare the result with the image before you rely on it.',
        ],
      },
    ],
  },

  'screenshot-redactor': {
    heading: 'How to Redact a Screenshot So It Stays Hidden',
    intro:
      'Redacting means covering private details before an image leaves your hands. The redactor lets you draw boxes over parts of a screenshot and export a separate flattened image, with the original file left as it was.',
    sections: [
      {
        heading: 'Choose solid boxes for anything sensitive',
        paragraphs: [
          'The editor offers black boxes, white boxes, pixelation and blur. For names, numbers and anything that must stay secret, use a solid black or white box. Blur and pixelation can leave enough shape to guess short text such as a phone number, and some can be partly reversed. Use them only for things that are not secret, like a busy background.',
        ],
      },
      {
        heading: 'What to cover before sharing a screenshot',
        paragraphs: [],
        list: [
          'Names, profile photos and usernames of people who did not agree to be shared.',
          'Phone numbers, email addresses and home or work addresses.',
          'Bank account numbers, UPI IDs, card numbers, IBANs and transaction or order references.',
          'One-time codes, QR codes and barcodes, which can sometimes still be used.',
          'Notification banners, other open chats and anything in the status bar you did not mean to show.',
        ],
      },
      {
        heading: 'Check the export before you send it',
        paragraphs: [
          'Open the exported image and zoom in on every box. Make sure each one fully covers the text, including the edges of letters and numbers, and that nothing private appears elsewhere, such as a name repeated in a reply or a reflection. If you are not sure what a screenshot exposes, run it through the <a href="/screenshot-privacy-checker/">privacy checker</a> first; it reads the text and points out emails, phone numbers and other patterns to cover.',
          'Photos can also carry hidden GPS and device data. The redactor\'s export is a new image, but if you share an original photo, clean it with the <a href="/image-metadata-remover/">metadata remover</a>. The <a href="/blog/redact-screenshot-before-sharing/">redaction guide</a> walks through a full example with before and after images.',
        ],
      },
    ],
  },

  'screenshot-privacy-checker': {
    heading: 'Check a Screenshot for Personal Information Before Sharing',
    intro:
      'It is easy to miss a phone number in a chat header or a card number at the bottom of a receipt. The privacy checker reads the text in your screenshot with OCR and points out patterns that look like personal or sensitive data, so you can cover them before you post or send the image.',
    sections: [
      {
        heading: 'What it looks for',
        paragraphs: [
          'After OCR extracts the text, pattern rules look for common formats. Each match is listed so you can decide whether it needs covering.',
        ],
        list: [
          'Email addresses and phone numbers.',
          'Payment card numbers (shown masked in the results), SSN-style and other national ID patterns.',
          'Street addresses and IP addresses.',
          'Order, invoice and transaction references.',
          'Bitcoin and Ethereum wallet addresses.',
          'Strings that look like passwords, API keys or access tokens.',
        ],
      },
      {
        heading: 'What it can miss',
        paragraphs: [
          'Pattern rules only see text that OCR could read and formats they know. They do not recognise faces, profile pictures, signatures, handwriting, names on their own or details inside photos. Unusual formats can slip through, and harmless numbers can be flagged. Treat the list as a second pair of eyes, then look over the whole image yourself.',
        ],
      },
      {
        heading: 'From scan to safe image',
        paragraphs: [
          'When the scan finds something, open the image in the <a href="/screenshot-redactor/">redactor</a> and cover each item with a solid box; blur and pixelation can leave short numbers readable. Before sharing a photo rather than a screenshot, also remove its hidden location data with the <a href="/image-metadata-remover/">metadata remover</a>. The <a href="/blog/redact-screenshot-before-sharing/">guide to redacting screenshots</a> shows the full routine.',
        ],
      },
    ],
  },

  'image-manipulation-checker': {
    heading: 'How to Read an Error Level Analysis (ELA) Map',
    intro:
      'Error Level Analysis looks at how an image responds to being compressed again. The tool re-saves your image as a JPEG at 75% quality in the browser and shows how much each area changed. Parts of a picture with a different editing or saving history can respond differently and stand out on the map.',
    sections: [
      {
        heading: 'What bright and dark areas mean',
        paragraphs: [
          'Brighter areas changed more when the image was re-saved; darker areas changed less. On their own, bright areas are not proof of editing. Sharp edges, text, fine patterns and high-contrast detail are naturally bright on an ELA map, while flat areas such as sky or a plain background stay dark.',
          'What deserves a closer look is inconsistency: one name, number or object that glows very differently from similar text or texture right next to it, or a rectangle whose brightness does not match its surroundings.',
        ],
      },
      {
        heading: 'Limits to keep in mind',
        paragraphs: [],
        list: [
          'ELA works best on JPEG photos that were saved a small number of times.',
          'Screenshots are often PNG files saved once, so an edit and the original may look the same on the map.',
          'An image re-saved or resized after editing, as chat apps do, can smooth out the differences.',
          'A careful edit followed by one clean save can leave no visible ELA trace.',
        ],
      },
      {
        heading: 'Use ELA as one clue among several',
        paragraphs: [
          'If an area looks suspicious, compare it with another copy of the image in the <a href="/screenshot-comparison/">screenshot comparison tool</a>, check the file\'s <a href="/screenshot-metadata-checker/">metadata</a>, and look for the image online with <a href="/reverse-image-search/">reverse image search</a>. For a payment or chat screenshot, the decisive check is still the source: your own bank or payment app, or the original conversation. The <a href="/blog/screenshot-checker-online/">verification checklist</a> puts these steps in order.',
        ],
      },
    ],
  },

  'ai-image-detector': {
    heading: 'How to Interpret the AI Image Detector\'s Results',
    intro:
      'No single test can say for certain that an image was made by AI. This detector lists separate pieces of evidence so you can weigh them yourself.',
    sections: [
      {
        heading: 'The signals, strongest first',
        paragraphs: [],
        list: [
          '<strong>Content Credentials (C2PA):</strong> a signed record from the camera, editor or AI tool that made the file. When present and valid, it is the most direct evidence of origin, but most images, including most AI images, do not carry one, and sharing often strips it.',
          '<strong>Metadata:</strong> generator names or editing software in the file\'s fields. Easy to remove, so absence means little.',
          '<strong>Texture and noise statistics:</strong> generated images can have unusually smooth or regular textures compared with camera noise.',
          '<strong>Error Level Analysis:</strong> shows areas with a different compression history, which can point to edits or composites.',
          '<strong>Malformed text:</strong> OCR looks for garbled words, a common flaw in generated signs and labels.',
        ],
      },
      {
        heading: 'Checking a viral image',
        paragraphs: [
          'Start with where the image came from: run a <a href="/reverse-image-search/">reverse image search</a> to find earlier copies, and look for the original post or a fact check. Then use the detector\'s signals as supporting evidence. The <a href="/blog/ai-image-detector-online/">guide to AI image detection</a> explains each signal and its blind spots in more detail.',
        ],
      },
    ],
  },

  'screenshot-comparison': {
    heading: 'When and How to Compare Two Screenshots',
    intro:
      'Comparing two versions of the same screenshot is one of the most reliable ways to find an edit, because you are no longer guessing what the original looked like. The tool aligns both images and lets you view them side by side, with a swipe slider, as an overlay, or as a difference map that highlights changed pixels.',
    sections: [
      {
        heading: 'Good uses for a comparison',
        paragraphs: [],
        list: [
          'A forwarded screenshot against the one you took yourself of the same chat or post.',
          'A receipt or confirmation someone sent against the record in your own app.',
          'Two versions of a document, web page or app screen before and after a change.',
        ],
      },
      {
        heading: 'Reading the difference map',
        paragraphs: [
          'Resizing, recompression and slightly different crops create scattered noise across the whole image, especially around text. A real edit usually shows up as a tight, solid block, such as one changed amount, name or time. Adjust the sensitivity to cut noise, then use the swipe slider on any highlighted area to see exactly what changed. For a single image with no second copy, try <a href="/image-manipulation-checker/">Error Level Analysis</a> or the <a href="/blog/fake-whatsapp-chat-screenshot/">fake chat screenshot guide</a> instead.',
        ],
      },
    ],
  },
};

export function getToolGuide(slug: string): ToolGuide | undefined {
  return TOOL_GUIDES[slug];
}
