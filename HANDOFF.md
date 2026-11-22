# ScreenshotChecker handoff (read this first)

Last updated: 22 November 2026. Written so an assistant on a new computer can pick up the work without the old
conversation. Keep it current: update "Where things stand" and "Next steps" at the end of every session.

## What this is

- **Site:** https://screenshotchecker.com: free, mostly in-browser tools to check whether a screenshot, payment receipt or
  photo is real, edited or part of a scam (OCR, metadata, ELA, AI-image clues, redaction, comparison, link checks),
  plus plain-language guides in English and Hindi.
- **Stack:** Astro 7 + TypeScript + Tailwind, static output served by the Cloudflare Worker `screenshotchecker`
  (static assets, `public/_headers`, build-generated `_redirects`). Repo: github.com/viratchauhan/screenshotchecker
  (**public**: never commit secrets, account metrics beyond what GROWTH_LOG already states, or private ledgers).
- **Owner:** Virat Chauhan (author byline, `/author/virat-chauhan/`). Not related to the owner's other project, beMahan.

## Read next

`AGENTS.md` (owner rules), `GROWTH_LOG.md` (dated history, newest entries at the bottom plus older ones at the top),
`WORK-QUEUE.md` (task queue), `GROWTH-PLAN.md` (strategy), `BLOG-PUBLISHING.md` (date and quality rules).

## Owner preferences and permissions

- Ask before pushing to `main` or deploying unless the owner has said to deploy in the current session.
  A session-level "deploy freely" covers that session only.
- Outreach: short natural copy, no em dashes, disclose ownership. Never create accounts, accept terms or submit forms
  on outside sites without the owner's go-ahead; prepare drafts (Gmail drafts are fine when asked) instead.
- Do not repeat backlink submissions: check the private ledger (below) first.
- Accuracy over volume: every claim in a guide is checked against an official or reputable source and linked;
  figures are labelled "Fictional example"; tools are described with their limits (no "100% accurate" claims).

## Private files (not in Git)

On the owner's Google Drive: `My Drive/beMahan-PC/screenshotchecker-private/`
- `audit/backlink-ledger.local.json`: every directory/editorial submission and its status.
- `audit/*.local.jpg`: submission receipts; `audit/search-console-baseline.local.md`: early Search Console baseline.
- `outreach-kit.md`: backlink and marketing plan, directory listing text, Hindi WhatsApp forwards, social posts.
  Four matching outreach emails were saved as unsent Gmail drafts ("[ScreenshotChecker] ...") on 12 Nov 2026.
Copy `audit/*.local.*` back into `audit/` locally if a task needs them (they are gitignored).

## Where things live in the code

| What | File |
| --- | --- |
| All blog guides (single source) | `src/data/blogArticles.ts` (`lang: "hi"` for Hindi) |
| Blog index topic sections | `src/pages/blog/index.astro` (`TOPICS`; unlisted guides fall into "More guides", Hindi guides group automatically) |
| English/Hindi guide pairs (hreflang + visible switch) | `src/pages/blog/[slug].astro` (`TRANSLATION_PAIRS`) |
| Tool page explainer sections | `src/data/toolGuides.ts` + `src/components/ToolGuide.astro` (ToolLayout pages show the guide whose key matches the path; ToolLayout also has a slot under the result for page widgets) |
| Tool page FAQs | `src/data/toolFaqs.ts` (payment checker FAQs are inline in `src/pages/payment-screenshot-checker.astro`) |
| Related guide/tool cards per page | `src/components/RelatedLinks.astro` |
| Sitemap `lastmod` for non-blog pages | `src/data/pageDates.ts` (update when visible content changes) |
| Author / Person schema | `src/data/author.ts`; Organization schema in `src/layouts/Layout.astro` |
| Strict CSP (hashed inline scripts) | `astro.config.mjs` `security.csp`; header-only directives in `public/_headers` |
| AI/LLM summary of the site | `public/llms.txt` (add every new guide) |
| Footer guide links | `src/components/Footer.astro` |
| Payment checker copy (EN/HI) | `src/data/paymentToolCopy.ts` |

Tests pin some copy on purpose (for example the payment checker FAQ count in
`src/lib/paymentAnalyzer/__tests__/paymentLandingCopy.test.mjs` and `scripts/verify-seo.mjs`). If a deliberate change
breaks one, update the test in the same commit and say why.

## Adding a guide (the routine used since November)

1. Pick the topic from Search Console queries with impressions but no matching page, or a clear scam trend.
   Long questions: Performance > Query filter > Custom (regex) `^(?:S+s+){7,}S+# ScreenshotChecker handoff (read this first)

Last updated: 17 November 2026. Written so an assistant on a new computer can pick up the work without the old
conversation. Keep it current: update "Where things stand" and "Next steps" at the end of every session.

## What this is

- **Site:** https://screenshotchecker.com: free, mostly in-browser tools to check whether a screenshot, payment receipt or
  photo is real, edited or part of a scam (OCR, metadata, ELA, AI-image clues, redaction, comparison, link checks),
  plus plain-language guides in English and Hindi.
- **Stack:** Astro 7 + TypeScript + Tailwind, static output served by the Cloudflare Worker `screenshotchecker`
  (static assets, `public/_headers`, build-generated `_redirects`). Repo: github.com/viratchauhan/screenshotchecker
  (**public**: never commit secrets, account metrics beyond what GROWTH_LOG already states, or private ledgers).
- **Owner:** Virat Chauhan (author byline, `/author/virat-chauhan/`). Not related to the owner's other project, beMahan.

## Read next

`AGENTS.md` (owner rules), `GROWTH_LOG.md` (dated history, newest entries at the bottom plus older ones at the top),
`WORK-QUEUE.md` (task queue), `GROWTH-PLAN.md` (strategy), `BLOG-PUBLISHING.md` (date and quality rules).

## Owner preferences and permissions

- Ask before pushing to `main` or deploying unless the owner has said to deploy in the current session.
  A session-level "deploy freely" covers that session only.
- Outreach: short natural copy, no em dashes, disclose ownership. Never create accounts, accept terms or submit forms
  on outside sites without the owner's go-ahead; prepare drafts (Gmail drafts are fine when asked) instead.
- Do not repeat backlink submissions: check the private ledger (below) first.
- Accuracy over volume: every claim in a guide is checked against an official or reputable source and linked;
  figures are labelled "Fictional example"; tools are described with their limits (no "100% accurate" claims).

## Private files (not in Git)

On the owner's Google Drive: `My Drive/beMahan-PC/screenshotchecker-private/`
- `audit/backlink-ledger.local.json`: every directory/editorial submission and its status.
- `audit/*.local.jpg`: submission receipts; `audit/search-console-baseline.local.md`: early Search Console baseline.
- `outreach-kit.md`: backlink and marketing plan, directory listing text, Hindi WhatsApp forwards, social posts.
  Four matching outreach emails were saved as unsent Gmail drafts ("[ScreenshotChecker] ...") on 12 Nov 2026.
Copy `audit/*.local.*` back into `audit/` locally if a task needs them (they are gitignored).

## Where things live in the code

| What | File |
| --- | --- |
| All blog guides (single source) | `src/data/blogArticles.ts` (`lang: "hi"` for Hindi) |
| Blog index topic sections | `src/pages/blog/index.astro` (`TOPICS`; unlisted guides fall into "More guides", Hindi guides group automatically) |
| English/Hindi guide pairs (hreflang + visible switch) | `src/pages/blog/[slug].astro` (`TRANSLATION_PAIRS`) |
| Tool page explainer sections | `src/data/toolGuides.ts` + `src/components/ToolGuide.astro` |
| Tool page FAQs | `src/data/toolFaqs.ts` (payment checker FAQs are inline in `src/pages/payment-screenshot-checker.astro`) |
| Related guide/tool cards per page | `src/components/RelatedLinks.astro` |
| Sitemap `lastmod` for non-blog pages | `src/data/pageDates.ts` (update when visible content changes) |
| Author / Person schema | `src/data/author.ts`; Organization schema in `src/layouts/Layout.astro` |
| Strict CSP (hashed inline scripts) | `astro.config.mjs` `security.csp`; header-only directives in `public/_headers` |
| AI/LLM summary of the site | `public/llms.txt` (add every new guide) |
| Footer guide links | `src/components/Footer.astro` |
| Payment checker copy (EN/HI) | `src/data/paymentToolCopy.ts` |

Tests pin some copy on purpose (for example the payment checker FAQ count in
`src/lib/paymentAnalyzer/__tests__/paymentLandingCopy.test.mjs` and `scripts/verify-seo.mjs`). If a deliberate change
breaks one, update the test in the same commit and say why.

## Adding a guide (the routine used since November)

 lists 8+ word queries; answer
   high-impression, no-click ones at the top of the page that already ranks (URL filter `&query=~<regex>&breakdown=page`).
   Research official sources (RBI/NPCI/I4C/PIB/TRAI for India; FTC/FBI IC3 for the US) and open each link to confirm it.
2. Write the guide as JSON matching the `BlogArticle` type (slug, title, `seoTitle` <= 60 chars counting `&amp;`/`&quot;`
   as entities, `metaDescription` <= 160, excerpt, targetKeywords, keyTakeaway, introduction, contentSections with
   optional figure/checklist/callout, faq, relatedSlugs, cta). Avoid quotes and ampersands in seoTitle/description.
3. Add a figure spec to a new `scripts/content/figure-specs/batch-NN.json` and render it:
   `python scripts/content/render-figures.py scripts/content/figure-specs/batch-NN.json .`
   (needs `pip install playwright` and `python -m playwright install chromium`; on the old PC the SEO skill's
   `~/.claude/skills/seo/.venv` Python with `PLAYWRIGHT_BROWSERS_PATH=~/.claude/skills/seo/ms-playwright` had it). Look at the PNG before using it.
   Share card: `node --import tsx scripts/content/og-spec.mjs > spec.json`, edit titles, then
   `python scripts/content/render-og.py spec.json .` (writes `public/og/blog-<slug>.png`; the layout picks it up).
4. Insert: `node scripts/content/insert-articles.cjs new-articles.json . "existing-slug>new-slug,..." "llms.txt line|||new line"`.
   Then add the slug to a `TOPICS` section in `src/pages/blog/index.astro`, to `RelatedLinks.astro` where it fits, and,
   for a Hindi translation, to `TRANSLATION_PAIRS`.
5. Checks, **build first**: `npm test` (40 entrypoints), `npm run build`, `npm run test:seo` (0 errors/warnings),
   `npm run test:blog-seo` (all PASS). Optionally check internal links across `dist/`.

## Deploying

- `git push origin HEAD:main` keeps GitHub current, but **Cloudflare's Git auto-build stopped picking up pushes on
  12 Nov 2026** (last auto-build: commit f0f5b49). Deploy with `npm run deploy` (astro build + `wrangler deploy`).
  On a new computer run `npx wrangler login` first (Cloudflare account that owns the `screenshotchecker` Worker).
  Worth checking Workers Builds settings in the Cloudflare dashboard to restore auto-deploys.
- After deploying, confirm the new URL returns 200 (the edge can take a few seconds) and ping IndexNow:
  `node scripts/indexnow.mjs blog/new-guide/ blog/` (paths without a leading slash; Git Bash rewrites `/paths`).
  The IndexNow key file is `public/548e7443ed0e42d77af84624c3b08d01.txt`; the script posts to Bing.
- Rollback: `npx wrangler deployments list` then `npx wrangler rollback <version-id>`.

## Search Console

Domain property `sc-domain:screenshotchecker.com` on the owner's Google account. If the browser shows a sign-in page,
ask the owner to sign in (never enter passwords yourself). Request indexing from the Overview page's "Inspect any URL" box (direct
`/inspect?id=` links return 404); the daily request quota is roughly 10-15 URLs. The sitemap is
`https://screenshotchecker.com/sitemap-index.xml` (submit the full URL). Cloudflare Web Analytics is the analytics
source alongside GA4 and Clarity.

## Where things stand (22 Nov 2026)

- 81 built pages; 49 guides in `blogArticles.ts` (12 Hindi; the statistics page is one of them), 14+ tools (UTR number checker and fake receipt checker added 18 Nov). All tests pass; sitemap 64 URLs; no broken
  internal links.
- 12 Nov: snippet rewrites on 8 low-CTR pages (baseline numbers in GROWTH_LOG, 12 Nov entry) and 2 guides.
- 12-13 Nov: 14 new guides, topic-grouped blog index, Resources cards linked to real guides, hreflang pairs,
  payment/image tool FAQs, Organization founder schema, IndexNow, and a CSP fix that unblocked the Cloudflare
  analytics beacon (analytics undercounted from 30 Oct to 12 Nov). Indexing requested for every new page.
- Top page: `/payment-screenshot-checker/` (about 5,000 impressions per 28 days, position about 5.7; top query
  "fake payment screenshot detector" around position 4). `/ai-image-detector/` was around position 20.
- 16 Nov: payment checker CTR rose to 17.7% at position 4.4 (7 days) after the 12 Nov title change; new guides
  already rank around 5-9. Image tools still rank 20-32 for competitive queries: on-page and internal links are done,
  they now need backlinks. H1s were aligned with target queries on 16 Nov.
- 17 Nov: new guides `fake-job-offer-letter`, `fake-amazon-flipkart-refund-scam`, and Hindi pairs
  `payment-fail-paisa-kat-gaya`, `fake-receipt-kaise-pehchane`; `unpaid-toll-text-scam` refreshed with FTC 2025-26 data.
  IndexNow pinged. Search Console indexing requested for the two English guides on 17 Nov; the daily quota ran out
  before the two Hindi guides.
- 17 Nov (later): long-query answers added at the top of the courier SMS, screenshot-or-photo and UPI guides, the
  reverse image search page and the homepage (GROWTH_LOG has the queries). Deployed 1af9bfd6.
- 18 Nov (overnight): competitor research (scamdekho.in is the direct payment-checker rival), UTR checker and fake receipt
  checker tools, tool explainers/FAQs (scam, analyzer, spam, AI detector, ELA), loan app harassment guides (EN/HI),
  Hindi job offer and Amazon/Flipkart refund guides, share cards for 25 pages, max-image-preview:large, and a fix for raw HTML in guide intros and
  checklists. GROWTH_LOG has details.
- 22 Nov: UTR topic group (what-is-utr-number, how-to-find-utr-number, Hindi utr-number-kya-hota-hai), indexing requested. Rough market sizing in GROWTH_LOG (22 Nov): 20-45k visits a month realistic in 12-24 months; 100k needs a top-3 win on AI image detector or screenshot reverse search.
- 21 Nov routine check: payment checker 327 clicks in 7 days at 17.5% CTR, position 4.3; homepage flat (110 clicks, 5.3).
- Backlinks: 8 directory/editorial submissions from 1 and 6 Oct are pending editorial review (see the ledger);
  none verified as published.

## Next steps

1. Around 10 Dec 2026, compare 28-day CTR and position for the pages retitled on 12 Nov against the GROWTH_LOG
   baseline; keep winners, revise losers.
2. Search Console (21 Nov): every new page from 17-18 Nov is indexed except `/blog/fake-job-offer-letter/` (crawled 21 Nov, "Crawled - currently not indexed"; homepage and scam checker now link it, re-check around 28 Nov and request again if still out) and `/blog/loan-app-harassment-kya-kare/` (requested 21 Nov). Still to recrawl when quota allows: `/screenshot-scam-checker/`, `/ai-image-detector/`, `/screenshot-analyzer/`. Search Console signs out in the browser pane from time to time: ask the owner to sign in; at narrow pane widths the Inspect box is hidden, so set the viewport to 1280 px first.
3. Restore Cloudflare Git auto-deploys (owner, dashboard), or keep deploying with wrangler.
4. Owner actions from the outreach kit (see its 18 Nov section: Bing Webmaster Tools import, Featured/Qwoted/SourceBottle): send the Gmail drafts, list on AlternativeTo/Product Hunt, answer Quora/Reddit
   questions with disclosure, share Hindi WhatsApp forwards.
5. AI image detector and reverse image search push started 22 Nov (crop tool, Yandex, two guides). Remaining lever is links: owner submits the 22 Nov directory drafts in the outreach kit. Content ideas not yet done: per-app payment guides only with real
   differences (PhonePe, Google Pay, Paytm layouts and IDs); an original-data piece (for example testing detectors on
   fictional fake receipts) to pitch to journalists; fake electricity or gas bill PDFs; fake rent receipts; update the statistics page when FY 2025-26 UPI figures or FTC 2026 data are published.
6. Lab performance (Lighthouse mobile 69) is not a ranking factor without field data; revisit when CrUX data appears.
7. doMahan banner (done 16 Nov): `src/components/DomahanBanner.astro` promotes the owner's free Android planner app.
   It sits once per page, directly under the scan result and below the upload box, on 17 tool pages: after
   `<AnalysisDashboard />` in `ToolLayout.astro` and `src/pages/index.astro`, after `<PaymentAnalysisDashboard />` in
   `PaymentToolLayout.astro` (English and Hindi), after `</main>` in the AI detector, comparison, forensics, metadata
   (checker and remover), OCR and redactor (redactor and privacy checker) workspaces, after the checker section in
   `LinkCheckerWorkspace.astro`, after the result section in `screenshot-detector.astro` and after the provider section
   in `reverse-image-search.astro`. Other languages on the homepage switch in place, so they share that placement.
   Tested at desktop, 390 px and 340 px in light and dark: no sideways scroll, no console or CSP errors, the link opens
   the Play page for com.domahan.app, and the X keeps it hidden after a reload in the same tab. New tool pages should
   include `<DomahanBanner />` under their result. Do not change its text, colours or links without asking the owner.
