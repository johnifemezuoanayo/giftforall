import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ListingSkeleton, ListingView, getListingMetadata } from "@/components/listing/listing-view";
import { getListingPage, getSectionPages } from "@/lib/catalog";

export async function generateStaticParams() {
  const pages = await getSectionPages("occasions");
  return pages.filter((page) => page.slug).map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps<"/occasions/[slug]">) {
  const { slug } = await params;
  const page = await getListingPage("occasions", slug);
  return page ? getListingMetadata(page) : {};
}

export default function OccasionGiftsPage({ params }: PageProps<"/occasions/[slug]">) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <OccasionGiftsContent params={params} />
    </Suspense>
  );
}

async function OccasionGiftsContent({ params }: { params: PageProps<"/occasions/[slug]">["params"] }) {
  const { slug } = await params;
  const page = await getListingPage("occasions", slug);
  if (!page) notFound();
  return <ListingView page={page} />;
}
