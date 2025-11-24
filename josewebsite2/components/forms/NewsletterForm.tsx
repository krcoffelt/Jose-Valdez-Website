"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const hp = formData.get("website")?.toString() ?? "";

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage", hp }),
      });
      const data = await res.json();
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || "Something went wrong.");
      }
      setStatus("success");
      setMessage("You're on the list. Talk soon!");
      setEmail("");
      form.reset();
      setShowCelebration(true);
    } catch (err) {
      const error = err instanceof Error ? err.message : "Unable to subscribe.";
      setStatus("error");
      setMessage(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="sr-only" htmlFor="newsletter-email">Email address</label>
      <div className="flex flex-col sm:flex-row gap-2 justify-center items-stretch sm:items-center">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          aria-label="Email address"
          className="px-3 py-2 rounded-xl bg-surface w-full sm:w-[340px] text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/30"
          placeholder="your@email.com"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      {/* Honeypot field */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 rounded-xl bg-gold text-black w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Submitting..." : "Subscribe"}
        </button>
      </div>
      {message && (
        <p
          className={`text-sm text-center ${status === "success" ? "text-emerald-300" : "text-rose-300"}`}
          role={status === "error" ? "alert" : undefined}
        >
          {message}
        </p>
      )}
      {showCelebration && status === "success" && (
        <div className="relative h-10">
          <CelebrationBurst onHidden={() => setShowCelebration(false)} />
        </div>
      )}
    </form>
  );
}

function CelebrationBurst({ onHidden }: { onHidden: () => void }) {
  useEffect(() => {
    const timeout = setTimeout(onHidden, 1600);
    return () => clearTimeout(timeout);
  }, [onHidden]);

  return (
    <div
      className="absolute inset-0 mx-auto flex items-center justify-center pointer-events-none"
      aria-hidden
    >
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="celebrate-dot"
          style={{ "--delay": `${i * 60}ms` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

