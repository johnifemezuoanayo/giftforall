import { getCategories, getContent, getListingPages, getProducts } from "@/lib/api";
import { productMatchesRule } from "@/lib/product-rules";
import type { Article, Interest, ListingPage, ListingSection, Product, SectionInfo } from "@/types";

export async function getListingPage(section: ListingSection, slug: string) {
  const pages = await getListingPages();
  return pages.find((page) => page.section === section && page.slug === slug);
}

export async function getSectionPages(section: ListingSection) {
  const pages = await getListingPages();
  return pages.filter((page) => page.section === section);
}

// Everything a listing page needs, loaded together.
export async function getCatalog() {
  const [products, pages, categories, content] = await Promise.all([
    getProducts(),
    getListingPages(),
    getCategories(),
    getContent(),
  ]);
  return { products, pages, categories, content };
}

export function getPageHref(page: ListingPage, sections: Record<ListingSection, SectionInfo>) {
  const base = sections[page.section].basePath;
  return page.slug ? `${base}/${page.slug}` : base;
}

export function getProductsForListing(page: ListingPage, allProducts: Product[]): Product[] {
  const rule = page.rule;

  let products = rule.ids
    ? rule.ids.map((id) => allProducts.find((product) => product.id === id)).filter((product) => product !== undefined)
    : allProducts;

  products = products.filter((product) => productMatchesRule(product, rule));

  // Products come back in the order they were added, so newest means last first.
  if (rule.sort === "newest") return [...products].reverse();
  if (rule.sort === "featured") return getTopPicks(products, products.length);
  return products;
}

// Only show interest tiles that have at least one product on this page.
export function getInterestsForListing(page: ListingPage, products: Product[], categories: Interest[]) {
  return page.interests
    .filter((id) => products.some((product) => product.interests.includes(id)))
    .map((id) => categories.find((category) => category.id === id))
    .filter((category) => category !== undefined);
}

export function getTopPicks(products: Product[], count = 8) {
  const withBadge = products.filter((product) => product.badge);
  const others = products.filter((product) => !product.badge);
  return [...withBadge, ...others].slice(0, count);
}

export function getArticle(articles: Article[], id: string) {
  return articles.find((article) => article.id === id) ?? articles[0];
}

// Picks a product that fits the page's main interest, so each page shows a different editor's pick.
export function getEditorsPick(page: ListingPage, products: Product[]) {
  const mainInterest = page.interests[0];
  const matching = products.filter((product) => product.interests.includes(mainInterest));
  return matching.find((product) => product.badge) ?? matching[0] ?? getTopPicks(products)[0];
}
