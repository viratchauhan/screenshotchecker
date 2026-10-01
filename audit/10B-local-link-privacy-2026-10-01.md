# Task 10B: standalone link-checker privacy slice

Date: 1 October 2026. Owner-delegated local technical/privacy work, not a reporting automation. Base: public main `52c858db8c2d62269a00ad96d4599dfcaff8500d`. Isolated checkout/branch: `screenshotchecker-task10b`, `fix/task10b-local-link-privacy`. Parent independent review and separate publication authorization remain required. Tutorial PR2 was not accessed or changed.

## Reproduction and decision

Before editing, executed the production `checkLink` function with global fetch fully intercepted and the synthetic input `Synthetic message https://private-fixture.invalid/path?token=SYNTHETIC_ONLY`. The first recorded request was `POST /api/check-link` with JSON containing that entire message. A simulated 404 then produced bodyless GETs for `/urldataIndex/shard_38.json` and `/urldataIndex/shard_9d.json`, and `NO_LOCAL_MATCH` from empty fixture shards. No actual HTTP request or destination visit occurred.

The current repository's `wrangler.jsonc` has only static assets and no Worker main entrypoint. Astro builds static output with no server adapter. The legacy `src/worker.ts` API is not activated by that configuration. This source evidence supports removing the preliminary submission: the existing browser lookup already performs the intended analysis for this static deployment. Live hosting configuration was not accessed or independently reverified in this task.

## Change

- Removed the server-first branch from `src/lib/linkChecker/client.ts`. `checkLink` now goes straight from existing empty-input validation to existing extraction and `verifySingleUrl` calls. No normalization, scoring, extraction, dataset, caching or UI/history implementation changes.
- Updated only the standalone-link paragraph in the privacy policy and its shared FAQ answer, plus their corresponding source/built-output checks. The text distinguishes local analysis from static shard/resource and analytics requests; ten-result localStorage history and Clear History remain disclosed.
- Migrated the previous API-success/fallback assertions to the direct local contract while retaining normalization, SSRF, exact/host/domain precedence, good/bad/conflict/no-match and invalid controls.
- Added `localPrivacy.test.ts`: all requests intercepted; `.invalid` single/multiple URLs and synthetic message/token; deduplication/order, good/bad/conflict/no-match, unavailable/retry, invalid/empty input; every observed request must be a bodyless static shard GET, with no submitted host, message, path token or API target.
- Added `localWorkflow.test.ts`: runs the unchanged production workspace script in jsdom against synthetic DOM and mocked shards. Covers unavailable/retry, conflict presentation, multi-URL picker, form submit, history recheck, duplicate replacement, ten-entry cap, first-result history behavior, error recovery and Clear History.

## Initial exact validation (privacy checkpoint 0b18098)

Runtime: installed Node **v26.9.0**, npm **11.19.1**, matching `.nvmrc` and `packageManager`. Clean `npm ci --cache ../npm-cache --no-audit --no-fund` installed 298 locked packages. Package/lockfiles and dependencies unchanged. Install reported existing deprecation/install-script notices; no audit or dependency upgrade claimed.

| Command/check | Result |
| --- | --- |
| Synthetic before-change production-client reproduction | Full-message POST confirmed, followed by local shard fallback |
| `ASTRO_TELEMETRY_DISABLED=1 npm run check` (PowerShell environment equivalent) | **34 passed / 1 failed / 35 entrypoints**; aggregate stopped before build |
| Existing dataset availability entrypoint | 20 mocked client/server scenarios pass; no live requests |
| Existing local dataset and link-client entrypoints | Pass, including precedence, verdict and strict SSRF controls |
| New local privacy and workspace entrypoints | Pass in aggregate |
| Final `node --import tsx src/lib/linkChecker/__tests__/localWorkflow.test.ts` | Pass after adding actual form/recheck event assertions |
| Separate `ASTRO_TELEMETRY_DISABLED=1 npm run build` | Pass, 32 pages; existing large-chunk warning remains |
| `npm run test:seo` | Pass, 32 pages, zero errors/warnings |
| `npm run test:blog-seo` | Pass, seven guides plus analyzer FAQ/byline/link parity |
| `node --import tsx scripts/verify-privacy-copy.mjs` | Pass, four visible/structured FAQ sets plus policy/canonical checks |
| `git diff --check` | Pass |

The aggregate failure is in unchanged `redactionExport.test.ts`, “all discovered redaction surfaces use the guarded export and accessible status”: recursive `readdirSync` on Windows yields `src/components/workspaces\RedactorWorkspace.astro`, while the expected string uses `/`. Test and relevant redaction sources are byte-unchanged from the base. This is an unrelated Windows portability limitation, not a passing aggregate gate. It was not fixed or suppressed to broaden this task. Initial sandbox launches also hit npm-cache permission and tsx `uv_os_get_passwd` errors; workspace cache and approved local execution resolved those environment issues.

Full command logs are retained beside the checkout as `task10b-install.log`, `task10b-reproduction.log`, `task10b-check.log`, `task10b-build.log`, `task10b-seo.log`, `task10b-blog-seo.log`, `task10b-privacy-copy.log`, and `task10b-workflow.log`. Logs use synthetic regression fixtures; no real private links were submitted.

## Limits and remaining work

This establishes the scoped client request contract under interception and production-script DOM behavior, not a whole-page browser network audit, real-browser visual/mobile/clipboard verification, production deployment result or live URL safety certification. Static shard requests remain; their input-derived shard identifiers can reveal coarse lookup information and are not an anonymity guarantee. Analytics and other resources are unchanged. History still stores up to ten original URL results locally. Existing extraction/public-suffix limitations, dataset age/provenance, legacy inactive provider/service cleanup and broader task 09 privacy work remain open. No provider/API, dataset refresh, scoring change, telemetry change or dependency was introduced. No push, PR creation, merge, deployment, account change, credential extraction or new grant occurred.

Next: parent independent review of this local commit and Windows aggregate limitation before any publication. Do not automatically start another queue task.

## Authorized Windows portability follow-up

The parent requested clean-base reproduction and a minimal test-only repair after reviewing the initial result. Created detached worktree `screenshotchecker-task10b-base` at exact main `52c858db8c2d62269a00ad96d4599dfcaff8500d`, installed its locked dependencies offline from the workspace cache, and verified its tracked tree remained clean. With Node 26.9.0/npm 11.19.1, `node --import tsx src/lib/utils/__tests__/redactionExport.test.ts` exited 1: **13 passed, 1 failed, 14 total**. The sole failure was the complete-surface equality assertion at line 161:

```text
actual:   src/components/workspaces\RedactorWorkspace.astro
expected: src/components/workspaces/RedactorWorkspace.astro
```

This reproduces the failure without any task 10B changes and identifies Windows recursive-directory separator output as its cause. No Linux execution is claimed.

The correction changes only the discovered-path side of that test comparison from `discovered.sort()` to `discovered.map(file => file.replace(/\\/g, '/')).sort()`. The exact expected surface list, discovery/filter logic, deep equality, and all per-surface export/status assertions remain intact. Missing or additional surfaces still fail; the test is neither skipped nor weakened. No runtime file changed in this follow-up.

Final exact-pinned validation:

- Targeted redaction entrypoint: exit 0, **14/14 pass** (`task10b-redaction-after.log`).
- `ASTRO_TELEMETRY_DISABLED=1 npm run check` (PowerShell environment equivalent): exit 0, **35/35 entrypoints**, **32-page build** (`task10b-check-final.log`). Includes both new privacy/workspace tests with form/recheck assertions.
- `npm run test:seo`: exit 0, 32 pages, zero errors/warnings (`task10b-seo-final.log`).
- `npm run test:blog-seo`: exit 0, seven guides and analyzer FAQ/byline/link parity (`task10b-blog-seo-final.log`).
- `node --import tsx scripts/verify-privacy-copy.mjs`: exit 0, four FAQ sets and privacy canonical/disclosure checks (`task10b-privacy-copy-final.log`).
- `git diff --check`: pass. Existing build-size and experimental test-runtime notices remain; no validation blocker remains.

Clean-base evidence is retained in `task10b-base-install.log` and `task10b-base-redaction.log` beside the two worktrees. The initial logs above remain unchanged. Runtime privacy scope and all browser/production limitations remain as documented. Parent independent review remains required; no remote repository writes, production actions or tutorial PR2 changes occurred.
