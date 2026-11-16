import Link from "next/link";
import { getContent } from "@/lib/api";
import { socialIcons } from "@/components/icons/social-icons";
import { FooterNewsletter } from "@/components/newsletter/footer-newsletter";
import { Logo } from "./logo";

export async function SiteFooter() {
  const { footerColumns, site, socialLinks } = await getContent();

  return (
    <footer className="border-t border-line bg-white text-ink">
      <div className="container-page pb-10 pt-16 md:pt-20">
        <FooterNewsletter />

        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo className="text-forest" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-soft">{site.description}</p>
            <p className="eyebrow mt-8 text-stone">Follow along</p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {socialLinks.map((link) => {
                const Icon = socialIcons[link.label];
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={link.label}
                      className="grid size-11 place-items-center rounded-full border border-line text-forest transition-all duration-300 hover:-translate-y-0.5 hover:border-forest hover:bg-forest hover:text-white"
                    >
                      {Icon ? <Icon className="size-[18px]" /> : <span className="text-xs font-semibold">{link.label.slice(0, 2)}</span>}
                      <span className="sr-only">{link.label} (opens in a new tab)</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
            {footerColumns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="eyebrow text-stone">{column.title}</h2>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-ink-soft transition-colors hover:text-forest hover:underline hover:underline-offset-4">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div id="affiliate-disclosure" className="mt-16 border-t border-line pt-8">
          <h2 className="eyebrow text-stone">Affiliate disclosure</h2>
          <p className="mt-3 max-w-3xl text-xs leading-relaxed text-stone">
            {site.name} is a gift discovery website. We don&apos;t sell products ourselves. When you click a link to a
            retailer such as Amazon or Temu and make a purchase, we may earn a commission from qualifying purchases, at
            no extra cost to you. As an Amazon Associate we earn from qualifying purchases. Prices and availability are
            set by each retailer and may change at any time.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 text-xs text-stone sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {site.name}. All rights reserved.</p>
          <p>No accounts. No checkout. Just good gift ideas.</p>
        </div>
      </div>
    </footer>
  );
}
