import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/types";

export function GuideTile({ article }: { article: Article }) {
  return (
    <Link
      href={article.href}
      className="group grid h-full overflow-hidden rounded-2xl bg-forest text-paper sm:grid-cols-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-auto">
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
          quality={70}
          className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col justify-center p-6 md:p-8">
        <p className="eyebrow text-gold">Need ideas? Read the guide</p>
        <h3 className="mt-3 font-display text-2xl leading-tight md:text-[1.7rem]">{article.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-paper/80">{article.intro}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold underline decoration-paper/40 underline-offset-4 group-hover:decoration-paper">
          Read the guide
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
