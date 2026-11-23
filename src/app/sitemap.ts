import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { siteUrl } from "@/config/site";
import { getCatalog, getPageHref } from "@/lib/catalog";
import { getProductHref } from "@/lib/links";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const catalog = await getCatalog();
  const { sections, articles } = catalog.content;

  const fixedPages = [
    "/",
    "/about",
    "/gift-finder",
    "/gifts/recipient",
    "/gifts/occasion",
    "/guides",
    "/affiliate-disclosure",
    "/privacy",
    "/terms",
  ];

  const paths = [
    ...fixedPages,
    ...catalog.pages.map((page) => getPageHref(page, sections)),
    ...articles.map((article) => article.href),
    ...catalog.products.map((product) => getProductHref(product)),
  ];

  return paths.map((path) => ({ url: `${siteUrl}${path === "/" ? "" : path}` }));
}
