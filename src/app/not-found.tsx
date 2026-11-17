import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow text-clay">Page not found</p>
      <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.1] md:text-5xl">We couldn&apos;t find that page.</h1>
      <p className="mt-5 max-w-md text-stone">
        The link may be old, or the gift may no longer be listed. There&apos;s plenty more to discover.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Back to the homepage</ButtonLink>
        <ButtonLink href="/discover" variant="outline">
          Browse all gifts
        </ButtonLink>
      </div>
    </section>
  );
}
