import Shell from '@/components/shell';
import CardList from '@/components/card-list';
import TagsBar from '@/components/tags-bar';
import { getArticles, getAllTags, getSectionNames } from '@/lib/articles';

export const revalidate = 60;

interface Props {
  params: Promise<{ tags: string[] }>;
}

export default async function ArticlesTagPage({ params }: Props) {
  const { tags: rawTags } = await params;
  const tags = rawTags.map(t => decodeURIComponent(t));

  const articles = await getArticles('articles', tags);
  const allTags = await getAllTags();
  const sectionNames = await getSectionNames();
  const sn = sectionNames.articles;

  return (
    <Shell currentSection="articles">
      <section className="section active">
        <h2 className="section-title">
          <span data-zh>{sn.zh}</span>
          <span data-en>{sn.en}</span>
        </h2>
        <div className="section-divider"></div>
        <TagsBar allTags={allTags} activeTags={tags} />
        <CardList articles={articles} section="articles" />
      </section>
    </Shell>
  );
}
