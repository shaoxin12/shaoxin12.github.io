import Link from 'next/link';

export default function HomeHero() {
  return (
    <section className="section active home-section">
      <div className="home-hero">
        <h1 className="home-name">杨少新</h1>
        <p className="home-tagline">
          <span data-zh>构建、交易、写作</span>
          <span data-en>Build, Trade, Write</span>
        </p>
      </div>
      <div className="home-cards">
        <Link href="/project" className="home-card">
          <span className="home-card-arrow">→</span>
          <span className="home-card-title" data-zh>项目</span>
          <span className="home-card-title" data-en>Project</span>
          <span className="home-card-sub" data-zh>作品与实验</span>
          <span className="home-card-sub" data-en>Works &amp; Experiments</span>
        </Link>
        <Link href="/articles" className="home-card">
          <span className="home-card-arrow">→</span>
          <span className="home-card-title" data-zh>文章</span>
          <span className="home-card-title" data-en>Articles</span>
          <span className="home-card-sub" data-zh>交易笔记与思考</span>
          <span className="home-card-sub" data-en>Trading Notes &amp; Thoughts</span>
        </Link>
      </div>
    </section>
  );
}
