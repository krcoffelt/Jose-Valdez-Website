import { socialLinks } from "@/data/links/social";
import { Apple, Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

function SocialLogo({ icon }: { icon: (typeof socialLinks)[number]["icon"] }) {
  if (icon === "instagram") return <Instagram className="h-5 w-5" strokeWidth={2} />;
  if (icon === "facebook") return <Facebook className="h-5 w-5" strokeWidth={2} />;
  if (icon === "apple") return <Apple className="h-5 w-5" strokeWidth={2} />;
  if (icon === "youtube") return <Youtube className="h-5 w-5" strokeWidth={2} />;

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none" aria-hidden>
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
    <footer className="mt-20 border-t border-white/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] py-12 text-sm text-neutral-400">
      <div className="mx-auto w-[min(1180px,94vw)] space-y-10">
        <div className="space-y-3 text-center">
          <div className="text-[11px] uppercase tracking-[0.42em] text-neutral-500">Stay Connected</div>
          <h2 className="text-2xl font-semibold text-white md:text-3xl">Follow the music beyond the site</h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-neutral-400">
            New songs, live videos, playlists, and updates across every platform where the work keeps moving.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {socialLinks.map((link) => {
            return (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-[26px] border border-white/10 bg-white/5 p-5 text-left transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                <div className="flex items-start gap-4">
                  <span
                    className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
                    style={{ background: `linear-gradient(135deg, ${link.gradient[0]}, ${link.gradient[1]})` }}
                    aria-hidden
                  >
                    <SocialLogo icon={link.icon} />
                  </span>
                  <span className="min-w-0 space-y-2">
                    <span className="block text-base font-medium text-white transition group-hover:text-[#f3d79c]">
                      {link.label}
                    </span>
                    <span className="block text-sm leading-relaxed text-neutral-400">
                      {link.description}
                    </span>
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-center text-neutral-500 md:flex-row md:text-left">
          <div>
            © {new Date().getFullYear()}{" "}
            <Link href="/" className="tracking-tight text-white transition hover:text-[#f3d79c]">
              JOSÉ
            </Link>
          </div>
          <div className="text-xs uppercase tracking-[0.28em] text-neutral-600">
            Website by{" "}
            <a
              href="https://hometown.agency"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-300 transition hover:text-white hover:underline"
            >
              Hometown Marketing Agency
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
