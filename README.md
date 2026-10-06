# Postura & Teletrabajo 🪴

Blog de **Ergonomía Profesional, Salud Postural y RSI** con Clean Architecture en Astro.

## Stack

Astro 5 (Content Layer) · TypeScript strict · Tailwind v4 (`@theme`) · Markdown nativo.

## Arquitectura

```
src/
├── core/domain/        # entidades + contratos (puros)
├── core/use-cases/     # FilterPosts, GetRelatedPosts, EstimateReadingTime
├── infrastructure/     # AstroContentBlogRepository, CommentAdapters
├── content/blog/       # .md con schema Zod
├── components/         # PostCard, BlogExplorer, RelatedPosts, Comments
├── layouts/            # BaseLayout (SEO/OG), BlogPostLayout
└── pages/              # /, /blog/, /blog/[slug]
```

## Comandos

```bash
npm install
npm run dev
npm run build
```

## Comentarios (Giscus)

Define en `.env`:

```
PUBLIC_GISCUS_REPO=org/repo
PUBLIC_GISCUS_REPO_ID=R_...
PUBLIC_GISCUS_CATEGORY=General
PUBLIC_GISCUS_CATEGORY_ID=DIC_...
```

Sin env → `NoopCommentAdapter` (UI intacta, sin JS de terceros).
