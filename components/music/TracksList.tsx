"use client";
import Image from "next/image";
import { useAudio } from "@/components/audio/AudioProvider";

export type TrackItem = {
  id: string;
  title: string;
  artist?: string;
  src?: string;
  cover?: string;
  duration?: string;
  release?: string;
};

export default function TracksList({ tracks }: { tracks: TrackItem[] }) {
  const a = useAudio();

  function playAll(startAt = 0) {
    a.setQueue(
      tracks.map((t) => ({ id: t.id, title: t.title, artist: t.artist, src: t.src, cover: t.cover })),
      startAt
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">All Songs</h2>
        <div className="flex gap-2">
          <button onClick={() => playAll(0)} className="px-3 py-1.5 rounded-xl bg-gold text-black">Play All</button>
          <button onClick={() => a.pause()} className="px-3 py-1.5 rounded-xl bg-white/10">Pause</button>
        </div>
      </div>
      <ul className="divide-y divide-white/10 rounded-xl border border-white/10 overflow-hidden">
        {tracks.map((t, i) => (
          <li key={t.id} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition">
            <div className="w-8 text-sm text-neutral-500 tabular-nums">{String(i + 1).padStart(2, "0")}</div>
            <div className="h-10 w-10 rounded-md overflow-hidden bg-black/40 shrink-0">
              <Image src={t.cover || "/images/placeholder.svg"} alt="" width={80} height={80} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate">{t.title}</div>
              <div className="text-xs text-neutral-400 truncate">{t.artist ?? ""}{t.release ? ` • ${t.release}` : ""}</div>
            </div>
            <div className="text-sm text-neutral-400 w-14 text-right tabular-nums">{t.duration ?? ""}</div>
            <button
              onClick={() => playAll(i)}
              className="ml-2 px-3 py-1.5 rounded-lg bg-white text-black text-sm"
              aria-label={`Play ${t.title}`}
            >
              Play
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

