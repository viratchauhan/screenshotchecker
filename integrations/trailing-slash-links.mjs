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

        // Static assets answer /about with a 307 to /about/. Add a permanent 301 for every
        // built page so links without the slash pass their full value.
        const pages = [];
        for await (const file of htmlFiles(root)) {
          const rel = '/' + file.slice(root.length).replace(/\\/g, '/').replace(/^\//, '');
          if (!rel.endsWith('/index.html') || rel === '/index.html') continue;
          pages.push(rel.slice(0, -'/index.html'.length));
        }
        pages.sort();
        const redirectsFile = join(root, '_redirects');
        const existing = await readFile(redirectsFile, 'utf8').catch(() => '');
        const lines = pages.map((page) => `${page}    ${page}/    301`);
        await writeFile(redirectsFile, `${existing.trimEnd()}\n\n# Missing trailing slash (generated at build)\n${lines.join('\n')}\n`);
        logger.info(`added ${lines.length} trailing-slash redirects`);
      },
    },
  };
}
