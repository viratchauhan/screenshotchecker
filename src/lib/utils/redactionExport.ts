import { renderRedactedImage, type RedactionBox } from '../analyzer/redactor';

interface ExportState {
  image: HTMLImageElement;
  boxes: RedactionBox[];
}

const boxKeys = ['id', 'x', 'y', 'width', 'height', 'type'] as const;

/** Requests a browser download; it cannot confirm that the file was saved. */
export function bindRedactionExport(
  button: HTMLButtonElement | null,
  status: HTMLElement | null,
  getState: () => ExportState | null,
  filenamePrefix: string,
  onDownloadRequested?: () => void,
) {
  if (!button) return;
  let busy = false;

  button.addEventListener('click', async () => {
    if (busy) return;
    const state = getState();
    if (!state) return;
    const image = state.image;
    const boxes = state.boxes.map(box => ({ ...box }));
    const isCurrent = () => {
      const current = getState();
      return current?.image === image && current.boxes.length === boxes.length
        && current.boxes.every((box, index) => boxKeys.every(key => box[key] === boxes[index][key]));
    };

    busy = true;
    button.disabled = true;
    if (status) status.textContent = 'Preparing redacted PNG…';
    try {
      const { blob } = await renderRedactedImage(image, boxes, 'image/png');
      // Do not download an obsolete image/mask snapshot after edit or dismissal.
      if (!isCurrent()) {
        if (status) status.textContent = 'Export cancelled because the image or masks changed. Review them and export again.';
        return;
      }
      const url = URL.createObjectURL(blob);
      let anchor: HTMLAnchorElement | undefined;
      try {
        anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${filenamePrefix}-${Date.now()}.png`;
        document.body.appendChild(anchor);
        anchor.click();
      } finally {
        anchor?.remove();
        // Allow the browser to consume the request before releasing its URL.
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      }
      if (status) status.textContent = 'Download requested. Open the PNG and inspect every sensitive area before sharing.';
      onDownloadRequested?.();
    } catch {
      // No original-image fallback, sensitive error details, or success claim.
      if (status) status.textContent = 'Export failed. Your image and masks are still here. Please try again.';
    } finally {
      busy = false;
      button.disabled = false;
    }
  });
}
