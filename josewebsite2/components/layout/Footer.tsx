import { socialLinks } from "@/data/links/social";
import Image from "next/image";
import Link from "next/link";

const socialIconSrc = "/images/social-avatar.webp";

export default function Footer() {
  return (
    <footer className="mt-20 py-10 border-t border-white/5 text-sm text-neutral-400">
      <div className="mx-auto w-[min(1100px,92vw)] flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-center gap-4 text-neutral-300 text-xs uppercase tracking-[0.35em]">
          Follow
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 text-base text-white/90">
          {socialLinks.map((link) => {
            return (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm transition hover:border-white/30 hover:bg-white/10"
              >
                <span className="relative h-4 w-4 overflow-hidden rounded-[2px]">
                  <Image src={socialIconSrc} alt={`${link.label} icon`} fill sizes="16px" className="object-cover" />
                </span>
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>
        <div className="text-center text-neutral-500">
          © {new Date().getFullYear()} <Link href="/" className="tracking-tight text-white hover:underline">JOSÉ</Link>
        </div>
      </div>
    </footer>
  );
}
