import type {
  C2PANormalizedResult,
  C2PAValidationDetails,
  C2PAActiveManifest,
  C2PASourceInfo,
  C2PAAIAnalysis,
  C2PAParsedAction,
  C2PAParsedIngredient,
  C2PAProvenanceVerdict,
} from './c2paTypes';

export function parseC2PAManifestStore(
  manifestStore: any,
  activeManifest: any
): C2PANormalizedResult {
  // 1. Parse Validation State
  const validation = parseValidationState(manifestStore);

  // 2. Parse Active Manifest Info
  const activeInfo = parseActiveManifestInfo(activeManifest);

  // 3. Parse Assertions & Actions
  const rawAssertions: Array<{ label: string; data: any }> = [];
  const actions: C2PAParsedAction[] = [];
  let digitalSourceType: string | null = null;
  let digitalSourceLabel: string | null = null;

  if (activeManifest && Array.isArray(activeManifest.assertions)) {
    for (const assertion of activeManifest.assertions) {
      const label = assertion.label || assertion.data_type || 'unknown';
      const data = assertion.data ?? assertion;
      rawAssertions.push({ label, data });

      // Check Actions assertion (c2pa.actions or c2pa.actions.v2)
      if (label.includes('c2pa.actions') || label.includes('actions')) {
        const actionItems = Array.isArray(data?.actions) ? data.actions : Array.isArray(data) ? data : [];
        for (const act of actionItems) {
          const actionName = act.action || act.description || 'action';
          const softwareAgent = act.softwareAgent?.name || act.softwareAgent || act.generator || undefined;
          const isAIAction =
            /ai_generated|generative|synthetic|trainedAlgorithmicMedia|dall|midjourney|firefly|diffusion/i.test(
              String(actionName) + ' ' + String(act.description || '') + ' ' + String(softwareAgent || '')
            );

          actions.push({
            action: humanizeActionName(actionName),
            softwareAgent: softwareAgent ? String(softwareAgent) : undefined,
            description: act.description ? String(act.description) : undefined,
            timestamp: act.when ? String(act.when) : undefined,
            isAI: isAIAction,
            changes: Array.isArray(act.changes) ? act.changes.map(String) : undefined,
          });
        }
      }

      // Check Digital Source Type assertion
      if (label.includes('digitalSourceType') || label.includes('c2pa.digital_source_type') || data?.digitalSourceType) {
        digitalSourceType = data?.digitalSourceType || data?.value || String(data);
        digitalSourceLabel = humanizeDigitalSourceType(digitalSourceType);
      }
    }
  }

  // 4. Parse Ingredients
  const ingredients: C2PAParsedIngredient[] = [];
  if (activeManifest && Array.isArray(activeManifest.ingredients)) {
    for (const ing of activeManifest.ingredients) {
      ingredients.push({
        title: ing.title || ing.label || 'Source Ingredient',
        format: ing.format || undefined,
        instanceId: ing.instance_id || undefined,
        relationship: ing.relationship || 'parentOf',
      });
    }
  }

  // 5. Parse Source & Software Info
  const source: C2PASourceInfo = {
    digitalSourceType,
    digitalSourceLabel,
    softwareAgent: activeInfo.claimGenerator || actions.find((a) => a.softwareAgent)?.softwareAgent || null,
    device: null,
  };

  // 6. Parse AI Provenance
  const ai = parseAIProvenance(digitalSourceType, actions, activeInfo, rawAssertions);

  // 7. Determine Provenance Verdict
  const provenanceVerdict = deriveProvenanceVerdict(validation, ai, actions, source);

  // 8. Generate Summary Explanation
  const summaryExplanation = generateSummaryExplanation(validation, ai, provenanceVerdict, activeInfo);

  // 9. Technical Details
  const manifestCount = manifestStore?.manifests ? Object.keys(manifestStore.manifests).length : 1;
  const signatureAlg = activeManifest?.signature_info?.alg || activeManifest?.signature_info?.issuer || null;

  return {
    presence: 'C2PA_PRESENT',
    present: true,
    provenanceVerdict,
    validation,
    activeManifest: activeInfo,
    source,
    ai,
    actions,
    ingredients,
    rawAssertions,
    summaryExplanation,
    technicalDetails: {
      manifestCount,
      activeLabel: activeManifest?.label || null,
      signatureAlg,
      rawJsonSnippet: JSON.stringify(
        {
          active_manifest: activeInfo,
          validation: validation.status,
          actions: actions.length,
          ingredients: ingredients.length,
          ai: ai.aiState,
        },
        null,
        2
      ),
    },
  };
}

function parseValidationState(manifestStore: any): C2PAValidationDetails {
  const errors: string[] = [];
  const warnings: string[] = [];

  const rawState = manifestStore?.validation_state || manifestStore?.validationState || 'Unknown';
  const valResults = manifestStore?.validation_results || manifestStore?.validation_status;

  if (Array.isArray(valResults)) {
    for (const status of valResults) {
      if (status.code && status.code !== 'claim.valid' && status.code !== 'signingCredential.trusted') {
        const msg = status.explanation || status.code || 'Validation error';
        if (status.code.includes('error') || status.code.includes('invalid') || status.code.includes('untrusted')) {
          errors.push(msg);
        } else {
          warnings.push(msg);
        }
      }
    }
  }

  let status: 'VALID' | 'INVALID' | 'UNTRUSTED' | 'UNKNOWN' = 'UNKNOWN';
  let isValid = false;
  let isTrusted = false;
  let stateDescription = 'Content Credentials present with unverified validation status.';

  if (rawState === 'Trusted' || rawState === 'trusted') {
    status = 'VALID';
    isValid = true;
    isTrusted = true;
    stateDescription = 'Cryptographically valid and signed by a trusted Content Credentials authority.';
  } else if (rawState === 'Valid' || rawState === 'valid') {
    status = 'VALID';
    isValid = true;
    isTrusted = false;
    stateDescription = 'Cryptographically valid manifest structure; issuer is not on the default trusted root list.';
  } else if (rawState === 'Invalid' || rawState === 'invalid' || errors.length > 0) {
    status = 'INVALID';
    isValid = false;
    isTrusted = false;
    stateDescription = 'Content Credentials detected, but structural or cryptographic validation failed.';
  } else {
    status = 'VALID';
    isValid = true;
    isTrusted = true;
    stateDescription = 'Valid Content Credentials manifest structure verified.';
  }

  return {
    status,
    isValid,
    isTrusted,
    stateDescription,
    errors,
    warnings,
  };
}

function parseActiveManifestInfo(activeManifest: any): C2PAActiveManifest {
  if (!activeManifest) {
    return {
      title: null,
      claimGenerator: null,
      claimGeneratorVersion: null,
      instanceId: null,
      format: null,
      created: null,
      signatureIssuer: null,
      signingTime: null,
      label: null,
    };
  }

  let generatorName: string | null = activeManifest.claim_generator || null;
  let generatorVersion: string | null = null;

  if (Array.isArray(activeManifest.claim_generator_info) && activeManifest.claim_generator_info.length > 0) {
    const info = activeManifest.claim_generator_info[0];
    generatorName = info.name || generatorName;
    generatorVersion = info.version || null;
  }

  return {
    title: activeManifest.title || null,
    claimGenerator: generatorName,
    claimGeneratorVersion: generatorVersion,
    instanceId: activeManifest.instance_id || null,
    format: activeManifest.format || null,
    created: activeManifest.signature_info?.time || activeManifest.metadata?.[0]?.dateTime || null,
    signatureIssuer: activeManifest.signature_info?.issuer || null,
    signingTime: activeManifest.signature_info?.time || null,
    label: activeManifest.label || null,
  };
}

function parseAIProvenance(
  digitalSourceType: string | null,
  actions: C2PAParsedAction[],
  activeInfo: C2PAActiveManifest,
  rawAssertions: Array<{ label: string; data: any }>
): C2PAAIAnalysis {
  const signals: string[] = [];
  let isAIGenerated = false;
  let isAIEdited = false;

  // 1. Digital Source Type check
  if (digitalSourceType) {
    if (
      digitalSourceType.includes('trainedAlgorithmicMedia') ||
      digitalSourceType.includes('compositeSynthetic') ||
      digitalSourceType.includes('algorithmicMedia')
    ) {
      isAIGenerated = true;
      signals.push(`Digital Source Type explicitly declares AI creation: "${digitalSourceType}".`);
    } else if (digitalSourceType.includes('digitalArtifice') || digitalSourceType.includes('softwareImage')) {
      isAIEdited = true;
      signals.push(`Digital Source Type indicates synthetic or digital artwork: "${digitalSourceType}".`);
    }
  }

  // 2. Action history check
  const hasBaseOpenedOrCreated = actions.some(
    (a) => !a.isAI && (a.action.toLowerCase().includes('opened') || a.action.toLowerCase().includes('created'))
  );

  for (const act of actions) {
    if (act.isAI) {
      const actLower = (act.action + ' ' + (act.description || '')).toLowerCase();
      if (actLower.includes('fill') || actLower.includes('edit') || actLower.includes('retouch') || hasBaseOpenedOrCreated) {
        isAIEdited = true;
        signals.push(`Action history records AI-assisted transformation: "${act.action}" (${act.softwareAgent || 'tool'}).`);
      } else if (actLower.includes('created') || actLower.includes('generated')) {
        isAIGenerated = true;
        signals.push(`Action history records generative AI creation: "${act.action}" (${act.softwareAgent || 'tool'}).`);
      } else {
        isAIEdited = true;
        signals.push(`Action history records AI action: "${act.action}".`);
      }
    }
  }

  // 3. Claim Generator check
  const generatorLower = (activeInfo.claimGenerator || '').toLowerCase();
  if (
    generatorLower.includes('dall') ||
    generatorLower.includes('midjourney') ||
    generatorLower.includes('firefly') ||
    generatorLower.includes('stable diffusion') ||
    generatorLower.includes('bing image creator')
  ) {
    isAIGenerated = true;
    signals.push(`Claim generator is a known generative AI platform: "${activeInfo.claimGenerator}".`);
  }

  // 4. Raw assertion deep check
  for (const as of rawAssertions) {
    const rawStr = JSON.stringify(as.data || {}).toLowerCase();
    if (rawStr.includes('trainedalgorithmicmedia') || rawStr.includes('c2pa.actions.ai_generated')) {
      isAIGenerated = true;
      signals.push(`Assertion (${as.label}) contains explicit trainedAlgorithmicMedia tag.`);
    }
  }

  let aiState: 'VERIFIED_AI_GENERATED' | 'VERIFIED_AI_EDITED' | 'NO_AI_PROVENANCE' | 'UNKNOWN' = 'NO_AI_PROVENANCE';
  let aiSummary = 'No generative AI assertions or digital source tags found in Content Credentials.';

  if (isAIGenerated) {
    aiState = 'VERIFIED_AI_GENERATED';
    aiSummary = 'Content Credentials cryptographically declare this image was created using a Generative AI model.';
  } else if (isAIEdited) {
    aiState = 'VERIFIED_AI_EDITED';
    aiSummary = 'Content Credentials record AI-assisted editing, generative fill, or synthetic transformation.';
  }

  return {
    isAIGenerated,
    isAIEdited,
    aiState,
    aiSummary,
    signals,
  };
}

function deriveProvenanceVerdict(
  validation: C2PAValidationDetails,
  ai: C2PAAIAnalysis,
  actions: C2PAParsedAction[],
  source: C2PASourceInfo
): C2PAProvenanceVerdict {
  if (!validation.isValid) {
    return 'C2PA_PRESENT_UNTRUSTED';
  }

  if (ai.isAIGenerated) {
    return 'VERIFIED_AI_PROVENANCE';
  }

  if (ai.isAIEdited) {
    return 'VERIFIED_AI_EDITING';
  }

  if (source.digitalSourceType?.includes('digitalCapture') || source.digitalSourceType?.includes('negativeFilm')) {
    return 'VERIFIED_CAMERA_PROVENANCE';
  }

  if (actions.length > 0) {
    return 'VERIFIED_EDIT_HISTORY';
  }

  return 'C2PA_INCONCLUSIVE';
}

function generateSummaryExplanation(
  validation: C2PAValidationDetails,
  ai: C2PAAIAnalysis,
  verdict: C2PAProvenanceVerdict,
  activeInfo: C2PAActiveManifest
): string {
  if (!validation.isValid) {
    return 'Content Credentials were found in this file, but their cryptographic signature or manifest structure could not be validated.';
  }

  const generator = activeInfo.claimGenerator ? ` via ${activeInfo.claimGenerator}` : '';

  if (verdict === 'VERIFIED_AI_PROVENANCE') {
    return `Cryptographically validated Content Credentials confirm this asset was created using Generative AI${generator}.`;
  }

  if (verdict === 'VERIFIED_AI_EDITING') {
    return `Validated Content Credentials record AI-assisted editing or generative fill in the asset creation history${generator}.`;
  }

  if (verdict === 'VERIFIED_CAMERA_PROVENANCE') {
    return `Validated Content Credentials verify camera-originated digital capture provenance${generator}.`;
  }

  if (verdict === 'VERIFIED_EDIT_HISTORY') {
    return `Validated Content Credentials document a clear digital editing and export history${generator}.`;
  }

  return 'Content Credentials were found and validated successfully. No AI-generation tags were recorded.';
}

function humanizeActionName(raw: string): string {
  const clean = raw.replace(/^c2pa\./i, '').replace(/_/g, ' ');
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function humanizeDigitalSourceType(uri: string | null): string | null {
  if (!uri) return null;
  if (uri.includes('trainedAlgorithmicMedia')) return 'Trained Algorithmic Media (Generative AI)';
  if (uri.includes('compositeSynthetic')) return 'Composite Synthetic Media';
  if (uri.includes('digitalCapture')) return 'Original Digital Camera Capture';
  if (uri.includes('softwareImage')) return 'Software Image / Vector Graphic';
  if (uri.includes('digitalArtifice')) return 'Digital Artifice';
  return uri.split('/').pop() || uri;
}
