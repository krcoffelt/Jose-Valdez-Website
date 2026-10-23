import type { HomeVideo } from "@/data/embeds/youtube-music-videos";
import LocalVideoEmbed from "./LocalVideoEmbed";
import VideoLightEmbed from "./VideoLightEmbed";

export default function ReleaseVideoCard({ item }: { item: HomeVideo }) {
  const title = `${item.title} by ${item.artist}`;
  return (
    <article className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-soft backdrop-blur-sm">
      {item.video.type === "youtube"
        ? <VideoLightEmbed id={item.video.id} title={title} className="rounded-none" />
        : <LocalVideoEmbed src={item.video.src} poster={item.video.poster} title={title} />}
      <div className="space-y-2 p-5 text-left md:p-6">
        <div className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">Video Release</div>
        <h4 className="text-xl font-semibold text-white md:text-2xl">{item.title}</h4>
        <p className="text-sm text-neutral-300">{item.artist}</p>
        {item.note && <p className="text-sm text-neutral-400">{item.note}</p>}
        {item.href && <a href={item.href} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full border border-[#C9A362]/70 bg-[#C9A362] px-4 py-2 text-sm text-white transition hover:border-[#d6b277] hover:bg-[#d6b277]">{item.linkLabel}</a>}
      </div>
    </article>
  );
}
