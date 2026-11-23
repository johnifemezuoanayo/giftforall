import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { io } from "next/cache";
import { GiftFinder } from "@/components/gift-finder/gift-finder";
import { GiftIcon } from "@/components/icons/promise-icons";
import { getCategories, getContent, getListingPages, getProducts } from "@/lib/api";
import type { FinderOccasion } from "@/types";

export const metadata: Metadata = {
  title: "Gift Finder",
  description: "Answer four quick questions and we'll find unique, thoughtful gift ideas that fit the person, the occasion and your budget.",
};

const howItWorks = [
  "Who you're shopping for and your budget decide which gifts can appear at all.",
  "Each interest you pick moves gifts that match it higher up the list, and the occasion gives a small extra boost.",
  "Anything you type in \"anything else\" is matched against each gift's name and description.",
  "Your answers stay in your browser. We don't save them or need an account.",
];

export default async function GiftFinderPage() {
  await io();
  const [products, pages, categories, content] = await Promise.all([
    getProducts(),
    getListingPages(),
    getCategories(),
    getContent(),
  ]);
  const occasions: FinderOccasion[] = [
    ...pages
      .filter((page) => page.section === "occasions")
      .map((page) => ({ id: page.slug, label: page.label, rule: page.rule })),
    { id: "just-because", label: "Just because", rule: {} },
  ];
  const finderData = {
    products,
    people: content.finderPeople,
    occasions,
    budgets: content.finderBudgets,
    interests: categories,
  };

  return (
    <>
      <div className="container-page pt-4 md:pt-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-stone">
            <li>
              <Link href="/" className="hover:text-forest hover:underline">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1">
              <ChevronRight className="size-3.5" aria-hidden />
              <span aria-current="page" className="font-medium text-ink">
                Gift finder
              </span>
            </li>
          </ol>
        </nav>

        <header className="mt-6 flex flex-col items-center text-center md:mt-8">
          <span className="grid size-20 place-items-center rounded-full bg-mint">
            <GiftIcon className="size-12 text-forest" />
          </span>
          <h1 className="mt-5 font-display text-[2.3rem] leading-[1.1] sm:text-5xl">
            gift finder
          </h1>
          <p className="mt-3 max-w-lg text-[1.05rem] leading-relaxed text-ink-soft">
            Four quick questions, zero stress. Tell us a little about them and we&apos;ll pull together gifts they&apos;ll
            actually love.
          </p>
        </header>
      </div>

      <div className="container-page mt-10 md:mt-14">
        <GiftFinder data={finderData} />
      </div>

      <section aria-labelledby="finder-how" className="container-page mb-20 mt-16 md:mb-28 md:mt-24">
        <details className="group mx-auto max-w-3xl rounded-2xl border border-line bg-paper px-6">
          <summary
            id="finder-how"
            className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold [&::-webkit-details-marker]:hidden"
          >
            How does the gift finder choose gifts?
            <ChevronDown className="size-5 shrink-0 text-stone transition-transform duration-300 group-open:rotate-180" aria-hidden />
          </summary>
          <ul className="space-y-3 pb-6 text-ink-soft">
            {howItWorks.map((line) => (
              <li key={line} className="flex gap-3 leading-relaxed">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-forest" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </details>
      </section>
    </>
  );
}
