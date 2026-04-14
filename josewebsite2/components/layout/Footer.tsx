import { socialLinks } from "@/data/links/social";
import { Apple, Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

function SocialLogo({ icon }: { icon: (typeof socialLinks)[number]["icon"] }) {
  if (icon === "instagram") return <Instagram className="h-4 w-4" strokeWidth={2} />;
  if (icon === "facebook") return <Facebook className="h-4 w-4" strokeWidth={2} />;
  if (icon === "apple") return <Apple className="h-4 w-4" strokeWidth={2} />;
  if (icon === "youtube") return <Youtube className="h-4 w-4" strokeWidth={2} />;

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none" aria-hidden>
      <path
        d="M17.9 10.6c-3.1-1.9-8-2.1-10.9-1.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M16.8 13.7c-2.4-1.4-6-1.7-8.3-1"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M15.8 16.6c-1.8-1.1-4.5-1.2-6.3-.7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))] py-10 text-sm text-neutral-400">
      <div className="mx-auto w-[min(1180px,94vw)] space-y-8">
        <div className="grid gap-8 border-b border-white/5 pb-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-end">
          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-[0.36em] text-neutral-500">Connect</div>
            <div className="max-w-xl space-y-2">
              <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                Follow the music wherever it lives.
              </h2>
              <p className="text-sm leading-relaxed text-neutral-400">
                Music, videos, playlists, and updates across the platforms that carry the work forward.
              </p>
            </div>
          </div>

          <nav aria-label="Social links" className="flex flex-wrap items-center gap-3 md:justify-end">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-neutral-300 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                aria-label={link.label}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
                  style={{ background: `linear-gradient(135deg, ${link.gradient[0]}, ${link.gradient[1]})` }}
                  aria-hidden
                >
                  <SocialLogo icon={link.icon} />
                </span>
                <span className="font-medium tracking-[0.01em]">{link.label}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              © {new Date().getFullYear()}{" "}
              <Link href="/" className="tracking-tight text-white transition hover:text-[#f3d79c]">
                JOSÉ
              </Link>
            </span>
            <span className="hidden text-neutral-700 md:inline">/</span>
            <span className="tracking-[0.18em] uppercase text-neutral-600">Singer, songwriter, collaborator</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 uppercase tracking-[0.22em] text-neutral-600 md:justify-end">
            <span>Website by</span>
            <a
              href="https://hometown.agency"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-300 transition hover:text-white"
            >
              Hometown Marketing Agency
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
