import { getAllArticles, getArticleBySlug, getRelatedArticles } from '../../../data/blogArticles';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runBlogSystemTests() {
  console.log('================================================================');
  console.log('--- RUNNING BLOG & SEO CONTENT SYSTEM UNIT TESTS ---');
  console.log('================================================================\n');

  const articles = getAllArticles();
  assert(articles.length > 0, 'Published articles exist');
  assert(new Set(articles.map(a => a.slug)).size === articles.length, 'Article slugs are unique');

  const requiredSlugs = articles.map(article => article.slug);

  for (const slug of requiredSlugs) {
    console.log(`\n[Testing Article: ${slug}]`);
    const article = getArticleBySlug(slug);
    assert(article !== undefined, `Article "${slug}" exists`);
    if (!article) continue;

    assert(article.title.length > 10, `Title is present: "${article.title}"`);
    assert(article.seoTitle.length > 10, `SEO Title is present: "${article.seoTitle}"`);
    assert(article.metaDescription.length > 25, `Meta description is present: "${article.metaDescription}"`);
    for (const date of [article.publishedAt, article.updatedAt].filter(Boolean) as string[]) {
      assert(/^\d{4}-\d{2}-\d{2}$/.test(date) && new Date(date).toISOString().slice(0, 10) === date, 'Valid ISO calendar date');
      assert(date <= new Date().toISOString().slice(0, 10), 'Publication date is not in the future');
    }
    assert(!article.updatedAt || article.updatedAt >= article.publishedAt, 'Update does not precede publication');
    assert(article.relatedSlugs.every(s => s !== slug && getArticleBySlug(s)), 'Related links resolve to other articles');
    assert(article.readTime.includes('min read'), `Read time formatted properly: "${article.readTime}"`);
    assert(article.contentSections.length >= 3, `Has ${article.contentSections.length} content sections`);
    assert(article.faq.length >= 4, `Has ${article.faq.length} FAQs`);
    assert(article.peopleAlsoSearch.every(query => query.trim().length > 0), 'Optional related search phrases are nonempty when present');
    assert(article.targetKeywords.length >= 4, `Has ${article.targetKeywords.length} target keywords`);

    // Verify key takeaway
    assert(article.keyTakeaway.title.length > 3, `Key takeaway title: "${article.keyTakeaway.title}"`);
    assert(article.keyTakeaway.text.length > 20, `Key takeaway text present`);

    // Verify CTA
    assert(article.cta.label.length > 3, `CTA label: "${article.cta.label}"`);
    assert(article.cta.url.startsWith('/'), `CTA URL is internal: "${article.cta.url}"`);

    // Verify related articles
    const related = getRelatedArticles(slug);
    assert(related.length >= 2, `Has ${related.length} related articles`);
    assert(!related.some((r) => r.slug === slug), `Related articles do not contain current article`);
  }

  // Test unknown slug behavior
  console.log('\n[Testing Unknown Slug]');
  const nonExistent = getArticleBySlug('non-existent-article-xyz');
  assert(nonExistent === undefined, `Unknown slug correctly returns undefined`);

  console.log('\n================================================================');
  console.log('✅ ALL BLOG ARTICLES & SEO CONTENT SYSTEM TESTS PASSED 100%!');
  console.log('================================================================\n');
}

runBlogSystemTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
