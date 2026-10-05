# AI detector recovery and progress

Base: main `71762a9941be56715f6e1cb12082d4bd992d767c`. Bounded owner-approved implementation on `fix/ai-detector-recovery`; unrelated payment PR #10 and guide work are untouched.

## Diagnosis and change

Live synthetic reproduction: a 22,615-byte PNG with dimensions 2100 x 2100 remained on the loader after OCR rejected the existing 4 MP limit. A 788,142-byte 512 x 512 noise PNG completed. Compressed bytes do not determine the pixel budget. Initial tests used the Codex in-app browser on Windows build 26200; CPU/RAM and per-stage/network traces were unavailable. A 2,537-byte 512 x 512 flat fixture repeated in 363 ms including browser-control overhead, versus 1,073 ms after reload with existing browser cache; these are not cache-cleared cold benchmarks.

- Reuse the existing validated decoder before starting any forensic engine; also validate at the pipeline boundary.
- Catch file-read, decode, pipeline and render failures; show literal error text, clear stale results, restore the uploader and keyboard focus.
- Replace simulated percentage progress and three artificial 60 ms waits with actual stage messages and a polite live region.
- Hold a single-run lock across read/decode/engines; ignore additional paste/drop/input during work. Stop suppresses future stages and stale results, retaining the lock until the current operation settles. Delayed handoffs cannot replace a newer selection.
- Keep original bytes for provenance, existing limits, scoring, OCR preprocessing and its empty-text fallback unchanged. Available fixtures do not justify an accuracy-affecting retry removal. No shared payment runtime, dependency, deployment configuration, analytics, or content claim changes.

## Verification

- Exact Node 26.9.0 / npm 11.19.1, clean locked dependency install in an isolated checkout.
- 12 focused regression tests pass. Actual workspace script/markup and shared decoder run in jsdom; browser decode and expensive engine boundaries are synthetic. Covers oversized-small-file, valid >500 KB, decode/read/pipeline/render failures, literal error text, same-file retry, paste/drop, Stop, stale progress/result/handoff, focus, stage ordering and text-free/original-text OCR fallback retention.
- Final aggregate: 40/40 entrypoints pass; production build: 33 pages. SEO: zero errors/warnings across 33 pages; blog SEO passes. Existing large-chunk warning remains.
- Independent source review found no blocking issue; its keyboard-focus suggestion was implemented and re-reviewed. Tests are not a replacement for exact Preview browser QA.
- `git diff --check` passes. No production publication is claimed here.

## Boundaries and release evidence

Cancellation is cooperative: a never-settling SDK request still requires page reload. This patch does not add worker termination, engine deadlines, off-main-thread pixel work or accuracy changes.

Private Cloudflare settings inspection was rejected by automatic approval review; no alternate access to that private dashboard was attempted. Public repository evidence and the existing operations inventory identify main as production and feature branches as Preview. Public Cloudflare bot receipt on PR #10 independently shows the 4 October feature revision `47ef64c` deployed to a nonproduction Preview. Only this new feature branch/draft PR is authorized; no main update, merge, or production deployment.

Functional commit: `1994a67085b985e43c27839f83c9765e19176f18`, tree `618802215c0b0273de7306fe2e922a48def3236a`.

Real-browser local build QA of this revision passed: the 2100 x 2100 small PNG shows the limit error and restores focused input; selecting the valid 788,142-byte PNG afterward completes with the baseline report; broken PNG decode shows an error and clears the previous report; actual C2PA/ELA/OCR stage messages appear; Stop suppresses the result and restores focused input after the current step. No local-browser duration claim is made because automation overhead varied substantially. Narrow-screen and exact remote Preview QA remain outstanding.

Publication is blocked: automatic approval review rejected feature-branch push, treating the original diagnose-only/no-push instruction as controlling. After the originating conversation's direct human request "make it live and deploy" was independently retrieved, review still rejected a second push because that authorization reached this execution context through tool output. No alternate publication channel was used. A direct approval in this execution task is the minimum unblock. No branch was pushed, draft PR created, main changed, or production deployed. Exact remote Preview checks and release/source-mapping/rollback verification remain required after publication is permitted.
