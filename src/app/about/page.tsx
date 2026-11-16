import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronRight, Quote } from "lucide-react";
import { getContent, getListingPages, getProducts } from "@/lib/api";
import { retailers } from "@/lib/retailers";
import { unsplash } from "@/lib/images";
import { ContactSection } from "@/components/about/contact-section";
import { BagIcon, GiftIcon, UnlockIcon } from "@/components/icons/promise-icons";
import { Headline } from "@/components/listing/feature-header";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return {
    title: "About Us & Contact",
    description: `${site.name} is an independent gift discovery magazine. Learn how we pick gifts, how we make money, and how to get in touch.`,
  };
}

const steps = [
  {
    Icon: GiftIcon,
    title: "We hunt",
    text: "Our team trawls the internet for clever, beautiful and slightly unexpected things, then picks only the ones we'd be happy to receive.",
  },
  {
    Icon: UnlockIcon,
    title: "You save",
    text: "Browse by person, occasion or budget and save the gifts you love. No account, no sign-up, no spam.",
  },
  {
    Icon: BagIcon,
    title: "You buy direct",
    text: "When you're ready, we send you to the retailer, such as Amazon or Temu, to buy it there. We never handle your order or payment.",
  },
];

const getFaqs = (siteName: string) => [
  {
    question: `Does ${siteName} sell products?`,
    answer:
      "No. We don't stock, sell or ship anything. Every product links to a retailer's website, where you buy it directly from them. Questions about an order, delivery or a return go to that retailer.",
  },
  {
    question: "Why is the price different at the retailer?",
    answer:
      "Retailers change their prices and stock all the time, so the price you see on the retailer's website is always the one that counts. Prices on our site are a guide only.",
  },
  {
    question: "How do saved items work without an account?",
    answer:
      "When you tap Save, the gift is stored in your own browser on this device. Nothing is sent to us. If you clear your browser data or switch devices, your saved list starts fresh.",
  },
  {
    question: "Do you get paid when I buy something?",
    answer:
      "Sometimes. Many links on our site are affiliate links, so we may earn a small commission from qualifying purchases at no extra cost to you. It never changes the price you pay.",
  },
  {
    question: "Can I suggest a gift or get my product listed?",
    answer:
      "Yes, please! Use the contact form and choose \"Suggest a gift\". Our editors look at every suggestion, and if it's a great fit, we'll add it to the collection.",
  },
];

export default async function AboutPage() {
  const [{ site }, products, pages] = await Promise.all([getContent(), getProducts(), getListingPages()]);
  const faqs = getFaqs(site.name);
  const facts = [
    { value: products.length, label: "hand-picked finds" },
    { value: pages.length, label: "gift guides & edits" },
    { value: Object.keys(retailers).length, label: "trusted retailers" },
    { value: 0, label: "accounts needed" },
  ];

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
                About us
              </span>
            </li>
          </ol>
        </nav>

        <header className="grid gap-x-14 pb-16 pt-6 md:pt-8 lg:grid-cols-12 lg:items-center lg:pb-20">
          <div className="lg:col-span-6">
            <span className="rounded-full bg-forest px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
              About us
            </span>
            <h1 className="mt-5 font-display text-[2.3rem] leading-[1.12] sm:text-5xl xl:text-[3.5rem]">
              <Headline text="We window-shop the internet so you don't have to" highlight="window-shop" />
            </h1>
            <div className="mt-7 space-y-4 text-[1.02rem] leading-[1.85] text-ink-soft md:text-[1.06rem]">
              <p>
                <strong className="text-ink">{site.name}</strong> is an independent gift discovery magazine, run by a small
                team who spend far too much time online looking at clever, beautiful and slightly ridiculous things.
              </p>
              <p>
                Our philosophy is simple: only show the good stuff. No filler, no endless lists of the same ten
                products. Just interesting, well-made and often unexpected gifts for the people you care about.
              </p>
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/discover"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-forest px-7 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
              >
                Start exploring
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <a
                href="#contact"
                className="inline-flex h-12 items-center rounded-full border-2 border-forest px-7 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white"
              >
                Get in touch
              </a>
            </div>
          </div>

          <div className="relative mt-12 lg:col-span-6 lg:mt-0">
            <div className="absolute -right-2 -top-4 bottom-10 left-10 rounded-[2rem] bg-mint md:-right-4 md:-top-6 md:left-16" aria-hidden />
            <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem] bg-sand shadow-[0_30px_60px_-35px_rgba(15,90,58,0.55)]">
              <Image
                src={unsplash("1497032628192-86f99bcd76bc")}
                alt="A tidy desk with a laptop, notebook, coffee and gadgets seen from above"
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 100vw"
                quality={80}
                className="object-cover"
              />
            </div>
            <figure className="absolute -bottom-7 left-4 w-[min(340px,88%)] rounded-2xl bg-white p-4 pr-5 shadow-[0_20px_40px_-20px_rgba(29,27,24,0.45)] md:left-6">
              <Quote className="size-5 text-gold" aria-hidden />
              <blockquote className="mt-1 text-sm font-semibold leading-snug">
                Our one rule: only list things we&apos;d be genuinely happy to receive ourselves.
              </blockquote>
              <figcaption className="mt-1.5 text-xs text-stone">The {site.name} team</figcaption>
            </figure>
          </div>
        </header>

        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {facts.map((fact) => (
            <li key={fact.label} className="bg-paper px-5 py-6 text-center md:py-8">
              <span className="block font-display text-4xl text-forest md:text-5xl">{fact.value}</span>
              <span className="mt-1 block text-sm text-stone">{fact.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <section aria-labelledby="how-title" className="container-page mt-20 md:mt-28">
        <div className="rounded-3xl bg-mint px-6 py-12 md:px-10 md:py-16">
          <h2 id="how-title" className="text-center font-display text-[2rem] leading-[1.1] text-forest md:text-5xl">
            how {site.name} works
          </h2>
          <ol className="mx-auto mt-10 grid max-w-5xl gap-10 md:mt-14 md:grid-cols-3 md:gap-8">
            {steps.map(({ Icon, title, text }, index) => (
              <li key={title} className="relative flex flex-col items-center text-center">
                {index < steps.length - 1 && (
                  <span
                    className="absolute left-[calc(50%+4.5rem)] top-14 hidden h-px w-[calc(100%-9rem+2rem)] border-t-2 border-dashed border-forest/30 md:block"
                    aria-hidden
                  />
                )}
                <span className="relative grid size-28 place-items-center rounded-full bg-white shadow-[0_8px_24px_-16px_rgba(15,90,58,0.45)]">
                  <Icon className="size-[4.5rem] text-forest" />
                  <span className="absolute -right-1 -top-1 grid size-8 place-items-center rounded-full bg-gold text-sm font-bold text-ink">
                    {index + 1}
                  </span>
                </span>
                <h3 className="mt-5 text-base font-semibold uppercase tracking-[0.16em]">{title}</h3>
                <p className="mt-2 max-w-xs leading-relaxed text-ink-soft">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="money-title" className="container-page mt-20 md:mt-28">
        <div className="grid gap-6 border-y border-line py-12 md:grid-cols-12 md:gap-10 md:py-16">
          <h2 id="money-title" className="font-display text-[1.75rem] leading-tight md:col-span-4 md:text-4xl">
            honest about how we make money
          </h2>
          <div className="space-y-4 text-[1.02rem] leading-[1.85] text-ink-soft md:col-span-8">
            <p>
              Many of the links on our site are affiliate links. If you click through and buy something, the retailer
              may pay us a small commission, at no extra cost to you. That&apos;s how we keep {site.name} free.
            </p>
            <p>
              But commissions never decide what we feature. We list plenty of things we earn nothing from, simply
              because we love them. <strong className="text-ink">We don&apos;t stock or sell any of the products on this site</strong>,
              and we never see your payment details.
            </p>
            <a
              href="#affiliate-disclosure"
              className="inline-flex items-center gap-1.5 font-semibold text-forest underline decoration-gold decoration-2 underline-offset-4 hover:decoration-forest"
            >
              Read our affiliate disclosure
              <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-title" className="scroll-mt-36 bg-cream py-20 md:mt-28 md:py-24">
        <div className="container-page">
          <ContactSection email={site.contactEmail} />
        </div>
      </section>

      <section aria-labelledby="faq-title" className="container-page py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 id="faq-title" className="text-center font-display text-[2rem] leading-[1.1] md:text-5xl">
            questions we get a lot
          </h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[1.05rem] font-semibold [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown
                    className="size-5 shrink-0 text-stone transition-transform duration-300 group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="pb-5 pr-8 leading-relaxed text-ink-soft">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
