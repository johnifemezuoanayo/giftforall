import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  redirects() {
    return [
      { source: "/contact", destination: "/about#contact", permanent: false },
      // Collections don't have their own pages. Each one opens the gift page that fits it best.
      { source: "/collections", destination: "/discover", permanent: false },
      { source: "/collections/make-you-smile", destination: "/unique-finds/funny", permanent: false },
      { source: "/collections/didnt-know-they-needed", destination: "/unique-finds/home", permanent: false },
      { source: "/collections/has-everything", destination: "/gifts/has-everything", permanent: false },
      { source: "/collections/clever-gadgets", destination: "/unique-finds/gadgets", permanent: false },
      { source: "/collections/small-gifts", destination: "/discover/under-25", permanent: false },
    ];
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    qualities: [70, 80],
  },
};

export default nextConfig;
