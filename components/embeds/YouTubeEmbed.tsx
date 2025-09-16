export default function YouTubeEmbed({
  src,
  id,
  params,
  title = "YouTube video player",
  width = 560,
  height = 315,
  className,
  allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
  referrerPolicy = "strict-origin-when-cross-origin",
  responsive = true,
  aspect = 16 / 9,
}: {
  src?: string;
  id?: string; // e.g. 5IsHCZmLGRY
  params?: string; // e.g. controls=0&start=3
  title?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  allow?: string;
  referrerPolicy?: string;
  responsive?: boolean;
  aspect?: number; // width/height, default 16/9
}) {
  const embedSrc = src || (id ? `https://www.youtube.com/embed/${id}${params ? `?${params}` : ""}` : undefined);
  if (!embedSrc) return null;
  if (responsive) {
    return (
      <div
        className={className}
        style={{ position: "relative", aspectRatio: String(aspect), overflow: "hidden" }}
      >
        <iframe
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          src={embedSrc}
          title={title}
          frameBorder={0}
          allow={allow}
          referrerPolicy={referrerPolicy}
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }
  return (
    <iframe
      className={className}
      width={typeof width === "number" ? width : width}
      height={typeof height === "number" ? height : height}
      src={embedSrc}
      title={title}
      frameBorder={0}
      allow={allow}
      referrerPolicy={referrerPolicy}
      allowFullScreen
      loading="lazy"
    />
  );
}
