import Shell from '@/components/shell';
import ArticleDetail from '@/components/article-detail';
import { getArticle, getArticles, getSectionNames } from '@/lib/articles';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const articles = await getArticles('articles');
  return articles.map(a => ({ id: String(a.id) }));
}

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
