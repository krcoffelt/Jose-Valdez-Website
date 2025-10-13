export default function ArtistBio() {
  return (
    <div className="mx-auto w-[min(1200px,94vw)]">
      <div className="rounded-2xl bg-surface/80 border border-white/10 shadow-soft overflow-hidden">
        <div className="p-6 md:p-10">
          <blockquote className="mx-auto max-w-[1000px] text-neutral-200 text-base md:text-xl leading-relaxed">
            <p>
              “Music is the only thing I’ve ever been good at that I could use to shed light. It’s my purpose. I don’t see a line between Christian and secular — I just want to use the gifts God gave me and do it to the best of my ability. My music is my offering, my worship. If it reaches someone, that’s amazing. If it changes a life, even better. And if people hate it, that’s okay too — it’s not for them. It’s for Him. The message I want to share is simple: you’re never too far away, we can never outrun His grace.”
            </p>
            <footer className="mt-4 text-neutral-400 text-sm md:text-base text-right">— José Valdez</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
