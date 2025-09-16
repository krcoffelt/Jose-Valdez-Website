# Embeds Library

This project includes reusable embed components and curated lists so you can drop in Apple Music and Spotify players anywhere.

## Components

- `components/embeds/SpotifyEmbed.tsx`
  - Props: `{ url?: string; resource?: 'track'|'album'|'playlist'|'artist'|'episode'|'show'; id?: string; theme?: 'dark'|'light'; height?: number; className?: string }`
  - Usage: provide a full Spotify URL (preferred) or `resource` + `id`.

- `components/embeds/AppleMusicEmbed.tsx`
  - Props: `{ url: string; height?: number; className?: string }`
  - Usage: paste a full `https://music.apple.com/...` share URL; the component converts it to the embed domain.
  - Heights: ~175 for songs/albums, ~450 for music videos.

## Curated lists (edit freely)

- `data/embeds/spotify.ts` → `spotifySongs: { title, artist?, url, resource? }[]`
- `data/embeds/apple-music-songs.ts` → `appleMusicSongs: { title, artist?, url }[]`
- `data/embeds/apple-music-videos.ts` → `appleMusicVideos: { title, artist?, url }[]`

## Examples

```tsx
import SpotifyEmbed from '@/components/embeds/SpotifyEmbed';
import AppleMusicEmbed from '@/components/embeds/AppleMusicEmbed';
import { spotifySongs } from '@/data/embeds/spotify';
import { appleMusicSongs } from '@/data/embeds/apple-music-songs';
import { appleMusicVideos } from '@/data/embeds/apple-music-videos';

export default function Page() {
  const sp = spotifySongs[0];
  const amSong = appleMusicSongs[0];
  const amVideo = appleMusicVideos[0];
  return (
    <div className="space-y-6">
      <SpotifyEmbed url={sp.url} />
      <AppleMusicEmbed url={amSong.url} height={175} />
      <AppleMusicEmbed url={amVideo.url} height={450} />
    </div>
  );
}
```

Notes
- Embeds are iframes; they can be rendered from server components.
- Keep URLs current by copying platform share links.
- For performance, consider wrapping embeds with a click-to-load pattern if you add many on one page.
