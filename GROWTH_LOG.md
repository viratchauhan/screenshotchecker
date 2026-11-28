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

## 2026-11-27: UTR number tracking guide

- New guide /blog/utr-number-tracking/ for the autocomplete cluster "utr number tracking online", "utr number tracking sbi", "track payment by utr number", "utr number status check", "how to track utr number" (only one FAQ line covered it before). Answer first: no public tracker exists; track in your own app or through your bank. Time limits from sources opened on 27 Nov: RBI NEFT FAQ (bank CFC, two hours from batch settlement), RBI RTGS FAQ (22-character UTR, 30 minutes, customers cannot track, return within one hour), RBI 2019 TAT circular (UPI/IMPS T+1, Rs 100 a day, merchant T+5), RBI CMS for complaints. The NPCI dispute page did not load, so nothing is cited from it.
- Linked from what-is-utr-number (in text and related), how-to-find-utr-number, the UTR checker's related cards, the blog index (payments) and llms.txt. Figure batch-20, share card.
- Checks: npm test 40/40, build 82 pages, test:seo 0 errors/0 warnings, blog SEO 55 PASS. Deployed 850f475b, live URLs 200, IndexNow 200 for 5 URLs. Google indexing not requested: Search Console was signed out in the browser pane.
- Also fast-forwarded the worktree to main (footer and README link commits from 23 Nov).

## 2026-11-27 (later): digital arrest complaint section

- Autocomplete showed a cluster the digital arrest guides only covered in one FAQ line: "digital arrest complaint", "complaint number", "complaint online", "digital arrest ki complaint kaise kare", "digital arrest helpline number", "how to report digital arrest".
- Added a section to /blog/digital-arrest-scam/ and the Hindi /blog/digital-arrest-kya-hai/: the number is 1930 (no separate digital arrest helpline), online at cybercrime.gov.in, Chakshu for calls with no loss (within 30 days), which channel to use when, and a warning about fake helpline numbers. Two new FAQs in English, one in Hindi; updatedAt set. Sources opened on 27 Nov: I4C NCRP page (1930 in all States/UTs, bank-linked fraud reporting system, online status tracking) and Sanchar Saathi Chakshu page.
- Checks: npm test 40/40, build 82 pages, test:seo 0 errors/0 warnings, blog SEO 55 PASS. Deployed 8cd4d6db, both URLs 200, IndexNow 200 for 2 URLs. Google indexing not requested: Search Console still signed out in the browser pane.
- HANDOFF.md repaired: a duplicated copy of its first half had been pasted into the regex line of "Adding a guide".

## 2026-11-28: Hindi UTR payment check guide

- New Hindi guide /blog/utr-number-se-payment-kaise-check-kare/, the pair of /blog/utr-number-tracking/ (hreflang both ways). Built for the Hindi autocomplete cluster seen on 28 Nov: "utr number se payment kaise check kare" (also "... online", "... sbi"), "utr number status kaise check kare", "utr number se payment status kaise check kare online", "utr number kaise track kare", "utr नंबर से पेमेंट कैसे चेक करें". Same answer as the English guide: no public tracker; check in your own app or through your bank.
- Sources reopened on 28 Nov and matched line by line: RBI NEFT FAQ (bank CFC, details for faster tracking, two hours from batch settlement), RBI RTGS FAQ (30 minutes, customers cannot track, return within one hour, repo rate plus 2% on a delayed return), RBI 2019 TAT circular (T+1, T+5, Rs 100 a day). The Hindi text ties the RTGS compensation to a delayed return, as the FAQ words it.
- Linked from utr-number-kya-hota-hai and payment-fail-paisa-kat-gaya (related), the Hindi payment checker's related cards and llms.txt; the blog index lists Hindi guides automatically. Figure batch-21, share card.
- Checks: npm test 40/40, build 83 pages, test:seo 0 errors/0 warnings, blog SEO 56 PASS. Deployed ffe86e03, 6 URLs 200, IndexNow 200 for 6 URLs.
- Slip to avoid: the run was at 02:00 IST, when the UTC date was still 27 Nov, so publishedAt 2026-11-28 failed the "not in the future" test (it compares with the UTC date), and a chained command deployed that build (d61bfd64) before the failure was read. Fixed within minutes: publishedAt is 2026-11-27, the UTC release date. Before 05:30 IST use the UTC date, and read the test result before committing.
- Search Console was signed out in the browser pane again: the 28 Nov re-check of /blog/fake-job-offer-letter/ and all pending indexing requests are still waiting for the owner to sign in.

## 2026-11-28 (later): task job scam complaint and money recovery section

- Autocomplete showed a cluster the task job guides only covered in one FAQ line: "telegram task scam complaint", "telegram task scam money recovery", "task scam money recovery", "telegram fraud complaint online / phone number", "how to report a telegram scammer".
- Added a section to /blog/whatsapp-telegram-task-job-scam/ and the Hindi /blog/task-job-scam-se-kaise-bache/ (which was thin): no separate number, 1930 and cybercrime.gov.in; what recovery really looks like; who handles the complaint afterwards and status tracking; how to report the group in Telegram (Report button, abuse address); what to keep ready before calling. Two new FAQs in each language; updatedAt set (UTC date, 27 Nov).
- Sources opened on 28 Nov: I4C NCRP page (1930 in all States/UTs, 85 banks and intermediaries, online status tracking), Home Ministry statement of 6 Aug 2024 (system launched 2021, more than Rs 2,400 crore saved in more than 7.6 lakh complaints, State/UT police handle FIRs), Telegram FAQ (Report buttons per platform, abuse address with t.me links).
- Checks: npm test 40/40, build 83 pages, test:seo 0 errors/0 warnings, blog SEO 56 PASS. Deployed 38a8ec51, both URLs 200, IndexNow 200 for 2 URLs. Google indexing not requested: Search Console still signed out in the browser pane, so the overdue re-check of /blog/fake-job-offer-letter/ is still waiting.

## 2026-11-28 (third run): cyber crime complaint status guide

- Search Console was still signed out in the browser pane, so the overdue re-check of /blog/fake-job-offer-letter/ and the pending indexing requests are still waiting for the owner to sign in. All four checks passed before the work started.
- New guide /blog/cyber-crime-complaint-status/ for an autocomplete cluster with no page on the site: "cyber crime complaint status", "... check online", "... by acknowledgement number", "... without otp", "... with mobile number", "... by account number", "... pending means", "1930 complaint status", "cyber crime complaint kaise check kare / track kare". Answer first: Track Your Complaint on cybercrime.gov.in with the acknowledgement number, an OTP and a captcha; no search by mobile or account number; free.
- Sources opened on 28 Nov in the browser: cybercrime.gov.in Track Your Complaint page (fields: acknowledgement number, Get OTP, OTP, captcha, Submit), the portal FAQ (status only for Report and Track or Report Other Cybercrime, SMS and email with the reference, State/UT police handle complaints, withdrawal before FIR, evidence list, false information) and the I4C NCRP page (online status tracking, 1930 in all States/UTs, 85 banks). The FAQ does not define status words, so "pending" is explained in plain terms and labelled as such; nothing is claimed about whether a 1930 call always gives an acknowledgement number.
- Linked from the digital arrest guide's complaint section (in text), related lists of digital-arrest-scam, whatsapp-telegram-task-job-scam and fake-customer-care-number-scam, the scam checker's related cards, the blog index (scam messages) and llms.txt. Figure batch-22, share card.
- Checks: npm test 40/40, build 84 pages, test:seo 0 errors/0 warnings, blog SEO 57 PASS. Deployed c7ca72ec, 8 URLs 200, IndexNow 200 for 6 URLs. Google indexing not requested (signed out).
- Next idea: Hindi pair for this guide ("cyber crime complaint kaise check kare", "kaise track kare", "kaise wapas le").

## 28 Nov 2026 (indexing, owner signed in to Search Console)

- Type: SEO housekeeping (no site change, no deploy needed: repo clean, nothing unpushed, live pages checked 200 with the new sections).
- `/blog/fake-job-offer-letter/` is now indexed (was "Crawled - currently not indexed" on 21 Nov; the homepage and scam checker links were added then).
- Indexing requested for three new guides that were "URL is unknown to Google": utr-number-tracking, utr-number-se-payment-kaise-check-kare, cyber-crime-complaint-status.
- Recrawls requested: digital-arrest-scam, digital-arrest-kya-hai, whatsapp-telegram-task-job-scam, task-job-scam-se-kaise-bache, screenshot-scam-checker, ai-image-detector, screenshot-analyzer. 11 requests in all, none refused.
- The scheduled task now runs every hour and alternates TOOL and CONTENT runs (owner request, 28 Nov).

## 28 Nov 2026 (hourly run, TOOL): adjustable ELA view on the photo manipulation checker

- Type: TOOL (the run before was SEO housekeeping). Work queue item T1, first of the photo forensics push.
- `/image-manipulation-checker/` now has three sliders under the picture in ELA mode: JPEG quality of the test re-save (50 to 98%), error scale (5x to 60x) and "Show original on top" (0 to 100%), plus Reset view and a live sentence that states the current settings. Forensically and FotoForensics both offer these controls.
- The sliders redraw only the picture. The result pill and the three result cards still come from the fixed analysis (75% quality, 25x), and a unit test pins the slider defaults to those values. The panel says what ELA shows and what it cannot prove.
- Also fixed in the view: pictures larger than 1600 px on one side were squashed (each side was capped separately); the adjustable view keeps the shape. Mode buttons now expose aria-pressed. The sliders are hidden in Original and Noise modes.
- Code: `src/lib/analyzer/elaView.ts` (clamping, pixel maths, size fit, renderer that reuses the re-saved copy while only the scale moves) and `src/lib/analyzer/__tests__/elaView.test.ts` (9 tests).
- Testing: preview_start was declined in this unattended run, so the built site was tested in headless Chrome with the dist files served by request interception (no server), with a fictional test picture (noisy gradient with a pasted "FICTIONAL TEST PATCH"), at 375 px and 1280 px: scale, quality, overlay, mode switch, keyboard arrow, reset and a second upload all behaved, no horizontal overflow, no page errors. Repeated on the live page after deploy under the real CSP header: no console errors.
- Checks: npm test 41/41, build 84 pages, test:seo 0 errors/0 warnings, blog SEO 57 PASS. Commit b2f4172, deployed 8618f409, live URL 200, IndexNow 200 for 1 URL. Google indexing not requested (a tool control, not a new page).
- Notes for later runs: `forensics.ts` (the verdict analysis) still caps each side at 1600 separately; fixing it changes scores for very large pictures, so it needs its own tested run. The "Noise Variance Map" button still shows the ELA map until T3 is built. The run lock cannot live at `.git\work-run.lock` because `.git` is a file in this worktree; this run kept it at the path `git rev-parse --git-dir` prints, plus `work-run.lock`.

## 28 Nov 2026 (owner session): FotoForensics alternatives guide, checker retitle, competitor data

- Type: CONTENT.
- New guide `/blog/fotoforensics-alternative/` for the autocomplete cluster "fotoforensics alternative / fotoforensics com alternative / websites like fotoforensics / is fotoforensics safe / how does fotoforensics work". Honest comparison of FotoForensics, Forensically, Image Edited? and our checker; says where the rivals are stronger; facts from fotoforensics.com FAQ and tutorials, 29a.ch/photo-forensics and imageedited.com FAQ (opened 28 Nov). Figure batch-23, share card. Linked from the checker's related guides, the photo-edited and AI-image guides, the blog index and llms.txt.
- `/image-manipulation-checker/`: title "Photo Manipulation Detector: Is This Image Edited?" -> "Is This Photo Edited? Free Edit & Photoshop Detector"; description corrected (it claimed clone detection, which the tool does not have). Baseline for the retitle: 17 clicks, 441 impressions, position 38.5 in the 28 days to 27 Nov.
- Competitor data: Ahrefs Domain Rating FotoForensics 70, 29a.ch 67, imageedited.com 20, screenshotchecker.com 0.5; FotoForensics has about 16K backlinks from 3.8K sites (Ahrefs free checker) and about 77-107k visits a month, falling (Similarweb; its own status page shows unique uploads down from 64k in Nov 2025 to about 43k). Linker types and the send-first order for drafts are in the private outreach kit.
- Checks: npm test 41/41, build 85 pages, test:seo 0 errors/0 warnings, blog SEO 58 PASS. Deployed 982bfc9e, 5 URLs 200, IndexNow 200 for 4 URLs. Google indexing requested for the new guide; the checker page recrawl hit the daily quota (request it tomorrow).
- The lock file path in the hourly task was wrong (`.git` is a file in this worktree); the lock now lives at D:\screenshotchecker\.git\worktrees\screenshotchecker-seo\work-run.lock.

## 28 Nov 2026 (owner session, later): backlink reality check with SEO Review Tools

- Type: PLANNING (no site change).
- Our links: 162 backlinks from 136 sites, but 99 of the top 100 are auto-made spam pages that advertise link-selling gigs; one real link (the OSINT Newsletter tools directory). Decision: ignore the spam, no disavow unless Search Console shows a manual action, never buy links.
- imageedited.com (3 pages) has about 2.9K linking sites, mostly old "how to spot a photoshopped photo" articles on big publishers that name it as a tool. FotoForensics shares keywords with truthscan.com, fakeimagedetector.com, fauxlens.com, 29a.ch and snapwonders.com.
- Next: a fair "free tools to check if a photo is edited" guide, and drafts to authors of still-maintained tool articles and OSINT lists (details in the private outreach kit).
- SEO Review Tools and the Ahrefs free checker only work in the owner's Chrome (the built-in browser pane fails their human check).

## 28 Nov 2026 (hourly run, TOOL): JPEG save quality on the photo manipulation checker

- Type: TOOL (the last site change was CONTENT; today's planning was logged in the owner session). Work queue items T2 and T1b.
- `/image-manipulation-checker/` has a new "JPEG save quality" card under the result cards. It reads the quantization tables stored in the file, matches them to the standard JPEG tables scaled the libjpeg way and says "Last saved at N% JPEG quality" (or "about N%, nearest match" when the tables are custom, as many cameras and some editors write). It lists the tables on request, explains PNG, WebP and GIF files in a sentence, and a button sets the ELA re-save quality to the estimate. The card states what it shows and what it cannot prove (the last save only, not how often or by whom, and not whether anything was changed). Forensically has a JPEG analysis view; ours adds the reading.
- The preview picture inside the EXIF block is skipped (segments are walked by their length), cut-off files never throw, and only the first 2 MB of the file is decoded. Everything runs in the browser.
- T1b: the verdict analysis (`forensics.ts`) now scales pictures over 1600 px with `fitElaViewSize`, so wide or tall pictures are no longer squashed before scoring. Scores of very large non-square pictures can shift slightly.
- Code: `src/lib/analyzer/jpegQuality.ts` and `__tests__/jpegQuality.test.ts` (11 tests: every quality 10 to 99 recovered exactly, EXIF decoy, custom tables, formats, junk input, data URL head, page wiring).
- Testing: preview_start was declined again in the unattended run, so the built files were tested in headless Chrome with request interception, at 375 px and 1280 px, with three fictional pictures made for the test (noisy gradient saved at 92%, the same with a pasted patch saved at 70%, a PNG): 92% and 70% were read exactly, the PNG was explained, the button moved the ELA slider and redrew the map, no overflow. Repeated on the live page under the real CSP: same results, no console errors.
- Checks: npm test 42/42, build 85 pages, test:seo 0 errors/0 warnings, blog SEO 58 PASS. Commit 00bd2b5, deployed f1ab44dd, live URL 200, IndexNow 200 for 1 URL. Google indexing not requested (a tool card, not a new page; yesterday's recrawl request for this page is still on the HANDOFF list).
- Found while testing and queued: the result pill stayed "Consistent Compression" for the fictional picture with the pasted patch (the verdict compares four quadrants only): T2c. A true re-save flag needs DCT histograms: T2b.

## 28 Nov 2026 (hourly run, CONTENT): how to read error level analysis guide

- Type: CONTENT (the run before was TOOL; today's planning was already logged). Work queue item C2, first of the forensic technique tutorials.
- New guide `/blog/how-to-read-error-level-analysis/` for the autocomplete cluster "how to read error level analysis / what does error level analysis do / what is error level analysis / ela image analysis / ela fake image". Answer first (compare like with like: edges with edges, textures with textures, flat areas with flat areas), then what ELA does, a six-step reading, what bright, dark, mismatched and rainbow areas mean, six false alarms (text, contrasting colours, sharpening, resizing, watermarks, screenshots), when ELA cannot help, and how to get a better result with the checker's sliders and JPEG quality card.
- Sources opened this run: fotoforensics.com/tutorial-ela.php, fotoforensics.com/faq.php (privacy wording), the Wikipedia article on error level analysis (Krawetz 2007, limits, the Farid criticism and Krawetz's reply), 29a.ch Forensically post. No invented numbers.
- Linked from the checker's related guides, the photo-edited and FotoForensics-alternative guides, the blog index (AI images and photo forensics) and llms.txt. Figure batch-24 (fictional reading card), share card.
- Checks: npm test 42/42, build 86 pages, test:seo 0 errors/0 warnings, blog SEO 59 PASS. Commit d532155, deployed f8ac2213, 7 URLs 200, IndexNow 200 for 5 URLs. Google indexing requested for the new guide (Search Console was signed in; "URL is unknown to Google" before the request).
- Next: a TOOL run (T2c finer verdict grid, or T3 noise view). Further C2 tutorials: JPEG quality and re-saves (the tool has the card), then noise analysis and thumbnail mismatch once T3 and T4 ship.

## 28 Nov 2026 (hourly run, TOOL): area by area check on the photo manipulation checker

- Type: TOOL (the run before was CONTENT; today's planning was already logged). Work queue item T2c. Decision: T2c was taken before T2b because it fixes a wrong-looking result, and T2b (DCT histograms) needs a run of its own.
- `/image-manipulation-checker/` has a new "Area by area check" card and the result pill now uses it. The picture is cut into up to 8 x 8 areas. For each one the tool measures how much it changed in the 75% test re-save and how much fine detail it has, fits a robust line through the areas of the same picture, and flags only an area that changed far more than its own detail explains. Flagged areas are outlined on the ELA map (hidden in the Original view), the pill reads "Uneven Areas", and the notes name the places in words (for example "middle left") and the innocent causes (added text, stickers, watermarks, very sharp objects).
- Flat areas are set aside and explained ("N of 64 areas are flat colour ... this check cannot judge them"), and a picture that is mostly flat or too small gets "Not enough detail to compare areas" instead of an "even" result. The card states what it shows and what it cannot prove.
- Honest limit found while testing: the fictional picture from T2c (a flat patch pasted in, everything saved together at 70%) still reads "Consistent Compression". ELA cannot see that edit at all, because a flat area barely changes in a re-save whether it is original or pasted. The card now says exactly that about flat areas, which is the truthful answer. What the grid does catch is the classic splice: material pasted into a picture that had been saved at a lower quality before.
- Thresholds were chosen on 19 untouched photos in four forms each (as they are, 1600 px at 80%, 1280 px at 92%, saved twice with a resize: 76 pictures, none flagged) and 60 splices (base at 65 or 75%, final save at 90 or 92%: 25 of 30 flagged, never a wrong area; base and final quality close together, 85/85 or 70/75: 2 of 30, which is expected and stated as a limit). The photos were Windows' bundled wallpapers, used locally only; nothing was added to the repo. They contain no text or stickers, so real-world false alarms on memes and captioned pictures are likely and the wording treats a flag as "look here", never as a verdict.
- Code: `src/lib/analyzer/elaGrid.ts` (pure functions) and `__tests__/elaGrid.test.ts` (10 tests on fictional pictures: untouched, pasted patch flagged in the right cells, slightly different patch not flagged, flat areas, too little data, varied pictures, place names, page wiring). `forensics.ts` returns `elaGrid` in `ForensicsInfo`; the homepage analyzer and AI detector read the same `anomaliesDetected`, so a flagged splice now counts there too.
- Testing: preview_start was declined again in the unattended run, so the built files were tested in headless Chrome with request interception at 375 px and 1280 px with four fictional pictures made for the test (untouched at 92%, untouched PNG, splice, flat patch at 70%): the splice gave "4 uneven areas found" with the four outlines on the patch, the others stayed clean, outlines hide in the Original view, no overflow. Repeated on the live page under the real CSP: same results, no console errors.
- Checks: npm test 43/43, build 86 pages, test:seo 0 errors/0 warnings, blog SEO 59 PASS. Commit d74cb1e, deployed 51b423df, live URL 200, IndexNow 200 for 1 URL. Google indexing not requested (a tool card, not a new page).
- Next: a CONTENT run (C2 JPEG quality and re-saves tutorial, or C6 free tools guide). Queued from this run: T2d (the green "Consistent Compression" pill says more than the tool knows; reword to something like "No uneven areas found" and keep the colour neutral when many areas are flat).
