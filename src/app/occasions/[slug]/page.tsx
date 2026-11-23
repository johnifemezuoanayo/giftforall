import { io } from "next/cache";
import { notFound } from "next/navigation";
import { ListingView, getListingMetadata } from "@/components/listing/listing-view";
import { getListingPage } from "@/lib/catalog";

export async function generateMetadata({ params }: PageProps<"/occasions/[slug]">) {
  const { slug } = await params;
  const page = await getListingPage("occasions", slug);
  return page ? getListingMetadata(page) : {};
}

export default async function OccasionGiftsPage({ params }: PageProps<"/occasions/[slug]">) {
  await io();
  const { slug } = await params;
  const page = await getListingPage("occasions", slug);
  if (!page) notFound();
  return <ListingView page={page} />;
}
