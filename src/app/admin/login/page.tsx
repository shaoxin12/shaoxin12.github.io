'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Network error');
    }

    setLoading(false);
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#fff', fontFamily: 'system-ui, sans-serif'
    }}>
      <form onSubmit={handleSubmit} style={{
        border: '3px solid #000', padding: '32px', boxShadow: '4px 4px 0 #000',
        width: '100%', maxWidth: '360px'
      }}>
        <h1 style={{
          fontSize: '24px', fontWeight: 800, marginBottom: '24px',
          textAlign: 'center', letterSpacing: '-0.02em'
        }}>
          后台管理
        </h1>
        <label style={{
          display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '13px'
        }}>
          密码
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%', padding: '10px 12px', border: '2px solid #000',
            fontSize: '14px', fontFamily: 'monospace', outline: 'none',
            marginBottom: '16px'
          }}
          autoFocus
        />
        {error && (
          <p style={{
            color: '#DE2A18', fontSize: '12px', fontWeight: 700, marginBottom: '12px'
          }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '10px', border: '2px solid #000',
            background: '#000', color: '#fff', fontSize: '14px', fontWeight: 700,
            cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit',
            boxShadow: '3px 3px 0 #000'
          }}
        >
          {loading ? '...' : '登录'}
        </button>
      </form>
    </div>
  );
}
