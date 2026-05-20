'use client';

import { useState } from 'react';

export default function PublishButton() {
  const [status, setStatus] = useState<'idle' | 'publishing' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function publish() {
    if (status === 'publishing') return;
    setStatus('publishing');
    setMessage('');

    try {
      const res = await fetch('/api/publish', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        setStatus('done');
        setMessage(`已发布！${data.url}`);
      } else {
        setStatus('error');
        setMessage(data.error || '发布失败');
      }
    } catch {
      setStatus('error');
      setMessage('网络错误');
    }
  }

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button
        onClick={publish}
        disabled={status === 'publishing'}
        style={{
          border: '2px solid #000',
          padding: '6px 14px',
          fontSize: '12px',
          fontWeight: 700,
          color: '#fff',
          background: '#DE2A18',
          cursor: status === 'publishing' ? 'default' : 'pointer',
          fontFamily: 'inherit',
          boxShadow: '2px 2px 0 #000',
          whiteSpace: 'nowrap',
        }}
      >
        {status === 'publishing' ? '发布中...' : status === 'done' ? '已发布 ✓' : '发布到公网'}
      </button>
      {message && (
        <span style={{
          fontSize: '11px', fontWeight: 600,
          color: status === 'error' ? '#DE2A18' : '#000',
          maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
        }}>
          {message}
        </span>
      )}
    </div>
  );
}
