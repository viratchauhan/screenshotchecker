import type { AgenticInvestigationResult, InvestigationToolName, ToolExecutionOutput } from './reasoningSchema';
import type { MultimodalAIProvider } from './multimodalProvider';
import { LocalMultimodalObserver } from './multimodalProvider';
import { InvestigationToolRegistry } from './investigationTools';
import { extractImageInfo, loadImageFromDataUrl } from '../analyzer/imageInfo';
import { generateId } from '../utils/formatters';
import type { OverallStatus, StructuredEntity } from '../analyzer/types';
import { analyzeFraudWithMockLLM } from './mockFraudAnalyzer';

export class InvestigationAgent {
  private provider: MultimodalAIProvider;

  constructor(provider?: MultimodalAIProvider) {
    this.provider = provider || new LocalMultimodalObserver();
  }

  async investigate(
    file: File,
    dataUrl: string,
    onProgress?: (pct: number, status: string) => void
  ): Promise<AgenticInvestigationResult> {
    const id = generateId();
    const timestamp = Date.now();

    if (onProgress) onProgress(10, 'Agent inspecting visual image...');
    const img = await loadImageFromDataUrl(dataUrl);
    const imageInfo = await extractImageInfo(file, img);

    // STEP 1: OPEN-ENDED VISUAL OBSERVATION ("What am I looking at?")
    if (onProgress) onProgress(20, 'Formulating open-ended visual observation...');
    const initialObservation = await this.provider.observeImage(imageInfo);

    // STEP 2: INVESTIGATION PLANNING ("What evidence should I investigate?")
    if (onProgress) onProgress(30, 'Formulating dynamic investigation plan...');
    const plan = await this.provider.planInvestigation(initialObservation);

    // STEP 3: DYNAMIC TOOL SELECTION & EVIDENCE COLLECTION
    if (onProgress) onProgress(40, 'Executing planned investigation tools...');
    const toolOutputs: ToolExecutionOutput[] = [];
    const toolsInvoked: InvestigationToolName[] = [];

    // Shared investigation context accumulated progressively
    let ocrResult: any = null;
    let metadataResult: any = null;
    let linksResult: any = null;
    let privacyResult: any = null;
    let forensicsResult: any = null;
    let entitiesResult: StructuredEntity[] = [];

    for (let i = 0; i < plan.steps.length; i++) {
      const step = plan.steps[i];
      const progressPct = 40 + Math.round(((i + 1) / plan.steps.length) * 40);
      if (onProgress) onProgress(progressPct, `Invoking tool: ${step.tool} (${step.reason})...`);

      const output = await InvestigationToolRegistry.executeTool(step.tool, {
        file,
        img,
        dataUrl,
        imageInfo,
        metadata: metadataResult,
        ocr: ocrResult,
        links: linksResult?.findings,
        onProgress,
      });

      if (step.tool === 'ocr_layout' && output.status === 'failed') {
        throw new Error('Text scanning failed. Please upload the image again to retry; no fraud verdict was produced.');
      }
      toolOutputs.push(output);
      toolsInvoked.push(step.tool);

      // Save shared outputs for downstream tools
      if (step.tool === 'metadata_inspector' && output.data) metadataResult = output.data;
      if (step.tool === 'ocr_layout' && output.data) ocrResult = output.data;
      if (step.tool === 'url_analyzer' && output.data) linksResult = output.data;
      if (step.tool === 'pii_scanner' && output.data) privacyResult = output.data;
      if (step.tool === 'forensic_compression' && output.data) forensicsResult = output.data;
      if (step.tool === 'financial_auditor' && output.data?.entities?.entities) {
        entitiesResult = output.data.entities.entities;
      }
    }

    // Ensure OCR was populated even if not in initial plan
    const rawText = ocrResult?.text || '';

    // Re-run observer with extracted text to refine observation if text was found
    if (rawText.length > 0) {
      const refinedObservation = await this.provider.observeImage(imageInfo, rawText);
      initialObservation.whatAmILookingAt = refinedObservation.whatAmILookingAt;
      initialObservation.visualElementsDetected = refinedObservation.visualElementsDetected;
      initialObservation.hasTextContent = true;
    }

    // STEP 4: MULTIMODAL REASONING OVER EVIDENCE
    if (onProgress) onProgress(88, 'Synthesizing evidence-first reasoning...');
    const reasoning = await this.provider.reasonOverEvidence(
      initialObservation,
      toolOutputs,
      rawText
    );

    // Compute Overall Status from evidence
    let overallStatus: OverallStatus = 'SAFE_TO_REVIEW';
    if (
      reasoning.authenticity.status === 'SUSPICIOUS' ||
      reasoning.authenticity.status === 'CONTRADICTED' ||
      reasoning.evidenceTraces.some((t) => t.severity === 'high')
    ) {
      overallStatus = 'POTENTIAL_RISK';
    } else if (
      reasoning.authenticity.status === 'UNVERIFIABLE' ||
      (privacyResult && privacyResult.totalItems > 0) ||
      (linksResult && linksResult.totalUrls > 0)
    ) {
      overallStatus = 'REVIEW_RECOMMENDED';
    }

    // NEW: Call the mock LLM for fraud analysis using the OCR text and extracted links
    if (onProgress) onProgress(95, 'Checking reference patterns and visible warning signs...');
    const urlStrings = linksResult?.findings ? linksResult.findings.map((l: any) => l.url) : [];
    const fraudAnalysis = await analyzeFraudWithMockLLM(rawText, urlStrings);
    // No reference-pattern match cannot erase independently extracted payment
    // facts or the correct statement that settlement remains unverifiable.
    const preserveFinancialUncertainty = fraudAnalysis.classification === 'unverifiable' &&
      reasoning.authenticity.status === 'UNVERIFIABLE' &&
      toolOutputs.some(output => output.tool === 'financial_auditor' && output.status === 'executed' &&
        output.data?.financial?.financialType && output.data.financial.financialType !== 'NOT_FINANCIAL');
    const useReferenceFallback = fraudAnalysis.classification === 'unverifiable' && !preserveFinancialUncertainty;

    // If OCR failed completely, provide clear feedback (Requirement 3)
    if (rawText.length === 0 || fraudAnalysis.isOcrError) {
      overallStatus = 'SAFE_TO_REVIEW';
      reasoning.authenticity.status = 'INSUFFICIENT_EVIDENCE';
      reasoning.authenticity.headline = '⚠️ Text Could Not Be Read (OCR Error)';
      reasoning.authenticity.rationale = "Text couldn't be extracted from this screenshot. Please upload a clearer or higher-resolution image.";
    }
    else if (useReferenceFallback) {
      overallStatus = 'REVIEW_RECOMMENDED';
      reasoning.authenticity.status = 'INSUFFICIENT_EVIDENCE';
      reasoning.authenticity.headline = 'No reliable reference match';
      reasoning.authenticity.rationale = fraudAnalysis.summary;
      reasoning.whatAmILookingAt = fraudAnalysis.summary;
      reasoning.whatIsItClaiming = 'No claim has been verified. Read the extracted text.';
      reasoning.whatDoesItWantTheUserToDo = 'No requested action has been verified.';
    }
    // If fraud analysis detected high/critical risk or fraud classification, escalate verdict
    else if (fraudAnalysis && (fraudAnalysis.risk_score >= 60 || fraudAnalysis.classification === 'fraud')) {
      overallStatus = 'POTENTIAL_RISK';
      reasoning.authenticity.status = 'SUSPICIOUS';
      reasoning.authenticity.headline = `🚨 ${fraudAnalysis.risk_level.toUpperCase()} RISK: ${fraudAnalysis.message_type}`;
      reasoning.authenticity.rationale = fraudAnalysis.summary;
      if (fraudAnalysis.recommendation) {
        reasoning.recommendations.unshift(fraudAnalysis.recommendation);
      }
    }

    const whatWeFound = [
      `Visual Modality: ${initialObservation.visualModality.replace('_', ' ')}`,
      `Investigated Tools: ${toolsInvoked.join(', ')}`,
      `Text Detected: ${rawText.length} characters`,
    ];
    if (fraudAnalysis && fraudAnalysis.claimed_organization !== 'Unknown') {
      whatWeFound.push(`Claimed Organization: ${fraudAnalysis.claimed_organization}`);
    }
    if (linksResult && linksResult.totalUrls > 0) {
      whatWeFound.push(`Links: ${linksResult.findings.map((l: any) => l.hostname).join(', ')}`);
    }
    if (privacyResult && privacyResult.totalItems > 0) {
      whatWeFound.push(`Sensitive Info: ${privacyResult.totalItems} items`);
    }

    const whatConcernsUs = reasoning.evidenceTraces
      .filter((t) => t.severity === 'high' || t.severity === 'medium')
      .map((t) => `${t.observation} ${t.risk}`);

    if (fraudAnalysis && fraudAnalysis.signals.length > 0) {
      fraudAnalysis.signals.forEach((s) => {
        const desc = `[${s.type.toUpperCase()}] ${s.evidence}`;
        if (!whatConcernsUs.includes(desc)) {
          whatConcernsUs.unshift(desc);
        }
      });
    }

    if (whatConcernsUs.length === 0) {
      whatConcernsUs.push('No severe deceptive patterns, contradictions, or credential threats identified.');
    }

    const humanReadable = {
      whatWeThinkThisIs: fraudAnalysis && (fraudAnalysis.risk_score >= 60 || useReferenceFallback) ? `[${fraudAnalysis.message_type}] ${fraudAnalysis.summary}` : reasoning.whatAmILookingAt,
      whatItSays: rawText.substring(0, 180) || 'No readable textual content detected.',
      whatItClaims: preserveFinancialUncertainty ? reasoning.whatIsItClaiming : useReferenceFallback ? 'No claim or intent has been verified. See the extracted text.' : fraudAnalysis && fraudAnalysis.requested_action ? `Claims from ${fraudAnalysis.claimed_organization}: ${fraudAnalysis.requested_action}` : reasoning.whatIsItClaiming,
      whatItWantsYouToDo: !preserveFinancialUncertainty && fraudAnalysis && fraudAnalysis.requested_action ? fraudAnalysis.requested_action : reasoning.whatDoesItWantTheUserToDo,
      whatWeFound,
      whatConcernsUs,
      canWeVerifyIt: `${reasoning.authenticity.headline}. ${reasoning.authenticity.rationale}`,
      recommendedAction: (fraudAnalysis && fraudAnalysis.recommendation) || reasoning.recommendations[0] || 'Verify details independently before taking action.',
    };

    const overallSummary = useReferenceFallback ? fraudAnalysis.summary : `${humanReadable.whatWeThinkThisIs} ${humanReadable.recommendedAction}`;

    if (onProgress) onProgress(100, 'Investigation report ready');

    return {
      id,
      timestamp,
      imageInfo,
      overallStatus,
      overallSummary,
      observation: initialObservation,
      plan,
      toolsInvoked,
      toolOutputs,
      whatAmILookingAt: reasoning.whatAmILookingAt,
      whatIsHappening: reasoning.whatIsHappening,
      whatIsItClaiming: reasoning.whatIsItClaiming,
      whatDoesItWantTheUserToDo: reasoning.whatDoesItWantTheUserToDo,
      entities: entitiesResult,
      evidenceTraces: reasoning.evidenceTraces,
      contextualReasoning: reasoning.contextualReasoning,
      authenticity: reasoning.authenticity,
      recommendations: reasoning.recommendations,
      limitations: reasoning.limitations,
      humanReadable,
      privacy: privacyResult || { score: 0, findings: [], totalItems: 0 },
      links: linksResult || { totalUrls: 0, findings: [] },
      metadata: metadataResult || { hasExif: false, tags: [], originalBlobSize: imageInfo.sizeBytes },
      ocr: ocrResult || { text: '', confidence: 0, words: [], lines: [] },
      forensics: forensicsResult || { anomaliesDetected: false, compressionInconsistency: 'Normal', noiseVarianceScore: 10, cloneRegionsFound: false, notes: [] },
      dataUrl,
      fraudAnalysis,
    };
  }
}
