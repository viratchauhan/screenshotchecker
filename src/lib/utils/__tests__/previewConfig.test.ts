import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('production serves only the custom domains, with no workers.dev or preview URLs', () => {
  const config = JSON.parse(readFileSync('wrangler.jsonc', 'utf8'));
  // Owner decision 14 Oct 2026: deploy only to screenshotchecker.com (and www),
  // close the *.workers.dev and per-branch preview addresses. Do not activate the
  // unused Worker backend or add production data bindings.
  assert.deepEqual(config, {
    $schema: 'node_modules/wrangler/config-schema.json',
    name: 'screenshotchecker',
    compatibility_date: '2026-08-20',
    assets: { directory: './dist' },
    workers_dev: false,
    preview_urls: false,
    routes: [
      { pattern: 'screenshotchecker.com', custom_domain: true },
      { pattern: 'www.screenshotchecker.com', custom_domain: true },
    ],
  });
});

test('locked Wrangler supports Worker Previews and build does not deploy', () => {
  const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
  const [major, minor] = lock.packages['node_modules/wrangler'].version.split('.').map(Number);
  assert.ok(major > 4 || (major === 4 && minor >= 135));
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  assert.equal(pkg.scripts.build, 'astro build');
  assert.equal(pkg.scripts.prebuild, undefined);
  assert.equal(pkg.scripts.postbuild, undefined);
});
