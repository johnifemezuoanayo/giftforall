import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { getContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Affiliate disclosure",
  description: "How we earn money from the links on this site, and what that means for you.",
};

export default async function AffiliateDisclosurePage() {
  const { site } = await getContent();

  return (
    <LegalPage
      title="Affiliate disclosure"
      href="/affiliate-disclosure"
      updated="November 2026"
      intro={`${site.name} is free to use. We pay for it with affiliate links, and we want to be clear about how that works.`}
      contactEmail={site.contactEmail}
      sections={[
        {
          heading: "What an affiliate link is",
          paragraphs: [
            `Most product links on ${site.name} are affiliate links. If you click one and buy something from the retailer, the retailer may pay us a small commission.`,
            "You pay the same price either way. The commission comes out of the retailer's share, not yours.",
          ],
        },
        {
          heading: "Amazon",
          paragraphs: [
            "As an Amazon Associate we earn from qualifying purchases.",
            "Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.",
          ],
        },
        {
          heading: "Other retailers",
          paragraphs: [
            "We also link to other retailers, such as Temu, through their affiliate programs. The same rule applies: we may earn a commission if you buy after clicking our link.",
          ],
        },
        {
          heading: "How we choose products",
          paragraphs: [
            "We pick gifts because we think they are interesting, useful or fun to give. Commissions don't decide what we feature, and retailers cannot pay to be included.",
            "We don't sell anything ourselves. Your order, payment, delivery and returns are all handled by the retailer you buy from.",
          ],
        },
        {
          heading: "Prices and availability",
          paragraphs: [
            "Prices and stock change often. The price shown on our site is the one we saw when we last checked, so it may be different on the retailer's site. The retailer's price at checkout is the one that counts.",
          ],
        },
      ]}
    />
  );
}
