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
