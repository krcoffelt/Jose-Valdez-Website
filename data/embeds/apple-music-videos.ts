export type AppleMusicVideo = {
  title: string;
  artist?: string;
  url: string; // https://music.apple.com/.../music-video/.../id<id>
  note?: string;
};

export const appleMusicVideos: AppleMusicVideo[] = [
  {
    title: "Glasshouse (Official Video)",
    artist: "JOSÉ",
    url: "https://music.apple.com/us/music-video/xxxxxxxx",
    note: "Paste the Apple Music video share URL.",
  },
];

