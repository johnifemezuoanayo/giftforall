import { io } from "next/cache";
import { Hero } from "@/components/sections/hero";
import { PromiseStrip } from "@/components/sections/promise-strip";
import { RecipientsSection } from "@/components/sections/recipients-section";
import { CollectionsSection } from "@/components/sections/collections-section";
import { TrendingSection } from "@/components/sections/trending-section";
import { OccasionsSection } from "@/components/sections/occasions-section";
import { GuidesSection } from "@/components/sections/guides-section";
import { VideoSection } from "@/components/sections/video-section";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { getContent, getProducts } from "@/lib/api";

export default async function HomePage() {
  await io();
  const [content, products] = await Promise.all([getContent(), getProducts()]);
  const trendingProducts = products.filter((product) => product.trending);

  return (
    <>
      <Hero shortcuts={content.heroShortcuts} slides={content.heroSlides} />
      <PromiseStrip />
      <RecipientsSection recipients={content.recipients} />
      <CollectionsSection collections={content.collections} />
      <TrendingSection products={trendingProducts} />
      <OccasionsSection occasions={content.occasions} />
      <GuidesSection articles={content.articles} />
      <VideoSection videos={content.discoveryVideos} />
      <NewsletterSection />
    </>
  );
}
