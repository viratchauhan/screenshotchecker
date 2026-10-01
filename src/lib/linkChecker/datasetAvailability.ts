import type { NormalizedUrlResult } from './urlNormalizer';
import type { LocalVerificationReport } from './types';

type Label = 'bad' | 'good' | 'conflict';
export interface DatasetShard {
  urls: Record<string, Label>;
  hosts: Record<string, Label>;
  domains: Record<string, Label>;
}

/** A successful HTTP/JSON response is not necessarily a usable dataset. */
export function isDatasetShard(value: unknown): value is DatasetShard {
  if (!value || typeof value !== 'object') return false;
  return ['urls', 'hosts', 'domains'].every(key => {
    const map = (value as Record<string, unknown>)[key];
    return map !== null && typeof map === 'object' && !Array.isArray(map) &&
      Object.values(map).every(label => label === 'bad' || label === 'good' || label === 'conflict');
  });
}

export function datasetUnavailable(target: NormalizedUrlResult, source: string, checkedAt: string): LocalVerificationReport {
  return {
    target, source, checkedAt,
    matched: false,
    matchLevel: 'NONE',
    label: 'unknown',
    verdict: 'DATASET_UNAVAILABLE',
    verdictTitle: 'Local Dataset Unavailable',
    summary: 'The local dataset check could not be completed.',
    explanation: 'Required dataset records were unavailable or invalid. This is an incomplete check, not a no-match or safety result. Retry when the dataset is available and verify the destination independently.',
    domainDetails: {
      registrableDomain: target.registrableDomain,
      hostname: target.hostname,
      subdomain: target.subdomain || '(none)',
      protocol: target.protocol.toUpperCase(),
      pathname: target.pathname,
      isIpAddress: target.isIpAddress,
      port: target.port,
    },
  };
}
