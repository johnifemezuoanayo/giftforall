import type { Metadata } from "next";
import { ArticleCard } from "@/components/cards/article-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { getContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Gift guides",
  description: "Short, honest gift guides with hand-picked ideas for every person, budget and occasion.",
};

export default async function GuidesPage() {
  const { articles } = await getContent();

  return (
    <div className="container-page pb-20 pt-4 md:pb-28 md:pt-6">
      <Breadcrumbs
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Gift guides", href: "/guides" },
        ]}
      />

      <header className="mt-10 max-w-2xl md:mt-14">
        <p className="eyebrow text-clay">Gift guides &amp; stories</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.1] md:text-5xl">Good gifts start with good ideas.</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          Short guides with a handful of picks each, for when you know who you&apos;re buying for but not what to get.
        </p>
      </header>

      <ul className="mt-10 grid gap-x-8 gap-y-14 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <li key={article.id}>
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>
    </div>
  );
}
