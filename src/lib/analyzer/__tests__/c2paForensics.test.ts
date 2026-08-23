import { parseC2PAManifestStore } from '../c2pa/c2paParser';
import { extractC2PAForensicSignals } from '../c2pa/c2paVerdict';
import { createNotFoundResult, createUnsupportedResult, createErrorResult } from '../c2pa/c2paService';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runC2PATests() {
  console.log('================================================================');
  console.log('--- RUNNING C2PA CONTENT CREDENTIALS FORENSIC TEST SUITE ---');
  console.log('================================================================\n');

  // --------------------------------------------------------------------------
  // TEST 1: Valid C2PA AI-Generated Manifest (trainedAlgorithmicMedia)
  // --------------------------------------------------------------------------
  console.log('[Test 1] Valid C2PA Manifest with Generative AI Provenance:');
  const mockAiManifestStore = {
    validation_state: 'Trusted',
    manifests: {
      'urn:c2pa:adobe:123': {
        title: 'ai_artwork.jpg',
        claim_generator: 'Adobe Firefly / DALL-E',
        claim_generator_info: [{ name: 'Adobe Firefly', version: '2.0' }],
        assertions: [
          {
            label: 'c2pa.actions.v2',
            data: {
              actions: [
                {
                  action: 'c2pa.created',
                  softwareAgent: { name: 'Adobe Firefly' },
                  description: 'Created with Generative AI model',
                },
              ],
            },
          },
          {
            label: 'c2pa.digital_source_type',
            data: {
              digitalSourceType: 'http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia',
            },
          },
        ],
        ingredients: [
          {
            title: 'Base Prompt Embedding',
            relationship: 'parentOf',
          },
        ],
      },
    },
  };

  const activeAiManifest = mockAiManifestStore.manifests['urn:c2pa:adobe:123'];
  const res1 = parseC2PAManifestStore(mockAiManifestStore, activeAiManifest);

  assert(res1.present === true, 'C2PA manifest presence is true');
  assert(res1.validation.isValid === true, 'Validation isValid is true');
  assert(res1.validation.isTrusted === true, 'Validation isTrusted is true');
  assert(res1.ai.isAIGenerated === true, 'ai.isAIGenerated detected');
  assert(res1.provenanceVerdict === 'VERIFIED_AI_PROVENANCE', `Verdict is VERIFIED_AI_PROVENANCE (got: ${res1.provenanceVerdict})`);
  assert(res1.actions.length >= 1, `Extracted ${res1.actions.length} actions`);
  assert(res1.ingredients.length >= 1, `Extracted ${res1.ingredients.length} ingredients`);

  const signals1 = extractC2PAForensicSignals(res1);
  assert(signals1.syntheticBonus >= 80, `Synthetic bonus is >= 80 (got: ${signals1.syntheticBonus})`);
  assert(signals1.signals.some((s) => s.category === 'SYNTHETIC' && s.strength === 'HIGH'), 'Generated HIGH synthetic signal');

  // --------------------------------------------------------------------------
  // TEST 2: Valid C2PA AI-Assisted Editing (Generative Fill)
  // --------------------------------------------------------------------------
  console.log('\n[Test 2] Valid C2PA Manifest with AI-Assisted Editing:');
  const mockAiEditManifestStore = {
    validation_state: 'Valid',
    manifests: {
      'urn:c2pa:photoshop:456': {
        title: 'retouched_portrait.png',
        claim_generator: 'Adobe Photoshop 2026',
        assertions: [
          {
            label: 'c2pa.actions',
            data: {
              actions: [
                {
                  action: 'c2pa.opened',
                  description: 'Original camera capture opened',
                },
                {
                  action: 'c2pa.ai_generated',
                  softwareAgent: 'Photoshop Generative Fill',
                  description: 'Generative fill applied to background',
                },
              ],
            },
          },
        ],
      },
    },
  };

  const activeAiEdit = mockAiEditManifestStore.manifests['urn:c2pa:photoshop:456'];
  const res2 = parseC2PAManifestStore(mockAiEditManifestStore, activeAiEdit);

  assert(res2.present === true, 'Manifest present');
  assert(res2.ai.isAIEdited === true, 'ai.isAIEdited detected');
  assert(res2.provenanceVerdict === 'VERIFIED_AI_EDITING', `Verdict is VERIFIED_AI_EDITING (got: ${res2.provenanceVerdict})`);

  // --------------------------------------------------------------------------
  // TEST 3: Valid C2PA Camera Provenance
  // --------------------------------------------------------------------------
  console.log('\n[Test 3] Valid C2PA Manifest with Camera Provenance:');
  const mockCameraManifestStore = {
    validation_state: 'Trusted',
    manifests: {
      'urn:c2pa:leica:789': {
        title: 'street_photography.dng',
        claim_generator: 'Leica M11-P Content Credentials',
        assertions: [
          {
            label: 'c2pa.digital_source_type',
            data: {
              digitalSourceType: 'http://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture',
            },
          },
        ],
      },
    },
  };

  const activeCamera = mockCameraManifestStore.manifests['urn:c2pa:leica:789'];
  const res3 = parseC2PAManifestStore(mockCameraManifestStore, activeCamera);

  assert(res3.provenanceVerdict === 'VERIFIED_CAMERA_PROVENANCE', `Verdict is VERIFIED_CAMERA_PROVENANCE (got: ${res3.provenanceVerdict})`);
  const signals3 = extractC2PAForensicSignals(res3);
  assert(signals3.captureBonus >= 50, `Capture bonus is >= 50 (got: ${signals3.captureBonus})`);

  // --------------------------------------------------------------------------
  // TEST 4: Invalid / Tampered C2PA Manifest
  // --------------------------------------------------------------------------
  console.log('\n[Test 4] Invalid / Tampered C2PA Manifest:');
  const mockInvalidManifestStore = {
    validation_state: 'Invalid',
    validation_results: [
      {
        code: 'claimSignature.mismatch',
        explanation: 'The manifest signature does not match image bytes.',
      },
    ],
    manifests: {
      'urn:c2pa:tampered:000': {
        title: 'tampered.jpg',
      },
    },
  };

  const activeInvalid = mockInvalidManifestStore.manifests['urn:c2pa:tampered:000'];
  const res4 = parseC2PAManifestStore(mockInvalidManifestStore, activeInvalid);

  assert(res4.present === true, 'Manifest presence detected');
  assert(res4.validation.isValid === false, 'validation.isValid is false');
  assert(res4.provenanceVerdict === 'C2PA_PRESENT_UNTRUSTED', `Verdict is C2PA_PRESENT_UNTRUSTED (got: ${res4.provenanceVerdict})`);
  const signals4 = extractC2PAForensicSignals(res4);
  assert(signals4.syntheticBonus === 0, 'No synthetic bonus on untrusted manifest');

  // --------------------------------------------------------------------------
  // TEST 5: Image With No C2PA Metadata
  // --------------------------------------------------------------------------
  console.log('\n[Test 5] Image With No C2PA Metadata (Standard Web Image):');
  const res5 = createNotFoundResult();

  assert(res5.present === false, 'present is false');
  assert(res5.presence === 'C2PA_NOT_FOUND', `presence is C2PA_NOT_FOUND (got: ${res5.presence})`);
  assert(res5.provenanceVerdict === 'NO_C2PA', `Verdict is NO_C2PA (got: ${res5.provenanceVerdict})`);
  assert(res5.summaryExplanation.includes('No verifiable'), 'Honest explanation provided');

  // --------------------------------------------------------------------------
  // TEST 6: Unsupported Format Graceful Handling
  // --------------------------------------------------------------------------
  console.log('\n[Test 6] Unsupported Format Graceful Handling:');
  const res6 = createUnsupportedResult('video/mp4');

  assert(res6.present === false, 'present is false');
  assert(res6.presence === 'C2PA_UNSUPPORTED_FORMAT', 'presence is C2PA_UNSUPPORTED_FORMAT');

  console.log('\n================================================================');
  console.log('✅ ALL C2PA CONTENT CREDENTIALS UNIT TESTS PASSED 100%!');
  console.log('================================================================\n');
}

runC2PATests().catch((err) => {
  console.error(err);
  process.exit(1);
});
