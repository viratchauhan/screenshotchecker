import type { ProviderResult } from '../types';

/**
 * Adapter for Google Web Risk / Safe Browsing API.
 * Reads GOOGLE_WEB_RISK_API_KEY or GOOGLE_SAFE_BROWSING_API_KEY from server environment variables.
 * If credentials are not provided, returns NOT_CONFIGURED. Never fakes threat data.
 */
export async function checkGoogleWebRisk(url: string): Promise<ProviderResult> {
  const env = typeof process !== 'undefined' && process.env ? process.env : {};
  const apiKey =
    env.GOOGLE_WEB_RISK_API_KEY ||
    env.GOOGLE_SAFE_BROWSING_API_KEY ||
    env.GOOGLE_API_KEY;

  const now = new Date().toISOString();

  if (!apiKey) {
    return {
      provider: 'googleWebRisk',
      displayName: 'Google Web Risk / Safe Browsing',
      available: false,
      status: 'NOT_CONFIGURED',
      matched: false,
      details: 'Google Web Risk API key is not configured on this server.',
      checkedAt: now,
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const endpoint = `https://webrisk.googleapis.com/v1/uris:search?key=${encodeURIComponent(
      apiKey
    )}&uri=${encodeURIComponent(url)}&threatTypes=MALWARE&threatTypes=SOCIAL_ENGINEERING&threatTypes=UNWANTED_SOFTWARE`;

    const response = await fetch(endpoint, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        provider: 'googleWebRisk',
        displayName: 'Google Web Risk / Safe Browsing',
        available: false,
        status: 'UNAVAILABLE',
        matched: false,
        details: `API responded with HTTP status ${response.status}`,
        checkedAt: now,
      };
    }

    const data = await response.json();

    if (data.threat && data.threat.threatTypes && data.threat.threatTypes.length > 0) {
      const threatType = data.threat.threatTypes.join(', ');
      return {
        provider: 'googleWebRisk',
        displayName: 'Google Web Risk / Safe Browsing',
        available: true,
        status: 'MATCH',
        matched: true,
        category: threatType,
        severity: 'critical',
        details: `Threat detected by Google Web Risk: ${threatType}`,
        checkedAt: now,
      };
    }

    return {
      provider: 'googleWebRisk',
      displayName: 'Google Web Risk / Safe Browsing',
      available: true,
      status: 'CLEAN',
      matched: false,
      details: 'No known threat match found in Google Web Risk database.',
      checkedAt: now,
    };
  } catch (err: any) {
    return {
      provider: 'googleWebRisk',
      displayName: 'Google Web Risk / Safe Browsing',
      available: false,
      status: 'UNAVAILABLE',
      matched: false,
      details: `Lookup failed: ${err.message || 'Request timed out'}`,
      checkedAt: now,
    };
  }
}
