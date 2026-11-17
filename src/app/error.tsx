"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow text-clay">Something went wrong</p>
      <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.1] md:text-5xl">We couldn&apos;t load this page.</h1>
      <p className="mt-5 max-w-md text-stone">It&apos;s a problem on our side, not yours. Please try again in a moment.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex h-12 items-center rounded-full bg-forest px-7 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-12 items-center rounded-full border-2 border-forest px-6 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white"
        >
          Back to the homepage
        </Link>
      </div>
    </section>
  );
}
