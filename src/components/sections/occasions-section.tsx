import { OccasionCard } from "@/components/cards/occasion-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Occasion } from "@/types";

export function OccasionsSection({ occasions }: { occasions: Occasion[] }) {
  return (
    <section aria-labelledby="occasions-title" className="bg-cream py-20 md:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="occasions-title"
            eyebrow="Shop by occasion"
            title="A gift for every moment."
            text="Big days, small wins and everything in between."
            link={{ label: "All occasions", href: "/gifts/occasion" }}
          />
        </Reveal>

        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 scroll-px-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:gap-5 lg:grid-cols-3">
          {occasions.map((occasion, index) => (
            <li key={occasion.id} className="w-[78vw] shrink-0 snap-start sm:w-auto">
              <Reveal delay={(index % 3) * 0.06}>
                <OccasionCard occasion={occasion} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
