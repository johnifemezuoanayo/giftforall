import Link from "next/link";
import { getContent } from "@/lib/api";

export async function AnnouncementBar() {
  const { site } = await getContent();

  return (
    <div className="bg-ink text-paper">
      <div className="container-page flex h-9 items-center justify-center gap-3 text-center text-xs tracking-wide">
        <p>{site.announcement}</p>
        <span aria-hidden className="hidden text-paper/40 sm:inline">
          /
        </span>
        <Link href="/discover/new" className="hidden font-semibold underline underline-offset-4 hover:text-blush sm:inline">
          See what&apos;s new
        </Link>
      </div>
    </div>
  );
}
