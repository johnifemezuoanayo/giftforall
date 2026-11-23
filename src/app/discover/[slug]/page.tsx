import { io } from "next/cache";
import { notFound } from "next/navigation";
import { ListingView, getListingMetadata } from "@/components/listing/listing-view";
import { getListingPage } from "@/lib/catalog";

export async function generateMetadata({ params }: PageProps<"/discover/[slug]">) {
  const { slug } = await params;
  const page = await getListingPage("discover", slug);
  return page ? getListingMetadata(page) : {};
}

export default async function DiscoverGiftsPage({ params }: PageProps<"/discover/[slug]">) {
  await io();
  const { slug } = await params;
  const page = await getListingPage("discover", slug);
  if (!page) notFound();
  return <ListingView page={page} />;
}
