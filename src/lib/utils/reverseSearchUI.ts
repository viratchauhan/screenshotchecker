import { prepareReverseImage } from './reverseImage';

export function setupReverseSearch() {
  const input = document.getElementById('reverse-file') as HTMLInputElement;
  const ready = document.getElementById('reverse-ready')!;
  const preview = document.getElementById('reverse-preview') as HTMLImageElement;
  const download = document.getElementById('reverse-download') as HTMLAnchorElement;
  const share = document.getElementById('reverse-share') as HTMLButtonElement;
  const status = document.getElementById('reverse-status')!;
  let file: File | null = null;
  let previewUrl = '';
  let generation = 0;
  function reset() {
    file = null; ready.hidden = true; share.hidden = true;
    preview.removeAttribute('src'); download.removeAttribute('href');
    document.getElementById('reverse-info')!.textContent = '';
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = ''; input.value = '';
  }
  async function prepare(source: File) {
    const run = ++generation; reset(); status.textContent = 'Preparing image locally…';
    try {
      const prepared = await prepareReverseImage(source);
      if (run !== generation) return;
      file = prepared.file; previewUrl = URL.createObjectURL(file);
      preview.src = previewUrl; download.href = previewUrl;
      document.getElementById('reverse-info')!.textContent = `${prepared.width} × ${prepared.height} pixels · PNG search copy · ${(file.size / 1024).toFixed(0)} KB`;
      share.hidden = !navigator.canShare?.({ files: [file] });
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
  window.addEventListener('pagehide', () => { generation++; reset(); });
}
