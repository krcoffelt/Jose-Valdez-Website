"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

type HeroSource = {
  src?: string;
  fallbackSrc?: string;
};

type Props = {
  bgSrc: string;
  bgSrcOptimized?: HeroSource;
  bgSrcSet?: string;
  bgSizes?: string;
  imagePosition?: string;
  strength?: number; // max pixels to translate background upwards
  overlay?: boolean;
  children: React.ReactNode;
  className?: string;
};

export default function ParallaxHero({
  bgSrc,
  bgSrcOptimized,
  bgSrcSet,
  bgSizes = "100vw",
  imagePosition = "center",
  strength = 140,
  overlay = true,
  children,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    const background = backgroundRef.current;
    if (!node || !background) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let inView = true;
    const draw = () => {
      frame = 0;
      const bounds = node.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height)));
      background.style.transform = `translate3d(0, ${reduced.matches ? 0 : -strength * progress}px, 0)`;
    };
    const schedule = () => {
      if (inView && !frame) frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = Boolean(entry?.isIntersecting);
      if (cueRef.current) cueRef.current.style.opacity = (entry?.intersectionRatio ?? 0) >= 0.35 ? "1" : "0";
      schedule();
    }, { threshold: [0, 0.35] });
    observer.observe(node);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", draw);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", draw);
    };
  }, [strength]);
  const optimizedBgSrc = bgSrcOptimized?.src ?? bgSrcOptimized?.fallbackSrc ?? bgSrc;

  return (
    <div ref={ref} className={`relative min-h-[92svh] md:min-h-[calc(100svh-3.5rem)] w-full overflow-hidden flex items-start ${className ?? ""}`}>
      {/* Background with parallax */}
      <div
        ref={backgroundRef}
        aria-hidden
        className="absolute inset-0 z-0 will-change-transform"
      >
        {bgSrcSet ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `image-set(${bgSrcSet})`, backgroundPosition: imagePosition }}
          />
        ) : (
          <Image
            src={optimizedBgSrc}
            alt=""
            aria-hidden
            fill
            priority
            fetchPriority="high"
            sizes={bgSizes}
            className="object-cover object-center"
            style={{ objectPosition: imagePosition }}
          />
        )}
      </div>
      {/* Optional overlay for readability */}
      {overlay && (
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
      )}

      {/* Foreground content */}
      <div className="relative z-20 mx-auto w-[min(1400px,96vw)] px-4 pb-20 pt-8 text-center md:pb-28 md:pt-10">
        {children}
      </div>

      {/* Scroll cue */}
        <div ref={cueRef} aria-hidden className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2 md:bottom-7">
          <div className="scroll-cue inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/25 text-white/85 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
    </div>
  );
}
