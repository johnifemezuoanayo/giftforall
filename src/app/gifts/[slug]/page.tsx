import { io } from "next/cache";
import { notFound } from "next/navigation";
import { ListingView, getListingMetadata } from "@/components/listing/listing-view";
import { getListingPage } from "@/lib/catalog";

export async function generateMetadata({ params }: PageProps<"/gifts/[slug]">) {
  const { slug } = await params;
  const page = await getListingPage("gifts", slug);
  return page ? getListingMetadata(page) : {};
}

export default async function RecipientGiftsPage({ params }: PageProps<"/gifts/[slug]">) {
  await io();
  const { slug } = await params;
  const page = await getListingPage("gifts", slug);
  if (!page) notFound();
  return <ListingView page={page} />;
}
