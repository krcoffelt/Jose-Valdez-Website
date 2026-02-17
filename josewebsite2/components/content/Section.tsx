"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      className={`relative flex items-center py-4 sm:py-6 md:py-1 md:snap-section md:min-h-[64svh] ${className ?? ""}`}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 26 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}
