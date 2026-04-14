"use client";

import { useEffect, useState } from "react";
import LoaderScreen from "@/components/layout/LoaderScreen";
import useSmoothProgress from "@/components/layout/useSmoothProgress";

export default function SiteLoader() {
  const [loadReady, setLoadReady] = useState(false);
  const [minDelayDone, setMinDelayDone] = useState(false);
  const [targetProgress, setTargetProgress] = useState(0);
  const [phase, setPhase] = useState<"visible" | "collapsing" | "hidden">("visible");
  const progress = useSmoothProgress(targetProgress);

  useEffect(() => {
    const minDelayId = window.setTimeout(() => setMinDelayDone(true), 850);
    const markReady = () => setLoadReady(true);

    if (document.readyState === "complete") {
      markReady();
    } else {
      window.addEventListener("load", markReady, { once: true });
    }

    return () => {
      window.clearTimeout(minDelayId);
      window.removeEventListener("load", markReady);
    };
  }, []);

  useEffect(() => {
    if (phase === "hidden") return;

    const intervalId = window.setInterval(() => {
      setTargetProgress((current) => {
        const cap = loadReady && minDelayDone ? 100 : 94;
        if (current >= cap) return current;
        if (current < 32) return Math.min(current + 5, cap);
        if (current < 60) return Math.min(current + 3, cap);
        if (current < 84) return Math.min(current + 2, cap);
        return Math.min(current + 1, cap);
      });
    }, 68);

    return () => window.clearInterval(intervalId);
  }, [loadReady, minDelayDone, phase]);

  useEffect(() => {
    if (!loadReady || !minDelayDone || progress < 100 || phase !== "visible") return;

    const collapseId = window.setTimeout(() => setPhase("collapsing"), 120);
    const hideId = window.setTimeout(() => setPhase("hidden"), 720);

    return () => {
      window.clearTimeout(collapseId);
      window.clearTimeout(hideId);
    };
  }, [loadReady, minDelayDone, progress, phase]);

  useEffect(() => {
    document.body.classList.toggle("site-loader-active", phase !== "hidden");
    return () => document.body.classList.remove("site-loader-active");
  }, [phase]);

  if (phase === "hidden") return null;

  return (
    <div className={phase === "collapsing" ? "loader-collapse-out pointer-events-none" : ""}>
      <LoaderScreen progress={progress} />
    </div>
  );
}
