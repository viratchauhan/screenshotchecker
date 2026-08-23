const STORAGE_KEY = 'sc_handoff_image';
const STORAGE_META_KEY = 'sc_handoff_source';

export interface HandoffPayload {
  dataUrl: string;
  sourceTool?: string;
  timestamp: number;
}

export function setHandoffImage(dataUrl: string, sourceTool?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: HandoffPayload = {
      dataUrl,
      sourceTool,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('Could not save handoff image to sessionStorage', e);
  }
}

export function getHandoffImage(): HandoffPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const payload: HandoffPayload = JSON.parse(stored);
    // Discard payload if older than 1 hour
    if (Date.now() - payload.timestamp > 3600000) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}

export function clearHandoffImage(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}
