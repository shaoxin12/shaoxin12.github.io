'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArticleInput, Article } from '@/lib/articles';

interface Props {
  article?: Article; // If provided, edit mode
}

export default function ArticleForm({ article }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [section, setSection] = useState(article?.section || 'articles');
  const [date, setDate] = useState(article?.date || new Date().toISOString().slice(0, 10));
  const [tagsStr, setTagsStr] = useState(
    article?.tags?.map(t => `${t.zh}/${t.en}`).join(', ') || ''
  );
  const [zhTitle, setZhTitle] = useState(article?.zh_title || '');
  const [zhDesc, setZhDesc] = useState(article?.zh_desc || '');
  const [zhBody, setZhBody] = useState(article?.zh_body || '');
  const [enTitle, setEnTitle] = useState(article?.en_title || '');
  const [enDesc, setEnDesc] = useState(article?.en_desc || '');
  const [enBody, setEnBody] = useState(article?.en_body || '');

  function parseTags(): { zh: string; en: string }[] {
    return tagsStr.split(',').map(s => {
      const parts = s.trim().split('/');
      return { zh: (parts[0] || '').trim(), en: (parts[1] || '').trim() };
    }).filter(t => t.zh && t.en);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const data: ArticleInput = {
      section,
      date,
      tags: parseTags(),
      zh_title: zhTitle,
      zh_desc: zhDesc,
      zh_body: zhBody,
      en_title: enTitle,
      en_desc: enDesc,
      en_body: enBody,
    };

    const url = article ? `/api/articles/${article.id}` : '/api/articles';
    const method = article ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const err = await res.json();
        setError(err.error || 'Save failed');
      }
    } catch {
      setError('Network error');
    }

    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '700px' }}>
      <h2 style={{
        fontSize: '20px', fontWeight: 800, marginBottom: '20px',
        letterSpacing: '-0.02em', borderBottom: '3px solid #000', paddingBottom: '12px'
      }}>
        {article ? '编辑文章' : '新建文章'}
      </h2>

      {error && (
        <p style={{ color: '#DE2A18', fontWeight: 700, marginBottom: '16px' }}>{error}</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={labelStyle}>分区</label>
          <select value={section} onChange={e => setSection(e.target.value)} style={inputStyle}>
            <option value="articles">文章</option>
            <option value="project">项目</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>日期</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>标签 (格式: 中文/English, 中文/English)</label>
        <input
          type="text" value={tagsStr} onChange={e => setTagsStr(e.target.value)}
          style={inputStyle} placeholder="交易/Trading, 哲学/Philosophy"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <h3 style={langHeadingStyle}>中文</h3>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>标题</label>
            <input type="text" value={zhTitle} onChange={e => setZhTitle(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>摘要</label>
            <input type="text" value={zhDesc} onChange={e => setZhDesc(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>正文 (用换行分段)</label>
            <textarea value={zhBody} onChange={e => setZhBody(e.target.value)} style={{ ...inputStyle, minHeight: '200px' }} />
          </div>
        </div>
        <div>
          <h3 style={langHeadingStyle}>English</h3>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Title</label>
            <input type="text" value={enTitle} onChange={e => setEnTitle(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Description</label>
            <input type="text" value={enDesc} onChange={e => setEnDesc(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Body (newlines for paragraphs)</label>
            <textarea value={enBody} onChange={e => setEnBody(e.target.value)} style={{ ...inputStyle, minHeight: '200px' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" disabled={saving} style={submitStyle}>
          {saving ? '保存中...' : '保存'}
        </button>
        <button type="button" onClick={() => router.back()} style={cancelStyle}>
          取消
        </button>
      </div>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: 700
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '2px solid #000',
  fontSize: '13px', fontFamily: 'system-ui, sans-serif', outline: 'none'
};

const langHeadingStyle: React.CSSProperties = {
  fontSize: '14px', fontWeight: 700, marginBottom: '12px',
  borderBottom: '2px solid #000', paddingBottom: '4px'
};

const submitStyle: React.CSSProperties = {
  padding: '10px 20px', border: '2px solid #000', background: '#000',
  color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
  fontFamily: 'inherit', boxShadow: '3px 3px 0 #000'
};

const cancelStyle: React.CSSProperties = {
  padding: '10px 20px', border: '2px solid #000', background: '#fff',
  color: '#000', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
  fontFamily: 'inherit', boxShadow: '3px 3px 0 #000'
};
