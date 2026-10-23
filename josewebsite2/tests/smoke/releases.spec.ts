import { expect, test } from "@playwright/test";
import { readdir, readFile, access } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { normalizeRelease } from "../../lib/release-schema";

test("all releases have valid metadata, unique tracks, and existing WebP artwork", async () => {
  const directory = path.join(process.cwd(), "content/releases");
  const slugs = new Set<string>();
  for (const filename of await readdir(directory)) {
    if (!filename.endsWith(".mdx")) continue;
    const release = normalizeRelease(matter(await readFile(path.join(directory, filename), "utf8")).data);
    expect(slugs.has(release.slug), filename).toBe(false);
    slugs.add(release.slug);
    expect(release.cover).toMatch(/^\/images\/optimized\/.*\.webp$/);
    await access(path.join(process.cwd(), "public", release.cover));
    for (const track of release.tracks) {
      if (track.audioSrc?.startsWith("/")) await access(path.join(process.cwd(), "public", track.audioSrc));
    }
    if (release.videoSrc?.startsWith("/")) await access(path.join(process.cwd(), "public", release.videoSrc));
  }
});

test("invalid release metadata is rejected instead of silently disabling playback", () => {
  const release = { title: "Example", slug: "example", date: "2026-10-23", releaseType: "single", cover: "/images/example.webp", tracks: [{ slug: "one", audioSrc: "/media/one.mp3" }] };
  expect(() => normalizeRelease(release)).not.toThrow();
  expect(() => normalizeRelease({ ...release, tracks: [{ audioSrc: "broken.mp3" }] })).toThrow();
  expect(() => normalizeRelease({ ...release, tracks: [release.tracks[0], release.tracks[0]] })).toThrow(/Duplicate/);
});
