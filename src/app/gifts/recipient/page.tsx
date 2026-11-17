import type { Metadata } from "next";
import { SectionIndex } from "@/components/listing/section-index";

export const metadata: Metadata = {
  title: "Gifts by recipient",
  description: "Gift ideas sorted by who you're shopping for: dad, mom, partners, friends, kids and more.",
};

export default function GiftsByRecipientPage() {
  return (
    <SectionIndex
      section="gifts"
      title="gifts by recipient"
      intro="Start with the person. Pick who you're shopping for and we'll show you gifts that suit them."
    />
  );
}
