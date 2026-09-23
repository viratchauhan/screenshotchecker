import type { OCRResult } from './types';
import { recognizeWithCoordinates } from './ocrCoordinates';
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
    let fallbackInput: any = undefined;
    let originalWidth: number | undefined;
    let originalHeight: number | undefined;

    // In browser environment, run intelligent image preprocessing
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      try {
        const prep = await preprocessImageForOCR(imageSource);
        ocrInput = prep.canvas;
        fallbackInput = prep.originalCanvas;
        scaleFactor = prep.scaleFactor;
        originalWidth = prep.originalCanvas.width;
        originalHeight = prep.originalCanvas.height;
      } catch (prepErr) {
        console.warn('Preprocessing skipped due to fallback', prepErr);
      }
    }

    if (onProgress) onProgress(25, `Reading visible content...`);
    const worker = await getWorkerForLanguage(language, onProgress);
    const { data, words } = await recognizeWithCoordinates(worker, ocrInput, {
      scale: scaleFactor, width: originalWidth, height: originalHeight,
    }, fallbackInput);
    const text = (data.text || '').trim();
    const confidence = Math.round(data.confidence || 0);

    console.log('OCR COMPLETED: YES');
    console.log('OCR CHARACTER COUNT:', text.length);
    console.log('OCR CONFIDENCE:', confidence);
    console.log('OCR RAW RESULT:', text ? text.substring(0, 150) + (text.length > 150 ? '...' : '') : '[EMPTY]');

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
