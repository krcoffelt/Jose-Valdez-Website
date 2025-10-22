import MusicCatalog, { type MusicCatalogRelease } from "@/components/music/MusicCatalog";
import { allReleases } from "@contentlayer";
import type { Release } from "@contentlayer";

type ReleaseTrack = {
  slug?: string;
  title?: string;
  artist?: string;
  duration?: string;
  audioSrc?: string;
  src?: string;
};

function toReleaseData(release: Release): MusicCatalogRelease {
  const platforms = (release.platforms as { apple?: string; spotify?: string } | undefined) ?? null;
  const tracks = ((release.tracks as ReleaseTrack[]) || []).map((track, index) => ({
    id: `${release.slug}-${track.slug ?? index}`,
    title: track.title ?? release.title,
    slug: track.slug ?? undefined,
    artist: track.artist ?? release.title,
    duration: track.duration ?? undefined,
    audioSrc: track.audioSrc ?? track.src ?? null,
  }));
  return {
    title: release.title,
    slug: release.slug,
    date: release.date,
    releaseType: release.releaseType,
    cover: release.cover || "/images/placeholder.svg",
    platforms,
    tracks,
  };
}

export default function MusicPage() {
  const releases = [...allReleases]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .map(toReleaseData);

  return <MusicCatalog releases={releases} />;
}
