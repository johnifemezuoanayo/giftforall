import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Recipient } from "@/types";

export function RecipientCard({ recipient }: { recipient: Recipient }) {
  return (
    <Link href={recipient.href} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
        <Image
          src={recipient.image.src}
          alt={recipient.image.alt}
          fill
          sizes="(min-width: 1024px) 24vw, (min-width: 768px) 25vw, 44vw"
          quality={70}
          className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
        />
      </div>
      <p className="mt-3 flex items-start justify-between gap-2">
        <span className="font-display text-base leading-snug md:text-lg">
          <span className="text-stone">For </span>
          {recipient.label}
        </span>
        <ArrowRight
          className="mt-1.5 size-4 shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          aria-hidden
        />
      </p>
    </Link>
  );
}
