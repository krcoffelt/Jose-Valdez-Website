import Section from "@/components/content/Section";
import ArtistBio from "@/components/about/ArtistBio";
import YouTubeEmbed from "@/components/embeds/YouTubeEmbed";
import VideoLightEmbed from "@/components/video/VideoLightEmbed";
import { featuredHomeVideo, youtubeMusicVideos } from "@/data/embeds/youtube-music-videos";
import ParallaxHero from "@/components/hero/ParallaxHero";
import type { SongItem } from "@/components/works/SongWheel";
import SongWheelDeferred from "@/components/works/SongWheelDeferred";
import { allReleases } from "@contentlayer";
import type { Release } from "@contentlayer";
import { placeholderWorks } from "@/data/works/placeholders";
import NewsletterForm from "@/components/forms/NewsletterForm";

type ReleaseTrack = {
  slug?: string;
  title?: string;
  artist?: string;
  duration?: string;
  audioSrc?: string;
};

type ReleasePlatforms = {
  apple?: string;
  spotify?: string;
};

function toSongItem(release: Release, track: ReleaseTrack, index: number): SongItem {
  const platforms = release.platforms as ReleasePlatforms | undefined;
  return {
    id: `${release.slug}-${track.slug ?? index}`,
    title: track.title ?? release.title,
    artist: track.artist || undefined,
    cover: release.cover || "/images/placeholder.svg",
    date: release.date,
    audioSrc: track.audioSrc ?? undefined,
    release: release.title,
    releaseSlug: release.slug,
    platforms: platforms
      ? {
          apple: platforms.apple,
          spotify: platforms.spotify,
        }
      : null,
  };
}

export default function HomePage() {
  const releases = [...allReleases].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const realItems = releases.flatMap(release => {
    const list = (release.tracks as ReleaseTrack[]) || [];
    return list.map((track, index) => toSongItem(release, track, index));
  });
  const minCount = 10;
  const wheelItems = (realItems.length >= minCount)
    ? realItems
    : [...realItems, ...placeholderWorks].slice(0, Math.max(minCount, realItems.length));
  return (
    <div className="md:snap-container md:h-[100svh] md:overflow-y-scroll">
      {/* Hero */}
      <Section className="py-0 sm:py-0 md:py-0">
        <ParallaxHero
          bgSrc="/images/Facetune_08-04-2026-21-54-18.JPG"
          bgSizes="100vw"
          imagePosition="center 24%"
          strength={140}
          className="items-center justify-center md:min-h-[calc(90svh-3.5rem)]"
        >
          <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-center">
            <div className="mx-auto flex min-h-[48svh] w-full max-w-[1180px] flex-col items-center justify-center gap-4 px-4 text-center md:min-h-[54svh] md:gap-5">
              <div>
                <h1 className="text-[clamp(9rem,34vw,24rem)] font-black uppercase leading-[0.74] tracking-[-0.09em] text-white drop-shadow-[0_10px_36px_rgba(0,0,0,0.6)]">
                  JOSÉ
                </h1>
              </div>
            </div>
            <div className="mx-auto mt-2 flex w-full max-w-[980px] justify-center px-4 text-center pointer-events-none">
              <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.42em] text-neutral-200/80 md:text-xs">
                PSALMS 105
              </p>
              <blockquote className="text-lg leading-relaxed text-neutral-100 md:text-3xl md:leading-[1.35] drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
                &quot;Give thanks to the Lord and proclaim his greatness. Let the whole world know what he has
                done. Sing to him; yes, sing his praises. Tell everyone about his wonderful deeds.&quot;
              </blockquote>
              </div>
            </div>
          </div>
        </ParallaxHero>
      </Section>

      {/* New Releases */}
      <Section className="pt-12 sm:pt-14 md:pt-4">
        <div className="mx-auto w-[min(1320px,96vw)] space-y-6">
          <div className="flex flex-col gap-3 text-left md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl">New Releases</h3>
              <p className="max-w-2xl text-sm text-neutral-400">
                Recent Collaborations and Live Recordings
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {youtubeMusicVideos.map((video) => (
              <article
                key={video.id}
                className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-soft backdrop-blur-sm"
              >
                <VideoLightEmbed
                  id={video.id}
                  title={`${video.title} by ${video.artist}`}
                  className="rounded-none"
                />
                <div className="space-y-2 p-5 text-left md:p-6">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">Video Release</div>
                  <h4 className="text-xl font-semibold text-white md:text-2xl">{video.title}</h4>
                  <p className="text-sm text-neutral-300">{video.artist}</p>
                  {video.note && <p className="text-sm text-neutral-400">{video.note}</p>}
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white transition hover:border-white/25 hover:bg-white/12"
                  >
                    Watch on YouTube
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* About / Bio */}
      <Section className="pb-1 sm:pb-2 md:pb-0">
        <ArtistBio />
      </Section>

      {/* Music Portfolio — Song Wheel */}
      {wheelItems.length > 0 && (
        <Section className="pt-1 sm:pt-2 md:pt-0">
          <SongWheelDeferred items={wheelItems} />
        </Section>
      )}

      {/* Featured Video */}
      <Section>
        <div className="mx-auto w-[min(1100px,92vw)] text-center">
          <h3 className="text-2xl mb-4">House of The Lord - Hillsong Young &amp; Free</h3>
          <div className="max-w-[860px] mx-auto">
            <YouTubeEmbed
              src={featuredHomeVideo.url}
              title="House of The Lord - Hillsong Young & Free"
              className="rounded-2xl"
              responsive
            />
          </div>
        </div>
      </Section>

      {/* Newsletter CTA */}
      <Section>
        <div className="mx-auto w-[min(800px,92vw)] text-center space-y-4">
          <h3 className="text-2xl">Get updates</h3>
          <p className="text-neutral-400">Be first to hear new music.</p>
          <NewsletterForm />
        </div>
      </Section>
    </div>
  );
}
