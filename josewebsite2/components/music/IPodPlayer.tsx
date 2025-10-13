"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { allReleases } from "@contentlayer";
import type { Release } from "@contentlayer";
import { useAudio } from "@/components/audio/AudioProvider";
import type { AudioTrack } from "@/components/audio/types";

type ReleaseTrack = {
  slug?: string;
  title?: string;
  artist?: string;
  audioSrc?: string;
  src?: string;
};

function mapReleaseToTracks(release: Release): AudioTrack[] {
  const tracks = (release.tracks as ReleaseTrack[]) ?? [];
  const cover = release.cover || "/images/placeholder.svg";
  return tracks.map((track, index) => ({
    id: `${release.slug}-${track.slug ?? index}`,
    title: track.title ?? release.title,
    artist: track.artist ?? release.title,
    cover,
    src: track.audioSrc ?? track.src,
  }));
}

const queueSeed: AudioTrack[] = [...allReleases]
  .sort((a, b) => +new Date(a.date) - +new Date(b.date))
  .flatMap(mapReleaseToTracks)
  .filter((track, index, arr) => arr.findIndex(t => t.id === track.id) === index);

export default function IPodPlayer() {
  const audio = useAudio();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (queueSeed.length === 0) return;
    if (!audio.queue.length) {
      audio.setQueue(queueSeed, 0);
    }
  }, [audio]);

  const current = audio.current ?? audio.queue[audio.index] ?? queueSeed[audio.index] ?? queueSeed[0];

  return (
    <div className="mx-auto w-[min(320px,90vw)]">
      <div className="relative aspect-[3/5] rounded-[32px] bg-neutral-900 shadow-[0_35px_60px_rgba(0,0,0,0.45)] overflow-hidden border border-white/10" style={{ perspective: "1400px" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#20252b] via-[#111518] to-[#08090b]" />
        <div className="absolute inset-0" style={{ transform: "rotateX(6deg) rotateY(-8deg)", transformOrigin: "center bottom" }}>
          <div className="flex flex-col h-full p-5">
            <div className="rounded-[20px] bg-[#030708] border border-white/15 shadow-inner flex-1 overflow-hidden">
              <div className="relative h-full w-full">
                {current?.cover && (
                  <Image
                    src={current.cover}
                    alt={current?.title ?? "Track art"}
                    fill
                    sizes="220px"
                    className="object-cover opacity-80"
                    priority={false}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/90" />
                <div className="relative z-10 h-full flex flex-col justify-between p-4 text-white">
                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/60 flex items-center justify-between">
                      <span>Now Playing</span>
                      <span>{queueSeed.length.toString().padStart(2, "0")}</span>
                    </div>
                    <div className="text-lg font-semibold leading-tight line-clamp-2">{current?.title ?? "—"}</div>
                    <div className="text-sm text-white/70 line-clamp-1">{current?.artist ?? ""}</div>
                  </div>
                  <div className="text-xs text-white/60">
                    {formatDisplayTime(audio.time)} / {formatDisplayTime(audio.duration)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <ClickWheel
                playing={audio.playing}
                onPlayPause={() => (audio.playing ? audio.pause() : audio.play())}
                onNext={audio.next}
                onPrev={audio.prev}
                onMenu={() => setShowMenu(v => !v)}
              />
            </div>
          </div>
        </div>
      </div>

      {showMenu && (
        <div className="mt-4 rounded-2xl bg-black/60 border border-white/10 shadow-soft backdrop-blur-xl max-h-[260px] overflow-y-auto">
          <ul className="divide-y divide-white/5">
            {queueSeed.map((track, index) => {
              const active = index === audio.index;
              return (
                <li key={track.id}>
                  <button
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition ${
                      active ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                    onClick={() => {
                      audio.setQueue(queueSeed, index);
                      setShowMenu(false);
                    }}
                  >
                    <div className="flex-1">
                      <div className="text-sm text-white font-medium truncate">{track.title}</div>
                      <div className="text-xs text-white/50 truncate">{track.artist ?? ""}</div>
                    </div>
                    {active && <span className="text-[10px] uppercase text-gold">Playing</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function ClickWheel({
  onMenu,
  onPlayPause,
  onNext,
  onPrev,
  playing,
}: {
  onMenu: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  playing: boolean;
}) {
  return (
    <div className="relative mx-auto h-[160px] w-[160px] rounded-full bg-gradient-to-br from-[#e0e4ec] to-[#b4bbc8] shadow-[inset_12px_12px_24px_rgba(0,0,0,0.2),inset_-10px_-10px_18px_rgba(255,255,255,0.8)]">
      <button
        onClick={onMenu}
        className="absolute top-[16px] left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.35em] text-neutral-700"
      >
        Menu
      </button>
      <button
        onClick={onPrev}
        aria-label="Previous"
        className="absolute left-[18px] top-1/2 -translate-y-1/2 text-neutral-700"
      >
        ◀
      </button>
      <button
        onClick={onNext}
        aria-label="Next"
        className="absolute right-[18px] top-1/2 -translate-y-1/2 text-neutral-700"
      >
        ▶
      </button>
      <button
        onClick={onPlayPause}
        aria-label={playing ? "Pause" : "Play"}
        className="absolute bottom-[14px] left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.35em] text-neutral-700"
      >
        {playing ? "Pause" : "Play"}
      </button>
      <button
        onClick={onPlayPause}
        aria-label="Press center"
        className="absolute inset-[40px] rounded-full bg-gradient-to-br from-[#f8f9fb] to-[#d7dce5] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.15),inset_-6px_-6px_12px_rgba(255,255,255,0.8)]"
      />
    </div>
  );
}

function formatDisplayTime(value?: number) {
  if (!value || !isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}
