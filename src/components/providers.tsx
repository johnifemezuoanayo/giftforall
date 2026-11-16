"use client";

import { MotionConfig } from "framer-motion";
import { SavedProvider } from "@/context/saved-context";
import { SiteDataProvider, type SiteData } from "@/context/site-data-context";

export function Providers({ siteData, children }: { siteData: SiteData; children: React.ReactNode }) {
  return (
    <SiteDataProvider value={siteData}>
      <MotionConfig reducedMotion="user">
        <SavedProvider>{children}</SavedProvider>
      </MotionConfig>
    </SiteDataProvider>
  );
}
