"use client";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    UnicornStudio?: { isInitialized?: boolean; init: () => void };
  }
}

type Props = {
  projectId: string; // data-us-project value
  className?: string;
  aspect?: number; // width/height, default 16/9
  deferUntilIdle?: boolean;
  loadWhenInView?: boolean;
  posterSrc?: string;
};

export default function UnicornStudioEmbed({
  projectId,
  className,
  aspect = 16 / 9,
  deferUntilIdle = true,
  loadWhenInView = true,
  posterSrc,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(!loadWhenInView);
  const [shouldLoad, setShouldLoad] = useState(!loadWhenInView && !deferUntilIdle);

  useEffect(() => {
    if (!loadWhenInView) {
      setIsInView(true);
      return;
    }
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadWhenInView]);

  useEffect(() => {
    if (!isInView) return;
    if (!deferUntilIdle) {
      setShouldLoad(true);
      return;
    }

    let cancelled = false;
    const startLoad = () => {
      if (!cancelled) setShouldLoad(true);
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof idleWindow.requestIdleCallback === "function") {
      const idleId = idleWindow.requestIdleCallback(startLoad, { timeout: 1500 });
      return () => {
        cancelled = true;
        idleWindow.cancelIdleCallback?.(idleId);
      };
    }

    const timeoutId = window.setTimeout(startLoad, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [deferUntilIdle, isInView]);

  useEffect(() => {
    if (!shouldLoad || typeof window === "undefined") return;

    const initStudio = () => {
      if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
        try {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        } catch {}
      }
    };

    const existing = document.getElementById("unicornstudio-sdk");
    if (existing) {
      const onLoad = () => initStudio();
      if ((existing as HTMLScriptElement).dataset.loaded === "true") {
        initStudio();
      } else {
        existing.addEventListener("load", onLoad, { once: true });
      }
      return () => existing.removeEventListener("load", onLoad);
    }

    const s = document.createElement("script");
    s.id = "unicornstudio-sdk";
    s.async = true;
    s.dataset.loaded = "false";
    s.src =
      "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.30/dist/unicornStudio.umd.js";
    s.onload = () => {
      s.dataset.loaded = "true";
      initStudio();
    };
    (document.head || document.body).appendChild(s);
  }, [shouldLoad]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", width: "100%", aspectRatio: String(aspect), overflow: "hidden" }}
    >
      {posterSrc && (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-300 ease-out"
          style={{ backgroundImage: `url('${posterSrc}')`, opacity: shouldLoad ? 0 : 1 }}
        />
      )}
      <div
        data-us-project={projectId}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
