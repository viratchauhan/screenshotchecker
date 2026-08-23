export type OverallStatus = 'SAFE_TO_REVIEW' | 'REVIEW_RECOMMENDED' | 'POTENTIAL_RISK';

export type TopCategory =
  | 'BANKING'
  | 'PAYMENT'
  | 'MESSAGING'
  | 'EMAIL'
  | 'SMS'
  | 'SOCIAL_MEDIA'
  | 'COMMERCE'
  | 'DOCUMENT'
  | 'SECURITY'
  | 'IMAGE'
  | 'ADVERTISEMENT'
  | 'OTHER'
  | 'UNKNOWN';

export type CategorySubtype =
  // Banking
  | 'credit_notification'
  | 'debit_notification'
  | 'refund_notification'
  | 'transaction_history'
  | 'account_balance'
  | 'payment_success'
  | 'payment_failed'
  | 'payment_pending'
  | 'payment_reversed'
  | 'payment_request'
  // Payment
  | 'upi_receipt'
  | 'card_payment'
  | 'digital_wallet'
  | 'bank_transfer'
  | 'payment_confirmation'
  // Messaging
  | 'whatsapp_like'
  | 'telegram_like'
  | 'instagram_dm_like'
  | 'messenger_like'
  | 'generic_chat'
  // Email
  | 'banking_email'
  | 'payment_email'
  | 'order_email'
  | 'security_email'
  | 'promotional_email'
  | 'phishing_like_email'
  | 'generic_email'
  // SMS
  | 'banking_sms'
  | 'otp_sms'
  | 'delivery_sms'
  | 'promotional_sms'
  | 'security_alert'
  | 'scam_like_sms'
  | 'generic_sms'
  // Commerce
  | 'order_confirmation'
  | 'retail_receipt'
  | 'commercial_invoice'
  | 'delivery_status'
  | 'product_listing'
  // Security
  | 'otp_code'
  | 'login_alert'
  | 'password_reset'
  | 'account_warning'
  | 'kyc_request'
  | 'verification_request'
  // Social
  | 'social_post'
  | 'social_profile'
  | 'social_message'
  // Image
  | 'photograph'
  | 'illustration'
  | 'digital_art'
  | 'screenshot_of_image'
  | 'scanned_document'
  | 'unknown_image';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';

export type AuthenticityStatus =
  | 'VERIFIED'
  | 'SUPPORTED'
  | 'CONSISTENT'
  | 'SUSPICIOUS'
  | 'CONTRADICTED'
  | 'UNVERIFIABLE'
  | 'INSUFFICIENT_EVIDENCE'
  | 'NOT_DETERMINED';

export type ActionType =
  | 'CLICK_LINK'
  | 'MAKE_PAYMENT'
  | 'SEND_MONEY'
  | 'SHARE_OTP'
  | 'SHARE_PASSWORD'
  | 'LOGIN'
  | 'DOWNLOAD_FILE'
  | 'CALL_NUMBER'
  | 'REPLY'
  | 'SHARE_PERSONAL_INFORMATION'
  | 'VERIFY_ACCOUNT'
  | 'CONTACT_SENDER'
  | 'OPEN_LINK'
  | 'INSTALL_APP'
  | 'DO_NOTHING'
  | 'UNKNOWN';

export type ClaimEventType =
  | 'MONEY_CREDITED'
  | 'MONEY_DEBITED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_REQUEST'
  | 'ACCOUNT_LOCKED'
  | 'PRIZE_WON'
  | 'OTP_DELIVERY'
  | 'ORDER_PLACED'
  | 'DELIVERY_UPDATE'
  | 'REFUND_CLAIM'
  | 'SECURITY_ALERT'
  | 'INFORMATIONAL'
  | 'UNKNOWN';

export type EntityType =
  | 'PERSON'
  | 'ORGANIZATION'
  | 'BANK'
  | 'PLATFORM'
  | 'AMOUNT'
  | 'CURRENCY'
  | 'DATE'
  | 'TIME'
  | 'PHONE'
  | 'EMAIL'
  | 'URL'
  | 'TRANSACTION_ID'
  | 'ORDER_ID'
  | 'UPI_ID'
  | 'ACCOUNT_IDENTIFIER'
  | 'REFERENCE_NUMBER'
  | 'LOCATION'
  | 'USERNAME'
  | 'PRODUCT'
  | 'ADDRESS';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StructuredEntity {
  id: string;
  type: EntityType;
  value: string;
  normalizedValue?: number | string;
  source: 'ocr_text' | 'metadata' | 'layout_heuristics';
  boundingBox?: BoundingBox;
  confidence: ConfidenceLevel;
  evidence: string;
}

export interface ParsedAmount {
  raw: string;
  value: number;
  currency: string;
  context?: string;
  boundingBox?: BoundingBox;
}

export interface VisualFingerprintSignal {
  type: string;
  signal: string;
  strength: 'strong' | 'moderate' | 'weak';
  description: string;
}

export interface VisualFingerprint {
  signals: VisualFingerprintSignal[];
  hasHeader: boolean;
  hasChatBubbles: boolean;
  hasTransactionCard: boolean;
  hasStatusBadge: boolean;
  hasHeroAmount: boolean;
  hasDividerRule: boolean;
  hasAvatarOrProfile: boolean;
  detectedUIPattern: string;
}

export interface HierarchicalClassification {
  topCategory: TopCategory;
  subtype: CategorySubtype;
  label: string;
  confidence: ConfidenceLevel;
  numericConfidence: number;
  evidence: string[];
}

export interface SemanticClaim {
  id: string;
  claimType: ClaimEventType;
  primaryClaim: string;
  subject?: string;
  event: string;
  amount?: ParsedAmount;
  organization?: string;
  dateTime?: string;
  claimText: string;
  timePressure?: string;
  evidence: string;
  confidence: ConfidenceLevel;
}

export interface RequestedAction {
  id: string;
  actionType: ActionType;
  label: string;
  description: string;
  target?: string;
  urgency?: string;
  evidence: string;
}

export interface RelationshipNode {
  id: string;
  label: string;
  type: 'entity' | 'claim' | 'action' | 'url' | 'org';
}

export interface RelationshipEdge {
  from: string;
  to: string;
  relation: string;
  explanation: string;
}

export interface RelationshipGraph {
  nodes: RelationshipNode[];
  edges: RelationshipEdge[];
  summary: string;
}

export interface ConsistencyIssue {
  id: string;
  type:
    | 'AMOUNT_INCONSISTENCY'
    | 'STATUS_INCONSISTENCY'
    | 'EVENT_INCONSISTENCY'
    | 'REFERENCE_INCONSISTENCY'
    | 'DATE_INCONSISTENCY';
  title: string;
  explanation: string;
  valuesFound: string[];
  severity: 'high' | 'medium' | 'low';
}

export interface ConsistencyAudit {
  isConsistent: boolean;
  issues: ConsistencyIssue[];
  disclaimer: string;
}

export interface FinancialIntelligence {
  financialType: 'CREDIT' | 'DEBIT' | 'REFUND' | 'PENDING' | 'FAILED' | 'REVERSED' | 'PAYMENT_REQUEST' | 'NOT_FINANCIAL';
  amounts: ParsedAmount[];
  primaryAmount?: ParsedAmount;
  sender?: string;
  recipient?: string;
  platform?: string;
  transactionId?: string;
  accountIdentifier?: string;
  date?: string;
  time?: string;
  status: string;
  settledFundsVerified: boolean;
  verificationDisclaimer: string;
}

export interface ChannelIntelligence {
  channel: 'CHAT' | 'EMAIL' | 'SMS' | 'COMMERCE' | 'GENERAL';
  senderIdentity?: string;
  recipientIdentity?: string;
  isUrgent: boolean;
  isThreatPresent: boolean;
  isPaymentRequested: boolean;
  isOtpRequested: boolean;
  domainMatch?: { claimedOrg: string; actualDomain: string; isAligned: boolean };
  notes: string[];
}

export interface ExplainableRiskPattern {
  id: string;
  title: string;
  whatWasFound: string;
  whyItMatters: string;
  supportingEvidence: string[];
  severity: 'high' | 'medium' | 'info';
  recommendedAction: string;
}

export interface AuthenticityAssessment {
  status: AuthenticityStatus;
  headline: string;
  rationale: string;
  limitations: string[];
}

export interface HumanReadableReport {
  whatWeThinkThisIs: string;
  whatItSays: string;
  whatItClaims: string;
  whatItWantsYouToDo: string;
  whatWeFound: string[];
  whatConcernsUs: string[];
  canWeVerifyIt: string;
  recommendedAction: string;
}

export interface PrivacyFinding {
  id: string;
  category:
    | 'email'
    | 'phone'
    | 'ip'
    | 'card'
    | 'ssn'
    | 'address'
    | 'order_id'
    | 'account_number'
    | 'gps'
    | 'crypto'
    | 'auth_token';
  label: string;
  value: string;
  snippet?: string;
  confidence: 'high' | 'medium' | 'low';
  severity: 'low' | 'medium' | 'high';
  bbox?: BoundingBox;
}

export interface LinkFinding {
  url: string;
  protocol: string;
  hostname: string;
  issues: string[];
  riskLevel: 'low' | 'medium' | 'high';
  isPunycode: boolean;
  isIpAddress: boolean;
  isShortener: boolean;
  isHttp: boolean;
}

export interface MetadataTag {
  group: string;
  tag: string;
  description: string;
  value: string;
}

export interface MetadataInfo {
  hasExif: boolean;
  tags: MetadataTag[];
  gps?: { lat: number; lng: number; altitude?: string };
  camera?: { make?: string; model?: string; lens?: string };
  software?: string;
  dateTime?: string;
  originalBlobSize: number;
}

export interface ForensicsInfo {
  elaDataUrl?: string;
  anomaliesDetected: boolean;
  compressionInconsistency: string;
  noiseVarianceScore: number;
  cloneRegionsFound: boolean;
  notes: string[];
}

export interface ImageInfo {
  name: string;
  sizeBytes: number;
  width: number;
  height: number;
  aspectRatio: string;
  mimeType: string;
  colorDepth?: string;
  orientation?: number;
  isScreenshotDimensions?: boolean;
}

export interface OCRWord {
  text: string;
  confidence?: number;
  bbox?: { x0: number; y0: number; x1: number; y1: number };
}

export interface OCRLine {
  text: string;
  bbox?: { x0: number; y0: number; x1: number; y1: number };
}

export interface OCRResult {
  text: string;
  confidence: number;
  words: OCRWord[];
  lines: string[];
}

// --------------------------------------------------------------------------
// UNIFIED INTELLIGENCE RESULT (Canonical Contract)
// --------------------------------------------------------------------------

export interface UnifiedIntelligenceResult {
  id: string;
  timestamp: number;
  imageInfo: ImageInfo;
  overallStatus: OverallStatus;
  overallSummary: string;
  classification: HierarchicalClassification;
  visualFingerprint: VisualFingerprint;
  entities: StructuredEntity[];
  claims: SemanticClaim[];
  requestedActions: RequestedAction[];
  relationships: RelationshipGraph;
  consistency: ConsistencyAudit;
  financial: FinancialIntelligence;
  channel: ChannelIntelligence;
  forensics: ForensicsInfo;
  riskPatterns: ExplainableRiskPattern[];
  authenticity: AuthenticityAssessment;
  recommendations: string[];
  limitations: string[];
  humanReadable: HumanReadableReport;
  // Legacy / Direct access properties
  privacy: {
    score: number;
    findings: PrivacyFinding[];
    totalItems: number;
  };
  links: {
    totalUrls: number;
    findings: LinkFinding[];
  };
  metadata: MetadataInfo;
  ocr: OCRResult;
  dataUrl: string;
}

export type AnalysisResult = UnifiedIntelligenceResult;
