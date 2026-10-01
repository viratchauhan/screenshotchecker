# R1 branch Preview configuration checkpoint

Date: 1 October 2026 (Asia/Kolkata). Base: reviewed cumulative `8678ae337666512ba3b7f41e1ca64ffe6070d0c7`. Scope: prepare the already-configured nonproduction branch Preview. Production deployment is not authorized by this work. Status: independently accepted local configuration change at `b89ccd0e1d2a01fc08e5934707af3905cdbcea95`.

## Verified deployment boundary

Owner-shared Cloudflare Builds screenshots identify repository `viratchauhan/screenshotchecker`, production branch `main`, build `npm run build`, production command `npx wrangler deploy`, and enabled preview builds using `npx wrangler preview`. Root is `/`, includes `*`, excludes `node_modules/**` and `.git/`. An existing authorized Wrangler session independently identifies active production version `0689f4ff-ca29-421f-8eb1-d64e9e14174c` at 100%, deployed 24 September 2026 10:06:50 UTC. This is a rollback baseline, not a tested rollback or a verified mapping to a source commit.

Current official Cloudflare docs say pushes to branches other than the configured production branch run the Preview command, which creates/updates a Preview without promoting production. They require a `previews` block even when empty; top-level assets and compatibility date remain top-level. Project-installed and locked Wrangler 4.136.2 supports this feature (minimum 4.135.0). Its configuration parser accepts the new block.

## Minimal change and checks

- Add only `"previews": {}` to `wrangler.jsonc`; all previous production fields remain byte-value-equivalent when parsed
- Keep Worker name, assets directory, compatibility date, build/deploy commands, dependency pins and lockfile unchanged; no server entrypoint, production data binding, secret, route or custom domain is added
- Two focused regressions verify exact prior production configuration, empty Preview settings, supported locked Wrangler and build-command safety
- Exact Node 26.9.0/npm 11.19.1 `npm run check`: 32/32 entrypoints and 32-page build pass; SEO/blog checks pass
- Wrangler's local configuration parser accepts the file; no remote preview/deploy command was used for this verification

## Publication and remaining gates

After scoped review, publish only a new feature branch and draft PR. Re-read main before publication; do not merge or change main. Require the remote source tree to equal the reviewed tree. Monitor the exact remote head's build/Preview and inspect its `X-Robots-Tag` response before browser testing. Use only synthetic images; the Google tag and OCR asset downloads remain present, so local no-fetch controls do not establish whole-page privacy.

Changed-flow browser/mobile/keyboard acceptance, actual downloaded PNG inspection, full-page network behavior, live source-version mapping and a rehearsed rollback remain open. Creating a branch Preview does not authorize production deployment. The previous v6 artifacts stay recoverable as an earlier Library version when this successor is saved.

## Primary references

- https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
- https://developers.cloudflare.com/workers/previews/configuration/


## Independent review

Accepted functional configuration checkpoint `b89ccd0e1d2a01fc08e5934707af3905cdbcea95`, tree `b11021a5263d8a3656f2f2360e7e217def1498d5`. Parsed comparison to `8678ae3` proves the empty previews block is the only semantic Wrangler change; package.json, package-lock.json, .nvmrc and astro.config.mjs are byte-identical. The reviewer independently passed exact pinned-runtime aggregate (32/32 entrypoints and 32-page build), SEO/blog checks, both config controls, whitespace and local Wrangler deploy --dry-run (no bindings; exit before upload). No blocking finding within this narrow change. No remote write or deployment occurred during review. Actual Preview noindex, browser/saved-file/network and production release gates remain open.
