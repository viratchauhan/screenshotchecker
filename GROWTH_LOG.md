# ScreenshotChecker growth and product log

## 6 October 2026 additional owner-requested submission batch

Owner requested at least five links and more natural writing without long dashes. Five new relevant submissions received: OSINT4ALL and OSINT R. for screenshot comparison; The Tool Directory, public.tools and Nexo Hub for screenshot redaction. Each uses specific workflow copy, accurate limitations and ownership disclosure. No fake testimonials, paid placement, reciprocal badge or newsletter opt-in. Receipts verified in browser and saved locally. These are five pending submissions, not five published links or measured SEO gains. OSINT Radar was excluded following the owner's correction that it was already done. See `audit/OUTREACH-2026-10-06.md`. No schedule created.

## 6 October 2026 — status verification and bounded task 21 outreach

- Reconciled stale release notes with current GitHub main and authenticated Cloudflare deployment; no push or deploy performed. Build and SEO checks pass; 31 live indexable pages have matching main text, correct canonicals, one H1 and no noindex directives.
- Read the owner's supplied `ScreenshotChecker_Master_Backlink_Strategy_2026.md` and applied relevant editorial selection, accurate claims, owner disclosure and receipt tracking. This does not create an autonomous campaign or install a permanent skill.
- Journalist's Toolbox's official site-submission form confirmed receipt of the screenshot redactor recommendation on 6 October. Intended relevant resource: Digital security | safety. Publication, link attributes, referrals and acceptance remain unverified. Two earlier directory submissions remain pending; no duplicates submitted.
- Refreshed private Search Console baseline, including Google generative-AI visibility. Rolling comparison periods overlap; no causal growth attribution or total-session claim. Sitemap processing succeeds, while the older aggregate indexing report and an unindexed but live-indexable article remain open observations.
- Single local-only outreach ledger: `audit/backlink-ledger.local.json`. Existing WORK-QUEUE remains the task queue; next owner-requested slice can address the outstanding article's usefulness/discovery or verify editorial outcomes. No automatic follow-up or additional batch started.

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

## 16 October 2026 - backlink submissions

Search Console and Bing Webmaster Tools both show 0 external links before this work.

| Where | What | Status |
| --- | --- | --- |
| https://github.com/jivoi/awesome-osint/pull/1315 | Image Analysis entry, maker disclosed | PR open, awaiting maintainer |
| https://github.com/one-aalam/awesome-astro/pull/152 | Built with Astro entry, maker disclosed | PR open, awaiting maintainer |
| https://github.com/The-Osint-Toolbox/Fact-Checking-Verification/pull/8 | Image Verification entry, maker disclosed | PR open, awaiting maintainer |
| The Free Tools Directory (1 Oct) | Security category submission | Pending editorial review, no listing found |
| OSINT Newsletter Tools Library (1 Oct) | Maker-disclosed submission | Pending, no listing found |

Directory listings (AlternativeTo, SaaSHub, Peerlist, Product Hunt) need the owner to create accounts first.

## 16 October 2026 - scam guides and Hindi quiz

- /spot-the-fake/hindi/ (Hindi version of the quiz, hreflang pair with the English page).
- Four guides on high-volume scam searches, each with primary sources and a fictional worked example: india-post-courier-sms-scam, electricity-bill-disconnection-sms-scam, whatsapp-telegram-task-job-scam, unpaid-toll-text-scam. Linked from the smishing guide, related cards on the scam, spam and link checkers, and llms.txt.
- Indexing requested in Google Search Console for all four; submitted the four plus the updated smishing guide to Bing.
- The three awesome-list PRs are still open with no maintainer comments.

## 29 October 2026 - SEO audit fixes (claude-seo audit, owner-approved release)

Owner ran a claude-seo v2.5.0 audit (health score 83/100, no critical issues) and asked for every finding to be fixed and deployed. Released to production from main `5a45030` on 29 October (Cloudflare version before release: `466ded5b`, the rollback point).

- Security headers in `public/_headers`: HSTS, nosniff, X-Frame-Options, referrer policy, COOP, permissions policy, base CSP with frame-ancestors.
- Missing trailing slash now answers 301 (was 307) for every page; the build writes the rules into `dist/_redirects`.
- robots.txt lists only sitemap-index.xml (Cloudflare's managed block still supplies the groups). Sitemap lastmod on all URLs via `src/data/pageDates.ts`.
- Explainer sections under eight thin tool pages (`src/data/toolGuides.ts`), checked against each tool's code. Word counts roughly doubled (for example metadata remover 370 to 773).
- Footer guides column, resources and Hindi quiz links; spam checker in the tools directory; four related guides per tool page.
- Labelled fictional example figures (no real brands) in the 16 guides that had no image; listed as BlogPosting images.
- Schema: BlogPosting image, raster publisher logo, Screenshot Detector breadcrumbs, quiz x-default. llms.txt languages line corrected.
- Verified live: headers, 301s, sitemap (43 URLs, all dated), pages, sample analysis with no console errors. Sitemap index resubmitted in Search Console on 30 October; Google read it the same day.

## 30 October 2026 - author, Hindi payment checker, strict CSP

- Virat Chauhan is the byline and BlogPosting author (Person) on every guide, with an author page at /author/virat-chauhan/ (ProfilePage schema), linked from About.
- /payment-screenshot-checker/hindi/: the real payment checker with Hindi page text and FAQ, hreflang en/hi/x-default both ways. The analysis report itself stays English, and the page says so. PaymentToolLayout now takes a copy object; English text moved unchanged to `src/data/paymentToolCopy.ts`.
- Strict CSP via Astro `security.csp`: hashed inline scripts and styles, scripts only from self, jsDelivr, Google Tag Manager and Clarity, wasm-unsafe-eval for OCR/C2PA, GA4 hosts allowed. Inline onload/onclick handlers and the quiz's inline data script replaced. Every tool exercised locally under wrangler with the policy enforced: no violations.
- No traffic or ranking change is claimed yet; check Search Console Pages and Performance in two to three weeks.


## 6 November 2026 - three new guides

- /blog/how-to-tell-if-a-photo-is-a-screenshot/ (supports the screenshot detector; the query research showed "screenshot detector" and "how to tell if a photo is a screenshot" impressions with no matching guide).
- /blog/usps-redelivery-text-scam/ (US delivery smishing; sources: USPIS, USPS newsroom).
- /blog/fake-crypto-profit-screenshots/ (crypto investment scams; sources: FBI IC3 PSA and 2024 report, FTC, IC3 2025 fake law firm alert).
- Each has a labelled fictional figure, FAQ schema, sources and links from related guides, tool pages and llms.txt. Not yet requested for indexing.


## 12 November 2026 - snippet rewrites and two new guides

Search Console (28 days): /payment-screenshot-checker/ 4,983 impressions at position 5.8; top query "fake payment screenshot detector" 2,942 impressions at 4.1. Low CTR at positions 5-7 on fake-bank-transfer-screenshot (3,938 impressions, 1.6%), kaise-pehchane (2,148, 0.8%), fake-whatsapp-chat (1,105, 3.2%), electricity (607, 0.5%), india-post (398, 0.3%), social posts (514, 1%), screenshot-analyzer (435, 1.6%).

- New titles and descriptions on those pages; payment checker title now uses "Detector" to match the top query.
- /blog/payment-failed-screenshot-scam/ for "bank error screenshot", "payment failed screenshot" queries (RBI failed-transaction TAT, NPCI UPI Safety Shield).
- /blog/reverse-image-search-screenshot/ for the "search by screenshot" / "reverse image search screenshot" cluster (Google Lens help pages).
- Compare CTR for the rewritten pages after 28 days.


## 12-13 November 2026 - overnight SEO session

Search Console (28 days): /ai-image-detector/ position 20.6, top query "fake image detector" (292 impressions); /blog/whatsapp-telegram-task-job-scam/ position 8.2 with "prepaid task" / "merchant task" queries; "processing payment screenshot", "what is this screenshot from", "photo manipulation detector" had impressions but no matching page.

- New guides: where-is-this-screenshot-from, how-to-tell-if-a-photo-is-edited, ai-generated-screenshot, scam-statistics (UPI fraud by year from the Lok Sabha reply of 15 Dec 2025, 1930/CFCFRMS savings, FTC and FBI IC3 2025 losses; chart), digital-arrest-scam, e-challan-sms-scam, fake-receipt-ai-generated, qr-code-scam, trai-sim-block-call-scam, fake-customer-care-number-scam, and Hindi digital-arrest-kya-hai, fake-challan-message-kaise-pehchane, qr-code-fraud-se-kaise-bache, task-job-scam-se-kaise-bache (14 in all). English/Hindi pairs carry hreflang en/hi/x-default and a visible language link.
- Site structure: blog index grouped into topic sections with jump links; footer guide links updated; Resources page cards now link to real guides (they were dead-end cards); payment checker FAQs +3 (confirming a UPI credit, fake credit SMS, no QR or PIN to receive); image tool FAQs +2; Organization schema names its founder.
- Expanded: payment-failed guide (processing/pending screens), task scam guide (prepaid/merchant tasks, typical messages), PayPal/Venmo guide (refund screenshots).
- Titles matched to queries: fake image detector, photo manipulation detector, screenshot scam checker.
- Fix: the strict CSP had blocked the Cloudflare Web Analytics beacon since 30 Oct (Cloudflare analytics undercounted from then); static.cloudflareinsights.com and cloudflareinsights.com are now allowed.
- IndexNow: key file at the site root, `node scripts/indexnow.mjs <paths without leading slash> | --all` (posts to Bing). All URLs pinged.
- Google indexing requested for every new guide and the retitled tool pages; sitemap index resubmitted.
- Deploys: the Cloudflare Git auto-build stopped picking up pushes after f0f5b49; later releases were deployed with `npm run deploy` (wrangler). Check Workers Builds in the Cloudflare dashboard.
- Lighthouse mobile (homepage): performance 69 (lab only; no CrUX field data yet), accessibility 100, SEO 92 (only Cloudflare's managed robots.txt Content-Signal line is flagged; Google ignores it).

## 6 October 2026: reverse image search content and discovery

Implemented screenshot-source intent, mobile instructions, provider fit, troubleshooting and contextual links. Private Search Console baseline recorded separately. All focused checks pass; local only. No new image index, automatic provider upload, ranking guarantee or AI citation claim. Details: audit/REVERSE-SEARCH-2026-10-06.md.

## 6 October 2026: reverse search published

Pushed scoped commit 80229af to GitHub main and deployed Cloudflare version ac55bfcd-2a02-44d0-b3c6-31d7b26da914 at owner request. All three changed live pages return 200 and match the built main HTML; reverse-search sitemap inclusion verified. Previous production version 86ff44d0-ee0d-41f0-9b33-cf805c59a291 remains the rollback reference. Rankings have not yet been reassessed.


## 16 November 2026 - handoff and first results

- Search Console, last 7 days: 506 clicks, 8.02k impressions, CTR 6.3%. /payment-screenshot-checker/ 287 clicks at 17.7% CTR, position 4.4 (28-day CTR before the 12 Nov title change: 9.8%). The new guides are already appearing (for example trai-sim-block-call-scam at position 5.3, task-job-scam-se-kaise-bache 5.5, fake-challan-message-kaise-pehchane 5.9). Weak: /ai-image-detector/ 22.9, /image-manipulation-checker/ 31.8, how-to-tell-if-a-photo-is-edited 26.6, fake-receipt-ai-generated 43, unpaid-toll-text-scam 48.7.
- payment-failed and task-scam guides show 0.4% CTR: their queries are mostly people looking for failed-payment or task screenshots to use, so low CTR is expected there.
- H1s now match each tool's target query (fake image detector, photo manipulation detector, screenshot analyzer, search by screenshot), and the hidden AI detector result panel no longer ships a static "Likely AI-Generated" verdict in the HTML. Recrawl requested for both image tools.
- HANDOFF.md added for the move to a new computer; guide tools moved to scripts/content; the old checkout's 6 Oct notes merged.

## 2026-11-17: four guides and a refresh

- New: /blog/fake-job-offer-letter/ (RBI BE(A)WARE, FTC, FBI IC3, MEA eMigrate, PIB notices, Wipro), /blog/fake-amazon-flipkart-refund-scam/ (Amazon, Flipkart advisories, FTC alerts, RBI).
- Hindi pairs with hreflang: /blog/payment-fail-paisa-kat-gaya/, /blog/fake-receipt-kaise-pehchane/; Hindi payment checker now links four Hindi guides.
- /blog/unpaid-toll-text-scam/ (position about 40) refreshed: FTC top text scams 2024 and May 2026 imposter trend (+40%, toll texts); updatedAt 2026-11-17.
- Checks: npm test 40/40, build 70 pages, test:seo 0 errors/0 warnings, blog SEO 45 PASS. Deployed (version bab53c39), IndexNow 200 for 9 URLs. Search Console: indexing requested for the two English guides; daily quota exceeded before the two Hindi guides.

## 2026-11-17 (later): answers for long queries

- Search Console, last 3 months, query regex `^(?:\S+\s+){7,}\S+$` (8+ words): 57 queries, 252 impressions, 10 clicks, position 13.5. Many are pasted messages or quiz questions.
- Answered at the top of the page that already ranks:
  - india-post-courier-sms-scam: the "unsure about a courier delivery notification" quiz question (41 impressions, 0 clicks, position about 10) and the "update regarding your request has been shared via SMS" text (10 impressions, position 1.8, 0 clicks).
  - how-to-tell-if-a-photo-is-a-screenshot: direct answer first, plus iPhone and "is a screenshot the same as a photo" FAQs.
  - fake-upi-payment-screenshot: what a payment screenshot with date, time and UTR should show.
  - /reverse-image-search/: a quick answer for "how to find where a screenshot is from" (14 impressions, 0 clicks, position 8).
  - Homepage: a short how-to-tell-if-a-screenshot-is-fake answer under the uploader.
- Photo-edited queries rank 66-95, too low for this fix; they need links instead.
- Deployed (version 1af9bfd6), IndexNow 200 for 5 URLs. Compare these pages' clicks for 8+ word queries around 10 Dec.

## 2026-11-17/18 (overnight): competitor research and a batch of improvements

- Research: the only direct payment-checker competitor seen is scamdekho.in (UTR format checker, first-hour recovery steps, Hindi quick answer, Product Hunt). Image tools compete with isitai, aiornot, fakeimagedetector.io and fotoforensics/Forensically (journalist resource lists). Tactics adopted: answer-first copy, tool pages for proven queries, share images and large previews, Bing (ChatGPT search leans on it), brand mentions.
- New tools: /utr-number-checker/ (UPI/IMPS 12 digits, NEFT 16, RTGS 22, app IDs; how to confirm in your bank) and /fake-receipt-checker/ (image scan plus an in-browser receipt math check) for receipt queries where the guide ranked 75-92.
- Tool pages: ToolLayout renders a ToolGuide and a slot under the result. New explainers and FAQs on the scam checker (position 10 for "screenshot scam checker"), analyzer, spam checker; +6 FAQs on the AI image detector, +4 on the manipulation checker; payment checker (EN/HI) gets UTR and first-hour cards.
- New guides: loan-app-harassment-morphed-photos and Hindi pair loan-app-harassment-kya-kare; Hindi fake-job-offer-letter-kaise-pehchane and amazon-flipkart-refund-fraud-se-bache. Answer-first intros on the receipt, payment and screenshot-source guides linking the new tools.
- Fix: 8 guide intros and 23 checklist items printed their links as raw HTML (since 12 Nov on some guides); now rendered as HTML with underlined links.
- Share cards for 25 pages that used the default image (scripts/content/render-og.py, og-spec.mjs); robots meta now allows max-image-preview:large.
- 12 deploys, all checks green (76 pages, test:seo 0/0, blog SEO 49 PASS, no broken internal links). IndexNow for every changed URL. Search Console indexing requested for the UTR checker, receipt checker and both 17 Nov Hindi guides; quota ran out at the scam checker.
- Owner actions and drafts in the private outreach kit (18 Nov section): Bing Webmaster Tools import, Featured/Qwoted/SourceBottle, resource-list pitch, listing copy.

## 2026-11-18: homepage audit fixes and semantic gap sections

- Page audit (86/100): hidden result-panel placeholder headings converted to role=heading (no h2 to h4 skips), empty img src removed.
- Semantic gap analysis: Google India "fake screenshot" is creation intent (generators, editors); for "fake screenshot detector" we rank #5 (FauxLens, DeepAI, TruthScan above) and are named in the AI Overview. Added three homepage sections: how fake screenshots are made and how to catch each kind (table), screenshot vs photo forensics, what a result looks like. Homepage now about 4,550 words, 0 heading skips. Later the same day: AI marks (C2PA, SynthID), visual giveaways, screenshots as evidence (FRE 901, BSA s.63) and a sources block added; homepage about 5,000 words. Compare "fake screenshot detector" position around 10 Dec.

## 2026-11-21: routine check

- Live check: key pages, sitemaps (74 URLs), robots.txt, llms.txt and share cards all 200 in under 1 s; live site matches git.
- Search Console, last 7 days by page: payment checker 327 clicks, 1,867 impressions, CTR 17.5%, position 4.3 (about 75% more clicks a week than its 28-day average on 17 Nov); homepage 110 clicks, 6.1%, position 5.3 (flat); reverse image search position 12.0 (diluted by new broad queries such as "free image checker" at 52-58, core screenshot-search queries still 4-9); AI detector 26.9; fake-amazon-flipkart-refund-scam already position 4.1.
- URL inspection: indexed now: fake-receipt-checker, loan-app-harassment-morphed-photos, fake-job-offer-letter-kaise-pehchane, amazon-flipkart-refund-fraud-se-bache, payment-fail-paisa-kat-gaya, fake-receipt-kaise-pehchane. Not indexed: loan-app-harassment-kya-kare (indexing requested), fake-job-offer-letter (crawled 21 Nov, still "Crawled - currently not indexed"; homepage and scam checker now link it). Homepage recrawl requested; quota ran out at the scam checker.

## 2026-11-22: rough market sizing (no Ahrefs; Google Trends + Search Console)

- Anchor: "fake payment screenshot detector" about 4,000 impressions a month in Search Console at position 3.6, so the broad "fake payment screenshot" topic in India is roughly 8,000-10,000 searches a month; 1 Google Trends point (India, 12 months, set with UTR/reverse image/AI detector/digital arrest) is about 1,000 searches a month. Treat every figure as plus or minus 2x.
- India estimates (all variants, monthly): UTR number ~50k; reverse image search ~36k; fake screenshot ~27k (mostly creation intent); digital arrest ~20k (spiky); task job ~15k (mixed intent); AI image detector ~9k; WhatsApp scam ~9k; UPI fraud ~9k; online fraud complaint ~7k. Worldwide, AI image detector is about 6x and reverse image search about 60x the fake payment screenshot topic.
- Realistic reach in 12-24 months: about 20k-45k visits a month (niche 6-10k, UTR 3-5k, scam guides 4-8k, reverse image/AI 3-8k, US English 2-5k, non-Google 2-5k). 100k needs a top-3 win on a global head term (AI image detector or screenshot reverse search) and real link authority: a 2-3 year stretch goal.

## 2026-11-22: UTR topic group

- New guides: /blog/what-is-utr-number/, /blog/how-to-find-utr-number/ and Hindi pair /blog/utr-number-kya-hota-hai/ (hreflang with the explainer). Built from Google autocomplete demand ("utr number kya hota hai", "kaise nikale", "in gpay/phonepe/paytm", "utr vs transaction id/rrn") and the ~50k/month India estimate. Sources: Paytm support, Google Pay help, PhonePe Business, RBI TAT framework.
- Linked from the UTR checker page, blog index (payments), related links (UTR checker, Hindi payment checker), and from fake-upi, payment-failed, kaise-pehchane and payment-fail guides. Deployed c58171b5; IndexNow 200; Google indexing requested for all three on 22 Nov.
- Next: AI image detector and reverse image search push (the two global head terms the sizing says 100k depends on).

## 2026-11-22 (later): 8+ word queries re-run

- Same regex, 28 days: mostly the questions answered on 17 Nov (their 28-day numbers still include the days before the answers). New: "how to check utr number is valid or not" (position 5) answered first in the UTR checker FAQ. Re-run in about two weeks once the 17 Nov answers have a full 28 days.

## 2026-11-22 (later): AI image detector and reverse image search push

- Reverse image search tool: in-browser crop (drag to select, Crop to selection, Undo), Auto-trim borders, Yandex as a fourth provider; quick answer and guide text updated (the page used to say it could not crop). Unit tests for clampCropRect and findTrimBounds; tested in the browser at desktop and phone width.
- AI image detector: already on par with competitors on features (verdict, evidence strength, C2PA, ELA view, paste); no percentage score by design. Its explainer now links the new guide.
- New guides: how-to-tell-if-an-image-is-ai-generated (EN, targets "is this image ai generated / or not / ai edited") and Hindi photo-se-search-kaise-kare ("photo se search kaise kare", "google par photo se search kaise kare"). Google indexing requested for both and a recrawl of /reverse-image-search/.
- Links: drafts for AI tool directories (There's An AI For That, Futurepedia, Toolify, TopAI.tools, SaaSHub, AlternativeTo) and awesome-osint in the private outreach kit; ledger updated (prospect_drafted). Owner submits.
