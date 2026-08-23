export function formatBytes(bytes: number, decimals = 2): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatAspectRatio(width: number, height: number): string {
  if (!width || !height) return 'Unknown';
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  const w = width / divisor;
  const h = height / divisor;

  // Approximate common ratios
  const ratio = width / height;
  if (Math.abs(ratio - 16 / 9) < 0.05) return `16:9 (${w}:${h})`;
  if (Math.abs(ratio - 9 / 16) < 0.05) return `9:16 (Phone Vertical)`;
  if (Math.abs(ratio - 19.5 / 9) < 0.08) return `19.5:9 (Modern Smartphone)`;
  if (Math.abs(ratio - 4 / 3) < 0.05) return `4:3 (${w}:${h})`;
  if (Math.abs(ratio - 1) < 0.02) return `1:1 (Square)`;
  
  return `${w}:${h} (~${ratio.toFixed(2)}:1)`;
}

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function generateId(): string {
  return `sc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
