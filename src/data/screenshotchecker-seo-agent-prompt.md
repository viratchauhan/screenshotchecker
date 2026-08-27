# AI Agent Prompt: SEO Overhaul for ScreenshotChecker.com

Copy everything below into your AI coding agent (Claude Code, Cursor, etc.) with access to the site's codebase.

---

## CONTEXT

You are working on the codebase for **screenshotchecker.com**, an Astro-based website offering browser-based screenshot/image forensics tools (screenshot analyzer, payment screenshot checker, scam checker, privacy scanner, metadata inspector, OCR, image manipulation forensics, AI image detector, redactor).

Primary competitors: fauxlens.com, truedoc.io, scamdekho.in, scanly.co — these outrank us on nearly every target keyword despite comparable or lesser page depth. Our core gap is technical SEO hygiene and content crawlability, not page breadth.

Goal: implement the following fixes to make this site outrank competitors on target keywords like "screenshot checker," "fake payment screenshot checker," "screenshot forensics," "screenshot authenticity checker."

Work through the tasks below **in order**. For each task, show me the diff/changes before moving to the next, and flag anything you're unsure about rather than guessing.

---

## TASK 1 — Audit & Fix Crawlability of FAQ Content

Find every FAQ / accordion component on the site (homepage and all tool pages). Check whether the answer text is:
- (a) present in the initial server-rendered HTML and only visually hidden via CSS (`display:none` / `max-height:0` etc.), or
- (b) only injected into the DOM on click via client-side JS state.

If (b): refactor so answer text is always present in the SSR/SSG output. Use CSS-only or progressive-enhancement patterns for the collapse/expand interaction, not conditional rendering that withholds the text from the initial HTML.

Add `FAQPage` JSON-LD structured data for every page that has an FAQ section, matching the exact questions/answers rendered on that page.

---

## TASK 2 — Structured Data Audit

Add/verify JSON-LD schema across the site:
- `SoftwareApplication` or `WebApplication` schema on the homepage and each tool page (name, description, applicationCategory, operatingSystem, offers with price 0 if free, aggregateRating if we have real review data — do NOT fabricate ratings)
- `FAQPage` schema (per Task 1)
- `BreadcrumbList` schema on all sub-tool pages
- `Organization` schema site-wide (name, logo, url, sameAs linking to our real social/LinkedIn profiles)

Validate every page against Google's Rich Results Test structure requirements before marking this done.

---

## TASK 3 — Meta Description Rewrite

Current meta descriptions are generic and lead with "what the tool is" rather than "what problem it solves + why choose us." Rewrite meta descriptions for the homepage and every sub-tool page using this formula:

`[User problem/intent] + [what we do about it] + [speed/privacy/free differentiator]`

Example — homepage:
- Before: "Screenshot Checker is an online tool for analyzing screenshots and images for editing signals, visual inconsistencies, metadata, fraud indicators, and other digital evidence."
- After (draft, refine to match actual tone): "Think a screenshot might be faked? Check it in seconds — free, private, 100% in-browser. No uploads, no signup."

Keep each meta description under 160 characters. Do the same rewrite pass for every page's `<title>` tag — ensure each is unique, includes the primary keyword for that page, and is under 60 characters.

---

## TASK 4 — Sitemap & Indexation Audit

1. Confirm `/sitemap.xml` exists, is auto-generated on build, and includes every tool page, blog post, and static page (about, contact, privacy, terms).
2. Confirm `/robots.txt` is not accidentally blocking any of these paths.
3. Add `<link rel="canonical">` tags to every page pointing to its own clean URL (avoid duplicate content from trailing slashes, query params, etc.).
4. Verify every internal page has an `index, follow` meta robots tag unless intentionally noindexed (e.g., thank-you pages).
5. Output a full list of all pages currently in the sitemap so I can manually submit/verify indexation status in Google Search Console.

---

## TASK 5 — Internal Linking Pass

Every tool page should:
- Link to at least 2-3 other relevant tool pages in-context (not just in the footer/nav)
- Link to at least 1 relevant blog post (once blog content exists — see Task 6)

Every blog post should:
- Link to the most relevant tool page(s) with descriptive (not "click here") anchor text
- Link to at least 1-2 other blog posts

Build this internal linking as a reusable Astro component (e.g., `<RelatedLinks>`) rather than one-off hardcoded links, so it's maintainable as we add pages.

---

## TASK 6 — Blog Infrastructure & Content Gap

Audit the current blog: confirm whether it has any published posts, and if so, why they may not be indexed (check Task 4 sitemap inclusion first).

If the blog is empty or thin, scaffold the Astro content collection / MDX setup needed to publish long-form posts efficiently, including:
- A consistent frontmatter schema (title, description, publishDate, updatedDate, targetKeyword, relatedTools array)
- Auto-generated `Article` JSON-LD schema per post
- Auto-population of the `<RelatedLinks>` component based on the `relatedTools` frontmatter field

(Content writing itself is a separate task — this task is just the technical scaffolding so I can start publishing fast.)

---

## TASK 7 — Performance / Core Web Vitals

Our OCR/forensics tools load WASM (Tesseract) and metadata libraries (ExifReader) client-side. Audit whether this is blocking initial page render / hurting LCP:

- Ensure heavy JS (OCR engine, forensics libraries) is lazy-loaded only when the user actually uploads an image, not on initial page load.
- Confirm images (icons, screenshots in blog posts, OG images) are served in modern formats (WebP/AVIF) with proper `width`/`height` attributes to avoid layout shift.
- Run a Lighthouse audit on the homepage and one tool page; report LCP, CLS, and INP scores before/after your changes.

---

## TASK 8 — Verification Pass

After completing Tasks 1-7:
1. Run Google's Rich Results Test on the homepage and 2 sub-tool pages — confirm no errors.
2. Run Lighthouse on the homepage and 2 sub-tool pages — report scores.
3. Confirm sitemap.xml is valid XML and reachable at the expected URL.
4. Give me a summary table: page | title tag | meta description | schema types present | canonical URL — so I can spot-check everything at once.

---

## CONSTRAINTS

- Do not fabricate review counts, ratings, or testimonials in structured data — only mark up content that actually exists on the page.
- Do not change the tool functionality (OCR, ELA, redaction, etc.) — this is SEO/technical only.
- Preserve the "100% client-side / zero server storage" privacy messaging — it's our core differentiator, make it more prominent in schema and meta tags, not less.
- Flag any task you can't complete (e.g., no access to Search Console, no CMS access for blog) instead of skipping silently.
