/**
 * GetRelatedPostsUseCase — devuelve EXACTAMENTE `limit` (por defecto 2)
 * posts relacionados, excluyendo el actual.
 *
 * Scoring (determinista y explicable):
 *  +3 por misma categoría
 *  +2 por cada tag compartido
 *  +1 si comparte nivel de dificultad
 *  Desempate: fecha más reciente.
 *
 * Si no hay suficientes con score > 0, rellena con los más recientes
 * (nunca devuelve el post actual ni duplicados).
 */

import type { BlogPost } from '../domain/entities';

interface Scored {
  readonly post: BlogPost;
  readonly score: number;
}

function scoreCandidate(current: BlogPost, candidate: BlogPost): number {
  let score = 0;
  if (candidate.category === current.category) score += 3;

  const currentTags: ReadonlySet<string> = new Set(current.tags.map((t: string) => t.toLowerCase()));
  for (const tag of candidate.tags) {
    if (currentTags.has(tag.toLowerCase())) score += 2;
  }
  if (candidate.difficulty === current.difficulty) score += 1;
  return score;
}

export function getRelatedPostsUseCase(
  current: BlogPost,
  candidates: readonly BlogPost[],
  limit: number = 2,
): BlogPost[] {
  const pool: BlogPost[] = candidates.filter(
    (p: BlogPost) => p.slug !== current.slug && p.draft === false,
  );

  const scored: Scored[] = pool
    .map((post: BlogPost): Scored => ({ post, score: scoreCandidate(current, post) }))
    .sort((a: Scored, b: Scored): number => {
      if (b.score !== a.score) return b.score - a.score;
      return b.post.pubDate.getTime() - a.post.pubDate.getTime();
    });

  const picked: BlogPost[] = [];
  const pickedSlugs: Set<string> = new Set();

  for (const s of scored) {
    if (picked.length >= limit) break;
    if (s.score <= 0) continue;
    picked.push(s.post);
    pickedSlugs.add(s.post.slug);
  }

  // Relleno determinista con los más recientes si faltan.
  if (picked.length < limit) {
    const byDate: BlogPost[] = [...pool].sort(
      (a: BlogPost, b: BlogPost) => b.pubDate.getTime() - a.pubDate.getTime(),
    );
    for (const post of byDate) {
      if (picked.length >= limit) break;
      if (pickedSlugs.has(post.slug)) continue;
      picked.push(post);
      pickedSlugs.add(post.slug);
    }
  }

  return picked.slice(0, limit);
}
