"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Search, X } from "lucide-react";
import { publicApiUrl } from "@/config/site";
import { useSiteData } from "@/context/site-data-context";
import { formatPrice } from "@/lib/format";
import { getRetailerName } from "@/lib/retailers";
import type { Product } from "@/types";

export const SEARCH_INPUT_ID = "site-search";

function searchPageLink(text: string) {
  return `/search?q=${encodeURIComponent(text.trim())}`;
}

export function HeaderSearch({ className = "" }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [matches, setMatches] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const { exampleSearches, popularSearches } = useSiteData();
  const boxRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const text = query.trim().toLowerCase();

  useEffect(() => {
    if (query || reduceMotion || exampleSearches.length === 0) return;
    const timer = setInterval(() => {
      setExampleIndex((index) => (index + 1) % exampleSearches.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [query, reduceMotion, exampleSearches.length]);

  // Wait until the person stops typing before asking the backend.
  useEffect(() => {
    if (!text) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(`${publicApiUrl}/api/products?search=${encodeURIComponent(text)}&limit=5`);
        const data = await response.json();
        if (!cancelled) setMatches(response.ok ? data.products : []);
      } catch {
        if (!cancelled) setMatches([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text]);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);


  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          if (!query.trim()) {
            setOpen(true);
            return;
          }
          setOpen(false);
          router.push(searchPageLink(query));
        }}
        className={`flex h-11 items-center gap-2.5 rounded-full border bg-white pl-5 pr-2 transition-colors ${
          open ? "border-forest" : "border-[#9aa19d] hover:border-forest"
        }`}
      >
        <Search className="size-[18px] shrink-0 text-forest" strokeWidth={2.25} aria-hidden />
        <label htmlFor={SEARCH_INPUT_ID} className="shrink-0 text-[15px] text-forest">
          search
        </label>
        <span aria-hidden className="h-4 w-px shrink-0 bg-forest/60" />

        <div className="relative min-w-0 flex-1">
          <input
            id={SEARCH_INPUT_ID}
            type="search"
            autoComplete="off"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            aria-describedby="search-example"
            className="w-full bg-transparent text-[15px] text-ink outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {!query && (
            <span
              id="search-example"
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center overflow-hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={exampleIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="truncate text-[15px] text-[#868c89]"
                >
                  {exampleSearches[exampleIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          )}
        </div>

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="grid size-8 shrink-0 place-items-center rounded-full text-stone hover:bg-cream"
            aria-label="Clear search"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </form>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full z-50 mt-2 rounded-2xl border border-line bg-white p-5 shadow-[0_24px_40px_-20px_rgba(29,27,24,0.3)]"
          >
            {!text && (
              <>
                <p className="eyebrow text-stone">Popular searches</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <Link
                      key={term}
                      href={searchPageLink(term)}
                      onClick={() => {
                        setQuery(term);
                        setOpen(false);
                      }}
                      className="rounded-full border border-line px-3.5 py-1.5 text-sm transition-colors hover:border-forest hover:text-forest"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </>
            )}

            {text && (
              <div aria-live="polite">
                {searching && matches.length === 0 ? (
                  <p className="text-sm text-stone">Searching…</p>
                ) : matches.length === 0 ? (
                  <p className="text-sm text-stone">
                    No finds match &ldquo;{query}&rdquo; yet. Try another word.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {matches.map((product) => (
                      <li key={product.id}>
                        <a
                          href={product.affiliateUrl}
                          target="_blank"
                          rel="sponsored noopener noreferrer"
                          className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-cream"
                        >
                          <span className="relative size-12 shrink-0 overflow-hidden rounded bg-sand">
                            <Image src={product.image.src} alt="" fill sizes="48px" quality={70} className="object-cover" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold">{product.name}</span>
                            <span className="block text-xs text-stone">
                              {formatPrice(product.price)} · {getRetailerName(product.retailer)}
                            </span>
                          </span>
                          <ArrowUpRight className="ml-auto size-4 shrink-0 text-stone group-hover:text-forest" aria-hidden />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  href={searchPageLink(query)}
                  onClick={() => setOpen(false)}
                  className="group mt-3 flex items-center justify-between gap-3 border-t border-line pt-3 text-sm font-semibold text-forest"
                >
                  See all results for &ldquo;{query.trim()}&rdquo;
                  <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
