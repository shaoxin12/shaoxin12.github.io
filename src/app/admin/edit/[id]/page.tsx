import { getArticle } from '@/lib/articles';
import { notFound } from 'next/navigation';
import ArticleForm from '@/components/admin/article-form';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEditPage({ params }: Props) {
  const { id } = await params;
  const article = await getArticle(Number(id));
  if (!article) notFound();

  return <ArticleForm article={article} />;
}
