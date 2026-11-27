export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogContentSection {
  heading: string;
  level?: 'h2' | 'h3';
  paragraphs: string[];
  figure?: {
    /** Zero-based paragraph index; the figure follows this paragraph. */
    afterParagraph: number;
    src: string;
    alt: string;
    width: number;
    height: number;
    caption: string;
  };
  checklist?: string[];
  callout?: {
    type: 'tip' | 'warning' | 'info' | 'golden-rule';
    text: string;
  };
  cta?: {
    label: string;
    url: string;
    description: string;
  };
}

export interface BlogArticle {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  category: 'Security' | 'Forensics' | 'AI & Forensics' | 'Privacy' | 'Threat Analysis';
  /** null is review-only: set the actual date in the authorized release commit. */
  publishedAt: string | null;
  updatedAt?: string;
  authorName?: string;
  readTime: string;
  excerpt: string;
  targetKeywords: string[];
  keyTakeaway: {
    title: string;
    text: string;
  };
  introduction: string;
  contentSections: BlogContentSection[];
  faq: BlogFAQ[];
  peopleAlsoSearch: string[];
  relatedSlugs: string[];
  cta: {
    label: string;
    url: string;
    description: string;
  };
  /** Content language; defaults to English. */
  lang?: 'en' | 'hi';
}

export const BLOG_ARTICLES: BlogArticle[] = [
  // =========================================================================
  // ARTICLE 1: Screenshot Checker Online
  // =========================================================================
  {
    "slug": "screenshot-checker-online",
    "title": "How to Check If a Screenshot Is Real or Edited",
    "seoTitle": "Is This Screenshot Real or Edited? A Verification Checklist",
    "metaDescription": "Check a suspicious screenshot with a five-step checklist, payment and chat examples, and clear limits of OCR, metadata and image analysis.",
    "category": "Security",
    "publishedAt": "2026-08-22",
    "updatedAt": "2026-09-23",
    "readTime": "6 min read",
    "excerpt": "A practical checklist for checking screenshot claims, with fictional US/UK payment examples and an explanation of what image tools cannot prove.",
    "targetKeywords": [
      "screenshot checker online",
      "is this screenshot real",
      "edited screenshot",
      "screenshot verification"
    ],
    "keyTakeaway": {
      "title": "Check the claim, not just the pixels",
      "text": "A clean-looking screenshot does not prove that a payment arrived, a message was sent, or an account belongs to the sender. Use image checks to decide what needs investigating, then verify important claims in the original app or with the organisation directly."
    },
    "introduction": "To check whether a screenshot is real or edited, first identify what it is supposed to prove. Preserve the original file, inspect the visible details, compare any extracted text with the image, and verify the claim independently. An image checker can help you notice inconsistencies; it cannot authenticate a bank transaction or recover the full context of a conversation.",
    "contentSections": [
      {
        "heading": "1. Write down the claim before opening an image tool",
        "figure": {
          "afterParagraph": 1,
          "src": "/images/blog/screenshot-checker-online/fictional-example.png",
          "alt": "Fictional payment screenshot showing $250.00 sent to Jordan Example, with three numbered notes on what the image cannot prove.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional example. Every field is text in an image; the claim it makes has to be checked in the receiver's own account."
        },
        "level": "h2",
        "paragraphs": [
          "Ask one specific question: did a buyer pay me, did this person send this message, or did an organisation publish this notice? These are different questions from whether someone edited the image. A genuine screenshot can show a pending payment, an old message or the wrong account.",
          "Record the amount, currency, date, account or username, and the action you are being asked to take. For example: “The buyer says they sent £180 and wants to collect the camera now.” Do not let a polished payment screen replace checking your own account."
        ]
      },
      {
        "heading": "2. Keep the original and protect private details",
        "level": "h2",
        "paragraphs": [
          "Keep the file as received, along with the surrounding messages and the time you received it. Work on a copy. Cropping, resizing and saving again can remove context or change the image data you want to inspect. Ask for the original file if you only have a compressed forward, but remember that an original file can still contain a false claim.",
          "Before sharing a screenshot publicly, cover account numbers, email addresses, addresses, verification codes and other identifying details on a separate copy. Use the <a href=\"/screenshot-redactor\">screenshot redactor</a> to apply solid masks and inspect the exported image. Automatic suggestions can miss information; review the whole image yourself. Follow the <a href=\"/blog/redact-screenshot-before-sharing/\">worked screenshot-redaction tutorial</a> for before-and-after examples and a saved-file checklist."
        ]
      },
      {
        "heading": "3. Inspect the image and check the extracted text",
        "level": "h2",
        "paragraphs": [
          "Read names, amounts and status labels at a comfortable zoom. Look for cropped context, inconsistent alignment or a digit that differs from nearby text. Treat these as questions to investigate, not a verdict. Different app versions, language settings, accessibility fonts and ordinary image resizing can change how a screen looks.",
          "Use the <a href=\"/screenshot-ocr\">screenshot text extractor</a> if small text is difficult to read or compare. Check each important value against the image: OCR can confuse 0 with O, 1 with l, and decimal separators. A transcription mistake is not evidence that the sender edited the screenshot.",
          "A phone status-bar time need not match the time of an older message or transaction. Compare the same kinds of timestamps before assuming that a difference is suspicious."
        ]
      },
      {
        "heading": "4. Understand what technical checks can and cannot establish",
        "level": "h2",
        "paragraphs": [
          "The <a href=\"/screenshot-metadata-checker\">metadata checker</a> can show fields that are present in the file. Missing metadata is not proof of editing. Metadata can be removed or changed, and a software name may reflect an ordinary export rather than deception.",
          "Compression views such as Error Level Analysis (ELA) highlight differences produced by recompression. They do not label a region as fraudulent or establish who changed it. A bright edge or unusual patch needs context; a clean result also cannot authenticate the underlying claim.",
          "ScreenshotChecker uses extracted text and reference patterns to identify possible concerns. It does not access bank records, authenticate a sender, or verify a payment reference with a payment provider. “No reliable reference match” means the reference check did not establish a match; it does not mean safe or genuine. If text scanning fails, retry with a readable image rather than treating the missing result as reassurance."
        ]
      },
      {
        "heading": "5. Verify in an independent source before acting",
        "level": "h2",
        "paragraphs": [
          "For a payment, open your own bank or payment app using your usual route. Check the incoming transaction, amount, currency and status, and follow the provider’s guidance about availability and seller protection. Do not use a login link supplied in the screenshot. If the payment is missing or unclear, pause the sale and contact the provider through its official support channel.",
          "The <a href=\"https://consumer.ftc.gov/consumer-alerts/2022/07/selling-stuff-online-heres-how-avoid-scam\">US Federal Trade Commission warns about fake payment notifications and bogus refund requests</a>. It also explains why a deposited cheque appearing in a balance does not establish that the cheque is genuine. A screenshot or an available balance is not a universal guarantee against reversal.",
          "In the UK, <a href=\"https://www.moneyhelper.org.uk/en/blog/scams-and-fraud/facebook-marketplace-scams-how-to-spot-fake-messages\">MoneyHelper describes fake payment-confirmation screenshots</a> and recommends checking your own account before handing over an item.",
          "For a chat, examine the conversation in your own account where possible and ask for the surrounding context. For a claimed public announcement, find it on the organisation’s official website or account. If the original source is unavailable, describe the screenshot as unverified rather than inventing a conclusion."
        ]
      },
      {
        "heading": "Three examples: suspicious, inconclusive and an innocent mismatch",
        "level": "h2",
        "paragraphs": [
          "These are fictional teaching examples, not screenshots submitted by real users or results from an accuracy benchmark.",
          "<strong>US sale: a $250 payment with a refund request.</strong> A buyer sends a convincing confirmation and asks you to return an alleged duplicate payment. Your own payment account shows no incoming transaction. The reason to stop is the unconfirmed payment and refund request, even if every pixel looks normal. Verify through the provider before sending money or releasing the item.",
          "<strong>UK collection: a £180 transfer marked pending.</strong> A buyer shows a banking screen and says the money will arrive later. The screenshot might be genuine, edited or taken from another transaction. It does not establish that you received the money. Wait for independent confirmation in your account rather than deciding from the image alone.",
          "<strong>A harmless OCR mismatch.</strong> The image reads $10.00, but extracted text reads $1000. Looking back at the image reveals a faint decimal point. Correct the transcription; do not accuse the sender based on the OCR output. Likewise, a chat sent at 09:10 can legitimately be captured at 10:45."
        ]
      },
      {
        "heading": "What to do when you still cannot verify it",
        "level": "h2",
        "paragraphs": [
          "Keep your conclusion specific: “I cannot confirm this payment,” “The original message is unavailable,” or “The text is too unclear to assess.” Do not publish an allegation just because an automated result looks suspicious. Save the original evidence and use the platform’s reporting or support process if needed.",
          "For the differences between individual checks, read <a href=\"/blog/screenshot-analyzer-online\">what a screenshot analyzer can actually detect</a>. If the screenshot contains a message asking you to sign in or send information, see the <a href=\"https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams\">FTC’s phishing guidance</a>: contact the organisation using a website or number you already know is genuine, rather than the details in the message."
        ]
      }
    ],
    "faq": [
      {
        "question": "Can a screenshot checker prove a screenshot is genuine?",
        "answer": "No. Image and text checks can highlight concerns but cannot authenticate the underlying payment, sender or conversation. Confirm important claims through the original service or a trusted independent source."
      },
      {
        "question": "Is missing metadata evidence of a fake screenshot?",
        "answer": "No. A screenshot may contain little metadata, and sharing or exporting can remove fields. Present metadata is not proof of authenticity either because it can be changed."
      },
      {
        "question": "Does a bright ELA result mean the image was edited?",
        "answer": "Not by itself. Recompression differences need context and can appear around ordinary image features. ELA cannot independently establish fraud, and an unremarkable result does not prove authenticity."
      },
      {
        "question": "Should I accept a payment screenshot from a buyer?",
        "answer": "Use it only as a claim to check. Open your own bank or payment app independently and verify the transaction and status. Follow your provider’s seller-protection guidance; a screenshot cannot guarantee receipt or prevent reversals."
      },
      {
        "question": "What does no reliable reference match mean?",
        "answer": "It means the reference-pattern check did not establish a reliable match. The content may be unfamiliar, incomplete or misread. It remains unverified; check the source independently."
      }
    ],
    "peopleAlsoSearch": [
      "How to verify a payment screenshot",
      "Can screenshots be edited?",
      "Screenshot metadata limitations",
      "How to check screenshot text"
    ],
    "relatedSlugs": ["screenshot-analyzer-online", "fake-whatsapp-chat-screenshot", "fake-social-media-post-screenshot", "exif-metadata", "smishing-fake-sms"],
    "cta": {
      "label": "Inspect a Screenshot",
      "url": "/screenshot-analyzer",
      "description": "Review extracted text and available signals, then confirm the claim independently."
    }
  },

  // =========================================================================
  // ARTICLE 2: Screenshot Analyzer Online
  // =========================================================================
  {
    "slug": "screenshot-analyzer-online",
    "title": "What Can a Screenshot Analyzer Actually Detect?",
    "seoTitle": "Screenshot Analysis: OCR, Metadata and ELA Explained",
    "metaDescription": "Understand screenshot OCR, metadata and ELA results, with fictional examples and practical next steps for missing, uncertain or failed checks.",
    "category": "Forensics",
    "publishedAt": "2026-08-22",
    "updatedAt": "2026-10-01",
    "readTime": "5 min read",
    "authorName": "Virat Chauhan",
    "excerpt": "How to interpret extracted text, metadata, compression maps and incomplete checks without mistaking image clues for proof.",
    "targetKeywords": [
      "screenshot analysis",
      "screenshot analyzer",
      "OCR limitations",
      "error level analysis"
    ],
    "keyTakeaway": {
      "title": "Start with the claim",
      "text": "Decide what the screenshot is meant to establish. Image checks can help you investigate, but confirming a sender, payment or event requires evidence beyond the image."
    },
    "introduction": "A screenshot analyzer can extract readable text, inspect available metadata and highlight changes caused by image recompression. These checks help identify questions to investigate. They cannot prove that a message was sent, a payment arrived or a screenshot is genuine. A failed check or missing result must remain unknown.",
    "contentSections": [
      {
        "heading": "What does ScreenshotChecker examine?",
        "figure": {
          "afterParagraph": 1,
          "src": "/images/blog/screenshot-analyzer-online/fictional-example.png",
          "alt": "Fictional forwarded chat screenshot with numbered notes showing what OCR, metadata and ELA can and cannot read.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional example of what each check looks at. Quiet results are normal for forwarded screenshots."
        },
        "paragraphs": [
          "The <a href=\"/screenshot-analyzer\">screenshot analyzer</a> combines OCR, text-based risk patterns, sensitive-data suggestions, metadata inspection and compression analysis. Each result has a different scope: a copied amount is a transcription, a flagged phrase is a pattern match, and a bright image region is a pixel difference. None authenticates the underlying claim.",
          "Keep the original file and record the question you want to answer. For a practical sequence from the initial claim to independent verification, use the <a href=\"/blog/screenshot-checker-online\">screenshot verification checklist</a>."
        ]
      },
      {
        "heading": "OCR extracts text but does not measure typography",
        "paragraphs": [
          "Use the <a href=\"/screenshot-ocr\">OCR workspace</a> to read and copy text, then compare important names, amounts and status labels with the image. OCR output is not evidence that the software measured a font family, icon placement or baseline shift.",
          "Tesseract documents recognition problems caused by noise, skew, borders and other input-quality issues. A missing decimal or confused character can be a transcription error rather than an edit. See <a href=\"https://tesseract-ocr.github.io/tessdoc/ImproveQuality.html\">Tesseract’s input-quality guidance</a>. Do not interpret an OCR confidence score as the probability that a screenshot is authentic."
        ]
      },
      {
        "heading": "Metadata describes fields present in the file",
        "paragraphs": [
          "The <a href=\"/screenshot-metadata-checker\">metadata inspector</a> can display available tags. A software name may reflect an ordinary export. An empty result cannot establish whether tags never existed, were removed or could not be read. Preserve the file you received rather than resaving it before inspection.",
          "Content Credentials are a separate provenance mechanism. The <a href=\"https://spec.c2pa.org/specifications/specifications/2.2/explainer/Explainer.html\">C2PA explainer</a> distinguishes verifiable provenance from whether depicted content is factual. A valid credential does not itself prove an event happened; missing credentials do not establish AI generation or manipulation."
        ]
      },
      {
        "heading": "ELA shows recompression differences rather than edited regions",
        "paragraphs": [
          "ScreenshotChecker’s compression analysis compares decoded pixels with a JPEG-resaved copy and amplifies the differences. The <a href=\"/image-manipulation-checker\">forensics workspace</a> exposes this view. Brightness depends on image content and recompression; it is not a label identifying fraud or the person who edited a region.",
          "The maker of <a href=\"https://29a.ch/photo-forensics/#forensic-error-level-analysis\">Forensically explains ELA</a> as a comparison with a recompressed image and warns that results can mislead. With a PNG screenshot, the JPEG conversion introduces its own differences; the map cannot reconstruct a history of earlier edits. Ordinary resaving can change a map, and an evenly compressed fabrication may have no conspicuous boundary."
        ]
      },
      {
        "heading": "How should you interpret an incomplete or quiet report?",
        "paragraphs": [
          "<strong>Check failed or unavailable:</strong> the check did not supply usable evidence. Retry with a readable original if appropriate, or use another verification route. Do not turn the failure into a clean result.",
          "<strong>No match:</strong> a completed reference check found no matching record within its available coverage. It does not establish safety or authenticity. If coverage is unavailable or incomplete, that limitation must remain part of the conclusion.",
          "<strong>Possible concern:</strong> inspect the specific text or region and consider innocent explanations. Several correlated clues can share one cause, such as resizing; counting them does not produce a calibrated fraud probability."
        ]
      },
      {
        "heading": "Three fictional examples and useful next steps",
        "paragraphs": [
          "These are synthetic teaching scenarios, not customer images, measured tool outputs or an accuracy benchmark.",
          "<strong>A support screenshot with a missing decimal:</strong> the image reads 10.00 but the transcript reads 1000. Compare the digits at a readable zoom and correct the transcript. The discrepancy alone does not establish tampering.",
          "<strong>A conversation with bright text edges:</strong> the compression map emphasizes a name on a plain background. Check the unprocessed image and surrounding conversation; do not treat brightness as proof that the name was pasted in.",
          "<strong>A screenshot with no metadata and a failed text scan:</strong> both checks leave gaps. Ask for a clearer original and seek the source conversation or announcement independently. Record the claim as unverified if the original source is unavailable."
        ]
      },
      {
        "heading": "What to record before drawing a conclusion",
        "paragraphs": [
          "Note which checks completed, what each actually observed, and what remains unknown. Keep conclusions specific: “the transcript needs correction” or “the source is unavailable” is more defensible than an unsupported real-or-fake verdict.",
          "For consequential claims, return to the original service or a trusted independent source. Preserve the original privately and review sensitive details before sharing a separate copy. This guide explains the checks; it does not certify an image or provide an accuracy percentage."
        ]
      }
    ],
    "faq": [
      {
        "question": "Can a screenshot analyzer prove a screenshot is genuine?",
        "answer": "No. It can extract text, inspect available metadata and highlight image differences, but it cannot authenticate the underlying sender, payment or event. Verify consequential claims independently."
      },
      {
        "question": "Does a bright ELA region prove that it was edited?",
        "answer": "No. ELA compares pixels with a recompressed version. Ordinary image features and resaving can produce differences, while some fabricated images may have no conspicuous boundary."
      },
      {
        "question": "Does missing metadata mean a screenshot is fake?",
        "answer": "No. An empty metadata result cannot establish whether fields never existed, were removed or could not be read. Missing fields leave uncertainty."
      },
      {
        "question": "What should I do when a check fails or finds no match?",
        "answer": "A failed or unavailable check leaves an evidence gap. A completed check with no match only describes its available reference coverage. Neither result establishes that the screenshot is safe or genuine."
      },
      {
        "question": "Do Content Credentials prove an image depicts the truth?",
        "answer": "No. C2PA credentials provide verifiable provenance within their trust model. They do not by themselves establish that the depicted event occurred, and missing credentials do not establish AI generation."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["screenshot-checker-online", "fake-whatsapp-chat-screenshot", "exif-metadata"],
    "cta": {
      "label": "Inspect a Screenshot",
      "url": "/screenshot-analyzer",
      "description": "Review extracted text and available signals, then check the original source."
    }
  },

  // =========================================================================
  // ARTICLE 3: Fake UPI Payment Screenshot
  // =========================================================================
  {
    "slug": "fake-upi-payment-screenshot",
    "title": "Fake UPI Payment Screenshot: How to Check If a Payment Is Real",
    "seoTitle": "Fake UPI Payment Screenshots: Checks and Warning Signs",
    "metaDescription": "Review warning signs in UPI payment screenshots and learn why confirming the transaction in your own bank or payment app matters more than an image.",
    "category": "Security",
    "publishedAt": "2026-08-22",
    "updatedAt": "2026-11-17",
    "authorName": "Virat Chauhan",
    "readTime": "6 min read",
    "excerpt": "Verify a claimed UPI payment against your own records, follow a fictional ₹500 seller example, and understand what screenshot text checks can and cannot establish.",
    "targetKeywords": [
      "fake UPI payment screenshot",
      "fake payment screenshot checker",
      "UPI payment verification",
      "fake PhonePe screenshot",
      "fake Google Pay screenshot",
      "payment screenshot verification"
    ],
    "keyTakeaway": {
      "title": "Confirm the credit in your own records",
      "text": "A payment screenshot is a claim, not confirmation that you received money. Open your own official bank or payment app independently and match the incoming transaction. If you cannot find the credit, treat the payment as unconfirmed, not automatically fraudulent."
    },
    "introduction": "To check whether a UPI payment reached you, start with your own transaction history and bank records. A success banner, familiar logo or plausible reference in someone else’s screenshot cannot confirm receipt. Screenshot analysis can help you review a claim, but it cannot access the banking network, authenticate a payment app or establish that a person is lying. If someone asks you for a payment screenshot with the date, time and UTR, the UTR is the part worth checking: the person who was paid should find the same reference in their own bank records.",
    "contentSections": [
      {
        "heading": "How to Verify a UPI Payment: Start With Your Own Records",
        "paragraphs": [
          "Open the official app yourself rather than following a link supplied with the screenshot. <a href=\"https://www.phonepe.com/blog/trust-and-safety/heres-a-quick-guide-to-help-you-avoid-becoming-a-victim-of-fake-payment-screenshots-2/\" class=\"text-primary font-medium underline hover:text-primary-active\">PhonePe’s fake-screenshot guidance</a> recommends checking transaction history before providing goods or services.",
          "<a href=\"https://support.google.com/pay/india/answer/16919844?hl=en\" class=\"text-primary font-medium underline hover:text-primary-active\">Google Pay’s bank-statement guide</a> explains how to compare the transaction date, ID and credit amount with official bank records. Use your bank’s own reference labels; a particular digit count is not an authenticity test."
        ],
        "checklist": [
          "Open your own bank app or payment/merchant app and locate incoming transaction history.",
          "Find the claimed amount and date. Confirm that the recipient account or UPI ID is yours.",
          "Compare the transaction reference with the corresponding entry in your official records, where available.",
          "If the app history is unclear or no matching credit appears, check your bank statement or contact the bank through its official support channel.",
          "Treat a missing or unresolved credit as unconfirmed. Keep goods, services or refunds on hold while it is checked."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "<strong>Never release goods, services, refunds or money based only on a screenshot.</strong> A sender’s debit claim is not independent confirmation of a credit to you. केवल payment screenshot देखकर सामान, सेवा, refund या पैसे जारी न करें। अपने आधिकारिक बैंक ऐप या बैंक से पुष्टि करें।"
        }
      },
      {
        "heading": "Worked Example: A Fictional ₹500 Sale",
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/fake-upi-payment-screenshot/fictional-example.png",
          "alt": "Fictional UPI receipt for ₹500 to Sharma General Store with status Processing, annotated with four checks.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. The fictional ₹500 sale. The seller confirms the credit in their own UPI app, not on the buyer's phone."
        },
        "paragraphs": [
          "<strong>This is a fictional teaching example, not a real customer case or a checker accuracy test.</strong> A seller is waiting for ₹500 for an order. The buyer sends an image saying “Transaction Successful,” showing ₹500, the seller’s name and a transaction reference. Those are the screenshot’s claims; no payment has been verified yet.",
          "<strong>Check 1: identify the claim.</strong> The seller notes the amount, payment date, intended recipient and reference from the image. They compare any OCR output with the image before using it, because a misread digit could lead to the wrong transaction.",
          "<strong>Check 2: verify independently.</strong> The seller opens their own official payment history and bank records. They look for a ₹500 incoming credit on the claimed date, confirm the recipient account, and compare the reference where their records expose it. A different ₹500 payment from another order does not resolve this one.",
          "<strong>Outcome A: a matching credit is found.</strong> The seller has evidence from their own records that the payment reached the intended account. The screenshot’s appearance was not what established this.",
          "<strong>Outcome B: no matching credit is found.</strong> The payment remains unconfirmed. The seller pauses fulfilment and asks the buyer to check the transaction in their official app or with their bank. A processing delay or wrong recipient needs investigation; missing credit alone does not prove that the buyer forged the image."
        ]
      },
      {
        "heading": "Benign Differences That Are Not Proof of Fraud",
        "paragraphs": [
          "<strong>A balance screen is a different kind of claim.</strong> Text such as “Bank balance fetched successfully” is not a receipt for this sale. Someone may have shared the wrong screen by mistake. The image also cannot authenticate the displayed balance or establish that those funds are currently available.",
          "<strong>Capture time is not payment time.</strong> A receipt may be opened and captured later. A status-bar clock and a transaction timestamp can therefore differ without deception. Cropping, clock settings and missing date context further limit what that comparison can establish.",
          "<strong>OCR can change the apparent evidence.</strong> A blurred digit may be read incorrectly, and a nearby graphic may become a symbol inside extracted bank-name text. Compare the original image before treating a text-rule warning as meaningful.",
          "<strong>Not every number is the payment amount.</strong> A receipt can include an account balance, fee or another amount with a different label. Check what each value describes before interpreting an amount-mismatch warning. The checker can misclassify screens or fields."
        ]
      },
      {
        "heading": "What the Payment Screenshot Checker Actually Does",
        "paragraphs": [
          "The <a href=\"/payment-screenshot-checker/\" class=\"text-primary font-medium underline hover:text-primary-active\">Payment Screenshot Checker</a> uses OCR to read text, then applies configured text rules. It attempts to classify the screen, extract payment fields and flag certain amount or reference-format patterns. Missing, unfamiliar or poorly read fields can be missed or misinterpreted.",
          "Its app labels are inferred from text such as provider names or supported UPI handles. A PhonePe, Google Pay, Paytm, BHIM or Pop UPI label does not authenticate the app, certify its interface or establish that the receipt came from that provider.",
          "<strong>The payment text rules do not measure font families, icon positions, logo accuracy or layout alignment.</strong> A “Banking name” label or symbol in OCR text is not a measured typography defect. The rules also do not contact your bank or validate a reference against a live transaction database.",
          "A reference-format warning is a prompt to inspect the original and compare official records. A plausible-looking reference can be copied, while OCR can shorten or corrupt a genuine one. Neither matching a digit pattern nor failing it establishes whether money arrived."
        ],
        "cta": {
          "label": "Review a Payment Screenshot",
          "url": "/payment-screenshot-checker/",
          "description": "Inspect extracted receipt text and rule warnings, then verify the transaction independently."
        }
      },
      {
        "heading": "How to Interpret a Checker Result",
        "paragraphs": [
          "Labels such as LOW RISK, CAUTION, SUSPICIOUS and HIGH RISK summarize weighted rule matches. They are not calibrated probabilities that a screenshot is genuine or fraudulent. There is no validated accuracy percentage presented in this guide.",
          "LOW RISK means few configured text rules matched; it does not mean the image was proved unedited. A higher-risk result means you should review the cited text and context, not accuse the sender based on the label.",
          "A Payment Proof Strength label such as STRONG VISUAL describes the fields the classifier recognized. Despite that wording, it is not a measurement of visual authenticity or banking settlement. A balance, request, failed or unreadable screen is also not evidence that you received this payment.",
          "If extraction fails or useful fields are absent, return to the original image and official records. An incomplete check must not be treated as a clean result. A convincing screenshot can still describe a different recipient or an older transaction."
        ]
      },
      {
        "heading": "What If the Sender Was Debited but You Have No Credit?",
        "paragraphs": [
          "Ask the sender to open the transaction details in their official app and confirm the recipient. Follow that provider’s guidance for the actual status, rather than using a screenshot to diagnose what happened.",
          "<a href=\"https://support.google.com/pay/india/answer/16920039?hl=en-IN\" class=\"text-primary font-medium underline hover:text-primary-active\">Google Pay’s transaction-status guidance</a> distinguishes processing, failed and successful-but-not-received cases. It advises against repeating a payment while it is processing. Its stated timelines depend on the status; they are not a universal refund deadline for every UPI app or bank.",
          "Keep the transaction reference for official support. Do not promise a reversal within a fixed number of hours or ask the buyer to pay again merely because a screenshot checker raised a warning. The receiving-side decision remains whether the claimed credit is confirmed in your own records."
        ]
      },
      {
        "heading": "Share Evidence Carefully and Escalate Through Official Support",
        "paragraphs": [
          "If you need help resolving the transaction, use the support route inside your bank or payment app. PhonePe’s linked safety guide includes its official reporting options. Preserve the original image and transaction details for that process; a checker result alone is not proof of a crime.",
          "For a public post or discussion, make a separate copy with unnecessary names, UPI IDs and account details hidden. Follow the <a href=\"/blog/redact-screenshot-before-sharing/\" class=\"text-primary font-medium underline hover:text-primary-active\">worked redaction guide</a> and review the exported copy. Read the <a href=\"/privacy/\" class=\"text-primary font-medium underline hover:text-primary-active\">privacy policy</a> before using a tool with sensitive material."
        ]
      }
    ],
    "faq": [
      {
        "question": "Someone asked for a payment screenshot with the date, time and UTR. What should it show?",
        "answer": "A UPI receipt normally shows the amount, the date and time, the payee's name or UPI ID, the status and a 12-digit reference number (UTR or RRN). If you are being paid, ask for the UTR and search for it in your own bank statement or app; the screenshot alone proves nothing. If you are sending one, share it only with someone you actually paid, crop out your balance, and never share your UPI PIN or an OTP. Be careful when a stranger asks for payment screenshots as part of an online task job or a refund."
      },
      {
        "question": "Can a payment screenshot prove that I received money?",
        "answer": "No. Confirm the corresponding incoming credit in your own official bank or payment records. A screenshot and a sender’s debit claim cannot independently establish receipt."
      },
      {
        "question": "Can I check a PhonePe, Google Pay or Paytm screenshot?",
        "answer": "You can use the checker to inspect readable receipt text and configured rule warnings. Provider labels are text-based guesses, not app authentication. Fonts, icons and logos are not verified by the payment text rules."
      },
      {
        "question": "Does a missing credit mean the screenshot is fake?",
        "answer": "No. It means receipt of that payment is unconfirmed. Check the recipient and official transaction status, then use bank or provider support if needed. A delay, failed payment or wrong recipient can require investigation without proving deception."
      },
      {
        "question": "Does a valid-looking UPI reference prove a payment is real?",
        "answer": "No. A reference can be copied, and OCR can misread it. Compare it with your official transaction record. Digit-count or formatting checks do not authenticate the transaction."
      },
      {
        "question": "Why is a bank balance screenshot not payment proof?",
        "answer": "It claims to show a balance, not a transfer to you. The screenshot does not authenticate that balance, prove current funds are available or confirm an incoming credit."
      },
      {
        "question": "How accurate is a fake payment screenshot checker?",
        "answer": "This checker uses OCR and weighted text rules, not a calibrated authenticity test. It can miss problems or flag benign content. No risk label or proof-strength label replaces verification through your own bank records."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["what-is-utr-number", "qr-code-scam", "scam-statistics", "payment-failed-screenshot-scam", "fake-payment-screenshot-kaise-pehchane", "screenshot-checker-online", "fake-payment-screenshot-paypal-venmo-cash-app", "screenshot-analyzer-online", "redact-screenshot-before-sharing"],
    "cta": {
      "label": "Review a Payment Screenshot",
      "url": "/payment-screenshot-checker/",
      "description": "Use OCR-based checks as an aid to review. Confirm any claimed payment through your own official records."
    }
  },

  // =========================================================================
  // ARTICLE 4: AI Image Detector Online
  // =========================================================================
  {
    slug: 'ai-image-detector-online',
    title: 'AI Image Detector Online: How AI-Generated Images Are Detected',
    seoTitle: 'AI Image Detector Online: How AI Media Is Detected',
    metaDescription:
      'Learn how AI image detectors analyze visual patterns, metadata, C2PA Content Credentials, editing signals, text rendering, and other evidence.',
    category: 'AI & Forensics',
    publishedAt: '2026-08-22',
    readTime: '6 min read',
    excerpt:
      'Understanding generative AI detection: visual synthetic signals, typography artifacts, frequency energy anomalies, and cryptographic C2PA Content Credentials.',
    targetKeywords: [
      'AI image detector online',
      'AI image detector',
      'AI image detector free',
      'AI generated image detector',
      'detect AI images',
      'AI image detection',
    ],
    keyTakeaway: {
      title: 'Evidence-Based & Probabilistic Analysis',
      text: 'Visual AI detection is evidence-based and probabilistic. Cryptographically signed C2PA Content Credentials provide definitive provenance when present, but absence of C2PA metadata does not prove an image is authentic.',
    },
    introduction:
      'Modern generative models like Midjourney, DALL-E, Stable Diffusion, and Flux can generate photo-realistic portraits, digital artwork, and synthetic scenes in seconds. As synthetic media becomes more sophisticated, distinguishing computer-generated imagery from optical photographs requires a multi-layered forensic approach combining visual inspection, frequency analysis, and cryptographic provenance.',
    contentSections: [
      {
        heading: 'Why AI-Generated Images Are Challenging to Identify',
        level: 'h2',
        paragraphs: [
          'Early generative models produced obvious glitches such as six-fingered hands or warped faces. Today\'s diffusion and transformer architectures produce photorealistic skin textures, accurate reflections, and natural depth of field.',
          'Because the visual output closely mirrors real photography, modern detection tools look beyond surface aesthetics and inspect mathematical pixel properties, compression behaviors, and container credentials.',
        ],
      },
      {
        heading: 'Key Visual Indicators in Synthetic Images',
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/ai-image-detector-online/fictional-example.png",
          "alt": "Fictional AI image detector report listing four signals: no content credentials, no camera metadata, smooth texture and garbled sign text.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional report. Each signal is weighed separately; together they point to checking where the image came from."
        },
        level: 'h2',
        paragraphs: [
          '1. Typographic Rendering Anomalies: Generative diffusion models often struggle with complex letterforms and background signage, producing distorted characters, non-dictionary consonant clusters, or illegible logos.',
          '2. Bimodal Texture Distribution: Synthetic visuals frequently exhibit an unnatural combination of mathematically flat, over-smoothed planar surfaces alongside localized clusters of hyper-sharp micro-detail.',
          '3. Fine Geometric and Symmetry Errors: Check subtle physical details such as eye specular reflection consistency, teeth alignment, earring symmetry, and eyeglasses frame geometry.',
          '4. Lighting and Shadow Inconsistencies: Notice whether shadows cast by multiple objects align with a single coherent light source or whether diffuse background ambient lighting contradicts foreground highlights.',
        ],
        callout: {
          type: 'info',
          text: 'Visual detection is probabilistic. No automated heuristic checker should ever claim 100% infallible accuracy for generative images.',
        },
      },
      {
        heading: 'C2PA Content Credentials: Cryptographic Provenance',
        level: 'h2',
        paragraphs: [
          'The Coalition for Content Provenance and Authenticity (C2PA) is an open technical standard that cryptographically signs digital assets at the point of creation or editing.',
          'When an image is created using compliant generative AI tools (such as Adobe Firefly or DALL-E), a cryptographically signed manifest is embedded in the file container declaring the digital source type (trainedAlgorithmicMedia) and the software generator.',
          'When valid C2PA credentials are present, an image can be verified with cryptographic certainty.',
        ],
      },
      {
        heading: 'Understanding "No C2PA Found"',
        level: 'h2',
        paragraphs: [
          'It is crucial to understand that the absence of C2PA credentials does NOT prove an image is real or fake.',
          'Most social media platforms (such as X/Twitter, Instagram, and WhatsApp) automatically strip metadata and C2PA containers when images are uploaded or compressed for mobile delivery.',
          'When C2PA metadata is missing, detectors fall back to multi-signal visual forensics, frequency spectrum analysis, and typography inspection.',
        ],
      },
    ],
    faq: [
      {
        question: 'Can AI-generated images be detected reliably?',
        answer:
          'Yes, through a combination of cryptographic C2PA Content Credentials, text rendering analysis, texture frequency inspection, and Error Level Analysis. However, visual detection is probabilistic and should be treated as evidence rather than absolute proof.',
      },
      {
        question: 'What are C2PA Content Credentials?',
        answer:
          'C2PA Content Credentials are tamper-evident cryptographic metadata embedded in an image file that record its origin, creation tools, editing history, and whether generative AI was used.',
      },
      {
        question: 'Does "No Content Credentials found" mean the image is real?',
        answer:
          'No. Most web platforms and messaging apps strip metadata during upload. The absence of C2PA credentials simply means provenance cannot be cryptographically verified from the file container.',
      },
      {
        question: 'What visual clues give away AI-generated images?',
        answer:
          'Look for distorted background text, inconsistent eye reflections, unnaturally smooth skin combined with hyper-detailed hair, asymmetrical accessories, and lighting directions that contradict cast shadows.',
      },
    ],
    peopleAlsoSearch: [
      'AI image detector online',
      'Best AI image detector',
      'AI image detector free',
      'AI image detector Google',
      'AI image detector project',
      'AI image detector Hive',
      'AI image detector remover',
      'Winston AI image detector',
    ],
    relatedSlugs: ["how-to-tell-if-an-image-is-ai-generated", "how-to-tell-if-a-photo-is-edited", "fake-social-media-post-screenshot", "exif-metadata", "screenshot-analyzer-online", "screenshot-checker-online"],
    cta: {
      label: 'Analyze an Image',
      url: '/ai-image-detector',
      description: 'Inspect images for C2PA Content Credentials, frequency metrics, and visual synthetic indicators.',
    },
  },

  // =========================================================================
  // ARTICLE 5: EXIF Metadata
  // =========================================================================
  {
    "slug": "exif-metadata",
    "title": "What Is EXIF Metadata? Check Photos and Screenshots Before Sharing",
    "seoTitle": "EXIF Metadata: Check Photos and Screenshots Before Sharing",
    "metaDescription": "Learn what EXIF and PNG metadata can reveal, why screenshots still need review, and how to inspect, remove and recheck image data before sharing.",
    "category": "Privacy",
    "publishedAt": "2026-08-22",
    "updatedAt": "2026-10-01",
    "authorName": "Virat Chauhan",
    "readTime": "7 min read",
    "excerpt": "Separate hidden image metadata from visible private details, inspect a sharing copy, and verify what remains after export.",
    "targetKeywords": [
      "EXIF metadata",
      "screenshot metadata",
      "photo location metadata",
      "remove image metadata"
    ],
    "keyTakeaway": {
      "title": "Check the file you will actually share",
      "text": "Review both embedded metadata and visible details. Keep the original privately, make a separate sharing copy, and inspect that exact saved file after cleaning it. A missing GPS field or an empty metadata result is not a privacy guarantee."
    },
    "introduction": "EXIF metadata is information stored inside an image file, such as camera settings, timestamps and sometimes location coordinates. What is present depends on the device, permissions, software and export path. Screenshots need checking too: they may lack camera EXIF while still carrying other metadata or exposing private details in the pixels.",
    "contentSections": [
      {
        "heading": "EXIF is only one part of image privacy",
        "paragraphs": [
          "EXIF stands for Exchangeable Image File Format. It can describe how an image was captured, including camera make or model, exposure settings and a recorded date. Location fields may be present when the capture app has permission and writes them. Do not assume every image contains GPS, a device serial number or a complete editing history.",
          "For sharing, separate three kinds of information. A metadata remover addresses the first; it does not automatically address the other two."
        ],
        "checklist": [
          "Embedded metadata: fields stored inside the image file, such as EXIF, XMP, IPTC or PNG text. Not every field is sensitive; dimensions and color information can be useful.",
          "Visible pixels: names, messages, addresses, faces, maps, notifications and other details someone can read or recognize in the image.",
          "Information outside the file: its filename, surrounding message, shared-album context and account or upload information a service may hold. Cleaning an image does not erase information already held elsewhere."
        ]
      },
      {
        "heading": "Do screenshots contain EXIF or location data?",
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/exif-metadata/fictional-example.png",
          "alt": "Fictional EXIF table for a camera photo showing device model, capture time, GPS coordinates and editing software.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. Fictional EXIF fields from a camera photo. A screenshot of the same photo would not carry them."
        },
        "paragraphs": [
          "A screenshot records a display rather than taking a new camera exposure, so it may not have the camera or lens fields found in a photo. That is not a rule that screenshots contain no EXIF or GPS. The actual file can be changed, annotated or converted by software after capture.",
          "PNG is not a metadata-free format. The <a href=\"https://www.w3.org/TR/png-3/#11eXIf\">W3C PNG specification defines an eXIf chunk</a>, and its <a href=\"https://www.w3.org/TR/png-3/#11textinfo\">text chunks</a> can carry comments and other descriptions. Android’s <a href=\"https://developer.android.com/reference/androidx/exifinterface/media/ExifInterface\">ExifInterface documentation</a> also lists PNG among the formats it can read and write EXIF tags in. These are format capabilities, not evidence that a particular phone writes those fields into every screenshot.",
          "A screenshot of a map, delivery address or photo information panel can reveal location directly in the pixels. Removing a GPS tag would not hide those details. Conversely, a location field describes a recorded value; it does not establish where the sender is now or prove the image is genuine."
        ]
      },
      {
        "heading": "1 Inspect the exact image file",
        "paragraphs": [
          "Keep the original separately, especially if it may be needed as evidence. Open the <a href=\"/screenshot-metadata-checker/\">screenshot metadata checker</a>, choose <strong>Select Image to Inspect</strong>, and select the file you intend to share. Check that the preview and filename identify the right copy.",
          "Review the technical records for location coordinates, dates, device or software labels, author details and comments. A software label is a clue about a tool that wrote a field, not a complete edit log. Metadata can be changed, copied or removed; it cannot authenticate a payment or conversation.",
          "Treat an empty result as inconclusive. The current checker can return empty records when data is absent, unsupported or fails to parse. Missing parser data is not proof that all metadata is absent. For a consequential disclosure, use an additional trusted tool that supports the file format, and do not share if the uncertainty matters.",
          "The checker processes the image in your browser. The <a href=\"/privacy/\">privacy policy</a> separately explains website analytics, resource requests and browser storage, including image handoffs between tools. Browser-local image processing does not mean the whole website makes no network requests."
        ]
      },
      {
        "heading": "2 Make a separate copy without unwanted metadata",
        "paragraphs": [
          "Open the <a href=\"/image-metadata-remover/\">image metadata remover</a> and select the image. The checker and remover use the same metadata workspace. After the preview loads, choose <strong>Strip &amp; Clean Image</strong> to download a new PNG. This path redraws the decoded image into a canvas and encodes a new file rather than copying the source metadata fields.",
          "Inspect the download before relying on it. Re-encoding is not a promise that the result contains no metadata of any kind; an encoder may write new technical fields. Check appearance, dimensions and the specific private fields you meant to remove. Keep the original unchanged.",
          "For photos in Apple Photos, Apple documents a separate location-sharing control: choose Share, open Options and turn off Location on iPhone or iPad. Its <a href=\"https://support.apple.com/guide/personal-safety/manage-location-metadata-in-photos-ips0d7a5df82/web\">location metadata guide</a> also explains reviewing and removing recorded locations and limiting future Camera location access. These controls concern location information; they do not hide visible details or establish that every other metadata field is removed."
        ]
      },
      {
        "heading": "3 Recheck metadata and visible details after export",
        "paragraphs": [
          "Reopen the downloaded PNG, then choose <strong>Change Image</strong> in the checker and select that downloaded file. Compare the fields you were concerned about with the original. Opening the original again would tell you nothing about whether the sharing copy was cleaned.",
          "Review the full image at a readable zoom. If private text is visible, use the <a href=\"/blog/redact-screenshot-before-sharing/\">worked screenshot redaction tutorial</a> to apply solid masks and inspect the saved result. Metadata removal does not cover text, faces or location clues in the pixels.",
          "That tutorial uses actual before-and-after files from one fictional PNG test. The source contained a deliberately added PNG Comment marker; the checked redaction export did not. The source contained no EXIF payload, so this was not an EXIF-removal test, nor a test of the metadata remover’s export path. It illustrates why the exact input, output and field checked matter; it does not establish universal removal across formats or tools.",
          "If you resize, annotate or convert the copy later, review the resulting file again. Give it a non-sensitive filename and confirm that you attach the cleaned copy rather than the original."
        ]
      },
      {
        "heading": "Will a messaging or social app strip metadata for me?",
        "paragraphs": [
          "Do not base a privacy decision on a blanket platform rule. Processing can differ between a displayed image, an original-file attachment, a download and a sharing option, and behavior can change. This guide does not certify the current stripping behavior of any messaging or social service.",
          "Prepare the sharing copy before uploading it. If the delivery path matters, test that path with a harmless sample and inspect the recipient-accessible download. A public copy with fewer fields does not establish what the service received or retained. Cleaning a file now also does not recall an original you already sent."
        ]
      },
      {
        "heading": "Before sharing a photo or screenshot",
        "paragraphs": [],
        "checklist": [
          "Keep the original privately and identify the exact sharing copy.",
          "Inspect embedded fields and treat missing or unreadable results as inconclusive.",
          "Remove unwanted metadata and cover visible private details separately.",
          "Reopen the final saved file and check it again after any further editing.",
          "Check the filename, recipient, sharing context and attachment before sending."
        ]
      }
    ],
    "faq": [
      {
        "question": "Do all photos contain GPS coordinates?",
        "answer": "No. Location fields depend on capture permissions, device and app behavior, and later processing. When coordinates are present, they may reveal a recorded location. Their absence does not hide location clues visible in the image."
      },
      {
        "question": "Can a PNG screenshot contain EXIF metadata?",
        "answer": "Yes. PNG supports an eXIf chunk as well as text chunks. A screenshot may lack camera EXIF, but its filename or extension alone does not establish which fields are present. Inspect the actual file."
      },
      {
        "question": "Does an empty metadata result mean an image is safe to share?",
        "answer": "No. Data may be absent, unsupported or unreadable by that parser. Empty records are not proof that all metadata is absent, and the pixels can still expose private information."
      },
      {
        "question": "Does removing metadata redact visible text?",
        "answer": "No. Metadata removal and visible redaction are separate steps. Use solid masks for private details in the image, then inspect both the saved pixels and metadata before sharing."
      },
      {
        "question": "Does taking a screenshot guarantee that photo metadata is removed?",
        "answer": "No. A new screenshot may omit source camera fields, but its own metadata and visible content still need review. Do not treat recapturing an image as a universal metadata-removal or privacy guarantee."
      },
      {
        "question": "Can EXIF prove that an image is genuine?",
        "answer": "No. Metadata can be changed, copied or removed. Use it as a clue and verify important claims at their source; neither the presence nor absence of EXIF authenticates a screenshot."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["how-to-tell-if-a-photo-is-edited", "how-to-tell-if-a-photo-is-a-screenshot", 
      "redact-screenshot-before-sharing",
      "screenshot-analyzer-online",
      "screenshot-checker-online"
    ],
    "cta": {
      "label": "Inspect your image metadata",
      "url": "/screenshot-metadata-checker/",
      "description": "Review available fields, make a separate sharing copy, and recheck the saved file before sending it."
    }
  },

  // =========================================================================
  // ARTICLE 6: Smishing
  // =========================================================================
  {
    slug: 'smishing-fake-sms',
    title: 'Smishing: How Fake SMS and WhatsApp Messages Trick You',
    seoTitle: 'Smishing: How Fake SMS and WhatsApp Messages Trick You',
    metaDescription:
      'Learn how fake bank, delivery, toll, job, and reward messages use urgency, suspicious links, threats, and attachments to trick people.',
    category: 'Threat Analysis',
    publishedAt: '2026-08-22',
    readTime: '6 min read',
    excerpt:
      'Analyzing modern SMS and WhatsApp scams: bank KYC threats, malicious APK downloads, fake delivery fees, toll fines, and how to verify messages safely.',
    targetKeywords: [
      'smishing',
      'fake SMS',
      'fake bank SMS',
      'fraud SMS',
      'fake WhatsApp message',
      'SMS scam',
      'phishing SMS',
    ],
    keyTakeaway: {
      title: 'Zero-Trust Communication Rule',
      text: 'Never click links, download attachments, or call phone numbers contained in unsolicited SMS or WhatsApp messages. Always verify claims through official banking apps or verified websites directly.',
    },
    introduction:
      'Smishing (short for SMS phishing) is one of the fastest-growing cyber threats worldwide. Fraudsters send deceptive text messages and WhatsApp notifications designed to create panic, urgency, or excitement. By posing as trusted institutions like banks, postal couriers, toll agencies, or government departments, attackers trick recipients into disclosing passwords, paying fake fees, or installing malware.',
    contentSections: [
      {
        heading: 'What Is Smishing?',
        level: 'h2',
        paragraphs: [
          'Smishing is a social engineering attack delivered through mobile messaging channels (SMS, WhatsApp, Telegram, or RCS).',
          'Unlike email phishing, which often ends up in spam filters, mobile text messages land directly in personal notification feeds, where users are more likely to respond quickly on mobile devices with smaller screens.',
        ],
      },
      {
        heading: 'Most Common Smishing Scams Today',
        level: 'h2',
        paragraphs: [
          '1. Bank KYC & Account Lockout Threats: Messages claiming your bank account or debit card will be blocked unless you complete immediate ReKYC verification. Scammers often attach an APK file or direct you to a lookalike phishing login page.',
          '2. Missed Delivery & Parcel Reschedule Scams: Notifications claiming a package from UPS, FedEx, or USPS could not be delivered due to an incorrect address or unpaid ₹35 / $2 redelivery fee. In India these often impersonate India Post: see <a href="/blog/india-post-courier-sms-scam/">how to check an India Post or courier address SMS</a>.',
          '3. Toll Violation & DMV License Threats: Messages claiming outstanding toll balances (SunPass, E-ZPass) with aggressive threats of driver\'s license non-renewal and legal fines. More detail: <a href="/blog/unpaid-toll-text-scam/">unpaid toll text scams</a>.',
          '4. WhatsApp Job & Review Tasks: Unsolicited job recruitment messages offering unrealistic compensation (e.g. $10 per review) for writing Google reviews or rating products. These usually end with a deposit request: see <a href="/blog/whatsapp-telegram-task-job-scam/">WhatsApp and Telegram task job scams</a>.',
          'Electricity Disconnection Threats: SMS or WhatsApp messages claiming your power will be cut tonight unless you call an "electricity officer" or pay through a link. See <a href="/blog/electricity-bill-disconnection-sms-scam/">electricity bill disconnection SMS scams</a>.',
          '5. Fake Gift Cards & Lottery Rewards: Unsolicited notifications claiming you won a $500 Target or Amazon gift card requiring a link click to claim.',
        ],
        callout: {
          type: 'warning',
          text: 'Banks and government agencies NEVER distribute Android APK files via SMS or WhatsApp, nor do they threaten instant account cancellation over text.',
        },
      },
      {
        heading: 'Key Red Flags to Spot in Suspicious Messages',
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/smishing-fake-sms/fictional-example.png",
          "alt": "Fictional smishing text claiming a bank account is suspended, with a lookalike link and a request for a code, annotated with red flags.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional smishing text. Urgency, a lookalike link and a request for a code are the three signs to look for."
        },
        level: 'h2',
        paragraphs: [
          '• High-Pressure Urgency: Phrases like "Urgently Required," "Final Warning," or "Account Blocked Today" are designed to bypass critical thinking.',
          '• Suspicious & Shortened Links: Domain names that mimic real brands using hyphens or typos (e.g., myparcel-ups.com instead of ups.com) or masked bit.ly shorteners.',
          '• File Attachments (.apk, .exe, .zip): Direct requests to install an application file to complete verification or receive a refund.',
          '• Random Callback Phone Numbers: Demands to dial an unverified standard phone number to "verify your identity" (voice phishing / vishing).',
          '• Requests for OTPs or PINs: Any message asking you to reply with or share a verification code received on your device.',
        ],
      },
      {
        heading: 'How to Verify Messages Independently',
        level: 'h2',
        paragraphs: [
          'Whenever you receive an urgent message regarding banking, delivery, or fines, follow the golden rule of verification:',
          '1. Close the message without clicking any links or calling provided numbers.',
          '2. Open your official banking app, courier app, or government portal independently.',
          '3. If in doubt, call the official customer service number printed directly on the back of your bank debit card or on your original billing statement.',
        ],
      },
    ],
    faq: [
      {
        question: 'What is a smishing message?',
        answer:
          'Smishing is an SMS or mobile messaging scam where fraudsters impersonate banks, delivery companies, or government agencies to trick you into clicking malicious links or sharing personal data.',
      },
      {
        question: 'How can I identify a fake bank SMS?',
        answer:
          'Fake bank SMS messages often come from personal 10-digit mobile numbers rather than official bank shortcodes, use urgent threats of account blocking, ask you to download APK files, or include suspicious external links.',
      },
      {
        question: 'Should I click a link in a suspicious text message to unsubscribe?',
        answer:
          'No. Clicking any link in a spam or phishing message confirms that your phone number is active and may redirect you to a malicious site. Simply delete and block the sender.',
      },
      {
        question: 'Can WhatsApp messages be used for smishing and phishing?',
        answer:
          'Yes. Scammers frequently use WhatsApp to send fake job offers, bank KYC alerts, investment schemes, and malicious APK attachments from unknown international numbers.',
      },
    ],
    peopleAlsoSearch: [
      'Smishing scam examples',
      'How to spot fake bank SMS',
      'Fake delivery text message',
      'WhatsApp scam message checker',
      'Report phishing SMS',
      'Fraud SMS detector',
    ],
    relatedSlugs: ["fake-amazon-flipkart-refund-scam", "trai-sim-block-call-scam", "e-challan-sms-scam", "scam-statistics", "usps-redelivery-text-scam", "india-post-courier-sms-scam", "unpaid-toll-text-scam", "whatsapp-telegram-task-job-scam", "suspicious-link-checker-online"],
    cta: {
      label: 'Check a Suspicious Message',
      url: '/',
      description: 'Upload a screenshot of any suspicious SMS or WhatsApp message for real-time scam pattern detection.',
    },
  },

  // =========================================================================
  // ARTICLE 7: Suspicious Link Checker Online
  // =========================================================================
  {
    slug: 'suspicious-link-checker-online',
    title: 'Suspicious Link Checker Online: How to Check If a Link or Domain Is Safe',
    seoTitle: 'Suspicious Link Checker Online: Check URL Safety',
    metaDescription:
      'Check suspicious links and domains online before clicking. Verify URLs against 420K+ threat records, detect fake subdomains, and inspect URL safety for free.',
    category: 'Security',
    publishedAt: '2026-08-30',
    readTime: '5 min read',
    excerpt:
      'How online link checkers detect phishing and malware, the anatomy of deceptive URLs and fake subdomains, and how to verify links safely without visiting them.',
    targetKeywords: [
      'suspicious link checker online',
      'url checker',
      'google url checker',
      'link checker safe',
      'link checker virus',
      'best link checker',
      'suspicious link checker app',
      'virustotal link checker',
      'check url safety',
      'how to check suspicious links',
      'phishing link detector',
    ],
    keyTakeaway: {
      title: 'The Golden Rule of Link Safety',
      text: 'Never click an unsolicited or urgent link directly in an SMS, email, or chat. Always isolate the domain, inspect its registrable root name, and run it through a passive link checker before interacting.',
    },
    introduction:
      'Every day, millions of fraudulent links are sent across WhatsApp, SMS text messages, phishing emails, and social media DMs. Cybercriminals disguise malicious links as urgent bank KYC alerts, failed parcel deliveries, electricity bill warnings, and prize lotteries. Clicking the wrong link can expose your device to malware downloads, credential theft, or unauthorized payment authorizations. Using a dedicated suspicious link checker online allows you to inspect and verify any web address passively before putting your security at risk.',
    contentSections: [
      {
        heading: 'Why You Should Always Check Suspicious Links Online',
        level: 'h2',
        paragraphs: [
          'Modern phishing and scam operations no longer rely on obviously broken or nonsensical web addresses. Attackers use sophisticated domain spoofing, typosquatting, dynamic URL shorteners, and deceptive subdomains that closely mimic trusted institutions like banks, postal couriers, and cloud services.',
          'When you click an unverified link, several dangerous actions can happen immediately in the background:',
          '1. Credential Harvesting: You are directed to a pixel-perfect replica of your banking or email login portal designed to capture your username, password, and 2FA codes.',
          '2. Drive-by Downloads: The page immediately prompts you to download a malicious APK file disguised as a "mandatory security update" or "bank support utility".',
          '3. Session Hijacking & Phishing Tokens: Advanced phishing toolkits capture session cookies, bypassing multi-factor authentication.',
          '4. Identity Verification Exploits: Fraudsters ask you to enter Aadhaar, PAN, Social Security numbers, or credit card CVV details under the guise of an urgent account unlock.',
        ],
        callout: {
          type: 'warning',
          text: 'Legitimate banks, government bodies, and courier services will never ask you to update passwords, settle urgent penalties, or download APK files via a random text message link.',
        },
      },
      {
        heading: 'How URL Checkers & Online Link Scanners Work',
        level: 'h2',
        paragraphs: [
          'When evaluating link safety, users often turn to popular security utilities like Google URL Checker (Google Safe Browsing), VirusTotal link checker, and specialized threat intelligence datasets. But how do these scanners actually inspect a link without putting you in danger?',
          'Online URL checkers operate using passive structural analysis and reputation lookups:',
          '• URL Normalization: The checker standardizes protocol variations (http vs. https), removes tracking query parameters, normalizes letter casing, and resolves default ports.',
          '• Public Suffix Domain Extraction: The tool isolates the true registrable root domain using Public Suffix rules (ensuring that multi-part extensions like .co.uk or .com.au are parsed correctly).',
          '• Dataset Reputation Query: The extracted URL, hostname, and root domain are matched against hundreds of thousands of cataloged malicious and benign records.',
          '• Passive Offline Inspection: Because the query is performed entirely within a safe verification engine, your browser never makes a network request to the target server, keeping your IP address, browser fingerprint, and device completely hidden.',
        ],
      },
      {
        heading: 'The Anatomy of a Deceptive URL: 5 Red Flags to Watch For',
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/suspicious-link-checker-online/fictional-example.png",
          "alt": "A fictional deceptive URL broken into four labelled parts: http, a brand name used as a subdomain, the real registrable domain and a login path.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. Reading a fictional deceptive link. The real owner is example-secure.top, not the brand named at the start."
        },
        level: 'h2',
        paragraphs: [
          'Even before running an online link check, understanding how deceptive URLs are structured can help you spot dangerous links instantly:',
          '1. The Subdomain Illusion: Scammers often place a trusted brand name inside a subdomain to trick victims. For example, in the URL "https://chase.com.security-login-portal.net", the actual domain you are visiting is "security-login-portal.net", NOT Chase Bank.',
          '2. Lookalike Domains and Typosquatting: Substituting subtle characters (such as "paypa1.com" with a number 1, or Cyrillic homoglyphs) to create visual lookalikes.',
          '3. Suspicious Top-Level Domains (TLDs): Fraudulent operations frequently register cheap or disposable TLDs such as .top, .xyz, .click, .vip, or .buzz for short-lived phishing campaigns.',
          '4. Raw IP Address Links: Legitimate organizations almost never send customer links formatted as direct IP addresses (e.g., "http://192.241.18.92/portal").',
          '5. Opaque Link Shorteners: Shortened links (such as bit.ly, tinyurl, or is.gd) conceal the true destination domain, making pre-inspection essential.',
        ],
        callout: {
          type: 'tip',
          text: 'Always read a URL from the right side of the hostname backwards. The word immediately preceding the final domain extension is the true root domain.',
        },
      },
      {
        heading: 'Understanding Match Levels: Exact URL vs. Root Domain',
        level: 'h2',
        paragraphs: [
          'ScreenshotChecker\'s Suspicious Link Checker evaluates submitted links across three distinct levels of precision:',
          '• Exact URL Match: The most specific match level. Identifies when the complete web address (including path and parameter payload) exists verbatim in our threat intelligence dataset.',
          '• Exact Hostname Match: Matches the specific host or server name (e.g. login.example.com).',
          '• Registrable Domain Match: Evaluates the parent root domain (e.g. example.com). If a root domain has a known bad classification, any subdomains branching from it inherit that high-risk designation.',
          'What does "No Local Match" mean? If a URL returns No Local Match, it means the address is not currently listed in the local dataset. It is vital to remember that No Match does NOT guarantee that a link is safe, because newly registered scam domains may not yet be cataloged.',
        ],
      },
      {
        heading: 'What to Do If You Already Clicked a Suspicious Link',
        level: 'h2',
        paragraphs: [
          'If you accidentally opened a suspicious link on your phone or computer, take these immediate protective measures:',
          '1. Disconnect Internet Immediately: Turn on Airplane mode or disable Wi-Fi/mobile data to stop ongoing background data exfiltration or malware downloads.',
          '2. Do NOT Enter Any Information: If a page loaded, never submit usernames, passwords, card PINs, or OTP codes.',
          '3. Check Download Folders: Look in your device\'s download folder for newly saved .apk, .exe, .dmg, or .zip files. Delete them immediately without opening or installing.',
          '4. Clear Browser History and Cookies: Open your browser settings and clear active cookies and website cache to terminate any hijacked sessions.',
          '5. Change Important Passwords: If you entered account details, log in from a separate, secure device and change your passwords immediately. Enable hardware or authenticator-app 2FA.',
        ],
        callout: {
          type: 'golden-rule',
          text: 'Emergency Action: If you entered bank credentials or authorized a transaction, call your bank\'s official customer support helpline immediately to freeze your accounts.',
        },
      },
      {
        heading: 'How to Use ScreenshotChecker\'s Suspicious Link Checker',
        level: 'h2',
        paragraphs: [
          'ScreenshotChecker provides a completely free, private, and instant local URL verification tool powered by over 420,000 intelligence records.',
          'Step 1: Copy the suspicious link, domain, or message text.',
          'Step 2: Paste the text into our Suspicious Link Checker tool.',
          'Step 3: Our engine normalizes the address, checks the Public Suffix structure, and verifies it across our local dataset in under 5 milliseconds.',
          'Step 4: Review the transparent verdict (Known Bad, Good, Conflicting, or No Local Match) along with full technical domain breakdown.',
        ],
        cta: {
          label: 'Open Suspicious Link Checker',
          url: '/suspicious-link-checker',
          description: 'Inspect any link or domain safely in your browser against 420K+ local intelligence records.',
        },
      },
    ],
    faq: [
      {
        question: 'What is a suspicious link checker online?',
        answer:
          'A suspicious link checker online is a web security tool that allows you to inspect a link, URL, or domain name before clicking it to determine whether it matches known malicious, phishing, or scam databases.',
      },
      {
        question: 'How do I check if a link is safe before clicking?',
        answer:
          'You can check if a link is safe by copying the address and pasting it into ScreenshotChecker\'s Suspicious Link Checker. The tool normalizes the address, inspects its true root domain, and checks it against 420K+ threat records without visiting the target site.',
      },
      {
        question: 'What is the difference between a URL checker and a virus scanner?',
        answer:
          'A URL checker evaluates website reputation, domain structures, and phishing datasets to identify malicious web addresses before you visit them. A virus scanner inspects files and processes stored locally on your device for active malware.',
      },
      {
        question: 'Does ScreenshotChecker or Google URL Checker visit the suspicious site?',
        answer:
          'No. Reputable URL checkers perform passive queries against curated reputation datasets. Your device and our servers never load scripts, images, or redirects from the destination server.',
      },
      {
        question: 'What does "No Local Match" mean on ScreenshotChecker?',
        answer:
          '"No Local Match" means the submitted URL or domain was not found in our local 420K+ record dataset. While reassuring, it does not guarantee 100% safety because newly created phishing websites appear daily.',
      },
    ],
    peopleAlsoSearch: [
      'Suspicious link checker online',
      'Link Checker virus',
      'URL checker',
      'Best link Checker',
      'Google URL Checker',
      'Suspicious link checker app',
      'Link checker safe',
      'VirusTotal link checker',
    ],
    relatedSlugs: ["qr-code-scam", 'smishing-fake-sms', 'india-post-courier-sms-scam', 'unpaid-toll-text-scam'],
    cta: {
      label: 'Verify a Suspicious Link Now',
      url: '/suspicious-link-checker',
      description: 'Check any URL or domain against 420K+ intelligence records in under 5 milliseconds.',
    },
  },
  // Task 17: publication date set during the authorized 1 October release finalization.
  {
    "slug": "redact-screenshot-before-sharing",
    "title": "How to redact a screenshot before sharing it",
    "seoTitle": "How to Redact a Screenshot Before Sharing It",
    "metaDescription": "Redact a screenshot with opaque masks, then check the saved PNG and metadata. Follow a fictional before-and-after example and a practical sharing checklist.",
    "category": "Privacy",
    "publishedAt": "2026-10-01",
    "authorName": "Virat Chauhan",
    "readTime": "6 min read",
    "excerpt": "A worked example of solid-mask redaction, checking the exported PNG, and reviewing metadata before sharing a screenshot.",
    "targetKeywords": [
      "how to redact a screenshot",
      "hide private information in screenshot",
      "screenshot redaction",
      "check redacted PNG"
    ],
    "keyTakeaway": {
      "title": "Share only the context the recipient needs",
      "text": "A screenshot can expose more than the detail you meant to share: a notification preview, an account name, a reference number or a second copy of the same address. Start by deciding what the recipient actually needs. Leave useful context visible and cover everything else that could identify someone or disclose private information."
    },
    "introduction": "To redact a screenshot, keep the original privately, cover sensitive details with fully opaque blocks, export a separate image, and reopen that exact file before sharing. Check the whole screenshot and its metadata. Blur, pixelation and automatic suggestions are not substitutes for this review.",
    "contentSections": [
      {
        "heading": "1 Keep the original and choose what to hide",
        "paragraphs": [
          "Save the original separately. For reporting or an investigation, retain the surrounding context and record the source; the redacted image is a sharing copy, not a replacement for the original evidence.",
          "Look beyond obvious contact details. Check browser tabs, title bars, avatars, notification banners, filenames, QR codes and background conversations. A short message or location clue can be identifying even if it contains no email address or phone number.",
          "This guide uses an original fictional test image, not a customer screenshot. The amount and reference-like text are demonstration content and say nothing about a real payment. We will cover the line “MASK THIS SAMPLE” while leaving the other lines unchanged."
        ],
        "figure": {
          "afterParagraph": 2,
          "src": "/images/blog/redact-screenshot-before-sharing/synthetic-redaction-before.png",
          "alt": "Fictional test image with four lines of text; the last line is MASK THIS SAMPLE.",
          "width": 1200,
          "height": 500,
          "caption": "Figure 1. The original 1200 × 500 pixel test image. The last line is the selected target. The remaining text is intentionally visible so it is possible to check whether the export changed unrelated pixels."
        }
      },
      {
        "heading": "2 Use a fully opaque mask",
        "paragraphs": [
          "Open the <a href=\"/screenshot-redactor/\">ScreenshotChecker redactor</a> and choose <strong>Select Image to Redact</strong>. Select the working copy. Use <strong>Blackout</strong> or <strong>Whiteout</strong> for sensitive text and draw a rectangle around the complete detail. Include the character edges, punctuation and any wrapped lines. Leave a margin around the text rather than tracing the letters tightly.",
          "The editor also provides X, Y, Width and Height fields with <strong>Add mask</strong> for placing a rectangle. Check the preview after adding it; coordinates are in image pixels. Use <strong>Undo</strong> if the selected area is wrong, then review the replacement mask.",
          "Use solid coverage for private text. Pixelation averages image information rather than replacing a selected region with a uniform color. Bishop Fox demonstrated recovery of pixelated text under specific conditions in its <a href=\"https://bishopfox.com/blog/unredacter-tool-never-pixelation\">Unredacter research</a>. Recovery is not guaranteed for every image, but making text look difficult to read is a weak basis for sharing it safely. Blur can also leave readable clues."
        ]
      },
      {
        "heading": "3 Review suggestions and the rest of the image",
        "paragraphs": [
          "If you use <strong>Auto-Mask All</strong>, treat the result as a starting point. Check every suggested box and inspect the rest of the screenshot yourself. A pattern-based suggestion can miss contextual details, and OCR can omit or misread text. Noise, resolution and layout affect recognition, as the <a href=\"https://tesseract-ocr.github.io/tessdoc/ImproveQuality.html\">Tesseract documentation</a> explains.",
          "For this example, the instruction “MASK THIS SAMPLE” is the target because we chose it. It is not a conventional email, phone number or card pattern. Manual selection is necessary when the information that matters does not match an automatic rule.",
          "Zoom in around each edge. Then scan the full image again for repeated information. If the same name appears in both a message and its sidebar preview, masking only the message leaves the second copy visible."
        ]
      },
      {
        "heading": "4 Export and inspect the saved PNG",
        "paragraphs": [
          "Choose <strong>Export Clean PNG</strong>. Open the downloaded file in an image viewer and inspect it at a readable zoom. Check the saved image, not only the editor preview. Make sure the intended areas are covered and the remaining context is still useful.",
          "In this one checked export, the entire selected rectangle was one fully opaque near-black color. Every pixel outside it matched the original. The source image also contained a fictional PNG Comment marker, which was absent from the exported file. Those observations support this example; they do not establish performance for every image, browser, mask type or metadata format."
        ],
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/redact-screenshot-before-sharing/synthetic-redaction-after.png",
          "alt": "Saved fictional example with the last line covered by a solid near-black rectangle and all other text unchanged.",
          "width": 1200,
          "height": 500,
          "caption": "Figure 2. The supplied export from the fictional redaction check. The selected line is covered in the saved PNG. These are the actual source and exported files inspected on 1 October 2026; the after image has not been recreated for this guide."
        }
      },
      {
        "heading": "5 Check metadata and choose the right attachment",
        "paragraphs": [
          "Visible redaction and metadata review are separate checks. The <a href=\"https://www.w3.org/TR/png-3/#11textinfo\">PNG specification</a> allows textual information to accompany the pixels. A file can look clean while carrying information you did not intend to share.",
          "Inspect the exported copy with a metadata tool you trust. The example above tested a PNG Comment field; the source contained no EXIF payload, so it was not an EXIF-removal test. Do not turn that narrow result into a promise that every kind of metadata is removed.",
          "Give the sharing copy a clear, non-sensitive filename. In the message or upload dialog, confirm that you selected the exported copy rather than the original. If you later resize, convert or annotate it, inspect the resulting file again before sending."
        ]
      },
      {
        "heading": "What redaction does not establish",
        "paragraphs": [
          "A solid mask covers a selected region. It cannot hide clues left elsewhere, prevent someone inferring information from context, remove copies already shared, or prove that the screenshot depicts a real event. For the last question, use the <a href=\"/blog/screenshot-checker-online/\">screenshot investigation guide</a> and verify important claims at their source.",
          "ScreenshotChecker processes images for redaction in the browser. Its <a href=\"/privacy/\">privacy policy</a> separately describes analytics, resource requests and browser storage. Browser-local processing does not mean that the entire website makes no network requests. Moving an image between tools can retain an original-image copy in the tab's session storage; consult that policy and your browser's site-data controls when working with sensitive material."
        ]
      },
      {
        "heading": "Before you share",
        "paragraphs": [],
        "checklist": [
          "Keep the original privately and share a separate copy.",
          "Use solid masks with enough coverage around every sensitive detail.",
          "Check suggestions, repeated information and the whole image manually.",
          "Reopen the exact exported file and review its metadata.",
          "Confirm the recipient needs the remaining information and the correct copy is attached."
        ]
      }
    ],
    "faq": [
      {
        "question": "Is blurring an email address enough?",
        "answer": "Use a fully opaque block for sensitive text. Blur and pixelation can preserve clues, and the amount of readable information depends on the image and method. Review the exported file after masking."
      },
      {
        "question": "Can a black rectangle be removed later?",
        "answer": "An editable rectangle placed over an image can be moved or deleted in its original editing document. Share a flattened image in which the selected pixels have been replaced, and inspect that saved file. In the PNG example here, the mask pixels were fully opaque and uniform. This does not rule out information elsewhere in a file or other copies of the original."
      },
      {
        "question": "Does automatic masking find everything private?",
        "answer": "No. Automatic suggestions depend on the text that is recognized and the patterns supported. Names, private context, QR codes and small or distorted text still need manual review."
      },
      {
        "question": "Does redaction remove EXIF and other metadata?",
        "answer": "Not necessarily. Review the exported file separately. Our checked example removed its PNG Comment marker, but it did not test an EXIF-bearing source. Visible coverage alone is not evidence about metadata."
      },
      {
        "question": "Does redacting a screenshot prove it is genuine?",
        "answer": "No. Redaction prepares a sharing copy. Authenticity and the truth of a message, transaction or other claim require separate investigation."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": [
      "screenshot-checker-online",
      "exif-metadata"
    ],
    "cta": {
      "label": "Open the screenshot redactor",
      "url": "/screenshot-redactor/",
      "description": "Apply solid masks, export a sharing copy, and inspect the exact saved file before sending it."
    }
  },
  // Growth push October 2026: long-tail guide
  {
    "slug": "fake-whatsapp-chat-screenshot",
    "title": "How to Tell If a WhatsApp Chat Screenshot Is Fake or Edited",
    "seoTitle": "Fake WhatsApp Chat Screenshot? How to Spot a Fake",
    "metaDescription": "Spot a fake WhatsApp chat screenshot: the visual clues worth a second look, why apps can fake any chat, and the reliable test: the message on the real phone.",
    "category": "Forensics",
    "publishedAt": "2026-10-14",
    "authorName": "Virat Chauhan",
    "readTime": "8 min read",
    "excerpt": "Why chat screenshots are easy to fake, which visual clues are worth a second look, and how to verify a disputed WhatsApp message at its source, with a fictional example.",
    "targetKeywords": [
      "fake whatsapp chat screenshot",
      "how to tell if a whatsapp screenshot is fake",
      "edited whatsapp screenshot",
      "is this whatsapp screenshot real",
      "whatsapp chat screenshot checker",
      "verify whatsapp message"
    ],
    "keyTakeaway": {
      "title": "Check the chat, not the picture of the chat",
      "text": "A WhatsApp screenshot is a claim about what a conversation contains. The reliable test is to see the message in the app itself: on the other person's phone, in your own copy of the chat, or confirmed by the supposed sender through a separate call. Visual oddities are reasons to ask, not verdicts."
    },
    "introduction": "You usually cannot tell from the image alone whether a WhatsApp chat screenshot is fake, because convincing chat images can be built or edited without leaving obvious marks. The dependable check is independent: ask to see the message live in the app, compare it with your own copy of the conversation, or confirm with the supposed sender through a different channel. Visual inconsistencies and image-analysis results are useful clues for deciding what to ask, but they cannot prove a screenshot genuine or fake.",
    "contentSections": [
      {
        "heading": "Why WhatsApp Screenshots Are Easy to Fake",
        "paragraphs": [
          "A screenshot is just an image of a screen. Websites and apps that generate chat-style images let anyone choose the contact name, profile photo, timestamps, tick marks and message text. The result can look like a normal capture because it was designed to, and it has no hidden link back to any real WhatsApp conversation.",
          "Real conversations can be altered too. WhatsApp Web runs in a desktop browser, and browser developer tools let a user change the text of a page on the fly. <a href=\"https://developer.chrome.com/docs/devtools/dom\">Chrome's DevTools documentation</a> shows how to double-click an element and type new text. That changes what one browser displays; it does not change any message that was sent, but a screenshot taken afterwards will show the altered text.",
          "Genuine screenshots can mislead as well. A crop can remove the message that changes the meaning, a reply can come from a different chat, and a contact name is simply whatever the phone owner saved. None of this requires any editing software."
        ],
        "callout": {
          "type": "warning",
          "text": "<strong>A clean-looking screenshot is not evidence that it is genuine.</strong> An image produced by a chat generator has no editing seams to find, because nothing was pasted into a real capture."
        }
      },
      {
        "heading": "How to Verify a WhatsApp Message: Go to the Source",
        "paragraphs": [
          "Before you study the pixels, try to see the message where it actually lives. Each of the steps below checks the conversation itself rather than a picture of it. Use whichever ones are practical and safe for your situation.",
          "If a screenshot comes with a request for money, a code or urgent action, treat the request as the thing to verify. <a href=\"https://www.actionfraud.police.uk/alert/friendinneed\">Action Fraud's friend-in-need alert</a> advises phoning the person to confirm it is really them before acting on an unusual WhatsApp request."
        ],
        "checklist": [
          "Ask to see the message live on the device. Watch the person open WhatsApp, find the chat and scroll to the message, rather than accepting another image.",
          "Check that the chat belongs to the phone number you expect. A saved contact name can be anything the phone owner typed.",
          "Read the messages before and after it. A single cropped bubble can lose the context that explains it.",
          "Compare with your own copy of the conversation if you were part of it. Look for the same message at the same point in the thread.",
          "Contact the supposed sender through a separate channel, such as a phone call or in person, and ask them directly. Do not rely on replying inside the chat that is in dispute.",
          "If neither copy can be checked, record the screenshot as unverified. That is not the same as proving it was faked."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "<strong>Do not send money, share codes, end a relationship or make a public accusation on the strength of a screenshot alone.</strong> Confirm the message in the app or with the person first."
        }
      },
      {
        "heading": "WhatsApp Features That Help, and What They Cannot Show",
        "paragraphs": [
          "<strong>Message info and tick marks.</strong> According to <a href=\"https://whatsapp.com/faq/en/iphone/28041116\">WhatsApp's read receipts help page</a>, one grey tick means sent, two grey ticks mean delivered and two blue ticks mean read, while a clock icon means the message has not been sent yet. For a message you sent, pressing and holding it and choosing Info shows when it was delivered and read. This only works on the sender's own device, which is why seeing the app live matters more than seeing a picture of the ticks.",
          "<strong>Missing blue ticks are not suspicious on their own.</strong> The same page lists ordinary reasons read receipts may not appear, including read receipts switched off in privacy settings, a recipient who has not opened the chat, connection problems and incorrect date or time settings. In groups, ticks turn blue only once every member has read the message.",
          "<strong>The \"Forwarded\" label.</strong> WhatsApp <a href=\"https://blog.whatsapp.com/labeling-forwarded-messages\">introduced a Forwarded label</a> to mark messages that were forwarded rather than typed by the sender. If someone forwards you a message they received, the label tells you it is a forward, but it does not name the person who originally wrote it.",
          "<strong>The \"edited\" label.</strong> WhatsApp <a href=\"https://blog.whatsapp.com/now-you-can-edit-your-whatsapp-messages\">lets people edit a sent message</a> for up to 15 minutes, and the message is then marked as edited without showing the earlier wording. A screenshot taken before an edit can therefore differ from the current chat without anyone faking anything. Look for the edited marker in the live chat.",
          "<strong>Export chat.</strong> WhatsApp's <a href=\"https://whatsapp.com/faq/en/android/23756533\">export guide</a> explains that a chat can be exported as a text file, with or without recent media. An export is more complete than a cropped image, but it is still a file that someone can alter after exporting, so it supports a conversation with the other person rather than replacing one."
        ]
      },
      {
        "heading": "Visual Warning Signs: Worth a Second Look, Not Proof",
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/fake-whatsapp-chat-screenshot/fictional-example.png",
          "alt": "Fictional chat screenshot with a cropped header and no timestamps, in which Sam promises to pay back $400, annotated with what to check.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional disputed chat. Crops and a name-only header are worth a second look, but the real check is the chat itself."
        },
        "paragraphs": [
          "<strong>Timestamps out of order.</strong> Messages normally appear in time order within a thread. A reply stamped earlier than the message it answers deserves a question. Remember that the status-bar clock shows when the screenshot was taken, not when the messages were sent, so a gap between the two is normal.",
          "<strong>Tick states that do not fit the story.</strong> Blue ticks on a message the other person says they never received, or ticks on messages the screenshot owner supposedly received, are worth asking about. As noted above, read receipt settings, group chats and connectivity can all explain unexpected ticks.",
          "<strong>Status bar and interface oddities.</strong> A mix of 12-hour and 24-hour times, a language that does not match the rest of the screen, or a layout unlike the version of WhatsApp the person uses can be clues. Phone models, app versions, themes, font-size settings and regional settings also change how a genuine screen looks.",
          "<strong>Cropping that hides context.</strong> A screenshot that shows only one bubble, cuts off the chat header or omits the date divider makes the claim harder to check. Ask for a wider view or, better, the live chat.",
          "<strong>Hard-to-read or resized images.</strong> Heavy compression, re-screenshotting and resizing can blur edges and smear text. These change how an image looks but say nothing reliable about whether the content is true."
        ],
        "callout": {
          "type": "info",
          "text": "Each sign above has innocent explanations. Several odd details can share one ordinary cause, such as a screenshot of a screenshot. Use them to decide what to ask, then verify at the source."
        }
      },
      {
        "heading": "Worked Example: A Fictional Disputed Message Between Two Friends",
        "paragraphs": [
          "<strong>This is a fictional teaching example. The people, amounts and messages are invented and do not describe a real case or test the accuracy of any tool.</strong> Riya and Tom shared a rented flat. After moving out, Tom posts a screenshot in their friends' group chat. It shows a message from \"Riya\" reading \"Fine, I'll pay the whole £300 cleaning fee.\" Riya does not remember agreeing to that.",
          "<strong>Step 1: check her own copy.</strong> Riya scrolls to that week in her own WhatsApp chat with Tom. She finds a similar message, but in her copy it continues with a second bubble: \"...if the landlord actually charges it.\" The screenshot ends just above that line.",
          "<strong>Step 2: see the live chat.</strong> Rather than trading more images, they meet and Tom opens the chat on his phone. The conversation is linked to Riya's number, and both bubbles are there, matching Riya's copy.",
          "<strong>Step 3: use tools to focus the conversation, not to decide it.</strong> Before they met, Riya had run the screenshot through the <a href=\"/\">screenshot checker</a> to pull out the text and metadata. The image she received carried no useful metadata, which on its own proves nothing. She also compared Tom's screenshot with her own capture of the same section using <a href=\"/screenshot-comparison/\">Screenshot Comparison</a>. The difference view drew attention to the missing second bubble, but some highlighted areas came only from their phones' different screen sizes and themes.",
          "<strong>Outcome A: the message exists but was cropped.</strong> This is what happened here. The screenshot was a real capture that lost its context. Nobody needed to prove anything about pixels; the live chat settled it.",
          "<strong>Outcome B: the message cannot be found.</strong> If Tom had been unable to find the message in his live chat, the screenshot would remain unverified. It might have come from another conversation, been deleted, or been fabricated. Riya could say she cannot confirm it, without claiming to have proved a forgery."
        ]
      },
      {
        "heading": "What ScreenshotChecker Can and Cannot Do Here",
        "paragraphs": [
          "The <a href=\"/\">main screenshot checker</a> uses OCR to read the text in an image, shows available metadata and applies rule-based checks for common scam phrasing. It may label an image as a chat because of text it reads, such as typical chat phrases. That label describes the text it found; it does not authenticate the image as coming from WhatsApp.",
          "The <a href=\"/image-manipulation-checker/\">Image Manipulation Checker</a> shows Error Level Analysis and related forensic signals. A region that stands out can be a reason to look closer, but text edges, resizing and resaving also produce bright areas. An image made from scratch by a chat generator may show no boundary at all.",
          "<a href=\"/screenshot-comparison/\">Screenshot Comparison</a> places two versions side by side or as a difference map. It is most useful when you have your own capture of the same part of the chat, because it points to where the two images differ. It cannot say which version is true.",
          "<strong>What these tools cannot do:</strong> they have no access to WhatsApp, cannot look up a phone number or account, cannot confirm that a message was sent or received, and do not measure fonts, icon positions or layout. No result from them proves that a screenshot is genuine or fake. Compare any extracted text with the image itself, because OCR can misread names, numbers and times."
        ],
        "cta": {
          "label": "Analyze a chat screenshot",
          "url": "/",
          "description": "Extract the text and metadata, review warning signs, then confirm the message in the app or with the sender."
        }
      },
      {
        "heading": "If You Need to Share or Report the Screenshot",
        "paragraphs": [
          "Keep the original file you received, unchanged, along with a note of who sent it and when. Avoid re-screenshotting it, because each new capture loses detail.",
          "If you share the screenshot with friends, a landlord or an employer, hide phone numbers and unrelated messages first. The <a href=\"/blog/redact-screenshot-before-sharing/\">redaction guide</a> walks through using solid masks and checking the saved copy. If the screenshot is part of a scam, such as a fake message used to request money, read the <a href=\"/blog/smishing-fake-sms/\">guide to fake SMS and WhatsApp messages</a> and use the reporting options offered by your bank and local fraud authorities."
        ]
      }
    ],
    "faq": [
      {
        "question": "Can you tell if a WhatsApp screenshot is fake just by looking at it?",
        "answer": "Not reliably. Chat generator sites and simple text edits can produce images that look normal. Visual oddities are worth asking about, but the dependable check is to see the message in the live app or confirm it with the supposed sender."
      },
      {
        "question": "Can ScreenshotChecker prove a WhatsApp chat is real?",
        "answer": "No. It can extract text with OCR, show available metadata and highlight image-forensics clues such as ELA differences. It has no access to WhatsApp and cannot confirm that any message was sent, received or written by a particular person."
      },
      {
        "question": "What is the best way to check a disputed WhatsApp message?",
        "answer": "Ask to see the message live on the phone where it was received, check the chat belongs to the expected number, read the surrounding messages and compare them with your own copy. If possible, ask the supposed sender directly by phone or in person."
      },
      {
        "question": "Do grey ticks instead of blue ticks mean a screenshot is fake?",
        "answer": "No. WhatsApp says read receipts can be missing because they are turned off, the recipient has not opened the chat, there are connection problems or the phone's date and time are wrong. In groups, ticks only turn blue once everyone has read the message."
      },
      {
        "question": "Why does a screenshot show different wording from my copy of the chat?",
        "answer": "There are innocent and suspicious explanations. WhatsApp lets senders edit a message for a short time after sending, so a screenshot taken before the edit can differ from the current chat, which shows an edited marker. The screenshot might also come from a different chat or have been altered, so check the live conversation."
      },
      {
        "question": "Is an exported WhatsApp chat better evidence than a screenshot?",
        "answer": "An export usually includes more of the conversation than a cropped image, but it is still a text file that can be changed after it is exported. Treat it as a fuller record to discuss, and check important messages in the app itself."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["ai-generated-screenshot", 
      "whatsapp-telegram-task-job-scam",
      "screenshot-checker-online",
      "smishing-fake-sms"
    ],
    "cta": {
      "label": "Check a WhatsApp screenshot",
      "url": "/",
      "description": "Review the text, metadata and warning signs as clues, then verify the message in the app or with the person who supposedly sent it."
    }
  },
  // Growth push October 2026: long-tail guide
  {
    "slug": "fake-social-media-post-screenshot",
    "title": "Is This Tweet or Instagram Screenshot Real? How to Check a Social Media Post",
    "seoTitle": "Fake Tweet or Instagram Screenshot? How to Check It",
    "metaDescription": "Is that screenshot of a tweet, X post or Instagram post real? Find the original post, confirm the account, and treat badges and image clues as hints.",
    "category": "Threat Analysis",
    "publishedAt": "2026-10-14",
    "authorName": "Virat Chauhan",
    "readTime": "8 min read",
    "excerpt": "How to trace a screenshot of a celebrity, politician or brand post back to its source, why paid badges and image details settle little, and a fictional CEO post example.",
    "targetKeywords": [
      "fake tweet screenshot",
      "is this tweet real",
      "fake Instagram post screenshot",
      "how to check if a screenshot of a post is real",
      "fake X post screenshot",
      "verify social media screenshot"
    ],
    "keyTakeaway": {
      "title": "Find the original post, not a better-looking copy",
      "text": "A screenshot of a post is a claim that someone published something. The strongest check is locating that post on the real account, or a reliable record of it. If you cannot find it, treat the claim as unconfirmed and avoid sharing it as fact. Fonts, timestamps and like counts in the image are only hints."
    },
    "introduction": "To check whether a screenshot of a tweet, X post or Instagram post is real, look for the original post on the account it is attributed to, and confirm that the account is the genuine one. If the post is not on the account, in platform search, in search engines or in web archives, treat the screenshot as unconfirmed rather than true. How the image looks cannot settle the question, because convincing fake posts are easy to make and real posts can be deleted.",
    "contentSections": [
      {
        "heading": "Why screenshots of posts are a common misinformation format",
        "paragraphs": [
          "A screenshot strips a post of everything that would let you check it: the link, the live account, the replies and any later correction. What remains is a picture of text next to a familiar name and profile photo. That is why invented quotes from celebrities, politicians and brands often travel as screenshots rather than as links.",
          "Fake post generator websites and apps exist that let anyone type a name, handle, message and engagement numbers into a template styled like a social network. Ordinary image editors can also change a real post's wording. Some fabricated screenshots are labelled as parody when first made and lose that label once reshared.",
          "None of this means a particular screenshot is fake. Real posts get captured and shared constantly, sometimes because they were later deleted. The point is that the image alone does not tell you which situation you are in. <strong>A screenshot is a claim, not proof.</strong>"
        ],
        "callout": {
          "type": "golden-rule",
          "text": "<strong>Check the source, not the styling.</strong> A screenshot that looks pixel perfect can still be invented, and a blurry, cropped one can still show a real post. Your goal is to find the post itself or a trustworthy record of it."
        }
      },
      {
        "heading": "Step 1: Find the original post",
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/fake-social-media-post-screenshot/fictional-example.png",
          "alt": "Fictional social media post screenshot from a lookalike handle announcing school closures, annotated with four checks.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional post screenshot. Find the original on the platform before believing or sharing it."
        },
        "paragraphs": [
          "Start with the account named in the screenshot. Open the platform yourself, search for the account, and scroll to the date shown in the image. If the screenshot includes a post link or visible URL, type the address yourself rather than tapping a link someone sent you.",
          "On X, <a href=\"https://help.x.com/en/using-x/x-advanced-search\">advanced search</a> lets you narrow results to posts from a particular account, an exact phrase and a date range. X's help page describes it for logged-in users on x.com. Search for a distinctive phrase from the screenshot, limited to that account and a few days around the claimed date.",
          "Next, search the exact wording in quotation marks with a general search engine such as Google. A real post from a well-known account that caused a stir often leaves traces: quote posts, replies, news coverage or a statement from the person or company. If the only results are copies of the same image, that tells you the claim has spread, not that it is true.",
          "Web archives can show what a public page looked like at an earlier date. The Internet Archive's <a href=\"https://help.archive.org/help/using-the-wayback-machine/\">Wayback Machine guide</a> explains how to look up the history of a URL by pasting it into the search box. It also notes that many pages are never captured and that archived copies can be incomplete, so a missing capture is not evidence either way. Social media pages that rely heavily on scripts may not archive well.",
          "Private messages are different. A DM screenshot has no public original to find, so these steps cannot confirm it. Ask the people in the conversation directly, through a channel you already trust, and do not treat a DM screenshot as settled because it looks authentic. If you hold two versions of the same capture, the <a href=\"/screenshot-comparison/\">screenshot comparison tool</a> can highlight where their pixels differ."
        ]
      },
      {
        "heading": "Step 2: Confirm it is the real account",
        "paragraphs": [
          "Finding a matching post is only useful if it sits on the right account. Impersonators copy profile photos and pick handles one character away from the real one. Compare the handle letter by letter, and reach the account from a source you trust, such as the person's or company's official website, rather than from the screenshot.",
          "Do not treat a checkmark as proof of who runs an account. According to <a href=\"https://help.x.com/en/rules-and-policies/profile-labels\">X's guide to profile labels</a>, a blue checkmark means the account has an active paid X subscription and meets X's eligibility requirements. X uses a gold checkmark for official organisations through its business offering and a grey one for government or multilateral bodies and officials.",
          "On Instagram, Meta describes <a href=\"https://help.instagram.com/2419286908233223/\">Meta Verified</a> as a paid subscription for eligible profiles, with requirements that include a government ID matching the profile name and photo. A verified badge can therefore reflect a subscription and an identity check for that profile. It does not tell you that the profile belongs to the famous person whose name appears in a screenshot, and a screenshot can show a badge the real account never had.",
          "Useful signs that you have the genuine account include links to it from the official website, a long posting history consistent with the person or brand, and coverage by reputable outlets that names the handle. These still call for judgement; none is a guarantee on its own."
        ],
        "callout": {
          "type": "warning",
          "text": "Badge rules change and differ by platform. Check the platform's current help pages rather than relying on what a checkmark meant a few years ago."
        }
      },
      {
        "heading": "Step 3: Allow for deleted posts",
        "paragraphs": [
          "Not finding a post does not prove it never existed. People delete posts after a backlash, and accounts get suspended or made private. <a href=\"https://help.x.com/en/using-x/delete-posts\">X's help page on deleting posts</a> says a deleted post is removed from the author's profile, followers' timelines and X search. It also says X cannot remove copies held on other websites, apps or search engines, and that other people's quote posts with their own comments are not removed.",
          "That gives you places to look. Search for quote posts and replies from the time, reports that mention the deletion, and archive captures of the account page from around the claimed date. A widely seen real post usually leaves some independent record. A screenshot with no independent trace at all deserves more doubt, though that alone does not establish it was fabricated.",
          "If the person or company has publicly said they did not write the post, weigh that statement too, while remembering that a denial is also a claim. When the evidence stays thin, the honest conclusion is \"unconfirmed\", and that is a good reason not to reshare it."
        ]
      },
      {
        "heading": "Step 4: Use reverse image search and fact-checkers",
        "paragraphs": [
          "A <a href=\"/reverse-image-search/\">reverse image search</a> can show where the same screenshot appeared before. Older copies, a first appearance on a parody or meme page, or an earlier version with different wording are all strong leads. A match is a starting point to open and read, not proof of where the image originated.",
          "Check whether fact-checkers have already examined the claim. Google's <a href=\"https://newsinitiative.withgoogle.com/resources/lessons/google-fact-check-tools/\">Fact Check Explorer guide</a> describes a search engine for published fact checks that accepts keywords and also lets you upload an image to see whether it has been checked. No result simply means no listed fact-checker has covered it yet.",
          "Clues inside the image are worth noting but are only hints: a date that cannot exist, a time that does not match the account's usual time zone, engagement numbers that look implausible for the account, odd wording or spacing, or an interface that resembles an older version of the app. Real screenshots can look strange because of app updates, dark mode, translation, cropping or compression, and good fakes can avoid every one of these tells."
        ]
      },
      {
        "heading": "Worked example: a fictional CEO post goes viral",
        "paragraphs": [
          "<strong>This is a fictional teaching example. The company, people, handle and post are invented and do not refer to any real business or case.</strong> A screenshot spreads in group chats showing a post said to be from Dana Okafor, chief executive of the fictional coffee chain Juniper Lane. It reads: \"From Monday, Juniper Lane will charge a £2 fee to customers who pay by card.\" The image shows the handle @DanaOkafor_JL, a blue checkmark, 48,000 reposts and a date of 14 March 2026.",
          "<strong>Find the original.</strong> A reader searches X and finds that Juniper Lane's official website links to the handle @DanaOkaforJL, without the underscore. Advanced search for posts from that account between 12 and 16 March shows nothing about card fees. Searching the exact wording on Google returns only reshares of the image and a few posts asking whether it is real.",
          "<strong>Allow for deletion.</strong> If a post with 48,000 reposts had existed and been deleted, the reader would expect quote posts, news stories or an archived capture to mention it. They find none. They do find a statement on Juniper Lane's own newsroom page saying no card fee is planned.",
          "<strong>Trace the image.</strong> A reverse image search turns up an earlier copy on a meme forum, where the poster described it as a joke made with a post generator. The badge and the impressive repost count in the screenshot added nothing: both are just pixels in the image.",
          "<strong>Conclusion.</strong> The reader cannot prove who made the image, but the claim fails every source check, and the earliest copy is labelled as a joke. They treat it as unsupported, do not share it, and reply in the group chat with the link to the company statement. If the original post had turned up on the official account, the conclusion would have reversed, regardless of how the screenshot looked."
        ]
      },
      {
        "heading": "What ScreenshotChecker can and cannot tell you",
        "paragraphs": [
          "The <a href=\"/\">screenshot checker</a> reads text with OCR, inspects available metadata, applies rule-based warning signs and runs some image forensics checks such as error level analysis. If the extracted text contains words like followers, repost or a platform name, it may label the image as a social media capture. That label is a guess from text, not a confirmation of which app produced the image.",
          "It does not connect to X, Instagram or any other platform, so it cannot look up whether a post exists, who owns an account or whether a badge is current. It does not measure fonts, icon positions or layout. Screenshots are often saved, resaved and cropped, which limits what metadata and forensics signals can show. Error level analysis on the <a href=\"/image-manipulation-checker/\">image manipulation checker</a> may highlight regions worth a closer look, and it can also flag edits that are harmless or miss edits that were made carefully.",
          "Use these results as clues that tell you where to look next. The answer to whether a post is real comes from the platform, the account and independent records, as described above."
        ],
        "cta": {
          "label": "Check the screenshot",
          "url": "/",
          "description": "Read the text, metadata and warning signs in a screenshot, then verify the post at its source."
        }
      },
      {
        "heading": "Checklist before you share a screenshot of a post",
        "paragraphs": [],
        "checklist": [
          "Find the account yourself, ideally through a link on the person's or organisation's official website.",
          "Compare the handle character by character with the one in the screenshot.",
          "Search the platform for the post, using the account, an exact phrase and the claimed date.",
          "Search the exact wording with a search engine and look for quote posts, replies and news coverage.",
          "Look up archived captures of the account page around the claimed date, remembering that many pages are never archived.",
          "Run a reverse image search to find earlier copies of the screenshot.",
          "Check Google Fact Check Explorer for existing fact checks.",
          "Treat badges, fonts, timestamps and engagement numbers as hints only.",
          "If you cannot find the original or a reliable record of it, call it unconfirmed and do not share it as fact."
        ]
      }
    ],
    "faq": [
      {
        "question": "How can I tell if a tweet screenshot is fake?",
        "answer": "Look for the original post on the real account, using X search, a search engine and web archives. If it is not there and no independent record of it exists, treat the screenshot as unconfirmed. Details in the image can raise doubts but cannot settle the question."
      },
      {
        "question": "Does a blue checkmark mean the account is real?",
        "answer": "Not on its own. X says its blue checkmark reflects an active paid subscription plus eligibility requirements, and Instagram's Meta Verified is a paid subscription with an ID check. A badge says little about whether a screenshot shows the account you think it does, and a badge can be added to a fake image."
      },
      {
        "question": "What if the post was deleted?",
        "answer": "A missing post is not proof it never existed. Look for quote posts and replies from the time, news reports and archived captures of the account page. A real post that many people saw usually leaves some independent trace, but the absence of one is still not conclusive."
      },
      {
        "question": "Can I verify a screenshot of an Instagram DM or private message?",
        "answer": "There is no public original to look up, so source checks do not apply. Ask the people in the conversation through a channel you already trust. Image analysis can point out warning signs but cannot confirm who sent a private message or what it said."
      },
      {
        "question": "Can ScreenshotChecker prove a social media screenshot is real or fake?",
        "answer": "No. It reads text, metadata and some image forensics signals and flags warning signs. It has no access to social media platforms, does not measure fonts or layout, and its results are clues rather than proof. Verify the post at its source."
      },
      {
        "question": "Are fake tweet generators illegal?",
        "answer": "That depends on where you are and how an image is used, so this guide cannot give legal advice. For checking a screenshot, what matters is that such tools exist and make convincing images easy to produce, so appearance alone is never enough."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["where-is-this-screenshot-from", "reverse-image-search-screenshot", 
      "screenshot-checker-online",
      "screenshot-analyzer-online",
      "ai-image-detector-online"
    ],
    "cta": {
      "label": "Check a social media screenshot",
      "url": "/",
      "description": "Review text, metadata and warning signs as clues, then confirm the post on the real account."
    }
  },
  // Growth push October 2026: long-tail guide
  {
    "slug": "fake-payment-screenshot-paypal-venmo-cash-app",
    "title": "Fake PayPal, Venmo, Cash App or Zelle Payment Screenshot? How Sellers Confirm They Were Paid",
    "seoTitle": "Fake Venmo, PayPal or Zelle Payment? How Sellers Check",
    "metaDescription": "A PayPal, Venmo, Cash App or Zelle screenshot from a buyer is not payment, and neither is a refund screenshot. Check your own app and spot overpayment scams.",
    "category": "Security",
    "publishedAt": "2026-10-14",
    "updatedAt": "2026-11-12",
    "authorName": "Virat Chauhan",
    "readTime": "8 min read",
    "excerpt": "For US marketplace sellers: why a payment screenshot or email proves nothing, how to confirm money in your own PayPal, Venmo, Cash App or bank app, and how overpayment and fake upgrade scams work.",
    "targetKeywords": [
      "paypal refund screenshot",
      "venmo refund screenshot",
      "fake venmo receipt",
      "fake payment screenshot",
      "fake Venmo payment screenshot",
      "fake Zelle payment email",
      "fake Cash App payment screenshot",
      "PayPal fake payment email seller",
      "Facebook Marketplace overpayment scam"
    ],
    "keyTakeaway": {
      "title": "The only proof is money in your own account",
      "text": "A screenshot or email from a buyer is a claim, not a payment. Open PayPal, Venmo, Cash App or your bank app yourself, without using any link the buyer or an email gave you, and confirm the money appears in your balance or activity before you hand over anything. If it is not there, you have not been paid."
    },
    "introduction": "You cannot tell from a screenshot whether a buyer really paid you, and you do not need to. Close the chat, open your own PayPal, Venmo, Cash App or banking app (for Zelle) directly, and check whether the money shows in your balance or activity. If it is not there, treat the sale as unpaid, no matter how convincing the image or email looks.",
    "contentSections": [
      {
        "heading": "How to Confirm You Were Paid: Check Your Own Account",
        "paragraphs": [
          "Every major provider points sellers back to the same habit: go to the source yourself. PayPal's <a href=\"https://www.paypal.com/us/security/learn-about-fake-messages\">guide to fake messages</a> says to check your account status or activity by opening the PayPal app or typing paypal.com into a new browser window, rather than following links in a message. Cash App's <a href=\"https://cash.app/learn/protect-your-money/how-to-spot-and-avoid-scams\">scam guide</a> likewise tells you to open the app directly and look at your balance, noting that genuine alerts appear inside the app.",
          "Zelle works a little differently. According to <a href=\"https://www.zelle.com/digital-payment-education\">Zelle's payment education page</a>, money sent with Zelle goes directly into the recipient's enrolled bank account. So for Zelle, the place to look is your own bank's app or website, not an email that mentions Zelle.",
          "Do this check before the buyer leaves with the item, and do it on your own phone. A buyer holding up their screen, forwarding an email or sending a screenshot is showing you their claim, not your money."
        ],
        "checklist": [
          "Close the chat or email. Do not tap any link, button or phone number in it.",
          "Open the official PayPal, Venmo or Cash App app yourself, or your bank's own app for a Zelle payment.",
          "Find the incoming payment in your activity or balance. Check the amount, the sender and that it went to your account.",
          "If nothing is there, the sale is unpaid. Keep the item and tell the buyer you will release it once the money shows in your account.",
          "If anything about the payment is unclear, contact the provider through the help section inside its app or its official website, not through details supplied by the buyer."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "<strong>Never release goods, refund money or pay a fee because of a screenshot or email.</strong> The only confirmation that counts is the payment appearing in your own account, which you opened yourself."
        }
      },
      {
        "heading": "Why a Screenshot or Payment Email Is Not Proof",
        "paragraphs": [
          "A screenshot is just an image. It can be edited, generated from a template, reused from an old transaction, or show a payment that went to someone else. Nothing about how polished it looks tells you whether money reached your account.",
          "Fake payment emails work the same way. <a href=\"https://help.venmo.com/cs/articles/common-scams-on-venmo-vhel167\">Venmo's common scams page</a> warns that scammers send screenshots of emails made to look as if you were paid when you were not, and says Venmo only emails you from addresses ending in venmo.com. Zelle's <a href=\"https://www.zelle.com/videos/how-avoid-online-marketplace-scam\">marketplace scam guidance</a> says its only email domains are zelle.com and zellepay.com, and that a Zelle logo in a profile picture does not make an email genuine.",
          "PayPal lists signs of a phishing message such as generic greetings, pressure to act fast and odd web addresses. Those signs are useful, but a message without them is not proof either. A screenshot of an email hides the real sender address entirely, so you cannot check it at all. That is why opening your own account matters more than studying the message.",
          "The FTC describes this exact pattern in its <a href=\"https://consumer.ftc.gov/consumer-alerts/2022/07/selling-stuff-online-heres-how-avoid-scam\">advice for people selling online</a>: a buyer insists on a payment app, sends a fake payment notification, and hopes you ship or hand over the item before you notice nothing arrived."
        ],
        "callout": {
          "type": "info",
          "text": "Venmo also notes that a real payment made with stolen card or bank details can be removed later if the rightful owner reports it. Seeing money arrive is necessary, but with strangers it is not a guarantee. The FTC suggests local, in-person sales and cash where possible, and not accepting mobile payments from people you do not know."
        }
      },
      {
        "heading": "The Overpayment Refund Scam",
        "paragraphs": [
          "In this version, the buyer claims they paid you more than the price, by accident or for a made-up reason such as covering a mover, and asks you to send back the difference. The FTC names this bogus refund request as a common seller scam. If the original payment never existed, any refund you send is your own money.",
          "Cash App's guide warns that in these schemes the original payment is usually fraudulent and gets reversed, so you lose whatever you returned, and it advises holding off on any refund until the original payment has fully cleared. Venmo describes a related trick where a stranger pays you, says it was a mistake and asks you to send the money back as a new payment. Venmo recommends contacting its support so it can help reverse the original payment instead.",
          "The check version follows the same logic. The FTC's <a href=\"https://www.consumer.ftc.gov/consumer-alerts/2025/02/fake-check-scam-targets-online-car-sellers\">fake check alert for car sellers</a> explains that an overpaying check can appear in your account and only later be found to be fake, at which point the bank reverses the deposit. Its advice is simple: do not accept a check for more than the selling price, and never send money back to someone who says they overpaid."
        ],
        "callout": {
          "type": "warning",
          "text": "An overpayment followed by a request to send money back is a red flag on its own. Do not refund from your own funds, and do not buy gift cards, money orders or crypto for the buyer."
        }
      },
      {
        "heading": "\"Payment Pending\" Until You Upgrade, Pay a Fee or Ship",
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/fake-payment-screenshot-paypal-venmo-cash-app/fictional-example.png",
          "alt": "Fictional payment email from a lookalike sender claiming $1,200 is pending until the seller ships and refunds an extra $200, annotated with red flags.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional fake payment email. The money is never in the seller's own balance."
        },
        "paragraphs": [
          "Some fake emails claim the buyer's payment is waiting and will be released only after you take an extra step. A common one tells the seller to send money to upgrade their account. Zelle addresses this directly: it says no one can upgrade your Zelle account because there are no upgrades, and advises not clicking links in such emails and reporting them to your email provider.",
          "Another version says the money will appear only after you ship the item and add a tracking number. Venmo states that holding a payment until tracking is uploaded is not a feature it offers.",
          "Whatever the wording, the test is the same. If the message asks you to pay something, ship first, or log in through a link before you can see your money, stop and open your own app. If the payment is not already in your balance or activity, there is nothing waiting to be released."
        ]
      },
      {
        "heading": "Worked Example: A Fictional Bike Sale",
        "paragraphs": [
          "<strong>This scenario is fictional. The names, amounts, messages and apps described are invented for teaching and do not describe a real case or a test of any tool.</strong>",
          "Maya lists a used road bike for $180 on a local marketplace. A buyer called \"Jordan\" says they cannot meet today and want a friend to collect it. Jordan sends a screenshot of an email headed with a Zelle logo saying $280 has been sent and is pending. A second screenshot says the payment will be released once Maya sends $100 to complete an account upgrade, and Jordan adds that the extra money was for the friend's gas, so Maya should send the difference back.",
          "<strong>Step 1: treat the images as claims.</strong> Maya notes what they say: $280, pending, upgrade needed, refund requested. She does not tap anything in the chat.",
          "<strong>Step 2: check her own account.</strong> Zelle payments land in the recipient's bank account, so Maya opens her bank's app herself. There is no incoming $280, and no pending Zelle credit of any amount.",
          "<strong>Step 3: compare with official guidance.</strong> Zelle says there are no account upgrades. The FTC and Cash App both describe overpayment refund requests as a scam pattern. The screenshot also hides the sender address, so it cannot be checked against Zelle's official domains.",
          "<strong>Outcome.</strong> Maya keeps the bike, sends no money, and replies that she will release it once payment appears in her own account. She reports the listing conversation to the marketplace. Note that she reached this decision without needing to prove the screenshot was edited. The missing money in her own account was enough."
        ]
      },
      {
        "heading": "What ScreenshotChecker Can and Cannot Do Here",
        "paragraphs": [
          "ScreenshotChecker has no connection to PayPal, Venmo, Cash App, Zelle or any bank. It cannot see your balance, look up a transaction or confirm that anyone paid you. Nothing it reports replaces opening your own account.",
          "Our <a href=\"/payment-screenshot-checker/\">payment screenshot checker</a> is designed around Indian UPI receipt text (Google Pay, PhonePe, Paytm and BHIM). It does not have specific support for PayPal, Venmo, Cash App, Zelle or US bank-transfer receipts, so do not rely on it for these.",
          "What can help is reviewing the buyer's messages for scam patterns. If you screenshot the chat or the forwarded email, the <a href=\"/screenshot-scam-checker/\">screenshot scam checker</a> reads the text and flags signals such as urgency, refund or upgrade demands and requests to send money. The <a href=\"/\">main screenshot checker</a> combines extracted text, any available metadata and some image-forensics signals. These are rule-based clues that can miss a scam or flag a harmless message. They are not proof that an image is fake or genuine, and they cannot verify who sent it.",
          "If you want to share the conversation with a friend or post a warning, hide your own name, email and account details first with the <a href=\"/screenshot-redactor/\">screenshot redactor</a>."
        ],
        "cta": {
          "label": "Check a buyer's message for scam signals",
          "url": "/screenshot-scam-checker/",
          "description": "Flag pressure tactics and refund or upgrade requests in a screenshot, then confirm any payment in your own account."
        }
      },
      {
        "heading": "Refund Screenshots: \"I Already Refunded You\"",
        "paragraphs": [
          "Refund screenshots run the same trick in reverse. A seller who never shipped sends a PayPal or Venmo \"refund issued\" screen to make you drop a dispute. Or a buyer claims they were charged twice and shows a screenshot of a \"refund\" they say you owe, hoping you send money back before checking.",
          "A refund is only real when it appears in your own PayPal, Venmo, Cash App or bank activity. PayPal refunds show as a separate refund entry linked to the original payment; card refunds can take several business days to reach your statement, so a screenshot that says the money is back today while your account shows nothing is a reason to wait. Keep a payment dispute open until you see the refund yourself, and never send money to \"correct\" a refund someone else says they made."
        ],
        "checklist": [
          "Open your own app and look for the refund entry, not the other person's screen.",
          "Do not close a dispute or chargeback on the strength of a screenshot.",
          "Never send money back for a duplicate charge or refund you cannot see in your account."
        ]
      },
      {
        "heading": "If You Were Targeted: Report It",
        "paragraphs": [
          "Report the buyer through the marketplace's own reporting tools, and keep the original screenshots and messages. If you sent money or shared login details, contact your payment provider or bank straight away using its app, its official website or the number on your card.",
          "Fake emails and scams can be reported to the FTC at <a href=\"https://reportfraud.ftc.gov/\">ReportFraud.ftc.gov</a>. Zelle's marketplace guidance also points to forwarding phishing emails to reportphishing@apwg.org and fake texts to 7726 (SPAM). Venmo users can reach support in the app through the settings menu's help section."
        ],
        "checklist": [
          "Do not reply with codes, passwords or personal details.",
          "Report the buyer and listing conversation on the marketplace.",
          "Contact your provider or bank through the official app if money or login details were involved.",
          "Report the scam at ReportFraud.ftc.gov and forward fake emails as described above."
        ]
      }
    ],
    "faq": [
      {
        "question": "Can a payment screenshot prove a buyer paid me?",
        "answer": "No. A screenshot is an image the buyer controls. The only confirmation is the payment appearing in your own PayPal, Venmo or Cash App activity, or in your bank account for Zelle, which you open yourself."
      },
      {
        "question": "I got an email saying I was paid. Is that enough?",
        "answer": "No. Fake payment emails are a known seller scam. Do not use links in the email. Open the official app or type the provider's website address yourself and check your balance or activity."
      },
      {
        "question": "The buyer overpaid and wants the difference back. What should I do?",
        "answer": "Treat it as a scam warning. Do not send money from your own funds. Providers such as Cash App and Venmo describe this pattern, and the FTC says never to send money back to someone who claims to have overpaid you."
      },
      {
        "question": "Zelle says my payment is pending until I upgrade my account. Is that real?",
        "answer": "Zelle says there are no account upgrades and no one can upgrade your account. Do not click links or send money. Zelle payments go into your bank account, so check your bank app directly."
      },
      {
        "question": "Can ScreenshotChecker verify a PayPal, Venmo, Cash App or Zelle payment?",
        "answer": "No. It has no access to any payment provider or bank, and its payment checker is designed for Indian UPI receipts. The scam checker can flag warning signs in a screenshot of a buyer's message, but only your own account can show whether you were paid."
      },
      {
        "question": "If the money shows in my account, am I completely safe?",
        "answer": "It is the necessary first check, but Venmo notes that payments made with stolen cards or bank details can be removed later. With strangers, the FTC suggests meeting locally and accepting cash where possible."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": [
      "screenshot-checker-online",
      "fake-upi-payment-screenshot",
      "smishing-fake-sms"
    ],
    "cta": {
      "label": "Check a buyer's message for scam signals",
      "url": "/screenshot-scam-checker/",
      "description": "Review a screenshot of a buyer's chat or email for scam patterns. Then confirm any payment by opening your own account."
    }
  },
  // Growth push October 2026: long-tail guide
  {
    "slug": "fake-bank-transfer-screenshot",
    "title": "Fake Bank Transfer Screenshot: How to Check the Money Really Arrived",
    "seoTitle": "Fake Bank Transfer Screenshot? Check It Before You Act",
    "metaDescription": "Got a bank transfer, pending or bank error screenshot? None of them prove payment. Here is how to confirm the money in your own account and report fraud.",
    "category": "Security",
    "publishedAt": "2026-10-14",
    "authorName": "Virat Chauhan",
    "readTime": "8 min read",
    "excerpt": "A UK-first guide for freelancers, landlords and sellers: why a transfer screenshot is only a claim, how to confirm a credit in your own account, and what to do about overpayment requests.",
    "targetKeywords": [
      "fake bank transfer screenshot",
      "how to check if a bank transfer is real",
      "fake payment confirmation screenshot",
      "bank transfer pending scam",
      "faster payment not received",
      "overpayment scam refund"
    ],
    "keyTakeaway": {
      "title": "Your own account is the only confirmation",
      "text": "A screenshot of a bank transfer shows what someone claims happened on their screen. It does not move money. Log in to your own bank app or statement and look for the matching credit. Until it is there, treat the payment as unconfirmed and hold goods, files, keys or refunds."
    },
    "introduction": "You know a bank transfer was actually sent when the money appears as a credit in your own bank account, not when someone shows you a screenshot. Open your banking app or statement yourself and look for the exact amount from the expected payer. A \"scheduled\", \"pending\" or \"processing\" screen is not a completed payment, and no image checker can confirm a transfer, because none has access to the banking system.",
    "contentSections": [
      {
        "heading": "How to Confirm a Bank Transfer Really Arrived",
        "paragraphs": [
          "A banking-app screenshot is a picture of a screen. Banking screens are simple to recreate or edit, and a genuine screenshot can still describe a payment to the wrong account, an old transfer or one that was later stopped. The only evidence that settles the question on your side is a matching credit in your own records.",
          "Open your banking app or online banking directly, not through any link the payer sends you. Look at your transaction list rather than relying on a notification alone, and check the details listed below."
        ],
        "checklist": [
          "Log in to your own bank app or online banking independently and open the account the money should have reached.",
          "Find an incoming credit for the exact amount, on or after the date claimed, showing the expected payer name or reference.",
          "Make sure it is a completed credit in your transaction history, not a figure you have only seen in someone else's image.",
          "If nothing matches, treat the payment as unconfirmed. Ask the payer to check the status in their own banking app or with their bank.",
          "Hold goods, final files, keys or any refund until the credit appears. Do not let a deadline or a sob story change that order."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "<strong>Never release goods, services, deposits or refunds based only on a screenshot.</strong> The payer's screen is their claim. A credit in your own account is your confirmation."
        }
      },
      {
        "heading": "\"Scheduled\", \"Pending\" and \"Processing\" Are Not Paid",
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/fake-bank-transfer-screenshot/fictional-example.png",
          "alt": "Fictional UK bank app screenshot showing a scheduled £850 payment, annotated with what scheduled means and what to check.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional scheduled transfer. Only your own account shows whether the money arrived."
        },
        "paragraphs": [
          "Many people send a screenshot taken before a payment completed. A screen that says a payment is scheduled, pending or processing tells you, at best, that something was set up. It does not tell you the money has left their account, let alone reached yours. A scheduled payment can usually be changed or cancelled by the sender before it goes, so treat it as a promise, not a payment.",
          "In the UK, most one-off bank transfers between personal and business accounts travel over the Faster Payment System. According to <a href=\"https://www.wearepay.uk/what-we-do/payment-systems/faster-payment-system/types-of-faster-payment-transactions/\" class=\"text-primary font-medium underline hover:text-primary-active\">Pay.UK's description of Faster Payment transaction types</a>, funds from a single immediate payment usually arrive almost immediately, though occasionally it can take up to two hours. Pay.UK also says that a forward-dated payment is sent on the date the customer arranged in advance, and that standing orders go out on working days only.",
          "That timing gives you a useful benchmark. If a payer insists that a transfer has been \"pending\" for days, that is a reason for extra caution and for checking your account again, not a reason to hand over goods. It is still not proof of fraud on its own: some accounts and banks take longer, payments can be held for checks, and people make honest mistakes with sort codes and account numbers. Let the credit in your account decide, rather than the explanation."
        ],
        "callout": {
          "type": "warning",
          "text": "A common pressure line is \"the bank is holding the money until you send the item\" or \"until you refund the difference\". Your release of goods or money should never be the thing that unlocks a payment. If you hear this, stop and confirm in your own account."
        }
      },
      {
        "heading": "Worked Example: A Freelance Designer's Invoice (Fictional)",
        "paragraphs": [
          "<strong>This is a fictional teaching scenario. The names, amounts and app content are invented and do not describe a real person, business, bank or customer case.</strong> Maya, a freelance designer, sends a new client called \"Harbour Lane Studio\" an invoice for £1,200 for a logo package. She has agreed to send the final files once payment is received.",
          "<strong>The screenshot.</strong> The client replies with an image of a banking app showing £1,200 to Maya's name, her sort code and account number, and the status \"Payment processing\". The message says the bank has put the transfer on hold for security checks for three working days, and asks Maya to send the files today so the client can hit a launch deadline.",
          "<strong>Check 1: what does the image actually claim?</strong> Maya notes the amount, the payee details and the status. \"Processing\" means the screen itself does not claim a completed payment. She also notices the request to release work before any money arrives, which is exactly the order she agreed to avoid.",
          "<strong>Check 2: her own records.</strong> Maya opens her business bank app herself. There is no incoming £1,200 credit from the client. She checks again later that day and the following morning. Still nothing.",
          "<strong>Check 3: the twist.</strong> The next day the client sends a second screenshot showing £2,200 \"sent by mistake\" and asks Maya to return £1,000 straight away to a different account belonging to their \"finance partner\". Maya's account still shows no credit at all.",
          "<strong>Outcome.</strong> Maya does not send files or money. She replies politely that she releases work once funds show in her account and that any refund will only ever go back to the account it came from, after the original payment has cleared. The client stops replying. Maya keeps the messages and screenshots and reports the contact. Notice what decided this: not how convincing the screenshot looked, but the absence of a credit in Maya's own account and a request to send money to a third party.",
          "<strong>An alternative ending.</strong> If £1,200 had appeared in Maya's transaction history from the client, that credit, not the screenshot, would have been her confirmation. A genuine client who sends a processing screen by mistake loses nothing by waiting for the money to land."
        ]
      },
      {
        "heading": "Overpayment and Refund Requests: The Classic Follow-Up",
        "paragraphs": [
          "A fake screenshot is often only the opening move. The overpayment version goes like this: the \"buyer\" claims to have paid more than you asked, then urgently requests the difference back, often to another account. If the original payment never arrived, or is later reversed, the money you sent is your own.",
          "<a href=\"https://www.ulsterbank.co.uk/business/insights/technology/fraud/overpayment-fraud-be-wary-of-new-customers-that-are-too-good-to-be-true.html\" class=\"text-primary font-medium underline hover:text-primary-active\">Ulster Bank's guidance on overpayment fraud</a> describes the same pattern for businesses and lists warning signs such as a buyer offering to pay more than the asking price, a sudden request to cancel and refund, or a claim that funds are on hold until you return the overpayment. Its advice includes never sending money to a third party, refunding card payments only to the original card, and confirming the original payment has cleared and cannot be reversed before refunding anything.",
          "For landlords, the same pattern can appear as an overpaid deposit or rent. For marketplace sellers, it can be a buyer who \"paid extra for courier fees\". The safe response is the same: wait until the full amount is in your account, then refund only the genuine excess, only to the account it came from, and only if you are comfortable doing so."
        ],
        "callout": {
          "type": "tip",
          "text": "A refund request for a payment you cannot see in your own account is not a refund. It is a request for you to send new money."
        }
      },
      {
        "heading": "What ScreenshotChecker Can and Cannot Tell You",
        "paragraphs": [
          "<strong>ScreenshotChecker has no access to any bank, banking app or payment network.</strong> It cannot confirm that a transfer happened, that it reached you, or that a screenshot is genuine or fake. It can help you look more carefully at an image, and the results are clues for your own review, not proof.",
          "The <a href=\"/payment-screenshot-checker/\" class=\"text-primary font-medium underline hover:text-primary-active\">Payment Screenshot Checker</a> is designed for Indian UPI receipt text from apps such as Google Pay, PhonePe, Paytm and BHIM. It does not have specific support for UK bank transfer screens, so its rules are not a good fit for a Faster Payment screenshot.",
          "For a UK bank transfer screenshot, the <a href=\"/\" class=\"text-primary font-medium underline hover:text-primary-active\">main screenshot analyzer</a> can read the visible text with OCR, show any metadata the file still carries, list rule-based warning signs and run image-forensics checks such as error level analysis. OCR can misread digits, so compare its output with the image. The analysis does not measure fonts, icon positions or screen layout, and a low-risk result does not mean the image is unedited.",
          "If a payer sends two versions of the \"same\" confirmation, the <a href=\"/screenshot-comparison/\" class=\"text-primary font-medium underline hover:text-primary-active\">screenshot comparison tool</a> can show where the images differ. A difference tells you to ask questions; it cannot tell you which version, if either, reflects a real payment. The <a href=\"/screenshot-metadata-checker/\" class=\"text-primary font-medium underline hover:text-primary-active\">metadata checker</a> shows what file data remains, but metadata is often missing or changed when an image is re-saved or shared, so its absence is not a warning sign by itself. If the conversation also pushes urgency or odd payment instructions, the <a href=\"/screenshot-scam-checker/\" class=\"text-primary font-medium underline hover:text-primary-active\">scam checker</a> can highlight common pressure patterns in the message text."
        ],
        "cta": {
          "label": "Look for clues in a screenshot",
          "url": "/",
          "description": "Review OCR text, metadata and warning signs, then confirm any payment in your own bank account."
        }
      },
      {
        "heading": "If You Think You Have Been Targeted: Reporting in the UK",
        "paragraphs": [
          "<strong>Authorised push payment (APP) fraud</strong> is the term used when someone is tricked into sending money to a fraudster posing as a genuine payee. In a fake-screenshot overpayment scam, the refund you were pressured into sending can fall into this category. The <a href=\"https://www.psr.org.uk/our-work/app-scams/\" class=\"text-primary font-medium underline hover:text-primary-active\">Payment Systems Regulator's APP scams page</a> explains that people paying by Faster Payments or CHAPS between UK accounts are covered by reimbursement rules. If you sent money, contact your bank as soon as possible and ask about this.",
          "To reach your bank safely, use the number on your card or the bank's official website or app, not a number from a message. In the UK you can also call 159: <a href=\"https://www.stopscamsuk.org.uk/159\" class=\"text-primary font-medium underline hover:text-primary-active\">Stop Scams UK explains</a> that this short number connects you to your bank if it takes part in the scheme, and lists the participating banks.",
          "To report the fraud to police in England, Wales or Northern Ireland, use Report Fraud. It replaced Action Fraud as the national reporting service in December 2025, according to <a href=\"https://www.gov.uk/government/news/report-fraud-new-service-from-city-of-london-police\" class=\"text-primary font-medium underline hover:text-primary-active\">the government announcement of the new service</a>. Its <a href=\"https://www.reportfraud.police.uk/reporting-a-fraud/\" class=\"text-primary font-medium underline hover:text-primary-active\">reporting page</a> offers an online report at reportfraud.police.uk and directs people in Scotland to contact Police Scotland on 101. Call 999 if a crime is happening now and someone is in danger.",
          "Also report the account or listing on the marketplace or platform where you met the payer, and keep the original screenshots, messages, invoice and any bank references. If you share evidence publicly, hide unnecessary personal and account details first using the <a href=\"/blog/redact-screenshot-before-sharing/\" class=\"text-primary font-medium underline hover:text-primary-active\">redaction guide</a>."
        ]
      }
    ],
    "faq": [
      {
        "question": "Can a bank transfer screenshot prove I have been paid?",
        "answer": "No. A screenshot shows the payer's screen and can be edited or describe a different payment. Confirm a matching incoming credit in your own bank app or statement before releasing goods, services or refunds."
      },
      {
        "question": "How long does a UK bank transfer usually take to arrive?",
        "answer": "Pay.UK says single immediate Faster Payments usually arrive almost immediately and occasionally take up to two hours. Forward-dated payments go on the arranged date and standing orders go out on working days. A transfer described as pending for days deserves extra caution, but it is not proof of fraud by itself."
      },
      {
        "question": "Is a payment pending or scheduled screenshot the same as payment?",
        "answer": "No. Scheduled, pending or processing screens show a payment that has not completed. Wait until the money appears as a credit in your own account."
      },
      {
        "question": "Someone overpaid me and wants the difference back. What should I do?",
        "answer": "Check your own account first. If the full amount has not arrived, there is nothing to refund. If it has, consider refunding only the genuine excess, only to the account it came from, after confirming the original payment has cleared. Never send money on to a third party."
      },
      {
        "question": "Can ScreenshotChecker verify a bank transfer?",
        "answer": "No. It has no access to banks or payment systems. The analyzer, comparison and metadata tools can surface clues such as text, file data and image differences, but they cannot confirm a payment or prove a screenshot is real or fake."
      },
      {
        "question": "Where do I report a fake payment scam in the UK?",
        "answer": "Contact your bank straight away if you sent money, using its official number or 159. Report the fraud to Report Fraud, which replaced Action Fraud, if you are in England, Wales or Northern Ireland, or to Police Scotland on 101 if you are in Scotland. Also report the account on the platform where you met the payer."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["fake-receipt-ai-generated", "payment-failed-screenshot-scam", 
      "fake-upi-payment-screenshot",
      "screenshot-checker-online",
      "screenshot-analyzer-online"
    ],
    "cta": {
      "label": "Analyze a payment screenshot for clues",
      "url": "/",
      "description": "Use OCR, metadata and warning signs as an aid to review. Confirm any bank transfer in your own account."
    }
  },
  // Growth push October 2026: long-tail guide
  {
    "lang": "hi",
    "slug": "fake-payment-screenshot-kaise-pehchane",
    "title": "फर्जी पेमेंट स्क्रीनशॉट कैसे पहचानें: दुकान पर पैसा सच में आया या नहीं, ऐसे चेक करें",
    "seoTitle": "Fake Payment Screenshot कैसे पहचानें? GPay, PhonePe चेक",
    "metaDescription": "Google Pay या PhonePe का पेमेंट स्क्रीनशॉट असली है या नकली? सामान देने से पहले अपना UPI ऐप चेक करें। नकली स्क्रीनशॉट के संकेत और शिकायत का तरीका।",
    "category": "Security",
    "publishedAt": "2026-10-14",
    "updatedAt": "2026-11-17",
    "authorName": "Virat Chauhan",
    "readTime": "8 min read",
    "excerpt": "किराना दुकान, छोटे विक्रेता और OLX/Instagram पर सामान बेचने वालों के लिए आसान गाइड: ग्राहक का स्क्रीनशॉट नहीं, अपना UPI ऐप और बैंक रिकॉर्ड देखकर ही सामान दें। ₹1,850 का एक काल्पनिक उदाहरण भी शामिल है।",
    "targetKeywords": [
      "fake payment screenshot kaise pehchane",
      "nakli payment screenshot",
      "फर्जी पेमेंट स्क्रीनशॉट",
      "नकली पेमेंट स्क्रीनशॉट कैसे पहचानें",
      "payment aaya ya nahi kaise check kare",
      "fake payment app se dhokha"
    ],
    "keyTakeaway": {
      "title": "स्क्रीनशॉट नहीं, अपना खाता देखें",
      "text": "ग्राहक के फ़ोन की स्क्रीन या भेजा गया स्क्रीनशॉट सिर्फ़ एक दावा है, पैसा मिलने का सबूत नहीं। सामान देने से पहले अपने UPI ऐप की history, बैंक ऐप या बैंक स्टेटमेंट में वही रकम आई हुई देखें। पैसा न दिखे तो सामान रोक कर रखें। इसका मतलब यह नहीं कि ग्राहक ने पक्का धोखा दिया, बस पेमेंट अभी पक्की नहीं हुई।"
    },
    "introduction": "ग्राहक ने पेमेंट का स्क्रीनशॉट या फोटो दिखाया है तो सबसे पहले अपना UPI ऐप या बैंक ऐप खोलें और देखें कि उतनी ही रकम आपके खाते में आई है या नहीं। अगर आपके अपने रिकॉर्ड में पैसा नहीं दिख रहा, तो सामान न दें, चाहे स्क्रीन पर 'Payment Successful' कितना भी असली क्यों न लगे। नकली पेमेंट स्क्रीन बनाने वाले ऐप और एडिट किए गए स्क्रीनशॉट मौजूद हैं, इसलिए दुकान के काउंटर पर भरोसे लायक जांच सिर्फ़ आपके अपने खाते की है। यह गाइड किराना दुकानदारों, छोटे विक्रेताओं और OLX या Instagram पर सामान बेचने वालों के लिए है। स्क्रीनशॉट में दिया UTR नंबर सही फ़ॉर्मेट का है या नहीं, यह <a href=\"/utr-number-checker/\">UTR नंबर चेकर</a> से देख सकते हैं, पर असली जाँच आपके अपने बैंक स्टेटमेंट की ही है।",
    "contentSections": [
      {
        "heading": "पहला नियम: सामान देने से पहले अपने फ़ोन में पैसा देखें",
        "paragraphs": [
          "ग्राहक का फ़ोन आपके हाथ में नहीं, उसके हाथ में है। उसकी स्क्रीन पर जो दिख रहा है, वह कुछ भी हो सकता है: सही पेमेंट, पुरानी पेमेंट, किसी और को भेजी गई पेमेंट, या पूरी तरह नकली स्क्रीन। इसलिए जांच हमेशा अपनी तरफ़ से करें। पश्चिम बंगाल सरकार के <a href=\"https://cscoe.itewb.gov.in/upload/advisory-n/Advisory_Money_Transfer_Prank.pdf\">Cyber Security Centre of Excellence की advisory</a> भी दुकानदारों को यही सलाह देती है कि ग्राहक को जाने देने से पहले पक्का करें कि पैसा खाते में पहुंच गया है।",
          "अगर बैंक स्टेटमेंट से मिलान करना हो, तो <a href=\"https://support.google.com/pay/india/answer/16919844?hl=en\">Google Pay की बैंक स्टेटमेंट गाइड</a> बताती है कि तारीख, UPI transaction ID और credit वाले हिस्से में रकम मिलानी चाहिए। आपके बैंक में नाम या फ़ॉर्मेट थोड़ा अलग हो सकता है, इसलिए अपने बैंक के ही रिकॉर्ड को आधार मानें।",
          "OLX, Instagram या WhatsApp पर बेचने वालों के लिए भी नियम वही है: पैसा अपने खाते में दिखने से पहले सामान पैक या भेजें नहीं।"
        ],
        "checklist": [
          "अपना UPI ऐप या merchant ऐप खुद खोलें, ग्राहक के दिए किसी link से नहीं।",
          "History में देखें कि उतनी ही रकम, आज की तारीख में, आपके खाते में credit हुई है।",
          "शक हो तो बैंक ऐप में balance या passbook देखें, या बैंक के आधिकारिक नंबर से आया SMS मिलाएं।",
          "बड़ी रकम हो और फिर भी साफ़ न हो, तो बैंक स्टेटमेंट या बैंक की आधिकारिक सहायता से पूछें।",
          "पैसा न दिखे तो सामान काउंटर पर रोक कर रखें, विनम्रता से कहें कि पैसा आते ही दे देंगे।"
        ],
        "callout": {
          "type": "golden-rule",
          "text": "<strong>सिर्फ़ स्क्रीनशॉट देखकर सामान, पैसे या refund कभी न दें।</strong> ग्राहक के खाते से पैसा कटने का दावा, आपके खाते में पैसा आने का सबूत नहीं है। अपना ऐप, अपना बैंक, अपनी जांच।"
        }
      },
      {
        "heading": "नकली पेमेंट स्क्रीन कैसे बनती है",
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/fake-payment-screenshot-kaise-pehchane/fictional-example.png",
          "alt": "₹1,850 की काल्पनिक UPI रसीद, जिस पर चार निशान बताते हैं कि दुकानदार क्या जांचे।",
          "width": 1200,
          "height": 760,
          "caption": "चित्र 1. काल्पनिक उदाहरण। पैसा आया या नहीं, यह सिर्फ़ आपके अपने UPI ऐप या बैंक से पता चलता है।"
        },
        "paragraphs": [
          "कुछ 'prank' या नकली पेमेंट ऐप ऐसी स्क्रीन दिखाते हैं जो बिल्कुल असली पेमेंट जैसी लगती है। ऊपर बताई गई <a href=\"https://cscoe.itewb.gov.in/upload/advisory-n/Advisory_Money_Transfer_Prank.pdf\">सरकारी advisory</a> के अनुसार ऐसे ऐप में transaction ID और तारीख-समय भी अपनी मर्ज़ी से भरे जा सकते हैं, जबकि दुकानदार के खाते में असल में कोई पैसा नहीं जाता। ठग स्क्रीन दिखाकर कहता है कि पैसा थोड़ी देर में आ जाएगा, और निकल जाता है। नकली और असली स्क्रीनशॉट में फ़र्क पहचानने का अभ्यास करना हो, तो हमारी <a href=\"/spot-the-fake/hindi/\">10 सवालों वाली हिंदी क्विज़</a> खेलें।",
          "दूसरा तरीका है असली स्क्रीनशॉट को एडिट करना: रकम, नाम या तारीख बदल देना। तीसरा, किसी पुरानी असली पेमेंट का स्क्रीनशॉट दोबारा दिखा देना। इन तीनों में स्क्रीन पर हरा tick, logo और 'Successful' सब दिख सकता है।",
          "इसलिए स्क्रीनशॉट को 'असली लग रहा है या नहीं' देखकर फ़ैसला करना भरोसेमंद नहीं है। देखने में अच्छा स्क्रीनशॉट भी गलत हो सकता है, और थोड़ा अजीब दिखने वाला स्क्रीनशॉट भी सच्चा हो सकता है। फ़ैसला आपके खाते की entry से होना चाहिए।"
        ]
      },
      {
        "heading": "Soundbox और SMS: कितना भरोसा करें?",
        "paragraphs": [
          "बहुत सी दुकानों में soundbox लगा होता है जो पेमेंट आने पर बोलकर बताता है। यह काम की चीज़ है, क्योंकि आवाज़ आपके अपने device से आती है, ग्राहक के फ़ोन से नहीं। ऊपर वाली advisory भी soundbox को एक उपयोगी उपाय बताती है। ध्यान रखें कि आवाज़ आपके soundbox से ही आई हो; ग्राहक के फ़ोन से आई कोई आवाज़ आपका सबूत नहीं है।",
          "<strong>Soundbox न बोले, तो भी यह अकेले सबूत नहीं कि स्क्रीनशॉट नकली है।</strong> नेटवर्क, बिजली, बैटरी या device की setting की वजह से alert छूट सकता है। ऐसे में ग्राहक पर इल्ज़ाम लगाने के बजाय अपना ऐप खोलकर history देखें।",
          "SMS के साथ भी सावधानी रखें। किसी अनजान नंबर से आया 'आपके खाते में पैसा जमा हुआ' वाला मैसेज बैंक का नहीं भी हो सकता। ऐसे नकली मैसेज पहचानने के लिए हमारी <a href=\"/blog/smishing-fake-sms/\">fake SMS गाइड</a> पढ़ें। शक हो तो SMS के बजाय सीधे बैंक ऐप में balance और history देखें।"
        ],
        "callout": {
          "type": "tip",
          "text": "भीड़ के समय सबसे आसान आदत: हर UPI पेमेंट के बाद एक सेकंड के लिए अपने फ़ोन में history देख लें। बड़ी रकम पर यह आदत ज़रूर रखें।"
        }
      },
      {
        "heading": "\"पैसा pending है, आ जाएगा\" वाला बहाना",
        "paragraphs": [
          "कभी-कभी सच में पेमेंट अटक जाती है। <a href=\"https://support.google.com/pay/india/answer/16920039?hl=en-IN\">Google Pay की transaction status गाइड</a> के अनुसार processing वाली पेमेंट का status बाद में Success या Failed में बदलता है, और इसमें बैंक को कुछ कामकाजी दिन लग सकते हैं। यही गाइड भेजने वाले को सलाह देती है कि processing के दौरान दोबारा पेमेंट न करे।",
          "दुकानदार के लिए इसका सीधा मतलब है: <strong>pending या hold का मतलब है कि पैसा अभी आपके पास नहीं आया।</strong> ग्राहक ईमानदार भी हो सकता है, फिर भी पैसा आने तक सामान देना आपकी जोखिम है। ठग यही बहाना इस्तेमाल करते हैं क्योंकि यह सुनने में सामान्य लगता है।",
          "आप ग्राहक से कह सकते हैं कि थोड़ी देर रुक जाएं, नकद दे दें, या पैसा आने के बाद सामान ले जाएं। अगर ग्राहक दूसरे तरीके से पेमेंट कर दे और बाद में पहली पेमेंट भी आपके खाते में आ जाए, तो दूसरी रकम तभी लौटाएं जब दोनों entry आपके अपने रिकॉर्ड में साफ़ दिखें।"
        ]
      },
      {
        "heading": "\"गलती से ज़्यादा पैसे चले गए, वापस कर दो\" वाला धोखा",
        "paragraphs": [
          "एक आम चाल यह है: ग्राहक ₹1,000 के सामान के लिए ऐसा स्क्रीनशॉट दिखाता है जिसमें ₹10,000 लिखा है, फिर कहता है कि गलती हो गई, बाकी ₹9,000 वापस भेज दो। अगर असल में कोई पैसा आया ही नहीं, तो आप सामान भी देते हैं और अपनी जेब से पैसे भी।",
          "नियम वही है: पहले अपने खाते में देखें कि कितनी रकम सच में आई है। जितना दिख रहा है, उससे ज़्यादा का कोई हिसाब न करें। अगर सच में ज़्यादा पैसा आया है, तो भी किसी के कहने पर नए नंबर या नए UPI ID पर न भेजें; अपने बैंक या UPI ऐप की आधिकारिक सहायता से सही तरीका पूछें।",
          "कुछ ठग 'refund' या 'बाकी पैसे' भेजने के नाम पर QR code scan करवाते हैं या UPI PIN डलवाते हैं। <a href=\"https://npci.org.in/what-we-do/upi/upi-safety-shield\">NPCI की UPI Safety Shield</a> साफ़ कहती है कि UPI PIN सिर्फ़ पैसे कटवाने के लिए डाला जाता है, पैसे लेने के लिए नहीं, और QR code सिर्फ़ पेमेंट करने के लिए scan करें। <a href=\"https://support.google.com/pay/india/answer/9851787?hl=en\">Google Pay की fraud गाइड</a> भी यही बताती है कि पैसा पाने के लिए PIN की ज़रूरत नहीं होती।"
        ],
        "callout": {
          "type": "warning",
          "text": "<strong>पैसा लेने के लिए कभी QR code scan न करें और कभी UPI PIN न डालें।</strong> अगर कोई कहे कि PIN डालोगे तभी पैसा आएगा, तो समझ जाइए कि पैसा आपके खाते से जाने वाला है।"
        }
      },
      {
        "heading": "काल्पनिक उदाहरण: किराना दुकान पर ₹1,850 की खरीदारी",
        "paragraphs": [
          "<strong>यह एक काल्पनिक उदाहरण है। दुकान, लोग और रकम सब समझाने के लिए गढ़े गए हैं; यह कोई असली घटना या checker की जांच का नतीजा नहीं है।</strong> 'गुप्ता जनरल स्टोर' के मालिक सुनील शाम की भीड़ में हैं। एक ग्राहक आटा, तेल और कुछ सामान लेता है, बिल बनता है ₹1,850। ग्राहक अपना फ़ोन दिखाता है जिस पर लिखा है 'Payment Successful ₹1,850' और सुनील की दुकान का नाम।",
          "<strong>जांच 1: soundbox।</strong> सुनील का soundbox कुछ नहीं बोला। वह ग्राहक पर शक नहीं जताते, क्योंकि alert कई कारणों से छूट सकता है। लेकिन वह सामान का थैला काउंटर पर ही रखते हैं।",
          "<strong>जांच 2: अपना ऐप।</strong> सुनील अपना UPI ऐप खोलकर history देखते हैं। पिछले दस मिनट में ₹1,850 की कोई entry नहीं है। एक ₹1,850 की entry है, पर वह सुबह किसी और ग्राहक की है, इसलिए उससे यह पेमेंट पक्की नहीं होती।",
          "<strong>जांच 3: बहाना।</strong> ग्राहक कहता है, 'pending होगा, आ जाएगा, मुझे जल्दी है।' सुनील विनम्रता से कहते हैं कि पैसा दिखते ही सामान दे देंगे, या ग्राहक नकद दे सकता है।",
          "<strong>नतीजा A: पांच मिनट बाद ₹1,850 की entry आ जाती है।</strong> सुनील सामान दे देते हैं। ध्यान दें, फ़ैसला स्क्रीनशॉट से नहीं, उनके अपने ऐप की entry से हुआ।",
          "<strong>नतीजा B: पैसा नहीं आता और ग्राहक कहता है 'मैंने तो ₹2,850 भेज दिए थे, ₹1,000 वापस कर दो'।</strong> सुनील के खाते में कोई रकम आई ही नहीं है, इसलिए वह न सामान देते हैं, न कोई पैसा लौटाते हैं। पैसा न आना अपने आप में यह साबित नहीं करता कि ग्राहक ने स्क्रीनशॉट बनाया, लेकिन 'वापस भेजो' की मांग पर सुनील सतर्क हो जाते हैं और ज़रूरत लगे तो नीचे बताए तरीके से शिकायत कर सकते हैं।"
        ]
      },
      {
        "heading": "ScreenshotChecker का payment checker क्या करता है, क्या नहीं",
        "paragraphs": [
          "अगर ग्राहक ने स्क्रीनशॉट WhatsApp पर भेजा है और आप उसे ध्यान से देखना चाहते हैं, तो <a href=\"/payment-screenshot-checker/hindi/\">Payment Screenshot Checker (हिंदी)</a> मदद कर सकता है। यह OCR से रसीद पर लिखा text पढ़ता है, जैसे रकम, नाम और reference, और फिर तय नियमों से कुछ चेतावनी वाले संकेत दिखाता है, जैसे रकम में गड़बड़ी या अजीब reference। यह भारतीय UPI रसीदों (Google Pay, PhonePe, Paytm, BHIM) के text के लिए बनाया गया है।",
          "<strong>यह checker यह पक्का नहीं कर सकता कि पैसा आपके खाते में आया।</strong> इसका आपके बैंक या UPI ऐप से कोई संपर्क नहीं है। यह font, icon की जगह या screen का layout नहीं मापता, और यह साबित नहीं कर सकता कि स्क्रीनशॉट असली है या नकली। OCR कभी-कभी कोई अंक गलत पढ़ सकता है, इसलिए नतीजे को हमेशा मूल स्क्रीनशॉट से मिलाकर देखें।",
          "'LOW RISK' का मतलब यह नहीं कि पैसा मिल गया, और 'HIGH RISK' का मतलब यह नहीं कि ग्राहक ठग है। दोनों सूरतों में आख़िरी फ़ैसला आपके UPI ऐप या बैंक की entry से ही करें। ज़्यादा जानकारी के लिए हमारी <a href=\"/blog/fake-upi-payment-screenshot/\">UPI payment screenshot गाइड</a> देखें।"
        ],
        "cta": {
          "label": "पेमेंट स्क्रीनशॉट जांचें",
          "url": "/payment-screenshot-checker/",
          "description": "रसीद का text और चेतावनी के संकेत देखें, फिर पैसा अपने खाते में खुद पक्का करें।"
        }
      },
      {
        "heading": "धोखा हो जाए तो कहां शिकायत करें",
        "paragraphs": [
          "अगर आपके साथ पैसों का साइबर धोखा हुआ है, तो देर न करें। <a href=\"https://financialservices.gov.in/beta/page/csft\">वित्तीय सेवा विभाग (भारत सरकार) के पेज</a> के अनुसार आप National Cybercrime Helpline <strong>1930</strong> पर कॉल करके शिकायत दर्ज करा सकते हैं, और SMS पर मिले acknowledgement नंबर से 24 घंटे के अंदर <a href=\"https://cybercrime.gov.in/\">cybercrime.gov.in</a> पर पूरी शिकायत दर्ज करनी होती है। यह तरीका बदल सकता है, इसलिए शिकायत से पहले आधिकारिक पोर्टल पर ताज़ा जानकारी देख लें।",
          "अपने बैंक और UPI ऐप को भी बताएं। <a href=\"https://support.google.com/pay/india/answer/9851787?hl=en\">Google Pay की fraud गाइड</a> बैंक को transaction की जानकारी देने और ऐप के अंदर वाले Help/Support से ही मदद लेने की सलाह देती है, इंटरनेट पर मिले किसी अनजान 'customer care' नंबर से नहीं।",
          "शिकायत के लिए स्क्रीनशॉट, ग्राहक का नंबर या UPI ID, समय और रकम संभाल कर रखें। अगर आप यह स्क्रीनशॉट किसी WhatsApp group या social media पर लोगों को सावधान करने के लिए डालना चाहते हैं, तो पहले अपना नाम, खाता नंबर और UPI ID छिपा दें। इसके लिए <a href=\"/blog/redact-screenshot-before-sharing/\">स्क्रीनशॉट redact करने की गाइड</a> देखें।"
        ]
      }
    ],
    "faq": [
      {
        "question": "क्या पेमेंट का स्क्रीनशॉट पैसा मिलने का सबूत है?",
        "answer": "नहीं। स्क्रीनशॉट सिर्फ़ यह दिखाता है कि किसी फ़ोन की स्क्रीन पर क्या था। पैसा मिला या नहीं, यह अपने UPI ऐप की history, बैंक ऐप या बैंक स्टेटमेंट में entry देखकर ही पक्का करें।"
      },
      {
        "question": "Soundbox नहीं बोला तो क्या स्क्रीनशॉट नकली है?",
        "answer": "ज़रूरी नहीं। नेटवर्क, बिजली या setting की वजह से alert छूट सकता है। Soundbox न बोले तो ग्राहक पर इल्ज़ाम लगाने के बजाय अपना ऐप खोलकर देखें कि रकम आई है या नहीं।"
      },
      {
        "question": "ग्राहक कहे कि पैसा pending है तो क्या करें?",
        "answer": "Pending का मतलब है कि पैसा अभी आपके खाते में नहीं आया। सामान रोक कर रखें और पैसा दिखने का इंतज़ार करें, या ग्राहक से नकद या दूसरा तरीका पूछें। दोनों पेमेंट आ जाएं तो एक रकम तभी लौटाएं जब दोनों आपके रिकॉर्ड में साफ़ दिखें।"
      },
      {
        "question": "पैसा लेने के लिए UPI PIN डालना पड़ता है क्या?",
        "answer": "नहीं। NPCI के अनुसार UPI PIN सिर्फ़ पैसे भेजने या कटवाने के लिए डाला जाता है, पैसे लेने के लिए नहीं। QR code भी सिर्फ़ पेमेंट करने के लिए scan करें। कोई PIN या QR scan से पैसा देने की बात करे तो सावधान हो जाएं।"
      },
      {
        "question": "क्या ScreenshotChecker बता सकता है कि पैसा आया या नहीं?",
        "answer": "नहीं। Payment Screenshot Checker रसीद का text OCR से पढ़कर कुछ चेतावनी वाले संकेत दिखाता है। इसका बैंक से कोई संपर्क नहीं है और यह font, icon या layout नहीं मापता। पैसा आया या नहीं, यह अपने खाते में ही देखें।"
      },
      {
        "question": "नकली पेमेंट से धोखा हो जाए तो शिकायत कहां करें?",
        "answer": "National Cybercrime Helpline 1930 पर कॉल करें और cybercrime.gov.in पर शिकायत दर्ज करें। अपने बैंक और UPI ऐप की आधिकारिक सहायता को भी बताएं। स्क्रीनशॉट, समय, रकम और ग्राहक का नंबर या UPI ID संभाल कर रखें।"
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["utr-number-kya-hota-hai", "payment-fail-paisa-kat-gaya", "task-job-scam-se-kaise-bache", "qr-code-fraud-se-kaise-bache", "qr-code-scam", "digital-arrest-kya-hai", 
      "fake-upi-payment-screenshot",
      "smishing-fake-sms",
      "screenshot-checker-online"
    ],
    "cta": {
      "label": "पेमेंट स्क्रीनशॉट जांचें",
      "url": "/payment-screenshot-checker/",
      "description": "OCR से रसीद का text और चेतावनी के संकेत देखें। पैसा मिला या नहीं, यह हमेशा अपने UPI ऐप या बैंक में पक्का करें।"
    }
  },
  {
    "slug": "india-post-courier-sms-scam",
    "title": "India Post or Courier SMS Saying Your Address Is Incomplete? How to Check",
    "seoTitle": "India Post SMS Scam: Parcel Held, Update Address Link?",
    "metaDescription": "India Post or courier SMS saying your parcel is held for an incomplete address? Do not tap the link. Red flags, how to track safely and where to report.",
    "category": "Threat Analysis",
    "publishedAt": "2026-10-16",
    "updatedAt": "2026-11-17",
    "authorName": "Virat Chauhan",
    "readTime": "8 min read",
    "excerpt": "Why the 'parcel held, update your address' text is a common smishing pattern in India, how to check your parcel without the link, what to do if you already paid, and how to report the SMS on Chakshu.",
    "targetKeywords": [
      "india post sms scam",
      "india post address update sms fake",
      "parcel held incomplete address sms",
      "fake courier delivery sms india",
      "india post redelivery fee scam",
      "report fraud sms chakshu"
    ],
    "keyTakeaway": {
      "title": "Never update your address from an SMS link",
      "text": "Unsure about a delivery text? Do not tap its link, call the number in it or share personal details to verify your identity. Visit the official India Post or courier website yourself, or the shop's own app, and enter the tracking number manually. Never pay a redelivery fee or enter card, UPI or OTP details on a page you reached from that SMS."
    },
    "introduction": "If you are unsure about a courier delivery notification on your phone, visit the official courier website yourself and enter the tracking details manually. Do not click the link in the message, call the number in the text or give personal information to verify your identity. Is the SMS itself real? Almost certainly not, if it came with a link asking you to update your address. The PIB Fact Check unit has called this kind of India Post message fake and said India Post does not send messages asking people to update their address to get an article delivered. Do not tap the link: check your order in the shop's or courier's own app, or type the official India Post website yourself, and if you already entered card or UPI details, call your bank and the 1930 helpline straight away.",
    "contentSections": [
      {
        "heading": "How the Fake Parcel Address SMS Works",
        "paragraphs": [
          "The message usually pretends to come from India Post or a courier. It says a parcel is waiting at a warehouse or hub but cannot be delivered because the address is incomplete or wrong. A deadline follows, often 24 or 48 hours, after which the parcel will supposedly be returned. The fix is always the same: tap a link and update your details.",
          "The timing makes it convincing. Many people in India have an online order or a document on the way at any given moment, so a delivery problem feels plausible. The message rarely names what was sent or who sent it, because the sender does not know.",
          "The link opens a page dressed up to look like a postal or courier site. It may ask for your name, address and phone number first, then for a small redelivery or address-correction fee. Paying that fee is where card numbers, expiry dates, CVVs, UPI PINs or one-time passwords get typed into a form controlled by the sender. The small amount is the bait; the details you enter are the real target.",
          "According to <a href=\"https://www.newsonair.gov.in/govt-debunks-sms-from-india-post-asking-people-to-update-their-address\">a News on AIR report of the PIB Fact Check</a>, the Fact Check unit labelled an India Post message asking people to update their address as fake, said India Post does not send such messages to deliver articles, and advised people not to click links in them."
        ],
        "callout": {
          "type": "warning",
          "text": "<strong>A tiny fee is not a sign of safety.</strong> A ₹25 or ₹50 charge feels harmless, but the payment form can capture full card or UPI details. Do not pay any amount on a page you opened from a delivery SMS."
        }
      },
      {
        "heading": "How to Check Whether Your Parcel Is Really Held",
        "paragraphs": [
          "Verify the parcel through a route you chose yourself, not one the message chose for you. That one habit protects you however convincing the SMS looks.",
          "If you are expecting an online order, open the shopping app or website where you bought it and look at the order's own tracking page. It will usually name the courier and show a consignment or AWB number. For India Post items, type <a href=\"https://www.indiapost.gov.in/\">indiapost.gov.in</a> into your browser yourself and use its tracking option with the number from your receipt or order page. For a private courier, use that courier's official app or the site you reach by typing its name yourself, not a search ad or a link from the SMS.",
          "If the official tracking shows a genuine delivery problem, contact the seller or the courier through the support channel listed in your order, or visit your local post office with the receipt. A real address issue can be resolved without paying a stranger through a link."
        ],
        "checklist": [
          "Do not tap the link, reply, or call any number given in the SMS.",
          "Ask yourself whether you are actually expecting a parcel, and from whom.",
          "Open the shop's own app or website and check that order's tracking status.",
          "For India Post items, type indiapost.gov.in yourself and track using the number from your receipt or order page.",
          "For a private courier, use its official app or a site you typed yourself.",
          "If tracking shows a real problem, use the support contact listed in your order or visit the post office."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "<strong>Type the address yourself.</strong> Close the SMS, open the official app or type the official website, and check from there. If the problem is real, it will show up in your own tracking."
        }
      },
      {
        "heading": "Red Flags in the Message and the Link",
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/india-post-courier-sms-scam/fictional-example.png",
          "alt": "Fictional SMS claiming a parcel is held for an incomplete address, with a lookalike link and a ₹25 fee, annotated with red flags.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional parcel scam text. The deadline, the unofficial link and the small fee are the giveaways."
        },
        "paragraphs": [
          "No single clue settles it, but several together should stop you. These are the signs worth looking for before you do anything else.",
          "<strong>The sender is an ordinary mobile number.</strong> A delivery message from a personal-looking ten-digit number, or a number with a foreign country code, deserves extra caution. A named business sender is not proof of anything, though, so use this only as one clue among several.",
          "<strong>The link does not lead to the official domain.</strong> India Post's site ends in .gov.in. Watch for lookalikes that add words such as update, redeliver or track to the brand name, use endings like .top, .xyz, .com or .org, or hide behind a shortened link. A brand name somewhere inside the address does not make it official.",
          "<strong>The message manufactures urgency.</strong> Phrases like update within 24 hours, final notice or parcel will be returned are designed to make you act before you think.",
          "<strong>It asks for money or payment details to release a parcel.</strong> A redelivery or address-correction fee requested through a text link is the step that turns a fake message into a financial loss.",
          "<strong>It is vague about the parcel.</strong> No sender name, no order reference, no item description. Genuine tracking pages for your own orders usually tell you exactly what is coming and from whom."
        ]
      },
      {
        "heading": "Worked Example: A Fictional Noida Order",
        "paragraphs": [
          "<strong>This is a fictional example. The names, numbers, link and amounts are invented for teaching and do not describe a real case or a test of any tool.</strong> Meera lives in Sector 62, Noida, and is waiting for a pair of headphones she ordered online two days ago.",
          "On Tuesday evening she receives an SMS from a ten-digit number starting +91 7XXXX: \"IndiaPost: Your parcel is held at our hub because the address is incomplete. Update within 24 hours or it will be returned: indiapost-redelivery.example/in. Redelivery fee Rs 25.\"",
          "<strong>Step 1: pause and compare.</strong> Meera notices four things: a mobile-number sender, a link that is not indiapost.gov.in, a 24-hour deadline and a fee. She does not tap the link.",
          "<strong>Step 2: check her own records.</strong> She opens the shopping app where she placed the order. The order page shows a private courier, not India Post, with the status shipped and an expected delivery date of Thursday. Nothing mentions an address problem.",
          "<strong>Step 3: gather clues safely.</strong> She takes a screenshot of the SMS and uploads it to the scam checker to see which warning-sign rules it raises, and pastes the link text into the link checker without opening it. Whatever those tools return, her decision rests on step 2: her real order tracking shows no problem.",
          "<strong>Step 4: report and delete.</strong> She reports the SMS through Chakshu on Sanchar Saathi, then deletes it. On Thursday the headphones arrive as scheduled.",
          "<strong>A different ending.</strong> Suppose her neighbour received the same SMS and paid the ₹25 by card before realising. He should call his bank's official helpline at once to block the card and dispute the payment, call 1930, and file a complaint on cybercrime.gov.in. Reporting the SMS on Chakshu is useful too, but it does not replace a fraud complaint."
        ]
      },
      {
        "heading": "How ScreenshotChecker Can Help (and Where It Stops)",
        "paragraphs": [
          "ScreenshotChecker cannot tell you whether India Post or a courier really sent a message. It has no access to postal systems, courier databases, your bank or your phone's message records. What it can do is give you clues to weigh alongside your own checks.",
          "The <a href=\"/screenshot-scam-checker/\">Screenshot Scam Checker</a> reads the text in a screenshot of the SMS with OCR and applies rule-based checks for common scam patterns, such as deadline pressure, parcel or delivery bait and requests for codes. Its results are warning signs, not a verdict. A fresh variation of the wording may raise few or no signals, OCR can misread small or cropped text, and a genuine urgent notice can also trigger a rule.",
          "The <a href=\"/suspicious-link-checker/\">Suspicious Link Checker</a> compares a pasted link against a historical, labelled dataset of URLs in your browser, without visiting the site. A match tells you that address or domain appears in those past records with a label. <strong>No match does not mean the link is safe.</strong> Scam domains are often new and short-lived, so a link created last week may simply not be in the dataset. For a delivery SMS, the more useful question is simpler: is this the official domain? If it is not indiapost.gov.in or the courier's own site, do not open it.",
          "If you want to share a screenshot of the scam with family or a group to warn them, consider hiding your own phone number and any personal details first with the <a href=\"/screenshot-redactor/\">screenshot redactor</a>."
        ],
        "cta": {
          "label": "Check a Suspicious SMS Screenshot",
          "url": "/screenshot-scam-checker/",
          "description": "Review scam warning signs in the message text, then verify your parcel through the official app or website."
        }
      },
      {
        "heading": "What to Do If You Already Entered Card or UPI Details",
        "paragraphs": [
          "Act quickly. Call your bank's official helpline, from the number on your card or in your banking app, and ask them to block the card or UPI access and to raise a dispute for any payment you did not authorise. The RBI's <a href=\"https://rbi.org.in/Scripts/NotificationUser.aspx?Id=11040\">customer protection circular on unauthorised electronic transactions</a> tells customers to report such transactions to their bank as early as possible, warns that delay increases the risk of loss, and requires banks to provide round-the-clock reporting channels.",
          "If money has left your account, or you shared card, UPI or OTP details, report it as financial cyber fraud. The <a href=\"https://sancharsaathi.gov.in/sfc/\">Sanchar Saathi Chakshu page</a> itself directs people who have already been defrauded to the cyber crime helpline 1930 or to <a href=\"https://cybercrime.gov.in/\">cybercrime.gov.in</a>, rather than to Chakshu.",
          "Keep the SMS, a screenshot of it, the sender number, the link text, the time you received it, and any transaction reference or bank SMS about the payment. These details help your bank and the police. Do not share an OTP or PIN with anyone who calls offering to help reverse the payment."
        ],
        "checklist": [
          "Call your bank's official helpline and block the card or UPI access.",
          "Ask the bank to dispute any payment you did not authorise.",
          "Call 1930 and file a complaint on cybercrime.gov.in.",
          "Change any password you typed on the fake page, and check for unfamiliar UPI mandates.",
          "Save the SMS, sender number, link text and transaction references."
        ],
        "callout": {
          "type": "info",
          "text": "<strong>Entered details but did not pay?</strong> Still call your bank. A card number with its expiry date and CVV can be misused later, so ask whether the card should be blocked and reissued."
        }
      },
      {
        "heading": "Report the Fake SMS on Chakshu",
        "paragraphs": [
          "If you did not lose money, report the message through Chakshu, the Department of Telecommunications' facility on the <a href=\"https://sancharsaathi.gov.in/\">Sanchar Saathi portal</a> for suspected fraud calls, SMS and WhatsApp messages. The Sanchar Saathi site describes reaching it through its citizen services section or the Sanchar Saathi app, choosing the medium and category, entering the details, optionally attaching a screenshot and verifying your mobile number with an OTP. Check the portal for the current steps, as the layout can change.",
          "After reporting, delete the message and block the sender. If you have older relatives who shop online or receive post, show them what this message looks like; a familiar example is often the best warning.",
          "Want to practise spotting messages like this one? Try the <a href=\"/spot-the-fake/\">Spot the Fake quiz</a>, ten rounds of fictional scam and legitimate messages."
        ]
      }
    ],
    "faq": [
      {
        "question": "What should you do if you are unsure about a courier delivery notification on your phone?",
        "answer": "Visit the official courier website (or the India Post website, or the shop's own app) and enter the tracking details manually. Do not click the link in the message, call the number mentioned in the text or provide personal information to verify your identity: those are exactly the steps a fake delivery text wants you to take."
      },
      {
        "question": "I got an SMS saying an update regarding my request has been shared with me. Is it genuine?",
        "answer": "A line such as \"Dear customer, an update regarding your request has been shared with you via SMS\" is generic and does not prove who sent it. If you did not raise a request, treat it as suspicious. If you did, check the update in the company's own app or on a website you typed yourself, not through a link or phone number in the message."
      },
      {
        "question": "Does India Post send SMS asking you to update your address?",
        "answer": "The PIB Fact Check unit has said India Post does not send messages asking people to update their address for delivery, and labelled such a message fake. Treat any SMS with a link to update your address as suspicious and check your parcel through the official India Post website or your order page instead."
      },
      {
        "question": "Is the small redelivery fee in a parcel SMS real?",
        "answer": "Do not pay it. A fee requested through a link in a delivery text is a common way to collect card or UPI details. If you think a parcel is genuinely stuck, check the official tracking and contact the seller, courier or post office through a channel you found yourself."
      },
      {
        "question": "I clicked the link but did not enter anything. What should I do?",
        "answer": "Close the page and do not return to it. Do not download anything it offers. If you did not enter details or install anything, report the SMS on Chakshu and delete it. If you are unsure what you entered, call your bank to be safe."
      },
      {
        "question": "I paid the fee by card or UPI. Can I get the money back?",
        "answer": "Call your bank's official helpline immediately to block the card or UPI access and dispute the transaction, then call 1930 and file a complaint on cybercrime.gov.in. Recovery is not guaranteed, but reporting quickly gives your bank and the authorities the best chance to act."
      },
      {
        "question": "Where do I report a fake India Post or courier SMS?",
        "answer": "If you did not lose money, report it through Chakshu on the Sanchar Saathi portal or app. If you lost money or shared payment details, call 1930 or report on cybercrime.gov.in, and contact your bank."
      },
      {
        "question": "Can ScreenshotChecker tell me if the delivery SMS is genuine?",
        "answer": "No. The scam checker looks for common warning signs in the message text and the link checker compares a link with a historical labelled dataset. Both give clues, not proof, and a link with no match is not necessarily safe. Confirm your parcel through the official app or website."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["digital-arrest-scam", 
      "smishing-fake-sms",
      "suspicious-link-checker-online",
      "screenshot-checker-online"
    ],
    "cta": {
      "label": "Check a Suspicious SMS Screenshot",
      "url": "/screenshot-scam-checker/",
      "description": "See which scam warning signs appear in the message text. Then verify your parcel through the official India Post or courier app or website."
    }
  },
  {
    "slug": "electricity-bill-disconnection-sms-scam",
    "title": "Electricity Disconnection Tonight SMS: Is It a Scam?",
    "seoTitle": "Electricity Bill SMS Scam: Power Cut Tonight Message?",
    "metaDescription": "Got an SMS saying your electricity will be cut tonight unless you call an officer? It is a scam. How to check your real bill, and what to do if you paid.",
    "category": "Threat Analysis",
    "publishedAt": "2026-10-16",
    "authorName": "Virat Chauhan",
    "readTime": "7 min read",
    "excerpt": "How fake power-cut messages lead to a phone call, a screen-sharing app or a payment link, how to check your bill through official channels, and what to do if you already responded.",
    "targetKeywords": [
      "electricity bill scam message",
      "electricity disconnection SMS scam",
      "electricity officer call scam",
      "electricity bill not updated message",
      "fake electricity bill SMS India",
      "bijli bill fraud message"
    ],
    "keyTakeaway": {
      "title": "Check the bill yourself, never through the message",
      "text": "Treat a message that threatens a power cut tonight and gives a mobile number to call as a likely scam. Do not call, click or install anything it suggests. Open your discom's official app or website, or look at your latest bill, and contact the discom only through the helpline it publishes there."
    },
    "introduction": "Very likely, yes. A message warning that your electricity will be disconnected tonight because your bill is \"not updated\", and asking you to call an \"electricity officer\" on a mobile number, matches a fraud pattern that electricity distribution companies have publicly warned about. Do not call the number, click any link or install any app it mentions. Check your bill status yourself in your discom's official app or website, or on your latest bill, and use only the helpline printed there.",
    "contentSections": [
      {
        "heading": "How the Electricity Disconnection Scam Works",
        "paragraphs": [
          "The message usually arrives by SMS or WhatsApp. It says the power supply will be cut tonight, often at a specific time, because last month's payment was not recorded. It ends with a 10-digit mobile number and an instruction to contact an officer immediately. The deadline is the hook: it leaves little time to stop and check.",
          "Delhi discom Tata Power-DDL described this pattern in a <a href=\"https://tatapower-ddl.com/pr-details/199/2169686/fraud-alert-advisory---tata-power-delhi-distribution-limited-warns-its-customers-against-frauds\">fraud alert advisory</a>: messages claiming disconnection because a bill payment was not updated, requests to call or WhatsApp an unofficial number, pressure to install third-party apps, and demands for money towards a supposedly pending bill.",
          "Once you call, the \"officer\" typically offers to fix the problem on the spot. Two common routes follow. In one, you are asked to install an app that lets the caller see or control your screen, supposedly to update your payment. In the other, you are sent a link or a private UPI ID or account to pay an amount that will \"update\" the bill. <a href=\"https://www.kotak.bank.in/en/safe-banking/safe-banking-articles/the-electricity-sms-fraud.html\">Kotak Mahindra Bank's safety guide</a> explains how the caller can then use the access or the details you shared to debit your bank account."
        ],
        "callout": {
          "type": "warning",
          "text": "<strong>Never install a screen-sharing or remote-access app because a caller asks you to.</strong> With that app open, someone can watch you type a UPI PIN, read an OTP as it arrives or operate your banking apps. No genuine bill correction requires a stranger to see your phone screen."
        }
      },
      {
        "heading": "Red Flags in a Fake Power-Cut Message",
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/electricity-bill-disconnection-sms-scam/fictional-example.png",
          "alt": "Fictional SMS threatening electricity disconnection tonight and asking the reader to call a mobile number and install an app, annotated with red flags.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional power-cut scam text. Real notices do not ask you to call a mobile number or install an app."
        },
        "paragraphs": [
          "No single sign settles the question, but this scam tends to stack several of them together. Tata Power-DDL's <a href=\"https://tatapower-ddl.com/pr-details/199/2065686/advisory---tata-power-delhi-distribution-limited-warns-customers-against-cyber-frauds\">earlier advisory</a> lists an urgent tone, suspicious links, requests for account or payment details, and messages from a personal number or an unusual sender ID. It also says the company does not ask customers to call unknown numbers or download third-party apps for these matters. Nagaland's Department of Power stated in a <a href=\"https://ipr.nagaland.gov.in/node/8992\">2022 public notice</a> that it does not send disconnection messages via WhatsApp.",
          "Those statements come from specific discoms. Check what your own distribution company says about its official sender IDs, apps and helplines, rather than assuming every discom works the same way."
        ],
        "checklist": [
          "A deadline of tonight or within hours, often with an exact clock time.",
          "A vague reason such as \"previous month bill not updated\" with no bill amount, consumer number or due date you can match.",
          "An instruction to call or WhatsApp a personal 10-digit mobile number instead of the helpline on your bill.",
          "A sender that is a personal number, or a sender ID that does not match the discom name on your bill.",
          "A caller who asks you to install an app (especially from a link), share your screen, read out an OTP or pay into a private account.",
          "Spelling or grammar errors, or a message signed by a generic \"electricity office\" or \"power officer\"."
        ]
      },
      {
        "heading": "How to Verify Your Electricity Bill Safely",
        "paragraphs": [
          "Leave the message alone and go to a source you already trust. Your latest paper or PDF bill shows your consumer or account number, the amount due, the due date and the discom's official customer care number. Your discom's official app or website, opened by typing the address yourself or installing it from your phone's app store, shows whether a payment is outstanding.",
          "If your last payment was made through a bank or UPI app, open that app's transaction history to confirm it went through, and keep the reference. If the discom's records and your payment history disagree, raise it through the discom's published helpline or app. Do not use any number supplied in the warning message, even if the caller sounds official.",
          "Kotak's guide makes the same point for both sides: look up your bank's and utility's official contact details on their own websites before sharing anything. A genuine overdue bill will still be visible through these official channels tomorrow morning."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "<strong>Verify through the bill or the official app, never through the message.</strong> Phone numbers, links and \"officers\" supplied by a disconnection warning are part of the claim you are trying to check, so they cannot be used to check it."
        }
      },
      {
        "heading": "Worked Example: A Fictional Greater Noida Household",
        "paragraphs": [
          "<strong>This is a fictional teaching scenario. The names, number, amounts and message are invented, and it is not a real case or a test of any tool's accuracy.</strong> At 7:40 pm, Meera Sharma in Greater Noida receives an SMS from a 10-digit mobile number: \"Dear consumer, your electricity will be disconnected tonight at 9:30 pm because your last bill is not updated. Call electricity officer 98XXXXXX21 immediately.\"",
          "<strong>Step 1: pause and identify the claim.</strong> Meera notes what the message asserts: an unpaid or unrecorded bill and a cut-off at 9:30 pm. It contains no consumer number and no amount. Her father, Rajesh, suggests calling the number \"just to ask\". They decide not to, because the call is exactly what the sender wants.",
          "<strong>Step 2: check independently.</strong> Meera takes last month's bill from the drawer. It shows her consumer number and an amount of ₹2,340 due on a date that has not yet passed. She opens the discom's official app, which she had installed from the Play Store months ago, and sees the same bill with no overdue amount. Her UPI app also shows last month's ₹2,180 payment as successful.",
          "<strong>Step 3: review the screenshot as a clue.</strong> Meera takes a screenshot of the SMS and uploads it to the <a href=\"/screenshot-scam-checker/\">screenshot scam checker</a>. The result lists urgency wording, a power-cut threat and a mobile number paired with an instruction to call. She treats these as reasons for caution that agree with what she already found, not as a verdict.",
          "<strong>Outcome.</strong> Meera's official records show nothing overdue. She does not call or reply, reports the message through Chakshu, blocks the sender and warns her neighbours' society group. If her app had shown a genuine overdue amount, the safe next step would have been to pay it through the discom's own app or website, still without using the number in the SMS."
        ]
      },
      {
        "heading": "What ScreenshotChecker Can and Cannot Tell You",
        "paragraphs": [
          "The <a href=\"/screenshot-scam-checker/\">screenshot scam checker</a> reads the text in your screenshot with OCR and compares it against configured warning-sign rules. For this kind of message, it can flag urgency phrases such as a disconnection tonight, threats of a power cut, references to an \"electricity office\" or \"power officer\", phone numbers presented with an instruction to call, and mentions of remote-access apps such as AnyDesk or TeamViewer.",
          "<strong>These are clues, not proof.</strong> The checker does not contact your discom, look up your bill, or know who owns a phone number. A genuine reminder from your discom can contain some of the same words, and a reworded scam can avoid the configured phrases. OCR can also misread a blurred or cropped image. A low-risk result does not mean a message is safe, and a high-risk label is not a confirmed finding of fraud.",
          "If the message includes a link, do not open it on your phone. You can paste it into the <a href=\"/suspicious-link-checker/\">suspicious link checker</a>, which compares it with a historical labelled dataset; a match or no-match is not a safety certificate. Before posting the screenshot in a group, hide your consumer number and address with the <a href=\"/screenshot-redactor/\">screenshot redactor</a>. To practise spotting these patterns, try the <a href=\"/spot-the-fake/\">Spot the Fake quiz</a>."
        ],
        "cta": {
          "label": "Check a Suspicious Message",
          "url": "/screenshot-scam-checker/",
          "description": "Upload a screenshot to see which urgency, threat and callback-number patterns were flagged, then verify through your discom's official channels."
        }
      },
      {
        "heading": "Already Called, Paid or Installed an App? Act Now",
        "paragraphs": [
          "Speed matters if money or access may be involved. The <a href=\"https://ps.keralapolice.gov.in/ernakulamruralcyber-ps/notifications/National-Cyber-Crime-Reporting-Helpline-No-1930-3338\">Kerala Police cyber police station notice</a> says that the 1930 helpline runs 24 hours a day and that complaints, including financial fraud, can be filed and tracked on the National Cyber Crime Reporting Portal at cybercrime.gov.in. It stresses reporting promptly so evidence can be collected before it is lost.",
          "If you only received the message and did not respond, you can still report it. The DoT's <a href=\"https://sancharsaathi.gov.in/sfc/\">Chakshu facility on Sanchar Saathi</a> accepts reports of suspected fraud calls, SMS and WhatsApp messages, and lists electricity bill messages among its examples. It is meant for suspected fraud communication; if you have already lost money, it directs you to 1930 or cybercrime.gov.in instead.",
          "The steps below are general precautions. Follow your bank's instructions where they differ."
        ],
        "checklist": [
          "If you installed a screen-sharing or remote-access app, turn off mobile data and Wi-Fi, then uninstall the app.",
          "Call your bank on the number printed on your card, passbook or official app, report the fraud and ask it to block your cards, UPI or net banking as needed.",
          "Call 1930 and file a complaint at cybercrime.gov.in, especially if money left your account. Note the complaint reference.",
          "From a device you trust, change your UPI PIN, net banking password and any password you typed while the app was running.",
          "Keep the original SMS or WhatsApp message, the caller's number, call times and transaction references as evidence.",
          "If you only received the message, report it through Chakshu on Sanchar Saathi and block the sender."
        ]
      }
    ],
    "faq": [
      {
        "question": "Do electricity companies send SMS messages about disconnection?",
        "answer": "Some do. Tata Power-DDL, for example, says its official SMS come from a sender ID containing its name, so a message about your bill is not automatically fake. The warning signs are a deadline of tonight, a personal mobile number to call and requests to install apps or pay through a link. Check your bill status in your discom's official app, website or latest bill."
      },
      {
        "question": "Is it safe to call the electricity officer number in the message?",
        "answer": "No. Use only the customer care number printed on your bill or published on your discom's official website or app. A number supplied by an unexpected disconnection warning is part of the claim you are trying to verify."
      },
      {
        "question": "Why does the caller ask me to install AnyDesk or another app?",
        "answer": "Screen-sharing and remote-access apps can let the caller see or control your phone, including OTPs, UPI PIN entry and banking apps. Discom advisories such as Tata Power-DDL's tell customers not to install such apps at a caller's request."
      },
      {
        "question": "I paid a small amount through the link. What should I do?",
        "answer": "Contact your bank immediately through its official number, call 1930 and file a complaint at cybercrime.gov.in. Change your UPI PIN and banking passwords from a trusted device, and keep the message, number and transaction reference as evidence."
      },
      {
        "question": "Can ScreenshotChecker tell me if the message is a scam?",
        "answer": "It can flag warning signs in the text of a screenshot, such as urgency, power-cut threats and a phone number with an instruction to call. These are clues, not proof. It cannot see your bill, contact your discom or identify who owns a number."
      },
      {
        "question": "Where do I report the message if I did not lose money?",
        "answer": "You can report suspected fraud calls, SMS and WhatsApp messages through the Chakshu facility on the Sanchar Saathi portal. You can also tell your discom through its official helpline so it is aware of the scam."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["e-challan-sms-scam", 
      "smishing-fake-sms",
      "suspicious-link-checker-online",
      "redact-screenshot-before-sharing"
    ],
    "cta": {
      "label": "Check a Suspicious Message",
      "url": "/screenshot-scam-checker/",
      "description": "Review urgency, threat and callback-number warning signs in a screenshot as clues, then confirm your bill through official discom channels."
    }
  },
  {
    "slug": "whatsapp-telegram-task-job-scam",
    "title": "WhatsApp or Telegram Task Job Scam: Paid to Like Videos, Now Asked to Deposit?",
    "seoTitle": "WhatsApp, Telegram Task Job Scam: Prepaid Tasks Explained",
    "metaDescription": "Paid to like videos, then asked to deposit for a prepaid or merchant task? It is a task scam. How it works, the messages they send and what to do now.",
    "category": "Threat Analysis",
    "publishedAt": "2026-10-16",
    "updatedAt": "2026-11-12",
    "authorName": "Virat Chauhan",
    "readTime": "8 min read",
    "excerpt": "How WhatsApp and Telegram task scams build trust with small payouts, why the earnings screenshots in the group prove nothing, and what to do in India, the US and the UK once they ask for a deposit.",
    "targetKeywords": [
      "prepaid task scam",
      "merchant prepaid task",
      "telegram prepaid task",
      "whatsapp task scam",
      "telegram task scam",
      "youtube like job scam",
      "prepaid task scam",
      "hotel rating job scam",
      "part time job scam whatsapp",
      "task scam how to get money back"
    ],
    "keyTakeaway": {
      "title": "A job that asks you to pay is not a job",
      "text": "Once a 'part-time job' asks you to deposit your own money to unlock tasks, upgrade a level or release your earnings, treat it as a task scam. Stop paying, keep every chat and transaction record, and report it quickly through official channels. Paying again to 'unfreeze' a balance usually only increases the loss."
    },
    "introduction": "Yes. A job that pays you small amounts for liking YouTube videos or rating hotels, then asks you to deposit money for \"prepaid\" or \"merchant\" tasks, matches the pattern of a task scam. The early payouts are bait to win your trust; the balance shown in the app or group is not money you can withdraw. Stop paying now, save the evidence, and report it: in India call 1930 or file at cybercrime.gov.in, in the US use ReportFraud.ftc.gov, and in England, Wales and Northern Ireland use Report Fraud.",
    "contentSections": [
      {
        "heading": "How a WhatsApp or Telegram task scam works",
        "paragraphs": [
          "Task scams follow a script. Indian and US authorities describe the same stages, even though the tasks and the vocabulary change from one wave to the next.",
          "<strong>1. An unexpected offer.</strong> A message arrives on WhatsApp, Telegram, SMS or social media offering easy money from home. The <a href=\"https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=1982936&reg=48&lang=2\">Ministry of Home Affairs release on task-based part-time job frauds</a> says these campaigns were promoted through targeted online ads with phrases like \"ghar baithe job\" and then handed over to an agent on WhatsApp or Telegram.",
          "<strong>2. Simple tasks and a small genuine payout.</strong> You are asked to like or subscribe to videos, rate places on a map or review hotels and products. A small amount really does arrive in your account. The <a href=\"https://consumer.ftc.gov/consumer-alerts/2025/08/how-spot-avoid-task-scams\">FTC's guide to spotting task scams</a> describes the same move: a modest payment early on to build trust, while an app or platform shows rising \"earnings\".",
          "<strong>3. The Telegram group and the \"prepaid task\".</strong> You are added to a group or given a \"mentor\" or \"receptionist\". Now the tasks need money first: deposit an amount, complete a \"merchant\" or \"prepaid\" task and get it back with a commission. The first one or two may pay out to keep you going.",
          "<strong>4. Rising deposits.</strong> The next task needs a bigger deposit, or a \"combo\" task appears that can only be finished by paying more. The MHA release describes victims being pushed to invest larger sums after the first commissions, with the money then frozen.",
          "<strong>5. Withdrawal blocked.</strong> When you try to withdraw, a new obstacle appears: a \"tax\", an \"unfreezing fee\", a low \"credit score\" or a \"wrong operation\" penalty. The FTC notes that even people who deposit as told still cannot get the displayed earnings out, and the money they paid in is gone."
        ]
      },
      {
        "heading": "What is a \"prepaid task\" or \"merchant task\"?",
        "paragraphs": [
          "After a few small, real payments for liking videos or rating hotels, the scammers move you to \"prepaid tasks\", sometimes called merchant tasks, combination tasks or VIP tasks. You are told to pay money first, for example to \"buy\" a product, \"boost\" a merchant or \"complete an order\", and that the deposit will come back with a large commission.",
          "The first prepaid task often does pay out, to build trust. Then the amounts grow, and the dashboard starts showing a balance you cannot withdraw: a task is \"incomplete\", an account is \"frozen\" or a \"tax\" or \"unlock fee\" is due. There is no real merchant and no real task. A prepaid task is simply a request to send the scammers money."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "A real job never asks you to pay to work or to pay to get your earnings out. Any \"prepaid\", \"merchant\" or \"deposit\" task is the scam itself."
        }
      },
      {
        "heading": "Red flags of a task job scam",
        "paragraphs": [
          "Any one of these is a reason to stop and check. Several together are the scam pattern itself."
        ],
        "checklist": [
          "The job offer came out of the blue on WhatsApp, Telegram, SMS or Instagram, from someone you never applied to.",
          "The work is trivially easy (likes, subscribes, map ratings, hotel or product reviews) but the pay per task is high.",
          "There is no interview, no written contract and no verifiable employer, only a chat handle, a group and an app or website link.",
          "You are asked to deposit money to unlock tasks, reach a new \"level\", finish a \"prepaid\", \"merchant\" or \"combo\" task, or release your balance.",
          "Payouts come from different personal bank accounts or UPI IDs each time, not from a company.",
          "Group members post constant screenshots of big earnings and \"payment received\" messages, and anyone who asks questions is removed.",
          "Withdrawal is blocked by a fee, tax, penalty or score that you must pay to fix.",
          "You are pressured to act fast: a task \"expires\", a bonus ends tonight, or your account will be \"frozen\"."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "<strong>Never pay to get a job or to get paid.</strong> The FTC's task scam guide gives the same advice and warns against trusting anyone who offers to pay you for likes or positive ratings."
        }
      },
      {
        "heading": "Messages these scams send",
        "paragraphs": [
          "People often search the exact words they received. If a message you got looks like one of these, you are dealing with the same scam pattern. The wording changes, but the steps stay the same."
        ],
        "checklist": [
          "The opening: \"Part-time job, ₹1,000 to ₹5,000 a day from home. Just like our YouTube videos and send a screenshot.\"",
          "The first task: \"The job is very simple: watch our videos and like them. We pay you for each video you like.\"",
          "Moving you on: \"Join our Telegram group to receive your daily tasks and salary from the receptionist.\"",
          "The trap: \"Today's prepaid merchant task: deposit ₹2,000, get ₹2,800 back in 10 minutes.\"",
          "The lock: \"You haven't completed the task yet. Please do it exactly as described,\" or \"Your account is frozen; pay the remaining amount to withdraw.\"",
          "The last squeeze: a \"tax\", \"credit score\" or \"unlock\" fee before you can take out your balance."
        ]
      },
      {
        "heading": "Why the earnings screenshots in the group prove nothing",
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/whatsapp-telegram-task-job-scam/fictional-example.png",
          "alt": "Fictional group chat from a task job scam showing a small payout, a profit screenshot and a VIP deposit request, annotated with red flags.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional task-scam group. The earnings screenshots prove nothing; the deposit request is the scam."
        },
        "paragraphs": [
          "Task scam groups are full of screenshots: dashboards showing large balances, UPI or bank receipts captioned \"withdrawal received\", and chats where a \"senior member\" thanks the mentor. Many of the other members may be the scammers' own accounts. A screenshot is a claim, not proof. Anyone can type a number into an app they control, crop a real receipt from an unrelated payment, or edit a chat image, as our guide on <a href=\"/blog/fake-whatsapp-chat-screenshot/\">fake WhatsApp chat screenshots</a> explains.",
          "Even a genuine receipt only shows that someone sent someone money once. It does not show that the platform lets people withdraw, and small real payouts are part of the script. The <a href=\"https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=1982936&reg=48&lang=2\">MHA release</a> advises checking the receiver's name in your UPI app before paying, since a random individual's name can indicate a mule account, and asking where your initial commission actually came from.",
          "The only balance that matters is the one in your own bank or UPI app. The number on the task website is whatever the operators choose to display."
        ]
      },
      {
        "heading": "Worked example: a fictional Delhi college student",
        "paragraphs": [
          "<strong>This scenario is fictional. The names, amounts, group and messages are invented for teaching and do not describe a real case.</strong>",
          "Kabir, a second-year student in Delhi, gets a WhatsApp message from an unknown number: \"Hi, part-time job, earn ₹2,000 to ₹5,000 daily, just like YouTube videos.\" He likes three videos, sends screenshots, and receives ₹150 by UPI. The next day he earns ₹210 more. It feels real because the money is in his account.",
          "He is moved to a Telegram group called \"Star Hotel Rating Team 27\" with a \"receptionist\" who explains \"prepaid merchant tasks\": deposit ₹1,000, rate five hotels, get ₹1,300 back. It works once. Then a task asks for ₹5,000, and the next is a \"combo task\" that needs ₹18,000 before anything can be withdrawn. Kabir borrows from a friend. The website now shows a balance of ₹31,400.",
          "When he tries to withdraw, the receptionist says his \"credit score\" dropped because of a wrong operation and he must pay ₹25,000 to restore it. Meanwhile the group fills with screenshots of other members' withdrawals.",
          "<strong>What Kabir does next.</strong> He stops paying. He notices that every payment he made went to a different person's name in his UPI app. He screenshots the WhatsApp chat, the Telegram group, the task website and every UPI transaction, notes the UTR numbers, and writes down the usernames and phone numbers. He calls 1930 the same evening and then files a complaint at cybercrime.gov.in. He also tells his bank. He does not reply to a stranger who later messages him offering to \"recover\" the money for a fee.",
          "<strong>What his screenshots can and cannot do.</strong> Running the receptionist's messages through a scam-signal check may highlight wording such as a part-time job paid per task or a prepaid task demand. That supports his decision to stop, but the complaint rests on his own transaction records, not on any checker result."
        ]
      },
      {
        "heading": "Why you should not pay more to recover your money",
        "paragraphs": [
          "Once you have paid in, it is tempting to pay one more fee to release the balance. That is the point of the final stage. The fee is not a step towards withdrawal; it is the next deposit. If you pay the \"tax\", a \"processing charge\" or a \"security deposit\" usually follows.",
          "The balance on the site was never real money held for you. Treat what you have already sent as the loss to report, and do not add to it."
        ],
        "callout": {
          "type": "warning",
          "text": "<strong>Stop sending money today, even if you are told your account will be frozen or your earnings forfeited.</strong> Those threats are designed to make you pay again."
        }
      },
      {
        "heading": "What to do now: report it and keep the evidence",
        "paragraphs": [
          "Speed matters, especially in India. The <a href=\"https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2042130&reg=48&lang=2\">Home Ministry's note on the Citizen Financial Cyber Fraud Reporting and Management System</a> explains that the 1930 helpline and immediate reporting of financial fraud exist so that funds can be stopped before they are moved on. There is no guarantee of recovery, but a quick report gives the best chance.",
          "<strong>India:</strong> call the toll-free helpline 1930 and file a complaint on the National Cyber Crime Reporting Portal at cybercrime.gov.in. The <a href=\"https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=1982936&reg=48&lang=2\">MHA release</a> also asks citizens to report the phone numbers and social media handles used by fraudsters there. Inform your bank through its official app or helpline.",
          "<strong>United States:</strong> report to the FTC at ReportFraud.ftc.gov, as the <a href=\"https://consumer.ftc.gov/consumer-alerts/2025/08/how-spot-avoid-task-scams\">FTC task scam guide</a> recommends, and contact your bank or the payment app you used.",
          "<strong>United Kingdom:</strong> <a href=\"https://www.reportfraud.police.uk/news/report-fraud-service-goes-live/\">Report Fraud replaced Action Fraud on 4 December 2025</a> for England, Wales and Northern Ireland. Report at reportfraud.police.uk or call 0300 123 2040. In Scotland, contact Police Scotland on 101. Tell your bank as well."
        ],
        "checklist": [
          "Stop all payments and do not send any more \"fees\", \"taxes\" or deposits.",
          "Screenshot the full WhatsApp and Telegram chats, the group, member list, task website and your \"balance\", including usernames and phone numbers.",
          "Save every transaction record from your bank or UPI app: date, amount, receiver name or UPI ID, and the UTR or reference number.",
          "Note the website or app link, but do not keep logging in or click new links they send.",
          "Report quickly: 1930 and cybercrime.gov.in in India, ReportFraud.ftc.gov in the US, Report Fraud (or Police Scotland on 101) in the UK.",
          "Tell your bank through its official app or number, and change any passwords or PINs you shared.",
          "Then block the contacts and leave the group, after your evidence is saved."
        ]
      },
      {
        "heading": "Beware \"recovery agents\" who contact you afterwards",
        "paragraphs": [
          "People who have lost money to a scam are often targeted again. Someone may message you claiming to be a lawyer, a cyber cell officer, a \"fund recovery\" firm or even the original platform, promising to get your money back for a fee.",
          "The <a href=\"https://consumer.ftc.gov/articles/refund-and-recovery-scams\">FTC's page on refund and recovery scams</a> warns that government agencies and legitimate organisations do not charge you to help get a refund, and do not guarantee you will get money back. Anyone who asks for an upfront \"retainer\", \"processing fee\" or \"tax\" to recover your loss is a warning sign. Work only through the official reporting channels above and the police officers handling your complaint."
        ]
      },
      {
        "heading": "How ScreenshotChecker can help, and what it cannot do",
        "paragraphs": [
          "If you are unsure about a job offer before you pay anything, the <a href=\"/screenshot-scam-checker/\">screenshot scam checker</a> can read the text in a chat screenshot and look for scam wording. Its rule lists include phrases common in task scams, such as part-time jobs paid per task, easy daily earnings and prepaid task demands, alongside other pressure tactics. It explains which phrases it flagged and why.",
          "It works only on the text it can read from the image and on patterns it knows. It has no access to WhatsApp, Telegram, your bank or the scammers' accounts, so it cannot confirm who sent a message or whether any payment happened. A flagged phrase is a warning sign, not proof of fraud, and if it finds no reliable match it says so rather than calling the message safe. A cleverly worded offer can slip past the rules.",
          "For the earnings and \"payment received\" screenshots posted in the group, no tool can turn a screenshot into proof of a withdrawal. Check your own bank or UPI records instead. To practise recognising these messages, try the <a href=\"/spot-the-fake/\">Spot the Fake quiz</a>, ten rounds of fictional scam and legitimate messages."
        ],
        "cta": {
          "label": "Check a chat screenshot for scam signals",
          "url": "/screenshot-scam-checker/",
          "description": "Flag task scam wording in a WhatsApp or Telegram screenshot. Treat results as warning signs and verify through official channels."
        }
      }
    ],
    "faq": [
      {
        "question": "They really paid me at the start. How can it be a scam?",
        "answer": "Small genuine payouts are part of the script. They build trust so that you agree to deposit larger amounts later. Both the FTC and India's Ministry of Home Affairs describe early commissions followed by demands for bigger deposits that cannot be withdrawn."
      },
      {
        "question": "Should I pay the tax or fee to withdraw my balance?",
        "answer": "No. The withdrawal fee, tax or credit score repair charge is the next deposit, not a step towards getting paid. Stop paying, save your evidence and report the scam."
      },
      {
        "question": "Can I get my money back from a task scam?",
        "answer": "There is no guarantee, but reporting quickly gives the best chance. In India, call 1930 and file at cybercrime.gov.in as soon as possible, since fast reports can help stop funds being moved on. Also tell your bank. In the US report at ReportFraud.ftc.gov, and in England, Wales and Northern Ireland use Report Fraud."
      },
      {
        "question": "Is liking YouTube videos or rating hotels for money a real job?",
        "answer": "Treat any unsolicited offer to pay you for likes, subscribes or ratings as a scam. The FTC advises not to trust anyone offering payment for positive ratings or likes, and real employers do not recruit through random WhatsApp or Telegram messages."
      },
      {
        "question": "Someone says they can recover my lost money for a fee. Should I trust them?",
        "answer": "No. Recovery scams target people who have already lost money. The FTC says government agencies and legitimate organisations do not ask for money to help you get a refund. Use only official reporting channels and the police handling your case."
      },
      {
        "question": "Can a scam checker prove the earnings screenshots in the group are fake?",
        "answer": "No. A scam checker reads text and flags warning signs. It cannot prove that a screenshot is genuine or fake or confirm that a payment happened. What matters is that you cannot withdraw, and the only balance you can trust is in your own bank or UPI app."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["fake-job-offer-letter", "task-job-scam-se-kaise-bache", "digital-arrest-scam", "fake-crypto-profit-screenshots", 
      "fake-whatsapp-chat-screenshot",
      "smishing-fake-sms",
      "fake-upi-payment-screenshot"
    ],
    "cta": {
      "label": "Check a chat screenshot for scam signals",
      "url": "/screenshot-scam-checker/",
      "description": "Look for task scam wording in a WhatsApp or Telegram screenshot, then stop paying and report through official channels."
    }
  },
  {
    "slug": "unpaid-toll-text-scam",
    "updatedAt": "2026-11-17",
    "title": "Unpaid Toll Text Scam: Is That E-ZPass, SunPass or FasTrak Message Real?",
    "seoTitle": "Unpaid Toll Text? How to Tell If It's a Scam",
    "metaDescription": "Got a text saying you owe an E-ZPass, SunPass or FasTrak toll? Don't tap the link. Check your account on the agency's own site, then report the text.",
    "category": "Threat Analysis",
    "publishedAt": "2026-10-16",
    "authorName": "Virat Chauhan",
    "readTime": "7 min read",
    "excerpt": "Why unpaid toll texts are a common smishing lure, what the FBI, FTC and toll agencies advise, how to check your real account, and what to do if you already paid.",
    "targetKeywords": [
      "unpaid toll text scam",
      "E-ZPass text scam",
      "SunPass text message scam",
      "FasTrak scam text",
      "toll smishing",
      "is the unpaid toll text real"
    ],
    "keyTakeaway": {
      "title": "Check the toll account yourself, never through the text",
      "text": "Do not tap the link or reply. Type the toll agency's website into your browser yourself, or call the number on your statement or the back of your transponder paperwork, and look for a balance there. If your real account shows nothing owed, the text was not a bill. If you already paid through the link, call your card issuer right away and report the text."
    },
    "introduction": "Probably not. A text that says you owe a small unpaid toll and must pay at a link to avoid a late fee matches a widespread smishing scam that the FBI and FTC have both warned about, and NJ E-ZPass, SunPass and FasTrak have each said they do not collect payment that way. The safe check is to ignore the link, open the toll agency's real website or call its official number yourself, and see whether your account actually shows a balance. If you already paid, contact your card issuer and report the text.",
    "contentSections": [
      {
        "heading": "What the unpaid toll text usually looks like",
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/unpaid-toll-text-scam/fictional-example.png",
          "alt": "Fictional unpaid toll text from an email-style sender asking for $4.35 with a $50 late fee threat and a lookalike link, annotated with red flags.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional unpaid toll text. Check any balance in your own toll account, never through the message."
        },
        "paragraphs": [
          "The message is short and specific. It names a toll service, states a small balance, sets a deadline and offers a link to pay. In its <a href=\"https://www.ic3.gov/PSA/2024/PSA240412\">public service announcement on toll smishing (I-041224-PSA)</a>, the FBI's Internet Crime Complaint Center described texts claiming an outstanding toll of $12.51 with a threatened $50.00 late fee, a link to a site posing as the state toll service, and sending phone numbers that changed from state to state.",
          "The FTC's <a href=\"https://consumer.ftc.gov/consumer-alerts/2025/01/got-text-about-unpaid-tolls-its-probably-scam\">January 2025 consumer alert</a> says these texts reach people whether or not they have driven on a toll road, and that the link leads to a page asking for card or bank details. The alert adds that scammers may also try to collect personal details such as a driver's license number, which can feed identity theft.",
          "These texts have not gone away. The FTC counted unpaid toll notices among the <a href=\"https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2025/04/top-text-scams-2024\">top five text scams of 2024</a>, a year when people reported losing $470 million to scams that started with a text. In a <a href=\"https://consumer.ftc.gov/consumer-alerts/2026/05/new-trends-reports-imposter-scams\">May 2026 alert</a>, the FTC said reports of government imposter scams rose 40%, partly because of overdue toll texts naming E-ZPass, SunPass, FasTrak and TxTag, some threatening late fees or a suspended vehicle registration.",
          "The small amount is the point. A $6 or $12 charge feels too minor to question, and the late fee threat pushes you to pay now rather than check. The link is usually a lookalike: a web address that mixes a toll brand or the words toll, pay or turnpike into a domain the agency does not use. The FBI's example was myturnpiketollservices.com, which sounds official but is not a toll agency's site."
        ],
        "callout": {
          "type": "warning",
          "text": "The toll agencies are real. E-ZPass, SunPass and FasTrak are genuine toll programs, which is exactly why scammers borrow their names. A text using a real agency's name, colors or wording is not evidence that the agency sent it."
        }
      },
      {
        "heading": "What toll agencies themselves say about these texts",
        "paragraphs": [
          "<strong>New Jersey E-ZPass.</strong> The New Jersey Turnpike Authority published a <a href=\"https://www.njta.gov/newsroom/reminder-new-jersey-e-zpass-does-not-send-unsolicited-text-messages-to-collect-payments/\">reminder in April 2025</a> that NJ E-ZPass does not send unsolicited texts to collect payments, and it urged customers not to click links in suspicious payment texts. The same notice explains one exception: accounts that have been sent to its collection agency may get texts from that agency. That is a good reason to confirm any claimed debt through your own account rather than through a link.",
          "<strong>SunPass (Florida).</strong> A <a href=\"https://floridasturnpike.com/wp-content/uploads/2025/04/Phishing_Alert_Message.pdf\">SunPass smishing alert</a> says it does not send texts demanding immediate payment for unpaid tolls, advises against clicking links, replying (even with STOP) or calling unfamiliar numbers, and points customers to sunpass.com. The alert also lists the email addresses and text short code SunPass uses when it does contact customers, so check that alert on the official site rather than trusting contact details in a message.",
          "<strong>FasTrak (San Francisco Bay Area).</strong> In an <a href=\"https://www.bayareafastrak.org/en/cms/news-detail-article28.shtml\">April 2024 fraud alert</a>, Bay Area FasTrak said it does not request payment by text with a link to a website, and asked customers to do FasTrak business only through bayareafastrak.org or its customer service line.",
          "Other toll agencies have their own policies, and they can change. If your text names a different agency, look up that agency's own website by typing its address yourself or searching for it, and read its current guidance. Do not assume any agency's rules from this guide, and do not rely on a policy quoted inside the text itself."
        ]
      },
      {
        "heading": "How to check whether you really owe a toll",
        "paragraphs": [
          "The FBI and FTC give the same core advice: verify through a channel you already trust, not the one in the message. The <a href=\"https://www.ic3.gov/PSA/2024/PSA240412\">FBI PSA</a> recommends checking your account on the toll service's legitimate website and calling its official customer service number. Follow these steps in order."
        ],
        "checklist": [
          "Do not tap the link, reply or call any number in the text. Leave it unopened while you check.",
          "Take a screenshot of the message, including the sender number and the full link, so you can report it later.",
          "Type the toll agency's website address into your browser yourself, or open its official app if you already use one. Do not copy the address from the text.",
          "Log in to your account and look at your balance, recent trips and any notices. If you pay tolls by mail, check the paper invoice for the agency's details.",
          "If you are unsure, call the customer service number printed on your statement, invoice or account paperwork, not one supplied in the text.",
          "If your account shows nothing owed, treat the text as a scam. If it does show a real balance, pay through the official site or phone line, not the link."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "<strong>Pay tolls only through a website or phone number you found yourself.</strong> Even if you do owe a toll, paying through the link in an unexpected text sends your card details to whoever controls that link."
        }
      },
      {
        "heading": "Red flags in an unpaid toll text",
        "paragraphs": [
          "No single sign settles it, and a scam text can avoid all of them. Treat these as reasons to stop and verify, not as a scoring system."
        ],
        "checklist": [
          "You did not expect a bill, or you have not driven on a toll road recently.",
          "A small balance paired with a much larger late fee, a fine or a deadline of a day or two.",
          "Threats about your license, registration or court action if you do not pay right away.",
          "A link whose domain is not the agency's official website, often with extra words like pay, toll, service or a state name added.",
          "The sender is an ordinary phone number or email-style address rather than a channel your agency says it uses.",
          "The text asks for card details, a driver's license number or other personal data on a web page.",
          "The message names a toll agency from a state you have not visited."
        ]
      },
      {
        "heading": "Fictional worked example: a New Jersey commuter",
        "paragraphs": [
          "<strong>This scenario is fictional. The person, amounts, phone number and link are invented for teaching and do not describe a real case or a test of any tool's accuracy.</strong>",
          "Dana, a commuter who drives the Garden State Parkway most weekdays, gets a text from an unfamiliar ten-digit number: \"NJ E-ZPass: Your outstanding toll balance is $6.85. Pay by tomorrow to avoid a $45.00 late fee: ezpassnj-tollbalance.example/pay\". Because Dana really does use toll roads, the message feels plausible.",
          "<strong>Step 1: pause.</strong> Dana does not tap the link. Dana screenshots the text so the sender number and full link are kept.",
          "<strong>Step 2: look for clues.</strong> Dana uploads the screenshot to the ScreenshotChecker scam checker. It reads the text and flags warning signs such as the toll balance wording, the late fee threat, the short deadline and the presence of a payment link. Dana also types the link text into the suspicious link checker, which reports no match in its dataset. Dana notes that a no-match result says nothing about safety, because a newly registered scam domain may simply not be listed.",
          "<strong>Step 3: verify independently.</strong> Dana types ezpassnj.com into the browser, logs in and finds no balance due and no notices. That account check, not the scam checker result, is what answers the question.",
          "<strong>Step 4: report and delete.</strong> Dana files a complaint at ic3.gov including the sender number and link, forwards the text to 7726, uses the phone's report junk option and then deletes the message.",
          "<strong>Alternative outcome.</strong> If Dana's account had shown a real unpaid toll, Dana would pay it through the official site. The text would still not become trustworthy: a scammer can guess correctly that a commuter uses toll roads."
        ]
      },
      {
        "heading": "How ScreenshotChecker can give you clues (and what it cannot do)",
        "paragraphs": [
          "The <a href=\"/screenshot-scam-checker/\">Screenshot Scam Checker</a> reads the text in a screenshot with OCR and applies rule-based checks for common scam patterns, including toll balance and late fee wording, urgency, threats and payment links. It explains which phrases triggered each warning. Those warnings are clues to help you decide whether to slow down. They are not a verdict, and a clean result does not mean the message is genuine.",
          "The <a href=\"/suspicious-link-checker/\">Suspicious Link Checker</a> lets you paste or type a web address without opening it and compares it with a historical, labelled URL dataset. A match tells you that the address or its domain appears in that dataset with a past label. <strong>No match does not mean the link is safe:</strong> toll scam domains are often new, and a fresh domain will not be listed yet.",
          "Neither tool has any access to E-ZPass, SunPass, FasTrak or any other toll account, so neither can tell you whether you owe money or confirm who sent a text. Only the agency's own website, app, statement or customer service line can do that. If you want to practise spotting these patterns, the <a href=\"/spot-the-fake/\">Spot the Fake quiz</a> mixes fictional scam and legitimate messages."
        ],
        "cta": {
          "label": "Check a Toll Text Screenshot",
          "url": "/screenshot-scam-checker/",
          "description": "See which scam warning signs appear in the message text, then verify your balance on the toll agency's own site."
        }
      },
      {
        "heading": "What to do if you clicked, entered details or paid",
        "paragraphs": [
          "Act quickly but calmly. The <a href=\"https://www.ic3.gov/PSA/2024/PSA240412\">FBI PSA</a> advises anyone who clicked a link or entered information to secure their personal information and financial accounts and to dispute any charges they do not recognize. <a href=\"https://www.bayareafastrak.org/en/cms/news-detail-article28.shtml\">FasTrak</a> likewise tells customers who paid a fraudulent site to contact their bank or card company right away.",
          "Reporting helps investigators and carriers. The FBI asks people to file a complaint at ic3.gov with the sending phone number and the website from the text. The FTC accepts reports at ReportFraud.ftc.gov, and its <a href=\"https://consumer.ftc.gov/articles/how-recognize-and-report-spam-text-messages\">guide to spam texts</a> explains how to copy the message and forward it to 7726 (SPAM) so your wireless carrier can block similar texts."
        ],
        "checklist": [
          "If you paid or entered card details: call the number on the back of your card, report a fraudulent charge and ask about blocking or replacing the card.",
          "If you entered bank details: contact your bank through its official app or the number on your statement.",
          "If you entered a password: change it, and change it anywhere else you reused it.",
          "If you shared your Social Security number: visit IdentityTheft.gov, the FTC's identity theft site, for next steps.",
          "Watch your card and bank statements for unfamiliar charges over the following weeks and dispute any you find.",
          "Report the text at ic3.gov and ReportFraud.ftc.gov, forward it to 7726, then delete it."
        ],
        "callout": {
          "type": "tip",
          "text": "Keep your screenshot before deleting the text. It preserves the sender number and link for your card issuer and your reports. If you share it publicly, hide your own phone number and any account details first with the <a href=\"/screenshot-redactor/\">screenshot redactor</a>."
        }
      }
    ],
    "faq": [
      {
        "question": "Do toll agencies ever send real text messages?",
        "answer": "Some do contact customers by text in specific situations. SunPass lists the short code it uses, and NJ E-ZPass says accounts in collections may get texts from its collection agency. NJ E-ZPass, SunPass and FasTrak have each said they do not use unsolicited texts with payment links to collect tolls. Because a real message and a fake one can look similar, check any claimed balance by logging in to your account on the agency's site yourself."
      },
      {
        "question": "I have never driven on a toll road. Why did I get an unpaid toll text?",
        "answer": "The FTC says these texts are sent whether or not the recipient has used a toll road. Scammers send them in bulk to many numbers, so receiving one says nothing about your driving history."
      },
      {
        "question": "I tapped the link but did not enter anything. What should I do?",
        "answer": "Close the page without entering any details. The FBI advises anyone who clicked a link to secure their personal and financial accounts, so keep your phone's software updated, watch your statements for unfamiliar charges and report the text to ic3.gov and ReportFraud.ftc.gov."
      },
      {
        "question": "Should I reply STOP to the toll text?",
        "answer": "No. The FTC advises not replying to unexpected texts, and SunPass's alert specifically says not to reply even with STOP. Report it as junk, forward it to 7726 and delete it."
      },
      {
        "question": "Can ScreenshotChecker tell me whether the toll text is real?",
        "answer": "No. The scam checker flags warning signs in the message text and the link checker compares a web address with a historical dataset. Both give clues only. Neither can see your toll account or confirm who sent a message, and a no-match link result does not mean the link is safe."
      },
      {
        "question": "Where do I report an unpaid toll scam text?",
        "answer": "File a complaint with the FBI's Internet Crime Complaint Center at ic3.gov, including the sender number and link, and report it to the FTC at ReportFraud.ftc.gov. You can also forward the text to 7726 and use your phone's report junk option. If you paid, contact your card issuer or bank first."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["usps-redelivery-text-scam", 
      "smishing-fake-sms",
      "suspicious-link-checker-online",
      "screenshot-checker-online"
    ],
    "cta": {
      "label": "Check a Suspicious Toll Text",
      "url": "/screenshot-scam-checker/",
      "description": "Review scam warning signs in a screenshot of the message, then confirm any balance on the toll agency's official website."
    }
  },
  {
    "slug": "how-to-tell-if-a-photo-is-a-screenshot",
    "title": "How to Tell If an Image Is a Screenshot or a Photo",
    "seoTitle": "Is It a Screenshot or a Photo? How to Tell",
    "metaDescription": "Learn the clues that separate a screenshot from a camera photo: status bars, screen sizes, metadata and moiré, plus what the answer can and cannot prove.",
    "category": "Forensics",
    "publishedAt": "2026-11-06",
    "updatedAt": "2026-11-17",
    "authorName": "Virat Chauhan",
    "readTime": "7 min read",
    "excerpt": "The visible and file-level clues that show whether an image was captured from a screen or taken with a camera, a worked marketplace example, and why the answer is a clue rather than a verdict.",
    "targetKeywords": [
      "how to tell if a photo is a screenshot",
      "screenshot or photo",
      "is this image a screenshot",
      "screenshot detector",
      "how to tell if a picture was taken with a camera",
      "photo of a screen vs screenshot"
    ],
    "keyTakeaway": {
      "title": "Screenshot or photo is a question about source, not truth",
      "text": "Status bars, screen-sized dimensions and missing camera metadata point to a screenshot; perspective, glare, moiré and camera fields point to a photo. None of these is proof on its own, and neither answer tells you whether the content is genuine."
    },
    "introduction": "To tell if a picture is a screenshot, check three things. The edges: a phone status bar with the time and battery, app buttons or a browser bar point to a screenshot. The size: screenshots match a screen exactly (an iPhone 14, for example, saves 1170 x 2532 pixels) rather than a camera's usual 4:3 shape. The file details: camera photos usually record the camera make, model and exposure, and screenshots do not. A photo of a screen gives itself away with glare, tilt and wavy moiré lines. On an iPhone, open the image in Photos and swipe up: a screenshot is labelled as one and also sits in the Screenshots album under Media Types. A screenshot is not the same as a photo: it copies what was on the display, while a photo is captured through a camera lens. Someone sends you a picture and says they just took it. Maybe it is a used bike for sale, a receipt, a parking ticket or a message on their screen. Whether that image is a screenshot or a photo can matter: a \"fresh photo\" that turns out to be a screenshot may have been copied from somewhere else. This guide covers the clues you can see in the picture, the clues stored in the file, a fictional worked example, and the limits of what the answer tells you.",
    "contentSections": [
      {
        "heading": "Why it matters whether an image is a screenshot",
        "paragraphs": [
          "A screenshot records what was on a screen. A photo records what was in front of a camera. When someone claims they photographed something themselves, a screenshot is a mismatch worth asking about: it could be a capture of another person's listing, a post, or an old image saved from a chat.",
          "The reverse also comes up. A photo of a screen, taken with a second phone, is sometimes used to dodge screenshot notifications or to make an edited screen look more \"real\". Knowing which kind of image you have helps you decide what to check next."
        ],
        "callout": {
          "type": "info",
          "text": "This is a different question from whether an image is fake. A genuine screenshot can show a doctored message, and a genuine photo can show a staged scene. For authenticity, use the <a href=\"/blog/screenshot-checker-online/\">screenshot verification checklist</a>."
        }
      },
      {
        "heading": "Clues you can see in the picture",
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/how-to-tell-if-a-photo-is-a-screenshot/fictional-example.png",
          "alt": "Fictional image check listing four clues: a status bar with time and battery, screen-sized dimensions, no camera fields and no moiré or glare.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional check. Each clue points towards a screenshot, but none of them proves where the image came from."
        },
        "paragraphs": [
          "Start with your eyes. Screenshots usually carry the phone or computer's own interface, and they are perfectly flat: every pixel came straight from the screen.",
          "Photos of real objects show depth, lighting and lens effects. Photos of a screen show something in between: screen content plus the physical marks of a camera pointed at glass."
        ],
        "checklist": [
          "Status bar: a clock, battery, signal or Wi-Fi icon along the top edge suggests a phone screenshot. Its absence proves little, because it is easy to crop out.",
          "Interface edges: navigation bars, app headers, rounded screen corners or a notch outline are screen elements.",
          "Perfectly straight, sharp text with no perspective usually means a screenshot.",
          "Moiré (wavy rainbow patterns), glare, reflections, visible pixels or a tilted screen edge suggest a photo of a screen.",
          "Depth of field, shadows and natural noise in dark areas suggest a camera photo of a real scene."
        ]
      },
      {
        "heading": "Clues stored in the file",
        "paragraphs": [
          "The file itself can add evidence, as long as you have the original rather than a copy saved from a chat app. Messaging and social apps commonly resize images and remove metadata when they are sent, which wipes out several of these clues.",
          "<strong>Dimensions.</strong> Screenshots are usually exactly the size of the screen that took them, such as a tall phone-shaped rectangle. Photos from phone cameras use the camera's sensor shape, commonly 4:3 or 16:9. Dimensions overlap across devices and change when an image is resized, so treat a match as a hint.",
          "<strong>Metadata.</strong> Camera photos often store EXIF fields such as the device make and model, exposure settings, the capture time and sometimes GPS coordinates. Screenshots usually lack camera exposure fields, and some name the capture software instead. Missing metadata is common for any shared image and is not evidence on its own. Read <a href=\"/blog/exif-metadata/\">what EXIF metadata is</a> for the details.",
          "<strong>File type.</strong> Many systems save screenshots as PNG files and camera photos as JPEG or HEIC, but settings, apps and sharing all change formats. A JPEG screenshot or a PNG photo is entirely possible."
        ],
        "cta": {
          "label": "Check an Image's Source Clues",
          "url": "/screenshot-detector/",
          "description": "Read dimensions and metadata in your browser, with clear evidence and an honest \"inconclusive\" when the clues conflict."
        }
      },
      {
        "heading": "Worked example: a fictional bike sale",
        "paragraphs": [
          "Sam is buying a used road bike from a stranger online. Sam asks for a photo of the bike with today's newspaper next to it. The seller sends an image of the bike, says they just took it, and asks for a deposit.",
          "Sam opens the original file in the <a href=\"/screenshot-detector/\">screenshot detector</a>. The image is a tall phone-screen shape, it has no camera make, model or exposure fields, and there is a thin strip of a status bar at the top edge. There is no newspaper in the picture.",
          "None of that proves a scam: the seller might have screenshotted their own photo by mistake. But it no longer matches \"I just took this\". Sam runs a <a href=\"/reverse-image-search/\">reverse image search</a> and finds the same bike in an older listing from another city.",
          "Sam asks for a live video call showing the bike, and stops when the seller refuses and pushes for the deposit again. The decision came from the mismatch plus the source check, not from any single clue."
        ]
      },
      {
        "heading": "What the answer cannot tell you",
        "paragraphs": [
          "Knowing that an image is a screenshot does not tell you whether the content on that screen was real. Message apps, payment screens and social posts can all be edited before a screenshot is taken, or built with prank generators.",
          "Knowing that an image is a photo does not tell you it is recent, unedited or of the thing described. Camera metadata can be removed, copied or written by software, and a convincing camera model or date is a clue, not proof.",
          "Conflicting clues are normal. A cropped screenshot exported from an editor can look like a graphic; a photo saved through several apps can lose every camera field. An honest result is often \"inconclusive\", and that is a useful answer: it tells you to verify at the source."
        ]
      },
      {
        "heading": "A quick routine for checking an image's source",
        "paragraphs": [
          "Use these steps in order. Stop as soon as you have what you need to make your decision."
        ],
        "checklist": [
          "Ask for the original file, not a copy saved from a chat or social app.",
          "Look for status bars, interface edges, moiré, glare and perspective.",
          "Check the dimensions and metadata with the screenshot detector or the metadata checker.",
          "Compare what you find with what you were told about the image.",
          "Search for earlier copies with reverse image search.",
          "For anything involving money, verify the claim itself: a live video call, your own bank or payment app, or the original account."
        ]
      }
    ],
    "faq": [
      {
        "question": "How can I tell if a photo is actually a screenshot?",
        "answer": "Look for a status bar, app interface or screen-shaped dimensions, then check the original file's metadata. Camera photos usually carry camera fields such as make, model and exposure; screenshots usually do not. These are clues, not proof, because cropping and sharing can remove them."
      },
      {
        "question": "Is a screenshot the same as a photo?",
        "answer": "No. A screenshot is a copy of exactly what a screen was showing, made by the device itself, so it is perfectly flat and usually includes interface elements such as a status bar. A photo is captured through a camera lens and normally records camera details in its file. Both are saved as images, which is why they are easy to confuse once shared."
      },
      {
        "question": "How do I tell if a picture is a screenshot on iPhone?",
        "answer": "Open the image in the Photos app and swipe up (or tap the info button). A screenshot is labelled as a screenshot, while a camera photo shows the camera, lens and exposure details. iPhone also files screenshots in the Screenshots album under Media Types. This works for images saved on your own iPhone; an image someone sent you may have lost these details."
      },
      {
        "question": "Does missing EXIF data mean an image is a screenshot?",
        "answer": "No. Messaging and social apps commonly strip metadata, and graphics and edited exports may have none. Missing EXIF is normal for shared images and should not be treated as evidence of a screenshot on its own."
      },
      {
        "question": "How do I tell a photo of a screen from a real screenshot?",
        "answer": "A photo of a screen usually shows moiré patterns, glare, reflections, visible pixels, a tilted or curved screen edge, and camera metadata in the original file. A real screenshot is perfectly flat and sharp, with no lighting effects."
      },
      {
        "question": "Can screenshot dimensions identify the exact phone?",
        "answer": "No. Many devices share screen sizes, and images are often resized when shared or edited. Dimensions can support a hypothesis such as \"this looks like a phone screenshot\", but they cannot name a device."
      },
      {
        "question": "If an image is a screenshot, does that mean it is fake?",
        "answer": "No. Screenshot or photo is a question about where an image came from. Whether its content is genuine is a separate question that needs other checks, ideally confirming the claim at its source."
      },
      {
        "question": "Is the screenshot detector private?",
        "answer": "Image bytes are inspected in your browser without uploading the file. The site still uses analytics; see the privacy policy for details on network requests and storage."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["reverse-image-search-screenshot", 
      "exif-metadata",
      "screenshot-checker-online",
      "fake-social-media-post-screenshot"
    ],
    "cta": {
      "label": "Is It a Screenshot or a Photo?",
      "url": "/screenshot-detector/",
      "description": "Inspect an image's dimensions and metadata locally, with every clue explained and no forced verdict."
    }
  },
  {
    "slug": "usps-redelivery-text-scam",
    "title": "USPS Redelivery Text Scam: How to Tell If That Package Text Is Fake",
    "seoTitle": "USPS Package Text Scam? How to Check If It's Real",
    "metaDescription": "Got a text saying USPS can't deliver your package? USPS doesn't send unrequested texts with links. Here's how to check a real delivery and report the scam.",
    "category": "Threat Analysis",
    "publishedAt": "2026-11-06",
    "authorName": "Virat Chauhan",
    "readTime": "7 min read",
    "excerpt": "What the fake USPS delivery text looks like, what the Postal Inspection Service says about real USPS texts, how to check your parcel safely, and what to do if you clicked or paid.",
    "targetKeywords": [
      "USPS text scam",
      "USPS redelivery scam",
      "USPS package text message scam",
      "is the USPS text real",
      "USPS smishing",
      "USPS incomplete address text"
    ],
    "keyTakeaway": {
      "title": "USPS does not text you a link you never asked for",
      "text": "According to the U.S. Postal Inspection Service, USPS sends tracking texts only after you request them with a tracking number, and those texts contain no links. Check a parcel by typing usps.com yourself, then forward the scam text to 7726."
    },
    "introduction": "Almost certainly not. A text saying your package is on hold because of an incomplete address, and asking you to update it or pay a small redelivery fee at a link, matches one of the most common smishing scams in the United States. Here is what the real USPS says, how to check a genuine delivery without touching the link, and what to do if you already did.",
    "contentSections": [
      {
        "heading": "What the fake USPS text usually looks like",
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/usps-redelivery-text-scam/fictional-example.png",
          "alt": "Fictional text claiming a USPS package is held for an incomplete address, with a lookalike link and a small redelivery fee, annotated with red flags.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional fake delivery text. An unrequested link, a deadline and a small fee are the giveaways."
        },
        "paragraphs": [
          "The wording changes, but the pattern rarely does: a package problem, a short deadline and a link. Many versions arrive from an email address or an unfamiliar number rather than a short code.",
          "The link leads to a convincing copy of a USPS page. It asks you to confirm your address, then to pay a fee of a dollar or two by card. The real goal is your card number, and often your name, address, date of birth or other details that can be used for identity theft."
        ]
      },
      {
        "heading": "What USPS itself says about these texts",
        "paragraphs": [
          "The <a href=\"https://www.uspis.gov/news/scam-article/smishing-package-tracking-text-scams\">U.S. Postal Inspection Service</a>, the law enforcement arm of USPS, says USPS will not send you text messages or emails without you first requesting the service with a tracking number, and that those messages will not contain a link.",
          "USPS has also said, in its <a href=\"https://news.usps.com/2024/06/26/dont-get-smished/\">\"Don't get smished\" warning</a>, that it does not charge fees for redelivery. A text asking you to pay to reschedule a delivery is a red flag on its own.",
          "So if you did not sign up for text tracking for a specific parcel, a USPS-branded text with a link is not from USPS."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "Never use a link in a delivery text to check a delivery. Open usps.com by typing it yourself, or use the official USPS app, and enter the tracking number you got from the sender."
        }
      },
      {
        "heading": "How to check whether a USPS package is really waiting",
        "paragraphs": [
          "Go to the source rather than the message. If you are expecting a parcel, the retailer or sender gave you a tracking number in your order confirmation. Type usps.com into your browser and enter that number in USPS Tracking.",
          "If USPS tried to deliver and could not, the carrier normally leaves a paper notice at your address explaining how to arrange redelivery or pick-up. Redelivery is arranged on usps.com or by phone, and USPS does not charge for it.",
          "If you are not expecting anything, there is nothing to check. Scam texts are sent in bulk to huge lists of numbers, so receiving one says nothing about your mail."
        ]
      },
      {
        "heading": "Red flags in the message and the link",
        "paragraphs": [
          "Any one of these is reason enough to stop. Most scam texts have several."
        ],
        "checklist": [
          "You never signed up for USPS text tracking for this parcel.",
          "The text contains a link. Requested USPS tracking texts do not.",
          "It asks for a fee to redeliver, release or update a package.",
          "It sets a short deadline, such as 12 or 24 hours, or threatens to return the parcel.",
          "The sender is an email address, a long unfamiliar number or a foreign number.",
          "The link's domain is not usps.com, even if \"usps\" appears somewhere in the address.",
          "It asks you to reply with Y, or to copy the link into your browser, to make the link work."
        ],
        "cta": {
          "label": "Check a Link Without Opening It",
          "url": "/suspicious-link-checker/",
          "description": "Paste the address from the text to compare it with a historical labelled URL dataset, without visiting the site."
        }
      },
      {
        "heading": "Worked example: a fictional parcel in Chicago",
        "paragraphs": [
          "Maya, a fictional renter in Chicago, has ordered a phone case online. That evening she gets a text from an email-style sender: her package \"could not be delivered due to incomplete address information\" and she must update it within 12 hours at a link. A $0.30 redelivery fee applies.",
          "The timing feels right, which is exactly why the scam works: millions of people are expecting a parcel on any given day. Maya does not tap the link. She opens her order confirmation email from the shop, copies the tracking number and types usps.com into her browser.",
          "USPS Tracking shows the parcel in transit, with no delivery attempt and no address problem. Maya takes a screenshot of the text, forwards the message to 7726, reports it to the Postal Inspection Service and deletes it. Her phone case arrives two days later."
        ]
      },
      {
        "heading": "What ScreenshotChecker can and cannot tell you",
        "paragraphs": [
          "The <a href=\"/screenshot-scam-checker/\">screenshot scam checker</a> reads the text in a screenshot of the message and flags common scam patterns, such as urgency, fees and requests to tap a link. The <a href=\"/suspicious-link-checker/\">suspicious link checker</a> compares a web address with a historical labelled dataset without opening it.",
          "Neither tool can see USPS systems or your mail. A clean result does not mean a text is genuine, and a match in the dataset is historical, not a live safety rating. Only usps.com, the USPS app or USPS customer service can tell you about a real parcel."
        ]
      },
      {
        "heading": "What to do if you clicked, entered details or paid",
        "paragraphs": [
          "Act quickly. If you only opened the page and entered nothing, close it and keep your phone's software up to date. If you entered information, assume it is in a scammer's hands and protect the accounts it affects.",
          "The Postal Inspection Service asks people to forward USPS-themed scam texts to 7726 (SPAM) and to email the text and a screenshot to spam@uspis.gov. You can also report the scam to the FTC at ReportFraud.ftc.gov and to the FBI at ic3.gov, especially if you lost money."
        ],
        "checklist": [
          "Card details entered or a fee paid: call the number on the back of your card, report the charge and ask for a replacement card.",
          "Bank details entered: contact your bank through its official app or the number on your statement.",
          "Social Security number or date of birth entered: visit IdentityTheft.gov for a recovery plan and consider a credit freeze.",
          "Password entered: change it, and anywhere else you reused it.",
          "Report the text to 7726 and spam@uspis.gov, then delete it."
        ],
        "callout": {
          "type": "tip",
          "text": "Similar texts imitate UPS, FedEx, DHL and other couriers. The rule is the same for all of them: check on the courier's own website with the tracking number from your order. Readers in India can see our guide to <a href=\"/blog/india-post-courier-sms-scam/\">India Post and courier SMS scams</a>."
        }
      }
    ],
    "faq": [
      {
        "question": "Does USPS send text messages about packages?",
        "answer": "Only if you request text tracking for a specific parcel with its tracking number. According to the U.S. Postal Inspection Service, those texts do not contain links, and USPS does not send unrequested texts or emails about delivery problems."
      },
      {
        "question": "Does USPS charge a fee for redelivery?",
        "answer": "No. USPS has said it does not charge for redelivery. A text asking you to pay even a small amount to reschedule a delivery is a scam."
      },
      {
        "question": "I tapped the link but didn't enter anything. Am I safe?",
        "answer": "Close the page without entering details, keep your phone's operating system updated and watch your accounts. The main risk comes from information you type into the fake site, so if you entered nothing, the exposure is limited."
      },
      {
        "question": "Should I reply STOP to the USPS text?",
        "answer": "No. Replying confirms that your number is active. Forward the message to 7726, report it to spam@uspis.gov and delete it."
      },
      {
        "question": "How do I report a fake USPS text?",
        "answer": "Forward it to 7726 and email the message plus a screenshot to spam@uspis.gov. If you lost money or shared personal information, also report it to the FTC at ReportFraud.ftc.gov and the FBI at ic3.gov."
      },
      {
        "question": "Can ScreenshotChecker tell me if a USPS text is real?",
        "answer": "No. It can flag scam warning signs in the text and look up a link in a historical dataset, but it has no access to USPS. Check any real parcel on usps.com or in the official USPS app."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": [
      "smishing-fake-sms",
      "unpaid-toll-text-scam",
      "suspicious-link-checker-online"
    ],
    "cta": {
      "label": "Check a Suspicious Delivery Text",
      "url": "/screenshot-scam-checker/",
      "description": "See which scam warning signs appear in the message, then check any real parcel on usps.com yourself."
    }
  },
  {
    "slug": "fake-crypto-profit-screenshots",
    "title": "Fake Crypto Profit Screenshots: How Investment Scams Use Them",
    "seoTitle": "Fake Crypto Profit Screenshots and Investment Scams",
    "metaDescription": "Screenshots of huge crypto gains are a core tool of investment scams. Learn how the scam works, why profit screenshots prove nothing, and what to do.",
    "category": "Threat Analysis",
    "publishedAt": "2026-11-06",
    "authorName": "Virat Chauhan",
    "readTime": "8 min read",
    "excerpt": "How crypto investment scams use profit screenshots and fake trading dashboards to build trust, the withdrawal-fee trap, recovery scams that follow, and where to report.",
    "targetKeywords": [
      "fake crypto profit screenshots",
      "crypto investment scam",
      "pig butchering scam",
      "fake trading platform",
      "crypto withdrawal fee scam",
      "is this crypto investment real"
    ],
    "keyTakeaway": {
      "title": "A profit screenshot is a picture, not proof of profit",
      "text": "Anyone can show a screenshot of huge gains, and in many investment scams the trading site itself is run by the scammer, so even your own balance is just a number on their page. If you cannot withdraw freely, or must pay a fee or tax first, stop and report it."
    },
    "introduction": "A friendly stranger, a group chat or a new online match shares screenshots of crypto trades that doubled overnight, then offers to show you how. The screenshots look real, and some may even be genuine screenshots of a real-looking website. That is the trap. This guide explains how these investment scams use screenshots, why the numbers prove nothing, and what the FBI and FTC advise if you are already involved.",
    "contentSections": [
      {
        "heading": "How the crypto investment scam works",
        "paragraphs": [
          "The FBI describes a common pattern in its <a href=\"https://www.ic3.gov/PSA/2022/psa221003\">public service announcement on cryptocurrency investment fraud</a>. Contact starts on a dating app, social media, a messaging group or a \"wrong number\" text. The scammer builds trust over days or weeks, then starts talking about investing.",
          "Next come the screenshots: trades, wallet balances, profit charts and messages from \"other members\" celebrating gains. Then you are guided to a trading website or app. The FBI notes that these fake platforms let victims watch their balances appear to grow quickly, which encourages larger deposits.",
          "The scale is large. The FBI's <a href=\"https://www.ic3.gov/AnnualReport/Reports/2024_IC3Report.pdf\">2024 Internet Crime Report</a> lists more than 41,000 complaints about cryptocurrency investment fraud, with reported losses of about $5.8 billion in that year alone."
        ],
        "figure": {
          "afterParagraph": 1,
          "src": "/images/blog/fake-crypto-profit-screenshots/fictional-example.png",
          "alt": "Fictional investment group chat showing a profit screenshot, a mentor's tip and a 20 percent withdrawal fee demand, annotated with red flags.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional investment group. The profit screenshots build trust; the withdrawal fee is where the scam shows itself."
        }
      },
      {
        "heading": "Why profit screenshots prove nothing",
        "paragraphs": [
          "A screenshot shows what was on a screen. On a scam platform, everything on that screen is controlled by the scammer: the balance, the trade history and the profit chart. The screenshot can be completely unedited and still show money that does not exist.",
          "Screenshots shared by \"other members\" are no better. Group chats in these scams can be filled with accounts run by the same people, and images are easy to reuse or edit. A screenshot cannot show who owns an account, whether a withdrawal ever reached a bank, or whether the platform is a registered business.",
          "This is why checking the image itself, with tools like error level analysis or metadata, rarely settles anything here. The useful question is not \"is this screenshot edited?\" but \"can this money actually be withdrawn to my own bank, and is this platform real?\""
        ],
        "callout": {
          "type": "warning",
          "text": "Your own dashboard on a scam site is not proof either. If the platform is fake, the balance you see is just a number on a web page that the scammer controls."
        }
      },
      {
        "heading": "The withdrawal trap: fees, taxes and frozen accounts",
        "paragraphs": [
          "Many victims are allowed a small early withdrawal. It feels like proof, and it encourages a much larger deposit. When they later try to withdraw the larger balance, the platform suddenly needs a \"tax\", \"verification fee\", \"anti-money-laundering deposit\" or \"unlock fee\" first, often a percentage of the balance.",
          "Paying does not release the money. It is simply more money sent to the scammer, and the next demand usually follows. Being told to pay before you can withdraw your own money is one of the clearest signs of this fraud.",
          "Real, regulated exchanges do not make you send fresh money before you can take out your balance, and they do not charge tax on your behalf through a support chat."
        ]
      },
      {
        "heading": "Red flags of a crypto investment scam",
        "paragraphs": [
          "Watch for these together, not one by one. Scams combine several."
        ],
        "checklist": [
          "Someone you have never met in person brings up investing, often after a period of friendly chat.",
          "You are shown profit screenshots or told about a \"mentor\", \"insider\" or \"signal group\".",
          "Returns are high, steady and described as guaranteed or low-risk.",
          "You are asked to use a specific website or app you had not heard of, sometimes with a link sent in chat.",
          "You are told to move money through a crypto ATM, a new wallet or a third party.",
          "Withdrawals need a fee, tax or deposit first, or support suddenly stops answering.",
          "You are pressured to keep the investment secret from family or your bank."
        ]
      },
      {
        "heading": "Worked example: a fictional \"mentor\" group",
        "paragraphs": [
          "Alex, a fictional nurse in Manchester, is added to a messaging group called \"Daily Crypto Signals\". A friendly member messages Alex privately, shares screenshots of her account growing from £2,000 to £9,400 in a month, and introduces a \"mentor\" who posts trade tips.",
          "Alex signs up on the website the mentor recommends and deposits £500. The dashboard shows it growing to £820 in a week, and a £100 withdrawal arrives in Alex's bank. Encouraged, Alex adds £6,000. The balance climbs to £11,300.",
          "When Alex asks to withdraw, support replies that a 20% \"capital gains tax\" of £2,260 must be paid first. Alex searches the platform's name and finds it is not registered with any financial regulator, and that its domain was created two months earlier.",
          "Alex stops, does not pay the \"tax\", saves the chat and transaction records, and reports to the bank and to the police fraud reporting service. The early £100 withdrawal was the bait, not proof."
        ]
      },
      {
        "heading": "Beware the second scam: crypto recovery services",
        "paragraphs": [
          "After a loss, victims are often contacted by people offering to get the money back for a fee: \"recovery experts\", \"blockchain investigators\", law firms or even people claiming to work with the FBI.",
          "The <a href=\"https://consumer.ftc.gov/consumer-alerts/2022/11/worried-about-crypto-exchange-losses-dont-pay-money-help-recovering-money\">FTC warns</a> that anyone promising to recover crypto losses for a fee is running a scam. The FBI's <a href=\"https://www.ic3.gov/PSA/2025/PSA250813\">2025 alert on fake law firms</a> says no law firms are officially authorized partners of U.S. government agencies, and the IC3 states that it does not work with non-law-enforcement firms to recover funds."
        ]
      },
      {
        "heading": "How ScreenshotChecker can help, and where it stops",
        "paragraphs": [
          "The <a href=\"/screenshot-scam-checker/\">screenshot scam checker</a> reads chat screenshots and flags investment-scam language, such as guaranteed returns, urgency and payment requests. The <a href=\"/suspicious-link-checker/\">suspicious link checker</a> looks up a platform's address in a historical labelled dataset without opening it. <a href=\"/reverse-image-search/\">Reverse image search</a> can show whether the same profit screenshot has appeared elsewhere.",
          "None of these tools can tell you whether a trading platform is legitimate or whether money can be withdrawn. Check that with your country's financial regulator and your own bank."
        ],
        "cta": {
          "label": "Check an Investment Chat Screenshot",
          "url": "/screenshot-scam-checker/",
          "description": "See which scam warning signs appear in the conversation, then verify the platform with a financial regulator."
        }
      },
      {
        "heading": "What to do if you have already invested",
        "paragraphs": [
          "Stop sending money, including any fee, tax or deposit requested to unlock a withdrawal. Do not let anyone install remote-access apps on your phone or computer.",
          "Collect evidence before anything disappears: chat screenshots, the platform's web address, wallet addresses, transaction IDs (hashes), amounts and dates. The FBI asks victims to include these details when filing a complaint."
        ],
        "checklist": [
          "Contact your bank or card issuer immediately about any transfers.",
          "Report to the FBI at ic3.gov (United States) and the FTC at ReportFraud.ftc.gov, or to your country's police fraud reporting service.",
          "Report the platform to your financial regulator, and the account to the messaging or dating app.",
          "Ignore anyone who contacts you offering to recover the money for a fee.",
          "Talk to someone you trust. Scammers rely on secrecy and shame."
        ]
      }
    ],
    "faq": [
      {
        "question": "Can a crypto profit screenshot be fake even if it isn't edited?",
        "answer": "Yes. If the trading platform is run by scammers, an unedited screenshot faithfully shows numbers they control. The screenshot can be genuine while the profits are not."
      },
      {
        "question": "What is a pig butchering scam?",
        "answer": "It is a common name for long-con investment scams where the scammer builds a relationship over weeks before steering the victim into a fake crypto platform, then takes larger and larger deposits. The FBI describes these as cryptocurrency investment fraud."
      },
      {
        "question": "I made a small withdrawal successfully. Does that mean the platform is real?",
        "answer": "No. Small early withdrawals are a common tactic to build trust before a larger deposit. The test is whether you can withdraw your full balance without paying any new fee, tax or deposit."
      },
      {
        "question": "The platform says I must pay tax before withdrawing. Should I pay?",
        "answer": "No. Being asked to pay money before you can withdraw your own funds is a sign of fraud. Paying usually leads to further demands. Stop and report it."
      },
      {
        "question": "Can someone recover my lost crypto for a fee?",
        "answer": "Be extremely cautious. The FTC says anyone who promises to recover crypto losses for a fee is a scammer, and the FBI says the IC3 does not work with private firms to recover funds. Report to law enforcement instead."
      },
      {
        "question": "Can ScreenshotChecker tell me if an investment platform is legitimate?",
        "answer": "No. It can flag scam language in chat screenshots and look up a web address in a historical dataset, but it cannot verify a business. Check the platform with your country's financial regulator."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": [
      "whatsapp-telegram-task-job-scam",
      "fake-social-media-post-screenshot",
      "suspicious-link-checker-online"
    ],
    "cta": {
      "label": "Check a Suspicious Investment Chat",
      "url": "/screenshot-scam-checker/",
      "description": "Flag scam warning signs in a screenshot of the conversation, then check the platform with a financial regulator."
    }
  },
  {
    "slug": "payment-failed-screenshot-scam",
    "title": "\"Payment Failed but Money Debited\" Screenshot: Scam or Real?",
    "seoTitle": "Payment Failed or Processing Screenshot: Scam or Real?",
    "metaDescription": "A customer shows a payment failed, processing or bank error screenshot? What really happens to failed UPI payments, the scam tricks, and what to do.",
    "category": "Security",
    "publishedAt": "2026-11-12",
    "authorName": "Virat Chauhan",
    "readTime": "7 min read",
    "excerpt": "What a failed, pending or bank error payment screenshot really means, how RBI rules handle money stuck in a failed UPI payment, the tricks scammers build around these screens, and what sellers and payers should do.",
    "targetKeywords": [
      "payment processing screenshot",
      "gpay processing screenshot",
      "payment failed screenshot",
      "bank error screenshot",
      "money debited but payment failed",
      "gpay payment failed screenshot",
      "phonepe payment failed screenshot",
      "fake payment error screenshot"
    ],
    "keyTakeaway": {
      "title": "A failed or pending screen means you have not been paid",
      "text": "If your own UPI app or bank shows no credit, you have not received the money, whatever the customer's screen says. Genuine failed UPI payments are reversed to the payer by the banks, so you never need to hand over goods, refund a difference or scan a QR code to settle it."
    },
    "introduction": "A customer holds up their phone: \"Payment failed, but the money has been debited. It will come to you, please give me the goods.\" Or someone sends a \"bank error\" screenshot and asks you to pay a fee or send the money back. Real payment failures happen every day, and so do scams built around them. This guide explains what really happens when a UPI payment fails, the tricks to watch for, and what to do whether you are the seller or the payer.",
    "contentSections": [
      {
        "heading": "Two very different situations behind the same screen",
        "figure": {
          "afterParagraph": 1,
          "src": "/images/blog/payment-failed-screenshot-scam/fictional-example.png",
          "alt": "Fictional UPI payment failed screen for ₹1,200 saying money debited will be refunded, annotated with what the seller should check.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional failed payment screen. Whatever it says, only the seller's own app shows whether money arrived."
        },
        "paragraphs": [
          "Sometimes a payment genuinely fails: the bank server times out, the network drops, or the payment gets stuck in processing. The payer may even see money leave their account for a while. This is frustrating for everyone, but nobody is lying.",
          "Other times the screen is the trick. Prank apps and edited screenshots can show a payment error that never happened, and a failed payment is a convenient story: \"the money is on its way, so let me take the goods now\", or \"the bank made an error, so send me back the extra\"."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "Either way, the seller's answer is the same: check your own UPI app or bank. No credit means no payment yet, and the customer can pay again once their failed payment is sorted."
        }
      },
      {
        "heading": "What really happens to a failed UPI payment",
        "paragraphs": [
          "The Reserve Bank of India sets time limits for fixing failed digital payments in its <a href=\"https://www.rbi.org.in/commonman/English/scripts/Notification.aspx?Id=3074\">framework on turnaround time for failed transactions</a>. For a UPI transfer where the payer's account was debited but the receiver's account was not credited, the receiving bank must reverse the money automatically by the next day (T+1). For payments to a merchant where the debit happened but the merchant did not get confirmation, the limit is five days (T+5).",
          "If banks miss these limits, the framework sets compensation of ₹100 per day of delay. These are outer limits; most failed payments are reversed much sooner.",
          "The key point for sellers: in a genuine failure, the money goes back to the payer, not forward to you. A failed payment never turns into your money later. So there is nothing for you to \"wait for\" except a fresh, successful payment."
        ]
      },
      {
        "heading": "Processing or pending screenshots",
        "paragraphs": [
          "A screen that says \"processing\", \"pending\" or \"payment in progress\" is not a completed payment. It means the payer's app has not yet received a final answer from the banks. Most of these settle within minutes as either a success or a failure, and some take longer.",
          "Until your own app or bank shows the credit, treat a processing screenshot exactly like a failed one: the money has not reached you. A genuine payer can wait with you for the final status, or pay again once the first attempt is confirmed as failed. Someone who insists you hand over goods on a processing screen, or shows a processing screen that never updates, is a reason to stop."
        ],
        "checklist": [
          "Ask the payer to refresh their app and show the final status, not a saved screenshot.",
          "Check your own UPI app or bank for the credit and the UTR or reference number.",
          "If the first attempt fails, accept a fresh payment only after it shows in your account."
        ]
      },
      {
        "heading": "Tricks built around failed and error screens",
        "paragraphs": [
          "These patterns come up again and again. Each one asks you to act on the customer's screen instead of your own records."
        ],
        "checklist": [
          "\"Money is debited, it will reach you in a few hours, let me take the goods.\" A failed payment is reversed to the payer, not delivered to you later.",
          "\"The bank made an error and sent you double, return the extra.\" Check your own account; if nothing extra arrived, there is nothing to return.",
          "\"Scan this QR code or enter your PIN to receive the refund.\" <a href=\"https://npci.org.in/what-we-do/upi/upi-safety-shield\">NPCI's UPI Safety Shield</a> says the UPI PIN is only for paying and QR codes are only for paying, never for receiving money.",
          "A \"bank error\" screenshot sent by a stranger asking you to pay a fee to release a payment. Real banks do not charge release fees through chat.",
          "Pressure and drama: a long queue, an angry tone or a story about an emergency, so you skip checking your phone."
        ]
      },
      {
        "heading": "Worked example: a fictional bakery order",
        "paragraphs": [
          "Riya runs a small bakery in Pune. A customer collecting a ₹1,200 cake shows a screen that says \"Payment failed. Money debited will be refunded within 3–5 working days\" and asks to take the cake now and pay later.",
          "Riya opens her own UPI app. There is no ₹1,200 credit. She explains that if the payment failed, his bank will return the money to him, and asks him to pay again now, by UPI or cash.",
          "If he is genuine, he pays again or comes back later; his first payment will be reversed to his account. If he argues, leaves without paying or asks her to scan a QR code to \"receive the refund\", Riya has lost nothing, because she checked her own records before handing over the cake."
        ],
        "cta": {
          "label": "Check a Payment Screenshot's Text",
          "url": "/payment-screenshot-checker/",
          "description": "Read the status, amount and reference on a payment screenshot and see warning signs, then confirm the credit in your own app."
        }
      },
      {
        "heading": "If you are the payer and your payment failed",
        "paragraphs": [
          "Open the transaction in your UPI app and check its status. Processing payments usually settle as Success or Failed on their own, so avoid paying again until the status is clear, unless the seller confirms they have not received anything.",
          "If money left your account and the payment failed, wait for the automatic reversal. If it does not arrive within the time limits, raise a complaint from the transaction in your UPI app or with your bank. If your bank does not resolve it, the RBI's <a href=\"https://cms.rbi.org.in/\">complaint management system</a> is the next step.",
          "Use only the help options inside your UPI app or your bank's official app. Search results and social media are full of fake \"customer care\" numbers that exist to take more money."
        ]
      },
      {
        "heading": "What ScreenshotChecker can and cannot tell you",
        "paragraphs": [
          "The <a href=\"/payment-screenshot-checker/\">payment screenshot checker</a> reads the text of a UPI receipt with OCR, including status words such as Failed or Pending, and flags warning signs in the amount and reference. There is also a <a href=\"/payment-screenshot-checker/hindi/\">Hindi version</a>.",
          "It cannot see your bank account, contact a bank or confirm that money moved. A clean result is not proof of payment, and a warning is not proof of fraud. Your own UPI app or bank statement is the only answer. For the full routine, see our guides on <a href=\"/blog/fake-upi-payment-screenshot/\">fake UPI payment screenshots</a> and <a href=\"/blog/fake-payment-screenshot-kaise-pehchane/\">नकली पेमेंट स्क्रीनशॉट कैसे पहचानें</a>."
        ]
      },
      {
        "heading": "Outside India: pending and error screens elsewhere",
        "paragraphs": [
          "The same trick appears with other payment apps. A buyer shows a \"pending\" or \"error\" screen from a bank or payment app and asks you to ship or refund a difference. The rule does not change: check your own account. Our guides to <a href=\"/blog/fake-payment-screenshot-paypal-venmo-cash-app/\">PayPal, Venmo, Cash App and Zelle screenshots</a> and <a href=\"/blog/fake-bank-transfer-screenshot/\">bank transfer screenshots</a> cover the details."
        ]
      }
    ],
    "faq": [
      {
        "question": "The customer's screen says payment failed but money debited. Will I get the money?",
        "answer": "No. In a genuine failure, the banks reverse the money to the payer. Under RBI's framework this should happen by the next day for UPI transfers. Ask the customer to pay again once you confirm nothing arrived in your own app."
      },
      {
        "question": "How long does a failed UPI refund take?",
        "answer": "RBI's turnaround framework says money debited for a UPI transfer that did not reach the receiver should be reversed by T+1, and within T+5 for merchant payments, with ₹100 per day compensation for delays beyond that. Most reversals happen much sooner."
      },
      {
        "question": "Someone sent me a bank error screenshot and asked me to return extra money. What should I do?",
        "answer": "Check your own bank or UPI app. If no extra money arrived, there is nothing to return. If something did arrive, contact your bank rather than sending money back to a number from a chat, because reversing a real error is the bank's job."
      },
      {
        "question": "Do I need to scan a QR code or enter my PIN to receive a refund?",
        "answer": "No. NPCI says the UPI PIN is only needed to pay money and QR codes are only scanned to pay. Anyone asking you to scan or enter your PIN to receive money is trying to take it."
      },
      {
        "question": "Can a payment failed screenshot be fake?",
        "answer": "Yes. Prank apps and edited images can show any status. That is why the status on someone else's screen does not matter; only the credit in your own account does."
      },
      {
        "question": "Can ScreenshotChecker confirm whether a payment failed?",
        "answer": "No. It reads the text on the screenshot and flags warning signs, but it has no access to banks. Check your own UPI app or bank statement."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["how-to-find-utr-number", "payment-fail-paisa-kat-gaya", "fake-customer-care-number-scam", "qr-code-scam", "scam-statistics", 
      "fake-upi-payment-screenshot",
      "fake-payment-screenshot-kaise-pehchane",
      "fake-bank-transfer-screenshot"
    ],
    "cta": {
      "label": "Check a Payment Screenshot",
      "url": "/payment-screenshot-checker/",
      "description": "See the status, amount and reference read from the screenshot, then confirm the credit in your own UPI app or bank."
    }
  },
  {
    "slug": "reverse-image-search-screenshot",
    "title": "How to Reverse Image Search a Screenshot (iPhone, Android, PC)",
    "seoTitle": "How to Reverse Image Search a Screenshot on Any Device",
    "metaDescription": "Reverse image search a screenshot on iPhone, Android or a computer with Google Lens, Bing or TinEye. Crop it first, then read results like an investigator.",
    "category": "Forensics",
    "publishedAt": "2026-11-12",
    "authorName": "Virat Chauhan",
    "readTime": "7 min read",
    "excerpt": "Step-by-step ways to search the web with a screenshot on iPhone, Android and desktop, why cropping first matters, how to read matches, and what a search cannot tell you.",
    "targetKeywords": [
      "reverse image search screenshot",
      "search by screenshot",
      "can you reverse image search a screenshot",
      "find image from screenshot",
      "screenshot image search",
      "how to image search a screenshot"
    ],
    "keyTakeaway": {
      "title": "Crop to the picture, search two engines, look for the earliest copy",
      "text": "Yes, you can reverse image search a screenshot. Crop away the phone's interface first, search with Google Lens and one other engine such as TinEye or Bing, then look for the oldest and most original copy. No match is not proof that an image is new or genuine."
    },
    "introduction": "You can reverse image search a screenshot just like any photo. It is one of the quickest ways to find where a picture came from: the original post behind a viral image, the real owner of a profile photo, or an older listing reusing the same product photo. The trick is to prepare the screenshot first, so the search engine looks at the picture rather than your phone's buttons and text. Here is how to do it on every device, and how to read what you find.",
    "contentSections": [
      {
        "heading": "Why search with a screenshot at all",
        "paragraphs": [
          "Screenshots are how images travel today: a picture inside a chat, a post, an ad or a dating profile. When you cannot get the original file, a screenshot is often the only copy you have.",
          "A reverse image search can show you where else the picture appears, when it was first posted, and in what context. That is often enough to spot a stolen profile photo, a reused product picture or an old image presented as news."
        ]
      },
      {
        "heading": "Step 1: crop the screenshot first",
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/reverse-image-search-screenshot/fictional-example.png",
          "alt": "Fictional checklist for searching with a screenshot: crop to the picture, remove status bar and captions, search two engines, look for the earliest copy.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional preparation checklist. Cropping to the picture itself gives search engines the best chance of a match."
        },
        "paragraphs": [
          "A full screenshot contains a status bar, app buttons, usernames, captions and other text around the picture. Search engines may try to match all of that, and they may also see private details you did not mean to share.",
          "Crop to the picture itself before searching; your phone's built-in photo editor can do it. The <a href=\"/reverse-image-search/\">reverse image search helper</a> can then make a clean copy in your browser, without the file's hidden metadata, and open each search engine for you."
        ],
        "callout": {
          "type": "warning",
          "text": "Searching sends the image to the search provider. Crop out names, phone numbers, faces of people who did not agree and anything else private before you upload."
        }
      },
      {
        "heading": "Step 2: search from an iPhone",
        "paragraphs": [
          "Google's help pages describe a few ways to search with an image on iPhone. The steps can change between app versions, so look for the Lens icon (a small camera) if a menu has moved."
        ],
        "checklist": [
          "Google app: tap the Lens (camera) icon in the search bar, then pick the screenshot from your photos. Drag the corners of the box to the part you want.",
          "Chrome: open the three-dot menu and choose Search Screen with Google Lens to search what is currently on screen, without saving a screenshot first.",
          "Google Photos: open the screenshot, tap More, then Google Lens.",
          "TinEye or Bing: open tineye.com or bing.com/visualsearch in Safari and upload the cropped screenshot."
        ]
      },
      {
        "heading": "Step 3: search from an Android phone",
        "paragraphs": [
          "Android has Google Lens built into several apps, and some phones can search directly from the screen."
        ],
        "checklist": [
          "Google app: tap the Lens icon, then choose the image from your screenshots and adjust the selection box.",
          "Chrome: tap the Lens icon in the search bar and upload the screenshot from your images.",
          "Google Photos: open the screenshot and tap the Lens button.",
          "Some phones offer Circle to Search, which lets you circle part of the screen to search it.",
          "TinEye or Bing Visual Search work in any mobile browser with an upload."
        ]
      },
      {
        "heading": "Step 4: search from a computer",
        "paragraphs": [
          "On a computer, the quickest route is usually drag and drop."
        ],
        "checklist": [
          "Google: go to images.google.com, click the camera icon (Search by image), then upload the file or drag it in.",
          "Chrome: right-click an image on a web page and choose Search with Google Lens to see results in a side panel.",
          "Bing: open bing.com/visualsearch and drop the image in.",
          "TinEye: upload at tineye.com. TinEye is useful for finding exact copies and sorting results by date."
        ],
        "cta": {
          "label": "Prepare a Screenshot for Searching",
          "url": "/reverse-image-search/",
          "description": "Make a clean copy of your cropped screenshot in your browser, then open Google Lens, Bing or TinEye."
        }
      },
      {
        "heading": "How to read the results",
        "paragraphs": [
          "Look for the earliest and most original copy, not the most popular one. The first upload, the highest-resolution version or a post by the person or organisation shown is usually closest to the source.",
          "Compare the context. If a photo described as \"today's flood\" first appeared years ago in another country, or a \"seller's own photo\" appears on a shop's website, the claim around the image is wrong even if the picture is real.",
          "Search more than one engine. Google Lens is strong for objects, places and products; TinEye is good at exact copies and dates; Bing sometimes finds pages the others miss."
        ]
      },
      {
        "heading": "Worked example: a fictional recruiter profile",
        "paragraphs": [
          "Jordan gets a message from a \"recruiter\" offering remote work that pays per task. The recruiter's profile photo looks professional. Jordan screenshots the profile, crops to the photo and searches it with Google Lens and TinEye.",
          "TinEye finds the same photo on a stock image site from 2019, and Google Lens shows it on several unrelated profiles with different names. The recruiter is not the person in the photo. Jordan stops replying and reads up on <a href=\"/blog/whatsapp-telegram-task-job-scam/\">task job scams</a>."
        ]
      },
      {
        "heading": "When the search finds nothing",
        "paragraphs": [
          "No match does not mean an image is original, recent or genuine. Many pictures come from private chats, closed groups or new photos that have never been indexed, and heavily cropped or edited copies can be hard to match.",
          "If the search is empty, try a different crop, another engine, or a different frame from a video. Then move on to other checks: ask for the original file, check its <a href=\"/blog/how-to-tell-if-a-photo-is-a-screenshot/\">screenshot or photo clues</a>, or look at <a href=\"/blog/exif-metadata/\">metadata</a>. For anything involving money, verify the claim itself rather than the picture."
        ]
      }
    ],
    "faq": [
      {
        "question": "Can you reverse image search a screenshot?",
        "answer": "Yes. Screenshots work like any other image in Google Lens, Bing Visual Search and TinEye. Crop away the phone interface and text first so the engine focuses on the picture."
      },
      {
        "question": "How do I search by screenshot on iPhone?",
        "answer": "Open the Google app, tap the Lens camera icon and choose the screenshot from your photos, or open it in Google Photos and tap More then Google Lens. In Chrome you can also use Search Screen with Google Lens from the three-dot menu."
      },
      {
        "question": "How do I search with a screenshot on Android?",
        "answer": "Use the Lens icon in the Google app or Chrome and pick the screenshot from your images, or open it in Google Photos and tap Lens. Some phones also offer Circle to Search."
      },
      {
        "question": "Which reverse image search is best for screenshots?",
        "answer": "Use more than one. Google Lens is strong for objects, places and products; TinEye is good for finding exact copies and sorting by date; Bing Visual Search sometimes finds different pages."
      },
      {
        "question": "Is it private to reverse image search a screenshot?",
        "answer": "The image is sent to the search provider you choose. Crop out names, numbers, faces and other private details first. ScreenshotChecker's helper makes a clean copy without hidden metadata in your browser, and you upload it to the provider yourself."
      },
      {
        "question": "No results came up. Does that mean the image is real?",
        "answer": "No. Private, new or heavily edited images often have no matches. An empty result simply means the engines did not find a copy; use other checks before trusting the image."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["photo-se-search-kaise-kare", "where-is-this-screenshot-from", 
      "fake-social-media-post-screenshot",
      "how-to-tell-if-a-photo-is-a-screenshot",
      "ai-image-detector-online"
    ],
    "cta": {
      "label": "Reverse Image Search a Screenshot",
      "url": "/reverse-image-search/",
      "description": "Make a clean copy of your cropped screenshot locally, then search it with Google Lens, Bing or TinEye."
    }
  },
  {
    "slug": "where-is-this-screenshot-from",
    "title": "Where Is This Screenshot From? How to Find the App and the Original Source",
    "seoTitle": "Where Is This Screenshot From? Find the App and Source",
    "metaDescription": "Got a screenshot with no context? Learn to identify the app from its layout, find the original post with text and image search, and check if it is real.",
    "category": "Forensics",
    "publishedAt": "2026-11-12",
    "updatedAt": "2026-11-17",
    "authorName": "Virat Chauhan",
    "readTime": "7 min read",
    "excerpt": "A step-by-step method for tracing a screenshot back to the app it was taken in and the post, chat or page it shows: read the interface, search the exact words, search the picture, and confirm at the source.",
    "targetKeywords": [
      "where is this screenshot from",
      "what is this screenshot from",
      "what app is this screenshot from",
      "find source of screenshot",
      "find original post from screenshot",
      "screenshot source finder"
    ],
    "keyTakeaway": {
      "title": "Trace the words first, then the picture",
      "text": "Most screenshots can be traced by searching their exact text in quotes and the visible account name, then running a reverse image search on any picture inside. A screenshot is only confirmed when you find the original post, page or message and it says the same thing."
    },
    "introduction": "To find out what app or site a screenshot is from, read the interface first: fonts, icons, buttons and the layout of names and timestamps usually give the app away. Then search a distinctive phrase from it in quotes, and reverse image search any photo inside it to find the original post. Screenshots travel without their context. A post is cropped, forwarded into a group, reposted with a new caption, and soon nobody knows where it came from or whether it was ever real. Finding the source answers both questions at once: which app or site the screenshot shows, and whether the original still exists and matches. This guide walks through the method, from reading the interface to searching the text and the image.",
    "contentSections": [
      {
        "heading": "Step 1: read the interface for clues",
        "paragraphs": [
          "Before searching anything, look at the parts of the screenshot that are not the message itself. Apps have recognisable layouts: the position of the profile picture, the shape of message bubbles, where the time and reply buttons sit, the icons along the bottom, and the colour of links and verification badges.",
          "Write down everything that can be searched: the display name and @handle, any date or time, hashtags, a group or page name, a website address in a browser bar, and unusual words or spelling. These small details are usually what leads to the original."
        ],
        "figure": {
          "afterParagraph": 1,
          "src": "/images/blog/where-is-this-screenshot-from/fictional-example.png",
          "alt": "Fictional screenshot of a social post with numbered clues: the handle, the exact sentence, the date, the picture inside and the app layout.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional post. Each numbered clue is something you can search: the handle, an exact sentence, the date and the picture inside."
        },
        "checklist": [
          "Layout: bubble shapes, button icons and where the name sits usually identify the app.",
          "Status bar: the clock, carrier and battery style can show iPhone or Android, which narrows the app version.",
          "Language and currency: a regional language, ₹, $ or £ hints at where it was posted.",
          "Watermarks: reposting apps and editing tools often leave a small logo or username in a corner."
        ]
      },
      {
        "heading": "Step 2: search the exact words",
        "paragraphs": [
          "Pick the most unusual sentence in the screenshot and search for it in quotation marks, for example \"we will refund every customer by Friday\". Quotation marks ask the search engine for that exact phrase. If the full sentence finds nothing, try a shorter, distinctive part of it, because screenshots are often retyped with small changes.",
          "Add the account name or the platform to narrow the results, such as the handle plus two or three key words. Then search inside the platform itself: most social apps have their own search, and some let you filter by account and date. If the account name is visible, open that profile and scroll to the date shown in the screenshot.",
          "Can't copy the text? The <a href=\"/screenshot-ocr/\">screenshot OCR tool</a> reads the words from the image in your browser so you can paste them into a search box."
        ],
        "callout": {
          "type": "tip",
          "text": "If the post was deleted, search the exact sentence together with the word \"archive\", or look up the profile or page address in the Internet Archive's Wayback Machine at web.archive.org. Many public pages were saved before they disappeared."
        }
      },
      {
        "heading": "Step 3: search the picture inside it",
        "paragraphs": [
          "If the screenshot contains a photo, a meme, a product image or a profile picture, crop to that picture and run a reverse image search. Cropping away the app's buttons and text helps the engine match the image itself rather than the screen around it.",
          "Use more than one engine. Google Lens is good at recognising places, products and objects; TinEye can sort exact copies by date, which helps you find the earliest one; Bing Visual Search sometimes finds pages the others miss. The <a href=\"/blog/reverse-image-search-screenshot/\">guide to reverse image searching a screenshot</a> has step-by-step instructions for iPhone, Android and computer, and the <a href=\"/reverse-image-search/\">reverse image search helper</a> prepares a clean copy and opens each engine for you."
        ]
      },
      {
        "heading": "Step 4: confirm at the source",
        "paragraphs": [
          "When you find a likely original, compare it with the screenshot carefully. Check the account is the real one (the exact handle, not a lookalike with an extra letter), the date matches, and the wording is identical. A post can be real but taken out of context, such as an old announcement shared as if it were new.",
          "If you find the original and the screenshot differs, you have found an edit. You can line the two images up in the <a href=\"/screenshot-comparison/\">screenshot comparison tool</a> to see exactly which words or numbers were changed."
        ]
      },
      {
        "heading": "When you cannot find the source",
        "paragraphs": [
          "Private chats, stories that expire, closed groups and deleted posts often leave nothing to find. No result does not prove the screenshot is fake, but it does mean you cannot confirm it, so treat it as unverified, especially if it is being used to make you angry, scared or in a hurry to act.",
          "For a chat screenshot, the only real proof is the conversation on the original phone; the <a href=\"/blog/fake-whatsapp-chat-screenshot/\">fake WhatsApp chat guide</a> explains why. For a payment screenshot, check your own bank or UPI app instead of the image. For a viral claim, look for a fact check: Google's Fact Check Explorer lets you search published fact checks by keyword or image."
        ],
        "checklist": [
          "Search the exact text in quotes, then shorter parts of it.",
          "Open the visible account and scroll to the date shown.",
          "Reverse image search any picture inside, with two engines.",
          "Check web archives for deleted public posts.",
          "Look for a fact check on viral claims.",
          "Still nothing? Treat it as unverified, not as true."
        ]
      },
      {
        "heading": "Can a tool tell which app a screenshot is from?",
        "paragraphs": [
          "Image files carry some technical clues. A screenshot's size often matches a particular phone screen, and some files keep metadata such as the software that saved them. The <a href=\"/screenshot-detector/\">screenshot detector</a> and <a href=\"/screenshot-metadata-checker/\">metadata checker</a> show these details locally in your browser.",
          "These clues describe the device and file, not the content. Metadata is usually stripped when a screenshot is sent through chat apps or social media, so the interface and the search steps above are more useful for finding where it came from."
        ]
      }
    ],
    "faq": [
      {
        "question": "How do I find out where a screenshot is from?",
        "answer": "Search the most unusual sentence in quotation marks, add the account name if one is visible, and reverse image search any picture inside the screenshot. Then open the original post or page and check it matches."
      },
      {
        "question": "How can I tell what app a screenshot was taken in?",
        "answer": "Look at the layout: message bubble shapes, button icons, where the name and time sit, and the colour of links and badges. Each app has a recognisable design, and small logos or watermarks in a corner often name the app or reposting tool."
      },
      {
        "question": "Can Google Lens find the source of a screenshot?",
        "answer": "It can often find the picture inside a screenshot. Crop away the app interface first so Lens matches the image itself, and try TinEye or Bing as well, since each engine finds different copies."
      },
      {
        "question": "What if the original post was deleted?",
        "answer": "Search the exact text with the word archive, check the Wayback Machine for the profile or page address, and look for reposts or news coverage that quoted it. Without an original you cannot confirm the screenshot."
      },
      {
        "question": "If I can't find the source, is the screenshot fake?",
        "answer": "Not necessarily. Private chats and expired stories leave nothing to search. It means the screenshot is unverified, so do not act on it or share it as fact."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": [
      "reverse-image-search-screenshot",
      "fake-social-media-post-screenshot",
      "screenshot-checker-online"
    ],
    "cta": {
      "label": "Read the text in a screenshot",
      "url": "/screenshot-ocr/",
      "description": "Copy the exact words out of a screenshot in your browser, ready to search in quotation marks."
    }
  },
  {
    "slug": "how-to-tell-if-a-photo-is-edited",
    "title": "Is This Photo Edited or Fake? How to Check Any Image",
    "seoTitle": "Is This Photo Edited or Fake? How to Check Any Image",
    "metaDescription": "How to tell if a photo is edited, photoshopped or AI-made: find earlier copies, read metadata and Content Credentials, look for visual clues and use ELA.",
    "category": "Forensics",
    "publishedAt": "2026-11-12",
    "authorName": "Virat Chauhan",
    "readTime": "8 min read",
    "excerpt": "A practical order of checks for a suspicious photo: where it came from, earlier copies, Content Credentials and metadata, visual clues, and forensic tools such as Error Level Analysis, with what each one can and cannot prove.",
    "targetKeywords": [
      "how to tell if a photo is edited",
      "is this photo fake",
      "fake photo detector",
      "photo manipulation detector",
      "how to tell if an image is photoshopped",
      "edited image detector"
    ],
    "keyTakeaway": {
      "title": "The source beats every detector",
      "text": "Finding an earlier, unedited copy of a photo, or the original from a trusted source, is the strongest evidence you can get. Metadata, visual clues and forensic maps are useful hints, but none of them can prove on its own that a photo is real or fake."
    },
    "introduction": "Editing a photo has never been easier: phone apps remove people, change text and swap backgrounds in seconds, and AI tools can create a convincing picture from a sentence. That makes \"is this photo real?\" a fair question for almost anything that surprises you online. There is no single button that answers it, but a short sequence of checks will settle most cases. This guide gives that sequence, starting with the checks that prove the most.",
    "contentSections": [
      {
        "heading": "1. Find out where the photo came from",
        "paragraphs": [
          "Ask who first posted the image and when. A photo shared by a news agency or the person who took it, with a date and place, is far easier to check than one forwarded with no name attached. If you can, ask the sender where they got it.",
          "Be wary of the classic signs of a misleading photo: no source, a caption that pushes a strong emotion, and a request to share quickly. Many \"fake\" photos are real pictures with a false caption: an old flood photo shared as today's, or a picture from another country presented as local."
        ]
      },
      {
        "heading": "2. Look for earlier copies",
        "paragraphs": [
          "A reverse image search with Google Lens, TinEye or Bing Visual Search shows where else the picture appears. If you find an older version, compare them: a missing person, a changed sign or a different background in one copy reveals the edit straight away. TinEye's option to sort results by date is especially helpful for finding the earliest copy.",
          "The <a href=\"/reverse-image-search/\">reverse image search helper</a> makes a clean copy of your image in your browser and opens each engine. When you have two versions, the <a href=\"/screenshot-comparison/\">comparison tool</a> highlights exactly which pixels differ."
        ],
        "figure": {
          "afterParagraph": 1,
          "src": "/images/blog/how-to-tell-if-a-photo-is-edited/fictional-example.png",
          "alt": "Fictional checklist for a suspicious photo: earlier copy found, Content Credentials, metadata, visual clues, ELA map, with notes on how much each proves.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional set of results. An earlier copy that differs is strong evidence; the other checks are supporting clues."
        }
      },
      {
        "heading": "3. Check Content Credentials and metadata",
        "paragraphs": [
          "Some cameras, editing apps and AI generators attach Content Credentials, a signed record based on the C2PA standard that describes how the file was made and edited. You can upload an image at <a href=\"https://contentcredentials.org/verify\">contentcredentials.org/verify</a>, and the <a href=\"/ai-image-detector/\">fake image detector</a> also looks for them. Valid credentials are strong evidence of a file's history, but most images do not carry them and social apps often remove them, so their absence proves nothing.",
          "Ordinary metadata (EXIF) can include the camera model, the date taken, the editing software and sometimes the location. The <a href=\"/screenshot-metadata-checker/\">metadata checker</a> reads it locally. An editing program's name is a hint that the file was opened in an editor, which is normal for many genuine photos. Metadata is also easy to change or delete, so treat it as a clue, not a verdict."
        ]
      },
      {
        "heading": "4. Look closely for visual clues",
        "paragraphs": [
          "Zoom in and check the details that edits and generators often get wrong. None of these is proof alone, because compression and camera processing create odd artefacts too, but several together deserve suspicion."
        ],
        "checklist": [
          "Shadows and light: do shadows fall the same way for every person and object?",
          "Edges: blurry halos, cut-out outlines or hair that melts into the background.",
          "Repeated patterns: the same cloud, brick pattern or face appearing twice, a sign of cloning.",
          "Text and signs: warped letters, misspelt words or fonts that don't match the rest of the scene.",
          "Reflections: mirrors, windows and water that don't show what they should.",
          "Hands, ears, teeth and jewellery: common trouble spots for AI images.",
          "Straight lines: door frames and walls that bend near a person can mean a body was reshaped."
        ]
      },
      {
        "heading": "5. Use forensic tools, and know their limits",
        "paragraphs": [
          "Error Level Analysis (ELA) re-saves a JPEG and shows how much each area changes. A pasted object or retouched region can respond differently from the rest of the photo and stand out. The <a href=\"/image-manipulation-checker/\">photo manipulation checker</a> runs ELA in your browser; its guide explains how to read the map.",
          "ELA works best on JPEG photos saved only a few times. Text and sharp edges always look bright, and an image resized or re-sent through a chat app loses most of the differences. A clean ELA map does not mean a photo is genuine, and a bright patch does not mean it is fake."
        ],
        "callout": {
          "type": "warning",
          "text": "No online detector is 100% accurate. AI detectors in particular give probabilities and can be fooled by resizing, filters or screenshots of the image. Use them as one clue among several, never as the only evidence."
        }
      },
      {
        "heading": "6. Is it AI-generated or edited?",
        "paragraphs": [
          "AI-generated images and edited photos are checked in similar ways, with a few extra tools. Google's Gemini app can check images for SynthID, an invisible watermark Google adds to images made or edited with its own AI tools; according to <a href=\"https://support.google.com/gemini/answer/16722517\">Google's help page</a>, this only identifies Google AI content, not images from other generators.",
          "The <a href=\"/blog/ai-image-detector-online/\">guide to AI image detection</a> covers the signals in more depth, and <a href=\"/blog/ai-generated-screenshot/\">how to tell if a screenshot is AI-generated</a> deals with fake chats and receipts made by AI."
        ]
      },
      {
        "heading": "7. Decide what you can say",
        "paragraphs": [
          "After these checks, most photos fall into one of three groups. Confirmed: you found the original from a trusted source and it matches. Fake or misleading: you found an earlier version that differs, or proof the caption is wrong. Unverified: nothing conclusive either way. Unverified is a perfectly honest answer, and it means you should not share the photo as fact.",
          "If a photo of you has been edited or faked and shared without permission, keep copies and links, report it on the platform, and in India you can report it at cybercrime.gov.in or by calling 1930."
        ]
      }
    ],
    "faq": [
      {
        "question": "How can I tell if a photo has been edited?",
        "answer": "Search for earlier copies with a reverse image search, check its Content Credentials and metadata, zoom in on shadows, edges, text and reflections, and use Error Level Analysis as a supporting clue. An earlier version that differs is the clearest proof."
      },
      {
        "question": "Is there a free fake photo detector?",
        "answer": "Yes. ScreenshotChecker's fake image detector and photo manipulation checker are free and run in your browser. They list clues such as Content Credentials, metadata, texture statistics and ELA, but no detector can give a guaranteed verdict."
      },
      {
        "question": "Can metadata prove a photo is real?",
        "answer": "No. Metadata such as the camera model and date can be edited or deleted with free tools, and most social apps strip it. It can support other evidence but cannot prove a photo is genuine."
      },
      {
        "question": "How do I know if a picture is photoshopped?",
        "answer": "Look for mismatched shadows, cut-out edges, repeated patterns and bent straight lines, then compare it with any earlier copy you can find online. ELA can highlight areas with a different saving history in JPEG photos."
      },
      {
        "question": "Can AI images be detected reliably?",
        "answer": "Not always. Watermarks like SynthID and Content Credentials can confirm some AI images, and detectors estimate probabilities, but resizing, filters and screenshots weaken all of these. Finding the source is still the most reliable check."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["how-to-tell-if-an-image-is-ai-generated", "fake-receipt-ai-generated", 
      "ai-image-detector-online",
      "reverse-image-search-screenshot",
      "exif-metadata"
    ],
    "cta": {
      "label": "Check a photo for edits",
      "url": "/image-manipulation-checker/",
      "description": "Run Error Level Analysis and clone checks on a photo in your browser, then weigh the results with the other clues."
    }
  },
  {
    "slug": "ai-generated-screenshot",
    "title": "Is This Screenshot AI-Generated? How to Check Fake Chats, Receipts and Posts",
    "seoTitle": "Is This Screenshot AI-Generated? How to Check It",
    "metaDescription": "AI can now fake chats, receipts and posts with clean text. How to tell if a screenshot is AI-generated, what detectors can and cannot do, and what to check.",
    "category": "AI & Forensics",
    "publishedAt": "2026-11-12",
    "authorName": "Virat Chauhan",
    "readTime": "7 min read",
    "excerpt": "AI image tools can now draw convincing chat screenshots, payment receipts and social posts with readable text. Here is how to check one: the clues that still give AI away, what watermarks and detectors can tell you, and why the source is the real test.",
    "targetKeywords": [
      "how to tell if a screenshot is ai generated",
      "ai generated screenshot",
      "ai screenshot detector",
      "fake screenshot ai",
      "ai fake chat screenshot",
      "ai generated receipt"
    ],
    "keyTakeaway": {
      "title": "Assume a screenshot can be generated",
      "text": "Modern AI tools can produce a believable screenshot with clean text in seconds, so looking real is no longer evidence. Check the claim at its source: the real account, the original chat on the phone, or your own bank app. Use AI detectors and watermarks only as supporting clues."
    },
    "introduction": "For years, fake screenshots were made with editing apps or fake chat generators. Now AI image tools can create them from a single sentence: \"a WhatsApp chat where my boss agrees to a raise\", \"a bank receipt for ₹50,000\", \"a tweet from a famous actor\". Older AI images gave themselves away with garbled text, but newer models write clean, readable words. This guide explains which clues still help, what detection tools can and cannot do, and how to check an AI-made screenshot properly.",
    "contentSections": [
      {
        "heading": "Why AI screenshots are harder to spot now",
        "paragraphs": [
          "Early image generators were poor at text. Signs, labels and chat messages came out as nonsense letters, which made AI screenshots easy to catch. Recent models have largely fixed this: they can render a full chat thread, a receipt with amounts and a reference number, or a social post with a username and timestamp.",
          "That does not make them perfect, but it does mean \"the text looks fine\" no longer proves anything. The right mindset is the same one you would use for a screenshot made with an editing app: any screenshot can be fake until it is checked against its source."
        ]
      },
      {
        "heading": "Clues that can still give AI away",
        "paragraphs": [
          "Generators draw a picture of a screen; they do not run the real app. That leaves small inconsistencies that are worth checking, especially if you have a genuine screenshot from the same app to compare with."
        ],
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/ai-generated-screenshot/fictional-example.png",
          "alt": "Fictional AI-made chat screenshot with numbered clues: a time that runs backwards, mismatched icons, a slightly wrong font and a too-perfect layout.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional chat screenshot with typical clues. Each one is a reason to check further, not proof by itself."
        },
        "checklist": [
          "Timestamps that run out of order, or a status bar time that doesn't fit the messages.",
          "Icons, ticks and buttons that are close to the real app but not quite the same shape or position.",
          "Fonts that are slightly off: wrong weight, uneven spacing or letters that change size within a line.",
          "Numbers that don't add up, such as a total that differs from the items or a balance that doesn't change.",
          "An unusually smooth, clean look, with no compression noise or uneven lighting from a real phone screen.",
          "Odd details at the edges: half-drawn icons, repeated words, or text that fades into a blur."
        ],
        "callout": {
          "type": "info",
          "text": "Apps change their design often. A detail that looks wrong may just be a newer or older version, or a different phone. Compare with a screenshot you took yourself from the same app before deciding."
        }
      },
      {
        "heading": "What watermarks and detectors can tell you",
        "paragraphs": [
          "Some AI tools mark what they create. Google adds an invisible SynthID watermark to images made or edited with its AI, and its Gemini app can check for it; Google's <a href=\"https://support.google.com/gemini/answer/16722517\">help page</a> notes this only identifies Google AI content. Some generators also attach Content Credentials, which you can check at <a href=\"https://contentcredentials.org/verify\">contentcredentials.org/verify</a>.",
          "These marks are useful when you find one, but missing marks prove nothing: many tools don't add them, and taking a screenshot of an image, cropping it or re-sending it can remove metadata-based credentials. General AI detectors, including the <a href=\"/ai-image-detector/\">fake image detector</a>, look at texture, noise and other statistics. Screenshots are mostly flat colour and text, which gives these statistics little to work with, so treat any score as a weak signal."
        ]
      },
      {
        "heading": "The checks that actually settle it",
        "paragraphs": [
          "Whether a fake screenshot was made by AI, an editing app or a fake chat generator, it is caught the same way: by checking the claim outside the image."
        ],
        "checklist": [
          "A payment or bank receipt: open your own bank or UPI app and look for the credit. No credit means no payment.",
          "A chat: ask to see the conversation on the person's phone, or check your own copy of the chat.",
          "A social post: open the real account and look for the post on that date; search its exact words in quotes.",
          "A company notice or offer: check the company's official website or app, not a link in the message.",
          "A news screenshot: look for the story on the outlet's own site or in a fact check."
        ]
      },
      {
        "heading": "Where AI screenshots are used in scams",
        "paragraphs": [
          "AI-generated screenshots appear in the same scams as edited ones, just faster and more polished: fake payment receipts sent to sellers, fake profit dashboards in <a href=\"/blog/fake-crypto-profit-screenshots/\">investment scams</a>, invented chats used to blackmail or embarrass someone, and fake posts from public figures promoting a product or scheme.",
          "If an image is pushing you to pay, share or act quickly, slow down. The <a href=\"/screenshot-scam-checker/\">screenshot scam checker</a> reads the text in a screenshot and flags common pressure tactics, and the <a href=\"/blog/screenshot-checker-online/\">verification checklist</a> walks through the full routine."
        ]
      }
    ],
    "faq": [
      {
        "question": "How can you tell if a screenshot is AI-generated?",
        "answer": "Look for out-of-order timestamps, icons and fonts that don't quite match the real app, numbers that don't add up and an unnaturally clean look. Then confirm the claim at its source, because modern AI can avoid most visual flaws."
      },
      {
        "question": "Can AI make fake chat screenshots?",
        "answer": "Yes. Current image generators can draw a convincing chat, receipt or social post with readable text from a short prompt. A screenshot looking real is no longer evidence that the conversation happened."
      },
      {
        "question": "Do AI detectors work on screenshots?",
        "answer": "Only weakly. Screenshots are mostly flat colours and text, which gives texture-based detectors little to analyse, and re-saving or cropping weakens them further. Use a detector's score as one clue, not a verdict."
      },
      {
        "question": "Can Gemini tell if an image is AI-generated?",
        "answer": "The Gemini app can check for SynthID, the watermark Google adds to images made or edited with Google AI. It cannot reliably identify images from other AI generators."
      },
      {
        "question": "What should I do with a suspicious AI screenshot?",
        "answer": "Don't act on it. Check the claim at the source, such as your bank app, the real account or the original chat. If it is part of a scam or harassment, keep a copy, report it on the platform, and in India report it at cybercrime.gov.in or 1930."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["how-to-tell-if-an-image-is-ai-generated", "fake-receipt-ai-generated", 
      "ai-image-detector-online",
      "how-to-tell-if-a-photo-is-edited",
      "fake-whatsapp-chat-screenshot"
    ],
    "cta": {
      "label": "Check a screenshot's clues",
      "url": "/ai-image-detector/",
      "description": "See Content Credentials, metadata, texture and ELA signals for an image, processed in your browser."
    }
  },
  {
    "slug": "scam-statistics",
    "title": "UPI Fraud and Online Scam Statistics (2026 Update): India and the US",
    "seoTitle": "UPI Fraud and Online Scam Statistics 2026: India and US",
    "metaDescription": "UPI fraud cases and losses by year, India's cyber fraud complaints and money saved via 1930, and US FTC and FBI scam losses for 2025, with official sources.",
    "category": "Threat Analysis",
    "publishedAt": "2026-11-12",
    "authorName": "Virat Chauhan",
    "readTime": "6 min read",
    "excerpt": "The key numbers on UPI fraud, cyber financial fraud in India and consumer scams in the United States, taken from parliamentary answers and official agency releases, with what they mean for anyone handed a payment screenshot.",
    "targetKeywords": [
      "upi fraud statistics",
      "upi fraud cases 2024-25",
      "online scam statistics 2026",
      "cyber fraud statistics india",
      "ftc fraud losses 2025",
      "scam statistics"
    ],
    "keyTakeaway": {
      "title": "The numbers in one paragraph",
      "text": "India recorded 12.64 lakh UPI fraud cases worth ₹981 crore in FY 2024-25, down slightly from the FY 2023-24 peak of 13.42 lakh cases and ₹1,087 crore. In the United States, the FTC received about 3 million fraud reports with a record $15.9 billion in losses in 2025, and the FBI logged $20.9 billion in internet crime losses. Reported figures are only a fraction of real losses, because many victims never report."
    },
    "introduction": "Fake payment screenshots, fake delivery texts and fake investment dashboards all feed into the same official numbers: reported fraud. This page collects the most useful figures from government sources in India and the United States, explains what each one measures, and is updated when new official data is published. Every figure links to its source, so you can quote it with confidence.",
    "contentSections": [
      {
        "heading": "UPI fraud in India, year by year",
        "paragraphs": [
          "The Ministry of Finance gave the Lok Sabha these figures for domestic UPI fraud in a written reply on 15 December 2025, reported by <a href=\"https://yourstory.com/2025/12/upi-frauds-peak-in-fy24-show-signs-of-decline-parliament-data\">YourStory</a> and other outlets. Cases are incidents reported to banks and payment providers; amounts are the money involved.",
          "Fraud rose quickly as UPI grew, peaked in FY 2023-24, and fell slightly in FY 2024-25. Up to November 2025, FY 2025-26 had already recorded 10.64 lakh cases worth ₹805 crore."
        ],
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/scam-statistics/upi-fraud-by-year.png",
          "alt": "Bar chart of reported UPI fraud in India: ₹242 crore in FY 2021-22, ₹573 crore in FY 2022-23, ₹1,087 crore in FY 2023-24 and ₹981 crore in FY 2024-25.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. Reported UPI fraud by financial year. Source: Ministry of Finance reply in the Lok Sabha, 15 December 2025."
        },
        "checklist": [
          "FY 2021-22: 4.07 lakh cases, ₹242 crore.",
          "FY 2022-23: 7.25 lakh cases, ₹573 crore.",
          "FY 2023-24: 13.42 lakh cases, ₹1,087 crore (the peak so far).",
          "FY 2024-25: 12.64 lakh cases, ₹981 crore.",
          "FY 2025-26, April to November 2025: 10.64 lakh cases, ₹805 crore."
        ],
        "callout": {
          "type": "info",
          "text": "The same reply said only about 6% of fraud chargebacks were recovered, according to YourStory's report of the answer. Money that leaves through a scam is rarely returned, which is why checking before you hand over goods matters more than complaining afterwards."
        }
      },
      {
        "heading": "Cyber financial fraud and the 1930 helpline",
        "paragraphs": [
          "UPI is only one channel. Complaints about all kinds of online financial fraud go to the National Cyber Crime Reporting Portal (cybercrime.gov.in) and the 1930 helpline, run by the Indian Cyber Crime Coordination Centre (I4C) under the Ministry of Home Affairs.",
          "Reporting fast makes a real difference. When a complaint arrives quickly, banks can put a hold on the money before it is moved on. In a written reply to the Rajya Sabha on 17 December 2025, the government said more than ₹7,000 crore had been saved in more than 23 lakh complaints through this system since 2021 (<a href=\"https://newsonair.gov.in/over-rs-7000-crore-saved-through-citizen-financial-cyber-fraud-reporting-and-management-system/\">Akashvani News</a>). By June 2026 the figure had passed ₹11,158 crore across more than 32 lakh complaints, as reported by <a href=\"https://www.outlookmoney.com/retirement/cyber-fraud-rs-11158-crore-saved-across-328-million-complaints-how-to-report-financial-fraud-on-cybercrime-portal\">Outlook Money</a>."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "Lost money to an online fraud in India? Call 1930 or report at cybercrime.gov.in as soon as possible. The earlier the report, the better the chance the money can be frozen."
        }
      },
      {
        "heading": "Scam losses in the United States",
        "paragraphs": [
          "The Federal Trade Commission collects consumer fraud reports through its Consumer Sentinel Network. In June 2026 the <a href=\"https://www.ftc.gov/news-events/news/press-releases/2026/06/ftc-data-show-people-reported-losing-3-point-5-billion-imposter-scams-2025\">FTC reported</a> that about $16 billion was reported lost to fraud in 2025, the highest on record and about 25% more than in 2024. Its earlier congressional testimony put the figure at $15.9 billion from about 3 million fraud reports.",
          "The FBI's Internet Crime Complaint Center (IC3) counts internet-enabled crime separately. Its 2025 annual report recorded more than 1 million complaints and $20.9 billion in reported losses, a 26% rise on 2024, with people aged 60 and over reporting $7.7 billion of that, according to <a href=\"https://www.aarp.org/money/scams-fraud/fbi-ftc-report-2025-losses/\">AARP's summary of both reports</a>."
        ],
        "checklist": [
          "FTC, 2025: about 3 million fraud reports and $15.9 billion (rounded to $16 billion) in reported losses.",
          "FTC, 2025: $3.5 billion lost to imposter scams, the most reported fraud category, with nearly $1 billion to business impersonators and about $920 million to government impersonators.",
          "FBI IC3, 2025: more than 1 million complaints and $20.9 billion in reported losses.",
          "FBI IC3, 2025: $7.7 billion reported lost by people aged 60 and over."
        ]
      },
      {
        "heading": "What these numbers mean for a payment screenshot",
        "paragraphs": [
          "Behind many of these reports is a moment of trust: a seller who accepted a screenshot as proof, a customer who believed a \"failed payment\" story, or an investor who trusted a profit dashboard. Screenshots are easy to fake, and AI tools now make them even faster to produce.",
          "The defence is the same everywhere: confirm the money in your own bank or payment app before acting. Our guides cover the most common versions: <a href=\"/blog/fake-upi-payment-screenshot/\">fake UPI payment screenshots</a>, <a href=\"/blog/payment-failed-screenshot-scam/\">payment failed or processing screens</a>, <a href=\"/blog/fake-payment-screenshot-paypal-venmo-cash-app/\">PayPal, Venmo, Cash App and Zelle screenshots</a> and <a href=\"/blog/fake-crypto-profit-screenshots/\">fake crypto profit screenshots</a>."
        ]
      },
      {
        "heading": "How to read scam statistics",
        "paragraphs": [
          "Each source counts something different. UPI figures come from banks and payment providers; cyber fraud complaints come from victims who report to the police portal; FTC and FBI data come from consumers who choose to report. A case can appear in more than one dataset, and many never appear in any.",
          "All of these are reported figures, so they understate the real total. Changes from year to year can also reflect better reporting, not only more crime. When you quote a figure, name the source and the period, as this page does."
        ]
      }
    ],
    "faq": [
      {
        "question": "How many UPI fraud cases were there in 2024-25?",
        "answer": "12.64 lakh UPI fraud cases involving ₹981 crore were reported in FY 2024-25, according to the Ministry of Finance's reply in the Lok Sabha on 15 December 2025. That was slightly lower than the FY 2023-24 peak of 13.42 lakh cases and ₹1,087 crore."
      },
      {
        "question": "Is UPI fraud increasing?",
        "answer": "It rose sharply from FY 2021-22 to a peak in FY 2023-24, then fell slightly in FY 2024-25. FY 2025-26 had 10.64 lakh cases worth ₹805 crore up to November 2025, so fraud remains high even though growth has slowed."
      },
      {
        "question": "How much money was lost to scams in the US in 2025?",
        "answer": "Consumers reported losing $15.9 billion (about $16 billion) to fraud in 2025 according to the FTC, a record. The FBI's IC3 separately recorded $20.9 billion in internet crime losses."
      },
      {
        "question": "What should I do if I lose money to an online fraud in India?",
        "answer": "Call the 1930 helpline or report at cybercrime.gov.in immediately, and inform your bank. Quick reports let banks hold the money; the government says more than ₹11,000 crore has been saved this way since 2021."
      },
      {
        "question": "Can I use these statistics in my article or presentation?",
        "answer": "Yes. Please cite the original government source listed next to each figure, and you are welcome to link to this page as a summary."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["digital-arrest-scam", 
      "fake-upi-payment-screenshot",
      "payment-failed-screenshot-scam",
      "smishing-fake-sms"
    ],
    "cta": {
      "label": "Check a payment screenshot",
      "url": "/payment-screenshot-checker/",
      "description": "Look for warning signs in a UPI, GPay, PhonePe or Paytm screenshot, then confirm the money in your own bank app."
    }
  },
  {
    "slug": "digital-arrest-scam",
    "title": "Digital Arrest Scam: Fake Police, CBI or ED Video Calls and Arrest Notices",
    "seoTitle": "Digital Arrest Scam: Fake CBI or Police Video Call? Hang Up",
    "metaDescription": "Told on a video call that you are under digital arrest? There is no such thing. How the scam works, the fake notices it uses and what to do right now.",
    "category": "Security",
    "publishedAt": "2026-11-12",
    "updatedAt": "2026-11-27",
    "authorName": "Virat Chauhan",
    "readTime": "8 min read",
    "excerpt": "How the digital arrest scam works in India, the fake warrants and ID cards scammers show on video calls, why no agency arrests anyone online, and the exact steps to take if you or a family member is on such a call now.",
    "targetKeywords": [
      "digital arrest scam",
      "digital arrest",
      "fake cbi call",
      "fake police video call",
      "fake arrest warrant whatsapp",
      "ed notice scam"
    ],
    "keyTakeaway": {
      "title": "There is no such thing as a digital arrest",
      "text": "Police, CBI, ED, customs, RBI and judges do not arrest people over video calls or ask for money to clear a case. Anyone who says you are under digital arrest is a scammer. End the call, do not pay, and report it on 1930 or cybercrime.gov.in."
    },
    "introduction": "The call starts with a courier or telecom problem: a parcel in your name with drugs inside, or a SIM card linked to a crime. Within minutes you are on a video call with someone in a police uniform, shown an arrest warrant with your name on it, and told you are under \"digital arrest\": you must stay on camera, tell no one, and transfer money to \"verify\" your accounts. It feels official and terrifying, and it is entirely fake. This guide explains how the scam works and what to do.",
    "contentSections": [
      {
        "heading": "How a digital arrest scam unfolds",
        "paragraphs": [
          "The scripts vary, but most follow the same steps. Each one is designed to frighten you, isolate you and rush you into paying before you can think or ask anyone."
        ],
        "checklist": [
          "A first call, often a recorded message, claims to be from a courier company, the telecom regulator or a bank: a parcel in your name was seized, or your number or Aadhaar is linked to a crime.",
          "You are \"transferred\" to a police station, the CBI, ED, narcotics bureau or customs, and asked to join a video call on WhatsApp or Skype.",
          "The \"officer\" appears in uniform, sometimes in a set made to look like a police station, and shows an ID card, an FIR, an arrest warrant or a court order with your name.",
          "You are told you are under digital arrest: stay on camera, stay in your room, and tell no family member, because they are \"also under investigation\".",
          "Finally you are told to move your money to a \"safe\" or \"RBI verification\" account to prove it is clean, with a promise that it will be returned after the case is cleared. It never is."
        ]
      },
      {
        "heading": "What the authorities say",
        "paragraphs": [
          "The Indian Cyber Crime Coordination Centre (I4C) under the Ministry of Home Affairs issued a public advisory in October 2024 stating that the CBI, police, customs, ED and judges do not arrest people through video calls, and calling digital arrests a scam (<a href=\"https://theprint.in/india/cbi-ed-police-dont-arrest-people-through-video-calls-indian-cyber-crime-coordination-centre/2299608\">ThePrint</a>). Police awareness material makes the same point: Indian law has no concept of a digital arrest.",
          "Real legal processes are different. A genuine notice is served in person or by post and gives you time to respond, usually with a lawyer. No agency asks you to stay on a video call, keep it secret from your family, or transfer money to an account to prove your innocence."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "If anyone says you are under digital arrest, hang up. No real officer will ever arrest you on a call or ask you to send money to clear your name."
        }
      },
      {
        "heading": "The fake documents and screenshots they show",
        "paragraphs": [
          "Scammers rely on official-looking images: arrest warrants with the Supreme Court or CBI emblem, FIR copies, ED summons, \"RBI\" letters and police ID cards, sent on WhatsApp or held up on camera. These are made with ordinary editing tools or AI and often reuse real logos and the names of real officers."
        ],
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/digital-arrest-scam/fictional-example.png",
          "alt": "Fictional WhatsApp message with a fake arrest warrant, numbered: an official emblem, a demand to stay on video, a secrecy instruction and a transfer to a verification account.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional example of the messages sent during a digital arrest scam. Every element is a warning sign."
        },
        "checklist": [
          "A warrant or summons sent over WhatsApp rather than served in person.",
          "Instructions to keep the matter secret or stay on camera.",
          "Any mention of transferring money, buying gift cards or crypto, or \"RBI verification\".",
          "Spelling and grammar mistakes, mixed fonts or stretched emblems on an \"official\" document.",
          "Phone numbers that are mobile numbers, often with a foreign country code."
        ]
      },
      {
        "heading": "If you or someone at home is on such a call now",
        "paragraphs": [
          "Scammers often keep victims on a call for hours, even days. If you suspect a family member is in a digital arrest, interrupt them: elderly people living alone and professionals with savings are frequent targets."
        ],
        "checklist": [
          "End the call. You are not legally required to stay on any video call.",
          "Do not transfer any money, share OTPs or install any app they suggest.",
          "Tell a family member or friend straight away; the secrecy is part of the scam.",
          "Call the national cybercrime helpline 1930 or report at cybercrime.gov.in, especially if any money was sent; quick reports let banks freeze it.",
          "If you are worried a case is real, visit your local police station in person or call 112. Never use a number the caller gave you."
        ]
      },
      {
        "heading": "If you already paid",
        "paragraphs": [
          "Call 1930 immediately, and your bank's official helpline, with the transaction details. The faster you report, the better the chance the money can be held before it is moved. Save the call log, numbers, screenshots of the video call, documents sent to you and every transaction reference.",
          "Expect follow-up scams: people claiming to be lawyers, \"cyber cell officers\" or recovery agents who promise to get your money back for a fee. Genuine police do not charge to recover money."
        ]
      },
      {
        "heading": "Digital arrest complaint: the number and how to file online",
        "paragraphs": [
          "The digital arrest complaint number is 1930, the national cybercrime helpline, and the online route is the National Cybercrime Reporting Portal at <a href=\"https://cybercrime.gov.in/\">cybercrime.gov.in</a>. There is no separate helpline only for digital arrest: the same two channels take every kind of cyber fraud. The helpline runs in all States and Union Territories, and it is linked to a system that connects police with banks, wallets and payment companies so that stolen money can be stopped before it moves on (<a href=\"https://i4c.mha.gov.in/ncrp.aspx\">I4C, Ministry of Home Affairs</a>).",
          "Which channel to use depends on whether money has left your account. The portal accepts complaints from anywhere in India and lets you track the status of your complaint online afterwards, so keep the acknowledgement number it gives you."
        ],
        "checklist": [
          "Money was sent: call 1930 first, then your bank's official helpline. Keep the transaction reference (UTR), amount, date and time ready.",
          "No money lost, but you want the callers reported: file a complaint on cybercrime.gov.in with the numbers, call log and screenshots.",
          "Only a suspicious call, SMS or WhatsApp message so far: report the number on <a href=\"https://sancharsaathi.gov.in/sfc/\">Chakshu on the Sanchar Saathi portal</a>, which takes reports of people posing as government officials. Report within 30 days of the call or message.",
          "You would rather speak to someone in person: go to your nearest police station or cyber police station with the same evidence.",
          "Never search for a \"digital arrest helpline\" and dial a number from an ad, a comment or a forwarded message. Use only 1930 and the two government sites above."
        ]
      },
      {
        "heading": "Checking a document someone sent you",
        "paragraphs": [
          "ScreenshotChecker's <a href=\"/screenshot-scam-checker/\">screenshot scam checker</a> reads the text in a screenshot or document photo and flags pressure tactics, threats and requests for money. The <a href=\"/image-manipulation-checker/\">photo manipulation checker</a> can show signs that an image was edited. These tools give clues, not verdicts. The real answer is simpler: no genuine agency arrests anyone on a video call, so any digital arrest is a scam regardless of how real the paperwork looks."
        ]
      }
    ],
    "faq": [
      {
        "question": "Is digital arrest real?",
        "answer": "No. Indian law has no concept of digital arrest, and the I4C has stated that police, CBI, ED, customs and judges do not arrest people through video calls. Anyone claiming to digitally arrest you is a scammer."
      },
      {
        "question": "What should I do if I get a call saying a parcel in my name contains drugs?",
        "answer": "Hang up. Courier companies and police do not handle seizures this way. If you are worried, contact the courier through its official website or visit your local police station in person."
      },
      {
        "question": "Can the police or CBI send an arrest warrant on WhatsApp?",
        "answer": "A warrant shared on WhatsApp during a call that demands money is a scam. Real legal notices are served through proper channels and never come with instructions to transfer money or keep the matter secret."
      },
      {
        "question": "Where do I report a digital arrest scam?",
        "answer": "Call the cybercrime helpline 1930 or file a complaint at cybercrime.gov.in. You can also report suspicious numbers on the Chakshu facility of the Sanchar Saathi portal."
      },
      {
        "question": "What is the digital arrest complaint number?",
        "answer": "1930, the national cybercrime helpline. It works in every State and Union Territory and is the fastest route if money was sent. There is no separate number only for digital arrest, so do not trust any other helpline number you find online."
      },
      {
        "question": "How do I file a digital arrest complaint online?",
        "answer": "Go to cybercrime.gov.in, the National Cybercrime Reporting Portal, and file a complaint with the caller's numbers, call log, screenshots and any transaction details. You can track the complaint's status on the portal afterwards. If you only received a call and lost nothing, you can also report the number on Chakshu at sancharsaathi.gov.in within 30 days."
      },
      {
        "question": "Will I get my money back after a digital arrest scam?",
        "answer": "It depends on how quickly you report. Call 1930 at once so banks can try to freeze the money. Ignore anyone who offers to recover it for a fee."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["loan-app-harassment-morphed-photos", "trai-sim-block-call-scam", "digital-arrest-kya-hai", 
      "smishing-fake-sms",
      "scam-statistics",
      "india-post-courier-sms-scam"
    ],
    "cta": {
      "label": "Check a suspicious message",
      "url": "/screenshot-scam-checker/",
      "description": "Upload a screenshot of a threatening message or document to see which scam warning signs it contains."
    }
  },
  {
    "slug": "e-challan-sms-scam",
    "title": "Fake e-Challan SMS Scam: Traffic Fine Link or APK? Check It Safely",
    "seoTitle": "Fake e-Challan SMS or WhatsApp? How to Check a Traffic Fine",
    "metaDescription": "Got an e-challan SMS or WhatsApp with a link or APK file? Do not open it. How the fake traffic fine scam works and how to check a challan on Parivahan.",
    "category": "Security",
    "publishedAt": "2026-11-12",
    "authorName": "Virat Chauhan",
    "readTime": "6 min read",
    "excerpt": "Fake traffic challan messages send a link or an APK file that steals OTPs and banking details. Here is what they look like, how to check a real challan on the official Parivahan portal, and what to do if you installed the file.",
    "targetKeywords": [
      "fake e challan sms",
      "e challan scam",
      "traffic challan apk scam",
      "rto challan apk",
      "fake challan message whatsapp",
      "how to check e challan"
    ],
    "keyTakeaway": {
      "title": "Check challans only on the official portal",
      "text": "Never tap a challan link or install an APK sent by SMS or WhatsApp. Type echallan.parivahan.gov.in into your browser yourself, or use the official app from the Play Store or App Store, and enter your vehicle or challan number there."
    },
    "introduction": "\"Your vehicle has a pending traffic challan of ₹500. Pay today to avoid court action.\" The message arrives by SMS or WhatsApp with a link or a file called something like RTO Challan.apk. Real e-challans exist, which is why this scam works so well. But the fake versions are built to install malware or steal your card details. This guide shows how to tell them apart and check any challan safely.",
    "contentSections": [
      {
        "heading": "How the fake e-challan scam works",
        "paragraphs": [
          "The message copies the style of a genuine challan: your vehicle number (sometimes guessed or bought from leaked data), an amount, a deadline and a threat of licence suspension or court action. It then pushes you to one of two traps."
        ],
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/e-challan-sms-scam/fictional-example.png",
          "alt": "Fictional WhatsApp message about a traffic challan, numbered: an urgent deadline, an APK file attachment, a lookalike payment link and a threat of court action.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional fake e-challan message. The APK file and the lookalike link are the dangerous parts."
        },
        "checklist": [
          "An APK file: an Android app that, once installed, can read your SMS (including bank OTPs), show fake screens over your banking apps and send itself to your contacts.",
          "A lookalike website: a page copying the Parivahan design that asks for card details, UPI PIN or net banking login to pay the fine."
        ]
      },
      {
        "heading": "What officials have warned",
        "paragraphs": [
          "The Press Information Bureau's fact check unit has warned that fake e-challan messages sent by SMS and WhatsApp carry links, APK files and PDFs that look like RTO notices and can expose OTPs and bank details, and has advised checking challans only on the official Parivahan portal (<a href=\"https://www.outlookmoney.com/news/fake-traffic-e-challan-messages-can-expose-otps-trigger-unauthorised-bank-transactions-pib-warns\">Outlook Money</a>). State police and motor vehicle departments, including in Kerala and Delhi, have issued similar warnings about APK files sent in challan messages (<a href=\"https://theprint.in/india/keralam-police-warn-of-malicious-apk-scam-via-fake-e-challan-sms/3053993/\">ThePrint</a>)."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "Government departments do not send apps as APK files over WhatsApp or SMS. Any challan message with an APK attachment is a scam."
        }
      },
      {
        "heading": "How to check a real challan",
        "paragraphs": [
          "If you think you might really have a fine, check it yourself without using anything from the message."
        ],
        "checklist": [
          "Type echallan.parivahan.gov.in into your browser's address bar yourself.",
          "Choose to check challan status and enter your vehicle number, challan number or driving licence number.",
          "Pay only on that official portal or through your state traffic police's official site, never through a link in a message.",
          "Alternatively, use the official mParivahan or your state's traffic police app, installed from the Google Play Store or Apple App Store.",
          "No challan on the portal? Then the message was fake, whatever it says."
        ]
      },
      {
        "heading": "Red flags in a challan message",
        "paragraphs": [],
        "checklist": [
          "An attachment ending in .apk, or a request to install an app.",
          "A link to a site that is not parivahan.gov.in, including lookalikes with extra words or misspellings.",
          "A sender that is an ordinary mobile number, especially on WhatsApp.",
          "Threats of immediate licence cancellation, vehicle seizure or court action unless you pay today.",
          "A request for card details, UPI PIN or OTP to pay a fine."
        ]
      },
      {
        "heading": "If you opened the link or installed the APK",
        "paragraphs": [
          "Act quickly. Turn on airplane mode to cut the app off, then uninstall it from your settings (check Settings, Apps for anything you don't recognise, and remove its device administrator access if it asks). If you entered card or bank details, call your bank's official number to block the card and UPI, and change your banking passwords from a different, clean device.",
          "Report the fraud on 1930 or cybercrime.gov.in, especially if money left your account, and report the message as spam. Save a screenshot of the message, the file name and the sender number. You can paste the link into ScreenshotChecker's <a href=\"/suspicious-link-checker/\">suspicious link checker</a> to see its warning signs without opening it."
        ]
      },
      {
        "heading": "Similar scams to know",
        "paragraphs": [
          "The same trick is used with electricity bills, courier parcels and toll fees. See our guides to <a href=\"/blog/electricity-bill-disconnection-sms-scam/\">electricity bill SMS scams</a>, <a href=\"/blog/india-post-courier-sms-scam/\">India Post and courier SMS scams</a> and, for drivers in the US, <a href=\"/blog/unpaid-toll-text-scam/\">unpaid toll texts</a>. The <a href=\"/screenshot-scam-checker/\">screenshot scam checker</a> flags common warning signs in any message you screenshot."
        ]
      }
    ],
    "faq": [
      {
        "question": "How do I know if an e-challan message is real?",
        "answer": "Ignore the link and check on echallan.parivahan.gov.in by typing the address yourself and entering your vehicle number. If the challan is not listed there, the message is fake."
      },
      {
        "question": "Is the RTO challan APK safe to install?",
        "answer": "No. Government departments do not send apps as APK files over SMS or WhatsApp. These files are malware that can read your OTPs and take over your banking apps."
      },
      {
        "question": "I installed the challan APK. What should I do?",
        "answer": "Turn on airplane mode, uninstall the app, call your bank to block cards and UPI, change banking passwords from another device and report it on 1930 or cybercrime.gov.in."
      },
      {
        "question": "Can I pay a traffic challan through a WhatsApp link?",
        "answer": "Do not. Pay only on the official Parivahan e-challan portal or your state traffic police's official website or app."
      },
      {
        "question": "Where can I report a fake challan message?",
        "answer": "Report fraud on 1930 or cybercrime.gov.in, and suspicious messages on the Chakshu facility of the Sanchar Saathi portal. Also mark the message as spam in your messaging app."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["fake-challan-message-kaise-pehchane", 
      "smishing-fake-sms",
      "electricity-bill-disconnection-sms-scam",
      "india-post-courier-sms-scam"
    ],
    "cta": {
      "label": "Check a suspicious link",
      "url": "/suspicious-link-checker/",
      "description": "See warning signs in a link from a message without opening it."
    }
  },
  {
    "lang": "hi",
    "slug": "digital-arrest-kya-hai",
    "title": "डिजिटल अरेस्ट क्या है? पुलिस, CBI या ED की वीडियो कॉल आए तो क्या करें",
    "seoTitle": "Digital Arrest क्या है? फर्जी CBI, पुलिस कॉल से ऐसे बचें",
    "metaDescription": "वीडियो कॉल पर कोई कहे कि आप डिजिटल अरेस्ट में हैं? ऐसा कोई कानून नहीं है। यह ठगी कैसे होती है, नकली वारंट कैसे पहचानें और तुरंत क्या करें।",
    "category": "Security",
    "publishedAt": "2026-11-12",
    "updatedAt": "2026-11-27",
    "authorName": "Virat Chauhan",
    "readTime": "7 min read",
    "excerpt": "डिजिटल अरेस्ट ठगी कैसे होती है, ठग वीडियो कॉल पर कौन से नकली वारंट और ID कार्ड दिखाते हैं, कोई भी एजेंसी ऑनलाइन गिरफ़्तारी क्यों नहीं करती, और अगर आप या घर का कोई सदस्य ऐसी कॉल पर है तो क्या करें।",
    "targetKeywords": [
      "digital arrest kya hai",
      "डिजिटल अरेस्ट",
      "digital arrest scam hindi",
      "फर्जी CBI कॉल",
      "नकली पुलिस वीडियो कॉल",
      "digital arrest se kaise bache"
    ],
    "keyTakeaway": {
      "title": "डिजिटल अरेस्ट नाम की कोई चीज़ नहीं होती",
      "text": "पुलिस, CBI, ED, कस्टम, RBI या जज कभी वीडियो कॉल पर गिरफ़्तार नहीं करते और केस ख़त्म करने के लिए पैसे नहीं माँगते। जो भी कहे कि आप डिजिटल अरेस्ट में हैं, वह ठग है। कॉल काटें, पैसे न भेजें और 1930 पर या cybercrime.gov.in पर शिकायत करें।"
    },
    "introduction": "कॉल किसी कूरियर या मोबाइल नंबर की समस्या से शुरू होती है: आपके नाम के पार्सल में ड्रग्स मिले हैं, या आपका सिम किसी अपराध से जुड़ा है। कुछ ही मिनट में आप वीडियो कॉल पर होते हैं, सामने पुलिस की वर्दी में कोई बैठा है, आपके नाम का गिरफ़्तारी वारंट दिखाया जाता है और कहा जाता है कि आप \"डिजिटल अरेस्ट\" में हैं: कैमरे के सामने रहिए, किसी को मत बताइए, और अपने खाते \"वेरिफ़ाई\" कराने के लिए पैसे भेजिए। यह सब बहुत असली और डरावना लगता है, लेकिन पूरी तरह फ़र्ज़ी है। यह गाइड बताती है कि यह ठगी कैसे होती है और आपको क्या करना है।",
    "contentSections": [
      {
        "heading": "डिजिटल अरेस्ट ठगी कैसे होती है",
        "paragraphs": [
          "कहानी बदलती रहती है, लेकिन तरीका लगभग हमेशा एक जैसा होता है। हर कदम आपको डराने, अकेला करने और सोचने का समय दिए बिना पैसे भिजवाने के लिए बनाया जाता है।"
        ],
        "checklist": [
          "पहली कॉल, अक्सर रिकॉर्डेड आवाज़ में, किसी कूरियर कंपनी, टेलीकॉम विभाग या बैंक के नाम से आती है: आपके नाम का पार्सल पकड़ा गया है, या आपका नंबर या आधार किसी अपराध में इस्तेमाल हुआ है।",
          "फिर आपको किसी \"पुलिस स्टेशन\", CBI, ED, नारकोटिक्स या कस्टम अधिकारी से जोड़ा जाता है और WhatsApp या Skype वीडियो कॉल पर आने को कहा जाता है।",
          "\"अधिकारी\" वर्दी में दिखता है, पीछे पुलिस स्टेशन जैसा सेट होता है, और आपके नाम का ID कार्ड, FIR, वारंट या कोर्ट का आदेश दिखाया जाता है।",
          "कहा जाता है कि आप डिजिटल अरेस्ट में हैं: कैमरे के सामने रहें, कमरे से बाहर न जाएँ और परिवार को कुछ न बताएँ, क्योंकि \"उनकी भी जाँच चल रही है\"।",
          "आख़िर में कहा जाता है कि अपना पैसा किसी \"सेफ़\" या \"RBI वेरिफ़िकेशन\" खाते में भेजें ताकि साबित हो कि पैसा साफ़ है, और जाँच के बाद वापस मिल जाएगा। वह कभी वापस नहीं आता।"
        ]
      },
      {
        "heading": "सरकार और पुलिस क्या कहती है",
        "paragraphs": [
          "गृह मंत्रालय के भारतीय साइबर अपराध समन्वय केंद्र (I4C) ने अक्टूबर 2024 में सार्वजनिक सलाह जारी करके साफ़ कहा कि CBI, पुलिस, कस्टम, ED या जज वीडियो कॉल के ज़रिए किसी को गिरफ़्तार नहीं करते, और डिजिटल अरेस्ट को ठगी बताया (<a href=\"https://theprint.in/india/cbi-ed-police-dont-arrest-people-through-video-calls-indian-cyber-crime-coordination-centre/2299608\">ThePrint</a>)। भारतीय क़ानून में \"डिजिटल अरेस्ट\" जैसी कोई व्यवस्था है ही नहीं।",
          "असली क़ानूनी प्रक्रिया अलग होती है। असली नोटिस हाथ से या डाक से दिया जाता है और जवाब देने का समय मिलता है, आमतौर पर वकील के साथ। कोई भी एजेंसी आपको वीडियो कॉल पर बैठाए नहीं रखती, परिवार से बात छिपाने को नहीं कहती, और बेगुनाही साबित करने के लिए पैसे ट्रांसफ़र नहीं करवाती।"
        ],
        "callout": {
          "type": "golden-rule",
          "text": "अगर कोई कहे कि आप डिजिटल अरेस्ट में हैं, तो कॉल काट दें। कोई भी असली अधिकारी फ़ोन पर गिरफ़्तार नहीं करता और नाम साफ़ करने के लिए पैसे नहीं माँगता।"
        }
      },
      {
        "heading": "नकली वारंट और स्क्रीनशॉट कैसे पहचानें",
        "paragraphs": [
          "ठग सरकारी दिखने वाली तस्वीरों पर भरोसा करते हैं: सुप्रीम कोर्ट या CBI के निशान वाले वारंट, FIR की कॉपी, ED का समन, \"RBI\" का पत्र और पुलिस ID कार्ड, जो WhatsApp पर भेजे जाते हैं या कैमरे पर दिखाए जाते हैं। ये आम एडिटिंग ऐप या AI से बनाए जाते हैं और अक्सर असली लोगो और असली अधिकारियों के नाम इस्तेमाल करते हैं।"
        ],
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/digital-arrest-kya-hai/fictional-example.png",
          "alt": "काल्पनिक WhatsApp संदेश जिसमें नकली गिरफ़्तारी वारंट, वीडियो कॉल पर रहने का आदेश, परिवार से छिपाने की बात और पैसे भेजने की माँग पर नंबर लगे हैं।",
          "width": 1200,
          "height": 760,
          "caption": "चित्र 1. डिजिटल अरेस्ट ठगी में भेजे जाने वाले संदेशों का एक काल्पनिक उदाहरण। हर हिस्सा एक चेतावनी है।"
        },
        "checklist": [
          "WhatsApp पर भेजा गया वारंट या समन, जो हाथ से नहीं दिया गया।",
          "बात छिपाने या कैमरे के सामने बैठे रहने का आदेश।",
          "पैसे ट्रांसफ़र करने, गिफ़्ट कार्ड या क्रिप्टो ख़रीदने या \"RBI वेरिफ़िकेशन\" की कोई भी बात।",
          "\"सरकारी\" काग़ज़ पर स्पेलिंग की ग़लतियाँ, अलग-अलग फ़ॉन्ट या खिंचा हुआ लोगो।",
          "कॉल करने वाले का नंबर आम मोबाइल नंबर हो, कई बार विदेशी कोड वाला।"
        ]
      },
      {
        "heading": "अगर आप या घर का कोई सदस्य अभी ऐसी कॉल पर है",
        "paragraphs": [
          "ठग कई बार लोगों को घंटों, यहाँ तक कि दिनों तक कॉल पर रखते हैं। अगर लगे कि घर का कोई सदस्य डिजिटल अरेस्ट में है, तो बीच में टोकें। अकेले रहने वाले बुज़ुर्ग और बचत वाले नौकरीपेशा लोग अक्सर निशाने पर होते हैं।"
        ],
        "checklist": [
          "कॉल काट दें। किसी भी वीडियो कॉल पर बने रहना क़ानूनन ज़रूरी नहीं है।",
          "कोई पैसा न भेजें, OTP न बताएँ और उनके कहने पर कोई ऐप इंस्टॉल न करें।",
          "तुरंत परिवार के किसी सदस्य या दोस्त को बताएँ; चुप रखवाना ही इस ठगी का हिस्सा है।",
          "साइबर हेल्पलाइन 1930 पर कॉल करें या cybercrime.gov.in पर शिकायत दर्ज करें, ख़ासकर अगर पैसा चला गया हो; जल्दी शिकायत से बैंक पैसा रोक सकते हैं।",
          "अगर लगता है कि कोई असली केस हो सकता है, तो अपने नज़दीकी थाने में ख़ुद जाएँ या 112 पर कॉल करें। कॉल करने वाले का दिया नंबर कभी इस्तेमाल न करें।"
        ]
      },
      {
        "heading": "अगर पैसे भेज दिए हैं",
        "paragraphs": [
          "तुरंत 1930 पर और अपने बैंक की आधिकारिक हेल्पलाइन पर ट्रांज़ैक्शन की जानकारी के साथ कॉल करें। जितनी जल्दी शिकायत होगी, पैसा आगे भेजे जाने से पहले रुकने की संभावना उतनी ज़्यादा होगी। कॉल लॉग, नंबर, वीडियो कॉल के स्क्रीनशॉट, भेजे गए काग़ज़ और हर ट्रांज़ैक्शन का रेफ़रेंस संभालकर रखें।",
          "इसके बाद दूसरी ठगी से सावधान रहें: ख़ुद को वकील, \"साइबर सेल अधिकारी\" या रिकवरी एजेंट बताने वाले लोग फ़ीस लेकर पैसा वापस दिलाने का वादा करते हैं। असली पुलिस पैसा वापस दिलाने के लिए कोई फ़ीस नहीं लेती।"
        ]
      },
      {
        "heading": "डिजिटल अरेस्ट की शिकायत कैसे करें: नंबर और ऑनलाइन तरीक़ा",
        "paragraphs": [
          "डिजिटल अरेस्ट की शिकायत का नंबर 1930 है, यानी राष्ट्रीय साइबर क्राइम हेल्पलाइन, और ऑनलाइन शिकायत <a href=\"https://cybercrime.gov.in/\">cybercrime.gov.in</a> (नेशनल साइबर क्राइम रिपोर्टिंग पोर्टल) पर होती है। सिर्फ़ डिजिटल अरेस्ट के लिए कोई अलग हेल्पलाइन नहीं है। 1930 सभी राज्यों और केंद्र शासित प्रदेशों में चलता है और ऐसे सिस्टम से जुड़ा है जो पुलिस को बैंकों, वॉलेट और पेमेंट कंपनियों से जोड़ता है, ताकि ठगा गया पैसा आगे जाने से पहले रोका जा सके (<a href=\"https://i4c.mha.gov.in/ncrp.aspx\">I4C, गृह मंत्रालय</a>)।",
          "पोर्टल पर देश में कहीं से भी शिकायत दर्ज हो सकती है और बाद में उसकी स्थिति ऑनलाइन देखी जा सकती है, इसलिए शिकायत का नंबर संभालकर रखें।"
        ],
        "checklist": [
          "पैसे भेज दिए हैं: पहले 1930 पर कॉल करें, फिर बैंक की आधिकारिक हेल्पलाइन पर। ट्रांज़ैक्शन का UTR, रक़म, तारीख़ और समय तैयार रखें।",
          "पैसा नहीं गया, पर कॉल करने वालों की शिकायत करनी है: cybercrime.gov.in पर नंबर, कॉल लॉग और स्क्रीनशॉट के साथ शिकायत दर्ज करें।",
          "अभी सिर्फ़ संदिग्ध कॉल, SMS या WhatsApp मैसेज आया है: नंबर को <a href=\"https://sancharsaathi.gov.in/sfc/\">संचार साथी पोर्टल की चक्षु सुविधा</a> पर रिपोर्ट करें। यह कॉल या मैसेज आने के 30 दिन के अंदर करें।",
          "आमने-सामने बात करनी है: यही सबूत लेकर नज़दीकी थाने या साइबर थाने जाएँ।",
          "इंटरनेट पर \"digital arrest helpline number\" खोजकर किसी विज्ञापन, कमेंट या फ़ॉरवर्ड मैसेज का नंबर न मिलाएँ। सिर्फ़ 1930 और ऊपर की दो सरकारी साइटें इस्तेमाल करें।"
        ]
      },
      {
        "heading": "भेजा गया काग़ज़ या स्क्रीनशॉट कैसे चेक करें",
        "paragraphs": [
          "ScreenshotChecker का <a href=\"/screenshot-scam-checker/\">स्क्रीनशॉट स्कैम चेकर</a> स्क्रीनशॉट या काग़ज़ की फ़ोटो में लिखा टेक्स्ट पढ़कर धमकी, जल्दबाज़ी और पैसे की माँग जैसे संकेत दिखाता है। ये टूल सिर्फ़ संकेत देते हैं, फ़ैसला नहीं। असली जवाब सीधा है: कोई भी असली एजेंसी वीडियो कॉल पर गिरफ़्तारी नहीं करती, इसलिए काग़ज़ कितना भी असली लगे, हर डिजिटल अरेस्ट ठगी ही है। अंग्रेज़ी में पूरी जानकारी के लिए <a href=\"/blog/digital-arrest-scam/\">digital arrest scam गाइड</a> देखें।"
        ]
      }
    ],
    "faq": [
      {
        "question": "क्या डिजिटल अरेस्ट सच में होता है?",
        "answer": "नहीं। भारतीय क़ानून में डिजिटल अरेस्ट जैसी कोई व्यवस्था नहीं है, और I4C ने कहा है कि पुलिस, CBI, ED, कस्टम और जज वीडियो कॉल पर गिरफ़्तारी नहीं करते। जो ऐसा कहे, वह ठग है।"
      },
      {
        "question": "कॉल आए कि मेरे नाम के पार्सल में ड्रग्स मिले हैं, तो क्या करूँ?",
        "answer": "कॉल काट दें। कूरियर कंपनी और पुलिस इस तरह काम नहीं करते। चिंता हो तो कूरियर की आधिकारिक वेबसाइट से संपर्क करें या नज़दीकी थाने में ख़ुद जाएँ।"
      },
      {
        "question": "क्या पुलिस या CBI WhatsApp पर वारंट भेज सकती है?",
        "answer": "कॉल के दौरान WhatsApp पर भेजा गया वारंट, जिसके साथ पैसे माँगे जाएँ, ठगी है। असली नोटिस सही तरीक़े से दिए जाते हैं और उनमें पैसे भेजने या बात छिपाने को नहीं कहा जाता।"
      },
      {
        "question": "डिजिटल अरेस्ट की शिकायत कहाँ करें?",
        "answer": "साइबर हेल्पलाइन 1930 पर कॉल करें या cybercrime.gov.in पर शिकायत दर्ज करें। संदिग्ध नंबर संचार साथी पोर्टल की चक्षु सुविधा पर भी रिपोर्ट कर सकते हैं।"
      },
      {
        "question": "डिजिटल अरेस्ट की शिकायत का नंबर क्या है?",
        "answer": "1930, राष्ट्रीय साइबर क्राइम हेल्पलाइन। यह हर राज्य और केंद्र शासित प्रदेश में चलता है और पैसे जा चुके हों तो सबसे तेज़ रास्ता यही है। सिर्फ़ डिजिटल अरेस्ट के लिए कोई अलग नंबर नहीं है, इसलिए इंटरनेट पर मिले किसी और हेल्पलाइन नंबर पर भरोसा न करें।"
      },
      {
        "question": "क्या डिजिटल अरेस्ट में गया पैसा वापस मिल सकता है?",
        "answer": "यह इस पर निर्भर करता है कि आप कितनी जल्दी शिकायत करते हैं। तुरंत 1930 पर कॉल करें ताकि बैंक पैसा रोकने की कोशिश कर सकें। फ़ीस लेकर पैसा वापस दिलाने वालों की बात न सुनें।"
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["loan-app-harassment-kya-kare", 
      "digital-arrest-scam",
      "fake-payment-screenshot-kaise-pehchane",
      "fake-challan-message-kaise-pehchane"
    ],
    "cta": {
      "label": "संदिग्ध संदेश चेक करें",
      "url": "/screenshot-scam-checker/",
      "description": "धमकी वाले संदेश या काग़ज़ का स्क्रीनशॉट डालें और देखें कि उसमें ठगी के कौन से संकेत हैं।"
    }
  },
  {
    "lang": "hi",
    "slug": "fake-challan-message-kaise-pehchane",
    "title": "फर्जी ई-चालान मैसेज कैसे पहचानें: लिंक या APK फ़ाइल आई है तो क्या करें",
    "seoTitle": "Fake e-Challan Message कैसे पहचानें? APK फ़ाइल से बचें",
    "metaDescription": "SMS या WhatsApp पर ट्रैफ़िक चालान का लिंक या APK फ़ाइल आई है? उसे न खोलें। फर्जी चालान ठगी कैसे होती है और Parivahan पर असली चालान कैसे चेक करें।",
    "category": "Security",
    "publishedAt": "2026-11-12",
    "authorName": "Virat Chauhan",
    "readTime": "5 min read",
    "excerpt": "फर्जी ट्रैफ़िक चालान मैसेज एक लिंक या APK फ़ाइल भेजते हैं जो OTP और बैंक की जानकारी चुरा लेती है। जानिए ये कैसे दिखते हैं, असली चालान आधिकारिक Parivahan पोर्टल पर कैसे चेक करें, और फ़ाइल इंस्टॉल हो गई हो तो क्या करें।",
    "targetKeywords": [
      "fake challan message kaise pehchane",
      "फर्जी ई-चालान मैसेज",
      "rto challan apk",
      "challan apk fraud",
      "e challan kaise check kare",
      "traffic challan scam hindi"
    ],
    "keyTakeaway": {
      "title": "चालान सिर्फ़ आधिकारिक पोर्टल पर चेक करें",
      "text": "SMS या WhatsApp पर आए चालान के लिंक पर कभी टैप न करें और कोई APK फ़ाइल इंस्टॉल न करें। ब्राउज़र में ख़ुद echallan.parivahan.gov.in लिखें, या Play Store/App Store से आधिकारिक ऐप लें, और वहाँ अपना गाड़ी या चालान नंबर डालें।"
    },
    "introduction": "\"आपकी गाड़ी पर ₹500 का ट्रैफ़िक चालान बाकी है। कोर्ट की कार्रवाई से बचने के लिए आज ही भरें।\" ऐसा मैसेज SMS या WhatsApp पर आता है, साथ में एक लिंक या RTO Challan.apk जैसी फ़ाइल। असली ई-चालान भी आते हैं, इसीलिए यह ठगी इतनी आसानी से काम करती है। लेकिन नकली मैसेज आपके फ़ोन में मैलवेयर डालने या कार्ड की जानकारी चुराने के लिए बनाए जाते हैं। यह गाइड बताती है कि असली और नकली में फ़र्क कैसे करें।",
    "contentSections": [
      {
        "heading": "फर्जी ई-चालान ठगी कैसे होती है",
        "paragraphs": [
          "मैसेज असली चालान जैसा दिखता है: आपकी गाड़ी का नंबर (कई बार अंदाज़े से या लीक हुए डेटा से), रकम, आख़िरी तारीख़ और लाइसेंस रद्द होने या कोर्ट जाने की धमकी। फिर वह आपको दो में से किसी एक जाल में ले जाता है।"
        ],
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/fake-challan-message-kaise-pehchane/fictional-example.png",
          "alt": "ट्रैफ़िक चालान का काल्पनिक WhatsApp मैसेज जिसमें आज की आख़िरी तारीख़, APK फ़ाइल, नकली पेमेंट लिंक और कोर्ट की धमकी पर नंबर लगे हैं।",
          "width": 1200,
          "height": 760,
          "caption": "चित्र 1. फर्जी ई-चालान मैसेज का एक काल्पनिक उदाहरण। APK फ़ाइल और मिलता-जुलता लिंक सबसे ख़तरनाक हिस्से हैं।"
        },
        "checklist": [
          "APK फ़ाइल: एक Android ऐप जो इंस्टॉल होते ही आपके SMS (बैंक के OTP समेत) पढ़ सकता है, बैंकिंग ऐप के ऊपर नकली स्क्रीन दिखा सकता है और आपके कॉन्टैक्ट्स को ख़ुद भेज सकता है।",
          "नकली वेबसाइट: Parivahan जैसी दिखने वाली साइट जो जुर्माना भरने के नाम पर कार्ड, UPI PIN या नेट बैंकिंग लॉगिन माँगती है।"
        ]
      },
      {
        "heading": "सरकार ने क्या चेतावनी दी है",
        "paragraphs": [
          "PIB फ़ैक्ट चेक ने चेतावनी दी है कि SMS और WhatsApp पर आने वाले फर्जी ई-चालान मैसेज में लिंक, APK फ़ाइल और RTO नोटिस जैसी दिखने वाली PDF होती हैं, जो OTP और बैंक की जानकारी चुरा सकती हैं, और चालान सिर्फ़ आधिकारिक Parivahan पोर्टल पर चेक करने की सलाह दी है (<a href=\"https://www.outlookmoney.com/news/fake-traffic-e-challan-messages-can-expose-otps-trigger-unauthorised-bank-transactions-pib-warns\">Outlook Money</a>)। केरल और दिल्ली समेत कई राज्यों की पुलिस ने भी चालान मैसेज में आने वाली APK फ़ाइलों के बारे में ऐसी ही चेतावनी दी है।"
        ],
        "callout": {
          "type": "golden-rule",
          "text": "सरकारी विभाग WhatsApp या SMS पर APK फ़ाइल के रूप में ऐप नहीं भेजते। जिस भी चालान मैसेज में APK फ़ाइल हो, वह ठगी है।"
        }
      },
      {
        "heading": "असली चालान कैसे चेक करें",
        "paragraphs": [
          "अगर लगता है कि सच में चालान कटा हो सकता है, तो मैसेज की किसी चीज़ का इस्तेमाल किए बिना ख़ुद चेक करें।"
        ],
        "checklist": [
          "ब्राउज़र के एड्रेस बार में ख़ुद echallan.parivahan.gov.in लिखें।",
          "चालान स्टेटस चेक करने का विकल्प चुनें और गाड़ी नंबर, चालान नंबर या ड्राइविंग लाइसेंस नंबर डालें।",
          "भुगतान सिर्फ़ इसी आधिकारिक पोर्टल या अपने राज्य की ट्रैफ़िक पुलिस की आधिकारिक साइट पर करें, किसी मैसेज के लिंक से कभी नहीं।",
          "या Google Play Store या Apple App Store से आधिकारिक mParivahan या अपने राज्य की ट्रैफ़िक पुलिस का ऐप इस्तेमाल करें।",
          "पोर्टल पर कोई चालान नहीं दिखा? तो मैसेज फर्जी था, उसमें कुछ भी लिखा हो।"
        ]
      },
      {
        "heading": "अगर लिंक खोल लिया या APK इंस्टॉल कर ली",
        "paragraphs": [
          "जल्दी करें। ऐप को इंटरनेट से काटने के लिए एयरप्लेन मोड चालू करें, फिर Settings में Apps में जाकर अनजान ऐप अनइंस्टॉल करें (अगर वह डिवाइस एडमिन की अनुमति माँग रहा हो तो पहले वह हटाएँ)। अगर कार्ड या बैंक की जानकारी डाली थी, तो बैंक के आधिकारिक नंबर पर कॉल करके कार्ड और UPI बंद करवाएँ, और किसी दूसरे सुरक्षित फ़ोन से बैंकिंग पासवर्ड बदलें।",
          "पैसा कटा हो तो 1930 पर या cybercrime.gov.in पर शिकायत करें, और मैसेज को स्पैम के रूप में रिपोर्ट करें। मैसेज का स्क्रीनशॉट, फ़ाइल का नाम और भेजने वाले का नंबर संभालकर रखें। अंग्रेज़ी में पूरी जानकारी के लिए <a href=\"/blog/e-challan-sms-scam/\">e-challan scam गाइड</a> देखें।"
        ]
      }
    ],
    "faq": [
      {
        "question": "कैसे पता करें कि ई-चालान मैसेज असली है?",
        "answer": "लिंक को छोड़ दें और ब्राउज़र में ख़ुद echallan.parivahan.gov.in लिखकर गाड़ी नंबर डालें। अगर वहाँ चालान नहीं दिखता, तो मैसेज फर्जी है।"
      },
      {
        "question": "क्या RTO Challan APK इंस्टॉल करना सुरक्षित है?",
        "answer": "नहीं। सरकारी विभाग SMS या WhatsApp पर APK फ़ाइल नहीं भेजते। ये फ़ाइलें मैलवेयर होती हैं जो आपके OTP पढ़कर बैंकिंग ऐप पर कब्ज़ा कर सकती हैं।"
      },
      {
        "question": "चालान वाली APK इंस्टॉल हो गई, अब क्या करूँ?",
        "answer": "एयरप्लेन मोड चालू करें, ऐप अनइंस्टॉल करें, बैंक को कॉल करके कार्ड और UPI बंद करवाएँ, दूसरे फ़ोन से बैंकिंग पासवर्ड बदलें और 1930 या cybercrime.gov.in पर शिकायत करें।"
      },
      {
        "question": "क्या WhatsApp लिंक से चालान भर सकते हैं?",
        "answer": "नहीं। चालान सिर्फ़ आधिकारिक Parivahan ई-चालान पोर्टल या अपने राज्य की ट्रैफ़िक पुलिस की आधिकारिक साइट या ऐप पर भरें।"
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": [
      "e-challan-sms-scam",
      "digital-arrest-kya-hai",
      "fake-payment-screenshot-kaise-pehchane"
    ],
    "cta": {
      "label": "संदिग्ध लिंक चेक करें",
      "url": "/suspicious-link-checker/",
      "description": "मैसेज में आए लिंक को खोले बिना उसके ख़तरे के संकेत देखें।"
    }
  },
  {
    "slug": "fake-receipt-ai-generated",
    "title": "How to Spot a Fake Receipt, Including AI-Generated Receipts",
    "seoTitle": "Fake Receipt? How to Spot AI-Generated and Edited Receipts",
    "metaDescription": "AI can now make realistic receipts in seconds. How to check a receipt: the merchant, totals, tax, card digits and photo clues, and the checks that settle it.",
    "category": "AI & Forensics",
    "publishedAt": "2026-11-12",
    "updatedAt": "2026-11-17",
    "authorName": "Virat Chauhan",
    "readTime": "7 min read",
    "excerpt": "Fake receipts used to need an editing app or a template site; now an AI image tool makes one from a sentence. A practical checklist for expense reviewers, small businesses and anyone handed a receipt as proof.",
    "targetKeywords": [
      "fake receipt",
      "how to spot a fake receipt",
      "ai generated receipt",
      "fake receipt detector",
      "ai receipt fraud",
      "how to tell if a receipt is fake"
    ],
    "keyTakeaway": {
      "title": "Check the transaction, not the picture",
      "text": "A receipt image, however realistic, is only a claim. Confirm the purchase another way: the card statement line, the merchant's own records, the booking or order confirmation, or the payment in your own account. Visual checks help you decide which receipts deserve that closer look."
    },
    "introduction": "To spot a fake receipt, check that the shop really exists, re-add the items, tax and total (the free <a href=\"/fake-receipt-checker/\">fake receipt checker</a> does the maths for you), make sure the date, time and card digits fit together, and ask for the matching card or bank statement line: a fake never appears in a real payment record. Receipts are proof in everyday life: for expense claims, warranty returns, rent and deposits, marketplace sales and insurance. They have always been forged, but generative AI has made it fast and cheap. Expense software company AppZen reported that AI-generated receipts made up about 14% of the fraudulent documents it flagged in September 2025, up from none a year earlier, according to <a href=\"https://www.techradar.com/pro/security/workers-are-scamming-their-employers-using-ai-generated-fake-expense-receipts\">TechRadar</a>. This guide explains what to look for and, more importantly, how to confirm a receipt is real.",
    "contentSections": [
      {
        "heading": "Where fake receipts show up",
        "paragraphs": [
          "Most fake receipts fall into a few patterns. Knowing which one you are dealing with tells you what to check."
        ],
        "checklist": [
          "Expense claims: meals, taxis, hotels or supplies that never happened, or real purchases with inflated amounts.",
          "Proof of payment: a \"receipt\" or invoice shown to a seller, landlord or freelancer instead of real money. Our <a href=\"/blog/fake-upi-payment-screenshot/\">UPI</a> and <a href=\"/blog/fake-bank-transfer-screenshot/\">bank transfer</a> guides cover these.",
          "Returns and warranty claims: a receipt for an item bought elsewhere, second-hand or not at all.",
          "Marketplace and resale: \"original receipts\" offered to make a used or counterfeit item look genuine."
        ]
      },
      {
        "heading": "What to check on the receipt itself",
        "paragraphs": [
          "A forged receipt has to get many small details right at once. Go through them one by one; a single error is often enough to justify asking for proof."
        ],
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/fake-receipt-ai-generated/fictional-example.png",
          "alt": "Fictional restaurant receipt with numbered checks: a merchant that cannot be found, items that don't add up to the total, a tax rate that doesn't match, a card number with too many digits and a time when the shop was closed.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional receipt with typical errors. Each one is a reason to check the transaction another way."
        },
        "checklist": [
          "Merchant: does the business exist at that address? Check the name, address and phone number against its website or map listing.",
          "Arithmetic: do the item prices add up to the subtotal, and do tax, tip and total follow correctly?",
          "Tax: is the rate right for that place and item? A GST, VAT or sales tax rate that doesn't match is a common slip.",
          "Date and time: was the shop open then? Was the person actually in that city?",
          "Payment line: card type and last four digits that match the card used; a transaction or authorisation number in the usual format.",
          "Formatting: consistent fonts, alignment and spacing; real thermal receipts have a fixed-width print style.",
          "Repeats: the same receipt number, amount or layout appearing in several claims."
        ]
      },
      {
        "heading": "Clues that a receipt image was generated or edited",
        "paragraphs": [
          "AI image tools can now render readable text, so obvious gibberish is less common than it was. Still, generated and edited receipts often show signs worth noticing, especially when you compare them with real receipts from the same merchant."
        ],
        "checklist": [
          "A receipt photo that looks too perfect, or creased and lit in a way that looks staged rather than accidental.",
          "Logos that are slightly wrong, blurry or a different style from the merchant's real receipts.",
          "Text that changes size or sharpness within a line, or numbers that look pasted in.",
          "Missing details real receipts carry, such as a GST or tax number, store number, terminal ID or return policy.",
          "File clues: an editor or AI tool named in the metadata, or Content Credentials that say the image was generated. Their absence proves nothing."
        ],
        "callout": {
          "type": "info",
          "text": "The <a href=\"/screenshot-metadata-checker/\">metadata checker</a>, <a href=\"/ai-image-detector/\">fake image detector</a> and <a href=\"/image-manipulation-checker/\">photo manipulation checker</a> show these clues in your browser. They can flag a receipt for review; they cannot prove one is genuine."
        }
      },
      {
        "heading": "The checks that settle it",
        "paragraphs": [
          "A real purchase leaves traces outside the receipt. These checks are more reliable than any visual inspection."
        ],
        "checklist": [
          "Ask for the card or bank statement line showing the same merchant, date and amount.",
          "For hotels, flights and rides, ask for the booking confirmation from the provider's app or email, or check with the provider.",
          "For returns, look the transaction up in your own point-of-sale system by receipt number, date or card.",
          "For payments to you, check your own bank or payment app for the money. A receipt is never a substitute.",
          "For high-value claims, contact the merchant directly using contact details you find yourself."
        ]
      },
      {
        "heading": "For businesses: lowering the risk",
        "paragraphs": [
          "Expense fraud is easier to stop with process than with detection. Paying through company cards or direct billing means there is a transaction record for every claim. Requiring itemised receipts and card statement matching for claims above a set amount removes most of the incentive to fake one.",
          "Spot checks also deter. Reviewing a random sample of claims, and every claim with round numbers, duplicate amounts or merchants that cannot be found, catches more than inspecting every image closely. If you suspect deliberate fraud, follow your HR and legal process rather than confronting someone with a detector score."
        ]
      }
    ],
    "faq": [
      {
        "question": "How can you tell if a receipt is fake?",
        "answer": "Check that the merchant exists, the items add up, the tax rate and date make sense and the card details match. Then confirm the purchase another way, such as the card statement or the merchant's own records."
      },
      {
        "question": "Can AI make fake receipts?",
        "answer": "Yes. Current image generators can produce realistic receipts with readable text from a short prompt, and expense software companies have reported a sharp rise in AI-generated receipts among the fakes they catch."
      },
      {
        "question": "Is there a fake receipt detector?",
        "answer": "Tools can flag clues such as editing traces, metadata and Content Credentials, and expense platforms use their own checks. None can prove a receipt is genuine, so pair any tool with a check of the actual transaction."
      },
      {
        "question": "Is a receipt proof of payment?",
        "answer": "Not on its own. A receipt or screenshot is a claim. Payment is proven when the money appears in the receiving account or the transaction appears on the payer's statement."
      },
      {
        "question": "What should I do if an employee submits a fake receipt?",
        "answer": "Keep the claim and the evidence, ask for supporting records such as the card statement, and follow your company's HR and legal process. Avoid accusing someone based only on how an image looks."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["fake-receipt-kaise-pehchane", 
      "ai-generated-screenshot",
      "how-to-tell-if-a-photo-is-edited",
      "fake-bank-transfer-screenshot"
    ],
    "cta": {
      "label": "Check an image for edits",
      "url": "/image-manipulation-checker/",
      "description": "Look for editing traces in a receipt photo or screenshot, processed in your browser."
    }
  },
  {
    "slug": "qr-code-scam",
    "title": "QR Code Scams: \"Scan to Receive Money\", Fake Shop QR Stickers and Parking Codes",
    "seoTitle": "QR Code Scam: Scan to Receive Money? It's a Trap",
    "metaDescription": "Asked to scan a QR code to receive money, a refund or a prize? Scanning only ever pays. How QR code scams work in India and the US, and how to stay safe.",
    "category": "Security",
    "publishedAt": "2026-11-12",
    "authorName": "Virat Chauhan",
    "readTime": "6 min read",
    "excerpt": "The \"scan this QR to receive payment\" trick used on OLX and marketplace sellers, fake QR stickers pasted over a shop's real code, and fake parking-meter codes that lead to phishing sites, with the one rule that stops most of them.",
    "targetKeywords": [
      "qr code scam",
      "scan qr code to receive money",
      "upi qr code fraud",
      "fake qr code sticker",
      "parking meter qr code scam",
      "quishing"
    ],
    "keyTakeaway": {
      "title": "Scanning a QR code never brings money in",
      "text": "With UPI, scanning a QR code and entering your PIN only ever sends money out of your account. NPCI says plainly that a PIN is not needed to receive money. Anyone asking you to scan, approve or enter a PIN to receive a payment, refund or prize is stealing from you."
    },
    "introduction": "QR codes are everywhere: shop counters, restaurant tables, parking meters, parcels and messages. That convenience is exactly what scammers exploit. A QR code is just a link or a payment request you can't read with your eyes, so you have to trust where it came from. This guide covers the three most common QR code scams and how to avoid each one.",
    "contentSections": [
      {
        "heading": "Scam 1: \"Scan this QR code to receive your payment\"",
        "paragraphs": [
          "You are selling something online, perhaps a sofa on OLX or a phone on Facebook Marketplace. A buyer agrees to your price without bargaining and says they will pay right away, but first you must scan a QR code they send \"to receive the money\". When you scan it, your UPI app shows a payment screen with an amount. You enter your PIN and the money leaves your account.",
          "Variations include a fake \"refund\" from customer care, a \"cashback\" or prize, or an army officer or company that \"can only pay by QR\". Some send a screenshot of a successful payment first to build trust; see our guide to <a href=\"/blog/fake-upi-payment-screenshot/\">fake UPI payment screenshots</a>."
        ],
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/qr-code-scam/fictional-example.png",
          "alt": "Fictional chat with a marketplace buyer who sends a QR code to receive payment, numbered: no bargaining, the QR code, a request to enter the UPI PIN and a pay screen showing money leaving.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional scan-to-receive scam. The app's own screen says Pay, because scanning a QR code sends money."
        },
        "callout": {
          "type": "golden-rule",
          "text": "NPCI's UPI safety advice: the UPI PIN is only for sending money and is never needed to receive it, and scanning a QR code is only for making a payment (<a href=\"https://npci.org.in/what-we-do/upi/upi-safety-shield\">NPCI UPI Safety Shield</a>)."
        }
      },
      {
        "heading": "Scam 2: fake QR stickers on a shop's counter",
        "paragraphs": [
          "Some fraudsters paste their own QR code sticker over a shop's real one, at a counter, a fuel station or a donation box. Customers pay as usual, but the money goes to the fraudster, and the shop owner only notices when payments stop arriving.",
          "For customers, the check is simple: after scanning, look at the name your UPI app shows before you enter your PIN. It should match the shop. For shop owners, check your QR stand regularly, use the sound box or payment alerts from your bank or app, and confirm each payment in your own app rather than looking at the customer's screen."
        ]
      },
      {
        "heading": "Scam 3: QR codes that lead to fake websites",
        "paragraphs": [
          "Not every QR code is a payment. Many simply open a website, and scammers use them to send people to phishing pages, sometimes called quishing. The US Federal Trade Commission has <a href=\"https://consumer.ftc.gov/consumer-alerts/2023/12/scammers-hide-harmful-links-qr-codes-steal-your-information\">warned</a> about scammers covering the QR codes on parking meters with their own, and sending QR codes in emails and texts that claim there is a problem with a delivery or an account.",
          "These pages copy a real parking app, bank or courier and ask for card details or a login. Some try to install a malicious app."
        ],
        "checklist": [
          "Before opening, read the web address your camera shows. Misspellings, extra words or an unfamiliar domain are warning signs.",
          "On a parking meter or poster, check whether the QR code is a sticker stuck over something. When in doubt, use the official app or pay at the machine.",
          "Don't scan QR codes in unexpected emails, texts or letters. Go to the company's website or app yourself.",
          "Never install an app from a QR code on a poster, parcel or message unless you trust the source."
        ]
      },
      {
        "heading": "How to scan any QR code safely",
        "paragraphs": [],
        "checklist": [
          "Know which direction the money goes: scanning pays; to receive money you share your own QR code or UPI ID, nothing more.",
          "Check the name or website shown after scanning, before you pay or log in.",
          "Never enter a UPI PIN, card PIN or OTP because someone told you to on a call or chat.",
          "Ignore deals that are too generous, like buyers who don't bargain and \"refunds\" you didn't ask for.",
          "Can't read a QR code from a screenshot without scanning it? Paste the link into the <a href=\"/suspicious-link-checker/\">suspicious link checker</a> instead of opening it."
        ]
      },
      {
        "heading": "If you scanned and lost money",
        "paragraphs": [
          "In India, call the cybercrime helpline 1930 or report at cybercrime.gov.in straight away, and inform your bank or UPI app through its official help section. Quick reports let banks try to hold the money. Keep the chat, the QR code image, the buyer's profile and the transaction reference.",
          "In the US, contact your bank or card issuer, then report the scam at ReportFraud.ftc.gov. If you entered a password on a fake site, change it and turn on two-step verification."
        ]
      }
    ],
    "faq": [
      {
        "question": "Can I receive money by scanning a QR code?",
        "answer": "No. With UPI, scanning a QR code and entering your PIN always sends money from your account. To receive money, you only share your own QR code or UPI ID."
      },
      {
        "question": "Do I need to enter my UPI PIN to receive money?",
        "answer": "Never. NPCI says the UPI PIN is only for sending money. Anyone asking for your PIN to receive a payment, refund or prize is a scammer."
      },
      {
        "question": "How do I know if a shop's QR code is fake?",
        "answer": "After scanning, check that the name your UPI app shows matches the shop before you enter your PIN. If the name is different or the sticker looks pasted over another one, ask the shopkeeper."
      },
      {
        "question": "What is quishing?",
        "answer": "Quishing is phishing through QR codes: a code on a poster, parking meter, email or parcel that opens a fake website to steal card details or logins, or to install a harmful app."
      },
      {
        "question": "What should I do if I scanned a scam QR code?",
        "answer": "If money left your account, call 1930 or report at cybercrime.gov.in in India, or contact your bank and ReportFraud.ftc.gov in the US. If you entered a password, change it right away."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["fake-amazon-flipkart-refund-scam", "fake-customer-care-number-scam", "qr-code-fraud-se-kaise-bache", 
      "fake-upi-payment-screenshot",
      "payment-failed-screenshot-scam",
      "suspicious-link-checker-online"
    ],
    "cta": {
      "label": "Check a suspicious link",
      "url": "/suspicious-link-checker/",
      "description": "See warning signs in a link, including one from a QR code, without opening it."
    }
  },
  {
    "lang": "hi",
    "slug": "qr-code-fraud-se-kaise-bache",
    "title": "QR कोड फ्रॉड से कैसे बचें: पैसे लेने के लिए QR स्कैन करना पड़े तो समझिए धोखा है",
    "seoTitle": "QR Code Fraud से कैसे बचें? पैसा लेने के लिए स्कैन नहीं",
    "metaDescription": "पैसा, रिफ़ंड या इनाम लेने के लिए QR कोड स्कैन करने को कहा गया है? स्कैन करने से पैसा सिर्फ़ जाता है। QR कोड ठगी कैसे होती है और कैसे बचें।",
    "category": "Security",
    "publishedAt": "2026-11-12",
    "authorName": "Virat Chauhan",
    "readTime": "5 min read",
    "excerpt": "OLX और मार्केटप्लेस पर बेचने वालों के साथ होने वाली \"पैसा लेने के लिए QR स्कैन करें\" वाली ठगी, दुकान के असली QR पर चिपकाए गए नकली स्टिकर, और वह एक नियम जो ज़्यादातर QR ठगी रोक देता है।",
    "targetKeywords": [
      "qr code fraud se kaise bache",
      "QR कोड फ्रॉड",
      "qr code scan karke paise",
      "upi qr code scam hindi",
      "olx qr code fraud",
      "नकली QR कोड"
    ],
    "keyTakeaway": {
      "title": "QR स्कैन करने से पैसा कभी आता नहीं, सिर्फ़ जाता है",
      "text": "UPI में QR कोड स्कैन करके PIN डालने से पैसा हमेशा आपके खाते से जाता है। NPCI साफ़ कहता है कि पैसा लेने के लिए PIN की ज़रूरत नहीं होती। जो भी पैसा, रिफ़ंड या इनाम देने के नाम पर स्कैन करवाए या PIN डलवाए, वह ठग है।"
    },
    "introduction": "आप OLX या Facebook Marketplace पर पुराना सोफ़ा बेच रहे हैं। एक खरीदार बिना मोलभाव किए आपकी क़ीमत मान लेता है और कहता है, \"मैं अभी पेमेंट करता हूँ, बस यह QR कोड स्कैन कीजिए ताकि पैसा आपके खाते में आ जाए।\" स्कैन करते ही UPI ऐप में रकम के साथ पेमेंट स्क्रीन खुलती है। PIN डालते ही पैसा आपके खाते से चला जाता है। यह गाइड बताती है कि QR कोड ठगी कैसे होती है और इससे कैसे बचें।",
    "contentSections": [
      {
        "heading": "\"पैसा लेने के लिए QR स्कैन करें\" वाली ठगी",
        "paragraphs": [
          "यह ठगी कई रूपों में आती है: बेचने वाले को खरीदार का QR, कस्टमर केयर के नाम पर \"रिफ़ंड\" का QR, कैशबैक या लॉटरी का QR, या फ़ौजी अफ़सर बनकर \"सिर्फ़ QR से ही पेमेंट हो सकता है\" कहने वाला। भरोसा जमाने के लिए कई बार पहले से एक नकली पेमेंट का स्क्रीनशॉट भी भेजा जाता है; देखें <a href=\"/blog/fake-payment-screenshot-kaise-pehchane/\">फर्जी पेमेंट स्क्रीनशॉट कैसे पहचानें</a>।"
        ],
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/qr-code-fraud-se-kaise-bache/fictional-example.png",
          "alt": "मार्केटप्लेस खरीदार के साथ काल्पनिक चैट जिसमें पैसा लेने के लिए QR कोड भेजा गया है, उस पर नंबर लगे हैं: बिना मोलभाव, QR कोड, UPI PIN की माँग और पैसा जाने वाली Pay स्क्रीन।",
          "width": 1200,
          "height": 760,
          "caption": "चित्र 1. स्कैन करके पैसा लेने वाली ठगी का काल्पनिक उदाहरण। ऐप ख़ुद Pay लिखता है, क्योंकि QR स्कैन करने से पैसा जाता है।"
        },
        "callout": {
          "type": "golden-rule",
          "text": "NPCI की UPI सुरक्षा सलाह: UPI PIN सिर्फ़ पैसा भेजने के लिए है, पैसा लेने के लिए कभी नहीं, और QR कोड स्कैन करना सिर्फ़ पेमेंट करने के लिए होता है (<a href=\"https://npci.org.in/what-we-do/upi/upi-safety-shield\">NPCI UPI Safety Shield</a>)।"
        }
      },
      {
        "heading": "दुकान के QR पर नकली स्टिकर",
        "paragraphs": [
          "कुछ ठग दुकान, पेट्रोल पंप या दान पेटी के असली QR कोड के ऊपर अपना QR स्टिकर चिपका देते हैं। ग्राहक हमेशा की तरह पेमेंट करते हैं, लेकिन पैसा ठग के खाते में जाता है, और दुकानदार को तब पता चलता है जब पेमेंट आने बंद हो जाते हैं।",
          "ग्राहक के लिए जाँच आसान है: स्कैन करने के बाद PIN डालने से पहले देखें कि UPI ऐप में कौन सा नाम दिख रहा है। वह दुकान का नाम होना चाहिए। दुकानदार अपना QR स्टैंड रोज़ देखें, साउंड बॉक्स या बैंक के पेमेंट अलर्ट इस्तेमाल करें, और हर पेमेंट ग्राहक की स्क्रीन पर नहीं, अपने ऐप में देखें।"
        ]
      },
      {
        "heading": "QR कोड सुरक्षित तरीके से कैसे स्कैन करें",
        "paragraphs": [],
        "checklist": [
          "याद रखें पैसा किस तरफ़ जाता है: स्कैन करने से पेमेंट होता है; पैसा लेने के लिए सिर्फ़ अपना QR कोड या UPI ID दें।",
          "स्कैन करने के बाद पेमेंट या लॉगिन से पहले दिखने वाला नाम या वेबसाइट देखें।",
          "कॉल या चैट पर किसी के कहने पर UPI PIN, कार्ड PIN या OTP कभी न डालें।",
          "बहुत अच्छे सौदों से सावधान रहें, जैसे बिना मोलभाव वाला खरीदार या बिना माँगे रिफ़ंड।",
          "पोस्टर, पार्सल या मैसेज पर लगे QR से कोई ऐप इंस्टॉल न करें।"
        ]
      },
      {
        "heading": "अगर स्कैन करके पैसा चला गया",
        "paragraphs": [
          "तुरंत साइबर हेल्पलाइन 1930 पर कॉल करें या cybercrime.gov.in पर शिकायत करें, और अपने बैंक या UPI ऐप के आधिकारिक हेल्प सेक्शन में बताएँ। जल्दी शिकायत से बैंक पैसा रोकने की कोशिश कर सकते हैं। चैट, QR कोड की तस्वीर, खरीदार की प्रोफ़ाइल और ट्रांज़ैक्शन रेफ़रेंस संभालकर रखें। अंग्रेज़ी में पूरी जानकारी, पार्किंग मीटर वाले नकली QR समेत, <a href=\"/blog/qr-code-scam/\">QR code scam गाइड</a> में है।"
        ]
      }
    ],
    "faq": [
      {
        "question": "क्या QR कोड स्कैन करके पैसा मिल सकता है?",
        "answer": "नहीं। UPI में QR कोड स्कैन करके PIN डालने से पैसा हमेशा आपके खाते से जाता है। पैसा लेने के लिए सिर्फ़ अपना QR कोड या UPI ID देना होता है।"
      },
      {
        "question": "क्या पैसा लेने के लिए UPI PIN डालना पड़ता है?",
        "answer": "कभी नहीं। NPCI के अनुसार UPI PIN सिर्फ़ पैसा भेजने के लिए है। जो पैसा, रिफ़ंड या इनाम देने के लिए PIN माँगे, वह ठग है।"
      },
      {
        "question": "दुकान का QR कोड नकली है, कैसे पता करें?",
        "answer": "स्कैन करने के बाद PIN डालने से पहले देखें कि UPI ऐप में दुकान का ही नाम दिख रहा है। नाम अलग हो या स्टिकर किसी दूसरे QR पर चिपका लगे, तो दुकानदार से पूछें।"
      },
      {
        "question": "QR स्कैन करके पैसा चला गया, अब क्या करूँ?",
        "answer": "तुरंत 1930 पर कॉल करें या cybercrime.gov.in पर शिकायत करें, और बैंक को बताएँ। चैट, QR की तस्वीर और ट्रांज़ैक्शन रेफ़रेंस संभालकर रखें।"
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["amazon-flipkart-refund-fraud-se-bache", 
      "qr-code-scam",
      "fake-payment-screenshot-kaise-pehchane",
      "digital-arrest-kya-hai"
    ],
    "cta": {
      "label": "पेमेंट स्क्रीनशॉट चेक करें",
      "url": "/payment-screenshot-checker/hindi/",
      "description": "UPI पेमेंट स्क्रीनशॉट में ठगी के संकेत देखें, फिर अपने बैंक ऐप में पैसा ज़रूर चेक करें।"
    }
  },
  {
    "slug": "trai-sim-block-call-scam",
    "title": "\"Your SIM Will Be Blocked in 2 Hours\": The Fake TRAI Call Scam",
    "seoTitle": "Fake TRAI Call: Your SIM Will Be Blocked? It's a Scam",
    "metaDescription": "Got a call saying TRAI will block your SIM or your number is linked to a crime? TRAI does not disconnect numbers. How the scam works and what to do.",
    "category": "Security",
    "publishedAt": "2026-11-12",
    "authorName": "Virat Chauhan",
    "readTime": "5 min read",
    "excerpt": "Recorded calls and messages claiming to be from TRAI or the Department of Telecommunications say your SIM will be blocked or your number was used in a crime. Here is what TRAI actually says, how the call turns into a digital arrest or payment scam, and how to report it.",
    "targetKeywords": [
      "trai call scam",
      "sim will be blocked call",
      "fake trai call",
      "mobile number will be disconnected call",
      "dot call scam",
      "press 9 call scam"
    ],
    "keyTakeaway": {
      "title": "TRAI does not call to disconnect your number",
      "text": "TRAI has said it never contacts customers about disconnecting a mobile number and has not authorised anyone to do so. Disconnections for billing or KYC are handled by your own telecom operator. Hang up, never press a key to \"talk to an officer\", and report the number on Chakshu."
    },
    "introduction": "\"This call is from TRAI. Your mobile number will be blocked in two hours because it was used for illegal activity. Press 9 to speak to an officer.\" Millions of people in India have received calls like this, sometimes a recorded voice, sometimes a live caller with an official-sounding name. The call is the first step of a larger scam. This guide explains what really happens and what to do.",
    "contentSections": [
      {
        "heading": "How the fake TRAI call works",
        "paragraphs": [
          "The call creates fear and urgency, then hands you to someone who asks for money or personal details. Common versions include:"
        ],
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/trai-sim-block-call-scam/fictional-example.png",
          "alt": "Fictional call screen and message claiming TRAI will block the SIM, numbered: an unknown or foreign number, a two-hour deadline, press 9 for an officer and a link to re-verify.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional fake TRAI call and follow-up message. Each element is a warning sign."
        },
        "checklist": [
          "Your SIM or number will be blocked within hours unless you \"re-verify\" or press a key.",
          "A SIM in your name, bought with your Aadhaar, was used for crime, fraud or harassment in another city.",
          "You are transferred to a \"police\" or \"cyber cell\" officer, often on a WhatsApp video call: the start of a <a href=\"/blog/digital-arrest-scam/\">digital arrest scam</a>.",
          "You are asked to share an OTP, Aadhaar details or bank information, install an app, or pay a fee to keep your number."
        ]
      },
      {
        "heading": "What TRAI and the government say",
        "paragraphs": [
          "TRAI has repeatedly warned the public that it does not send messages or make calls about disconnecting mobile numbers, that it has not authorised any third party to do so, and that any communication threatening disconnection should be treated as a possible fraud (<a href=\"https://trai.gov.in/sites/default/files/2025-04/PR_No.22of2025.pdf\">TRAI press release, April 2025</a>). Disconnections for billing, KYC or misuse are carried out by your telecom operator, not by TRAI.",
          "The Department of Telecommunications runs the Sanchar Saathi portal, where the Chakshu facility lets you report suspected fraud calls, SMS and WhatsApp messages. You can also check which mobile connections are registered in your name and report ones you don't recognise."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "If a call says your number will be blocked, hang up. Check directly with your telecom operator through its official app or customer care number printed on its website, if you are worried."
        }
      },
      {
        "heading": "What to do",
        "paragraphs": [],
        "checklist": [
          "Hang up. Do not press any key and do not call back the number.",
          "Never share an OTP, Aadhaar number, bank details or a photo of your ID with a caller.",
          "Report the number on Chakshu at sancharsaathi.gov.in, and block it on your phone.",
          "Check the connections registered in your name on Sanchar Saathi if the call made you worry about misuse.",
          "If you lost money or shared bank details, call 1930 or report at cybercrime.gov.in immediately and inform your bank."
        ]
      },
      {
        "heading": "Messages and screenshots in the same scam",
        "paragraphs": [
          "The call is often followed by an SMS or WhatsApp message with a link to \"re-verify\" your number, or by fake notices with TRAI, DoT or police logos. Treat any link in such a message as dangerous; you can paste it into the <a href=\"/suspicious-link-checker/\">suspicious link checker</a> without opening it, and screenshot the message for the <a href=\"/screenshot-scam-checker/\">screenshot scam checker</a> to see its warning signs. For other message scams, see our guides to <a href=\"/blog/smishing-fake-sms/\">fake SMS</a> and <a href=\"/blog/e-challan-sms-scam/\">fake e-challan messages</a>."
        ]
      }
    ],
    "faq": [
      {
        "question": "Does TRAI call to block mobile numbers?",
        "answer": "No. TRAI has said it does not contact customers about disconnecting mobile numbers and has not authorised any agency to do so. Such calls should be treated as fraud."
      },
      {
        "question": "I pressed 9 on a TRAI call. What should I do?",
        "answer": "If you only listened and shared nothing, hang up and report the number on Chakshu. If you shared OTPs, Aadhaar or bank details, or sent money, call 1930 and your bank straight away."
      },
      {
        "question": "Can my SIM really be blocked?",
        "answer": "Your telecom operator can disconnect a number for unpaid bills, incomplete KYC or misuse, and it contacts you through its own official channels. TRAI does not make these calls."
      },
      {
        "question": "How do I report a fake TRAI call?",
        "answer": "Use the Chakshu facility on the Sanchar Saathi portal to report the call or message. If money was lost, report it on 1930 or cybercrime.gov.in."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": [
      "digital-arrest-scam",
      "smishing-fake-sms",
      "e-challan-sms-scam"
    ],
    "cta": {
      "label": "Check a suspicious message",
      "url": "/screenshot-scam-checker/",
      "description": "Screenshot the follow-up SMS or WhatsApp message and see which scam warning signs it contains."
    }
  },
  {
    "slug": "fake-customer-care-number-scam",
    "title": "Fake Customer Care Number Scam: How a Helpline Search Empties Accounts",
    "seoTitle": "Fake Customer Care Number Scam: Search, Call, Lose Money",
    "metaDescription": "Searched for a customer care number and the agent asked for AnyDesk, an OTP or a UPI PIN for your refund? It is a scam. How it works and how to stay safe.",
    "category": "Security",
    "publishedAt": "2026-11-12",
    "authorName": "Virat Chauhan",
    "readTime": "6 min read",
    "excerpt": "Fraudsters plant fake helpline numbers in search results, maps listings and social media posts. When you call about a refund or problem, they ask for a screen-sharing app, an OTP or a UPI PIN. Here is how to find the real number and what to do if you called a fake one.",
    "targetKeywords": [
      "fake customer care number scam",
      "customer care fraud",
      "fake helpline number",
      "anydesk scam",
      "refund scam call",
      "customer care number fraud upi"
    ],
    "keyTakeaway": {
      "title": "Get helpline numbers only from the official app or website",
      "text": "Don't trust a customer care number from a search result, map listing, social media comment or ad. Open the company's own app or type its website address yourself. No genuine agent asks you to install AnyDesk, share an OTP or enter your UPI PIN to receive a refund."
    },
    "introduction": "Your refund hasn't arrived, a UPI payment failed or a delivery went missing, so you search for the company's customer care number and call the first one you see. The agent is polite and helpful, then asks you to install an app so they can \"fix it\", or to enter your UPI PIN to \"receive the refund\". Minutes later, money leaves your account. Fake customer care numbers are one of the most common ways people lose money online.",
    "contentSections": [
      {
        "heading": "Where the fake numbers come from",
        "paragraphs": [
          "Scammers put their own phone numbers wherever people look for help. They pay for search ads, create pages and forum posts that rank for \"[company] customer care number\", edit business listings on maps, and reply to complaints on social media posing as the company's support team."
        ],
        "checklist": [
          "Search results and ads with a number in the title or snippet.",
          "Map listings for banks, couriers and service centres with an edited phone number.",
          "Replies to your complaint on X, Facebook or Instagram from \"support\" accounts asking you to call or WhatsApp a number.",
          "Websites that copy a company's name and logo but are not its official site."
        ]
      },
      {
        "heading": "What happens on the call",
        "paragraphs": [
          "The script changes with the company, but the goal is always to get control of your money or your phone."
        ],
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/fake-customer-care-number-scam/fictional-example.png",
          "alt": "Fictional chat with a fake customer care agent, numbered: a mobile number as helpline, a request to install AnyDesk, a UPI collect request labelled refund and a request for the OTP.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional fake customer care chat. Every request in it is something a real agent never asks for."
        },
        "checklist": [
          "Install a screen-sharing app such as AnyDesk, TeamViewer or QuickSupport \"so we can process your refund\". This lets them see your screen, including OTPs.",
          "Fill in a form with your card or bank details \"for verification\".",
          "Accept a UPI collect request or scan a QR code \"to receive the refund\", which actually sends money to them; see <a href=\"/blog/qr-code-scam/\">QR code scams</a>.",
          "Read out an OTP, or pay a small \"processing fee\" to release a larger refund."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "A real customer care agent never needs a screen-sharing app, your OTP, your card PIN or your UPI PIN to give you a refund. Receiving money never requires a PIN."
        }
      },
      {
        "heading": "How to find the real number",
        "paragraphs": [],
        "checklist": [
          "Open the company's official app and use its Help or Support section.",
          "Type the company's website address yourself and find the Contact page.",
          "For banks, use the number on the back of your debit or credit card or in your passbook.",
          "Be careful with ads at the top of search results and with numbers in map listings; cross-check them on the official site.",
          "Ignore support offers that arrive by DM or reply on social media."
        ]
      },
      {
        "heading": "If you already called a fake number",
        "paragraphs": [
          "If you installed a screen-sharing app, uninstall it and disconnect from the internet first. If you shared card, bank or UPI details, call your bank's official helpline to block cards and UPI, and change your banking passwords from a different device.",
          "Report the fraud on 1930 or at cybercrime.gov.in as soon as possible, since quick reports give banks a chance to hold the money. Keep the number you called, call times, screenshots of chats and every transaction reference. Then report the fake listing or ad to the platform where you found it."
        ]
      },
      {
        "heading": "Checking a suspicious chat or message",
        "paragraphs": [
          "If a \"support agent\" sent you a link, paste it into the <a href=\"/suspicious-link-checker/\">suspicious link checker</a> without opening it. Screenshots of the chat can go through the <a href=\"/screenshot-scam-checker/\">screenshot scam checker</a>, which flags requests for OTPs, remote-access apps and payments."
        ]
      }
    ],
    "faq": [
      {
        "question": "How do I know if a customer care number is fake?",
        "answer": "Check it against the number in the company's official app or website. Be suspicious of numbers from ads, map listings or social media replies, mobile numbers presented as toll-free helplines, and any agent who asks for an app install, OTP or PIN."
      },
      {
        "question": "Is it safe to install AnyDesk if customer care asks?",
        "answer": "No. Screen-sharing apps let the other person see and sometimes control your phone, including OTPs and banking apps. Real customer care for banks, shopping or payment apps does not need it to give a refund."
      },
      {
        "question": "Do I need to enter my UPI PIN to get a refund?",
        "answer": "Never. A UPI PIN is only used to send money. If someone asks you to enter it to receive a refund, they are trying to take money from you."
      },
      {
        "question": "I gave my OTP to a fake customer care agent. What now?",
        "answer": "Call your bank's official helpline to block cards and UPI, change passwords from another device, and report it on 1930 or cybercrime.gov.in straight away."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["loan-app-harassment-morphed-photos", "fake-amazon-flipkart-refund-scam", 
      "qr-code-scam",
      "payment-failed-screenshot-scam",
      "smishing-fake-sms"
    ],
    "cta": {
      "label": "Check a suspicious link",
      "url": "/suspicious-link-checker/",
      "description": "See warning signs in a link a support agent or message sent you, without opening it."
    }
  },
  {
    "lang": "hi",
    "slug": "task-job-scam-se-kaise-bache",
    "title": "WhatsApp-Telegram टास्क जॉब स्कैम: वीडियो लाइक करके कमाई, फिर \"प्रीपेड टास्क\" में पैसा डूबा",
    "seoTitle": "Task Job Scam क्या है? Telegram प्रीपेड टास्क से बचें",
    "metaDescription": "YouTube वीडियो लाइक करने पर पैसे मिले, अब प्रीपेड टास्क के लिए पैसा जमा करने को कहा जा रहा है? यह टास्क स्कैम है। यह कैसे होता है और क्या करें।",
    "category": "Security",
    "publishedAt": "2026-11-12",
    "authorName": "Virat Chauhan",
    "readTime": "6 min read",
    "excerpt": "पार्ट-टाइम जॉब के नाम पर WhatsApp और Telegram पर चलने वाला टास्क स्कैम कैसे काम करता है, \"प्रीपेड\" या \"मर्चेंट\" टास्क क्या होता है, ठग कौन से मैसेज भेजते हैं, और पैसा फँस जाए तो क्या करें।",
    "targetKeywords": [
      "task job scam kya hai",
      "telegram task scam hindi",
      "प्रीपेड टास्क",
      "youtube like karke paise scam",
      "part time job scam whatsapp",
      "टास्क जॉब फ्रॉड"
    ],
    "keyTakeaway": {
      "title": "काम करने के लिए पैसा माँगने वाली नौकरी असली नहीं होती",
      "text": "कोई भी असली नौकरी आपसे काम शुरू करने, \"प्रीपेड टास्क\" करने या अपनी कमाई निकालने के लिए पैसा नहीं माँगती। जैसे ही जमा करने को कहा जाए, रुक जाएँ। और पैसा न भेजें, सबूत संभालें और 1930 पर शिकायत करें।"
    },
    "introduction": "WhatsApp पर मैसेज आता है: \"पार्ट-टाइम जॉब, घर बैठे रोज़ ₹1,000 से ₹5,000 कमाएँ। बस YouTube वीडियो लाइक करके स्क्रीनशॉट भेजें।\" पहले कुछ टास्क के सच में ₹50 या ₹150 मिल भी जाते हैं। फिर आपको Telegram ग्रुप में जोड़ा जाता है, जहाँ दूसरे \"सदस्य\" अपनी बड़ी कमाई के स्क्रीनशॉट डालते हैं, और \"प्रीपेड टास्क\" के लिए पैसा जमा करने को कहा जाता है। यहीं से असली ठगी शुरू होती है।",
    "contentSections": [
      {
        "heading": "टास्क स्कैम कैसे होता है",
        "paragraphs": [
          "हर टास्क स्कैम लगभग एक ही सीढ़ी पर चलता है। हर कदम भरोसा बढ़ाने और फिर ज़्यादा पैसा निकलवाने के लिए बना होता है।"
        ],
        "checklist": [
          "शुरुआत: WhatsApp या Telegram पर अनजान नंबर से पार्ट-टाइम जॉब का मैसेज, अक्सर किसी असली कंपनी या HR के नाम से।",
          "भरोसा: वीडियो लाइक करने, होटल को रेटिंग देने या ऐप रिव्यू करने के छोटे टास्क, जिनके सच में थोड़े पैसे मिलते हैं।",
          "ग्रुप: Telegram ग्रुप जिसमें \"रिसेप्शनिस्ट\" या \"मेंटर\" होता है और दूसरे सदस्य कमाई के स्क्रीनशॉट डालते हैं (ये अक्सर ठगों के ही साथी होते हैं)।",
          "जाल: \"प्रीपेड टास्क\" या \"मर्चेंट टास्क\", जिसमें पहले पैसा जमा करना होता है और बड़ा कमीशन मिलने का वादा होता है।",
          "ताला: डैशबोर्ड पर बढ़ता बैलेंस दिखता है, लेकिन निकाल नहीं पाते: \"टास्क अधूरा है\", \"खाता फ्रीज़ है\", \"टैक्स या अनलॉक फ़ीस भरें\"।"
        ]
      },
      {
        "heading": "\"प्रीपेड टास्क\" या \"मर्चेंट टास्क\" क्या होता है",
        "paragraphs": [
          "प्रीपेड टास्क में आपसे कहा जाता है कि किसी \"प्रोडक्ट\" को ख़रीदने, किसी \"मर्चेंट\" को बूस्ट करने या \"ऑर्डर पूरा करने\" के लिए पहले पैसा भेजें, और वह कमीशन के साथ वापस मिलेगा। पहला प्रीपेड टास्क अक्सर सच में पैसा लौटाता है ताकि भरोसा बने। फिर रकम बढ़ती जाती है और पैसा वापस आना बंद हो जाता है।",
          "न कोई असली मर्चेंट है, न कोई असली टास्क। प्रीपेड टास्क का मतलब बस इतना है कि आप ठगों को पैसा भेज रहे हैं।"
        ],
        "figure": {
          "afterParagraph": 1,
          "src": "/images/blog/task-job-scam-se-kaise-bache/fictional-example.png",
          "alt": "Telegram ग्रुप का काल्पनिक संदेश जिसमें पार्ट-टाइम जॉब, प्रीपेड मर्चेंट टास्क, कमाई के स्क्रीनशॉट और खाता फ्रीज़ होने की बात पर नंबर लगे हैं।",
          "width": 1200,
          "height": 760,
          "caption": "चित्र 1. टास्क स्कैम के संदेशों का एक काल्पनिक उदाहरण। हर हिस्सा एक चेतावनी है।"
        },
        "callout": {
          "type": "golden-rule",
          "text": "असली नौकरी कभी काम करने के लिए या अपनी कमाई निकालने के लिए पैसा नहीं माँगती। \"प्रीपेड\", \"मर्चेंट\" या \"डिपॉज़िट\" टास्क ही असली ठगी है।"
        }
      },
      {
        "heading": "ग्रुप के कमाई वाले स्क्रीनशॉट कुछ साबित नहीं करते",
        "paragraphs": [
          "ग्रुप में दिखने वाले बड़े पेमेंट के स्क्रीनशॉट आसानी से बनाए जा सकते हैं, और ग्रुप के ज़्यादातर \"सदस्य\" ठगों के ही खाते होते हैं। किसी स्क्रीनशॉट से यह साबित नहीं होता कि किसी को सच में पैसा मिला। देखें <a href=\"/blog/fake-payment-screenshot-kaise-pehchane/\">फर्जी पेमेंट स्क्रीनशॉट कैसे पहचानें</a>।"
        ]
      },
      {
        "heading": "पैसा फँस गया है तो क्या करें",
        "paragraphs": [],
        "checklist": [
          "और पैसा न भेजें, चाहे कितना भी कहा जाए कि \"बस आख़िरी टास्क\" या \"बस टैक्स\" भरने से सारा पैसा निकल जाएगा।",
          "तुरंत 1930 पर कॉल करें या cybercrime.gov.in पर शिकायत करें; जल्दी शिकायत से बैंक पैसा रोक सकते हैं।",
          "हर ट्रांज़ैक्शन का UTR नंबर, जिन UPI ID या खातों में पैसा भेजा, चैट और ग्रुप के स्क्रीनशॉट संभालें।",
          "बाद में पैसा वापस दिलाने का दावा करने वाले \"रिकवरी एजेंट\" या \"वकील\" से सावधान रहें; वे भी अक्सर ठग होते हैं।",
          "नंबर को WhatsApp और Telegram पर रिपोर्ट और ब्लॉक करें।"
        ]
      },
      {
        "heading": "अंग्रेज़ी में पूरी गाइड",
        "paragraphs": [
          "ठगों के आम मैसेज और पूरी जानकारी के लिए अंग्रेज़ी <a href=\"/blog/whatsapp-telegram-task-job-scam/\">WhatsApp and Telegram task job scam गाइड</a> देखें। संदिग्ध मैसेज का स्क्रीनशॉट <a href=\"/screenshot-scam-checker/\">स्क्रीनशॉट स्कैम चेकर</a> में डालकर उसके ख़तरे के संकेत भी देख सकते हैं।"
        ]
      }
    ],
    "faq": [
      {
        "question": "टास्क जॉब स्कैम क्या है?",
        "answer": "यह पार्ट-टाइम जॉब के नाम पर ठगी है जिसमें पहले वीडियो लाइक करने जैसे छोटे टास्क के पैसे दिए जाते हैं, फिर \"प्रीपेड टास्क\" के नाम पर आपसे पैसा जमा करवाकर हड़प लिया जाता है।"
      },
      {
        "question": "क्या YouTube वीडियो लाइक करके सच में पैसा मिलता है?",
        "answer": "WhatsApp या Telegram पर अनजान लोगों के ऐसे ऑफ़र लगभग हमेशा टास्क स्कैम की शुरुआत होते हैं। शुरुआती छोटे पेमेंट भरोसा जमाने के लिए होते हैं।"
      },
      {
        "question": "प्रीपेड टास्क में डाला पैसा वापस मिल सकता है?",
        "answer": "तुरंत 1930 पर शिकायत करने से बैंक पैसा रोकने की कोशिश कर सकते हैं। और पैसा भेजकर \"निकालने\" की कोशिश न करें; इससे नुकसान सिर्फ़ बढ़ता है।"
      },
      {
        "question": "टास्क स्कैम की शिकायत कहाँ करें?",
        "answer": "साइबर हेल्पलाइन 1930 पर कॉल करें या cybercrime.gov.in पर शिकायत दर्ज करें। संदिग्ध नंबर संचार साथी पोर्टल की चक्षु सुविधा पर भी रिपोर्ट कर सकते हैं।"
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["fake-job-offer-letter-kaise-pehchane", "fake-job-offer-letter", 
      "whatsapp-telegram-task-job-scam",
      "fake-payment-screenshot-kaise-pehchane",
      "digital-arrest-kya-hai"
    ],
    "cta": {
      "label": "संदिग्ध संदेश चेक करें",
      "url": "/screenshot-scam-checker/",
      "description": "जॉब ऑफ़र या टास्क ग्रुप के मैसेज का स्क्रीनशॉट डालें और देखें कि उसमें ठगी के कौन से संकेत हैं।"
    }
  },
  {
    "slug": "payment-fail-paisa-kat-gaya",
    "lang": "hi",
    "title": "\"पेमेंट फेल, पैसा कट गया\" स्क्रीनशॉट: असली है या धोखा?",
    "seoTitle": "Payment Fail, पैसा कट गया? स्क्रीनशॉट असली या धोखा",
    "metaDescription": "ग्राहक ने पेमेंट फेल या प्रोसेसिंग का स्क्रीनशॉट दिखाया? फेल UPI पेमेंट का पैसा कहाँ जाता है, RBI की समय सीमा, ठगी की चालें और सही कदम।",
    "category": "Security",
    "publishedAt": "2026-11-17",
    "authorName": "Virat Chauhan",
    "readTime": "6 min read",
    "excerpt": "फेल, पेंडिंग या बैंक एरर वाले पेमेंट स्क्रीनशॉट का असली मतलब, फेल UPI पेमेंट पर RBI के नियम, इन स्क्रीन के इर्द-गिर्द बनी ठगी की चालें, और दुकानदार व पैसे भेजने वाले दोनों को क्या करना चाहिए।",
    "targetKeywords": [
      "payment fail paisa kat gaya",
      "पेमेंट फेल पैसा कट गया",
      "upi payment fail paisa kab wapas aayega",
      "payment processing screenshot",
      "payment failed screenshot fraud",
      "फेल पेमेंट स्क्रीनशॉट"
    ],
    "keyTakeaway": {
      "title": "फेल या पेंडिंग स्क्रीन का मतलब है: पैसा आपको नहीं मिला",
      "text": "अगर आपके अपने UPI ऐप या बैंक में पैसा नहीं आया, तो पेमेंट नहीं हुआ, ग्राहक की स्क्रीन पर कुछ भी लिखा हो। असली फेल पेमेंट का पैसा बैंक भेजने वाले को लौटाते हैं, आपको नहीं। इसलिए सामान देने, \"ज़्यादा आया पैसा\" लौटाने या QR स्कैन करने की कोई ज़रूरत नहीं।"
    },
    "introduction": "ग्राहक फ़ोन दिखाता है: \"पेमेंट फेल हो गया, पर पैसा कट गया है। आपके पास आ जाएगा, सामान दे दीजिए।\" या कोई \"बैंक एरर\" का स्क्रीनशॉट भेजकर फ़ीस माँगता है या पैसा वापस करने को कहता है। असली पेमेंट फेल रोज़ होते हैं, और उनके नाम पर ठगी भी। यह गाइड बताती है कि फेल UPI पेमेंट में असल में क्या होता है, किन चालों से सावधान रहें, और आप दुकानदार हों या पैसे भेजने वाले, आपको क्या करना है। यह हमारी अंग्रेज़ी गाइड <a href=\"/blog/payment-failed-screenshot-scam/\">Payment failed screenshot scam</a> का हिंदी रूप है।",
    "contentSections": [
      {
        "heading": "एक जैसी स्क्रीन, दो बिल्कुल अलग हालात",
        "figure": {
          "afterParagraph": 1,
          "src": "/images/blog/payment-fail-paisa-kat-gaya/fictional-example.png",
          "alt": "₹1,200 के फेल UPI पेमेंट की काल्पनिक स्क्रीन जिसमें लिखा है कि कटा पैसा वापस आएगा, और दुकानदार को क्या जाँचना है इसके नंबर वाले निशान।",
          "width": 1200,
          "height": 760,
          "caption": "चित्र 1. फेल पेमेंट की एक काल्पनिक स्क्रीन। उस पर कुछ भी लिखा हो, पैसा आया या नहीं यह सिर्फ़ दुकानदार का अपना ऐप बताता है।"
        },
        "paragraphs": [
          "कई बार पेमेंट सच में फेल होता है: बैंक का सर्वर जवाब नहीं देता, नेटवर्क चला जाता है, या पेमेंट प्रोसेसिंग में अटक जाता है। भेजने वाले के खाते से कुछ देर के लिए पैसा कटा हुआ भी दिख सकता है। इसमें कोई झूठ नहीं बोल रहा।",
          "दूसरी बार स्क्रीन ही चाल होती है। प्रैंक ऐप और एडिट किए गए स्क्रीनशॉट ऐसा एरर दिखा सकते हैं जो कभी हुआ ही नहीं। और फेल पेमेंट एक आसान कहानी है: \"पैसा रास्ते में है, सामान अभी दे दो\", या \"बैंक से गलती से ज़्यादा चला गया, वापस कर दो\"।"
        ],
        "callout": {
          "type": "golden-rule",
          "text": "दोनों हालात में दुकानदार का जवाब एक ही है: अपना UPI ऐप या बैंक देखिए। पैसा नहीं आया तो पेमेंट नहीं हुआ। ग्राहक का फेल पेमेंट सुलझते ही वह दोबारा पेमेंट कर सकता है।"
        }
      },
      {
        "heading": "फेल UPI पेमेंट का पैसा असल में कहाँ जाता है",
        "paragraphs": [
          "भारतीय रिज़र्व बैंक ने <a href=\"https://www.rbi.org.in/commonman/English/scripts/Notification.aspx?Id=3074\">फेल ट्रांज़ैक्शन के टर्नअराउंड टाइम के ढाँचे</a> में समय सीमा तय की है। UPI ट्रांसफ़र में अगर भेजने वाले का खाता कट गया पर पाने वाले के खाते में पैसा नहीं पहुँचा, तो पैसा अगले दिन (T+1) तक अपने आप वापस होना चाहिए। दुकान या मर्चेंट को किए पेमेंट में अगर पैसा कट गया पर मर्चेंट को पुष्टि नहीं मिली, तो यह सीमा पाँच दिन (T+5) है।",
          "बैंक ये सीमाएँ पार करें तो इसी ढाँचे में देरी के हर दिन के लिए ₹100 मुआवज़ा तय है। ये अधिकतम सीमाएँ हैं; ज़्यादातर फेल पेमेंट इससे कहीं जल्दी लौट आते हैं।",
          "दुकानदार के लिए सबसे ज़रूरी बात: असली फेल पेमेंट में पैसा भेजने वाले को वापस जाता है, आगे आपकी तरफ़ नहीं आता। फेल पेमेंट बाद में आपका पैसा नहीं बनता। इसलिए \"इंतज़ार\" करने लायक कुछ है तो सिर्फ़ एक नया, सफल पेमेंट।"
        ]
      },
      {
        "heading": "प्रोसेसिंग या पेंडिंग वाले स्क्रीनशॉट",
        "paragraphs": [
          "\"Processing\", \"Pending\" या \"Payment in progress\" वाली स्क्रीन पूरा हुआ पेमेंट नहीं है। इसका मतलब है कि भेजने वाले के ऐप को बैंकों से अभी आख़िरी जवाब नहीं मिला। ज़्यादातर ऐसे पेमेंट कुछ मिनटों में Success या Failed हो जाते हैं, कुछ में ज़्यादा समय लगता है।",
          "जब तक आपके अपने ऐप या बैंक में पैसा न दिखे, प्रोसेसिंग स्क्रीनशॉट को भी फेल जैसा ही मानिए। सच्चा ग्राहक आख़िरी स्टेटस आने तक आपके साथ रुक सकता है, या पहला पेमेंट फेल होने पर दोबारा भेज सकता है। जो प्रोसेसिंग स्क्रीन पर ही सामान ले जाने की ज़िद करे, या जिसकी स्क्रीन कभी अपडेट ही न हो, वहाँ रुक जाइए।"
        ],
        "checklist": [
          "ग्राहक से कहिए कि ऐप रिफ़्रेश करके आख़िरी स्टेटस दिखाए, सेव किया हुआ स्क्रीनशॉट नहीं।",
          "अपने UPI ऐप या बैंक में पैसा और UTR या रेफ़रेंस नंबर देखिए।",
          "पहला पेमेंट फेल हो तो नया पेमेंट तभी मानिए जब वह आपके खाते में दिखे।"
        ]
      },
      {
        "heading": "फेल और एरर स्क्रीन के नाम पर होने वाली चालें",
        "paragraphs": [
          "ये तरीके बार-बार दिखते हैं। हर एक में आपसे अपने रिकॉर्ड के बजाय ग्राहक की स्क्रीन पर भरोसा करने को कहा जाता है।"
        ],
        "checklist": [
          "\"पैसा कट गया है, कुछ घंटों में आपके पास आ जाएगा, सामान दे दो।\" फेल पेमेंट का पैसा भेजने वाले को लौटता है, आपको बाद में नहीं मिलता।",
          "\"बैंक ने गलती से दोगुना भेज दिया, ज़्यादा वाला लौटा दो।\" अपना खाता देखिए; कुछ ज़्यादा आया ही नहीं तो लौटाने को कुछ नहीं।",
          "\"रिफ़ंड पाने के लिए यह QR स्कैन करो या PIN डालो।\" <a href=\"https://npci.org.in/what-we-do/upi/upi-safety-shield\">NPCI का UPI Safety Shield</a> कहता है कि UPI PIN और QR कोड सिर्फ़ पैसा भेजने के लिए हैं, पैसा लेने के लिए कभी नहीं। और पढ़ें: <a href=\"/blog/qr-code-fraud-se-kaise-bache/\">QR कोड फ्रॉड से कैसे बचें</a>।",
          "किसी अनजान का भेजा \"बैंक एरर\" स्क्रीनशॉट जिसमें पेमेंट छुड़ाने के लिए फ़ीस माँगी गई हो। असली बैंक चैट पर ऐसी फ़ीस नहीं माँगते।",
          "दबाव और नाटक: लंबी लाइन, गुस्सा या किसी इमरजेंसी की कहानी, ताकि आप फ़ोन देखना ही भूल जाएँ।"
        ]
      },
      {
        "heading": "उदाहरण: एक काल्पनिक बेकरी",
        "paragraphs": [
          "रिया पुणे में छोटी बेकरी चलाती हैं। ₹1,200 का केक लेने आया ग्राहक एक स्क्रीन दिखाता है: \"Payment failed. Money debited will be refunded within 3–5 working days\", और कहता है कि केक अभी ले जाने दो, पैसे बाद में दे दूँगा।",
          "रिया अपना UPI ऐप खोलती हैं। ₹1,200 नहीं आए। वे समझाती हैं कि पेमेंट फेल हुआ है तो बैंक पैसा उसी को लौटाएगा, और अभी UPI या नकद से दोबारा पेमेंट करने को कहती हैं।",
          "ग्राहक सच्चा है तो वह दोबारा पेमेंट करेगा या बाद में आएगा; उसका पहला पैसा उसके खाते में लौट आएगा। अगर वह बहस करे, बिना पैसे दिए जाने लगे या \"रिफ़ंड लेने\" के लिए QR स्कैन करवाए, तो भी रिया का कोई नुकसान नहीं, क्योंकि उन्होंने केक देने से पहले अपना रिकॉर्ड देख लिया।"
        ],
        "cta": {
          "label": "पेमेंट स्क्रीनशॉट जाँचें (हिंदी)",
          "url": "/payment-screenshot-checker/hindi/",
          "description": "स्क्रीनशॉट से स्टेटस, रकम और रेफ़रेंस पढ़ें और चेतावनी के संकेत देखें, फिर अपने ऐप में पैसा पक्का करें।"
        }
      },
      {
        "heading": "अगर आपने पैसा भेजा और पेमेंट फेल हो गया",
        "paragraphs": [
          "अपने UPI ऐप में वह ट्रांज़ैक्शन खोलकर स्टेटस देखिए। प्रोसेसिंग वाले पेमेंट अक्सर अपने आप Success या Failed हो जाते हैं, इसलिए स्टेटस साफ़ होने तक दोबारा पेमेंट न करें, जब तक दुकानदार यह न बताए कि उसे कुछ नहीं मिला।",
          "खाते से पैसा कटा और पेमेंट फेल हुआ, तो अपने आप वापसी का इंतज़ार करें। समय सीमा में पैसा न लौटे तो UPI ऐप में उसी ट्रांज़ैक्शन से या अपने बैंक में शिकायत करें। बैंक हल न करे तो RBI का <a href=\"https://cms.rbi.org.in/\">शिकायत पोर्टल (CMS)</a> अगला कदम है।",
          "मदद सिर्फ़ अपने UPI ऐप या बैंक के आधिकारिक ऐप से लें। सर्च और सोशल मीडिया पर नकली \"कस्टमर केयर\" नंबर भरे पड़े हैं जो और पैसा ठगने के लिए बने हैं; देखें <a href=\"/blog/fake-customer-care-number-scam/\">fake customer care number scam</a>।"
        ]
      },
      {
        "heading": "ScreenshotChecker क्या बता सकता है और क्या नहीं",
        "paragraphs": [
          "<a href=\"/payment-screenshot-checker/hindi/\">पेमेंट स्क्रीनशॉट चेकर</a> OCR से UPI रसीद का टेक्स्ट पढ़ता है, जिसमें Failed या Pending जैसे स्टेटस शब्द भी शामिल हैं, और रकम व रेफ़रेंस में चेतावनी के संकेत दिखाता है।",
          "यह आपका बैंक खाता नहीं देख सकता, बैंक से बात नहीं कर सकता और पैसा पहुँचा या नहीं यह पक्का नहीं कर सकता। साफ़ नतीजा पेमेंट का सबूत नहीं है और चेतावनी ठगी का सबूत नहीं। जवाब सिर्फ़ आपके अपने UPI ऐप या बैंक स्टेटमेंट में है। पूरा तरीका: <a href=\"/blog/fake-payment-screenshot-kaise-pehchane/\">नकली पेमेंट स्क्रीनशॉट कैसे पहचानें</a>।"
        ]
      }
    ],
    "faq": [
      {
        "question": "ग्राहक की स्क्रीन पर लिखा है पेमेंट फेल, पैसा कट गया। क्या पैसा मुझे मिलेगा?",
        "answer": "नहीं। असली फेल पेमेंट में बैंक पैसा भेजने वाले को लौटाते हैं। RBI के ढाँचे के अनुसार UPI ट्रांसफ़र में यह अगले दिन तक होना चाहिए। अपने ऐप में पक्का करें कि कुछ नहीं आया, फिर ग्राहक से दोबारा पेमेंट करवाएँ।"
      },
      {
        "question": "फेल UPI पेमेंट का पैसा कितने दिन में वापस आता है?",
        "answer": "RBI के टर्नअराउंड ढाँचे के अनुसार UPI ट्रांसफ़र का कटा पैसा T+1 तक और मर्चेंट पेमेंट का T+5 तक लौटना चाहिए। इससे ज़्यादा देरी पर हर दिन ₹100 मुआवज़ा तय है। ज़्यादातर पैसा इससे पहले लौट आता है।"
      },
      {
        "question": "किसी ने बैंक एरर का स्क्रीनशॉट भेजकर ज़्यादा आया पैसा लौटाने को कहा। क्या करूँ?",
        "answer": "अपना बैंक या UPI ऐप देखें। ज़्यादा पैसा आया ही नहीं तो लौटाने को कुछ नहीं। सच में कुछ आया हो तो चैट वाले नंबर पर भेजने के बजाय अपने बैंक से बात करें, क्योंकि असली गलती सुधारना बैंक का काम है।"
      },
      {
        "question": "क्या रिफ़ंड पाने के लिए QR स्कैन करना या PIN डालना पड़ता है?",
        "answer": "नहीं। NPCI के अनुसार UPI PIN सिर्फ़ पैसा भेजने के लिए है और QR कोड सिर्फ़ पैसा भेजने के लिए स्कैन होता है। पैसा लेने के लिए स्कैन या PIN माँगने वाला ठग है।"
      },
      {
        "question": "क्या पेमेंट फेल का स्क्रीनशॉट नकली हो सकता है?",
        "answer": "हाँ। प्रैंक ऐप और एडिट की गई तस्वीरें कोई भी स्टेटस दिखा सकती हैं। इसलिए दूसरे की स्क्रीन का स्टेटस मायने नहीं रखता, सिर्फ़ आपके खाते में आया पैसा रखता है।"
      },
      {
        "question": "क्या ScreenshotChecker बता सकता है कि पेमेंट फेल हुआ या नहीं?",
        "answer": "नहीं। यह स्क्रीनशॉट का टेक्स्ट पढ़कर चेतावनी के संकेत दिखाता है, पर इसकी पहुँच बैंकों तक नहीं है। अपना UPI ऐप या बैंक स्टेटमेंट देखें।"
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["utr-number-kya-hota-hai", 
      "fake-payment-screenshot-kaise-pehchane",
      "qr-code-fraud-se-kaise-bache",
      "payment-failed-screenshot-scam"
    ],
    "cta": {
      "label": "पेमेंट स्क्रीनशॉट जाँचें",
      "url": "/payment-screenshot-checker/hindi/",
      "description": "स्क्रीनशॉट से पढ़ा गया स्टेटस, रकम और रेफ़रेंस देखें, फिर अपने UPI ऐप या बैंक में पैसा पक्का करें।"
    }
  },
  {
    "slug": "fake-receipt-kaise-pehchane",
    "lang": "hi",
    "title": "नकली रसीद कैसे पहचानें: AI से बनी और एडिट की गई रसीदें",
    "seoTitle": "Fake Receipt कैसे पहचानें? AI से बनी नकली रसीद की जाँच",
    "metaDescription": "AI अब सेकंडों में असली जैसी रसीद बना देता है। दुकान, जोड़, GST, कार्ड नंबर और फ़ोटो के संकेतों से रसीद कैसे जाँचें, और कौन सी जाँच बात पक्की करती है।",
    "category": "AI & Forensics",
    "publishedAt": "2026-11-17",
    "updatedAt": "2026-11-17",
    "authorName": "Virat Chauhan",
    "readTime": "6 min read",
    "excerpt": "पहले नकली रसीद के लिए एडिटिंग ऐप या टेम्पलेट वेबसाइट चाहिए थी; अब AI इमेज टूल एक वाक्य से बना देता है। ख़र्च के बिल जाँचने वालों, छोटे व्यापारियों और सबूत के तौर पर रसीद पाने वाले हर व्यक्ति के लिए एक आसान चेकलिस्ट।",
    "targetKeywords": [
      "fake receipt kaise pehchane",
      "नकली रसीद कैसे पहचानें",
      "fake bill kaise check kare",
      "ai se bani fake receipt",
      "नकली बिल",
      "fake receipt detector hindi"
    ],
    "keyTakeaway": {
      "title": "तस्वीर नहीं, लेन-देन जाँचिए",
      "text": "रसीद की तस्वीर कितनी भी असली लगे, वह सिर्फ़ एक दावा है। ख़रीद को किसी और तरीके से पक्का करें: कार्ड या बैंक स्टेटमेंट की लाइन, दुकान का अपना रिकॉर्ड, बुकिंग या ऑर्डर की पुष्टि, या आपके अपने खाते में आया पैसा। तस्वीर की जाँच से बस यह तय होता है कि किस रसीद को गहराई से देखना है।"
    },
    "introduction": "नकली रसीद पहचानने के लिए दुकान ख़ुद खोजिए, आइटम, टैक्स और टोटल दोबारा जोड़िए (मुफ़्त <a href=\"/fake-receipt-checker/\">फेक रसीद चेकर</a> यह हिसाब कर देता है), तारीख़, समय और कार्ड के अंक मिलाइए, और कार्ड या बैंक स्टेटमेंट की लाइन माँगिए: नकली रसीद किसी असली पेमेंट रिकॉर्ड में नहीं दिखती। रसीद रोज़मर्रा का सबूत है: ऑफ़िस के ख़र्च, वारंटी और रिटर्न, किराया और एडवांस, पुराना सामान बेचना और बीमा क्लेम। रसीदें हमेशा से नकली बनती रही हैं, पर अब AI ने यह तेज़ और सस्ता कर दिया है। <a href=\"https://www.techradar.com/pro/security/workers-are-scamming-their-employers-using-ai-generated-fake-expense-receipts\">TechRadar</a> के अनुसार, ख़र्च जाँचने वाली सॉफ़्टवेयर कंपनी AppZen ने बताया कि सितंबर 2025 में उसके पकड़े गए नकली दस्तावेज़ों में लगभग 14% AI से बनी रसीदें थीं, जबकि एक साल पहले एक भी नहीं थी। यह गाइड बताती है कि क्या देखें और, उससे ज़रूरी, रसीद असली है यह कैसे पक्का करें। यह हमारी अंग्रेज़ी गाइड <a href=\"/blog/fake-receipt-ai-generated/\">How to spot a fake receipt</a> का हिंदी रूप है।",
    "contentSections": [
      {
        "heading": "नकली रसीदें कहाँ दिखती हैं",
        "paragraphs": [
          "ज़्यादातर नकली रसीदें कुछ ही तरह की होती हैं। आपके सामने कौन सी है, इससे पता चलता है कि क्या जाँचना है।"
        ],
        "checklist": [
          "ऑफ़िस के ख़र्च: खाना, टैक्सी, होटल या सामान जो कभी ख़रीदा ही नहीं, या असली ख़रीद की बढ़ाई हुई रकम।",
          "पेमेंट का सबूत: असली पैसे की जगह दुकानदार, मकान मालिक या फ़्रीलांसर को दिखाई गई \"रसीद\"। इसके लिए देखें <a href=\"/blog/fake-payment-screenshot-kaise-pehchane/\">नकली पेमेंट स्क्रीनशॉट कैसे पहचानें</a>।",
          "रिटर्न और वारंटी: कहीं और से, पुराना या बिना ख़रीदे सामान की रसीद।",
          "पुराना सामान बेचना: इस्तेमाल किए या नकली सामान को असली दिखाने के लिए \"ओरिजिनल बिल\"।"
        ]
      },
      {
        "heading": "रसीद पर क्या-क्या जाँचें",
        "paragraphs": [
          "नकली रसीद बनाने वाले को एक साथ बहुत सी छोटी बातें सही करनी पड़ती हैं। एक-एक करके देखिए; अक्सर एक गलती ही सबूत माँगने के लिए काफ़ी होती है।"
        ],
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/fake-receipt-kaise-pehchane/fictional-example.png",
          "alt": "रेस्टोरेंट की काल्पनिक रसीद पर नंबर वाली जाँचें: ऐसी दुकान जो कहीं नहीं मिलती, जोड़ जो टोटल से मेल नहीं खाता, गलत GST दर, कार्ड नंबर में ज़्यादा अंक, और ऐसा समय जब दुकान बंद थी।",
          "width": 1200,
          "height": 760,
          "caption": "चित्र 1. आम गलतियों वाली एक काल्पनिक रसीद। हर गलती लेन-देन को दूसरे तरीके से जाँचने की वजह है।"
        },
        "checklist": [
          "दुकान: क्या उस पते पर यह दुकान है? नाम, पता और फ़ोन नंबर उसकी वेबसाइट या मैप लिस्टिंग से मिलाइए।",
          "जोड़: क्या सामान की क़ीमतें जोड़कर सबटोटल बनती हैं, और टैक्स, टिप और टोटल सही हैं?",
          "टैक्स: क्या उस जगह और सामान के लिए GST की दर सही है? गलत दर एक आम गलती है।",
          "तारीख़ और समय: क्या उस समय दुकान खुली थी? क्या वह व्यक्ति उस दिन उस शहर में था?",
          "पेमेंट की लाइन: कार्ड का प्रकार और आख़िरी चार अंक इस्तेमाल हुए कार्ड से मिलें; ट्रांज़ैक्शन या ऑथराइज़ेशन नंबर सामान्य फ़ॉर्मैट में हो।",
          "बनावट: फ़ॉन्ट, अलाइनमेंट और दूरी एक जैसी; असली थर्मल रसीदों की छपाई एक तय चौड़ाई वाली होती है।",
          "दोहराव: एक ही रसीद नंबर, रकम या बनावट कई क्लेम में।"
        ]
      },
      {
        "heading": "रसीद की तस्वीर AI से बनी या एडिट हुई है, इसके संकेत",
        "paragraphs": [
          "AI इमेज टूल अब पढ़ने लायक टेक्स्ट बना लेते हैं, इसलिए साफ़ बकवास टेक्स्ट पहले से कम दिखता है। फिर भी, बनी या एडिट की गई रसीदों में अक्सर कुछ संकेत होते हैं, ख़ासकर जब उसी दुकान की असली रसीदों से मिलाकर देखें।"
        ],
        "checklist": [
          "रसीद की फ़ोटो जो ज़रूरत से ज़्यादा परफ़ेक्ट लगे, या जिसकी सिलवटें और रोशनी अनायास नहीं, सजाई हुई लगें।",
          "लोगो जो थोड़ा गलत, धुँधला या दुकान की असली रसीदों से अलग हो।",
          "एक ही लाइन में टेक्स्ट का आकार या तीखापन बदलना, या अंक जो चिपकाए हुए लगें।",
          "असली रसीदों में होने वाली बातें गायब: GSTIN, स्टोर नंबर, टर्मिनल ID या रिटर्न पॉलिसी।",
          "फ़ाइल के संकेत: मेटाडेटा में किसी एडिटर या AI टूल का नाम, या Content Credentials जो बताएँ कि तस्वीर बनाई गई है। इनका न होना कुछ साबित नहीं करता।"
        ],
        "callout": {
          "type": "info",
          "text": "<a href=\"/screenshot-metadata-checker/\">मेटाडेटा चेकर</a>, <a href=\"/ai-image-detector/\">फ़ेक इमेज डिटेक्टर</a> और <a href=\"/image-manipulation-checker/\">फ़ोटो मैनिपुलेशन चेकर</a> ये संकेत आपके ब्राउज़र में ही दिखाते हैं। ये रसीद को जाँच के लिए चिह्नित कर सकते हैं; उसे असली साबित नहीं कर सकते।"
        }
      },
      {
        "heading": "वे जाँचें जो बात पक्की करती हैं",
        "paragraphs": [
          "असली ख़रीद रसीद के बाहर भी निशान छोड़ती है। ये जाँचें किसी भी तस्वीर देखने से ज़्यादा भरोसेमंद हैं।"
        ],
        "checklist": [
          "उसी दुकान, तारीख़ और रकम वाली कार्ड या बैंक स्टेटमेंट की लाइन माँगिए।",
          "होटल, फ़्लाइट और कैब के लिए कंपनी के ऐप या ईमेल की बुकिंग पुष्टि माँगिए, या कंपनी से पूछिए।",
          "रिटर्न के लिए अपने बिलिंग सिस्टम में रसीद नंबर, तारीख़ या कार्ड से लेन-देन ढूँढिए।",
          "आपको किए गए पेमेंट के लिए अपने बैंक या पेमेंट ऐप में पैसा देखिए। रसीद उसकी जगह कभी नहीं ले सकती।",
          "बड़ी रकम के क्लेम में दुकान से ख़ुद ढूँढे गए नंबर या ईमेल पर सीधे संपर्क कीजिए।"
        ]
      },
      {
        "heading": "व्यापारियों और कंपनियों के लिए: जोखिम कम करना",
        "paragraphs": [
          "ख़र्च की धोखाधड़ी पकड़ने से ज़्यादा आसान उसे प्रक्रिया से रोकना है। कंपनी कार्ड या सीधी बिलिंग से पेमेंट हो तो हर क्लेम का ट्रांज़ैक्शन रिकॉर्ड रहता है। तय रकम से ऊपर के क्लेम पर आइटम वाली रसीद और स्टेटमेंट मिलान ज़रूरी करने से नकली रसीद का लालच ही ख़त्म हो जाता है।",
          "बीच-बीच की जाँच भी डर पैदा करती है। हर तस्वीर को बारीकी से देखने के बजाय कुछ क्लेम बेतरतीब चुनकर, और गोल रकम, दोहराई गई रकम या न मिलने वाली दुकान वाले हर क्लेम को देखना ज़्यादा पकड़ता है। जानबूझकर धोखे का शक हो तो डिटेक्टर के स्कोर से किसी पर आरोप लगाने के बजाय HR और क़ानूनी प्रक्रिया अपनाइए।"
        ]
      }
    ],
    "faq": [
      {
        "question": "रसीद नकली है, यह कैसे पता करें?",
        "answer": "देखिए कि दुकान सच में है, सामान का जोड़ सही है, GST दर और तारीख़ ठीक हैं और कार्ड की जानकारी मेल खाती है। फिर ख़रीद को किसी और तरीके से पक्का कीजिए, जैसे कार्ड स्टेटमेंट या दुकान का अपना रिकॉर्ड।"
      },
      {
        "question": "क्या AI नकली रसीद बना सकता है?",
        "answer": "हाँ। आज के इमेज जनरेटर एक छोटे से निर्देश से पढ़ने लायक टेक्स्ट वाली असली जैसी रसीद बना देते हैं, और ख़र्च जाँचने वाली कंपनियों ने पकड़ी गई नकली रसीदों में AI से बनी रसीदों का तेज़ उछाल बताया है।"
      },
      {
        "question": "क्या कोई फ़ेक रसीद डिटेक्टर है?",
        "answer": "टूल एडिटिंग के निशान, मेटाडेटा और Content Credentials जैसे संकेत दिखा सकते हैं। कोई भी टूल रसीद को असली साबित नहीं कर सकता, इसलिए हर टूल के साथ असली लेन-देन भी जाँचिए।"
      },
      {
        "question": "क्या रसीद पेमेंट का सबूत है?",
        "answer": "अकेले नहीं। रसीद या स्क्रीनशॉट एक दावा है। पेमेंट तब साबित होता है जब पैसा पाने वाले के खाते में दिखे या भेजने वाले के स्टेटमेंट में लेन-देन दिखे।"
      },
      {
        "question": "कोई कर्मचारी नकली रसीद जमा करे तो क्या करें?",
        "answer": "क्लेम और सबूत संभालकर रखिए, कार्ड स्टेटमेंट जैसे सहायक रिकॉर्ड माँगिए और कंपनी की HR व क़ानूनी प्रक्रिया अपनाइए। सिर्फ़ तस्वीर देखकर किसी पर आरोप न लगाइए।"
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": [
      "fake-payment-screenshot-kaise-pehchane",
      "fake-receipt-ai-generated",
      "payment-fail-paisa-kat-gaya"
    ],
    "cta": {
      "label": "तस्वीर में एडिटिंग जाँचें",
      "url": "/image-manipulation-checker/",
      "description": "रसीद की फ़ोटो या स्क्रीनशॉट में एडिटिंग के निशान देखें, सब कुछ आपके ब्राउज़र में।"
    }
  },
  {
    "slug": "fake-job-offer-letter",
    "title": "Fake Job Offer Letter: How to Spot One Before You Pay or Send Documents",
    "seoTitle": "Fake Job Offer Letter? How to Spot It Before You Pay",
    "metaDescription": "Got an offer letter that asks for a fee, deposit or laptop payment? How fake job offers work in India and the US, the red flags, and how to verify the job.",
    "category": "Security",
    "publishedAt": "2026-11-17",
    "authorName": "Virat Chauhan",
    "readTime": "7 min read",
    "excerpt": "Fake appointment and offer letters ask for registration, training, laptop, visa or security deposit payments. What official warnings from the FTC, FBI, RBI and India's Ministry of External Affairs say, the red flags on the letter itself, and how to check a job is real.",
    "targetKeywords": [
      "fake job offer letter",
      "how to check if offer letter is fake",
      "fake appointment letter",
      "job offer letter scam",
      "offer letter asking for security deposit",
      "fake overseas job offer"
    ],
    "keyTakeaway": {
      "title": "A real employer never charges you to be hired",
      "text": "If an offer letter asks you to pay for registration, training, a laptop, a background check, a visa or a refundable deposit before you start, treat it as a scam. Verify the job through the company's own careers page or HR contact that you find yourself, and for overseas jobs, check the recruiting agent's licence on India's eMigrate portal."
    },
    "introduction": "A fake job offer letter usually looks professional: a company logo, a salary that is a little better than expected, an HR signature and a joining date. The catch comes in the next message, which asks for a fee, a deposit or your bank details. The FTC reported that losses to job and employment agency scams rose from about $90 million in 2020 to $501 million in 2024, according to its <a href=\"https://www.ftc.gov/news-events/news/press-releases/2025/03/new-ftc-data-show-big-jump-reported-losses-fraud-125-billion-2024\">March 2025 data release</a>. This guide explains how these letters work, the warning signs on the letter itself, and the checks that tell you whether the job exists.",
    "contentSections": [
      {
        "heading": "How the fake offer letter scam works",
        "paragraphs": [
          "The pattern is similar in India and the US. You see a job ad or get a message on WhatsApp, Telegram, LinkedIn or email. There may be a short chat or video interview, sometimes none at all. Then an official-looking offer or appointment letter arrives, and soon after, a request for money.",
          "The Reserve Bank of India's <a href=\"https://www.rbi.org.in/commonman/Upload/english/Content/PDFs/English%20BEAWARE.pdf\">BE(A)WARE booklet</a> describes exactly this: after a fake interview, the job seeker is induced to transfer funds for registration, a mandatory training programme or a laptop. In the US, the FBI's Internet Crime Complaint Center warned in a <a href=\"https://www.ic3.gov/PSA/2020/PSA200121\">2020 public service announcement</a> that scammers copy real company websites, post fake jobs and then ask new \"hires\" to buy start-up equipment."
        ],
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/fake-job-offer-letter/fictional-example.png",
          "alt": "Fictional offer letter from a made-up IT company with numbered red flags: a free email address, an unusually high salary with no interview, a refundable laptop deposit, a 24-hour deadline and a request for Aadhaar and bank details.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional fake offer letter. Any one of these signs is a reason to stop and verify the job independently."
        },
        "callout": {
          "type": "golden-rule",
          "text": "The RBI booklet puts it plainly: a genuine company offering a job will never ask for money. The FTC's advice is the same: do not pay for the promise of a job."
        }
      },
      {
        "heading": "Red flags on the letter and in the messages",
        "paragraphs": [
          "No single sign proves a letter is fake, and real HR teams make typing mistakes too. But scam letters tend to share several of these at once."
        ],
        "checklist": [
          "Any payment before joining: registration, training, certification, a laptop or kit, a background check, a uniform, a visa or a \"refundable security deposit\".",
          "An offer with no real interview, or after a chat-only interview on WhatsApp or Telegram. Wipro's <a href=\"https://careers.wipro.com/content/Fraud-Awareness/?locale=en_US\">fraud awareness page</a> says it does not charge any fee at any stage of recruitment and does not interview over WhatsApp or Telegram.",
          "A sender using a free email address or a domain that only looks like the company's, such as an extra word or a different ending.",
          "A salary well above the market rate for the role, or vague duties.",
          "Pressure: accept within 24 hours, or the seat goes to someone else.",
          "Requests for your bank login, card details, OTP or UPI PIN. A real employer asks for bank details only for payroll, after you are hired, as the FBI notes.",
          "A cheque that arrives before you start, with instructions to buy equipment from a \"vendor\". The FTC's <a href=\"https://consumer.ftc.gov/articles/job-scams\">job scams page</a> warns that the cheque will bounce and you will owe the money."
        ]
      },
      {
        "heading": "How to verify a job offer is real",
        "paragraphs": [
          "Check the job through channels you find yourself, never through the phone numbers, links or email addresses in the letter."
        ],
        "checklist": [
          "Find the company's official website by searching for it yourself, and check whether the role is listed on its careers page.",
          "Contact the company's HR through a number or email from that official site and ask them to confirm the offer and the recruiter's name.",
          "Look at the recruiter's profile: a new account, few connections or a stock photo is a warning sign. A <a href=\"/reverse-image-search/\">reverse image search</a> can show whether the profile photo appears elsewhere.",
          "Read the letter carefully: does the company name, address and registration number match official records? Is the signatory a real person at that company?",
          "Never pay, and never share Aadhaar, PAN, passport or bank details until you have confirmed the offer with the company directly."
        ],
        "cta": {
          "label": "Check a recruiter's message",
          "url": "/screenshot-scam-checker/",
          "description": "Upload a screenshot of the chat or offer and see scam warning signs such as fees, urgency and payment requests, processed in your browser."
        }
      },
      {
        "heading": "Fake government job and appointment letters in India",
        "paragraphs": [
          "Fake appointment letters often use the names of government departments. India Post said in a <a href=\"https://www.pib.gov.in/PressReleasePage.aspx?PRID=1969732\">2023 notice</a> that fake selection orders and offer letters were demanding money, and that it does not accept money in any form before employment. The Income Tax Department warned in <a href=\"https://www.pib.gov.in/PressReleasePage.aspx?PRID=1714095\">2021</a> about a fake Income Tax Officer appointment letter shared on WhatsApp, and pointed people to the official SSC and UPSC websites.",
          "Government recruitment happens through published notifications, exams and results on official websites. A letter that arrives on WhatsApp without an exam you sat, or that asks for a fee to confirm your joining, is not how these jobs are filled. In May 2026 the Ministry of Housing and Urban Affairs also <a href=\"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2260999\">warned</a> about a fake recruiter asking applicants for money, and asked people not to pay and to report it on the National Cyber Crime Reporting Portal."
        ]
      },
      {
        "heading": "Overseas job offers: check the recruiting agent",
        "paragraphs": [
          "Offers of jobs in Canada, Europe, Israel or the Gulf, shared through Facebook or WhatsApp, are a common route for fake letters and even trafficking. The Ministry of External Affairs' <a href=\"https://www.pib.gov.in/PressReleasePage.aspx?PRID=1985025\">advisory against illegal recruiting agents</a> asks job seekers to check the agent on the eMigrate portal (emigrate.gov.in) under the list of active recruiting agents. It says a licensed agent can charge at most ₹30,000 plus 18% GST as a service charge, against a receipt.",
          "Raids on unregistered agents have found fake overseas offer letters. A <a href=\"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2136419\">June 2025 PIB release</a> describes one such seizure and repeats that nobody may recruit for overseas jobs without an MEA licence. If an agent is not on the list, or asks for more than the legal fee, do not pay."
        ]
      },
      {
        "heading": "Fake offer letters in the US and elsewhere",
        "paragraphs": [
          "In the US, fake offers often come with a cheque for equipment, a request to buy gift cards, or a task-based \"work from home\" role where you pay to unlock earnings. The FBI's <a href=\"https://www.ic3.gov/PSA/2024/PSA240604\">June 2024 PSA</a> on task scams says the earnings shown on screen are fake and advises never sending money to an employer. The FTC's <a href=\"https://consumer.ftc.gov/articles/job-scams\">job scams guidance</a> adds that federal and postal jobs never charge a fee to apply or be hired.",
          "For the task-based version in India, see our guide to <a href=\"/blog/whatsapp-telegram-task-job-scam/\">WhatsApp and Telegram task job scams</a> (also in <a href=\"/blog/task-job-scam-se-kaise-bache/\">Hindi</a>)."
        ]
      },
      {
        "heading": "What to do if you already paid or shared documents",
        "paragraphs": [
          "<strong>India:</strong> call the 1930 cyber fraud helpline as soon as possible and file a complaint on the National Cyber Crime Reporting Portal (cybercrime.gov.in), as the <a href=\"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2036395\">Home Ministry advises</a>. Tell your bank through its official app or helpline. If you shared Aadhaar or PAN, watch for loans or accounts opened in your name.",
          "<strong>US:</strong> contact your bank or card issuer, report the scam at ReportFraud.ftc.gov and ic3.gov, and if you shared your Social Security number, visit IdentityTheft.gov.",
          "Keep the letter, screenshots of the chats, the payment receipt and the recruiter's numbers and profiles. Before you share those screenshots with others, the <a href=\"/screenshot-redactor/\">screenshot redactor</a> can hide your own personal details."
        ]
      },
      {
        "heading": "What ScreenshotChecker can and cannot tell you",
        "paragraphs": [
          "The <a href=\"/screenshot-scam-checker/\">screenshot scam checker</a> reads a recruiter's chat or offer screenshot and flags warning signs such as fees, urgency and requests for payment or personal data. The <a href=\"/suspicious-link-checker/\">suspicious link checker</a> looks up a link from the message without opening it, and the <a href=\"/screenshot-metadata-checker/\">metadata checker</a> shows what an image file says about how it was made.",
          "None of these tools can confirm that a job exists or that a company sent the letter. Only the company itself, contacted through details you find independently, can do that."
        ]
      }
    ],
    "faq": [
      {
        "question": "How can I check if a job offer letter is fake?",
        "answer": "Look for payment requests, a free or lookalike email address, no real interview, an unusually high salary and pressure to accept fast. Then contact the company's HR through its official website, not the letter, and ask them to confirm the offer."
      },
      {
        "question": "Is it normal for a company to ask for a security deposit after an offer letter?",
        "answer": "No. Genuine employers do not charge candidates for joining, training, laptops or deposits. The RBI says a genuine company offering a job will never ask for money, and the FTC advises never paying for the promise of a job."
      },
      {
        "question": "How do I check if an overseas recruitment agent is genuine?",
        "answer": "Search for the agent on India's eMigrate portal (emigrate.gov.in) in the list of active recruiting agents. The MEA says licensed agents can charge at most ₹30,000 plus GST, with a receipt."
      },
      {
        "question": "Can a fake offer letter use a real company's name and logo?",
        "answer": "Yes. Scammers copy logos, letterheads and even real employees' names. That is why you should verify the offer with the company directly rather than judging the letter by how it looks."
      },
      {
        "question": "I paid a fee for a fake job. What should I do?",
        "answer": "In India, call 1930 and report on cybercrime.gov.in, then inform your bank. In the US, contact your bank and report at ReportFraud.ftc.gov and ic3.gov. Act quickly and keep all chats and receipts."
      },
      {
        "question": "Can ScreenshotChecker tell me if an offer letter is real?",
        "answer": "No. It can flag warning signs in a screenshot of the offer or chat, but it cannot confirm that a job or company is genuine. Only the company, contacted through its official channels, can confirm an offer."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["fake-job-offer-letter-kaise-pehchane", 
      "whatsapp-telegram-task-job-scam",
      "task-job-scam-se-kaise-bache",
      "fake-customer-care-number-scam"
    ],
    "cta": {
      "label": "Check a job offer screenshot",
      "url": "/screenshot-scam-checker/",
      "description": "See scam warning signs in a recruiter's chat or offer letter screenshot, processed in your browser."
    }
  },
  {
    "slug": "fake-amazon-flipkart-refund-scam",
    "title": "Fake Amazon or Flipkart Order, Refund and Delivery Messages: How to Check",
    "seoTitle": "Fake Amazon or Flipkart Refund Message? How to Check",
    "metaDescription": "A text, call or screenshot about an Amazon or Flipkart order, refund or suspicious purchase? How these scams work, the red flags and how to check safely.",
    "category": "Threat Analysis",
    "publishedAt": "2026-11-17",
    "authorName": "Virat Chauhan",
    "readTime": "7 min read",
    "excerpt": "Fake order confirmations, refund links, \"suspicious purchase\" calls and overpayment stories that borrow Amazon and Flipkart's names. What the companies, the FTC and the RBI say, and how to check an order without tapping anything in the message.",
    "targetKeywords": [
      "amazon refund scam",
      "flipkart refund scam",
      "fake amazon order message",
      "amazon suspicious purchase call scam",
      "fake flipkart customer care",
      "amazon refund text scam"
    ],
    "keyTakeaway": {
      "title": "Check orders only in the app you already use",
      "text": "Open the Amazon or Flipkart app or website yourself and look at Your Orders. If the order, refund or problem is not there, the message is not real. Neither company asks for payment by phone, gift cards, personal UPI IDs or QR codes, and neither needs your PIN or password to give you a refund."
    },
    "introduction": "Online shopping scams borrow trusted names. Amazon was the second most impersonated company in FTC reports in 2023, with about 34,000 reports, according to the <a href=\"https://www.ftc.gov/news-events/news/press-releases/2024/05/new-ftc-data-shed-light-companies-most-frequently-impersonated-scammers\">FTC's May 2024 data</a>, and Flipkart publishes regular scam advisories in India. The messages vary: a refund for a recalled product, a call about a suspicious purchase, a fake order confirmation, or a screenshot showing that you were \"refunded too much\". This guide shows how to check any of them safely.",
    "contentSections": [
      {
        "heading": "The common versions",
        "paragraphs": [
          "Most of these scams fall into a few patterns. Each one tries to move you out of the official app and into a link, a phone call or a payment."
        ],
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/fake-amazon-flipkart-refund-scam/fictional-example.png",
          "alt": "Fictional text message claiming a refund for a recalled item from an online store, with numbered red flags: an unknown sender, a refund you did not ask for, a lookalike link and a request for card details.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional fake refund text. The real check is in the shopping app's Your Orders page, not the link."
        },
        "checklist": [
          "Refund or recall texts: \"your item failed a quality inspection, claim your refund\". The FTC's <a href=\"https://consumer.ftc.gov/consumer-alerts/2025/07/scammy-texts-offering-refunds-amazon-purchases\">July 2025 alert</a> says there is no refund; the link is phishing for your account and card details.",
          "\"Suspicious purchase\" calls or texts: someone claims an expensive order was placed on your account and offers to cancel it. The FTC's <a href=\"https://consumer.ftc.gov/consumer-alerts/2024/03/did-you-get-call-or-text-about-suspicious-purchase-amazon-its-scam\">2024 alert</a> notes that caller ID can be faked and tells people to check through the app.",
          "Overpayment refunds: a fake agent says you were refunded too much and asks you to send back the difference. The FTC listed this among common <a href=\"https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2021/10/amazon-tops-list-impersonated-businesses\">Amazon impersonator tactics</a>.",
          "Fake customer care: a number from a search result or social media post that \"helps\" with a refund and then asks for payment, a remote access app or your PIN.",
          "Fake sites and offers using the brand's name, with payment taken by personal UPI ID or QR code."
        ]
      },
      {
        "heading": "What Amazon and Flipkart say they will never do",
        "paragraphs": [
          "Amazon's guide on <a href=\"https://www.aboutamazon.com/news/retail/how-to-avoid-amazon-scams\">how to avoid Amazon scams</a> says it will not ask for payment over the phone or email, will never ask you to buy gift cards, and advises against calling numbers found in texts, emails or search results. <a href=\"https://www.aboutamazon.in/news/amazon-india-news/how-to-avoid-scams-impersonating-amazon-this-holiday-season\">Amazon India</a> gives the same advice.",
          "Flipkart's <a href=\"https://stories.flipkart.com/scam-advisory-beware-of-fraudulent-sites-and-fake-offers-misusing-flipkarts-name\">scam advisory</a> says Flipkart will never ask for your password, OTP, PIN or banking details, and warns that once you pay someone outside Flipkart you are unprotected. It names payments to personal UPI IDs or QR codes, fake \"Flipkart Care\" numbers and fake support accounts on WhatsApp as common tricks. Its <a href=\"https://stories.flipkart.com/keep-yourself-safe-otp-fraud\">OTP fraud page</a> adds that representatives never ask for payment OTPs over a call or text."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "A refund never needs you to pay, scan a QR code or enter a PIN. The RBI's <a href=\"https://www.rbi.org.in/commonman/Upload/english/Content/PDFs/English%20BEAWARE.pdf\">BE(A)WARE booklet</a> says there is no need to enter a PIN or password anywhere to receive money, and never to scan a QR code to receive money."
        }
      },
      {
        "heading": "How to check an order, refund or delivery message",
        "checklist": [
          "Do not tap the link, call the number or reply to the message.",
          "Open the Amazon or Flipkart app, or type the website address yourself, and go to Your Orders or My Orders.",
          "If the order, refund or delivery is not there, the message is not real. If it is there, use the help options inside the app.",
          "For calls, hang up and contact support from inside the app. Real support will not ask you to keep the call secret or install a remote access app.",
          "Check your bank or card statement for any charge the message mentions."
        ],
        "paragraphs": [
          "This works for every version of the scam, because the scammer controls the message but not your account."
        ]
      },
      {
        "heading": "Fake order and refund screenshots",
        "paragraphs": [
          "Screenshots appear in these scams in two ways. A fake agent may send a screenshot of a \"refund initiated\" screen or an \"excess refund\" to make the overpayment story look real. And on marketplaces, a buyer or seller may share an order confirmation or delivery screenshot as proof of something that never happened.",
          "A screenshot can be edited or generated in minutes, so it is never proof by itself. The order page in your own account, or the money in your own bank account, is the only thing to trust. For payment screenshots in particular, see our guides on <a href=\"/blog/fake-upi-payment-screenshot/\">fake UPI payment screenshots</a> and <a href=\"/blog/payment-failed-screenshot-scam/\">payment failed screenshots</a>."
        ],
        "cta": {
          "label": "Check a screenshot for edits",
          "url": "/image-manipulation-checker/",
          "description": "Look for editing traces in an order or refund screenshot, processed in your browser."
        }
      },
      {
        "heading": "Fictional example: the refund call",
        "paragraphs": [
          "Arjun searches online for a shopping site's customer care number to ask about a late refund. He calls the first number he finds. The \"agent\" says the refund failed and sends a QR code on WhatsApp to \"receive\" ₹2,499.",
          "Arjun remembers that scanning a QR code and entering a PIN only ever sends money. He hangs up, opens the shopping app, and finds that the refund is already shown as processed to his original payment method. He reports the fake number on cybercrime.gov.in and blocks it."
        ]
      },
      {
        "heading": "What to do if you clicked, paid or shared details",
        "paragraphs": [
          "<strong>India:</strong> call the 1930 helpline and report on cybercrime.gov.in, then contact your bank through its official app. If you shared an OTP or password, change your Amazon or Flipkart password and check your saved cards and addresses. Flipkart's advisory lists its helpline 044-45614700 and @flipkartsupport on X.",
          "<strong>US and elsewhere:</strong> contact your bank or card issuer, change your Amazon password, report the message through Amazon's report-a-scam tool, and report it at ReportFraud.ftc.gov. Forward scam texts to 7726 so your carrier can block similar messages. Our guide to the <a href=\"/blog/fake-customer-care-number-scam/\">fake customer care number scam</a> covers the call version in more detail."
        ]
      },
      {
        "heading": "What ScreenshotChecker can and cannot tell you",
        "paragraphs": [
          "The <a href=\"/screenshot-scam-checker/\">screenshot scam checker</a> reads a screenshot of the text or chat and flags warning signs such as urgency, refund bait and payment requests. The <a href=\"/suspicious-link-checker/\">suspicious link checker</a> looks up a link without opening it.",
          "Neither can see your Amazon or Flipkart account or your bank. A clean result does not make a message genuine; your Your Orders page and bank statement are the answer."
        ]
      }
    ],
    "faq": [
      {
        "question": "I got a text about an Amazon refund I did not request. Is it real?",
        "answer": "Almost certainly not. The FTC has warned about fake Amazon refund and recall texts that lead to phishing pages. Open the Amazon app yourself and check Your Orders; if there is no refund there, delete the text and forward it to 7726 in the US."
      },
      {
        "question": "Does Flipkart ask for OTP or UPI PIN for a refund?",
        "answer": "No. Flipkart says it will never ask for your password, OTP, PIN or banking details, and that its representatives never ask for payment OTPs over a call or text. Refunds go back to your original payment method or Flipkart account without a PIN."
      },
      {
        "question": "Someone called about a suspicious purchase on my Amazon account. What should I do?",
        "answer": "Hang up. Open the Amazon app or website yourself and check your orders and payment methods. Caller ID can be faked, and Amazon does not ask for payment over the phone."
      },
      {
        "question": "How do I find the real Amazon or Flipkart customer care number?",
        "answer": "Use the help or contact options inside the official app or website. Numbers in search results, social media posts and messages are a common source of fake customer care."
      },
      {
        "question": "Can an order or refund screenshot be fake?",
        "answer": "Yes. Screenshots can be edited or generated easily. Check the order in your own account, and for payments, check your own bank or UPI app."
      },
      {
        "question": "Can ScreenshotChecker confirm an Amazon or Flipkart order?",
        "answer": "No. It can flag warning signs in a screenshot, but it has no access to shopping accounts or banks. Check Your Orders in the official app."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["amazon-flipkart-refund-fraud-se-bache", 
      "fake-customer-care-number-scam",
      "qr-code-scam",
      "smishing-fake-sms"
    ],
    "cta": {
      "label": "Check a message screenshot",
      "url": "/screenshot-scam-checker/",
      "description": "See scam warning signs in a refund text, order message or chat screenshot, processed in your browser."
    }
  },
  {
    "slug": "fake-job-offer-letter-kaise-pehchane",
    "lang": "hi",
    "title": "नकली जॉब ऑफ़र लेटर कैसे पहचानें: पैसे या दस्तावेज़ भेजने से पहले जाँचें",
    "seoTitle": "नकली जॉब ऑफ़र लेटर कैसे पहचानें? Fake Offer Letter",
    "metaDescription": "ऑफ़र लेटर के साथ फ़ीस, डिपॉज़िट या लैपटॉप के पैसे माँगे जा रहे हैं? यह ठगी है। नकली ऑफ़र लेटर की पहचान, असली नौकरी की जाँच और शिकायत का तरीका।",
    "category": "Threat Analysis",
    "publishedAt": "2026-11-17",
    "authorName": "Virat Chauhan",
    "readTime": "7 min read",
    "excerpt": "नकली ऑफ़र और अपॉइंटमेंट लेटर कैसे काम करते हैं, लेटर और मैसेज में चेतावनी के निशान, सरकारी और विदेशी नौकरी के फ़र्ज़ी लेटर, असली नौकरी की जाँच का तरीका, और पैसे भेज दिए हों तो क्या करें।",
    "targetKeywords": [
      "fake job offer letter kaise pehchane",
      "नकली ऑफ़र लेटर",
      "fake offer letter",
      "job ke liye paise mangna fraud",
      "fake appointment letter",
      "फर्जी नौकरी ऑफ़र"
    ],
    "keyTakeaway": {
      "title": "असली कंपनी नौकरी देने के पैसे नहीं लेती",
      "text": "ऑफ़र लेटर के बाद रजिस्ट्रेशन, ट्रेनिंग, लैपटॉप, बैकग्राउंड चेक, वीज़ा या \"रिफ़ंडेबल डिपॉज़िट\" के नाम पर पैसे माँगे जाएँ तो इसे ठगी मानिए। नौकरी की पुष्टि कंपनी की अपनी वेबसाइट या HR से कीजिए जिसे आपने ख़ुद खोजा हो, और विदेशी नौकरी में एजेंट का लाइसेंस eMigrate पोर्टल पर देखिए।"
    },
    "introduction": "नकली जॉब ऑफ़र लेटर पहचानने का सबसे आसान नियम: अगर ऑफ़र के बाद किसी भी नाम से पैसे माँगे जाएँ, तो नौकरी असली नहीं है। ऐसे लेटर देखने में बिल्कुल असली लगते हैं: कंपनी का लोगो, उम्मीद से थोड़ी ज़्यादा सैलरी, HR के दस्तख़त और जॉइनिंग की तारीख़। असली चाल अगले मैसेज में आती है, जिसमें फ़ीस, डिपॉज़िट या बैंक की जानकारी माँगी जाती है। यह गाइड बताती है कि ये लेटर कैसे काम करते हैं, लेटर पर कौन से निशान देखें, और नौकरी असली है या नहीं, यह कैसे पक्का करें। <a href=\"/blog/fake-job-offer-letter/\">यह गाइड अंग्रेज़ी में भी है।</a>",
    "contentSections": [
      {
        "heading": "नकली ऑफ़र लेटर वाली ठगी कैसे होती है",
        "paragraphs": [
          "आपको WhatsApp, Telegram, LinkedIn या ईमेल पर नौकरी का विज्ञापन या मैसेज मिलता है। कभी छोटी सी चैट या वीडियो इंटरव्यू होता है, कभी वह भी नहीं। फिर एक सरकारी जैसा दिखने वाला ऑफ़र या अपॉइंटमेंट लेटर आता है, और उसके तुरंत बाद पैसे की माँग।",
          "भारतीय रिज़र्व बैंक की <a href=\"https://www.rbi.org.in/commonman/Upload/english/Content/PDFs/English%20BEAWARE.pdf\">BE(A)WARE पुस्तिका</a> ठीक यही बताती है: नकली इंटरव्यू के बाद नौकरी चाहने वाले से रजिस्ट्रेशन, ज़रूरी ट्रेनिंग या लैपटॉप के नाम पर पैसे ट्रांसफ़र करवाए जाते हैं।"
        ],
        "figure": {
          "afterParagraph": 1,
          "src": "/images/blog/fake-job-offer-letter-kaise-pehchane/fictional-example.png",
          "alt": "एक काल्पनिक IT कंपनी का काल्पनिक ऑफ़र लेटर, जिस पर नंबर वाले निशान हैं: मुफ़्त Gmail पता, बिना इंटरव्यू ऊँची सैलरी, रिफ़ंडेबल लैपटॉप डिपॉज़िट, 24 घंटे की समय सीमा और आधार व बैंक की जानकारी की माँग।",
          "width": 1200,
          "height": 760,
          "caption": "चित्र 1. एक काल्पनिक नकली ऑफ़र लेटर। कंपनी और पता काल्पनिक हैं; ऐसे निशान असली ठगी वाले लेटर में बार-बार दिखते हैं।"
        },
        "callout": {
          "type": "golden-rule",
          "text": "RBI की पुस्तिका साफ़ कहती है: नौकरी देने वाली असली कंपनी कभी पैसे नहीं माँगती।"
        }
      },
      {
        "heading": "लेटर और मैसेज में चेतावनी के निशान",
        "paragraphs": [
          "कोई एक निशान अपने आप में सबूत नहीं है, और असली HR से भी टाइपिंग की गलती हो सकती है। पर ठगी वाले लेटर में इनमें से कई बातें एक साथ होती हैं।"
        ],
        "checklist": [
          "जॉइनिंग से पहले कोई भी पेमेंट: रजिस्ट्रेशन, ट्रेनिंग, सर्टिफ़िकेट, लैपटॉप या किट, बैकग्राउंड चेक, यूनिफ़ॉर्म, वीज़ा या \"रिफ़ंडेबल सिक्योरिटी डिपॉज़िट\"।",
          "बिना असली इंटरव्यू के ऑफ़र, या सिर्फ़ WhatsApp-Telegram चैट वाला इंटरव्यू। Wipro का <a href=\"https://careers.wipro.com/content/Fraud-Awareness/?locale=en_US\">फ्रॉड अवेयरनेस पेज</a> कहता है कि वह भर्ती के किसी भी चरण में फ़ीस नहीं लेता और WhatsApp या Telegram पर इंटरव्यू नहीं करता।",
          "मुफ़्त ईमेल पता, या ऐसा डोमेन जो सिर्फ़ कंपनी जैसा दिखता है (एक शब्द ज़्यादा या अलग एंडिंग)।",
          "पद के हिसाब से बहुत ज़्यादा सैलरी, या काम का धुँधला ब्योरा।",
          "दबाव: 24 घंटे में स्वीकार करें, वरना सीट किसी और को।",
          "बैंक लॉगिन, कार्ड की जानकारी, OTP या UPI PIN की माँग। असली कंपनी बैंक खाते की जानकारी सिर्फ़ सैलरी के लिए, नौकरी लगने के बाद माँगती है।"
        ]
      },
      {
        "heading": "नौकरी असली है या नहीं, कैसे पक्का करें",
        "paragraphs": [
          "जाँच हमेशा उन रास्तों से कीजिए जो आपने ख़ुद खोजे हों, लेटर में दिए नंबर, लिंक या ईमेल से नहीं।"
        ],
        "checklist": [
          "कंपनी की आधिकारिक वेबसाइट ख़ुद सर्च करके खोलिए और देखिए कि उसके करियर पेज पर यह पद है या नहीं।",
          "उसी वेबसाइट पर दिए नंबर या ईमेल से HR से संपर्क कीजिए और ऑफ़र व भर्ती करने वाले का नाम पक्का कीजिए।",
          "भर्ती करने वाले की प्रोफ़ाइल देखिए: नया अकाउंट, बहुत कम कनेक्शन या स्टॉक फ़ोटो चेतावनी है। <a href=\"/reverse-image-search/\">रिवर्स इमेज सर्च</a> से पता चल सकता है कि प्रोफ़ाइल फ़ोटो कहीं और से तो नहीं ली गई।",
          "लेटर ध्यान से पढ़िए: कंपनी का नाम, पता और रजिस्ट्रेशन नंबर असली रिकॉर्ड से मिलते हैं? दस्तख़त करने वाला व्यक्ति सच में उस कंपनी में है?",
          "ऑफ़र पक्का होने तक न पैसे दीजिए, न आधार, PAN, पासपोर्ट या बैंक की जानकारी।"
        ]
      },
      {
        "heading": "सरकारी नौकरी के नकली अपॉइंटमेंट लेटर",
        "paragraphs": [
          "नकली अपॉइंटमेंट लेटर अक्सर सरकारी विभागों के नाम से बनते हैं। इंडिया पोस्ट ने <a href=\"https://www.pib.gov.in/PressReleasePage.aspx?PRID=1969732\">2023 की सूचना</a> में बताया कि नकली सिलेक्शन ऑर्डर और ऑफ़र लेटर से पैसे माँगे जा रहे हैं, और वह नौकरी से पहले किसी भी रूप में पैसे नहीं लेता। आयकर विभाग ने <a href=\"https://www.pib.gov.in/PressReleasePage.aspx?PRID=1714095\">2021 में</a> WhatsApp पर घूम रहे आयकर अधिकारी के नकली अपॉइंटमेंट लेटर के बारे में चेताया और लोगों को SSC और UPSC की आधिकारिक वेबसाइट देखने को कहा।",
          "सरकारी भर्ती प्रकाशित नोटिफ़िकेशन, परीक्षा और आधिकारिक वेबसाइट पर रिज़ल्ट से होती है। बिना कोई परीक्षा दिए WhatsApp पर आया लेटर, या जॉइनिंग पक्की करने के लिए फ़ीस माँगने वाला लेटर, सरकारी नौकरी का तरीका नहीं है। मई 2026 में आवास और शहरी कार्य मंत्रालय ने भी पैसे माँगने वाले एक <a href=\"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2260999\">नकली भर्तीकर्ता के बारे में चेताया</a> और कहा कि पैसे न दें और नेशनल साइबर क्राइम रिपोर्टिंग पोर्टल पर शिकायत करें।"
        ]
      },
      {
        "heading": "विदेश में नौकरी का ऑफ़र: एजेंट का लाइसेंस जाँचें",
        "paragraphs": [
          "कनाडा, यूरोप, इज़राइल या खाड़ी देशों की नौकरी के ऑफ़र, जो Facebook या WhatsApp पर आते हैं, नकली लेटर और यहाँ तक कि मानव तस्करी का भी आम रास्ता हैं। विदेश मंत्रालय की <a href=\"https://www.pib.gov.in/PressReleasePage.aspx?PRID=1985025\">अवैध भर्ती एजेंटों के ख़िलाफ़ एडवाइज़री</a> कहती है कि एजेंट को eMigrate पोर्टल (emigrate.gov.in) पर सक्रिय भर्ती एजेंटों की सूची में जाँचें। लाइसेंस वाला एजेंट सर्विस चार्ज के रूप में ज़्यादा से ज़्यादा ₹30,000 और 18% GST ले सकता है, वह भी रसीद के साथ।",
          "बिना रजिस्ट्रेशन वाले एजेंटों पर छापों में नकली विदेशी ऑफ़र लेटर मिले हैं। <a href=\"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2136419\">जून 2025 की PIB रिलीज़</a> ऐसी ही एक ज़ब्ती बताती है और दोहराती है कि MEA लाइसेंस के बिना कोई विदेशी नौकरी के लिए भर्ती नहीं कर सकता। एजेंट सूची में न हो, या तय फ़ीस से ज़्यादा माँगे, तो पैसे न दें।"
        ]
      },
      {
        "heading": "पैसे दे दिए या दस्तावेज़ भेज दिए? तुरंत यह करें",
        "paragraphs": [
          "जितनी जल्दी हो सके 1930 साइबर फ्रॉड हेल्पलाइन पर कॉल कीजिए और नेशनल साइबर क्राइम रिपोर्टिंग पोर्टल (cybercrime.gov.in) पर शिकायत दर्ज कीजिए, जैसा <a href=\"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2036395\">गृह मंत्रालय सलाह देता है</a>। अपने बैंक को उसके आधिकारिक ऐप या हेल्पलाइन से बताइए। अगर आधार या PAN भेजा है, तो अपने नाम पर खुले किसी लोन या खाते पर नज़र रखिए।",
          "लेटर, चैट के स्क्रीनशॉट, पेमेंट की रसीद और भर्ती करने वाले के नंबर व प्रोफ़ाइल संभालकर रखिए। ये स्क्रीनशॉट किसी और को भेजने से पहले <a href=\"/screenshot-redactor/\">स्क्रीनशॉट रिडैक्टर</a> से अपनी निजी जानकारी छिपा सकते हैं। काम के बदले पैसे वाली ठगी के लिए हमारी <a href=\"/blog/task-job-scam-se-kaise-bache/\">टास्क जॉब स्कैम गाइड</a> पढ़िए।"
        ],
        "callout": {
          "type": "warning",
          "text": "\"पैसे वापस दिलाने\" का वादा करने वाले कॉल या एजेंट भी अक्सर उसी ठगी का अगला हिस्सा होते हैं। रिकवरी के लिए किसी को फ़ीस न दें।"
        }
      },
      {
        "heading": "ScreenshotChecker क्या बता सकता है और क्या नहीं",
        "paragraphs": [
          "<a href=\"/screenshot-scam-checker/\">स्क्रीनशॉट स्कैम चेकर</a> भर्ती करने वाले की चैट या ऑफ़र के स्क्रीनशॉट को पढ़कर फ़ीस, जल्दबाज़ी और पैसे या निजी जानकारी की माँग जैसे निशान दिखाता है। <a href=\"/suspicious-link-checker/\">संदिग्ध लिंक चेकर</a> मैसेज के लिंक को खोले बिना उसकी जानकारी देखता है।",
          "इनमें से कोई भी टूल यह पक्का नहीं कर सकता कि नौकरी असली है या लेटर कंपनी ने भेजा है। यह सिर्फ़ कंपनी ख़ुद बता सकती है, जिससे आप ख़ुद खोजे गए रास्ते से संपर्क करें।"
        ]
      }
    ],
    "faq": [
      {
        "question": "जॉब ऑफ़र लेटर असली है या नकली, कैसे पता करें?",
        "answer": "पैसे की माँग, मुफ़्त या मिलता-जुलता ईमेल पता, बिना असली इंटरव्यू ऑफ़र, बहुत ज़्यादा सैलरी और जल्दी स्वीकार करने का दबाव देखिए। फिर कंपनी की आधिकारिक वेबसाइट से HR से संपर्क करके ऑफ़र पक्का कीजिए, लेटर में दिए नंबर से नहीं।"
      },
      {
        "question": "क्या ऑफ़र लेटर के बाद सिक्योरिटी डिपॉज़िट माँगना सामान्य है?",
        "answer": "नहीं। असली कंपनियाँ जॉइनिंग, ट्रेनिंग, लैपटॉप या डिपॉज़िट के पैसे नहीं लेतीं। RBI कहता है कि नौकरी देने वाली असली कंपनी कभी पैसे नहीं माँगती।"
      },
      {
        "question": "विदेशी नौकरी का एजेंट असली है या नहीं, कैसे जाँचें?",
        "answer": "eMigrate पोर्टल (emigrate.gov.in) पर सक्रिय भर्ती एजेंटों की सूची में एजेंट का नाम खोजिए। विदेश मंत्रालय के अनुसार लाइसेंस वाला एजेंट ज़्यादा से ज़्यादा ₹30,000 और GST ले सकता है, रसीद के साथ।"
      },
      {
        "question": "क्या नकली लेटर पर असली कंपनी का नाम और लोगो हो सकता है?",
        "answer": "हाँ। ठग लोगो, लेटरहेड और असली कर्मचारियों के नाम तक कॉपी कर लेते हैं। इसलिए लेटर देखकर फ़ैसला न करें, कंपनी से सीधे पुष्टि करें।"
      },
      {
        "question": "नकली नौकरी के लिए फ़ीस भर दी, अब क्या करूँ?",
        "answer": "तुरंत 1930 पर कॉल कीजिए, cybercrime.gov.in पर शिकायत दर्ज कीजिए और अपने बैंक को बताइए। सारी चैट और रसीदें संभालकर रखिए।"
      },
      {
        "question": "क्या ScreenshotChecker बता सकता है कि ऑफ़र लेटर असली है?",
        "answer": "नहीं। यह ऑफ़र या चैट के स्क्रीनशॉट में चेतावनी के निशान दिखा सकता है, पर नौकरी या कंपनी असली है यह पक्का नहीं कर सकता। यह सिर्फ़ कंपनी अपने आधिकारिक रास्ते से बता सकती है।"
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": [
      "task-job-scam-se-kaise-bache",
      "fake-job-offer-letter",
      "fake-payment-screenshot-kaise-pehchane"
    ],
    "cta": {
      "label": "ऑफ़र का स्क्रीनशॉट जाँचें",
      "url": "/screenshot-scam-checker/",
      "description": "भर्ती करने वाले की चैट या ऑफ़र लेटर के स्क्रीनशॉट में ठगी के निशान देखें, आपके ब्राउज़र में।"
    }
  },
  {
    "slug": "loan-app-harassment-morphed-photos",
    "title": "Loan App Harassment and Morphed Photo Threats: What to Do Now",
    "seoTitle": "Loan App Harassment or Morphed Photos? What to Do Now",
    "metaDescription": "An instant loan app is threatening you or your contacts with morphed photos? Do not pay more under threat. Save evidence, report on 1930 and Sachet.",
    "category": "Threat Analysis",
    "publishedAt": "2026-11-17",
    "authorName": "Virat Chauhan",
    "readTime": "8 min read",
    "excerpt": "How illegal instant loan apps trap borrowers, the warning signs before you install one, what to do if recovery agents threaten you or send morphed photos to your contacts, and how to check whether a lending app is linked to an RBI-regulated lender.",
    "targetKeywords": [
      "loan app harassment",
      "loan app morphed photos",
      "instant loan app fraud",
      "illegal loan app complaint",
      "loan app threatening contacts",
      "how to check loan app is rbi approved"
    ],
    "keyTakeaway": {
      "title": "Threats over a loan app debt are a crime: report them, do not pay more",
      "text": "If a loan app or its \"recovery agents\" threaten you, message your contacts or send morphed photos, keep screenshots of everything, call 1930 or report at cybercrime.gov.in, and report the app on the RBI's Sachet portal. Paying extra under threat does not guarantee the harassment stops. Warn your contacts that any edited photos are fake."
    },
    "introduction": "If an instant loan app is threatening you, calling your contacts or sending morphed photos, stop paying the threatening numbers, save screenshots of every message and call, report at cybercrime.gov.in or on the 1930 helpline, and report the app on the RBI's Sachet portal. Then tell the people in your contact list that any edited photos or messages about you are fake. The Reserve Bank of India warned as early as <a href=\"https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=50846\">December 2020</a> about unauthorised lending apps that charge excessive interest and hidden fees, use high-handed recovery methods and misuse access to data on borrowers' phones. This guide explains how these apps work, how to spot one before you borrow, and what to do if you are already being harassed.",
    "contentSections": [
      {
        "heading": "How illegal loan apps trap borrowers",
        "paragraphs": [
          "The pattern is well known. An app or a WhatsApp message promises a quick loan with no paperwork. To \"verify\" you, the app asks for access to your contacts, photos and messages. The loan arrives, often much smaller than promised after unexplained fees are cut, and the repayment date comes within days. Then the demands grow: more interest, late fees, a \"settlement\" amount several times what you borrowed.",
          "When a borrower cannot or will not pay, the harassment starts: abusive calls, messages to everyone in the phone's contact list, and photos of the borrower edited into obscene or humiliating images. The RBI's press release describes exactly these complaints: <em>excessive rates of interest and additional hidden charges, adoption of unacceptable and high-handed recovery methods, and misuse of agreements to access data on the mobile phones of the borrowers.</em>"
        ],
        "figure": {
          "afterParagraph": 1,
          "src": "/images/blog/loan-app-harassment-morphed-photos/fictional-example.png",
          "alt": "Fictional WhatsApp message from a made-up loan recovery agent with numbered warning signs: an unknown number, a demand three times the loan, a threat to send morphed photos to contacts, a one-hour deadline and an app with no named bank or NBFC.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional harassment message from a made-up loan app. The names and numbers are invented; the tactics are the ones borrowers report."
        },
        "callout": {
          "type": "golden-rule",
          "text": "Recovery by threats, abuse or morphed photos is not a legitimate way to collect a debt. Whatever you owe, harassment is something to report, not something to pay off."
        }
      },
      {
        "heading": "Warning signs before you install a loan app",
        "paragraphs": [
          "Many harassment cases begin with an app that should never have been installed. Look for these signs first."
        ],
        "checklist": [
          "The app does not name the bank or NBFC that is lending the money. The RBI has required digital lending platforms working for banks and NBFCs to disclose the lender's name upfront to customers.",
          "It asks for access to your contacts, photo gallery or messages to approve a loan.",
          "It is shared as an APK file or a link on WhatsApp, Telegram or SMS instead of an official app store listing.",
          "It asks for a processing or \"insurance\" fee before the loan is paid out.",
          "You are not shown a Key Fact Statement with the all-in annual cost of the loan before you accept. The RBI's <a href=\"https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=12382&Mode=0\">digital lending rules</a> require lenders to give borrowers a Key Fact Statement, including the annual percentage rate (APR), before the contract is signed.",
          "The repayment period is a few days and the amount you receive is far below the amount you must repay."
        ]
      },
      {
        "heading": "How to check whether a loan app is linked to an RBI-regulated lender",
        "paragraphs": [
          "Legitimate lending can be done by banks, NBFCs registered with the RBI and lenders regulated by state money-lending laws, as the RBI's caution notice explains. Since mid-2025 the RBI has also published a list of digital lending apps deployed by the banks and NBFCs it regulates, reached from the Citizen's Corner section of the RBI website, as <a href=\"https://www.business-standard.com/amp/finance/personal-finance/avoiding-fraudulent-loan-apps-rbi-listing-ratings-reviews-key-to-safety-125070900931_1.html\">Business Standard reported</a>. Search that list for the app, then check that the lender named inside the app matches.",
          "An app that is missing from the list, names no lender, or names a lender that does not mention the app on its own website should be treated as unauthorised. The RBI's advice is to verify the company offering the loan and never share copies of KYC documents with unverified apps."
        ]
      },
      {
        "heading": "What to do if a loan app is harassing you",
        "paragraphs": [
          "Act calmly and in this order. You do not have to prove the photos are fake to report the harassment: threatening and sharing edited images of someone is the crime."
        ],
        "checklist": [
          "<strong>Stop paying the threatening numbers.</strong> Paying extra under threat does not guarantee the messages stop, and new demands often follow.",
          "<strong>Save evidence first:</strong> screenshots of messages, call logs, the numbers and UPI IDs that contacted you, the app's name and the payment receipts. Keep the original files.",
          "<strong>Report it:</strong> call the 1930 cyber fraud helpline or file a complaint at cybercrime.gov.in, which also has a category for crimes against women and children. You can also go to your nearest police station.",
          "<strong>Report the app on <a href=\"https://sachet.rbi.org.in\">Sachet</a></strong>, the RBI portal the central bank asks people to use for complaints about unauthorised lending apps, and report the listing to the app store.",
          "<strong>Warn your contacts</strong> with a short message: an illegal loan app has my contact list and may send edited photos or false messages about me; please ignore and report them.",
          "<strong>Remove the app's access:</strong> after you have saved the evidence, revoke its permissions for contacts, photos and messages, then uninstall it. Change passwords if you entered any into the app.",
          "<strong>If the loan came from a real RBI-regulated lender</strong> whose agents are misbehaving, complain to the lender first, then to the RBI Ombudsman at cms.rbi.org.in."
        ],
        "callout": {
          "type": "warning",
          "text": "Be wary of anyone who calls offering to \"settle\" the loan or \"delete your data\" for a fee. These calls often come from the same people."
        }
      },
      {
        "heading": "Morphed photos: removal and support",
        "paragraphs": [
          "Morphed photos usually start from a profile picture or a selfie taken from your phone, edited onto another image. A <a href=\"/reverse-image-search/\">reverse image search</a> of the edited picture can help you find the original photo it was made from, which is useful evidence for your complaint. The <a href=\"/image-manipulation-checker/\">photo manipulation checker</a> may show areas with a different editing history, but it gives clues, not proof, and you do not need it to report the crime.",
          "If an intimate image has been made or shared without your consent and you are 18 or older, <a href=\"https://stopncii.org\">StopNCII.org</a> lets you create a digital fingerprint of the image on your own device so that participating platforms can block it, without uploading the image itself. Report posts directly to the platform as well, and mention your cybercrime complaint number."
        ]
      },
      {
        "heading": "How ScreenshotChecker can help, and what it cannot do",
        "paragraphs": [
          "The <a href=\"/screenshot-scam-checker/\">screenshot scam checker</a> reads a screenshot of a loan offer or recovery message and flags warning signs such as threats, deadlines and payment demands. Before you share screenshots in a complaint or with family, the <a href=\"/screenshot-redactor/\">screenshot redactor</a> can hide your account numbers and other details that are not needed.",
          "No tool can tell you whether a lender is licensed or make harassment stop. Use the RBI's own list and the official complaint channels for that."
        ]
      }
    ],
    "faq": [
      {
        "question": "A loan app is sending my morphed photos to my contacts. What should I do?",
        "answer": "Do not pay more under threat. Save screenshots of the messages and numbers, call 1930 or file a complaint at cybercrime.gov.in, report the app on the RBI's Sachet portal, and warn your contacts that any edited photos are fake. You can also file a complaint at your nearest police station."
      },
      {
        "question": "How do I check if a loan app is RBI approved?",
        "answer": "The RBI publishes a list of digital lending apps deployed by the banks and NBFCs it regulates, reached from the Citizen's Corner section of its website. Check that the app is on the list and that the lender named inside the app matches. An app that names no bank or NBFC should be avoided."
      },
      {
        "question": "Do I still have to repay a loan from an illegal app?",
        "answer": "Harassment is a separate matter from the debt. If the app is linked to a regulated lender, you can repay the amount actually owed through official channels and complain about the recovery behaviour. If the app is unauthorised, report it and get advice from the police or a lawyer before paying anything more, especially demands far above what you received."
      },
      {
        "question": "Where do I complain about a loan app in India?",
        "answer": "Report harassment and fraud on the 1930 helpline or cybercrime.gov.in, report unauthorised lending apps on the RBI's Sachet portal (sachet.rbi.org.in), and complain about a regulated lender's conduct to the lender and then the RBI Ombudsman at cms.rbi.org.in."
      },
      {
        "question": "Will paying the recovery agents stop the harassment?",
        "answer": "Not reliably. Paying under threat can lead to new demands. Reporting, warning your contacts and removing the app's access to your phone are more effective first steps."
      },
      {
        "question": "Can ScreenshotChecker prove that a photo of me was morphed?",
        "answer": "It can show clues, such as areas with a different editing history or an earlier original found by reverse image search, but it cannot prove it. You do not need proof from a tool to report harassment: the threats and the sharing are the offence."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["loan-app-harassment-kya-kare", 
      "digital-arrest-scam",
      "fake-customer-care-number-scam",
      "whatsapp-telegram-task-job-scam"
    ],
    "cta": {
      "label": "Check a loan message screenshot",
      "url": "/screenshot-scam-checker/",
      "description": "See warning signs such as threats, deadlines and payment demands in a loan offer or recovery message, processed in your browser."
    }
  },
  {
    "slug": "loan-app-harassment-kya-kare",
    "lang": "hi",
    "title": "लोन ऐप से परेशान? मॉर्फ़ की हुई फ़ोटो की धमकी मिले तो क्या करें",
    "seoTitle": "लोन ऐप हैरेसमेंट: मॉर्फ़ फ़ोटो की धमकी पर क्या करें",
    "metaDescription": "लोन ऐप वाले धमका रहे हैं या कॉन्टैक्ट्स को मॉर्फ़ फ़ोटो भेज रहे हैं? डर में और पैसे न भरें। सबूत रखें, 1930 और Sachet पर शिकायत करें।",
    "category": "Threat Analysis",
    "publishedAt": "2026-11-17",
    "authorName": "Virat Chauhan",
    "readTime": "7 min read",
    "excerpt": "अवैध इंस्टेंट लोन ऐप कैसे फँसाते हैं, ऐप डाउनलोड करने से पहले चेतावनी के निशान, रिकवरी एजेंट धमकाएँ या मॉर्फ़ फ़ोटो भेजें तो क्या करें, और कैसे जाँचें कि ऐप RBI से जुड़े लेंडर का है या नहीं।",
    "targetKeywords": [
      "loan app harassment kya kare",
      "लोन ऐप हैरेसमेंट",
      "loan app morph photo complaint",
      "लोन ऐप की शिकायत कहाँ करें",
      "instant loan app fraud",
      "loan app wale dhamki de rahe hai"
    ],
    "keyTakeaway": {
      "title": "लोन ऐप की धमकी अपराध है: शिकायत कीजिए, और पैसे मत भरिए",
      "text": "अगर लोन ऐप या उसके \"रिकवरी एजेंट\" आपको धमकाएँ, आपके कॉन्टैक्ट्स को मैसेज करें या मॉर्फ़ फ़ोटो भेजें, तो हर चीज़ का स्क्रीनशॉट रखिए, 1930 पर कॉल कीजिए या cybercrime.gov.in पर शिकायत कीजिए, और RBI के Sachet पोर्टल पर ऐप की शिकायत कीजिए। डर में ज़्यादा पैसे भरने से धमकियाँ रुकने की कोई गारंटी नहीं। अपने कॉन्टैक्ट्स को बता दीजिए कि कोई भी एडिट की हुई फ़ोटो नकली है।"
    },
    "introduction": "अगर कोई इंस्टेंट लोन ऐप आपको धमका रहा है, आपके कॉन्टैक्ट्स को कॉल कर रहा है या मॉर्फ़ की हुई फ़ोटो भेज रहा है, तो धमकाने वाले नंबरों पर पैसे भेजना बंद कीजिए, हर मैसेज और कॉल का स्क्रीनशॉट रखिए, cybercrime.gov.in या 1930 हेल्पलाइन पर शिकायत कीजिए, और RBI के Sachet पोर्टल पर ऐप की शिकायत कीजिए। फिर अपनी कॉन्टैक्ट लिस्ट के लोगों को बता दीजिए कि आपके बारे में आने वाली कोई भी एडिट की हुई फ़ोटो या मैसेज नकली है। भारतीय रिज़र्व बैंक ने <a href=\"https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=50846\">दिसंबर 2020</a> में ही ऐसे अनधिकृत लेंडिंग ऐप्स के बारे में चेताया था जो बहुत ज़्यादा ब्याज और छिपे चार्ज लेते हैं, सख़्त और ग़लत तरीक़े से वसूली करते हैं और उधार लेने वालों के फ़ोन के डेटा का ग़लत इस्तेमाल करते हैं। <a href=\"/blog/loan-app-harassment-morphed-photos/\">यह गाइड अंग्रेज़ी में भी है।</a>",
    "contentSections": [
      {
        "heading": "अवैध लोन ऐप कैसे फँसाते हैं",
        "paragraphs": [
          "तरीक़ा जाना-पहचाना है। कोई ऐप या WhatsApp मैसेज बिना काग़ज़ के तुरंत लोन का वादा करता है। \"वेरिफ़िकेशन\" के नाम पर ऐप आपके कॉन्टैक्ट्स, फ़ोटो और मैसेज की अनुमति माँगता है। लोन आता है, पर अनजान फ़ीस कटने के बाद वादे से काफ़ी कम, और चुकाने की तारीख़ कुछ ही दिन में। फिर माँग बढ़ती जाती है: और ब्याज, लेट फ़ीस, और लोन से कई गुना \"सेटलमेंट\" रकम।",
          "जब उधार लेने वाला नहीं चुका पाता, तो परेशान करना शुरू होता है: गाली-गलौज वाले कॉल, फ़ोन की पूरी कॉन्टैक्ट लिस्ट को मैसेज, और उधार लेने वाले की फ़ोटो को अश्लील या शर्मनाक तस्वीरों में एडिट करना। RBI की प्रेस रिलीज़ ठीक इन्हीं शिकायतों का ज़िक्र करती है: बहुत ज़्यादा ब्याज और छिपे चार्ज, अस्वीकार्य और सख़्त वसूली के तरीक़े, और उधार लेने वालों के फ़ोन के डेटा तक पहुँच का ग़लत इस्तेमाल।"
        ],
        "figure": {
          "afterParagraph": 1,
          "src": "/images/blog/loan-app-harassment-kya-kare/fictional-example.png",
          "alt": "एक काल्पनिक लोन रिकवरी एजेंट का काल्पनिक WhatsApp मैसेज, जिस पर नंबर वाले निशान हैं: अनजान नंबर, लोन से तीन गुना माँग, कॉन्टैक्ट्स को मॉर्फ़ फ़ोटो भेजने की धमकी, एक घंटे की समय सीमा और बैंक या NBFC का नाम न बताने वाला ऐप।",
          "width": 1200,
          "height": 760,
          "caption": "चित्र 1. एक काल्पनिक लोन ऐप का काल्पनिक धमकी भरा मैसेज। नाम और नंबर बनाए हुए हैं; तरीक़े वही हैं जो उधार लेने वाले बताते हैं।"
        },
        "callout": {
          "type": "golden-rule",
          "text": "धमकी, गाली या मॉर्फ़ फ़ोटो से वसूली कोई जायज़ तरीक़ा नहीं है। आप पर जितना भी बकाया हो, परेशान किया जाना शिकायत करने की बात है, पैसे देकर निपटाने की नहीं।"
        }
      },
      {
        "heading": "लोन ऐप डाउनलोड करने से पहले चेतावनी के निशान",
        "paragraphs": [
          "बहुत से मामले ऐसे ऐप से शुरू होते हैं जिसे इंस्टॉल ही नहीं करना चाहिए था। पहले ये निशान देखिए।"
        ],
        "checklist": [
          "ऐप यह नहीं बताता कि पैसा कौन सा बैंक या NBFC दे रहा है। RBI ने बैंक और NBFC की ओर से काम करने वाले डिजिटल लेंडिंग प्लेटफ़ॉर्म के लिए लेंडर का नाम ग्राहक को शुरू में ही बताना ज़रूरी किया है।",
          "लोन पास करने के लिए कॉन्टैक्ट्स, फ़ोटो गैलरी या मैसेज की अनुमति माँगता है।",
          "ऐप स्टोर की जगह WhatsApp, Telegram या SMS पर APK फ़ाइल या लिंक से भेजा जाता है।",
          "लोन मिलने से पहले प्रोसेसिंग या \"इंश्योरेंस\" फ़ीस माँगता है।",
          "लोन स्वीकार करने से पहले सालाना कुल लागत (APR) वाला Key Fact Statement नहीं दिखाता। RBI के <a href=\"https://www.rbi.org.in/scripts/NotificationUser.aspx?Id=12382&Mode=0\">डिजिटल लेंडिंग नियम</a> कहते हैं कि कॉन्ट्रैक्ट से पहले उधार लेने वाले को APR समेत Key Fact Statement देना ज़रूरी है।",
          "चुकाने की अवधि कुछ ही दिन है और हाथ में आने वाली रकम चुकाने वाली रकम से बहुत कम है।"
        ]
      },
      {
        "heading": "कैसे जाँचें कि लोन ऐप RBI से जुड़े लेंडर का है",
        "paragraphs": [
          "RBI की चेतावनी के अनुसार जायज़ लोन बैंक, RBI में रजिस्टर्ड NBFC और राज्य के साहूकारी क़ानूनों के तहत नियंत्रित लेंडर दे सकते हैं। 2025 के मध्य से RBI अपनी वेबसाइट पर अपने नियंत्रण वाले बैंकों और NBFC के डिजिटल लेंडिंग ऐप्स की सूची भी दिखाता है, जो Citizen's Corner सेक्शन से खुलती है, जैसा <a href=\"https://www.business-standard.com/amp/finance/personal-finance/avoiding-fraudulent-loan-apps-rbi-listing-ratings-reviews-key-to-safety-125070900931_1.html\">Business Standard ने बताया</a>। उस सूची में ऐप खोजिए, फिर देखिए कि ऐप के अंदर लिखे लेंडर का नाम मेल खाता है या नहीं।",
          "जो ऐप सूची में नहीं है, किसी लेंडर का नाम नहीं बताता, या जिस लेंडर का नाम बताता है उसकी अपनी वेबसाइट पर उस ऐप का ज़िक्र नहीं, उसे अनधिकृत मानिए। RBI की सलाह है कि लोन देने वाली कंपनी की जाँच कीजिए और KYC दस्तावेज़ों की कॉपी किसी अनजान ऐप को न दीजिए।"
        ]
      },
      {
        "heading": "लोन ऐप परेशान कर रहा हो तो क्या करें",
        "paragraphs": [
          "शांत रहकर इसी क्रम में कदम उठाइए। शिकायत के लिए यह साबित करना ज़रूरी नहीं कि फ़ोटो नकली है: किसी को धमकाना और उसकी एडिट की हुई तस्वीरें भेजना ही अपराध है।"
        ],
        "checklist": [
          "<strong>धमकाने वाले नंबरों पर पैसे भेजना बंद कीजिए।</strong> डर में ज़्यादा पैसे देने से मैसेज रुकने की गारंटी नहीं, और अक्सर नई माँग आ जाती है।",
          "<strong>पहले सबूत सँभालिए:</strong> मैसेज के स्क्रीनशॉट, कॉल लॉग, संपर्क करने वाले नंबर और UPI ID, ऐप का नाम और पेमेंट की रसीदें। असली फ़ाइलें रखिए।",
          "<strong>शिकायत कीजिए:</strong> 1930 साइबर फ्रॉड हेल्पलाइन पर कॉल कीजिए या cybercrime.gov.in पर शिकायत दर्ज कीजिए, जहाँ महिलाओं और बच्चों से जुड़े अपराधों की अलग श्रेणी भी है। नज़दीकी पुलिस स्टेशन भी जा सकते हैं।",
          "<strong>ऐप की शिकायत <a href=\"https://sachet.rbi.org.in\">Sachet</a> पर कीजिए</strong>, जिसे RBI अनधिकृत लेंडिंग ऐप्स की शिकायत के लिए इस्तेमाल करने को कहता है, और ऐप स्टोर पर भी लिस्टिंग की रिपोर्ट कीजिए।",
          "<strong>अपने कॉन्टैक्ट्स को पहले ही बता दीजिए:</strong> एक अवैध लोन ऐप के पास मेरी कॉन्टैक्ट लिस्ट है, वह मेरे बारे में एडिट की हुई फ़ोटो या झूठे मैसेज भेज सकता है, कृपया उन्हें नज़रअंदाज़ करें और रिपोर्ट करें।",
          "<strong>ऐप की पहुँच हटाइए:</strong> सबूत सँभालने के बाद कॉन्टैक्ट्स, फ़ोटो और मैसेज की अनुमति वापस लीजिए, फिर ऐप अनइंस्टॉल कीजिए। ऐप में कोई पासवर्ड डाला हो तो उसे बदल दीजिए।",
          "<strong>अगर लोन किसी असली, RBI से नियंत्रित लेंडर का है</strong> और उसके एजेंट बदसलूकी कर रहे हैं, तो पहले लेंडर से शिकायत कीजिए, फिर cms.rbi.org.in पर RBI लोकपाल से।"
        ],
        "callout": {
          "type": "warning",
          "text": "जो लोग फ़ीस लेकर लोन \"सेटल\" करवाने या \"आपका डेटा डिलीट\" करवाने का वादा करें, उनसे सावधान रहिए। ऐसे कॉल अक्सर उन्हीं लोगों से आते हैं।"
        }
      },
      {
        "heading": "मॉर्फ़ फ़ोटो: हटवाना और मदद",
        "paragraphs": [
          "मॉर्फ़ फ़ोटो अक्सर आपकी प्रोफ़ाइल फ़ोटो या फ़ोन से ली गई सेल्फ़ी को किसी और तस्वीर पर चिपकाकर बनाई जाती है। एडिट की गई तस्वीर का <a href=\"/reverse-image-search/\">रिवर्स इमेज सर्च</a> उस असली फ़ोटो तक पहुँचा सकता है जिससे वह बनी, जो शिकायत में काम का सबूत है। <a href=\"/image-manipulation-checker/\">फ़ोटो मैनिपुलेशन चेकर</a> अलग एडिटिंग वाले हिस्से दिखा सकता है, पर वह संकेत देता है, सबूत नहीं, और अपराध की शिकायत के लिए इसकी ज़रूरत भी नहीं।",
          "अगर आपकी सहमति के बिना कोई निजी तस्वीर बनाई या फैलाई गई है और आपकी उम्र 18 या ज़्यादा है, तो <a href=\"https://stopncii.org\">StopNCII.org</a> पर आप अपने ही फ़ोन में उस तस्वीर का डिजिटल फ़िंगरप्रिंट बना सकते हैं, ताकि जुड़े हुए प्लेटफ़ॉर्म उसे रोक सकें; तस्वीर ख़ुद अपलोड नहीं होती। प्लेटफ़ॉर्म पर सीधे भी रिपोर्ट कीजिए और अपनी साइबर क्राइम शिकायत का नंबर बताइए।"
        ]
      },
      {
        "heading": "ScreenshotChecker क्या कर सकता है और क्या नहीं",
        "paragraphs": [
          "<a href=\"/screenshot-scam-checker/\">स्क्रीनशॉट स्कैम चेकर</a> लोन ऑफ़र या रिकवरी मैसेज के स्क्रीनशॉट में धमकी, समय सीमा और पैसे की माँग जैसे निशान दिखाता है। शिकायत में या परिवार को स्क्रीनशॉट भेजने से पहले <a href=\"/screenshot-redactor/\">स्क्रीनशॉट रिडैक्टर</a> से खाता नंबर जैसी ग़ैरज़रूरी जानकारी छिपा सकते हैं।",
          "कोई भी टूल यह नहीं बता सकता कि लेंडर लाइसेंस वाला है, न ही परेशान करना रोक सकता है। उसके लिए RBI की अपनी सूची और आधिकारिक शिकायत के रास्ते इस्तेमाल कीजिए।"
        ]
      }
    ],
    "faq": [
      {
        "question": "लोन ऐप वाले मेरी मॉर्फ़ फ़ोटो कॉन्टैक्ट्स को भेज रहे हैं, क्या करूँ?",
        "answer": "डर में और पैसे न भरें। मैसेज और नंबरों के स्क्रीनशॉट रखिए, 1930 पर कॉल कीजिए या cybercrime.gov.in पर शिकायत कीजिए, RBI के Sachet पोर्टल पर ऐप की शिकायत कीजिए, और कॉन्टैक्ट्स को बताइए कि एडिट की हुई फ़ोटो नकली है। नज़दीकी पुलिस स्टेशन में भी शिकायत कर सकते हैं।"
      },
      {
        "question": "कैसे पता करें कि लोन ऐप RBI से मान्य है?",
        "answer": "RBI अपनी वेबसाइट के Citizen's Corner सेक्शन में अपने नियंत्रण वाले बैंकों और NBFC के डिजिटल लेंडिंग ऐप्स की सूची दिखाता है। देखिए कि ऐप सूची में है और ऐप के अंदर लिखा लेंडर उससे मेल खाता है। जो ऐप किसी बैंक या NBFC का नाम न बताए, उससे दूर रहिए।"
      },
      {
        "question": "क्या अवैध ऐप का लोन फिर भी चुकाना होगा?",
        "answer": "परेशान किया जाना कर्ज़ से अलग मामला है। अगर ऐप किसी नियंत्रित लेंडर से जुड़ा है, तो असल बकाया आधिकारिक रास्ते से चुका सकते हैं और वसूली के तरीक़े की शिकायत कर सकते हैं। अगर ऐप अनधिकृत है, तो पहले शिकायत कीजिए और कुछ भी और भरने से पहले पुलिस या वकील से सलाह लीजिए, ख़ासकर जब माँग मिले पैसे से कहीं ज़्यादा हो।"
      },
      {
        "question": "लोन ऐप की शिकायत कहाँ करें?",
        "answer": "धमकी और ठगी की शिकायत 1930 हेल्पलाइन या cybercrime.gov.in पर, अनधिकृत लेंडिंग ऐप की शिकायत RBI के Sachet पोर्टल (sachet.rbi.org.in) पर, और किसी नियंत्रित लेंडर के बर्ताव की शिकायत पहले उस लेंडर से और फिर cms.rbi.org.in पर RBI लोकपाल से कीजिए।"
      },
      {
        "question": "क्या रिकवरी एजेंट को पैसे देने से परेशान करना बंद हो जाएगा?",
        "answer": "भरोसे से नहीं। धमकी में पैसे देने से नई माँग आ सकती है। शिकायत करना, कॉन्टैक्ट्स को पहले बता देना और ऐप की फ़ोन तक पहुँच हटाना पहले के बेहतर कदम हैं।"
      },
      {
        "question": "क्या ScreenshotChecker साबित कर सकता है कि मेरी फ़ोटो मॉर्फ़ की गई है?",
        "answer": "यह संकेत दिखा सकता है, जैसे अलग एडिटिंग वाले हिस्से या रिवर्स इमेज सर्च से मिली असली फ़ोटो, पर साबित नहीं कर सकता। परेशान किए जाने की शिकायत के लिए किसी टूल के सबूत की ज़रूरत नहीं: धमकी देना और फ़ोटो फैलाना ही अपराध है।"
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": [
      "digital-arrest-kya-hai",
      "loan-app-harassment-morphed-photos",
      "task-job-scam-se-kaise-bache"
    ],
    "cta": {
      "label": "लोन मैसेज का स्क्रीनशॉट जाँचें",
      "url": "/screenshot-scam-checker/",
      "description": "लोन ऑफ़र या रिकवरी मैसेज के स्क्रीनशॉट में धमकी, समय सीमा और पैसे की माँग जैसे निशान देखें, आपके ब्राउज़र में।"
    }
  },
  {
    "slug": "amazon-flipkart-refund-fraud-se-bache",
    "lang": "hi",
    "title": "Amazon या Flipkart के नाम पर रिफ़ंड, ऑर्डर और डिलीवरी फ्रॉड से कैसे बचें",
    "seoTitle": "Amazon, Flipkart रिफ़ंड फ्रॉड: असली या नकली मैसेज?",
    "metaDescription": "Amazon या Flipkart के नाम से रिफ़ंड, ऑर्डर या डिलीवरी का मैसेज या कॉल आया? लिंक न खोलें। ऐप में ऑर्डर जाँचें, PIN या QR कभी नहीं। शिकायत कैसे करें।",
    "category": "Threat Analysis",
    "publishedAt": "2026-11-17",
    "authorName": "Virat Chauhan",
    "readTime": "6 min read",
    "excerpt": "Amazon और Flipkart के नाम पर आने वाले रिफ़ंड, \"संदिग्ध ख़रीदारी\" और फ़र्ज़ी कस्टमर केयर वाले फ्रॉड, दोनों कंपनियाँ क्या कभी नहीं माँगतीं, मैसेज जाँचने का सुरक्षित तरीका और पैसे जाने पर क्या करें।",
    "targetKeywords": [
      "amazon refund fraud",
      "flipkart refund scam",
      "अमेज़न रिफ़ंड फ्रॉड",
      "फ्लिपकार्ट फर्जी कस्टमर केयर",
      "amazon fake message kaise pehchane",
      "refund ke liye qr code scan"
    ],
    "keyTakeaway": {
      "title": "ऑर्डर सिर्फ़ उसी ऐप में देखिए जो आप पहले से चलाते हैं",
      "text": "Amazon या Flipkart का ऐप या वेबसाइट ख़ुद खोलिए और Your Orders देखिए। अगर वहाँ वह ऑर्डर, रिफ़ंड या दिक्कत नहीं है, तो मैसेज असली नहीं है। दोनों में से कोई भी कंपनी फ़ोन पर पेमेंट, गिफ़्ट कार्ड, किसी के निजी UPI ID या QR कोड से पैसे नहीं माँगती, और रिफ़ंड के लिए PIN या पासवर्ड की ज़रूरत नहीं होती।"
    },
    "introduction": "Amazon या Flipkart के नाम से रिफ़ंड, ऑर्डर या डिलीवरी का मैसेज या कॉल असली है या नहीं, यह जानने का एक ही भरोसेमंद तरीका है: लिंक या नंबर छोड़िए, ऐप ख़ुद खोलिए और अपने ऑर्डर देखिए। ठग इन भरोसेमंद नामों का इस्तेमाल करते हैं: रिकॉल हुए सामान का रिफ़ंड, आपके अकाउंट पर \"संदिग्ध ख़रीदारी\" वाला कॉल, नकली ऑर्डर कन्फ़र्मेशन, या \"ज़्यादा रिफ़ंड चला गया\" वाला स्क्रीनशॉट। Flipkart भारत में ऐसे फ्रॉड के बारे में नियमित चेतावनी देता है। यह गाइड बताती है कि इनमें से किसी भी मैसेज को सुरक्षित तरीके से कैसे जाँचें। <a href=\"/blog/fake-amazon-flipkart-refund-scam/\">यह गाइड अंग्रेज़ी में भी है।</a>",
    "contentSections": [
      {
        "heading": "ठगी के आम तरीके",
        "paragraphs": [
          "ज़्यादातर मामले कुछ ही तरीकों में आते हैं। हर तरीका आपको आधिकारिक ऐप से बाहर किसी लिंक, कॉल या पेमेंट पर ले जाने की कोशिश करता है।",
          "नीचे दिया चित्र ऐसे ही एक काल्पनिक रिफ़ंड SMS को दिखाता है।"
        ],
        "figure": {
          "afterParagraph": 1,
          "src": "/images/blog/amazon-flipkart-refund-fraud-se-bache/fictional-example.png",
          "alt": "अनजान नंबर से आया काल्पनिक रिफ़ंड SMS, जिस पर नंबर वाले निशान हैं: अनजान भेजने वाला, बिना माँगे ₹2,499 का रिफ़ंड, 24 घंटे वाला मिलता-जुलता लिंक, और UPI PIN व QR स्कैन माँगने वाला पेज।",
          "width": 1200,
          "height": 760,
          "caption": "चित्र 1. एक काल्पनिक रिफ़ंड SMS। नंबर और लिंक बनाए हुए हैं; तरीक़ा वही है जो असली ठगी में दिखता है।"
        },
        "checklist": [
          "रिफ़ंड या रिकॉल वाले मैसेज: \"आपका सामान क्वालिटी चेक में फेल हुआ, रिफ़ंड क्लेम करें\"। अमेरिकी FTC की <a href=\"https://consumer.ftc.gov/consumer-alerts/2025/07/scammy-texts-offering-refunds-amazon-purchases\">जुलाई 2025 की चेतावनी</a> कहती है कि कोई रिफ़ंड नहीं होता; लिंक आपके अकाउंट और कार्ड की जानकारी चुराने के लिए होता है।",
          "\"संदिग्ध ख़रीदारी\" वाले कॉल या मैसेज: कोई कहता है कि आपके अकाउंट से महँगा ऑर्डर हुआ है और उसे कैंसल करवाने की पेशकश करता है। कॉलर ID नकली हो सकता है।",
          "ज़्यादा रिफ़ंड वाली चाल: नकली एजेंट कहता है कि आपको ज़्यादा रिफ़ंड चला गया, बाकी पैसे लौटाइए।",
          "फ़र्ज़ी कस्टमर केयर: सर्च रिज़ल्ट या सोशल मीडिया पर मिला नंबर जो रिफ़ंड में \"मदद\" करता है और फिर पेमेंट, स्क्रीन शेयर करने वाला ऐप या आपका PIN माँगता है।",
          "ब्रैंड के नाम वाली नकली वेबसाइट और ऑफ़र, जिनमें पेमेंट किसी निजी UPI ID या QR कोड से लिया जाता है।"
        ]
      },
      {
        "heading": "Amazon और Flipkart क्या कभी नहीं करते",
        "paragraphs": [
          "<a href=\"https://www.aboutamazon.in/news/amazon-india-news/how-to-avoid-scams-impersonating-amazon-this-holiday-season\">Amazon India</a> कहता है कि वह फ़ोन या ईमेल पर पेमेंट नहीं माँगता, गिफ़्ट कार्ड ख़रीदने को कभी नहीं कहता, और मैसेज, ईमेल या सर्च रिज़ल्ट में मिले नंबरों पर कॉल न करने की सलाह देता है।",
          "Flipkart की <a href=\"https://stories.flipkart.com/scam-advisory-beware-of-fraudulent-sites-and-fake-offers-misusing-flipkarts-name\">स्कैम एडवाइज़री</a> कहती है कि Flipkart कभी आपका पासवर्ड, OTP, PIN या बैंक की जानकारी नहीं माँगता, और Flipkart के बाहर किसी को पेमेंट करने पर आपकी कोई सुरक्षा नहीं रहती। उसमें निजी UPI ID या QR कोड पर पेमेंट, नकली \"Flipkart Care\" नंबर और WhatsApp पर नकली सपोर्ट अकाउंट आम चालों में गिनाए गए हैं। उसका <a href=\"https://stories.flipkart.com/keep-yourself-safe-otp-fraud\">OTP फ्रॉड पेज</a> बताता है कि उसके प्रतिनिधि कॉल या मैसेज पर पेमेंट OTP नहीं माँगते।"
        ],
        "callout": {
          "type": "golden-rule",
          "text": "रिफ़ंड पाने के लिए न पैसे देने होते हैं, न QR स्कैन करना, न PIN डालना। RBI की <a href=\"https://www.rbi.org.in/commonman/Upload/english/Content/PDFs/English%20BEAWARE.pdf\">BE(A)WARE पुस्तिका</a> कहती है कि पैसा पाने के लिए कहीं PIN या पासवर्ड डालने की ज़रूरत नहीं होती, और पैसा पाने के लिए कभी QR कोड स्कैन न करें।"
        }
      },
      {
        "heading": "ऑर्डर, रिफ़ंड या डिलीवरी का मैसेज कैसे जाँचें",
        "paragraphs": [
          "यह तरीका हर तरह की ठगी पर काम करता है, क्योंकि मैसेज ठग के हाथ में है, आपका अकाउंट नहीं।"
        ],
        "checklist": [
          "लिंक पर टैप मत कीजिए, नंबर पर कॉल मत कीजिए, मैसेज का जवाब मत दीजिए।",
          "Amazon या Flipkart का ऐप खोलिए, या वेबसाइट का पता ख़ुद टाइप कीजिए, और Your Orders या My Orders में जाइए।",
          "अगर वहाँ वह ऑर्डर, रिफ़ंड या डिलीवरी नहीं है, तो मैसेज असली नहीं है। अगर है, तो ऐप के अंदर के हेल्प विकल्प इस्तेमाल कीजिए।",
          "कॉल आए तो काट दीजिए और ऐप के अंदर से सपोर्ट से संपर्क कीजिए। असली सपोर्ट कॉल को राज़ रखने या स्क्रीन शेयर करने वाला ऐप डाउनलोड करने को नहीं कहता।",
          "मैसेज में जिस चार्ज का ज़िक्र है, उसे अपने बैंक या कार्ड स्टेटमेंट में देखिए।"
        ]
      },
      {
        "heading": "नकली ऑर्डर और रिफ़ंड के स्क्रीनशॉट",
        "paragraphs": [
          "इन ठगियों में स्क्रीनशॉट दो तरह से आते हैं। नकली एजेंट \"रिफ़ंड शुरू\" या \"ज़्यादा रिफ़ंड\" वाली स्क्रीन का स्क्रीनशॉट भेजता है ताकि कहानी सच लगे। और OLX जैसे मार्केटप्लेस पर कोई ख़रीदार या विक्रेता किसी ऐसे ऑर्डर या डिलीवरी का स्क्रीनशॉट भेजता है जो कभी हुआ ही नहीं।",
          "स्क्रीनशॉट मिनटों में एडिट या बनाया जा सकता है, इसलिए वह अपने आप में सबूत नहीं है। भरोसा सिर्फ़ अपने अकाउंट के ऑर्डर पेज या अपने बैंक खाते में आए पैसे पर कीजिए। पेमेंट स्क्रीनशॉट के लिए हमारी गाइड <a href=\"/blog/fake-payment-screenshot-kaise-pehchane/\">फेक पेमेंट स्क्रीनशॉट कैसे पहचानें</a> और <a href=\"/blog/payment-fail-paisa-kat-gaya/\">पेमेंट फेल, पैसा कट गया</a> पढ़िए।"
        ]
      },
      {
        "heading": "काल्पनिक उदाहरण: रिफ़ंड वाला कॉल",
        "paragraphs": [
          "अर्जुन देर से आ रहे रिफ़ंड के बारे में पूछने के लिए ऑनलाइन एक शॉपिंग साइट का कस्टमर केयर नंबर खोजता है और पहले नंबर पर कॉल करता है। \"एजेंट\" कहता है कि रिफ़ंड फेल हो गया और ₹2,499 \"पाने\" के लिए WhatsApp पर एक QR कोड भेजता है।",
          "अर्जुन को याद आता है कि QR स्कैन करके PIN डालने से पैसा सिर्फ़ जाता है। वह कॉल काटता है, शॉपिंग ऐप खोलता है, और देखता है कि रिफ़ंड पहले ही उसके मूल पेमेंट तरीके में प्रोसेस हो चुका है। वह नकली नंबर की शिकायत cybercrime.gov.in पर करता है और उसे ब्लॉक कर देता है।"
        ]
      },
      {
        "heading": "लिंक खोल दिया, पैसे दे दिए या जानकारी दे दी? तुरंत यह करें",
        "paragraphs": [
          "1930 हेल्पलाइन पर कॉल कीजिए और cybercrime.gov.in पर शिकायत दर्ज कीजिए, फिर अपने बैंक के आधिकारिक ऐप से बैंक को बताइए। अगर OTP या पासवर्ड बता दिया है, तो Amazon या Flipkart का पासवर्ड बदलिए और सेव किए गए कार्ड और पते जाँचिए। Flipkart की एडवाइज़री में उसकी हेल्पलाइन 044-45614700 और X पर @flipkartsupport दिए गए हैं।",
          "कॉल वाले तरीक़े के बारे में ज़्यादा जानकारी हमारी <a href=\"/blog/fake-customer-care-number-scam/\">फ़र्ज़ी कस्टमर केयर नंबर</a> वाली गाइड में है।"
        ]
      },
      {
        "heading": "ScreenshotChecker क्या बता सकता है और क्या नहीं",
        "paragraphs": [
          "<a href=\"/screenshot-scam-checker/\">स्क्रीनशॉट स्कैम चेकर</a> मैसेज या चैट के स्क्रीनशॉट में जल्दबाज़ी, रिफ़ंड का लालच और पैसे की माँग जैसे निशान दिखाता है। <a href=\"/suspicious-link-checker/\">संदिग्ध लिंक चेकर</a> लिंक को खोले बिना उसकी जानकारी देखता है।",
          "इनमें से कोई भी आपका Amazon या Flipkart अकाउंट या बैंक नहीं देख सकता। साफ़ नतीजे का मतलब यह नहीं कि मैसेज असली है; जवाब आपका Your Orders पेज और बैंक स्टेटमेंट ही है।"
        ]
      }
    ],
    "faq": [
      {
        "question": "बिना माँगे Amazon रिफ़ंड का मैसेज आया है, क्या यह असली है?",
        "answer": "लगभग पक्का नहीं। ऐसे रिफ़ंड और रिकॉल वाले मैसेज फ़िशिंग पेज पर ले जाते हैं। Amazon ऐप ख़ुद खोलकर Your Orders देखिए; अगर वहाँ कोई रिफ़ंड नहीं है, तो मैसेज डिलीट कीजिए।"
      },
      {
        "question": "क्या Flipkart रिफ़ंड के लिए OTP या UPI PIN माँगता है?",
        "answer": "नहीं। Flipkart कहता है कि वह कभी पासवर्ड, OTP, PIN या बैंक की जानकारी नहीं माँगता, और उसके प्रतिनिधि कॉल या मैसेज पर पेमेंट OTP नहीं माँगते। रिफ़ंड बिना PIN के आपके मूल पेमेंट तरीके या Flipkart अकाउंट में आता है।"
      },
      {
        "question": "रिफ़ंड पाने के लिए QR कोड स्कैन करने को कहा जा रहा है, क्या करूँ?",
        "answer": "स्कैन मत कीजिए। QR स्कैन करके PIN डालने से पैसा आपके खाते से जाता है, आता नहीं। RBI भी कहता है कि पैसा पाने के लिए कभी QR कोड स्कैन न करें।"
      },
      {
        "question": "Amazon या Flipkart का असली कस्टमर केयर नंबर कैसे पता करें?",
        "answer": "आधिकारिक ऐप या वेबसाइट के अंदर के हेल्प या कॉन्टैक्ट विकल्प इस्तेमाल कीजिए। सर्च रिज़ल्ट, सोशल मीडिया पोस्ट और मैसेज में मिले नंबर फ़र्ज़ी कस्टमर केयर का आम ज़रिया हैं।"
      },
      {
        "question": "क्या ऑर्डर या रिफ़ंड का स्क्रीनशॉट नकली हो सकता है?",
        "answer": "हाँ। स्क्रीनशॉट आसानी से एडिट या बनाए जा सकते हैं। ऑर्डर अपने अकाउंट में और पेमेंट अपने बैंक या UPI ऐप में देखिए।"
      },
      {
        "question": "क्या ScreenshotChecker Amazon या Flipkart का ऑर्डर पक्का कर सकता है?",
        "answer": "नहीं। यह स्क्रीनशॉट में चेतावनी के निशान दिखा सकता है, पर इसके पास शॉपिंग अकाउंट या बैंक की पहुँच नहीं है। आधिकारिक ऐप में Your Orders देखिए।"
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": [
      "fake-amazon-flipkart-refund-scam",
      "qr-code-fraud-se-kaise-bache",
      "fake-payment-screenshot-kaise-pehchane"
    ],
    "cta": {
      "label": "मैसेज का स्क्रीनशॉट जाँचें",
      "url": "/screenshot-scam-checker/",
      "description": "रिफ़ंड, ऑर्डर या डिलीवरी मैसेज के स्क्रीनशॉट में ठगी के निशान देखें, आपके ब्राउज़र में।"
    }
  },
  {
    "slug": "what-is-utr-number",
    "title": "What Is a UTR Number? Meaning, Format and How to Check a Payment",
    "seoTitle": "What Is a UTR Number? Meaning, Format and How to Check",
    "metaDescription": "UTR means Unique Transaction Reference: the number banks use to trace a UPI, IMPS, NEFT or RTGS payment. Formats, UTR vs RRN, and how to check a payment.",
    "category": "Security",
    "publishedAt": "2026-11-22",
    "authorName": "Virat Chauhan",
    "readTime": "6 min read",
    "excerpt": "What a UTR number is, the usual formats for UPI, IMPS, NEFT and RTGS, how it differs from an app's transaction ID and the RRN, how to use it to check or trace a payment, and why a UTR in a screenshot is not proof of payment.",
    "targetKeywords": [
      "what is utr number",
      "utr number",
      "utr full form",
      "utr number meaning",
      "utr vs transaction id",
      "utr vs rrn"
    ],
    "keyTakeaway": {
      "title": "A UTR identifies a payment; only your bank record confirms it",
      "text": "A UTR (Unique Transaction Reference) is the number banks use to identify one transfer. UPI and IMPS references are usually 12 digits, NEFT UTRs 16 characters and RTGS UTRs 22. Use it to find the payment in your own statement or to trace it with your bank, but never accept a UTR in a screenshot as proof that money arrived."
    },
    "introduction": "A UTR number (Unique Transaction Reference) is the reference a bank gives to a single money transfer, so the sender, the receiver and both banks can find the same payment. UPI and IMPS references are usually 12 digits, NEFT UTRs 16 letters and numbers, and RTGS UTRs 22. You will see it in your UPI app's transaction details, your bank statement and payment SMS, sometimes labelled UPI transaction ID, UPI Ref No or RRN. This guide explains the formats, how a UTR differs from other IDs, and how to use one to check a payment. To find it in a specific app, see <a href=\"/blog/how-to-find-utr-number/\">how to find your UTR number in Google Pay, PhonePe, Paytm and your bank</a>.",
    "contentSections": [
      {
        "heading": "UTR full form and meaning",
        "paragraphs": [
          "UTR stands for Unique Transaction Reference. When money moves between bank accounts in India, through UPI, IMPS, NEFT or RTGS, the system attaches one reference to that transfer. It stays the same on the sender's side and the receiver's side, which is what makes it useful: two people can talk about the same payment without sharing account details.",
          "Paytm's support page notes that, depending on the bank or payment system, the same reference may be labelled <a href=\"https://paytm.com/support/upi/upi-reference-number-utr-rrn-paytm\">UPI Reference Number, UTR or RRN</a>. The terms have slightly different technical meanings, but for an everyday UPI payment they all point to the reference you would give your bank."
        ],
        "figure": {
          "afterParagraph": 1,
          "src": "/images/blog/what-is-utr-number/fictional-example.png",
          "alt": "A fictional UPI payment receipt with numbered labels showing the amount, the 12-digit UPI reference (UTR or RRN), the app's own transaction ID and the status, with notes on which number to use.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. A fictional UPI receipt. The 12-digit UPI reference is the one your bank can trace; the app's own ID is for that app's support."
        }
      },
      {
        "heading": "UTR number formats for UPI, IMPS, NEFT and RTGS",
        "paragraphs": [
          "The length of a UTR usually tells you which system carried the payment. PhonePe's <a href=\"https://business.phonepe.com/articles/utr-number-meaning-what-every-merchant-needs-to-know\">merchant guide</a> gives the common formats:"
        ],
        "checklist": [
          "<strong>UPI:</strong> 12 digits, often shown as UPI transaction ID, UPI Ref No or UTR.",
          "<strong>IMPS:</strong> 12 digits, shown on the transfer receipt and statement.",
          "<strong>NEFT:</strong> 16 letters and numbers, starting with letters for the sending bank.",
          "<strong>RTGS:</strong> 22 letters and numbers, also starting with the sending bank's letters."
        ],
        "callout": {
          "type": "tip",
          "text": "Not sure which kind of reference you have? Paste it into the free <a href=\"/utr-number-checker/\">UTR number checker</a>. It shows which format the number matches, in your browser, without contacting any bank."
        }
      },
      {
        "heading": "UTR vs transaction ID vs RRN",
        "paragraphs": [
          "Payment apps show more than one number, and mixing them up is the most common reason a bank cannot find a payment."
        ],
        "checklist": [
          "<strong>UTR / UPI reference / RRN:</strong> the bank-level reference for the transfer. For UPI it is usually 12 digits. This is the number your bank, the receiver's bank and dispute teams use.",
          "<strong>The app's own transaction or order ID:</strong> an internal ID created by the app, often longer and sometimes starting with letters. It helps that app's customer support, but the other person's bank may not recognise it.",
          "<strong>Bank statement reference:</strong> your statement usually shows the reference inside the transaction description or a Ref No column. Google Pay's help page says the UPI transaction ID usually appears after a slash (/) in the statement's transaction details."
        ]
      },
      {
        "heading": "How to check a payment with a UTR number",
        "paragraphs": [
          "There is no public website where anyone can look up a UTR and see a payment. Only the banks involved, and the apps acting for you, can see it. So a check always happens in your own records (the full steps and time limits are in <a href=\"/blog/utr-number-tracking/\">UTR number tracking</a>):"
        ],
        "checklist": [
          "<strong>If you received money:</strong> open your bank app or statement yourself and look for a credit with the same amount, time and reference. If it is not there, the payment has not reached you.",
          "<strong>If you sent money and it is stuck:</strong> note the UTR and raise the issue in your UPI app's help section or with your bank. Under the RBI's <a href=\"https://www.rbi.org.in/commonman/English/scripts/Notification.aspx?Id=3074\">turnaround time framework</a>, when a UPI transfer debits the payer but does not credit the receiver, the money should be reversed automatically by the next day (T+1).",
          "<strong>If a NEFT or RTGS transfer is missing:</strong> give the UTR to your bank and ask them to trace it with the receiving bank."
        ]
      },
      {
        "heading": "Why a UTR in a screenshot is not proof of payment",
        "paragraphs": [
          "Sellers are often shown a payment screenshot with a UTR to make it look real. A UTR can be copied from an old payment or another person's receipt, typed into an edited image, or simply made up in the right number of digits. Its format can be correct and the payment still not exist.",
          "That is why the only test that matters is your own account. Our guides on <a href=\"/blog/fake-upi-payment-screenshot/\">fake UPI payment screenshots</a> and <a href=\"/blog/payment-failed-screenshot-scam/\">payment failed screenshots</a> cover the common tricks, and the <a href=\"/payment-screenshot-checker/\">payment screenshot checker</a> flags warning signs in a receipt image."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "Hand over goods or refunds only after the money shows in your own bank or UPI app. A UTR helps you find the payment; it does not prove it."
        }
      },
      {
        "heading": "Is it safe to share a UTR number?",
        "paragraphs": [
          "A UTR on its own identifies a payment; it cannot be used to take money out of your account. Sharing it with the person you paid, or with your bank, is normal. What you must never share is your UPI PIN, a one-time password or your card details, whoever asks. Be careful with people who call or message offering to \"track\" a UTR for you and then ask for those details or a fee."
        ]
      }
    ],
    "faq": [
      {
        "question": "What is the full form of UTR?",
        "answer": "UTR stands for Unique Transaction Reference. It is the reference given to one bank transfer, such as a UPI, IMPS, NEFT or RTGS payment, so that both banks can identify it."
      },
      {
        "question": "How many digits is a UTR number?",
        "answer": "UPI and IMPS references are usually 12 digits. NEFT UTRs are usually 16 characters and RTGS UTRs 22 characters, both starting with letters for the sending bank."
      },
      {
        "question": "Is the UTR number the same as the UPI transaction ID?",
        "answer": "For UPI payments, the 12-digit UPI transaction ID or UPI Ref No shown in most apps is the reference banks use, often called the UTR or RRN. Apps may also show their own longer transaction or order ID, which is different."
      },
      {
        "question": "Can I track a UTR number online?",
        "answer": "Not on a public website. Check the payment in your own bank app or statement, or give the UTR to your bank or UPI app support and ask them to trace it."
      },
      {
        "question": "Does a valid UTR prove that I was paid?",
        "answer": "No. A UTR can be copied or made up in the right format. Only a matching credit in your own bank or UPI app confirms that the money arrived."
      },
      {
        "question": "Is it safe to share my UTR number?",
        "answer": "Yes, with the person you paid or your bank. A UTR cannot be used to withdraw money. Never share your UPI PIN, OTP or card details."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["utr-number-tracking", 
      "how-to-find-utr-number",
      "fake-upi-payment-screenshot",
      "payment-failed-screenshot-scam"
    ],
    "cta": {
      "label": "Check a UTR format",
      "url": "/utr-number-checker/",
      "description": "See whether a UTR or UPI reference matches the UPI, IMPS, NEFT or RTGS format, then confirm the payment in your own bank."
    }
  },
  {
    "slug": "how-to-find-utr-number",
    "title": "How to Find Your UTR Number in Google Pay, PhonePe, Paytm and Your Bank",
    "seoTitle": "How to Find UTR Number in GPay, PhonePe, Paytm and Bank",
    "metaDescription": "Find the UTR or UPI reference number of any payment: steps for Google Pay, PhonePe, Paytm, bank apps, statements and SMS, and what to do if you cannot find it.",
    "category": "Security",
    "publishedAt": "2026-11-22",
    "authorName": "Virat Chauhan",
    "readTime": "5 min read",
    "excerpt": "Where the UTR or UPI reference number appears in Google Pay, PhonePe, Paytm, bank apps, statements and SMS, what each app calls it, and what to do when you cannot find it or the number does not match.",
    "targetKeywords": [
      "how to find utr number",
      "utr number in gpay",
      "utr number in phonepe",
      "utr number in paytm",
      "utr number in bank statement",
      "how to find utr number in google pay"
    ],
    "keyTakeaway": {
      "title": "Open the payment in your history and look for the 12-digit reference",
      "text": "In any UPI app, open your transaction history, tap the payment and look for the 12-digit UPI transaction ID, UPI Ref No, UTR or RRN. In a bank statement, it sits in the transaction description or Ref No column. For NEFT and RTGS, check the transfer receipt in your bank app."
    },
    "introduction": "To find a UTR number, open the payment in your UPI or bank app's transaction history and look in its details for the UPI transaction ID, UPI Ref No, UTR or RRN, usually a 12-digit number for UPI. Each app uses a slightly different label and path, so here are the steps for Google Pay, PhonePe, Paytm, bank apps, statements and SMS. If you are not sure what the number means, start with <a href=\"/blog/what-is-utr-number/\">what a UTR number is</a>.",
    "contentSections": [
      {
        "heading": "Find the UTR number in Google Pay",
        "paragraphs": [
          "Google's <a href=\"https://support.google.com/pay/india/answer/9739577?hl=en\">Google Pay help page</a> describes the route: open the app, go to <strong>Manage your money</strong>, tap <strong>See transaction history</strong>, then tap the payment to see its details, including the UPI transaction ID. Compare it with your bank statement, where Google says the UPI transaction ID usually appears after a slash (/) in the transaction details, and check that the amounts match."
        ],
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/how-to-find-utr-number/fictional-example.png",
          "alt": "A fictional reference card showing what each app calls the UTR: Google Pay UPI transaction ID, PhonePe UTR, Paytm UPI Ref No, bank statement Ref No or description, and NEFT or RTGS receipt UTR.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. Where the reference usually appears and what it is called. Labels can change between app versions."
        }
      },
      {
        "heading": "Find the UTR number in PhonePe",
        "paragraphs": [
          "Open PhonePe, go to <strong>History</strong>, tap the payment and open its details. The bank reference is shown as the UTR, usually 12 digits for UPI. PhonePe's <a href=\"https://business.phonepe.com/articles/utr-number-meaning-what-every-merchant-needs-to-know\">guide to UTR numbers</a> describes the same general route for any UPI app: open the transaction history, tap the payment, and look for the 12-digit UPI transaction ID or reference number.",
          "PhonePe also shows its own transaction ID for the payment. That ID is for PhonePe support; when the other person's bank asks for a reference, give the UTR."
        ]
      },
      {
        "heading": "Find the UTR number in Paytm",
        "paragraphs": [
          "Paytm's <a href=\"https://paytm.com/support/upi/upi-reference-number-utr-rrn-paytm\">support page</a> gives these steps: open the Paytm app, go to <strong>Balance &amp; History</strong> (or Transaction History), select the UPI payment and open the <strong>Transaction Details</strong> page. The reference is shown as the UPI Reference Number, UTR or RRN, depending on how the details are displayed."
        ]
      },
      {
        "heading": "Find the UTR in your bank app, statement or SMS",
        "paragraphs": [
          "Every UPI payment also appears in your bank account, which is the most reliable place to look:"
        ],
        "checklist": [
          "<strong>Bank app or net banking:</strong> open the account's transaction history and tap the payment. The reference may be called Reference Number, Ref No, Transaction ID or UTR.",
          "<strong>Statement or passbook:</strong> download the statement and look in the description, remarks or Ref No column next to the entry.",
          "<strong>SMS and email alerts:</strong> your bank's debit or credit alert often includes the UPI reference. Search your messages for the amount.",
          "<strong>NEFT and RTGS:</strong> the UTR is on the transfer receipt in your bank app and on the statement entry. It is 16 characters for NEFT and 22 for RTGS."
        ]
      },
      {
        "heading": "Can't find the UTR, or it does not match?",
        "paragraphs": [
          "Labels change between app versions, so look for any of these on the details screen: UTR, UPI Ref No, UPI transaction ID, RRN, Reference Number. If a payment failed before reaching your bank, there may be no bank reference yet; contact the app's support from inside the app. If the number someone sent you does not appear in your records at all, treat the payment as not received.",
          "Not sure the number you copied is a UTR at all? The <a href=\"/utr-number-checker/\">UTR number checker</a> shows whether it matches the UPI, IMPS, NEFT or RTGS format."
        ],
        "callout": {
          "type": "warning",
          "text": "Your UTR is safe to share with the person you paid or your bank. Your UPI PIN, OTP and card details are not, and no genuine support team will ask for them to find a UTR."
        }
      },
      {
        "heading": "What to do with the UTR once you have it",
        "paragraphs": [
          "Use it to match a payment in your own records, to raise a complaint about a failed or stuck payment in your UPI app or with your bank, or to give a seller the reference for a payment you made. If you are the seller, remember that a UTR in a screenshot is not proof: check your own account before handing anything over. Our guide to <a href=\"/blog/fake-upi-payment-screenshot/\">fake UPI payment screenshots</a> explains why."
        ]
      }
    ],
    "faq": [
      {
        "question": "Where is the UTR number in Google Pay?",
        "answer": "Open Google Pay, go to Manage your money, tap See transaction history and tap the payment. The UPI transaction ID in the details is the reference your bank can trace."
      },
      {
        "question": "Where is the UTR number in PhonePe?",
        "answer": "Open PhonePe, go to History, tap the payment and open its details. The UTR is usually a 12-digit number for UPI payments. PhonePe's own transaction ID is a separate number."
      },
      {
        "question": "Where is the UTR number in Paytm?",
        "answer": "Open Paytm, go to Balance & History, select the UPI payment and open Transaction Details. The reference appears as UPI Reference Number, UTR or RRN."
      },
      {
        "question": "How do I find the UTR number in my bank statement?",
        "answer": "Look at the description, remarks or Ref No column next to the payment. For Google Pay payments, Google says the UPI transaction ID usually appears after a slash (/) in the transaction details."
      },
      {
        "question": "Why can't I find a UTR for my payment?",
        "answer": "The label may be different (UPI Ref No, RRN, Reference Number), or the payment may have failed before reaching the bank. Check your bank app or statement, and contact the UPI app's support from inside the app if it is still missing."
      },
      {
        "question": "Can someone take money from my account with my UTR number?",
        "answer": "No. A UTR only identifies a payment. Never share your UPI PIN, OTP or card details, which are what fraudsters actually need."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": ["utr-number-tracking", 
      "what-is-utr-number",
      "fake-upi-payment-screenshot",
      "payment-failed-screenshot-scam"
    ],
    "cta": {
      "label": "Check a UTR format",
      "url": "/utr-number-checker/",
      "description": "Paste the reference you found to see whether it matches the UPI, IMPS, NEFT or RTGS format."
    }
  },
  {
    "slug": "utr-number-kya-hota-hai",
    "lang": "hi",
    "title": "UTR नंबर क्या होता है? कैसे निकालें और पेमेंट कैसे चेक करें",
    "seoTitle": "UTR नंबर क्या होता है? कैसे निकालें और कैसे चेक करें",
    "metaDescription": "UTR नंबर यानी Unique Transaction Reference: हर UPI, IMPS, NEFT या RTGS पेमेंट का पहचान नंबर। Google Pay, PhonePe, Paytm में कैसे निकालें और पेमेंट कैसे जाँचें।",
    "category": "Security",
    "publishedAt": "2026-11-22",
    "authorName": "Virat Chauhan",
    "readTime": "6 min read",
    "excerpt": "UTR नंबर का मतलब और फ़ुल फ़ॉर्म, UPI, NEFT और RTGS में इसका फ़ॉर्मेट, Google Pay, PhonePe, Paytm और बैंक स्टेटमेंट में इसे कैसे निकालें, और स्क्रीनशॉट में दिखा UTR पेमेंट का सबूत क्यों नहीं है।",
    "targetKeywords": [
      "utr number kya hota hai",
      "UTR नंबर क्या है",
      "utr number kaise nikale",
      "UTR नंबर कैसे पता करें",
      "utr full form in hindi",
      "utr number check kaise kare"
    ],
    "keyTakeaway": {
      "title": "UTR पेमेंट पहचानता है, पक्का सिर्फ़ आपका बैंक करता है",
      "text": "UTR (Unique Transaction Reference) वह नंबर है जिससे बैंक किसी एक पेमेंट को पहचानते हैं। UPI और IMPS में यह आम तौर पर 12 अंकों का होता है, NEFT में 16 और RTGS में 22 अक्षर-अंकों का। इससे अपने स्टेटमेंट में पेमेंट खोजिए या बैंक से ट्रेस करवाइए, पर स्क्रीनशॉट में दिखे UTR को कभी पेमेंट का सबूत मत मानिए।"
    },
    "introduction": "UTR नंबर (Unique Transaction Reference) वह पहचान नंबर है जो बैंक हर एक पेमेंट को देता है, ताकि भेजने वाला, पाने वाला और दोनों बैंक एक ही पेमेंट को पहचान सकें। UPI और IMPS में यह आम तौर पर 12 अंकों का होता है। इसे निकालने के लिए अपने UPI ऐप की हिस्ट्री में पेमेंट खोलिए और उसकी डिटेल में UTR, UPI Ref No, UPI transaction ID या RRN देखिए। नीचे Google Pay, PhonePe, Paytm और बैंक स्टेटमेंट के तरीके, और पेमेंट जाँचने का सही तरीका दिया है। <a href=\"/blog/what-is-utr-number/\">यह गाइड अंग्रेज़ी में भी है।</a>",
    "contentSections": [
      {
        "heading": "UTR का फ़ुल फ़ॉर्म और मतलब",
        "paragraphs": [
          "UTR का फ़ुल फ़ॉर्म है Unique Transaction Reference। जब UPI, IMPS, NEFT या RTGS से पैसा एक खाते से दूसरे में जाता है, तो उस पेमेंट को एक रेफ़रेंस नंबर मिलता है। यह भेजने वाले और पाने वाले, दोनों तरफ़ एक जैसा रहता है, इसलिए खाते की जानकारी बताए बिना दोनों लोग उसी पेमेंट की बात कर सकते हैं।",
          "Paytm का <a href=\"https://paytm.com/support/upi/upi-reference-number-utr-rrn-paytm\">सपोर्ट पेज</a> बताता है कि बैंक या पेमेंट सिस्टम के हिसाब से इसी नंबर को UPI Reference Number, UTR या RRN कहा जा सकता है। तकनीकी मतलब थोड़ा अलग है, पर रोज़ के UPI पेमेंट में ये सब वही रेफ़रेंस हैं जो आप बैंक को बताते हैं।"
        ],
        "figure": {
          "afterParagraph": 1,
          "src": "/images/blog/utr-number-kya-hota-hai/fictional-example.png",
          "alt": "एक काल्पनिक UPI रसीद जिस पर नंबर वाले निशान हैं: रकम, 12 अंकों का UPI रेफ़रेंस (UTR या RRN), ऐप की अपनी ट्रांज़ैक्शन ID और स्टेटस, और कौन सा नंबर किस काम का है।",
          "width": 1200,
          "height": 760,
          "caption": "चित्र 1. एक काल्पनिक UPI रसीद। 12 अंकों वाला UPI रेफ़रेंस बैंक ट्रेस कर सकता है; ऐप की अपनी ID सिर्फ़ उसी ऐप के सपोर्ट के काम की है।"
        }
      },
      {
        "heading": "UTR नंबर कितने अंकों का होता है",
        "paragraphs": [
          "UTR की लंबाई से अक्सर पता चल जाता है कि पेमेंट किस सिस्टम से गया। PhonePe की <a href=\"https://business.phonepe.com/articles/utr-number-meaning-what-every-merchant-needs-to-know\">गाइड</a> के अनुसार:"
        ],
        "checklist": [
          "<strong>UPI:</strong> 12 अंक, जिसे UPI transaction ID, UPI Ref No या UTR लिखा जाता है।",
          "<strong>IMPS:</strong> 12 अंक।",
          "<strong>NEFT:</strong> 16 अक्षर-अंक, शुरुआत भेजने वाले बैंक के अक्षरों से।",
          "<strong>RTGS:</strong> 22 अक्षर-अंक, शुरुआत भेजने वाले बैंक के अक्षरों से।"
        ],
        "callout": {
          "type": "tip",
          "text": "आपके पास कौन सा नंबर है, पक्का नहीं? मुफ़्त <a href=\"/utr-number-checker/\">UTR नंबर चेकर</a> में डालिए। यह आपके ब्राउज़र में बताता है कि नंबर किस फ़ॉर्मेट जैसा है, किसी बैंक से संपर्क किए बिना।"
        }
      },
      {
        "heading": "Google Pay, PhonePe और Paytm में UTR नंबर कैसे निकालें",
        "paragraphs": [
          "हर ऐप में तरीका लगभग एक जैसा है: हिस्ट्री खोलिए, पेमेंट पर टैप कीजिए और डिटेल में 12 अंकों वाला नंबर देखिए।"
        ],
        "checklist": [
          "<strong>Google Pay:</strong> ऐप खोलिए, <strong>Manage your money</strong> में जाइए, <strong>See transaction history</strong> पर टैप कीजिए और पेमेंट चुनिए। डिटेल में UPI transaction ID दिखेगी, जैसा <a href=\"https://support.google.com/pay/india/answer/9739577?hl=en\">Google Pay का हेल्प पेज</a> बताता है।",
          "<strong>PhonePe:</strong> <strong>History</strong> में जाइए, पेमेंट पर टैप कीजिए और डिटेल खोलिए। वहाँ UTR लिखा होता है। PhonePe की अपनी ट्रांज़ैक्शन ID अलग नंबर है।",
          "<strong>Paytm:</strong> <strong>Balance &amp; History</strong> में UPI पेमेंट चुनिए और <strong>Transaction Details</strong> खोलिए। वहाँ UPI Reference Number, UTR या RRN दिखेगा।",
          "<strong>बैंक ऐप, स्टेटमेंट या SMS:</strong> बैंक की ट्रांज़ैक्शन हिस्ट्री में पेमेंट खोलिए, या स्टेटमेंट में विवरण (description) या Ref No वाले कॉलम में देखिए। बैंक के डेबिट या क्रेडिट SMS में भी अक्सर यह नंबर होता है।"
        ]
      },
      {
        "heading": "UTR नंबर से पेमेंट कैसे चेक करें",
        "paragraphs": [
          "कोई सार्वजनिक वेबसाइट नहीं है जहाँ UTR डालकर कोई भी पेमेंट देख सके। यह सिर्फ़ संबंधित बैंक और आपकी ओर से काम करने वाले ऐप देख सकते हैं। इसलिए जाँच हमेशा अपने रिकॉर्ड में होती है:"
        ],
        "checklist": [
          "<strong>पैसा आना है:</strong> अपना बैंक ऐप या स्टेटमेंट ख़ुद खोलिए और उसी रकम, समय और रेफ़रेंस वाला क्रेडिट खोजिए। नहीं है, तो पैसा आपको नहीं मिला।",
          "<strong>पैसा भेजा और अटक गया:</strong> UTR नोट कीजिए और UPI ऐप के हेल्प सेक्शन में या बैंक से शिकायत कीजिए। RBI के <a href=\"https://www.rbi.org.in/commonman/English/scripts/Notification.aspx?Id=3074\">टर्नअराउंड टाइम फ़्रेमवर्क</a> के अनुसार, अगर UPI पेमेंट में आपका खाता कटा पर पाने वाले को पैसा नहीं मिला, तो पैसा अगले दिन तक (T+1) अपने आप वापस आना चाहिए।",
          "<strong>NEFT या RTGS नहीं पहुँचा:</strong> बैंक को UTR दीजिए और पाने वाले बैंक से ट्रेस करवाने को कहिए।"
        ]
      },
      {
        "heading": "स्क्रीनशॉट में दिखा UTR पेमेंट का सबूत नहीं",
        "paragraphs": [
          "दुकानदारों को अक्सर UTR वाला पेमेंट स्क्रीनशॉट दिखाया जाता है ताकि वह असली लगे। पर UTR किसी पुराने पेमेंट या किसी और की रसीद से कॉपी किया जा सकता है, एडिट की हुई तस्वीर में टाइप किया जा सकता है, या सही अंकों में बस बना लिया जा सकता है। फ़ॉर्मेट सही होने पर भी पेमेंट न हुआ हो, ऐसा हो सकता है।",
          "इसलिए असली जाँच सिर्फ़ आपका अपना खाता है। हमारी गाइड <a href=\"/blog/fake-payment-screenshot-kaise-pehchane/\">फेक पेमेंट स्क्रीनशॉट कैसे पहचानें</a> और <a href=\"/blog/payment-fail-paisa-kat-gaya/\">पेमेंट फेल, पैसा कट गया</a> आम चालें बताती हैं।"
        ],
        "callout": {
          "type": "golden-rule",
          "text": "सामान या रिफ़ंड तभी दीजिए जब पैसा आपके अपने बैंक या UPI ऐप में दिख जाए। UTR पेमेंट खोजने में मदद करता है, उसे साबित नहीं करता।"
        }
      },
      {
        "heading": "क्या UTR नंबर बताना सुरक्षित है?",
        "paragraphs": [
          "UTR सिर्फ़ एक पेमेंट की पहचान है; इससे आपके खाते से पैसा नहीं निकाला जा सकता। जिसे आपने पेमेंट किया या अपने बैंक को इसे बताना सामान्य है। अपना UPI PIN, OTP या कार्ड की जानकारी कभी किसी को मत बताइए, चाहे कोई भी पूछे। जो लोग फ़ोन या मैसेज करके आपका UTR \"ट्रैक\" करने के बदले यह जानकारी या फ़ीस माँगें, उनसे सावधान रहिए।"
        ]
      }
    ],
    "faq": [
      {
        "question": "UTR का फ़ुल फ़ॉर्म क्या है?",
        "answer": "UTR का फ़ुल फ़ॉर्म Unique Transaction Reference है। यह किसी एक UPI, IMPS, NEFT या RTGS पेमेंट का पहचान नंबर है, जिससे दोनों बैंक उस पेमेंट को पहचानते हैं।"
      },
      {
        "question": "UTR नंबर कितने अंकों का होता है?",
        "answer": "UPI और IMPS में आम तौर पर 12 अंकों का। NEFT में 16 और RTGS में 22 अक्षर-अंकों का, जिसकी शुरुआत भेजने वाले बैंक के अक्षरों से होती है।"
      },
      {
        "question": "PhonePe में UTR नंबर कहाँ मिलेगा?",
        "answer": "PhonePe में History खोलिए, पेमेंट पर टैप कीजिए और डिटेल देखिए। UPI पेमेंट का UTR आम तौर पर 12 अंकों का होता है। PhonePe की अपनी ट्रांज़ैक्शन ID अलग है।"
      },
      {
        "question": "Google Pay में UTR नंबर कैसे देखें?",
        "answer": "Google Pay में Manage your money, फिर See transaction history पर जाइए और पेमेंट पर टैप कीजिए। डिटेल में दिखने वाली UPI transaction ID वही रेफ़रेंस है जिसे बैंक ट्रेस कर सकता है।"
      },
      {
        "question": "क्या UTR नंबर ऑनलाइन चेक कर सकते हैं?",
        "answer": "किसी सार्वजनिक वेबसाइट पर नहीं। पेमेंट अपने बैंक ऐप या स्टेटमेंट में देखिए, या UTR अपने बैंक या UPI ऐप के सपोर्ट को देकर ट्रेस करवाइए।"
      },
      {
        "question": "क्या सही UTR से साबित होता है कि पैसा आ गया?",
        "answer": "नहीं। UTR कॉपी किया जा सकता है या सही फ़ॉर्मेट में बनाया जा सकता है। पैसा आया है, यह सिर्फ़ आपके अपने बैंक या UPI ऐप में दिखा क्रेडिट बताता है।"
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": [
      "what-is-utr-number",
      "fake-payment-screenshot-kaise-pehchane",
      "payment-fail-paisa-kat-gaya"
    ],
    "cta": {
      "label": "UTR का फ़ॉर्मेट जाँचें",
      "url": "/utr-number-checker/",
      "description": "देखिए कि UTR या UPI रेफ़रेंस UPI, IMPS, NEFT या RTGS के फ़ॉर्मेट जैसा है या नहीं, फिर पेमेंट अपने बैंक में पक्का कीजिए।"
    }
  },
  {
    "slug": "how-to-tell-if-an-image-is-ai-generated",
    "title": "How to Tell If an Image Is AI-Generated: 7 Checks That Work in 2026",
    "seoTitle": "How to Tell If an Image Is AI-Generated: 7 Checks",
    "metaDescription": "Is this image AI or not? Check the source, Content Credentials and SynthID watermarks, visual tells and edit traces. What each check can and cannot prove.",
    "category": "AI & Forensics",
    "publishedAt": "2026-11-22",
    "authorName": "Virat Chauhan",
    "readTime": "7 min read",
    "excerpt": "Seven practical checks for telling whether a picture was made or altered by AI: where it came from, Content Credentials, SynthID and other watermarks, visual tells, AI edits inside real photos, detectors, and when the answer really matters.",
    "targetKeywords": [
      "how to tell if an image is ai generated",
      "is this image ai generated",
      "is this image ai or not",
      "how to tell if an image is ai edited",
      "ai generated image checker",
      "how to know if a picture is ai"
    ],
    "keyTakeaway": {
      "title": "Start with the source and the watermark, not the pixels",
      "text": "The strongest evidence is outside the image: who posted it first, whether a reverse image search finds an older original, and whether the file carries Content Credentials or a SynthID watermark. Visual tells and detectors add clues, but newer generators avoid many tells and no detector is certain."
    },
    "introduction": "To tell if an image is AI-generated, run these checks in order: find where it first appeared with a reverse image search; look for Content Credentials or an AI watermark such as Google's SynthID; zoom in on hands, text, jewellery, reflections and backgrounds; check whether part of a real photo was edited; and use an AI image detector as one more clue. The first two checks give the strongest evidence. The rest help, but none proves an image is real. Here is how to do each one and what it can tell you.",
    "contentSections": [
      {
        "heading": "1. Find where the image came from",
        "paragraphs": [
          "A real photo of a real event usually has a history: an earlier post, a photographer, a news report or several angles from different people. Run a <a href=\"/reverse-image-search/\">reverse image search</a> with Google Lens, TinEye, Bing or Yandex and open the oldest, most complete match. If the image first appears on an AI art account, in a prompt-sharing group or with a caption saying it was generated, you have your answer.",
          "No earlier copy is not proof either way: a new photo and a new AI image both start with no history. But an image claiming to show a major public event that nobody else captured deserves real doubt."
        ],
        "figure": {
          "afterParagraph": 1,
          "src": "/images/blog/how-to-tell-if-an-image-is-ai-generated/fictional-example.png",
          "alt": "A fictional checklist card ranking the checks for an AI-generated image: source and earlier copies, Content Credentials, SynthID or other watermark, visual tells, edited areas and detector signals, from strongest to weakest evidence.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. The checks from strongest to weakest evidence. A fictional example card, not a real result."
        }
      },
      {
        "heading": "2. Look for Content Credentials",
        "paragraphs": [
          "Content Credentials (C2PA) are a signed record, stored with the file, of how an image was made and edited. Malwarebytes notes that they are supported by companies including Adobe, Google, Microsoft and Sony. Upload the original file to the <a href=\"https://contentcredentials.org/verify\">Content Credentials verify tool</a>, or to our <a href=\"/ai-image-detector/\">AI image detector</a>, which reads them when present. Credentials naming an AI tool are strong evidence. Missing credentials prove nothing, because most images do not carry them and screenshots or re-saves remove them."
        ]
      },
      {
        "heading": "3. Check for an AI watermark such as SynthID",
        "paragraphs": [
          "Google embeds <a href=\"https://deepmind.google/models/synthid/\">SynthID</a>, an invisible watermark, in content made or edited with its AI. Since November 2025 you can <a href=\"https://blog.google/technology/ai/ai-image-verification-gemini-app/\">upload an image to the Gemini app</a> and ask whether it was created or edited with Google AI; Gemini checks for the SynthID watermark. According to <a href=\"https://www.malwarebytes.com/blog/ai/2026/07/how-to-tell-if-an-image-is-ai-generated\">Malwarebytes' July 2026 guide</a>, SynthID now also covers images made with ChatGPT and DALL·E through a 2026 partnership, and OpenAI offers its own Verify tool.",
          "As with credentials, a watermark found is strong evidence, while no watermark found only means none was detected: the image may come from another tool, or the mark may have been lost."
        ]
      },
      {
        "heading": "4. Zoom in on the usual visual tells",
        "paragraphs": [
          "Generators have improved, so treat these as reasons to look closer, not proof. Check several at once:"
        ],
        "checklist": [
          "<strong>Hands and teeth:</strong> extra, fused or bent fingers, and teeth that blur into one shape.",
          "<strong>Text:</strong> signs, labels, number plates and screens with letters that almost make words. Our <a href=\"/blog/ai-generated-screenshot/\">guide to AI-generated screenshots</a> covers fake chats and receipts.",
          "<strong>Pairs and patterns:</strong> earrings, glasses, buttons or tiles that do not match or repeat oddly.",
          "<strong>Light and reflections:</strong> shadows falling different ways, or reflections in windows and eyes that show a different scene.",
          "<strong>Edges and backgrounds:</strong> hair melting into the background, faces in a crowd that turn into smudges, objects merging into each other.",
          "<strong>Too perfect:</strong> waxy skin with no pores, studio lighting in a supposedly casual phone photo."
        ]
      },
      {
        "heading": "5. Check whether part of a real photo was edited",
        "paragraphs": [
          "Many misleading pictures are real photos with AI edits: an object removed, a face swapped, a sign rewritten. The rest of the image looks genuine, so whole-image tells miss them. Compare it with any earlier copy from the reverse search, and look at the edited-looking area with <a href=\"/image-manipulation-checker/\">error level analysis</a>, which can show a region with a different compression history. A clean map does not prove the photo is untouched, especially after it has been shared through a chat app."
        ]
      },
      {
        "heading": "6. Use an AI image detector, and read it as a clue",
        "paragraphs": [
          "Detectors look for statistical patterns that generators leave in texture and noise. Our <a href=\"/ai-image-detector/\">AI image detector</a> lists each signal it checks (Content Credentials, metadata, texture statistics, error levels and malformed text) instead of giving a single percentage, because a confident-looking number on a re-shared or edited image is often wrong. Mixed signals are common; use them to decide what to verify next, not as a verdict. Our <a href=\"/blog/ai-image-detector-online/\">explainer on how AI detection works</a> goes deeper."
        ]
      },
      {
        "heading": "7. Decide how much certainty you need",
        "paragraphs": [
          "For a funny picture on social media, a couple of these checks is enough. When an image is used to ask for money, prove a purchase, shame someone or support a news claim, ask for the original file, check the source directly and look for confirmation from people or outlets you trust. AI-made images now appear in fake profiles, <a href=\"/blog/fake-receipt-ai-generated/\">fake receipts</a> and <a href=\"/blog/loan-app-harassment-morphed-photos/\">harassment with morphed photos</a>."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "Proof that an image is real comes from its source, not from how it looks. Proof that it is AI comes from credentials, watermarks or an admission, not from a detector score."
        }
      }
    ],
    "faq": [
      {
        "question": "How can I tell if an image is AI-generated?",
        "answer": "Check where it first appeared with a reverse image search, look for Content Credentials or a SynthID watermark, zoom in on hands, text, reflections and backgrounds, and use an AI image detector as a clue. The source and watermark checks give the strongest evidence."
      },
      {
        "question": "Is there a free way to check if an image is AI?",
        "answer": "Yes. Reverse image search is free, the Content Credentials verify tool is free, the Gemini app can check for Google's SynthID watermark, and ScreenshotChecker's AI image detector runs in your browser for free. None of them is certain on its own."
      },
      {
        "question": "Can AI detectors be wrong?",
        "answer": "Yes. Detectors miss some AI images and flag some real photos, especially after resizing, compression, screenshots or editing. Treat a detector result as one clue alongside the source and any watermark."
      },
      {
        "question": "How do I know if a photo was edited with AI rather than fully generated?",
        "answer": "Look for an earlier, different copy of the photo with reverse image search, compare the two, and check the suspicious area with error level analysis. Partial AI edits often leave the rest of the photo looking completely real."
      },
      {
        "question": "Does no watermark mean the image is real?",
        "answer": "No. Most images carry no watermark or Content Credentials, and screenshots or re-saves remove them. Only a watermark that is found tells you something."
      },
      {
        "question": "Can Gemini tell if an image is AI?",
        "answer": "The Gemini app can check whether an image was created or edited with Google AI by looking for the SynthID watermark. It cannot confirm images from tools that do not use SynthID."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": [
      "ai-image-detector-online",
      "ai-generated-screenshot",
      "how-to-tell-if-a-photo-is-edited"
    ],
    "cta": {
      "label": "Check an image for AI signals",
      "url": "/ai-image-detector/",
      "description": "See Content Credentials, metadata, texture and error-level signals for any image, processed in your browser."
    }
  },
  {
    "slug": "photo-se-search-kaise-kare",
    "lang": "hi",
    "title": "फोटो से सर्च कैसे करें? Google Lens से Reverse Image Search, मोबाइल और कंप्यूटर पर",
    "seoTitle": "फोटो से सर्च कैसे करें? Google Lens Reverse Image Search",
    "metaDescription": "फोटो या स्क्रीनशॉट से Google पर सर्च करने का तरीका: Android, iPhone और कंप्यूटर पर Google Lens, TinEye, Bing, और नतीजे कैसे समझें।",
    "category": "Forensics",
    "publishedAt": "2026-11-22",
    "authorName": "Virat Chauhan",
    "readTime": "6 min read",
    "excerpt": "Android, iPhone और कंप्यूटर पर फोटो से सर्च करने के आसान तरीके, स्क्रीनशॉट से सर्च करने से पहले क्रॉप क्यों करें, दूसरे सर्च इंजन, और नतीजों से असली स्रोत कैसे पहचानें।",
    "targetKeywords": [
      "photo se search kaise kare",
      "फोटो से सर्च कैसे करे",
      "google par photo se search kaise kare",
      "reverse image search kaise kare",
      "photo se search kaise kare online",
      "screenshot se search kaise kare"
    ],
    "keyTakeaway": {
      "title": "Google Lens खोलिए, फोटो चुनिए, सबसे पुरानी कॉपी देखिए",
      "text": "मोबाइल पर Google ऐप में Lens का आइकन दबाकर फोटो चुनिए; कंप्यूटर पर google.com पर Search by image से फोटो अपलोड कीजिए। स्क्रीनशॉट हो तो पहले सिर्फ़ तस्वीर वाला हिस्सा क्रॉप कीजिए। नतीजों में सबसे पुरानी और पूरी कॉपी असली स्रोत के सबसे क़रीब होती है।"
    },
    "introduction": "फोटो से सर्च करने का सबसे आसान तरीका Google Lens है: मोबाइल में Google ऐप खोलिए, सर्च बार में Lens (कैमरा) आइकन दबाइए और गैलरी से फोटो चुनिए। कंप्यूटर पर google.com खोलकर Search by image पर क्लिक कीजिए और फोटो अपलोड कीजिए। इससे पता चलता है कि वह तस्वीर इंटरनेट पर कहाँ-कहाँ है, किसकी है, या कोई प्रोफ़ाइल फोटो कहीं और से तो नहीं ली गई। नीचे हर डिवाइस के कदम और नतीजे समझने का तरीका है। <a href=\"/blog/reverse-image-search-screenshot/\">स्क्रीनशॉट से सर्च की अंग्रेज़ी गाइड यहाँ है।</a>",
    "contentSections": [
      {
        "heading": "Android फोन पर फोटो से सर्च कैसे करें",
        "paragraphs": [
          "Google ऐप खोलिए और सर्च बार में Lens (कैमरा) आइकन पर टैप कीजिए। गैलरी या Screenshots फ़ोल्डर से फोटो चुनिए। फोटो में जिस हिस्से को खोजना है, उसके चारों ओर बॉक्स को खींचकर छोटा-बड़ा कीजिए। नीचे मिलते-जुलते फोटो और वे वेबसाइटें दिखेंगी जिन पर वह तस्वीर है।"
        ],
        "figure": {
          "afterParagraph": 0,
          "src": "/images/blog/photo-se-search-kaise-kare/fictional-example.png",
          "alt": "फोटो से सर्च के कदमों का काल्पनिक कार्ड: Android और iPhone पर Google ऐप में Lens, कंप्यूटर पर Search by image, Chrome में राइट-क्लिक, और स्क्रीनशॉट पहले क्रॉप करने की सलाह।",
          "width": 1200,
          "height": 760,
          "caption": "चित्र 1. हर डिवाइस पर फोटो से सर्च के कदम। ऐप के बटन और नाम समय के साथ बदल सकते हैं।"
        }
      },
      {
        "heading": "iPhone पर फोटो से सर्च कैसे करें",
        "paragraphs": [
          "iPhone या iPad पर Google ऐप खोलिए, सर्च बार में Lens पर टैप कीजिए और फोटो पिकर से अपनी सेव की हुई फोटो या स्क्रीनशॉट चुनिए। जिस हिस्से को खोजना है, उस पर चुनाव वाला बॉक्स ले आइए और नतीजे देखिए।"
        ]
      },
      {
        "heading": "कंप्यूटर पर फोटो से सर्च कैसे करें",
        "paragraphs": [
          "Google की <a href=\"https://support.google.com/websearch/answer/1325808?hl=en\">हेल्प गाइड</a> कंप्यूटर के ये तरीके बताती है:"
        ],
        "checklist": [
          "<strong>फोटो अपलोड:</strong> google.com खोलिए, Search by image (कैमरा आइकन) पर क्लिक कीजिए, Upload a file चुनिए और फोटो खोलिए।",
          "<strong>खींचकर छोड़ें:</strong> फोटो फ़ाइल को खींचकर Google के सर्च बॉक्स में छोड़ दीजिए।",
          "<strong>फोटो का लिंक:</strong> वेबसाइट पर फोटो पर राइट-क्लिक करके Copy Image Address कीजिए, फिर Search by image में Paste image link वाली जगह पर लिंक डालिए।",
          "<strong>Chrome में सीधे:</strong> किसी वेबसाइट की फोटो पर राइट-क्लिक करके Search with Google Lens चुनिए; नतीजे साइड में खुलेंगे।"
        ]
      },
      {
        "heading": "स्क्रीनशॉट से सर्च करने से पहले क्रॉप कीजिए",
        "paragraphs": [
          "स्क्रीनशॉट में फ़ोन की स्टेटस बार, ऐप के बटन और कैप्शन भी होते हैं, जिनसे सर्च भटक जाता है। पहले सिर्फ़ तस्वीर वाला हिस्सा काटिए। हमारे मुफ़्त <a href=\"/reverse-image-search/\">रिवर्स इमेज सर्च टूल</a> में फोटो डालकर उस पर उंगली या माउस से हिस्सा चुनिए और Crop to selection दबाइए, या Auto-trim borders से सादे किनारे हटाइए। फिर क्रॉप की हुई कॉपी डाउनलोड करके Google Lens, TinEye, Bing या Yandex पर अपलोड कीजिए। यह सब आपके ब्राउज़र में होता है।"
        ]
      },
      {
        "heading": "Google के अलावा और कहाँ सर्च करें",
        "paragraphs": [
          "हर सर्च इंजन का अपना इंडेक्स होता है, इसलिए एक जगह कुछ न मिले तो दूसरी जगह आज़माइए:"
        ],
        "checklist": [
          "<strong>TinEye:</strong> उसी फोटो की कॉपियाँ खोजने में अच्छा, कुछ क्रॉप या एडिट की हुई कॉपियाँ भी।",
          "<strong>Bing Visual Search:</strong> मिलते-जुलते फोटो, पेज और प्रोडक्ट।",
          "<strong>Yandex Images:</strong> जब बाकी कुछ न दें, तब आज़माने लायक एक अलग इंडेक्स।"
        ]
      },
      {
        "heading": "नतीजे कैसे समझें",
        "paragraphs": [
          "सबसे पुरानी और सबसे पूरी (बड़ी, बिना कटी) कॉपी असली स्रोत के सबसे क़रीब होती है, पर पक्का सबूत नहीं, क्योंकि सर्च इंजन ने शायद पहली पोस्ट देखी ही न हो। पेज खोलकर तारीख़, कैप्शन और फ़ोटोग्राफ़र का नाम देखिए।",
          "कुछ न मिलने का मतलब यह नहीं कि फोटो असली या नई है। निजी, नई या बहुत बदली हुई तस्वीरें अक्सर नहीं मिलतीं। फोटो AI से बनी लगे तो हमारी गाइड <a href=\"/blog/how-to-tell-if-an-image-is-ai-generated/\">कैसे पहचानें कि इमेज AI से बनी है</a> (अंग्रेज़ी) देखिए।"
        ],
        "callout": {
          "type": "tip",
          "text": "ठगी से बचने में यह बहुत काम आता है: ऑनलाइन दोस्त की प्रोफ़ाइल फोटो, OLX पर सामान की फोटो या नौकरी देने वाले की तस्वीर सर्च कीजिए। वही फोटो किसी और नाम से कहीं और मिले, तो सावधान हो जाइए।"
        }
      },
      {
        "heading": "प्राइवेसी का ध्यान रखें",
        "paragraphs": [
          "फोटो अपलोड करने पर वह सर्च करने वाली कंपनी तक जाती है और उसकी नीतियों के अनुसार इस्तेमाल हो सकती है। अपनी निजी तस्वीरें, बच्चों की फोटो या पहचान पत्र जैसी चीज़ें सर्च के लिए अपलोड न करें। स्क्रीनशॉट में नाम, नंबर या खाते की जानकारी हो, तो पहले <a href=\"/screenshot-redactor/\">स्क्रीनशॉट रिडैक्टर</a> से छिपा दीजिए।"
        ]
      }
    ],
    "faq": [
      {
        "question": "मोबाइल में फोटो से सर्च कैसे करें?",
        "answer": "Google ऐप खोलिए, सर्च बार में Lens (कैमरा) आइकन दबाइए, गैलरी से फोटो चुनिए और खोजने वाले हिस्से पर बॉक्स ले आइए। Android और iPhone दोनों पर यही तरीका है।"
      },
      {
        "question": "कंप्यूटर पर Google में फोटो से सर्च कैसे करें?",
        "answer": "google.com खोलकर Search by image पर क्लिक कीजिए और फोटो अपलोड कीजिए, या फोटो को सर्च बॉक्स में खींचकर छोड़िए। Chrome में किसी फोटो पर राइट-क्लिक करके Search with Google Lens भी चुन सकते हैं।"
      },
      {
        "question": "क्या स्क्रीनशॉट से भी सर्च कर सकते हैं?",
        "answer": "हाँ। पहले स्टेटस बार, बटन और कैप्शन हटाकर सिर्फ़ तस्वीर वाला हिस्सा क्रॉप कीजिए, फिर उस कॉपी से सर्च कीजिए। हमारे रिवर्स इमेज सर्च टूल में यह क्रॉप आपके ब्राउज़र में हो जाता है।"
      },
      {
        "question": "फोटो से किसी व्यक्ति को कैसे ढूँढें?",
        "answer": "Reverse image search यह दिखा सकता है कि वही फोटो इंटरनेट पर कहाँ छपी है, जैसे नकली प्रोफ़ाइल पकड़ने के लिए। पर किसी अनजान व्यक्ति की निजी जानकारी खोजना या उसका पीछा करना ग़लत है, और कई जगह अपराध भी।"
      },
      {
        "question": "कुछ भी न मिले तो इसका क्या मतलब है?",
        "answer": "इसका मतलब सिर्फ़ इतना है कि उस सर्च इंजन के इंडेक्स में मिलती फोटो नहीं है। फोटो नई, निजी या बदली हुई हो सकती है। दूसरा सर्च इंजन आज़माइए, और कुछ न मिलना असली होने का सबूत मत मानिए।"
      },
      {
        "question": "क्या फोटो से सर्च करना सुरक्षित है?",
        "answer": "सार्वजनिक फोटो के लिए हाँ, पर अपलोड की गई फोटो सर्च कंपनी तक जाती है। निजी फोटो, बच्चों की तस्वीरें और पहचान पत्र अपलोड न करें।"
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": [
      "reverse-image-search-screenshot",
      "how-to-tell-if-an-image-is-ai-generated",
      "fake-payment-screenshot-kaise-pehchane"
    ],
    "cta": {
      "label": "फोटो क्रॉप करके सर्च करें",
      "url": "/reverse-image-search/",
      "description": "फोटो या स्क्रीनशॉट का ज़रूरी हिस्सा अपने ब्राउज़र में क्रॉप कीजिए, फिर Google Lens, TinEye, Bing या Yandex पर सर्च कीजिए।"
    }
  },
  {
    "slug": "utr-number-tracking",
    "title": "UTR Number Tracking Online: How to Track a Payment by Its UTR",
    "seoTitle": "UTR Number Tracking Online: How to Track a Payment by UTR",
    "metaDescription": "No public website tracks a UTR number. How to track a UPI, IMPS, NEFT or RTGS payment through your bank, how long each takes, and when to complain.",
    "category": "Security",
    "publishedAt": "2026-11-27",
    "authorName": "Virat Chauhan",
    "readTime": "6 min read",
    "excerpt": "There is no public website that tracks a UTR number. How to track a UPI, IMPS, NEFT or RTGS payment with its UTR through your own bank or app, the time limits the RBI sets for each, what details the bank will ask for, and how to escalate.",
    "targetKeywords": [
      "utr number tracking",
      "utr number tracking online",
      "track payment by utr number",
      "utr number status check",
      "how to track utr number",
      "utr tracking"
    ],
    "keyTakeaway": {
      "title": "You track a UTR through your bank, not a website",
      "text": "No public website shows the status of a payment from its UTR number. You track it in your own bank or UPI app, or by giving the UTR to your bank. The RBI expects a NEFT credit within two hours of batch settlement and an RTGS credit within 30 minutes, and a failed UPI or IMPS transfer should be reversed by the next day (T+1)."
    },
    "introduction": "You cannot track a UTR number on a public website: only the sending bank, the receiving bank and the apps acting for them can see a payment's status. To track a payment, look it up in your own bank or UPI app, or give the UTR to your bank and ask them to trace it. This guide covers how that works for UPI, IMPS, NEFT and RTGS, how long each should take under the RBI's rules, and what to do when the money still has not arrived. If you do not have the number yet, see <a href=\"/blog/how-to-find-utr-number/\">how to find your UTR number</a>.",
    "contentSections": [
      {
        "heading": "Is there a website for UTR number tracking?",
        "paragraphs": [
          "No. The Reserve Bank of India's own FAQs describe tracking as something you do through your bank. For NEFT, the <a href=\"https://www.rbi.org.in/commonman/english/scripts/FAQs.aspx?Id=274\">RBI's NEFT FAQ</a> says the sender and the receiver can each track a transfer by contacting their own bank's NEFT Customer Facilitation Centre. For RTGS, the <a href=\"https://www.rbi.org.in/Scripts/FAQView.aspx?Id=65\">RBI's RTGS FAQ</a> says customers do not have a facility to track the transaction themselves; the sending bank is told when the money is credited and should inform you.",
          "That is the same whichever bank you use. A site or a caller that promises to \"track any UTR online\" cannot see inside the banking system. At best it checks the format of the number, as our own <a href=\"/utr-number-checker/\">UTR number checker</a> does. At worst it is collecting your details."
        ],
        "figure": {
          "afterParagraph": 1,
          "src": "/images/blog/utr-number-tracking/fictional-example.png",
          "alt": "A fictional tracking card showing where to track a payment by its UTR: UPI and IMPS in the app or bank with reversal by the next day, NEFT through the bank within two hours of batch settlement, RTGS through the bank within 30 minutes, and a warning that no public website tracks a UTR.",
          "width": 1200,
          "height": 760,
          "caption": "Figure 1. Where a payment is tracked and how long it should take, based on RBI FAQs and its 2019 turnaround time circular."
        },
        "callout": {
          "type": "warning",
          "text": "Never give your UPI PIN, an OTP, card details or remote access to someone who offers to track a UTR for you. Tracking a payment needs only the UTR and the payment details, and only your bank can do it."
        }
      },
      {
        "heading": "How to track a UPI or IMPS payment by UTR",
        "paragraphs": [
          "For UPI and IMPS, the 12-digit reference is the UTR. Tracking it is mostly a matter of checking the right record:"
        ],
        "checklist": [
          "<strong>Open the payment in your UPI or bank app.</strong> The transaction's own page shows whether it is successful, pending or failed. That status is the tracking.",
          "<strong>Check your bank statement or SMS.</strong> Look for a debit or credit with the same amount, time and reference. If you were meant to receive the money and there is no credit, it has not reached you, whatever a screenshot shows.",
          "<strong>If the money left your account but did not reach the other person,</strong> wait until the next day. Under the RBI's <a href=\"https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11693\">2019 turnaround time circular</a>, when a UPI or IMPS transfer debits the sender and the receiver is not credited, the receiving bank must reverse it automatically at the latest on T+1, the day after the transaction.",
          "<strong>If it is not reversed by then,</strong> raise it in the app's help section or with your bank and quote the UTR. The same circular sets compensation of Rs 100 a day for delays beyond T+1, to be credited without you having to claim it.",
          "<strong>Paid a shop and the shop did not get a confirmation?</strong> The circular gives UPI merchant payments up to T+5 days for the automatic reversal."
        ]
      },
      {
        "heading": "How to track a NEFT payment by UTR",
        "paragraphs": [
          "NEFT moves money in batches that run every half hour. According to the RBI's NEFT FAQ, the receiver should normally be credited within two hours of the batch being settled. If that time has passed and the money has not arrived:"
        ],
        "checklist": [
          "Contact your own bank, through the branch, the app or its NEFT Customer Facilitation Centre. Sender and receiver each ask their own bank.",
          "Keep the details the RBI says a bank may need for faster tracking: the UTR or transaction reference number, the date, the sending branch's IFSC, the amount, the receiver's name and the receiving branch's IFSC.",
          "Ask whether the transfer was credited, is still pending or was returned. A transfer that cannot be credited is sent back to the sender's bank."
        ]
      },
      {
        "heading": "How to track an RTGS payment by UTR",
        "paragraphs": [
          "The RBI's RTGS FAQ describes the RTGS UTR as a 22-character code that identifies the transaction. RTGS is meant to be immediate: the receiving bank has to credit the account within 30 minutes of getting the transfer message. If it cannot credit the money, it has to return it to the sending bank within one hour, or before the end of the RTGS business day if that is earlier, and the sending bank then puts the money back in your account.",
          "Because customers cannot track RTGS themselves, the step is simple: give the UTR to your bank or branch and ask for the status. The FAQ also says that when a credit is delayed, compensation at the current repo rate plus 2% is payable to the customer automatically."
        ]
      },
      {
        "heading": "What to do if the bank does not resolve it",
        "paragraphs": [
          "Both RBI FAQs give the same order. First complain to your bank's grievance redressal cell, in writing, with the UTR. If the bank does not resolve it within the time allowed under the Reserve Bank's Integrated Ombudsman Scheme, you can file a complaint under that scheme on the RBI's <a href=\"https://cms.rbi.org.in/\">Complaint Management System</a>. It is free.",
          "If you sent the money because of a fraud, do not wait for tracking. Call the cyber crime helpline 1930 or report at cybercrime.gov.in as soon as you can, and tell your bank. Our guide on <a href=\"/blog/payment-failed-screenshot-scam/\">payment failed screenshot scams</a> covers the cases where a stranger claims a payment is stuck and asks you to send it again."
        ]
      },
      {
        "heading": "Someone sent you a UTR to prove they paid",
        "paragraphs": [
          "Sellers often search for UTR tracking because a buyer has sent a screenshot with a UTR and the money is not showing. You cannot look up their UTR anywhere, and you do not need to. Open your own bank or UPI app and look for the credit. If it is not there, you have not been paid yet, and the buyer is the one who should ask their bank to trace the payment.",
          "A UTR can be copied from an old receipt or typed into an edited image, so its format proves nothing. The <a href=\"/payment-screenshot-checker/\">payment screenshot checker</a> flags warning signs in the image, and <a href=\"/blog/what-is-utr-number/\">what is a UTR number</a> explains the formats."
        ],
        "callout": {
          "type": "golden-rule",
          "text": "The only tracking that counts is your own account. Hand over goods or a refund after the credit shows in your bank or UPI app, not after you see a UTR."
        }
      }
    ],
    "faq": [
      {
        "question": "Can I track a UTR number online?",
        "answer": "Not on a public website. You can see the status of your own payment in your bank or UPI app, or give the UTR to your bank and ask them to trace it. The RBI's FAQs describe tracking through the bank only."
      },
      {
        "question": "Does the RBI have a UTR tracking website?",
        "answer": "No. The RBI's NEFT FAQ says to contact your bank's NEFT Customer Facilitation Centre, and its RTGS FAQ says customers cannot track a transaction themselves. The RBI's Complaint Management System is for complaints, not for looking up a payment."
      },
      {
        "question": "How do I track a NEFT transaction with a UTR number?",
        "answer": "Contact your own bank with the UTR, the date, the amount and the IFSC and name details of the transfer. The RBI expects a NEFT credit within two hours of the batch being settled."
      },
      {
        "question": "How long does a failed UPI payment take to come back?",
        "answer": "Under the RBI's 2019 turnaround time circular, a UPI transfer that debits the sender without crediting the receiver must be reversed at the latest on the next day (T+1). For UPI payments to merchants the limit is T+5 days."
      },
      {
        "question": "Can I track someone else's payment with their UTR?",
        "answer": "No. Only the banks involved can see it. If someone says they paid you, check for the credit in your own account. If it is missing, they should ask their bank to trace the payment."
      },
      {
        "question": "Is the process different for SBI, PNB, Bank of Baroda or another bank?",
        "answer": "The route is the same for every bank: your own bank's app, statement, branch or customer care. Menus and names differ from bank to bank, but none of them can be replaced by a third-party tracking site."
      }
    ],
    "peopleAlsoSearch": [],
    "relatedSlugs": [
      "what-is-utr-number",
      "how-to-find-utr-number",
      "payment-failed-screenshot-scam"
    ],
    "cta": {
      "label": "Check a UTR format",
      "url": "/utr-number-checker/",
      "description": "See which payment system a UTR or UPI reference matches, in your browser, then track the payment with your own bank."
    }
  },
];

export function getAllArticles(): BlogArticle[] {
  return BLOG_ARTICLES;
}

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug);
}

export function getRelatedArticles(currentSlug: string): BlogArticle[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) return [];

  const related = current.relatedSlugs
    .map((s) => getArticleBySlug(s))
    .filter((a): a is BlogArticle => a !== undefined);

  if (related.length < 3) {
    const others = BLOG_ARTICLES.filter((a) => a.slug !== currentSlug && !current.relatedSlugs.includes(a.slug));
    return [...related, ...others].slice(0, 3);
  }

  return related.slice(0, 3);
}

/** Dates are stored once as calendar dates; UTC avoids visitor/server timezone shifts. */
export function formatArticleDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}
