import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import { extractRegistrableDomain } from '../src/lib/linkChecker/urlNormalizer';

export function getShardKey(key: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const byte = (hash >>> 0) & 0xff;
  return byte.toString(16).padStart(2, '0');
}

interface ShardData {
  urls: Record<string, 'bad' | 'good' | 'conflict'>;
  hosts: Record<string, 'bad' | 'good' | 'conflict'>;
  domains: Record<string, 'bad' | 'good' | 'conflict'>;
}

function normalizeRawRecord(raw: string): { urlKey: string; hostKey: string; domainKey: string } {
  let target = raw.trim();
  if (!target.startsWith('http://') && !target.startsWith('https://')) {
    target = 'http://' + target;
  }

  try {
    const parsed = new URL(target);
    const host = parsed.hostname.toLowerCase().replace(/\.+$/, '').replace(/^www\./, '');
    const regDomain = extractRegistrableDomain(host);

    let normPath = parsed.pathname || '/';
    if (normPath.length > 1 && normPath.endsWith('/')) normPath = normPath.slice(0, -1);

    const normUrl = `${host}${normPath}${parsed.search}`;

    return {
      urlKey: normUrl,
      hostKey: host,
      domainKey: regDomain,
    };
  } catch {
    const rawClean = raw.trim().toLowerCase().replace(/^https?:\/\//i, '').replace(/^www\./, '');
    const parts = rawClean.split('/');
    const host = parts[0].replace(/\.+$/, '');
    const regDomain = extractRegistrableDomain(host);

    return {
      urlKey: rawClean,
      hostKey: host,
      domainKey: regDomain,
    };
  }
}

async function buildIndex() {
  const csvPath = path.resolve('src/data/urldata.csv');
  const outputDir = path.resolve('src/data/urldataIndex');
  const publicOutputDir = path.resolve('public/urldataIndex');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  if (!fs.existsSync(publicOutputDir)) {
    fs.mkdirSync(publicOutputDir, { recursive: true });
  }

  console.log(`Starting index generation from: ${csvPath}`);

  const fileStream = fs.createReadStream(csvPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  // Intermediate tracking for conflict resolution
  const urlMap = new Map<string, Set<string>>();
  const hostMap = new Map<string, Set<string>>();
  const domainMap = new Map<string, Set<string>>();

  let rowCount = 0;
  let headerSeen = false;
  const labelCounts = { bad: 0, good: 0 };

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (!headerSeen) {
      if (trimmed.toLowerCase().startsWith('url,label')) {
        headerSeen = true;
        continue;
      }
    }

    const lastComma = trimmed.lastIndexOf(',');
    if (lastComma === -1) continue;

    const rawUrl = trimmed.substring(0, lastComma).trim();
    const label = trimmed.substring(lastComma + 1).trim().toLowerCase() as 'bad' | 'good';

    if (!rawUrl || (label !== 'bad' && label !== 'good')) continue;

    rowCount++;
    labelCounts[label]++;

    const { urlKey, hostKey, domainKey } = normalizeRawRecord(rawUrl);

    // Track URLs
    if (!urlMap.has(urlKey)) urlMap.set(urlKey, new Set());
    urlMap.get(urlKey)!.add(label);

    // Track Hostnames
    if (hostKey) {
      if (!hostMap.has(hostKey)) hostMap.set(hostKey, new Set());
      hostMap.get(hostKey)!.add(label);
    }

    // Track Domains
    if (domainKey) {
      if (!domainMap.has(domainKey)) domainMap.set(domainKey, new Set());
      domainMap.get(domainKey)!.add(label);
    }
  }

  console.log(`Parsed ${rowCount} records. Partitioning into 256 shards...`);

  // Initialize 256 shards
  const shards: Record<string, ShardData> = {};
  for (let i = 0; i < 256; i++) {
    const hex = i.toString(16).padStart(2, '0');
    shards[hex] = { urls: {}, hosts: {}, domains: {} };
  }

  // Populate URL entries
  for (const [urlKey, labels] of urlMap.entries()) {
    const shardKey = getShardKey(urlKey);
    shards[shardKey].urls[urlKey] = labels.size > 1 ? 'conflict' : (labels.values().next().value as 'bad' | 'good');
  }

  // Populate Host entries
  for (const [hostKey, labels] of hostMap.entries()) {
    const shardKey = getShardKey(hostKey);
    shards[shardKey].hosts[hostKey] = labels.size > 1 ? 'conflict' : (labels.values().next().value as 'bad' | 'good');
  }

  // Populate Domain entries
  for (const [domainKey, labels] of domainMap.entries()) {
    const shardKey = getShardKey(domainKey);
    shards[shardKey].domains[domainKey] = labels.size > 1 ? 'conflict' : (labels.values().next().value as 'bad' | 'good');
  }

  // Write all 256 shard files to both src/data and public
  for (let i = 0; i < 256; i++) {
    const hex = i.toString(16).padStart(2, '0');
    const jsonStr = JSON.stringify(shards[hex]);
    fs.writeFileSync(path.join(outputDir, `shard_${hex}.json`), jsonStr);
    fs.writeFileSync(path.join(publicOutputDir, `shard_${hex}.json`), jsonStr);
  }

  // Write manifest
  const manifest = {
    source: 'urldata.csv',
    totalRecords: rowCount,
    uniqueUrls: urlMap.size,
    uniqueHostnames: hostMap.size,
    uniqueRegistrableDomains: domainMap.size,
    labels: labelCounts,
    generatedAt: new Date().toISOString(),
    version: '2026.08',
  };

  fs.writeFileSync(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(publicOutputDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log(`\n✓ Index generated successfully in ${outputDir}`);
  console.log(`✓ 256 Shards generated (shard_00.json to shard_ff.json)`);
  console.log(`✓ Manifest written to manifest.json`);
  console.log(`Total Indexed URLs: ${manifest.uniqueUrls}`);
  console.log(`Total Indexed Hostnames: ${manifest.uniqueHostnames}`);
  console.log(`Total Indexed Domains: ${manifest.uniqueRegistrableDomains}`);
}

buildIndex().catch(console.error);
