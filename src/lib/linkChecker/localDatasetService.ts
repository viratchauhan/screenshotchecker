import * as path from 'path';
import * as fs from 'fs';
import { normalizeUrl } from './urlNormalizer';
import type {
  LocalVerificationReport,
  MultiUrlVerificationReport,
  LocalMatchLevel,
  DatasetLabel,
  LocalDatasetVerdict,
} from './types';

// In-memory cache for loaded shards to minimize I/O and asset requests
const SHARD_CACHE = new Map<string, any>();

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
 * Loads a specific shard JSON by 2-character hex key.
 * Supports Node fs and Cloudflare Worker env.ASSETS.
 */
export async function loadShard(
  shardKey: string,
  options?: { assetsFetcher?: any }
): Promise<{
  urls: Record<string, 'bad' | 'good' | 'conflict'>;
  hosts: Record<string, 'bad' | 'good' | 'conflict'>;
  domains: Record<string, 'bad' | 'good' | 'conflict'>;
} | null> {
  if (SHARD_CACHE.has(shardKey)) {
    return SHARD_CACHE.get(shardKey);
  }

  // 1. Try Node fs if available
  try {
    if (typeof process !== 'undefined' && process.cwd && typeof fs?.readFileSync === 'function') {
      const shardPath = path.resolve(process.cwd(), `src/data/urldataIndex/shard_${shardKey}.json`);
      if (fs.existsSync(shardPath)) {
        const content = fs.readFileSync(shardPath, 'utf-8');
        const data = JSON.parse(content);
        SHARD_CACHE.set(shardKey, data);
        return data;
      }
    }
  } catch {}

  // 2. Try Cloudflare Worker env.ASSETS fetcher
  try {
    if (options?.assetsFetcher && typeof options.assetsFetcher.fetch === 'function') {
      const res = await options.assetsFetcher.fetch(
        new Request(`http://localhost/src/data/urldataIndex/shard_${shardKey}.json`)
      );
      if (res.ok) {
        const data = await res.json();
        SHARD_CACHE.set(shardKey, data);
        return data;
      }
    }
  } catch {}

  // 3. Try global fetch (if hosted or internal routing)
  try {
    if (typeof fetch === 'function') {
      const res = await fetch(`/data/urldataIndex/shard_${shardKey}.json`);
      if (res.ok) {
        const data = await res.json();
        SHARD_CACHE.set(shardKey, data);
        return data;
      }
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
 * Performs strict local URL verification against the indexed urldata dataset.
 */
export async function verifyUrlLocally(
  rawInput: string,
  options?: { assetsFetcher?: any }
): Promise<LocalVerificationReport> {
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

  // Construct match lookup keys
  const urlKey = `${norm.hostname.replace(/^www\./, '')}${norm.pathname}${norm.search}`;
  const hostKey = norm.hostname.replace(/^www\./, '');
  const domainKey = norm.registrableDomain.replace(/^www\./, '');

  let matched = false;
  let matchLevel: LocalMatchLevel = 'NONE';
  let matchedValue = '';
  let label: DatasetLabel = 'unknown';

  // 1. Check EXACT URL MATCH
  const urlShardKey = getShardKey(urlKey);
  const urlShard = await loadShard(urlShardKey, options);
  if (urlShard && urlShard.urls && urlShard.urls[urlKey]) {
    matched = true;
    matchLevel = 'EXACT_URL';
    matchedValue = urlKey;
    label = urlShard.urls[urlKey];
  }

  // 2. Check EXACT HOSTNAME MATCH (if no exact URL match)
  if (!matched && hostKey) {
    const hostShardKey = getShardKey(hostKey);
    const hostShard = await loadShard(hostShardKey, options);
    if (hostShard && hostShard.hosts && hostShard.hosts[hostKey]) {
      matched = true;
      matchLevel = 'EXACT_HOSTNAME';
      matchedValue = hostKey;
      label = hostShard.hosts[hostKey];
    }
  }

  // 3. Check REGISTRABLE DOMAIN MATCH (if no exact hostname match)
  if (!matched && domainKey) {
    const domainShardKey = getShardKey(domainKey);
    const domainShard = await loadShard(domainShardKey, options);
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

  // Determine Verdict and Narrative
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
        summary: `Multiple classifications were found for this domain in the local dataset.`,
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

/**
 * Verifies multiple URLs from pasted message text against local dataset.
 */
export async function verifyMessageUrlsLocally(
  input: string,
  options?: { assetsFetcher?: any }
): Promise<MultiUrlVerificationReport> {
  const extracted = extractUrls(input);

  if (extracted.length === 0) {
    const report = await verifyUrlLocally(input, options);
    return {
      messageContext: input,
      extractedUrls: [input],
      reports: [report],
    };
  }

  const reports = await Promise.all(extracted.map((u) => verifyUrlLocally(u, options)));
  return {
    messageContext: input,
    extractedUrls: extracted,
    reports,
  };
}
