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
