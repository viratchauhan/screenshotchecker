import { TEST_FIXTURES } from '../dataset/fixtures';
import { classifyHierarchical } from '../screenshotClassifier';
import { extractVisualFingerprint } from '../visualFingerprint';
import { extractEntitiesDetailed } from '../entityExtractor';
import { extractClaims } from '../claimExtractor';
import { extractRequestedActions } from '../actionExtractor';
import { analyzeFinancialIntelligence } from '../financialAnalyzer';
import { analyzeChannelContext } from '../channelAnalyzers';
import { evaluateExplainableRisks } from '../contextualRiskEngine';
import { assessAuthenticity } from '../authenticityAssessment';
import { scanLinks } from '../linkScanner';

console.log('================================================================');
console.log('   SCREENSHOT INTELLIGENCE ENGINE — 25-CASE AUTOMATED TEST SUITE');
console.log('================================================================\n');

let passedCount = 0;
let failedCount = 0;

for (let i = 0; i < TEST_FIXTURES.length; i++) {
  const fixture = TEST_FIXTURES[i];
  console.log(`[Test ${i + 1}/25] ${fixture.name} (${fixture.category})`);

  try {
    const ocrMock = { text: fixture.text, confidence: 90, words: [], lines: fixture.text.split('\n') };
    const imgInfoMock = { name: `${fixture.id}.png`, sizeBytes: 102400, width: 750, height: 1000, aspectRatio: '3:4', mimeType: 'image/png' };

    // 1. Visual Fingerprint
    const visual = extractVisualFingerprint(imgInfoMock, ocrMock);

    // 2. Classification
    const classification = classifyHierarchical(fixture.text, visual);

    // 3. Entities
    const entityResult = extractEntitiesDetailed(fixture.text);

    // 4. Claims
    const claims = extractClaims(fixture.text, classification.topCategory, entityResult);

    // 5. Actions
    const actions = extractRequestedActions(fixture.text, entityResult);

    // 6. Financial & Consistency
    const { financial, consistency } = analyzeFinancialIntelligence(
      fixture.text,
      classification.topCategory,
      entityResult
    );

    // 7. Channel & Links
    const links = scanLinks(fixture.text);
    const channel = analyzeChannelContext(fixture.text, classification.topCategory, entityResult, links.findings);

    // 8. Risk Engine
    const riskPatterns = evaluateExplainableRisks(
      classification.topCategory,
      entityResult.entities,
      claims,
      actions,
      financial,
      consistency,
      channel,
      links.findings
    );

    // 9. Authenticity
    const authenticity = assessAuthenticity(
      classification.topCategory,
      claims,
      financial,
      consistency,
      riskPatterns
    );

    // Assertions
    if (classification.topCategory !== fixture.expectedTopCategory) {
      throw new Error(
        `TopCategory mismatch: expected "${fixture.expectedTopCategory}", got "${classification.topCategory}"`
      );
    }

    if (claims[0]?.claimType !== fixture.expectedClaimEvent) {
      throw new Error(
        `Claim event mismatch: expected "${fixture.expectedClaimEvent}", got "${claims[0]?.claimType}"`
      );
    }

    if (actions[0]?.actionType !== fixture.expectedAction) {
      throw new Error(
        `RequestedAction mismatch: expected "${fixture.expectedAction}", got "${actions[0]?.actionType}"`
      );
    }

    if (authenticity.status !== fixture.expectedAuthenticity) {
      throw new Error(
        `Authenticity mismatch: expected "${fixture.expectedAuthenticity}", got "${authenticity.status}"`
      );
    }

    if (fixture.expectedInconsistency && consistency.isConsistent) {
      throw new Error(`Expected internal inconsistency, but audit marked isConsistent: true`);
    }

    console.log(`  ✓ TopCategory: ${classification.topCategory} (${classification.subtype})`);
    console.log(`  ✓ Claim: ${claims[0]?.event} (${claims[0]?.primaryClaim.substring(0, 60)}...)`);
    console.log(`  ✓ Action: ${actions[0]?.label}`);
    console.log(`  ✓ Authenticity: ${authenticity.status} — "${authenticity.headline}"`);
    console.log(`  ✓ PASS\n`);
    passedCount++;
  } catch (err: any) {
    console.error(`  ✗ FAIL: ${err.message}\n`);
    failedCount++;
  }
}

console.log('================================================================');
console.log(`SUMMARY: ${passedCount}/25 PASSED, ${failedCount} FAILED`);
console.log('================================================================');

if (failedCount > 0) {
  process.exit(1);
}
