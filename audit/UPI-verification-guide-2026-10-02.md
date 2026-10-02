# Existing UPI guide: verification-first correction

Prepared 2 October 2026. Local review checkpoint only; no remote branch, PR or deployment created for this slice.

## Scope

- Fresh isolated checkout of verified main `0ee65995de8b83f14f8189ee733ed77537e2ab49`, tree `c3c8163660811d7311b25213e9bfac539bb7618d`.
- Rewrites only the existing `fake-upi-payment-screenshot` record in `src/data/blogArticles.ts`. Retains its URL, title, SEO title, meta description and original `2026-08-22` publication date. Sets the substantive update date to `2026-10-02` for the intended release candidate.
- Leads with independent receiving-side transaction verification. Adds one explicitly fictional ₹500 seller walkthrough, with separate matching-credit and unconfirmed-credit outcomes; it is neither a real customer case nor a measured tool test.
- Includes benign balance-screen, capture-time, OCR and differently labelled amount explanations. Missing credit does not automatically establish fraud.
- Replaces unsupported font/icon/logo measurements, calibrated accuracy, template-detection claims, universal reference-format rules and refund deadlines with the implemented OCR/text-rule limits.
- Six useful FAQs use the existing shared visible/schema source. Adds a brand byline without invented credentials, direct primary-source citations and relevant payment, redaction and privacy links. Removes this article's keyword-only block.
- No runtime, dependency, asset, analytics, configuration or other article-record changes. Broader payment extraction, scoring, tool-page copy and methods work remains open.

## Primary-source and code alignment

All three primary sources were read on 2 October 2026:

1. [PhonePe fake-payment-screenshot guidance](https://www.phonepe.com/blog/trust-and-safety/heres-a-quick-guide-to-help-you-avoid-becoming-a-victim-of-fake-payment-screenshots-2/) supports checking transaction history before providing goods/services and provides reporting routes. Its absolute soundbox claim is not repeated.
2. [Google Pay: check your bank statement](https://support.google.com/pay/india/answer/16919844?hl=en) supports comparing official records by transaction date, reference and credit amount. Its displayed reference-format example is not generalized to every bank/app or used as an authenticity rule.
3. [Google Pay: check transaction status](https://support.google.com/pay/india/answer/16920039?hl=en-IN) distinguishes processing, failed and successful-but-not-received states. The article links this status-specific guidance, including the instruction not to repeat a processing payment, without promising a universal reversal deadline.

Implementation reviewed: `paymentPipeline.ts`, `paymentClassifier.ts`, `paymentExtractor.ts`, `paymentVisualForensics.ts` and `paymentRiskEngine.ts` under `src/lib/paymentAnalyzer/`. These classify/extract from OCR and apply weighted text/reference rules; the pipeline explicitly says fonts, icon positions and layout were not measured. The article does not present legacy proof-strength wording or rule scores as financial verification or calibrated probabilities. It acknowledges extraction/classification errors rather than promising exact field recovery.

## Verification

Exact repository runtime: **Node 26.9.0 / npm 11.19.1** from an existing isolated temporary prefix. Reused the existing dependency installation only after verifying the lockfile matches byte-for-byte; no fresh dependency-install claim.

- `node --import tsx src/lib/analyzer/__tests__/blogSystem.test.ts`: **PASS**.
- `ASTRO_TELEMETRY_DISABLED=1 npm run check`: **PASS, 37/37 entrypoints and 33-page production build**.
- `npm run test:seo`: **PASS, 33 pages, zero errors/warnings**.
- `npm run test:blog-seo`: **PASS**, including the new UPI generated-output assertions and all existing article checks.
- Generated checks cover original publication/update dates, sitemap lastmod, canonical, one H1, retained snippet, visible/schema FAQ and byline parity, verification-before-tool order, checklist, fictional label/outcomes, benign explanations, text-rule limits, exact primary-source URLs and resolving internal destinations.
- Six temporary built-output negative controls were rejected at their intended assertions: removed fictional qualification, reversed text-rule limitation, false missing-credit conclusion, replaced primary-source URL, divergent visible FAQ and restored unsupported accuracy claim. Restored the output byte-for-byte, then reran blog SEO successfully.
- Compared all eight article records against the base module: exactly the UPI record changed; all seven others are deeply equal and the article count is unchanged.
- `git diff --check`: **PASS**. Existing large-client-bundle build warning remains.

## Remaining gates and limits

Independent exact-commit review and exact-head Preview checks at wide/narrow widths remain before publication. Preview should cover the checklist, Hindi callout, worked example, six FAQs, dates and linked destinations. If the release slips to another day, correct the update date and its regression expectation before publishing.

The existing payment tool's marketing copy still contains stale font/icon and reference-format claims. Some legacy rule explanations/weights also remain imperfect. Those are explicitly outside this single-article correction and need separate bounded work; this guide does not certify or repair them. This change does not establish accuracy, indexing, rankings, AI citations, backlinks or traffic gains.
