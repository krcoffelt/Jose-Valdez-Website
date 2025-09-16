"use client";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { allReleases } from "@contentlayer";
import { useAudio } from "@/components/audio/AudioProvider";

type QTrack = { id: string; title: string; artist?: string; src?: string; cover?: string; duration?: string };

function formatTime(s?: number) {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
}

export default function MusicPlayerDemo() {
  const a = useAudio();

  // Build a demo queue from the latest Release (fallbacks if none)
  const queue: QTrack[] = useMemo(() => {
    const latest = [...allReleases].sort((x, y) => +new Date(y.date) - +new Date(x.date))[0];
    if (latest) {
      const cover = latest.cover || "/images/placeholder.svg";
      const tracks = (latest.tracks as any[]) || [];
      return tracks.map((t, i) => ({
        id: t.slug ?? `${latest.slug}-${i}`,
        title: t.title ?? latest.title,
        artist: "JOSÉ",
        src: t.audioSrc,
        cover,
        duration: t.duration,
      }));
    }
    // Fallback demo items
    return [
      { id: "demo-1", title: "Demo One", artist: "JOSÉ", src: undefined, cover: "/images/placeholder.svg", duration: "3:12" },
      { id: "demo-2", title: "Demo Two", artist: "JOSÉ", src: undefined, cover: "/images/placeholder.svg", duration: "3:44" },
    ];
  }, []);

  useEffect(() => {
    if (queue.length && a.queue.length === 0) {
      a.setQueue(queue as any, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.length]);

  const current = a.current ?? (a.index >= 0 ? queue[a.index] : undefined);

  return (
    <div className="mx-auto w-[min(1200px,95vw)] py-8">
      <div className="rounded-2xl bg-surface/80 backdrop-blur border border-white/10 shadow-soft p-6">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr),340px] items-start">
          {/* Artwork / Video placeholder */}
          <div className="aspect-square rounded-2xl overflow-hidden bg-black/40">
            <Image
              src={current?.cover || "/images/placeholder.svg"}
              alt={current?.title || "Artwork"}
              width={1200}
              height={1200}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          {/* Queue */}
          <div className="space-y-3">
            {queue.map((t, i) => {
              const active = i === a.index;
              return (
                <button
                  key={t.id}
                  onClick={() => a.setQueue(queue as any, i)}
                  className={`w-full text-left rounded-xl px-3 py-2 flex items-center gap-3 border transition ${
                    active ? "bg-white/10 border-white/20" : "bg-transparent border-white/10 hover:bg-white/5"
                  }`}
                >
                  <div className="h-10 w-10 rounded-md overflow-hidden bg-black/40 shrink-0">
                    <Image src={t.cover || "/images/placeholder.svg"} alt="" width={80} height={80} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className={`uppercase tracking-wide text-sm ${active ? "text-white" : "text-white"}`}>{t.title}</div>
                    <div className="text-xs text-neutral-400">{t.artist ?? ""}</div>
                  </div>
                  <div className="text-sm text-neutral-400">{t.duration ?? ""}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="range"
                min={0}
                max={a.duration || 0}
                step={1}
                value={a.time}
                onChange={(e) => a.seek(Number(e.currentTarget.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-neutral-400 mt-1">
                <span>{formatTime(a.time)}</span>
                <span>{formatTime(a.duration)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={a.prev} aria-label="Previous" className="h-12 w-12 rounded-full bg-white/10">⏮️</button>
              {a.playing ? (
                <button onClick={a.pause} aria-label="Pause" className="h-14 w-14 rounded-full bg-white text-black font-bold">⏸️</button>
              ) : (
                <button onClick={() => a.play()} aria-label="Play" className="h-14 w-14 rounded-full bg-white text-black font-bold">▶️</button>
              )}
              <button onClick={a.next} aria-label="Next" className="h-12 w-12 rounded-full bg-white/10">⏭️</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

