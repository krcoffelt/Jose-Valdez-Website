import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { parseArgs } from "node:util";
import matter from "gray-matter";

const { values } = parseArgs({ options: {
  slug: { type: "string" },
  "dry-run": { type: "boolean", default: false },
} });
if (!values.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)) {
  throw new Error("Usage: npm run media:upload -- --slug release-slug [--dry-run]");
}
const root = process.cwd();
const file = path.join(root, "content/releases", `${values.slug}.mdx`);
const parsed = matter(await readFile(file, "utf8"));
const jobs = [];
async function addJob(source, bucket, contentType, update) {
  if (!source?.startsWith("/")) return;
  const resolved = path.resolve(root, "public", `.${source}`);
  if (!resolved.startsWith(path.join(root, "public") + path.sep)) throw new Error("Invalid asset path");
  const bytes = await readFile(resolved);
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
  const key = `${values.slug}/${hash}${path.extname(source)}`;
  jobs.push({ bucket, key, bytes, contentType, update });
}
await addJob(parsed.data.cover, "Photos", "image/webp", (url) => { parsed.data.cover = url; });
for (const track of parsed.data.tracks ?? []) {
  await addJob(track.audioSrc ?? track.src, "Music", "audio/mpeg", (url) => {
    track.audioSrc = url;
    delete track.src;
  });
}
await addJob(parsed.data.videoSrc, process.env.SUPABASE_VIDEO_BUCKET || "Music", "video/mp4", (url) => { parsed.data.videoSrc = url; });
if (values["dry-run"]) {
  console.log(JSON.stringify(jobs.map(({ bucket, key, bytes, contentType }) => ({ bucket, key, bytes: bytes.length, contentType })), null, 2));
} else if (jobs.length) {
  const base = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!base || !secret) throw new Error("Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY) in .env.local. No files were changed.");
  const origin = new URL(base);
  if (origin.protocol !== "https:") throw new Error("SUPABASE_URL must use HTTPS");
  for (const job of jobs) {
    const objectPath = `${job.bucket}/${job.key}`;
    const response = await fetch(new URL(`/storage/v1/object/${objectPath}`, origin), {
      method: "POST",
      headers: { apikey: secret, Authorization: `Bearer ${secret}`, "Content-Type": job.contentType, "Cache-Control": "31536000", "x-upsert": "false" },
      body: job.bytes,
      signal: AbortSignal.timeout(180000),
    });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      // Content hashes make retrying an already-uploaded object safe.
      if (response.status !== 409 && result.statusCode !== "409" && result.error !== "Duplicate") {
        throw new Error(`Upload failed for ${objectPath}: HTTP ${response.status}. Release metadata was not changed.`);
      }
    }
    job.update(new URL(`/storage/v1/object/public/${objectPath}`, origin).href);
    console.log(`Uploaded ${objectPath}`);
  }
  await writeFile(file, matter.stringify(parsed.content, parsed.data));
  console.log(`Updated ${values.slug}. Local originals were preserved.`);
} else console.log("All release media already uses remote URLs.");
