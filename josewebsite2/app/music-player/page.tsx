"use client";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import * as Slider from "@radix-ui/react-slider";
import { SkipBack, SkipForward, Play, Pause } from "lucide-react";
import { allReleases } from "@contentlayer";
import { useAudio } from "@/components/audio/AudioProvider";
import type { AudioTrack } from "@/components/audio/types";

type ReleaseTrack = {
  slug?: string;
  title?: string;
  artist?: string;
  src?: string;
  audioSrc?: string;
  cover?: string;
  duration?: string;
};

function formatTime(s?: number) {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
}

export default function MusicPlayerDemo() {
  const a = useAudio();

  // Build a demo queue from the latest Release (fallbacks if none)
  const queue: AudioTrack[] = useMemo(() => {
    const latest = [...allReleases].sort((x, y) => +new Date(y.date) - +new Date(x.date))[0];
    if (latest) {
      const cover = latest.cover || "/images/placeholder.svg";
      const tracks = (latest.tracks as ReleaseTrack[]) || [];
      return tracks.map((track, index) => ({
        id: track.slug ?? `${latest.slug}-${index}`,
        title: track.title ?? latest.title,
        artist: track.artist ?? "JOSÉ",
        src: track.audioSrc ?? track.src,
        cover,
        duration: track.duration,
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
      a.setQueue(queue, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.length]);

  const current = a.current ?? (a.index >= 0 ? queue[a.index] : undefined);

  return (
    <div className="mx-auto w-[min(1200px,95vw)] py-8">
      <div className="rounded-2xl bg-surface/80 backdrop-blur border border-white/10 shadow-soft p-6">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr),360px] items-start">
          {/* Artwork / Video area */}
          <div>
            <div className="aspect-video rounded-2xl overflow-hidden bg-black/40">
            <Image
              src={current?.cover || "/images/placeholder.svg"}
              alt={current?.title || "Artwork"}
              width={1200}
              height={1200}
              className="h-full w-full object-cover"
              priority
            />
            </div>
            <div className="mt-4">
              <div className="text-2xl font-semibold">{current?.title ?? "—"}</div>
              <div className="text-neutral-400 uppercase tracking-wide">{current?.artist ?? "JOSÉ"}</div>
            </div>
          </div>

          {/* Queue */}
          <div className="space-y-3">
            {queue.map((t, i) => {
              const active = i === a.index;
              return (
                <button
                  key={t.id}
                  onClick={() => a.setQueue(queue, i)}
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

        {/* Scrubber + Controls */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-400 w-10 text-right">{formatTime(a.time)}</span>
            <Slider.Root
              className="relative flex-1 h-4 select-none touch-none"
              value={[a.time]}
              max={a.duration || 0}
              step={1}
              onValueChange={(v) => a.seek(v[0] ?? 0)}
              aria-label="Seek"
            >
              <Slider.Track className="bg-white/15 relative grow rounded-full h-1">
                <Slider.Range className="absolute h-1 rounded-full bg-white" />
              </Slider.Track>
              <Slider.Thumb className="block h-3 w-3 rounded-full bg-white shadow" />
            </Slider.Root>
            <span className="text-xs text-neutral-400 w-10">{formatTime(a.duration)}</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button onClick={a.prev} aria-label="Previous" className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
              <SkipBack className="h-5 w-5 text-white" />
            </button>
            {a.playing ? (
              <button onClick={a.pause} aria-label="Pause" className="h-16 w-16 rounded-full bg-white text-black flex items-center justify-center">
                <Pause className="h-7 w-7" />
              </button>
            ) : (
              <button onClick={() => a.play()} aria-label="Play" className="h-16 w-16 rounded-full bg-white text-black flex items-center justify-center">
                <Play className="h-7 w-7" />
              </button>
            )}
            <button onClick={a.next} aria-label="Next" className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
              <SkipForward className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
