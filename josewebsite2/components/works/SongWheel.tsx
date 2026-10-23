"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useAudio } from "@/components/audio/AudioProvider";
import SongWheelCard from "./SongWheelCard";

export type SongItem = {
  id: string;
  title: string;
  artist?: string;
  cover: string;
  date?: string;
  platforms?: { apple?: string; spotify?: string } | null;
  audioSrc?: string;
  release?: string;
  releaseSlug?: string;
};

const LOOP = 3;

export default function SongWheel({ items }: { items: SongItem[] }) {
  const audio = useAudio();
  const { setQueue, setDockVisible } = audio;
  const railRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const centersRef = useRef<number[]>([]);
  const stepRef = useRef(0);
  const shellsRef = useRef<HTMLElement[]>([]);
  const emphasizedRef = useRef(new Set<number>());
  const activeRef = useRef(0);
  const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState<number | null>(null);

  const extended = useMemo(() => Array.from({ length: LOOP }).flatMap(() => items), [items]);
  const audioQueue = useMemo(() => {
    const seen = new Set<string>();
    return items.filter((item) => {
      if (!item.audioSrc || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    }).map((item) => ({
      id: item.id, title: item.title, artist: item.artist, cover: item.cover, src: item.audioSrc,
    }));
  }, [items]);

  useEffect(() => {
    if (audioQueue.length && audio.queue.length === 0) setQueue(audioQueue, 0);
  }, [audio.queue.length, audioQueue, setQueue]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      setDockVisible(Boolean(entry?.isIntersecting && items.length));
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => { observer.disconnect(); setDockVisible(false); };
  }, [items.length, setDockVisible]);

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail || !items.length) return;
    const mobile = window.matchMedia("(max-width: 767px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const centers = centersRef.current;
      const step = stepRef.current;
      if (!centers.length || !step) return;
      const block = step * items.length;
      let shift = 0;
      // Rebase to the equivalent copy without animating the invisible loop jump.
      if (block > rail.clientWidth) {
        if (rail.scrollLeft < block * 0.5) shift = items.length;
        else if (rail.scrollLeft > block * 1.5) shift = -items.length;
      }
      if (shift) {
        rail.scrollLeft += shift * step;
        setFlipped((previous) => previous === null ? null : previous + shift);
      }
      const middle = rail.scrollLeft + rail.clientWidth / 2;
      const nearest = Math.max(0, Math.min(centers.length - 1, Math.round((middle - centers[0]) / step)));
      if (activeRef.current !== nearest) {
        activeRef.current = nearest;
        setActive(nearest);
      }

      // Only nearby cards need a transform update; React does not render each frame.
      const emphasized = new Set<number>();
      for (let i = Math.max(0, nearest - 2); i <= Math.min(centers.length - 1, nearest + 2); i++) {
        const distance = Math.min(1, Math.abs(centers[i] - middle) / step);
        const weight = reduced.matches ? Number(i === nearest) : (1 + Math.cos(distance * Math.PI)) / 2;
        const scale = 0.92 + ((mobile.matches ? 1.2 : 1.1) - 0.92) * weight;
        shellsRef.current[i]?.style.setProperty("--wheel-scale", scale.toFixed(4));
        emphasized.add(i);
      }
      emphasizedRef.current.forEach((i) => {
        if (!emphasized.has(i)) shellsRef.current[i]?.style.setProperty("--wheel-scale", "0.92");
      });
      emphasizedRef.current = emphasized;
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      const previousStep = stepRef.current;
      const previousCenter = centersRef.current[activeRef.current];
      const previousOffset = previousStep && previousCenter !== undefined
        ? (rail.scrollLeft + rail.clientWidth / 2 - previousCenter) / previousStep
        : 0;
      const children = Array.from(rail.children) as HTMLElement[];
      centersRef.current = children.map((child) => child.offsetLeft + child.clientWidth / 2);
      shellsRef.current = children.map((child) => child.querySelector<HTMLElement>("[data-wheel-scale]")!);
      stepRef.current = children[1] ? children[1].offsetLeft - children[0].offsetLeft : 0;
      const index = previousStep ? activeRef.current : items.length;
      const center = centersRef.current[index];
      if (center !== undefined) rail.scrollLeft = center + previousOffset * stepRef.current - rail.clientWidth / 2;
      scheduleUpdate();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    rail.addEventListener("scroll", scheduleUpdate, { passive: true });
    mobile.addEventListener("change", scheduleUpdate);
    reduced.addEventListener("change", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      rail.removeEventListener("scroll", scheduleUpdate);
      mobile.removeEventListener("change", scheduleUpdate);
      reduced.removeEventListener("change", scheduleUpdate);
    };
  }, [items.length, extended.length]);

  useEffect(() => () => {
    if (flipTimer.current) clearTimeout(flipTimer.current);
  }, []);

  const centerAndFlip = useCallback((index: number) => {
    const rail = railRef.current;
    const center = centersRef.current[index];
    if (!rail || center === undefined) return;
    if (flipTimer.current) clearTimeout(flipTimer.current);
    const target = center - rail.clientWidth / 2;
    if (Math.abs(rail.scrollLeft - target) < 2) {
      setFlipped((previous) => previous === index ? null : index);
    } else {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      rail.scrollTo({ left: target, behavior: reduced ? "instant" : "smooth" });
      flipTimer.current = setTimeout(() => {
        // A later user gesture can cancel centering, so do not flip a different card.
        const actualCenter = centersRef.current[index];
        if (actualCenter !== undefined && Math.abs(rail.scrollLeft + rail.clientWidth / 2 - actualCenter) < 4) {
          setFlipped((previous) => previous === index ? null : index);
        }
      }, reduced ? 0 : 450);
    }
  }, []);

  const handlePlay = useCallback((index: number) => {
    const item = items[index % items.length];
    if (!item?.audioSrc) return;
    const queueIndex = audioQueue.findIndex((track) => track.id === item.id);
    if (queueIndex < 0) return;
    if (audio.queue[audio.index]?.id === item.id) {
      if (audio.playing) audio.pause();
      else audio.play();
    } else audio.setQueue(audioQueue, queueIndex, { autoplay: true });
  }, [audio, audioQueue, items]);

  if (!items.length) return null;

  return (
    <div ref={containerRef} className="mx-auto w-[min(1100px,92vw)] px-3 sm:px-0">
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="text-3xl font-semibold">Music Portfolio</h2>
        <p className="text-sm text-neutral-400 md:hidden">Swipe sideways to explore singles and live cuts. Tap a card to play a preview.</p>
        <div className="hidden md:flex items-center gap-2 text-sm text-neutral-400">
          <span className="flex items-center gap-1">
            <span className="h-1 w-6 rounded-full bg-white/20 animate-pulse" aria-hidden />
            Scroll or hover to explore the catalog
          </span>
        </div>
      </div>
      <div
        ref={railRef}
        data-song-rail
        className="relative mx-auto w-full max-w-[min(1024px,95vw)] flex gap-5 md:gap-4 overflow-x-auto overflow-y-hidden py-6 md:py-5 px-1 md:px-0 hide-scroll touch-pan-x overscroll-x-contain"
        style={{ perspective: 1200, scrollBehavior: "auto" }}
      >
        {extended.map((card, index) => (
          <SongWheelCard key={`${card.id}-${index}`} card={card} index={index} active={active === index} flipped={flipped === index} onOpen={centerAndFlip} onPlay={handlePlay} />
        ))}
      </div>
      <style jsx>{`
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
