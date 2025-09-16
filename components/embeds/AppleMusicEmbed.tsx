function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.endsWith("music.apple.com") && !u.hostname.endsWith("embed.music.apple.com")) return null;
    u.hostname = "embed.music.apple.com";
    return u.toString();
  } catch {
    return null;
  }
}

export default function AppleMusicEmbed({
  url,
  height = 175,
  className,
}: {
  url: string; // paste a share URL from music.apple.com
  height?: number; // use ~450 for music-video, ~175 for songs/albums
  className?: string;
}) {
  const src = toEmbedUrl(url);
  if (!src) return null;
  return (
    <iframe
      className={className}
      allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
      frameBorder="0"
      height={height}
      style={{ width: "100%", overflow: "hidden", background: "transparent" }}
      sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
      src={src}
      loading="lazy"
    />
  );
}

