import type { LinkCheckReport, ProviderResult } from './types';
import { normalizeUrlComponents } from './urlNormalizer';
import { validateUrlForSsrf } from './ssrfGuard';
import { analyzeUrlLocally } from './localEngine';
import { resolveSafeRedirects } from './redirectResolver';
import { checkGoogleWebRisk } from './providers/googleWebRisk';
import { checkVirusTotal } from './providers/virusTotal';
import { checkUrlhaus } from './providers/urlhaus';
import { evaluateLinkSafety } from './scoringEngine';

interface CacheItem {
  report: LinkCheckReport;
  expiresAt: number;
}

const REPORT_CACHE = new Map<string, CacheItem>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Max cache size
const MAX_CACHE_ENTRIES = 500;

function getCachedReport(normalizedUrl: string): LinkCheckReport | null {
  const item = REPORT_CACHE.get(normalizedUrl);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    REPORT_CACHE.delete(normalizedUrl);
    return null;
  }
  return item.report;
}

function setCachedReport(normalizedUrl: string, report: LinkCheckReport) {
  if (REPORT_CACHE.size >= MAX_CACHE_ENTRIES) {
    const firstKey = REPORT_CACHE.keys().next().value;
    if (firstKey) REPORT_CACHE.delete(firstKey);
  }
  REPORT_CACHE.set(normalizedUrl, {
    report,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

/**
 * Main link investigation pipeline.
 */
export async function inspectUrl(rawUrl: string): Promise<LinkCheckReport> {
  // 1. Normalize
  const components = normalizeUrlComponents(rawUrl);

  // Check cache
  const cached = getCachedReport(components.normalizedUrl);
  if (cached) {
    return cached;
  }

  // 2. SSRF Check
  const urlObj = new URL(components.normalizedUrl);
  const ssrf = validateUrlForSsrf(urlObj);

  if (!ssrf.isSafe) {
    // If target is blocked by SSRF (e.g. 127.0.0.1, internal host)
    const blockedSignal = {
      id: 'blocked_internal_target',
      title: 'Restricted / Private Network Target Blocked',
      description: ssrf.reason || 'Target points to a private, loopback, or cloud-internal destination.',
      severity: 'critical' as const,
      category: 'structure' as const,
      weight: 90,
      evidence: `Target: ${components.hostname}`,
    };

    const emptyProviders: ProviderResult[] = [
      {
        provider: 'localHeuristics',
        displayName: 'SSRF Security Guard',
        available: true,
        status: 'MATCH',
        matched: true,
        severity: 'critical',
        details: 'Blocked access to non-public network address.',
        checkedAt: new Date().toISOString(),
      },
    ];

    const report = evaluateLinkSafety(
      components,
      [blockedSignal],
      emptyProviders,
      { detected: false },
      undefined
    );

    report.verdict = 'BLOCKED_TARGET';
    report.summary = `BLOCKED TARGET: ${ssrf.reason}`;
    report.recommendation = 'Do NOT attempt to interact with internal or local network targets.';

    return report;
  }

  // 3. Local Heuristics
  const localAnalysis = analyzeUrlLocally(components);
  const signals = [...localAnalysis.signals];

  // 4. Safe Redirect Resolution (if shortened or redirect-like)
  let redirectAnalysis;
  if (localAnalysis.isShortened) {
    redirectAnalysis = await resolveSafeRedirects(components.normalizedUrl, true);
    if (redirectAnalysis.domainChanged && redirectAnalysis.finalUrl) {
      try {
        const finalUrlObj = new URL(redirectAnalysis.finalUrl);
        signals.push({
          id: 'redirect_domain_switch',
          title: `Shortener Redirects to External Domain (${finalUrlObj.hostname})`,
          description: `The URL shortener forwards visitors to an external destination (${finalUrlObj.hostname}).`,
          severity: 'medium',
          category: 'redirect',
          weight: 15,
          evidence: `Original: ${components.hostname} → Final: ${finalUrlObj.hostname}`,
        });
      } catch { }
    }
  }

  // 5. Threat Intelligence Providers (Queried concurrently)
  const [googleResult, vtResult, urlhausResult] = await Promise.all([
    checkGoogleWebRisk(components.normalizedUrl),
    checkVirusTotal(components.normalizedUrl),
    checkUrlhaus(components.normalizedUrl),
  ]);

  const providers: ProviderResult[] = [
    googleResult,
    vtResult,
    urlhausResult,
    {
      provider: 'localHeuristics',
      displayName: 'Structural & Brand Heuristics',
      available: true,
      status: 'ACTIVE',
      matched: false,
      details:
        localAnalysis.signals.length > 0
          ? `${localAnalysis.signals.length} local security observation${localAnalysis.signals.length === 1 ? '' : 's'} identified.`
          : 'All structural syntax and brand checks are standard.',
      checkedAt: new Date().toISOString(),
    },
  ];

  // Add provider match signals
  if (googleResult.matched) {
    signals.push({
      id: 'google_threat_match',
      title: 'Google Web Risk / Safe Browsing Match',
      description: googleResult.details,
      severity: 'critical',
      category: 'threat_intel',
      weight: 50,
      evidence: googleResult.category || 'Malware / Phishing',
    });
  }

  if (vtResult.matched) {
    signals.push({
      id: 'virustotal_threat_match',
      title: 'VirusTotal Multi-Scanner Threat Detections',
      description: vtResult.details,
      severity: vtResult.severity || 'high',
      category: 'threat_intel',
      weight: vtResult.severity === 'critical' ? 50 : 35,
      evidence: vtResult.details,
    });
  }

  if (urlhausResult.matched) {
    signals.push({
      id: 'urlhaus_threat_match',
      title: 'URLhaus Malware Distribution URL Match',
      description: urlhausResult.details,
      severity: 'critical',
      category: 'threat_intel',
      weight: 50,
      evidence: urlhausResult.category || 'Malware Campaign',
    });
  }

  // 6. Signal Fusion & Scoring
  const finalReport = evaluateLinkSafety(
    components,
    signals,
    providers,
    localAnalysis.impersonation,
    redirectAnalysis
  );

  // Cache final report
  setCachedReport(components.normalizedUrl, finalReport);

  return finalReport;
}
