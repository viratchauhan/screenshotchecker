import type { PaymentAnalysisResult } from './paymentTypes';
import { runClientOCR, type ProgressCallback } from '../analyzer/ocr';
import { loadImageFromDataUrl, extractImageInfo } from '../analyzer/imageInfo';
import { classifyPaymentScreenshot } from './paymentClassifier';
import { extractPaymentEntities } from './paymentExtractor';
import { evaluatePaymentVisualForensics } from './paymentVisualForensics';
import { computePaymentRisk } from './paymentRiskEngine';

export async function runPaymentAnalysis(
  file: File,
  dataUrl: string,
  onProgress?: ProgressCallback
): Promise<PaymentAnalysisResult> {
  // 1. ISOLATE CONTEXT & LOAD CURRENT IMAGE
  if (onProgress) onProgress(10, 'Loading image for payment forensics...');
  let imgElement: HTMLImageElement | null = null;
  let imageInfo = {
    name: file.name || 'payment_screenshot.png',
    sizeBytes: file.size || 0,
    width: 0,
    height: 0,
    mimeType: file.type || 'image/png',
    aspectRatio: '1:1',
  };

  try {
    if (typeof window !== 'undefined') {
      imgElement = await loadImageFromDataUrl(dataUrl);
      const info = await extractImageInfo(file, imgElement);
      imageInfo = {
        name: info.name,
        sizeBytes: info.sizeBytes,
        width: info.width,
        height: info.height,
        mimeType: info.mimeType,
        aspectRatio: info.aspectRatio,
      };
    }
  } catch (err) {
    console.warn('Image dimensions extraction skipped', err);
  }

  // 2. RUN CURRENT-IMAGE-ONLY OCR
  if (onProgress) onProgress(25, 'Reading receipt text & transaction details...');
  const ocrResult = await runClientOCR(imgElement || dataUrl, onProgress);
  const currentImageOCR = (ocrResult.text || '').trim();

  // 3. CLASSIFY SCREENSHOT TYPE BEFORE SCORING
  if (onProgress) onProgress(60, 'Classifying receipt type & payment ecosystem...');
  const classification = classifyPaymentScreenshot(currentImageOCR);

  // 4. EXTRACT GROUNDED PAYMENT FIELDS
  if (onProgress) onProgress(75, 'Extracting amount, UTR, and payee details...');
  const extracted = extractPaymentEntities(currentImageOCR);

  // 5. RUN PAYMENT-SPECIFIC VISUAL & TYPOGRAPHY FORENSICS
  if (onProgress) onProgress(85, 'Checking receipt text and reference consistency...');
  const forensics = evaluatePaymentVisualForensics(
    currentImageOCR,
    extracted,
    imageInfo.width,
    imageInfo.height
  );

  // 6. COMPUTE PAYMENT RISK & ASSEMBLE GROUNDED REPORT
  if (onProgress) onProgress(95, 'Compiling payment verification report...');
  const result = computePaymentRisk(
    classification,
    extracted,
    forensics,
    currentImageOCR,
    dataUrl,
    imageInfo,
    ['Evaluated receipt-text rules; fonts, icon positions and layout were not measured.', 'Checked extracted reference formatting and amount strings.']
  );

  if (onProgress) onProgress(100, 'Payment analysis complete');
  return result;
}
