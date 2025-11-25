export type SocialLink = {
  id: string;
  label: string;
  href: string;
  description: string;
  icon: "instagram" | "facebook" | "apple" | "spotify" | "youtube";
  gradient: [string, string];
};

export const socialLinks: SocialLink[] = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/joseisaivaldez/",
    description: "Stories, reels, and behind-the-scenes moments.",
    icon: "instagram",
    gradient: ["#F58529", "#DD2A7B"],
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/grapejucepapi",
    description: "Community updates and livestreams.",
    icon: "facebook",
    gradient: ["#0575E6", "#021B79"],
  },
  {
    id: "apple",
    label: "Apple Music Playlist",
    href: "https://music.apple.com/us/playlist/my-playlist/pl.u-PDb4YmDue2bBY7",
    description: "Curated set of the latest worship anthems.",
    icon: "apple",
    gradient: ["#fdfbfb", "#ebedee"],
  },
  {
    id: "spotify",
    label: "Spotify Playlist",
    href: "https://open.spotify.com/playlist/2Nyy0GJPU055Je8FthuGTB?si=nuayxVl9S5ubmMqqjIGUpw",
    description: "Daily rotation of songs fueling the next set.",
    icon: "spotify",
    gradient: ["#1DB954", "#1aa34a"],
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@youngandfree",
    description: "Live videos, acoustic takes, and devotionals.",
    icon: "youtube",
    gradient: ["#FF512F", "#DD2476"],
  },
];

