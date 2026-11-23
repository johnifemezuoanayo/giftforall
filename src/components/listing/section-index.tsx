import { io } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { getCatalog, getPageHref, getProductsForListing } from "@/lib/catalog";
import type { ListingSection } from "@/types";

type SectionIndexProps = {
  section: ListingSection;
  title: string;
  intro: string;
};

// A page that lists every gift page in one section, like all recipients or all occasions.
export async function SectionIndex({ section, title, intro }: SectionIndexProps) {
  await io();
  const catalog = await getCatalog();
  const { sections } = catalog.content;
  const pages = catalog.pages.filter((page) => page.section === section && page.slug);

  return (
    <div className="container-page pb-20 pt-4 md:pb-28 md:pt-6">
      <Breadcrumbs
        crumbs={[
          { label: "Home", href: "/" },
          { label: sections[section].parent.label, href: sections[section].parent.href },
        ]}
      />

      <header className="mt-10 max-w-2xl md:mt-14">
        <p className="eyebrow text-clay">{pages.length} ways to shop</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.1] md:text-5xl">{title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">{intro}</p>
      </header>

      <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-14 lg:grid-cols-3 xl:grid-cols-4">
        {pages.map((page) => {
          const giftCount = getProductsForListing(page, catalog.products).length;
          return (
            <li key={page.slug}>
              <Link href={getPageHref(page, sections)} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand">
                  <Image
                    src={page.feature.image.src}
                    alt={page.feature.image.alt}
                    fill
                    sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                    quality={70}
                    className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
                  />
                </div>
                <h2 className="mt-4 text-xl font-semibold leading-snug underline-offset-4 group-hover:underline">
                  {page.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-stone">{page.tagline}</p>
                <p className="mt-2 text-xs font-semibold text-forest">{giftCount} gifts</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
