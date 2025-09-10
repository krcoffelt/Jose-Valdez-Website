"use client";
import { createContext, useContext, useRef, useState } from "react";

type Track = { id: string; title: string; artist?: string; src?: string; cover?: string };
type Ctx = {
  queue: Track[];
  index: number;
  playing: boolean;
  current?: Track;
  setQueue: (q: Track[], startAt?: number) => void;
  play: (t?: Track) => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (s: number) => void;
  setVolume: (v: number) => void;
  time: number;
  duration: number;
  volume: number;
};
const AudioCtx = createContext<Ctx | null>(null);
export const useAudio = () => useContext(AudioCtx)!;

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const el = useRef<HTMLAudioElement>(null);
  const [queue, setQ] = useState<Track[]>([]);
  const [index, setI] = useState(-1);
  const [playing, setP] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDur] = useState(0);
  const [volume, setVol] = useState(0.9);

  const current = index >= 0 ? queue[index] : undefined;

  const setQueue = (q: Track[], startAt = 0) => {
    setQ(q);
    setI(startAt);
    setTimeout(() => play(), 0);
  };
  const play = (t?: Track) => {
    if (t) {
      setQ((q) => (index < 0 ? [t] : [...q.slice(0, index + 1), t, ...q.slice(index + 1)]));
      setI((i) => (i < 0 ? 0 : i + 1));
    }
    el.current?.play();
    setP(true);
  };
  const pause = () => {
    el.current?.pause();
    setP(false);
  };
  const next = () => setI((i) => Math.min(queue.length - 1, i + 1));
  const prev = () => setI((i) => Math.max(0, i - 1));
  const seek = (s: number) => {
    if (el.current) el.current.currentTime = s;
  };
  const setVolume = (v: number) => {
    setVol(v);
    if (el.current) el.current.volume = v;
  };

  return (
    <AudioCtx.Provider
      value={{ queue, index, playing, current, setQueue, play, pause, next, prev, seek, setVolume, time, duration, volume }}
    >
      {children}
      <audio
        ref={el}
        src={current?.src}
        onTimeUpdate={() => setTime(el.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDur(el.current?.duration ?? 0)}
        onEnded={next}
        preload="none"
      />
      <PlayerDock />
    </AudioCtx.Provider>
  );
}

function PlayerDock() {
  const a = useAudio();
  if (!a.current) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(900px,92vw)] rounded-2xl bg-surface/80 backdrop-blur px-4 py-3 shadow-soft border border-white/5">
      <div className="flex items-center gap-3">
        <button onClick={a.prev} aria-label="Previous">⏮️</button>
        {a.playing ? (
          <button onClick={a.pause} aria-label="Pause">⏸️</button>
        ) : (
          <button onClick={() => a.play()} aria-label="Play">▶️</button>
        )}
        <button onClick={a.next} aria-label="Next">⏭️</button>
        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={a.duration || 0}
            step="1"
            value={a.time}
            onChange={(e) => a.seek(Number(e.currentTarget.value))}
            className="w-full"
          />
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step="0.01"
          value={a.volume}
          onChange={(e) => a.setVolume(Number(e.currentTarget.value))}
        />
      </div>
    </div>
  );
}

