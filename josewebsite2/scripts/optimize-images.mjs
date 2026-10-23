import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";
import matter from "gray-matter";

const root = process.cwd();
const outputDir = path.join(root, "public/images/optimized");
await mkdir(outputDir, { recursive: true });
const manifest = {};
const previous = JSON.parse(await readFile(path.join(root, "data/image-assets.json"), "utf8").catch(() => "{}"));
let before = 0;
let after = 0;

async function optimize(source, name, maxWidth = 1200) {
  if (source.startsWith("https://") && previous[source] && !process.argv.includes("--refresh")) {
    const cached = previous[source];
    await readFile(path.join(root, "public", cached.src));
    manifest[source] = cached;
    before += cached.sourceBytes;
    after += cached.bytes;
    return cached.src;
  }
  const input = source.startsWith("https://")
    ? Buffer.from(await (async () => {
        const response = await fetch(source, { signal: AbortSignal.timeout(30000) });
        if (!response.ok) throw new Error(`${source}: HTTP ${response.status}`);
        return response.arrayBuffer();
      })())
    : await readFile(path.join(root, "public", source));
  const { data, info } = await sharp(input).rotate().resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality: 86, effort: 6 }).toBuffer({ resolveWithObject: true });
  const hash = createHash("sha256").update(data).digest("hex").slice(0, 12);
  const filename = `${name}-${hash}.webp`;
  await writeFile(path.join(outputDir, filename), data);
  before += input.length;
  after += data.length;
  const result = { src: `/images/optimized/${filename}`, width: info.width, height: info.height, sourceBytes: input.length, bytes: data.length };
  manifest[source] = result;
  return result.src;
}

for (const filename of await readdir(path.join(root, "public/images"))) {
  if (!/\.(jpe?g|png)$/i.test(filename) && filename !== "HOUSE OF THE LORD.svg") continue;
  const name = filename.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
  await optimize(`/images/${filename}`, name, /facetune|links-bg/i.test(filename) ? 1920 : 1600);
}

const releasesDir = path.join(root, "content/releases");
for (const filename of await readdir(releasesDir)) {
  if (!filename.endsWith(".mdx")) continue;
  const fullPath = path.join(releasesDir, filename);
  const parsed = matter(await readFile(fullPath, "utf8"));
  const cover = parsed.data.cover;
  const source = Object.entries(previous).find(([, value]) => value.src === cover)?.[0] ?? cover;
  if (typeof source !== "string") throw new Error(`Missing cover: ${filename}`);
  parsed.data.cover = manifest[source]?.src ?? await optimize(source, parsed.data.slug);
  await writeFile(fullPath, matter.stringify(parsed.content, parsed.data));
}
await writeFile(path.join(root, "data/image-assets.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`Optimized ${Object.keys(manifest).length} images: ${(before / 1024 / 1024).toFixed(2)} MB -> ${(after / 1024 / 1024).toFixed(2)} MB (${Math.round((1 - after / before) * 100)}% smaller).`);
