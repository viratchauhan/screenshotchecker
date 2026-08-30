import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

// Public Suffix list basic resolver for common multi-part TLDs
const MULTI_PART_TLDS = new Set([
  'co.uk', 'org.uk', 'gov.uk', 'ac.uk', 'me.uk', 'net.uk',
  'com.au', 'net.au', 'org.au', 'edu.au', 'gov.au',
  'co.in', 'net.in', 'org.in', 'gen.in', 'firm.in', 'ind.in',
  'co.nz', 'net.nz', 'org.nz',
  'co.za', 'org.za', 'net.za',
  'co.jp', 'ne.jp', 'or.jp', 'ac.jp', 'go.jp',
  'com.br', 'net.br', 'org.br',
  'com.cn', 'net.cn', 'org.cn', 'gov.cn',
  'com.sg', 'org.sg', 'edu.sg',
  'com.mx', 'org.mx', 'net.mx',
  'co.kr', 'ne.kr', 'or.kr',
  'spb.ru', 'msk.ru', 'com.ru', 'net.ru', 'org.ru',
  'ch.ma',
]);

function extractRegistrableDomain(hostname: string): string {
  const cleanHost = hostname.toLowerCase().replace(/\.+$/, '');
  const parts = cleanHost.split('.');
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

function normalizeInputUrl(raw: string): { url: string; hostname: string; registrableDomain: string } {
  let target = raw.trim();
  if (!target.startsWith('http://') && !target.startsWith('https://')) {
    target = 'http://' + target;
  }

  try {
    const parsed = new URL(target);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const regDomain = extractRegistrableDomain(hostname);
    
    // Normalized URL: lowercase host without default port, standard path
    let normUrl = `${parsed.protocol}//${parsed.hostname.toLowerCase()}${parsed.pathname}`;
    if (parsed.search) normUrl += parsed.search;

    return {
      url: normUrl,
      hostname,
      registrableDomain: regDomain,
    };
  } catch {
    const rawNoProto = raw.trim().replace(/^https?:\/\//i, '').split('/')[0].toLowerCase().replace(/^www\./, '');
    return {
      url: raw.trim().toLowerCase(),
      hostname: rawNoProto,
      registrableDomain: extractRegistrableDomain(rawNoProto),
    };
  }
}

async function runAudit() {
  const csvPath = path.resolve('src/data/urldata.csv');
  console.log('Auditing dataset at:', csvPath);

  const fileStream = fs.createReadStream(csvPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let totalLines = 0;
  let emptyRows = 0;
  let malformedRows = 0;
  let headerFound = false;

  const labelCounts: Record<string, number> = {};
  
  // Track unique keys and conflict maps
  const urlToLabels = new Map<string, Set<string>>();
  const hostnameToLabels = new Map<string, Set<string>>();
  const domainToLabels = new Map<string, Set<string>>();

  let rowCount = 0;

  for await (const line of rl) {
    totalLines++;
    const trimmed = line.trim();

    if (!trimmed) {
      emptyRows++;
      continue;
    }

    if (!headerFound) {
      if (trimmed.toLowerCase().startsWith('url,label')) {
        headerFound = true;
        continue;
      }
    }

    rowCount++;

    // Parse CSV line (format is url,label)
    const lastCommaIndex = trimmed.lastIndexOf(',');
    if (lastCommaIndex === -1) {
      malformedRows++;
      continue;
    }

    const rawUrl = trimmed.substring(0, lastCommaIndex).trim();
    const label = trimmed.substring(lastCommaIndex + 1).trim().toLowerCase();

    if (!rawUrl || !label) {
      malformedRows++;
      continue;
    }

    // Tally labels
    labelCounts[label] = (labelCounts[label] || 0) + 1;

    // Normalization
    const norm = normalizeInputUrl(rawUrl);

    // URL index
    if (!urlToLabels.has(norm.url)) {
      urlToLabels.set(norm.url, new Set());
    }
    urlToLabels.get(norm.url)!.add(label);

    // Hostname index
    if (norm.hostname) {
      if (!hostnameToLabels.has(norm.hostname)) {
        hostnameToLabels.set(norm.hostname, new Set());
      }
      hostnameToLabels.get(norm.hostname)!.add(label);
    }

    // Domain index
    if (norm.registrableDomain) {
      if (!domainToLabels.has(norm.registrableDomain)) {
        domainToLabels.set(norm.registrableDomain, new Set());
      }
      domainToLabels.get(norm.registrableDomain)!.add(label);
    }
  }

  // Calculate conflicts
  let urlConflicts = 0;
  for (const labels of urlToLabels.values()) {
    if (labels.size > 1) urlConflicts++;
  }

  let hostnameConflicts = 0;
  for (const labels of hostnameToLabels.values()) {
    if (labels.size > 1) hostnameConflicts++;
  }

  let domainConflicts = 0;
  for (const labels of domainToLabels.values()) {
    if (labels.size > 1) domainConflicts++;
  }

  console.log('\n================ DATASET AUDIT RESULTS ================');
  console.log(`Total Lines: ${totalLines}`);
  console.log(`Header Found: ${headerFound}`);
  console.log(`Data Rows Processed: ${rowCount}`);
  console.log(`Empty Rows: ${emptyRows}`);
  console.log(`Malformed Rows: ${malformedRows}`);
  console.log('\n--- Label Distribution ---');
  for (const [lbl, count] of Object.entries(labelCounts)) {
    const pct = ((count / rowCount) * 100).toFixed(2);
    console.log(`  - "${lbl}": ${count} (${pct}%)`);
  }
  console.log('\n--- Uniqueness & Index Counts ---');
  console.log(`Unique Normalized URLs: ${urlToLabels.size}`);
  console.log(`Unique Hostnames: ${hostnameToLabels.size}`);
  console.log(`Unique Registrable Domains: ${domainToLabels.size}`);
  console.log('\n--- Conflicting Classifications ---');
  console.log(`URLs with Conflicting Labels: ${urlConflicts}`);
  console.log(`Hostnames with Conflicting Labels: ${hostnameConflicts}`);
  console.log(`Registrable Domains with Conflicting Labels: ${domainConflicts}`);
  console.log('========================================================\n');
}

runAudit().catch(console.error);
