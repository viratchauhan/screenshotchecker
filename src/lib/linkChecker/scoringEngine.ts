import type {
  SecuritySignal,
  ProviderResult,
  LinkCheckVerdict,
  RiskBand,
  LinkCheckReport,
  UrlComponents,
  BrandImpersonationFinding,
  RedirectAnalysisFinding,
  DomainTechnicalDetails,
} from './types';

export function evaluateLinkSafety(
  targetComponents: UrlComponents,
  signals: SecuritySignal[],
  providers: ProviderResult[],
  impersonation: BrandImpersonationFinding,
  redirectAnalysis: RedirectAnalysisFinding | undefined
): LinkCheckReport {
  // 1. Calculate combined risk score from all signals
  let rawScore = 0;
  for (const sig of signals) {
    rawScore += sig.weight;
  }

  // Bonus for multiple active provider threat matches
  const matchedThreatFeeds = providers.filter((p) => p.provider !== 'localHeuristics' && p.matched);
  if (matchedThreatFeeds.length > 1) {
    rawScore += 25;
    signals.push({
      id: 'multi_provider_threat_match',
      title: 'Consensus Threat Match Across Multiple Providers',
      description: `Multiple independent security threat intelligence feeds (${matchedThreatFeeds.map((p) => p.displayName).join(', ')}) actively confirm this URL is malicious.`,
      severity: 'critical',
      category: 'threat_intel',
      weight: 25,
      evidence: `Matches: ${matchedThreatFeeds.length} feeds`,
    });
  }

  const finalScore = Math.min(100, Math.max(0, rawScore));

  // 2. Determine Verdict & Risk Band
  let verdict: LinkCheckVerdict = 'LOW_RISK';
  let riskBand: RiskBand = 'Low Risk';

  const hasCriticalThreat =
    matchedThreatFeeds.length > 0 ||
    signals.some((s) => s.severity === 'critical') ||
    (impersonation.detected && signals.some((s) => s.category === 'credential_harvesting'));

  if (hasCriticalThreat || finalScore >= 80) {
    verdict = 'DANGEROUS';
    riskBand = 'Dangerous';
  } else if (finalScore >= 60 || impersonation.detected) {
    verdict = 'HIGH_RISK';
    riskBand = 'High Risk';
  } else if (finalScore >= 40) {
    verdict = 'SUSPICIOUS';
    riskBand = 'Suspicious';
  } else if (finalScore >= 20) {
    verdict = 'CAUTION';
    riskBand = 'Caution';
  } else {
    verdict = 'LOW_RISK';
    riskBand = 'Low Risk';
  }

  // 3. Assemble Human-Readable Primary Reasons
  const primaryReasons: string[] = [];

  if (matchedThreatFeeds.length > 0) {
    primaryReasons.push(
      `Identified on ${matchedThreatFeeds.map((p) => p.displayName).join(' and ')} threat databases.`
    );
  }

  if (impersonation.detected && impersonation.claimedBrand) {
    primaryReasons.push(
      `Impersonates ${impersonation.claimedBrand} on an unauthorized domain (${targetComponents.registrableDomain}).`
    );
  }

  if (targetComponents.username || targetComponents.password || targetComponents.originalUrl.includes('@')) {
    primaryReasons.push('Uses deceptive "@" authority spoofing to conceal destination host.');
  }

  if (targetComponents.isIpAddress) {
    primaryReasons.push('Uses a direct IP address hostname instead of a registered domain.');
  }

  if (targetComponents.isPunycode) {
    primaryReasons.push('Uses Punycode / IDN character encoding which may conceal lookalike homoglyphs.');
  }

  if (signals.some((s) => s.category === 'credential_harvesting')) {
    primaryReasons.push('Path and query structure request sensitive authentication or KYC credentials.');
  }

  if (signals.some((s) => s.category === 'malware_download')) {
    primaryReasons.push('Direct link to executable package or installation archive (.apk/.exe).');
  }

  if (redirectAnalysis?.domainChanged) {
    primaryReasons.push(
      `Shortened link redirects across domains to ${redirectAnalysis.finalUrl ? new URL(redirectAnalysis.finalUrl).hostname : 'an external destination'}.`
    );
  }

  if (primaryReasons.length === 0) {
    if (verdict === 'LOW_RISK') {
      primaryReasons.push('No known threat match or active brand impersonation detected.');
      primaryReasons.push('URL syntax, protocol, and domain structures appear standard.');
      primaryReasons.push('No suspicious credential-harvesting keywords or deceptive obfuscations found.');
    } else {
      primaryReasons.push('Minor structural observations warrant standard vigilance.');
    }
  }

  // 4. Generate Overall Summary
  let summary = '';
  if (verdict === 'DANGEROUS') {
    summary = `CRITICAL WARNING: This link exhibits severe risk indicators (${primaryReasons[0]}). Opening this link may compromise your credentials, financial accounts, or device security.`;
  } else if (verdict === 'HIGH_RISK') {
    summary = `HIGH RISK: Multiple indicators suggest this link may be deceptive or malicious (${primaryReasons.join('; ')}).`;
  } else if (verdict === 'SUSPICIOUS') {
    summary = `SUSPICIOUS: Several unusual URL characteristics were identified. Exercise caution and verify the source through independent official channels.`;
  } else if (verdict === 'CAUTION') {
    summary = `CAUTION: The URL has minor observations (such as URL shortening or unencrypted HTTP) that warrant standard vigilance.`;
  } else {
    summary = `LOW RISK: Structural analysis and available threat checks did not identify known deceptive or malicious patterns. (Note: Absence of evidence is not proof of absolute safety).`;
  }

  // 5. Actionable Recommendation
  let recommendation = '';
  if (verdict === 'DANGEROUS' || verdict === 'HIGH_RISK') {
    recommendation =
      'DO NOT open this link. Do NOT enter passwords, OTP codes, banking credentials, UPI pins, or personal information. If received via SMS or WhatsApp, block and report the sender.';
  } else if (verdict === 'SUSPICIOUS') {
    recommendation =
      'Avoid clicking this link or downloading files from this page. Navigate directly to the official organization website by typing their verified web address manually into your browser.';
  } else if (verdict === 'CAUTION') {
    recommendation =
      'Verify the sender and context before proceeding. Check that the final destination domain matches your intended recipient before submitting any sensitive information.';
  } else {
    recommendation =
      'The link appears standard based on local heuristics and available threat feeds. Always double-check the address bar when entering passwords or payment details.';
  }

  const disclaimer =
    'Automated link safety checking assesses structural indicators and available reputation databases. Low risk does NOT guarantee a website is 100% safe, as newly registered phishing domains may not yet be indexed by threat feeds.';

  const domainDetails: DomainTechnicalDetails = {
    registrableDomain: targetComponents.registrableDomain,
    subdomain: targetComponents.subdomain || '(none)',
    protocol: targetComponents.protocol.toUpperCase(),
    isHttps: targetComponents.protocol === 'https',
    isIpAddress: targetComponents.isIpAddress,
    isPunycode: targetComponents.isPunycode,
    decodedHostname: targetComponents.decodedHostname,
    hasUserInfo: !!(targetComponents.username || targetComponents.password),
    pathDepth: targetComponents.pathname.split('/').filter(Boolean).length,
    queryParamsCount: Array.from(new URLSearchParams(targetComponents.search).keys()).length,
    port: targetComponents.port || (targetComponents.protocol === 'https' ? '443 (default)' : '80 (default)'),
  };

  return {
    target: {
      originalUrl: targetComponents.originalUrl,
      normalizedUrl: targetComponents.normalizedUrl,
      components: targetComponents,
    },
    verdict,
    riskScore: finalScore,
    riskBand,
    summary,
    primaryReasons,
    signals,
    impersonation,
    redirectAnalysis,
    providers,
    domainDetails,
    recommendation,
    disclaimer,
    checkedAt: new Date().toISOString(),
  };
}
