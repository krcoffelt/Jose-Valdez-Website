"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { SongItem } from "@/components/works/SongWheel";

const SongWheel = dynamic(() => import("@/components/works/SongWheel"), {
  ssr: false,
  loading: () => <SongWheelPlaceholder />,
});

function SongWheelPlaceholder() {
  return (
    <div className="mx-auto w-[min(1100px,92vw)] px-3 sm:px-0">
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="text-3xl font-semibold">Music Portfolio</h2>
        <p className="text-sm text-neutral-400 md:hidden">
          Swipe sideways to explore singles and live cuts. Tap a card to play a preview.
        </p>
        <div className="hidden md:flex items-center gap-2 text-sm text-neutral-400">
          <span className="flex items-center gap-1">
            <span className="h-1 w-6 rounded-full bg-white/20" aria-hidden />
            Scroll to explore the catalog
          </span>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[min(1024px,95vw)] overflow-hidden py-6 md:py-4">
        <div className="grid grid-flow-col auto-cols-[180px] md:auto-cols-[200px] lg:auto-cols-[240px] gap-5 md:gap-4 opacity-35 justify-center">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              aria-hidden
              className="h-[180px] md:h-[200px] lg:h-[240px] rounded-2xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SongWheelDeferred({ items }: { items: SongItem[] }) {
  const [shouldRender, setShouldRender] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldRender) return;
    const node = mountRef.current;
    if (!node) return;
    const root = document.querySelector(".snap-container");
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { root: root instanceof Element ? root : null, rootMargin: "250px 0px" }
    );
    observer.observe(node);
    // Fallback so the section never gets stuck on the placeholder if intersection misses.
    const fallbackId = window.setTimeout(() => setShouldRender(true), 1200);
    return () => {
      window.clearTimeout(fallbackId);
      observer.disconnect();
    };
  }, [shouldRender]);

  return <div ref={mountRef}>{shouldRender ? <SongWheel items={items} /> : <SongWheelPlaceholder />}</div>;
}
