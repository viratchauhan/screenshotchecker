# Payment landing-page claim alignment

Prepared 2 October 2026. Local review checkpoint; no branch publication or deployment performed in this slice.

## Scope and evidence

- Fresh isolated branch from remote main `4886204dcc3fa47bfbb6c6fadbaddc70a42b0d85`, tree `38eff73b6cf144fbef2eca56407c1219be75ea32`.
- Bounded task 08B content-accuracy slice: `payment-screenshot-checker.astro`, static educational copy in `PaymentToolLayout.astro`, and only the payment entry in the shared `RelatedLinks.astro` catalog.
- The landing page promised measured fonts, icon positions, layout, app-specific design validation and fake-template detection. These conflicted with `paymentPipeline.ts`, whose output explicitly says fonts, icon positions and layout were not measured, and `paymentVisualForensics.ts`, which receives OCR text and fields rather than image pixels or font metrics.
- Replaced those promises with OCR extraction attempts, configured text/reference rules, classification uncertainty, benign differences and independent receiving-side payment confirmation. The ten FAQ questions remain, with corrected answers generated into both the visible accordion and FAQ schema by the existing shared source.
- Removed universal 12-digit authenticity rules, unsupported score calibration implications and false certainty from missing credit, SMS or soundbox alerts. Explained that fees/balances, OCR and capture time can produce benign differences. A plausible reference can be copied; no live transaction database is queried.
- Corrected the directly related shared payment card, including its unsupported PayPal coverage/design-inspection claim. Other card records, relationship maps and rendering are unchanged.
- Updated the inaccurate verification promise in the payment title/snippet, retaining the existing route, H1, badge, layout, controls and navigation. Clarified the existing generated sample buttons as synthetic; sample data and behavior are unchanged.
- Preserved all payment classifiers, extraction, scoring, dashboard/modal code, event handlers, analytics, dependencies, settings, assets and article records/dates. This is not an accuracy validation or repair of legacy scoring and report wording.

## Primary sources checked on 2 October 2026

- [Google Pay bank-statement guidance](https://support.google.com/pay/india/answer/16919844?hl=en): compare the date, reference and incoming credit against official records. Its specific displayed reference example is not generalized into a universal rule.
- [PhonePe fake-screenshot precautions](https://www.phonepe.com/blog/trust-and-safety/heres-a-quick-guide-to-help-you-avoid-becoming-a-victim-of-fake-payment-screenshots-2/): check transaction history before handing over goods/services and do not rely only on the customer's screenshot. Its absolute smart-speaker claim is not repeated.
- [Google Pay transaction-status guidance](https://support.google.com/pay/india/answer/16920039?hl=en-IN): processing, failed and successful-but-not-received cases differ. Missing credit is not itself proof of a forged screenshot. No universal reversal deadline is asserted.

The first two sources are linked visibly in the landing guidance. The existing UPI guide remains linked through the unchanged related-guide mapping.

## Verification

Exact repo pins: **Node 26.9.0 / npm 11.19.1**. Reused the existing dependency installation after byte-for-byte lockfile comparison; no new clean-install claim.

- Focused source tests: **4/4 pass**, covering OCR/text-rule claims, ten FAQ answers, benign controls, static guidance/source links and the single shared payment card.
- `ASTRO_TELEMETRY_DISABLED=1 npm run check`: **38/38 entrypoints pass; 33-page production build passes**.
- `npm run test:seo`: **33 pages; zero errors/warnings**. New generated assertions cover metadata/WebApplication description parity, all ten visible/schema FAQ pairs, workflow limits, benign context, exact primary-source links and the contextual payment card on the existing UPI guide.
- `npm run test:blog-seo`: **pass**, including all released article/date/schema and discovery checks.
- Six isolated generated-output negative controls rejected at their intended assertions: FAQ parity, calibrated score claim, missing-credit certainty, removed benign amount context, wrong primary-source target and restored false shared-card claim. Restored generated output passes.
- `git diff --check`: **pass**. Payment layout client script, related-link maps/rendering, dependency lockfile and all runtime payment modules are unchanged. Existing large-bundle build warning remains.
- Scope/private-data review: changes contain only public site copy, source URLs, synthetic copy assertions and this verification record; no private screenshots, extracted user text, analytics exports, credentials or local logs are included.

## Remaining gates and limits

Independent exact-commit review and exact-head Preview checks remain before publication. Check wide/narrow rendering, the longer FAQ answers, keyboard accordion behavior, sample/control continuity and source/related links. No local or live browser pass is claimed here.

Task 08B remains open for broader runtime evidence/error wording and evaluated rule behavior. In particular, legacy proof-strength terminology, reference assumptions and fixed confidence/scoring values have not been redesigned or validated. This slice does not establish detection accuracy, search indexing, rankings, traffic gains or financial settlement.
