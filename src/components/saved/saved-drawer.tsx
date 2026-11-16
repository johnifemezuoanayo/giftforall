"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Heart, Trash2, X } from "lucide-react";
import { useSaved } from "@/context/saved-context";
import { useModal } from "@/hooks/use-modal";
import { formatPrice } from "@/lib/format";
import { getRetailerName } from "@/lib/retailers";

export function SavedDrawer() {
  const { saved, drawerOpen, closeSaved, removeSaved } = useSaved();
  const panelRef = useModal(drawerOpen, closeSaved);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSaved}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Your saved items"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="flex items-center gap-2.5 font-display text-2xl">
                <Heart className="size-5 fill-clay text-clay" aria-hidden />
                Saved items
                {saved.length > 0 && <span className="text-base font-normal text-stone">({saved.length})</span>}
              </h2>
              <button
                type="button"
                onClick={closeSaved}
                className="grid size-10 place-items-center rounded-full hover:bg-cream"
                aria-label="Close"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {saved.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                  <span className="grid size-16 place-items-center rounded-full bg-mint">
                    <Heart className="size-7 text-forest" aria-hidden />
                  </span>
                  <p className="mt-5 font-display text-xl">Nothing saved yet</p>
                  <p className="mt-2 max-w-xs text-sm text-stone">
                    Tap <strong>Save</strong> on any gift to keep it here for later. No account needed.
                  </p>
                  <button
                    type="button"
                    onClick={closeSaved}
                    className="mt-6 h-11 rounded-full bg-forest px-6 text-sm font-semibold text-white hover:bg-forest-dark"
                  >
                    Keep exploring
                  </button>
                </div>
              ) : (
                <ul>
                  <AnimatePresence initial={false}>
                    {saved.map((product) => (
                      <motion.li
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 border-b border-line py-5"
                      >
                        <div className="relative size-24 shrink-0 overflow-hidden bg-sand">
                          <Image src={product.image.src} alt={product.image.alt} fill sizes="96px" quality={70} className="object-cover" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="eyebrow text-[0.62rem] text-olive">{getRetailerName(product.retailer)}</p>
                          <p className="mt-1 font-semibold leading-snug">{product.name}</p>
                          <p className="mt-1 text-sm">
                            {formatPrice(product.price)}
                            {product.isSampleData && <span className="ml-2 text-xs text-stone">sample price</span>}
                          </p>
                          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-3">
                            <a
                              href={product.affiliateUrl}
                              target="_blank"
                              rel="sponsored noopener noreferrer"
                              className="inline-flex h-8 items-center gap-1 rounded-full bg-ink px-3.5 text-xs font-semibold text-paper transition-colors hover:bg-forest"
                              aria-label={`Check out ${product.name} at ${getRetailerName(product.retailer)} (opens in a new tab)`}
                            >
                              Check it out
                              <ArrowUpRight className="size-3.5" aria-hidden />
                            </a>
                            <button
                              type="button"
                              onClick={() => removeSaved(product.id)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-stone hover:text-clay"
                              aria-label={`Remove ${product.name} from saved items`}
                            >
                              <Trash2 className="size-3.5" aria-hidden />
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {saved.length > 0 && (
              <p className="border-t border-line bg-cream/60 px-6 py-4 text-[11px] leading-relaxed text-stone">
                Saved items stay on this device. You&apos;ll buy on each retailer&apos;s website, where real prices and
                availability may differ from the sample prices shown. We may earn a commission from qualifying purchases.
              </p>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
