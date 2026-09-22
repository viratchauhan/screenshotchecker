import type { MetadataInfo, MetadataTag } from '../analyzer/types';

// File metadata is untrusted. Only fixed UI structure becomes elements;
// all metadata (including tag names and groups) becomes text nodes.
function element(doc: Document, tag: string, className: string, text?: string): HTMLElement {
  const node = doc.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderMetadataSummary(container: HTMLElement, meta: MetadataInfo): void {
  const doc = container.ownerDocument;
  if (!meta.hasExif && meta.tags.length === 0) {
    container.replaceChildren(element(doc, 'p', 'text-xs text-muted italic bg-canvas p-3 rounded-lg border border-hairline', 'No metadata or EXIF tags found in this image.'));
    return;
  }

  const card = element(doc, 'div', 'bg-canvas border border-hairline rounded-lg p-3 text-xs space-y-2');
  const grid = element(doc, 'div', 'grid grid-cols-2 gap-2');
  const fields = [
    ['Camera / Device:', meta.camera ? `${meta.camera.make || ''} ${meta.camera.model || ''}`.trim() : 'Unknown'],
    ['Software:', meta.software || 'None detected'],
    ['Creation Date:', meta.dateTime || 'Not specified'],
    ['GPS Coordinates:', meta.gps ? `${meta.gps.lat.toFixed(4)}, ${meta.gps.lng.toFixed(4)}` : 'None'],
  ];
  for (const [label, value] of fields) {
    const row = element(doc, 'div', '');
    row.append(element(doc, 'span', 'text-muted', label), doc.createTextNode(' '), element(doc, 'span', 'text-ink font-medium', value));
    grid.append(row);
  }
  card.append(grid);
  container.replaceChildren(card);

  if (meta.tags.length) {
    const details = element(doc, 'details', 'text-xs');
    details.append(element(doc, 'summary', 'cursor-pointer font-medium text-primary hover:underline py-1', `View all ${meta.tags.length} metadata tags`));
    const list = element(doc, 'div', 'mt-2 max-h-48 overflow-y-auto bg-canvas border border-hairline rounded-lg p-2 font-mono text-[11px] space-y-1');
    for (const tag of meta.tags) {
      const row = element(doc, 'div', '');
      row.append(element(doc, 'span', 'text-muted', `[${tag.group}] ${tag.tag}:`), doc.createTextNode(' '), element(doc, 'span', 'text-ink', tag.value));
      list.append(row);
    }
    details.append(list);
    container.append(details);
  }
}

export function renderMetadataGroups(container: HTMLElement, meta: MetadataInfo): void {
  const doc = container.ownerDocument;
  container.replaceChildren();
  if (!meta.hasExif && meta.tags.length === 0) {
    const empty = element(doc, 'div', 'bg-canvas border border-hairline rounded-xl p-6 text-center text-xs text-muted');
    empty.append(
      element(doc, 'p', 'font-medium text-body', 'No EXIF or hardware tags found in this image.'),
      element(doc, 'p', 'mt-1', 'This file has either already been cleaned or was captured through a platform that strips EXIF tags.'),
    );
    container.append(empty);
    return;
  }

  const groups = new Map<string, MetadataTag[]>();
  for (const tag of meta.tags) {
    const name = tag.group || 'General';
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name)!.push(tag);
  }
  for (const [group, tags] of groups) {
    const card = element(doc, 'div', 'bg-canvas border border-hairline rounded-xl overflow-hidden text-xs');
    card.append(element(doc, 'div', 'bg-surface-cream-strong/50 px-4 py-2 font-semibold uppercase tracking-wider text-muted font-mono text-[11px]', `${group} Information (${tags.length})`));
    const rows = element(doc, 'div', 'divide-y divide-hairline');
    for (const tag of tags) {
      const row = element(doc, 'div', 'px-4 py-2 flex items-center justify-between gap-4 hover:bg-surface-card/40 transition-colors');
      row.append(element(doc, 'span', 'text-muted font-mono', tag.tag), element(doc, 'span', 'font-mono text-ink font-medium text-right truncate max-w-md', tag.value));
      rows.append(row);
    }
    card.append(rows);
    container.append(card);
  }
}
