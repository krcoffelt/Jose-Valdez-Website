"use client";

import Image from "next/image";
import { memo } from "react";
import { CalendarDays, Headphones, Music2, Play } from "lucide-react";
import type { SongItem } from "./SongWheel";

type Props = {
  card: SongItem;
  index: number;
  active: boolean;
  flipped: boolean;
  onOpen: (index: number) => void;
  onPlay: (index: number) => void;
};

function SongWheelCard({ card, index, active, flipped, onOpen, onPlay }: Props) {
  const playable = Boolean(card.audioSrc);
  const date = card.date && !Number.isNaN(Date.parse(card.date))
    ? new Date(card.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })
    : "";

  return (
    <div className="song-slot snap-center shrink-0 w-[180px] h-[180px] md:w-[200px] md:h-[200px] lg:w-[240px] lg:h-[240px]">
      <div data-wheel-scale className="scale-shell h-full w-full">
        <div className={`song-card relative h-full w-full rounded-2xl overflow-hidden border shadow-soft ${active ? "border-white/20" : "border-white/10"} ${flipped ? "is-flipped" : ""}`}>
          <button
            type="button"
            onClick={() => onOpen(index)}
            className="absolute inset-0 front face focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white/70"
            aria-label={`Open ${card.title}`}
            aria-pressed={flipped}
            tabIndex={flipped ? -1 : 0}
          >
            <Image src={card.cover} alt={card.title} fill sizes="(min-width:1024px) 264px, (min-width:768px) 220px, 216px" className="cover object-cover" loading="lazy" quality={72} />
            <div className="absolute left-2 bottom-2 right-2 pointer-events-none text-left drop-shadow-[0_1px_6px_rgba(0,0,0,0.75)]">
              <div className="card-title text-white text-sm font-semibold leading-tight truncate">{card.title}</div>
              {card.artist && <div className="text-white/90 text-xs truncate">{card.artist}</div>}
            </div>
          </button>
          <div className="absolute inset-0 back face bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 text-neutral-900 border border-black/10 p-4 flex flex-col" aria-hidden={!flipped} inert={!flipped}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">Track</div>
                <div className="text-lg font-semibold leading-tight line-clamp-2">{card.title}</div>
                {card.artist && <div className="text-sm text-neutral-500 line-clamp-1">{card.artist}</div>}
              </div>
              <button type="button" onClick={() => onPlay(index)} disabled={!playable} className={`h-10 w-10 shrink-0 rounded-full border flex items-center justify-center transition ${playable ? "border-neutral-900 bg-neutral-900 text-white hover:bg-black" : "border-neutral-300 bg-neutral-200 text-neutral-400 cursor-not-allowed"}`} aria-label={playable ? `Play ${card.title}` : `Preview unavailable for ${card.title}`} tabIndex={flipped ? 0 : -1}>
                <Play className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-neutral-600">
              {card.release && <div className="flex items-center gap-2"><Music2 className="h-3.5 w-3.5 shrink-0 text-neutral-500" /><span className="font-medium text-neutral-700 line-clamp-1">{card.release}</span></div>}
              {date && <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 shrink-0 text-neutral-500" /><span>{date}</span></div>}
              <div className="flex items-center gap-2"><Headphones className="h-3.5 w-3.5 shrink-0 text-neutral-500" /><span>{playable ? "Preview ready" : "Preview unavailable"}</span></div>
            </div>
            <div className="mt-auto pt-4 flex flex-wrap gap-2">
              {card.platforms?.apple && <a className="px-2.5 py-1.5 rounded-lg bg-neutral-900 text-white text-[11px] font-medium tracking-wide uppercase" href={card.platforms.apple} target="_blank" rel="noreferrer" tabIndex={flipped ? 0 : -1}>Apple Music</a>}
              {card.platforms?.spotify && <a className="px-2.5 py-1.5 rounded-lg bg-neutral-700 text-white text-[11px] font-medium tracking-wide uppercase" href={card.platforms.spotify} target="_blank" rel="noreferrer" tabIndex={flipped ? 0 : -1}>Spotify</a>}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .scale-shell { transform: scale(var(--wheel-scale, 0.92)); }
        .song-card { transform: translateY(0) scale(1); transition: transform 420ms cubic-bezier(0.22,1,0.36,1), border-color 420ms ease, box-shadow 420ms ease; }
        .cover { transition: filter 420ms ease; }
        .card-title { transition: color 420ms ease; }
        @media (hover: hover) and (pointer: fine) and (min-width: 768px) {
          .song-slot:hover .song-card { transform: translateY(-4px) scale(1.02); border-color: rgba(255,255,255,0.25); box-shadow: 0 16px 38px rgba(0,0,0,0.34); }
          .song-slot:hover .cover { filter: brightness(1.03) saturate(1.03); }
          .song-slot:hover .card-title { color: #fff3d6; }
        }
        .front { transform: rotateY(0deg); pointer-events: auto; }
        .back { transform: rotateY(180deg); pointer-events: none; }
        .face { backface-visibility: hidden; -webkit-backface-visibility: hidden; transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(.4,.2,.2,1); }
        .is-flipped .front { transform: rotateY(180deg); pointer-events: none; }
        .is-flipped .back { transform: rotateY(0deg); pointer-events: auto; }
        @media (prefers-reduced-motion: reduce) {
          .song-card, .face, .cover, .card-title { transition: none; }
        }
      `}</style>
    </div>
  );
}

export default memo(SongWheelCard);
