# ScreenshotChecker: product and growth plan

Prepared 22 September 2026. Based on the repository/live-site audit in `audit/PROJECT-AUDIT.md` and a focused public research pass. Execution queue: `WORK-QUEUE.md`.

**Goal and working agreement**

Aim for 10,000 qualified visits (sessions) in a rolling 30-day period, while making the product trustworthy enough to earn repeat use and recommendations. This is a target, not a traffic forecast or promise of virality. Current traffic, indexing, geography, and search demand have not been verified from account data.

Work in small sessions. This planning session is Task 00. Subsequent sessions complete one bounded task and stop. Do not run the entire backlog, spawn agents, create active background jobs, or deploy automatically. No exact allowance savings can be promised: usage depends on the work and tooling. Large work must be split before starting.

Cloudflare Workers remains the hosting platform. Production deployment happens only when the owner explicitly asks. Prepare and test changes locally beforehand, then verify the deployment and its key user flows when authorized.

**Positioning hypothesis**

“Understand the screenshot. Protect what you share.”

Three clear entry points:

1. **Inspect a suspicious screenshot:** extract the claim, identify concrete warning signs, distinguish observations from uncertainty, and explain the next independent verification step.
2. **Make a screenshot safe to share:** locate sensitive details, let the user review them, apply solid redactions, strip metadata, and validate the exported copy.
3. **Learn to spot an edit:** a short challenge using our own labeled synthetic examples, followed by an explanation and an optional score card.

Owner-confirmed audience, revised 22 September 2026: global English-speaking users, with the US and UK as primary acquisition markets. Canada and Australia are secondary expansion hypotheses; India remains important through the existing UPI/payment tools. This replaces the earlier India-first direction. Validate specific acquisition opportunities using Search Console/Analytics evidence. Existing tools stay available; prominence is based on usefulness and demand, not the number of routes. Owner-confirmed cadence remains one small task whenever the owner says “continue”; no automatic daily execution or reminders.

**Global-first product and commercial strategy — revision 2**

Build a private screenshot safety workspace for consumers, freelancers, creators, support teams, and online sellers. Lead with reliable redaction and understandable scam evidence. These serve repeated global needs; payment screenshot inspection becomes one workflow within the product, not the homepage's dominant identity.

Market priority is a product/distribution choice, not a verified country CPC ranking. We have no site-specific ad revenue, keyword-volume, or country RPM data. Optimize for qualified visits, successful tasks, return use, and eventually revenue per 1,000 sessions; do not use advertiser keyword CPC as a forecast of publisher earnings. [Google AdSense's earnings guidance](https://support.google.com/adsense/answer/16906816?hl=en) distinguishes impression-paid AdSense for Content from click-paid AdSense for Search.

Public evidence supports researching US/UK scam workflows: the [FTC's 2026 release](https://www.ftc.gov/news-events/news/press-releases/2026/04/new-ftc-data-show-people-have-lost-billions-social-media-scams) reports substantial 2025 social-media scam losses, while [Ofcom](https://www.ofcom.org.uk/phones-and-broadband/scam-calls-and-messages/new-rules-to-protect-people-and--businesses-against-mobile-messaging-scams) reports that half of UK mobile users surveyed received a suspicious text/iMessage between November 2024 and February 2025. This demonstrates a problem, not demand for our particular tool or guaranteed search traffic.

| Feature priority | Specific outcome | Minimum quality gate |
| --- | --- | --- |
| 1. Private screenshot redactor | Suggest emails, phones, account details and supported sensitive identifiers; users review boxes, apply solid masks, strip metadata and inspect the export | No automatic “safe to share” guarantee; boxes tested against real rendered text; reviewable suggestions, touch/keyboard support and original-image preservation |
| 2. Scam screenshot explainer | Accept screenshot or pasted message; explain the claim, requested action, suspicious evidence and uncertainty in plain English | US/UK benign and suspicious examples; no claim of sender verification; text-only mode remains useful when OCR fails |
| 3. Evidence-linked report | Highlight the exact relevant words/regions and show which checks ran, failed or lacked evidence | Every highlighted conclusion is traceable; missing coordinates are explicit; no invented AI probabilities |
| 4. Payment-proof review across markets | Handle USD/GBP/INR and supported PayPal, Venmo, Cash App, Zelle, UK bank-transfer and UPI receipt examples | Provider-specific fields are researched and tested; no universal 12-digit UTR rule; no claim that the image confirms settlement |
| 5. Clean OCR workflow | Crop/rotate, correct extracted text, copy/download, and hand off to redaction | Coordinate correctness and explicit user-edited text; no silent alteration of original evidence |
| 6. Screenshot comparison | Show changed text/amounts and visual regions for before/after images | Clearly distinguish resizing/compression/layout changes from semantic edits |
| 7. Shareable educational challenge | Short US/UK-relevant synthetic scam/edit quizzes with explanations and optional score-only sharing | Original examples, accessible play, no personal screenshots in share payloads |
| 8. Local batch workspace | Process multiple screenshots, apply reviewable redactions, export sanitized files | Only after single-file reliability and demonstrated demand; bounded memory, per-file review and no silent partial success |

Scam coverage candidates: US delivery/toll alerts, account warnings, marketplace-payment claims and job offers; UK parcel/redelivery, bank impersonation, tax-refund and marketplace messages. Official-looking branding, a region code, or a mention of a payment provider is never sufficient evidence of fraud. Include legitimate messages with urgency, links and payment amounts as counterexamples. Verify provider/agency guidance from current primary sources during implementation.

US/UK localization is more than spelling: test +1/+44 phone formats, ambiguous dates, USD/GBP amounts, address formats and differing financial reference formats. Offer explicit region context (including “not sure”) when useful rather than silently assuming location from an IP address. No forced geo-redirects. Keep a global `.com` and common English pages; add regional pages only for genuinely different useful content. Do not duplicate every tool under `/us/` and `/uk/`.

**Global acquisition and monetization experiments**

- First improve existing privacy/redactor and scam-checker pages for global intent; then build original US and UK worked-example guides. Retain the Indian UPI guide as an important secondary cluster.
- Validate candidate queries such as “redact screenshot online,” “hide personal information in screenshot,” “is this text message a scam,” “check screenshot for scam,” and “compare screenshot text.” Query lists are hypotheses, not claims of high volume or low competition.
- Match each query cluster to a distinct user job. Prioritize tool improvements over separate thin pages for each delivery carrier, bank or payment app.
- Target education-oriented demonstrations for creators, small businesses, consumer-safety communities and support/developer teams. No country traffic buying, misleading trust badges, or indiscriminate outreach.
- Measure country-level engaged sessions, successful exports/checks and repeat use alongside total traffic. Set a US/UK acquisition-share target only after baseline data; do not suppress useful visitors from elsewhere.
- **Monetization experiment 1:** consider contextual/display ads on public guides after content and usability are strong. Keep third-party ad scripts off the image-processing workspace, where scripts could access sensitive DOM content. Review network behavior and any applicable consent requirements before implementation.
- **Monetization experiment 2:** if repeat-use demand exists, validate an optional paid batch workflow or professional report export. Do not build billing or accounts until willingness to pay is evidenced; retain useful free single-image tools.
- **Monetization experiment 3:** evaluate clearly disclosed relevant sponsorships only if they fit the product. Verdicts must never depend on referral payments. Do not steer worried users toward unrelated high-CPC products.
- Revenue planning must use observed pageviews/session and page RPM: monthly display revenue = monetized pageviews / 1,000 × observed page RPM. No credible revenue figure can be assigned to 10K visits without these inputs. Record infrastructure/model cost as well as gross revenue.

Global launch order after core repairs: evidence-linked scam report and private redaction → US/UK examples and source-backed methods → payment-format expansion → comparison/challenge → demand-led batch or offline capability. Use source-backed heuristics first; evaluate a real local model against held-out examples later instead of promising broad AI detection.

**Research findings and limits**

| Observed source | What it establishes | Implication |
| --- | --- | --- |
| [Toolsda payment checker](https://toolsda.com/tools/fake-payment-screenshot-checker) | A competing page already markets browser-based UPI OCR, sample receipts, checks, and verification guidance. These are competitor claims, not independently validated accuracy. | “Private + free + UPI” alone is not a differentiator. Our explanations, false-positive handling, mobile experience, and measurable reliability must be better. |
| [CheckReal screenshot detector](https://checkreal.ai/screenshot-detector) | Another product targets screenshot/payment-proof verification. | Broad “fake screenshot detector” positioning is already occupied. Focus on specific user outcomes rather than generic AI claims. |
| [OnlinesTool redactor](https://onlinestool.com/image-redactor) | Search results surface private in-browser manual redaction as an established offering; its implementation was not audited. | Differentiate through reliable suggested redactions, export review, and a smooth inspect-to-redact workflow. |
| [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features) | Established technical SEO and helpful, reliable content remain relevant to AI search appearances. | Build useful crawlable tools and original explanations; do not spend sessions inventing special AI-search markup. |
| [Google people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) | Original value and trustworthy explanations matter more than search-engine-first content. | Publish worked examples and a methods page; avoid mass-generated near-duplicate landing pages. |
| [Cloudflare Workers static assets](https://developers.cloudflare.com/workers/static-assets/) | Workers supports static assets and optional application logic. | Preserve the current lightweight deployment. Add backend services only when a defined feature actually requires them. |

This is directional competitor/intent research, not keyword-volume or ranking-difficulty research. No paid keyword dataset was accessed. We do not know competitor traffic. Search results are a snapshot and cannot establish market share.

**Future product direction, with gates**

- **Evidence cards:** every conclusion shows its source (OCR, metadata, pixel check, historical URL dataset), whether the check ran, and what it cannot establish. Avoid uncalibrated “percent authentic” scores.
- **Reviewable privacy workflow:** inspect, select what to hide, preview the output, and export. Local processing must match the wording. No original image, OCR text, URL, or transaction details in analytics.
- **Shareable learning challenge:** original image pairs with known edits; answers explain the evidence. Results reflect quiz performance, not certification of an uploaded image. Reuse existing comparison/game code after review.
- **Optional on-device model research:** only after a held-out evaluation set and performance baseline exist. Compare against the current heuristic baseline; ship only if the improvement justifies download size, browser constraints, and maintenance. Never call regex rules a vision-language model.
- **Offline mode/PWA:** later, after verifying model/resource caching, update behavior, memory use, and clear storage controls. A manifest alone is not offline support.
- **Multilingual experience:** start with one fully translated priority flow if demand supports it. Separate UI language, OCR language, and analysis-language coverage. Indexable language pages come after complete translations.

Do not add accounts, subscriptions, a database, paid AI APIs, a browser extension, or a major redesign in the first cycle. Each needs demonstrated demand.

**Search opportunity map — hypotheses to validate**

| Intent cluster | Existing destination | First useful improvement | Validation |
| --- | --- | --- | --- |
| scam screenshot checker, suspicious text message screenshot | `/screenshot-scam-checker/` | Plain-English evidence, screenshot or pasted-text input, US/UK worked examples | US/UK query impressions, completed checks, error rate |
| fake payment screenshot, payment proof review; UPI secondary | `/payment-screenshot-checker/` and existing UPI guide | Region/provider-aware extraction, explicit verification limits, original USD/GBP/INR examples | Country/query impressions, tool starts, completed checks |
| screenshot redactor, hide personal information in screenshot | `/screenshot-redactor/`, `/screenshot-privacy-checker/` | Working automatic boxes, touch support, safe exports; clarify distinct purposes | Completed exports, return visits, relevant search clicks |
| screenshot to text, private screenshot OCR | `/screenshot-ocr/` | Accurate extraction, crop/rotate or language improvements only if needed | OCR success and copy/export rate |
| compare two screenshots, screenshot differences | `/screenshot-comparison/` | Reliable visual diff and a separate educational challenge | Completion, challenge referrals, useful return traffic |
| screenshot authenticity, edited screenshot | Home and `/screenshot-analyzer/` | Explain evidence and uncertainty; define distinct page roles | Query-to-page fit and index coverage |
| metadata removal, screenshot EXIF | Existing metadata pages | Clear inspect-versus-remove workflows and verified clean outputs | Tool completion and relevant search impressions |

Do not create separate PhonePe/GPay/Paytm pages just to repeat the same tool. Add them only if distinct supported behavior, original examples, and measured demand justify their own pages. Rework existing content before increasing page count.

**Distribution and sharing experiments**

1. **Spot-the-edit challenge:** a small, replayable original example set; score image with a link back, no user-uploaded content. Measure challenge completion and attributable referral visits.
2. **Original before/after demonstration:** show hidden metadata and safe redaction using synthetic examples. Prepare short videos/images and an explanatory article from the same work.
3. **Consumer and seller checklists:** US/UK-oriented suspicious-message and payment-proof checklists, plus an Indian UPI version where genuinely different. Research factual guidance using primary provider/government sources at writing time.
4. **Relevant community demonstrations:** prepare useful posts for merchant, privacy, developer, and creator communities. Owner approval is required before any external posting or outreach; no spam, bought backlinks, or invented endorsements.
5. **Useful linking:** offer original educational material that legitimate publishers may choose to cite. Track real referral engagement instead of counting backlinks alone.

No public sharing of uploaded screenshots, original OCR, bank identifiers, or private reports by default. Share actions must show exactly what will leave the device. Do not add automatic watermarks to users' redacted exports.

**Traffic model and measurement**

The following is scenario math, not an estimate of available search demand:

- 6,000 monthly organic sessions.
- 2,500 social/community/referral sessions.
- 1,500 direct and other sessions.
- Total: 10,000 sessions, approximately 333 per day over 30 days.

For illustration, 200,000 relevant monthly search impressions at 3% CTR would produce 6,000 search clicks; clicks and analytics sessions are different measurements and will not match exactly. Validate the required demand before using this scenario as a forecast. Measure returning-user rate separately; do not add returning users to channel totals and double-count them.

Baseline request for Task 06: last 28/90 days of sessions/users/top pages/source-country-device mix, Search Console clicks/impressions/queries/indexing, and the existing Cloudflare deployment mechanism. Screenshots or exports may substitute for account access. Missing access must not block independent reliability tasks.

Useful events, subject to the chosen privacy approach: `tool_started`, `tool_completed`, `tool_failed`, `export_completed`, `challenge_completed`, and `share_clicked`. Only fixed tool IDs, coarse duration buckets, safe error codes, and coarse file-size buckets; never filenames, images, raw text, full checked URLs, account numbers, or report payloads. Publish the data policy before enabling new tracking.

Primary quality metric: successful completion of the user's chosen task. Supporting metrics: analysis failure rate, time to result, export rate, mobile completion, search CTR by query/page, referral engagement, and returning-user rate. Define success-rate denominators and filter our own test activity.

**Milestones and decision points**

| Milestone | Gate |
| --- | --- |
| Baseline | Establish actual traffic and indexing; no invented starting point |
| Reliable foundation | Critical rendering paths safe, regression suite working, redaction/export verified, claims/privacy corrected |
| First release candidate | Changed flows pass desktop/mobile checks, build passes, dependency findings reviewed; deployment awaits owner request |
| Search improvement cycle | Improve priority existing pages and methods content; compare at least 28 days after deployment where volume allows |
| First sharing experiment | Owned/synthetic examples only; challenge outcome and share preview verified |
| 1K, 3K, 10K monthly visits | Growth checkpoints rather than promised dates; require acceptable task completion alongside traffic |

Use roughly 90 days as an initial experiment-and-review window, not a deadline for 10K visits. Search growth may take longer. With limited data, state uncertainty; do not claim statistical significance from a few conversions. Every five completed tasks, review priorities before starting the next batch.

**Cloudflare release procedure — owner-triggered**

1. Confirm the intended changes, existing branch/automatic build behavior, Cloudflare account, Worker name, domain mapping, and last successful release. Never expose tokens in files or logs.
2. Run affected tests, production build, and relevant SEO checks. Separate existing known failures from new regressions; high-impact unresolved defects block release.
3. Prepare a preview/staging deployment only when publishing is authorized; avoid indexing preview URLs and avoid duplicate analytics.
4. On an explicit deployment request, deploy the reviewed revision to the confirmed Cloudflare target. Do not assume a Git push is harmless: it may trigger production auto-deployment.
5. Verify home, changed tool paths, real missing-page status, sitemaps, assets, OCR/redaction as relevant, and network/privacy behavior.
6. Record revision, deployment/version identifier, URL, test results, and rollback reference. Revert the release if a material regression is confirmed.

The current repository's `src/worker.ts` is not active merely because hosting uses Cloudflare Workers. The assets-only configuration is valid for the present static site. The audit's API/asset-path problems must be addressed before intentionally activating backend routes.
