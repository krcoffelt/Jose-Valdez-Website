import type { CatalogRelease } from "@/lib/release-schema";

export type YouTubeMusicVideo = {
  title: string;
  artist: string;
  id: string;
  note?: string;
};

export const youtubeMusicVideos: YouTubeMusicVideo[] = [
  {
    title: "Hands Up",
    artist: "Alexander Pappas",
    id: "zvV6ut_fiRY",
    note: "Official release video.",
  },
];

export type HomeVideo = {
  key: string;
  title: string;
  artist: string;
  note?: string;
  video: { type: "youtube"; id: string } | { type: "file"; src: string; poster: string };
  href?: string;
  linkLabel?: string;
};

export function getHomeVideos(releases: CatalogRelease[]): HomeVideo[] {
  const featured = releases.filter((release) => release.videoSrc || release.youtubeId)
    .sort((a, b) => (a.homeVideoOrder ?? 0) - (b.homeVideoOrder ?? 0))
    .map((release): HomeVideo => ({
      key: release.slug,
      title: release.videoTitle ?? release.title,
      artist: release.tracks[0].artist,
      note: release.videoNote,
      video: release.youtubeId
        ? { type: "youtube", id: release.youtubeId }
        : { type: "file", src: release.videoSrc!, poster: release.cover },
      href: release.youtubeId ? `https://www.youtube.com/watch?v=${release.youtubeId}` : release.platforms?.spotify,
      linkLabel: release.youtubeId ? "Watch on YouTube" : "Listen on Spotify",
    }));
  return [...featured, ...youtubeMusicVideos.map((video): HomeVideo => ({
    key: video.id, title: video.title, artist: video.artist, note: video.note,
    video: { type: "youtube", id: video.id },
    href: `https://www.youtube.com/watch?v=${video.id}`, linkLabel: "Watch on YouTube",
  }))];
}

export const featuredHomeVideo = {
  id: "5IsHCZmLGRY",
  title: "House of the Lord (Live)",
  url: "https://www.youtube.com/embed/5IsHCZmLGRY?si=H0j4gHHLTX3aGW1i&controls=0&start=3",
  note: "YouTube embed version for homepage featured slot.",
};
