import Link from 'next/link';
import LogoutButton from '@/components/admin/logout-button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh', background: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif',
      padding: '24px 32px', maxWidth: '960px', margin: '0 auto'
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '24px', borderBottom: '2px solid #000', paddingBottom: '16px'
      }}>
        <Link href="/admin" style={{
          fontSize: '18px', fontWeight: 800, color: '#000', textDecoration: 'none',
          letterSpacing: '-0.02em'
        }}>
          后台管理
        </Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/admin/new" style={{
            border: '2px solid #000', padding: '6px 14px', fontSize: '12px',
            fontWeight: 700, color: '#000', textDecoration: 'none',
            boxShadow: '2px 2px 0 #000'
          }}>
            + 新建
          </Link>
          <Link href="/" style={{
            fontSize: '12px', fontWeight: 600, color: '#555', textDecoration: 'none'
          }}>
            回网站
          </Link>
          <LogoutButton />
        </div>
      </div>
      {children}
    </div>
  );
}
