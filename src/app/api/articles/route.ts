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

  let body: ArticleInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.section || !body.date || !body.zh_title || !body.en_title) {
    return NextResponse.json(
      { error: 'Missing required fields: section, date, zh_title, en_title' },
      { status: 400 }
    );
  }

  const article = await createArticle(body);
  return NextResponse.json(article, { status: 201 });
}
