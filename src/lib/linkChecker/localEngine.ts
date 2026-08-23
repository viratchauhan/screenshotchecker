import type { SecuritySignal, UrlComponents, BrandImpersonationFinding } from './types';
import { detectBrandImpersonation } from './brandAllowlist';

const KNOWN_SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'ow.ly',
  'is.gd',
  'buff.ly',
  'rb.gy',
  'cutt.ly',
  'shorturl.at',
  'clck.ru',
  'v.gd',
  'rebrand.ly',
  'shorte.st',
  'bc.vc',
  'adf.ly',
  'lnkd.in',
  's.id',
  'trib.al',
]);

const SENSITIVE_KEYWORDS = [
  'login',
  'verify',
  'verification',
  'secure',
  'security',
  'account',
  'update',
  'signin',
  'sign-in',
  'wallet',
  'payment',
  'invoice',
  'refund',
  'reward',
  'prize',
  'kyc',
  'rekyc',
  'bank',
  'support',
  'confirm',
  'password',
  'credential',
  'auth',
  'authenticate',
  'unlock',
  'suspend',
  'suspended',
  'appeal',
  'billing',
  'claim',
];

const MALWARE_EXTENSIONS = [
  '.apk',
  '.exe',
  '.scr',
  '.zip',
  '.rar',
  '.js',
  '.bat',
  '.vbs',
  '.iso',
  '.dmg',
  '.hta',
  '.ps1',
  '.cmd',
];

export interface LocalAnalysisResult {
  signals: SecuritySignal[];
  impersonation: BrandImpersonationFinding;
  isShortened: boolean;
}

/**
 * Executes comprehensive local heuristic analysis on normalized URL components without external API dependencies.
 */
export function analyzeUrlLocally(components: UrlComponents): LocalAnalysisResult {
  const signals: SecuritySignal[] = [];

  // =========================================================================
  // 1. BRAND IMPERSONATION ANALYSIS (High / Critical)
  // =========================================================================
  const impersonation = detectBrandImpersonation(
    components.hostname,
    components.registrableDomain,
    components.pathname
  );

  if (impersonation.detected && impersonation.claimedBrand) {
    signals.push({
      id: 'brand_impersonation',
      title: `Brand Impersonation Detected (${impersonation.claimedBrand})`,
      description:
        impersonation.details ||
        `The URL appears to claim association with ${impersonation.claimedBrand}, but points to the unrelated destination domain "${components.registrableDomain}".`,
      severity: impersonation.severity || 'critical',
      category: 'brand_impersonation',
      weight: impersonation.severity === 'critical' ? 45 : 35,
      evidence: `Claimed brand: ${impersonation.claimedBrand} | Actual domain: ${components.registrableDomain}`,
    });
  }

  // =========================================================================
  // 2. USERINFO / @ ATTACK DETECTION (Critical)
  // =========================================================================
  const rawOriginal = components.originalUrl;
  const hasAtSymbol = rawOriginal.includes('@');
  if (components.username || components.password || (hasAtSymbol && !components.pathname.includes('@'))) {
    signals.push({
      id: 'userinfo_at_spoofing',
      title: 'Deceptive URL Authority (@ Spoofing)',
      description:
        'The URL contains an "@" symbol in the authority component. Browsers ignore everything before "@" as username/password credentials, tricking users into seeing a trusted brand while sending traffic to a completely different host.',
      severity: 'critical',
      category: 'obfuscation',
      weight: 40,
      evidence: `Actual destination host: ${components.hostname}`,
    });
  }

  // =========================================================================
  // 3. RAW IP ADDRESS HOSTNAME (High)
  // =========================================================================
  if (components.isIpAddress) {
    signals.push({
      id: 'raw_ip_hostname',
      title: 'Direct IP Address Hostname',
      description:
        'The URL uses a raw numeric IP address instead of a registered domain name. Legitimate consumer and banking services use branded domain names; raw IP hosts frequently host temporary phishing or malware infrastructure.',
      severity: 'high',
      category: 'structure',
      weight: 20,
      evidence: `IP address: ${components.hostname}`,
    });
  }

  // =========================================================================
  // 4. PUNYCODE & HOMOGLYPH LOOKALIKES (High / Medium)
  // =========================================================================
  if (components.isPunycode) {
    signals.push({
      id: 'punycode_domain',
      title: 'Punycode / IDN Encoded Domain (xn--)',
      description:
        'The domain uses Internationalized Domain Name (Punycode) encoding. While legitimate for international scripts, attackers frequently use visually identical Greek or Cyrillic homoglyphs to impersonate official brand spellings.',
      severity: 'high',
      category: 'obfuscation',
      weight: 20,
      evidence: `Encoded: ${components.hostname} | Decoded: ${components.decodedHostname}`,
    });
  }

  // =========================================================================
  // 5. URL SHORTENER DETECTION (Medium / Info)
  // =========================================================================
  const isShortened = KNOWN_SHORTENERS.has(components.hostname);
  if (isShortened) {
    signals.push({
      id: 'url_shortener',
      title: 'Destination Hidden by URL Shortener',
      description:
        'The link uses a generic URL shortening redirect service. The final destination domain is masked and cannot be evaluated purely from the surface link.',
      severity: 'medium',
      category: 'redirect',
      weight: 10,
      evidence: `Shortener provider: ${components.hostname}`,
    });
  }

  // =========================================================================
  // 6. CREDENTIAL HARVESTING & SENSITIVE KEYWORD COMBINATIONS (High / Medium)
  // =========================================================================
  const fullPathAndSearch = `${components.pathname}${components.search}`.toLowerCase();
  const matchedKeywords = SENSITIVE_KEYWORDS.filter(
    (kw) =>
      fullPathAndSearch.includes(kw) ||
      components.subdomain.toLowerCase().includes(kw)
  );

  if (matchedKeywords.length >= 2 || (matchedKeywords.length >= 1 && (impersonation.detected || components.isIpAddress))) {
    const isHighRisk = impersonation.detected || components.isIpAddress || matchedKeywords.some(k => k === 'kyc' || k === 'password' || k === 'otp' || k === 'bank');
    signals.push({
      id: 'credential_harvesting_path',
      title: 'Sensitive Authentication & Credential Path',
      description:
        'The URL path/subdomains request urgent actions or credential verification (e.g. login, KYC update, password reset, unlock, payment).',
      severity: isHighRisk ? 'high' : 'medium',
      category: 'credential_harvesting',
      weight: isHighRisk ? 25 : 15,
      evidence: `Matched sensitive terms: [${matchedKeywords.join(', ')}]`,
    });
  }

  // =========================================================================
  // 7. SUSPICIOUS DOWNLOAD OR MALWARE EXTENSION (High)
  // =========================================================================
  const matchedExt = MALWARE_EXTENSIONS.find((ext) =>
    components.pathname.toLowerCase().endsWith(ext)
  );
  if (matchedExt) {
    signals.push({
      id: 'suspicious_executable_extension',
      title: `Direct Executable / Package Download (${matchedExt})`,
      description:
        `The URL directly references an executable or installation file (${matchedExt}). Malicious messages often disguise mobile malware or trojans as updates or verification documents.`,
      severity: 'high',
      category: 'malware_download',
      weight: 30,
      evidence: `File extension: ${matchedExt}`,
    });
  }

  // =========================================================================
  // 8. OBFUSCATED / DOUBLE PERCENT ENCODING (Medium)
  // =========================================================================
  if (rawOriginal.includes('%25') || (rawOriginal.match(/%[0-9a-fA-F]{2}/g) || []).length > 8) {
    signals.push({
      id: 'excessive_url_encoding',
      title: 'Unusual / Double URL Percent-Encoding',
      description:
        'The link contains excessive or double-encoded characters (%25, %2F), which can be used to bypass web application firewalls and security inspection filters.',
      severity: 'medium',
      category: 'obfuscation',
      weight: 15,
      evidence: 'Detected repeated percent escape sequences in URL structure.',
    });
  }

  // =========================================================================
  // 9. OPEN REDIRECT / PARAMETER BOUNCING (Medium)
  // =========================================================================
  const REDIRECT_PARAMS = ['redirect', 'url', 'next', 'target', 'return', 'destination', 'continue', 'r', 'out'];
  let detectedRedirectParam = '';
  for (const p of REDIRECT_PARAMS) {
    const val = components.search.toLowerCase();
    if (val.includes(`${p}=http://`) || val.includes(`${p}=https://`)) {
      detectedRedirectParam = p;
      break;
    }
  }

  if (detectedRedirectParam) {
    signals.push({
      id: 'open_redirect_parameter',
      title: `Embedded Off-Domain Redirect Parameter (${detectedRedirectParam}=)`,
      description:
        'The query parameters contain a secondary external URL destination, often exploited in open-redirect phishing attacks to route victims through trusted domains.',
      severity: 'medium',
      category: 'redirect',
      weight: 15,
      evidence: `Redirect parameter: "${detectedRedirectParam}"`,
    });
  }

  // =========================================================================
  // 10. UNENCRYPTED PLAINTEXT HTTP (Low / Info)
  // =========================================================================
  if (components.protocol === 'http') {
    signals.push({
      id: 'unencrypted_http',
      title: 'Unencrypted Plaintext HTTP Connection',
      description:
        'The URL uses unencrypted HTTP rather than modern HTTPS (TLS/SSL). Any data sent across this connection is susceptible to interception and eavesdropping.',
      severity: 'medium',
      category: 'protocol',
      weight: 10,
      evidence: 'Protocol: http://',
    });
  }

  // =========================================================================
  // 11. UNUSUALLY LONG HOSTNAME (Low / Info)
  // =========================================================================
  if (components.hostname.length > 50) {
    signals.push({
      id: 'excessive_hostname_length',
      title: 'Unusually Long Hostname',
      description:
        'The hostname is unusually lengthy, which can be an indicator of dynamically generated phishing infrastructure or domain fronting.',
      severity: 'low',
      category: 'structure',
      weight: 5,
      evidence: `Length: ${components.hostname.length} characters`,
    });
  }

  return {
    signals,
    impersonation,
    isShortened,
  };
}
