import type { Retailer, RetailerId } from "@/types";

export const retailers: Record<RetailerId, Retailer> = {
  amazon: { id: "amazon", name: "Amazon" },
  temu: { id: "temu", name: "Temu" },
};

export function getRetailerName(id: RetailerId) {
  return retailers[id]?.name ?? id;
}
