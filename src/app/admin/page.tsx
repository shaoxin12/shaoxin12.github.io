import { getArticles } from '@/lib/articles';
import ArticleTable from '@/components/admin/article-table';

export const revalidate = 60;

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
