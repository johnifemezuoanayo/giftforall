"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import type { DiscoveryVideo } from "@/types";

type VideoCardProps = {
  video: DiscoveryVideo;
  onPlay: (video: DiscoveryVideo) => void;
};

export function VideoCard({ video, onPlay }: VideoCardProps) {
  return (
    <button
      type="button"
      onClick={() => onPlay(video)}
      className="group relative block aspect-[9/14] w-full overflow-hidden bg-ink-soft text-left"
      aria-label={`Play video: ${video.title}`}
    >
      <Image
        src={video.poster.src}
        alt={video.poster.alt}
        fill
        sizes="(min-width: 1024px) 19vw, (min-width: 640px) 38vw, 64vw"
        quality={70}
        className="object-cover transition-transform duration-700 ease-soft group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
      <span className="absolute left-3 top-3 bg-black/50 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white backdrop-blur-sm">
        {video.duration}
      </span>
      <span className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink transition-transform duration-300 group-hover:scale-110">
        <Play className="ml-0.5 size-5 fill-current" aria-hidden />
      </span>
      <span className="absolute inset-x-0 bottom-0 p-4 text-paper">
        <span className="block font-display text-lg leading-snug">{video.title}</span>
        <span className="mt-1 block text-xs text-paper/75">{video.caption}</span>
      </span>
    </button>
  );
}
