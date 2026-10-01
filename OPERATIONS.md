# ScreenshotChecker operations inventory

Checkpoint: 30 September 2026 (Asia/Kolkata). Owner: Virat Chauhan. Incident contact: owner in the existing assistant conversation; no third-party contact authorized here.

## Source and execution
- Public repository read/clone verified: https://github.com/viratchauhan/screenshotchecker
- Baseline: `6de574c` (Document ScreenshotChecker for HSC submission and add MIT license).
- Local recovery continued from `77b2cd8` on isolated branch `fix/04b-export-safety`, preserving the earlier `fix/07a-payment-context` history; user's offline computer was not used.
- Repository guidance: `AGENTS.md`, `WORK-QUEUE.md`, `GROWTH-PLAN.md`. Existing `WORK-QUEUE.md` remains the only task queue.
- Current owner-assigned 30 September execution plan authorizes research, local implementation and tests. Repository guidance warns that a Git push can trigger production. No push, PR, merge or deploy performed in this batch.
- Before remote publication: verify branch-trigger behavior and concrete release authority. Do not infer production permission from a local-fix request.

## Verification environment
- Initial runtime was Node 24.19.0 / npm 11.9.0. On 1 October, exact repo pins Node 26.9.0 / npm 11.19.1 were installed to an isolated temporary prefix and verified: 29/29 tests, 32-page build, SEO and blog SEO pass. Project pins/lockfile/global settings unchanged; see `audit/PINNED-RUNTIME-2026-10-01.md`.
- Install: `npm ci --cache /tmp/sc-npm-cache` succeeded (310 packages). Default npm cache path was inaccessible; lockfile unchanged.
- Latest 04B export-safety checkpoint: exact pinned-runtime clean dependency install, 31/31 tests, 32-page build, SEO/blog checks and scoped local Canvas pixel/PNG QA independently pass. Production browser download/privacy gates remain open; see `audit/04B-export-qa-2026-10-01.md`.
- Checks: `npm test`, `npm run check`, `npm run build`, `npm run test:seo`, `npm run test:blog-seo`.
- Build in this workspace needs `ASTRO_TELEMETRY_DISABLED=1 XDG_CONFIG_HOME=/tmp/sc-config npm run build` because default home config is inaccessible.
- There is no established unattended runtime or survival/restart guarantee from this checkout. No scheduler was created here. Resume from the checkpoint before running further work; do not overlap implementation runs.

## Production and rollback
- Public production URL: https://screenshotchecker.com
- Checked config is static Astro output; `wrangler.jsonc` names `screenshotchecker` and `dist` assets.
- Owner screenshots and existing authorized CLI confirm Worker screenshotchecker/domain screenshotchecker.com, linked GitHub repo, production branch main with npm run build then npx wrangler deploy, and enabled nonproduction builds using npx wrangler preview. Active production version: 0689f4ff-ca29-421f-8eb1-d64e9e14174c at 100%, deployed 24 September 2026 10:06:50 UTC. Source commit mapping remains unknown. See audit/R1-preview-readiness-2026-10-01.md.
- Current production version above is the recorded rollback baseline; CLI history/rollback command availability is verified, but rollback has not been exercised. Recheck active version immediately before any separately authorized production release.
- Release gates still open: preview UI/mobile/keyboard checks, changed-flow network review, production environment/runtime confirmation and production authority verification. The earlier baseline test failures are resolved or explicitly migrated in the reviewed cumulative checkpoint; this is not a general safety certification.

## Measurement, communication and costs
- Current Search Console/Bing access and current baseline: not verified in this workspace. Historical search evidence is not website-session analytics.
- Analytics provider settings, event coverage, bot/internal exclusions, retention and freshness: UNKNOWN. No analytics instrumentation changed.
- Sender/public accounts, outreach audiences and campaign authorization: not verified here. No external communications sent.
- Hosting/API cost, included limits, reset dates and numerical spending caps: UNKNOWN. No purchase, paid service or subscription added.
- Never place credentials, private images, extracted personal text or sensitive analytics payloads in this file or public issues.
