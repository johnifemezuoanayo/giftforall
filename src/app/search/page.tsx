import { Suspense } from "react";
import type { Metadata } from "next";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Search, Sparkles } from "lucide-react";
import { GiftIcon } from "@/components/icons/promise-icons";
import { Headline } from "@/components/listing/feature-header";
import { ListingShop } from "@/components/listing/listing-shop";
import { ProductCard } from "@/components/product/product-card";
import { Carousel } from "@/components/ui/carousel";
import { getCategories, getContent, getListingPages, getProducts, searchProducts, type SearchUnderstood } from "@/lib/api";
import { getPageHref, getTopPicks } from "@/lib/catalog";
import type { Interest, ListingPage, Product } from "@/types";

const pillClass =
  "inline-flex h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-gold/25 px-5 text-sm font-semibold text-forest transition-colors hover:bg-gold/50";

const audienceNames: Record<string, string> = {
  men: "for him",
  women: "for her",
  kids: "for kids",
  couples: "for couples",
};

// Small words that would match almost every gift page.
const commonWords = new Set(["for", "the", "and", "gift", "gifts", "my", "who", "has", "under", "with", "ideas", "your"]);

function readQuery(value: string | string[] | undefined) {
  const text = Array.isArray(value) ? value[0] : value;
  return (text ?? "").trim().slice(0, 200);
}

function searchLink(text: string) {
  return `/search?q=${encodeURIComponent(text)}`;
}

function sameWord(a: string, b: string) {
  return a === b || a === `${b}s` || b === `${a}s`;
}

// Gift pages whose name shares a word with the search, like "Secret Santa" for "secret santa gifts".
function findMatchingPages(query: string, pages: ListingPage[]) {
  const queryWords = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !commonWords.has(word));
  if (queryWords.length === 0) return [];

  return pages
    .filter((page) => page.slug)
    .filter((page) => {
      const pageWords = `${page.label} ${page.title}`.toLowerCase().split(/[^a-z0-9]+/);
      return queryWords.some((word) => pageWords.some((pageWord) => sameWord(word, pageWord)));
    })
    .slice(0, 6);
}

// Categories that appear in the results, most common first.
function getResultCategories(products: Product[], categories: Interest[]) {
  return categories
    .map((category) => ({ category, count: products.filter((product) => product.interests.includes(category.id)).length }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .map((item) => item.category);
}

function describeSearch(understood: SearchUnderstood, categories: Interest[]) {
  const parts: string[] = [];
  understood.audiences.forEach((audience) => parts.push(audienceNames[audience] ?? audience));
  understood.categories.forEach((id) => {
    const label = categories.find((category) => category.id === id)?.label;
    if (label) parts.push(label);
  });
  if (understood.maxPrice !== null) parts.push(`under $${understood.maxPrice}`);
  return parts;
}

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const query = readQuery((await searchParams).q);
  return {
    title: query ? `Search results for "${query}"` : "Search gifts",
    robots: { index: false, follow: true },
  };
}

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchContent searchParams={searchParams} />
    </Suspense>
  );
}

function SearchSkeleton() {
  return (
    <div className="container-page animate-pulse pt-4 md:pt-6" aria-busy="true" aria-label="Loading search results">
      <div className="h-3 w-40 rounded bg-sand" />
      <div className="mx-auto mt-10 h-12 w-2/3 rounded-lg bg-sand" />
      <div className="mx-auto mt-6 h-14 max-w-2xl rounded-full bg-sand" />
      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="aspect-[4/5] bg-sand" />
        ))}
      </div>
    </div>
  );
}

function SearchBox({ query }: { query: string }) {
  return (
    <Form action="/search" role="search" className="mx-auto mt-7 flex max-w-2xl items-center gap-2 rounded-full border border-forest bg-white p-1.5 pl-5">
      <Search className="size-5 shrink-0 text-forest" aria-hidden />
      <label htmlFor="search-page-input" className="sr-only">
        Search for gifts
      </label>
      <input
        key={query}
        id="search-page-input"
        name="q"
        type="search"
        defaultValue={query}
        placeholder="Try “gifts for dad under $50”"
        autoComplete="off"
        className="h-11 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-stone/80 [&::-webkit-search-cancel-button]:hidden"
      />
      <button
        type="submit"
        className="h-11 shrink-0 rounded-full bg-forest px-6 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
      >
        Search
      </button>
    </Form>
  );
}

function SearchPills({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-label={title} className="pt-12 text-center">
      <h2 className="text-xl font-semibold text-forest md:text-2xl">{title}</h2>
      <ul className="no-scrollbar -mx-5 mt-5 flex gap-3 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:justify-center md:px-0">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={pillClass}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

async function SearchContent({ searchParams }: { searchParams: PageProps<"/search">["searchParams"] }) {
  const query = readQuery((await searchParams).q);
  const [content, pages, categories] = await Promise.all([getContent(), getListingPages(), getCategories()]);
  const popularLinks = content.popularSearches.map((term) => ({ label: term, href: searchLink(term) }));

  const breadcrumb = (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-stone">
        <li>
          <Link href="/" className="hover:text-forest hover:underline">
            Home
          </Link>
        </li>
        <li className="flex items-center gap-1">
          <ChevronRight className="size-3.5" aria-hidden />
          <span aria-current="page" className="font-medium text-ink">
            Search
          </span>
        </li>
      </ol>
    </nav>
  );

  if (!query) {
    return (
      <div className="container-page pb-20 pt-4 md:pb-28 md:pt-6">
        {breadcrumb}
        <header className="mt-8 text-center md:mt-12">
          <h1 className="font-display text-[2.3rem] leading-[1.1] sm:text-5xl">
            <Headline text="what are you looking for?" highlight="looking" />
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-ink-soft">
            Search by person, occasion, budget or anything they love. We&apos;ll find the gifts that fit.
          </p>
          <SearchBox query="" />
        </header>

        <SearchPills title="popular searches" items={popularLinks} />

        <section aria-labelledby="browse-title" className="mt-14 rounded-3xl bg-mint px-4 py-8 md:px-8 md:py-10">
          <h2 id="browse-title" className="text-center text-xl font-semibold text-forest md:text-2xl">
            browse by interest
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={searchLink(category.label)}
                  className="group block overflow-hidden rounded-xl bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-16px_rgba(15,90,58,0.5)]"
                >
                  <span className="relative block aspect-[4/3.4] overflow-hidden bg-sand">
                    <Image
                      src={category.image.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 15vw, (min-width: 640px) 30vw, 45vw"
                      quality={70}
                      className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
                    />
                  </span>
                  <span className="flex min-h-14 items-center justify-center px-2 py-3 text-center text-[15px] leading-tight">
                    {category.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  const { products, understood } = await searchProducts(query);
  const matchingPages = findMatchingPages(query, pages).map((page) => ({
    label: page.title.toLowerCase(),
    href: getPageHref(page, content.sections),
  }));
  const lookedFor = describeSearch(understood, categories);
  const hasResults = products.length > 0;

  return (
    <div className="container-page pt-4 md:pt-6">
      {breadcrumb}

      <header className="mt-8 text-center md:mt-10">
        <p className="eyebrow text-clay">Search results</p>
        <h1 className="mt-3 break-words font-display text-[2rem] leading-[1.15] sm:text-[2.6rem]">
          {hasResults ? (
            <>
              {products.length} {products.length === 1 ? "result" : "results"} for{" "}
              <span className="text-forest">“{query}”</span>
            </>
          ) : (
            <>no gifts found for “{query}”</>
          )}
        </h1>
        {hasResults && lookedFor.length > 0 && (
          <p className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-ink-soft">
            <Sparkles className="size-4 text-gold" aria-hidden />
            We looked for gifts
            {lookedFor.map((part) => (
              <span key={part} className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-forest">
                {part}
              </span>
            ))}
          </p>
        )}
        <SearchBox query={query} />
      </header>

      {hasResults ? (
        <div className="pb-6">
          <ListingShop
            gridTitle={`results for “${query}”`}
            products={products}
            interests={getResultCategories(products, categories).slice(0, 6)}
          >
            <SearchPills title="matching gift guides" items={matchingPages} />
          </ListingShop>
        </div>
      ) : (
        <NoResults query={query} matchingPages={matchingPages} popularLinks={popularLinks} />
      )}

      <section aria-labelledby="search-finder-title" className="mb-20 mt-16 md:mb-28 md:mt-20">
        <div className="flex flex-col items-center rounded-3xl bg-mint px-6 py-12 text-center md:py-16">
          <span className="grid size-20 place-items-center rounded-full bg-white">
            <GiftIcon className="size-12 text-forest" />
          </span>
          <h2 id="search-finder-title" className="mt-5 font-display text-3xl text-forest md:text-5xl">
            still not sure?
          </h2>
          <p className="mt-3 max-w-md text-ink-soft">Answer four quick questions and our gift finder will do the thinking.</p>
          <Link
            href="/gift-finder"
            className="mt-7 inline-flex h-12 items-center rounded-full bg-forest px-7 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
          >
            try the gift finder
          </Link>
        </div>
      </section>
    </div>
  );
}

async function NoResults({
  query,
  matchingPages,
  popularLinks,
}: {
  query: string;
  matchingPages: { label: string; href: string }[];
  popularLinks: { label: string; href: string }[];
}) {
  const products = await getProducts();
  const trending = products.filter((product) => product.trending);
  const suggestions = getTopPicks(trending.length > 0 ? trending : products, 8);

  return (
    <>
      <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-cream px-6 py-10 text-center">
        <p className="text-lg font-semibold">Nothing matched “{query}” yet.</p>
        <ul className="mx-auto mt-4 max-w-md space-y-2 text-left text-sm text-ink-soft">
          <li className="flex gap-3">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-forest" aria-hidden />
            Check the spelling, or try a shorter search like “candles” or “gadgets”.
          </li>
          <li className="flex gap-3">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-forest" aria-hidden />
            Search by who it&apos;s for, like “gifts for mom”, or by budget, like “under $25”.
          </li>
        </ul>
      </div>

      <SearchPills title="matching gift guides" items={matchingPages} />
      <SearchPills title="popular searches" items={popularLinks} />

      {suggestions.length > 0 && (
        <section aria-labelledby="search-suggestions-title" className="pt-14 md:pt-16">
          <h2 id="search-suggestions-title" className="mb-6 text-center text-xl font-semibold text-forest md:text-2xl">
            popular right now
          </h2>
          <Carousel label="Popular gifts right now">
            {suggestions.map((product) => (
              <div key={product.id} className="w-[64vw] shrink-0 snap-start sm:w-[40vw] md:w-[30vw] lg:w-[22vw] xl:w-[260px]">
                <ProductCard product={product} sizes="(min-width: 1280px) 260px, (min-width: 768px) 30vw, 64vw" />
              </div>
            ))}
          </Carousel>
        </section>
      )}
    </>
  );
}
