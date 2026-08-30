export interface NormalizedUrlResult {
  originalUrl: string;
  normalizedUrl: string;
  protocol: string;
  hostname: string;
  subdomain: string;
  registrableDomain: string;
  pathname: string;
  search: string;
  hash: string;
  port: string;
  isIpAddress: boolean;
  isValid: boolean;
  error?: string;
}

// Common multi-part TLDs (Public Suffix reference subset)
const MULTI_PART_TLDS = new Set([
  'co.uk', 'org.uk', 'gov.uk', 'ac.uk', 'me.uk', 'net.uk', 'ltd.uk', 'plc.uk',
  'com.au', 'net.au', 'org.au', 'edu.au', 'gov.au', 'id.au',
  'co.in', 'net.in', 'org.in', 'gen.in', 'firm.in', 'ind.in', 'edu.in', 'gov.in', 'res.in',
  'co.nz', 'net.nz', 'org.nz', 'govt.nz', 'ac.nz',
  'co.za', 'org.za', 'net.za', 'gov.za',
  'co.jp', 'ne.jp', 'or.jp', 'ac.jp', 'go.jp', 'ed.jp',
  'com.br', 'net.br', 'org.br', 'gov.br',
  'com.cn', 'net.cn', 'org.cn', 'gov.cn',
  'com.sg', 'org.sg', 'edu.sg', 'gov.sg',
  'com.mx', 'org.mx', 'net.mx', 'edu.mx', 'gob.mx',
  'co.kr', 'ne.kr', 'or.kr', 're.kr', 'pe.kr', 'go.kr',
  'spb.ru', 'msk.ru', 'com.ru', 'net.ru', 'org.ru', 'pp.ru',
  'ch.ma', 'co.id', 'ac.id', 'or.id', 'go.id',
  'com.pk', 'org.pk', 'net.pk', 'edu.pk', 'gov.pk',
  'com.tr', 'org.tr', 'net.tr', 'edu.tr', 'gov.tr',
  'com.tw', 'org.tw', 'net.tw', 'edu.tw', 'gov.tw',
  'com.my', 'net.my', 'org.my', 'edu.my', 'gov.my',
  'com.ph', 'net.ph', 'org.ph', 'edu.ph', 'gov.ph',
  'com.ng', 'org.ng', 'net.ng', 'edu.ng', 'gov.ng',
  'com.ar', 'net.ar', 'org.ar', 'gov.ar',
]);

const IPV4_REGEX = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

export function extractRegistrableDomain(hostname: string): string {
  const cleanHost = hostname.toLowerCase().replace(/\.+$/, '');
  if (IPV4_REGEX.test(cleanHost)) {
    return cleanHost;
  }

  const parts = cleanHost.split('.').filter(Boolean);
  if (parts.length <= 2) return cleanHost;

  const lastTwo = parts.slice(-2).join('.');
  const lastThree = parts.slice(-3).join('.');

  if (MULTI_PART_TLDS.has(lastTwo) && parts.length >= 3) {
    return parts.slice(-3).join('.');
  }
  if (MULTI_PART_TLDS.has(lastThree) && parts.length >= 4) {
    return parts.slice(-4).join('.');
  }

  return parts.slice(-2).join('.');
}

export function extractSubdomain(hostname: string, registrableDomain: string): string {
  if (hostname === registrableDomain) return '';
  if (hostname.endsWith('.' + registrableDomain)) {
    return hostname.substring(0, hostname.length - registrableDomain.length - 1);
  }
  return '';
}

/**
 * Standards-compliant URL normalization for dataset lookup and display.
 */
export function normalizeUrl(rawInput: string): NormalizedUrlResult {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return {
      originalUrl: '',
      normalizedUrl: '',
      protocol: '',
      hostname: '',
      subdomain: '',
      registrableDomain: '',
      pathname: '',
      search: '',
      hash: '',
      port: '',
      isIpAddress: false,
      isValid: false,
      error: 'Empty URL input',
    };
  }

  // Prepend http:// if protocol is omitted
  let candidate = trimmed;
  const hasProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(candidate);
  if (!hasProtocol) {
    candidate = 'http://' + candidate;
  }

  try {
    const urlObj = new URL(candidate);
    const protocol = urlObj.protocol.replace(':', '').toLowerCase();

    if (protocol !== 'http' && protocol !== 'https') {
      return {
        originalUrl: trimmed,
        normalizedUrl: candidate,
        protocol,
        hostname: urlObj.hostname.toLowerCase(),
        subdomain: '',
        registrableDomain: '',
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        port: urlObj.port,
        isIpAddress: false,
        isValid: false,
        error: `Unsupported protocol: ${protocol}`,
      };
    }

    const rawHost = urlObj.hostname.toLowerCase().replace(/\.+$/, '');
    const isIpAddress = IPV4_REGEX.test(rawHost);
    const registrableDomain = extractRegistrableDomain(rawHost);
    const subdomain = extractSubdomain(rawHost, registrableDomain);

    // Standard normalized URL
    let normPath = urlObj.pathname || '/';
    if (normPath.length > 1 && normPath.endsWith('/')) {
      normPath = normPath.slice(0, -1);
    }

    const portSuffix = urlObj.port && !((protocol === 'http' && urlObj.port === '80') || (protocol === 'https' && urlObj.port === '443'))
      ? `:${urlObj.port}`
      : '';

    const normalizedUrl = `${protocol}://${rawHost}${portSuffix}${normPath}${urlObj.search}`;

    return {
      originalUrl: trimmed,
      normalizedUrl,
      protocol,
      hostname: rawHost,
      subdomain,
      registrableDomain,
      pathname: normPath,
      search: urlObj.search,
      hash: urlObj.hash,
      port: urlObj.port || (protocol === 'https' ? '443' : '80'),
      isIpAddress,
      isValid: true,
    };
  } catch (err: any) {
    return {
      originalUrl: trimmed,
      normalizedUrl: '',
      protocol: '',
      hostname: '',
      subdomain: '',
      registrableDomain: '',
      pathname: '',
      search: '',
      hash: '',
      port: '',
      isIpAddress: false,
      isValid: false,
      error: 'Malformed URL format',
    };
  }
}
