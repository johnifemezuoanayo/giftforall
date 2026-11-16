import Link from "next/link";
import { OpenSavedButton } from "@/components/saved/open-saved-button";
import { BagIcon, GiftIcon, UnlockIcon } from "@/components/icons/promise-icons";
import { Reveal } from "@/components/ui/reveal";

const linkClass = "text-sm font-semibold text-forest underline underline-offset-4 transition-colors hover:text-forest-dark";

const promises = [
  {
    title: "Curated, not cluttered",
    text: "every find picked for being genuinely interesting",
    Icon: GiftIcon,
    link: <Link href="/about" className={linkClass}>how we choose</Link>,
  },
  {
    title: "Retailers you know",
    text: "buy from Amazon, Temu and other trusted stores",
    Icon: BagIcon,
    link: <Link href="#affiliate-disclosure" className={linkClass}>how it works</Link>,
  },
  {
    title: "No account needed",
    text: "save the gifts you love for later, no sign-up",
    Icon: UnlockIcon,
    link: <OpenSavedButton className={linkClass}>see your saved items</OpenSavedButton>,
  },
];

export function PromiseStrip() {
  return (
    <section aria-labelledby="promise-title" className="container-page pt-12 md:pt-16">
      <div className="rounded-3xl bg-mint px-6 py-12 md:px-10 md:py-16">
        <Reveal>
          <h2
            id="promise-title"
            className="text-center font-display text-[2rem] leading-[1.1] text-forest md:text-5xl"
          >
            what makes us different
          </h2>
        </Reveal>

        <ul className="mx-auto mt-10 grid max-w-5xl gap-10 md:mt-14 md:grid-cols-3 md:gap-6">
          {promises.map(({ title, text, Icon, link }, index) => (
            <li key={title}>
              <Reveal delay={0.08 * index} className="group flex flex-col items-center text-center">
                <span className="grid size-28 place-items-center rounded-full bg-white shadow-[0_8px_24px_-16px_rgba(15,90,58,0.45)] transition-transform duration-500 ease-soft group-hover:-translate-y-1 md:size-[7.5rem]">
                  <Icon className="size-[4.75rem] md:size-20 text-forest transition-transform duration-500 ease-soft group-hover:scale-105" />
                </span>
                <h3 className="mt-5 text-[0.95rem] font-semibold uppercase tracking-[0.18em] text-ink md:text-base">
                  {title}
                </h3>
                <p className="mt-1.5 max-w-[16rem] text-[1.05rem] leading-snug text-ink-soft">{text}</p>
                <div className="mt-2">{link}</div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
