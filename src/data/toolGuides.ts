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
          'If an area looks suspicious, compare it with another copy of the image in the <a href="/screenshot-comparison/">screenshot comparison tool</a>, check the file\'s <a href="/screenshot-metadata-checker/">metadata</a>, and look for the image online with <a href="/reverse-image-search/">reverse image search</a>. For a payment or chat screenshot, the decisive check is still the source: your own bank or payment app, or the original conversation. The <a href="/blog/screenshot-checker-online/">verification checklist</a> puts these steps in order. For photos, the <a href="/blog/how-to-tell-if-a-photo-is-edited/">guide to spotting edited photos</a> explains what each check can prove.',
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
          'Start with where the image came from: run a <a href="/reverse-image-search/">reverse image search</a> to find earlier copies, and look for the original post or a fact check. Then use the detector\'s signals as supporting evidence. The <a href="/blog/ai-image-detector-online/">guide to AI image detection</a> explains each signal and its blind spots in more detail. For a step-by-step routine, see <a href="/blog/how-to-tell-if-an-image-is-ai-generated/">how to tell if an image is AI-generated</a>, <a href="/blog/how-to-tell-if-a-photo-is-edited/">how to tell if a photo is edited or fake</a> and <a href="/blog/ai-generated-screenshot/">how to tell if a screenshot is AI-generated</a>.',
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
  'screenshot-scam-checker': {
    heading: 'How to Check if a Message Is a Scam From a Screenshot',
    intro:
      'Upload a screenshot of the SMS, WhatsApp chat, email or social media DM. The checker reads the words in the picture, compares them with common scam tactics and a set of documented scam message patterns, and explains each warning sign it finds. It is a second opinion before you tap, pay or reply, not a verdict on who sent the message.',
    sections: [
      {
        heading: 'What the scam checker looks for',
        paragraphs: [
          'Most scam messages lean on the same few levers, whatever brand or government office they pretend to be. The checker scores each of these separately so you can see why a message was flagged:',
        ],
        list: [
          '<strong>Urgency:</strong> deadlines such as "within 24 hours", "today only" or "last warning".',
          '<strong>Threats:</strong> account blocks, power disconnection, arrest, fines or legal action.',
          '<strong>Payment requests:</strong> a fee, fine, deposit, redelivery charge or "prepaid task" before you can get something.',
          '<strong>Requests for secrets:</strong> OTPs, UPI PINs, passwords, card numbers or a WhatsApp 6-digit code.',
          '<strong>Files and apps:</strong> APK files or "update" apps sent in a chat.',
          '<strong>Impersonation:</strong> a bank, courier, toll agency, police, tax office or well-known shop named in an unexpected message.',
          '<strong>Social engineering:</strong> wrong-number openers, paid "like and review" jobs and investment groups.',
          '<strong>Links:</strong> web addresses in the text, checked against a labelled dataset of reported phishing links.',
        ],
      },
      {
        heading: 'Scam patterns it recognises',
        paragraphs: [
          'Beyond the general signals, the text is compared with 28 documented scam message patterns from India and the US, including bank re-KYC and APK messages, task job and review scams, <a href="/blog/fake-job-offer-letter/">fake job offer letters</a>, parcel and India Post address texts, unpaid toll texts (E-ZPass, SunPass), e-challan and Parivahan messages, electricity disconnection threats, digital arrest calls, income tax refund messages, reward points expiry, WhatsApp code theft, crypto investment groups, instant loan apps and KBC lottery messages. Our guides explain each one in plain language, for example the <a href="/blog/whatsapp-telegram-task-job-scam/">task job scam</a>, the <a href="/blog/india-post-courier-sms-scam/">India Post SMS</a> and the <a href="/blog/digital-arrest-scam/">digital arrest scam</a>.',
        ],
      },
      {
        heading: 'How to read the result',
        paragraphs: [
          'A high score means the message uses several tactics scammers rely on. A low score only means no known pattern matched: new wording, a cropped screenshot or blurry text can slip through, and a real bank alert can also sound urgent. Whatever the score, check the claim yourself by opening the official app or typing the official website, never through a link or number in the message.',
        ],
      },
      {
        heading: 'Already replied, paid or shared a code?',
        paragraphs: [
          'Act quickly. In India, call your bank and the 1930 cyber fraud helpline, and report on cybercrime.gov.in; report a scam SMS or call you did not lose money to through Chakshu on the Sanchar Saathi portal. In the US, contact your bank, forward scam texts to 7726 (SPAM) and report at ReportFraud.ftc.gov. Keep the screenshots: they are useful evidence for your report.',
        ],
      },
    ],
  },
  'fake-receipt-checker': {
    heading: 'How to Check if a Receipt Is Fake',
    intro:
      'Fake receipts used to need image-editing skill. Now a receipt generator website or an AI image tool can make one in seconds, so the picture alone proves less than ever. A good check moves from the image to things a forger cannot easily control: the arithmetic, the shop and the payment record.',
    sections: [
      {
        heading: 'A five-point receipt check',
        paragraphs: ['Work through these in order. One failed point is a reason to ask questions; several together are a strong warning.'],
        list: [
          '<strong>The shop:</strong> search for it yourself and confirm the name, address, phone number and tax number (GSTIN in India) match a real business. Do not trust a phone number printed on the receipt.',
          '<strong>The maths:</strong> quantities times prices must equal the subtotal, and the tax and total must follow. Use the receipt math check above.',
          '<strong>The tax:</strong> the rate should fit the place. Most standalone Indian restaurants charge 5% GST, split equally into CGST and SGST; US sales tax depends on the state and city.',
          '<strong>The details:</strong> date and time against opening hours and the claimed trip, card digits (usually the last four only), receipt numbering, and fonts or spacing that change mid-line.',
          '<strong>The payment:</strong> ask for the matching card or bank statement line, or contact the shop with the receipt number. This is the check a fake cannot pass.',
        ],
      },
      {
        heading: 'What the image scan adds',
        paragraphs: [
          'The upload above reads the text with OCR, recognises receipts and tax invoices, shows any metadata left in the file and draws an error level map that can highlight a pasted or retyped figure on a JPEG photo. These are clues. A receipt made from scratch by a generator, or photographed from a screen, can come through clean, and missing metadata is normal for shared images. For more on edited figures, see <a href="/image-manipulation-checker/">how to read an ELA map</a>.',
        ],
      },
      {
        heading: 'Common fake receipt situations',
        paragraphs: [
          'Inflated expense claims, refund or warranty requests for items never bought, fake rent or deposit receipts, and payment proof in marketplace deals. Our guides cover <a href="/blog/fake-receipt-ai-generated/">AI-generated receipts</a>, the Hindi <a href="/blog/fake-receipt-kaise-pehchane/">नकली रसीद कैसे पहचानें</a>, and <a href="/payment-screenshot-checker/">payment screenshots</a> sent as proof.',
        ],
      },
    ],
  },
  'screenshot-analyzer': {
    heading: 'How to Tell if a Screenshot Is Real or Fake',
    intro:
      'A screenshot is easy to edit and easy to make from scratch, so no single check can prove it real. The analyzer runs several checks at once and shows what each one found, so you can decide what to verify next.',
    sections: [
      {
        heading: 'What the analyzer checks',
        paragraphs: [],
        list: [
          '<strong>Text (OCR):</strong> reads names, amounts, dates and messages so you can compare them with the original source.',
          '<strong>Screenshot type:</strong> recognises chats, payment receipts, invoices, store receipts, order confirmations and promotions, and applies checks that fit that type.',
          '<strong>Metadata:</strong> shows dimensions and any file details left behind, such as editing software. Shared images often carry none, which is normal.',
          '<strong>Error level analysis:</strong> highlights areas with a different compression history, which can point to a pasted or retyped figure on JPEG images.',
          '<strong>Scam signals:</strong> flags urgency, threats, payment requests and known scam message patterns in the text.',
          '<strong>Personal data:</strong> warns about phone numbers, emails, card or account numbers visible in the image before you share it.',
        ],
      },
      {
        heading: 'A quick routine for any screenshot',
        paragraphs: [
          'First, go to the source: open the chat, account, payment app or post yourself and look for the same message, payment or post. Then check the details in the image: fonts and spacing that change mid-line, names and amounts that sit slightly off the line, a status bar time or battery that does not fit the story, and edges that look smudged. Finally, look for the picture elsewhere with a <a href="/reverse-image-search/">reverse image search</a>.',
          'Type-specific guides go deeper: <a href="/blog/fake-whatsapp-chat-screenshot/">fake WhatsApp chats</a>, <a href="/payment-screenshot-checker/">payment screenshots</a>, <a href="/blog/fake-social-media-post-screenshot/">social media posts</a> and <a href="/blog/ai-generated-screenshot/">AI-generated screenshots</a>.',
        ],
      },
      {
        heading: 'How to read the result',
        paragraphs: [
          'Treat every finding as a clue. A clean result means none of the checks found a problem, not that the screenshot is genuine: a screenshot built from scratch or retaken on another phone can pass. A warning means something deserves a closer look at the source. When the stakes are real, such as money, a job or a reputation, confirm with the person or organisation directly.',
        ],
      },
    ],
  },
  'screenshot-spam-checker': {
    heading: 'Spam or Scam? How to Read a Message Screenshot',
    intro:
      'Spam is unwanted marketing: annoying, but usually selling something real. A scam is built to take your money, codes or personal details. The spam checker looks at how pushy and promotional a message is; if it also asks for money, an OTP or a click on an urgent link, use the <a href="/screenshot-scam-checker/">scam checker</a> as well.',
    sections: [
      {
        heading: 'What the spam checker looks for',
        paragraphs: [],
        list: [
          '<strong>Promotional density:</strong> how much of the text is offers, discounts, free trials and hype words.',
          '<strong>Pressure formatting:</strong> capital letters, rows of exclamation marks and countdown wording.',
          '<strong>Repeated calls to action:</strong> tap the link, reply now, call this number.',
          '<strong>Links:</strong> web addresses in the text, which you can check without opening them in the <a href="/suspicious-link-checker/">suspicious link checker</a>.',
        ],
      },
      {
        heading: 'When spam turns into a scam',
        paragraphs: [
          'Treat a message as a possible scam if it asks you to pay a fee to receive a prize, refund or job, to share an OTP, PIN or password, to install an app from a link, or to act within minutes. Messages about parcels, electricity bills, tolls and traffic fines are common examples; see our guides on <a href="/blog/smishing-fake-sms/">fake SMS</a> and <a href="/blog/india-post-courier-sms-scam/">India Post texts</a>.',
        ],
      },
      {
        heading: 'How to stop and report spam',
        paragraphs: [
          'In India, register for Do Not Disturb by sending START 0 to 1909 or through TRAI\x27s DND app, and report unwanted commercial messages there; report fraud attempts on Chakshu (Sanchar Saathi). In the US, forward spam texts to 7726 (SPAM). For email, use your mail app\x27s report spam button rather than any unsubscribe link in a message you do not trust.',
        ],
      },
    ],
  },
};

export function getToolGuide(slug: string): ToolGuide | undefined {
  return TOOL_GUIDES[slug];
}
