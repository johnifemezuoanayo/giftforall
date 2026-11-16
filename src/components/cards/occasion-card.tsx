import Image from "next/image";
import Link from "next/link";
import type { Occasion } from "@/types";

export function OccasionCard({ occasion }: { occasion: Occasion }) {
  return (
    <Link href={occasion.href} className="group relative block aspect-[4/5] overflow-hidden bg-ink sm:aspect-[5/4]">
      <Image
        src={occasion.image.src}
        alt={occasion.image.alt}
        fill
        sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 80vw"
        quality={70}
        className="object-cover opacity-90 transition-all duration-700 ease-soft group-hover:scale-105 group-hover:opacity-100"
      />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-paper md:p-6">
        <p className="text-sm text-paper/80">{occasion.note}</p>
        <h3 className="mt-1 font-display text-[1.75rem] leading-tight md:text-[2rem]">{occasion.title}</h3>
        <span className="mt-4 inline-block border-b border-paper/60 pb-0.5 text-xs font-semibold uppercase tracking-widest transition-colors group-hover:border-paper">
          Shop gifts
        </span>
      </div>
    </Link>
  );
}
