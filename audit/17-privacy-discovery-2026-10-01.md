# Task 17: contextual privacy discovery

Prepared 1 October 2026. Local review checkpoint; no branch publication, PR or deployment performed for this slice.

## Scope

- Isolated branch from verified main `ddc7fcac20f762fbe11272c10257727cf8430596`, tree `27d05b0651c6c6d6bd0dc185dba2532174cae4e9`.
- Three relationship-map changes in `src/components/RelatedLinks.astro` only:
  - EXIF guide tools: metadata inspector, metadata remover, redactor.
  - Redaction tutorial tools: redactor, metadata inspector, metadata remover.
  - Privacy scanner guides: redaction tutorial, EXIF guide.
- The guide tool cards previously fell back to generic analyzer/payment/forensics recommendations. The existing main article CTAs were already correct and are unchanged.
- Existing redactor guide cards, every article record and date, public assets, tool behavior, analytics, dependencies and configuration remain unchanged. No new route or recommendation-card wording.

## Verification

Exact repository pins: **Node 26.9.0 / npm 11.19.1**, installed in an isolated temporary prefix. Reused the existing dependency installation after confirming its lockfile matches; no clean-room dependency install claimed.

- `npm run check`: **PASS, 37/37 entrypoints and 33-page build**.
- `npm run test:seo`: **PASS, 33 pages, zero errors and warnings**.
- `npm run test:blog-seo`: **PASS**, all eight articles plus targeted contextual-card checks for both guides, the privacy scanner and the unchanged redactor.
- New assertions locate each specific recommendation heading and adjacent card grid, then check exact destinations, order, named cards and built target existence. Links in page navigation or article copy cannot satisfy these assertions.
- Four temporary built-output negative controls replaced one card destination per checked grid with an unrelated existing target; every case failed at its targeted card assertion. Original output was restored byte-for-byte and the final blog SEO check passed again.
- The initial assertion assumed all recommendation grids were inside `main`; the existing redactor workspace renders its grid after `main`. The selector now locates the semantic section heading on both layouts without changing production markup. Final aggregate/build/SEO checks above use the corrected assertion.
- Built-output comparison against the existing matching-base build shows differences only in the three intended HTML pages; all other output files are identical.
- Source comparison confirms article records/dates, assets, page sources, dependencies and configuration are unchanged. `git diff --check` passes.
- Existing large-client-bundle warning remains. No indexing, ranking, backlink or traffic improvement is claimed.

## Remaining gates

Independent review of the exact local checkpoint and exact-head Preview checks at wide and narrow widths, including card destinations and existing redactor recommendations, precede publication. This static discovery fix does not re-certify tool privacy, metadata removal, or redaction behavior and does not close broader task 17.
