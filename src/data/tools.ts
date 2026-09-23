export type ToolCategory =
  | 'AI & Intelligence'
  | 'Screenshot & Security'
  | 'Privacy & Protection'
  | 'OCR & Text'
  | 'Image Forensics'
  | 'Metadata'
  | 'Image Editing'
  | 'Image Comparison'
  | 'Utilities';

export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  category: ToolCategory;
  description: string;
  route: string;
  badge?: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  keywords: string[];
  aliases: string[];
  workspaceType:
    | 'intelligence'
    | 'ocr'
    | 'redactor'
    | 'metadata'
    | 'forensics'
    | 'ai_detector'
    | 'comparison'
    | 'utility';
  icon: string;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  'AI & Intelligence',
  'Screenshot & Security',
  'Privacy & Protection',
  'OCR & Text',
  'Image Forensics',
  'Metadata',
  'Image Editing',
  'Image Comparison',
  'Utilities',
];

export const TOOLS_REGISTRY: ToolDefinition[] = [
  // 1. AI & Intelligence
  {
    id: 'screenshot-intelligence',
    name: 'Screenshot Intelligence',
    slug: 'screenshot-intelligence',
    category: 'AI & Intelligence',
    description: 'Understand what a screenshot communicates, claims, and potentially requests.',
    route: '/',
    badge: 'Flagship',
    isFeatured: true,
    isPopular: true,
    keywords: ['understand', 'meaning', 'investigator', 'claim', 'action', 'context', 'reasoning'],
    aliases: ['analyze screenshot', 'screenshot meaning', 'ai investigator', 'checker'],
    workspaceType: 'intelligence',
    icon: 'sparkles',
  },
  {
    id: 'ai-image-detector',
    name: 'AI Image Detector',
    slug: 'ai-image-detector',
    category: 'AI & Intelligence',
    description: 'Inspect images for synthetic artifacts, generative styles, and digital generation signals.',
    route: '/ai-image-detector',
    badge: 'Vision',
    isPopular: true,
    keywords: ['ai', 'synthetic', 'midjourney', 'dall-e', 'stable diffusion', 'deepfake', 'generated'],
    aliases: ['ai detector', 'synthetic image', 'is this ai', 'ai picture checker', 'fake art'],
    workspaceType: 'ai_detector',
    icon: 'cpu',
  },

  {
    id: 'screenshot-detector', name: 'Screenshot Detector', slug: 'screenshot-detector',
    category: 'Screenshot & Security',
    description: 'Inspect screenshot-versus-photo clues with explicit evidence and inconclusive results.',
    route: '/screenshot-detector', workspaceType: 'utility', icon: 'shield-check',
    keywords: ['screenshot detector', 'screenshot scanner', 'photo', 'capture', 'source'],
    aliases: ['how to tell if a photo is a screenshot', 'detect screenshot', 'screenshot identifier'],
  },
  // 2. Screenshot & Security
  {
    id: 'screenshot-checker',
    name: 'Screenshot Checker',
    slug: 'screenshot-checker',
    category: 'Screenshot & Security',
    description: 'Primary investigation console for inspecting visual communications and transactional alerts.',
    route: '/screenshot-analyzer',
    isPopular: true,
    keywords: ['checker', 'security', 'threats', 'scam', 'investigate', 'fraud'],
    aliases: ['check screenshot', 'security scanner', 'screenshot safety'],
    workspaceType: 'intelligence',
    icon: 'shield-check',
  },
  {
    id: 'payment-screenshot-checker',
    name: 'Payment Screenshot Checker',
    slug: 'payment-screenshot-checker',
    category: 'Screenshot & Security',
    description: 'Audit digital payment slips, UPI transactions, and bank receipts for internal amount and status consistency.',
    route: '/payment-screenshot-checker',
    badge: 'Audit',
    isPopular: true,
    keywords: ['payment', 'upi', 'gpay', 'paytm', 'phonepe', 'bank', 'transfer', 'receipt', 'fake payment'],
    aliases: ['check payment', 'fake upi receipt', 'bank slip check', 'payment verification'],
    workspaceType: 'intelligence',
    icon: 'banknotes',
  },
  {
    id: 'scam-screenshot-analyzer',
    name: 'Scam Screenshot Analyzer',
    slug: 'screenshot-scam-checker',
    category: 'Screenshot & Security',
    description: 'Identify urgent social engineering, advance-fee lottery scams, and impersonation threats.',
    route: '/screenshot-scam-checker',
    keywords: ['scam', 'fraud', 'lottery', 'phishing', 'advance fee', 'social engineering'],
    aliases: ['is this a scam', 'scam check', 'fraud detector'],
    workspaceType: 'intelligence',
    icon: 'exclamation-triangle',
  },
  {
    id: 'suspicious-link-checker',
    name: 'Suspicious Link Checker',
    slug: 'suspicious-link-checker',
    category: 'Screenshot & Security',
    description: 'Extract and analyze visible web links, IP addresses, and shortened URLs embedded in images.',
    route: '/suspicious-link-checker',
    keywords: ['url', 'links', 'bit.ly', 'phishing link', 'shortener', 'ip address', 'smishing'],
    aliases: ['check link in screenshot', 'url safety', 'malicious link'],
    workspaceType: 'intelligence',
    icon: 'link',
  },

  // 3. Privacy & Protection
  {
    id: 'screenshot-redactor',
    name: 'Screenshot Redactor',
    slug: 'screenshot-redactor',
    category: 'Privacy & Protection',
    description: 'Interactive editor to blur, pixelate, blackout, or highlight sensitive text and numbers before sharing.',
    route: '/screenshot-redactor',
    badge: 'Editor',
    isPopular: true,
    keywords: ['redact', 'blur', 'pixelate', 'blackout', 'hide phone number', 'hide email', 'mask', 'censor'],
    aliases: ['hide sensitive info', 'hide text', 'blur screenshot', 'censor image', 'mask card'],
    workspaceType: 'redactor',
    icon: 'eye-slash',
  },
  {
    id: 'privacy-scanner',
    name: 'Privacy Scanner',
    slug: 'screenshot-privacy-checker',
    category: 'Privacy & Protection',
    description: 'Scan screenshots for exposed phone numbers, emails, payment cards, SSNs, and residential addresses.',
    route: '/screenshot-privacy-checker',
    keywords: ['pii', 'privacy', 'credit card', 'ssn', 'personal data', 'leak', 'gdpr'],
    aliases: ['check privacy', 'pii leak', 'sensitive data scan'],
    workspaceType: 'redactor',
    icon: 'lock-closed',
  },
  {
    id: 'metadata-remover',
    name: 'Metadata Remover',
    slug: 'image-metadata-remover',
    category: 'Privacy & Protection',
    description: 'Strip GPS coordinates, device serials, camera tags, and timestamps from images.',
    route: '/image-metadata-remover',
    keywords: ['strip metadata', 'clean exif', 'remove gps', 'remove camera data', 'privacy clean'],
    aliases: ['remove gps from photo', 'strip exif', 'clean photo', 'remove location'],
    workspaceType: 'metadata',
    icon: 'trash',
  },

  // 4. OCR & Text
  {
    id: 'screenshot-ocr',
    name: 'Screenshot OCR',
    slug: 'screenshot-ocr',
    category: 'OCR & Text',
    description: 'Extract searchable, editable text and character counts directly inside your browser.',
    route: '/screenshot-ocr',
    badge: 'Text',
    isPopular: true,
    keywords: ['ocr', 'text extraction', 'copy text from image', 'read screenshot', 'transcribe', 'extract text'],
    aliases: ['extract text', 'copy text from photo', 'image to text', 'text grabber'],
    workspaceType: 'ocr',
    icon: 'document-text',
  },

  // 5. Image Forensics
  {
    id: 'image-forensics',
    name: 'Image Forensics',
    slug: 'image-manipulation-checker',
    category: 'Image Forensics',
    description: 'Perform Error Level Analysis (ELA), regional noise inspection, and compression anomaly checks.',
    route: '/image-manipulation-checker',
    badge: 'Forensics',
    isPopular: true,
    keywords: ['forensics', 'ela', 'error level analysis', 'tampered', 'photoshop', 'edited', 'manipulation'],
    aliases: ['fake image', 'edited screenshot', 'tamper check', 'photoshop check'],
    workspaceType: 'forensics',
    icon: 'magnifying-glass',
  },

  // 6. Metadata
  {
    id: 'exif-viewer',
    name: 'EXIF & Metadata Inspector',
    slug: 'screenshot-metadata-checker',
    category: 'Metadata',
    description: 'Inspect full camera hardware, lens details, GPS location tags, software history, and timestamps.',
    route: '/screenshot-metadata-checker',
    keywords: ['exif', 'metadata', 'camera', 'gps', 'iso', 'focal length', 'shutter speed', 'device info'],
    aliases: ['view exif', 'photo info', 'camera data', 'see gps coordinates'],
    workspaceType: 'metadata',
    icon: 'information-circle',
  },

  // 7. Image Comparison
  {
    id: 'screenshot-comparison',
    name: 'Image Comparison',
    slug: 'screenshot-comparison',
    category: 'Image Comparison',
    description: 'Compare two screenshots with Side-by-Side, interactive swipe slider, overlay, and difference heatmaps.',
    route: '/screenshot-comparison',
    badge: 'Diff',
    keywords: ['compare', 'diff', 'visual diff', 'slider', 'side by side', 'overlay', 'changes'],
    aliases: ['compare screenshots', 'image diff', 'find differences in images'],
    workspaceType: 'comparison',
    icon: 'square-2-stack',
  },
];
