# ScreenshotChecker growth and product log

## 30 September 2026 — task 07A, local checkpoint

Payment-context/labelled-reference regressions repaired locally. Separate OCR/redactor FAQ claims corrected. See `audit/07A-2026-09-30.md` for evidence, checks and limitations. Work remains unshipped; no acquisition or accuracy improvement has been measured. Existing authoritative queue is `WORK-QUEUE.md`; deployment and analytics unknowns are recorded in `OPERATIONS.md`.

## 30 September 2026 — task 08A bounded follow-on

Bank-link/prize-fee baseline regressions repaired locally after independent review and counterexample fixes. Full suite now 27/28; remaining failure is the unchanged legacy link import. No traffic, conversion or real-world accuracy improvement measured. See `audit/08A-bank-prize-2026-09-30.md`.

## 30 September 2026 — task 10B bounded test maintenance

Obsolete link-service test migrated to actual client/local-dataset behavior after independent review. Aggregate check passes 28/28 entrypoints and build. This is verification maintenance, not a runtime link-checker fix or proof of URL safety; unused legacy service remains broken.

## 1 October 2026 — task 10A dataset availability

Reproduced failed shard requests appearing as no-match and fixed client/service/UI to explicitly report unavailable checks. Independently reviewed, 29/29 entrypoints and build pass. No acquisition or real-world accuracy change measured; no release claimed.

## 1 October 2026 — bounded redaction-export recovery

- Recovered reviewed 77b2cd8 before the one-task continuation; independent review accepted final functional checkpoint `71c1328`
- Fixed a reproduced asynchronous export-encoding hang and added visible retry, duplicate-click and stale-snapshot safeguards to all three existing redaction export surfaces
- Local Canvas pixel/PNG verification passes; this is not production browser download or full-page network/privacy acceptance
- 31/31 pinned-runtime test entrypoints, 32-page build, SEO and blog checks pass; no remote publication or settings change
- Independent review reran the final aggregate and local pixel QA; details and limits: `audit/04B-export-qa-2026-10-01.md`


## 1 October 2026 — task 17 tutorial and task 21 directory receipts

- One original worked redaction tutorial is independently accepted at `834c125` for nonproduction Preview, with unchanged example PNGs and careful evidence/privacy limits
- Exact pinned runtime: 34/34 tests, 33 pages, general SEO and all eight blog checks pass; responsive visual QA and an actual publication date remain release gates
- The Free Tools Directory received one authorized Security-category submission at approximately 07:17 UTC; OSINT Newsletter Tools Library recorded one authorized maker-disclosed submission at approximately 07:21 UTC
- Both directory submissions await editorial review. No acceptance, publication, referral traffic or measured acquisition improvement is claimed; no email/social contact details supplied
- Existing `WORK-QUEUE.md` remains authoritative. No new outreach queue or automatic follow-up schedule was created


## 1 October 2026 — task 17 release candidate after Preview

Draft PR #2 and Cloudflare Preview for `3e7c15b` are verified. Independent wide/485px visual checks passed images, captions, checklist, FAQs, reciprocal links and unchanged historical dates. The new article is dated 1 October during release finalization; final exact-runtime checks, independent date/schema review and successor Preview remain gates before the production decision. No traffic/indexing improvement is claimed.

## 14 October 2026 - growth push (owner-requested "implement all")

Baseline from the owner's accounts, last 28 days: GA4 470 sessions (Organic 228, Direct 180, AI Assistant 58, Unassigned 4, Referral 1, Social 0), no key events. Search Console 157 clicks, 2.43k impressions, average position 9.2; homepage 135 of 157 clicks; CTR leaks on "check screenshot" (pos 3.5, 3.3%), "screenshot tester" and "give me a test on this screenshot" (0 clicks); conversational queries ranking 1-2 suggest AI Mode/Gemini citations.

Branch `growth/marketing-push-2026-10`:
- GA4 events: screenshot_uploaded, analysis_completed, link_checked, redaction_exported, download_requested, result_shared, install_prompt, app_installed (coarse labels only, no content). Optional Clarity via PUBLIC_CLARITY_ID, content pages only.
- New titles/descriptions for home, detector, payment, link, reverse search, scam, AI image pages; answer-first hero; llms.txt; 1200x630 og-image.
- Five review-only guides (publishedAt null): WhatsApp chat, social post, US P2P payments, UK bank transfer, Hindi shop-counter payment guide.
- Android share target (PWA + service worker, image stays in browser), install banner, shareable verdict-only result card, Chrome extension source in `extension/`.
- Privacy policy updated for the above. README rewritten for GitHub discovery.

Not done here (owner accounts or public posting): mark GA4 key events, Bing Webmaster import, Cloudflare Crawler Hints, Clarity project, Chrome Web Store submission, launch posts. No traffic change measured yet.

## 14 October 2026 - release

Owner asked to deploy to screenshotchecker.com. Added /how-it-works/, internal links to the new guides, fixed a 7px mobile overflow in privacy findings and dashboard button wrapping, set the five guides' publication date to 2026-10-14. Cloudflare Crawler Hints enabled. Bing Webmaster Tools was already verified with sitemaps (Aug 2026). Merged PR #12 to main for the production build.

## 15 October 2026 - improvement pass

- Day 1: all five new guides indexed by Google. analysis_completed marked as a GA4 key event; redaction_exported and result_shared registered with one setup_test event each (to be marked 16 Oct).
- Build step normalises internal links to trailing-slash URLs (1,532 links previously redirected; root cause of "Page with redirect" exclusions).
- Homepage copy/FAQs corrected: no claims of font or alignment detection. Added quick screenshot test section and screenshot-tester FAQs. AI detector page: fake-photo guidance and FAQs.
- New /spot-the-fake/ quiz (10 fictional rounds, score-only sharing, quiz events).
- 32 per-page share images; WCAG AA button contrast; heading order fix. Mobile Lighthouse 92-97 performance, SEO 100.
- Requested indexing for /spot-the-fake/ (Google, Bing) and resubmitted homepage and AI detector to Bing. Google daily inspection quota reached.
