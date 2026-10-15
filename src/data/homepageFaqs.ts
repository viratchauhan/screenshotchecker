export interface FaqItem {
  question: string;
  answer: string;
}

export const HOMEPAGE_FAQS: FaqItem[] = [
  {
    question: "What is a screenshot checker?",
    answer:
      "A screenshot checker is an online tool that examines a screenshot for readable text, embedded metadata, scam warning signs and possible signs of editing. People use it to investigate suspicious messages, review payment receipts, check what a screenshot reveals before sharing it, and extract text. ScreenshotChecker does this in your browser without uploading the image.",
  },
  {
    question: "Can I check a screenshot online for free?",
    answer:
      "Yes. ScreenshotChecker provides free screenshot checking directly in your web browser. Because all analysis algorithms, OCR routines, and forensic checks run locally on your device, you can analyze unlimited screenshots without paid subscriptions or account signups.",
  },
  {
    question: "Can a screenshot checker detect edited images?",
    answer:
      "It can surface some signals: regions where compression differs (error level analysis), metadata left by editing software, and text that contradicts itself or matches scam patterns. It does not measure fonts or layout, and a carefully made or fully generated fake may show no signal at all. Results are clues to investigate, not a guarantee either way.",
  },
  {
    question: "What is the difference between a screenshot checker and screenshot analyzer?",
    answer:
      "The terms are often used interchangeably, but a screenshot checker typically emphasizes verifying authenticity and scanning for risks, while a screenshot analyzer performs broader structural breakdown including optical character recognition, metadata extraction, privacy auditing, and forensic analysis. ScreenshotChecker unites both capabilities in a single unified workflow.",
  },
  {
    question: "Can a screenshot checker verify a payment screenshot?",
    answer:
      "It can read the receipt text and flag details worth questioning, such as amounts, dates or reference text that do not fit together. The dedicated payment checker is built for Indian UPI receipts. No image check can prove money was deposited or cleared: always confirm the credit in your own bank or payment app before handing over goods.",
  },
  {
    question: "Can screenshots contain metadata?",
    answer:
      "Most operating systems and screenshot utilities produce minimal EXIF metadata compared to digital cameras, but files can still include creation timestamps, resolution details, device color profiles, and software signatures. If a screenshot was taken of a photo or forwarded through certain workflows, location coordinates and device tags may also be preserved.",
  },
  {
    question: "Can AI-generated screenshots or images be detected?",
    answer:
      "AI detection tools evaluate synthetic texture patterns, unusual geometric rendering, unnatural text artifacts, and C2PA Content Credentials. While these signals can help spot synthetic or AI-assisted content, AI generators constantly evolve, so image inspection should be treated as an investigative signal rather than definitive proof.",
  },
  {
    question: "Is screenshot analysis 100% accurate?",
    answer:
      "No automated screenshot analysis is 100% accurate. Image compression, platform resizing, low resolution, and legitimate photo adjustments can obscure or mimic manipulation signals. Screenshot analysis provides helpful digital evidence and risk indicators to assist human evaluation, not unquestionable proof.",
  },
  {
    question: "How do I test if a screenshot is real or fake?",
    answer:
      "Start at the source: ask to see the message, post or payment live in the app, or check it yourself in your own account. Then add the screenshot to ScreenshotChecker to read its text, flag scam wording and contradictions, show metadata and highlight regions saved differently. No screenshot test can prove an image is genuine, but these steps tell you what to verify.",
  },
  {
    question: "Is there a free screenshot tester online?",
    answer:
      "Yes. ScreenshotChecker is a free screenshot tester that runs in your browser with no signup. Add or paste a screenshot to get extracted text, warning signs, metadata and an error level analysis view, each with a note on what it cannot tell you.",
  },
];
