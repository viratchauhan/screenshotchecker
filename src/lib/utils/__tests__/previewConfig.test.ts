import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('branch Preview opts in without changing the reviewed production configuration', () => {
  const config = JSON.parse(readFileSync('wrangler.jsonc', 'utf8'));
  const { previews, ...production } = config;
  assert.deepEqual(previews, {});
  // Exact production fields from the reviewed 8678ae3 checkpoint. In particular,
  // do not activate the unused Worker backend or add production data bindings.
  assert.deepEqual(production, {
    $schema: 'node_modules/wrangler/config-schema.json',
    name: 'screenshotchecker',
    compatibility_date: '2026-08-20',
    assets: { directory: './dist' },
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
