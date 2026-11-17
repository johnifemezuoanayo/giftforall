import { notFound } from "next/navigation";
import { ListingView, getListingMetadata } from "@/components/listing/listing-view";
import { getListingPage, getSectionPages } from "@/lib/catalog";

export async function generateStaticParams() {
  const pages = await getSectionPages("gifts");
  return pages.filter((page) => page.slug).map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gifts/[slug]">) {
  const { slug } = await params;
  const page = await getListingPage("gifts", slug);
  return page ? getListingMetadata(page) : {};
}

export default async function RecipientGiftsPage({ params }: PageProps<"/gifts/[slug]">) {
  const { slug } = await params;
  const page = await getListingPage("gifts", slug);
  if (!page) notFound();
  return <ListingView page={page} />;
}
