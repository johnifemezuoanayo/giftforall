"use client";

import Link from "next/link";
import { useSiteData } from "@/context/site-data-context";

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path d="M24 15C20 4 7 5 10 12C12 16.5 19 16 24 15Z" fill="#f2c14e" />
      <path d="M24 15C28 4 41 5 38 12C36 16.5 29 16 24 15Z" fill="#f2c14e" />
      <rect x="5" y="14" width="38" height="10" rx="3" fill="#0f5a3a" />
      <rect x="8" y="26" width="32" height="18" rx="3" fill="#0f5a3a" />
      <rect x="20.5" y="14" width="7" height="30" fill="#f2c14e" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  const { site } = useSiteData();

  return (
    <Link href="/" aria-label={`${site.name} home`} className={`inline-flex items-center gap-2 text-forest ${className}`}>
      <LogoMark className="size-8 md:size-9" />
      <span className="font-logo text-[1.5rem] font-semibold leading-none tracking-tight md:text-[1.75rem]">
        gift<span className="italic text-clay">for</span>all
      </span>
    </Link>
  );
}
