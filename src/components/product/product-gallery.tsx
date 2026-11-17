"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Product } from "@/types";

type GalleryItem = { kind: "photo"; src: string; alt: string } | { kind: "video"; src: string };

export function ProductGallery({ product }: { product: Product }) {
  const items: GalleryItem[] = [{ kind: "photo", src: product.image.src, alt: product.image.alt }];
  if (product.altImage) {
    items.push({ kind: "photo", src: product.altImage.src, alt: product.altImage.alt || `Another photo of ${product.name}` });
  }
  if (product.video) items.push({ kind: "video", src: product.video.src });

  const [chosen, setChosen] = useState(0);
  const current = items[chosen];

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row md:gap-4">
      {items.length > 1 && (
        <ul className="no-scrollbar flex shrink-0 gap-3 overflow-x-auto md:w-20 md:flex-col md:overflow-visible">
          {items.map((item, index) => (
            <li key={item.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setChosen(index)}
                aria-pressed={index === chosen}
                aria-label={item.kind === "video" ? `Show video of ${product.name}` : `Show photo ${index + 1} of ${product.name}`}
                className={`relative block size-16 overflow-hidden rounded-lg bg-sand transition-opacity md:size-20 ${
                  index === chosen ? "ring-2 ring-forest ring-offset-2 ring-offset-white" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={item.kind === "video" ? product.image.src : item.src}
                  alt=""
                  fill
                  sizes="80px"
                  quality={70}
                  className="object-cover"
                />
                {item.kind === "video" && (
                  <span className="absolute inset-0 grid place-items-center bg-ink/40 text-white">
                    <Play className="size-5 fill-current" aria-hidden />
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative aspect-square flex-1 overflow-hidden rounded-2xl bg-sand">
        {current.kind === "video" ? (
          <video
            key={current.src}
            src={current.src}
            controls
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            priority={chosen === 0}
            sizes="(min-width: 1024px) 52vw, 100vw"
            quality={80}
            className="object-cover"
          />
        )}

        {product.badge && (
          <span className="absolute left-4 top-4 bg-paper px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider">
            {product.badge}
          </span>
        )}
      </div>
    </div>
  );
}
