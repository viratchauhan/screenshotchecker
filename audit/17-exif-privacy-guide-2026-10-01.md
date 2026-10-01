# Task 17: existing EXIF privacy guide improvement

Prepared 1 October 2026. Local review checkpoint; no branch publication, PR, deployment or outreach performed for this slice.

## Scope

- Fresh isolated branch from verified main `3af9a3e9c5f4c54d441956570d90cffb81c93a5f`, tree `0fd865161932f2e9677b06b95a9b2a3e7157a789`.
- Rewrites only the existing `/blog/exif-metadata/` record in the actual article source, `src/data/blogArticles.ts`. No duplicate page or new route.
- Answers the privacy question first, distinguishes embedded metadata, visible pixels and information outside the file, and gives inspect → clean → reopen/recheck instructions using existing control labels.
- Removes categorical screenshot-no-EXIF/GPS and blanket social-platform stripping claims. Explains format capabilities without implying that every screenshot contains those fields; empty parser records are explicitly inconclusive.
- Links directly to `/screenshot-metadata-checker/`, `/image-metadata-remover/`, the released redaction tutorial and the privacy policy. The article's main CTA now opens the inspector rather than the homepage.
- Uses the existing fictional PNG example by reference. Explicitly says its Comment-removal observation tested neither an EXIF-bearing source nor the metadata remover's export path. No new or modified asset, runtime, dependency, analytics, storage, setting or deployment configuration.
- Removes only this article's keyword-only block. Adds a ScreenshotChecker organizational byline and six visible/schema-identical FAQs using the existing template.

## Primary-source verification

Read on 1 October 2026:

- [W3C PNG Third Edition, EXIF chunk](https://www.w3.org/TR/png-3/#11eXIf): PNG supports an eXIf profile; recorded fields may no longer describe subsequently edited image data.
- [W3C PNG textual information](https://www.w3.org/TR/png-3/#11textinfo): PNG text chunks can carry descriptions, comments and other text.
- [Android ExifInterface](https://developer.android.com/reference/androidx/exifinterface/media/ExifInterface): PNG is among supported EXIF reading/writing formats. This API capability is not evidence about every Android screenshot's contents.
- [Apple location-metadata guidance](https://support.apple.com/guide/personal-safety/manage-location-metadata-in-photos-ips0d7a5df82/web): location information can be reviewed/removed and excluded through the Photos share options. This is not a guarantee about all metadata or visible details.

Current metadata extraction and canvas-export source were inspected to verify the guide's control labels, PNG download path and parser-failure caveat. No runtime repair was included.

## Date boundary

The original `publishedAt: 2026-08-22` is preserved. The release candidate uses `updatedAt: 2026-10-01` for the intended 1 October publication. This is release preparation, not a claim that production has changed. Full checks were rerun after date finalization; independent review must inspect this final dated candidate. If release slips beyond 1 October, correct the update date and repeat validation before publication. Do not change the original publication date.

## Verification

Exact repository pins: **Node 26.9.0 / npm 11.19.1**. Reused the existing installed dependencies whose lockfile matches this branch; no new clean-room install claimed.

- Focused EXIF guide tests: **2/2 pass**. Cover stable slug/original date, inspector/remover/tutorial/privacy links, actual control labels, three privacy categories, five-step checklist, primary sources and calibrated claims.
- `npm run check`: **PASS, 37/37 discovered entrypoints and 33-page build**.
- `npm run test:seo`: **PASS, 33 pages, zero errors and zero warnings**.
- `npm run test:blog-seo`: **PASS**, all eight articles. New built-output checks cover six FAQ/schema pairs, byline/title/description parity, the unchanged canonical and one H1 through the general assertions, direct CTA/internal targets, source links, privacy limitations and absence of the keyword block.
- Compared every other article record against the verified base: **unchanged**. Existing tutorial asset identity/chunk tests still pass.
- `git diff --check`: **PASS**.
- First built CTA regression exposed its existing decorative arrow in the link text; the assertion now compares the label span and exact destination. Final full checks above were rerun after that test correction.
- Existing large-client-bundle warning remains. No SEO traffic/ranking/citation gain is claimed.

## Remaining gates and limits

1. Independent content/code review of this exact checkpoint.
2. Separately coordinated authorized draft PR/Preview of the final dated candidate; correct the update date and revalidate if publication slips.
3. Exact-head Preview inspection at wide and narrow widths, FAQ/link navigation and readability, followed by controlled production verification when approved.

This content-only slice does not establish universal EXIF-removal reliability, re-test the metadata tool in every browser, or close broader tasks 09, 15 or 17. Browser visual QA is not claimed here; it remains a Preview gate. Existing tool copy outside this guide and metadata parser/export behavior remain separate scope.
