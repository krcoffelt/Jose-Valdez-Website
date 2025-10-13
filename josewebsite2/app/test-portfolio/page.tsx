"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import AppleMusicEmbed from "@/components/embeds/AppleMusicEmbed";
import { allReleases } from "@contentlayer";
import type { Release } from "@contentlayer";

type Item = {
  title: string;
  cover: string;
  slug: string;
  platforms?: { spotify?: string; apple?: string } | null;
};

const PLAYLIST_URL = "https://music.apple.com/us/playlist/pl.u-PDb4YmDue2bBY7";

type ReleasePlatforms = {
  spotify?: string;
  apple?: string;
};

function toItem(release: Release): Item {
  const platforms = release.platforms as ReleasePlatforms | undefined;
  return {
    title: release.title,
    slug: release.slug,
    cover: release.cover || "/images/placeholder.svg",
    platforms: platforms
      ? {
          spotify: platforms.spotify,
          apple: platforms.apple,
        }
      : null,
  };
}

export default function TestPortfolioPage() {
  const items = allReleases.map(toItem);

  const hasItems = items.length > 0;
  const fallback: Item[] = [
    { title: "Glasshouse (Demo)", slug: "glasshouse", cover: "/images/placeholder.svg", platforms: null },
    { title: "Another Work", slug: "another", cover: "/images/placeholder.svg", platforms: null },
    { title: "Live Cut", slug: "live", cover: "/images/placeholder.svg", platforms: null },
  ];

  const data = hasItems ? items : fallback;

  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Item | null>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = rail.scrollLeft + rail.clientWidth / 2;
        const children = Array.from(rail.children) as HTMLElement[];
        let best = 0;
        let bestDist = Number.POSITIVE_INFINITY;
        children.forEach((child, i) => {
          const center = child.offsetLeft + child.clientWidth / 2;
          const d = Math.abs(center - mid);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      rail.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  function openNotes(item: Item) {
    setSelected(item);
    setOpen(true);
  }

  return (
    <div className="mx-auto w-[min(1200px,94vw)] py-12 space-y-10">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Test Portfolio — Setlist Scroller</h1>
        <p className="text-neutral-400 text-sm">Prototype of the playlist‑driven showcase (no filters).</p>
      </header>

      {/* Horizontal Setlist Scroller */}
      <div className="relative">
        <div
          ref={railRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-2 py-4 scrollbar-thin"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {data.map((it, i) => (
            <button
              key={it.slug + i}
              onClick={() => openNotes(it)}
              className={
                "relative snap-center shrink-0 w-[240px] md:w-[280px] transition-transform duration-300" +
                (i === active ? " scale-100" : " scale-95 opacity-80")
              }
              aria-label={`Open Liner Notes for ${it.title}`}
            >
              <div className="rounded-2xl overflow-hidden shadow-soft border border-white/5 bg-surface">
                <Image
                  src={it.cover}
                  alt={it.title}
                  width={560}
                  height={560}
                  className="w-full h-[280px] object-cover"
                />
                <div className="p-3 text-left">
                  <div className="text-sm text-neutral-400">{String(i + 1).padStart(2, "0")}</div>
                  <div className="text-base font-medium truncate">{it.title}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Liner Notes Dialog */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60" />
          <Dialog.Content className="fixed bottom-0 left-0 right-0 mx-auto w-[min(900px,94vw)] rounded-t-2xl bg-surface border border-white/10 shadow-soft p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-xl font-semibold">{selected?.title}</Dialog.Title>
                <Dialog.Description className="text-neutral-400 text-sm">Quick credits and platform links</Dialog.Description>
              </div>
              <Dialog.Close className="rounded-lg px-3 py-1 bg-neutral-800 text-neutral-300">Close</Dialog.Close>
            </div>
            <div className="flex flex-wrap gap-3">
              {selected?.platforms?.apple && (
                <a className="px-3 py-2 rounded-xl bg-gold text-black" href={selected.platforms.apple} target="_blank">Apple Music</a>
              )}
              {selected?.platforms?.spotify && (
                <a className="px-3 py-2 rounded-xl bg-neutral-800" href={selected.platforms.spotify} target="_blank">Spotify</a>
              )}
              <Link className="px-3 py-2 rounded-xl bg-neutral-800" href={`/release/${selected?.slug}`}>Open Release</Link>
            </div>
            <p className="text-neutral-400 text-sm">This is a demo. Final Liner Notes will include roles (singer/writer/producer), lyric excerpt, and behind‑the‑song notes.</p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Official Apple playlist embed */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Play the full playlist</h2>
          <a className="text-sm underline text-neutral-400" href={PLAYLIST_URL} target="_blank">Open in Apple Music</a>
        </div>
        <AppleMusicEmbed url={PLAYLIST_URL} height={450} />
      </section>
    </div>
  );
}
