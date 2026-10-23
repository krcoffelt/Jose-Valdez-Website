type LoaderScreenProps = {
  progress: number;
  fixed?: boolean;
};

export default function LoaderScreen({
  progress,
  fixed = true,
}: LoaderScreenProps) {
  const displayProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      className={`${fixed ? "fixed inset-0" : "absolute inset-0"} loader-screen z-[120] flex items-center justify-center bg-black`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 px-6 text-center text-white">
        <div className="space-y-3">
          <div className="loader-progress text-6xl font-light leading-none tracking-[-0.08em] md:text-8xl">
            <span className="sr-only">{displayProgress}%</span>
            <span aria-hidden className="inline-flex">
              {String(displayProgress).padStart(3, "0").split("").map((digit, index) => (
                <span key={index} className={`inline-block w-[1ch] ${index === 0 && displayProgress < 100 ? "text-transparent" : ""}`}>{digit}</span>
              ))}
              <span className="inline-block w-[1ch]">%</span>
            </span>
          </div>
          <div className="text-[11px] uppercase tracking-[0.48em] text-white/45">Loading</div>
        </div>
        <div className="text-[11px] uppercase tracking-[0.48em] text-white/75">JOSÉ ISAÍ VALDEZ</div>
      </div>
    </div>
  );
}
