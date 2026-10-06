/**
 * INFRAESTRUCTURA — Repositorio Content Layer.
 * Único punto que conoce `astro:content`. Adapta Entry → entidad de dominio.
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import { estimateReadingTime } from '../core/use-cases/EstimateReadingTime';
import type { BlogPost } from '../core/domain/entities';
import type { IBlogRepository } from '../core/domain/repositories';

type BlogEntry = CollectionEntry<'blog'>;

function toDomain(entry: BlogEntry): BlogPost {
  const readingMinutes: number =
    entry.data.readingMinutesOverride ?? estimateReadingTime(entry.body ?? '');

  return {
    slug: entry.id.replace(/\.md$/, ''),
    title: entry.data.title,
    description: entry.data.description,
    pubDate: entry.data.pubDate,
    updatedDate: entry.data.updatedDate,
    author: {
      name: entry.data.author.name,
      role: entry.data.author.role,
      avatar: entry.data.author.avatar,
    },
    category: entry.data.category,
    tags: [...entry.data.tags],
    heroImage: entry.data.heroImage,
    heroAlt: entry.data.heroAlt,
    draft: entry.data.draft,
    featured: entry.data.featured,
    difficulty: entry.data.difficulty,
    body: entry.body ?? '',
    readingMinutes,
  };
}

export class AstroContentBlogRepository implements IBlogRepository {
  async getAllPosts(): Promise<readonly BlogPost[]> {
    const entries: BlogEntry[] = await getCollection('blog');
    return entries.map(toDomain);
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const entries: BlogEntry[] = await getCollection('blog');
    const found: BlogEntry | undefined = entries.find(
      (e: BlogEntry) => e.id.replace(/\.md$/, '') === slug,
    );
    return found ? toDomain(found) : null;
  }

  async getAllTags(): Promise<readonly string[]> {
    const posts: readonly BlogPost[] = await this.getAllPosts();
    const set = new Set<string>();
    for (const post of posts) {
      if (post.draft) continue;
      for (const tag of post.tags) set.add(tag);
    }
    return [...set].sort((a: string, b: string) => a.localeCompare(b, 'es'));
  }
}
