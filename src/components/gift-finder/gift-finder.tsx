"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Pencil, RotateCcw, Search, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { emptyAnswers, findGifts, type FinderAnswers, type FinderData } from "@/lib/gift-finder";
import type { InterestId } from "@/types";

const steps = [
  { id: "who", short: "Who", question: "Who are you shopping for?", hint: "Pick one. You can change it later." },
  { id: "occasion", short: "Occasion", question: "What's the occasion?", hint: "Optional, but it helps us rank the best ideas first." },
  { id: "interests", short: "Interests", question: "What are they into right now?", hint: "Pick as many as you like." },
  { id: "budget", short: "Budget", question: "How much would you like to spend?", hint: "We'll only show gifts within your budget." },
] as const;

const PAGE_SIZE = 12;

export function GiftFinder({ data }: { data: FinderData }) {
  const { people: finderPeople, occasions: finderOccasions, budgets: finderBudgets, interests: allInterests } = data;
  const [answers, setAnswers] = useState<FinderAnswers>(emptyAnswers);
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [hasInteracted, setHasInteracted] = useState(false);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const resultsRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();

  const { matches, closeMatchesOnly } = findGifts(answers, data);
  const person = finderPeople.find((item) => item.id === answers.personId);
  const occasion = finderOccasions.find((item) => item.id === answers.occasionId);
  const budget = finderBudgets.find((item) => item.id === answers.budgetId);
  const current = steps[step];

  // Move keyboard and screen reader focus to the new question or the results, but not on first page load.
  useEffect(() => {
    if (!hasInteracted) return;
    // Wait for the old question to slide out, so the new one exists before we focus it.
    const timer = setTimeout(() => {
      const target = showResults ? resultsRef.current : questionRef.current;
      target?.focus({ preventScroll: true });
      target?.closest("section")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }, 320);
    return () => clearTimeout(timer);
  }, [step, showResults, hasInteracted, reduceMotion]);

  function update(changes: Partial<FinderAnswers>) {
    setAnswers((existing) => ({ ...existing, ...changes }));
    setVisibleCount(PAGE_SIZE);
  }

  function goToStep(index: number) {
    setHasInteracted(true);
    setShowResults(false);
    setStep(index);
  }

  function next() {
    setHasInteracted(true);
    if (step < steps.length - 1) setStep(step + 1);
    else setShowResults(true);
  }

  function startOver() {
    setAnswers(emptyAnswers);
    goToStep(0);
  }

  function toggleInterest(id: InterestId) {
    const list = answers.interestIds.includes(id)
      ? answers.interestIds.filter((item) => item !== id)
      : [...answers.interestIds, id];
    update({ interestIds: list });
  }

  const briefRows = [
    { label: "Who", value: person?.label ?? null },
    { label: "Occasion", value: occasion?.label ?? null },
    {
      label: "Interests",
      value:
        [...answers.interestIds.map((id) => allInterests.find((item) => item.id === id)?.label ?? id), answers.keyword.trim() && `"${answers.keyword.trim()}"`]
          .filter(Boolean)
          .join(", ") || null,
    },
    { label: "Budget", value: budget?.label ?? null },
  ];

  const canContinue = step !== 0 || Boolean(answers.personId);
  const isOptionalStep = step === 1 || step === 2;

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <aside className="order-2 lg:order-1 lg:col-span-4" aria-label="Your gift brief">
        <div className="rounded-3xl bg-forest p-6 text-paper lg:sticky lg:top-36 md:p-8">
          <p className="eyebrow text-gold">Your gift brief</p>
          <ul className="mt-5 divide-y divide-paper/15">
            {briefRows.map((row, index) => (
              <li key={row.label}>
                <button
                  type="button"
                  onClick={() => goToStep(index)}
                  className="group flex w-full items-start justify-between gap-4 py-3 text-left"
                  aria-label={`Change ${row.label.toLowerCase()}`}
                >
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-paper/60">{row.label}</span>
                    <span className={`mt-0.5 block text-[15px] ${row.value ? "font-semibold" : "text-paper/50"}`}>
                      {row.value ?? (index === 0 ? "Not chosen yet" : "Any")}
                    </span>
                  </span>
                  <Pencil className="mt-1 size-4 shrink-0 text-paper/40 transition-colors group-hover:text-gold" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-2xl bg-paper/10 p-4" aria-live="polite">
            <p className="text-3xl font-bold leading-none">{matches.length}</p>
            <p className="mt-1 text-sm text-paper/80">
              {closeMatchesOnly ? "close matches so far" : matches.length === 1 ? "gift matches so far" : "gifts match so far"}
            </p>
          </div>
          {(answers.personId || showResults) && (
            <button
              type="button"
              onClick={startOver}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-paper/80 underline-offset-4 hover:text-gold hover:underline"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Start over
            </button>
          )}
        </div>
      </aside>

      <div className="order-1 min-w-0 lg:order-2 lg:col-span-8">
        {!showResults ? (
          <section aria-labelledby="finder-question" className="scroll-mt-36 rounded-3xl bg-white p-5 shadow-[0_24px_50px_-35px_rgba(29,27,24,0.35)] sm:p-8 md:p-10">
            <ol className="grid grid-cols-4 gap-2" aria-label="Progress">
              {steps.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => (index === 0 || answers.personId ? goToStep(index) : undefined)}
                    disabled={index > 0 && !answers.personId}
                    aria-current={index === step ? "step" : undefined}
                    className="group block w-full text-left disabled:cursor-not-allowed"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-colors duration-500 ${index <= step ? "bg-forest" : "bg-line"}`}
                    />
                    <span
                      className={`mt-2 block text-[11px] font-semibold uppercase tracking-wider sm:text-xs ${
                        index === step ? "text-forest" : "text-stone"
                      }`}
                    >
                      <span className="hidden sm:inline">{index + 1}. </span>
                      {item.short}
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8"
              >
                <p className="flex flex-wrap items-center justify-between gap-2 text-sm text-stone">
                  <span>
                    Step {step + 1} of {steps.length}
                  </span>
                  <span className="rounded-full bg-mint px-3 py-1 text-xs font-semibold text-forest lg:hidden">
                    {matches.length} {matches.length === 1 ? "gift matches" : "gifts match"}
                  </span>
                </p>
                <h2
                  id="finder-question"
                  ref={questionRef}
                  tabIndex={-1}
                  className="mt-1 font-display text-[1.75rem] leading-tight outline-none md:text-4xl"
                >
                  {current.question}
                </h2>
                <p className="mt-2 text-ink-soft">{current.hint}</p>

                <div className="mt-7">
                  {current.id === "who" && (
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                      {finderPeople.map((item) => {
                        const selected = answers.personId === item.id;
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              aria-pressed={selected}
                              onClick={() => update({ personId: item.id })}
                              className={`group flex w-full items-center gap-3 rounded-2xl border p-2 pr-3 text-left transition-all hover:-translate-y-0.5 hover:border-forest ${
                                selected ? "border-forest bg-mint ring-1 ring-forest" : "border-line bg-paper"
                              }`}
                            >
                              <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-sand">
                                <Image src={item.photo.src} alt="" fill sizes="48px" quality={70} className="object-cover" />
                                {selected && (
                                  <span className="absolute inset-0 grid place-items-center bg-forest/70 text-white">
                                    <Check className="size-5" strokeWidth={3} aria-hidden />
                                  </span>
                                )}
                              </span>
                              <span className="text-[15px] font-semibold leading-tight">{item.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {current.id === "occasion" && (
                    <ul className="flex flex-wrap gap-2.5">
                      {finderOccasions.map((item) => {
                        const selected = answers.occasionId === item.id;
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              aria-pressed={selected}
                              onClick={() => update({ occasionId: selected ? null : item.id })}
                              className={`inline-flex h-11 items-center gap-1.5 rounded-full border px-5 text-[15px] transition-colors ${
                                selected
                                  ? "border-forest bg-forest font-semibold text-white"
                                  : "border-line bg-paper hover:border-forest hover:text-forest"
                              }`}
                            >
                              {selected && <Check className="size-4" strokeWidth={3} aria-hidden />}
                              {item.label}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {current.id === "interests" && (
                    <>
                      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                        {allInterests.map((item) => {
                          const selected = answers.interestIds.includes(item.id);
                          return (
                            <li key={item.id}>
                              <button
                                type="button"
                                aria-pressed={selected}
                                onClick={() => toggleInterest(item.id)}
                                className={`group relative block w-full overflow-hidden rounded-2xl border text-left transition-all hover:-translate-y-0.5 ${
                                  selected ? "border-forest ring-2 ring-forest" : "border-line"
                                }`}
                              >
                                <span className="relative block aspect-[16/10] bg-sand">
                                  <Image
                                    src={item.image.src}
                                    alt=""
                                    fill
                                    sizes="(min-width: 1280px) 160px, (min-width: 640px) 25vw, 45vw"
                                    quality={70}
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                  <span
                                    className={`absolute right-2 top-2 grid size-7 place-items-center rounded-full transition-colors ${
                                      selected ? "bg-forest text-white" : "bg-white/90 text-ink"
                                    }`}
                                  >
                                    {selected ? (
                                      <Check className="size-4" strokeWidth={3} aria-hidden />
                                    ) : (
                                      <span className="text-lg leading-none" aria-hidden>
                                        +
                                      </span>
                                    )}
                                  </span>
                                </span>
                                <span className={`block px-3 py-2.5 text-sm font-semibold ${selected ? "bg-mint text-forest" : "bg-paper"}`}>
                                  {item.label}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                      <label htmlFor="finder-keyword" className="mt-7 block text-sm font-semibold">
                        Anything else they love?
                      </label>
                      <div className="relative mt-2">
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone" aria-hidden />
                        <input
                          id="finder-keyword"
                          value={answers.keyword}
                          onChange={(event) => update({ keyword: event.target.value })}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") next();
                          }}
                          placeholder="e.g. camping, chocolate, vinyl"
                          className="h-12 w-full rounded-xl border border-line bg-paper pl-11 pr-4 text-[15px] outline-none transition-colors placeholder:text-stone/70 focus:border-forest"
                        />
                      </div>
                    </>
                  )}

                  {current.id === "budget" && (
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {finderBudgets.map((item) => {
                        const selected = answers.budgetId === item.id;
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              aria-pressed={selected}
                              onClick={() => update({ budgetId: selected ? null : item.id })}
                              className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:border-forest ${
                                selected ? "border-forest bg-mint ring-1 ring-forest" : "border-line bg-paper"
                              }`}
                            >
                              <span>
                                <span className="block text-lg font-semibold">{item.label}</span>
                                <span className="mt-0.5 block text-sm text-stone">{item.note}</span>
                              </span>
                              <span
                                className={`grid size-7 shrink-0 place-items-center rounded-full border ${
                                  selected ? "border-forest bg-forest text-white" : "border-line"
                                }`}
                              >
                                {selected && <Check className="size-4" strokeWidth={3} aria-hidden />}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => goToStep(step - 1)}
                  className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink-soft transition-colors hover:bg-cream"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  Back
                </button>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-2">
                {isOptionalStep && (
                  <button
                    type="button"
                    onClick={next}
                    className="h-12 rounded-full px-4 text-sm font-semibold text-stone underline-offset-4 hover:text-ink hover:underline"
                  >
                    Skip
                  </button>
                )}
                <button
                  type="button"
                  onClick={next}
                  disabled={!canContinue}
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-forest px-7 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {step === steps.length - 1 ? (
                    <>
                      <Sparkles className="size-4" aria-hidden />
                      Show my {matches.length} gifts
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section aria-labelledby="finder-results" className="scroll-mt-36">
            <p className="eyebrow text-clay">Your results</p>
            <h2
              id="finder-results"
              ref={resultsRef}
              tabIndex={-1}
              className="mt-2 font-display text-[1.75rem] leading-tight outline-none md:text-4xl"
            >
              {closeMatchesOnly
                ? `No exact matches, but these are close for ${person?.phrase ?? "them"}`
                : `We found ${matches.length} ${matches.length === 1 ? "gift" : "gifts"} for ${person?.phrase ?? "them"}`}
            </h2>
            <p className="mt-2 max-w-xl text-ink-soft">
              {closeMatchesOnly
                ? "Nothing matched every interest you picked, so here are the best gifts for them within your budget."
                : "Ranked by how well each gift fits your answers. The best matches come first."}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => goToStep(0)}
                className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-forest px-5 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white"
              >
                <Pencil className="size-4" aria-hidden />
                Edit answers
              </button>
              <button
                type="button"
                onClick={startOver}
                className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink-soft hover:bg-cream"
              >
                <RotateCcw className="size-4" aria-hidden />
                Start over
              </button>
            </div>

            {matches.length === 0 ? (
              <div className="mt-10 rounded-2xl bg-cream px-6 py-12 text-center">
                <p className="text-lg font-semibold">No gifts fit that budget yet.</p>
                <p className="mt-2 text-sm text-stone">Try a higher budget or a different person.</p>
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="mt-6 h-11 rounded-full bg-forest px-6 text-sm font-semibold text-white hover:bg-forest-dark"
                >
                  Change budget
                </button>
              </div>
            ) : (
              <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                {matches.slice(0, visibleCount).map((match, index) => (
                  <li key={match.product.id} className="flex flex-col">
                    <div className="mb-3 flex min-h-7 flex-wrap items-center gap-1.5">
                      {index < 3 && !closeMatchesOnly && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">
                          <Sparkles className="size-3" aria-hidden />
                          Top match
                        </span>
                      )}
                      {match.reasons.slice(0, 3).map((reason) => (
                        <span key={reason} className="inline-flex items-center gap-1 rounded-full bg-mint px-2.5 py-1 text-[11px] font-medium text-forest">
                          <Check className="size-3" strokeWidth={3} aria-hidden />
                          {reason}
                        </span>
                      ))}
                    </div>
                    <div className="flex-1">
                      <ProductCard
                        product={match.product}
                        sizes="(min-width: 1280px) 280px, (min-width: 640px) 40vw, 92vw"
                        showDetails
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {visibleCount < matches.length && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="h-12 rounded-full border-2 border-forest px-8 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white"
                >
                  Show more gifts
                </button>
              </div>
            )}

            {person && person.id !== "myself" && person.id !== "co-worker" && (
              <p className="mt-12 rounded-2xl bg-mint px-6 py-5 text-center text-ink-soft">
                Want to browse everything?{" "}
                <Link href={`/gifts/${person.id}`} className="font-semibold text-forest underline decoration-gold decoration-2 underline-offset-4">
                  See all gifts for {person.label}
                </Link>
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
