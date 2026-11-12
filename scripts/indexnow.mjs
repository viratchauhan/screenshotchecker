// Tell Bing (which shares with Yandex and the other IndexNow engines) about new or changed pages.
// usage: node scripts/indexnow.mjs blog/some-guide/ tool-page/ ...  (paths without a leading slash: Git Bash rewrites /paths)
//        node scripts/indexnow.mjs --all   (every URL in the live sitemap)
// The key file lives at public/<KEY>.txt and is served from the site root.
const HOST = 'screenshotchecker.com';
const KEY = '548e7443ed0e42d77af84624c3b08d01';

let paths = process.argv.slice(2);
if (paths.includes('--all')) {
  const index = await (await fetch(`https://${HOST}/sitemap-index.xml`)).text();
  const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  paths = [];
  for (const m of maps) {
    const xml = await (await fetch(m)).text();
    paths.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => x[1]));
  }
}
const urlList = paths.map((p) => (p.startsWith('http') ? p : `https://${HOST}/${p.replace(/^\/+/, '')}`));
if (!urlList.length) {
  console.error('usage: node scripts/indexnow.mjs <path ...> | --all');
  process.exit(1);
}

const res = await fetch('https://www.bing.com/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URL(s)`);
if (res.status >= 400) process.exit(1);
