export type SpotifyItem = {
  title: string;
  artist?: string;
  url: string; // https://open.spotify.com/track/<id> (or album/playlist)
  resource?: "track" | "album" | "playlist" | "artist" | "episode" | "show";
  note?: string;
};

export const spotifySongs: SpotifyItem[] = [
  {
    title: "Glasshouse",
    artist: "JOSÉ",
    url: "https://open.spotify.com/track/xxxxxxxx",
    resource: "track",
    note: "Replace xxxxxxxx with the real track id.",
  },
];

