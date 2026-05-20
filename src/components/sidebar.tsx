import Link from 'next/link';
import { getArticles, getSectionNames } from '@/lib/articles';

interface SidebarProps {
  currentSection?: string;
  currentArticleId?: number;
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default async function Sidebar({ currentSection, currentArticleId }: SidebarProps) {
  const articles = await getArticles();
  const sectionNames = await getSectionNames();
  const order: ('project' | 'articles')[] = ['project', 'articles'];

  // Group articles by section
  const grouped: Record<string, typeof articles> = {};
  for (const a of articles) {
    if (!grouped[a.section]) grouped[a.section] = [];
    grouped[a.section].push(a);
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand">
          <Link href="/" className="brand-btn" aria-label="Home">
            <span className="brand-dot"></span>
            <span className="brand-name">杨少新</span>
          </Link>
        </div>
        <nav className="sidebar-nav">
          {order.map(key => {
            const sn = sectionNames[key as keyof typeof sectionNames];
            const items = grouped[key] || [];
            const isOpen = currentSection === key;

            return (
              <div key={key} className={`nav-group${isOpen ? ' open' : ''}`}>
                <Link
                  href={`/${key}`}
                  className={`nav-item${isOpen ? ' active' : ''}`}
                >
                  <span className="nav-arrow">{isOpen ? '▾' : '▸'}</span>
                  <span className="nav-zh" data-zh>{sn.zh}</span>
                  <span className="nav-en" data-en>{sn.en}</span>
                  <span className="nav-count">{items.length}</span>
                </Link>
                <div className="sub-list">
                  {items.map(sub => {
                    const isActiveSub = currentArticleId != null && currentArticleId === sub.id && currentSection === key;
                    return (
                      <Link
                        key={sub.id}
                        href={`/${key}/${sub.id}`}
                        className={`sub-item${isActiveSub ? ' active' : ''}`}
                      >
                        <span className="sub-item-title">
                          <span data-zh>{esc(sub.zh_title)}</span>
                          <span data-en>{esc(sub.en_title)}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
      <div className="sidebar-footer">
        <span className="sidebar-email">yangshaoxin12@gmail.com</span>
      </div>
    </aside>
  );
}
