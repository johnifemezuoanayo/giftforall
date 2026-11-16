import { notFound } from "next/navigation";
import { ListingView, getListingMetadata } from "@/components/listing/listing-view";
import { getListingPage } from "@/lib/catalog";

export async function generateMetadata() {
  const page = await getListingPage("unique-finds", "");
  return page ? getListingMetadata(page) : {};
}

export default async function UniqueFindsHomePage() {
  const page = await getListingPage("unique-finds", "");
  if (!page) notFound();
  return <ListingView page={page} />;
}
