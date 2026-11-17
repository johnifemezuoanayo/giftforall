"use client";

import { useState } from "react";
import { Check, Heart, Share2 } from "lucide-react";
import { useSaved } from "@/context/saved-context";
import type { Product } from "@/types";

export function ProductActions({ product }: { product: Product }) {
  const { isSaved, toggleSaved, isReady } = useSaved();
  const [copied, setCopied] = useState(false);
  const saved = isReady && isSaved(product.id);

  async function share() {
    const link = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url: link });
        return;
      }
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // The person closed the share sheet, or copying is blocked. Nothing to do.
    }
  }

  const buttonClass =
    "flex h-12 flex-1 items-center justify-center gap-2 rounded-full border-2 px-5 text-sm font-semibold transition-colors active:scale-[0.98]";

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => toggleSaved(product)}
        aria-pressed={saved}
        className={`${buttonClass} ${saved ? "border-clay bg-clay/10 text-clay-dark" : "border-line hover:border-ink"}`}
      >
        <Heart className={`size-4 ${saved ? "fill-clay text-clay" : ""}`} aria-hidden />
        {saved ? "Saved" : "Save for later"}
      </button>
      <button type="button" onClick={share} className={`${buttonClass} border-line hover:border-ink`}>
        {copied ? <Check className="size-4 text-forest" aria-hidden /> : <Share2 className="size-4" aria-hidden />}
        <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
      </button>
    </div>
  );
}
