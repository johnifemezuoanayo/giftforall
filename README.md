# giftforall – Gift discovery homepage

Homepage for an affiliate gift discovery site. People browse gifts, save the ones they like, then buy on the retailer's website (Amazon, Temu, etc.). There is no login, checkout or payment.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, Framer Motion, Lucide icons.

## Where things live

| What | Where |
| --- | --- |
| Brand name, menus, footer links | `src/config/site.ts` |
| Sample products (trending carousel) | `src/data/products.ts` |
| Recipients, collections, occasions, articles, videos | `src/data/home.ts` |
| Data types | `src/types/index.ts` |
| Retailers and affiliate link helpers | `src/lib/retailers.ts` |
| Saved items (kept in localStorage) | `src/context/saved-context.tsx` |
| Listing pages: wording, editorial intro (`feature`) and which products show (`rule`) | `src/data/recipient-pages.ts` (`/gifts/...`), `occasion-pages.ts` (`/occasions/...`), `discover-pages.ts` (`/discover/...`), `unique-finds-pages.ts` (`/unique-finds/...`) |
| Shared listing page layout (intro, filters, grid) | `src/components/listing/` |
| Interest tiles | `src/data/interests.ts` |
| Gift finder (`/gift-finder`): people, occasions and budgets | `src/data/gift-finder.ts` |
| Gift finder matching and ranking | `src/lib/gift-finder.ts` |
| Page sections | `src/components/sections/` |
| Reusable cards (product, collection, article, ...) | `src/components/cards/`, `src/components/product/` |
| Colors and fonts | `src/app/globals.css` (`@theme`) |

## Before launch

- The site reads its catalog and content from the backend at request time, so `npm run build` does not need a live API. Set `API_URL` and `NEXT_PUBLIC_API_URL` to the backend's internal and public addresses when running the site.
- **Brand name:** change `site.name` in `src/config/site.ts`.
- **Products:** everything in `src/data/` is sample data. Prices are marked "Sample price" on the page. Replace with approved affiliate product data. Each product only needs to match the `Product` type.
- **Affiliate links:** sample products use retailer search links. Set `NEXT_PUBLIC_AMAZON_TAG` to add your Amazon Associates tag, or put real product links in `affiliateUrl`.
- **New retailer:** add it to `RetailerId` in `src/types/index.ts` and to `retailers` in `src/lib/retailers.ts`.
- **Site URL:** set `NEXT_PUBLIC_SITE_URL` so Open Graph links are correct.
- **Images:** photos come from Unsplash and are resized by Unsplash's CDN (`src/lib/image-loader.ts`). Local images in `/public` also work.
- **Newsletter:** the form only checks the email and shows a success message. Connect it to your email provider.
- **Contact page (`/about#contact`):** the form only checks the fields and shows a success message. Connect it to a form or email service, and replace the placeholder `contactEmail` in `src/config/site.ts`. `/contact` redirects to this section.
- **About page wording:** statements like "commissions never decide what we feature" are placeholder brand promises. Make sure they match how you actually run the site.
- **Videos:** add a `videoUrl` to any item in `discoveryVideos` and it will play in the pop-up.
- **Product hover media:** in `src/data/products.ts`, give a product an `altPhotoId` (second photo) or a `videoUrl` (short muted clip). It shows when someone hovers the product photo or taps the "+1 photo" / "video" button. The cactus planter uses a free CC0 sample clip from MDN; swap it for a real product video.

Links to pages that don't exist yet (gift guides, categories, etc.) show a friendly "coming soon" page.
