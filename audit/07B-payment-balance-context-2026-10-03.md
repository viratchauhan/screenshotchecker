# Payment status and balance-context correction

Date: 3 October 2026 (Asia/Kolkata). Base: `71762a9941be56715f6e1cb12082d4bd992d767c`.

## Reproduction and bounded scope

On clean main, all three authored OCR fixtures headed `Payment successful`, `Payment pending` and `Payment failed`, with a ₹500 transfer and separate `Available balance ₹1,250.00`, returned `BANK_BALANCE`. The resulting report incorrectly asserted account-balance-only evidence.

Correcting only that precedence exposed a coupled false positive: the existing amount rule compared the separately labelled balance with the payment amount. This slice therefore includes the minimum balance-aware extraction and comparison needed to avoid introducing that warning.

- Explicit named transfer success, failure and pending markers outrank incidental balance labels
- Existing explicit failure-before-pending-before-success ordering is retained; a directly labelled balance-inquiry failure/waiting phrase cannot override an explicit transfer state; generic conflicting status outside that narrow context stays conservative
- Broad `unsuccessful`, `under processing` and `waiting for bank` remain below the balance guard; they may describe a balance inquiry
- Directly labelled balance values are retained in `allAmounts`, while `paymentAmounts` contains non-balance candidates
- Payment extraction selects a payment candidate, with a balance fallback only on a balance-only screen
- A currency-less payment amount stays currency-less when a different marked balance is present
- A balance-only value cannot strengthen the transfer proof category; classifier and extraction share the same balance-label context helper
- Amount consistency compares payment candidates; genuine differing payment amounts are still flagged
- No score weights, proof categories, OCR engine, sample generators, routes, page claims, dependencies, network/storage or analytics settings changed

## Verification

Runtime: exact repository pins Node 26.9.0 / npm 11.19.1, installed to an isolated temporary prefix; clean `npm ci` with unchanged lockfile.

- New focused tests: four passing groups, including 110 status/balance/order combinations (11 status phrases × 5 balance-label formats × both orders)
- Ten balance-only/ambiguous-balance controls retain `NO_PAYMENT_PROOF` and no proof strength
- Eleven explicit-status fixtures with only a balance value do not invent a payment amount; success markers remain weak evidence even with recipient/reference labels
- Thirty-three combinations of explicit transfer states plus unsuccessful/waiting/processing balance-inquiry text preserve the transfer state; nine additional conservative conflict/actual-failure controls cover no-balance and same-line contexts
- Two currency-loss controls retain `500.00` without inventing a currency
- Four real payment-conflict controls retain the two conflicting values while excluding a separately labelled balance; includes a shared-line case and equal balance/payment values
- Failed/pending precedence, collect-request, unrelated text and empty-input controls
- Actual report computation and production dashboard script render success, pending, failure, balance-only and success again, preserving the receipt label, amount, warning and independent-verification limit
- `npm run check`: 40/40 discovered entrypoints; 33-page Astro build
- `npm run test:seo`: 33 HTML files, zero errors/warnings
- `npm run test:blog-seo`: all eight articles and existing content-specific parity checks
- `git diff --check`: passes

Initial independent review found two missing controls: generic balance inquiry status could override an explicit transfer state, and a labelled balance could strengthen the proof category without a payment amount. Both are corrected in this successor and covered by regressions. A second review identified that the first generic-status guard was overbroad; it now excludes only directly labelled balance-inquiry status and retains conservative conflicting-status handling elsewhere. Exact-tree re-review is required.

The first uncapped aggregate run passed all 40 entrypoints but its build process was killed (exit 137). The same source built successfully with `NODE_OPTIONS=--max-old-space-size=768`; the complete aggregate is rerun with that bound. This is an execution-memory limit, not a suppressed test failure. The pre-fix focused regression failed on the expected balance-only classifications.

## Limits and release gate

These synthetic text-rule fixtures are not an OCR or real-world accuracy benchmark. Status extraction cannot verify authenticity or actual funds. Ambiguous/damaged OCR, unsupported providers, general-analyzer consistency, broad reference rules and existing certainty in other risk explanations remain separate tasks. This correction does not add a new measured visual capability.

Before release, require independent review plus exact-head Cloudflare Preview checks of the payment flow at wide and mobile widths, keyboard/repeated-input behavior, and all request methods for synthetic marker leakage. Whole-page analytics behavior is not certified by the isolated no-network test. Preview is noindex; production remains unchanged until the authorized release. Recheck the previous deployed version and record rollback before promotion.
