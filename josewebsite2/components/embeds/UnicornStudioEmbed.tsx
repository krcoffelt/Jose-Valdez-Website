"use client";
import { useEffect, useId } from "react";

declare global {
  interface Window {
    UnicornStudio?: { isInitialized?: boolean; init: () => void };
  }
}

type Props = {
  projectId: string; // data-us-project value
  className?: string;
  aspect?: number; // width/height, default 16/9
};

export default function UnicornStudioEmbed({ projectId, className, aspect = 16 / 9 }: Props) {
  const id = useId();

  useEffect(() => {
    // Avoid duplicate script injection
    if (typeof window === "undefined") return;
    const existing = document.getElementById("unicornstudio-sdk");
    if (existing) {
      // If SDK exists but not initialized, try init
      if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
        try { window.UnicornStudio.init(); } catch {}
      }
      return;
    }

    const s = document.createElement("script");
    s.id = "unicornstudio-sdk";
    s.async = true;
    s.src =
      "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.30/dist/unicornStudio.umd.js";
    s.onload = () => {
      try {
        if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
      } catch {}
    };
    (document.head || document.body).appendChild(s);
  }, [id]);

  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", aspectRatio: String(aspect), overflow: "hidden" }}
    >
      <div
        data-us-project={projectId}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}

