import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/types";

type ArticleCardProps = {
  article: Article;
  variant?: "feature" | "standard" | "compact";
};

function ReadLink({ article }: { article: Article }) {
  return (
    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
      Read article
      <span className="sr-only">: {article.title}</span>
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
    </span>
  );
}

function Meta({ article }: { article: Article }) {
  return (
    <p className="eyebrow flex items-center gap-2 text-clay">
      {article.label}
      <span className="size-1 rounded-full bg-stone/50" aria-hidden />
      <span className="font-medium normal-case tracking-normal text-stone">{article.readTime}</span>
    </p>
  );
}

export function ArticleCard({ article, variant = "standard" }: ArticleCardProps) {
  if (variant === "compact") {
    return (
      <Link href={article.href} className="group grid grid-cols-[112px_1fr] gap-5 md:grid-cols-[150px_1fr]">
        <div className="relative aspect-square overflow-hidden bg-sand">
          <Image
            src={article.image.src}
            alt={article.image.alt}
            fill
            sizes="150px"
            quality={70}
            className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center">
          <Meta article={article} />
          <h3 className="mt-2 font-display text-lg leading-snug md:text-xl group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
            {article.title}
          </h3>
          <p className="mt-1 hidden text-sm text-stone sm:block">{article.intro}</p>
        </div>
      </Link>
    );
  }

  const isFeature = variant === "feature";

  return (
    <Link href={article.href} className="group block">
      <div className={`relative overflow-hidden bg-sand ${isFeature ? "aspect-[4/3] lg:aspect-[5/4]" : "aspect-[16/10]"}`}>
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          sizes={isFeature ? "(min-width: 1024px) 56vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"}
          quality={70}
          className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
        />
      </div>
      <div className={isFeature ? "mt-6 max-w-2xl" : "mt-5"}>
        <Meta article={article} />
        <h3
          className={`mt-3 font-display leading-[1.15] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 ${
            isFeature ? "text-[1.75rem] md:text-4xl" : "text-2xl"
          }`}
        >
          {article.title}
        </h3>
        <p className="mt-3 leading-relaxed text-stone">{article.intro}</p>
        <ReadLink article={article} />
      </div>
    </Link>
  );
}
