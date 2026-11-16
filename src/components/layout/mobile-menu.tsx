"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart, Search, X } from "lucide-react";
import { useSiteData } from "@/context/site-data-context";
import { useSaved } from "@/context/saved-context";
import { useModal } from "@/hooks/use-modal";
import { Logo } from "./logo";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
};

export function MobileMenu({ open, onClose, onOpenSearch }: MobileMenuProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { saved, openSaved } = useSaved();
  const { mainMenus } = useSiteData();
  const panelRef = useModal(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
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
            aria-label="Main menu"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-paper"
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <Logo />
              <button
                type="button"
                onClick={onClose}
                className="grid size-10 place-items-center rounded-full hover:bg-cream"
                aria-label="Close menu"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="mb-4 flex w-full items-center gap-3 border border-line bg-white px-4 py-3 text-left text-sm text-stone"
              >
                <Search className="size-4" aria-hidden />
                Search for gifts
              </button>

              <ul>
                {mainMenus.map((menu) => {
                  const isOpen = openSection === menu.label;
                  const sectionId = `mobile-${menu.href.replaceAll("/", "-")}`;
                  return (
                    <li key={menu.label} className="border-b border-line">
                      <button
                        type="button"
                        onClick={() => setOpenSection(isOpen ? null : menu.label)}
                        aria-expanded={isOpen}
                        aria-controls={sectionId}
                        className="flex w-full items-center justify-between py-4 text-left font-display text-lg"
                      >
                        {menu.label}
                        <ChevronDown
                          className={`size-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          aria-hidden
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.ul
                            id={sectionId}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            {menu.links.map((link) => (
                              <li key={link.href}>
                                <Link href={link.href} onClick={onClose} className="block py-2 pl-1 text-ink-soft">
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                            <li className="pb-4 pt-2">
                              <Link href={menu.href} onClick={onClose} className="text-sm font-semibold underline underline-offset-4">
                                Shop all {menu.label.toLowerCase()}
                              </Link>
                            </li>
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  openSaved();
                }}
                className="mt-6 flex items-center gap-3 text-sm font-semibold"
              >
                <Heart className="size-4" aria-hidden />
                Saved items ({saved.length})
              </button>
            </div>

            <p className="border-t border-line px-5 py-4 text-xs leading-relaxed text-stone">
              No account needed. Save the gifts you love, then buy from the retailer.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
