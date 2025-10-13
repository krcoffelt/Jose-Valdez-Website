export type AppleMusicVideo = {
  title: string;
  artist?: string;
  url: string; // https://music.apple.com/.../music-video/.../id<id>
  note?: string;
};

export const appleMusicVideos: AppleMusicVideo[] = [
  {
    title: "House of the Lord (Live)",
    artist: "JOSÉ",
    url: "https://music.apple.com/us/music-video/house-of-the-lord-live/1829811253",
    note: "Apple Music video embed for homepage featured slot.",
  },
];
