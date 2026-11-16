import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { getRetailerName } from "@/lib/retailers";
import type { Product, RecipientFeature } from "@/types";

type FeatureHeaderProps = {
  feature: RecipientFeature;
  giftCount: number;
  topPick?: Product;
};

export function Headline({ text, highlight }: { text: string; highlight: string }) {
  const start = text.indexOf(highlight);
  if (start === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, start)}
      <span className="relative inline-block whitespace-nowrap text-forest">
        {highlight}
        <svg
          viewBox="0 0 200 14"
          preserveAspectRatio="none"
          className="absolute -bottom-1.5 left-0 h-3 w-full text-gold md:-bottom-2 md:h-3.5"
          aria-hidden
        >
          <path d="M3 10C48 3 140 1 197 7" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" />
        </svg>
      </span>
      {text.slice(start + highlight.length)}
    </>
  );
}

export function FeatureHeader({ feature, giftCount, topPick }: FeatureHeaderProps) {
  return (
    <header className="grid gap-x-14 pb-14 pt-6 md:pt-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:pb-20">
      <div className="lg:col-span-6 lg:self-end">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="rounded-full bg-forest px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
            Gift guide
          </span>
          <span className="text-xs text-stone">
            Updated {feature.updated} · {giftCount} hand-picked finds
          </span>
        </div>

        <h1 className="mt-5 font-display text-[2.3rem] leading-[1.12] sm:text-5xl xl:text-[3.5rem]">
          <Headline text={feature.headline} highlight={feature.highlight} />
        </h1>
      </div>

      <div className="relative mb-6 mt-12 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:my-0 lg:self-center">
        <div className="absolute -right-2 -top-4 bottom-10 left-10 rounded-[2rem] bg-mint md:-right-4 md:-top-6 md:left-16" aria-hidden />

        <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem] bg-sand shadow-[0_30px_60px_-35px_rgba(15,90,58,0.55)]">
          <Image
            src={feature.image.src}
            alt={feature.image.alt}
            fill
            priority
            sizes="(min-width: 1024px) 46vw, 100vw"
            quality={80}
            className="object-cover"
          />
        </div>

        <div className="absolute -top-5 right-5 grid size-24 rotate-6 place-items-center rounded-full bg-gold text-center text-ink shadow-lg md:size-28">
          <span className="leading-tight">
            <span className="block text-2xl font-bold md:text-3xl">{giftCount}</span>
            <span className="block text-[11px] font-semibold uppercase tracking-wider">gift ideas</span>
          </span>
        </div>

        {topPick && (
          <a
            href={topPick.affiliateUrl}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="group absolute -bottom-7 left-4 flex w-[min(330px,85%)] items-center gap-3 rounded-2xl bg-white p-3 pr-4 shadow-[0_20px_40px_-20px_rgba(29,27,24,0.45)] transition-transform hover:-translate-y-0.5 md:left-6"
            aria-label={`Editor's pick: check out ${topPick.name} at ${getRetailerName(topPick.retailer)} (opens in a new tab)`}
          >
            <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-sand">
              <Image src={topPick.image.src} alt="" fill sizes="64px" quality={70} className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="eyebrow block text-[0.6rem] text-clay">Editor&apos;s pick</span>
              <span className="mt-0.5 block truncate text-sm font-semibold">{topPick.name}</span>
              <span className="block text-xs text-stone">
                {formatPrice(topPick.price)} · {getRetailerName(topPick.retailer)}
                {topPick.isSampleData && " · sample price"}
              </span>
            </span>
            <ArrowUpRight className="size-4 shrink-0 text-stone group-hover:text-forest" aria-hidden />
          </a>
        )}
      </div>
      <div className="lg:col-span-6 lg:col-start-1 lg:row-start-2">
        <p className="mt-7 text-[1.02rem] leading-[1.9] text-ink-soft md:text-[1.06rem]">
          {feature.intro.map((part, index) =>
            typeof part === "string" ? (
              <span key={index}>{part}</span>
            ) : (
              <Link
                key={index}
                href={part.href}
                className="rounded-sm font-semibold text-ink underline decoration-gold decoration-[3px] underline-offset-[5px] transition-colors hover:bg-gold/25 hover:decoration-forest"
              >
                {part.label}
              </Link>
            ),
          )}
        </p>

        <a
          href="#gifts"
          className="group mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-forest px-7 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
        >
          Browse all {giftCount} gifts
          <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
        </a>
      </div>

    </header>
  );
}
