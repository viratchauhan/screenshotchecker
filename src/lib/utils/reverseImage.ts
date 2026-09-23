import { loadImageFromDataUrl } from '../analyzer/imageInfo';

export function validateReverseFile(file: Pick<File, 'type' | 'size'>) {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new Error('Choose a PNG, JPEG or WebP image. Convert other formats first.');
  if (file.size <= 0 || file.size > 10 * 1024 * 1024) throw new Error('Choose a non-empty image no larger than 10 MB.');
}

export async function prepareReverseImage(source: File) {
  validateReverseFile(source);
  const url = URL.createObjectURL(source);
  try {
    const image = await loadImageFromDataUrl(url);
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Image preparation is unavailable in this browser.');
    context.drawImage(image, 0, 0);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(
      value => value ? resolve(value) : reject(new Error('Could not prepare a PNG. Try another image.')), 'image/png',
    ));
    return { file: new File([blob], 'search-image.png', { type: 'image/png' }), width: canvas.width, height: canvas.height };
  } finally { URL.revokeObjectURL(url); }
}
