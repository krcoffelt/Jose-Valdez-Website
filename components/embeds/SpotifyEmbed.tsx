type SpotifyResource = "track" | "album" | "playlist" | "artist" | "episode" | "show";

function parseSpotify(urlOrId: string): { resource: SpotifyResource; id: string } | null {
  try {
    if (!urlOrId.includes("/")) return { resource: "track", id: urlOrId } as const;
    const u = new URL(urlOrId);
    if (!u.hostname.endsWith("open.spotify.com")) return null;
    const parts = u.pathname.replace(/^\/+/, "").split("/");
    const resource = parts[0] as SpotifyResource;
    const id = parts[1]?.split("?")[0];
    if (!resource || !id) return null;
    return { resource, id };
  } catch {
    return null;
  }
}

export default function SpotifyEmbed({
  url,
  resource,
  id,
  theme = "dark",
  height,
  className,
}: {
  url?: string;
  resource?: SpotifyResource;
  id?: string;
  theme?: "dark" | "light";
  height?: number;
  className?: string;
}) {
  let r: SpotifyResource | undefined = resource;
  let i: string | undefined = id;
  if (url) {
    const parsed = parseSpotify(url);
    if (parsed) {
      r = parsed.resource;
      i = parsed.id;
    }
  }
  if (!r || !i) return null;

  const defaultHeights: Record<SpotifyResource, number> = {
    track: 152,
    album: 352,
    playlist: 352,
    artist: 352,
    episode: 232,
    show: 232,
  };
  const h = height ?? defaultHeights[r];
  const src = `https://open.spotify.com/embed/${r}/${i}?utm_source=generator&theme=${theme}`;

  return (
    <iframe
      className={className}
      src={src}
      width="100%"
      height={h}
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}

