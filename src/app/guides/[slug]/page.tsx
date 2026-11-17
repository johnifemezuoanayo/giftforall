import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/cards/article-card";
import { ProductCard } from "@/components/product/product-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { siteUrl } from "@/config/site";
import { getContent, getProducts } from "@/lib/api";
import { getGuide, getProductsForGuide } from "@/lib/catalog";

export async function generateStaticParams() {
  const { articles } = await getContent();
  return articles.map((article) => ({ slug: article.href.replace("/guides/", "") }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.intro,
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.intro,
      images: [{ url: `${guide.image.src}?w=1200&h=630&fit=crop&q=80`, alt: guide.image.alt }],
    },
  };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) notFound();

  const [{ articles, site }, allProducts] = await Promise.all([getContent(), getProducts()]);
  const products = getProductsForGuide(guide, allProducts);
  const otherGuides = articles.filter((article) => article.id !== guide.id).slice(0, 3);

  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.intro,
    image: [guide.image.src],
    url: `${siteUrl}${guide.href}`,
    publisher: { "@type": "Organization", name: site.name },
  };

  return (
    <div className="container-page pb-20 pt-4 md:pb-28 md:pt-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData).replace(/</g, "\\u003c") }}
      />
      <Breadcrumbs
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Gift guides", href: "/guides" },
          { label: guide.title, href: guide.href },
        ]}
      />

      <article>
        <header className="mx-auto mt-10 max-w-3xl text-center md:mt-14">
          <p className="eyebrow text-clay">
            {guide.label} · {guide.readTime}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.1] md:text-[3.25rem]">{guide.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{guide.intro}</p>
        </header>

        <div className="relative mx-auto mt-10 aspect-[16/9] max-w-5xl overflow-hidden rounded-[1.75rem] bg-sand">
          <Image
            src={guide.image.src}
            alt={guide.image.alt}
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            quality={80}
            className="object-cover"
          />
        </div>

        {guide.body && guide.body.length > 0 && (
          <div className="mx-auto mt-10 max-w-2xl space-y-5 text-[1.08rem] leading-[1.85] text-ink-soft md:mt-14">
            {guide.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}

        <section aria-labelledby="picks-title" className="mt-14 md:mt-20">
          <h2 id="picks-title" className="text-center text-xl font-semibold text-forest md:text-2xl">
            our picks
          </h2>
          <p className="mt-2 text-center text-xs text-stone">
            We may earn a commission when you buy through links on this page.
          </p>
          <ul className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard
                  product={product}
                  showDetails
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                />
              </li>
            ))}
          </ul>
        </section>
      </article>

      {otherGuides.length > 0 && (
        <section aria-labelledby="more-guides-title" className="mt-20 border-t border-line pt-12 md:mt-28">
          <h2 id="more-guides-title" className="text-center text-xl font-semibold text-forest md:text-2xl">
            more gift guides
          </h2>
          <ul className="mt-8 grid gap-x-8 gap-y-12 md:grid-cols-3">
            {otherGuides.map((article) => (
              <li key={article.id}>
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
