import Shell from '@/components/shell';

export default function HomePage() {
  return (
    <Shell>
      <section
        className="section active"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 className="home-name">杨少新</h1>
          <p className="home-tagline">
            <span data-zh>构建、交易、写作</span>
            <span data-en>Build, Trade, Write</span>
          </p>
        </div>
      </section>
    </Shell>
  );
}
