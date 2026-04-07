import Section from "@/components/content/Section";
import ArtistBio from "@/components/about/ArtistBio";
import YouTubeEmbed from "@/components/embeds/YouTubeEmbed";
import VideoLightEmbed from "@/components/video/VideoLightEmbed";
import { featuredHomeVideo, youtubeMusicVideos } from "@/data/embeds/youtube-music-videos";
import ParallaxHero from "@/components/hero/ParallaxHero";
import UnicornStudioEmbed from "@/components/embeds/UnicornStudioEmbed";
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
          bgSrc="/images/ChatGPT Image Sep 16, 2025, 01_18_48 PM.png"
          bgSrcOptimized={{
            src: "/images/hero-bg.avif",
            fallbackSrc: "/images/hero-bg.webp",
          }}
          bgSizes="100vw"
          strength={140}
          className="items-center justify-center md:min-h-[calc(80svh-3.5rem)]"
        >
          <div className="mx-auto w-full max-w-[1120px]">
            <UnicornStudioEmbed
              projectId="iVXTIfZoqklHj97GYjkR"
              aspect={21 / 9}
              posterSrc="/images/hero-bg.webp"
            />
            <p className="mt-4 text-neutral-300 text-3xl md:text-4xl leading-tight pointer-events-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
              Psalm 105:1–2
            </p>
          </div>
        </ParallaxHero>
      </Section>

      {/* New Releases */}
      <Section className="pt-12 sm:pt-14 md:pt-4">
        <div className="mx-auto w-[min(1180px,94vw)] space-y-6">
          <div className="flex flex-col gap-3 text-left md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-500">Latest Music</p>
              <h3 className="text-2xl md:text-3xl">New Releases</h3>
              <p className="max-w-2xl text-sm text-neutral-400">
                Recent collaborations and live recordings, ready to preview without leaving the homepage.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
                <div className="space-y-2 p-5 text-left">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">Video Release</div>
                  <h4 className="text-xl font-semibold text-white">{video.title}</h4>
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
      <Section>
        <ArtistBio />
      </Section>

      {/* Music Portfolio — Song Wheel */}
      {wheelItems.length > 0 && (
        <Section>
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
