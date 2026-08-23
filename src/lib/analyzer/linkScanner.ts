import type { LinkFinding } from './types';

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
]);

const SUSPICIOUS_KEYWORDS = [
  'verify',
  'security',
  'login',
  'signin',
  'account',
  'update',
  'support',
  'banking',
  'portal',
  'recover',
  'wallet',
  'auth',
];

export function scanLinks(text: string): { findings: LinkFinding[]; totalUrls: number } {
  const urlRegex = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;
  const findings: LinkFinding[] = [];
  const seenUrls = new Set<string>();

  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    let rawUrl = match[0].replace(/[.,;:!?)]+$/, '');
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      rawUrl = `https://${rawUrl}`;
    }

    if (seenUrls.has(rawUrl.toLowerCase())) continue;
    seenUrls.add(rawUrl.toLowerCase());

    try {
      const parsed = new URL(rawUrl);
      const hostname = parsed.hostname.toLowerCase();
      const issues: string[] = [];
      let riskLevel: LinkFinding['riskLevel'] = 'low';

      const isHttp = parsed.protocol === 'http:';
      const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
      const isPunycode = hostname.includes('xn--');
      const isShortener = KNOWN_SHORTENERS.has(hostname);

      if (isHttp) {
        issues.push('Unencrypted HTTP connection (data sent in plain text)');
        riskLevel = 'medium';
      }

      if (isIpAddress) {
        issues.push('Direct IP address hostname (bypasses domain name registration)');
        riskLevel = 'high';
      }

      if (isPunycode) {
        issues.push('Punycode / IDN character encoding (possible lookalike character spoofing)');
        riskLevel = 'high';
      }

      if (isShortener) {
        issues.push('URL shortener service hides final destination URL');
        riskLevel = 'medium';
      }

      // Check excessive subdomains
      const parts = hostname.split('.');
      if (parts.length > 3) {
        issues.push(`Complex subdomain nesting (${parts.length} levels)`);
        if (riskLevel === 'low') riskLevel = 'medium';
      }

      // Check keywords combined with non-official domains
      const hasSuspiciousKeyword = SUSPICIOUS_KEYWORDS.some((kw) => hostname.includes(kw));
      if (hasSuspiciousKeyword && parts.length >= 3) {
        issues.push('Contains sensitive auth keywords in subdomains (deserves review)');
        riskLevel = 'high';
      }

      if (issues.length === 0) {
        issues.push('Standard HTTPS URL structure (destination deserves standard vigilance)');
      }

      findings.push({
        url: rawUrl,
        protocol: parsed.protocol.replace(':', ''),
        hostname,
        issues,
        riskLevel,
        isPunycode,
        isIpAddress,
        isShortener,
        isHttp,
      });
    } catch {
      // Invalid URL format
    }
  }

  return {
    findings,
    totalUrls: findings.length,
  };
}
