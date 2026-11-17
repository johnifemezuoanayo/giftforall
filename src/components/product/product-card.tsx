"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Heart, Images, LoaderCircle, Pause, Play } from "lucide-react";
import { useSaved } from "@/context/saved-context";
import { useSiteData } from "@/context/site-data-context";
import { getProductHref } from "@/lib/links";
import { formatPrice } from "@/lib/format";
import { getRetailerName } from "@/lib/retailers";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  sizes?: string;
  // Show the longer write-up and interest tags. Used on product grids.
  showDetails?: boolean;
};

export function ProductCard({
  product,
  sizes = "(min-width: 1280px) 300px, (min-width: 768px) 34vw, 72vw",
  showDetails = false,
}: ProductCardProps) {
  const { isSaved, toggleSaved, isReady } = useSaved();
  const { categories } = useSiteData();
  const reduceMotion = useReducedMotion();
  const [showExtra, setShowExtra] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  // Keep the main photo showing until the second photo has finished loading.
  const [altReady, setAltReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const retailerName = getRetailerName(product.retailer);
  const saved = isReady && isSaved(product.id);
  const hasExtra = Boolean(product.video || product.altImage);

  function switchMedia(show: boolean, fromHover: boolean) {
    // Videos never start on their own for people who prefer less motion. They can still press play.
    if (show && fromHover && product.video && reduceMotion) return;
    setShowExtra(show);
    const video = videoRef.current;
    if (!video) return;
    if (show) {
      setVideoLoading(true);
      video.play().catch(() => {
        setShowExtra(false);
        setVideoLoading(false);
      });
    } else {
      video.pause();
      video.currentTime = 0;
      setVideoLoading(false);
    }
  }

  const mediaButtonLabel = product.video
    ? showExtra
      ? `Stop video of ${product.name}`
      : `Play video of ${product.name}`
    : showExtra
      ? `Show main photo of ${product.name}`
      : `Show another photo of ${product.name}`;

  const tags = showDetails
    ? product.interests
        .slice(0, 2)
        .map((id) => categories.find((category) => category.id === id)?.label)
        .filter((label) => label !== undefined)
    : [];

  return (
    <article className="group @container flex h-full flex-col">
      <div
        className="relative aspect-[4/5] overflow-hidden bg-sand"
        onMouseEnter={() => hasExtra && switchMedia(true, true)}
        onMouseLeave={() => hasExtra && switchMedia(false, true)}
      >
        <Link href={getProductHref(product)} tabIndex={-1} aria-hidden className="absolute inset-0 block">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes={sizes}
            quality={70}
            className={`object-cover transition-transform duration-700 ease-soft ${hasExtra ? "" : "group-hover:scale-[1.06]"}`}
          />
          {product.altImage && (
            <Image
              src={product.altImage.src}
              alt=""
              fill
              sizes={sizes}
              quality={70}
              onLoad={() => setAltReady(true)}
              className={`object-cover transition-opacity duration-500 ease-soft ${showExtra && altReady ? "opacity-100" : "opacity-0"}`}
            />
          )}
          {product.video && (
            <video
              ref={videoRef}
              src={product.video.src}
              muted
              loop
              playsInline
              preload="none"
              poster={`${product.image.src}?w=640&q=70&auto=format`}
              onPlaying={() => setVideoLoading(false)}
              className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${showExtra ? "opacity-100" : "opacity-0"}`}
            />
          )}
        </Link>

        {product.badge && (
          <span className="absolute left-2.5 top-2.5 bg-paper px-2 py-1 text-[10px] font-semibold uppercase tracking-wider @[14rem]:left-3 @[14rem]:top-3 @[14rem]:px-2.5 @[14rem]:text-[11px]">
            {product.badge}
          </span>
        )}

        {hasExtra && (
          <button
            type="button"
            onClick={() => switchMedia(!showExtra, false)}
            aria-pressed={showExtra}
            aria-label={mediaButtonLabel}
            className="absolute bottom-2.5 right-2.5 flex h-8 items-center gap-1.5 rounded-full bg-ink/70 px-3 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-ink @[14rem]:bottom-3 @[14rem]:right-3"
          >
            {product.video ? (
              videoLoading ? (
                <LoaderCircle className="size-3.5 animate-spin" aria-hidden />
              ) : showExtra ? (
                <Pause className="size-3.5" aria-hidden />
              ) : (
                <Play className="size-3.5 fill-current" aria-hidden />
              )
            ) : (
              <Images className="size-3.5" aria-hidden />
            )}
            {product.video ? "video" : "+1 photo"}
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-3 @[14rem]:pt-4">
        <p className="eyebrow text-[0.65rem] text-olive">Available at {retailerName}</p>
        <h3
          className={`mt-1.5 font-semibold leading-snug ${showDetails ? "text-lg @[22rem]:text-xl" : "text-[0.95rem] @[14rem]:text-[1.05rem]"}`}
        >
          <Link href={getProductHref(product)} className="underline-offset-4 hover:underline">
            {product.name}
          </Link>
        </h3>

        {showDetails && product.details ? (
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{product.details}</p>
        ) : (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-stone">{product.description}</p>
        )}

        {tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Good for">
            {tags.map((tag) => (
              <li key={tag} className="rounded-full bg-mint px-2.5 py-0.5 text-[11px] font-medium text-forest">
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className={showDetails ? "mt-auto pt-4" : "mt-auto"}>
          <p className={`flex items-baseline gap-2 ${showDetails ? "border-t border-line pt-4" : "mt-3"}`}>
            <span className={`font-semibold ${showDetails ? "text-xl" : "text-lg"}`}>{formatPrice(product.price)}</span>
            {product.isSampleData && <span className="text-[11px] text-stone">Sample price</span>}
          </p>

          <div className="mt-4 flex flex-col gap-2 @[16rem]:flex-row">
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="flex h-10 flex-1 items-center justify-center gap-1.5 bg-ink text-sm font-semibold text-paper transition-colors duration-300 hover:bg-forest active:scale-[0.98] @[16rem]:h-11"
              aria-label={`Check out ${product.name} at ${retailerName} (opens in a new tab)`}
            >
              Check it out
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
            <button
              type="button"
              onClick={() => toggleSaved(product)}
              aria-pressed={saved}
              aria-label={saved ? `Remove ${product.name} from saved items` : `Save ${product.name} for later`}
              className={`flex h-10 items-center justify-center gap-1.5 border px-4 text-sm font-semibold transition-colors duration-300 active:scale-[0.98] @[16rem]:h-11 ${
                saved ? "border-clay bg-clay/10 text-clay-dark" : "border-line hover:border-ink"
              }`}
            >
              <motion.span
                key={saved ? "saved" : "not-saved"}
                initial={{ scale: saved ? 0.5 : 1 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="grid place-items-center"
              >
                <Heart className={`size-4 ${saved ? "fill-clay text-clay" : ""}`} aria-hidden />
              </motion.span>
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
