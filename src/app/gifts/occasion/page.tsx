import type { Metadata } from "next";
import { SectionIndex } from "@/components/listing/section-index";

export const metadata: Metadata = {
  title: "Gifts by occasion",
  description: "Gift ideas for Christmas, birthdays, anniversaries, weddings and every occasion in between.",
};

export default function GiftsByOccasionPage() {
  return (
    <SectionIndex
      section="occasions"
      title="gifts by occasion"
      intro="Whatever you're celebrating, there's a gift for it. Pick the occasion to see our favourites."
    />
  );
}
