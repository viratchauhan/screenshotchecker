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
      'driver license not be renewed', 'dmv record', 'service termination', 'arrest warrant'
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
      'pay the balance', 'excessive fine', 'prepaid task', 'advance fee'
    ],
    weight: 10,
    severity: 'high',
  },
  {
    id: 'sensitive_info_keywords',
    category: 'sensitive_info',
    keywords: [
      'otp', 'pin', 'cvv', 'password', 'bank details', 'card number',
      'aadhaar', 'pan', 'kyc', 'rekyc', 'email', 'emails', 'address',
      'emails and address', 'email and address', 'verify your identity',
      'share your verification code', 'fsa id', 'ssn', 'personal details',
      'personal info', 'personal information'
    ],
    weight: 10,
    severity: 'high',
  },
  {
    id: 'attachment_keywords',
    category: 'attachment',
    keywords: [
      '.apk', 'apk', '18 mb · apk', '.exe', '.zip', 'open pdf file',
      'open attached file', 'install application', 'download file', 'banking apk', 'kyc apk'
    ],
    weight: 20,
    severity: 'critical',
  },
  {
    id: 'impersonation_keywords',
    category: 'impersonation',
    keywords: [
      'bank of maharashtra', 'wells fargo', 'chase', 'bank of america', 'sbi',
      'hdfc', 'icici', 'fedex', 'fed3x', 'ups', 'usps', 'dhl', 'target',
      'walmart', 'amazon', 'sunpass', 'florida toll', 'e-zpass', 'ezpass', 'dmv',
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
      'wrong number', 'hello and good morning'
    ],
    weight: 10,
    severity: 'high',
  },
  {
    id: 'unsolicited_offer_keywords',
    category: 'social_engineering',
    keywords: [
      "you've won", 'you won', 'won a', 'gift card', 'claim your reward',
      'congratulations winner', 'selected as a winner', 'click to claim',
      'loan forgiveness', 'student loan forgiveness', 'enrollment ends soon',
      'you may qualify'
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
    recommendation: 'Do not click the bit.ly link. Verify your toll balance directly on the official E-ZPass website or through your state DMV.',
  },
];
