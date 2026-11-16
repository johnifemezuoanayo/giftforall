"use client";

import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";
import { NewsletterForm } from "./newsletter-form";

export function FooterNewsletter() {
  const pathname = usePathname();

  // The homepage already has a big newsletter section just above the footer.
  if (pathname === "/") return null;

  return (
    <section
      aria-labelledby="footer-newsletter-title"
      className="mb-14 grid items-center gap-8 rounded-3xl bg-mint p-6 md:p-10 lg:grid-cols-12 lg:gap-12"
    >
      <div className="flex items-start gap-4 lg:col-span-6">
        <span className="hidden size-12 shrink-0 place-items-center rounded-full bg-forest text-white sm:grid">
          <Mail className="size-5" aria-hidden />
        </span>
        <div>
          <p className="eyebrow text-forest">The newsletter</p>
          <h2 id="footer-newsletter-title" className="mt-2 font-display text-2xl leading-tight text-forest md:text-3xl">
            Good finds, delivered occasionally.
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
            Unusual gifts, clever products and thoughtful ideas, straight to your inbox. No more than a couple of emails a
            month.
          </p>
        </div>
      </div>
      <NewsletterForm id="footer-newsletter" tone="green" className="lg:col-span-6" />
    </section>
  );
}
