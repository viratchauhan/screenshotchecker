export interface BrandDefinition {
  id: string;
  name: string;
  category: 'banking' | 'fintech' | 'tech' | 'logistics' | 'government' | 'entertainment' | 'telecom';
  officialDomains: string[];
  patterns: RegExp[];
}

export const VERIFIED_BRANDS: BrandDefinition[] = [
  // =========================================================================
  // 1. BANKING & FINTECH
  // =========================================================================
  {
    id: 'sbi',
    name: 'State Bank of India (SBI)',
    category: 'banking',
    officialDomains: ['sbi.co.in', 'onlinesbi.sbi', 'statebankofindia.com', 'onlinesbi.com'],
    patterns: [/\bsbi\b/i, /onlinesbi/i, /statebank/i],
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    category: 'banking',
    officialDomains: ['hdfcbank.com', 'hdfc.com', 'hdfcbank.net'],
    patterns: [/\bhdfc\b/i, /hdfcbank/i],
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    category: 'banking',
    officialDomains: ['icicibank.com', 'icicidirect.com', 'icicibank.co.in'],
    patterns: [/\bicici\b/i, /icicibank/i],
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    category: 'banking',
    officialDomains: ['axisbank.com', 'axisbank.co.in'],
    patterns: [/\baxisbank\b/i, /axis-bank/i],
  },
  {
    id: 'paypal',
    name: 'PayPal',
    category: 'fintech',
    officialDomains: ['paypal.com', 'paypal.me', 'paypal-community.com'],
    patterns: [/paypal/i, /pay-pal/i, /pypl/i],
  },
  {
    id: 'chase',
    name: 'Chase Bank (JPMorgan)',
    category: 'banking',
    officialDomains: ['chase.com', 'jpmorganchase.com', 'jpmorgan.com'],
    patterns: [/\bchase\b/i, /chasebank/i, /jpmorgan/i],
  },
  {
    id: 'wellsfargo',
    name: 'Wells Fargo',
    category: 'banking',
    officialDomains: ['wellsfargo.com'],
    patterns: [/wellsfargo/i, /wells-fargo/i],
  },
  {
    id: 'bankofamerica',
    name: 'Bank of America',
    category: 'banking',
    officialDomains: ['bankofamerica.com', 'bofa.com'],
    patterns: [/bankofamerica/i, /\bbofa\b/i],
  },
  {
    id: 'paytm',
    name: 'Paytm',
    category: 'fintech',
    officialDomains: ['paytm.com', 'paytmbank.com'],
    patterns: [/paytm/i],
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    category: 'fintech',
    officialDomains: ['phonepe.com'],
    patterns: [/phonepe/i],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'fintech',
    officialDomains: ['stripe.com'],
    patterns: [/\bstripe\b/i],
  },

  // =========================================================================
  // 2. TECH, SOCIAL & CLOUD
  // =========================================================================
  {
    id: 'google',
    name: 'Google / Gmail',
    category: 'tech',
    officialDomains: [
      'google.com',
      'google.co.in',
      'google.co.uk',
      'gmail.com',
      'youtube.com',
      'youtu.be',
      'goo.gl',
      'googleusercontent.com',
      'googleapis.com',
    ],
    patterns: [/google/i, /gmail/i, /gsuite/i],
  },
  {
    id: 'microsoft',
    name: 'Microsoft / Outlook / Office',
    category: 'tech',
    officialDomains: [
      'microsoft.com',
      'live.com',
      'office.com',
      'outlook.com',
      'office365.com',
      'sharepoint.com',
      'azure.com',
      'msn.com',
      'bing.com',
      'windows.com',
    ],
    patterns: [/microsoft/i, /outlook/i, /office365/i, /onedrive/i, /sharepoint/i, /azure/i],
  },
  {
    id: 'apple',
    name: 'Apple / iCloud',
    category: 'tech',
    officialDomains: ['apple.com', 'icloud.com', 'appleid.apple.com', 'me.com'],
    patterns: [/\bapple\b/i, /icloud/i, /appleid/i, /itunes/i],
  },
  {
    id: 'amazon',
    name: 'Amazon / AWS',
    category: 'tech',
    officialDomains: [
      'amazon.com',
      'amazon.in',
      'amazon.co.uk',
      'amazon.de',
      'amazon.ca',
      'amazon.fr',
      'amazon.co.jp',
      'amazon.es',
      'amazon.it',
      'amzn.to',
      'aws.amazon.com',
    ],
    patterns: [/amazon/i, /\bamzn\b/i, /primevideo/i],
  },
  {
    id: 'meta',
    name: 'Meta / Facebook / Instagram / WhatsApp',
    category: 'tech',
    officialDomains: [
      'facebook.com',
      'meta.com',
      'fb.com',
      'instagram.com',
      'whatsapp.com',
      'messenger.com',
      'fb.me',
    ],
    patterns: [/facebook/i, /instagram/i, /whatsapp/i, /messenger/i],
  },
  {
    id: 'telegram',
    name: 'Telegram',
    category: 'tech',
    officialDomains: ['telegram.org', 't.me', 'telegram.me'],
    patterns: [/telegram/i],
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'entertainment',
    officialDomains: ['netflix.com'],
    patterns: [/netflix/i],
  },

  // =========================================================================
  // 3. LOGISTICS, COURIER & SHIPPING
  // =========================================================================
  {
    id: 'dhl',
    name: 'DHL Express',
    category: 'logistics',
    officialDomains: ['dhl.com', 'dhl.de', 'dhl-express.com', 'mydhl.express.dhl'],
    patterns: [/\bdhl\b/i, /dhl-express/i, /dhlexpress/i],
  },
  {
    id: 'fedex',
    name: 'FedEx',
    category: 'logistics',
    officialDomains: ['fedex.com'],
    patterns: [/fedex/i],
  },
  {
    id: 'ups',
    name: 'UPS (United Parcel Service)',
    category: 'logistics',
    officialDomains: ['ups.com'],
    patterns: [/\bups\b/i, /ups-tracking/i],
  },
  {
    id: 'usps',
    name: 'USPS (United States Postal Service)',
    category: 'logistics',
    officialDomains: ['usps.com'],
    patterns: [/\busps\b/i, /us-postal/i],
  },
  {
    id: 'indiapost',
    name: 'India Post',
    category: 'logistics',
    officialDomains: ['indiapost.gov.in', 'indiapostgdsonline.gov.in'],
    patterns: [/indiapost/i, /india-post/i],
  },

  // =========================================================================
  // 4. GOVERNMENT & TAX
  // =========================================================================
  {
    id: 'irs',
    name: 'IRS (Internal Revenue Service)',
    category: 'government',
    officialDomains: ['irs.gov'],
    patterns: [/\birs\b/i, /internal-revenue/i],
  },
  {
    id: 'incometax',
    name: 'Income Tax Department (India)',
    category: 'government',
    officialDomains: ['incometax.gov.in', 'incometaxindiaefiling.gov.in'],
    patterns: [/incometax/i, /income-tax/i],
  },
  {
    id: 'govuk',
    name: 'GOV.UK',
    category: 'government',
    officialDomains: ['gov.uk'],
    patterns: [/govuk/i, /gov-uk/i],
  },
];

/**
 * Checks if a domain is a legitimate match for an official domain.
 * Supports exact domain or legitimate subdomains (e.g., accounts.google.com matches google.com).
 */
export function isOfficialDomainMatch(domain: string, officialDomains: string[]): boolean {
  const cleanDomain = domain.toLowerCase().trim();
  return officialDomains.some((official) => {
    const cleanOfficial = official.toLowerCase().trim();
    if (cleanDomain === cleanOfficial) return true;
    if (cleanDomain.endsWith(`.${cleanOfficial}`)) return true;
    return false;
  });
}

/**
 * Inspects a given URL hostname and path for brand impersonation signals.
 */
export function detectBrandImpersonation(
  hostname: string,
  registrableDomain: string,
  pathname: string = ''
): {
  detected: boolean;
  claimedBrand?: string;
  officialDomains?: string[];
  actualDomain?: string;
  severity?: 'high' | 'critical';
  details?: string;
} {
  const cleanHost = hostname.toLowerCase();
  const cleanPath = pathname.toLowerCase();
  const cleanDomain = registrableDomain.toLowerCase();

  // Strip port if present
  const hostWithoutPort = cleanHost.split(':')[0];

  for (const brand of VERIFIED_BRANDS) {
    // Check if the current domain is already legitimate
    if (isOfficialDomainMatch(hostWithoutPort, brand.officialDomains)) {
      continue;
    }

    // Check if brand keywords or patterns appear in hostname, subdomain, or sensitive path
    const hostMatched = brand.patterns.some((p) => p.test(hostWithoutPort));
    const pathMatched =
      brand.patterns.some((p) => p.test(cleanPath)) &&
      (cleanPath.includes('login') ||
        cleanPath.includes('verify') ||
        cleanPath.includes('account') ||
        cleanPath.includes('password') ||
        cleanPath.includes('kyc') ||
        cleanPath.includes('update') ||
        cleanPath.includes('signin') ||
        cleanPath.includes('banking'));

    if (hostMatched || pathMatched) {
      // Impersonation detected!
      const severity: 'high' | 'critical' =
        brand.category === 'banking' || brand.category === 'fintech' ? 'critical' : 'high';

      const details = hostMatched
        ? `The hostname "${hostWithoutPort}" contains brand references to "${brand.name}", but the registered destination domain is "${cleanDomain}", which is NOT an official domain (${brand.officialDomains.join(', ')}).`
        : `The URL path references "${brand.name}" authentication endpoints on an unauthorized domain ("${cleanDomain}").`;

      return {
        detected: true,
        claimedBrand: brand.name,
        officialDomains: brand.officialDomains,
        actualDomain: cleanDomain,
        severity,
        details,
      };
    }
  }

  return { detected: false };
}
