import Link from "next/link";
import { ArrowRight } from "lucide-react";

type SectionHeadingProps = {
  id: string;
  eyebrow?: string;
  title: string;
  text?: string;
  link?: { label: string; href: string };
  children?: React.ReactNode;
};

export function SectionHeading({ id, eyebrow, title, text, link, children }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3 text-clay">{eyebrow}</p>}
        <h2 id={id} className="font-display text-[2rem] leading-[1.1] text-ink md:text-[2.5rem] lg:text-[2.75rem]">
          {title}
        </h2>
        {text && <p className="mt-4 max-w-xl text-base leading-relaxed text-stone">{text}</p>}
      </div>
      <div className="flex items-center gap-4">
        {children}
        {link && (
          <Link
            href={link.href}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-ink underline-offset-4 hover:underline"
          >
            {link.label}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}
