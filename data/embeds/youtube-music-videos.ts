export type YouTubeMusicVideo = {
  title: string;
  url: string; // full https://www.youtube.com/embed/... URL with params
  note?: string;
};

export const youtubeMusicVideos: YouTubeMusicVideo[] = [
  {
    title: "House of the Lord (Live)",
    url: "https://www.youtube.com/embed/5IsHCZmLGRY?si=H0j4gHHLTX3aGW1i&controls=0&start=3",
    note: "YouTube embed version for homepage featured slot.",
  },
];

