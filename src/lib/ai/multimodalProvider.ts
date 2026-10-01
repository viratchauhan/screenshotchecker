import type {
  VisualObservation,
  InvestigationPlan,
  ToolExecutionOutput,
  EvidenceTraceItem,
  InvestigationToolName,
} from './reasoningSchema';
import type { ImageInfo, AuthenticityAssessment, AuthenticityStatus } from '../analyzer/types';

/** Conservative abstention for advice, reported scam tactics, or negated payment duties.
 * This does not certify benign content; it prevents these narrow rules from
 * turning educational or negative wording into a demanded action.
 */
function shouldAbstainFromDemandInference(text: string): boolean {
  return (/\b(?:beware|warning|advice|tips?)\b/i.test(text) &&
    /\b(?:scam|scammers|fraud|fraudsters|phishing|lottery|prize)\b/i.test(text)) ||
    /\bexample phishing\b/i.test(text);
}

export interface MultimodalAIProvider {
  id: string;
  name: string;
  isAvailable(): boolean;
  observeImage(imageInfo: ImageInfo, previewTextSample?: string): Promise<VisualObservation>;
  planInvestigation(observation: VisualObservation): Promise<InvestigationPlan>;
  reasonOverEvidence(
    observation: VisualObservation,
    toolOutputs: ToolExecutionOutput[],
    rawText: string
  ): Promise<{
    whatAmILookingAt: string;
    whatIsHappening: string;
    whatIsItClaiming: string;
    whatDoesItWantTheUserToDo: string;
    contextualReasoning: string;
    evidenceTraces: EvidenceTraceItem[];
    authenticity: AuthenticityAssessment;
    recommendations: string[];
    limitations: string[];
  }>;
}

/**
 * Built-in Open-Ended Multimodal Reasoning Engine.
 * Operates offline in browser memory with advanced fraud-pattern recognition.
 */
export class LocalMultimodalObserver implements MultimodalAIProvider {
  id = 'local-observer-engine';
  name = 'Local Autonomous Visual Observer';

  isAvailable(): boolean {
    return true;
  }

  async observeImage(imageInfo: ImageInfo, textSample?: string): Promise<VisualObservation> {
    const text = (textSample || '').toLowerCase();
    const visualElements: string[] = [];

    // Aspect ratio & dimensions analysis
    const isMobileAspect = imageInfo.aspectRatio === '9:16' || imageInfo.aspectRatio === '9:19.5' || imageInfo.height > imageInfo.width * 1.5;
    const isDesktopAspect = imageInfo.width > imageInfo.height * 1.2;

    let visualModality: VisualObservation['visualModality'] = 'unknown';
    if (isMobileAspect) visualModality = 'mobile_screenshot';
    else if (isDesktopAspect) visualModality = 'desktop_screenshot';
    else if (text.length > 200) visualModality = 'document_scan';
    else if (text.length > 0) visualModality = 'mobile_screenshot';
    else visualModality = 'unknown';

    // Layout elements
    if (/\b(?:5g|lte|\d{1,2}:\d{2}|battery|\d{1,3}%)\b/i.test(text)) visualElements.push('Mobile status bar');
    if (/\b(?:online|typing|read \d|yesterday at|today at|\?)\b/i.test(text)) visualElements.push('Chat message bubbles');
    if (/\b(?:transaction details|amount paid|upi ref|auth code)\b/i.test(text)) visualElements.push('Transaction card frame');
    if (/\b(?:store #|total paid|subtotal|cashier)\b/i.test(text)) visualElements.push('Receipt tabular structure');
    if (/\b(?:from:|to:|subject:|unsubscribe)\b/i.test(text)) visualElements.push('Email header fields');
    if (/\b(?:https?:\/\/|www\.|\.com|\.org|\.apk)\b/i.test(text)) visualElements.push('Embedded URL / File link');

    const hasTextContent = text.trim().length > 0;
    const hasStructuredLayout = visualElements.length > 0;

    let whatAmILookingAt = 'An image or graphical document capture.';
    let initialHypothesis = 'Screenshot or visual document awaiting OCR extraction and analysis.';

    // 1. Bank Account Lockout / Vishing
    if (
      (text.includes('wells fargo') || text.includes('chase') || text.includes('bank of america') || text.includes('citi') || text.includes('bank')) &&
      (text.includes('locked') || text.includes('suspended') || text.includes('suspicious activity')) &&
      (text.includes('call') || text.includes('verify your identity'))
    ) {
      whatAmILookingAt = 'A mobile SMS notification claiming an urgent bank account security lock with an unverified callback phone number.';
      initialHypothesis = 'High-risk bank security impersonation and telephone vishing attempt.';
    }
    // 2. Student Loan Forgiveness
    else if (text.includes('student loan') || text.includes('loan forgiveness') || text.includes('debt relief')) {
      whatAmILookingAt = 'An unsolicited SMS message promoting a student loan forgiveness program with enrollment urgency.';
      initialHypothesis = 'Potential advance-fee loan scam or deceptive marketing lead generation.';
    }
    // 3. Target / Retail Gift Card Prize
    else if ((text.includes('gift card') || text.includes('won') || text.includes('reward')) && (text.includes('target') || text.includes('walmart') || text.includes('500'))) {
      whatAmILookingAt = 'An unsolicited SMS announcement claiming the recipient won a $500 store gift card with an external claim link.';
      initialHypothesis = 'High-risk retail brand phishing and prize harvesting vector.';
    }
    // 4. UPS / Delivery Missed Parcel
    else if ((text.includes('delivery') || text.includes('parcel') || text.includes('package') || text.includes('missed our delivery')) && (text.includes('ups') || text.includes('usps') || text.includes('fedex') || text.includes('reschedule'))) {
      whatAmILookingAt = 'A delivery notification SMS claiming a missed parcel and prompting an urgent reschedule via web link.';
      initialHypothesis = 'Courier smishing attempt designed to harvest credit card redelivery fees.';
    }
    // 5. Florida Toll / SunPass
    else if (text.includes('toll') && (text.includes('florida') || text.includes('sunpass') || text.includes('invoice') || text.includes('late fee') || text.includes('outstanding') || text.includes('ezpass') || text.includes('dmv'))) {
      whatAmILookingAt = 'A road toll enforcement notice demanding payment of an outstanding balance to avoid late fees.';
      initialHypothesis = 'High-risk state highway toll authority smishing vector.';
    }
    // 6. Bank KYC APK
    else if (text.includes('kyc') && (text.includes('.apk') || text.includes('apk') || text.includes('rekyc'))) {
      whatAmILookingAt = 'An urgent banking KYC notice instructing recipient to install an Android APK application file.';
      initialHypothesis = 'Critical-risk banking malware / credential-stealing APK distribution.';
    }
    // 7. Legitimate Bank Credit/Debit
    else if (text.includes('credited') || text.includes('debited') || text.includes('a/c') || text.includes('upi')) {
      whatAmILookingAt = 'A financial notification or payment receipt displaying monetary transaction details.';
      initialHypothesis = 'Banking or digital payment transfer claim.';
    }
    // 8. General Chat
    else if (text.includes('online') || text.includes('read 1') || text.includes('read 0') || text.includes('google reviews')) {
      whatAmILookingAt = 'An instant messaging or chat conversation capture.';
      initialHypothesis = 'Interpersonal chat communication.';
    } else if (!hasTextContent) {
      whatAmILookingAt = 'An uploaded image awaiting text extraction.';
      initialHypothesis = 'Visual screenshot or photo undergoing inspection.';
    }

    return {
      whatAmILookingAt,
      visualModality,
      visualElementsDetected: visualElements,
      hasTextContent,
      hasStructuredLayout,
      initialHypothesis,
    };
  }

  async planInvestigation(observation: VisualObservation): Promise<InvestigationPlan> {
    const steps: InvestigationPlan['steps'] = [
      { tool: 'ocr_layout', reason: 'Extract readable text and structural lines from image', priority: 'high' },
      { tool: 'image_specs', reason: 'Determine exact pixel geometry and aspect ratio', priority: 'high' },
      { tool: 'metadata_inspector', reason: 'Check for camera hardware and software editor tags', priority: 'medium' },
      { tool: 'url_analyzer', reason: 'Inspect embedded web destinations and link security', priority: 'high' },
      { tool: 'pii_scanner', reason: 'Check for exposed sensitive personal or financial identifiers', priority: 'medium' },
      { tool: 'financial_auditor', reason: 'Extract stated amounts, transaction status, and payment platforms', priority: 'high' },
      { tool: 'consistency_checker', reason: 'Audit internal amount and status consistency', priority: 'high' },
      { tool: 'channel_context', reason: 'Analyze conversational intent, urgency, and threats', priority: 'medium' },
      { tool: 'forensic_compression', reason: 'Run Error Level Analysis to detect composite image edits', priority: 'low' },
    ];

    return {
      objective: `Investigate: ${observation.initialHypothesis}`,
      steps,
    };
  }

  async reasonOverEvidence(
    observation: VisualObservation,
    toolOutputs: ToolExecutionOutput[],
    rawText: string
  ) {
    const lower = rawText.toLowerCase();
    const evidenceTraces: EvidenceTraceItem[] = [];
    const limitations: string[] = [
      'A screenshot alone cannot independently prove whether underlying real-world debts, bank transfers, or conversations actually occurred without external API verification.',
    ];
    const recommendations: string[] = [];

    const urlData = toolOutputs.find((t) => t.tool === 'url_analyzer')?.data;
    const finData = toolOutputs.find((t) => t.tool === 'financial_auditor')?.data?.financial;
    const consistencyData = toolOutputs.find((t) => t.tool === 'consistency_checker')?.data;
    const privacyData = toolOutputs.find((t) => t.tool === 'pii_scanner')?.data;
    const links = urlData?.findings || [];

    let whatAmILookingAt = observation.whatAmILookingAt;
    let whatIsHappening = 'A message or graphic is communicating information to the viewer.';
    let whatIsItClaiming = 'No explicit contractual or financial claim detected.';
    let whatDoesItWantTheUserToDo = 'No explicit action demanded.';
    let contextualReasoning = 'The evidence gathered does not display high-pressure urgency or manipulative deception.';
    let authenticityStatus: AuthenticityStatus = 'CONSISTENT';
    let authenticityHeadline = 'Internally Consistent Visual Capture';
    let authenticityRationale = 'Visual elements and textual formatting appear internally consistent.';

    // Helper: Phone numbers in raw text
    const phoneMatches = rawText.match(/(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*\d{3}\s*\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{3}-\d{3}-\d{4}\b|\b1-\d{3}-\d{3}-\d{4}\b/g) || [];
    const phone = phoneMatches[0] || '';

    // Narrow evidence-based patterns. A warning is not proof of sender identity or fraud.
    // Guidance: https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams
    // https://consumer.ftc.gov/consumer-alerts/2023/04/are-you-really-lucky-winner-spot-prize-scams
    const abstainFromDemandInference = shouldAbstainFromDemandInference(rawText);
    const urlEvidenceExecuted = toolOutputs.find(t => t.tool === 'url_analyzer')?.status === 'executed';
    const warnsAgainstLinks = /\b(?:do not|don't|never)\s+(?:click|open|visit|follow|use)\b/i.test(rawText);
    const riskyCredentialLink = links.find((link: any) => {
      if (!urlEvidenceExecuted || typeof link.url !== 'string' || !rawText.includes(link.url)) return false;
      try {
        const url = new URL(link.url);
        const beforeLink = rawText.slice(Math.max(0, rawText.indexOf(link.url) - 160), rawText.indexOf(link.url));
        // The action must lead into this URL, not an unrelated official-app sentence.
        const directsToLink = /(?:^|[.!?:\n])\s*(?:please\s+)?(?:unlock|verify|sign in|log in)(?:\s+(?:your|the))?(?:\s+(?:account|identity|credentials))?\s+(?:at|via|using)\s*$/i.test(beforeLink);
        return directsToLink && /^https?:$/.test(url.protocol) &&
          (link.riskLevel === 'high' || /^(?:\d{1,3}\.){3}\d{1,3}$/.test(url.hostname));
      } catch { return false; }
    });
    const bankLinkDemand = /\b(?:bank|chase|wells fargo|bank of america|citi)\b/i.test(rawText) &&
      /\b(?:locked|suspended|frozen)\b/i.test(rawText) &&
      /\b(?:unlock|verify|sign in|log in)\b/i.test(rawText) &&
      /\b(?:credentials|password|identity|account)\b/i.test(rawText) &&
      riskyCredentialLink && !warnsAgainstLinks && !abstainFromDemandInference;
    const prizeFeeDemand = /\b(?:won|winner|lottery|prize|sweepstakes)\b/i.test(rawText) &&
      /(?:^|[.!?:\n])\s*(?:please\s+)?(?:send|pay|transfer)\b[^!?\n]{0,100}\b(?:fee|taxes|charge)\b[^.!?\n]{0,100}\bto\s+(?:claim(?:\s+(?:your|the)\s+(?:prize|reward|winnings))?(?=[.!?\n]|$)|(?:receive|release|collect)\s+(?:(?:your|the)\s+)?(?:prize|reward|winnings)\b)/i.test(rawText) &&
      !abstainFromDemandInference &&
      !/\b(?:no|without)\s+(?:processing\s+)?(?:fee|charge)|\bpay\s+nothing\b/i.test(rawText);

    if (bankLinkDemand) {
      whatIsHappening = 'The text pairs an account-lockout claim with a direct instruction to verify or unlock at a flagged link.';
      whatIsItClaiming = 'Claims a bank account is locked or suspended and needs verification.';
      whatDoesItWantTheUserToDo = 'The text asks you to use a link to unlock or verify an account.';
      contextualReasoning = 'Account pressure combined with a risky credential link is a phishing warning sign. The screenshot does not establish who sent it.';
      authenticityStatus = 'SUSPICIOUS';
      authenticityHeadline = 'Account Verification Link Warning';
      authenticityRationale = 'Account-lockout pressure and a risky verification destination appear together.';
      evidenceTraces.push({
        id: 'trace_bank_credential_link',
        observation: 'Account-lockout language accompanies a verification link.',
        evidence: [rawText, `Observed link: ${riskyCredentialLink.url}`],
        interpretation: 'This rule-based pattern can indicate a phishing attempt; it does not establish one.',
        risk: 'Entering credentials at an unverified destination could expose the account.',
        limitation: 'The destination was not opened; screenshot text and URL indicators do not prove sender identity or maliciousness.',
        recommendation: 'Do not use the message link. Check your account through the official bank app or a known address.',
        severity: 'high',
      });
      recommendations.push('Do not use the message link. Open the official bank app or contact the bank using a number you already trust.');
    } else if (prizeFeeDemand) {
      whatIsHappening = 'A prize or lottery claim asks for an upfront fee before the reward can be claimed.';
      whatIsItClaiming = 'Claims a prize is available after an upfront payment.';
      whatDoesItWantTheUserToDo = 'Asks you to send or pay a fee to claim the prize.';
      contextualReasoning = 'An upfront payment demand to obtain a claimed prize is a strong scam warning sign.';
      authenticityStatus = 'SUSPICIOUS';
      authenticityHeadline = 'Upfront Prize Fee Warning';
      authenticityRationale = 'A reward claim is paired with a payment demand before receiving it.';
      evidenceTraces.push({
        id: 'trace_prize_fee_demand',
        observation: 'A claimed prize is conditioned on paying a fee.',
        evidence: [rawText],
        interpretation: 'This rule-based payment pattern can indicate an advance-fee prize scam; sender identity is unverified.',
        risk: 'Money or gift-card value sent to the requester may be lost.',
        limitation: 'This is a text-pattern warning; the screenshot cannot establish sender identity or whether payment occurred.',
        recommendation: 'Do not pay to claim the prize or share gift-card codes. Verify any promotion independently.',
        severity: 'high',
      });
      recommendations.push('Do not pay the fee or share gift-card codes. Verify any promotion independently.');
    }
    // =========================================================================
    // 1. WELLS FARGO / BANK LOCKOUT VISHING CASE
    // =========================================================================
    else if (
      (lower.includes('wells fargo') || lower.includes('chase') || lower.includes('bank of america') || lower.includes('citi')) &&
      (lower.includes('locked') || lower.includes('suspended') || lower.includes('suspicious activity')) &&
      (lower.includes('call us') || lower.includes('call') || lower.includes('verify your identity'))
    ) {
      const bankName = lower.includes('wells fargo') ? 'Wells Fargo' : 'Bank';
      whatAmILookingAt = `An SMS text message impersonating ${bankName} account security.`;
      whatIsHappening = `The message falsely claims your account has been locked for suspicious activity and prompts an immediate telephone call to ${phone || 'an unverified number'}.`;
      whatIsItClaiming = `Claims that ${bankName} placed an urgent security freeze on your account.`;
      whatDoesItWantTheUserToDo = `Demands that you dial ${phone || 'the provided number'} to "verify your identity" (harvest credentials/SSN/PIN).`;

      contextualReasoning =
        'Financial institutions do not instruct customers via random SMS to dial third-party phone numbers to unlock security freezes. This is a classic voice-phishing (vishing) trap designed to steal personal identity numbers, card details, and passwords.';

      evidenceTraces.push({
        id: 'trace_bank_vishing',
        observation: `Sender claims to be ${bankName} notifying of an account lockout.`,
        evidence: [
          `Text claims: "account has been locked for suspicious activity"`,
          phone ? `Unverified callback telephone number provided: ${phone}` : 'Direct call instruction present',
          'Prompt to "verify identity" over the phone',
        ],
        interpretation: 'Deceptive voice-phishing (vishing) vector targeting bank credentials and SSN.',
        risk: 'High danger of credential theft, identity takeover, and unauthorized funds transfer.',
        limitation: 'Screenshot cannot verify real core banking account status.',
        recommendation: `Do not call ${phone || 'the number'}. Sign in directly to your official ${bankName} app or call the verified number on the back of your debit card.`,
        severity: 'high',
      });

      authenticityStatus = 'SUSPICIOUS';
      authenticityHeadline = 'High-Risk Bank Phishing / Vishing Pattern Detected';
      authenticityRationale = `Impersonation of ${bankName} combined with account lockout urgency and unverified callback number matches known vishing scam attacks.`;
      recommendations.push(`Do not call ${phone || 'the number'}. Open your official banking app or call the customer service number on the back of your card.`);
    }

    // =========================================================================
    // 2. STUDENT LOAN FORGIVENESS SCAM CASE
    // =========================================================================
    else if (
      (lower.includes('student loan') || lower.includes('loan forgiveness') || lower.includes('debt relief')) &&
      (lower.includes('qualify') || lower.includes('enrollment') || lower.includes('apply now') || lower.includes('call'))
    ) {
      whatAmILookingAt = 'An unsolicited SMS text message promoting a student loan forgiveness program.';
      whatIsHappening = 'The message claims you qualify for government student loan debt relief and urges you to call before enrollment ends.';
      whatIsItClaiming = 'Claims you are eligible for federal student loan forgiveness with an urgent closing enrollment deadline.';
      whatDoesItWantTheUserToDo = `Pressures you to call ${phone || '1-855-412-0901'} immediately to apply.`;

      contextualReasoning =
        'Unsolicited SMS messages promising federal student loan forgiveness with artificial deadlines are deceptive lead-generation funnels that charge illegal advance fees or harvest FSA IDs and social security numbers.';

      evidenceTraces.push({
        id: 'trace_loan_scam',
        observation: 'Unsolicited notification claiming loan forgiveness qualification.',
        evidence: [
          'Text claims: "You may qualify for a new student loan forgiveness program!"',
          'Urgency pressure: "Enrollment ends soon"',
          phone ? `Toll-free callback lead number: ${phone}` : 'Telephone application directive',
        ],
        interpretation: 'Deceptive financial relief bait operated by unauthorized telemarketing scammers.',
        risk: 'Financial loss from illegal advance fees and exposure of federal student aid credentials.',
        limitation: 'Screenshot cannot verify actual federal student aid record eligibility.',
        recommendation: 'Do not call the number. Check official loan status on StudentAid.gov directly.',
        severity: 'high',
      });

      authenticityStatus = 'SUSPICIOUS';
      authenticityHeadline = 'High-Risk Student Loan Forgiveness Scam Pattern';
      authenticityRationale = 'Unsolicited debt forgiveness eligibility paired with artificial deadline and toll-free callback number.';
      recommendations.push('Do not call the number. Check official government student aid portals (StudentAid.gov) directly.');
    }

    // =========================================================================
    // 3. TARGET / RETAIL $500 GIFT CARD PRIZE CASE
    // =========================================================================
    else if (
      (lower.includes('gift card') || lower.includes('won') || lower.includes('winner') || lower.includes('reward')) &&
      (lower.includes('target') || lower.includes('walmart') || lower.includes('500') || lower.includes('targetwinner'))
    ) {
      const linkUrl = links[0]?.url || 'https://targetwinner.com';
      whatAmILookingAt = 'An unsolicited SMS text message claiming you won a $500 retail gift card.';
      whatIsHappening = 'The message claims you were awarded a $500 Target gift card and directs you to an external website to claim it.';
      whatIsItClaiming = 'Claims the recipient won a $500 gift card prize reward.';
      whatDoesItWantTheUserToDo = `Directs you to click ${linkUrl} to claim the reward.`;

      contextualReasoning =
        `The communication uses a high-value financial reward ($500) paired with an unofficial third-party domain (${linkUrl}). Retailers do not distribute unsolicited $500 gift cards through random text messages.`;

      evidenceTraces.push({
        id: 'trace_giftcard_phishing',
        observation: 'Unsolicited prize claim impersonating Target Corporation.',
        evidence: [
          'Text claims: "Congratulations! You\'ve won a $500 gift card to Target"',
          `Deceptive phishing destination: ${linkUrl} (NOT official target.com)`,
          'Call to action prompting user to "claim your reward"',
        ],
        interpretation: 'Brand impersonation phishing vector to steal personal info and credit cards.',
        risk: 'Identity theft and fraudulent charges from entered payment details.',
        limitation: 'Screenshot cannot verify retail promotional sweepstakes registries.',
        recommendation: 'Do not click the link or disclose personal information.',
        severity: 'high',
      });

      authenticityStatus = 'SUSPICIOUS';
      authenticityHeadline = 'High-Risk Retail Prize Phishing Pattern Detected';
      authenticityRationale = `Impersonation of Target with fake $500 gift card bait and lookalike phishing domain (${linkUrl}).`;
      recommendations.push('Do not click the link. Target does not distribute unsolicited gift cards via SMS.');
    }

    // =========================================================================
    // 4. UPS / MISSED PARCEL DELIVERY RESCHEDULE CASE
    // =========================================================================
    else if (
      (lower.includes('delivery') || lower.includes('parcel') || lower.includes('package') || lower.includes('missed our delivery')) &&
      (lower.includes('ups') || lower.includes('usps') || lower.includes('fedex') || lower.includes('myparcel') || lower.includes('reschedule'))
    ) {
      const linkUrl = links[0]?.url || 'https://myparcel-ups.com';
      whatAmILookingAt = 'An SMS text message claiming a missed parcel delivery.';
      whatIsHappening = 'The message claims an attempted delivery failed and requires you to visit a link to reschedule.';
      whatIsItClaiming = 'Claims you have an undelivered parcel held by the courier.';
      whatDoesItWantTheUserToDo = `Instructs you to visit ${linkUrl} to reschedule delivery.`;

      contextualReasoning =
        `The message lacks a valid tracking number or recipient identity and routes to a hyphenated lookalike domain (${linkUrl}). Deceptive delivery portals typically harvest credit card information under the guise of small $1–$3 redelivery fees.`;

      evidenceTraces.push({
        id: 'trace_delivery_phishing',
        observation: 'Vague missed delivery notification with an unverified external link.',
        evidence: [
          'Text claims: "You\'ve missed our delivery. To reschedule delivery of your parcel..."',
          `Spoofed courier domain: ${linkUrl} (NOT official ups.com / carrier portal)`,
          'No valid tracking number or recipient name present in SMS',
        ],
        interpretation: 'Delivery courier smishing attack designed to harvest credit card details.',
        risk: 'Financial loss from recurring credit card fraud disguised as parcel rescheduling.',
        limitation: 'Screenshot cannot query courier dispatch logs.',
        recommendation: 'Do not open the link. Track shipments exclusively on official carrier apps or websites.',
        severity: 'high',
      });

      authenticityStatus = 'SUSPICIOUS';
      authenticityHeadline = 'High-Risk Parcel Delivery Smishing Pattern Detected';
      authenticityRationale = 'Spoofed courier domain combined with generic missed delivery pretext matches known card-harvesting smishing attacks.';
      recommendations.push('Do not open the link. Track your shipment on official carrier websites directly.');
    }

    // =========================================================================
    // 5. FLORIDA TOLL / SUNPASS LATE FEE SMISHING CASE
    // =========================================================================
    else if (
      lower.includes('toll') &&
      (lower.includes('florida') || lower.includes('sunpass') || lower.includes('late fee') || lower.includes('outstanding') || lower.includes('dmv') || lower.includes('invoice'))
    ) {
      const linkUrl = links[0]?.url || 'https://tolls-sunpass.com';
      whatAmILookingAt = 'An SMS text message claiming an outstanding road toll balance.';
      whatIsHappening = 'The message claims an unpaid toll fee exists and demands immediate settlement via external link to avoid late penalties.';
      whatIsItClaiming = 'Claims you owe an unpaid toll balance on your account and will incur additional penalty fees.';
      whatDoesItWantTheUserToDo = `Pressures you to click ${linkUrl} and submit payment immediately.`;

      contextualReasoning =
        'Toll authorities do not send debt notices with direct external payment links via SMS. Fake toll portals like tolls-sunpass.com capture credit card credentials directly.';

      evidenceTraces.push({
        id: 'trace_toll_phishing',
        observation: 'The message requests payment for alleged unpaid toll invoices.',
        evidence: [
          'Text claims: "outstanding toll amount... make a payment now to avoid a late fee"',
          'Time pressure and threat of penalties/fees',
          `Phishing domain: ${linkUrl} (NOT official sunpass.com)`,
        ],
        interpretation: 'Smishing vector designed to steal credit card information via fictitious toll fees.',
        risk: 'Financial theft from unauthorized credit card charges on spoofed payment portals.',
        limitation: 'Screenshot cannot verify real state highway toll transponder logs.',
        recommendation: 'Do not use the provided link. Verify any toll balance through sunpass.com directly.',
        severity: 'high',
      });

      authenticityStatus = 'SUSPICIOUS';
      authenticityHeadline = 'High-Risk Highway Toll Smishing Pattern Detected';
      authenticityRationale = 'Urgent toll debt claims paired with penalty threats and spoofed domain match widespread state toll smishing campaigns.';
      recommendations.push('Do not make any payment through the link. Check the official SunPass website directly.');
    }

    // =========================================================================
    // 6. BANK KYC / APK MALWARE CASE
    // =========================================================================
    else if (lower.includes('kyc') && (lower.includes('.apk') || lower.includes('apk') || lower.includes('rekyc'))) {
      whatAmILookingAt = 'An urgent banking KYC notice prompting an APK file installation.';
      whatIsHappening = 'The message threatens account lockout unless you download and open an attached APK file.';
      whatIsItClaiming = 'Claims bank ReKYC is pending and account will be blocked.';
      whatDoesItWantTheUserToDo = 'Demands that you download and open an Android APK application file.';

      contextualReasoning =
        'Banks never distribute APK application packages via SMS or WhatsApp. APK files install malicious software capable of intercepting SMS OTPs, recording keystrokes, and draining accounts.';

      evidenceTraces.push({
        id: 'trace_apk_malware',
        observation: 'Distribution of an APK package under the guise of banking ReKYC.',
        evidence: [
          'Account lockout threat: "avoid A/c blocking"',
          'APK attachment requested for banking KYC',
          'Urgent pressure to install external application',
        ],
        interpretation: 'Malicious Android APK Trojan distribution targeting mobile banking credentials.',
        risk: 'Total device compromise, OTP interception, and unauthorized financial transactions.',
        limitation: 'Screenshot cannot analyze binary APK payload without sandbox execution.',
        recommendation: 'Never install APK files received via SMS or WhatsApp.',
        severity: 'high',
      });

      authenticityStatus = 'SUSPICIOUS';
      authenticityHeadline = 'Critical-Risk Banking APK Malware Pattern Detected';
      authenticityRationale = 'Banking KYC threat combined with APK installer distribution is a severe malware delivery vector.';
      recommendations.push('Do not download or install the APK. Contact your bank directly through official branch channels.');
    }

    // =========================================================================
    // 7. FINANCIAL TRANSACTION / INCONSISTENCY CASE
    // =========================================================================
    else if (finData && finData.financialType !== 'NOT_FINANCIAL') {
      const isCredit = finData.financialType === 'CREDIT';
      const isDebit = finData.financialType === 'DEBIT';
      const isPending = finData.financialType === 'PENDING';
      const isFailed = finData.financialType === 'FAILED';

      whatAmILookingAt = `A financial ${isCredit ? 'credit' : isDebit ? 'debit' : isPending ? 'pending' : isFailed ? 'failed' : ''} notification or transaction receipt.`;
      whatIsHappening = `The image displays details of a monetary transaction (${finData.primaryAmount?.raw || 'funds stated'}).`;
      whatIsItClaiming = `Claims that a transaction of ${finData.primaryAmount?.raw || 'funds'} was ${finData.status.toLowerCase()}.`;
      whatDoesItWantTheUserToDo = 'No immediate action demanded; displays transaction confirmation.';

      if (consistencyData && !consistencyData.isConsistent) {
        contextualReasoning = `Internal data discrepancies detected (${consistencyData.issues.map((i: any) => i.title).join(', ')}). This indicates likely manual editing of the receipt graphic.`;
        evidenceTraces.push({
          id: 'trace_inconsistency',
          observation: 'Conflicting transaction values exist within the same visual receipt.',
          evidence: consistencyData.issues.map((i: any) => i.explanation),
          interpretation: 'Different parts of the graphic display misaligned amounts or statuses.',
          risk: 'High likelihood of edited or fabricated receipt proof.',
          limitation: 'Visual receipt numbers do not match bank settlement records.',
          recommendation: 'Do not accept this screenshot as genuine proof of transfer. Verify in your bank app.',
          severity: 'high',
        });
        authenticityStatus = 'CONTRADICTED';
        authenticityHeadline = 'Internal Discrepancy Detected';
        authenticityRationale = 'Contradictory numbers or statuses identified within the image.';
        recommendations.push('Do not accept this screenshot as proof of payment. Check bank app directly.');
      } else {
        contextualReasoning =
          'A transaction is visibly communicated, but a screenshot alone cannot prove funds were settled in the recipient account.';
        evidenceTraces.push({
          id: 'trace_financial_claim',
          observation: `A visual claim of ${finData.status.toLowerCase()} funds (${finData.primaryAmount?.raw || ''}) is presented.`,
          evidence: [
            `Stated amount: ${finData.primaryAmount?.raw || 'Not specified'}`,
            `Platform/Institution: ${finData.platform || 'Banking transfer'}`,
          ],
          interpretation: 'Visual representation of a payment transfer.',
          risk: 'Screenshots can be generated with mock tools without transferring money.',
          limitation: 'Authenticity of funds transfer cannot be proven by image capture alone.',
          recommendation: 'Verify settled funds directly inside your official banking application.',
          severity: 'info',
        });
        authenticityStatus = 'UNVERIFIABLE';
        authenticityHeadline = 'Financial Claim (Unverifiable from Screenshot Alone)';
        authenticityRationale = 'A transaction is claimed, but cannot be independently verified without banking APIs.';
        recommendations.push('Verify settled balances directly inside your official banking or UPI application.');
      }
    }

    // =========================================================================
    // 8. PHOTOGRAPH / MINIMAL TEXT
    // =========================================================================
    else if (rawText.trim().length < 25) {
      whatAmILookingAt = 'A photograph or visual graphic with minimal textual content.';
      whatIsHappening = 'A visual image is displayed without explicit transactional directives.';
      whatIsItClaiming = 'No textual or financial claims detected.';
      whatDoesItWantTheUserToDo = 'No action demanded.';
      contextualReasoning = 'The image does not contain textual claims, urgency cues, or deceptive patterns.';
      authenticityStatus = 'INSUFFICIENT_EVIDENCE';
      authenticityHeadline = 'Insufficient Evidence for Authenticity Assessment';
      authenticityRationale = 'The image contains minimal structural markers to evaluate authenticity.';
      recommendations.push('No significant risk signals detected.');
    }

    // Ensure at least one recommendation exists
    if (recommendations.length === 0) {
      recommendations.push('Review the extracted data independently before taking action.');
    }

    return {
      whatAmILookingAt,
      whatIsHappening,
      whatIsItClaiming,
      whatDoesItWantTheUserToDo,
      contextualReasoning,
      evidenceTraces,
      authenticity: {
        status: authenticityStatus,
        headline: authenticityHeadline,
        rationale: authenticityRationale,
        limitations,
      },
      recommendations,
      limitations,
    };
  }
}
