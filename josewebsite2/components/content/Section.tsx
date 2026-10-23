"use client";

import { useEffect, useRef } from "react";

export default function Section({
  children,
  className,
  animate = true,
}: {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !animate) return;
    if (typeof IntersectionObserver === "undefined") {
      node.dataset.revealed = "true";
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        node.dataset.revealed = "true";
        observer.disconnect();
      }
    }, { threshold: 0.05 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [animate]);

  return (
    <section
      ref={ref}
      data-revealed={!animate}
      className={`reveal-section relative flex items-center py-2 sm:py-4 md:py-0 md:min-h-[58svh] ${className ?? ""}`}
    >
      {children}
    </section>
  );
}
