# Payment notice keyboard-focus correction

Date: 4 October 2026. Parent checkpoint: PR #10 head `d651e9aa2598bd85f562938691fdbc613875a5cd`, tree `38e12eb910b515f183c3973409e8a0c4bfc84300`.

## Reproduction and scope

Required Preview QA found that opening a payment example left keyboard focus on the underlying page. Tab could reach the other sample while the modal notice was visible. The same modal implementation was already present on main; this is a pre-existing accessibility defect discovered during the payment status/balance release checks.

The focused correction:

- Moves initial focus to Close and contains forward/reverse Tab within Close, the scrollable warning region, Cancel and Continue
- Makes background branches inert while open, preserving pre-existing inert state and the body's prior overflow value on dismissal
- Restores focus to the invoking control on Close, Cancel, backdrop and Escape; repeated opening does not overwrite its saved state
- Gives the internally scrollable bilingual warning an explicit keyboard stop so arrow/PageDown reading remains possible at short heights
- Moves accepted analysis to visible progress, then the result heading or the retry control; completion does not steal focus if the user moved elsewhere during OCR
- Preserves the reviewed payment status/balance source, public notice wording, sample pixels, pipeline, scores, dependencies, storage and analytics

## Local verification

The source was reconstructed through repository reads and every tracked blob verified against the exact parent tree. The checkout's resulting Git tree matches `38e12eb910b515f183c3973409e8a0c4bfc84300` before these changes.

Runtime: exact Node 26.9.0 / npm 11.19.1 installed to an isolated temporary prefix. Existing installed dependencies were reused; `package-lock.json` is byte-identical to the parent. This is not a new clean-room install.

- Six focused workflow groups pass, including all dismissal paths, repeated use, disabled controls, background focus recovery, inert restoration, keyboard reading stop, file selection, paused analysis, error/retry and literal report rendering
- The first focus regression version fails three workflow groups against the unchanged parent layout, reproducing missing initial focus and containment
- Final `npm run check`: 40/40 entrypoints and 33-page Astro build pass with `NODE_OPTIONS=--max-old-space-size=768`
- `npm run test:seo`: 33 pages, zero errors or warnings
- `npm run test:blog-seo`: eight articles and existing parity checks pass
- `git diff --check`: passes

The DOM tests run the production client script with synthetic image/OCR stubs. They do not establish real-browser scrolling, OCR quality, mobile behavior or whole-page privacy. Exact-head Preview remains a separate release gate.

Independent review accepted the three functional/test blobs: layout `de12e50f06dddbbc081f0eb45a48611ea1940dce`, modal `aec84cc3ea5cea4ee8d026a9b1c6564265dba33e`, tests `541061aa70ea0a65dcc433f937c8b0eaaad2ad92`. The reviewer separately passed the six notice groups, four balance-context groups, four landing-copy groups and ten-scenario payment matrix, plus 100 repeated/double-open/double-close cycles, inert/overflow cleanup, hidden/disabled controls, disconnected trigger, paused-analysis focus changes and completion beneath a newer notice. No blocking code finding remains within this bounded change.

## Release status

Keep PR #10 in draft until its updated exact-head Preview passes the required wide/mobile/keyboard/repeated-input checks and full network/synthetic-marker inspection. The currently available browser controls do not expose full request bodies or response headers, so a DOM-only check cannot establish network privacy or Preview `X-Robots-Tag`.

Before promotion, recheck current production version, source mapping and rollback. The Cloudflare account session previously reached sign-in with a verification error; do not bypass this restriction or treat historical rollback IDs as current. No main promotion is justified by this local checkpoint alone.
