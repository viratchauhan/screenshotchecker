import type { OCRResult, OCRWord } from './types';
import { preprocessImageForOCR } from './ocrPreprocessor';

export type ProgressCallback = (progress: number, status: string) => void;

const workersCache: Record<string, any> = {};

async function getWorkerForLanguage(lang: string = 'eng', onProgress?: ProgressCallback) {
  if (!workersCache[lang]) {
    workersCache[lang] = (async () => {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker(lang, 1, {
        logger: (m: any) => {
          if (m.status === 'recognizing text' && onProgress) {
            onProgress(Math.round((m.progress || 0) * 100), 'Extracting text...');
          } else if (onProgress) {
            onProgress(15, `Initializing OCR engine (${lang})...`);
          }
        },
      });
      return worker;
    })();
  }
  return workersCache[lang];
}

export async function runClientOCR(
  imageSource: HTMLImageElement | string | File | Blob,
  onProgress?: ProgressCallback,
  language: string = 'eng'
): Promise<OCRResult> {
  console.log('--- OCR DEBUG LOG ---');
  console.log('IMAGE RECEIVED: YES');
  console.log('IMAGE TYPE:', typeof imageSource === 'string' ? 'dataUrl/string' : (imageSource instanceof HTMLImageElement ? 'HTMLImageElement' : (imageSource as any)?.type || 'Blob/File'));
  console.log('OCR STARTED: YES');

  try {
    if (onProgress) onProgress(5, 'Preprocessing image for optimal text clarity...');

    let ocrInput: any = imageSource;
    let scaleFactor = 1;
    let fallbackInput: any = null;

    // In browser environment, run intelligent image preprocessing
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      try {
        const prep = await preprocessImageForOCR(imageSource);
        ocrInput = prep.canvas;
        fallbackInput = prep.originalCanvas;
        scaleFactor = prep.scaleFactor || 1;
      } catch (prepErr) {
        console.warn('Preprocessing skipped due to fallback', prepErr);
      }
    }

    if (onProgress) onProgress(25, `Reading visible content...`);
    const worker = await getWorkerForLanguage(language, onProgress);
    let result = await worker.recognize(ocrInput);

    let text = (result.data.text || '').trim();
    let confidence = Math.round(result.data.confidence || 0);

    // Multi-pass fallback: If 0 characters or very low confidence, try recognizing with fallback canvas
    if (text.length === 0 && fallbackInput) {
      console.log('OCR Pass 1 produced 0 chars, attempting fallback pass...');
      const fallbackResult = await worker.recognize(fallbackInput);
      const fallbackText = (fallbackResult.data.text || '').trim();
      if (fallbackText.length > 0) {
        result = fallbackResult;
        text = fallbackText;
        confidence = Math.round(fallbackResult.data.confidence || 0);
        scaleFactor = 1;
      }
    }

    console.log('OCR COMPLETED: YES');
    console.log('OCR CHARACTER COUNT:', text.length);
    console.log('OCR CONFIDENCE:', confidence);
    console.log('OCR RAW RESULT:', text ? text.substring(0, 150) + (text.length > 150 ? '...' : '') : '[EMPTY]');

    const words: OCRWord[] = (result.data.words || []).map((w: any) => ({
      text: w.text,
      bbox: w.bbox
        ? {
            x0: Math.round(w.bbox.x0 / scaleFactor),
            y0: Math.round(w.bbox.y0 / scaleFactor),
            x1: Math.round(w.bbox.x1 / scaleFactor),
            y1: Math.round(w.bbox.y1 / scaleFactor),
          }
        : undefined,
    }));

    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (onProgress) onProgress(100, 'OCR extraction complete');

    return {
      text,
      confidence,
      words,
      lines,
    };
  } catch (err) {
    console.error('OCR ERROR during execution:', err);
    return {
      text: '',
      confidence: 0,
      words: [],
      lines: [],
    };
  }
}
