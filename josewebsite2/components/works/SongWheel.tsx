"use client";
import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, Headphones, Music2, Play } from "lucide-react";
import { useAudio } from "@/components/audio/AudioProvider";

export type SongItem = {
  id: string;
  title: string;
  artist?: string;
  cover: string;
  date?: string; // ISO string (Release date)
  platforms?: { apple?: string; spotify?: string } | null;
  audioSrc?: string;
  release?: string;
  releaseSlug?: string;
};

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

export default function SongWheel({ items }: { items: SongItem[] }) {
  const audio = useAudio();
  const railRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
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
  const audioQueue = useMemo(() => {
    const seen = new Set<string>();
    return items
      .filter((item) => Boolean(item.audioSrc))
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .map((item) => ({
        id: item.id,
        title: item.title,
        artist: item.artist,
        cover: item.cover,
        src: item.audioSrc,
      }));
  }, [items]);

  useEffect(() => {
    if (!audioQueue.length) return;
    if (audio.queue.length === 0) {
      audio.setQueue(audioQueue, 0);
    }
  }, [audio, audioQueue]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        const shouldShow = Boolean((entry?.isIntersecting ?? false) && items.length > 0);
        audio.setDockVisible(shouldShow);
      },
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      audio.setDockVisible(false);
    };
  }, [audio, items.length]);

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

  function handlePlay(index: number) {
    const item = items[index];
    if (!item?.audioSrc) return;
    const queueIndex = audioQueue.findIndex((track) => track.id === item.id);
    if (queueIndex === -1) return;
    const activeId = audio.queue[audio.index]?.id;
    const queuesMatch = audio.queue.length === audioQueue.length && audio.queue.every((track, idx) => track.id === audioQueue[idx].id);
    if (queuesMatch && activeId === item.id) {
      if (audio.playing) {
        audio.pause();
      } else {
        audio.play();
      }
      return;
    }
    audio.setQueue(audioQueue, Math.max(queueIndex, 0), { autoplay: true });
  }

  return (
    <div ref={containerRef} className="mx-auto w-[min(1100px,92vw)] px-3 sm:px-0">
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="text-3xl font-semibold">Music Portfolio</h2>
        <p className="text-sm text-neutral-400 md:hidden">
          Swipe to explore singles and live cuts. Tap a card to play a preview.
        </p>
      </div>

      <div
        ref={railRef}
        className="relative mx-auto w-full max-w-[min(1024px,95vw)] flex gap-5 md:gap-4 overflow-x-auto overflow-y-visible py-6 md:py-4 px-1 md:px-0 perspective hide-scroll touch-pan-x overscroll-x-contain snap-x snap-mandatory md:snap-none"
      >
        {extended.map((card, i) => {
          const isActive = i === active;
          const scale = isActive ? (isMobile ? 1.2 : 1.1) : 0.92;
          const baseIndex = i % items.length;
          const baseItem = items[baseIndex];
          const playable = Boolean(baseItem?.audioSrc);
          const formattedDate = formatDate(card.date);
          return (
            <div
              key={`${card.id}-${i}`}
              className="snap-center snap-always shrink-0 w-[180px] h-[180px] md:w-[200px] md:h-[200px] lg:w-[240px] lg:h-[240px]"
            >
              <button
                type="button"
                onClick={() => centerAndFlip(i)}
                className={`relative h-full w-full rounded-2xl overflow-hidden border shadow-soft transition-transform duration-300 ease-out transform-gpu [will-change:transform] [transform-style:preserve-3d] ${
                  isActive ? "border-white/20" : "border-white/10"
                } ${flipped === i ? 'is-flipped' : ''}`}
                style={{ transform: `scale(${scale})` }}
                aria-label={`Open ${card.title}`}
                aria-pressed={flipped === i}
              >
                {/* Front */}
                <div className="absolute inset-0 front face">
                  <Image src={card.cover} alt={card.title} fill sizes="(min-width:1024px) 240px, (min-width:768px) 200px, 160px" className="object-cover" unoptimized />
                  <div className="absolute left-2 bottom-2 right-2 pointer-events-none text-left drop-shadow-[0_1px_6px_rgba(0,0,0,0.75)]">
                    <div className="text-white text-sm font-semibold leading-tight truncate">{card.title}</div>
                    {card.artist && <div className="text-white/90 text-xs truncate">{card.artist}</div>}
                  </div>
                </div>
                {/* Back */}
                <div className="absolute inset-0 back face bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 text-neutral-900 border border-black/10 p-4 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">Track</div>
                      <div className="text-lg font-semibold leading-tight line-clamp-2">{card.title}</div>
                      {card.artist && <div className="text-sm text-neutral-500 line-clamp-1">{card.artist}</div>}
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handlePlay(baseIndex);
                      }}
                      disabled={!playable}
                      className={`h-10 w-10 rounded-full border flex items-center justify-center transition ${
                        playable
                          ? "border-neutral-900 bg-neutral-900 text-white hover:bg-black"
                          : "border-neutral-300 bg-neutral-200 text-neutral-400 cursor-not-allowed"
                      }`}
                      aria-label={playable ? `Play ${card.title}` : `Preview unavailable for ${card.title}`}
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-4 space-y-3 text-xs text-neutral-600">
                    {card.release && (
                      <div className="flex items-center gap-2">
                        <Music2 className="h-3.5 w-3.5 text-neutral-500" />
                        <span className="font-medium text-neutral-700 line-clamp-1">{card.release}</span>
                      </div>
                    )}
                    {formattedDate && (
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-neutral-500" />
                        <span>{formattedDate}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Headphones className="h-3.5 w-3.5 text-neutral-500" />
                      <span>{playable ? "Preview ready" : "Preview unavailable"}</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 flex flex-wrap gap-2">
                    {card.platforms?.apple && (
                      <a
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-900 text-white text-[11px] font-medium tracking-wide uppercase"
                        href={card.platforms.apple}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Apple Music
                      </a>
                    )}
                    {card.platforms?.spotify && (
                      <a
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-700 text-white text-[11px] font-medium tracking-wide uppercase"
                        href={card.platforms.spotify}
                        target="_blank"
                        rel="noreferrer"
                      >
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
