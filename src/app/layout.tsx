import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '杨少新',
  description: 'Personal website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
