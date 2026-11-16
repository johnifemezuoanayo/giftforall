import { ArticleCard } from "@/components/cards/article-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Article } from "@/types";

export function GuidesSection({ articles }: { articles: Article[] }) {
  const [feature, second, ...others] = articles;
  if (!feature || !second) return null;

  return (
    <section aria-labelledby="guides-title" className="py-20 md:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="guides-title"
            eyebrow="Gift guides & stories"
            title="Good gifts start with good ideas."
            link={{ label: "Read all guides", href: "/guides" }}
          />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <ArticleCard article={feature} variant="feature" />
          </Reveal>

          <div className="flex flex-col gap-10 lg:col-span-5 lg:border-l lg:border-line lg:pl-10">
            <Reveal delay={0.08}>
              <ArticleCard article={second} />
            </Reveal>
            <div className="flex flex-col gap-6 border-t border-line pt-8">
              {others.map((article, index) => (
                <Reveal key={article.id} delay={0.12 + index * 0.06}>
                  <ArticleCard article={article} variant="compact" />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
