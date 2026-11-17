import type { Product } from "@/types";

export function getProductHref(product: Product) {
  return `/products/${product.id}`;
}
