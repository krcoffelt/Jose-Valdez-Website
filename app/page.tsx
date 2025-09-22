import Section from "@/components/content/Section";
// import Link from "next/link";
import ArtistBio from "@/components/about/ArtistBio";
import { MotionH1 } from "@/components/ui/Motion";
import YouTubeEmbed from "@/components/embeds/YouTubeEmbed";
import { youtubeMusicVideos } from "@/data/embeds/youtube-music-videos";
import ParallaxHero from "@/components/hero/ParallaxHero";
import UnicornStudioEmbed from "@/components/embeds/UnicornStudioEmbed";

export default function HomePage() {
  const featured = youtubeMusicVideos.find(v => v.url.includes("5IsHCZmLGRY")) || youtubeMusicVideos[0];
  return (
    <div className="snap-container h-[100svh] overflow-y-scroll">
      {/* Hero */}
      <Section>
        <ParallaxHero bgSrc="/images/ChatGPT Image Sep 16, 2025, 01_18_48 PM.png" strength={140}>
          <div className="mx-auto max-w-[1400px] relative">
            <UnicornStudioEmbed projectId="iVXTIfZoqklHj97GYjkR" />
            <p className="absolute left-1/2 -translate-x-1/2 bottom-[12%] md:bottom-[16%] text-neutral-300 text-3xl md:text-4xl leading-tight pointer-events-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
              Psalm 105:1–2
            </p>
          </div>
        </ParallaxHero>
      </Section>

      {/* About / Bio */}
      <Section>
        <ArtistBio />
      </Section>

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

      {/* Newsletter CTA (stub) */}
      <Section>
        <div className="mx-auto w-[min(800px,92vw)] text-center space-y-4">
          <h3 className="text-2xl">Get updates</h3>
          <p className="text-neutral-400">Be first to hear new music.</p>
          <form className="flex gap-2 justify-center">
            <input className="px-3 py-2 rounded-xl bg-surface" placeholder="your@email.com" />
            <button className="px-4 py-2 rounded-xl bg-gold text-black">Subscribe</button>
          </form>
        </div>
      </Section>
    </div>
  );
}
