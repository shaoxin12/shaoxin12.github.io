import Sidebar from './sidebar';

export default function Shell({
  children,
  currentSection,
  currentArticleId,
}: {
  children: React.ReactNode;
  currentSection?: string;
  currentArticleId?: number;
}) {
  return (
    <div className="shell">
      <Sidebar currentSection={currentSection} currentArticleId={currentArticleId} />
      <main className="main">{children}</main>
      <div className="mobile-email">yangshaoxin12@gmail.com</div>
    </div>
  );
}
