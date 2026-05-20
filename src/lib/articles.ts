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
  return (rows.rowCount ?? 0) > 0;
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
