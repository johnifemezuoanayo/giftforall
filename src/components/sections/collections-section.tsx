import { CollectionCard } from "@/components/cards/collection-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Collection } from "@/types";

export function CollectionsSection({ collections }: { collections: Collection[] }) {
  const [first, ...rest] = collections;
  if (!first) return null;

  return (
    <section aria-labelledby="collections-title" className="pb-20 md:pb-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="collections-title"
            eyebrow="Curated collections"
            title="Discover something different."
            text="Hand-picked edits for when you want a gift with a bit of personality."
            link={{ label: "All collections", href: "/collections" }}
          />
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:grid-rows-2">
          <Reveal className="sm:col-span-2 lg:row-span-2">
            <CollectionCard collection={first} number={1} large />
          </Reveal>
          {rest.map((collection, index) => (
            <Reveal key={collection.id} delay={0.06 * (index + 1)}>
              <CollectionCard collection={collection} number={index + 2} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
