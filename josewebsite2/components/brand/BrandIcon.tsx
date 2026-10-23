import Image from "next/image";
import type { SocialLink } from "@/data/links/social";

const iconFiles: Record<SocialLink["icon"], string> = {
  instagram: "instagram",
  facebook: "facebook",
  apple: "applemusic",
  spotify: "spotify",
  youtube: "youtube",
};

export default function BrandIcon({ icon, size = 24 }: { icon: SocialLink["icon"]; size?: number }) {
  return (
    <Image
      src={`/brands/${iconFiles[icon]}.svg`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className="shrink-0 brightness-0 invert"
    />
  );
}
