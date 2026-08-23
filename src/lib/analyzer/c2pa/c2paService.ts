import type { C2PANormalizedResult } from './c2paTypes';
import { parseC2PAManifestStore } from './c2paParser';

let c2paInstancePromise: Promise<any> | null = null;

async function getC2paSdk(): Promise<any> {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') {
    throw new Error('C2PA Web Worker is only available in browser environments.');
  }

  if (!c2paInstancePromise) {
    c2paInstancePromise = (async () => {
      try {
        const { createC2pa } = await import('@contentauth/c2pa-web/inline');
        return await createC2pa();
      } catch (err) {
        console.warn('C2PA Web SDK initialization failed or unsupported in current environment:', err);
        c2paInstancePromise = null;
        throw err;
      }
    })();
  }

  return c2paInstancePromise;
}

export async function analyzeC2PA(file: File | Blob): Promise<C2PANormalizedResult> {
  const mimeType = file.type || 'image/jpeg';

  // 1. Supported file formats check
  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/tiff', 'image/heic', 'image/svg+xml'];
  if (file.type && !supportedTypes.includes(file.type.toLowerCase())) {
    return createUnsupportedResult(file.type);
  }

  try {
    const c2pa = await getC2paSdk();
    
    // Read directly from original Blob bytes
    const reader = await c2pa.reader.fromBlob(mimeType, file);

    if (!reader) {
      return createNotFoundResult();
    }

    try {
      const manifestStore = await reader.manifestStore();
      const activeManifest = await reader.activeManifest().catch(() => null);

      if (!manifestStore || !manifestStore.manifests || Object.keys(manifestStore.manifests).length === 0) {
        return createNotFoundResult();
      }

      return parseC2PAManifestStore(manifestStore, activeManifest);
    } finally {
      // Always free reader memory
      try {
        await reader.free();
      } catch (e) {
        // Ignored
      }
    }
  } catch (err: any) {
    // If worker or C2PA initialization threw
    const errMsg = err?.message || String(err);
    if (errMsg.includes('browser') || errMsg.includes('Worker')) {
      return createNotFoundResult('C2PA WebAssembly engine is active in browser sessions.');
    }
    return createErrorResult(errMsg);
  }
}

export function createNotFoundResult(customMsg?: string): C2PANormalizedResult {
  return {
    presence: 'C2PA_NOT_FOUND',
    present: false,
    provenanceVerdict: 'NO_C2PA',
    validation: {
      status: 'UNKNOWN',
      isValid: false,
      isTrusted: false,
      stateDescription: 'No Content Credentials were found in this file.',
      errors: [],
      warnings: [],
    },
    activeManifest: {
      title: null,
      claimGenerator: null,
      claimGeneratorVersion: null,
      instanceId: null,
      format: null,
      created: null,
      signatureIssuer: null,
      signingTime: null,
      label: null,
    },
    source: {
      digitalSourceType: null,
      digitalSourceLabel: null,
      softwareAgent: null,
      device: null,
    },
    ai: {
      isAIGenerated: false,
      isAIEdited: false,
      aiState: 'NO_AI_PROVENANCE',
      aiSummary: 'No Content Credentials were found in this file. This does not prove the image is real or AI-generated.',
      signals: [],
    },
    actions: [],
    ingredients: [],
    rawAssertions: [],
    summaryExplanation: customMsg || 'No verifiable C2PA Content Credentials found in this file.',
    technicalDetails: {
      manifestCount: 0,
      activeLabel: null,
      signatureAlg: null,
    },
  };
}

export function createUnsupportedResult(format: string): C2PANormalizedResult {
  return {
    presence: 'C2PA_UNSUPPORTED_FORMAT',
    present: false,
    provenanceVerdict: 'NO_C2PA',
    validation: {
      status: 'UNKNOWN',
      isValid: false,
      isTrusted: false,
      stateDescription: `The file format (${format}) is not supported for C2PA provenance extraction.`,
      errors: [`Unsupported format: ${format}`],
      warnings: [],
    },
    activeManifest: {
      title: null,
      claimGenerator: null,
      claimGeneratorVersion: null,
      instanceId: null,
      format: null,
      created: null,
      signatureIssuer: null,
      signingTime: null,
      label: null,
    },
    source: {
      digitalSourceType: null,
      digitalSourceLabel: null,
      softwareAgent: null,
      device: null,
    },
    ai: {
      isAIGenerated: false,
      isAIEdited: false,
      aiState: 'NO_AI_PROVENANCE',
      aiSummary: 'File format does not support C2PA inspection.',
      signals: [],
    },
    actions: [],
    ingredients: [],
    rawAssertions: [],
    summaryExplanation: `Content Credentials inspection is unsupported for ${format} files.`,
    technicalDetails: {
      manifestCount: 0,
      activeLabel: null,
      signatureAlg: null,
    },
  };
}

export function createErrorResult(errMsg: string): C2PANormalizedResult {
  return {
    presence: 'C2PA_READ_ERROR',
    present: false,
    provenanceVerdict: 'C2PA_INCONCLUSIVE',
    validation: {
      status: 'UNKNOWN',
      isValid: false,
      isTrusted: false,
      stateDescription: `Could not read Content Credentials: ${errMsg}`,
      errors: [errMsg],
      warnings: [],
    },
    activeManifest: {
      title: null,
      claimGenerator: null,
      claimGeneratorVersion: null,
      instanceId: null,
      format: null,
      created: null,
      signatureIssuer: null,
      signingTime: null,
      label: null,
    },
    source: {
      digitalSourceType: null,
      digitalSourceLabel: null,
      softwareAgent: null,
      device: null,
    },
    ai: {
      isAIGenerated: false,
      isAIEdited: false,
      aiState: 'UNKNOWN',
      aiSummary: 'Error encountered while inspecting Content Credentials.',
      signals: [],
    },
    actions: [],
    ingredients: [],
    rawAssertions: [],
    summaryExplanation: 'An error occurred while reading Content Credentials from the uploaded file.',
    technicalDetails: {
      manifestCount: 0,
      activeLabel: null,
      signatureAlg: null,
    },
  };
}
