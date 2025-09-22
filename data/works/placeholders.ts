import type { SongItem } from "@/components/works/SongWheel";

export const placeholderWorks: SongItem[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `ph-${i + 1}`,
  title: `Song ${i + 1}`,
  cover: "/images/placeholder.svg",
  platforms: null,
}));

