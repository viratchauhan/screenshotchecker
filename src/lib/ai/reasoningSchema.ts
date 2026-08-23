import type {
  AuthenticityAssessment,
  HumanReadableReport,
  ImageInfo,
  MetadataInfo,
  OCRResult,
  PrivacyFinding,
  LinkFinding,
  ForensicsInfo,
  OverallStatus,
  StructuredEntity,
} from '../analyzer/types';
import type { FraudAnalysisResponse } from './fraudDetectionSchema';

export type VisualModality =
  | 'mobile_screenshot'
  | 'desktop_screenshot'
  | 'document_scan'
  | 'photograph'
  | 'graphic_illustration'
  | 'unknown';

export type InvestigationToolName =
  | 'image_specs'
  | 'metadata_inspector'
  | 'ocr_layout'
  | 'url_analyzer'
  | 'pii_scanner'
  | 'financial_auditor'
  | 'consistency_checker'
  | 'channel_context'
  | 'forensic_compression'
  | 'synthetic_check';

export interface VisualObservation {
  whatAmILookingAt: string;
  visualModality: VisualModality;
  visualElementsDetected: string[];
  hasTextContent: boolean;
  hasStructuredLayout: boolean;
  initialHypothesis: string;
}

export interface ToolPlanItem {
  tool: InvestigationToolName;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface InvestigationPlan {
  objective: string;
  steps: ToolPlanItem[];
}

export interface EvidenceTraceItem {
  id: string;
  observation: string;
  evidence: string[];
  interpretation: string;
  risk: string;
  limitation: string;
  recommendation: string;
  severity: 'high' | 'medium' | 'info';
}

export interface ToolExecutionOutput {
  tool: InvestigationToolName;
  status: 'executed' | 'skipped' | 'failed';
  summary: string;
  data: any;
}

export interface AgenticInvestigationResult {
  id: string;
  timestamp: number;
  imageInfo: ImageInfo;
  overallStatus: OverallStatus;
  overallSummary: string;
  
  // Agentic investigation components
  observation: VisualObservation;
  plan: InvestigationPlan;
  toolsInvoked: InvestigationToolName[];
  toolOutputs: ToolExecutionOutput[];
  
  whatAmILookingAt: string;
  whatIsHappening: string;
  whatIsItClaiming: string;
  whatDoesItWantTheUserToDo: string;
  
  entities: StructuredEntity[];
  evidenceTraces: EvidenceTraceItem[];
  contextualReasoning: string;
  authenticity: AuthenticityAssessment;
  recommendations: string[];
  limitations: string[];
  humanReadable: HumanReadableReport;
  
  // Deterministic raw assets for UI components
  privacy: {
    score: number;
    findings: PrivacyFinding[];
    totalItems: number;
  };
  links: {
    totalUrls: number;
    findings: LinkFinding[];
  };
  metadata: MetadataInfo;
  ocr: OCRResult;
  forensics: ForensicsInfo;
  dataUrl: string;
  fraudAnalysis?: FraudAnalysisResponse;
}
