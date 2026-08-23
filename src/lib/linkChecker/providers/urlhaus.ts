import type { ProviderResult } from '../types';

/**
 * Adapter for URLhaus (abuse.ch) Threat Intelligence.
 * URLhaus provides real-time community threat intelligence for malware distribution URLs.
 */
export async function checkUrlhaus(url: string): Promise<ProviderResult> {
  const now = new Date().toISOString();
  const env = typeof process !== 'undefined' && process.env ? process.env : {};
  const apiKey = env.URLHAUS_API_KEY || env.ABUSE_CH_API_KEY;

  // If explicit URLHAUS_DISABLE is set or not configured
  if (env.URLHAUS_DISABLE === 'true') {
    return {
      provider: 'urlhaus',
      displayName: 'URLhaus (abuse.ch)',
      available: false,
      status: 'NOT_CONFIGURED',
      matched: false,
      details: 'URLhaus intelligence is disabled in configuration.',
      checkedAt: now,
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const formData = new URLSearchParams();
    formData.append('url', url);

    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    };
    if (apiKey) {
      headers['Auth-Key'] = apiKey;
    }

    const response = await fetch('https://urlhaus-api.abuse.ch/v1/url/', {
      method: 'POST',
      headers,
      body: formData.toString(),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 401 || response.status === 403) {
      return {
        provider: 'urlhaus',
        displayName: 'URLhaus (abuse.ch)',
        available: false,
        status: 'NOT_CONFIGURED',
        matched: false,
        details: 'URLhaus API key is not configured on this server.',
        checkedAt: now,
      };
    }

    if (!response.ok) {
      return {
        provider: 'urlhaus',
        displayName: 'URLhaus (abuse.ch)',
        available: false,
        status: 'UNAVAILABLE',
        matched: false,
        details: `API responded with HTTP status ${response.status}`,
        checkedAt: now,
      };
    }

    const data = await response.json();

    if (data.query_status === 'ok') {
      const threat = data.threat || 'Malware';
      const status = data.url_status || 'online';
      return {
        provider: 'urlhaus',
        displayName: 'URLhaus (abuse.ch)',
        available: true,
        status: 'MATCH',
        matched: true,
        category: threat.toUpperCase(),
        severity: 'critical',
        details: `Active malware distribution URL match (${threat}, status: ${status}, tags: ${(data.tags || []).join(', ') || 'none'}).`,
        checkedAt: now,
      };
    }

    if (data.query_status === 'no_results') {
      return {
        provider: 'urlhaus',
        displayName: 'URLhaus (abuse.ch)',
        available: true,
        status: 'CLEAN',
        matched: false,
        details: 'No active malware distribution campaign match found on URLhaus.',
        checkedAt: now,
      };
    }

    return {
      provider: 'urlhaus',
      displayName: 'URLhaus (abuse.ch)',
      available: false,
      status: 'UNAVAILABLE',
      matched: false,
      details: `Lookup status: ${data.query_status}`,
      checkedAt: now,
    };
  } catch (err: any) {
    return {
      provider: 'urlhaus',
      displayName: 'URLhaus (abuse.ch)',
      available: false,
      status: 'UNAVAILABLE',
      matched: false,
      details: `Lookup failed or timed out: ${err.message || 'Network error'}`,
      checkedAt: now,
    };
  }
}
