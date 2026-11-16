import { NewsletterForm } from "@/components/newsletter/newsletter-form";

export function NewsletterSection() {
  return (
    <section aria-labelledby="newsletter-title" className="bg-blush/60 py-20 md:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-clay">The newsletter</p>
          <h2 id="newsletter-title" className="mt-4 font-display text-[2rem] leading-[1.1] md:text-5xl">
            Good finds, delivered occasionally.
          </h2>
          <p className="mx-auto mt-5 max-w-md leading-relaxed text-ink-soft">
            Discover unusual gifts, clever products, and thoughtful ideas worth sharing.
          </p>
          <NewsletterForm id="newsletter" className="mx-auto mt-10 max-w-md" />
        </div>
      </div>
    </section>
  );
}
