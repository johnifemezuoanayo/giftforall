"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useSaved } from "@/context/saved-context";

export function SavedToast() {
  const { toast, hideToast, openSaved } = useSaved();

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 md:bottom-6">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl bg-ink p-2.5 pr-3 text-paper shadow-xl"
          >
            <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-sand">
              <Image src={toast.product.image.src} alt="" fill sizes="48px" quality={70} className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                <Heart className="size-3.5 fill-blush text-blush" aria-hidden />
                Saved for later
              </span>
              <span className="block truncate text-xs text-paper/70">{toast.product.name}</span>
            </span>
            <button
              type="button"
              onClick={openSaved}
              className="shrink-0 text-xs font-semibold underline underline-offset-4 hover:text-blush"
            >
              View saved
            </button>
            <button
              type="button"
              onClick={hideToast}
              className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-paper/10"
              aria-label="Dismiss"
            >
              <X className="size-4" aria-hidden />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
