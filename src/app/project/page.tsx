import Shell from '@/components/shell';
import CardList from '@/components/card-list';
import { getArticles, getSectionNames } from '@/lib/articles';

export const revalidate = 60;

export default async function ProjectPage() {
  const articles = await getArticles('project');
  const sectionNames = await getSectionNames();
  const sn = sectionNames.project;

  return (
    <Shell currentSection="project">
      <section className="section active">
        <h2 className="section-title">
          <span data-zh>{sn.zh}</span>
          <span data-en>{sn.en}</span>
        </h2>
        <div className="section-divider"></div>
        <CardList articles={articles} section="project" />
      </section>
    </Shell>
  );
}
