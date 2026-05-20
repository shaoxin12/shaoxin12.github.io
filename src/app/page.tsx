import Shell from '@/components/shell';
import HomeHero from '@/components/home-hero';

export const revalidate = 60;

export default function HomePage() {
  return (
    <Shell>
      <HomeHero />
    </Shell>
  );
}
