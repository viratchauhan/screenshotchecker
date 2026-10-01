# Blog publishing

The published blog's single source is `src/data/blogArticles.ts`. The blog index,
article routes and sitemap read those records. The Markdown collection in
`src/content/blog/` is currently an unused draft source: adding a file there does
not publish a page. Do not maintain a second published copy there.

Store `publishedAt` and optional `updatedAt` as `YYYY-MM-DD` calendar dates.
Preserve the original publication date. Set an update date only after a substantive
content change, not a rebuild, formatting fix or attempt to appear fresh. Current
dates preserve the repository's existing records; they are not independently
verified publication history. Visible dates, structured data and sitemap dates
are derived from these fields.

Before publication:

- Give each guide a distinct reader question, accurate title and useful description.
- Check product claims against implemented behavior. Distinguish warning signs from proof.
- Add original examples and relevant primary-source references where useful.
- Keep related article slugs valid and link to the appropriate tool.
- Run `node --import tsx src/lib/analyzer/__tests__/blogSystem.test.ts`.
- Run `npm run build`, then `npm run test:seo` and `npm run test:blog-seo` to check the generated pages.
- Publish only when the owner requests it. Track search performance in Search Console;
  passing these checks does not establish indexing or a ranking increase.

Guidance: [Google's article dates](https://developers.google.com/search/docs/appearance/publication-dates)
and [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

## Review-only articles and figures

A new article may use `publishedAt: null` while its branch is under review. This
renders an explicit pending-publication label and omits publication/modification
dates from schema and sitemap, rather than claiming the test date was a release.
Before an authorized production merge, replace null with the actual publication
calendar date and rerun the build and SEO checks. Do not leave a pending label in
an approved release, backdate it, or generate dates automatically on every build.

For owned worked examples, use an optional section `figure` with a zero-based
`afterParagraph` index, local public asset URL, descriptive `alt`, pixel `width`
and `height`, and visible plain-text `caption`. Store images under an
article-specific `public/images/blog/` directory. Use unchanged bytes when the
article describes the exact inspected file; do not run those files through image
optimization. Section `checklist` items render as a semantic unordered list.
