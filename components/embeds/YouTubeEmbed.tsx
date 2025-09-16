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
}) {
  const embedSrc = src || (id ? `https://www.youtube.com/embed/${id}${params ? `?${params}` : ""}` : undefined);
  if (!embedSrc) return null;
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

