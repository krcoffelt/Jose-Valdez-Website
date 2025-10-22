"use client";

import Image from "next/image";
import { useMemo } from "react";
import { CalendarDays, Clock3, Music2, Play, Pause, Headphones, ExternalLink } from "lucide-react";
import { useAudio } from "@/components/audio/AudioProvider";
import type { AudioTrack } from "@/components/audio/AudioProvider";

type MusicCatalogTrack = {
  id: string;
  title: string;
  slug?: string;
  artist?: string;
  duration?: string;
  audioSrc?: string | null;
  queueIndex?: number | null;
};

export type MusicCatalogRelease = {
  title: string;
  slug: string;
  date?: string;
  releaseType?: string;
  cover: string;
  platforms?: { apple?: string; spotify?: string } | null;
  tracks: MusicCatalogTrack[];
};

function formatDate(iso?: string) {
  if (!iso) return "";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function queuesMatch(current: AudioTrack[], next: AudioTrack[]) {
  if (current.length !== next.length) return false;
  return current.every((track, index) => track.id === next[index]?.id);
}

export default function MusicCatalog({ releases }: { releases: MusicCatalogRelease[] }) {
  const audio = useAudio();

  const { queue, sections } = useMemo(() => {
    const q: AudioTrack[] = [];
    const mapped = releases.map((release) => {
      const tracks = release.tracks.map((track) => {
        let queueIndex: number | null = null;
        if (track.audioSrc) {
          queueIndex = q.length;
          q.push({
            id: track.id,
            title: track.title,
            artist: track.artist ?? release.title,
            cover: release.cover,
            src: track.audioSrc ?? undefined,
          });
        }
        return { ...track, queueIndex };
      });
      return { ...release, tracks };
    });
    return { queue: q, sections: mapped };
  }, [releases]);

  const activeId = audio.queue[audio.index]?.id;

  const handlePlay = (trackId: string, queueIndex: number | null) => {
    if (queueIndex === null) return;
    const activeMatches = activeId === trackId;
    const sameQueue = queuesMatch(audio.queue, queue);
    if (sameQueue && activeMatches) {
      if (audio.playing) {
        audio.pause();
      } else {
        audio.play();
      }
      return;
    }
    audio.setQueue(queue, queueIndex, { autoplay: true });
  };

  if (!sections.length) {
    return (
      <div className="mx-auto w-[min(1100px,92vw)] py-16 text-center text-neutral-400">
        No releases yet.
      </div>
    );
  }

  return (
    <div className="mx-auto w-[min(1100px,92vw)] py-16 space-y-12">
      <header className="space-y-3 text-center">
        <h1 className="text-4xl font-semibold">Music</h1>
        <p className="text-neutral-400">Stream singles, live cuts, and acoustic takes.</p>
      </header>

      <div className="space-y-10">
        {sections.map((release) => {
          const releaseDate = formatDate(release.date);
          return (
            <section
              key={release.slug}
              className="rounded-3xl bg-surface/70 border border-white/10 shadow-soft overflow-hidden"
            >
              <div className="grid gap-6 md:grid-cols-[minmax(0,260px),1fr] p-6 md:p-8">
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-soft/50">
                    <Image
                      src={release.cover}
                      alt={release.title}
                      fill
                      sizes="(min-width:768px) 260px, 60vw"
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                  <div className="space-y-2 text-sm text-neutral-400">
                    {releaseDate && (
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-neutral-500" />
                        <span>{releaseDate}</span>
                      </div>
                    )}
                    {release.releaseType && (
                      <div className="flex items-center gap-2">
                        <Music2 className="h-4 w-4 text-neutral-500" />
                        <span className="capitalize">{release.releaseType}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {release.platforms?.apple && (
                      <a
                        className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs uppercase tracking-wide flex items-center gap-2"
                        href={release.platforms.apple}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Apple Music
                      </a>
                    )}
                    {release.platforms?.spotify && (
                      <a
                        className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs uppercase tracking-wide flex items-center gap-2"
                        href={release.platforms.spotify}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Spotify
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold">{release.title}</h2>
                    <p className="text-sm text-neutral-400">
                      {release.tracks.length} {release.tracks.length === 1 ? "track" : "tracks"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 divide-y divide-white/5 overflow-hidden">
                    {release.tracks.map((track) => {
                      const isActive = activeId === track.id;
                      const isPlaying = isActive && audio.playing;
                      const playable = track.audioSrc && queue.length > 0 && track.queueIndex !== null;
                      return (
                        <div
                          key={track.id}
                          className={`flex items-center gap-4 px-4 py-3 text-sm transition ${
                            isActive ? "bg-white/10" : "hover:bg-white/5"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handlePlay(track.id, track.queueIndex ?? null)}
                            disabled={!playable}
                            className={`h-10 w-10 rounded-full flex items-center justify-center border transition ${
                              playable
                                ? isPlaying
                                  ? "border-white bg-white text-black"
                                  : "border-white/40 bg-transparent text-white"
                                : "border-white/10 bg-transparent text-neutral-500 cursor-not-allowed"
                            }`}
                            aria-label={playable ? `${isPlaying ? "Pause" : "Play"} ${track.title}` : `Preview unavailable for ${track.title}`}
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white truncate">{track.title}</div>
                            <div className="text-xs text-neutral-400 truncate flex items-center gap-2">
                              {track.artist ?? ""}
                              <span aria-hidden className="text-neutral-600">•</span>
                              <span className="flex items-center gap-1 text-neutral-500">
                                <Headphones className="h-3 w-3" />
                                {playable ? "Preview ready" : "No preview"}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-neutral-400">
                            {track.duration ? (
                              <span className="flex items-center gap-1">
                                <Clock3 className="h-3 w-3" />
                                {track.duration}
                              </span>
                            ) : (
                              <span className="text-neutral-600">—</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
