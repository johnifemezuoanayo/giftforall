"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { NavMenu } from "@/types";

type MegaMenuProps = {
  menu: NavMenu;
  id: string;
  onNavigate: () => void;
};

export function MegaMenu({ menu, id, onNavigate }: MegaMenuProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-0 top-full border-t border-line bg-paper shadow-[0_24px_40px_-24px_rgba(29,27,24,0.25)]"
    >
      <div className="container-page grid grid-cols-12 gap-10 py-10">
        <div className="col-span-3">
          <p className="eyebrow text-clay">{menu.label}</p>
          <p className="mt-3 font-display text-2xl leading-snug">{menu.intro}</p>
          <Link
            href={menu.href}
            onClick={onNavigate}
            className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
          >
            Shop all
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>

        <ul className="col-span-5 grid grid-cols-2 content-start gap-x-8 gap-y-1">
          {menu.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                className="block py-2 text-[0.95rem] text-ink-soft transition-colors hover:text-clay"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {menu.feature && (
          <Link href={menu.feature.href} onClick={onNavigate} className="group col-span-4 block">
            <div className="relative aspect-[16/10] overflow-hidden bg-sand">
              <Image
                src={menu.feature.image.src}
                alt={menu.feature.image.alt}
                fill
                sizes="(min-width: 1440px) 440px, 30vw"
                quality={70}
                className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
              />
            </div>
            <p className="mt-3 font-display text-lg leading-snug group-hover:underline group-hover:underline-offset-4">
              {menu.feature.title}
            </p>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
