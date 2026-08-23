export interface FaqItem {
  question: string;
  answer: string;
}

export const HOMEPAGE_FAQS: FaqItem[] = [
  {
    question: "What is a screenshot checker?",
    answer:
      "A screenshot checker is an online tool designed to examine screenshots and digital images for visible content, readable text, embedded metadata, visual inconsistencies, and potential signs of editing. Users rely on screenshot checking to investigate suspicious messages, inspect transaction receipts, review privacy risks, and extract text without uploading sensitive data to remote servers.",
  },
  {
    question: "Can I check a screenshot online for free?",
    answer:
      "Yes. ScreenshotChecker provides free screenshot checking directly in your web browser. Because all analysis algorithms, OCR routines, and forensic checks run locally on your device, you can analyze unlimited screenshots without paid subscriptions or account signups.",
  },
  {
    question: "Can a screenshot checker detect edited images?",
    answer:
      "A screenshot checker can identify visual editing signals such as compression differences across image regions, font inconsistencies, unnatural alignment, and altered metadata. However, automated analysis detects potential manipulation indicators rather than offering an absolute guarantee that an image has or has not been modified.",
  },
  {
    question: "What is the difference between a screenshot checker and screenshot analyzer?",
    answer:
      "The terms are often used interchangeably, but a screenshot checker typically emphasizes verifying authenticity and scanning for risks, while a screenshot analyzer performs broader structural breakdown including optical character recognition, metadata extraction, privacy auditing, and forensic analysis. ScreenshotChecker unites both capabilities in a single unified workflow.",
  },
  {
    question: "Can a screenshot checker verify a payment screenshot?",
    answer:
      "A screenshot checker can inspect payment receipts, bank transfer slips, and UPI screenshots for visual consistency, typography irregularities, and tampered digits. However, an image check cannot prove that money was actually deposited or cleared. Always verify transactions directly in your bank account or payment provider app.",
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
];
