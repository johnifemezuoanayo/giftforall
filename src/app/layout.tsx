import type { Metadata, Viewport } from "next";
import { io } from "next/cache";
import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";
import { DM_Sans, Fraunces } from "next/font/google";
import { siteUrl } from "@/config/site";
import { getCategories, getContent } from "@/lib/api";
import { Providers } from "@/components/providers";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SavedDrawer } from "@/components/saved/saved-drawer";
import { SavedToast } from "@/components/saved/saved-toast";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const logoFont = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "600",
  style: ["normal", "italic"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const { site, heroSlides } = await getContent();
  const title = `${site.name} | Unique & Unusual Gift Ideas for Everyone`;
  const shareImage = heroSlides[0]?.image;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description: site.description,
      images: shareImage ? [{ url: `${shareImage.src}?w=1200&h=630&fit=crop&q=80`, width: 1200, height: 630, alt: shareImage.alt }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: site.description,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} ${logoFont.variable}`} data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col">
        <Suspense fallback={<main className="grid min-h-screen place-items-center" aria-busy="true">Loading gifts...</main>}>
          <SiteLayout>{children}</SiteLayout>
        </Suspense>
      </body>
    </html>
  );
}

async function SiteLayout({ children }: { children: ReactNode }) {
  await io();
  const [content, categories] = await Promise.all([getContent(), getCategories()]);
  const siteData = {
    site: content.site,
    mainMenus: content.mainMenus,
    exampleSearches: content.exampleSearches,
    popularSearches: content.popularSearches,
    categories,
  };

  return (
    <Providers siteData={siteData}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <SavedDrawer />
      <SavedToast />
    </Providers>
  );
}
