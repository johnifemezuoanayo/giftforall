"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export function Carousel({ label, children, className = "" }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(true);

  function updateButtons() {
    const track = trackRef.current;
    if (!track) return;
    setCanGoBack(track.scrollLeft > 4);
    setCanGoForward(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }

  useEffect(() => {
    updateButtons();
    window.addEventListener("resize", updateButtons);
    return () => window.removeEventListener("resize", updateButtons);
  }, []);

  function move(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: reduceMotion ? "auto" : "smooth" });
  }

  const arrowClass =
    "grid size-11 place-items-center rounded-full border border-ink/80 bg-paper transition-colors hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className={className}>
      <div
        ref={trackRef}
        onScroll={updateButtons}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 md:-mx-8 md:scroll-px-8 md:gap-6 md:px-8 xl:-mx-12 xl:scroll-px-12 xl:px-12"
      >
        {children}
      </div>
      <div className="mt-6 hidden justify-end gap-3 md:flex">
        <button type="button" onClick={() => move(-1)} disabled={!canGoBack} className={arrowClass} aria-label="Scroll back">
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button type="button" onClick={() => move(1)} disabled={!canGoForward} className={arrowClass} aria-label="Scroll forward">
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
