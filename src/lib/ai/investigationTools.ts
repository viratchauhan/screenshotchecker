import type { InvestigationToolName, ToolExecutionOutput } from './reasoningSchema';
import type { ImageInfo, MetadataInfo, OCRResult, LinkFinding, PrivacyFinding, ForensicsInfo } from '../analyzer/types';
import { extractImageInfo } from '../analyzer/imageInfo';
import { extractMetadata } from '../analyzer/metadata';
import { runClientOCR } from '../analyzer/ocr';
import { scanLinks } from '../analyzer/linkScanner';
import { scanPrivacyRisks } from '../analyzer/privacyScanner';
import { extractEntitiesDetailed } from '../analyzer/entityExtractor';
import { analyzeFinancialIntelligence } from '../analyzer/financialAnalyzer';
import { analyzeChannelContext } from '../analyzer/channelAnalyzers';
import { analyzeImageForensics } from '../analyzer/forensics';
import { performSyntheticImageAnalysis } from '../analyzer/syntheticImageDetector';

export class InvestigationToolRegistry {
  static async executeTool(
    tool: InvestigationToolName,
    context: {
      file?: File;
      img?: HTMLImageElement;
      dataUrl?: string;
      imageInfo?: ImageInfo;
      metadata?: MetadataInfo;
      ocr?: OCRResult;
      links?: LinkFinding[];
      onProgress?: (pct: number, status: string) => void;
    }
  ): Promise<ToolExecutionOutput> {
    try {
      switch (tool) {
        case 'image_specs': {
          if (!context.file || !context.img) throw new Error('File and Image required for image_specs');
          const info = await extractImageInfo(context.file, context.img);
          return {
            tool,
            status: 'executed',
            summary: `Dimensions: ${info.width}x${info.height} (${info.aspectRatio}), Size: ${info.sizeBytes} bytes, Format: ${info.mimeType}`,
            data: info,
          };
        }

        case 'metadata_inspector': {
          if (!context.file) throw new Error('File required for metadata_inspector');
          const meta = await extractMetadata(context.file);
          const summary = meta.hasExif
            ? `EXIF tags found: ${meta.tags.length} (${meta.camera?.make || ''} ${meta.camera?.model || ''}${meta.gps ? ', GPS embedded' : ''})`
            : 'No EXIF metadata tags detected';
          return {
            tool,
            status: 'executed',
            summary,
            data: meta,
          };
        }

        case 'ocr_layout': {
          if (!context.img) throw new Error('Image canvas required for ocr_layout');
          const ocr = await runClientOCR(context.img, (pct, status) => {
            if (context.onProgress) context.onProgress(30 + Math.round(pct * 0.4), status);
          });
          return {
            tool,
            status: 'executed',
            summary: `Extracted ${ocr.text.length} characters across ${ocr.lines.length} lines with average confidence ${ocr.confidence}%`,
            data: ocr,
          };
        }

        case 'url_analyzer': {
          const text = context.ocr?.text || '';
          const links = scanLinks(text);
          const summary =
            links.totalUrls > 0
              ? `Extracted ${links.totalUrls} URL(s): ${links.findings.map((l) => `${l.hostname} (${l.riskLevel})`).join(', ')}`
              : 'No web hyperlinks found in image text';
          return {
            tool,
            status: 'executed',
            summary,
            data: links,
          };
        }

        case 'pii_scanner': {
          const text = context.ocr?.text || '';
          const words = context.ocr?.words || [];
          const privacy = scanPrivacyRisks(text, words, context.metadata);
          return {
            tool,
            status: 'executed',
            summary:
              privacy.totalItems > 0
                ? `Detected ${privacy.totalItems} potential PII items (${privacy.findings.map((f) => f.label).join(', ')})`
                : 'No high-sensitivity personal information (cards, SSNs, credentials) detected',
            data: privacy,
          };
        }

        case 'financial_auditor': {
          const text = context.ocr?.text || '';
          const entityResult = extractEntitiesDetailed(text, context.metadata);
          const { financial, consistency } = analyzeFinancialIntelligence(text, 'PAYMENT', entityResult);
          return {
            tool,
            status: 'executed',
            summary:
              financial.financialType !== 'NOT_FINANCIAL'
                ? `Financial event: ${financial.financialType} (${financial.primaryAmount?.raw || 'amount stated'}), Consistency: ${consistency.isConsistent ? 'Consistent' : 'Inconsistencies detected'}`
                : 'No explicit financial transaction structure identified',
            data: { financial, consistency, entities: entityResult },
          };
        }

        case 'consistency_checker': {
          const text = context.ocr?.text || '';
          const entityResult = extractEntitiesDetailed(text, context.metadata);
          const { consistency } = analyzeFinancialIntelligence(text, 'PAYMENT', entityResult);
          return {
            tool,
            status: 'executed',
            summary: consistency.isConsistent
              ? 'Multi-variable internal consistency verified (no amount or status contradictions)'
              : `Discrepancy found: ${consistency.issues.map((i) => i.title).join('; ')}`,
            data: consistency,
          };
        }

        case 'channel_context': {
          const text = context.ocr?.text || '';
          const entityResult = extractEntitiesDetailed(text, context.metadata);
          const links = context.links || scanLinks(text).findings;
          const channel = analyzeChannelContext(text, 'GENERAL', entityResult, links);
          return {
            tool,
            status: 'executed',
            summary: `Channel framing: ${channel.channel} (Urgency: ${channel.isUrgent}, Threat: ${channel.isThreatPresent}, Payment demanded: ${channel.isPaymentRequested})`,
            data: channel,
          };
        }

        case 'forensic_compression': {
          if (!context.img) throw new Error('Image canvas required for forensic_compression');
          const forensics = await analyzeImageForensics(context.img);
          return {
            tool,
            status: 'executed',
            summary: `Error Level Analysis: ${forensics.compressionInconsistency}, Noise score: ${forensics.noiseVarianceScore}`,
            data: forensics,
          };
        }

        case 'synthetic_check': {
          const synthetic = performSyntheticImageAnalysis();
          return {
            tool,
            status: 'executed',
            summary: synthetic.indicators[0] || 'Synthetic classifier ready',
            data: synthetic,
          };
        }

        default:
          return {
            tool,
            status: 'skipped',
            summary: 'Tool not recognized',
            data: null,
          };
      }
    } catch (err: any) {
      return {
        tool,
        status: 'failed',
        summary: `Execution error: ${err.message}`,
        data: null,
      };
    }
  }
}
