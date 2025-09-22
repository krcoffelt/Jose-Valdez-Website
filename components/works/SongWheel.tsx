"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type SongItem = {
  id: string;
  title: string;
  artist?: string;
  cover: string;
  platforms?: { apple?: string; spotify?: string } | null;
};

export default function SongWheel({ items }: { items: SongItem[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState<number | null>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = rail.scrollLeft + rail.clientWidth / 2;
        const children = Array.from(rail.children) as HTMLElement[];
        let best = 0;
        let bestDist = Number.POSITIVE_INFINITY;
        children.forEach((child, i) => {
          const center = child.offsetLeft + child.clientWidth / 2;
          const d = Math.abs(center - mid);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      rail.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  function scrollBy(dir: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: dir * (rail.clientWidth * 0.5), behavior: "smooth" });
  }

  if (!items.length) return null;

  return (
    <div className="mx-auto w-[min(1100px,92vw)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-semibold">Music Portfolio</h2>
        <div className="flex gap-2">
          <button onClick={() => scrollBy(-1)} className="px-3 py-1.5 rounded-xl bg-white/10">‹</button>
          <button onClick={() => scrollBy(1)} className="px-3 py-1.5 rounded-xl bg-white/10">›</button>
        </div>
      </div>

      <div
        ref={railRef}
        className="relative flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 scrollbar-thin"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((it, i) => {
          const isActive = i === active;
          const isFlipped = flipped === i;
          return (
            <div
              key={it.id}
              className="snap-center shrink-0 w-[240px] h-[240px] md:w-[280px] md:h-[280px] perspective"
            >
              <button
                onClick={() => setFlipped(isFlipped ? null : i)}
                className="relative h-full w-full [transform-style:preserve-3d] transition-transform duration-500 rounded-2xl"
                style={{
                  transform: `${isFlipped ? "rotateY(180deg)" : "rotateY(0)"} ${isActive ? " scale(1)" : " scale(0.94)"}`,
                }}
                aria-label={`Toggle details for ${it.title}`}
              >
                {/* Front: Cover */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden [backface-visibility:hidden] shadow-soft border border-white/10">
                  <Image src={it.cover} alt={it.title} fill sizes="280px" className="object-cover" />
                </div>

                {/* Back: Details */}
                <div className="absolute inset-0 rounded-2xl bg-surface border border-white/10 p-4 text-left rotate-y-180 [backface-visibility:hidden] flex flex-col justify-between">
                  <div>
                    <div className="text-sm text-neutral-400">Track</div>
                    <div className="text-lg font-medium leading-tight line-clamp-2">{it.title}</div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {it.platforms?.apple && (
                      <a className="px-3 py-1.5 rounded-lg bg-white text-black text-sm" href={it.platforms.apple} target="_blank" rel="noreferrer">
                        Apple Music
                      </a>
                    )}
                    {it.platforms?.spotify && (
                      <a className="px-3 py-1.5 rounded-lg bg-white/10 text-sm" href={it.platforms.spotify} target="_blank" rel="noreferrer">
                        Spotify
                      </a>
                    )}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .perspective { perspective: 1200px; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}

