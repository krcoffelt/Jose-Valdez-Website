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
        className="relative flex gap-4 overflow-x-auto snap-x snap-mandatory py-4 scrollbar-thin"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((it, i) => {
          const isActive = i === active;
          return (
            <div
              key={it.id}
              className="snap-center shrink-0 w-[160px] h-[160px] md:w-[200px] md:h-[200px]"
            >
              <div
                className={`relative h-full w-full rounded-2xl overflow-hidden border shadow-soft transition-transform ${
                  isActive ? "scale-100 border-white/20" : "scale-95 border-white/10"
                }`}
              >
                <Image src={it.cover} alt={it.title} fill sizes="200px" className="object-cover" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
