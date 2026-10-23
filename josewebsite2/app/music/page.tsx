import type { Metadata } from "next";
import MusicCatalog from "@/components/music/MusicCatalog";
import { getReleases } from "@/lib/releases";

export const metadata: Metadata = {
  title: "Music | JOSÉ",
  description: "Explore José's music portfolio, live recordings, and collaborations.",
  alternates: { canonical: "/music" },
};

export default function MusicPage() {
  return <MusicCatalog releases={getReleases()} />;
}
