// Rewrites internal links in the built HTML to the canonical trailing-slash form
// (href="/about" -> href="/about/"), so crawlers and visitors skip a redirect hop.
// Leaves files (anything with an extension), anchors, queries and external URLs alone.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HREF = /href="(\/[A-Za-z0-9/_-]*[A-Za-z0-9_-])((?:[?#][^"]*)?)"/g;

export function fixLinks(html) {
  return html.replace(HREF, (match, path, suffix) => {
    const last = path.split('/').pop();
    if (last.includes('.')) return match;
    return `href="${path}/${suffix}"`;
  });
}

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

export default function trailingSlashLinks() {
  return {
    name: 'trailing-slash-links',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        let changed = 0;
        for await (const file of htmlFiles(root)) {
          const html = await readFile(file, 'utf8');
          const next = fixLinks(html);
          if (next !== html) { await writeFile(file, next); changed++; }
        }
        logger.info(`normalised internal links in ${changed} HTML files`);
      },
    },
  };
}
