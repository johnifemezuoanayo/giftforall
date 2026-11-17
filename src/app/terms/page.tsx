import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { getContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The rules for using this site.",
};

export default async function TermsPage() {
  const { site } = await getContent();

  return (
    <LegalPage
      title="Terms of use"
      href="/terms"
      updated="November 2026"
      intro={`By using ${site.name} you agree to these terms. They are short, and we have tried to keep them in plain English.`}
      contactEmail={site.contactEmail}
      sections={[
        {
          heading: "What this site is",
          paragraphs: [
            `${site.name} is a gift discovery site. We find products we think make good gifts and link to the retailers that sell them.`,
            "We are not a shop. We don't sell, ship or deliver anything.",
          ],
        },
        {
          heading: "Buying from retailers",
          paragraphs: [
            "When you click a product link you go to another company's website. Your purchase is an agreement between you and that retailer.",
            "The retailer is responsible for the product, the price, payment, delivery, returns and refunds. If something goes wrong with an order, please contact them.",
          ],
        },
        {
          heading: "Prices and product information",
          paragraphs: [
            "We do our best to keep product details and prices correct, but retailers change them often and we can't promise they are up to date. Always check the retailer's page before you buy.",
          ],
        },
        {
          heading: "Affiliate links",
          paragraphs: [
            "Many of our links are affiliate links, which means we may earn a commission when you buy. Our affiliate disclosure page explains this in full.",
          ],
        },
        {
          heading: "Our content",
          paragraphs: [
            "The words, design and logo on this site belong to us. Product names, photos and trademarks belong to their owners.",
            "You're welcome to share links to our pages. Please don't copy our content onto another site without asking first.",
          ],
        },
        {
          heading: "No guarantees",
          paragraphs: [
            "We provide this site as it is. We can't promise it will always be available or free of mistakes, and we are not responsible for losses that come from using it or from products you buy through it.",
          ],
        },
        {
          heading: "Changes to these terms",
          paragraphs: ["We may update these terms from time to time. The date at the top shows when they last changed."],
        },
      ]}
    />
  );
}
