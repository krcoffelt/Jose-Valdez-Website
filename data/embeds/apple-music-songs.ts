export type AppleMusicSong = {
  title: string;
  artist?: string;
  url: string; // paste a full https://music.apple.com/.../song/.../id<id> URL
  note?: string;
};

export const appleMusicSongs: AppleMusicSong[] = [
  {
    title: "Glasshouse",
    artist: "JOSÉ",
    url: "https://music.apple.com/album/xxxxxxxx",
    note: "Use the full Apple Music share URL for the song or album.",
  },
];

