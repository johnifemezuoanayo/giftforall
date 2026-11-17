import Link from "next/link";
import {
  ArrowUpRight,
  RefreshCw,
  ShieldCheck,
  Store,
} from "lucide-react";
import { siteUrl } from "@/config/site";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Carousel } from "@/components/ui/carousel";
import {
  getCatalog,
  getGiftPagesForProduct,
  getPageHref,
  getSimilarProducts,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { getProductHref } from "@/lib/links";
import { getRetailerName } from "@/lib/retailers";
import type { Audience, Product } from "@/types";
import { ProductActions } from "./product-actions";
import { ProductCard } from "./product-card";
import { ProductGallery } from "./product-gallery";

const audienceLabels: Record<Audience, string> = {
  men: "Him",
  women: "Her",
  kids: "Kids",
  couples: "Couples",
  everyone: "Anyone",
};

const pillClass =
  "inline-flex h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-gold/25 px-5 text-sm font-semibold text-forest transition-colors hover:bg-gold/50";

function jsonForScript(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export async function ProductView({ product }: { product: Product }) {
  const catalog = await getCatalog();
  const { sections } = catalog.content;
  const retailerName = getRetailerName(product.retailer);
  const similar = getSimilarProducts(product, catalog.products);
  const giftPages = getGiftPagesForProduct(product, catalog.pages);
  const interests = product.interests
    .map((id) => catalog.categories.find((category) => category.id === id))
    .filter((category) => category !== undefined);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "All gifts", href: sections.discover.basePath },
    { label: product.name, href: getProductHref(product) },
  ];

  const productData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.details ?? product.description,
    image: [
      product.image.src,
      ...(product.altImage ? [product.altImage.src] : []),
    ],
    url: `${siteUrl}${getProductHref(product)}`,
    // Sample prices are made up, so search engines should not see them.
    ...(product.isSampleData
      ? {}
      : {
          offers: {
            "@type": "Offer",
            price: product.price.amount,
            priceCurrency: product.price.currency,
            url: `${siteUrl}${getProductHref(product)}`,
            seller: { "@type": "Organization", name: retailerName },
          },
        }),
  };

  const notes = [
    {
      icon: Store,
      text: `You'll check out on ${retailerName}, with their shipping and returns.`,
    },
    {
      icon: RefreshCw,
      text: `Prices and stock can change. ${retailerName} always shows the latest.`,
    },
    {
      icon: ShieldCheck,
      text: "We may earn a small commission if you buy. It never costs you extra.",
    },
  ];

  return (
    <div className="bg-white pb-20 md:pb-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonForScript(productData) }}
      />

      <div className="container-page pt-4 md:pt-6">
        <Breadcrumbs crumbs={crumbs} />

        <div className="mt-5 grid gap-8 md:mt-7 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-7">
            <ProductGallery product={product} />
          </div>

          <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
            <p className="eyebrow text-olive">Available at {retailerName}</p>
            <h1 className="mt-3 font-display text-3xl leading-[1.12] md:text-4xl xl:text-[2.75rem]">
              {product.name}
            </h1>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-soft">
              {product.description}
            </p>

            <p className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-semibold">
                {formatPrice(product.price)}
              </span>
              {product.isSampleData && (
                <span className="text-xs text-stone">Sample price</span>
              )}
            </p>

            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="mt-6 flex h-14 items-center justify-center gap-2 rounded-full bg-forest px-8 text-base font-semibold text-white transition-colors hover:bg-forest-dark active:scale-[0.99]"
              aria-label={`Check out ${product.name} at ${retailerName} (opens in a new tab)`}
            >
              Check it out at {retailerName}
              <ArrowUpRight className="size-5" aria-hidden />
            </a>

            <div className="mt-3">
              <ProductActions product={product} />
            </div>

            <ul className="mt-7 space-y-3 border-t border-line pt-6">
              {notes.map((note) => (
                <li
                  key={note.text}
                  className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft"
                >
                  <note.icon
                    className="mt-0.5 size-4 shrink-0 text-forest"
                    aria-hidden
                  />
                  {note.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <section
        aria-labelledby="story-title"
        className="container-page mt-16 md:mt-24"
      >
        <div className="grid gap-10 border-t border-line pt-10 md:grid-cols-12 md:gap-12 md:pt-14">
          <div className="md:col-span-7">
            <h2
              id="story-title"
              className="font-display text-2xl leading-tight md:text-3xl"
            >
              the story
            </h2>
            <p className="mt-5 text-[1.05rem] leading-[1.85] text-ink-soft">
              {product.details ?? product.description}
            </p>
          </div>

          <div className="md:col-span-5">
            <h2 className="font-display text-2xl leading-tight md:text-3xl">
              the details
            </h2>
            <dl className="mt-5 divide-y divide-line border-y border-line text-sm">
              <div className="flex gap-4 py-3.5">
                <dt className="w-28 shrink-0 font-semibold">Sold by</dt>
                <dd className="text-ink-soft">{retailerName}</dd>
              </div>
              <div className="flex gap-4 py-3.5">
                <dt className="w-28 shrink-0 font-semibold">Price</dt>
                <dd className="text-ink-soft">
                  {formatPrice(product.price)}
                  {product.isSampleData
                    ? " (sample price)"
                    : " when we last checked"}
                </dd>
              </div>
              {product.audiences.length > 0 && (
                <div className="flex gap-4 py-3.5">
                  <dt className="w-28 shrink-0 font-semibold">A gift for</dt>
                  <dd className="text-ink-soft">
                    {product.audiences
                      .map((audience) => audienceLabels[audience])
                      .join(", ")}
                  </dd>
                </div>
              )}
              {interests.length > 0 && (
                <div className="flex gap-4 py-3.5">
                  <dt className="w-28 shrink-0 font-semibold">Good for</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-1.5">
                      {interests.map((interest) => (
                        <li key={interest.id}>
                          <Link
                            href={`/search?q=${encodeURIComponent(interest.label)}`}
                            className="inline-block rounded-full bg-mint px-3 py-1 text-xs font-medium text-forest transition-colors hover:bg-forest hover:text-white"
                          >
                            {interest.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </section>

      {giftPages.length > 0 && (
        <section
          aria-labelledby="gift-pages-title"
          className="container-page mt-16 text-center md:mt-20"
        >
          <h2
            id="gift-pages-title"
            className="text-xl font-semibold text-forest md:text-2xl"
          >
            find more like this in
          </h2>
          <ul className="no-scrollbar -mx-5 mt-5 flex gap-3 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:justify-center md:px-0">
            {giftPages.map((page) => (
              <li key={page.slug}>
                <Link href={getPageHref(page, sections)} className={pillClass}>
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {similar.length > 0 && (
        <section
          aria-labelledby="similar-products-title"
          className="container-page mt-16 md:mt-20"
        >
          <h2
            id="similar-products-title"
            className="mb-6 text-center text-xl font-semibold text-forest md:text-2xl"
          >
            you may also like
          </h2>
          <Carousel label="You may also like">
            {similar.map((item) => (
              <div
                key={item.id}
                className="w-[64vw] shrink-0 snap-start sm:w-[40vw] md:w-[30vw] lg:w-[22vw] xl:w-[260px]"
              >
                <ProductCard
                  product={item}
                  sizes="(min-width: 1280px) 260px, (min-width: 768px) 30vw, 64vw"
                />
              </div>
            ))}
          </Carousel>
        </section>
      )}
    </div>
  );
}
