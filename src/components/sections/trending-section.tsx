import { ProductCard } from "@/components/product/product-card";
import { Carousel } from "@/components/ui/carousel";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Product } from "@/types";

export function TrendingSection({ products }: { products: Product[] }) {
  const hasSampleData = products.some((product) => product.isSampleData);

  return (
    <section id="trending" aria-labelledby="trending-title" className="scroll-mt-32 bg-white py-20 md:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="trending-title"
            eyebrow="Trending"
            title="Interesting finds right now."
            text="The gifts people keep coming back to this week."
            link={{ label: "Shop all trending", href: "/unique-finds/trending" }}
          />
        </Reveal>

        <Carousel label="Trending products">
          {products.map((product) => (
            <div key={product.id} className="w-[72vw] shrink-0 snap-start sm:w-[44vw] md:w-[34vw] lg:w-[23vw] xl:w-[300px]">
              <ProductCard product={product} />
            </div>
          ))}
        </Carousel>

        {hasSampleData && (
          <p className="mt-6 max-w-2xl text-xs leading-relaxed text-stone">
            Products and prices shown here are sample data for illustration only. Real prices and availability are set by
            each retailer and may change.
          </p>
        )}
      </div>
    </section>
  );
}
