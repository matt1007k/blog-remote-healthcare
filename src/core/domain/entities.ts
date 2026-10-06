/**
 * CAPA DE DOMINIO — Entidades puras.
 * Sin dependencias de Astro, UI o I/O. Solo tipos.
 */

import type { PostCategory } from '../../content.config';

export type { PostCategory };

export interface Author {
  readonly name: string;
  readonly role?: string;
  readonly avatar?: string;
}

export type Difficulty = 'principiante' | 'intermedio' | 'avanzado';

export interface BlogPost {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly pubDate: Date;
  readonly updatedDate?: Date;
  readonly author: Author;
  readonly category: PostCategory;
  readonly tags: readonly string[];
  readonly heroImage?: string;
  readonly heroAlt?: string;
  readonly draft: boolean;
  readonly featured: boolean;
  readonly difficulty: Difficulty;
  /** Cuerpo Markdown crudo (para cálculo de lectura). */
  readonly body: string;
  /** Minutos estimados (calculados en el caso de uso, no en frontmatter). */
  readonly readingMinutes: number;
}

export interface PostFilter {
  readonly query?: string;
  readonly category?: PostCategory | 'todas';
  readonly tag?: string | 'todos';
  readonly difficulty?: Difficulty | 'todas';
}

export interface PaginatedResult<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly perPage: number;
  readonly totalPages: number;
}

export interface RelatedPostsInput {
  readonly current: BlogPost;
  readonly candidates: readonly BlogPost[];
  readonly limit?: number;
}
