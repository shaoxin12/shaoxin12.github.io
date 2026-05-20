'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <button
      onClick={logout}
      style={{
        border: 'none', background: 'none', fontSize: '12px', fontWeight: 600,
        color: '#DE2A18', cursor: 'pointer', fontFamily: 'inherit'
      }}
    >
      登出
    </button>
  );
}
