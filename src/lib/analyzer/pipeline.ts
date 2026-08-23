import type { AgenticInvestigationResult } from '../ai/reasoningSchema';
import { InvestigationAgent } from '../ai/investigationAgent';
import type { ProgressCallback } from './ocr';

export async function runFullAnalysis(
  file: File,
  dataUrl: string,
  onProgress?: ProgressCallback
): Promise<AgenticInvestigationResult> {
  const agent = new InvestigationAgent();
  return await agent.investigate(file, dataUrl, onProgress);
}
