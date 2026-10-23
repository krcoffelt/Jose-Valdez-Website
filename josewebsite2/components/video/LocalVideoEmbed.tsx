"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";
import { useAudio } from "@/components/audio/AudioProvider";

export default function LocalVideoEmbed({
  src,
  poster,
  title,
}: {
  src: string;
  poster: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);
  const { pause } = useAudio();

  return (
    <div className="relative aspect-video overflow-hidden bg-neutral-950">
      {playing ? (
        <video
          src={src}
          poster={poster}
          aria-label={title}
          className="h-full w-full"
          controls
          autoPlay
          playsInline
          preload="none"
          onPlay={pause}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title}`}
          className="group relative h-full w-full bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
        >
          <Image
            src={poster}
            alt=""
            fill
            sizes="(min-width:1024px) 660px, 96vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:transform-none"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/35" />
          <span aria-hidden className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-sm transition group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none">
              <Play className="h-6 w-6 fill-current" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
