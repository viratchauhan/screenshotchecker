// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import trailingSlashLinks from './integrations/trailing-slash-links.mjs';
import { getAllArticles } from './src/data/blogArticles.ts';
import { PAGE_UPDATED_AT } from './src/data/pageDates.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://screenshotchecker.com',
  build: {
    inlineStylesheets: 'always',
  },
  // Content-Security-Policy <meta> on every page. Astro hashes each inline script and style; anything else
  // must come from the hosts below. frame-ancestors and the other header-only directives are in public/_headers.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "connect-src 'self' data: blob: https://cdn.jsdelivr.net https://www.googletagmanager.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://*.g.doubleclick.net https://www.google.com https://www.google.co.in https://*.clarity.ms",
        "img-src 'self' data: blob: https://www.googletagmanager.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://*.g.doubleclick.net https://www.google.com https://www.google.co.in https://*.clarity.ms",
        "font-src 'self' data: https://fonts.gstatic.com",
        "worker-src 'self' blob:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      scriptDirective: {
        resources: [
          "'self'",
          "'wasm-unsafe-eval'",
          'https://cdn.jsdelivr.net',
          'https://www.googletagmanager.com',
          'https://www.clarity.ms',
          'https://scripts.clarity.ms',
        ],
      },
      styleDirective: {
        resources: [
          "'self'",
          'https://fonts.googleapis.com',
          // style="" attributes in markup and in rendered report templates
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    trailingSlashLinks(),
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
            item.lastmod = `${dateStr}T00:00:00.000Z`;
          }
        } else {
          const pageDate = PAGE_UPDATED_AT[new URL(item.url).pathname];
          if (pageDate) item.lastmod = `${pageDate}T00:00:00.000Z`;
        }
        return item;
      },
    }),
  ],
});


