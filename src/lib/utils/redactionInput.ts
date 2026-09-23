import type { RedactionBox } from '../analyzer/redactor';

export function bindRedactionInput(canvas: HTMLCanvasElement, tool: () => RedactionBox['type'], add: (box: RedactionBox) => void) {
  let start: { x: number; y: number; id: number } | null = null;
  canvas.style.touchAction = 'none';
  const point = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: Math.max(0, Math.min(canvas.width, (e.clientX - r.left) * canvas.width / r.width)), y: Math.max(0, Math.min(canvas.height, (e.clientY - r.top) * canvas.height / r.height)) };
  };
  canvas.addEventListener('pointerdown', e => {
    if (start || e.button !== 0 || !canvas.width) return;
    e.preventDefault();
    start = { ...point(e), id: e.pointerId };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointerup', e => {
    if (!start || start.id !== e.pointerId) return;
    const end = point(e), origin = start;
    start = null;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    const width = Math.abs(end.x - origin.x), height = Math.abs(end.y - origin.y);
    if (width > 1 && height > 1) add({ id: crypto.randomUUID(), x: Math.min(origin.x, end.x), y: Math.min(origin.y, end.y), width, height, type: tool() });
  });
  canvas.addEventListener('pointercancel', () => { start = null; });
  canvas.addEventListener('lostpointercapture', () => { start = null; });

  // Numeric placement gives keyboard users the same drawing capability.
  const form = document.createElement('form');
  form.className = 'flex flex-wrap gap-2 items-end text-xs';
  form.setAttribute('aria-label', 'Place a redaction by coordinates');
  const inputs = ['X', 'Y', 'Width', 'Height'].map((name, i) => {
    const label = document.createElement('label');
    label.textContent = name + ' (pixels) ';
    const input = document.createElement('input');
    input.type = 'number'; input.min = i < 2 ? '0' : '1'; input.step = '1'; input.required = true;
    input.value = i < 2 ? '0' : '40'; input.style.width = '5rem'; input.className = 'border rounded p-2';
    label.append(input); form.append(label); return input;
  });
  const button = document.createElement('button');
  button.textContent = 'Add mask'; button.type = 'submit'; button.className = 'btn-secondary'; form.append(button);
  const status = document.createElement('p'); status.setAttribute('role', 'status'); form.append(status);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const [x, y, width, height] = inputs.map(i => Number(i.value));
    if (![x,y,width,height].every(Number.isFinite) || x < 0 || y < 0 || width <= 0 || height <= 0 || x + width > canvas.width || y + height > canvas.height) {
      status.textContent = `Keep the mask inside the ${canvas.width} by ${canvas.height} pixel image.`; return;
    }
    add({ id: crypto.randomUUID(), x, y, width, height, type: tool() }); status.textContent = 'Mask added. Review the image before exporting.';
  });
  const stage = canvas.closest('[data-redaction-stage]') ?? canvas.parentElement?.parentElement;
  stage?.after(form);
}
