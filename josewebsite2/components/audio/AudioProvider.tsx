"use client";
import { createContext, useContext, useRef, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { SkipBack, SkipForward, Play, Pause, Volume2 } from "lucide-react";
import type { AudioTrack } from "./types";
export type { AudioTrack } from "./types";
type Ctx = {
  queue: AudioTrack[];
  index: number;
  playing: boolean;
  current?: AudioTrack;
  setQueue: (q: AudioTrack[], startAt?: number, options?: { autoplay?: boolean }) => void;
  play: (t?: AudioTrack) => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (s: number) => void;
  setVolume: (v: number) => void;
  time: number;
  duration: number;
  volume: number;
  dockVisible: boolean;
  setDockVisible: (v: boolean) => void;
};
const AudioCtx = createContext<Ctx | null>(null);
export const useAudio = () => useContext(AudioCtx)!;

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const el = useRef<HTMLAudioElement>(null);
  const [queue, setQ] = useState<AudioTrack[]>([]);
  const [index, setI] = useState(-1);
  const [playing, setP] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDur] = useState(0);
  const [volume, setVol] = useState(0.9);
  const [dockVisible, setDockVisible] = useState(false);

  const current = index >= 0 ? queue[index] : undefined;

  const setQueue = (q: AudioTrack[], startAt = 0, options?: { autoplay?: boolean }) => {
    setQ(q);
    setI(startAt);
    const autoplay = options?.autoplay ?? false;
    if (autoplay) {
      setTimeout(() => play(), 0);
    } else {
      pause();
    }
  };
  const play = (t?: AudioTrack) => {
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
      value={{ queue, index, playing, current, setQueue, play, pause, next, prev, seek, setVolume, time, duration, volume, dockVisible, setDockVisible }}
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
  const current = a.current;
  if (!current) return null;
  const visible = a.dockVisible;
  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(900px,92vw)] rounded-2xl bg-surface/80 backdrop-blur px-4 py-3 shadow-soft border border-white/5 mb-[env(safe-area-inset-bottom)] transition-all duration-300 ease-out transform-gpu ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-4">
        <button onClick={a.prev} aria-label="Previous" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center">
          <SkipBack className="h-4 w-4 text-white" />
        </button>
        {a.playing ? (
          <button onClick={a.pause} aria-label="Pause" className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center">
            <Pause className="h-5 w-5" />
          </button>
        ) : (
          <button onClick={() => a.play()} aria-label="Play" className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center">
            <Play className="h-5 w-5" />
          </button>
        )}
        <button onClick={a.next} aria-label="Next" className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center">
          <SkipForward className="h-4 w-4 text-white" />
        </button>
        <div className="flex-1">
          <Slider.Root
            className="relative flex h-4 select-none items-center touch-none"
            value={[a.time]}
            max={a.duration || 0}
            step={1}
            onValueChange={(v) => a.seek(v[0] ?? 0)}
            aria-label="Seek"
          >
            <Slider.Track className="relative h-1 w-full grow rounded-full bg-white/20">
              <Slider.Range className="absolute h-1 rounded-full bg-white" />
            </Slider.Track>
            <Slider.Thumb className="block h-3 w-3 rounded-full bg-white shadow outline-none focus:outline-none focus:ring-0" />
          </Slider.Root>
        </div>
        <div className="flex items-center gap-2 w-[140px]">
          <Volume2 className="h-4 w-4 text-white/80" />
          <Slider.Root
            className="relative flex h-4 select-none items-center touch-none w-full"
            value={[a.volume]}
            max={1}
            step={0.01}
            onValueChange={(v) => a.setVolume(v[0] ?? 0)}
            aria-label="Volume"
          >
            <Slider.Track className="relative h-1 w-full grow rounded-full bg-white/20">
              <Slider.Range className="absolute h-1 rounded-full bg-white" />
            </Slider.Track>
            <Slider.Thumb className="block h-3 w-3 rounded-full bg-white shadow outline-none focus:outline-none focus:ring-0" />
          </Slider.Root>
        </div>
      </div>
    </div>
  );
}
