"use client";
import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

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
  const [mid, setMid] = useState(0);
  const [step, setStep] = useState(0);
  const [flipped, setFlipped] = useState<number | null>(null);

  // Build an extended list to simulate infinite scrolling
  const LOOP = 5; // odd number for a clear middle block
  const extended = useMemo(() => Array.from({ length: LOOP }).flatMap(() => items), [items]);

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    // Measure step between cards and center on the middle block
    const children = Array.from(rail.children) as HTMLElement[];
    if (children.length >= 2) {
      const s = children[1].offsetLeft - children[0].offsetLeft;
      setStep(s);
      const blockOffset = s * items.length * Math.floor(LOOP / 2);
      rail.scrollLeft = blockOffset;
      setMid(rail.scrollLeft + rail.clientWidth / 2);
    }
  }, [items.length]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const currentMid = rail.scrollLeft + rail.clientWidth / 2;
        setMid(currentMid);
        const children = Array.from(rail.children) as HTMLElement[];
        let best = 0;
        let bestDist = Number.POSITIVE_INFINITY;
        children.forEach((child, i) => {
          const center = child.offsetLeft + child.clientWidth / 2;
          const d = Math.abs(center - currentMid);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setActive(best);
        if (flipped !== null && best !== flipped) setFlipped(null);

        // Looping: jump by one block when near the ends
        if (step > 0 && items.length > 0) {
          const blockSize = step * items.length;
          const minX = blockSize * 0.5;
          const maxX = step * (items.length * (LOOP - 0.5));
          if (rail.scrollLeft < minX) {
            rail.scrollLeft += blockSize;
          } else if (rail.scrollLeft > maxX) {
            rail.scrollLeft -= blockSize;
          }
        }
      });
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      rail.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [items.length, step, flipped]);

  // Scroll is trackpad/mouse/touch only; arrows removed per design

  if (!items.length) return null;

  function centerAndFlip(i: number) {
    const rail = railRef.current;
    const el = rail?.children?.[i] as HTMLElement | undefined;
    if (!rail || !el) return;
    const target = el.offsetLeft + el.clientWidth / 2 - rail.clientWidth / 2;
    rail.scrollTo({ left: target, behavior: "smooth" });
    // Flip shortly after centering scroll begins
    window.setTimeout(() => setFlipped((prev) => (prev === i ? null : i)), 320);
  }

  return (
    <div className="mx-auto w-[min(1100px,92vw)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-semibold">Music Portfolio</h2>
      </div>

      <div
        ref={railRef}
        className="relative flex gap-4 overflow-x-auto py-4 perspective hide-scroll"
      >
        {extended.map((it, i) => {
          // Scale based on distance from the viewport center for subtle wheel depth
          const el = (railRef.current?.children?.[i] as HTMLElement | undefined);
          const centerX = el ? el.offsetLeft + el.clientWidth / 2 : 0;
          const distCards = step ? Math.abs(centerX - mid) / step : 0;
          const scale = Math.max(0.86, 1 - Math.min(1, distCards) * 0.12);
          const isActive = i === active;
          return (
            <div
              key={it.id}
              className="snap-center shrink-0 w-[160px] h-[160px] md:w-[200px] md:h-[200px]"
            >
              <button
                onClick={() => centerAndFlip(i)}
                className={`relative h-full w-full rounded-2xl overflow-hidden border shadow-soft transition-transform [transform-style:preserve-3d] ${
                  isActive ? "border-white/20" : "border-white/10"
                }`}
                style={{ transform: `scale(${isActive ? scale * 1.06 : scale}) rotateY(${flipped === i ? 180 : 0}deg)` }}
                aria-label={`Open ${it.title}`}
              >
                {/* Front */}
                <div className="absolute inset-0 [backface-visibility:hidden]">
                  <Image src={it.cover} alt={it.title} fill sizes="200px" className="object-cover" unoptimized />
                <div className="absolute right-2 bottom-2 left-auto pointer-events-none text-right">
                  <div className="bg-black rounded-md px-2 py-1 inline-block max-w-[90%]">
                    <div className="text-white text-sm font-medium truncate">{it.title}</div>
                    {it.artist && <div className="text-white/80 text-xs truncate">{it.artist}</div>}
                  </div>
                </div>
                </div>
                {/* Back */}
                <div className="absolute inset-0 rotate-y-180 [backface-visibility:hidden] bg-white text-black border border-black/10 p-3 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-neutral-600">Track</div>
                    <div className="text-sm font-medium leading-tight line-clamp-2">{it.title}</div>
                    {it.artist && <div className="text-xs text-neutral-700 mt-1">{it.artist}</div>}
                  </div>
                  <div className="flex gap-2 pt-2">
                    {it.platforms?.apple && (
                      <a className="px-2.5 py-1.5 rounded-lg bg-black text-white text-xs" href={it.platforms.apple} target="_blank" rel="noreferrer">
                        Apple Music
                      </a>
                    )}
                    {it.platforms?.spotify && (
                      <a className="px-2.5 py-1.5 rounded-lg bg-black text-white text-xs" href={it.platforms.spotify} target="_blank" rel="noreferrer">
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
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
