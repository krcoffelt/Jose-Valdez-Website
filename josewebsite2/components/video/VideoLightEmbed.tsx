"use client";
import { useState } from "react";

export default function VideoLightEmbed({
  id,
  title = "YouTube video",
  className,
}: {
  id: string;
  title?: string;
  className?: string;
}) {
  const [play, setPlay] = useState(false);
  return (
    <div className={`relative aspect-video overflow-hidden rounded-2xl bg-neutral-950 ${className ?? ""}`}>
      {play ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlay(true)}
          aria-label={`Play ${title}`}
          className="group relative h-full w-full bg-neutral-900"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center transition duration-300 group-hover:scale-[1.02]"
            style={{ backgroundImage: `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/35" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/55 text-2xl text-white backdrop-blur-sm transition group-hover:scale-105">
              ▶
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
