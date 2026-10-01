# URL dataset notice

Verified 1 October 2026 against ScreenshotChecker revision `35ef3d33bf9a89d4f6484de633a097c868cad475`. This notice covers only `src/data/urldata.csv` and its derived `src/data/urldataIndex` and `public/urldataIndex` files.

## Historical-copy evidence

The checked CSV has the same Git blob identity and byte length as `data/data.csv` in [this public commit dated 18 February 2017](https://github.com/faizann24/Using-machine-learning-to-detect-malicious-URLs/commit/761b01f7ef0757583e350fa62daf8ac108ca7165), in `faizann24/Using-machine-learning-to-detect-malicious-URLs`:

- Bytes: `22774334`
- Git blob: `624b62653bf1c1dcee50a3dba774b9711017e03c`
- SHA-256 of the checked CSV: `3243f054f5205e352f7a9adc2d7b993d516acd4ad17cb032b91c989138e34808`

This establishes an identical historical public copy by that date. It does not establish ScreenshotChecker's acquisition source, the original creator, collection dates, or when individual labels were observed or last validated.

## Contents and interpretation

| Measure | Verified count |
| --- | ---: |
| CSV records, excluding the header | 420,464 |
| Raw labels: `bad` / `good` | 75,643 / 344,821 |
| Normalized URL keys | 406,591 |
| URL-key labels: `bad` / `good` / `conflict` | 61,791 / 344,798 / 2 |
| Hostname keys | 143,283 |
| Domain keys under the current resolver | 116,211 |

Counts describe this corpus, not 420,464 distinct threats, domains or currently checked websites. URL, hostname and domain counts depend on the current builder's normalization; domain grouping uses a hand-maintained suffix subset, not a complete Public Suffix List. Mixed labels for one key produce `conflict`. All 256 source/public shard pairs match, and the existing builder reproduces their bytes.

Labels are historical classifications. A `good` match is not a present-day safety certification; a `bad` match does not prove the destination remains harmful. No match means absence from the required lookup tiers, not safety. Missing required index data is a separate unavailable result. Existing public wording already describes historical records and the no-match limitation.

## Index generation is not source freshness

Both checked manifests contain `generatedAt: 2026-08-30T07:47:53.417Z` and `version: 2026.08`. [`scripts/buildUrldataIndex.ts`](../scripts/buildUrldataIndex.ts) reads the existing local CSV, regenerates shards, sets `generatedAt` to the build time and writes the hardcoded version. These fields do not date collection, acquisition, new observations or refreshed labels. Rebuilding the index does not fetch or relabel source records.

## License evidence and unresolved provenance

The [Kaggle “Url Dataset” listing](https://www.kaggle.com/datasets/teseract/urldataset) is a plausible mirror. Its page declares [CC0: Public Domain](https://creativecommons.org/publicdomain/zero/1.0/) separately from its dataset metadata: Version 1, updated 18 May 2018. The visible filename, size and initial records match, but byte identity with Kaggle was not verified. Its provenance fields supply no source, collection methodology or citation; its update frequency is unspecified.

The inspected 2017 GitHub tree contains no license file. Neither that historical-copy match nor the mirror's license declaration establishes the original rights chain or the terms under which ScreenshotChecker acquired this CSV. The project's MIT license does not relicense third-party data. This is an unresolved provenance gap, not a finding of a licensing breach.

Still unknown: the actual acquisition source/version/date, original rights holder(s) and permission chain, collection and label-observation dates/methodology, and any source-refresh procedure or schedule. Before a future dataset replacement or refresh, record those details with the acquired bytes' checksum and applicable license evidence; do not infer freshness from an index build.

See the [verification record](../audit/10B-dataset-provenance-2026-10-01.md) for reproduction commands and scope. No dataset, index, classifier or update mechanism was changed for this notice.
