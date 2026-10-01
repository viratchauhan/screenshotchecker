# 09A — align privacy disclosures with implemented flows

Date: 1 October 2026. Base: reviewed source `1e8076195336af88dd6be544511f90725cde1d2f`, published as draft PR #1 snapshot `a37904b0b339e3606cf80a423cf73e0d65459d72` with identical tree. Scope: one copy-and-regression slice of existing task 09. This does not complete that task or authorize production deployment.

## Evidence and correction

The existing Layout loads Google Analytics (`gtag` js/config), while shared banners promised zero data transmission/storage. The handoff utility stores the full original image data URL, source-tool label and timestamp in sessionStorage. One-hour validity is checked on read; it is not a deletion timer, and successful reads/New Scan do not clear the payload. The standalone link client POSTs the full trimmed submission to same-origin `/api/check-link` before browser-local fallback and keeps up to ten recent URL results in localStorage. These facts conflict with blanket zero-network/RAM-only wording.

Shared homepage/footer/badge copy, the privacy policy, related about/error/meta descriptions and OCR/redactor/scanner FAQs now distinguish browser-local image processing from page requests and storage. The existing six badge translations are updated together. The policy explicitly describes analytics/cookies, OCR/font/resource requests, handoff lifetime, language preference, URL history and submitted-text POSTs. A new link FAQ discloses that submission/history behavior. Visible FAQ and structured answers still use the same data source. Decorative “0 Bytes” text is replaced by an explicitly illustrative local-processing label.

No analytics configuration, consent mechanism, storage lifetime, link request, image processing, export code, dependency or deployment configuration changes. There is no claim that this copy change establishes legal compliance or whole-page privacy certification. Broader tracking/consent choices and task 09's link-flow behavior remain separate work.

## Verification

- Exact repository runtime: Node 26.9.0 and npm 11.19.1
- Four new focused source checks: shared claim inventory, storage/network distinctions, FAQ disclosures and all six translated badge values
- Built-output checker compares every visible and JSON-LD FAQ answer on OCR, redactor, privacy scanner and link checker, plus privacy page disclosure/canonical checks
- Final exact-pinned aggregate: 33/33 discovered test entrypoints and 32-page build pass; SEO, all seven blog checks, built FAQ parity and whitespace checks pass
- Byte comparisons confirm Layout analytics, handoff/export/OCR/link modules, dependency files and Wrangler configuration are unchanged; client scripts in the two relabelled uploader/redactor components are byte-identical

## Prior Preview QA and limits

Preview `68f91974-479d-4b0b-ad0e-982bbd59f9c2` passed a synthetic desktop workflow and a narrow desktop resize at 485 CSS pixels: no horizontal document overflow on homepage, completed report or redactor; navigation and modal controls remained usable. This is not physical-device/touch coverage.

The supplied 1200×500 exported PNG was inspected separately: all target text pixels are covered by a uniform opaque near-black mask, 583,574 outside pixels match the synthetic source, PNG checksums pass and its test Comment marker is removed. The source had no EXIF; EXIF removal was not exercised. Image bytes alone cannot prove exact-build provenance.

Visible browser DevTools was blocked by organization policy. No runtime network capture or payload inspection was performed, and no alternate route bypassed that restriction. Source review found no application image/OCR/filename request path in the reviewed homepage/OCR/redactor flows, but actual third-party payloads remain unobserved. Successful local tests and a source audit do not establish zero network traffic. This scope corrects the unsupported assurance rather than certifying that assurance.

## References

- Google Analytics data collection: https://support.google.com/analytics/answer/11593727?hl=en
- Astro component/template model: https://docs.astro.build/en/basics/astro-components/
- Draft PR: https://github.com/viratchauhan/screenshotchecker/pull/1

## Final checks and review

Independent review accepted functional checkpoint `a9da48485cbe5ce36d39b7abc12426b11bea60cd`, tree `1603ab0c72175a9ce0d712b4e70e681833ba1126`. The reviewer found the revised processing/analytics/resource/storage/submitted-URL distinctions consistent with inspected source, and verified the linked Google guidance supports the qualified usage/device/cookie statement. Original-image handoff expiration was independently exercised: a simulated two-hour-old payload remained stored until a read rejected and cleared it. Runtime Layout analytics, handoff/export/OCR/link modules, dependencies and deployment config were byte-identical to `1e807619`; changed component scripts were also unchanged.

Independent exact-pinned checks passed 33/33 entrypoints, a 32-page build, SEO/blog, four source-copy tests, built FAQ/schema checks, separate rendered details/answer parity on all four affected FAQ routes, and whitespace. No blocking issue was found in this copy-only slice. This accepts accurate disclosure, not legal compliance or zero-network certification; actual third-party payloads remain unobserved and no prohibited DevTools route or remote write was used by the reviewer. Keep the PR draft until explicit production approval and remaining release risks are considered.
