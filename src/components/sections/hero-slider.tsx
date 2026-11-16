"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { HeroSlide } from "@/types";

const SLIDE_TIME = 7000;

const noSubscribe = () => () => {};

const colors: Record<HeroSlide["color"], { panel: string; eyebrow: string; button: string }> = {
  forest: { panel: "bg-forest", eyebrow: "text-gold", button: "text-forest" },
  clay: { panel: "bg-clay-dark", eyebrow: "text-blush", button: "text-clay-dark" },
  ink: { panel: "bg-ink", eyebrow: "text-gold", button: "text-ink" },
};

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  // The server can't know the motion setting, so the pause button only appears after the page loads.
  const isLoaded = useSyncExternalStore(noSubscribe, () => true, () => false);

  const hasMany = slides.length > 1;
  // People who ask for less motion get no auto-play, only the manual controls.
  const playing = isLoaded && hasMany && !pausedByUser && !hovering && !focused && !reduceMotion;

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setCurrent((index) => (index + 1) % slides.length), SLIDE_TIME);
    return () => clearTimeout(timer);
  }, [playing, current, slides.length]);

  function goTo(index: number) {
    setCurrent((index + slides.length) % slides.length);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (!hasMany) return;
    if (event.key === "ArrowRight") goTo(current + 1);
    if (event.key === "ArrowLeft") goTo(current - 1);
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(distance) > 50) goTo(distance < 0 ? current + 1 : current - 1);
    touchStartX.current = null;
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured gift ideas"
      className="relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false);
      }}
      onKeyDown={handleKeyDown}
      onTouchStart={(event) => (touchStartX.current = event.touches[0].clientX)}
      onTouchEnd={handleTouchEnd}
    >
      <div className="grid" aria-live={playing ? "off" : "polite"}>
        {slides.map((slide, index) => {
          const active = index === current;
          const color = colors[slide.color];
          const Heading = index === 0 ? "h1" : "h2";

          return (
            <div
              key={slide.id}
              role={hasMany ? "group" : undefined}
              aria-roledescription={hasMany ? "slide" : undefined}
              aria-label={hasMany ? `${index + 1} of ${slides.length}` : undefined}
              aria-hidden={!active}
              inert={!active}
              className={`relative col-start-1 row-start-1 overflow-hidden transition-opacity duration-700 ease-soft ${color.panel} ${
                active ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[58%] lg:[clip-path:ellipse(130%_160%_at_130%_50%)]">
                <Image
                  src={slide.image.src}
                  alt={slide.image.alt}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? undefined : "eager"}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  quality={80}
                  className={`object-cover transition-transform duration-[7000ms] ease-out ${active ? "scale-100" : "scale-105"}`}
                />
              </div>

              <div className="container-page relative">
                <div
                  className={`pt-12 text-paper sm:pt-16 lg:flex lg:min-h-[600px] lg:w-[42%] lg:items-center lg:py-20 lg:pr-10 xl:min-h-[640px] xl:pl-[5%] ${
                    hasMany ? "pb-24" : "pb-12 sm:pb-16"
                  }`}
                >
                  <div
                    className={`max-w-md transition-all duration-700 ease-soft ${
                      active ? "translate-y-0 opacity-100 delay-200" : "translate-y-4 opacity-0"
                    }`}
                  >
                    <p className={`text-sm font-semibold uppercase tracking-[0.22em] md:text-base ${color.eyebrow}`}>
                      {slide.eyebrow}
                    </p>
                    <Heading id={index === 0 ? "hero-title" : undefined} className="mt-4">
                      <span className="block font-display text-[2.6rem] leading-[1.05] sm:text-5xl lg:text-[2.75rem] xl:text-[3.25rem]">
                        {slide.titleTop}
                      </span>
                      <span className="mt-1 block text-[2rem] font-light leading-[1.15] tracking-tight sm:text-[2.5rem] lg:text-[2.25rem] xl:text-[2.5rem] 2xl:text-[2.9rem]">
                        {slide.titleBottom}
                      </span>
                    </Heading>
                    <p className="mt-5 max-w-sm text-base leading-relaxed text-paper/85">{slide.text}</p>
                    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                      <Link
                        href={slide.primaryLink.href}
                        className={`inline-flex h-12 items-center rounded bg-white px-5 text-[15px] font-semibold transition-colors hover:bg-cream active:scale-[0.98] ${color.button}`}
                      >
                        {slide.primaryLink.label}
                      </Link>
                      {slide.secondaryLink && (
                        <Link
                          href={slide.secondaryLink.href}
                          className="text-[15px] font-medium text-paper underline decoration-paper/40 underline-offset-4 hover:decoration-paper"
                        >
                          {slide.secondaryLink.label}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasMany && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
          <div className="container-page">
            <div className="pointer-events-auto flex w-fit items-center gap-3 pb-7 lg:pb-10 xl:ml-[2.1%]">
              <button
                type="button"
                onClick={() => goTo(current - 1)}
                className="grid size-9 place-items-center rounded-full border border-white/50 text-white transition-colors hover:bg-white/15"
                aria-label="Previous slide"
              >
                <ChevronLeft className="size-4" aria-hidden />
              </button>

              <div className="flex items-center gap-2">
                {slides.map((slide, index) => {
                  const active = index === current;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => goTo(index)}
                      aria-label={`Show slide ${index + 1}: ${slide.titleTop} ${slide.titleBottom}`}
                      aria-current={active}
                      className="group grid h-6 place-items-center"
                    >
                      <span
                        className={`relative block h-1.5 overflow-hidden rounded-full bg-white/35 transition-all duration-300 group-hover:bg-white/60 ${
                          active ? "w-10" : "w-4"
                        }`}
                      >
                        {active && (
                          <motion.span
                            key={`${current}-${playing}`}
                            className="absolute inset-y-0 left-0 rounded-full bg-white"
                            initial={{ width: playing ? "0%" : "100%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: playing ? SLIDE_TIME / 1000 : 0, ease: "linear" }}
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => goTo(current + 1)}
                className="grid size-9 place-items-center rounded-full border border-white/50 text-white transition-colors hover:bg-white/15"
                aria-label="Next slide"
              >
                <ChevronRight className="size-4" aria-hidden />
              </button>

              {isLoaded && !reduceMotion && (
                <button
                  type="button"
                  onClick={() => setPausedByUser((value) => !value)}
                  className="ml-1 grid size-9 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                  aria-label={pausedByUser ? "Play slideshow" : "Pause slideshow"}
                >
                  {pausedByUser ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
