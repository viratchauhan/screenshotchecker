# Q3 diagnosis — same payment facts, different reports

Date: 1 October 2026 (Asia/Kolkata). Source inspected: `a2012368359aa2ff7a106b0c52a4971d734cac13`. Read-only product diagnosis: no scores, extraction rules, classifiers or UI were changed. Five authored synthetic OCR-text fixtures were passed through the actual extraction, financial analysis, reasoning, reference-pattern and dedicated payment functions. Fetch was replaced with a throwing guard. No image, OCR model, browser session, bank record or external destination was used.

The final homepage status below is source-traced from `InvestigationAgent`'s reference-result override, not an end-to-end image/browser execution. The raw constituent outputs were captured separately as diagnostic evidence. Fixture counts are not accuracy measurements.

## Reproduction

Base text:

```
Transaction Successful
30 Aug 2026, 11:17 AM
Paid to
Example Store
example.store@ybl
₹500.00
Transaction ID: TXN1JB2JWHL
Debited from: State Bank of India - 2845
UTR: 423189271602
Secured by PhonePe
```

| Synthetic variation | General/homepage constituents | Dedicated payment result |
| --- | --- | --- |
| Base | Amount ₹500.00; date absent; UTR entity retained, no false phone; reasoning UNVERIFIABLE, reference class unverifiable / score 0, final source-traced INSUFFICIENT_EVIDENCE | Amount ₹500.00; date 30 Aug 2026; UTR retained; PAYMENT_SUCCESS, STRONG_VISUAL, LOW_RISK 10/100 |
| Remove ₹ only | Both recover 500.00; general currency explicitly Unknown; otherwise same unknown-settlement/reference outcome | PAYMENT_SUCCESS still, but proof strength becomes WEAK because its classifier independently requires a currency token; LOW_RISK remains 10/100 |
| Replace Paid to with Banking name: | Same amount/reference/status evidence as base | CAUTION 25/100, solely from a medium typography anomaly triggered by the label string |
| Replace Transaction Successful with Payment pending | Financial type DEBIT because Debited from is prioritized; Paid to matches generic success keyword, producing a success/pending contradiction; reason CONTRADICTED is then source-traced to INSUFFICIENT_EVIDENCE by no-reference override | PAYMENT_PENDING, WEAK, LOW_RISK 10/100 |
| Append Available balance: ₹1500.00 | Primary amount remains ₹500.00; balance avoids amount-contradiction finding; reasoning UNVERIFIABLE, reference class legitimate / score 12 | Classifier gives BANK_BALANCE precedence, report labels the first ₹500.00 as balance and makes UTR Not applicable, despite explicit successful transfer/UTR text |

## Root causes

1. **Different questions are collapsed into one headline.** `src/lib/ai/investigationTools.ts:98–124` extracts financial facts. `src/lib/ai/multimodalProvider.ts` can correctly call settlement UNVERIFIABLE. `src/lib/ai/investigationAgent.ts:130–139` then replaces that headline/claim/action when the unrelated fraud reference engine has no reliable match. No reference match is not a failed amount extraction and should not erase separately observed facts. This explains the general INSUFFICIENT_EVIDENCE versus payment CAUTION comparison without requiring equal numeric scores.
2. **The dedicated 25 is text-rule arithmetic, not measured typography.** `paymentVisualForensics.ts:33–43` flags the presence of Banking name: as a font-family inconsistency. Its inputs contain text/extracted fields/dimensions, not pixels, font metrics or boxes. `paymentRiskEngine.ts:120–166` starts at 10 and adds 15 for that medium rule, producing CAUTION at 25. The pipeline also says it evaluated typography/alignment without such measurement. Changing only a normal label proves the warning's stated evidence is unsupported.
3. **Facts are extracted/classified twice with different rules.** General dates omit space-separated abbreviated-month dates accepted by the payment extractor. The payment classifier independently checks currency tokens after the shared fallback successfully extracted a numeric amount. `paymentClassifier.ts:51–76` treats any available-balance phrase as an account-balance screen before checking explicit transfer status, discarding reference semantics.
4. **Word matches are not field roles.** General financial typing prioritizes debit words over pending, while its success audit treats Paid to as successful status. Pending and a debit/account label can coexist without proving inconsistent settlement. This needs contextual status tests, not another score threshold.
5. **Displayed numbers do not have a common calibrated meaning.** Dedicated risk is a capped weighted rule sum. Homepage risk comes from separate reference-pattern heuristics (`fraudPatternEngine.ts`). Both render /100 values (`PaymentToolLayout.astro:491`, `ToolLayout.astro:338`), but the inspected paths contain no probability calibration. The dedicated report additionally has a fixed confidence 88 for ordinary payment reports and copies riskScore into noiseVarianceScore; neither should be represented as measured confidence/noise. The fixed confidence field is not displayed by the inspected dedicated score renderer. No claim is made that the UI currently prints an explicit probability percentage; the concern is interpretation without method labeling.

## Recommended bounded next change (proposal, not implemented)

**First: honest evidence labels without changing weights or merging scores.** Rename the dedicated score caption to a rule-based indicator and add adjacent visible text stating it is not the probability of fraud, authenticity, or settled payment. Make the same distinction wherever the homepage numeric score is displayed. Replace text-rule typography/icon/alignment claims with exactly what OCR contains and what remains unassessed. Do not describe a missing anomaly as verified visual integrity. This is the smallest presentation change; it leaves numerical behavior alone and does not solve the questionable penalty itself.

Acceptance:
- Paired fixtures differing only by Banking name: never claim measured fonts/layout from text-only inputs
- Both rendered /100 panels explain their own uncalibrated rule-based meaning and independent settlement limit
- General reference absence remains separate from observed amount/reference facts in explanatory copy
- Numeric outputs unchanged by presentation-only work; no assertion that the two tools should yield equal scores
- Existing payment/general suites, rendered-output safety and build checks pass

**Then a separate factual-classification fix:** an explicit transfer with an ancillary available-balance field must not become a pure balance screen. Cover success/pending/failed transfers with balances, pure balance screens, ambiguous mixed screens, and independent primary payment/balance amounts. Preserve uncertainty where the roles cannot be distinguished. This also affects score/proof semantics and deserves its own review.

Broader decisions remain: whether ungrounded visual-rule penalties should be removed; how headline evidence precedence should work; whether numeric/proof-strength presentation should be reduced or replaced. A superficial unified score would hide these differences. Do not retune thresholds to make five fixtures agree.

## Limits and next step

No code implementation is included in this diagnostic batch. Q3 remains open. The released site's exact OCR and display behavior were not rerun; this diagnosis concerns reviewed repository source and controlled text. Existing release safety gates remain. Preserve the reviewed engineering/content artifact version until a separately reviewed change is intentionally included in a PR.
