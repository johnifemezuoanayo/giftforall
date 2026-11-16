import { RecipientCard } from "@/components/cards/recipient-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Recipient } from "@/types";

export function RecipientsSection({ recipients }: { recipients: Recipient[] }) {
  return (
    <section id="who-for" aria-labelledby="who-for-title" className="scroll-mt-32 py-20 md:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            id="who-for-title"
            eyebrow="Gifts by recipient"
            title="Who are you shopping for?"
            text="Start with the person. We'll help with the rest."
            link={{ label: "See all recipients", href: "/gifts/recipient" }}
          />
        </Reveal>

        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 scroll-px-5 md:mx-0 md:grid md:grid-cols-4 md:gap-x-6 md:gap-y-10 md:overflow-visible md:px-0">
          {recipients.map((recipient, index) => (
            <li key={recipient.id} className="w-[44vw] shrink-0 snap-start md:w-auto">
              <Reveal delay={(index % 4) * 0.06}>
                <RecipientCard recipient={recipient} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
