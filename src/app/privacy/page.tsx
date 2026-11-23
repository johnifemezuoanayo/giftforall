import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { io } from "next/cache";
import { getContent } from "@/lib/api";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What information we collect, why we collect it and how you can ask us to remove it.",
};

export default async function PrivacyPage() {
  await io();
  const { site } = await getContent();

  return (
    <LegalPage
      title="Privacy policy"
      href="/privacy"
      updated="November 2026"
      intro={`This page explains what ${site.name} knows about you and what we do with it. The short version: very little, and we don't sell it.`}
      contactEmail={site.contactEmail}
      sections={[
        {
          heading: "What we collect",
          paragraphs: [
            "Newsletter: if you sign up, we save your email address and the page you signed up from.",
            "Contact form: if you write to us, we save your name, email address and message so we can reply.",
            "Link clicks: when you click a product link, we count the click. We record which product and retailer it was and when it happened. We don't record who you are.",
            "You don't need an account to use the site, and we never see your payment details. Those stay with the retailer you buy from.",
          ],
        },
        {
          heading: "Saved items",
          paragraphs: [
            "Gifts you save are stored in your own browser, on your device. They are not sent to us, and they disappear if you clear your browser data.",
          ],
        },
        {
          heading: "How we use it",
          paragraphs: [
            "We use your email address to send the newsletter you asked for, and to reply when you contact us.",
            "We use click counts to see which gifts people find interesting, so we can pick better ones.",
            "We don't sell or rent your information to anyone.",
          ],
        },
        {
          heading: "Who else is involved",
          paragraphs: [
            "Our newsletter is sent through an email delivery service, which handles your email address on our behalf.",
            "When you click through to a retailer such as Amazon or Temu, you leave our site. The retailer may use cookies to know that you came from us, and their own privacy policy applies from then on.",
          ],
        },
        {
          heading: "Your choices",
          paragraphs: [
            "Every newsletter has an unsubscribe link, and it works with one click.",
            "You can ask us to show you, correct or delete the information we hold about you. Email us and we'll do it.",
          ],
        },
        {
          heading: "Changes to this policy",
          paragraphs: ["If we change how we handle your information, we'll update this page and the date at the top."],
        },
      ]}
    />
  );
}
