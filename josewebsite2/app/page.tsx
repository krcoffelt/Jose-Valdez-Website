import Section from "@/components/content/Section";
import ArtistBio from "@/components/about/ArtistBio";
import VideoLightEmbed from "@/components/video/VideoLightEmbed";
import ReleaseVideoCard from "@/components/video/ReleaseVideoCard";
import { featuredHomeVideo, getHomeVideos } from "@/data/embeds/youtube-music-videos";
import ParallaxHero from "@/components/hero/ParallaxHero";
import SongWheelDeferred from "@/components/works/SongWheelDeferred";
import { getReleases, toPortfolioItems } from "@/lib/releases";
import imageAssets from "@/data/image-assets.json";
import { placeholderWorks } from "@/data/works/placeholders";
import NewsletterForm from "@/components/forms/NewsletterForm";

export default function HomePage() {
  const releases = getReleases();
  const realItems = toPortfolioItems(releases);
  const videos = getHomeVideos(releases);
  const wheelItems = realItems.length >= 10 ? realItems : [...realItems, ...placeholderWorks].slice(0, 10);
  return (
    <div>
      {/* Hero */}
      <Section animate={false} className="py-0 sm:py-0 md:py-0">
        <ParallaxHero
          bgSrc={imageAssets["/images/Facetune_08-04-2026-21-54-18.JPG"].src}
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
      <Section className="pt-16 sm:pt-20 md:pt-12">
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
            {videos.map((video) => <ReleaseVideoCard key={video.key} item={video} />)}
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
            <VideoLightEmbed
              id={featuredHomeVideo.id}
              title="House of The Lord - Hillsong Young & Free"
              className="rounded-2xl"
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
