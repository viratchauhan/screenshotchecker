// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { getAllArticles } from './src/data/blogArticles.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://screenshotchecker.com',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/500'),
      serialize(item) {
        const articles = getAllArticles();
        const matchedArticle = articles.find((a) =>
          item.url === `https://screenshotchecker.com/blog/${a.slug}/` ||
          item.url === `https://screenshotchecker.com/blog/${a.slug}`
        );
        if (matchedArticle) {
          const dateStr = matchedArticle.updatedAt || matchedArticle.publishedAt;
          if (dateStr) {
            item.lastmod = new Date(dateStr).toISOString();
          }
        }
        return item;
      },
    }),
  ],
});


