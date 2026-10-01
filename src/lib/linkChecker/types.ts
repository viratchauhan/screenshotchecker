import type { NormalizedUrlResult } from './urlNormalizer';

export type LocalMatchLevel =
  | 'EXACT_URL'
  | 'EXACT_HOSTNAME'
  | 'REGISTRABLE_DOMAIN'
  | 'NONE';

export type DatasetLabel = 'bad' | 'good' | 'conflict' | 'unknown';

export type LocalDatasetVerdict =
  | 'KNOWN_BAD'
  | 'GOOD'
  | 'CONFLICTING'
  | 'NO_LOCAL_MATCH'
  | 'DATASET_UNAVAILABLE'
  | 'INVALID_URL';

export interface LocalVerificationReport {
  target: NormalizedUrlResult;
  matched: boolean;
  matchLevel: LocalMatchLevel;
  matchedValue?: string;
  label: DatasetLabel;
  verdict: LocalDatasetVerdict;
  verdictTitle: string;
  summary: string;
  explanation: string;
  source: string;
  domainDetails: {
    registrableDomain: string;
    hostname: string;
    subdomain: string;
    protocol: string;
    pathname: string;
    isIpAddress: boolean;
    port: string;
  };
  checkedAt: string;
}

export interface MultiUrlVerificationReport {
  messageContext?: string;
  extractedUrls: string[];
  reports: LocalVerificationReport[];
}

export interface DatasetManifest {
  source: string;
  totalRecords: number;
  uniqueUrls: number;
  uniqueHostnames: number;
  uniqueRegistrableDomains: number;
  labels: {
    bad: number;
    good: number;
  };
  generatedAt: string;
  version: string;
}
