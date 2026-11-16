"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { ChevronDown, Gift, Heart, Menu } from "lucide-react";
import { useSiteData } from "@/context/site-data-context";
import { useSaved } from "@/context/saved-context";
import { HeaderSearch, SEARCH_INPUT_ID } from "./header-search";
import { Logo } from "./logo";
import { MegaMenu } from "./mega-menu";
import { MobileMenu } from "./mobile-menu";

function CountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-clay px-1 text-[10px] font-bold leading-none text-white">
      {count}
    </span>
  );
}

const linkClass =
  "flex h-10 items-center gap-2 rounded-full px-2 text-[15px] font-medium text-forest transition-colors hover:text-forest-dark lg:px-2.5";

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { saved, isReady, openSaved } = useSaved();
  const { mainMenus } = useSiteData();

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function showMenu(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  }

  function hideMenuSoon() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  }

  function focusSearch() {
    setTimeout(() => document.getElementById(SEARCH_INPUT_ID)?.focus(), 350);
  }

  const activeMenu = mainMenus.find((menu) => menu.label === openMenu);
  const savedCount = isReady ? saved.length : 0;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-white" onMouseLeave={hideMenuSoon}>
        <div className="container-page grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 py-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-x-8 lg:py-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="-ml-2 grid size-10 place-items-center rounded-full text-forest hover:bg-cream lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" aria-hidden />
            </button>
            <Logo className="text-forest" />
          </div>

          <HeaderSearch className="col-span-2 row-start-2 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-[750px]" />

          <nav aria-label="Your items" className="flex items-center justify-end gap-0.5 lg:gap-2">
            <button
              type="button"
              onClick={openSaved}
              className={linkClass}
              aria-label={`Saved items, ${savedCount} saved`}
            >
              <span className="relative">
                <Heart className="size-[22px]" strokeWidth={1.75} aria-hidden />
                <CountBadge count={savedCount} />
              </span>
              <span className="hidden lg:inline">saved</span>
            </button>
            <Link href="/gift-finder" className={`${linkClass} hidden sm:flex`}>
              <Gift className="size-[22px]" strokeWidth={1.75} aria-hidden />
              <span className="hidden lg:inline">gift finder</span>
              <span className="sr-only lg:hidden">Gift finder</span>
            </Link>
          </nav>
        </div>

        <nav aria-label="Main" className="hidden border-t border-line/70 lg:block">
          <ul className="container-page flex h-12 items-center justify-center gap-1 xl:gap-4">
            {mainMenus.map((menu) => {
              const isOpen = openMenu === menu.label;
              const menuId = `menu-${menu.href.replaceAll("/", "-")}`;
              return (
                <li key={menu.label} onMouseEnter={() => showMenu(menu.label)}>
                  <button
                    type="button"
                    onClick={() => (isOpen ? setOpenMenu(null) : showMenu(menu.label))}
                    aria-expanded={isOpen}
                    aria-controls={menuId}
                    className={`relative flex h-12 items-center gap-1 px-3 text-sm font-medium tracking-wide transition-colors hover:text-forest ${
                      isOpen ? "text-forest" : ""
                    }`}
                  >
                    {menu.label}
                    <ChevronDown
                      className={`size-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                    <span
                      className={`absolute inset-x-3 bottom-0 h-0.5 origin-left bg-forest transition-transform duration-300 ${
                        isOpen ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <AnimatePresence>
          {activeMenu && (
            <div key={activeMenu.label} className="hidden lg:block" onMouseEnter={() => showMenu(activeMenu.label)}>
              <MegaMenu
                id={`menu-${activeMenu.href.replaceAll("/", "-")}`}
                menu={activeMenu}
                onNavigate={() => setOpenMenu(null)}
              />
            </div>
          )}
        </AnimatePresence>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} onOpenSearch={focusSearch} />
    </>
  );
}
