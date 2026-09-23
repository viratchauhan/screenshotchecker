# ScreenshotChecker bounded work queue

**Current state:** Tasks 03, 04A, 04B and 05A completed locally. Owner-requested no-match correction also completed: unrelated text cannot inherit a stored example narrative. Latest production build: 30 pages; full test runner: 18 passing entrypoints and the same 3 baseline failures. Browser checks cover exported PNG pixels, phone-width keyboard placement, modal focus/Escape and a real OCR no-match report. Owner requested committing and publishing the current work to GitHub on 23 September 2026. See Git history for publication state; no direct Cloudflare deployment was requested.

**Next:** Task 05B, large-image handoff and failure recovery. Default remains one bounded task per continuation unless the owner requests otherwise.

**Session rules**

- Read this file, `GROWTH-PLAN.md`, and the current Git state before changing code. Preserve unrelated work.
- Pick exactly one ready task. State its scope briefly. S means a small isolated change; M means a bounded change with a focused regression check. These are planning sizes, not token/quota guarantees.
- If a task expands, split it and record the remainder instead of silently doing a large batch. Do not start the next task after completing the selected one.
- Research only the facts needed for that task; reuse saved findings. No subagents or parallel task execution unless the owner explicitly requests them.
- Implement, run meaningful affected checks, and report changed behavior, verification, remaining risk, and next task. Update this file and the session log.
- Do not push, publish, or deploy until instructed. Inspect automatic deployment behavior before any future push.
- A normal “continue” means the next ready task, not permission to consume the whole backlog.

| ID | Task | Size | Depends on | Done when | Status |
| --- | --- | --- | --- | --- | --- |
| 00 | Research and implementation plan | S | Audit | Plan, queue, measurement assumptions and deployment boundary saved | DONE |
| 01A | Safe metadata rendering | M | 00 | EXIF/metadata shown literally in analyzer and metadata workspace; harmless markup fixture cannot create DOM elements | DONE |
| 01B | Safe extracted-text/report rendering | M | 01A | OCR-derived findings, names, URLs and evidence render safely across payment and shared dashboards; targeted regressions pass | DONE |
| 01C | Standalone workspace rendering safety | M | 01B | Redactor PII values, comparison descriptions, C2PA fields and AI report strings render safely; original button behavior preserved; focused injection regressions pass. Split further if needed. | DONE |
| 02 | Dependency repair | M | 00 | Supported compatible patches, reviewed lockfile, successful build and fresh audit; remaining advisories explicitly triaged | DONE |
| 03 | Reproducible development checks | M | 00 | Pinned tested Node target, project test runner, unified existing-test command; baseline failures documented | DONE |
| 04A | OCR structured coordinates | M | 03 | Current OCR API returns word boxes mapped to original image; scaled/fallback fixtures verify bounds | DONE |
| 04B | Automatic redaction and export | M | 01A,01B,04A | Suggested boxes actually hide selected data in exported files; unavailable locations give a visible warning | DONE |
| 05A | Touch and keyboard redaction | M | 04B | Pointer drawing and accessible modal controls work; phone viewport and keyboard flow checked | DONE |
| 05B | Large-image handoff and failure recovery | M | 04B | No silent storage failure; OCR initialization can retry; a meaningful pixel/memory limit and clear errors exist | NEXT |
| 06 | Traffic baseline and measurement decision | S | 00 | Actual baseline recorded if available, or explicit unknowns; privacy-conscious event specification approved by existing product direction | TODO |
| 07 | Correct global entity extraction | M | 03,04A | US/UK/Indian phones distinguished from payment references; USD/GBP/INR and ambiguous date fixtures pass; scope split if needed | TODO |
| 08A | Fraud regression repair | M | 03,07 | Existing bank/prize failures resolved and final displayed verdict tested against benign counterexamples | TODO |
| 08B | Honest evidence and error states | M | 08A | Text heuristics never claim measured fonts/icons; failed checks differ from absent evidence; mock/model wording corrected | TODO |
| 09 | Local processing and privacy alignment | M | 01B | Chosen local URL flow avoids unnecessary text POST; analytics/resources/storage are accurately disclosed; OCR debug text removed | TODO |
| 10A | URL normalization and unavailable states | M | 03,09 | Maintained suffix handling with multi-tenant tests; dataset failures are explicit and cannot become clean no-match results | TODO |
| 10B | Dataset/service cleanup | S | 10A | Source/version/update notes added where verifiable; obsolete broken service repaired or removed; static/Worker decision documented | TODO |
| 11 | Baseline content/build test cleanup | S | 03 | Stale article-count test replaced with invariants; SEO validation returns meaningful failure status | TODO |
| 12 | Security headers and release candidate | M | 01A,01B,01C,02,04B,05A,08B,09,11 | Appropriate headers tested with Workers/WASM/fonts; critical changed flows pass; local release checklist ready | TODO |
| R1 | Cloudflare release checkpoint | S | 12 + owner deployment request | Confirmed target deployed and smoke-tested; version/rollback recorded | WAIT FOR REQUEST |
| 13 | SEO dates and publishing source | S | 11 | Article visible/schema/sitemap dates agree; single documented content source; build/SEO checks pass | TODO |
| 14 | Homepage and report clarity | M | 08B,09 | Three task entry points clear; shorter mobile introduction; report toolbar usable at narrow widths | TODO |
| 15 | Methods and limitations page | S | 08B,10B | Explains actual checks, error modes, evidence boundaries, and reproducible examples without invented accuracy | TODO |
| 16A | Global scam explainer input | M | 08B,09,14 | Existing scam tool supports locally processed pasted text alongside screenshot input; honest evidence and error states tested | TODO |
| 16B | Evidence-linked report | M | 04A,08B,16A | Selected findings identify the relevant OCR words/regions; no location is invented when unavailable | TODO |
| 16C | US scam examples and guide | S | 15,16A | Small owned/synthetic example set with benign counterexamples and current primary sources; no unsupported verification claims | TODO |
| 16D | UK scam examples and guide | S | 15,16A | Region-specific useful guide/examples with benign controls; no duplicate US guide with only brand substitutions | TODO |
| 16E | Payment provider/region specification | S | 07,15 | Supported US/UK/India providers and currencies documented from primary sources; fixtures and unsupported states defined | TODO |
| 16F | First global payment expansion | M | 16E | One provider/region slice implemented and tested; no UPI-only validation leaks into unrelated transfers; remaining providers queued separately | TODO |
| 17 | Privacy/redaction content improvement | M | 04B,05A,15 | Existing pages have distinct jobs, owned before/after examples and verified instructions | TODO |
| 18 | Cold-scan performance | M | 04A,12 | Baseline measured; one dominant bottleneck improved (for example C2PA loading); no privacy/accuracy regression | TODO |
| 19 | Search snippets and social cards | S | 13,14 | Priority titles/descriptions clarified; preview images work; no duplicate intent pages introduced | TODO |
| 20A | Educational challenge prototype | M | 01B,12 | Small original edit dataset, labeled answers, accessible playable flow; existing game code reused where suitable | TODO |
| 20B | Challenge sharing | M | 20A,19 | Optional score-only share preview/link works; no uploaded image or sensitive report enters share payload | TODO |
| 21 | First global distribution kit | S | 15,16C,16D,17,20B | Original demo and 2–3 useful US/UK-focused draft posts prepared; nothing posted or sent automatically | TODO |
| 22 | Growth checkpoint | S | 06 + sufficient post-release data | Traffic/completion compared with baseline; next priorities chosen from evidence; weak experiments paused | TODO |
| 23A | Monetization feasibility | S | 06,22 | Actual geography/engagement and available RPM data reviewed; guide-only ads versus paid repeat-use capability compared without invented earnings; no ad/billing installation | TODO |
| 23B | Next-cycle decision | S | 22,23A | Select one evidence-backed priority: OCR controls, local batch, offline mode, payment-provider expansion or evaluated local model; Hindi only if demand warrants | TODO |

Task numbers are ordering guides, not calendar commitments. Task 06 may happen earlier when analytics information is available. An R1 deployment checkpoint can also release a smaller independently validated urgent fix if the owner requests it. Later changes use the same owner-triggered release checklist. Do not delay a ready security fix simply to bundle growth features.

**Acceptance checks shared across work**

- No image/text/URL content in telemetry or test logs containing personal data.
- No unsafe report HTML and no claims stronger than implemented evidence.
- Genuine examples, suspicious examples, and failure cases receive meaningful coverage.
- Changes to redaction require checking exported pixels and touch interaction, not just successful compilation.
- Page changes retain meaningful titles, canonical links, one H1, working navigation, and responsive controls.
- Regression checks are scoped to the change; a build alone is not a functional test.

**Session log**

| Date | Completed | Verification | Next |
| --- | --- | --- | --- |
| 2026-09-22 | 00: growth research, strategy, bounded queue | Reviewed audit, competitor pages, Google/Cloudflare documentation; repository changes limited to planning instructions/documents | 01A |
| 2026-09-22 | 00 revision 2: global US/UK priority | Reviewed FTC, Ofcom and AdSense primary sources; revised feature priorities, localization, monetization and queue; no application code/deployment changes | 01A |
| 2026-09-22 | 01A: safe metadata rendering | `npm.cmd run test:metadata`: 7/7 passing in jsdom, including markup, prototype-like group names, normal values and repeated scans; `npm.cmd run build`: 30 pages built; `git diff --check`: passed. Existing large-chunk warning and six dependency advisories remain. No live browser/export test required for this text-rendering change; no deployment. | 01B |
| 2026-09-22 | 01B: safe report text and redaction callbacks | `npm.cmd run test:reports`: 7/7; `npm.cmd run test:metadata`: 7/7; build: 30 pages; diff whitespace check passed. Tests exercise actual production report template expressions in jsdom and button callbacks with quotes, backslashes and markup. Existing large-chunk warning remains. Remaining standalone workspace sinks split into 01C to keep this session bounded. | 01C |

### 2026-09-22 ? Tasks 01C + 02 (owner-requested two-task session)

- Escaped all dynamic report text in RedactorWorkspace, ComparisonWorkspace and AIDetectorWorkspace, including C2PA nested fields, validation errors, evidence and diagnostics. Fixed class/badge markup stays intact. Existing event listeners are unchanged; generated redaction indices and comparison region attributes are preserved.
- Added three production-template regression cases covering hostile markup, quote-based attribute injection, ordinary international text and button indices. `npm run test:metadata` (7) and `npm run test:reports` (10) pass. These are DOM/template checks, not full end-to-end image processing checks.
- Updated Astro 7.2.4 -> 7.2.8 and Wrangler 4.125.0 -> 4.136.2; repaired transitive sharp 0.35.4, js-yaml 4.3.2 and svgo 4.1.0. Reviewed package changes in audit/dependency-changes.json: compiler/runtime changes and dependency deduplication account for the larger lockfile diff. No forced major direct-dependency upgrades or overrides.
- Fresh npm audit: 6 affected packages (1 critical, 5 high) -> 0. Saved before/after reports. Astro advisory reference: https://github.com/advisories/GHSA-26w7-cxv4-gfx2 . A clean dependency audit is not a site-wide security certification.
- Production build: all 30 pages pass; existing large C2PA bundle warning remains. `wrangler deploy --dry-run` passes locally, reading 359 asset files; no production release performed. Logs: audit/task-01c-02-build.log and audit/task-02-cloudflare-dry-run.log.
- npm emitted a cleanup warning for an old locked compiler binary and install-script notices; the updated compiler build and Cloudflare packaging both ran successfully. Existing three baseline legacy test failures were not changed or rerun in this bounded session; task 03 will establish the unified runner.
- Stopped after the two authorized tasks. Next: 03, reproducible development checks.

### 2026-09-22 ? Tasks 03 + 04A (owner-requested two-task session)

- Added `.nvmrc` for tested Node 26.9.0, packageManager npm 11.19.1, exact local tsx dependency, automatic isolated test discovery and npm test/check commands. Runner reports failures and exits nonzero without skipping baseline failures. New-PC setup documents commands and the three existing failures.
- Baseline before OCR changes: 18 entrypoints, 15 pass / 3 fail. After adding OCR tests: 19 entrypoints, 16 pass / same 3 fail. Logs: audit/task-03-tests.log and audit/task-03-04a-tests.log. No new failing entrypoints.
- OCR now requests `{ text: true, blocks: true }` for both passes and traverses blocks/paragraphs/lines/words instead of the removed flat data.words field. Source: https://github.com/naptha/tesseract.js/blob/master/docs/api.md and installed v7 types.
- Word boxes map to source pixels with outward rounding, image-bound clipping when source dimensions are available, and rejection of invalid/empty boxes. Selecting the original-image fallback resets scaling to 1; an empty fallback preserves the first-pass geometry.
- Four focused production-helper tests pass (structured mock worker fixtures, scaled bounds, invalid boxes and fallback selection). All 30 pages build; existing large bundle warning remains. Production dependency audit: zero advisories. These fixtures do not establish real-image OCR accuracy or prove exported redactions; task 04B covers redaction/export behavior.
- No push, deployment, automatic continuation or new commit. Stopped after the two requested tasks.

### 2026-09-23 — Finish 04B + 05A and owner-requested no-match correction

- Redaction: full multiword and repeated sensitive values are located, including masked card/SSN labels via their original matches. Automatic masks are solid blackout and cover all matched words; missing locations report manual placement is needed. Invalid locations do not create partial claimed coverage. Bounding box clipping rounds outward. Individual finding buttons now apply masks in both shared dashboards. Shared modal exports the original screenshot rather than an ELA preview. New-image state and stale preview guards added.
- Input/accessibility: shared Pointer Events handler uses capture and cancellation for mouse/touch/pen. Numeric coordinate forms provide keyboard placement. Modal uses native dialog behavior with a label, named close control, Escape handling and focus restoration; toolbar exposes selected state. Tall dialog scrolls internally and fits phone width.
- Verification: production renderer browser harness decoded a real PNG and checked every pixel of four card word regions (opaque), unchanged outside pixels, and absence of EXIF/text chunks. Harness retained at scripts/redaction-browser-check.html; its temporary public copy was removed before the final build. Browser at 390x844 verified keyboard masks and no horizontal overflow. Production-preview modal verified initial close-button focus, focus containment, Escape, focus restoration, and phone layout. Touch cancellation/scaling covered by synthetic Pointer Events tests; no physical phone test claimed.
- User expanded scope on resumption: fix unrelated screenshots borrowing fraud example answers. Replaced broad keyword nearest-example selection with conservative full-message matching (case/whitespace insensitive). Unknown text yields INSUFFICIENT_EVIDENCE/unverifiable, no matched ID/category, and a verification notice with virat@screenshotchecker.com. Text cues remain non-conclusive, not copied evidence. Known-example summaries quote source text instead of copying stored explanations/actions. Recognizable informational safeguards and empty OCR remain separate states.
- Verified active database: 28 reference patterns from fraudKnowledgeBase.ts. The supplied JSON filename says 1050 but actually contains 50 examples and is not imported by the current app. No 2,000-example or trained-model claim added. Counts in user-facing copy derive from the active array.
- Deliberate tradeoff: even a paraphrased scam can receive no-match; that result explicitly does not establish safety. This conservative policy addresses forced example answers; broader evidence-grounded detection remains future work, not a claim of comprehensive fraud detection.
- Retained all 28 historical fraud fixtures and 12 summary inputs, revised assertions to the requested abstention/grounding contract, and added benign-topic, changed-meaning, mapping, OTP and empty-input checks. All active reference examples are tested for discoverability. Full suite: 18/21 entrypoints pass; unchanged failures remain agenticInvestigation (4 pass/2 fail), stale blog count, missing URL normalizer. Logs: audit/task-no-match-tests.log and audit/task-final-build.log. All 30 pages build; prior bundle-size warning remains.
- Full real-image browser path confirmed OCR reads the synthetic job-interview message, renders INSUFFICIENT_EVIDENCE with the correct 28-pattern count and contact email, and does not invent a job scam. A stale development-module fetch interrupted early browser checks; production preview completed them successfully.
- No commit, push or deployment. Stop here; do not execute the next queue item automatically.

### 2026-09-23 — GitHub publication requested

Owner explicitly requested updating GitHub with the current website code. Publish the completed local work and previous security commit to origin/main. Remote was fetched and had no newer commits. Latest recorded production build passes (30 pages); three documented baseline test failures remain. No .github workflow exists in this checkout; Cloudflare dashboard Git integration may still deploy a push. This request does not authorize additional feature work or a separate Wrangler deployment.
