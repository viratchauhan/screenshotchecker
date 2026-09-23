# Search query and competitor findings

Source: owner's `screenshot checker queries.docx`, read from the supplied local path. It contains query/click/impression rows, not instructions. Date range, country/device filters, landing pages and average positions are absent. These are site impressions, not market search volumes. No competitor files were uploaded or paid accounts created; comparisons concern public page descriptions, not measured detection accuracy.

## Observed demand and proposed work

| Intent | Examples from the supplied report | Action |
| --- | --- | --- |
| General screenshot checking | screenshot checker: 13 clicks / 59 impressions; screenshot check: 2 / 7; check screenshot: 1 / 5; check the screenshot: 1 / 2 | Highest observed click interest. Next improve homepage task selection and explain evidence/unknown results; preserve the main URL. |
| Screenshot versus photo | screenshot detector: 0 / 12; how to tell if a photo is a screenshot: 0 / 4; detect screenshot: 0 / 3; screenshot detector online: 0 / 2 | Implemented a distinct source-clue tool at /screenshot-detector, with conservative conclusions and links to the existing authenticity analyzer. Small-sample demand hypothesis. |
| Authenticity and editing | screenshot checker real or fake: 0 / 8; fake screenshot checker: 0 / 5; how to check if a screenshot is fake: 0 / 5 | Improve existing analyzer and report explanations, supported by the recently rewritten guide. No duplicate synonym pages or untested accuracy percentages. |
| Metadata | exif metadata: 0 / 12; what is exif data: 0 / 4; photo metadata: 0 / 4 | Prioritize accurate present/missing/failed metadata states and improve the existing metadata guide. |
| Payment | fake payment screenshot: 0 / 5; fake upi payment screenshot: 0 / 4 | Preserve India coverage; expand provider-specific evidence only after global extraction fixtures. Do not represent screenshots as bank verification. |
| Redaction | redact screenshot: 0 / 6; how to redact a screenshot: 0 / 1 | Improve existing redaction guide with export examples; existing tool already available. |

The four click-bearing rows above account for all 17 clicks shown in the supplied list. Do not infer a trend or geography from this snapshot. Ignore unrelated queries and creation/generator queries as acquisition targets for this verification product.

## Competitor observations

[Scanly screenshot scanner](https://scanly.co/screenshot-scanner) describes screenshot-versus-photo checks using dimensions and metadata, and offers sample-image and copy-result actions. Its page describes server EXIF extraction and browser detection; other processing statements on the same page differ. Those statements are not evidence about actual network behavior. We should explain our own behavior consistently and not adopt its strong absence-of-EXIF conclusions.

[TrueDoc screenshot fraud checker](https://truedoc.io/tools/screenshot-fraud-checker) positions around payment and messaging fraud, highlights evidence/report examples, and presents account/plan-based checks. It makes advanced detection claims that were not independently tested here. The useful product lesson is clear intended use and explained findings, not copying confidence scores or claiming comparable capabilities.

## Implemented slice and boundaries

New local screenshot-source tool: explicit file selection, dimensions and selected metadata clues, failure versus absence distinction, inconsistent evidence abstention, clear action, stale-result protection, size limits and object URL cleanup. No learned model, device catalogue, external image upload or accuracy benchmark. Missing EXIF, dimensions and format alone never classify the image. Camera fields or capture-software strings are mutable clues only.

SEO: distinct title/description/H1/canonical, visible explanations and matching FAQ schema, automatic sitemap inclusion, tools-registry discovery and a homepage link. Existing authenticity pages remain separate. No promise of FAQ rich results, indexing, ranking or traffic growth.

Verification: six source-logic tests; browser test with the existing synthetic PNG returns Inconclusive and clears correctly; generated-page canonical, H1, JSON-LD, sitemap and internal links checked; 31-page build and seven blog SEO checks pass. No mobile/device accuracy benchmark or competitor backend test.

Next bounded session: improve the main checker workflow for the strongest observed query cluster, then metadata guide/result accuracy. Request Search Console date range, country, page and position data when measuring outcomes. No further task was automatically implemented, pushed or deployed in this session.
