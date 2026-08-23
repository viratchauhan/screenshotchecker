export type FraudVerdict = 'LIKELY_FRAUD' | 'SUSPICIOUS' | 'LIKELY_LEGITIMATE';
export type RiskLevel = 'CRITICAL' | 'HIGH' | 'SUSPICIOUS' | 'CAUTION' | 'LOW';

export interface ReferenceScamPattern {
  id: string;
  name: string;
  originalMessage: string;
  categories: string[];
  riskLevel: RiskLevel;
  baseRiskScore: number;
  intent: {
    claiming: string;
    wantsUserToDo: string;
    motive: string;
  };
  matchingConcepts: string[];
  signals: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    evidence: string;
  }>;
  claimedOrganization?: string;
  recommendedVerdict: FraudVerdict;
  explanation: {
    en: string;
    hi: string;
  };
  recommendation: string;
  falsePositiveGuards?: string[];
}

export interface SignalCategoryItem {
  id: string;
  category: 'urgency' | 'threat' | 'money' | 'sensitive_info' | 'link' | 'attachment' | 'impersonation' | 'social_engineering';
  keywords: string[];
  weight: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Structured Knowledge Base parsed and compiled from fraud_sms_whatsapp_reference_dataset.txt
 */
export const FRAUD_SIGNAL_LIBRARY: SignalCategoryItem[] = [
  {
    id: 'urgency_keywords',
    category: 'urgency',
    keywords: [
      'urgently', 'immediately', 'act now', 'last date', 'final warning',
      'enrollment ends soon', 'payment due today', 'avoid blocking',
      'avoid suspension', 'avoid penalty', 'failure to act', 'within 24 hours',
      'within 12 hours', 'disconnected tonight', 'before 5pm', 'expiring today',
      'time sensitive', 'immediate action', 'before it is too late'
    ],
    weight: 10,
    severity: 'medium',
  },
  {
    id: 'threat_keywords',
    category: 'threat',
    keywords: [
      'account blocked', 'account locked', 'account suspended', 'account frozen',
      'suspicious activity', 'suspicious activities', 'legal action', 'fine',
      'penalty', 'license cancellation', 'information at risk', 'payment failure',
      'driver license not be renewed', 'dmv record', 'service termination', 'arrest warrant',
      'power cutoff', 'electricity power will be disconnected', 'court summons',
      'fir registered', 'digital arrest', 'cyber crime cell', 'membership on hold',
      'sim card will be blocked'
    ],
    weight: 15,
    severity: 'high',
  },
  {
    id: 'money_keywords',
    category: 'money',
    keywords: [
      'pay now', 'outstanding amount', 'processing fee', 'delivery fee',
      'toll payment', 'claim fee', 'verification fee', 'toll amount', 'unpaid toll',
      'pay the balance', 'excessive fine', 'prepaid task', 'advance fee',
      'clearance fee', 'auto-debit', 'billed to your card', 'auto-renewal',
      'sort code', 'wire transfer', '300% guaranteed profit', '300% daily'
    ],
    weight: 10,
    severity: 'high',
  },
  {
    id: 'sensitive_info_keywords',
    category: 'sensitive_info',
    keywords: [
      'otp', 'pin', 'cvv', 'password', 'bank details', 'card number',
      'aadhaar', 'pan', 'pan card', 'kyc', 'rekyc', 'email', 'emails', 'address',
      'emails and address', 'email and address', 'verify your identity',
      'share your verification code', '6-digit code', '6-digit whatsapp', 'fsa id',
      'ssn', 'personal details', 'personal info', 'personal information'
    ],
    weight: 10,
    severity: 'high',
  },
  {
    id: 'attachment_keywords',
    category: 'attachment',
    keywords: [
      '.apk', 'apk', '18 mb · apk', '.exe', '.zip', 'open pdf file',
      'open attached file', 'install application', 'download file', 'download loan app',
      'banking apk', 'kyc apk', 'anydesk', 'teamviewer'
    ],
    weight: 20,
    severity: 'critical',
  },
  {
    id: 'impersonation_keywords',
    category: 'impersonation',
    keywords: [
      'bank of maharashtra', 'wells fargo', 'chase', 'bank of america', 'sbi',
      'state bank of india', 'hdfc', 'hdfc bank', 'icici', 'axis bank',
      'fedex', 'fed3x', 'ups', 'usps', 'royal mail', 'dhl', 'target',
      'walmart', 'amazon', 'apple', 'netflix', 'spotify', 'geek squad', 'norton', 'mcafee',
      'sunpass', 'florida toll', 'e-zpass', 'ezpass', 'dmv', 'electricity office',
      'power officer', 'traffic police', 'parivahan', 'cyber crime cell', 'cbi',
      'income tax department', 'irs', 'hmrc', 'jio', 'airtel', 'kbc', 'morgan stanley',
      'rbi', 'telecom', 'google reviews'
    ],
    weight: 10,
    severity: 'medium',
  },
  {
    id: 'social_engineering_keywords',
    category: 'social_engineering',
    keywords: [
      'may you send me', 'send me your', 'for our record', 'for our records',
      'is this john', 'may i share the job information', 'write google reviews',
      'each review pays', 'google doc', 'part time job', 'easy money', 'earn per day',
      'wrong number', 'hello and good morning', 'hi mum', 'hi dad', 'dropped my phone',
      'accidentally sent code', 'are you at your desk', 'confidential executive meeting'
    ],
    weight: 10,
    severity: 'high',
  },
  {
    id: 'unsolicited_offer_keywords',
    category: 'social_engineering',
    keywords: [
      "you've won", 'you won', 'won a', 'gift card', '$500 gift card', 'claim your reward',
      'congratulations winner', 'selected as a winner', 'click to claim',
      'loan forgiveness', 'student loan forgiveness', 'enrollment ends soon',
      'you may qualify', 'pre-approved personal loan', '1% interest rate', 'without cibil',
      'kbc lottery', 'lottery officer', 'cash prize'
    ],
    weight: 10,
    severity: 'high',
  },
];

export const REFERENCE_SCAM_DATASET: ReferenceScamPattern[] = [
  // =========================================================================
  // EXAMPLE 1 — BANK / REKYC / APK PHISHING
  // =========================================================================
  {
    id: 'bank_rekyc_apk_001',
    name: 'Bank ReKYC / APK Malware Phishing',
    originalMessage: '*URGENTLY REQUIRED:-Your Bank of Maharashtra ReKYC pending for Bank of Maharashtra CustID XXXX.Complete ReKYC Last Date 13.may 2025 to avoid A/c blocking. Open PDF file. Immediately Thank you!',
    categories: ['BANK_KYC_PHISHING', 'MALICIOUS_ATTACHMENT', 'BANK_IMPERSONATION'],
    riskLevel: 'CRITICAL',
    baseRiskScore: 98,
    intent: {
      claiming: 'Claims your bank account ReKYC is pending and account will be blocked unless you complete KYC immediately.',
      wantsUserToDo: 'Open the attached APK/file and complete ReKYC on your mobile device.',
      motive: 'Deliver an Android Trojan/malware APK to intercept SMS OTPs and steal banking credentials.',
    },
    matchingConcepts: [
      'rekyc pending', 'complete kyc', 'account will be blocked', 'avoid account blocking',
      'last date', 'urgently required', 'open attached file', 'bank apk', 'banking apk',
      'kyc apk', '18 mb apk', 'customer id', 'account suspension'
    ],
    signals: [
      { type: 'IMPERSONATION', severity: 'high', evidence: 'Claimed organization: Bank of Maharashtra / Banking Institution' },
      { type: 'ACCOUNT_THREAT', severity: 'high', evidence: 'Account blocking threat: "avoid A/c blocking"' },
      { type: 'URGENCY', severity: 'high', evidence: 'Urgent action: "URGENTLY REQUIRED / Last Date"' },
      { type: 'MALICIOUS_ATTACHMENT', severity: 'critical', evidence: 'User instructed to open attached APK application file for KYC' },
    ],
    claimedOrganization: 'Bank of Maharashtra',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message claims to be from Bank of Maharashtra and urges you to complete KYC immediately to avoid account blocking. It asks you to open an attached file or APK.',
      hi: 'Ye message claim kar raha hai ki aapka Bank of Maharashtra account ka ReKYC pending hai aur account block hone se bachne ke liye aapko attached APK file open karni hai. Banking KYC ke naam par APK install karwana ek critical malware threat hai.',
    },
    recommendation: 'Do not open or install the APK file. Banks never distribute APK files via SMS or WhatsApp. Verify your account directly through the official bank app or at a physical branch.',
    falsePositiveGuards: ['official app store link', 'standard branch visit advice'],
  },

  // =========================================================================
  // EXAMPLE 2 — UNKNOWN CONTACT ASKING FOR PERSONAL DETAILS
  // =========================================================================
  {
    id: 'unknown_contact_info_harvest_002',
    name: 'Unknown Contact Personal Data Harvesting',
    originalMessage: 'May you send me your emails and address for our record?',
    categories: ['SOCIAL_ENGINEERING', 'PERSONAL_DATA_HARVESTING'],
    riskLevel: 'HIGH',
    baseRiskScore: 78,
    intent: {
      claiming: 'Sender claims they need your email address and physical location for unspecified official records.',
      wantsUserToDo: 'Reply with your private email address and home address.',
      motive: 'Collect targeted personal identifying information (PII) for credential matching or spear-phishing.',
    },
    matchingConcepts: [
      'send me your email', 'send your email address', 'send your address',
      'for our record', 'please share your personal details', 'send your information',
      'share your email and address'
    ],
    signals: [
      { type: 'UNKNOWN_SENDER', severity: 'medium', evidence: 'Unknown contact without established business relationship' },
      { type: 'SENSITIVE_INFO_REQUEST', severity: 'high', evidence: 'Unsolicited request for email and physical home address' },
      { type: 'SOCIAL_ENGINEERING', severity: 'medium', evidence: 'Vague pretext: "for our record"' },
    ],
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'The sender is asking for your email address and physical address for record-keeping purposes.',
      hi: 'Koi unknown sender bina kisi verified context ke aapka private email aur home address maang raha hai. Ye personal data harvesting aur social engineering ka indicator hai.',
    },
    recommendation: 'Do not share your email, phone number, address, or other personal details with unknown contacts.',
  },

  // =========================================================================
  // EXAMPLE 3 — FAKE ACCOUNT SECURITY ALERT (FEDEX/BRAND)
  // =========================================================================
  {
    id: 'account_security_phishing_003',
    name: 'Fake Account Security Alert Phishing',
    originalMessage: "Fed3x: Attention! We've found suspicious activities on your account! Contact us to protects your information!!",
    categories: ['ACCOUNT_SECURITY_PHISHING', 'BRAND_IMPERSONATION', 'SOCIAL_ENGINEERING'],
    riskLevel: 'HIGH',
    baseRiskScore: 89,
    intent: {
      claiming: 'Claims suspicious activities were detected on your account and your information is compromised.',
      wantsUserToDo: 'Contact the sender or click/call to "protect your information".',
      motive: 'Exploit panic to capture account login credentials and personal identity information.',
    },
    matchingConcepts: [
      'suspicious activity on your account', 'suspicious activities', 'account has been compromised',
      'contact us to protect', 'verify your account', 'security alert', 'information is at risk',
      'fedex account', 'fed3x', 'account protection'
    ],
    signals: [
      { type: 'BRAND_IMPERSONATION', severity: 'high', evidence: 'Impersonates FedEx/brand with deceptive spelling ("Fed3x")' },
      { type: 'FEAR_THREAT', severity: 'high', evidence: 'Fear tactic: "We\'ve found suspicious activities on your account!"' },
      { type: 'URGENCY', severity: 'medium', evidence: 'Urgent prompt: "Attention! Contact us to protects your information!!"' },
    ],
    claimedOrganization: 'FedEx',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message claims that suspicious activities were detected on your FedEx account and urges you to contact the sender immediately to protect your information.',
      hi: 'Ye message FedEx ki spelling distort karke fake security alert bhej raha hai ki account me suspicious activity hui hai. Ye phishing credentials lene ka classic trick hai.',
    },
    recommendation: 'Do not reply or click any links. Sign in directly to your official account on the genuine brand website.',
  },

  // =========================================================================
  // EXAMPLE 4 — FAKE JOB / REVIEW TASK SCAM
  // =========================================================================
  {
    id: 'fake_job_review_task_004',
    name: 'Fake Job / Review Task Social Engineering Scam',
    originalMessage: 'May I share the job information with you? Great. We are Big Mover Company Llc. Your role is to right Google reviews for us. Each review pays $10. Can I share the links to the Google Doc with you?',
    categories: ['FAKE_JOB_SCAM', 'TASK_SCAM', 'SOCIAL_ENGINEERING'],
    riskLevel: 'HIGH',
    baseRiskScore: 88,
    intent: {
      claiming: 'Claims you can earn easy money ($10 per review) writing Google reviews for a company.',
      wantsUserToDo: 'Agree to receive external Google Doc links and start simple review tasks.',
      motive: 'Build trust with simple micro-tasks, then require prepaid deposits to release fake earnings.',
    },
    matchingConcepts: [
      'job information', 'each review pays', 'earn $10 per review', 'paid to write google reviews',
      'easy online job', 'work from home', 'simple tasks', 'google reviews', 'google doc',
      'click the link', 'unknown recruiter', 'part time job'
    ],
    signals: [
      { type: 'UNSOLICITED_OFFER', severity: 'high', evidence: 'Unsolicited job offer from unknown international number' },
      { type: 'TOO_GOOD_TO_BE_TRUE', severity: 'high', evidence: 'Unrealistic compensation: $10 per simple Google review' },
      { type: 'SOCIAL_ENGINEERING', severity: 'high', evidence: 'Multi-step trust-building conversation leading to external links/docs' },
    ],
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message offers an online job opportunity for writing Google reviews and asks for your permission to share task documents and links.',
      hi: 'Ye WhatsApp message simple Google reviews likhne ke badle unusually high payment offer kar raha hai. Aise task scams pehle trust banate hain aur baad me prepaid tasks ke naam par paise maangte hain.',
    },
    recommendation: 'Do not open external documents, do not share personal details, and never send money for online review tasks. Block and report the sender.',
  },

  // =========================================================================
  // EXAMPLE 5 — FAKE BANK ACCOUNT LOCK ALERT (WELLS FARGO VISHING)
  // =========================================================================
  {
    id: 'wells_fargo_lockout_vishing_005',
    name: 'Wells Fargo Account Lockout Vishing',
    originalMessage: 'Your Wells Fargo account has been locked for suspicious activity. Please call us at 201-429-3304 to verify your identity.',
    categories: ['BANK_IMPERSONATION', 'ACCOUNT_LOCK_PHISHING', 'PHONE_PHISHING'],
    riskLevel: 'HIGH',
    baseRiskScore: 92,
    intent: {
      claiming: 'Claims your Wells Fargo bank account has been locked due to suspicious activity.',
      wantsUserToDo: 'Call an unverified phone number (201-429-3304) immediately to verify your identity.',
      motive: 'Voice-phishing (vishing) trap to capture SSN, online banking login credentials, card numbers, and OTPs over the phone.',
    },
    matchingConcepts: [
      'your account has been locked', 'account locked for suspicious activity', 'verify your identity',
      'call us', 'call this number', 'bank account locked', 'security verification', 'account suspended',
      'wells fargo', 'chase', 'bank of america'
    ],
    signals: [
      { type: 'BANK_IMPERSONATION', severity: 'high', evidence: 'Impersonates Wells Fargo bank' },
      { type: 'ACCOUNT_THREAT', severity: 'high', evidence: 'Urgent threat: "account has been locked for suspicious activity"' },
      { type: 'PHONE_VISHING', severity: 'critical', evidence: 'Instructs recipient to dial an unverified standard telephone number' },
      { type: 'IDENTITY_HARVESTING', severity: 'high', evidence: 'Demands telephone identity verification' },
    ],
    claimedOrganization: 'Wells Fargo',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message claims that your Wells Fargo bank account has been locked due to suspicious activity and asks you to call a provided telephone number to verify your identity.',
      hi: 'Ye message claim kar raha hai ki aapka Wells Fargo account lock ho gaya hai aur identity verify karne ke liye unverified number par call karein. Bank security ke naam par random phone number par call karwana ek dangerous vishing scam hai.',
    },
    recommendation: 'Do not call the provided number. Sign in to your official banking app or call the verified number printed directly on the back of your debit card.',
  },

  // =========================================================================
  // EXAMPLE 6 — FAKE DELIVERY / PARCEL LINK (UPS)
  // =========================================================================
  {
    id: 'fake_delivery_ups_parcel_006',
    name: 'UPS Missed Parcel Delivery Phishing',
    originalMessage: "You've missed our delivery. To reschedule delivery of your parcel, please visit: https://myparcel-ups.com.",
    categories: ['DELIVERY_SCAM', 'PARCEL_PHISHING', 'BRAND_IMPERSONATION'],
    riskLevel: 'HIGH',
    baseRiskScore: 93,
    intent: {
      claiming: 'Claims you missed a package delivery and must reschedule.',
      wantsUserToDo: 'Click the provided link (https://myparcel-ups.com) and submit personal/card info.',
      motive: 'Collect payment card details disguised as a $1–$3 redelivery fee.',
    },
    matchingConcepts: [
      'missed delivery', 'reschedule delivery', 'your parcel', 'delivery attempt',
      'package could not be delivered', 'pay delivery fee', 'confirm delivery',
      'track your parcel', 'click to reschedule', 'myparcel-ups.com'
    ],
    signals: [
      { type: 'DELIVERY_IMPERSONATION', severity: 'high', evidence: 'Impersonates courier (UPS)' },
      { type: 'SUSPICIOUS_LINK', severity: 'critical', evidence: 'Deceptive hyphenated domain "myparcel-ups.com" (NOT official ups.com)' },
      { type: 'UNSOLICITED_DELIVERY', severity: 'medium', evidence: 'No tracking ID, recipient name, or shipment details provided' },
    ],
    claimedOrganization: 'UPS',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message claims that a parcel delivery was missed and directs you to a provided link to reschedule the delivery.',
      hi: 'Ye message claim kar raha hai ki aapka parcel miss ho gaya hai aur reschedule karne ke liye myparcel-ups.com par jana hoga. Ye UPS ka official portal nahi hai balki card details churane ke liye banayi gayi phishing site hai.',
    },
    recommendation: 'Do not click the link. If expecting a package, track it directly on official carrier portals (ups.com) using your original tracking number.',
  },

  // =========================================================================
  // EXAMPLE 7 — FAKE PRIZE / GIFT CARD (TARGET)
  // =========================================================================
  {
    id: 'fake_prize_target_giftcard_007',
    name: 'Target $500 Gift Card Prize Phishing',
    originalMessage: "Congratulations! You've won a $500 gift card to Target. Click here to claim your reward: https://targetwinner.com",
    categories: ['PRIZE_SCAM', 'GIFT_CARD_SCAM', 'PHISHING'],
    riskLevel: 'HIGH',
    baseRiskScore: 95,
    intent: {
      claiming: 'Claims you won a $500 Target gift card reward.',
      wantsUserToDo: 'Click the link (https://targetwinner.com) and enter information to claim.',
      motive: 'Steal personal identity and credit card details under the pretext of claiming rewards or paying shipping fees.',
    },
    matchingConcepts: [
      "you've won", 'you won a gift card', 'claim your reward', 'congratulations winner',
      '$500 gift card', 'free gift card', 'selected as a winner', 'click to claim',
      'targetwinner.com', 'target'
    ],
    signals: [
      { type: 'UNEXPECTED_PRIZE', severity: 'high', evidence: 'Unsolicited $500 gift card prize claim' },
      { type: 'BRAND_IMPERSONATION', severity: 'high', evidence: 'Impersonates Target retail brand' },
      { type: 'SUSPICIOUS_LINK', severity: 'critical', evidence: 'Third-party domain "targetwinner.com" (NOT official target.com)' },
    ],
    claimedOrganization: 'Target',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message claims that you have won a $500 Target gift card and asks you to click a link to claim the reward.',
      hi: 'Ye message claim kar raha hai ki aapne Target ka $500 gift card jeeta hai. Provided link (targetwinner.com) Target ki official website nahi hai balki data harvest karne ke liye banayi gayi fake site hai.',
    },
    recommendation: 'Do not click the link or disclose personal information. Legitimate retailers do not distribute high-value gift cards through random text messages.',
  },

  // =========================================================================
  // EXAMPLE 8 — FAKE TOLL / PAYMENT DEMAND (SUNPASS)
  // =========================================================================
  {
    id: 'toll_sunpass_payment_008',
    name: 'Florida Toll SunPass Late Fee Smishing',
    originalMessage: 'Florida toll services: We noticed an outstanding toll amount of $34.50 on your account. Please make a payment now to avoid a late fee: https://tolls-sunpass.com',
    categories: ['TOLL_SCAM', 'PAYMENT_PHISHING', 'IMPERSONATION'],
    riskLevel: 'CRITICAL',
    baseRiskScore: 95,
    intent: {
      claiming: 'Claims you owe an outstanding toll balance of $34.50 on your account.',
      wantsUserToDo: 'Click the link (https://tolls-sunpass.com) and submit an immediate card payment.',
      motive: 'Harvest credit card numbers and capture unauthorized funds on a spoofed toll website.',
    },
    matchingConcepts: [
      'outstanding toll amount', 'unpaid toll', 'pay now', 'avoid late fee',
      'toll balance', 'toll invoice', 'make a payment', 'dmv/toll record',
      'driver license', 'sunpass', 'tolls-sunpass.com'
    ],
    signals: [
      { type: 'GOVERNMENT_IMPERSONATION', severity: 'high', evidence: 'Impersonates state toll authority (Florida Toll Services / SunPass)' },
      { type: 'FINANCIAL_DEMAND', severity: 'high', evidence: 'Urgent debt claim of $34.50' },
      { type: 'PENALTY_THREAT', severity: 'high', evidence: 'Penalty coercion: "Please make a payment now to avoid a late fee"' },
      { type: 'SUSPICIOUS_LINK', severity: 'critical', evidence: 'Deceptive domain "tolls-sunpass.com" (NOT official sunpass.com)' },
    ],
    claimedOrganization: 'Florida Toll Services / SunPass',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message claims that you have an outstanding toll balance of $34.50 and asks you to make an immediate payment through a provided link to avoid late fees.',
      hi: 'Ye message claim kar raha hai ki aapka $34.50 ka Florida toll bill pending hai aur late fee se bachne ke liye link par payment karni hogi. Link (tolls-sunpass.com) ek fake smishing portal hai.',
    },
    recommendation: 'Do not pay through the link. Verify your toll transponder account balance directly on the official SunPass website (sunpass.com).',
  },

  // =========================================================================
  // EXAMPLE 9 — FAKE STUDENT LOAN FORGIVENESS
  // =========================================================================
  {
    id: 'student_loan_forgiveness_009',
    name: 'Student Loan Forgiveness Urgency Bait',
    originalMessage: 'You may qualify for a new student loan forgiveness program! Enrollment ends soon. Call 1-855-412-0901 to apply now.',
    categories: ['LOAN_SCAM', 'FINANCIAL_IMPERSONATION', 'PHONE_PHISHING'],
    riskLevel: 'HIGH',
    baseRiskScore: 88,
    intent: {
      claiming: 'Claims you qualify for a federal student loan forgiveness program.',
      wantsUserToDo: 'Call 1-855-412-0901 immediately to enroll before the deadline.',
      motive: 'Charge illegal advance processing fees or capture federal student aid (FSA) credentials and SSNs.',
    },
    matchingConcepts: [
      'you may qualify', 'loan forgiveness', 'student loan forgiveness',
      'enrollment ends soon', 'apply now', 'call this number', 'government loan program'
    ],
    signals: [
      { type: 'UNSOLICITED_OFFER', severity: 'high', evidence: 'Unsolicited promise of student loan debt forgiveness' },
      { type: 'URGENCY', severity: 'medium', evidence: 'Artificial deadline: "Enrollment ends soon. Call to apply now"' },
      { type: 'PHONE_VISHING', severity: 'high', evidence: 'Unverified toll-free telephone number callback' },
    ],
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message claims that you qualify for a student loan forgiveness program and urges you to call a provided telephone number before enrollment ends.',
      hi: 'Ye message claim kar raha hai ki aap new student loan forgiveness program ke liye qualify karte hain aur enrollment jaldi khatam ho rahi hai. Ye debt-relief scam aapse upfront fees ya personal data steal karta hai.',
    },
    recommendation: 'Do not call the number. Check official government student aid portals (StudentAid.gov) directly for verified forgiveness programs.',
  },

  // =========================================================================
  // EXAMPLE 10 — FAKE AMAZON / OTP SECURITY MESSAGE
  // =========================================================================
  {
    id: 'amazon_otp_phishing_010',
    name: 'Amazon OTP Security Link Phishing',
    originalMessage: "Amazon: Your code is 412739. If you didn't request this, click here https://amazon.com/73538111",
    categories: ['OTP_PHISHING', 'BRAND_IMPERSONATION', 'ACCOUNT_TAKEOVER'],
    riskLevel: 'HIGH',
    baseRiskScore: 86,
    intent: {
      claiming: 'Presents an OTP code with a prompt that your account may be unauthorizedly accessed.',
      wantsUserToDo: 'Click the embedded security link if you did not request the code.',
      motive: 'Trick the user into clicking an authentication link to harvest session tokens or account credentials.',
    },
    matchingConcepts: [
      'your code is', 'verification code', 'otp', "if you didn't request this",
      'click here', 'verify your account', 'amazon security'
    ],
    signals: [
      { type: 'BRAND_IMPERSONATION', severity: 'medium', evidence: 'Claims to be Amazon security verification' },
      { type: 'SECURITY_BAIT', severity: 'high', evidence: 'Attached link to an OTP cancellation alert' },
      { type: 'ACCOUNT_THREAT', severity: 'medium', evidence: 'Implies unauthorized login attempt' },
    ],
    claimedOrganization: 'Amazon',
    recommendedVerdict: 'SUSPICIOUS',
    explanation: {
      en: 'This message provides a verification code and instructs you to click a link if you did not request the code.',
      hi: 'Ye message OTP ke sath ek link de raha hai ki agar aapne request nahi kiya to click karein. Official security OTPs me link nahi hote jo user ko login page par redirect karein.',
    },
    recommendation: 'Do not click links inside OTP messages. Sign in directly to your Amazon account from the official app to check security settings.',
  },

  // =========================================================================
  // EXAMPLE 11 — UNKNOWN CONTACT / WRONG-NUMBER OPENING
  // =========================================================================
  {
    id: 'wrong_number_opening_011',
    name: 'Wrong-Number Social Engineering Opening',
    originalMessage: 'Hello and good morning. Is this John?',
    categories: ['SOCIAL_ENGINEERING', 'WRONG_NUMBER_SCAM'],
    riskLevel: 'CAUTION',
    baseRiskScore: 35,
    intent: {
      claiming: 'Sender claims to be looking for a friend or acquaintance named John.',
      wantsUserToDo: 'Reply and confirm whether you are John or a stranger.',
      motive: 'Initiate a friendly conversation to build rapport before introducing crypto/job/investment scams.',
    },
    matchingConcepts: [
      'is this john', 'wrong number', 'hello and good morning', 'sorry to bother you',
      'is this my friend', 'are you free'
    ],
    signals: [
      { type: 'UNKNOWN_SENDER', severity: 'low', evidence: 'Generic greeting from an unknown contact' },
      { type: 'SOCIAL_ENGINEERING', severity: 'medium', evidence: 'Possible wrong-number social engineering opening' },
    ],
    recommendedVerdict: 'SUSPICIOUS',
    explanation: {
      en: 'The sender is sending a greeting asking to confirm if you are an acquaintance named John.',
      hi: 'Unknown sender se generic wrong-number greeting. Ye akela fraud prove nahi karta, par aise messages aksar crypto ya investment scams shuru karne ke liye use hote hain.',
    },
    recommendation: 'Do not engage or reply to unsolicited messages from unknown numbers. Block if they introduce financial, job, or investment opportunities.',
  },

  // =========================================================================
  // EXAMPLE 12 — FAKE TOLL / DMV THREAT (E-ZPASS)
  // =========================================================================
  {
    id: 'toll_ezpass_dmv_threat_012',
    name: 'E-ZPass Toll / DMV License Threat Smishing',
    originalMessage: "Warm Reminder - You have unpaid toll invoices, please be sure to pay the balance by March 10, 2025. Otherwise, you will be charged an excessive fine. Please complete your payment on time: https://bit.ly/3Fq2btY?xVd=knm... Failure to pay on time may also affect your DMV record and cause your driver's license to not be renewed. E-ZPASS - Wishing you a sunny day filled with happiness.",
    categories: ['TOLL_SCAM', 'PAYMENT_PHISHING', 'SHORT_URL_PHISHING', 'GOVERNMENT_IMPERSONATION'],
    riskLevel: 'CRITICAL',
    baseRiskScore: 96,
    intent: {
      claiming: 'Claims you have unpaid toll invoices and threatens excessive fines, DMV record marks, and driver license non-renewal.',
      wantsUserToDo: 'Click the shortened bit.ly URL and complete immediate payment.',
      motive: 'Exploit fear of driver license suspension to extract credit card details via a shortened phishing URL.',
    },
    matchingConcepts: [
      'unpaid toll invoices', 'pay the balance', 'excessive fine', 'dmv record',
      'driver license', 'license will not be renewed', 'ezpass', 'complete your payment',
      'bit.ly', 'toll payment'
    ],
    signals: [
      { type: 'GOVERNMENT_IMPERSONATION', severity: 'high', evidence: 'Impersonates E-ZPass and state DMV authority' },
      { type: 'LEGAL_THREAT', severity: 'critical', evidence: 'Threatens driver\'s license non-renewal and excessive fines' },
      { type: 'SHORT_URL_PHISHING', severity: 'high', evidence: 'Masked shortened link (bit.ly) used for official government payment' },
      { type: 'CONTRADICTORY_TONE', severity: 'medium', evidence: 'Deceptive friendly closing ("wishing you a sunny day") following legal threats' },
    ],
    claimedOrganization: 'E-ZPass / DMV',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message claims that you have unpaid toll invoices and pressures you to make a payment through a provided link to avoid fines and driver license renewal issues.',
      hi: 'Ye message unpaid toll ke naam par driver license cancel hone aur heavy fines ka dar dikhata hai aur payment ke liye bit.ly link deta hai. Government toll authorities kabhi bhi shortened links se SMS nahi bhejti.',
    },
  },

  // =========================================================================
  // EXAMPLE 13 — ELECTRICITY / UTILITY DISCONNECTION SCAM
  // =========================================================================
  {
    id: 'electricity_disconnection_013',
    name: 'Electricity / Utility Disconnection Urgency Scam',
    originalMessage: 'Dear consumer, your electricity power will be disconnected tonight at 9:30 PM from electricity office because your previous month bill was not updated. Please immediately contact our power officer at 9876543210.',
    categories: ['UTILITY_SCAM', 'ELECTRICITY_DISCONNECTION_SCAM', 'PHONE_VISHING', 'GOVERNMENT_UTILITY_IMPERSONATION'],
    riskLevel: 'CRITICAL',
    baseRiskScore: 95,
    intent: {
      claiming: 'Claims your electricity power will be cut off tonight at 9:30 PM due to an un-updated bill.',
      wantsUserToDo: 'Call an unverified personal phone number immediately to resolve the disconnection.',
      motive: 'Phone vishing attack to convince the victim to install remote control APKs (AnyDesk) or transfer money to private UPI IDs.',
    },
    matchingConcepts: [
      'electricity power will be disconnected', 'disconnected tonight', 'electricity office',
      'previous month bill was not updated', 'contact our power officer', 'electricity bill overdue',
      'power cutoff', 'bill not updated', 'disconnection notice', 'contact officer'
    ],
    signals: [
      { type: 'UTILITY_IMPERSONATION', severity: 'high', evidence: 'Impersonates electricity / power board office' },
      { type: 'SERVICE_TERMINATION_THREAT', severity: 'critical', evidence: 'Immediate utility cutoff threat ("disconnected tonight at 9:30 PM")' },
      { type: 'PHONE_VISHING', severity: 'high', evidence: 'Directs victim to call an unverified personal mobile number' },
    ],
    claimedOrganization: 'Electricity Office',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message claims that your electricity supply will be disconnected tonight due to an unpaid or un-updated bill and instructs you to call a personal phone number immediately.',
      hi: 'Ye message claim kar raha hai ki aapka electricity connection aaj raat 9:30 baje cut kar diya jayega aur power officer ke personal number par call karne ko bol raha hai. Power companies raat me achanak power cut karne ka SMS nahi bhejti.',
    },
    recommendation: 'Do not call the provided mobile number. Check your electricity bill status directly through your official state electricity board app or portal.',
  },

  // =========================================================================
  // EXAMPLE 14 — FAKE TRAFFIC E-CHALLAN / COURT SUMMONS
  // =========================================================================
  {
    id: 'traffic_challan_parivahan_014',
    name: 'Traffic Police E-Challan / Parivahan Phishing',
    originalMessage: 'Traffic Police Notice: Challan No. DL-82910 is pending against vehicle DL01AB1234 for overspeeding. Pay fine of Rs 1,500 within 24 hours to avoid court summons & license cancellation: http://echallan-parivahan-gov.net',
    categories: ['TRAFFIC_CHALLAN_SCAM', 'GOVERNMENT_IMPERSONATION', 'PAYMENT_PHISHING', 'LOOKALIKE_DOMAIN'],
    riskLevel: 'CRITICAL',
    baseRiskScore: 94,
    intent: {
      claiming: 'Claims you have an outstanding traffic challan for overspeeding with a threat of court summons and license cancellation.',
      wantsUserToDo: 'Click the lookalike link and pay the fine within 24 hours.',
      motive: 'Steal payment card details or net banking credentials through a spoofed government portal.',
    },
    matchingConcepts: [
      'traffic police notice', 'challan no', 'challan is pending', 'vehicle overspeeding',
      'court summons', 'license cancellation', 'pay fine within 24 hours', 'echallan',
      'parivahan', 'traffic fine'
    ],
    signals: [
      { type: 'GOVERNMENT_IMPERSONATION', severity: 'high', evidence: 'Impersonates Traffic Police / Parivahan portal' },
      { type: 'LEGAL_THREAT', severity: 'critical', evidence: 'Threatens court summons and driver license cancellation within 24 hours' },
      { type: 'LOOKALIKE_DOMAIN', severity: 'critical', evidence: 'Deceptive non-gov domain "echallan-parivahan-gov.net" (NOT official .gov.in)' },
    ],
    claimedOrganization: 'Traffic Police',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message claims that you have an unpaid traffic violation challan and threatens court summons and license cancellation unless paid immediately via a provided link.',
      hi: 'Ye message traffic fine na bharne par court summons aur license cancel karne ki dhamki de raha hai aur fake link (echallan-parivahan-gov.net) de raha hai. Official challans sirf echallan.parivahan.gov.in par check hote hain.',
    },
    recommendation: 'Do not click the link or pay through unverified portals. Check your challan status only on the official government website (echallan.parivahan.gov.in).',
  },

  // =========================================================================
  // EXAMPLE 15 — DIGITAL ARREST / LAW ENFORCEMENT / CBI IMPERSONATION
  // =========================================================================
  {
    id: 'digital_arrest_cbi_015',
    name: 'Digital Arrest / Law Enforcement Impersonation Extortion',
    originalMessage: 'URGENT: Legal Notice from Cyber Crime Cell / CBI. A FIR has been registered against your mobile number for illegal money laundering and narcotics trafficking. Connect immediately on WhatsApp Video Call with Officer Sharma or face imminent arrest within 2 hours.',
    categories: ['DIGITAL_ARREST_SCAM', 'LAW_ENFORCEMENT_IMPERSONATION', 'EXTORTION_SCAM', 'SOCIAL_ENGINEERING'],
    riskLevel: 'CRITICAL',
    baseRiskScore: 99,
    intent: {
      claiming: 'Claims a criminal FIR for money laundering and narcotics is registered against you with imminent arrest within 2 hours.',
      wantsUserToDo: 'Connect immediately on a WhatsApp video call with a fake police officer.',
      motive: 'Conduct a "digital arrest" via fake uniform video call and coerce massive money transfers into fake "court safety accounts".',
    },
    matchingConcepts: [
      'digital arrest', 'cyber crime cell', 'cbi legal notice', 'fir has been registered',
      'money laundering', 'narcotics trafficking', 'whatsapp video call', 'face imminent arrest',
      'police interrogation', 'arrest warrant', 'officer sharma'
    ],
    signals: [
      { type: 'LAW_ENFORCEMENT_IMPERSONATION', severity: 'critical', evidence: 'Impersonates CBI / Cyber Crime Cell / Police' },
      { type: 'EXTORTION_THREAT', severity: 'critical', evidence: 'Extortion and arrest threat ("face imminent arrest within 2 hours")' },
      { type: 'VIDEO_CALL_BAIT', severity: 'critical', evidence: 'Demands WhatsApp video call connection for law enforcement action' },
    ],
    claimedOrganization: 'Cyber Crime Cell / CBI',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message claims that law enforcement or the CBI has issued an FIR and arrest notice against you, demanding an immediate WhatsApp video call to avoid arrest.',
      hi: 'Ye message CBI/Police ke naam par FIR aur arrest ka dar dikhakar WhatsApp video call par judne ko bol raha hai. Police ya CBI kabhi bhi WhatsApp video call par inquiry ya digital arrest nahi karti.',
    },
    recommendation: 'Do not join video calls or transfer money. Legitimate law enforcement agencies never conduct arrests or investigations via WhatsApp. Report immediately to 1930 or cybercrime.gov.in.',
  },

  // =========================================================================
  // EXAMPLE 16 — INCOME TAX / TAX REFUND PHISHING (IRS / HMRC / IT DEPT)
  // =========================================================================
  {
    id: 'tax_refund_phishing_016',
    name: 'Income Tax / IRS Tax Refund Phishing',
    originalMessage: 'Income Tax Department: An amount of Rs 15,490 has been approved for refund to your account. Please confirm your bank account details and PAN here to claim before expiration: https://incometax-refund-gov.in',
    categories: ['TAX_REFUND_PHISHING', 'GOVERNMENT_IMPERSONATION', 'CREDENTIAL_HARVESTING', 'FINANCIAL_SCAM'],
    riskLevel: 'HIGH',
    baseRiskScore: 92,
    intent: {
      claiming: 'Claims an income tax refund has been approved and requires confirmation of bank details and PAN.',
      wantsUserToDo: 'Click the phishing link and enter bank account credentials and PAN.',
      motive: 'Harvest net banking credentials, OTPs, and PAN/SSN details under the guise of processing a tax refund.',
    },
    matchingConcepts: [
      'income tax department', 'tax refund', 'refund approved', 'confirm your bank account',
      'irs refund', 'hmrc tax rebate', 'claim before expiration', 'tax refund portal',
      'submit form 1040', 'pan card refund'
    ],
    signals: [
      { type: 'GOVERNMENT_IMPERSONATION', severity: 'high', evidence: 'Impersonates Income Tax Department / IRS / HMRC' },
      { type: 'FINANCIAL_BAIT', severity: 'high', evidence: 'Unsolicited tax refund approval bait' },
      { type: 'CREDENTIAL_HARVESTING', severity: 'critical', evidence: 'Requests private bank account and PAN details via external link' },
    ],
    claimedOrganization: 'Income Tax Department',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message claims that an income tax refund has been approved and asks you to submit your bank account details and PAN through a provided link.',
      hi: 'Ye message Income Tax refund approve hone ka jhootha claim karke bank account aur PAN details maang raha hai. Tax authorities kabhi bhi third-party links se bank login credentials nahi maangti.',
    },
    recommendation: 'Do not click the link. Log in directly to the official income tax portal (incometax.gov.in or irs.gov) to check verified refund status.',
  },

  // =========================================================================
  // EXAMPLE 17 — CREDIT CARD REWARD POINTS EXPIRY SCAM
  // =========================================================================
  {
    id: 'credit_card_reward_expiry_017',
    name: 'Credit Card Reward Points Expiry Phishing',
    originalMessage: 'Dear HDFC cardholder, your credit card reward points worth Rs 9,850 are expiring today (23-Aug). Redeem points directly to cash into your bank account immediately by visiting: http://hdfc-rewards-redeem.cc',
    categories: ['CREDIT_CARD_SCAM', 'REWARD_POINTS_PHISHING', 'BANK_IMPERSONATION', 'CREDENTIAL_HARVESTING'],
    riskLevel: 'HIGH',
    baseRiskScore: 91,
    intent: {
      claiming: 'Claims your credit card reward points worth cash are expiring today.',
      wantsUserToDo: 'Click the link to convert points to instant cash in your bank account.',
      motive: 'Capture credit card number, CVV, expiry date, and OTP on a fake reward redemption portal.',
    },
    matchingConcepts: [
      'reward points expiring', 'credit card reward points', 'redeem points to cash',
      'points worth', 'expiring today', 'redeem immediately', 'card points expire',
      'redeem reward', 'bank reward points'
    ],
    signals: [
      { type: 'BANK_IMPERSONATION', severity: 'high', evidence: 'Impersonates HDFC / commercial bank credit card services' },
      { type: 'URGENCY', severity: 'high', evidence: 'Artificial deadline: "expiring today"' },
      { type: 'LOOKALIKE_DOMAIN', severity: 'critical', evidence: 'Deceptive domain "hdfc-rewards-redeem.cc" (NOT official bank domain)' },
    ],
    claimedOrganization: 'HDFC Bank',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message claims that your credit card reward points are expiring today and asks you to redeem them for cash through a provided link.',
      hi: 'Ye message reward points expire hone ka dar dikhakar cash redemption ke liye fake link de raha hai. Card details aur OTP churane ke liye banayi gayi phishing site hai.',
    },
    recommendation: 'Do not click the link or enter card numbers. Redeem reward points only through your official bank mobile app or net banking portal.',
  },

  // =========================================================================
  // EXAMPLE 18 — TECH SUPPORT / GEEK SQUAD / NORTON INVOICE AUTO-RENEWAL VISHING
  // =========================================================================
  {
    id: 'tech_support_invoice_vishing_018',
    name: 'Geek Squad / Norton Invoice Auto-Renewal Vishing',
    originalMessage: 'Geek Squad Invoice #GS-99281: Thank you for your payment of $499.99 for 3-Year Total Tech Protection. This charge will auto-debit from your account within 24 hours. To cancel or dispute this transaction, call our Refund Desk immediately at +1-888-492-0199.',
    categories: ['TECH_SUPPORT_SCAM', 'INVOICE_PHISHING', 'PHONE_VISHING', 'REFUND_SCAM'],
    riskLevel: 'CRITICAL',
    baseRiskScore: 96,
    intent: {
      claiming: 'Claims you have been billed $499.99 for an auto-renewed tech protection subscription.',
      wantsUserToDo: 'Call the toll-free "Refund Desk" number immediately to cancel or dispute the charge.',
      motive: 'Phone vishing scam to trick the victim into installing remote desktop access software and transferring money.',
    },
    matchingConcepts: [
      'geek squad invoice', 'auto-renewal', 'total tech protection', 'auto-debit from your account',
      'within 24 hours', 'to cancel or dispute', 'call our refund desk', 'norton renewal',
      'mcafee subscription', 'dispute this charge', 'subscription invoice'
    ],
    signals: [
      { type: 'BRAND_IMPERSONATION', severity: 'high', evidence: 'Impersonates Geek Squad / Norton tech support' },
      { type: 'FINANCIAL_PANIC_BAIT', severity: 'high', evidence: 'Fake high-dollar auto-debit claim ($499.99)' },
      { type: 'PHONE_VISHING', severity: 'critical', evidence: 'Directs victim to call a toll-free refund desk number' },
    ],
    claimedOrganization: 'Geek Squad',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message presents a fake $499.99 invoice for Geek Squad tech protection and urges you to call a toll-free number immediately to cancel the charge.',
      hi: 'Ye message Geek Squad ka fake $499.99 ka bill bhejkar cancel karne ke liye phone number par call karne ko bol raha hai. Call karne par scammers computer ka remote access lekar bank fraud karte hain.',
    },
    recommendation: 'Do not call the phone number. Check your genuine bank and credit card statements directly to verify that no unauthorized charge has been made.',
  },

  // =========================================================================
  // EXAMPLE 19 — FAMILY EMERGENCY / "HI MUM / HI DAD" NEW NUMBER SCAM
  // =========================================================================
  {
    id: 'hi_mum_family_emergency_019',
    name: 'Family Emergency / "Hi Mum / Hi Dad" Impersonation Scam',
    originalMessage: 'Hi Mum, I dropped my phone down the toilet and broke it. This is my new temporary number. I urgently need to pay an emergency bill of £450 before 5pm or my service is cut off. Can you please transfer it to this bank account? Sort code: 04-00-04 Account: 82910394',
    categories: ['FAMILY_IMPERSONATION', 'HI_MUM_SCAM', 'EMERGENCY_SCAM', 'SOCIAL_ENGINEERING'],
    riskLevel: 'HIGH',
    baseRiskScore: 90,
    intent: {
      claiming: 'Sender claims to be your son/daughter with a broken phone and an urgent unpaid bill.',
      wantsUserToDo: 'Transfer emergency money immediately to an unknown bank account.',
      motive: 'Exploit family trust and panic to steal funds before the victim can contact the real family member.',
    },
    matchingConcepts: [
      'hi mum', 'hi dad', 'dropped my phone', 'this is my new number', 'new temporary number',
      'urgently need to pay', 'emergency bill', 'can you please transfer', 'sort code',
      'before 5pm', 'broken phone'
    ],
    signals: [
      { type: 'FAMILY_IMPERSONATION', severity: 'high', evidence: 'Poses as child/relative using unfamiliar number' },
      { type: 'EMERGENCY_PRESSURE', severity: 'high', evidence: 'Urgent money demand before 5pm deadline' },
      { type: 'DIRECT_PAYMENT_REQUEST', severity: 'critical', evidence: 'Requests immediate transfer with sort code and account number' },
    ],
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'The sender claims to be a family member using a temporary number due to a broken phone and asks you to urgently transfer money for an unpaid bill.',
      hi: 'Ye message beta/beti bankar phone tootne ka bahana banata hai aur urgent bill ke naam par anjaan bank account me paise transfer karne ko bolta hai. Ye classic Hi Mum / Hi Dad scam hai.',
    },
    recommendation: 'Do not transfer money. Call your family member directly on their existing known phone number to verify their safety.',
  },

  // =========================================================================
  // EXAMPLE 20 — WHATSAPP ACCOUNT HIJACKING / 6-DIGIT CODE SCAM
  // =========================================================================
  {
    id: 'whatsapp_6digit_code_theft_020',
    name: 'WhatsApp Account Takeover / 6-Digit Code Theft',
    originalMessage: 'Hey! I accidentally sent my 6-digit WhatsApp verification code to your phone by mistake. Can you please send it back to me quickly? It is very urgent!',
    categories: ['WHATSAPP_TAKEOVER', 'VERIFICATION_CODE_THEFT', 'ACCOUNT_HIJACKING', 'SOCIAL_ENGINEERING'],
    riskLevel: 'CRITICAL',
    baseRiskScore: 98,
    intent: {
      claiming: 'Sender claims they mistakenly routed their 6-digit WhatsApp registration code to your phone.',
      wantsUserToDo: 'Read and forward the 6-digit SMS verification code you just received.',
      motive: 'Hijack your WhatsApp account by using your SMS registration code on the attacker\'s phone.',
    },
    matchingConcepts: [
      '6-digit whatsapp verification code', 'accidentally sent code', 'send it back to me',
      'verification code to your phone', 'whatsapp code', 'share the 6-digit code',
      'sent code by mistake', 'forward the otp'
    ],
    signals: [
      { type: 'ACCOUNT_TAKEOVER_ATTEMPT', severity: 'critical', evidence: 'Attempt to solicit private WhatsApp 6-digit authentication code' },
      { type: 'SOCIAL_ENGINEERING', severity: 'high', evidence: 'Pretext of accidental SMS delivery' },
      { type: 'URGENCY', severity: 'high', evidence: 'Pressures quick response: "send it back quickly"' },
    ],
    claimedOrganization: 'WhatsApp',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'The sender claims they accidentally sent their 6-digit WhatsApp verification code to your number and asks you to forward it to them.',
      hi: 'Sender claim kar raha hai ki usne galti se apna 6-digit WhatsApp code aapke phone par bhej diya hai. Agar aapne ye code diya to aapka WhatsApp account hack ho jayega.',
    },
    recommendation: 'Never share verification codes or OTPs with anyone. WhatsApp verification codes are private and only sent when someone is trying to log into your account.',
  },

  // =========================================================================
  // EXAMPLE 21 — CRYPTO VIP ARBITRAGE / PIG BUTCHERING WHATSAPP GROUP
  // =========================================================================
  {
    id: 'crypto_vip_arbitrage_group_021',
    name: 'Crypto VIP Arbitrage / Pig Butchering WhatsApp Group',
    originalMessage: 'Hello, this is Sophie\'s assistant from Morgan Stanley Crypto Wealth Club. Our VIP WhatsApp group gives 300% daily guaranteed profit on BTC/ETH arbitrage trading. Join the exclusive group: https://chat.whatsapp.com/inv99281',
    categories: ['CRYPTO_SCAM', 'INVESTMENT_FRAUD', 'PIG_BUTCHERING', 'TELEGRAM_WHATSAPP_GROUP_SCAM'],
    riskLevel: 'CRITICAL',
    baseRiskScore: 94,
    intent: {
      claiming: 'Claims an exclusive investment club offers guaranteed 300% daily returns on crypto trading.',
      wantsUserToDo: 'Join a private WhatsApp group and invest money in a crypto trading scheme.',
      motive: 'Lure victims into fraudulent crypto trading platforms to steal all deposited funds.',
    },
    matchingConcepts: [
      'crypto wealth club', 'guaranteed profit', 'btc/eth arbitrage', '300% daily profit',
      'vip whatsapp group', 'crypto trading', 'investment opportunity', 'high return investment',
      'chat.whatsapp.com', 'crypto signal'
    ],
    signals: [
      { type: 'UNREALISTIC_RETURNS', severity: 'critical', evidence: 'Unrealistic profit promise: "300% daily guaranteed profit"' },
      { type: 'UNSOLICITED_INVESTMENT', severity: 'high', evidence: 'Cold outreach inviting to crypto trading group' },
      { type: 'BRAND_IMPERSONATION', severity: 'high', evidence: 'Uses Morgan Stanley name to fabricate legitimacy' },
    ],
    claimedOrganization: 'Morgan Stanley',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message promises guaranteed high daily profits on crypto trading and invites you to join an exclusive WhatsApp group.',
      hi: 'Ye message crypto trading me 300% guaranteed daily profit ka promise karke WhatsApp group join karne ko bol raha hai. Ye ek classic Pig Butchering investment fraud hai.',
    },
    recommendation: 'Do not join the group or invest money. Legitimate financial institutions never guarantee daily crypto profits or operate trading syndicates via WhatsApp groups.',
  },

  // =========================================================================
  // EXAMPLE 22 — SIM CARD BLOCK / 5G ESIM KYC UPGRADATION SCAM
  // =========================================================================
  {
    id: 'sim_block_5g_esim_kyc_022',
    name: 'Telecom 5G Upgrade / eSIM SIM Swap Phishing',
    originalMessage: 'Dear Jio/Airtel customer, your SIM card will be blocked within 24 hours due to non-upgradation to 5G / incomplete KYC. Call customer care 9811099281 or click http://jio-5g-upgrade.site to activate 5G eSIM instantly.',
    categories: ['SIM_SWAP_SCAM', 'TELECOM_IMPERSONATION', 'ESIM_FRAUD', 'KYC_PHISHING'],
    riskLevel: 'HIGH',
    baseRiskScore: 93,
    intent: {
      claiming: 'Claims your SIM card will be blocked within 24 hours unless upgraded to 5G / completed KYC.',
      wantsUserToDo: 'Call an unverified number or click a link to activate 5G eSIM.',
      motive: 'Execute an unauthorized SIM swap or steal personal documents to hijack your phone number and OTPs.',
    },
    matchingConcepts: [
      'sim card will be blocked', 'sim deactivation', '5g upgrade', 'esim activation',
      'telecom kyc', 'incomplete kyc', 'jio customer', 'airtel customer',
      'sim blocked within 24 hours', 'activate 5g esim'
    ],
    signals: [
      { type: 'TELECOM_IMPERSONATION', severity: 'high', evidence: 'Impersonates telecom operator (Jio / Airtel)' },
      { type: 'SERVICE_DEACTIVATION_THREAT', severity: 'high', evidence: 'Threat of SIM blocking within 24 hours' },
      { type: 'SIM_SWAP_BAIT', severity: 'critical', evidence: 'Prompts eSIM activation through third-party link' },
    ],
    claimedOrganization: 'Jio / Airtel',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message claims that your SIM card will be deactivated within 24 hours unless you upgrade to 5G or complete KYC through a provided link or number.',
      hi: 'Ye message 24 ghante me SIM block hone ki dhamki dekar 5G upgrade / eSIM activation ke liye fake link ya number par call karne ko bol raha hai. Ye SIM swap fraud ka vector hai.',
    },
    recommendation: 'Do not click the link or call the number. SIM upgrades happen automatically or through official company stores and official apps (MyJio / Airtel Thanks).',
  },

  // =========================================================================
  // EXAMPLE 23 — UNAUTHORIZED ORDER CANCELLATION VISHING (AMAZON / APPLE)
  // =========================================================================
  {
    id: 'unauthorized_order_cancellation_023',
    name: 'Unauthorized Order Cancellation Vishing',
    originalMessage: 'Amazon Alert: Your order for Apple iPhone 15 Pro Max ($1,299.00) has been placed successfully and will be billed to your card. If you did not make this purchase, call Fraud Prevention immediately at +1-800-492-0199 to cancel the charge.',
    categories: ['ORDER_CANCELLATION_SCAM', 'BRAND_IMPERSONATION', 'PHONE_VISHING', 'FAKE_TRANSACTION_ALERT'],
    riskLevel: 'CRITICAL',
    baseRiskScore: 94,
    intent: {
      claiming: 'Claims an expensive order for an iPhone ($1,299) was placed and billed to your account.',
      wantsUserToDo: 'Call the provided "Fraud Prevention" telephone number to dispute the purchase.',
      motive: 'Voice phishing to extract credit card numbers, bank credentials, or remote screen sharing under the guise of cancellation.',
    },
    matchingConcepts: [
      'order for apple iphone', 'placed successfully', 'billed to your card',
      'if you did not make this purchase', 'call fraud prevention', 'cancel the charge',
      'amazon order alert', 'unauthorized purchase', 'dispute order'
    ],
    signals: [
      { type: 'BRAND_IMPERSONATION', severity: 'high', evidence: 'Impersonates Amazon / major retailer' },
      { type: 'HIGH_VALUE_TRANSACTION_PANIC', severity: 'high', evidence: 'Fabricated $1,299 purchase confirmation' },
      { type: 'PHONE_VISHING', severity: 'critical', evidence: 'Directs victim to call unverified phone number to cancel order' },
    ],
    claimedOrganization: 'Amazon',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message claims that an expensive order was placed on your account and instructs you to call a provided telephone number to cancel or dispute the charge.',
      hi: 'Ye message aapke account se $1,299 ka iPhone order hone ka jhootha alert dekar order cancel karne ke liye fake number par call karne ko bol raha hai. Ye refund vishing scam hai.',
    },
    recommendation: 'Do not call the phone number. Log in directly to your official Amazon or retailer account to verify your genuine order history.',
  },

  // =========================================================================
  // EXAMPLE 24 — INSTANT PERSONAL LOAN / 1% INTEREST APK MALWARE SCAM
  // =========================================================================
  {
    id: 'instant_loan_apk_malware_024',
    name: 'Instant Loan Pre-Approval / APK Spyware Scam',
    originalMessage: 'Congratulations! Pre-approved personal loan of Rs 5,00,000 sanctioned at 1% interest rate without CIBIL check. Disbursal in 5 minutes. Download loan app: http://instant-dhan-loan.apk',
    categories: ['LOAN_APP_SCAM', 'MALICIOUS_ATTACHMENT', 'PREDATORY_LENDING_FRAUD', 'SPYWARE_DISTRIBUTION'],
    riskLevel: 'CRITICAL',
    baseRiskScore: 98,
    intent: {
      claiming: 'Claims you have a pre-approved ₹5 Lakh loan sanctioned at 1% interest with zero credit checks.',
      wantsUserToDo: 'Download and install an untrusted .apk application file to receive funds.',
      motive: 'Deploy predatory spyware that steals contact lists, gallery photos, and SMS messages for extortion.',
    },
    matchingConcepts: [
      'pre-approved personal loan', 'sanctioned at 1% interest', 'without cibil check',
      'disbursal in 5 minutes', 'instant loan', 'download loan app', '.apk',
      'dhan loan', 'quick cash loan', 'instant credit loan'
    ],
    signals: [
      { type: 'MALICIOUS_ATTACHMENT', severity: 'critical', evidence: 'Direct distribution of APK application file via link' },
      { type: 'PREDATORY_LURE', severity: 'high', evidence: 'Unrealistic 1% loan terms with no credit check' },
      { type: 'INSTANT_DISBURSAL_PRESSURE', severity: 'high', evidence: 'Disbursal in 5 minutes claim' },
    ],
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message offers an unsolicited instant ₹5 Lakh loan with no credit check and instructs you to download an APK application file.',
      hi: 'Ye message bina CIBIL check ke 1% byaaj par 5 Lakh loan ka lalach dekar APK file download karne ko bol raha hai. Ye illegal loan app spyware hai jo contacts aur photos chura kar blackmail karta hai.',
    },
    recommendation: 'Do not download or install APK files. Only apply for loans through RBI-registered banks and verified applications on the Google Play Store.',
  },

  // =========================================================================
  // EXAMPLE 25 — SUBSCRIPTION RENEWAL SUSPENSION (NETFLIX / SPOTIFY)
  // =========================================================================
  {
    id: 'subscription_renewal_suspension_025',
    name: 'Streaming Subscription Suspension Phishing',
    originalMessage: 'Netflix: We were unable to process your monthly subscription payment. Your membership is on hold. Update your payment details within 24 hours to avoid account cancellation: https://netflix-update-billing.info',
    categories: ['SUBSCRIPTION_PHISHING', 'PAYMENT_CREDENTIAL_HARVESTING', 'BRAND_IMPERSONATION', 'SERVICE_SUSPENSION_BAIT'],
    riskLevel: 'HIGH',
    baseRiskScore: 92,
    intent: {
      claiming: 'Claims your Netflix subscription payment failed and your account will be cancelled within 24 hours.',
      wantsUserToDo: 'Click the link and update your credit/debit card information.',
      motive: 'Harvest credit card numbers, CVVs, and billing addresses on a lookalike phishing site.',
    },
    matchingConcepts: [
      'unable to process your monthly subscription', 'membership is on hold',
      'update your payment details', 'within 24 hours', 'account cancellation',
      'netflix billing', 'spotify subscription failed', 'payment declined', 'reactivate membership'
    ],
    signals: [
      { type: 'BRAND_IMPERSONATION', severity: 'high', evidence: 'Impersonates Netflix subscription service' },
      { type: 'SUSPENSION_THREAT', severity: 'high', evidence: 'Account on hold / 24-hour cancellation deadline' },
      { type: 'LOOKALIKE_DOMAIN', severity: 'critical', evidence: 'Deceptive domain "netflix-update-billing.info" (NOT official netflix.com)' },
    ],
    claimedOrganization: 'Netflix',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message claims that your Netflix subscription payment failed and asks you to update your payment details through a provided link.',
      hi: 'Ye message Netflix payment fail hone ka jhootha alert dekar 24 ghante me account cancel hone ka dar dikhata hai aur fake billing link deta hai. Credit card details churane ke liye banayi gayi site hai.',
    },
    recommendation: 'Do not click the link. Sign in to your Netflix account directly through the official app or website (netflix.com) to check your subscription status.',
  },

  // =========================================================================
  // EXAMPLE 26 — POSTAL INCOMPLETE ADDRESS PHISHING (USPS / ROYAL MAIL)
  // =========================================================================
  {
    id: 'postal_incomplete_address_026',
    name: 'Postal Delivery Incomplete Address Smishing',
    originalMessage: 'USPS: The package has arrived at the local depot but cannot be delivered due to incomplete street address information. Please update your address within 12 hours: https://usps-address-confirm.top',
    categories: ['POSTAL_SMISHING', 'PARCEL_DELIVERY_SCAM', 'CREDENTIAL_HARVESTING', 'IMPERSONATION'],
    riskLevel: 'HIGH',
    baseRiskScore: 93,
    intent: {
      claiming: 'Claims a package cannot be delivered due to an incomplete street address.',
      wantsUserToDo: 'Click the link and submit your full address along with a small card payment.',
      motive: 'Harvest credit card numbers and physical addresses on a spoofed postal website.',
    },
    matchingConcepts: [
      'package has arrived at the warehouse', 'incomplete street address', 'cannot be delivered',
      'update your address within 12 hours', 'usps package update', 'royal mail delivery address',
      'reschedule delivery', 'confirm address', 'postal delivery depot'
    ],
    signals: [
      { type: 'POSTAL_IMPERSONATION', severity: 'high', evidence: 'Impersonates postal carrier (USPS)' },
      { type: 'URGENCY', severity: 'high', evidence: '12-hour address update deadline' },
      { type: 'LOOKALIKE_DOMAIN', severity: 'critical', evidence: 'Deceptive domain "usps-address-confirm.top" (NOT official usps.com)' },
    ],
    claimedOrganization: 'USPS',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message claims that a package cannot be delivered due to an incomplete street address and asks you to update your details through a provided link.',
      hi: 'Ye message address incomplete hone ka bahana banakar 12 ghante me link par address aur card details bharne ko bolta hai. Postal smishing fraud ka wide spread pattern hai.',
    },
    recommendation: 'Do not click the link. Track your shipments directly on the official postal portal (usps.com) using your original tracking number.',
  },

  // =========================================================================
  // EXAMPLE 27 — EXECUTIVE BEC WIRE TRANSFER / CEO IMPERSONATION
  // =========================================================================
  {
    id: 'executive_bec_wire_transfer_027',
    name: 'Executive BEC Wire Transfer / CEO Impersonation',
    originalMessage: 'Hi, Are you at your desk? I am currently in a confidential executive meeting and need you to urgently process a wire transfer of $45,000 to our vendor before the close of business. Email me the confirmation once done.',
    categories: ['BUSINESS_EMAIL_COMPROMISE', 'EXECUTIVE_IMPERSONATION', 'WIRE_FRAUD', 'SOCIAL_ENGINEERING'],
    riskLevel: 'CRITICAL',
    baseRiskScore: 95,
    intent: {
      claiming: 'Claims to be a company executive in a meeting needing an urgent vendor wire transfer.',
      wantsUserToDo: 'Process a $45,000 wire transfer without verbal verification.',
      motive: 'Bypass internal corporate financial verification to redirect company funds to fraudulent accounts.',
    },
    matchingConcepts: [
      'are you at your desk', 'confidential executive meeting', 'urgently process a wire transfer',
      'before the close of business', 'vendor payment', 'ceo wire request',
      'urgent payment request', 'do not call me'
    ],
    signals: [
      { type: 'EXECUTIVE_IMPERSONATION', severity: 'high', evidence: 'Poses as CEO/Executive during confidential meeting' },
      { type: 'URGENT_FINANCIAL_DEMAND', severity: 'critical', evidence: 'Urgent wire transfer of $45,000 before close of business' },
      { type: 'COMMUNICATION_SUPPRESSION', severity: 'high', evidence: 'Discourages verbal phone verification due to meeting' },
    ],
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message poses as a company executive in a confidential meeting and requests an urgent wire transfer to an external vendor account.',
      hi: 'Ye message company ke CEO/Boss ban kar confidential meeting ka bahana banata hai aur bina call kiye $45,000 wire transfer karne ko bolta hai. Ye classic Business Email Compromise (BEC) attack hai.',
    },
    recommendation: 'Do not initiate wire transfers based solely on text or email messages. Always perform out-of-band voice confirmation with the executive.',
  },

  // =========================================================================
  // EXAMPLE 28 — WHATSAPP LOTTERY / KBC LUCKY DRAW SCAM
  // =========================================================================
  {
    id: 'whatsapp_lottery_kbc_028',
    name: 'WhatsApp KBC Lottery / International Audio Call Scam',
    originalMessage: 'Badhai ho! Aapka WhatsApp number KBC lottery me Rs 25,00,000 jeet chuka hai. Lottery claim karne ke liye WhatsApp audio call karein Lottery Officer Rana Pratap Singh ko number +92-300-9821034 par.',
    categories: ['LOTTERY_SCAM', 'ADVANCE_FEE_FRAUD', 'KBC_IMPERSONATION', 'WHATSAPP_CALL_SCAM'],
    riskLevel: 'CRITICAL',
    baseRiskScore: 97,
    intent: {
      claiming: 'Claims your WhatsApp number has won a ₹25,00,000 KBC lottery prize.',
      wantsUserToDo: 'Make a WhatsApp audio call to an international number (+92 Pakistan) to claim the prize.',
      motive: 'Advance fee fraud: extract "registration fees", "processing taxes", and bank details over voice call.',
    },
    matchingConcepts: [
      'kbc lottery', 'kbc lucky draw', 'aapka whatsapp number jeet chuka hai',
      'lottery officer', 'rana pratap singh', 'whatsapp audio call',
      'claim your lottery', '25 lakh lottery', 'kbc winner'
    ],
    signals: [
      { type: 'UNSOLICITED_PRIZE', severity: 'critical', evidence: 'Unsolicited ₹25,00,000 lottery winning claim' },
      { type: 'BRAND_IMPERSONATION', severity: 'high', evidence: 'Impersonates KBC / Kaun Banega Crorepati' },
      { type: 'INTERNATIONAL_CALL_BAIT', severity: 'critical', evidence: 'Directs victim to WhatsApp audio call an international +92 number' },
    ],
    claimedOrganization: 'KBC Lottery',
    recommendedVerdict: 'LIKELY_FRAUD',
    explanation: {
      en: 'This message claims that your WhatsApp number won a ₹25,00,000 KBC lottery prize and instructs you to make a WhatsApp audio call to an unverified international number.',
      hi: 'Ye message KBC lottery me ₹25 Lakh jeetne ka jhootha claim karke international number par WhatsApp call karne ko bol raha hai. Prize dene ke bahane advance fees aur processing tax ke naam par paise thage jaate hain.',
    },
    recommendation: 'Do not call the number or pay any fees. Genuine TV shows never conduct WhatsApp lotteries or demand advance clearance money.',
  },
];
