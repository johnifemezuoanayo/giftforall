import { notFound } from "next/navigation";
import { ListingView, getListingMetadata } from "@/components/listing/listing-view";
import { getListingPage } from "@/lib/catalog";

export async function generateMetadata() {
  const page = await getListingPage("discover", "");
  return page ? getListingMetadata(page) : {};
}

export default async function DiscoverHomePage() {
  const page = await getListingPage("discover", "");
  if (!page) notFound();
  return <ListingView page={page} />;
}
