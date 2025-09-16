import Image from "next/image";
import TracksList, { type TrackItem } from "@/components/music/TracksList";
import { allReleases } from "@contentlayer";

export const metadata = { title: "All Songs" };

export default function SongsPage() {
  // Flatten all releases → tracks, preserving release order (newest → oldest)
  const releases = [...allReleases].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const tracks: TrackItem[] = releases.flatMap((r) => {
    const cover = r.cover || "/images/placeholder.svg";
    const list = (r.tracks as any[]) || [];
    return list.map((t: any, i: number) => ({
      id: `${r.slug}-${t.slug ?? i}`,
      title: t.title ?? r.title,
      artist: "JOSÉ",
      src: t.audioSrc,
      cover,
      duration: t.duration,
      release: r.title,
    }));
  });

  return (
    <div className="mx-auto w-[min(1100px,94vw)] py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">All Songs</h1>
        <p className="text-neutral-400">Click any row to start playback from that song.</p>
      </header>
      <TracksList tracks={tracks} />
      <section className="text-sm text-neutral-400">
        <p>
          Tip: Add audio files by setting <code>audioSrc</code> on each track in your MDX release frontmatter.
          Cover art should be placed under <code>/public/media/releases</code> and referenced from release frontmatter as
          <code>cover: "/media/releases/&lt;file&gt;"</code>.
        </p>
      </section>
    </div>
  );
}

