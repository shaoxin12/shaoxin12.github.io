import { sql } from '@vercel/postgres';

export { sql };

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
