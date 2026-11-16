import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Collection } from "@/types";

const tones: Record<Collection["tone"], string> = {
  blush: "bg-blush text-ink",
  sage: "bg-sage text-ink",
  sand: "bg-sand text-ink",
  ink: "bg-ink text-paper",
  clay: "bg-clay text-paper",
};

type CollectionCardProps = {
  collection: Collection;
  number: number;
  large?: boolean;
};

export function CollectionCard({ collection, number, large = false }: CollectionCardProps) {
  const label = String(number).padStart(2, "0");

  return (
    <Link
      href={collection.href}
      className={`group flex h-full flex-col p-4 transition-transform duration-500 ease-soft hover:-translate-y-1 md:p-5 ${tones[collection.tone]}`}
    >
      <div className={`relative overflow-hidden ${large ? "aspect-[4/3] lg:aspect-auto lg:flex-1" : "aspect-[4/3]"}`}>
        <Image
          src={collection.image.src}
          alt={collection.image.alt}
          fill
          sizes={large ? "(min-width: 1024px) 48vw, 100vw" : "(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw"}
          quality={70}
          className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
        />
      </div>
      <div className={`flex items-end justify-between gap-4 ${large ? "pt-6" : "pt-4"}`}>
        <div>
          <p className="eyebrow opacity-70">Collection {label}</p>
          <h3 className={`mt-2 font-display leading-[1.15] ${large ? "text-3xl md:text-4xl" : "text-xl"}`}>
            {collection.title}
          </h3>
          <p className={`mt-2 max-w-sm text-sm opacity-80 ${large ? "md:text-base" : ""}`}>{collection.description}</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-current/30 transition-colors group-hover:bg-current/10">
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
