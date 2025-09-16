import Section from "@/components/content/Section";
import Link from "next/link";
import Image from "next/image";
import { allReleases } from "@contentlayer";
import { MotionH1 } from "@/components/ui/Motion";
import YouTubeEmbed from "@/components/embeds/YouTubeEmbed";
import { youtubeMusicVideos } from "@/data/embeds/youtube-music-videos";

export default function HomePage() {
  const latest = [...allReleases].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  const featured = youtubeMusicVideos.find(v => v.url.includes("5IsHCZmLGRY")) || youtubeMusicVideos[0];
  return (
    <div className="snap-container h-[100svh] overflow-y-scroll">
      {/* Hero */}
      <Section>
        <div className="relative w-full h-full">
          {/* Background image */}
          <div
            aria-hidden
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/Photo Sep 09 2025, 10 23 58 AM (1).jpg')" }}
          />
          {/* Dark overlay above image */}
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />

          {/* Foreground content */}
          <div className="relative z-20 mx-auto w-[min(1100px,92vw)] text-center space-y-6">
            <MotionH1 className="text-5xl md:text-7xl font-semibold tracking-tight">JOSÉ</MotionH1>
            <p className="text-neutral-300">“Psalm 105:1–2”</p>
          </div>
        </div>
      </Section>

      {/* Latest Release */}
      {latest && (
        <Section>
          <div className="mx-auto w-[min(1100px,92vw)] grid md:grid-cols-[360px,1fr] gap-8 items-center">
            <Image src={latest.cover} alt={latest.title} width={600} height={600} className="rounded-2xl" />
            <div>
              <h2 className="text-3xl mb-2">{latest.title}</h2>
              <div className="flex gap-3 mb-4">
                {latest.platforms?.spotify && (
                  <a className="underline" href={latest.platforms.spotify as string} target="_blank">Spotify</a>
                )}
                {latest.platforms?.apple && (
                  <a className="underline" href={latest.platforms.apple as string} target="_blank">Apple Music</a>
                )}
                <Link href={`/release/${latest.slug}`} className="underline">
                  Play here
                </Link>
              </div>
            </div>
          </div>
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
