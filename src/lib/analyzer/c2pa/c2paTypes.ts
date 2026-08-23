export type C2PAValidationStatus = 'VALID' | 'INVALID' | 'UNTRUSTED' | 'UNKNOWN';

export type C2PAPresenceState =
  | 'C2PA_PRESENT'
  | 'C2PA_NOT_FOUND'
  | 'C2PA_READ_ERROR'
  | 'C2PA_VALIDATION_ERROR'
  | 'C2PA_UNSUPPORTED_FORMAT';

export type C2PAAIProvenanceState =
  | 'VERIFIED_AI_GENERATED'
  | 'VERIFIED_AI_EDITED'
  | 'NO_AI_PROVENANCE'
  | 'UNKNOWN';

export type C2PAProvenanceVerdict =
  | 'VERIFIED_AI_PROVENANCE'
  | 'VERIFIED_AI_EDITING'
  | 'VERIFIED_CAMERA_PROVENANCE'
  | 'VERIFIED_EDIT_HISTORY'
  | 'C2PA_PRESENT_UNTRUSTED'
  | 'NO_C2PA'
  | 'C2PA_INCONCLUSIVE';

export interface C2PAParsedAction {
  action: string;
  softwareAgent?: string;
  description?: string;
  timestamp?: string;
  isAI: boolean;
  changes?: string[];
}

export interface C2PAParsedIngredient {
  title?: string;
  format?: string;
  instanceId?: string;
  relationship?: string;
  thumbnailUrl?: string;
}

export interface C2PAActiveManifest {
  title?: string | null;
  claimGenerator?: string | null;
  claimGeneratorVersion?: string | null;
  instanceId?: string | null;
  format?: string | null;
  created?: string | null;
  signatureIssuer?: string | null;
  signingTime?: string | null;
  label?: string | null;
}

export interface C2PASourceInfo {
  digitalSourceType?: string | null;
  digitalSourceLabel?: string | null;
  softwareAgent?: string | null;
  device?: string | null;
}

export interface C2PAAIAnalysis {
  isAIGenerated: boolean;
  isAIEdited: boolean;
  aiState: C2PAAIProvenanceState;
  aiSummary: string;
  signals: string[];
}

export interface C2PAValidationDetails {
  status: C2PAValidationStatus;
  isValid: boolean;
  isTrusted: boolean;
  stateDescription: string;
  errors: string[];
  warnings: string[];
}

export interface C2PANormalizedResult {
  presence: C2PAPresenceState;
  present: boolean;
  provenanceVerdict: C2PAProvenanceVerdict;
  validation: C2PAValidationDetails;
  activeManifest: C2PAActiveManifest;
  source: C2PASourceInfo;
  ai: C2PAAIAnalysis;
  actions: C2PAParsedAction[];
  ingredients: C2PAParsedIngredient[];
  rawAssertions: Array<{ label: string; data: any }>;
  summaryExplanation: string;
  technicalDetails: {
    manifestCount: number;
    activeLabel?: string | null;
    signatureAlg?: string | null;
    rawJsonSnippet?: string;
  };
}
