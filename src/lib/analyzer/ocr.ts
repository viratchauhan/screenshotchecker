import type { OCRResult } from './types';
import { recognizeWithCoordinates } from './ocrCoordinates';
import { preprocessImageForOCR } from './ocrPreprocessor';
import { retryableCache } from './retryableCache';

export type ProgressCallback = (progress: number, status: string) => void;

const cachedWorker = retryableCache<any>();

async function getWorkerForLanguage(lang: string = 'eng', onProgress?: ProgressCallback) {
  return cachedWorker(lang, async () => {
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
  });
}

export async function runClientOCR(
  imageSource: HTMLImageElement | string | File | Blob,
  onProgress?: ProgressCallback,
  language: string = 'eng'
): Promise<OCRResult> {
  try {
    if (onProgress) onProgress(5, 'Preprocessing image for optimal text clarity...');

    let ocrInput: any = imageSource;
    let scaleFactor = 1;
    let fallbackInput: any = undefined;
    let originalWidth: number | undefined;
    let originalHeight: number | undefined;

    // In browser environment, run intelligent image preprocessing
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const prep = await preprocessImageForOCR(imageSource);
      ocrInput = prep.canvas;
      fallbackInput = prep.originalCanvas;
      scaleFactor = prep.scaleFactor;
      originalWidth = prep.originalCanvas.width;
      originalHeight = prep.originalCanvas.height;
    }

    if (onProgress) onProgress(25, `Reading visible content...`);
    const worker = await getWorkerForLanguage(language, onProgress);
    const { data, words } = await recognizeWithCoordinates(worker, ocrInput, {
      scale: scaleFactor, width: originalWidth, height: originalHeight,
    }, fallbackInput);
    const text = (data.text || '').trim();
    const confidence = Math.round(data.confidence || 0);

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
    throw new Error(err instanceof Error
      ? `${err.message} OCR did not complete. Please upload the image again to retry.`
      : 'OCR did not complete. Please upload the image again to retry.');
  }
}
