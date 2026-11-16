"use client";

type LoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

// Unsplash resizes images on its own CDN, so we ask it for the right size directly.
// Local images (from /public) are returned as they are.
export default function imageLoader({ src, width, quality }: LoaderProps) {
  if (!src.startsWith("https://images.unsplash.com/")) return src;

  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 70));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}
