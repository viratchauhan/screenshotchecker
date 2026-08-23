import type { ProviderResult } from '../types';

/**
 * Adapter for VirusTotal v3 URL Reputation API.
 * Reads VT_API_KEY or VIRUSTOTAL_API_KEY from server environment variables.
 * If credentials are not provided, returns NOT_CONFIGURED. Never fakes threat data.
 */
function toBase64Url(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str).toString('base64url');
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function checkVirusTotal(url: string): Promise<ProviderResult> {
  const env = typeof process !== 'undefined' && process.env ? process.env : {};
  const apiKey = env.VT_API_KEY || env.VIRUSTOTAL_API_KEY;
  const now = new Date().toISOString();

  if (!apiKey) {
    return {
      provider: 'virusTotal',
      displayName: 'VirusTotal Intelligence',
      available: false,
      status: 'NOT_CONFIGURED',
      matched: false,
      details: 'VirusTotal API key is not configured on this server.',
      checkedAt: now,
    };
  }

  try {
    // VirusTotal v3 URL ID is base64 URL-safe representation without padding
    const urlId = toBase64Url(url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
      method: 'GET',
      headers: {
        'x-apikey': apiKey,
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 404) {
      return {
        provider: 'virusTotal',
        displayName: 'VirusTotal Intelligence',
        available: true,
        status: 'CLEAN',
        matched: false,
        details: 'URL has not been previously submitted or flagged on VirusTotal.',
        checkedAt: now,
      };
    }

    if (!response.ok) {
      return {
        provider: 'virusTotal',
        displayName: 'VirusTotal Intelligence',
        available: false,
        status: 'UNAVAILABLE',
        matched: false,
        details: `API responded with status code ${response.status}`,
        checkedAt: now,
      };
    }

    const data = await response.json();
    const stats = data?.data?.attributes?.last_analysis_stats || {};
    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const harmless = stats.harmless || 0;
    const undetected = stats.undetected || 0;
    const total = malicious + suspicious + harmless + undetected;

    const rawCount = {
      malicious,
      suspicious,
      harmless,
      undetected,
      total,
    };

    if (malicious > 0 || suspicious > 2) {
      return {
        provider: 'virusTotal',
        displayName: 'VirusTotal Intelligence',
        available: true,
        status: 'MATCH',
        matched: true,
        category: malicious > 0 ? 'MALWARE / PHISHING' : 'SUSPICIOUS',
        severity: malicious >= 3 ? 'critical' : malicious >= 1 ? 'high' : 'medium',
        details: `${malicious} security vendor${malicious === 1 ? '' : 's'} flagged this URL as malicious (${total} engines queried).`,
        checkedAt: now,
        rawCount,
      };
    }

    return {
      provider: 'virusTotal',
      displayName: 'VirusTotal Intelligence',
      available: true,
      status: 'CLEAN',
      matched: false,
      details: `0 / ${total} security engines flagged this URL as malicious.`,
      checkedAt: now,
      rawCount,
    };
  } catch (err: any) {
    return {
      provider: 'virusTotal',
      displayName: 'VirusTotal Intelligence',
      available: false,
      status: 'UNAVAILABLE',
      matched: false,
      details: `Lookup failed: ${err.message || 'Request timed out'}`,
      checkedAt: now,
    };
  }
}
