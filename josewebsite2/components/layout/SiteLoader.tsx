"use client";

import { useEffect, useState } from "react";
import LoaderScreen from "@/components/layout/LoaderScreen";
import useSmoothProgress from "@/components/layout/useSmoothProgress";

export default function SiteLoader() {
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<"visible" | "collapsing" | "hidden">("visible");
  const progress = useSmoothProgress(ready ? 100 : 90);

  useEffect(() => {
    let cancelled = false;
    let minimumTimer = 0;
    const deadline = window.setTimeout(() => setReady(true), 3500);
    const minimum = new Promise<void>((resolve) => {
      minimumTimer = window.setTimeout(resolve, 100);
    });
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('img[fetchpriority="high"]'));
    // Wait only for first-screen artwork, not third-party embeds below it.
    void Promise.all([minimum, ...images.map((image) => image.decode().catch(() => {}))]).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
      window.clearTimeout(minimumTimer);
      window.clearTimeout(deadline);
    };
  }, []);

  useEffect(() => {
    if (ready && progress === 100) setPhase((current) => current === "visible" ? "collapsing" : current);
  }, [ready, progress]);

  useEffect(() => {
    if (phase !== "collapsing") return;
    const timeout = window.setTimeout(() => setPhase("hidden"), 350);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    document.body.classList.toggle("site-loader-active", phase !== "hidden");
    return () => document.body.classList.remove("site-loader-active");
  }, [phase]);

  if (phase === "hidden") return null;

  return (
    <div
      className={phase === "collapsing" ? "loader-collapse-out pointer-events-none" : ""}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && phase === "collapsing") setPhase("hidden");
      }}
    >
      <LoaderScreen progress={progress} />
    </div>
  );
}
