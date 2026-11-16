"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { retailers } from "@/lib/retailers";
import type { Article, Interest, InterestId, Product, RetailerId } from "@/types";
import { FilterDrawer } from "./filter-drawer";
import { GuideTile } from "./guide-tile";
import {
  type Filters,
  type PriceId,
  type SortId,
  countActiveFilters,
  emptyFilters,
  filterProducts,
  priceOptions,
  sortOptions,
} from "./shop-filters";

const PAGE_SIZE = 12;
// The guide tile shows up after this many products.
const GUIDE_POSITION = 6;

type ListingShopProps = {
  gridTitle: string;
  products: Product[];
  interests: Interest[];
  guide?: Article;
  children?: React.ReactNode;
};

export function ListingShop({ gridTitle, products, interests, guide, children }: ListingShopProps) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const results = filterProducts(products, filters);
  const visible = results.slice(0, visibleCount);
  const activeCount = countActiveFilters(filters);

  type GridItem = { type: "product"; product: Product } | { type: "guide" };
  const gridItems: GridItem[] = visible.map((product) => ({ type: "product", product }));
  if (guide && visible.length > GUIDE_POSITION) gridItems.splice(GUIDE_POSITION, 0, { type: "guide" });

  function updateFilters(changes: Partial<Filters>) {
    setFilters((current) => ({ ...current, ...changes }));
    setVisibleCount(PAGE_SIZE);
  }

  function toggleInterest(id: InterestId) {
    const list = filters.interests.includes(id)
      ? filters.interests.filter((item) => item !== id)
      : [...filters.interests, id];
    updateFilters({ interests: list });
  }

  function toggleRetailer(id: RetailerId) {
    const list = filters.retailers.includes(id)
      ? filters.retailers.filter((item) => item !== id)
      : [...filters.retailers, id];
    updateFilters({ retailers: list });
  }

  function pickInterestTile(id: InterestId) {
    toggleInterest(id);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("gifts")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }

  function clearAll() {
    updateFilters({ interests: [], price: "all", retailers: [] });
  }

  const activeChips: { key: string; label: string; remove: () => void }[] = [
    ...filters.interests.map((id) => ({
      key: id,
      label: interests.find((interest) => interest.id === id)?.label ?? id,
      remove: () => toggleInterest(id),
    })),
    ...(filters.price === "all"
      ? []
      : [
          {
            key: filters.price,
            label: priceOptions.find((option) => option.id === filters.price)?.label ?? "",
            remove: () => updateFilters({ price: "all" }),
          },
        ]),
    ...filters.retailers.map((id) => ({ key: id, label: retailers[id].name, remove: () => toggleRetailer(id) })),
  ];

  return (
    <>
      {interests.length > 0 && (
        <div className="mt-6 rounded-3xl bg-mint px-4 pb-8 pt-8 md:px-8 md:pb-10 md:pt-10">
          <h2 className="text-center text-xl font-semibold text-forest md:text-2xl">shop by interest</h2>
          <ul className="no-scrollbar -mx-4 mt-6 flex snap-x gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-6">
            {interests.map((interest) => {
              const selected = filters.interests.includes(interest.id);
              return (
                <li key={interest.id} className="w-[38vw] max-w-[180px] shrink-0 snap-start md:w-auto md:max-w-none">
                  <button
                    type="button"
                    onClick={() => pickInterestTile(interest.id)}
                    aria-pressed={selected}
                    className={`group relative block w-full overflow-hidden rounded-xl bg-white text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-16px_rgba(15,90,58,0.5)] ${
                      selected ? "ring-2 ring-forest" : ""
                    }`}
                  >
                    <span className="relative block aspect-[4/3.4] overflow-hidden bg-sand">
                      <Image
                        src={interest.image.src}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 15vw, (min-width: 768px) 30vw, 38vw"
                        quality={70}
                        className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
                      />
                      {selected && (
                        <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-forest text-white">
                          <Check className="size-4" strokeWidth={3} aria-hidden />
                        </span>
                      )}
                    </span>
                    <span className="flex min-h-14 items-center justify-center px-2 py-3 text-center text-[15px] leading-tight">
                      {interest.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {children}

      <section id="gifts" aria-labelledby="gifts-title" className="scroll-mt-36 pt-14 md:pt-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="gifts-title" className="font-display text-[1.75rem] leading-tight md:text-4xl">
            {gridTitle}
          </h2>
          <p className="text-sm text-stone" aria-live="polite">
            {results.length} {results.length === 1 ? "gift" : "gifts"}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-y border-line py-3 md:flex-row md:items-center md:justify-between">
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0" role="group" aria-label="Filter by price">
            {priceOptions.map((option) => {
              const active = filters.price === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => updateFilters({ price: active ? "all" : option.id })}
                  aria-pressed={active}
                  className={`h-9 shrink-0 rounded-full border px-4 text-sm transition-colors ${
                    active ? "border-forest bg-forest text-white" : "border-line bg-white hover:border-forest hover:text-forest"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <label className="relative flex-1 md:flex-none">
              <span className="sr-only">Sort by</span>
              <select
                value={filters.sort}
                onChange={(event) => updateFilters({ sort: event.target.value as SortId })}
                className="h-10 w-full appearance-none rounded-full border border-line bg-white pl-4 pr-10 text-sm hover:border-forest md:w-auto"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    Sort: {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-stone" aria-hidden />
            </label>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex h-10 shrink-0 items-center gap-2 rounded-full border border-forest px-4 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white"
            >
              <SlidersHorizontal className="size-4" aria-hidden />
              Filter
              {activeCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-clay text-[11px] font-bold text-white">
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.remove}
                className="inline-flex h-8 items-center gap-1.5 rounded-full bg-mint pl-3 pr-2 text-sm text-forest transition-colors hover:bg-forest hover:text-white"
                aria-label={`Remove filter: ${chip.label}`}
              >
                {chip.label}
                <X className="size-3.5" aria-hidden />
              </button>
            ))}
            <button type="button" onClick={clearAll} className="ml-1 text-sm font-semibold underline underline-offset-4">
              Clear all
            </button>
          </div>
        )}

        <p className="mt-4 text-xs text-stone">
          We may earn a commission when you buy through links on this page. Prices are sample prices and may change at
          the retailer.
        </p>

        {results.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-cream px-6 py-14 text-center">
            <p className="text-lg font-semibold">No gifts match those filters yet.</p>
            <p className="mt-2 text-sm text-stone">Try removing a filter or choosing a different price range.</p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-6 h-11 rounded-full bg-forest px-6 text-sm font-semibold text-white hover:bg-forest-dark"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            <AnimatePresence mode="popLayout" initial={false}>
              {gridItems.map((item) =>
                item.type === "guide" ? (
                  <motion.li
                    key="guide"
                    layout
                    className="sm:col-span-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {guide && <GuideTile article={guide} />}
                  </motion.li>
                ) : (
                  <motion.li
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={item.product} sizes="(min-width: 1440px) 420px, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw" showDetails />
                  </motion.li>
                ),
              )}
            </AnimatePresence>
          </ul>
        )}

        {results.length > 0 && (
          <div className="mt-14 flex flex-col items-center gap-4">
            <p className="text-sm text-stone">
              Showing {visible.length} of {results.length} gifts
            </p>
            <div className="h-1 w-48 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-forest transition-all duration-500"
                style={{ width: `${(visible.length / results.length) * 100}%` }}
              />
            </div>
            {visible.length < results.length && (
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="mt-2 h-12 rounded-full border-2 border-forest px-8 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white"
              >
                Show more gifts
              </button>
            )}
          </div>
        )}
      </section>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        products={products}
        interests={interests}
        resultCount={results.length}
        onToggleInterest={toggleInterest}
        onToggleRetailer={toggleRetailer}
        onPriceChange={(price: PriceId) => updateFilters({ price })}
        onSortChange={(sort: SortId) => updateFilters({ sort })}
        onClear={clearAll}
      />
    </>
  );
}
