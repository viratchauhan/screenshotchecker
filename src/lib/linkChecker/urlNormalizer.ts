import type { UrlComponents } from './types';

// Multi-part Public Suffix list for accurate registrable domain determination
const TWO_PART_TLDS = new Set([
  'co.uk',
  'co.in',
  'org.uk',
  'gov.uk',
  'ac.uk',
  'net.in',
  'org.in',
  'gov.in',
  'ac.in',
  'res.in',
  'com.au',
  'net.au',
  'org.au',
  'edu.au',
  'gov.au',
  'co.nz',
  'net.nz',
  'org.nz',
  'co.jp',
  'ne.jp',
  'or.jp',
  'co.za',
  'org.za',
  'com.br',
  'org.br',
  'net.br',
  'com.mx',
  'org.mx',
  'com.sg',
  'edu.sg',
  'gov.sg',
  'com.ph',
  'gov.ph',
  'com.pk',
  'com.bd',
  'co.id',
  'web.id',
  'co.ke',
  'co.ng',
  'gov.ng',
  'state.gov',
]);

/**
 * Strips wrapping quotes, angle brackets, markdown symbols, and whitespace commonly found in copied SMS/WhatsApp text.
 */
export function sanitizeRawInput(raw: string): string {
  let cleaned = raw.trim();
  // Strip enclosing quotes or brackets: <url>, (url), [url], "url", 'url'
  cleaned = cleaned.replace(/^["'<(\[]+/, '').replace(/[>"')\].,;:]+$/, '');
  return cleaned.trim();
}

/**
 * Derives the registrable domain and subdomain from a hostname.
 */
export function extractDomainParts(hostname: string): {
  registrableDomain: string;
  subdomain: string;
  topLevelDomain: string;
} {
  const host = hostname.toLowerCase();

  // If host is an IP address
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host) || host.includes(':')) {
    return {
      registrableDomain: host,
      subdomain: '',
      topLevelDomain: '',
    };
  }

  const parts = host.split('.');
  if (parts.length <= 1) {
    return { registrableDomain: host, subdomain: '', topLevelDomain: '' };
  }

  const lastTwo = parts.slice(-2).join('.');
  const lastThree = parts.slice(-3).join('.');

  if (parts.length >= 3 && TWO_PART_TLDS.has(lastTwo)) {
    const regDomain = parts.slice(-3).join('.');
    const sub = parts.slice(0, -3).join('.');
    return {
      registrableDomain: regDomain,
      subdomain: sub,
      topLevelDomain: lastTwo,
    };
  }

  const regDomain = parts.slice(-2).join('.');
  const sub = parts.slice(0, -2).join('.');
  const tld = parts[parts.length - 1];

  return {
    registrableDomain: regDomain,
    subdomain: sub,
    topLevelDomain: tld,
  };
}

/**
 * Decodes Punycode (xn--) domain labels into their Unicode representation.
 */
export function decodePunycodeHostname(hostname: string): {
  decoded: string;
  isPunycode: boolean;
  hasHomoglyphs: boolean;
} {
  const isPunycode = hostname.toLowerCase().includes('xn--');
  let decoded = hostname;

  if (isPunycode) {
    try {
      // In modern browsers and Node 18+, URL parser supports idn or we can use native URL decoding
      const tempUrl = new URL(`https://${hostname}`);
      // Hostname in decoded form
      decoded = tempUrl.hostname;
    } catch {
      decoded = hostname;
    }
  }

  // Check for suspicious mixed scripts / homoglyphs (Cyrillic lookalikes to Latin)
  const CYRILLIC_LOOKALIKES = /[а-яА-Я\u0400-\u04FF]/;
  const hasHomoglyphs = CYRILLIC_LOOKALIKES.test(decoded);

  return {
    decoded,
    isPunycode,
    hasHomoglyphs,
  };
}

/**
 * Fully normalizes and extracts structured components from a user-supplied URL.
 */
export function normalizeUrlComponents(rawInput: string): UrlComponents {
  const sanitized = sanitizeRawInput(rawInput);
  if (!sanitized) {
    throw new Error('Please enter a URL to check.');
  }

  // Check for dangerous / unsupported schemes before parsing
  const FORBIDDEN_PROTOCOLS = /^(javascript|data|file|vbscript|blob|about|filesystem|gopher|ldap):/i;
  if (FORBIDDEN_PROTOCOLS.test(sanitized)) {
    throw new Error('Unsupported or dangerous protocol. Only standard HTTP and HTTPS web links are supported.');
  }

  // Ensure protocol
  let urlWithProtocol = sanitized;
  if (!/^https?:\/\//i.test(urlWithProtocol)) {
    // If user provided raw domain e.g. "example.com/path"
    urlWithProtocol = `https://${urlWithProtocol}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(urlWithProtocol);
  } catch (err) {
    throw new Error(`Invalid URL format: Unable to parse "${sanitized}".`);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Unsupported protocol "${parsed.protocol}". Only HTTP and HTTPS are permitted.`);
  }

  const rawHostname = parsed.hostname;
  const isIpv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(rawHostname);
  const isIpv6 = rawHostname.includes(':');
  const isIp = isIpv4 || isIpv6;

  const { registrableDomain, subdomain, topLevelDomain } = extractDomainParts(rawHostname);
  const punycodeInfo = decodePunycodeHostname(rawHostname);

  // Build clean normalized URL
  const normalizedProtocol = parsed.protocol.toLowerCase();
  const normalizedHostname = rawHostname.toLowerCase();
  const normalizedPort = parsed.port ? `:${parsed.port}` : '';
  const normalizedPath = parsed.pathname || '/';
  const normalizedSearch = parsed.search || '';
  const normalizedHash = parsed.hash || '';

  const normalizedUrl = `${normalizedProtocol}//${normalizedHostname}${normalizedPort}${normalizedPath}${normalizedSearch}${normalizedHash}`;

  return {
    originalUrl: rawInput,
    normalizedUrl,
    protocol: parsed.protocol.replace(':', '').toLowerCase(),
    hostname: normalizedHostname,
    port: parsed.port,
    pathname: parsed.pathname,
    search: parsed.search,
    hash: parsed.hash,
    username: parsed.username || undefined,
    password: parsed.password || undefined,
    subdomain,
    registrableDomain,
    topLevelDomain,
    isIpAddress: isIp,
    isIpv6,
    isPunycode: punycodeInfo.isPunycode,
    decodedHostname: punycodeInfo.decoded,
  };
}
