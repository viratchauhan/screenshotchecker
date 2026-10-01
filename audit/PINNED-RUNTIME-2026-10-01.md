# Exact pinned-runtime verification

Date: 1 October 2026 (Asia/Kolkata). Combined code/content checkpoint tested: `1f76777361b0616ea02025b73ae01fefb603c836` (reviewed B2 source `02d0117`, reviewed engineering through `bf1fff2`). Later documentation-only runtime record does not change tested application code.

- Repository pins: `.nvmrc` Node 26.9.0 and `package.json` npm 11.19.1
- Both exact versions were available from the standard npm registry
- Installed `node@26.9.0` and `npm@11.19.1` into an isolated temporary prefix; did not change global settings, repo pins, lockfile, credentials or application dependencies
- Verified executable versions: Node v26.9.0, npm 11.19.1
- Using those executables via per-command PATH, `npm run check`: PASS, all 29 discovered test entrypoints and 32-page Astro build
- `npm run test:seo`: PASS
- `npm run test:blog-seo`: PASS, including generated B2 FAQ/byline/link parity and other six guides
- Existing >500 kB bundle-size warning remains; no runtime failure
- Existing installed project dependencies were reused from the unchanged lockfile installation; this was not a new clean-room dependency install under Node 26

The prior Node 24 result remains valid historical evidence. Exact runtime execution gate is now verified for this source, but this does not establish production environment settings or release approval. Cloud-browser localhost inspection was blocked by ERR_BLOCKED_BY_CLIENT; no bypass or browser visual pass is claimed. Cloudflare triggers/current deployment/rollback, preview UI/mobile/keyboard/privacy evidence and authorized release still require separate verification.
