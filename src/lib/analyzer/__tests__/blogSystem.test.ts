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
  assert(articles.length === 6, `Expected 6 articles, got ${articles.length}`);

  const requiredSlugs = [
    'screenshot-checker-online',
    'screenshot-analyzer-online',
    'fake-upi-payment-screenshot',
    'ai-image-detector-online',
    'exif-metadata',
    'smishing-fake-sms',
  ];

  for (const slug of requiredSlugs) {
    console.log(`\n[Testing Article: ${slug}]`);
    const article = getArticleBySlug(slug);
    assert(article !== undefined, `Article "${slug}" exists`);
    if (!article) continue;

    assert(article.title.length > 10, `Title is present: "${article.title}"`);
    assert(article.seoTitle.length > 10, `SEO Title is present: "${article.seoTitle}"`);
    assert(article.metaDescription.length > 25, `Meta description is present: "${article.metaDescription}"`);
    assert(article.publishedAt === 'August 22, 2026', `Published date is August 22, 2026`);
    assert(article.readTime.includes('min read'), `Read time formatted properly: "${article.readTime}"`);
    assert(article.contentSections.length >= 3, `Has ${article.contentSections.length} content sections`);
    assert(article.faq.length >= 4, `Has ${article.faq.length} FAQs`);
    assert(article.peopleAlsoSearch.length >= 4, `Has ${article.peopleAlsoSearch.length} People Also Search For queries`);
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
  console.log('✅ ALL 6 BLOG ARTICLES & SEO CONTENT SYSTEM TESTS PASSED 100%!');
  console.log('================================================================\n');
}

runBlogSystemTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
