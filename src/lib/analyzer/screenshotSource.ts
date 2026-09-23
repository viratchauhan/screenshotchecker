export interface SourceEvidence {
  width: number;
  height: number;
  format: string;
  metadataReadable: boolean;
  cameraTags: string[];
  software: string;
}

/** Heuristic clues only: never an authenticity, device identity or fraud verdict. */
export function assessScreenshotSource(input: SourceEvidence) {
  const camera = input.cameraTags.length >= 2;
  const capture = /\b(snipping tool|screencapture|screenshot|flameshot|greenshot|spectacle)\b/i.test(input.software);
  const signals = [
    `Dimensions: ${input.width} × ${input.height} pixels. Dimensions alone cannot identify a screenshot or device.`,
    `Format: ${input.format}. PNG and JPEG can both contain screenshots, photos or graphics.`,
  ];
  if (!input.metadataReadable) {
    signals.push('Metadata could not be read. This is an unavailable check, not evidence of missing camera data.');
  } else {
    signals.push(input.cameraTags.length
      ? `Camera-related fields present: ${input.cameraTags.join(', ')}. These fields can be copied or modified.`
      : 'No supported camera-related fields found. Shared or exported photos can lose these fields too.');
    signals.push(input.software
      ? `Software field: ${input.software}. This may describe a capture or an export, not the original source.`
      : 'No supported software field found.');
  }
  const verdict = !input.metadataReadable || (camera && capture) ? 'Inconclusive'
    : capture ? 'Screen-capture software clue found'
    : camera ? 'Camera metadata clues found' : 'Inconclusive';
  return { verdict, signals, limitation: 'These clues do not prove how the image was made, whether it was edited, or whether its contents are true. A screenshot can contain a photograph, and metadata can be changed.' };
}

export function selectSourceMetadata(tags: Record<string, any>) {
  const exif = tags.exif || {};
  const cameraTags = ['Make', 'Model', 'LensModel', 'ExposureTime', 'FNumber', 'ISOSpeedRatings', 'FocalLength']
    .filter(key => exif[key] !== undefined);
  const software = exif.Software?.description || tags.xmp?.CreatorTool?.description || tags.png?.Software?.description || '';
  return { cameraTags, software: String(software).slice(0, 240) };
}
