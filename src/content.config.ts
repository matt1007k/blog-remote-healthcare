import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content Layer API (Astro v5).
 * Ubicación canónica: src/content.config.ts
 */

export const POST_CATEGORIES = [
  'ergonomia',
  'salud-postural',
  'rsi',
  'trabajo-remoto',
  'pausas-activas',
  'equipamiento',
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(10).max(120),
    description: z.string().min(40).max(200),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.object({
      name: z.string(),
      role: z.string().optional(),
      avatar: z.string().optional(),
    }),
    category: z.enum(POST_CATEGORIES),
    tags: z.array(z.string().min(2).max(30)).min(1).max(8).default([]),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    difficulty: z.enum(['principiante', 'intermedio', 'avanzado']).default('principiante'),
    readingMinutesOverride: z.number().int().positive().optional(),
  }),
});

export const collections = { blog };
