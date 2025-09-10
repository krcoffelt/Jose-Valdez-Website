import Section from "@/components/content/Section";
import Link from "next/link";
import Image from "next/image";
import { allReleases } from "@contentlayer";
import { MotionH1 } from "@/components/ui/Motion";

export default function HomePage() {
  const latest = [...allReleases].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  return (
    <div className="snap-container h-[100svh] overflow-y-scroll">
      {/* Hero */}
      <Section>
        <div className="mx-auto w-[min(1100px,92vw)] text-center space-y-6">
          <MotionH1 className="text-5xl md:text-7xl font-semibold tracking-tight">JOSÉ</MotionH1>
          <p className="text-neutral-400">“Psalm 105:1–2”</p>
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
        <div className="mx-auto w-[min(1100px,92vw)]">
          <h3 className="text-2xl mb-4">Featured Video</h3>
          {/* Add <VideoLightEmbed id="..."/> once you pick the video */}
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
