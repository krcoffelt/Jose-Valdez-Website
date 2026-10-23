import { z } from "zod";

const mediaSource = z.string().min(1).refine((value) => {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}, "Use a local path or HTTPS URL");

export const releaseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  date: z.string().refine((value) => Number.isFinite(Date.parse(value)), "Invalid release date"),
  releaseType: z.enum(["single", "ep", "album"]),
  cover: mediaSource,
  videoSrc: mediaSource.optional(),
  youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/).optional(),
  videoTitle: z.string().optional(),
  videoNote: z.string().optional(),
  homeVideoOrder: z.number().optional(),
  platforms: z.object({ apple: z.string().url().optional(), spotify: z.string().url().optional() }).optional().nullable(),
  tracks: z.array(z.object({
    slug: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    artist: z.string().optional(),
    duration: z.string().optional(),
    audioSrc: mediaSource.optional(),
    src: mediaSource.optional(),
  })).min(1),
});

export function normalizeRelease(input: unknown) {
  const release = releaseSchema.parse(input);
  const identities = new Set<string>();
  const tracks = release.tracks.map((track, index) => {
    const id = `${release.slug}-${track.slug ?? index}`;
    if (identities.has(id)) throw new Error(`Duplicate track identity: ${id}`);
    identities.add(id);
    return {
      ...track,
      id,
      title: track.title ?? release.title,
      artist: track.artist ?? release.title,
      audioSrc: track.audioSrc ?? track.src ?? null,
    };
  });
  return { ...release, platforms: release.platforms ?? null, tracks };
}

export type CatalogRelease = ReturnType<typeof normalizeRelease>;
