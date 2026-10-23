import { allReleases } from "@contentlayer";
import { normalizeRelease } from "./release-schema";

export function getReleases() {
  const slugs = new Set<string>();
  return allReleases.map((raw) => {
    if (slugs.has(raw.slug)) throw new Error(`Duplicate release slug: ${raw.slug}`);
    slugs.add(raw.slug);
    return normalizeRelease(raw);
  }).sort((a, b) => Date.parse(b.date) - Date.parse(a.date) || a.slug.localeCompare(b.slug));
}

export function toPortfolioItems(releases: ReturnType<typeof getReleases>) {
  return releases.flatMap((release) => release.tracks.map((track) => ({
    id: track.id,
    title: track.title,
    artist: track.artist,
    cover: release.cover,
    date: release.date,
    audioSrc: track.audioSrc ?? undefined,
    release: release.title,
    releaseSlug: release.slug,
    platforms: release.platforms,
  })));
}
