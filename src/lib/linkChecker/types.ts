export interface UrlComponents {
  originalUrl: string;
  normalizedUrl: string;
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  username?: string;
  password?: string;
  subdomain: string;
  registrableDomain: string;
  topLevelDomain: string;
  isIpAddress: boolean;
  isIpv6: boolean;
  isPunycode: boolean;
  decodedHostname: string;
}

export type SignalSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type SignalCategory =
  | 'threat_intel'
  | 'brand_impersonation'
  | 'credential_harvesting'
  | 'structure'
  | 'redirect'
  | 'protocol'
  | 'obfuscation'
  | 'malware_download';

export interface SecuritySignal {
  id: string;
  title: string;
  description: string;
  severity: SignalSeverity;
  category: SignalCategory;
  weight: number;
  evidence: string;
}

export type ProviderStatus = 'NOT_CONFIGURED' | 'CLEAN' | 'MATCH' | 'UNAVAILABLE' | 'ACTIVE';

export interface ProviderResult {
  provider: 'googleWebRisk' | 'virusTotal' | 'urlhaus' | 'localHeuristics';
  displayName: string;
  available: boolean;
  status: ProviderStatus;
  matched: boolean;
  category?: string;
  severity?: SignalSeverity;
  details: string;
  checkedAt: string;
  rawCount?: {
    malicious?: number;
    suspicious?: number;
    harmless?: number;
    undetected?: number;
    total?: number;
  };
}

export interface RedirectHop {
  url: string;
  status: number;
  hostname: string;
}

export type LinkCheckVerdict =
  | 'DANGEROUS'
  | 'HIGH_RISK'
  | 'SUSPICIOUS'
  | 'CAUTION'
  | 'LOW_RISK'
  | 'UNKNOWN'
  | 'INVALID_URL'
  | 'BLOCKED_TARGET';

export type RiskBand =
  | 'Dangerous'
  | 'High Risk'
  | 'Suspicious'
  | 'Caution'
  | 'Low Risk'
  | 'Unknown';

export interface BrandImpersonationFinding {
  detected: boolean;
  claimedBrand?: string;
  officialDomains?: string[];
  actualDomain?: string;
  severity?: 'high' | 'critical';
  details?: string;
}

export interface RedirectAnalysisFinding {
  isShortened: boolean;
  resolved: boolean;
  finalUrl?: string;
  hops: RedirectHop[];
  domainChanged: boolean;
  error?: string;
}

export interface DomainTechnicalDetails {
  registrableDomain: string;
  subdomain: string;
  protocol: string;
  isHttps: boolean;
  isIpAddress: boolean;
  isPunycode: boolean;
  decodedHostname: string;
  hasUserInfo: boolean;
  pathDepth: number;
  queryParamsCount: number;
  port: string;
}

export interface LinkCheckReport {
  target: {
    originalUrl: string;
    normalizedUrl: string;
    components: UrlComponents;
  };
  verdict: LinkCheckVerdict;
  riskScore: number; // 0 to 100
  riskBand: RiskBand;
  summary: string;
  primaryReasons: string[];
  signals: SecuritySignal[];
  impersonation?: BrandImpersonationFinding;
  redirectAnalysis?: RedirectAnalysisFinding;
  providers: ProviderResult[];
  domainDetails: DomainTechnicalDetails;
  recommendation: string;
  disclaimer: string;
  checkedAt: string;
}
