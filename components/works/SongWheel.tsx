"use client";
import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

export type SongItem = {
  id: string;
  title: string;
  artist?: string;
  cover: string;
  date?: string; // ISO string (Release date)
  platforms?: { apple?: string; spotify?: string } | null;
};

export default function SongWheel({ items }: { items: SongItem[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [mid, setMid] = useState(0);
  const [step, setStep] = useState(0);
  const [flipped, setFlipped] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

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
      // Center on the first item in the middle block so that
      // start is Song 1 with neighbors 10 and 2 visible.
      const startIndex = items.length * Math.floor(LOOP / 2);
      const el = children[startIndex];
      if (el) {
        const target = el.offsetLeft + el.clientWidth / 2 - rail.clientWidth / 2;
        rail.scrollLeft = target;
        setMid(target + rail.clientWidth / 2);
        setActive(startIndex);
      }
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
    const alreadyCentered = Math.abs(rail.scrollLeft - target) < 2;
    if (!alreadyCentered) {
      rail.scrollTo({ left: target, behavior: "smooth" });
      // Slight delay before flipping if it wasn't centered
      window.setTimeout(() => setFlipped((prev) => (prev === i ? null : i)), 320);
    } else {
      // Flip immediately if already centered
      setFlipped((prev) => (prev === i ? null : i));
    }
  }

  return (
    <div className="mx-auto w-[min(1100px,92vw)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-semibold">Music Portfolio</h2>
      </div>

      <div
        ref={railRef}
        className="relative mx-auto w-[380px] md:w-[432px] lg:w-[1024px] flex gap-5 md:gap-4 overflow-x-auto overflow-y-visible py-8 md:py-4 perspective hide-scroll touch-pan-x overscroll-x-contain snap-x snap-mandatory md:snap-none"
      >
        {extended.map((it, i) => {
          const isActive = i === active;
          const scale = isActive ? (isMobile ? 1.2 : 1.1) : 0.92;
          return (
            <div
              key={it.id}
              className="snap-center snap-always shrink-0 w-[180px] h-[180px] md:w-[200px] md:h-[200px] lg:w-[240px] lg:h-[240px]"
            >
              <button
                onClick={() => centerAndFlip(i)}
                className={`relative h-full w-full rounded-2xl overflow-hidden border shadow-soft transition-transform duration-300 ease-out transform-gpu [will-change:transform] [transform-style:preserve-3d] ${
                  isActive ? "border-white/20" : "border-white/10"
                } ${flipped === i ? 'is-flipped' : ''}`}
                style={{ transform: `scale(${scale})` }}
                aria-label={`Open ${it.title}`}
                aria-pressed={flipped === i}
              >
                {/* Front */}
                <div className="absolute inset-0 front face">
                  <Image src={it.cover} alt={it.title} fill sizes="(min-width:1024px) 240px, (min-width:768px) 200px, 160px" className="object-cover" unoptimized />
                  <div className="absolute left-2 bottom-2 right-2 pointer-events-none text-left drop-shadow-[0_1px_6px_rgba(0,0,0,0.75)]">
                    <div className="text-white text-sm font-semibold leading-tight truncate">{it.title}</div>
                    {it.artist && <div className="text-white/90 text-xs truncate">{it.artist}</div>}
                  </div>
                </div>
                {/* Back */}
                <div className="absolute inset-0 back face bg-white text-black border border-black/10 p-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="text-base font-semibold leading-tight line-clamp-2">{it.title}</div>
                    {it.artist && <div className="text-sm text-neutral-700">{it.artist}</div>}
                    {it.date && (
                      <div className="text-xs text-neutral-600">Release Date: {new Date(it.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                    )}
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
        .front { transform: rotateY(0deg); }
        .back { transform: rotateY(180deg); }
        .face {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(.4,.2,.2,1);
        }
        .is-flipped .front { transform: rotateY(180deg); }
        .is-flipped .back { transform: rotateY(0deg); }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
