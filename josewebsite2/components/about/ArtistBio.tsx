export default function ArtistBio() {
  return (
    <div className="mx-auto w-[min(1200px,94vw)]">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface/80 shadow-soft">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 120% at 0% 100%, rgba(201,163,98,0.22) 0%, transparent 55%), radial-gradient(35% 80% at 95% 0%, rgba(201,163,98,0.18) 0%, transparent 60%)",
          }}
        />
        <div className="absolute inset-y-6 left-6 w-px rounded-full bg-gradient-to-b from-gold/60 via-gold/15 to-transparent md:inset-y-10 md:left-10" aria-hidden />
        <article className="relative grid gap-10 p-8 md:grid-cols-[220px,1fr] md:gap-16 md:p-14">
          <header className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Artist Statement
            </span>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white md:text-3xl">Light, purpose, and worship</h2>
              <p className="text-sm leading-relaxed text-neutral-400 md:text-base">
                A look at José’s heart for songwriting and ministry — why every lyric points back to grace.
              </p>
            </div>
          </header>

          <blockquote className="space-y-6 text-lg leading-relaxed text-neutral-100 md:text-[1.35rem]">
            <p>
              “Music is the only thing I’ve ever been good at that I could use to shed light. It’s my purpose. I don’t see a line between Christian and secular — I just want to use the gifts God gave me and do it to the best of my ability. My music is my offering, my worship. If it reaches someone, that’s amazing. If it changes a life, even better. And if people hate it, that’s okay too — it’s not for them. It’s for Him. The message I want to share is simple: you’re never too far away, we can never outrun His grace.”
            </p>
            <footer className="flex items-center justify-end gap-4 text-sm text-neutral-400 md:text-base">
              <span className="hidden h-px w-20 bg-white/20 md:block" aria-hidden />
              <span>— José Valdez</span>
            </footer>
          </blockquote>
        </article>
      </div>
    </div>
  );
}
