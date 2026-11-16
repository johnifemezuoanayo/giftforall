import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow text-clay">Coming soon</p>
      <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.1] md:text-5xl">
        We&apos;re still wrapping this one.
      </h1>
      <p className="mt-5 max-w-md text-stone">
        This page isn&apos;t ready yet. Head back to the homepage to keep discovering.
      </p>
      <ButtonLink href="/" className="mt-8">
        Back to the homepage
      </ButtonLink>
    </section>
  );
}
