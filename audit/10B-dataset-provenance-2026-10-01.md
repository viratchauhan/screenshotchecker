# URL dataset provenance documentation check

Date: 1 October 2026. Base: released `35ef3d33bf9a89d4f6484de633a097c868cad475`. Scope: a documentation slice of task 10B, supporting task 15; neither broader task is complete.

Added a [dataset-specific notice](../docs/URL-DATASET-NOTICE.md) and README link. Application code, CSV, shards, manifests, schemas and dependencies are unchanged. No publication or remote mutation was performed during this local verification.

## Evidence and reproduction

- The [historical commit](https://github.com/faizann24/Using-machine-learning-to-detect-malicious-URLs/commit/761b01f7ef0757583e350fa62daf8ac108ca7165) is dated `2017-02-18T12:57:50Z`. Its [tree](https://api.github.com/repos/faizann24/Using-machine-learning-to-detect-malicious-URLs/git/trees/af68c7d9e157b22db1fcd1f1d291f2f583501fdd?recursive=1) records `data/data.csv` as blob `624b62653bf1c1dcee50a3dba774b9711017e03c`, 22,774,334 bytes. No license file appears in that inspected tree.
- The [Kaggle listing](https://www.kaggle.com/datasets/teseract/urldataset) was inspected on 1 October. Dataset Version 1 / 18 May 2018 and the separate CC0 declaration are mirror metadata; acquisition route and mirror byte identity remain unverified.
- Local CSV byte length, SHA-256, Git blob, raw row/label counts, shard counts and URL-label counts agree with the notice. Source/public manifests and all 256 shard pairs are byte-identical.
- In a disposable directory containing a copy of the CSV, the existing builder reproduced both sets of 256 shards byte-for-byte. Rebuilt manifests match the checked manifests except the expected new `generatedAt`. The repository's indexes were not regenerated in place.

Run from the repository root after the normal dependency setup, using the pinned Node 26.9.0 / npm 11.19.1:

```sh
wc -c < src/data/urldata.csv
sha256sum src/data/urldata.csv
git hash-object src/data/urldata.csv
```

Reproduce the builder comparison without rewriting checked-in data:

```sh
root="$PWD"
scratch="$(mktemp -d)"
trap 'rm -rf "$scratch"' EXIT
mkdir -p "$scratch/src/data"
cp src/data/urldata.csv "$scratch/src/data/urldata.csv"
loader="$(node --input-type=module -e 'console.log(import.meta.resolve("tsx"))')"
(cd "$scratch" && node --import "$loader" "$root/scripts/buildUrldataIndex.ts")
for name in src/data/urldataIndex/shard_*.json; do
  base="$(basename "$name")"
  cmp "$name" "public/urldataIndex/$base" || exit 1
  cmp "$name" "$scratch/src/data/urldataIndex/$base" || exit 1
  cmp "$name" "$scratch/public/urldataIndex/$base" || exit 1
done
cat "$scratch/src/data/urldataIndex/manifest.json"
```

The rebuilt manifest reports 420,464 rows (75,643 `bad`, 344,821 `good`) and 406,591 / 143,283 / 116,211 URL / hostname / domain keys. `generatedAt` will differ; it measures index generation only. The older `scripts/auditUrldata.ts` uses different normalization, so its URL counts are not the builder's index counts.

## Verification and remaining limits

- PASS: Node 26.9.0 / npm 11.19.1; `npm run check` passes all 36 test entrypoints and the 33-page build, preserving the merged tutorial and local-link privacy changes. Existing large-bundle warning remains.
- PASS: `npm run test:seo` (zero errors/warnings) and `npm run test:blog-seo` (all eight guides and analyzer/tutorial parity checks).
- PASS: both documented command blocks, separate raw-row/index-label assertions, all local Markdown links in changed files, and `git diff --check`.
- PASS: no diff in `src`, `public`, `scripts`, `package.json` or `package-lock.json` against the base. Dependencies reused from an unchanged-lockfile installation; no clean install or browser QA was needed for this documentation-only slice.

These checks establish reproducibility and documentation consistency, not current label accuracy, full public-suffix coverage, the actual acquisition chain or original licensing permissions. The existing historical-record and no-match disclaimers remain unchanged. Broader source-refresh, runtime-service cleanup and methods-page work remain open.
