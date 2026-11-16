import type { Product, ProductRule } from "@/types";

export function productMatchesRule(product: Product, rule: ProductRule) {
  if (rule.ids && !rule.ids.includes(product.id)) return false;
  if (rule.trending && !product.trending) return false;
  if (rule.audiences && !product.audiences.some((audience) => rule.audiences?.includes(audience))) return false;
  if (rule.interests && !product.interests.some((interest) => rule.interests?.includes(interest))) return false;
  if (rule.maxPrice !== undefined && product.price.amount > rule.maxPrice) return false;
  return true;
}
