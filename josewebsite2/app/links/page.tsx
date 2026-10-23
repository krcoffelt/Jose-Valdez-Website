import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import BrandIcon from "@/components/brand/BrandIcon";
import { socialLinks } from "@/data/links/social";
import imageAssets from "@/data/image-assets.json";

export const metadata: Metadata = {
  title: "Links | JOSÉ",
  description: "Follow José across socials and streaming platforms.",
  alternates: { canonical: "/links" },
};

export default function LinksPage() {
  return (
    <div className="mx-auto w-[min(760px,92vw)] py-16 sm:py-24">
      <header className="mb-12 flex items-center gap-5 sm:mb-16 sm:gap-7">
        <Image
          src={imageAssets["/images/Facetune_08-04-2026-21-54-18.JPG"].src}
          alt="José Isaí Valdez"
          width={88}
          height={88}
          className="h-20 w-20 shrink-0 rounded-full object-cover object-[center_28%] sm:h-[88px] sm:w-[88px]"
        />
        <div>
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">JOSÉ</h1>
          <p className="mt-2 text-sm text-neutral-400 sm:text-base">Socials, playlists & videos.</p>
        </div>
      </header>

      <nav aria-label="Connect with José" className="border-t border-white/15">
        {socialLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-24 items-center gap-5 border-b border-white/15 py-5 text-neutral-200 transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:gap-7"
          >
            <span className="flex w-8 shrink-0 justify-center opacity-80 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              <BrandIcon icon={link.icon} size={28} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-lg font-medium tracking-tight sm:text-xl">{link.label}</span>
              <span className="text-sm text-neutral-400">{link.description}</span>
            </span>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-neutral-500 transition-colors duration-200 group-hover:text-white group-focus-visible:text-white" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
