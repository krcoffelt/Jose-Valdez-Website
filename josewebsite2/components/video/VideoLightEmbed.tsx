"use client";
import { useState } from "react";

export default function VideoLightEmbed({ id }: { id: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl">
      {play ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      ) : (
        <button onClick={() => setPlay(true)} className="w-full h-full bg-neutral-800">▶</button>
      )}
    </div>
  );
}

