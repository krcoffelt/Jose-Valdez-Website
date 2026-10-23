"use client";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
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
  error: string | null;
  dockVisible: boolean;
  setDockVisible: (v: boolean) => void;
};
const AudioCtx = createContext<Ctx | null>(null);
const AudioProgressCtx = createContext<{ time: number; duration: number; volume: number } | null>(null);
export function useAudio() {
  const audio = useContext(AudioCtx);
  if (!audio) throw new Error("useAudio requires AudioProvider");
  return audio;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const el = useRef<HTMLAudioElement>(null);
  const [queue, setQ] = useState<AudioTrack[]>([]);
  const [index, setI] = useState(-1);
  const [playing, setP] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDur] = useState(0);
  const [volume, setVol] = useState(0.9);
  const [dockVisible, setDockVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queueRef = useRef<AudioTrack[]>([]);
  const indexRef = useRef(-1);
  const volumeRef = useRef(0.9);

  const current = index >= 0 ? queue[index] : undefined;

  const startPlayback = useCallback(() => {
    const media = el.current;
    if (!media?.getAttribute("src")) return;
    setError(null);
    void media.play().catch((cause: unknown) => {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      setP(false);
      setError("Unable to play this track. Please try again.");
    });
  }, []);

  const selectTrack = useCallback((q: AudioTrack[], requested: number, autoplay: boolean) => {
    const media = el.current;
    if (!media) return;
    const nextIndex = q.length ? Math.max(0, Math.min(requested, q.length - 1)) : -1;
    const track = q[nextIndex];
    media.pause();
    queueRef.current = q;
    indexRef.current = nextIndex;
    setQ(q);
    setI(nextIndex);
    setP(false);
    setTime(0);
    setDur(0);
    setError(null);
    if (track?.src) media.src = track.src;
    else media.removeAttribute("src");
    media.volume = volumeRef.current;
    media.load();
    if (autoplay && track?.src) startPlayback();
  }, [startPlayback]);

  const setQueue = useCallback((q: AudioTrack[], startAt = 0, options?: { autoplay?: boolean }) => {
    selectTrack(q, startAt, options?.autoplay ?? false);
  }, [selectTrack]);
  const play = useCallback((track?: AudioTrack) => {
    if (track) {
      const nextQueue = [...queueRef.current];
      nextQueue.splice(indexRef.current + 1, 0, track);
      selectTrack(nextQueue, indexRef.current + 1, true);
    } else startPlayback();
  }, [selectTrack, startPlayback]);
  const pause = useCallback(() => {
    el.current?.pause();
    setP(false);
  }, []);
  const next = useCallback(() => {
    if (indexRef.current + 1 < queueRef.current.length) selectTrack(queueRef.current, indexRef.current + 1, true);
  }, [selectTrack]);
  const prev = useCallback(() => {
    if (indexRef.current > 0) selectTrack(queueRef.current, indexRef.current - 1, true);
  }, [selectTrack]);
  const seek = useCallback((seconds: number) => {
    const media = el.current;
    if (media && Number.isFinite(media.duration)) media.currentTime = Math.max(0, Math.min(seconds, media.duration));
  }, []);
  const setVolume = useCallback((v: number) => {
    volumeRef.current = v;
    setVol(v);
    if (el.current) el.current.volume = v;
  }, []);
  const controls = useMemo(() => ({
    queue, index, playing, current, setQueue, play, pause, next, prev, seek, setVolume, error, dockVisible, setDockVisible,
  }), [queue, index, playing, current, setQueue, play, pause, next, prev, seek, setVolume, error, dockVisible]);
  const progress = useMemo(() => ({ time, duration, volume }), [time, duration, volume]);

  return (
    <AudioCtx.Provider value={controls}>
      <AudioProgressCtx.Provider value={progress}>
      {children}
      <audio
        ref={el}
        onTimeUpdate={() => setTime(el.current?.currentTime ?? 0)}
        onLoadedMetadata={() => {
          const seconds = el.current?.duration ?? 0;
          setDur(Number.isFinite(seconds) ? seconds : 0);
        }}
        onPlay={() => setP(true)}
        onPause={() => setP(false)}
        onEnded={() => { setP(false); next(); }}
        onError={() => { setP(false); setError("This track is unavailable. Please try another song."); }}
        preload="none"
      />
      <PlayerDock />
      </AudioProgressCtx.Provider>
    </AudioCtx.Provider>
  );
}

function PlayerDock() {
  const controls = useAudio();
  const progress = useContext(AudioProgressCtx)!;
  const a = { ...controls, ...progress };
  const current = a.current;
  if (!current) return null;
  const visible = a.dockVisible;
  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(900px,92vw)] rounded-2xl bg-surface/80 backdrop-blur px-4 py-3 shadow-soft border border-white/5 mb-[env(safe-area-inset-bottom)] transition-all duration-300 ease-out transform-gpu ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
      aria-hidden={!visible}
      inert={!visible}
      role="region"
      aria-label="Audio player"
    >
      <div className="flex items-center gap-4">
        <button onClick={a.prev} disabled={a.index <= 0} aria-label="Previous" className="h-9 w-9 shrink-0 rounded-full bg-white/10 flex items-center justify-center disabled:opacity-40">
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
        <button onClick={a.next} disabled={a.index >= a.queue.length - 1} aria-label="Next" className="h-9 w-9 shrink-0 rounded-full bg-white/10 flex items-center justify-center disabled:opacity-40">
          <SkipForward className="h-4 w-4 text-white" />
        </button>
        <div className="flex-1">
          <Slider.Root
            className="relative flex h-4 select-none items-center touch-none"
            value={[a.time]}
            max={a.duration || 1}
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
        <div className="hidden sm:flex items-center gap-2 w-[140px]">
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
      {a.error && <p role="alert" className="mt-2 text-sm text-rose-300">{a.error}</p>}
    </div>
  );
}
