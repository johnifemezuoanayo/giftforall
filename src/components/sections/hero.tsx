import Image from "next/image";
import Link from "next/link";
import type { HeroShortcut, HeroSlide } from "@/types";
import { HeroSlider } from "./hero-slider";

export function Hero({ shortcuts, slides }: { shortcuts: HeroShortcut[]; slides: HeroSlide[] }) {
  return (
    <section aria-labelledby="hero-title" className="bg-forest-dark">
      <nav aria-label="Popular gift shortcuts" className="py-2.5">
        <ul className="no-scrollbar container-page flex snap-x gap-3 overflow-x-auto xl:grid xl:grid-cols-6 xl:overflow-visible">
          {shortcuts.map((shortcut) => (
            <li key={shortcut.href} className="w-[190px] shrink-0 snap-start xl:w-auto">
              <Link
                href={shortcut.href}
                className="group flex h-14 items-center overflow-hidden rounded-lg bg-white transition-shadow hover:shadow-[0_0_0_2px_var(--color-gold)] md:h-16"
              >
                <span className="relative h-full w-14 shrink-0 overflow-hidden bg-sand md:w-16">
                  <Image
                    src={shortcut.image}
                    alt=""
                    fill
                    sizes="64px"
                    quality={70}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </span>
                <span className="truncate px-3 text-[15px] text-ink md:px-4">{shortcut.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <HeroSlider slides={slides} />
    </section>
  );
}
