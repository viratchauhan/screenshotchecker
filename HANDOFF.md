# ScreenshotChecker handoff (read this first)

Last updated: 16 November 2026. Written so an assistant on a new computer can pick up the work without the old
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

1. Pick the topic from Search Console queries with impressions but no matching page, or a clear scam trend.
   Research official sources (RBI/NPCI/I4C/PIB/TRAI for India; FTC/FBI IC3 for the US) and open each link to confirm it.
2. Write the guide as JSON matching the `BlogArticle` type (slug, title, `seoTitle` <= 60 chars counting `&amp;`/`&quot;`
   as entities, `metaDescription` <= 160, excerpt, targetKeywords, keyTakeaway, introduction, contentSections with
   optional figure/checklist/callout, faq, relatedSlugs, cta). Avoid quotes and ampersands in seoTitle/description.
3. Add a figure spec to a new `scripts/content/figure-specs/batch-NN.json` and render it:
   `python scripts/content/render-figures.py scripts/content/figure-specs/batch-NN.json .`
   (needs `pip install playwright` and `python -m playwright install chromium`). Look at the PNG before using it.
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

## Where things stand (16 Nov 2026)

- 66 built pages; 36 guides in `blogArticles.ts` (5 Hindi; the statistics page is one of them), 12+ tools. All tests pass; sitemap 64 URLs; no broken
  internal links.
- 12 Nov: snippet rewrites on 8 low-CTR pages (baseline numbers in GROWTH_LOG, 12 Nov entry) and 2 guides.
- 12-13 Nov: 14 new guides, topic-grouped blog index, Resources cards linked to real guides, hreflang pairs,
  payment/image tool FAQs, Organization founder schema, IndexNow, and a CSP fix that unblocked the Cloudflare
  analytics beacon (analytics undercounted from 30 Oct to 12 Nov). Indexing requested for every new page.
- Top page: `/payment-screenshot-checker/` (about 5,000 impressions per 28 days, position about 5.7; top query
  "fake payment screenshot detector" around position 4). `/ai-image-detector/` was around position 20.
- Backlinks: 8 directory/editorial submissions from 1 and 6 Oct are pending editorial review (see the ledger);
  none verified as published.

## Next steps

1. Around 10 Dec 2026, compare 28-day CTR and position for the pages retitled on 12 Nov against the GROWTH_LOG
   baseline; keep winners, revise losers.
2. Check Search Console Pages report: confirm the 12-13 Nov guides are indexed; re-request any still
   "Discovered - currently not indexed".
3. Restore Cloudflare Git auto-deploys (owner, dashboard), or keep deploying with wrangler.
4. Owner actions from the outreach kit: send the Gmail drafts, list on AlternativeTo/Product Hunt, answer Quora/Reddit
   questions with disclosure, share Hindi WhatsApp forwards.
5. Content ideas not yet done: Hindi versions of the payment-failed and fake receipt guides; fake job offer letter;
   fake Amazon/Flipkart order or delivery screenshots; refreshing `/blog/unpaid-toll-text-scam/` (position about 40);
   update the statistics page when FY 2025-26 UPI figures or FTC 2026 data are published.
6. Lab performance (Lighthouse mobile 69) is not a ranking factor without field data; revisit when CrUX data appears.
