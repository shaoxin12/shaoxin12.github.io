# CMS Migration — Next.js + Vercel Postgres

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the personal website from pure static HTML to a Next.js App Router application with Vercel Postgres and a visual admin panel.

**Architecture:** Next.js App Router with Server Components for public pages (SSR from Vercel Postgres) and Client Components for the admin panel. Password-based cookie auth for /admin routes via middleware. CSS-driven bilingual support using `data-zh`/`data-en` attributes.

**Tech Stack:** Next.js 15, TypeScript, Vercel Postgres (@vercel/postgres), jose (JWT), bcrypt

---

## File Map

```
website/
├── package.json                    — Dependencies
├── tsconfig.json                   — TypeScript config
├── next.config.ts                  — Next.js config
├── .env.local                      — Secrets (ADMIN_PASSWORD_HASH, JWT_SECRET, POSTGRES_*)
├── .gitignore                      — Add .env.local
├── src/
│   ├── app/
│   │   ├── globals.css             — Migrated neo-brutalist CSS
│   │   ├── layout.tsx              — Root layout: shell, sidebar, lang init
│   │   ├── page.tsx                — Home page (Server Component)
│   │   ├── project/
│   │   │   ├── page.tsx            — Project list
│   │   │   └── [id]/
│   │   │       └── page.tsx        — Project detail + Giscus
│   │   ├── articles/
│   │   │   ├── page.tsx            — Articles list + tag bar
│   │   │   ├── tag/
│   │   │   │   └── [...tags]/
│   │   │   │       └── page.tsx    — Multi-tag filtered list
│   │   │   └── [id]/
│   │   │       └── page.tsx        — Article detail + Giscus
│   │   ├── admin/
│   │   │   ├── layout.tsx          — Auth check wrapper
│   │   │   ├── page.tsx            — Dashboard: article list
│   │   │   ├── login/
│   │   │   │   └── page.tsx        — Login form (Client Component)
│   │   │   ├── new/
│   │   │   │   └── page.tsx        — Create article form
│   │   │   └── edit/
│   │   │       └── [id]/
│   │   │           └── page.tsx    — Edit article form
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/route.ts  — POST: verify password, set cookie
│   │       │   └── logout/route.ts — POST: clear cookie
│   │       └── articles/
│   │           ├── route.ts        — GET (list) / POST (create)
│   │           └── [id]/
│   │               └── route.ts    — GET / PUT / DELETE
│   ├── lib/
│   │   ├── db.ts                   — Vercel Postgres connection
│   │   ├── auth.ts                 — Password verify, JWT sign/verify, auth check
│   │   └── articles.ts            — CRUD functions for articles table
│   ├── components/
│   │   ├── sidebar.tsx             — Sidebar accordion navigation
│   │   ├── lang-toggle.tsx         — Language toggle button (Client Component)
│   │   ├── card-list.tsx           — Article card grid
│   │   ├── tags-bar.tsx            — Multi-select tag filter
│   │   ├── article-detail.tsx      — Article detail view
│   │   ├── giscus.tsx              — Giscus comment loader (Client Component)
│   │   ├── home-hero.tsx           — Home page hero + cards
│   │   └── admin/
│   │       ├── article-form.tsx    — Create/edit form (Client Component)
│   │       └── article-table.tsx   — Admin article list (Client Component)
│   ├── middleware.ts               — Auth guard for /admin/*
│   └── seed.ts                     — Script to migrate existing articles
├── index.html                      — Renamed to _old_index.html (reference)
├── style.css                       — Renamed to _old_style.css (reference)
├── content.js                      — Kept for reference
└── script.js                       — Kept for reference
```

---

### Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`

- [ ] **Step 1: Initialize the project**

```bash
cd d:\CodeField\website
npx create-next-app@latest . --typescript --eslint --src-dir --app --no-tailwind --import-alias "@/*" --use-npm
```

When prompted about overwriting existing files, answer "no" to all (we'll manually merge). Answer "yes" to installing dependencies.

If `create-next-app` gives trouble due to existing files, do it in a temp dir and copy the key config files.

- [ ] **Step 2: Verify scaffold**

```bash
npm run dev
```

Open http://localhost:3000 — should show the Next.js default page. Kill the dev server after verification.

- [ ] **Step 3: Install additional dependencies**

```bash
npm install @vercel/postgres jose bcrypt
npm install -D @types/bcrypt
```

- [ ] **Step 4: Update .gitignore**

Add `.env.local` to `.gitignore` if not already present.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts .gitignore
git commit -m "chore: scaffold Next.js project with dependencies"
```

---

### Task 2: Database schema migration

**Files:**
- Create: `src/lib/db.ts`
- Create: `schema.sql` (one-time use, not kept)

- [ ] **Step 1: Set up Vercel Postgres**

Go to https://vercel.com/dashboard → Storage → Create Database → Vercel Postgres → choose the project → create.

Copy the `.env.local` values shown (POSTGRES_URL, POSTGRES_PRISMA_URL, etc.)

Note: The actual Vercel project will be created in a later task. For local dev, create a Vercel project first:
```bash
npx vercel link
npx vercel env pull .env.development.local
```

Or set up manually with a local Postgres instance for testing.

- [ ] **Step 2: Write database connection module**

File: `src/lib/db.ts`
```typescript
import { sql } from '@vercel/postgres';

export { sql };

export async function query(text: string, params?: any[]) {
  if (params && params.length > 0) {
    // Convert positional params to @vercel/postgres format
    let idx = 0;
    const mapped = text.replace(/\?/g, () => {
      const val = params[idx++];
      if (val === null || val === undefined) return 'NULL';
      return typeof val === 'number' ? String(val) : `'${String(val).replace(/'/g, "''")}'`;
    });
    return sql.query(mapped);
  }
  return sql.query(text);
}
```

Actually, for simplicity and reliability, use tagged template literals directly:

```typescript
import { sql } from '@vercel/postgres';

export { sql };
```

The `sql` tagged template is the primary API. We'll use it directly in article functions.

- [ ] **Step 3: Write schema creation**

File: `src/lib/db.ts` — append a `createTable` function:

```typescript
export async function createArticlesTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS articles (
      id         SERIAL PRIMARY KEY,
      section    VARCHAR(20) NOT NULL,
      date       DATE NOT NULL,
      tags       JSONB DEFAULT '[]',
      zh_title   TEXT NOT NULL DEFAULT '',
      zh_desc    TEXT NOT NULL DEFAULT '',
      zh_body    TEXT NOT NULL DEFAULT '',
      en_title   TEXT NOT NULL DEFAULT '',
      en_desc    TEXT NOT NULL DEFAULT '',
      en_body    TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}
```

- [ ] **Step 4: Create DB init endpoint (temporary)**

File: `src/app/api/init-db/route.ts`
```typescript
import { createArticlesTable } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await createArticlesTable();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
```

- [ ] **Step 5: Run init and verify**

```bash
curl http://localhost:3000/api/init-db
# Expected: {"ok":true}
```

Then verify the table exists by querying it.

Delete `src/app/api/init-db/route.ts` after verification.

- [ ] **Step 6: Commit**

```bash
git add src/lib/db.ts
git commit -m "feat: add database connection and articles table schema"
```

---

### Task 3: Article data layer

**Files:**
- Create: `src/lib/articles.ts`

- [ ] **Step 1: Write articles CRUD module**

File: `src/lib/articles.ts`
```typescript
import { sql } from '@/lib/db';

export interface Article {
  id: number;
  section: string;
  date: string;
  tags: { zh: string; en: string }[];
  zh_title: string;
  zh_desc: string;
  zh_body: string;
  en_title: string;
  en_desc: string;
  en_body: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleInput {
  section: string;
  date: string;
  tags: { zh: string; en: string }[];
  zh_title: string;
  zh_desc: string;
  zh_body: string;
  en_title: string;
  en_desc: string;
  en_body: string;
}

function rowToArticle(row: any): Article {
  return {
    ...row,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || [])
  };
}

export async function getArticles(section?: string, tags?: string[]): Promise<Article[]> {
  let rows;
  if (section) {
    rows = await sql`SELECT * FROM articles WHERE section = ${section} ORDER BY date DESC`;
  } else {
    rows = await sql`SELECT * FROM articles ORDER BY date DESC`;
  }
  let articles = rows.rows.map(rowToArticle);

  if (tags && tags.length > 0) {
    articles = articles.filter(a =>
      a.tags.some(t => tags.includes(t.zh))
    );
  }
  return articles;
}

export async function getArticle(id: number): Promise<Article | null> {
  const rows = await sql`SELECT * FROM articles WHERE id = ${id}`;
  if (rows.rows.length === 0) return null;
  return rowToArticle(rows.rows[0]);
}

export async function createArticle(data: ArticleInput): Promise<Article> {
  const rows = await sql`
    INSERT INTO articles (section, date, tags, zh_title, zh_desc, zh_body, en_title, en_desc, en_body)
    VALUES (${data.section}, ${data.date}, ${JSON.stringify(data.tags)}, ${data.zh_title}, ${data.zh_desc}, ${data.zh_body}, ${data.en_title}, ${data.en_desc}, ${data.en_body})
    RETURNING *
  `;
  return rowToArticle(rows.rows[0]);
}

export async function updateArticle(id: number, data: ArticleInput): Promise<Article | null> {
  const rows = await sql`
    UPDATE articles SET
      section = ${data.section},
      date = ${data.date},
      tags = ${JSON.stringify(data.tags)},
      zh_title = ${data.zh_title},
      zh_desc = ${data.zh_desc},
      zh_body = ${data.zh_body},
      en_title = ${data.en_title},
      en_desc = ${data.en_desc},
      en_body = ${data.en_body},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  if (rows.rows.length === 0) return null;
  return rowToArticle(rows.rows[0]);
}

export async function deleteArticle(id: number): Promise<boolean> {
  const rows = await sql`DELETE FROM articles WHERE id = ${id}`;
  return rows.rowCount > 0;
}

export async function getAllTags(): Promise<{ zh: string; en: string }[]> {
  const rows = await sql`SELECT DISTINCT tags FROM articles`;
  const tagMap = new Map<string, { zh: string; en: string }>();
  for (const row of rows.rows) {
    const tags: { zh: string; en: string }[] = typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || []);
    for (const t of tags) {
      tagMap.set(t.zh, t);
    }
  }
  return Array.from(tagMap.values()).sort((a, b) => a.zh.localeCompare(b.zh));
}

export async function getSectionNames() {
  return {
    project: { zh: '项目', en: 'Project' },
    articles: { zh: '文章', en: 'Articles' },
  };
}
```

- [ ] **Step 2: Verify with a quick test**

Create a small test page at `src/app/test-db/page.tsx`:
```tsx
import { createArticle, getArticles, getArticle } from '@/lib/articles';

export default async function TestDbPage() {
  // Test create
  const created = await createArticle({
    section: 'project',
    date: '2026-05-20',
    tags: [{ zh: '测试', en: 'Test' }],
    zh_title: '测试文章',
    zh_desc: '测试摘要',
    zh_body: '测试正文',
    en_title: 'Test Article',
    en_desc: 'Test desc',
    en_body: 'Test body',
  });

  // Test read
  const all = await getArticles();
  const one = await getArticle(created.id);

  return (
    <pre>{JSON.stringify({ created, all, one }, null, 2)}</pre>
  );
}
```

Visit http://localhost:3000/test-db — verify the output shows the created article.

Delete `src/app/test-db/page.tsx` after verification.

- [ ] **Step 3: Commit**

```bash
git add src/lib/articles.ts
git commit -m "feat: add articles CRUD data layer"
```

---

### Task 4: Auth library

**Files:**
- Create: `src/lib/auth.ts`

- [ ] **Step 1: Generate password hash**

Run this in Node to get the hash:
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your-password-here', 10).then(h => console.log(h));"
```

Save the output — you'll put it in `.env.local`.

- [ ] **Step 2: Write auth module**

File: `src/lib/auth.ts`
```typescript
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');

export async function verifyPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

export async function createToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return false;
  return verifyToken(token);
}
```

- [ ] **Step 3: Set up .env.local**

File: `.env.local`
```
ADMIN_PASSWORD_HASH=<hash-from-step-1>
JWT_SECRET=<random-64-char-string>
```

To generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/auth.ts
git commit -m "feat: add auth library with JWT and bcrypt"
```

Note: `.env.local` is gitignored, do NOT commit it.

---

### Task 5: Middleware

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Write middleware**

File: `src/middleware.ts`
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except login and API)
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login') &&
    !pathname.startsWith('/api/auth')
  ) {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    try {
      await jwtVerify(token, SECRET);
    } catch {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

- [ ] **Step 2: Verify middleware**

Visit http://localhost:3000/admin — should redirect to /admin/login.
Visit http://localhost:3000/ — should load normally.

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add auth middleware for /admin routes"
```

---

### Task 6: Global CSS — migrate neo-brutalist styles

**Files:**
- Create: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Copy and adapt CSS**

Copy the contents of `style.css` into `src/app/globals.css`.

Changes needed:
- Replace `html, body` height rules — Next.js uses `#__next` or a root div. Add `html, body, body > div { height: 100% }` instead.
- Remove `@keyframes fade-in` if present, re-add it.
- Keep everything else identical.

- [ ] **Step 2: Update root layout to import globals.css**

The `layout.tsx` from create-next-app may already import it. Verify the import:
```tsx
import './globals.css';
```

If the scaffolded layout has Tailwind imports, remove them.

- [ ] **Step 3: Visual check**

Run `npm run dev`, open http://localhost:3000. The styles should load without errors in browser console. Ignore layout appearance for now — we'll build pages next.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "style: migrate neo-brutalist CSS to Next.js globals.css"
```

---

### Task 7: Language system

**Files:**
- Create: `src/components/lang-toggle.tsx`
- Commands: Update `src/app/layout.tsx`

- [ ] **Step 1: Write LangToggle**

File: `src/components/lang-toggle.tsx`
```tsx
'use client';

import { useEffect, useState } from 'react';

export default function LangToggle() {
  const [lang, setLang] = useState('zh-CN');

  useEffect(() => {
    const saved = localStorage.getItem('lang') || 'zh-CN';
    setLang(saved);
    document.documentElement.lang = saved;
  }, []);

  function toggle() {
    const next = lang === 'zh-CN' ? 'en' : 'zh-CN';
    setLang(next);
    document.documentElement.lang = next;
    localStorage.setItem('lang', next);
  }

  return (
    <button className="lang-toggle" onClick={toggle} aria-label="Switch language">
      <span data-zh>中</span>
      <span className="lang-slash">/</span>
      <span data-en>EN</span>
    </button>
  );
}
```

- [ ] **Step 2: Write LangInit to set html[lang] before hydration**

Add a script component that runs before React hydration. Put this in the layout:

```tsx
// In layout.tsx head:
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var saved = localStorage.getItem('lang');
                if (saved) document.documentElement.lang = saved;
              })();
            `,
          }}
        />
      </head>
      <body>
        <div className="shell">
          <LangToggle />
          {children}
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify**

Run `npm run dev`. The language toggle should appear in the top-right corner. Clicking it should toggle html[lang] attribute. CSS should show/hide data-zh/data-en content.

- [ ] **Step 4: Commit**

```bash
git add src/components/lang-toggle.tsx src/app/layout.tsx
git commit -m "feat: add bilingual language toggle with localStorage persistence"
```

---

### Task 8: Sidebar component

**Files:**
- Create: `src/components/sidebar.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Write Sidebar**

File: `src/components/sidebar.tsx`
```tsx
import Link from 'next/link';
import { getArticles, getSectionNames } from '@/lib/articles';

interface SidebarProps {
  currentSection?: string;
  currentArticleId?: number;
}

export default async function Sidebar({ currentSection, currentArticleId }: SidebarProps) {
  const articles = await getArticles();
  const sectionNames = await getSectionNames();
  const order: ('project' | 'articles')[] = ['project', 'articles'];

  // Group articles by section
  const grouped: Record<string, typeof articles> = {};
  for (const a of articles) {
    if (!grouped[a.section]) grouped[a.section] = [];
    grouped[a.section].push(a);
  }

  function esc(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand">
          <Link href="/" className="brand-btn" aria-label="Home">
            <span className="brand-dot"></span>
            <span className="brand-name">杨少新</span>
          </Link>
        </div>
        <nav className="sidebar-nav">
          {order.map(key => {
            const sn = sectionNames[key as keyof typeof sectionNames];
            const items = grouped[key] || [];
            const isOpen = currentSection === key;

            return (
              <div key={key} className={`nav-group${isOpen ? ' open' : ''}`}>
                <Link
                  href={`/${key}`}
                  className={`nav-item${isOpen ? ' active' : ''}`}
                >
                  <span className="nav-arrow">{isOpen ? '▾' : '▸'}</span>
                  <span className="nav-zh" data-zh>{sn.zh}</span>
                  <span className="nav-en" data-en>{sn.en}</span>
                  <span className="nav-count">{items.length}</span>
                </Link>
                <div className="sub-list">
                  {items.map(sub => {
                    const isActiveSub = currentArticleId != null && currentArticleId === sub.id && currentSection === key;
                    return (
                      <Link
                        key={sub.id}
                        href={`/${key}/${sub.id}`}
                        className={`sub-item${isActiveSub ? ' active' : ''}`}
                      >
                        <span className="sub-item-title">
                          <span data-zh>{esc(sub.zh_title)}</span>
                          <span data-en>{esc(sub.en_title)}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
      <div className="sidebar-footer">
        <span className="sidebar-email">yangshaoxin12@gmail.com</span>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create Shell wrapper component**

File: `src/components/shell.tsx`
```tsx
import Sidebar from './sidebar';

export default function Shell({
  children,
  currentSection,
  currentArticleId,
}: {
  children: React.ReactNode;
  currentSection?: string;
  currentArticleId?: number;
}) {
  return (
    <div className="shell">
      <Sidebar currentSection={currentSection} currentArticleId={currentArticleId} />
      <main className="main">{children}</main>
      <div className="mobile-email">yangshaoxin12@gmail.com</div>
    </div>
  );
}
```

- [ ] **Step 3: Update layout to be minimal**

```tsx
// src/app/layout.tsx
import './globals.css';
import LangToggle from '@/components/lang-toggle';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var s=localStorage.getItem('lang');if(s)document.documentElement.lang=s;})();` }} />
      </head>
      <body>
        <LangToggle />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify layout**

At this point the home page won't have a sidebar yet — we'll add Shell to each page as we build them.

- [ ] **Step 5: Commit**

```bash
git add src/components/sidebar.tsx src/components/shell.tsx src/app/layout.tsx
git commit -m "feat: add sidebar component and shell layout"
```

---

### Task 9: Home page

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/components/home-hero.tsx`

- [ ] **Step 1: Write HomeHero component**

File: `src/components/home-hero.tsx`
```tsx
import Link from 'next/link';

export default function HomeHero() {
  return (
    <section className="section active home-section">
      <div className="home-hero">
        <h1 className="home-name">杨少新</h1>
        <p className="home-tagline">
          <span data-zh>构建、交易、写作</span>
          <span data-en>Build, Trade, Write</span>
        </p>
      </div>
      <div className="home-cards">
        <Link href="/project" className="home-card">
          <span className="home-card-arrow">→</span>
          <span className="home-card-title" data-zh>项目</span>
          <span className="home-card-title" data-en>Project</span>
          <span className="home-card-sub" data-zh>作品与实验</span>
          <span className="home-card-sub" data-en>Works &amp; Experiments</span>
        </Link>
        <Link href="/articles" className="home-card">
          <span className="home-card-arrow">→</span>
          <span className="home-card-title" data-zh>文章</span>
          <span className="home-card-title" data-en>Articles</span>
          <span className="home-card-sub" data-zh>交易笔记与思考</span>
          <span className="home-card-sub" data-en>Trading Notes &amp; Thoughts</span>
        </Link>
      </div>
    </section>
  );
}
```

Note: Use `<Link>` instead of `<button onclick>` for navigation — Next.js client-side routing.

- [ ] **Step 2: Write home page**

File: `src/app/page.tsx`
```tsx
import Shell from '@/components/shell';
import HomeHero from '@/components/home-hero';

export default function HomePage() {
  return (
    <Shell>
      <HomeHero />
    </Shell>
  );
}
```

The Shell receives no currentSection (defaults to undefined), so both nav-groups are collapsed.

- [ ] **Step 3: Verify**

Run `npm run dev`, visit http://localhost:3000. Should see the homepage with sidebar (both groups collapsed), language toggle works.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/components/home-hero.tsx
git commit -m "feat: add homepage with hero and nav cards"
```

---

### Task 10: Project list page

**Files:**
- Create: `src/app/project/page.tsx`
- Create: `src/components/card-list.tsx`

- [ ] **Step 1: Write CardList component**

File: `src/components/card-list.tsx`
```tsx
import Link from 'next/link';
import { Article } from '@/lib/articles';

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default function CardList({ articles, section }: { articles: Article[]; section: string }) {
  if (articles.length === 0) {
    return (
      <p className="empty-msg">
        <span data-zh>没有匹配的文章</span>
        <span data-en>No matching articles</span>
      </p>
    );
  }

  return (
    <div className="card-list">
      {articles.map(a => (
        <Link key={a.id} href={`/${section}/${a.id}`} className="card">
          {a.tags.map(tag => (
            <Link
              key={tag.zh}
              href={`/articles/tag/${encodeURIComponent(tag.zh)}`}
              className="card-tag"
              onClick={e => e.stopPropagation()}
            >
              <span data-zh>{esc(tag.zh)}</span>
              <span data-en>{esc(tag.en)}</span>
            </Link>
          ))}
          <h3 className="card-title">
            <span data-zh>{esc(a.zh_title)}</span>
            <span data-en>{esc(a.en_title)}</span>
          </h3>
          <time className="card-date">{a.date}</time>
          <p className="card-desc">
            <span data-zh>{esc(a.zh_desc)}</span>
            <span data-en>{esc(a.en_desc)}</span>
          </p>
        </Link>
      ))}
    </div>
  );
}
```

Note: The card-tag links use `onClick={e => e.stopPropagation()}` to prevent the card Link from also firing. In Next.js Link components, `e.preventDefault()` is replaced by `e.stopPropagation()` since there's no default behavior to prevent.

- [ ] **Step 2: Write project list page**

File: `src/app/project/page.tsx`
```tsx
import Shell from '@/components/shell';
import CardList from '@/components/card-list';
import { getArticles, getSectionNames } from '@/lib/articles';

export default async function ProjectPage() {
  const articles = await getArticles('project');
  const sectionNames = await getSectionNames();
  const sn = sectionNames.project;

  return (
    <Shell currentSection="project">
      <section className="section active">
        <h2 className="section-title">
          <span data-zh>{sn.zh}</span>
          <span data-en>{sn.en}</span>
        </h2>
        <div className="section-divider"></div>
        <CardList articles={articles} section="project" />
      </section>
    </Shell>
  );
}
```

- [ ] **Step 3: Verify**

Visit http://localhost:3000/project — should show project cards with neo-brutalist styling. Sidebar should have "项目" group open.

- [ ] **Step 4: Commit**

```bash
git add src/app/project/page.tsx src/components/card-list.tsx
git commit -m "feat: add project list page with card list"
```

---

### Task 11: Articles list page + tag filter

**Files:**
- Create: `src/app/articles/page.tsx`
- Create: `src/components/tags-bar.tsx`
- Create: `src/app/articles/tag/[...tags]/page.tsx`

- [ ] **Step 1: Write TagsBar component**

File: `src/components/tags-bar.tsx`
```tsx
'use client';

import Link from 'next/link';

interface TagsBarProps {
  allTags: { zh: string; en: string }[];
  activeTags: string[];
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default function TagsBar({ allTags, activeTags }: TagsBarProps) {
  function buildHref(tagZh: string) {
    const current = [...activeTags];
    const idx = current.indexOf(tagZh);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(tagZh);
    }
    if (current.length === 0) return '/articles';
    return '/articles/tag/' + current.map(encodeURIComponent).join('+');
  }

  return (
    <div className="tags-bar">
      {allTags.map(tag => {
        const isActive = activeTags.includes(tag.zh);
        return (
          <Link
            key={tag.zh}
            href={buildHref(tag.zh)}
            className={`tags-bar-item${isActive ? ' active' : ''}`}
          >
            <span data-zh>{esc(tag.zh)}</span>
            <span data-en>{esc(tag.en)}</span>
          </Link>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Write articles list page (no tag filter)**

File: `src/app/articles/page.tsx`
```tsx
import Shell from '@/components/shell';
import CardList from '@/components/card-list';
import TagsBar from '@/components/tags-bar';
import { getArticles, getAllTags, getSectionNames } from '@/lib/articles';

export default async function ArticlesPage() {
  const articles = await getArticles('articles');
  const allTags = await getAllTags();
  const sectionNames = await getSectionNames();
  const sn = sectionNames.articles;

  return (
    <Shell currentSection="articles">
      <section className="section active">
        <h2 className="section-title">
          <span data-zh>{sn.zh}</span>
          <span data-en>{sn.en}</span>
        </h2>
        <div className="section-divider"></div>
        <TagsBar allTags={allTags} activeTags={[]} />
        <CardList articles={articles} section="articles" />
      </section>
    </Shell>
  );
}
```

- [ ] **Step 3: Write tag-filtered articles page**

File: `src/app/articles/tag/[...tags]/page.tsx`
```tsx
import Shell from '@/components/shell';
import CardList from '@/components/card-list';
import TagsBar from '@/components/tags-bar';
import { getArticles, getAllTags, getSectionNames } from '@/lib/articles';

interface Props {
  params: Promise<{ tags: string[] }>;
}

export default async function ArticlesTagPage({ params }: Props) {
  const { tags: rawTags } = await params;
  const tags = rawTags.map(t => decodeURIComponent(t));

  const articles = await getArticles('articles', tags);
  const allTags = await getAllTags();
  const sectionNames = await getSectionNames();
  const sn = sectionNames.articles;

  return (
    <Shell currentSection="articles">
      <section className="section active">
        <h2 className="section-title">
          <span data-zh>{sn.zh}</span>
          <span data-en>{sn.en}</span>
        </h2>
        <div className="section-divider"></div>
        <TagsBar allTags={allTags} activeTags={tags} />
        <CardList articles={articles} section="articles" />
      </section>
    </Shell>
  );
}
```

- [ ] **Step 4: Verify**

Visit http://localhost:3000/articles — tag bar visible, cards listed.
Click a tag — URL changes to `/articles/tag/交易`, filter applied, that tag highlighted.
Click another tag — URL changes to `/articles/tag/交易+哲学`, both highlighted.
Click an active tag — it deselects.

- [ ] **Step 5: Commit**

```bash
git add src/app/articles/ src/components/tags-bar.tsx
git commit -m "feat: add articles list with multi-tag filter"
```

---

### Task 12: Project & Article detail pages

**Files:**
- Create: `src/app/project/[id]/page.tsx`
- Create: `src/app/articles/[id]/page.tsx`
- Create: `src/components/article-detail.tsx`
- Create: `src/components/giscus.tsx`

- [ ] **Step 1: Write Giscus component**

File: `src/components/giscus.tsx`
```tsx
'use client';

import { useEffect, useRef } from 'react';

export default function Giscus({ term }: { term: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const container = containerRef.current;
    if (!container) return;

    // Clear any existing Giscus
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'yangshaoxin12/yangshaoxin12.github.io');
    script.setAttribute('data-repo-id', 'R_kgDOSiCCLw');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOSiCCL84C9cSq');
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', term);
    script.setAttribute('data-reactions-enabled', '0');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'light');
    script.setAttribute('data-lang', document.documentElement.lang);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    container.appendChild(script);

    return () => {
      loadedRef.current = false;
    };
  }, [term]);

  return <div className="giscus-container" ref={containerRef} />;
}
```

- [ ] **Step 2: Write ArticleDetail component**

File: `src/components/article-detail.tsx`
```tsx
import Link from 'next/link';
import { Article } from '@/lib/articles';
import Giscus from './giscus';

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default function ArticleDetail({ article, sectionName }: { article: Article; sectionName: { zh: string; en: string } }) {
  const bodyZh = article.zh_body || article.zh_desc;
  const bodyEn = article.en_body || article.en_desc;

  return (
    <div className="article-detail active">
      <Link href={`/${article.section}`} className="article-back">
        ← <span data-zh>返回</span><span data-en>Back</span>
      </Link>
      <div className="article-tags">
        <span className="article-tag">
          <span data-zh>{sectionName.zh}</span>
          <span data-en>{sectionName.en}</span>
        </span>
        {article.tags.map(tag => (
          <Link
            key={tag.zh}
            href={`/articles/tag/${encodeURIComponent(tag.zh)}`}
            className="article-cat-tag"
          >
            <span data-zh>{esc(tag.zh)}</span>
            <span data-en>{esc(tag.en)}</span>
          </Link>
        ))}
      </div>
      <h1 className="article-header">
        <span data-zh>{esc(article.zh_title)}</span>
        <span data-en>{esc(article.en_title)}</span>
      </h1>
      <time className="article-date">{article.date}</time>
      <div className="article-divider"></div>
      <div className="article-body">
        <span data-zh dangerouslySetInnerHTML={{ __html: bodyZh.replace(/\n/g, '<br>') }} />
        <span data-en dangerouslySetInnerHTML={{ __html: bodyEn.replace(/\n/g, '<br>') }} />
      </div>
      <div className="comments-section">
        <div className="comments-title">
          <span data-zh>评论</span>
          <span data-en>Comments</span>
        </div>
        <Giscus term={`${article.section}-${article.id}`} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write project detail page**

File: `src/app/project/[id]/page.tsx`
```tsx
import Shell from '@/components/shell';
import ArticleDetail from '@/components/article-detail';
import { getArticle, getSectionNames } from '@/lib/articles';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const article = await getArticle(Number(id));
  if (!article || article.section !== 'project') notFound();

  const sectionNames = await getSectionNames();

  return (
    <Shell currentSection="project" currentArticleId={article.id}>
      <ArticleDetail article={article} sectionName={sectionNames.project} />
    </Shell>
  );
}
```

- [ ] **Step 4: Write article detail page**

File: `src/app/articles/[id]/page.tsx`
```tsx
import Shell from '@/components/shell';
import ArticleDetail from '@/components/article-detail';
import { getArticle, getSectionNames } from '@/lib/articles';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  const article = await getArticle(Number(id));
  if (!article || article.section !== 'articles') notFound();

  const sectionNames = await getSectionNames();

  return (
    <Shell currentSection="articles" currentArticleId={article.id}>
      <ArticleDetail article={article} sectionName={sectionNames.articles} />
    </Shell>
  );
}
```

- [ ] **Step 5: Verify**

Visit /project/1 and /articles/1 — detail pages render correctly. Giscus loads in the comments section. Sidebar highlights the current article. Back button works.

- [ ] **Step 6: Commit**

```bash
git add src/app/project/[id]/ src/app/articles/[id]/ src/components/article-detail.tsx src/components/giscus.tsx
git commit -m "feat: add article/project detail pages with Giscus"
```

---

### Task 13: API routes — Auth

**Files:**
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/logout/route.ts`

- [ ] **Step 1: Write login API**

File: `src/app/api/auth/login/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { verifyPassword, createToken } from '@/lib/auth';

export async function POST(request: Request) {
  const { password } = await request.json();

  const valid = await verifyPassword(password);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = await createToken();

  const response = NextResponse.json({ ok: true });
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  return response;
}
```

- [ ] **Step 2: Write logout API**

File: `src/app/api/auth/logout/route.ts`
```typescript
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete('admin_token');
  return response;
}
```

- [ ] **Step 3: Verify**

```bash
# Test login with wrong password
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"password":"wrong"}'
# Expected: {"error":"Invalid password"}

# Test login with correct password
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"password":"your-password"}' -c cookies.txt
# Expected: {"ok":true}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/auth/
git commit -m "feat: add auth API routes (login/logout)"
```

---

### Task 14: API routes — Articles CRUD

**Files:**
- Create: `src/app/api/articles/route.ts`
- Create: `src/app/api/articles/[id]/route.ts`

- [ ] **Step 1: Write articles list/create API**

File: `src/app/api/articles/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { getArticles, createArticle, ArticleInput } from '@/lib/articles';
import { isAuthenticated } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section') || undefined;
  const tagsParam = searchParams.get('tags');
  const tags = tagsParam ? tagsParam.split(',').filter(Boolean) : undefined;

  const articles = await getArticles(section, tags);
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: ArticleInput = await request.json();

  // Validation
  if (!body.section || !body.date || !body.zh_title || !body.en_title) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const article = await createArticle(body);
  return NextResponse.json(article, { status: 201 });
}
```

- [ ] **Step 2: Write single article API**

File: `src/app/api/articles/[id]/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { getArticle, updateArticle, deleteArticle, ArticleInput } from '@/lib/articles';
import { isAuthenticated } from '@/lib/auth';

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Props) {
  const { id } = await params;
  const article = await getArticle(Number(id));
  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function PUT(request: Request, { params }: Props) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body: ArticleInput = await request.json();

  const article = await updateArticle(Number(id), body);
  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function DELETE(request: Request, { params }: Props) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteArticle(Number(id));
  if (!deleted) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Verify**

```bash
# List articles
curl http://localhost:3000/api/articles

# Get single article
curl http://localhost:3000/api/articles/1

# Create (needs auth)
curl -X POST http://localhost:3000/api/articles -H "Content-Type: application/json" -d '{"section":"articles","date":"2026-05-20","tags":[{"zh":"测试","en":"Test"}],"zh_title":"新文章","zh_desc":"摘要","zh_body":"正文","en_title":"New Article","en_desc":"Desc","en_body":"Body"}'

# Expect 401 without cookie
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/articles/
git commit -m "feat: add articles CRUD API routes with auth protection"
```

---

### Task 15: Admin login page

**Files:**
- Create: `src/app/admin/login/page.tsx`

- [ ] **Step 1: Write login page**

File: `src/app/admin/login/page.tsx`
```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/admin');
    } else {
      const data = await res.json();
      setError(data.error || 'Login failed');
    }
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#fff', fontFamily: 'var(--font-sans)'
    }}>
      <form onSubmit={handleSubmit} style={{
        border: '3px solid #000', padding: '32px', boxShadow: '4px 4px 0 #000',
        width: '100%', maxWidth: '360px'
      }}>
        <h1 style={{
          fontSize: '24px', fontWeight: 800, marginBottom: '24px',
          textAlign: 'center', letterSpacing: '-0.02em'
        }}>
          后台管理
        </h1>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '13px' }}>
          密码
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px', border: '2px solid #000',
            fontSize: '14px', fontFamily: 'var(--font-mono)', outline: 'none',
            marginBottom: '16px'
          }}
          autoFocus
        />
        {error && (
          <p style={{ color: '#DE2A18', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '10px', border: '2px solid #000',
            background: '#000', color: '#fff', fontSize: '14px', fontWeight: 700,
            cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit',
            boxShadow: '3px 3px 0 #000'
          }}
        >
          {loading ? '...' : '登录'}
        </button>
      </form>
    </div>
  );
}
```

Note: Uses inline styles for the login page since it doesn't need to share the main site CSS. Alternatively, could import globals.css — but inline styles keep it self-contained and visually consistent with neo-brutalism.

- [ ] **Step 2: Verify**

Visit http://localhost:3000/admin/login — login form renders.
Enter wrong password — error message shown.
Enter correct password — redirected to /admin.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/login/
git commit -m "feat: add admin login page"
```

---

### Task 16: Admin dashboard — article list

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/components/admin/article-table.tsx`

- [ ] **Step 1: Write admin layout**

File: `src/app/admin/layout.tsx`
```tsx
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh', background: '#fff', fontFamily: 'var(--font-sans)',
      padding: '24px 32px', maxWidth: '960px', margin: '0 auto'
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '24px', borderBottom: '2px solid #000', paddingBottom: '16px'
      }}>
        <Link href="/admin" style={{
          fontSize: '18px', fontWeight: 800, color: '#000', textDecoration: 'none',
          letterSpacing: '-0.02em'
        }}>
          后台管理
        </Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/admin/new" style={{
            border: '2px solid #000', padding: '6px 14px', fontSize: '12px',
            fontWeight: 700, color: '#000', textDecoration: 'none',
            boxShadow: '2px 2px 0 #000'
          }}>
            + 新建
          </Link>
          <Link href="/" style={{
            fontSize: '12px', fontWeight: 600, color: '#555', textDecoration: 'none'
          }}>
            回网站
          </Link>
          <LogoutButton />
        </div>
      </div>
      {children}
    </div>
  );
}

function LogoutButton() {
  // Client Component for logout action
  return (
    <form action="/api/auth/logout" method="POST" style={{ display: 'inline' }}>
      <button type="submit" style={{
        border: 'none', background: 'none', fontSize: '12px', fontWeight: 600,
        color: '#DE2A18', cursor: 'pointer', fontFamily: 'inherit'
      }}>
        登出
      </button>
    </form>
  );
}
```

Wait — `LogoutButton` uses a form POST action, but `useFormStatus` or client interactivity might be needed. Let me make it a proper client component:

Actually, a `<form action="/api/auth/logout" method="POST">` works without JavaScript (progressive enhancement). And the logout API returns JSON, so we'd redirect after. Better to use a client component:

```tsx
'use client';

function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <button onClick={logout} style={{
      border: 'none', background: 'none', fontSize: '12px', fontWeight: 600,
      color: '#DE2A18', cursor: 'pointer', fontFamily: 'inherit'
    }}>
      登出
    </button>
  );
}
```

Better to put this in a separate file `src/components/admin/logout-button.tsx`.

- [ ] **Step 2: Write ArticleTable component**

File: `src/components/admin/article-table.tsx`
```tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ArticleRow {
  id: number;
  section: string;
  date: string;
  zh_title: string;
  en_title: string;
}

export default function ArticleTable({ articles }: { articles: ArticleRow[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!confirm('确定删除？')) return;
    setDeleting(id);
    const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    setDeleting(null);
    if (res.ok) {
      router.refresh();
    } else {
      alert('删除失败');
    }
  }

  const sectionLabel = (s: string) => s === 'project' ? '项目' : '文章';

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #000' }}>
          <th style={thStyle}>ID</th>
          <th style={thStyle}>分区</th>
          <th style={thStyle}>日期</th>
          <th style={thStyle}>中文标题</th>
          <th style={thStyle}>English Title</th>
          <th style={thStyle}>操作</th>
        </tr>
      </thead>
      <tbody>
        {articles.map(a => (
          <tr key={a.id} style={{ borderBottom: '1px solid #ddd' }}>
            <td style={tdStyle}>{a.id}</td>
            <td style={tdStyle}>{sectionLabel(a.section)}</td>
            <td style={tdStyle}>{a.date}</td>
            <td style={tdStyle}>
              <Link href={`/${a.section}/${a.id}`} style={{ color: '#000', fontWeight: 600 }}>
                {a.zh_title}
              </Link>
            </td>
            <td style={{ ...tdStyle, fontSize: '11px', color: '#555' }}>{a.en_title}</td>
            <td style={tdStyle}>
              <Link href={`/admin/edit/${a.id}`} style={actionStyle}>编辑</Link>
              <button
                onClick={() => handleDelete(a.id)}
                disabled={deleting === a.id}
                style={{ ...actionStyle, color: '#DE2A18', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {deleting === a.id ? '...' : '删除'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '10px 8px', fontSize: '11px',
  fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase'
};

const tdStyle: React.CSSProperties = {
  padding: '10px 8px', fontSize: '13px'
};

const actionStyle: React.CSSProperties = {
  fontSize: '11px', fontWeight: 700, marginRight: '12px',
  color: '#000', textDecoration: 'none'
};
```

- [ ] **Step 3: Write admin dashboard page**

File: `src/app/admin/page.tsx`
```tsx
import { getArticles } from '@/lib/articles';
import ArticleTable from '@/components/admin/article-table';

export default async function AdminPage() {
  const articles = await getArticles();

  return (
    <div>
      <h2 style={{
        fontSize: '16px', fontWeight: 800, marginBottom: '16px',
        letterSpacing: '-0.01em'
      }}>
        文章列表 ({articles.length})
      </h2>
      <ArticleTable articles={articles} />
    </div>
  );
}
```

- [ ] **Step 4: Verify**

Visit http://localhost:3000/admin (should redirect to /admin/login if not logged in).
Login, then redirected to /admin — article list displayed. Logout redirects to login.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/layout.tsx src/app/admin/page.tsx src/components/admin/
git commit -m "feat: add admin dashboard with article list"
```

---

### Task 17: Admin article form (create/edit)

**Files:**
- Create: `src/components/admin/article-form.tsx`
- Create: `src/app/admin/new/page.tsx`
- Create: `src/app/admin/edit/[id]/page.tsx`

- [ ] **Step 1: Write ArticleForm component**

File: `src/components/admin/article-form.tsx`
```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArticleInput, Article } from '@/lib/articles';

interface Props {
  article?: Article; // If provided, edit mode
}

export default function ArticleForm({ article }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [section, setSection] = useState(article?.section || 'articles');
  const [date, setDate] = useState(article?.date || new Date().toISOString().slice(0, 10));
  const [tagsStr, setTagsStr] = useState(
    article?.tags?.map(t => `${t.zh}/${t.en}`).join(', ') || ''
  );
  const [zhTitle, setZhTitle] = useState(article?.zh_title || '');
  const [zhDesc, setZhDesc] = useState(article?.zh_desc || '');
  const [zhBody, setZhBody] = useState(article?.zh_body || '');
  const [enTitle, setEnTitle] = useState(article?.en_title || '');
  const [enDesc, setEnDesc] = useState(article?.en_desc || '');
  const [enBody, setEnBody] = useState(article?.en_body || '');

  function parseTags(): { zh: string; en: string }[] {
    return tagsStr.split(',').map(s => {
      const parts = s.trim().split('/');
      return { zh: (parts[0] || '').trim(), en: (parts[1] || '').trim() };
    }).filter(t => t.zh && t.en);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const data: ArticleInput = {
      section,
      date,
      tags: parseTags(),
      zh_title: zhTitle,
      zh_desc: zhDesc,
      zh_body: zhBody,
      en_title: enTitle,
      en_desc: enDesc,
      en_body: enBody,
    };

    const url = article ? `/api/articles/${article.id}` : '/api/articles';
    const method = article ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    setSaving(false);

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const err = await res.json();
      setError(err.error || 'Save failed');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '700px' }}>
      <h2 style={headingStyle}>
        {article ? '编辑文章' : '新建文章'}
      </h2>

      {error && <p style={{ color: '#DE2A18', fontWeight: 700, marginBottom: '16px' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <Field label="分区">
          <select value={section} onChange={e => setSection(e.target.value)} style={inputStyle}>
            <option value="articles">文章</option>
            <option value="project">项目</option>
          </select>
        </Field>
        <Field label="日期">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
        </Field>
      </div>

      <Field label="标签 (格式: 中文/English, 中文/English)">
        <input
          type="text" value={tagsStr} onChange={e => setTagsStr(e.target.value)}
          style={inputStyle} placeholder="交易/Trading, 哲学/Philosophy"
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', borderBottom: '2px solid #000', paddingBottom: '4px' }}>中文</h3>
          <Field label="标题">
            <input type="text" value={zhTitle} onChange={e => setZhTitle(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="摘要">
            <input type="text" value={zhDesc} onChange={e => setZhDesc(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="正文 (用换行分段)">
            <textarea value={zhBody} onChange={e => setZhBody(e.target.value)} style={{ ...inputStyle, minHeight: '200px' }} />
          </Field>
        </div>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', borderBottom: '2px solid #000', paddingBottom: '4px' }}>English</h3>
          <Field label="Title">
            <input type="text" value={enTitle} onChange={e => setEnTitle(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Description">
            <input type="text" value={enDesc} onChange={e => setEnDesc(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Body (newlines for paragraphs)">
            <textarea value={enBody} onChange={e => setEnBody(e.target.value)} style={{ ...inputStyle, minHeight: '200px' }} />
          </Field>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" disabled={saving} style={submitStyle}>
          {saving ? '保存中...' : '保存'}
        </button>
        <button type="button" onClick={() => router.back()} style={cancelStyle}>
          取消
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: 700 }}>{label}</label>
      {children}
    </div>
  );
}

const headingStyle: React.CSSProperties = {
  fontSize: '20px', fontWeight: 800, marginBottom: '20px',
  letterSpacing: '-0.02em', borderBottom: '3px solid #000', paddingBottom: '12px'
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '2px solid #000',
  fontSize: '13px', fontFamily: 'var(--font-sans)', outline: 'none'
};

const submitStyle: React.CSSProperties = {
  padding: '10px 20px', border: '2px solid #000', background: '#000',
  color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
  fontFamily: 'inherit', boxShadow: '3px 3px 0 #000'
};

const cancelStyle: React.CSSProperties = {
  padding: '10px 20px', border: '2px solid #000', background: '#fff',
  color: '#000', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
  fontFamily: 'inherit', boxShadow: '3px 3px 0 #000'
};
```

- [ ] **Step 2: Write admin new page**

File: `src/app/admin/new/page.tsx`
```tsx
import ArticleForm from '@/components/admin/article-form';

export default function AdminNewPage() {
  return <ArticleForm />;
}
```

- [ ] **Step 3: Write admin edit page**

File: `src/app/admin/edit/[id]/page.tsx`
```tsx
import { getArticle } from '@/lib/articles';
import { notFound } from 'next/navigation';
import ArticleForm from '@/components/admin/article-form';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEditPage({ params }: Props) {
  const { id } = await params;
  const article = await getArticle(Number(id));
  if (!article) notFound();

  return <ArticleForm article={article} />;
}
```

- [ ] **Step 4: Verify**

Login, click "+ 新建" → fill form → save → redirects to /admin with new article shown.
Click "编辑" on existing article → form pre-filled → edit → save → updated.
Click "删除" → confirm → article removed.

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/article-form.tsx src/app/admin/new/ src/app/admin/edit/
git commit -m "feat: add admin article create/edit form"
```

---

### Task 18: Seed existing articles into database

**Files:**
- Create: `src/seed.ts`

- [ ] **Step 1: Write seed script**

File: `src/seed.ts`
```typescript
import { createArticlesTable, sql } from './lib/db';
import { createArticle } from './lib/articles';

const existingArticles = [
  {
    section: 'project',
    date: '2026-05-01',
    tags: [] as { zh: string; en: string }[],
    zh_title: '听墨 Tingmo',
    zh_desc: 'Windows 桌面 AI 语音输入法，Electron + React + TypeScript。',
    zh_body: '听墨是一个 Windows 桌面 AI 语音输入工具。按住快捷键说话，松手自动识别并输入到当前光标位置。\n\n技术栈：Electron + React + TypeScript + Vite。语音识别使用了 Whisper 模型本地推理，延迟控制在 500ms 以内。\n\n界面设计分两部分：悬浮窗用了暗色玻璃态风格，设置页采用了新粗野主义——也是后来这个个人网站的视觉来源。\n\nGitHub: github.com/yangshaoxin12/tingmo',
    en_title: 'Tingmo',
    en_desc: 'Windows desktop AI voice input, built with Electron + React + TypeScript.',
    en_body: 'Tingmo is a Windows desktop AI voice input tool. Hold a hotkey, speak, release to transcribe and type at the cursor.\n\nStack: Electron + React + TypeScript + Vite. Speech recognition uses Whisper model running locally, with latency under 500ms.\n\nUI has two parts: the floating window uses a dark glassmorphism style, while the settings page uses neo-brutalism — which later inspired this personal website.\n\nGitHub: github.com/yangshaoxin12/tingmo',
  } as const,
  // ... copy all existing articles here
];

async function seed() {
  console.log('Creating table...');
  await createArticlesTable();

  // Check if data already exists
  const existing = await sql`SELECT COUNT(*) as count FROM articles`;
  if (Number(existing.rows[0].count) > 0) {
    console.log(`Database already has ${existing.rows[0].count} articles. Skipping seed.`);
    return;
  }

  console.log(`Seeding ${existingArticles.length} articles...`);
  for (const a of existingArticles) {
    await createArticle({
      section: a.section,
      date: a.date,
      tags: a.tags,
      zh_title: a.zh_title,
      zh_desc: a.zh_desc,
      zh_body: a.zh_body,
      en_title: a.en_title,
      en_desc: a.en_desc,
      en_body: a.en_body,
    });
    console.log(`  ✓ ${a.zh_title}`);
  }

  console.log('Seed complete.');
}

seed().catch(console.error);
```

Copy all current articles from `content.js` into the `existingArticles` array above.

- [ ] **Step 2: Run seed script**

```bash
npx tsx src/seed.ts
```

- [ ] **Step 3: Verify data**

Visit http://localhost:3000/project and /articles — all existing articles should appear.
Verify admin panel at /admin shows them all.

- [ ] **Step 4: Commit**

```bash
git add src/seed.ts
git commit -m "feat: add seed script for existing articles"
```

---

### Task 19: Rename old files and cleanup

**Files:**
- Rename: `index.html` → `_old_index.html`
- Rename: `style.css` → `_old_style.css`
- Keep: `content.js`, `script.js` (reference copies, unchanged)

- [ ] **Step 1: Rename old files**

```bash
cd d:\CodeField\website
git mv index.html _old_index.html
git mv style.css _old_style.css
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Should build successfully with no errors.

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: rename old static files to _old_*"
```

---

### Task 20: Deploy to Vercel

**Files:**
- Modify: `next.config.ts` (if needed for static optimization or rewrites)

- [ ] **Step 1: Push to GitHub**

```bash
git push origin master
```

- [ ] **Step 2: Import to Vercel**

Go to https://vercel.com/new → import `yangshaoxin12/yangshaoxin12.github.io` → deploy.

- [ ] **Step 3: Set environment variables in Vercel dashboard**

Settings → Environment Variables:
- `ADMIN_PASSWORD_HASH` = same value as .env.local
- `JWT_SECRET` = same value as .env.local
- `POSTGRES_URL` = from Vercel Postgres connection
- Other POSTGRES_* vars from Vercel Postgres

- [ ] **Step 4: Set up Vercel Postgres**

Vercel dashboard → Storage → Create Database → Vercel Postgres → connect to the project.

- [ ] **Step 5: Run seed on Vercel**

```bash
npx vercel env pull .env.production.local
POSTGRES_URL=$(node -e "console.log(require('dotenv').config({path:'.env.production.local'}).parsed.POSTGRES_URL)") npx tsx src/seed.ts
```

Or run seed via a one-time command on Vercel.

Alternative: Create a seed API endpoint, deploy it, hit it once, then delete it.

- [ ] **Step 6: Verify production**

Visit the Vercel URL — homepage, projects, articles, all render correctly.
Visit /admin — login works, can create/edit articles.
Giscus comments load on detail pages.

- [ ] **Step 7: Final commit**

```bash
git commit -m "chore: deploy to Vercel, production verified"
```

---

## Deployment Notes

After deployment:
- The site runs on Vercel with instant content updates (no build step for content changes)
- Admin panel at /admin for content management
- Old GitHub Pages deployment can be disabled or redirected
- Static files (_old_*.html, content.js, script.js, style.css) kept for reference only
