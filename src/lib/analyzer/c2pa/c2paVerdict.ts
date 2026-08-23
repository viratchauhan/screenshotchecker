import type { C2PANormalizedResult } from './c2paTypes';
import type { ForensicSignal, AIMetaVerdict, EvidenceStrength } from '../aiImageForensicsEngine';

export function extractC2PAForensicSignals(c2pa: C2PANormalizedResult): {
  signals: ForensicSignal[];
  syntheticBonus: number;
  editingBonus: number;
  captureBonus: number;
} {
  const signals: ForensicSignal[] = [];
  let syntheticBonus = 0;
  let editingBonus = 0;
  let captureBonus = 0;

  if (!c2pa.present) {
    signals.push({
      category: 'PROVENANCE',
      signal: 'No Content Credentials (C2PA)',
      strength: 'LOW',
      description: 'No cryptographic C2PA Content Credentials or provenance manifest found in the image file.',
      evidence: 'Absence of C2PA is normal for web exports and does not prove authentic or AI origin.',
    });
    return { signals, syntheticBonus, editingBonus, captureBonus };
  }

  // 1. Validation failed
  if (!c2pa.validation.isValid) {
    signals.push({
      category: 'PROVENANCE',
      signal: 'C2PA Validation Failed',
      strength: 'MEDIUM',
      description: 'Content Credentials manifest was detected, but cryptographic signature validation failed.',
      evidence: c2pa.validation.errors.join(', ') || 'Signature validation failure',
    });
    return { signals, syntheticBonus, editingBonus, captureBonus };
  }

  // 2. Verified AI Generated
  if (c2pa.ai.isAIGenerated) {
    syntheticBonus += 85;
    signals.push({
      category: 'SYNTHETIC',
      signal: 'Verified AI-Generated (C2PA)',
      strength: 'HIGH',
      description: `Cryptographically verified Content Credentials declare this media was produced by generative AI${c2pa.activeManifest.claimGenerator ? ` (${c2pa.activeManifest.claimGenerator})` : ''}.`,
      evidence: c2pa.ai.signals.join(' | ') || c2pa.ai.aiSummary,
    });
  }

  // 3. Verified AI Edited
  if (c2pa.ai.isAIEdited && !c2pa.ai.isAIGenerated) {
    editingBonus += 60;
    syntheticBonus += 30;
    signals.push({
      category: 'EDITING',
      signal: 'Verified AI-Assisted Editing (C2PA)',
      strength: 'HIGH',
      description: `Content Credentials record AI-assisted editing or generative transformation${c2pa.activeManifest.claimGenerator ? ` via ${c2pa.activeManifest.claimGenerator}` : ''}.`,
      evidence: c2pa.ai.signals.join(' | ') || c2pa.ai.aiSummary,
    });
  }

  // 4. Verified Camera Capture
  if (c2pa.provenanceVerdict === 'VERIFIED_CAMERA_PROVENANCE') {
    captureBonus += 60;
    signals.push({
      category: 'CAPTURE',
      signal: 'Verified Camera Provenance (C2PA)',
      strength: 'HIGH',
      description: `Cryptographically signed Content Credentials verify original physical camera capture provenance.`,
      evidence: `Issuer: ${c2pa.activeManifest.signatureIssuer || 'Verified Signer'}`,
    });
  }

  // 5. Documented Editing History
  if (c2pa.provenanceVerdict === 'VERIFIED_EDIT_HISTORY' && !c2pa.ai.isAIGenerated) {
    editingBonus += 35;
    signals.push({
      category: 'EDITING',
      signal: 'Verified Edit History (C2PA)',
      strength: 'MEDIUM',
      description: `Content Credentials document a structured digital editing chain (${c2pa.actions.map((a) => a.action).join(' → ')}).`,
      evidence: `Generator: ${c2pa.activeManifest.claimGenerator || 'Unknown tool'}`,
    });
  }

  return { signals, syntheticBonus, editingBonus, captureBonus };
}
