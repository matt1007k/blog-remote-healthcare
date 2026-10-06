/**
 * CAPA DE DOMINIO — Contratos (puertos).
 * La infraestructura los implementa; los casos de uso solo dependen de estos.
 */

import type { BlogPost, PostFilter, PaginatedResult } from './entities';

export interface IBlogRepository {
  getAllPosts(): Promise<readonly BlogPost[]>;
  getPostBySlug(slug: string): Promise<BlogPost | null>;
  getAllTags(): Promise<readonly string[]>;
}

export interface ICommentAdapter {
  readonly provider: 'giscus' | 'noop';
  getConfig(): Record<string, string>;
}

export interface FilterPostsParams {
  readonly posts: readonly BlogPost[];
  readonly filter: PostFilter;
}

export interface PaginateParams {
  readonly page: number;
  readonly perPage: number;
}

export type { BlogPost, PostFilter, PaginatedResult };
