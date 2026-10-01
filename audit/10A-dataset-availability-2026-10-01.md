# Task 10A — explicit dataset-unavailable results

Date: 1 October 2026 (Asia/Kolkata). Owner: Virat Chauhan. Status: locally implemented and independently reviewed, not deployed. Base: `5813fa5`; reviewed code: `bf1fff2`. Bounded slice of existing task 10A; public-suffix/normalization work remains open.

## Reproduced defect and scope

With every shard fetch mocked to HTTP 503, the browser previously returned NO_LOCAL_MATCH and claimed the submitted URL was not found. Missing higher-priority lookup data could also fall through to a broader record. The failing-before regression is retained in execution logs.

Client and local service now return DATASET_UNAVAILABLE when a required lookup tier cannot load valid data. Missing exact/hostname records cannot be bypassed by a lower-priority GOOD label. Shared shape/label validation rejects malformed shard responses before caching. Own-key lookup avoids treating inherited object properties as records. Failed loads remain uncached so retry can recover. The UI shows an explicit unavailable warning rather than the no-match checkmark. Healthy empty shards still produce NO_LOCAL_MATCH with existing uncertainty language; known matches retain current precedence.

This does not change network destinations, API access, credentials, dataset labels, retention, analytics, or any security settings. No submitted destination or external reputation provider was visited.

## Verification

- Baseline failing regression: expected DATASET_UNAVAILABLE, actual NO_LOCAL_MATCH under HTTP 503
- 20 mocked client/service cases PASS: HTTP/network/JSON/schema/invalid-label errors, missing exact/hostname/domain tiers, recovery and known matches
- Full aggregate `npm run check`: PASS, 29/29 entrypoints plus 32-page build
- SEO and blog SEO: PASS
- All 256 source shards and 256 public shards accepted by validator
- Independent review accepted `bf1fff2`, reran focused and aggregate checks, and validated real shard compatibility

## Remaining limits and release gates

Tests exercise Node service fallback fetching with mocks, not a deployed Cloudflare ASSETS integration. UI was reviewed in source; no browser assertion for the new unavailable flow has been completed here. Exact pinned runtime is not tested (actual Node 24.19.0/npm 11.9.0). Cache freshness/provenance, public-suffix coverage and other known product limitations remain out of scope. Q3 general/payment score consistency is unchanged. No accuracy or security certification is implied.

This checkpoint does not authorize a push or deployment. Parent coordinates any authorized draft PR and release, verifies trigger behavior and includes this descendant deliberately. Existing production-version/rollback and preview/image/network acceptance gates remain applicable.
