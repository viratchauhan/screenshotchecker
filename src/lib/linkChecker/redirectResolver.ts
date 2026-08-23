import type { RedirectAnalysisFinding, RedirectHop } from './types';
import { validateUrlForSsrf } from './ssrfGuard';

const MAX_REDIRECT_HOPS = 5;
const HOP_TIMEOUT_MS = 4000;

/**
 * Safely traces server-side redirect chains with strict SSRF filtering on every intermediate hop.
 */
export async function resolveSafeRedirects(
  initialUrl: string,
  isShortened: boolean
): Promise<RedirectAnalysisFinding> {
  const hops: RedirectHop[] = [];
  let currentUrl = initialUrl;
  let domainChanged = false;
  let initialHostname = '';

  try {
    const initialParsed = new URL(initialUrl);
    initialHostname = initialParsed.hostname.toLowerCase();
  } catch {
    return {
      isShortened,
      resolved: false,
      hops: [],
      domainChanged: false,
      error: 'Invalid initial URL syntax',
    };
  }

  for (let step = 0; step < MAX_REDIRECT_HOPS; step++) {
    let parsed: URL;
    try {
      parsed = new URL(currentUrl);
    } catch {
      break;
    }

    // SSRF Check on EVERY hop before sending any network request
    const ssrfCheck = validateUrlForSsrf(parsed);
    if (!ssrfCheck.isSafe) {
      return {
        isShortened,
        resolved: false,
        finalUrl: currentUrl,
        hops,
        domainChanged,
        error: `Redirect blocked by SSRF Guard: ${ssrfCheck.reason}`,
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), HOP_TIMEOUT_MS);

      // We make a GET/HEAD request with redirect: 'manual' to inspect each hop step-by-step
      const res = await fetch(currentUrl, {
        method: 'HEAD',
        redirect: 'manual',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 ScreenshotChecker-SafetyBot/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const status = res.status;
      const currentHost = parsed.hostname.toLowerCase();

      hops.push({
        url: currentUrl,
        status,
        hostname: currentHost,
      });

      if (currentHost !== initialHostname) {
        domainChanged = true;
      }

      // Check if redirect status
      if (status >= 300 && status < 400) {
        const location = res.headers.get('location');
        if (!location) {
          break;
        }

        // Resolve relative redirects safely
        const nextUrlObj = new URL(location, currentUrl);
        currentUrl = nextUrlObj.toString();
      } else {
        // Destination reached (200, 404, etc.)
        break;
      }
    } catch (err: any) {
      // If network fails or times out, stop gracefully
      return {
        isShortened,
        resolved: hops.length > 0,
        finalUrl: currentUrl,
        hops,
        domainChanged,
        error: `Resolution stopped: ${err.message || 'Request timed out'}`,
      };
    }
  }

  return {
    isShortened,
    resolved: hops.length > 0,
    finalUrl: currentUrl,
    hops,
    domainChanged,
  };
}
