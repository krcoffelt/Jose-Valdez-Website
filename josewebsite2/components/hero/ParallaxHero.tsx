"use client";
import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";

type Props = {
  bgSrc: string;
  strength?: number; // max pixels to translate background upwards
  overlay?: boolean;
  children: React.ReactNode;
  className?: string;
};

export default function ParallaxHero({
  bgSrc,
  strength = 140,
  overlay = true,
  children,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const inView = useInView(ref, { amount: 0.35 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -strength]);

  return (
    <div ref={ref} className={`relative min-h-[100svh] w-full overflow-hidden flex items-start ${className ?? ""}`}>
      {/* Background with parallax */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-0 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url('${bgSrc}')`, y: prefersReduced ? 0 : y }}
      />
      {/* Optional overlay for readability */}
      {overlay && (
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
      )}

      {/* Foreground content */}
      <div className="relative z-20 mx-auto w-[min(1400px,96vw)] text-center space-y-6 md:space-y-2 pt-0 md:pt-2 md:-mt-14 pb-12 md:pb-16">
        {children}
      </div>

      {/* Scroll cue */}
      {inView && (
        <div aria-hidden className="pointer-events-none absolute bottom-5 left-1/2 z-30 -translate-x-1/2">
          <div className="scroll-cue inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/25 text-white/85 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
