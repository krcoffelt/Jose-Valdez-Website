import Image from "next/image";

export default function ArtistBio() {
  return (
    <div className="mx-auto w-[min(1100px,92vw)] grid md:grid-cols-[360px,1fr] gap-8 items-center">
      <div className="rounded-2xl overflow-hidden bg-black/40">
        <Image
          src="/images/ChatGPT Image Sep 16, 2025, 01_18_48 PM.png"
          alt="Jose Valdez"
          width={1200}
          height={1200}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h2 className="text-3xl mb-3">About</h2>
        <p className="text-neutral-300 whitespace-pre-line">
          {`Jose Valdez is an emerging artist blending authentic storytelling with creative collaborations. His music captures personal experiences and emotions, connecting with listeners across Spotify, Apple Music, and beyond.
He has been a part of projects with Hillsong Young & Free and more well known artists.`}
        </p>
      </div>
    </div>
  );
}

