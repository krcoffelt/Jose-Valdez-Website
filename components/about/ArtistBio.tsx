import Image from "next/image";

export default function ArtistBio() {
  return (
    <div className="mx-auto w-[min(1200px,94vw)]">
      <div className="rounded-2xl bg-surface/80 border border-white/10 shadow-soft overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Portrait */}
          <div className="relative aspect-[4/5] md:h-full">
            <Image
              src="https://rlefyrqefcxiifzggwpi.supabase.co/storage/v1/object/public/Photos/Screenshot%202025-09-22%20at%2012.05.40%20PM.png"
              alt="Jose Valdez"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Copy */}
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <div className="h-1 w-12 bg-gold rounded-full mb-6" />
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">About José</h2>
            <p className="text-neutral-300 text-lg md:text-xl leading-relaxed whitespace-pre-line">
              {`Jose Valdez is an emerging artist blending authentic storytelling with creative collaborations. His music captures personal experiences and emotions, connecting with listeners across Spotify, Apple Music, and beyond.
He has been a part of projects with Hillsong Young & Free and more well known artists.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
