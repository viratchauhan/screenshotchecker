export interface ToolFaqItem {
  question: string;
  answer: string;
}

export const TOOL_FAQS: Record<string, ToolFaqItem[]> = {
  'ai-image-detector': [
    {
      question: 'How does this AI image detector identify synthetic images?',
      answer: 'It combines several independent signals: C2PA Content Credentials if the file carries them, metadata, Error Level Analysis (ELA), texture and frequency statistics, and malformed words in any text OCR can read (garbled signage is common in generated images). Each signal is shown with its evidence. None of them alone proves an image is AI-generated or real.',
    },
    {
      question: 'Is any AI image detection tool 100% accurate?',
      answer: 'No. No automated AI detector can guarantee 100% accuracy because generative models improve continuously. We provide multi-signal forensic indicators to help you make informed evaluations rather than relying on an oversimplified black-box score.',
    },
    {
      question: 'Are my images uploaded to external cloud servers for AI detection?',
      answer: 'No. All forensic checks, C2PA manifest parsing, and image analysis execute entirely inside your local web browser sandbox using client-side WebAssembly and JavaScript.',
    },
    {
      question: 'How can I tell if a photo is fake?',
      answer: 'Look for where it came from first. Run a reverse image search to find earlier or original copies, check whether a trusted outlet or the person shown published it, and look for fact checks. Then inspect the file: Content Credentials, metadata and ELA can add clues. Visual tells such as warped hands, impossible reflections or garbled text help, but newer generators avoid many of them.',
    },
    {
      question: 'Is a fake image detector the same as an AI image detector?',
      answer: 'Not quite. A fake can be a real photo that was edited, cropped or shown out of context, as well as a fully generated image. AI-detection signals cover generated images; ELA and comparison help with edits; and only source checks, such as reverse image search, catch a real photo used in the wrong context.',
    },
    {
      question: 'Can I check whether an image was made with Google AI or ChatGPT?',
      answer: 'Sometimes. Google adds an invisible SynthID watermark to images made or edited with its AI, and the Gemini app can check for it, but only for Google AI content. Some generators also attach Content Credentials, which this detector reads when present. Most other images carry no such mark, and screenshots or re-saved copies usually lose it, so a missing mark proves nothing.',
    },
    {
      question: "Is this fake image detector free?",
      answer: "Yes. The AI image and fake photo detector is free and needs no account. The checks run in your browser, so you can test as many images as you like.",
    },
    {
      question: "Can it detect AI-edited photos, not just fully AI-generated images?",
      answer: "Sometimes. When AI is used to change part of a real photo, such as removing an object or swapping a face, the changed area can show a different compression history on the ELA map or break the natural noise pattern. A clean re-save can hide those traces, so a quiet result does not prove a photo was not edited.",
    },
    {
      question: "Which AI generators can it identify?",
      answer: "It does not guess a specific generator from the pixels. It names one only when the file says so, through Content Credentials or metadata written by the tool that made it. Detectors that claim to name the model from pixels alone are making a statistical guess that is often wrong on edited or re-shared images.",
    },
    {
      question: "Does it work on a screenshot of an image?",
      answer: "It works, but the result is weaker. A screenshot creates a new file: Content Credentials and metadata are gone, and the picture is resampled, which blurs texture signals. Use the original file whenever you can get it.",
    },
    {
      question: "What should I do if the signals are mixed?",
      answer: "Mixed results are common, especially for re-shared images. Treat them as a reason to check the source: find the earliest copy with reverse image search, see who first posted it, and look for a fact check before you share it or act on it.",
    },
    {
      question: "How can I check if a photo of a person is real?",
      answer: "Do not rely on any detector alone. Search for the image and the claim, check whether the person or a trusted outlet published it, and look closely at hands, ears, jewellery, text and backgrounds. Be especially careful with photos used to ask for money or to shame someone, which are common in scams and deepfake abuse.",
    },
  ],

  'image-manipulation-checker': [
    {
      question: 'What is Error Level Analysis (ELA) and how does it detect manipulation?',
      answer: 'Error Level Analysis (ELA) works by intentionally resaving an image at a known compression level and calculating the difference matrix. Because edited sections usually have different compression histories than the surrounding image, they appear with distinct brightness patterns in the ELA heatmap.',
    },
    {
      question: 'Can normal image cropping or re-saving trigger an ELA warning?',
      answer: 'Yes. Every time a JPEG is saved, compression artifacts change. High-contrast edges or text naturally produce higher error levels. ELA should be evaluated alongside context, font consistency, and metadata rather than viewed in isolation.',
    },
    {
      question: 'Does this manipulation checker run privately on my device?',
      answer: 'Yes. ELA computation and visual diffing run 100% locally in your browser canvas. No image bytes or personal documents are transmitted to any server.',
    },
    {
      question: 'How can I tell if a picture is photoshopped?',
      answer: 'Start by searching for an earlier copy with a reverse image search: an older version that differs is the clearest proof of an edit. Then zoom in on shadows, edges, repeated patterns and straight lines that bend near people, and use this ELA map as a supporting clue for JPEG photos. A clean map does not prove a photo is genuine.',
    },
    {
      question: "Is this photo manipulation detector free?",
      answer: "Yes. It is free, needs no account and runs in your browser: the image is re-saved as a JPEG at 75% quality on your device and compared with the original to draw the ELA map.",
    },
    {
      question: "How do I read the ELA heatmap?",
      answer: "Bright areas changed more when the image was re-saved, dark areas less. Edges and text are naturally bright, so look for inconsistency instead: one number, face or object that glows very differently from similar detail next to it, or a block whose brightness does not match its surroundings.",
    },
    {
      question: "Can ELA detect AI edits or edited screenshots?",
      answer: "Only sometimes. AI fill and object removal can leave an area with a different compression history, but many tools blend their output well. Screenshots are usually PNG files saved once, so an edit may not show at all. Use ELA as a clue, together with the comparison tool and a search for an earlier copy.",
    },
    {
      question: "What else shows that a photo was altered?",
      answer: "The strongest proof is an earlier, different copy found with reverse image search. After that, compare two versions with the comparison tool, check the Software field in the metadata, and look for shadows, reflections and straight lines that do not match. No single check proves a photo is genuine.",
    },
  ],

  'screenshot-ocr': [
    {
      question: 'How does client-side OCR extract text from screenshots?',
      answer: 'We utilize a specialized WebAssembly build of Tesseract.js running in an isolated browser Web Worker. It analyzes character glyphs directly on your device CPU and outputs selectable, editable text without requiring any server-side OCR API.',
    },
    {
      question: 'Is my extracted screenshot text private and secure?',
      answer: 'OCR processes image pixels and extracted text in your browser without an OCR upload. The page still uses analytics and downloads OCR resources. Sending the original image to another tool saves a copy in browser sessionStorage; see the privacy policy for storage lifetime and network details.',
    },
    {
      question: 'What image resolutions provide the best OCR text accuracy?',
      answer: 'OCR accuracy depends on text size in pixels, contrast, sharpness, language, and layout. DPI metadata alone does not establish readability. Review the extracted text, especially names and numbers, against the original image.',
    },
  ],

  'screenshot-redactor': [
    {
      question: 'What redaction methods are available for hiding sensitive information?',
      answer: 'The editor offers blur, pixelation, black blocks, and white blocks. Use fully opaque solid blocks to cover sensitive information; blur, pixelation, and highlighting can leave readable clues.',
    },
    {
      question: 'Can redacted text be reversed or unmasked after export?',
      answer: 'Export creates a separate flattened image; your original file is unchanged. Fully cover sensitive information with opaque solid blocks. Blur, pixelation, and highlighting can leave clues or readable text, so inspect the exported copy before sharing.',
    },
    {
      question: 'Is there any file upload required to redact screenshots?',
      answer: 'Redaction and export run in your browser without an image-processing upload. Cross-tool transfers save the original image in browser sessionStorage; the one-hour limit is checked when read, not a deletion timer. Pages also use analytics and download resources. See the privacy policy for details.',
    },
  ],

  'screenshot-metadata-checker': [
    {
      question: 'What metadata can be extracted from screenshots and photos?',
      answer: 'The inspector extracts EXIF tags, GPS latitude/longitude coordinates, camera hardware make and model, lens details, shutter speeds, ISO levels, color profiles, and software modification history.',
    },
    {
      question: 'Do screenshots usually have EXIF and GPS tags?',
      answer: 'Native screen captures taken on iOS, Android, macOS, or Windows rarely contain camera EXIF or GPS coordinates, but direct camera photos and saved camera files almost always contain detailed hardware and location tags.',
    },
    {
      question: 'How does this tool read EXIF data privately?',
      answer: 'Our client-side parser reads the binary byte headers of your file directly in your browser. No file data is transmitted across the internet.',
    },
  ],

  'image-metadata-remover': [
    {
      question: 'Why should I remove metadata before sharing images online?',
      answer: 'Camera photos often contain precise GPS coordinates pointing to your home or office, along with device serial numbers and creation timestamps that can compromise your privacy when uploaded to forums or social networks.',
    },
    {
      question: 'How does this tool strip image metadata?',
      answer: 'The tool extracts the raw visual pixel raster from your image and exports a pristine, clean file into memory with all EXIF, GPS, IPTC, and XMP metadata headers completely stripped out.',
    },
    {
      question: 'Does stripping metadata reduce image visual quality?',
      answer: 'No. When exported in lossless PNG or high-quality WebP/JPEG, the visual pixels remain crisp while the invisible privacy-invasive tracking tags are permanently discarded.',
    },
  ],

  'screenshot-privacy-checker': [
    {
      question: 'What types of sensitive personal data does the privacy scanner detect?',
      answer: 'The scanner extracts and flags phone numbers, email addresses, 16-digit payment card numbers, Social Security Numbers (SSNs), residential street addresses, and API/access tokens.',
    },
    {
      question: 'Can I redact sensitive information directly from the scanner?',
      answer: 'Yes. Once sensitive entities are detected, you can seamlessly open the integrated Redactor to blur, pixelate, or black out the flagged regions before sharing.',
    },
    {
      question: 'Does the scanner store any detected personal information?',
      answer: 'Detection runs in your browser. Cross-tool image transfers save the original image, which may contain personal information, in browser sessionStorage. An image is rejected after one hour when read, rather than deleted on a timer. Pages also use analytics and download resources; see the privacy policy.',
    },
  ],

  'screenshot-comparison': [
    {
      question: 'How does the screenshot comparison tool highlight differences?',
      answer: 'You can compare two image captures using side-by-side view, an interactive swipe slider, an opacity overlay, or a pixel-difference heatmap that highlights modified regions.',
    },
    {
      question: 'What are common use cases for visual screenshot comparison?',
      answer: 'Common use cases include verifying before-and-after UI changes, detecting text edits between two versions of a document, and spotting subtle modifications in transactional receipts.',
    },
    {
      question: 'Can I compare images of different dimensions?',
      answer: 'Yes. The comparison tool automatically normalizes aspect ratios and viewport alignments so you can inspect visual differences smoothly.',
    },
  ],

  'suspicious-link-checker': [
    {
      question: 'What happens to the URL or message I submit?',
      answer: 'The standalone checker extracts URLs and compares them with the dataset in your browser, without sending the submitted URL or message text to an analysis endpoint or visiting the destination. Static dataset shard requests can still occur. Up to ten recent URL results are saved in localStorage and can be removed with Clear History. See the privacy policy for analytics and storage details.',
    },
    {
      question: 'What is a suspicious link checker?',
      answer: 'A suspicious link checker is an investigative tool that verifies a submitted URL or domain against a database of known web classifications to identify whether it matches cataloged bad, good, or conflicting records.',
    },
    {
      question: 'How does ScreenshotChecker check a URL?',
      answer: 'ScreenshotChecker performs standards-compliant URL normalization, extracts the full hostname and registrable domain using Public Suffix rules, and queries our local 420K+ record dataset across three match levels: exact URL, exact hostname, and registrable domain.',
    },
    {
      question: 'What is a local URL dataset?',
      answer: 'A local URL dataset is an offline, curated repository of categorized web addresses and domains (containing over 420,000 verified entries) used to look up historical classifications without sending traffic to third-party APIs.',
    },
    {
      question: 'What does a domain match mean?',
      answer: 'A domain match means the primary registrable root domain of the submitted URL (e.g. example.com) exists in the local dataset, even if the specific sub-page or path is different.',
    },
    {
      question: 'What does an exact URL match mean?',
      answer: 'An exact URL match is the strongest match level, indicating that the full web address (including path and query parameters) exists verbatim in the local intelligence dataset.',
    },
    {
      question: 'What does "No Local Match" mean?',
      answer: '"No Local Match" means the submitted URL, hostname, or domain was not found in ScreenshotChecker\'s local dataset. It indicates absence of cataloged data, not proof of safety.',
    },
    {
      question: 'Does no match mean the website is safe?',
      answer: 'No. An absence of matching records in the dataset does NOT guarantee that a website is safe. Newly created phishing websites or unindexed domains will not appear in the dataset.',
    },
    {
      question: 'Does ScreenshotChecker open or visit the submitted URL?',
      answer: 'No. ScreenshotChecker performs a purely passive local database query. Your browser and our servers never establish a network connection with the submitted website.',
    },
    {
      question: 'Can I check a domain without visiting it?',
      answer: 'Yes. You can safely paste any link or domain name into the checker to inspect its local classification without loading any scripts, redirects, or files from the destination server.',
    },
  ],
};

export function getToolFaqs(slug: string): ToolFaqItem[] {
  return TOOL_FAQS[slug] || [];
}
