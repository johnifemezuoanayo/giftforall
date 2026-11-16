import type { Price } from "@/types";

export function formatPrice(price: Price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
  }).format(price.amount);
}
