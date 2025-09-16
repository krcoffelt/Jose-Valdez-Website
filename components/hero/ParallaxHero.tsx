"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

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
      <div className="relative z-20 mx-auto w-[min(1400px,96vw)] text-center space-y-1 md:space-y-2 pt-0 md:pt-2 -mt-8 md:-mt-14 pb-12 md:pb-16">
        {children}
      </div>
    </div>
  );
}
