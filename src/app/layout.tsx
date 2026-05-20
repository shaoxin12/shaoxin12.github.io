import type { Metadata } from 'next';
import './globals.css';
import LangToggle from '@/components/lang-toggle';

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var saved = localStorage.getItem('lang');
                if (saved) document.documentElement.lang = saved;
              })();
            `,
          }}
        />
      </head>
      <body>
        <LangToggle />
        {children}
      </body>
    </html>
  );
}
