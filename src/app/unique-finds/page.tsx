import { io } from "next/cache";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { ListingView, getListingMetadata } from "@/components/listing/listing-view";
import { getListingPage } from "@/lib/catalog";

export async function generateMetadata() {
  await connection();
  const page = await getListingPage("unique-finds", "");
  return page ? getListingMetadata(page) : {};
}

export default async function UniqueFindsHomePage() {
  await io();
  const page = await getListingPage("unique-finds", "");
  if (!page) notFound();
  return <ListingView page={page} />;
}
