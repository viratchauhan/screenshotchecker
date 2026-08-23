/**
 * SSRF (Server-Side Request Forgery) Guard
 * Validates URLs and hostnames to ensure they are strictly public HTTP/HTTPS endpoints
 * and never point to loopback, private RFC1918 networks, link-local, carrier NAT, or cloud metadata endpoints.
 */

// Private IPv4 Subnets (CIDR ranges)
interface Ipv4Range {
  start: number;
  end: number;
}

function ipToLong(ip: string): number {
  return ip
    .split('.')
    .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function makeRange(cidr: string): Ipv4Range {
  const [baseIp, maskStr] = cidr.split('/');
  const maskBits = parseInt(maskStr, 10);
  const base = ipToLong(baseIp);
  const mask = maskBits === 0 ? 0 : (~0 << (32 - maskBits)) >>> 0;
  const start = (base & mask) >>> 0;
  const end = (start | ~mask) >>> 0;
  return { start, end };
}

const BLOCKED_IPV4_RANGES: Ipv4Range[] = [
  makeRange('0.0.0.0/8'), // Current network
  makeRange('10.0.0.0/8'), // RFC1918 Private Class A
  makeRange('100.64.0.0/10'), // Carrier-Grade NAT (RFC6598)
  makeRange('127.0.0.0/8'), // Loopback
  makeRange('169.254.0.0/16'), // Link-Local / AWS/GCP/Azure Metadata (169.254.169.254)
  makeRange('172.16.0.0/12'), // RFC1918 Private Class B
  makeRange('192.0.0.0/24'), // IETF Protocol Assignments
  makeRange('192.0.2.0/24'), // TEST-NET-1 documentation
  makeRange('192.168.0.0/16'), // RFC1918 Private Class C
  makeRange('198.18.0.0/15'), // Network benchmark tests
  makeRange('198.51.100.0/24'), // TEST-NET-2 documentation
  makeRange('203.0.113.0/24'), // TEST-NET-3 documentation
  makeRange('224.0.0.0/4'), // Multicast
  makeRange('240.0.0.0/4'), // Reserved for future use
  makeRange('255.255.255.255/32'), // Broadcast
];

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'broadcasthost',
  'local',
  'intranet',
  'internal',
  'metadata.google.internal',
  'instance-data',
]);

const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
const ALLOWED_PORTS = new Set(['', '80', '443', '8080', '8443']);

export interface SsrfCheckResult {
  isSafe: boolean;
  reason?: string;
  blockedTarget?: string;
}

/**
 * Checks whether an IPv4 address string falls into any restricted or private network ranges.
 */
export function isPrivateOrRestrictedIpv4(ip: string): boolean {
  if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) return false;
  const longIp = ipToLong(ip);
  return BLOCKED_IPV4_RANGES.some((r) => longIp >= r.start && longIp <= r.end);
}

/**
 * Checks whether an IPv6 address string is loopback, unique local, link-local, or documentation.
 */
export function isPrivateOrRestrictedIpv6(ip: string): boolean {
  const clean = ip.toLowerCase().replace(/^\[|\]$/g, '');
  if (clean === '::1' || clean === '::' || clean === '0:0:0:0:0:0:0:1') return true;
  if (clean.startsWith('fe80:')) return true; // Link-local
  if (clean.startsWith('fc00:') || clean.startsWith('fd00:')) return true; // Unique local (ULA)
  if (clean.startsWith('ff00:') || clean.startsWith('ff02:')) return true; // Multicast
  if (clean.startsWith('2001:db8:')) return true; // Documentation
  if (clean.startsWith('::ffff:')) {
    // IPv4-mapped IPv6
    const mappedIpv4 = clean.replace('::ffff:', '');
    return isPrivateOrRestrictedIpv4(mappedIpv4);
  }
  return false;
}

/**
 * Validates a parsed URL to ensure it cannot be used for Server-Side Request Forgery.
 */
export function validateUrlForSsrf(urlObj: URL): SsrfCheckResult {
  // 1. Protocol check
  if (!ALLOWED_PROTOCOLS.has(urlObj.protocol)) {
    return {
      isSafe: false,
      reason: `Blocked protocol "${urlObj.protocol}". Only HTTP and HTTPS are permitted.`,
      blockedTarget: urlObj.protocol,
    };
  }

  // 2. Port check
  const port = urlObj.port;
  if (port && !ALLOWED_PORTS.has(port)) {
    return {
      isSafe: false,
      reason: `Blocked non-standard target port "${port}". Only public web ports are permitted.`,
      blockedTarget: port,
    };
  }

  // 3. Hostname check
  const hostname = urlObj.hostname.toLowerCase();

  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return {
      isSafe: false,
      reason: `Blocked access to internal hostname "${hostname}".`,
      blockedTarget: hostname,
    };
  }

  // Check IPv4
  if (isPrivateOrRestrictedIpv4(hostname)) {
    return {
      isSafe: false,
      reason: `Blocked access to private or restricted IPv4 address "${hostname}".`,
      blockedTarget: hostname,
    };
  }

  // Check IPv6
  if (isPrivateOrRestrictedIpv6(hostname)) {
    return {
      isSafe: false,
      reason: `Blocked access to private or restricted IPv6 address "${hostname}".`,
      blockedTarget: hostname,
    };
  }

  // Block top-level local domain extensions (.local, .internal, .lan, .onion)
  if (
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.lan') ||
    hostname.endsWith('.home') ||
    hostname.endsWith('.corp')
  ) {
    return {
      isSafe: false,
      reason: `Blocked access to internal local domain "${hostname}".`,
      blockedTarget: hostname,
    };
  }

  return { isSafe: true };
}
