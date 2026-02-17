import Section from "@/components/content/Section";
import ArtistBio from "@/components/about/ArtistBio";
import YouTubeEmbed from "@/components/embeds/YouTubeEmbed";
import { youtubeMusicVideos } from "@/data/embeds/youtube-music-videos";
import ParallaxHero from "@/components/hero/ParallaxHero";
import UnicornStudioEmbed from "@/components/embeds/UnicornStudioEmbed";
import SongWheel, { type SongItem } from "@/components/works/SongWheel";
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
  const featured = youtubeMusicVideos.find(v => v.url.includes("5IsHCZmLGRY")) || youtubeMusicVideos[0];
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
          strength={140}
          className="items-center md:items-start"
        >
          <div className="mx-auto w-full max-w-[1120px] relative">
            <UnicornStudioEmbed projectId="iVXTIfZoqklHj97GYjkR" aspect={21 / 9} />
            <p className="md:absolute md:left-1/2 md:-translate-x-1/2 md:bottom-[16%] text-neutral-300 text-3xl md:text-4xl leading-tight pointer-events-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
              Psalm 105:1–2
            </p>
          </div>
        </ParallaxHero>
      </Section>

      {/* New Release Video */}
      <Section>
        <div className="mx-auto w-[min(1100px,92vw)] text-center">
          <h3 className="text-2xl mb-4">New Release</h3>
          <div className="max-w-[860px] mx-auto">
            <YouTubeEmbed
              id="zvV6ut_fiRY"
              title="New Release Video"
              className="rounded-2xl"
              responsive
            />
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
          <SongWheel items={wheelItems} />
        </Section>
      )}

      {/* Featured Video */}
      <Section>
        <div className="mx-auto w-[min(1100px,92vw)] text-center">
          <h3 className="text-2xl mb-4">House of The Lord - Hillsong Young &amp; Free</h3>
          {featured && (
            <div className="max-w-[860px] mx-auto">
              <YouTubeEmbed
                src={featured.url}
                title="House of The Lord - Hillsong Young & Free"
                className="rounded-2xl"
                responsive
              />
            </div>
          )}
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
