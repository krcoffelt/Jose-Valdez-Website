"use client";

import { useEffect, useRef, useState } from "react";

export default function useSmoothProgress(target: number) {
  const [displayed, setDisplayed] = useState(0);
  const targetRef = useRef(target);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    let frameId = 0;

    const tick = () => {
      setDisplayed((current) => {
        const diff = targetRef.current - current;
        if (Math.abs(diff) < 0.18) return targetRef.current;

        const step = Math.max(0.18, Math.abs(diff) * 0.14);
        const next = current + Math.sign(diff) * step;

        if ((diff > 0 && next > targetRef.current) || (diff < 0 && next < targetRef.current)) {
          return targetRef.current;
        }

        return next;
      });

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return displayed;
}
