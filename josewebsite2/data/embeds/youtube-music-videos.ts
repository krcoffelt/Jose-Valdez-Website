export type YouTubeMusicVideo = {
  title: string;
  artist: string;
  id: string;
  note?: string;
};

export const youtubeMusicVideos: YouTubeMusicVideo[] = [
  {
    title: "Out Of The Water (Live)",
    artist: "Woodlands Worship",
    id: "q1LyPapJLCo",
    note: "Official live video.",
  },
  {
    title: "Son Of God",
    artist: "Citipointe Worship",
    id: "NW6O0GrEdUE",
    note: "Official release featuring Dylan Hibbert.",
  },
  {
    title: "hallelujah (Live from Two Palms Studios)",
    artist: "Matt Crocker",
    id: "czj7EDqqw60",
    note: "Official live studio performance.",
  },
];

export const featuredHomeVideo = {
  title: "House of the Lord (Live)",
  url: "https://www.youtube.com/embed/5IsHCZmLGRY?si=H0j4gHHLTX3aGW1i&controls=0&start=3",
  note: "YouTube embed version for homepage featured slot.",
};
