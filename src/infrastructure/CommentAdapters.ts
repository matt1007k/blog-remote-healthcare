/**
 * INFRAESTRUCTURA — Adapter de comentarios intercambiable.
 * Para cambiar de proveedor, implementa ICommentAdapter y sustituye
 * la exportación en el componente <Comments />. Sin tocar dominio ni UI.
 */

import type { ICommentAdapter } from '../core/domain/repositories';

export interface GiscusConfig {
  readonly repo: string;
  readonly repoId: string;
  readonly category: string;
  readonly categoryId: string;
}

/** Adapter Giscus (GitHub Discussions). Lazy-load en cliente. */
export class GiscusCommentAdapter implements ICommentAdapter {
  readonly provider = 'giscus' as const;
  private readonly config: GiscusConfig;

  constructor(config: GiscusConfig) {
    this.config = config;
  }

  getConfig(): Record<string, string> {
    return {
      'data-repo': this.config.repo,
      'data-repo-id': this.config.repoId,
      'data-category': this.config.category,
      'data-category-id': this.config.categoryId,
      'data-mapping': 'pathname',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'top',
      'data-lang': 'es',
      'data-loading': 'lazy',
    };
  }
}

/** Adapter nulo: desactiva comentarios sin romper la UI (útil en dev/tests). */
export class NoopCommentAdapter implements ICommentAdapter {
  readonly provider = 'noop' as const;
  getConfig(): Record<string, string> {
    return {};
  }
}

/** Factory: lee de env o cae a noop. Cambia aquí el proveedor global. */
export function createCommentAdapter(): ICommentAdapter {
  const repo: string | undefined = import.meta.env.PUBLIC_GISCUS_REPO;
  const repoId: string | undefined = import.meta.env.PUBLIC_GISCUS_REPO_ID;
  const category: string | undefined = import.meta.env.PUBLIC_GISCUS_CATEGORY;
  const categoryId: string | undefined = import.meta.env.PUBLIC_GISCUS_CATEGORY_ID;

  if (repo && repoId && category && categoryId) {
    return new GiscusCommentAdapter({ repo, repoId, category, categoryId });
  }
  return new NoopCommentAdapter();
}
