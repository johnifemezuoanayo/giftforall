import { cacheLife, cacheTag } from "next/cache";
import type { Interest, ListingPage, Product, SiteContent } from "@/types";

const apiUrl = process.env.API_URL ?? "http://localhost:5000";

// The backend calls /api/revalidate with this tag whenever something changes in the dashboard.
export const SITE_DATA_TAG = "site-data";

async function getFromApi<T>(path: string): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`);
  if (!response.ok) {
    throw new Error(`Backend request to ${path} failed with status ${response.status}`);
  }
  return response.json();
}

export async function getContent(): Promise<SiteContent> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SITE_DATA_TAG);
  const data = await getFromApi<{ content: SiteContent }>("/api/content");
  return data.content;
}

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SITE_DATA_TAG);
  const data = await getFromApi<{ products: Product[] }>("/api/products");
  return data.products;
}

export async function getCategories(): Promise<Interest[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SITE_DATA_TAG);
  const data = await getFromApi<{ categories: Interest[] }>("/api/categories");
  return data.categories;
}

export async function getListingPages(): Promise<ListingPage[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SITE_DATA_TAG);
  const data = await getFromApi<{ pages: ListingPage[] }>("/api/pages");
  return data.pages;
}

export type SearchUnderstood = {
  keywords: string[];
  audiences: string[];
  maxPrice: number | null;
  categories: string[];
};

export async function searchProducts(query: string): Promise<{ products: Product[]; understood: SearchUnderstood }> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SITE_DATA_TAG);
  return getFromApi(`/api/products?search=${encodeURIComponent(query)}`);
}
