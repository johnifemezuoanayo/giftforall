"use client";

import Link from "next/link";
import { useSiteData } from "@/context/site-data-context";

export function Logo({ className = "" }: { className?: string }) {
  const { site } = useSiteData();

  return (
    <Link href="/" aria-label={`${site.name} home`} className={`inline-flex items-baseline gap-1 ${className}`}>
      <span className="font-display text-xl leading-none md:text-2xl">{site.name}</span>
      <span aria-hidden className="size-1.5 rounded-full bg-clay" />
    </Link>
  );
}
