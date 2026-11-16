"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { retailers } from "@/lib/retailers";
import type { Interest, InterestId, Product, RetailerId } from "@/types";
import { type Filters, type PriceId, type SortId, matchesPrice, priceOptions, sortOptions } from "./shop-filters";

type FilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  products: Product[];
  interests: Interest[];
  resultCount: number;
  onToggleInterest: (id: InterestId) => void;
  onToggleRetailer: (id: RetailerId) => void;
  onPriceChange: (price: PriceId) => void;
  onSortChange: (sort: SortId) => void;
  onClear: () => void;
};

function OptionRow({
  type,
  checked,
  label,
  count,
  onChange,
  name,
}: {
  type: "checkbox" | "radio";
  checked: boolean;
  label: string;
  count?: number;
  onChange: () => void;
  name?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-2 text-[15px]">
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`grid size-5 shrink-0 place-items-center border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-clay ${
          type === "radio" ? "rounded-full" : "rounded"
        } ${checked ? "border-forest bg-forest text-white" : "border-stone/50 bg-white"}`}
      >
        {checked && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
      </span>
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-sm text-stone">{count}</span>}
    </label>
  );
}

export function FilterDrawer({
  open,
  onClose,
  filters,
  products,
  interests,
  resultCount,
  onToggleInterest,
  onToggleRetailer,
  onPriceChange,
  onSortChange,
  onClear,
}: FilterDrawerProps) {
  const panelRef = useModal(open, onClose);
  const retailerIds = [...new Set(products.map((product) => product.retailer))];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Sort and filter"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-paper shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="text-lg font-semibold">Sort & filter</h2>
              <button
                type="button"
                onClick={onClose}
                className="grid size-10 place-items-center rounded-full hover:bg-cream"
                aria-label="Close filters"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <div className="flex-1 divide-y divide-line overflow-y-auto px-6">
              <fieldset className="py-5">
                <legend className="eyebrow mb-2 text-stone">Sort by</legend>
                {sortOptions.map((option) => (
                  <OptionRow
                    key={option.id}
                    type="radio"
                    name="sort"
                    label={option.label}
                    checked={filters.sort === option.id}
                    onChange={() => onSortChange(option.id)}
                  />
                ))}
              </fieldset>

              <fieldset className="py-5">
                <legend className="eyebrow mb-2 text-stone">Interests</legend>
                {interests.map((interest) => (
                  <OptionRow
                    key={interest.id}
                    type="checkbox"
                    label={interest.label}
                    count={products.filter((product) => product.interests.includes(interest.id)).length}
                    checked={filters.interests.includes(interest.id)}
                    onChange={() => onToggleInterest(interest.id)}
                  />
                ))}
              </fieldset>

              <fieldset className="py-5">
                <legend className="eyebrow mb-2 text-stone">Price</legend>
                <OptionRow
                  type="radio"
                  name="price"
                  label="Any price"
                  checked={filters.price === "all"}
                  onChange={() => onPriceChange("all")}
                />
                {priceOptions.map((option) => (
                  <OptionRow
                    key={option.id}
                    type="radio"
                    name="price"
                    label={option.label}
                    count={products.filter((product) => matchesPrice(product, option.id)).length}
                    checked={filters.price === option.id}
                    onChange={() => onPriceChange(option.id)}
                  />
                ))}
              </fieldset>

              <fieldset className="py-5">
                <legend className="eyebrow mb-2 text-stone">Retailer</legend>
                {retailerIds.map((id) => (
                  <OptionRow
                    key={id}
                    type="checkbox"
                    label={retailers[id].name}
                    count={products.filter((product) => product.retailer === id).length}
                    checked={filters.retailers.includes(id)}
                    onChange={() => onToggleRetailer(id)}
                  />
                ))}
              </fieldset>
            </div>

            <div className="flex gap-3 border-t border-line px-6 py-4">
              <button
                type="button"
                onClick={onClear}
                className="h-12 flex-1 border border-ink text-sm font-semibold transition-colors hover:bg-cream"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-12 flex-[1.4] bg-forest text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
              >
                Show {resultCount} {resultCount === 1 ? "gift" : "gifts"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
