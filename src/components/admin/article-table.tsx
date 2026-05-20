'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ArticleRow {
  id: number;
  section: string;
  date: string;
  zh_title: string;
  en_title: string;
}

export default function ArticleTable({ articles }: { articles: ArticleRow[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!confirm('确定删除？')) return;
    setDeleting(id);
    const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    setDeleting(null);
    if (res.ok) {
      router.refresh();
    } else {
      alert('删除失败');
    }
  }

  const sectionLabel = (s: string) => s === 'project' ? '项目' : '文章';

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #000' }}>
          <th style={thStyle}>ID</th>
          <th style={thStyle}>分区</th>
          <th style={thStyle}>日期</th>
          <th style={thStyle}>中文标题</th>
          <th style={thStyle}>English Title</th>
          <th style={thStyle}>操作</th>
        </tr>
      </thead>
      <tbody>
        {articles.map(a => (
          <tr key={a.id} style={{ borderBottom: '1px solid #ddd' }}>
            <td style={tdStyle}>{a.id}</td>
            <td style={tdStyle}>{sectionLabel(a.section)}</td>
            <td style={tdStyle}>{a.date}</td>
            <td style={tdStyle}>
              <Link href={`/${a.section}/${a.id}`} style={{ color: '#000', fontWeight: 600 }}>
                {a.zh_title}
              </Link>
            </td>
            <td style={{ ...tdStyle, fontSize: '11px', color: '#555' }}>{a.en_title}</td>
            <td style={tdStyle}>
              <Link href={`/admin/edit/${a.id}`} style={actionStyle}>编辑</Link>
              <button
                onClick={() => handleDelete(a.id)}
                disabled={deleting === a.id}
                style={{ ...actionStyle, color: '#DE2A18', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {deleting === a.id ? '...' : '删除'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '10px 8px', fontSize: '11px',
  fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' as const
};

const tdStyle: React.CSSProperties = {
  padding: '10px 8px', fontSize: '13px'
};

const actionStyle: React.CSSProperties = {
  fontSize: '11px', fontWeight: 700, marginRight: '12px',
  color: '#000', textDecoration: 'none'
};
