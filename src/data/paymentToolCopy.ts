// Fixed interface text around the payment checker. English is the default; the Hindi page passes PAYMENT_COPY_HI.
// Strings marked html may contain inline markup.

export interface PaymentToolCopy {
  privacyPill: string;
  dropZoneLabel: string;
  uploadTitle: string;
  uploadText: string;
  selectButton: string;
  pasteHint: string;
  formats: string;
  progress: string;
  samplesLabel: string;
  guidanceEyebrow: string;
  guidanceTitle: string;
  guidanceIntro: string;
  /** html */
  guidanceCards: Array<{ title: string; html: string }>;
  workflowEyebrow: string;
  workflowTitle: string;
  coverageEyebrow: string;
  coverageTitle: string;
  coverageIntro: string;
  limitationsTitle: string;
  /** html */
  sourcesHtml: string;
  faqEyebrow: string;
  faqTitle: string;
  /** Shown under the uploader when the results panel is not in the page language. */
  reportNote?: string;
}

export const PAYMENT_COPY_EN: PaymentToolCopy = {
  privacyPill: 'In-browser OCR and text checks. Financial screenshots are processed locally.',
  dropZoneLabel: 'Upload or drop a payment screenshot for analysis',
  uploadTitle: 'Upload UPI or Payment Screenshot',
  uploadText:
    'Read payment details from PhonePe, Google Pay, Paytm, BHIM, and Pop UPI screenshots and review text/reference indicators. Fonts, layout and settled funds are not verified.',
  selectButton: 'Select Payment Screenshot',
  pasteHint: 'or press',
  formats: 'Supports PNG, JPG, WebP & BMP up to 25MB',
  progress: 'Reading payment details...',
  samplesLabel: 'Try synthetic payment examples:',
  guidanceEyebrow: 'Manual Review Guidance',
  guidanceTitle: 'Review Payment Screenshot Clues',
  guidanceIntro:
    'These are manual review prompts alongside OCR text rules. The current text-rule engine does not measure font families, icon positions or pixel editing.',
  guidanceCards: [
    {
      title: 'Review Text Appearance Manually',
      html: 'Compare text appearance in the original image with an official receipt. The OCR label <em>"Banking name:"</em> does not establish a font mismatch or editing; this tool does not measure fonts.',
    },
    {
      title: 'Symbols in Extracted Text',
      html: 'OCR can merge nearby symbols into bank-name text, such as <em>"State 🏦 Bank of India"</em>. Inspect the original image manually; extracted symbols do not establish icon misplacement or composite editing.',
    },
    {
      title: 'Different Amounts Need Context',
      html: 'Compare each amount with its label in the original image. A fee or balance may legitimately differ from the payment amount, and OCR can misread digits. An amount-rule warning does not establish that pixels were edited.',
    },
    {
      title: 'Compare References With Official Records',
      html: 'Reference labels and formats can differ, and OCR may omit or misread characters. This checker applies configured format rules; it does not query a bank transaction database. A plausible reference can be copied, so digit count alone cannot authenticate a payment.',
    },
  ],
  workflowEyebrow: 'Workflow',
  workflowTitle: 'How It Works',
  coverageEyebrow: 'Text Recognition Coverage',
  coverageTitle: 'Indian UPI Receipt Text',
  coverageIntro:
    'The classifier looks for names or supported handles associated with Google Pay, PhonePe, Paytm, BHIM and Pop UPI. Recognition is text-based and can be wrong.',
  limitationsTitle: 'Technical Limitations & Essential Guidance',
  sourcesHtml:
    'Verification guidance: <a href="https://support.google.com/pay/india/answer/16919844?hl=en" class="text-primary underline">Google Pay\'s bank-statement checks</a> and <a href="https://www.phonepe.com/blog/trust-and-safety/heres-a-quick-guide-to-help-you-avoid-becoming-a-victim-of-fake-payment-screenshots-2/" class="text-primary underline">PhonePe\'s fake-screenshot precautions</a>.',
  faqEyebrow: 'Questions & Answers',
  faqTitle: 'Frequently Asked Questions',
};

export const PAYMENT_COPY_HI: PaymentToolCopy = {
  privacyPill: 'OCR और टेक्स्ट की जांच आपके ब्राउज़र में होती है। पेमेंट स्क्रीनशॉट अपलोड नहीं होता।',
  dropZoneLabel: 'जांच के लिए पेमेंट स्क्रीनशॉट अपलोड करें या यहां छोड़ें',
  uploadTitle: 'UPI पेमेंट स्क्रीनशॉट अपलोड करें',
  uploadText:
    'PhonePe, Google Pay, Paytm, BHIM और Pop UPI स्क्रीनशॉट से रकम, नाम और reference पढ़कर चेतावनी वाले संकेत दिखाता है। फ़ॉन्ट, लेआउट और खाते में पैसा पहुंचा या नहीं, यह जांच नहीं होती।',
  selectButton: 'पेमेंट स्क्रीनशॉट चुनें',
  pasteHint: 'या दबाएं',
  formats: 'PNG, JPG, WebP और BMP, 25MB तक',
  progress: 'पेमेंट की जानकारी पढ़ी जा रही है...',
  samplesLabel: 'काल्पनिक उदाहरण आज़माएं:',
  guidanceEyebrow: 'खुद जांचने के तरीके',
  guidanceTitle: 'पेमेंट स्क्रीनशॉट में क्या देखें',
  guidanceIntro:
    'ये संकेत OCR वाले नियमों के साथ खुद जांचने के लिए हैं। यह टूल फ़ॉन्ट, आइकन की जगह या पिक्सल एडिटिंग नहीं मापता।',
  guidanceCards: [
    {
      title: 'टेक्स्ट को खुद मिलाकर देखें',
      html: 'असली रसीद से स्क्रीनशॉट के अक्षरों की बनावट मिलाएं। OCR में <em>"Banking name:"</em> जैसा लेबल आना फ़ॉन्ट की गड़बड़ी या एडिटिंग का सबूत नहीं है; यह टूल फ़ॉन्ट नहीं मापता।',
    },
    {
      title: 'टेक्स्ट में आए निशान',
      html: 'OCR पास के निशानों को बैंक के नाम में जोड़ सकता है, जैसे <em>"State 🏦 Bank of India"</em>। मूल तस्वीर खुद देखें; ऐसे निशान आइकन के गलत होने या तस्वीर जोड़ने का सबूत नहीं हैं।',
    },
    {
      title: 'अलग-अलग रकम का मतलब समझें',
      html: 'हर रकम को उसके लेबल के साथ मूल तस्वीर में देखें। फ़ीस या बैलेंस भुगतान की रकम से अलग हो सकता है, और OCR अंक गलत पढ़ सकता है। रकम वाली चेतावनी का मतलब यह नहीं कि तस्वीर एडिट की गई है।',
    },
    {
      title: 'Reference को अपने रिकॉर्ड से मिलाएं',
      html: 'Reference के लेबल और फ़ॉर्मेट अलग-अलग हो सकते हैं, और OCR कुछ अक्षर छोड़ या गलत पढ़ सकता है। यह टूल बैंक के रिकॉर्ड में reference नहीं खोजता। सही दिखने वाला reference कॉपी भी किया जा सकता है, इसलिए अंकों की गिनती से पेमेंट साबित नहीं होती।',
    },
  ],
  workflowEyebrow: 'तरीका',
  workflowTitle: 'यह कैसे काम करता है',
  coverageEyebrow: 'कौन से ऐप का टेक्स्ट पहचाना जाता है',
  coverageTitle: 'भारतीय UPI रसीद का टेक्स्ट',
  coverageIntro:
    'टूल टेक्स्ट में Google Pay, PhonePe, Paytm, BHIM और Pop UPI के नाम या handle खोजता है। यह पहचान सिर्फ़ टेक्स्ट से होती है और गलत भी हो सकती है।',
  limitationsTitle: 'सीमाएं और ज़रूरी सलाह',
  sourcesHtml:
    'जांच के आधिकारिक तरीके: <a href="https://support.google.com/pay/india/answer/16919844?hl=en" class="text-primary underline">Google Pay की बैंक स्टेटमेंट गाइड</a> और <a href="https://www.phonepe.com/blog/trust-and-safety/heres-a-quick-guide-to-help-you-avoid-becoming-a-victim-of-fake-payment-screenshots-2/" class="text-primary underline">नकली स्क्रीनशॉट पर PhonePe की सलाह</a>। विस्तार से पढ़ें: <a href="/blog/fake-payment-screenshot-kaise-pehchane/" class="text-primary underline">नकली पेमेंट स्क्रीनशॉट कैसे पहचानें</a>।',
  faqEyebrow: 'सवाल-जवाब',
  faqTitle: 'अक्सर पूछे जाने वाले सवाल',
  reportNote: 'जांच की रिपोर्ट अभी अंग्रेज़ी में दिखती है। ऊपर के नियम और नीचे की सलाह हिंदी में है।',
};
