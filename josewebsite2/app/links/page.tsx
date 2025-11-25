import type { Metadata } from "next";
import { socialLinks } from "@/data/links/social";
import { Facebook, Instagram, Music2, PlayCircle, Youtube } from "lucide-react";

export const metadata: Metadata = {
  title: "Links | JOSÉ",
  description: "Follow José across socials and streaming platforms.",
};

const iconMap = {
  instagram: Instagram,
  facebook: Facebook,
  apple: Music2,
  spotify: Music2,
  youtube: Youtube,
} as const;

export default function LinksPage() {
  return (
    <div className="relative min-h-[100svh] py-16 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.85), rgba(11,11,12,0.98)), url('/images/links-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(10%) blur(12px)",
        }}
      />
      <div aria-hidden className="absolute inset-0 bg-black/60" />
      <div className="relative mx-auto w-[min(640px,92vw)] space-y-10">
        <header className="rounded-3xl border border-white/10 bg-white/5 shadow-soft px-6 py-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10">
            <PlayCircle className="h-8 w-8 text-white" aria-hidden />
          </div>
          <p className="text-sm uppercase tracking-[0.35em] text-gold">Link Hub</p>
          <h1 className="mt-3 text-4xl font-semibold">Stay connected</h1>
          <p className="mt-4 text-neutral-300">
            Everything José in one place—social drops, playlists, and the latest videos.
          </p>
        </header>

        <div className="space-y-3">
          {socialLinks.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group relative block overflow-hidden rounded-2xl border border-white/5 bg-surface/70 px-5 py-4 shadow-soft transition hover:-translate-y-1 hover:border-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 active:translate-y-0 active:scale-[0.995]"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-70"
                  style={{
                    background: `linear-gradient(120deg, ${link.gradient[0]}, ${link.gradient[1]})`,
                    mixBlendMode: "screen",
                  }}
                />
                <div className="relative flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
                    {link.icon === "apple" || link.icon === "spotify" ? (
                      <Music2 className="h-5 w-5" />
                    ) : Icon ? (
                      <Icon className="h-5 w-5" />
                    ) : (
                      <PlayCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-lg font-medium tracking-tight text-white">{link.label}</div>
                    <p className="text-sm text-neutral-400">{link.description}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-neutral-400">Open</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
