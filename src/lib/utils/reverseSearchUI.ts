import { prepareReverseImage, clampCropRect, findTrimBounds, type CropRect } from './reverseImage';

export function setupReverseSearch() {
  const input = document.getElementById('reverse-file') as HTMLInputElement;
  const ready = document.getElementById('reverse-ready')!;
  const preview = document.getElementById('reverse-preview') as HTMLImageElement;
  const download = document.getElementById('reverse-download') as HTMLAnchorElement;
  const share = document.getElementById('reverse-share') as HTMLButtonElement;
  const status = document.getElementById('reverse-status')!;
  let file: File | null = null;
  let fullFile: File | null = null;
  let fullUrl = '';
  let previewUrl = '';
  let selection: CropRect | null = null;
  const stage = document.getElementById('reverse-crop-stage')!;
  const box = document.getElementById('reverse-crop-box')!;
  const cropButton = document.getElementById('reverse-crop') as HTMLButtonElement;
  const uncropButton = document.getElementById('reverse-uncrop') as HTMLButtonElement;
  const info = (w: number, h: number, f: File, cropped: boolean) => { document.getElementById('reverse-info')!.textContent = `${w} × ${h} pixels · PNG search copy${cropped ? ' (cropped)' : ''} · ${(f.size / 1024).toFixed(0)} KB`; };
  function clearSelection() { selection = null; box.hidden = true; cropButton.disabled = true; }
  function show(next: File, url: string, w: number, h: number, cropped: boolean) {
    if (previewUrl && previewUrl !== fullUrl && previewUrl !== url) URL.revokeObjectURL(previewUrl);
    file = next; previewUrl = url; preview.src = url; download.href = url;
    info(w, h, next, cropped); uncropButton.hidden = !cropped; clearSelection();
    share.hidden = !navigator.canShare?.({ files: [next] });
  }
  async function cropTo(rect: CropRect, label: string) {
    const r = clampCropRect(rect, preview.naturalWidth, preview.naturalHeight);
    const canvas = document.createElement('canvas'); canvas.width = r.width; canvas.height = r.height;
    const ctx = canvas.getContext('2d'); if (!ctx) { status.textContent = 'Cropping is not available in this browser.'; return; }
    ctx.drawImage(preview, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height);
    const blob = await new Promise<Blob | null>(done => canvas.toBlob(done, 'image/png'));
    if (!blob) { status.textContent = 'Could not crop this image.'; return; }
    const cropped = new File([blob], 'search-image.png', { type: 'image/png' });
    show(cropped, URL.createObjectURL(cropped), r.width, r.height, true);
    status.textContent = `${label} Copy or download the cropped image, then search with a provider.`;
  }
  let generation = 0;
  function reset() {
    file = null; fullFile = null; ready.hidden = true; share.hidden = true; uncropButton.hidden = true; clearSelection();
    preview.removeAttribute('src'); download.removeAttribute('href');
    document.getElementById('reverse-info')!.textContent = '';
    if (previewUrl && previewUrl !== fullUrl) URL.revokeObjectURL(previewUrl);
    if (fullUrl) URL.revokeObjectURL(fullUrl);
    previewUrl = ''; fullUrl = ''; input.value = '';
  }
  async function prepare(source: File) {
    const run = ++generation; reset(); status.textContent = 'Preparing image locally…';
    try {
      const prepared = await prepareReverseImage(source);
      if (run !== generation) return;
      fullFile = prepared.file; fullUrl = URL.createObjectURL(fullFile);
      show(fullFile, fullUrl, prepared.width, prepared.height, false);
      ready.hidden = false; status.textContent = 'Ready. Copy or download, then open a provider and submit the image there.';
    } catch (error) {
      if (run === generation) status.textContent = error instanceof Error ? error.message : 'Could not prepare this image. Try another file.';
    }
  }
  input.addEventListener('change', () => { const selected = input.files?.[0]; if (selected) void prepare(selected); });
  const panel = input.closest('section')!;
  panel.addEventListener('dragover', event => event.preventDefault());
  panel.addEventListener('drop', event => { event.preventDefault(); const selected = event.dataTransfer?.files[0]; if (selected) void prepare(selected); });
  document.addEventListener('paste', event => { const selected = event.clipboardData?.files[0]; if (selected) { event.preventDefault(); void prepare(selected); } });
  document.getElementById('reverse-clear')!.addEventListener('click', () => { generation++; reset(); status.textContent = 'Image cleared.'; input.focus(); });
  document.getElementById('reverse-copy')!.addEventListener('click', async () => {
    if (!file) return;
    const run = generation;
    try {
      if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') throw new Error('unsupported');
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': file })]);
      if (run === generation) status.textContent = 'Image copied. Open a provider and paste if supported, or use Download PNG.';
    } catch { if (run === generation) status.textContent = 'Image copying is unavailable or was blocked. Download the PNG and upload it on the provider’s site.'; }
  });
  share.addEventListener('click', async () => {
    if (!file) return;
    const run = generation;
    try { await navigator.share({ files: [file] }); if (run === generation) status.textContent = 'Share action completed. Check the app you selected; this does not confirm a search ran.'; }
    catch (error) { if (run === generation) status.textContent = error instanceof Error && error.name === 'AbortError' ? 'Sharing cancelled. Your image is still ready.' : 'Sharing is unavailable. Download the PNG instead.'; }
  });
  // Drag to select an area of the preview (mouse, pen or touch).
  let start: { x: number; y: number } | null = null;
  const point = (event: PointerEvent) => { const r = preview.getBoundingClientRect(); return { x: Math.min(Math.max(event.clientX - r.left, 0), r.width), y: Math.min(Math.max(event.clientY - r.top, 0), r.height), r }; };
  stage.addEventListener('pointerdown', event => { if (!file) return; const p = point(event); start = { x: p.x, y: p.y }; stage.setPointerCapture(event.pointerId); clearSelection(); });
  stage.addEventListener('pointermove', event => {
    if (!start) return; const p = point(event);
    const x = Math.min(start.x, p.x), y = Math.min(start.y, p.y), w = Math.abs(p.x - start.x), h = Math.abs(p.y - start.y);
    box.style.left = `${x + preview.offsetLeft}px`; box.style.top = `${y + preview.offsetTop}px`; box.style.width = `${w}px`; box.style.height = `${h}px`; box.hidden = w < 4 || h < 4;
    const scale = preview.naturalWidth / p.r.width; selection = w >= 4 && h >= 4 ? { x: x * scale, y: y * scale, width: w * scale, height: h * scale } : null; cropButton.disabled = !selection;
  });
  const end = () => { start = null; };
  stage.addEventListener('pointerup', end); stage.addEventListener('pointercancel', end);
  cropButton.addEventListener('click', () => { if (selection) void cropTo(selection, 'Cropped to your selection.'); });
  document.getElementById('reverse-trim')!.addEventListener('click', () => {
    if (!file) return;
    const w = preview.naturalWidth, h = preview.naturalHeight; const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true }); if (!ctx) return;
    ctx.drawImage(preview, 0, 0); const bounds = findTrimBounds(ctx.getImageData(0, 0, w, h).data, w, h);
    if (bounds.width === w && bounds.height === h) { status.textContent = 'No plain borders found. Drag across the picture to crop it instead.'; return; }
    void cropTo(bounds, 'Plain borders trimmed.');
  });
  uncropButton.addEventListener('click', () => { if (!fullFile) return; show(fullFile, fullUrl, 0, 0, false); preview.decode?.().then(() => info(preview.naturalWidth, preview.naturalHeight, fullFile!, false)).catch(() => {}); status.textContent = 'Back to the full image.'; });
  window.addEventListener('pagehide', () => { generation++; reset(); });
}
