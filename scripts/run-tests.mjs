import { readdirSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const target = readFileSync(path.join(root, '.nvmrc'), 'utf8').trim();
if (process.versions.node !== target) console.warn(`Tested Node: ${target}; running: ${process.versions.node}`);
function discover(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? discover(file) : /[\\/]__tests(?:__)?[\\/]/.test(file) && /(?:\.test\.(?:ts|mjs)|Tests\.ts)$/.test(file) ? [file] : [];
  });
}
const files = discover(path.join(root, 'src/lib')).sort();
if (!files.length) throw new Error('No test entrypoints found');
let failed = 0;
for (const file of files) {
  console.log(`\nRunning ${path.relative(root, file)}`);
  const result = spawnSync(process.execPath, ['--import', 'tsx', ...(file.endsWith('.mjs') ? ['--test'] : []), file], { cwd: root, stdio: 'inherit', timeout: 120000 });
  if (result.error || result.status !== 0) { failed++; console.error(`FAILED: ${path.relative(root, file)}`, result.error?.message || `exit ${result.status}`); }
}
console.log(`\nEntrypoints: ${files.length - failed} passed, ${failed} failed, ${files.length} total`);
process.exitCode = failed ? 1 : 0;

