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
