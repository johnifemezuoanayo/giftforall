import type { InterestId, Product, RetailerId } from "@/types";

export type SortId = "recommended" | "price-low" | "price-high";
export type PriceId = "all" | "under-25" | "25-50" | "50-100" | "100-plus";

export type Filters = {
  interests: InterestId[];
  price: PriceId;
  retailers: RetailerId[];
  sort: SortId;
};

export const emptyFilters: Filters = {
  interests: [],
  price: "all",
  retailers: [],
  sort: "recommended",
};

export const sortOptions: { id: SortId; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "price-low", label: "Price: low to high" },
  { id: "price-high", label: "Price: high to low" },
];

export const priceOptions: { id: Exclude<PriceId, "all">; label: string; min: number; max: number }[] = [
  { id: "under-25", label: "Under $25", min: 0, max: 25 },
  { id: "25-50", label: "$25 – $50", min: 25, max: 50 },
  { id: "50-100", label: "$50 – $100", min: 50, max: 100 },
  { id: "100-plus", label: "$100+", min: 100, max: Infinity },
];

export function matchesPrice(product: Product, price: PriceId) {
  if (price === "all") return true;
  const option = priceOptions.find((item) => item.id === price);
  if (!option) return true;
  return product.price.amount >= option.min && product.price.amount < option.max;
}

export function filterProducts(products: Product[], filters: Filters) {
  const matching = products.filter((product) => {
    if (filters.interests.length > 0 && !product.interests.some((id) => filters.interests.includes(id))) return false;
    if (filters.retailers.length > 0 && !filters.retailers.includes(product.retailer)) return false;
    return matchesPrice(product, filters.price);
  });

  if (filters.sort === "price-low") return [...matching].sort((a, b) => a.price.amount - b.price.amount);
  if (filters.sort === "price-high") return [...matching].sort((a, b) => b.price.amount - a.price.amount);
  return matching;
}

export function countActiveFilters(filters: Filters) {
  return filters.interests.length + filters.retailers.length + (filters.price === "all" ? 0 : 1);
}
