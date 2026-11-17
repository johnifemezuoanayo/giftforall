import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

type LegalPageProps = {
  title: string;
  href: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  contactEmail: string;
};

export function LegalPage({ title, href, updated, intro, sections, contactEmail }: LegalPageProps) {
  return (
    <div className="container-page pb-20 pt-4 md:pb-28 md:pt-6">
      <Breadcrumbs
        crumbs={[
          { label: "Home", href: "/" },
          { label: title, href },
        ]}
      />

      <article className="mx-auto mt-10 max-w-3xl md:mt-14">
        <p className="eyebrow text-clay">Last updated {updated}</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.1] md:text-5xl">{title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">{intro}</p>

        {sections.map((section) => (
          <section key={section.heading} className="mt-10 border-t border-line pt-8">
            <h2 className="font-display text-2xl leading-tight">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 leading-[1.8] text-ink-soft">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        <section className="mt-10 border-t border-line pt-8">
          <h2 className="font-display text-2xl leading-tight">Contact us</h2>
          <p className="mt-4 leading-[1.8] text-ink-soft">
            Questions about this page? Email us at{" "}
            <a href={`mailto:${contactEmail}`} className="font-semibold text-forest underline underline-offset-4">
              {contactEmail}
            </a>
            .
          </p>
        </section>
      </article>
    </div>
  );
}
