const STORAGE_KEY = 'sc_handoff_image';
const MAX_AGE_MS = 60 * 60 * 1000;

export interface HandoffPayload {
  dataUrl: string;
  sourceTool?: string;
  timestamp: number;
}

function validPayload(value: unknown): value is HandoffPayload {
  if (!value || typeof value !== 'object') return false;
  const p = value as HandoffPayload;
  return typeof p.dataUrl === 'string' && /^data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=\s]+$/i.test(p.dataUrl)
    && Number.isFinite(p.timestamp) && p.timestamp <= Date.now()
    && Date.now() - p.timestamp <= MAX_AGE_MS
    && (p.sourceTool === undefined || typeof p.sourceTool === 'string');
}

/** Callers must stop navigation when saving fails. Never reuse a previous image. */
export function setHandoffImage(dataUrl: string, sourceTool?: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
    const payload: HandoffPayload = { dataUrl, sourceTool, timestamp: Date.now() };
    if (!validPayload(payload)) throw new Error('Invalid image');
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    clearHandoffImage();
    window.alert('This image could not be transferred. It may be too large for browser storage, or storage may be blocked. Your current image is still here. Open the other tool separately and upload the image there.');
    return false;
  }
}

export function getHandoffImage(): HandoffPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const payload: unknown = JSON.parse(stored);
    if (validPayload(payload)) return payload;
  } catch {
    // Corrupt or unavailable storage must never be treated as a valid image.
  }
  clearHandoffImage();
  return null;
}

export function clearHandoffImage(): void {
  if (typeof window === 'undefined') return;
  try { window.sessionStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be blocked. */ }
}
