/**
 * JPEG save-quality estimate.
 *
 * A JPEG file stores the quantization tables it was last saved with. Most software builds them
 * by scaling the standard tables of the JPEG specification to a "quality" from 1 to 100 (the
 * libjpeg method), so comparing the stored tables with the scaled standard ones gives the quality
 * of the last save. Everything here works on the file's bytes in the browser; nothing is uploaded.
 *
 * It tells the quality of the LAST save only. It cannot tell how often the picture was saved
 * before, by whom, or whether anything in it was changed.
 */

export type ImageFileFormat = 'jpeg' | 'png' | 'webp' | 'gif' | 'other';

export interface JpegQuantTable {
  /** Table slot in the file (0 is normally brightness, 1 colour). */
  id: number;
  precision: 8 | 16;
  /** 64 values in natural (row by row) order. */
  values: number[];
}

export interface TableQualityMatch {
  /** Nearest libjpeg quality, 1 to 100. */
  quality: number;
  /** True when the table is exactly the standard table scaled to that quality. */
  exact: boolean;
}

export interface JpegQualityReport {
  format: ImageFileFormat;
  tables: JpegQuantTable[];
  /** Estimated quality of the last save, or null when the file holds no readable tables. */
  quality: number | null;
  /** True when every table is the standard table scaled to one quality level. */
  standardTables: boolean;
  /** One plain sentence with the answer. */
  headline: string;
  /** Plain notes on how to read it. */
  notes: string[];
}

/** Position in the 8x8 block (row by row) of each value as stored in the file (zigzag order). */
const ZIGZAG = [
  0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28,
  35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55,
  62, 63,
];

/** Standard brightness (luminance) table of the JPEG specification, row by row. */
export const STANDARD_LUMINANCE_TABLE = [
  16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87,
  80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92,
  95, 98, 112, 100, 103, 99,
];

/** Standard colour (chrominance) table of the JPEG specification, row by row. */
export const STANDARD_CHROMINANCE_TABLE = [
  17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99, 99, 99, 47, 66, 99, 99, 99, 99,
  99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99,
  99, 99, 99, 99,
];

/** The standard table scaled to a quality from 1 to 100, the way libjpeg does it. */
export function scaleStandardTable(standard: readonly number[], quality: number): number[] {
  const q = Math.min(100, Math.max(1, Math.round(quality)));
  const scale = q < 50 ? Math.floor(5000 / q) : 200 - q * 2;
  return standard.map((value) => Math.min(255, Math.max(1, Math.floor((value * scale + 50) / 100))));
}

/** Finds the quality whose scaled standard table is closest to this table. */
export function matchTableQuality(values: readonly number[], standard: readonly number[]): TableQualityMatch {
  let best = 1;
  let bestError = Number.POSITIVE_INFINITY;
  for (let q = 1; q <= 100; q++) {
    const scaled = scaleStandardTable(standard, q);
    let error = 0;
    for (let i = 0; i < 64; i++) error += Math.abs(scaled[i] - values[i]);
    // On a tie the higher quality wins (tables stop changing near the ends of the range).
    if (error <= bestError) {
      bestError = error;
      best = q;
    }
  }
  return { quality: best, exact: bestError === 0 };
}

export function detectImageFormat(bytes: Uint8Array): ImageFileFormat {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg';
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'png';
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return 'webp';
  }
  if (bytes.length >= 4 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return 'gif';
  return 'other';
}

/**
 * Reads the quantization tables of the main picture. Segments are skipped by their stated
 * length, so the small preview picture inside the EXIF block is never mistaken for the picture.
 * Damaged or cut-off files give the tables read so far, never an exception.
 */
export function parseJpegQuantTables(bytes: Uint8Array): JpegQuantTable[] {
  const tables = new Map<number, JpegQuantTable>();
  if (detectImageFormat(bytes) !== 'jpeg') return [];
  let pos = 2;
  while (pos + 4 <= bytes.length) {
    if (bytes[pos] !== 0xff) break;
    const marker = bytes[pos + 1];
    if (marker === 0xff) {
      pos += 1; // fill byte
      continue;
    }
    // Markers without a length field.
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) {
      pos += 2;
      continue;
    }
    // Start of scan or end of image: the tables of the picture all come before this.
    if (marker === 0xda || marker === 0xd9) break;
    const length = (bytes[pos + 2] << 8) | bytes[pos + 3];
    if (length < 2) break;
    const end = pos + 2 + length;
    if (marker === 0xdb) {
      let p = pos + 4;
      while (p < end && p < bytes.length) {
        const precision = bytes[p] >> 4 === 1 ? 16 : 8;
        const id = bytes[p] & 0x0f;
        const size = precision === 16 ? 128 : 64;
        if (p + 1 + size > end || p + 1 + size > bytes.length) break;
        const values = new Array<number>(64).fill(0);
        for (let i = 0; i < 64; i++) {
          const at = p + 1 + (precision === 16 ? i * 2 : i);
          values[ZIGZAG[i]] = precision === 16 ? (bytes[at] << 8) | bytes[at + 1] : bytes[at];
        }
        tables.set(id, { id, precision, values });
        p += 1 + size;
      }
    }
    pos = end;
  }
  return [...tables.values()].sort((a, b) => a.id - b.id);
}

function qualityNote(quality: number): string {
  if (quality >= 95) {
    return 'That is a very high quality save, the kind a camera or an editor set to maximum writes. Pictures sent through chat apps are usually compressed more than this.';
  }
  if (quality >= 85) {
    return 'That is a high quality save, common for phone cameras and photo exports.';
  }
  if (quality >= 60) {
    return 'That is a medium quality save. Chat apps, social sites and screenshots saved as JPEG often land in this range, so the file may have been compressed again after it was first made. A re-save alone is not editing.';
  }
  return 'That is a low quality save. Heavy compression wipes out fine detail, so the ELA map of this picture says little either way.';
}

const CANNOT_PROVE =
  'This is the quality of the last save only. It does not show how many times the picture was saved before, who saved it, or whether anything in it was changed.';

/** Builds the plain-language report for a file's first bytes. */
export function buildJpegQualityReport(bytes: Uint8Array): JpegQualityReport {
  const format = detectImageFormat(bytes);
  if (format !== 'jpeg') {
    const names: Record<Exclude<ImageFileFormat, 'jpeg'>, string> = {
      png: 'a PNG',
      webp: 'a WebP',
      gif: 'a GIF',
      other: 'not a JPEG',
    };
    const notes =
      format === 'png'
        ? [
            'PNG files have no JPEG quality setting. Phone and computer screenshots are normally PNG, so this is expected for a screenshot.',
            'A PNG can still contain a picture that was a JPEG earlier. The ELA map above is the place to look for that.',
          ]
        : ['Only JPEG files store the tables this check reads.'];
    return {
      format,
      tables: [],
      quality: null,
      standardTables: false,
      headline: `This file is ${names[format]}, so there is no JPEG save quality to read.`,
      notes,
    };
  }

  const tables = parseJpegQuantTables(bytes);
  if (tables.length === 0) {
    return {
      format,
      tables,
      quality: null,
      standardTables: false,
      headline: 'This JPEG has no readable quality tables in its header.',
      notes: ['The file may be cut off or damaged, or it stores its tables in an unusual place.'],
    };
  }

  const matches = tables.map((table, index) =>
    matchTableQuality(table.values, index === 0 ? STANDARD_LUMINANCE_TABLE : STANDARD_CHROMINANCE_TABLE),
  );
  const quality = matches[0].quality;
  const standardTables = matches.every((m) => m.exact && m.quality === quality);
  const notes = [qualityNote(quality)];
  if (standardTables) {
    notes.push(
      'The tables are the standard JPEG tables scaled to that level, which is what most apps, websites and phone software write.',
    );
  } else {
    notes.push(
      'The tables are not the standard JPEG tables scaled to one level, so the percentage is the nearest match only. Many cameras and some editors, Adobe Photoshop among them, write their own tables.',
    );
  }
  notes.push(CANNOT_PROVE);
  return {
    format,
    tables,
    quality,
    standardTables,
    headline: standardTables
      ? `Last saved at ${quality}% JPEG quality.`
      : `Last saved at about ${quality}% JPEG quality (nearest match).`,
    notes,
  };
}

/** Longest stretch of the file that is decoded to find the tables (they sit in the header). */
export const HEADER_BYTES_LIMIT = 2 * 1024 * 1024;

/** Decodes the first bytes of a base64 data URL without touching the rest of the file. */
export function dataUrlHeadBytes(dataUrl: string, maxBytes: number = HEADER_BYTES_LIMIT): Uint8Array {
  const comma = dataUrl.indexOf(',');
  if (!dataUrl.startsWith('data:') || comma < 0 || !/;base64$/i.test(dataUrl.slice(0, comma))) return new Uint8Array(0);
  const chars = Math.ceil(maxBytes / 3) * 4;
  let head = dataUrl.slice(comma + 1, comma + 1 + chars).replace(/[^A-Za-z0-9+/=]/g, '');
  head = head.slice(0, head.length - (head.length % 4));
  try {
    const binary = atob(head);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
    return out;
  } catch {
    return new Uint8Array(0);
  }
}
