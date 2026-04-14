"use client";

import { useEffect, useState } from "react";
import LoaderScreen from "@/components/layout/LoaderScreen";
import useSmoothProgress from "@/components/layout/useSmoothProgress";

export default function RouteLoader() {
  const [targetProgress, setTargetProgress] = useState(0);
  const progress = useSmoothProgress(targetProgress);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTargetProgress((current) => {
        if (current >= 92) return current;
        if (current < 36) return current + 5;
        if (current < 68) return current + 3;
        if (current < 84) return current + 2;
        return current + 1;
      });
    }, 72);

    return () => window.clearInterval(intervalId);
  }, []);

  return <LoaderScreen progress={progress} />;
}
