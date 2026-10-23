import BrandIcon from "@/components/brand/BrandIcon";
import { socialLinks } from "@/data/links/social";
import Link from "next/link";

const textLinkClass =
  "inline-flex min-h-11 items-center text-sm text-neutral-400 transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 text-neutral-400">
      <div className="mx-auto w-[min(1100px,92vw)]">
        <div className="flex flex-col gap-6 py-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
          <Link
            href="/"
            className="w-fit text-xl font-semibold tracking-tight text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            JOSÉ ISAÍ VALDEZ
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-10">
            <nav aria-label="Footer navigation" className="flex items-center gap-6">
              <Link href="/music" className={textLinkClass}>Music</Link>
              <Link href="/links" className={textLinkClass}>Links</Link>
            </nav>

            <nav aria-label="Social links" className="-ml-2.5 flex w-fit items-center gap-2 sm:ml-0">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.label} (opens in a new tab)`}
                  title={link.label}
                  className="flex h-11 w-11 items-center justify-center opacity-70 transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  <BrandIcon icon={link.icon} />
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs leading-relaxed sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} José Isaí Valdez</span>
          <a
            href="https://hometown.agency"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            Website by Hometown Marketing Agency
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
