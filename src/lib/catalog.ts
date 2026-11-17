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

export async function getProduct(id: string) {
  const products = await getProducts();
  return products.find((product) => product.id === id);
}

// Products with a shared interest come first, then ones for the same kind of person.
export function getSimilarProducts(product: Product, allProducts: Product[], count = 8) {
  const others = allProducts.filter((item) => item.id !== product.id);
  const sameInterest = others.filter((item) => item.interests.some((interest) => product.interests.includes(interest)));
  const sameAudience = others.filter(
    (item) => !sameInterest.includes(item) && item.audiences.some((audience) => product.audiences.includes(audience)),
  );
  return [...sameInterest, ...sameAudience].slice(0, count);
}

export function getGiftPagesForProduct(product: Product, pages: ListingPage[], count = 5) {
  return pages
    .filter((page) => page.section === "gifts" && page.slug && productMatchesRule(product, page.rule))
    .slice(0, count);
}

export async function getGuide(slug: string) {
  const content = await getContent();
  return content.articles.find((article) => article.href === `/guides/${slug}`);
}

export function getProductsForGuide(article: Article, allProducts: Product[], count = 12) {
  const rule = article.rule;
  if (!rule) return getTopPicks(allProducts, count);
  return getTopPicks(
    allProducts.filter((product) => productMatchesRule(product, rule)),
    count,
  );
}
