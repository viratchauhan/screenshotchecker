import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    targetKeyword: z.string().optional(),
    relatedTools: z.array(z.string()).default([]),
    category: z.string().default('Security'),
    author: z.string().default('ScreenshotChecker Research Team'),
  }),
});

export const collections = { blog };
