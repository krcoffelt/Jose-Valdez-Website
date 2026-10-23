"use client";

import { useEffect, useRef, useState } from "react";

export default function useSmoothProgress(target: number) {
  const [displayed, setDisplayed] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    let frameId = 0;
    let lastTime = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(now - lastTime, 64);
      lastTime = now;
      const difference = target - current.current;
      current.current = Math.abs(difference) < 0.15
        ? target
        : current.current + difference * (1 - Math.exp(-elapsed / 40));
      setDisplayed(current.current);
      if (current.current !== target) frameId = requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [target]);

  return displayed;
}
