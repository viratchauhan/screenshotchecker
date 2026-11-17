// Prints a render-og.py spec for every guide without a share card: node --import tsx scripts/content/og-spec.mjs > spec.json
import { existsSync } from 'node:fs';
import { getAllArticles } from '../../src/data/blogArticles.ts';
const spec = getAllArticles()
  .filter((a) => !existsSync(`public/og/blog-${a.slug}.png`))
  .map((a) => {
    let title = a.title.split(/: | \(/)[0];
    if (title.length > 70) title = title.slice(0, title.lastIndexOf(' ', 66)) + '…';
    return { name: `blog-${a.slug}`, label: a.lang === 'hi' ? 'गाइड' : 'GUIDE', title, sub: a.keyTakeaway?.title || '', lang: a.lang || 'en' };
  });
spec.push({ name: 'utr-number-checker', label: 'FREE TOOL', title: 'UTR number checker', sub: 'Check the format, then confirm in your own bank', lang: 'en' });
console.log(JSON.stringify(spec, null, 1));
