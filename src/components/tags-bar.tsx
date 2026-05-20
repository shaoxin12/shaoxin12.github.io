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
    return '/articles/tag/' + current.map(encodeURIComponent).join('~');
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
