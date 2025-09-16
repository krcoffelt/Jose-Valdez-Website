# Asset Locations

Place static files under `public/` so they’re served from the site root.

- `public/images/`: general site images (logos, portraits, press, etc.)
- `public/media/releases/`: cover art for music releases
- `public/media/videos/`: thumbnails for videos

Current seeds expect:
- Cover: `public/media/releases/glasshouse.jpg`
- Video thumb: `public/media/videos/glasshouse.jpg`

You can change file names in the MDX frontmatter if you prefer different paths:
- `content/releases/*.mdx` → `cover: "/media/releases/<file>"`
- `content/videos/*.mdx` → `thumbnail: "/media/videos/<file>"`

Tips
- Use optimized JPG/WEBP for photos; PNG/SVG for logos.
- Typical cover size: 1200×1200 (or larger WEBP with good quality).
- Keep file names lowercase, hyphenated.

A placeholder SVG lives at `public/images/placeholder.svg` for quick testing.
