import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteUrl } from "@/config/site";
import { GiftIcon } from "@/components/icons/promise-icons";
import { ProductCard } from "@/components/product/product-card";
import { Carousel } from "@/components/ui/carousel";
import {
  getArticle,
  getCatalog,
  getInterestsForListing,
  getPageHref,
  getProductsForListing,
  getTopPicks,
} from "@/lib/catalog";
import type { ListingPage } from "@/types";
import { FeatureHeader } from "./feature-header";
import { ListingShop } from "./listing-shop";

const pillClass =
  "inline-flex h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-gold/25 px-5 text-sm font-semibold text-forest transition-colors hover:bg-gold/50";

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getListingMetadata(page: ListingPage): Metadata {
  const title = page.metaTitle ?? (page.section === "gifts" ? `Unique Gifts for ${page.label}` : capitalize(page.title));
  return {
    title,
    description: `${page.tagline} Browse unusual, thoughtful ${page.title} from retailers you already know.`,
    openGraph: { title, description: page.tagline, images: [{ url: `${page.feature.image.src}?w=1200&h=630&fit=crop&q=80` }] },
  };
}

export async function ListingView({ page }: { page: ListingPage }) {
  const catalog = await getCatalog();
  const { sections, similarCategories, articles } = catalog.content;
  const section = sections[page.section];
  const pageHref = getPageHref(page, sections);
  const products = getProductsForListing(page, catalog.products);
  const pageInterests = getInterestsForListing(page, products, catalog.categories);
  const topPicks = getTopPicks(products);
  const guide = getArticle(articles, page.guideId);
  const relatedPages = page.related
    .map((slug) => catalog.pages.find((item) => item.section === page.section && item.slug === slug))
    .filter((item) => item !== undefined);
  const isSectionHome = page.slug === "";
  const similar = similarCategories.filter((item) => item.href !== pageHref).slice(0, 5);

  const crumbs = [{ label: "Home", href: "/" }, ...(isSectionHome ? [] : [section.parent]), { label: page.title, href: pageHref }];

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `${siteUrl}${crumb.href === "/" ? "" : crumb.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData).replace(/</g, "\\u003c") }}
      />

      <div className="container-page pt-4 md:pt-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-stone">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              return (
                <li key={crumb.href + index} className="flex items-center gap-1">
                  {index > 0 && <ChevronRight className="size-3.5" aria-hidden />}
                  {isLast ? (
                    <span aria-current="page" className="font-medium text-ink">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-forest hover:underline">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <FeatureHeader feature={page.feature} giftCount={products.length} />

        <ListingShop
          gridTitle={page.gridTitle ?? `all ${page.title}`}
          products={products}
          interests={pageInterests}
          guide={guide}
        >
          {relatedPages.length > 0 && (
            <section aria-labelledby="related-pills-title" className="pt-14 text-center md:pt-16">
              <h2 id="related-pills-title" className="text-xl font-semibold text-forest md:text-2xl">
                {section.pillsTitle}
              </h2>
              <ul className="no-scrollbar -mx-5 mt-5 flex gap-3 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:justify-center md:px-0">
                {relatedPages.map((related) => (
                  <li key={related.slug}>
                    <Link href={getPageHref(related, sections)} className={`${pillClass} md:min-w-40`}>
                      {related.label.toLowerCase()}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="top-picks-title" className="pt-14 md:pt-16">
            <h2 id="top-picks-title" className="mb-6 text-center text-xl font-semibold text-forest md:text-2xl">
              {page.picksTitle ?? `most-loved ${page.title}`}
            </h2>
            <Carousel label={page.picksTitle ?? `Most-loved ${page.title}`}>
              {topPicks.map((product) => (
                <div key={product.id} className="w-[64vw] shrink-0 snap-start sm:w-[40vw] md:w-[30vw] lg:w-[22vw] xl:w-[260px]">
                  <ProductCard product={product} sizes="(min-width: 1280px) 260px, (min-width: 768px) 30vw, 64vw" />
                </div>
              ))}
            </Carousel>
          </section>
        </ListingShop>
      </div>

      <section aria-labelledby="about-title" className="container-page mt-20 md:mt-28">
        <div className="grid gap-6 border-t border-line pt-10 md:grid-cols-12 md:gap-10 md:pt-14">
          <h2 id="about-title" className="font-display text-2xl leading-tight md:col-span-4 md:text-3xl">
            how we pick {page.title}
          </h2>
          <div className="space-y-4 leading-relaxed text-ink-soft md:col-span-8">
            <p>{page.about}</p>
            {relatedPages.length > 0 && (
              <p>
                {section.relatedLead}{" "}
                {relatedPages.map((related, index) => (
                  <span key={related.slug}>
                    <Link
                      href={getPageHref(related, sections)}
                      className="font-semibold text-forest underline decoration-gold decoration-2 underline-offset-4 hover:decoration-forest"
                    >
                      {related.title}
                    </Link>
                    {index < relatedPages.length - 2 ? ", " : index === relatedPages.length - 2 ? " or " : "."}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="similar-title" className="container-page mt-16 text-center md:mt-20">
        <h2 id="similar-title" className="text-xl font-semibold text-forest md:text-2xl">
          similar categories
        </h2>
        <ul className="no-scrollbar -mx-5 mt-5 flex gap-3 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:justify-center md:px-0">
          {similar.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={pillClass}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="find-gift-title" className="container-page mb-20 mt-16 md:mb-28 md:mt-20">
        <div className="flex flex-col items-center rounded-3xl bg-mint px-6 py-12 text-center md:py-16">
          <span className="grid size-20 place-items-center rounded-full bg-white">
            <GiftIcon className="size-12 text-forest" />
          </span>
          <h2 id="find-gift-title" className="mt-5 font-display text-3xl text-forest md:text-5xl">
            find a gift they&apos;ll love
          </h2>
          <p className="mt-3 max-w-md text-ink-soft">
            Not sure where to start? Pick a budget or let our gift finder do the thinking.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/gift-finder"
              className="inline-flex h-12 items-center rounded-full bg-forest px-7 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
            >
              try the gift finder
            </Link>
            <Link
              href="/discover/under-25"
              className="inline-flex h-12 items-center rounded-full border-2 border-forest px-6 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white"
            >
              under $25
            </Link>
            <Link
              href="/discover/under-50"
              className="inline-flex h-12 items-center rounded-full border-2 border-forest px-6 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white"
            >
              under $50
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
