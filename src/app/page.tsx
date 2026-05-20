import Shell from '@/components/shell';
import HomeHero from '@/components/home-hero';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <Shell>
      <HomeHero />
    </Shell>
  );
}
