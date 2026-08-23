import ExifReader from 'exifreader';
import type { MetadataInfo, MetadataTag } from './types';

export async function extractMetadata(file: File): Promise<MetadataInfo> {
  const result: MetadataInfo = {
    hasExif: false,
    tags: [],
    originalBlobSize: file.size,
  };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const tags = ExifReader.load(arrayBuffer, { expanded: true });

    const tagList: MetadataTag[] = [];

    // Helper to extract tag descriptions
    const processGroup = (groupName: string, groupObj: any) => {
      if (!groupObj || typeof groupObj !== 'object') return;
      for (const [key, value] of Object.entries(groupObj)) {
        if (!value || key === 'Thumbnail') continue;
        const tagValue = (value as any).description ?? (value as any).value ?? String(value);
        if (tagValue !== undefined && tagValue !== null && String(tagValue).trim() !== '') {
          tagList.push({
            group: groupName.toUpperCase(),
            tag: key,
            description: String(tagValue),
            value: String(tagValue),
          });
        }
      }
    };

    if (tags.exif) {
      result.hasExif = true;
      processGroup('EXIF', tags.exif);
    }
    if (tags.gps) {
      result.hasExif = true;
      processGroup('GPS', tags.gps);
      
      const lat = tags.gps.Latitude;
      const lng = tags.gps.Longitude;
      if (typeof lat === 'number' && typeof lng === 'number') {
        result.gps = {
          lat,
          lng,
          altitude: tags.gps.Altitude ? `${tags.gps.Altitude}m` : undefined,
        };
      }
    }
    if (tags.iptc) {
      result.hasExif = true;
      processGroup('IPTC', tags.iptc);
    }
    if (tags.xmp) {
      result.hasExif = true;
      processGroup('XMP', tags.xmp);
    }
    if (tags.file) {
      processGroup('FILE', tags.file);
    }
    if (tags.png) {
      result.hasExif = true;
      processGroup('PNG Chunks', tags.png);
    }

    result.tags = tagList;

    // Check for camera/device info
    const make = tags.exif?.Make?.description;
    const model = tags.exif?.Model?.description;
    const lens = tags.exif?.LensModel?.description;
    if (make || model || lens) {
      result.camera = { make, model, lens };
    }

    // Check for software info (Photoshop, Canva, Figma, iOS, Android, etc.)
    result.software =
      tags.exif?.Software?.description ||
      tags.xmp?.CreatorTool?.description ||
      tags.png?.Software?.description;

    // Check for DateTime
    result.dateTime =
      tags.exif?.DateTimeOriginal?.description ||
      tags.exif?.DateTime?.description ||
      tags.file?.['File Modified Date']?.description;

  } catch (err) {
    // If no EXIF or unsupported format, tags remain empty
    console.warn('Metadata parsing completed: no EXIF/metadata found or parsing error', err);
  }

  return result;
}

/**
 * Strips all metadata from an image by re-rendering to a clean canvas
 * and exporting as a pristine blob without metadata chunks.
 */
export async function stripImageMetadata(
  img: HTMLImageElement,
  format: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png',
  quality = 0.95
): Promise<{ blob: Blob; dataUrl: string; sizeBytes: number }> {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Failed to generate clean image blob'));
        const dataUrl = canvas.toDataURL(format, quality);
        resolve({
          blob,
          dataUrl,
          sizeBytes: blob.size,
        });
      },
      format,
      quality
    );
  });
}
