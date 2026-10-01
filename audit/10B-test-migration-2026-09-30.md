# Task 10B — bounded legacy test migration

Checkpoint: 30 September 2026 (Asia/Kolkata). Owner: Virat Chauhan. Status: independently reviewed local test maintenance; not released. This is a bounded slice of existing task 10B. Base checkpoint: `c380b2b`; reviewed test commit: `79f77ee`. No production source was changed in this slice. Next action: release review of cumulative changes; broader dataset/service cleanup remains open.

## Architecture evidence and migration

The old `linkChecker.test.ts` imported `service.inspectUrl`, which fails because `normalizeUrlComponents` no longer exists and other old provider-service types are gone. Source search found no runtime caller of `inspectUrl`; its only importer was the obsolete test. Actual browser workspace imports `client.checkLink`, while `worker.ts` imports `localDatasetService`.

The entrypoint now tests the current browser client with deterministic synthetic shards and mocked API results. Existing 20 local-dataset tests retain their real checked-in dataset assertions and now forbid any fetch attempts. No provider or suspicious destination was contacted.

Behavioral migration map:
- Legacy brand heuristic score -> actual destination hostname/registrable domain, no brand substring confusion
- Legacy raw-IP score -> normalized IP identity, strict direct SSRF guard unit checks
- Legacy punycode display -> Unicode/punycode hostname equivalence
- Legacy userinfo score -> authority resolution uses actual destination host
- Legacy APK score -> executable path preserved, without unsupported malware verdict
- Legacy LOW_RISK assertion -> synthetic dataset GOOD record with explicit safety limitation
- Legacy SSRF loop -> direct assertions; assertion failures can no longer be swallowed by the old catch block
- Added current behavior: exact URL precedence, hostname/domain matching, conflicts, unknown-data limitations, invalid-input no-fetch, actual UI static fallback, multi-URL input and successful API envelope

The obsolete service remains broken and was not repaired or deleted. Its unused brand/IP/APK heuristic scoring assertions were intentionally retired rather than silently bypassed. A green suite does not demonstrate live reputation detection, current dataset accuracy, or complete SSRF protection. The current local verifier does not visit submitted destinations.

## Verification

- New client regression entrypoint: PASS; every API/shard request mocked, unexpected destination/provider requests asserted absent
- Existing local-dataset tests: 20/20 PASS, zero attempted fetches
- Full `npm run check`: PASS, 28/28 discovered entrypoints and 32-page build
- SEO validation: PASS
- Blog SEO validation: PASS
- Independent reviewer verified architecture/migration and reran focused tests plus aggregate check
- Diff and working tree checks clean

Runtime remains Node 24.19.0/npm 11.9.0, not exact pinned versions. No app/runtime/network/security settings were changed. Test success does not resolve known dataset-unavailability reporting, public-suffix coverage, data provenance, stale runtime heuristics, preview/image workflow acceptance or production release gates. No push, PR, deployment or purchase occurred.
