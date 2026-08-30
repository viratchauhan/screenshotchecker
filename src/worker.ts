import { verifyUrlLocally, verifyMessageUrlsLocally } from './lib/linkChecker/localDatasetService';

interface Env {
  ASSETS: {
    fetch: typeof fetch;
  };
  [key: string]: any;
}

// In-memory sliding-window IP rate limiter
const IP_RATE_LIMITS = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 40; // 40 requests per minute

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const entry = IP_RATE_LIMITS.get(clientIp);

  if (!entry || now > entry.resetAt) {
    IP_RATE_LIMITS.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    if (IP_RATE_LIMITS.size > 2000) {
      for (const [ip, data] of IP_RATE_LIMITS.entries()) {
        if (now > data.resetAt) IP_RATE_LIMITS.delete(ip);
      }
    }
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

function jsonResponse(data: any, status: number = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // 2. Security Guard: Prevent public download of dataset CSV or index shards
    const pathLower = url.pathname.toLowerCase();
    if (
      pathLower.includes('urldata') ||
      pathLower.endsWith('.csv') ||
      pathLower.includes('shard_') ||
      pathLower.startsWith('/data/') ||
      pathLower.startsWith('/src/data/')
    ) {
      return new Response('Forbidden', { status: 403 });
    }

    // 3. Health Check
    if (url.pathname === '/api/health') {
      return jsonResponse({
        status: 'ok',
        service: 'screenshotchecker-local-url-verifier',
        engine: 'urldata.csv',
        timestamp: new Date().toISOString(),
      });
    }

    // 4. API Route: /api/check-link
    if (url.pathname === '/api/check-link') {
      if (request.method !== 'POST' && request.method !== 'GET') {
        return jsonResponse({ error: 'Method Not Allowed' }, 405);
      }

      // Rate Limiting
      const clientIp =
        request.headers.get('cf-connecting-ip') ||
        request.headers.get('x-forwarded-for') ||
        'anonymous-client';

      if (isRateLimited(clientIp)) {
        return jsonResponse(
          {
            error: 'Rate limit exceeded. Please wait a moment before submitting additional URLs.',
          },
          429
        );
      }

      let rawInput = '';

      if (request.method === 'POST') {
        try {
          const body = (await request.json()) as any;
          rawInput = typeof body.url === 'string' ? body.url.trim() : '';
        } catch {
          return jsonResponse({ error: 'Invalid JSON payload' }, 400);
        }
      } else {
        rawInput = (url.searchParams.get('url') || '').trim();
      }

      if (!rawInput || rawInput.length === 0) {
        return jsonResponse({ error: 'Missing required "url" parameter' }, 400);
      }

      if (rawInput.length > 4096) {
        return jsonResponse(
          { error: 'URL or input text exceeds maximum allowable length of 4096 characters' },
          413
        );
      }

      try {
        const multiReport = await verifyMessageUrlsLocally(rawInput, {
          assetsFetcher: env.ASSETS,
        });

        if (multiReport.extractedUrls.length > 1) {
          return jsonResponse(multiReport);
        }

        const singleReport = multiReport.reports[0] || (await verifyUrlLocally(rawInput, { assetsFetcher: env.ASSETS }));

        return jsonResponse({
          extractedUrls: [singleReport.target.originalUrl || rawInput],
          reports: [singleReport],
          single: singleReport,
        });
      } catch (err: any) {
        return jsonResponse(
          {
            error: 'Local URL verification failed',
            details: 'An internal error occurred while performing local dataset lookup.',
          },
          500
        );
      }
    }

    // 5. Static Assets Fallback (Cloudflare Workers Assets)
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};
