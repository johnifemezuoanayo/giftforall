import type { Metadata } from "next";
import { io } from "next/cache";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/product/product-view";
import { getProduct } from "@/lib/catalog";

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: `${product.image.src}?w=1200&h=630&fit=crop&q=80`, alt: product.image.alt }],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  await io();
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  return <ProductView product={product} />;
}
