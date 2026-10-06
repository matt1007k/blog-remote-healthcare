/**
 * Casos de uso de lectura / filtrado / paginación.
 * Funciones puras: reciben datos, no hacen I/O.
 */

import type { BlogPost, PostFilter, PaginatedResult } from '../domain/entities';

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function getPublishedPosts(posts: readonly BlogPost[]): BlogPost[] {
  return posts
    .filter((p: BlogPost) => p.draft === false)
    .sort((a: BlogPost, b: BlogPost) => b.pubDate.getTime() - a.pubDate.getTime());
}

export function filterPostsUseCase(
  posts: readonly BlogPost[],
  filter: PostFilter,
): BlogPost[] {
  const query: string = normalize(filter.query?.trim() ?? '');
  const hasQuery: boolean = query.length > 0;

  return getPublishedPosts(posts).filter((post: BlogPost): boolean => {
    if (filter.category !== undefined && filter.category !== 'todas') {
      if (post.category !== filter.category) return false;
    }
    if (filter.tag !== undefined && filter.tag !== 'todos') {
      if (!post.tags.includes(filter.tag)) return false;
    }
    if (filter.difficulty !== undefined && filter.difficulty !== 'todas') {
      if (post.difficulty !== filter.difficulty) return false;
    }
    if (hasQuery) {
      const haystack: string = normalize(
        `${post.title} ${post.description} ${post.tags.join(' ')} ${post.author.name}`,
      );
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function paginatePostsUseCase<T>(
  items: readonly T[],
  page: number,
  perPage: number,
): PaginatedResult<T> {
  const safePerPage: number = Math.max(1, Math.floor(perPage));
  const total: number = items.length;
  const totalPages: number = Math.max(1, Math.ceil(total / safePerPage));
  const safePage: number = Math.min(Math.max(1, Math.floor(page)), totalPages);
  const start: number = (safePage - 1) * safePerPage;

  return {
    items: items.slice(start, start + safePerPage),
    total,
    page: safePage,
    perPage: safePerPage,
    totalPages,
  };
}
