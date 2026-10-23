# Adding releases and media

Release records live in `content/releases/*.mdx`. Both the catalog and the homepage portfolio use the same validated record. Use a unique slug, title, ISO date, release type, cover, and at least one track with an artist and optional audio source. Missing previews stay disabled; invalid URLs and duplicate identities fail validation.

Optional homepage video fields are `videoSrc` for a file or `youtubeId` for YouTube, plus `videoTitle`, `videoNote`, and `homeVideoOrder`. A release with either video field appears in New Releases automatically. Videos without a catalog release are kept in `data/embeds/youtube-music-videos.ts`.

## Images

Run `npm run images:optimize` after adding a photo or release. It converts local photos and release covers to WebP, limits dimensions without changing aspect ratio, generates content-hashed filenames under `public/images/optimized/`, and updates cover paths. `data/image-assets.json` preserves each source URL/path for regeneration.

Original files are retained for recovery and old links. SVG vectors, existing AVIF, favicons, and Apple PNG icons are intentionally retained in their original formats. The large raster embedded in HOUSE OF THE LORD.svg also has a WebP derivative. YouTube thumbnails use Next Image with WebP output and responsive sizes.

Remote originals are reused from the image manifest on repeated runs. Run `npm run images:optimize -- --refresh` to fetch and convert them again.

## Supabase uploads

Configure these **server-only** variables in an untracked `.env.local`:

- `SUPABASE_URL`: the project's HTTPS origin.
- `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SECRET_KEY`: a key allowed to upload storage objects.
- `SUPABASE_VIDEO_BUCKET`: optional existing public video bucket; defaults to Music.

Preview an upload with `npm run media:upload -- --slug youre-not-done-moving --dry-run`. It reads and reports files without needing credentials or changing anything.

Run the same command without `--dry-run` to upload local artwork to Photos and audio/video to Music (or the configured video bucket). The buckets must already allow the corresponding media types and the video file size. The script uses content hashes and long cache lifetimes, preserves local originals, and changes release metadata only after every upload succeeds. A failed upload does not rewrite the release.

After an upload, run `npm run images:optimize` to generate local optimized artwork and `npm test` before publishing.

## Verification

`npm run lint` checks code. `npm test` builds a separate production output under `.next-test` and runs browser and release validation checks, leaving the development server's `.next` directory alone. Install the test browser once with `npx playwright install chromium`.

The upload integration is ready for credentials, but no Supabase uploads are performed merely by adding a release locally.
