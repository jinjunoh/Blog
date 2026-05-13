# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # ESLint via next lint
npx prettier --write .  # format (prettier + tailwindcss plugin)
```

No test suite is configured.

## Environment variables

Both vars are required at runtime and build time:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Architecture

This is a Next.js 14 (App Router) personal blog/notes app backed by Supabase.

**Supabase client variants** — three clients exist for different rendering contexts:
- `lib/supabase/server.ts` — cookie-aware server client (Server Components, Route Handlers)
- `lib/supabase/client.ts` — browser client (Client Components)
- `lib/supabase/static.ts` — cookie-free client for `generateStaticParams` and build-time use

**Data layer** — all Supabase queries live in `lib/db/posts.ts`. Functions accept a `SupabaseClient` parameter so the caller controls which client variant is used. Search uses a Supabase RPC function `search_posts`; Supabase RLS automatically scopes results (anon sees only `published + is_public`, authenticated sees all).

**Auth** — Supabase Auth with `@supabase/ssr`. The middleware (`middleware.ts`) protects `/admin/*` routes and `/api/posts/*` + `/api/auth/logout` by calling `supabase.auth.getUser()` (JWT-validated, not session cache). Unauthenticated requests to admin routes redirect to `/login`; unauthenticated API requests get a 401.

**Route structure:**
- `/` — public home, shows pinned-first published posts
- `/posts/[slug]` — public post view (markdown rendered via `react-markdown` + `rehype-highlight`)
- `/search` — full-text search (calls `search_posts` RPC)
- `/login` — Supabase email/password login
- `/admin` — dashboard (all posts, drafts + published)
- `/admin/posts/new` — create post
- `/admin/posts/[id]/edit` — edit post
- `/api/posts` (GET/POST) and `/api/posts/[id]` (GET/PATCH/DELETE) — REST API used by admin UI

**Post model** (`lib/types.ts`): `status` (`draft | published`), `is_public` (controls public visibility), `is_pinned` (float-to-top on homepage). Slug is auto-generated from title via `lib/utils/slug.ts` (using `slugify`) and de-duped against existing slugs. Excerpt is auto-generated from content when publishing if not manually provided (`lib/utils/excerpt.ts`).
