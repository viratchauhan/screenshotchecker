# ScreenshotChecker

**Starting fresh (new computer or new session)? Read `HANDOFF.md` first:** current state, owner rules, how to add a guide, how to deploy, and next steps. Private files (backlink ledger, receipts, outreach kit) are on the owner's Google Drive, not in this public repo.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Owner's incremental improvement workflow

Audience priority: global English-speaking users, especially US/UK; India remains important but is secondary. Follow the revised global-first plan rather than the earlier India-first positioning. Optimize for useful, trustworthy features and measured commercial value; do not assume country CPC establishes publisher revenue.

For the ScreenshotChecker improvement project, read `WORK-QUEUE.md` and `GROWTH-PLAN.md` before implementation. Work on one bounded queue task per owner-requested session, then record verification and stop. Split tasks that expand. Do not automatically execute the backlog or schedule background work. Do not push or deploy to Cloudflare until the owner asks; a Git push may trigger an existing production deployment. These preferences may be overridden by later explicit owner instructions.

## Owner's outreach writing preference

Use short, natural, specific submission copy. Avoid em dashes and decorative slash-separated phrasing in new outreach and user-facing prose. Disclose ownership without inventing personal experience or endorsements. Check `audit/backlink-ledger.local.json` before submissions, and distinguish received submissions from verified published backlinks. The owner reported OSINT Radar already submitted on 6 October 2026; do not submit it again.

## Framework documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
