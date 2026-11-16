"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { VideoCard } from "@/components/cards/video-card";
import { Reveal } from "@/components/ui/reveal";
import { useModal } from "@/hooks/use-modal";
import type { DiscoveryVideo } from "@/types";

function VideoModal({ video, onClose }: { video: DiscoveryVideo | null; onClose: () => void }) {
  const panelRef = useModal(Boolean(video), onClose);

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={video.title}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="relative aspect-[9/16] h-[min(80vh,720px)] max-w-full overflow-hidden bg-ink"
          >
            {video.videoUrl ? (
              <video src={video.videoUrl} poster={video.poster.src} controls autoPlay playsInline className="size-full object-cover" />
            ) : (
              <>
                <Image src={video.poster.src} alt={video.poster.alt} fill sizes="420px" quality={80} className="object-cover opacity-60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-paper">
                  <span className="grid size-16 place-items-center rounded-full border border-paper/60">
                    <Play className="ml-0.5 size-6" aria-hidden />
                  </span>
                  <p className="mt-6 font-display text-2xl leading-tight">{video.title}</p>
                  <p className="mt-2 text-sm text-paper/80">Product videos are coming soon.</p>
                </div>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-black/50 text-white hover:bg-black/70"
              aria-label="Close video"
            >
              <X className="size-5" aria-hidden />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function VideoSection({ videos }: { videos: DiscoveryVideo[] }) {
  const [activeVideo, setActiveVideo] = useState<DiscoveryVideo | null>(null);

  return (
    <section aria-labelledby="videos-title" className="overflow-hidden bg-ink py-20 text-paper md:py-28">
      <div className="container-page">
        <Reveal>
          <div className="mb-10 grid gap-6 md:mb-14 md:grid-cols-2 md:items-end">
            <div>
              <p className="eyebrow mb-3 text-blush">Unexpected finds</p>
              <h2 id="videos-title" className="font-display text-[2rem] leading-[1.1] md:text-[2.5rem] lg:text-[2.75rem]">
                Wait until you see these.
              </h2>
            </div>
            <p className="max-w-md text-paper/70 md:justify-self-end">
              Short looks at clever, curious and beautifully made things. Watch them in action before you decide.
            </p>
          </div>
        </Reveal>

        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 scroll-px-5 md:-mx-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-12">
          {videos.map((video, index) => (
            <li key={video.id} className={`w-[64vw] shrink-0 snap-start sm:w-[38vw] lg:w-auto ${index % 2 === 1 ? "lg:translate-y-12" : ""}`}>
              <Reveal delay={index * 0.06}>
                <VideoCard video={video} onPlay={setActiveVideo} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </section>
  );
}
