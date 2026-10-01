export interface ToolFaqItem {
  question: string;
  answer: string;
}

export const TOOL_FAQS: Record<string, ToolFaqItem[]> = {
  'ai-image-detector': [
    {
      question: 'How does this AI image detector identify synthetic images?',
      answer: 'Our detector combines C2PA Content Credentials provenance checking with visual artifact inspection, including Error Level Analysis (ELA), frequency domain noise variance, and typographic anomalies common in AI generation models like Midjourney, DALL-E, and Stable Diffusion.',
    },
    {
      question: 'Is any AI image detection tool 100% accurate?',
      answer: 'No. No automated AI detector can guarantee 100% accuracy because generative models improve continuously. We provide multi-signal forensic indicators to help you make informed evaluations rather than relying on an oversimplified black-box score.',
    },
    {
      question: 'Are my images uploaded to external cloud servers for AI detection?',
      answer: 'No. All forensic checks, C2PA manifest parsing, and image analysis execute entirely inside your local web browser sandbox using client-side WebAssembly and JavaScript.',
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
  ],

  'screenshot-ocr': [
    {
      question: 'How does client-side OCR extract text from screenshots?',
      answer: 'We utilize a specialized WebAssembly build of Tesseract.js running in an isolated browser Web Worker. It analyzes character glyphs directly on your device CPU and outputs selectable, editable text without requiring any server-side OCR API.',
    },
    {
      question: 'Is my extracted screenshot text private and secure?',
      answer: 'Yes. Because OCR processing is executed entirely within your browser, your sensitive messages, receipts, and personal notes are never uploaded or stored on remote servers.',
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
      answer: 'No. All drawing, blurring, and export operations happen completely in-memory on your client machine.',
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
      answer: 'Never. The entire detection heuristic runs in your local browser sandbox. No phone numbers, card details, or names are ever recorded or transmitted.',
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
