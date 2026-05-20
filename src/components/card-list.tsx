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
