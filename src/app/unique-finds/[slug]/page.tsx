import { io } from "next/cache";
import { notFound } from "next/navigation";
import { ListingView, getListingMetadata } from "@/components/listing/listing-view";
import { getListingPage } from "@/lib/catalog";

export async function generateMetadata({ params }: PageProps<"/unique-finds/[slug]">) {
  const { slug } = await params;
  const page = await getListingPage("unique-finds", slug);
  return page ? getListingMetadata(page) : {};
}

export default async function UniqueFindsPage({ params }: PageProps<"/unique-finds/[slug]">) {
  await io();
  const { slug } = await params;
  const page = await getListingPage("unique-finds", slug);
  if (!page) notFound();
  return <ListingView page={page} />;
}
