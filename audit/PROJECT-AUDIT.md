# ScreenshotChecker project audit

Reviewed 22 September 2026. Repository commit: `1b54ba3` (30 August 2026, “SEO and Tools Improvement”). Live site: https://screenshotchecker.com/.

**Assessment:** This is a working, substantial browser-based toolkit with a good static SEO foundation. Its immediate priority should be trustworthy results and dependable privacy tools, before more feature pages or stronger AI claims. Several findings affect the existing core product.

**What was actually checked**

- Cloned the repository into the previously empty `D:\screenshotchecker` workspace and inspected architecture, analysis engines, rendering, SEO, localization, dependencies, and deployment configuration.
- Installed declared dependencies with lifecycle scripts disabled; the production build succeeded and produced 30 HTML pages.
- Ran the repository SEO verifier: 0 reported errors and 2 length warnings. Independently checked all built pages: one H1 each, unique titles, and no unresolved internal page links. Fragment targets and external links were not exhaustively checked.
- Requested the 30 corresponding live HTML routes plus robots, sitemaps, health, dataset manifest, and a nonexistent URL. Public pages loaded; live titles matched built titles. This does not prove byte-for-byte deployment identity.
- Ran 15 existing TypeScript test entrypoints: 12 exited successfully; 3 exited unsuccessfully. These are script exit results, not a comprehensive browser regression suite.
- Used the live UI to run the legitimate-bank-message sample, inspect its report, attempt automatic redaction, and run a known-bad URL dataset sample. Reviewed homepage at approximately 888px and 390px widths.
- Ran npm vulnerability auditing: 6 affected packages, 1 critical and 5 high. No dependency updates or production deployments were performed.

Raw HTTP/build-page observations: [site-checks.json](site-checks.json). Existing test output is saved beside this report as `test-*.txt`.

**Priority 1: fix before expanding or promoting accuracy**

| Finding | Evidence and impact | Recommended correction |
| --- | --- | --- |
| Image metadata and OCR-derived strings enter HTML without escaping | `src/pages/index.astro:346,370,475–495`, `src/components/ToolLayout.astro`, and `src/components/PaymentToolLayout.astro:580` construct `innerHTML` from findings, evidence, EXIF fields, and extracted recipient names. Metadata originates from untrusted files via `metadata.ts`. This creates a DOM injection/XSS path when a visitor analyzes a crafted image. Source-confirmed unsafe flow; an exploit was not executed. | Build nodes with `textContent`; centralize safe rendering. Add a local regression fixture with harmless HTML-like metadata and verify literal rendering. Audit other workspace renderers too. |
| Automatic redaction does not cover detected findings in the tested live flow | The legitimate-bank-SMS report detected two findings. Clicking Auto-Redact left the reference number readable. `ocr.ts` calls `worker.recognize(ocrInput)` then reads `result.data.words`. Installed Tesseract defaults to text output and exposes structured output through blocks, not the assumed legacy top-level word list. Missing boxes also affect highlighting. | Request structured OCR output, flatten block/paragraph/line/word coordinates, map preprocessing coordinates correctly, and visibly warn if detected text has no location. Test the exported image, not just the finding list. |
| Claimed payment visual forensics are not pixel measurements | `paymentVisualForensics.ts` reports font-style and icon-placement anomalies using regexes over OCR text. For example, the words “Banking name:” trigger a font inconsistency. `paymentPipeline.ts` adds “Evaluated typography styles across receipt rows” even though the forensic function receives text and image dimensions, not pixels or word geometry. | Rename these findings as text/template heuristics until actual visual measurements exist. Do not report checks that were not performed. Separate receipt content, visual evidence, and external verification. |
| “Multimodal AI” language exceeds implemented capability | `multimodalProvider.ts` uses dimensions, keywords, and fixed rule branches. `investigationAgent.ts` calls `analyzeFraudWithMockLLM` and reports a multilingual model step. Tesseract OCR is real, but this does not make the fraud reasoning a general vision-language model. | Describe the current analyzer as browser-based OCR plus heuristics. If adding a real model, publish its limitations, runtime, measured performance, and data flow. A paid AI API is not required for the existing application. |
| Privacy wording is broader than actual data flow | `linkChecker/client.ts:242` POSTs the entire submitted field to `/api/check-link`, including a pasted message, before trying client-side shards. This contacts your host even when the route fails. Layout also loads Google Analytics and Google Fonts. The link workspace persists the last 10 checks in localStorage; image handoff uses sessionStorage. | For the current privacy-first product, remove the unnecessary server-first lookup or explicitly disclose it. Explain image processing, network downloads, analytics, browser storage, and host logs separately. “Images processed locally” is more defensible than “zero data leaves your device.” Do not log OCR content in production. |
| Vulnerable dependency versions | npm audit flags Astro, js-yaml, sharp, svgo, miniflare, and Wrangler. The critical advisory concerns Astro AVIF image optimization; the current static deployment does not establish that this exploit is reachable on the live site. | Update through a controlled lockfile change, rebuild, run tests, and re-audit. Audit reports fixes available. Astro advisory affects `<7.2.8`; other ranges are package-specific. Avoid blind force updates. |

Tesseract output behavior is documented in the [official API documentation](https://github.com/naptha/tesseract.js/blob/master/docs/api.md). The Astro advisory returned by npm is [GHSA-26w7-cxv4-gfx2](https://github.com/advisories/GHSA-26w7-cxv4-gfx2).

**Priority 2: correctness, usability, and deployment**

1. **Live false positive:** the legitimate bank sample's UPI reference `982103482189` appears as a callback/phone number and a high-severity privacy finding. Use entity context and exclusions for transaction references, account IDs, dates, and order numbers. “Why is it suspicious?” also remains the section title for a low-risk legitimate notification; use a neutral heading.
2. **Failed investigation tests:** `agenticInvestigation.test.ts` passes 4 and fails 2 cases: bank phishing with an IP link, and an advance-fee prize demand. These are provider-level regression failures; they do not prove every full UI pipeline misses the same input because the main pipeline adds a separate fraud pass. Align the two engines and test final displayed verdicts.
3. **Broken legacy link service:** `linkChecker.test.ts` cannot start because `service.ts` imports missing `normalizeUrlComponents`. The current live workspace uses `client.ts`, so this is incomplete/unused code rather than proof the live link tool is wholly broken. Repair or remove the obsolete branch.
4. **Stale blog test:** `blogSystem.test.ts` expects 6 articles; there are 7. Test meaningful invariants such as unique slugs and required fields rather than a fixed article count.
5. **Worker is not configured for deployment:** `wrangler.jsonc` contains only static assets; it has no `main` pointing to `src/worker.ts` and no `ASSETS` binding. Live `/api/health` returns 404. This is consistent with static-only deployment. Decide whether a backend is actually needed before adding it.
6. **Simply enabling the Worker will not finish it:** `localDatasetService.ts` asks ASSETS for `/src/data/urldataIndex/...`, while the built assets are at `/urldataIndex/...`. It also imports Node fs/path; review runtime compatibility. The Worker's dataset-blocking logic conflicts with the browser's public-shard fallback. Cloudflare asset routing must be configured intentionally if requests must execute Worker logic first. See [Cloudflare asset configuration](https://developers.cloudflare.com/workers/static-assets/binding/).
7. **URL data is a snapshot:** the manifest records 420,464 source records, generated 30 August 2026. Generation time is not evidence of record freshness. Add upstream source, licensing/provenance, record dates where available, versioning, and an update process. A “good” historical record must remain explicitly different from a current safety guarantee.
8. **Partial domain parsing:** `urlNormalizer.ts` uses a hand-written public-suffix subset, omitting private suffixes such as shared hosting domains. A registrable-domain match can therefore apply too broadly. Adopt maintained Public Suffix List handling and test multi-tenant hosts.
9. **Failures look like absence:** shard fetch failures return null and can become “No Local Match”; metadata parse errors become empty metadata; some C2PA Worker failures become “not found.” Use separate unavailable/error/not-found states so a failed check is never presented as a completed negative check.
10. **Mobile manual redaction needs work:** the main redactor and standalone workspace use mousedown/mouseup, with no corresponding pointer/touch drag handling found. Source evidence indicates touch support is incomplete; real iOS/Android testing is still needed. Use Pointer Events, pointer capture, and explicit touch behavior.
11. **Accessibility gaps:** the redactor modal is a plain div without dialog semantics, focus trapping, or Escape handling in the inspected implementation. Its close button has no accessible name. The uploader uses a button role but lacks a matching keyboard activation handler, while containing a real button. Add semantic controls, keyboard support, visible focus, progress announcements, and accessible drawing alternatives.
12. **Image handoff can silently fail:** up to 25MB images are converted to base64 JSON in sessionStorage; quota errors are caught and only logged. Returning a success/failure result, avoiding large base64 storage, and showing a fallback are necessary. Clear sensitive handoff data deliberately after use.
13. **OCR recovery:** the worker cache retains a rejected initialization promise, so a failed first load can poison subsequent attempts until reload. Reset rejected entries and provide retry/cancel controls. The logger closes over the initial callback, which also deserves a multi-scan test.
14. **Redaction defaults:** use solid blackout by default for confidential text, with preview and explicit user review. Blur and pixelation are visual obfuscation and should not be presented as equally strong protection. Check exported dimensions, alpha, crop edges, and the actual final file.
15. **Security headers absent in the sampled homepage response:** no CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, or HSTS header was returned. Add a tested policy compatible with Web Workers, WASM, inline scripts, fonts, and any retained analytics. Introduce CSP in report-only mode first; headers supplement safe rendering.

**SEO: what is already good**

- Static HTML is delivered without requiring a client-rendered app for main content.
- Titles, descriptions, canonical links, Open Graph/Twitter metadata, favicons, and structured data are implemented.
- All 30 generated HTML pages have one H1 and unique titles. The independent check found no broken local page links.
- Public tool and blog pages returned HTTP 200. A deliberately nonexistent path returned 404, so a blanket soft-404 fallback was not observed.
- `/robots.txt`, `/sitemap-index.xml`, and `/sitemap-0.xml` are reachable. `/sitemap.xml` resolves to the sitemap index.
- Tool directories, related tools, article links, and breadcrumbs provide internal navigation.
- About, Contact, Privacy, and Terms pages already exist. Google Analytics is already embedded; installing a second analytics tag would be unnecessary.

**SEO: improve next**

| Area | Finding / action |
| --- | --- |
| Credibility and usefulness | Publish a methods/limitations page and reproducible original examples showing false positives and false negatives. Replace unsupported accuracy and verification wording. Explain exactly what each signal means. |
| Content focus | Home, screenshot-analyzer, scam, and spam pages have overlapping intent. Define a distinct user task and substantive evidence for each; consolidate only where pages genuinely duplicate purpose. Remove the repeated keyword-variant “People Also Search For” block in favor of useful task navigation. |
| Article dates | `[slug].astro` hard-codes datePublished and dateModified to 22 August; the latter returns the same value on both conditional branches. Actual article data includes 30 August dates. Render machine-readable dates, visible dates, and sitemap dates from one source. |
| Two blog systems | The Astro content collection contains a Markdown article, but actual blog routes are generated from `src/data/blogArticles.ts`. Editing that Markdown file will not automatically publish it through the current route. Choose one publishing system and document it. |
| Social previews | The default social image is a square application icon. Create legible landscape preview images per major tool/article with accurate titles and consistent branding. |
| Metadata lengths | Existing checker warns on the fake-UPI article: title 62 characters, description 184. These are editorial truncation warnings, not hard Google ranking limits. Rewrite for clarity, not merely a character score. |
| International SEO | The language selector swaps marked UI strings on the same URL; pages initially declare English. This is not a fully localized, separately indexable multilingual site. If multilingual search is a goal, translate complete pages and use locale routes, self-canonicals, and reciprocal hreflang. |
| Search Console | Account access was not available. Verify ownership, submit the existing sitemap index, inspect key URLs, review selected canonicals, indexing reasons, search queries, and Core Web Vitals. A public site search returned no results in this session, which is not conclusive evidence of non-indexing. |
| FAQ markup | Keep helpful visible FAQs, but do not spend effort expecting Google FAQ rich results. Google's current changelog says that feature stopped appearing in May 2026. |

These priorities align with [Google's people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). Current FAQ status and guidance that llms.txt is unnecessary for Google rankings are in [Google's documentation updates](https://developers.google.com/search/updates).

**Performance and design**

- The production build warns about large chunks. The inline C2PA module is approximately 10.96MB uncompressed. It is dynamically imported, so this is an analysis-time download/parse concern, not evidence every visitor initially downloads it. Measure the cold first scan on slow connections and low-memory phones; consider separating/caching Worker and WASM assets.
- The built homepage HTML is approximately 166KB uncompressed. `inlineStylesheets: 'always'` trades fewer requests for repeated CSS embedded in each page. Measure shared CSS caching versus current behavior before changing it.
- Three font families are requested from Google Fonts. Consider reducing families/weights and self-hosting for predictable performance and privacy.
- Main-thread canvas processing and several full-resolution image copies need a pixel-count/memory budget; a 25MB file-size limit alone does not constrain decoded memory.
- The 390px homepage fit the viewport in the inspected view. Its upload button sits low because of long introductory copy and vertical spacing. Shorter copy would make the primary task more immediately accessible.
- At the inspected wider viewport the report title wraps into a narrow column beside four action buttons. Stack or wrap the toolbar at an earlier breakpoint.
- No Lighthouse score, field Core Web Vitals, full accessibility score, or real-device throughput claim is made here; those were not measured.

**Feature roadmap, in recommended order**

| Order | Work | Why |
| --- | --- | --- |
| 1 | Safe rendering, working auto-redaction, touch redaction, accurate status/error handling | Repairs trust-critical existing functionality. |
| 2 | Correct entity extraction, calibrated verdicts, accessible reports, retry/cancel, export validation | Makes results more useful and avoids false reassurance. |
| 3 | Reproducible evaluation corpus with unrelated real-world test images, varied languages, fonts, compression, and benign examples | Current handcrafted examples and unit assertions do not establish real-world detection accuracy. |
| 4 | Methodology page, original comparison articles, real author/reviewer details where applicable, good social cards | Supports search usefulness and product credibility. |
| 5 | Opt-in feedback, analysis-success/error/duration events without image/text/URL payloads, preview deployments and uptime checks | Gives operational evidence of where users struggle. |
| 6 | Better OCR crop/rotate/language selection, batch processing, print/PDF report if users need it | Useful additions once single-file reliability is sound. |
| 7 | Optional real-time reputation or actual model inference | Requires a deliberate cost, privacy, architecture, and benchmark decision. Existing adapter files alone do not provide these services. |

Accounts, payments, a database, and a paid AI API are not prerequisites for the current free toolkit. Avoid adding them without a product need.

**Engineering and release checklist**

- Replace starter README with project-specific setup, architecture, limitations, and deployment ownership instructions.
- Pin a tested Node version; use the committed lockfile and npm ci for reproducible installs.
- Add a unified test command, Astro/TypeScript checking, and an automated build/test/security workflow. No repository CI workflow was present in the inspected checkout.
- Integrate SEO verification into CI. Its current error count does not include every missing-field issue and it does not set a failing exit code for findings.
- Consolidate duplicated dashboard/redactor logic between `index.astro` and `ToolLayout.astro` to prevent divergent fixes.
- Document data provenance and dependency/model licenses. An upstream dataset licensing check was not completed.
- Expand ignored local secret files before using a backend: `.dev.vars`, `.env.local`, and related variants are not covered by the current narrow entries. Add a sanitized example only if configuration is actually needed.
- Separate preview and production deployment settings and document rollback. `npm run deploy` directly builds and calls Wrangler.

**Boundaries:** This review did not access Cloudflare, Search Console, Analytics reports, DNS ownership, email delivery, private environment variables from the other PC, or GitHub deployment settings. It did not execute adversarial payloads against production, test every image format/export, validate every C2PA signature case, or certify forensic accuracy. Findings distinguish live observations, source-confirmed defects, and recommendations.
