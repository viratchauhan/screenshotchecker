# Task 17: worked screenshot-redaction tutorial

Prepared 1 October 2026. Review checkpoint only; no publication or production deployment.

## Scope and source

- Based on current main `52c858db8c2d62269a00ad96d4599dfcaff8500d`, whose tree matches the independently reviewed first release.
- One distinct tutorial at `/blog/redact-screenshot-before-sharing/`, integrated through the published source `src/data/blogArticles.ts`. No duplicate in the unused Markdown collection.
- Original authored guide and handoff reviewed in full. Both exact supplied 1200 × 500 PNGs inspected visually before implementation. Fictional content only; no customer image or real transaction.
- Two semantic figures with descriptive alt text, visible unchanged captions, intrinsic dimensions and responsive width/auto-height styling. Stable article-specific public URLs preserve the original PNG bytes and metadata, without an image optimization/re-encoding step.
- A five-item semantic sharing checklist, visible FAQs with matching structured answers, ScreenshotChecker organizational byline and existing breadcrumb/canonical pattern.
- Contextual incoming links from the redactor's related-guide block and the existing verification guide's privacy step. The verification guide retains its direct redactor link and historical dates. The new guide links back to the redactor, verification guide and privacy policy.
- No dependencies, analytics, storage, tool processing, privacy settings, deployment config or other page titles changed. Task 15 and broader task 09 are not closed by this content slice.

## Publication-date boundary

`publishedAt: null` is an explicit review-only placeholder. The article displays “Draft · Publication pending”; its index entry says “Publication pending”. Neither BlogPosting date properties nor sitemap `lastmod` invent a publication date. Existing articles retain their original visible/schema/index/sitemap dates. The 1 October date in Figure 2 describes inspection of the example, not publication.

Before an authorized production merge, set this record's `publishedAt` to the actual release calendar date, rebuild, and rerun the full blog/SEO checks. Do not use the fixture date, draft date, automatic current-date generation or an invented `updatedAt`. If release slips, correct the pending release date before publication. The null placeholder is not authorization to publish a draft.

## Example evidence

| File | SHA-256 |
| --- | --- |
| `synthetic-redaction-before.png` | `b91b35abef4d8e731c67321da0dbb755523c6287bc2bad17512a2d629b12057a` |
| `synthetic-redaction-after.png` | `9bf4e45286df5d6a3c99dbd3b5efbeb1c892de0c263b053b5c40c74a1568755e` |

An independent Pillow decode of these exact artifacts reconfirmed: selected rectangle x=39..420 and y=302..344, 16,426 pixels uniformly RGBA (20,20,19,255), with all 583,574 pixels outside unchanged. The source retains its fictional `Comment` value `SYNTHETIC_METADATA_MARKER_20261001`; the output contains only IHDR/IDAT/IEND chunks. Neither source nor output has an EXIF payload. This supports the inspected example, not a universal metadata-removal guarantee or proof of which browser/build produced it.

## Verification

Exact pinned executables: Node 26.9.0 and npm 11.19.1, using the already-installed lockfile-matched dependencies in an isolated worktree. No new clean-room install claimed.

- `npm run check`: **PASS**, 34/34 discovered test entrypoints and a 33-page build
- `npm run test:seo`: **PASS**, 33 pages, zero errors/warnings
- `npm run test:blog-seo`: **PASS**, all eight guides; dates, sitemap, schema, canonical, one H1, index entry and unique snippets
- New tutorial data tests: exact SHA-256 identity, PNG dimensions/chunks, preserved fictional Comment, no false EXIF test claim, valid figure positions, checklist, control labels, evidence limits and contextual-link source
- Generated tutorial checks: exact title/description, byline, five visible/schema FAQ pairs, both alt texts/dimensions/captions, byte-identical copied build assets, internal destinations and primary-source links
- `git diff --check`: **PASS**
- Existing large-client-bundle warning remains

The cloud browser rejected local tutorial navigation with `net::ERR_BLOCKED_BY_CLIENT`. This restriction was not bypassed. No browser layout, physical-phone, keyboard navigation, actual network-payload or new export-behavior pass is claimed. Figure CSS and generated HTML are checked locally; visual responsive/caption readability remains a nonproduction Preview gate after accepted code review.

Primary sources rechecked: [Bishop Fox pixelation research](https://bishopfox.com/blog/unredacter-tool-never-pixelation), [Tesseract image-quality guidance](https://tesseract-ocr.github.io/tessdoc/ImproveQuality.html), [PNG specification](https://www.w3.org/TR/png-3/#11textinfo). Astro component/styling guidance consulted for static semantic rendering.

## Remaining gates

1. Independent code/content review: **accepted** `834c125` for nonproduction Preview, with no blocking findings. Reviewer independently reran 34/34 tests, 33-page build and both SEO scripts, checked all authored blocks, prior article records and exact PNG evidence
2. Supported recovery artifacts and an authorized draft PR/branch Preview
3. Preview visual check at wide and narrow widths: both images load, proportions remain 12:5, no horizontal overflow, captions readable, FAQ and contextual navigation work
4. Set actual publication date in the authorized release commit; repeat final checks
5. Explicit production merge/deployment authorization and post-release verification

No rankings, indexing, traffic or conversion gains are claimed. The existing task 06 owns the still-unverified measurement baseline; the authored six-indexed-week evaluation proposal has not created a schedule or new tracking.


Independent acceptance covers the functional tutorial checkpoint. Later receipt/review documentation does not change reviewed application source. The null publication date is a truthful draft state, not a technical deployment interlock.


## Release-date finalization after initial Preview

Draft PR [#2](https://github.com/viratchauhan/screenshotchecker/pull/2) has remote feature commit `3e7c15b`, tree-identical to local documentation checkpoint `5491b2e`. Cloudflare [Preview receipt](https://github.com/viratchauhan/screenshotchecker/pull/2#issuecomment-5926878950) confirms build/deployment success for that exact commit, deployment `b8addd79-bcff-4a18-98f7-5922bf7afa03`.

Independent Preview review passed wide and 485px layouts, figure loading/proportions and caption readability, checklist/FAQ, reciprocal contextual links and preservation of existing article dates. This is browser-width QA, not physical-phone testing or a new privacy/network/export guarantee.

Following those checks, the new article's `publishedAt` is set to `2026-10-01` for the authorized 1 October release. The earlier pending-date section describes the reviewed draft checkpoint; this date-only application delta changes visible/schema/index/sitemap dates together. No old article date or `updatedAt` is changed. This remains a release candidate until final checks, independent date/schema confirmation, successor exact-head Preview and the controlled production decision. Correct the date if actual publication moves to a later day.

Final date-candidate rerun on exact Node 26.9.0/npm 11.19.1: `npm run check` passes 34/34 entrypoints and 33-page build; general SEO reports 33 pages with zero errors/warnings; all eight article checks pass, including visible/schema/index/sitemap date parity and unchanged figure bytes. `git diff --check` passes. Independent confirmation of this narrow delta and successor Preview remain pending at this checkpoint.


Independent final-date review **accepted** `9a243f3` with no blocking findings. The reviewer independently reran pinned 34/34 tests, the 33-page build and both SEO scripts, and confirmed visible/index/BlogPosting dates, sitemap lastmod `2026-10-01T00:00:00.000Z`, no invented `updatedAt`, and unchanged prior records/PNG hashes. The successor exact-head Preview and controlled release decision remain separate gates.
