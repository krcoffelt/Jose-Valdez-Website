export type SocialLink = {
  id: string;
  label: string;
  href: string;
  description: string;
  icon: "instagram" | "facebook" | "apple" | "spotify" | "youtube";
};

export const socialLinks: SocialLink[] = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/joseisaivaldez/",
    description: "@joseisaivaldez",
    icon: "instagram",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/grapejucepapi",
    description: "@grapejucepapi",
    icon: "facebook",
  },
  {
    id: "apple",
    label: "Apple Music Playlist",
    href: "https://music.apple.com/us/playlist/my-playlist/pl.u-PDb4YmDue2bBY7",
    description: "My playlist",
    icon: "apple",
  },
  {
    id: "spotify",
    label: "Spotify Playlist",
    href: "https://open.spotify.com/playlist/2Nyy0GJPU055Je8FthuGTB?si=nuayxVl9S5ubmMqqjIGUpw",
    description: "My playlist",
    icon: "spotify",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@youngandfree",
    description: "Hillsong Young & Free",
    icon: "youtube",
  },
];

