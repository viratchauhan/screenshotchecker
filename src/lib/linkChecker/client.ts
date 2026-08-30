import { normalizeUrl } from './urlNormalizer';
import type {
  LocalVerificationReport,
  LocalMatchLevel,
  DatasetLabel,
} from './types';

// In-memory cache for client-side fetched shards
const CLIENT_SHARD_CACHE = new Map<string, any>();

export function getShardKey(key: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const byte = (hash >>> 0) & 0xff;
  return byte.toString(16).padStart(2, '0');
}

/**
 * Loads a single ~35KB shard JSON directly in the browser.
 */
async function fetchShard(shardKey: string): Promise<{
  urls: Record<string, 'bad' | 'good' | 'conflict'>;
  hosts: Record<string, 'bad' | 'good' | 'conflict'>;
  domains: Record<string, 'bad' | 'good' | 'conflict'>;
} | null> {
  if (CLIENT_SHARD_CACHE.has(shardKey)) {
    return CLIENT_SHARD_CACHE.get(shardKey);
  }

  try {
    const response = await fetch(`/urldataIndex/shard_${shardKey}.json`);
    if (response.ok) {
      const data = await response.json();
      CLIENT_SHARD_CACHE.set(shardKey, data);
      return data;
    }
  } catch {}

  return null;
}

/**
 * Extracts multiple URLs from text input (e.g. pasted SMS or message).
 */
export function extractUrls(input: string): string[] {
  if (!input || typeof input !== 'string') return [];
  const trimmed = input.trim();

  const urlRegex = /(?:https?:\/\/|www\.)[^\s<>"'{}|\\^`[\]]+|(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+(?:com|org|net|in|co\.in|xyz|top|online|vip|club|info|biz|live|tech|app|io|me|site|ru|cn|cc|to|de|uk|co\.uk|au|com\.au|jp|co\.jp|ca|fr|br|com\.br|nl|se|no|es|it)(?::\d{1,5})?(?:\/[^\s<>"'{}|\\^`[\]]*)?/gi;

  const matches = trimmed.match(urlRegex) || [];
  if (matches.length > 0) {
    return Array.from(new Set(matches.map((m) => m.trim().replace(/[.,;:)\]]+$/, ''))));
  }

  if (trimmed.length > 0 && !trimmed.includes(' ')) {
    return [trimmed];
  }

  return [];
}

/**
 * Performs fast local URL verification directly against static shards or backend API.
 */
export async function verifySingleUrl(rawInput: string): Promise<LocalVerificationReport> {
  const norm = normalizeUrl(rawInput);
  const now = new Date().toISOString();
  const source = 'ScreenshotChecker Local URL Dataset (urldata.csv)';

  if (!norm.isValid) {
    return {
      target: norm,
      matched: false,
      matchLevel: 'NONE',
      label: 'unknown',
      verdict: 'INVALID_URL',
      verdictTitle: 'Invalid URL Format',
      summary: 'The provided input cannot be parsed as a valid web address.',
      explanation: 'Please check the URL formatting and enter a valid domain or web link.',
      source,
      domainDetails: {
        registrableDomain: '',
        hostname: '',
        subdomain: '',
        protocol: '',
        pathname: '',
        isIpAddress: false,
        port: '',
      },
      checkedAt: now,
    };
  }

  const urlKey = `${norm.hostname.replace(/^www\./, '')}${norm.pathname}${norm.search}`;
  const hostKey = norm.hostname.replace(/^www\./, '');
  const domainKey = norm.registrableDomain.replace(/^www\./, '');

  let matched = false;
  let matchLevel: LocalMatchLevel = 'NONE';
  let matchedValue = '';
  let label: DatasetLabel = 'unknown';

  // 1. Check EXACT URL MATCH
  const urlShardKey = getShardKey(urlKey);
  const urlShard = await fetchShard(urlShardKey);
  if (urlShard && urlShard.urls && urlShard.urls[urlKey]) {
    matched = true;
    matchLevel = 'EXACT_URL';
    matchedValue = urlKey;
    label = urlShard.urls[urlKey];
  }

  // 2. Check EXACT HOSTNAME MATCH
  if (!matched && hostKey) {
    const hostShardKey = getShardKey(hostKey);
    const hostShard = await fetchShard(hostShardKey);
    if (hostShard && hostShard.hosts && hostShard.hosts[hostKey]) {
      matched = true;
      matchLevel = 'EXACT_HOSTNAME';
      matchedValue = hostKey;
      label = hostShard.hosts[hostKey];
    }
  }

  // 3. Check REGISTRABLE DOMAIN MATCH
  if (!matched && domainKey) {
    const domainShardKey = getShardKey(domainKey);
    const domainShard = await fetchShard(domainShardKey);
    if (domainShard && domainShard.domains && domainShard.domains[domainKey]) {
      matched = true;
      matchLevel = 'REGISTRABLE_DOMAIN';
      matchedValue = domainKey;
      label = domainShard.domains[domainKey];
    }
  }

  const domainDetails = {
    registrableDomain: norm.registrableDomain,
    hostname: norm.hostname,
    subdomain: norm.subdomain || '(none)',
    protocol: norm.protocol.toUpperCase(),
    pathname: norm.pathname,
    isIpAddress: norm.isIpAddress,
    port: norm.port,
  };

  if (matched) {
    const matchLabelDisplay =
      matchLevel === 'EXACT_URL'
        ? 'Exact URL'
        : matchLevel === 'EXACT_HOSTNAME'
        ? 'Exact Hostname'
        : 'Registrable Domain';

    if (label === 'conflict') {
      return {
        target: norm,
        matched: true,
        matchLevel,
        matchedValue,
        label: 'conflict',
        verdict: 'CONFLICTING',
        verdictTitle: 'Conflicting Local Data',
        summary: `Multiple classifications were found for this ${matchLabelDisplay.toLowerCase()} in the local dataset.`,
        explanation: `Records associated with "${matchedValue}" have conflicting labels in the local dataset. Further independent verification is recommended.`,
        source,
        domainDetails,
        checkedAt: now,
      };
    }

    if (label === 'bad') {
      return {
        target: norm,
        matched: true,
        matchLevel,
        matchedValue,
        label: 'bad',
        verdict: 'KNOWN_BAD',
        verdictTitle: 'Known Bad in Local Dataset',
        summary: `This URL/domain matches a record classified as "bad" in ScreenshotChecker's local URL dataset (${matchLabelDisplay} Match).`,
        explanation: `The local dataset classifies this ${matchLabelDisplay.toLowerCase()} ("${matchedValue}") as bad. Note: A dataset classification is based on local dataset records and may not represent the current status of the website.`,
        source,
        domainDetails,
        checkedAt: now,
      };
    }

    // label === 'good'
    return {
      target: norm,
      matched: true,
      matchLevel,
      matchedValue,
      label: 'good',
      verdict: 'GOOD',
      verdictTitle: 'Classified as Good in Local Dataset',
      summary: `This URL/domain matches a record classified as "good" in ScreenshotChecker's local URL dataset (${matchLabelDisplay} Match).`,
      explanation: `The local dataset contains a record classifying this ${matchLabelDisplay.toLowerCase()} ("${matchedValue}") as good. Note: A dataset classification is based on local dataset records and does not guarantee absolute safety.`,
      source,
      domainDetails,
      checkedAt: now,
    };
  }

  // NO MATCH
  return {
    target: norm,
    matched: false,
    matchLevel: 'NONE',
    label: 'unknown',
    verdict: 'NO_LOCAL_MATCH',
    verdictTitle: 'No Local Match',
    summary: "This URL/domain was not found in ScreenshotChecker's local URL dataset.",
    explanation: 'Not being found in the dataset does not guarantee that the URL is safe. Newly registered websites, private links, or uncataloged addresses may not be listed in this dataset.',
    source,
    domainDetails,
    checkedAt: now,
  };
}

export interface CheckLinkResult {
  single: LocalVerificationReport;
  reports: LocalVerificationReport[];
}

/**
 * Universal verification entry point for the browser UI.
 */
export async function checkLink(rawInput: string): Promise<CheckLinkResult> {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    throw new Error('Please enter a valid URL or domain.');
  }

  // 1. Try server-side /api/check-link if available
  try {
    const response = await fetch('/api/check-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: trimmed }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.reports && Array.isArray(data.reports) && data.reports.length > 0) {
        return {
          single: data.single || data.reports[0],
          reports: data.reports,
        };
      }
      if (data.verdict) {
        return {
          single: data as LocalVerificationReport,
          reports: [data as LocalVerificationReport],
        };
      }
    }
  } catch {}

  // 2. Direct client-side shard resolution (handles astro dev, static export, and offline mode seamlessly)
  const extracted = extractUrls(trimmed);

  if (extracted.length > 1) {
    const reports = await Promise.all(extracted.map((u) => verifySingleUrl(u)));
    return {
      single: reports[0],
      reports,
    };
  }

  const singleUrl = extracted[0] || trimmed;
  const singleReport = await verifySingleUrl(singleUrl);
  return {
    single: singleReport,
    reports: [singleReport],
  };
}
