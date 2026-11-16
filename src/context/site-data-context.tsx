"use client";

import { createContext, useContext } from "react";
import type { Interest, NavMenu, SiteInfo } from "@/types";

export type SiteData = {
  site: SiteInfo;
  mainMenus: NavMenu[];
  exampleSearches: string[];
  popularSearches: string[];
  categories: Interest[];
};

const SiteDataContext = createContext<SiteData | null>(null);

export function SiteDataProvider({ value, children }: { value: SiteData; children: React.ReactNode }) {
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  const value = useContext(SiteDataContext);
  if (!value) throw new Error("useSiteData must be used inside SiteDataProvider");
  return value;
}
