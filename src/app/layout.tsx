import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
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

export async function generateMetadata(): Promise<Metadata> {
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
  themeColor: "#f7f3ed",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [content, categories] = await Promise.all([getContent(), getCategories()]);
  const siteData = {
    site: content.site,
    mainMenus: content.mainMenus,
    exampleSearches: content.exampleSearches,
    popularSearches: content.popularSearches,
    categories,
  };

  return (
    <html lang="en" className={dmSans.variable} data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col">
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
      </body>
    </html>
  );
}
