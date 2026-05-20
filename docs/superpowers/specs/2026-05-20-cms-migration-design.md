# CMS Migration — Next.js + Vercel Postgres

## Status：Approved

## Overview

将杨少新个人网站从纯静态 HTML/CSS/JS 迁移到 Next.js App Router + Vercel Postgres，
新增可视化后台管理面板（/admin），实现动态内容管理。

## Architecture

```
/browser  ←→  Next.js App Router
                ├── Frontend pages (SSR from Vercel Postgres)
                │   /               Home
                │   /project        Project list
                │   /project/[id]   Project detail + Giscus
                │   /articles       Articles list + tag filter
                │   /articles/tag/[...tags]  Multi-tag filter
                │   /articles/[id]  Article detail + Giscus
                │
                ├── Admin pages (Client Components)
                │   /admin           Article list
                │   /admin/login     Password login
                │   /admin/new       Create article
                │   /admin/edit/[id] Edit article
                │
                ├── API Routes
                │   /api/auth/login  POST — verify password, set cookie
                │   /api/auth/logout POST — clear cookie
                │   /api/articles    GET/POST — list/create
                │   /api/articles/[id] GET/PUT/DELETE — read/update/delete
                │
                └── Middleware
                    /admin/* cookie check (except /admin/login)
```

## Database Schema

```sql
CREATE TABLE articles (
  id         SERIAL PRIMARY KEY,
  section    VARCHAR(20) NOT NULL,         -- 'project' | 'articles'
  date       DATE NOT NULL,
  tags       JSONB DEFAULT '[]',           -- [{zh, en}, ...]
  zh_title   TEXT NOT NULL DEFAULT '',
  zh_desc    TEXT NOT NULL DEFAULT '',
  zh_body    TEXT NOT NULL DEFAULT '',
  en_title   TEXT NOT NULL DEFAULT '',
  en_desc    TEXT NOT NULL DEFAULT '',
  en_body    TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Auth

- Admin password hash stored in `ADMIN_PASSWORD_HASH` env var
- `/admin/login` form submits to `/api/auth/login`
- API verifies bcrypt hash, sets httpOnly cookie `admin_token` (JWT, 24h expiry)
- Middleware redirects to /admin/login if no valid cookie on any /admin/* route

## Content Management Flow

1. Visit `/admin` → middleware check → login if needed
2. Article list shows all articles, sorted by date desc
3. New/edit form: zh/en title, zh/en desc, zh/en body (textarea, \n for newlines), tags (comma-separated input), section (dropdown), date (date picker)
4. Save → POST/PUT `/api/articles` → database updated → redirect to article list
5. Frontend pages re-render on next request (SSR, no cache)

## Preserved Features

- Neo-brutalism visual style (CSS migrated as-is, global.css)
- Hash-route SPA behavior → Next.js file-system routes (better URL)
- Bilingual zh-CN/en with `data-zh`/`data-en` + html[lang]
- Language toggle with localStorage persistence
- Giscus comments on /project/[id] and /articles/[id]
- Multi-tag filter (/articles/tag/交易+哲学)
- Responsive design (sidebar on desktop, top nav on mobile)
- Sidebar accordion navigation with active article highlight
- Homepage with two cards linking to projects/articles

## Deployment

- Vercel + Vercel Postgres (Hobby plan, free)
- Domain: yangshaoxin12-github-io.vercel.app (or similar)
- Admin URL: /admin (known only to owner)
- Push to GitHub master → Vercel auto-deploy

## Migration Strategy

1. Scaffold Next.js project with TypeScript
2. Set up Vercel Postgres + schema migration
3. Migrate CSS (copy as global.css, adapt for Next.js)
4. Build frontend pages (SSR, reading from DB)
5. Build admin panel (Client Components)
6. Build API routes + middleware
7. Test on Vercel preview
8. Deploy to production

## Scope

In scope:
- Full Next.js rewrite preserving all current features
- Admin panel with CRUD for articles
- Password-protected admin area
- Vercel Postgres database
- Seed script to migrate existing articles

Out of scope:
- Markdown/WYSIWYG editor (textarea with \n for now)
- Image upload
- User management (single admin)
- Draft/publish workflow (everything is published on save)
