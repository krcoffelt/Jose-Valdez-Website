"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Close menu on route change or escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-bg/75 backdrop-blur border-b border-white/5 pt-[env(safe-area-inset-top)]">
      <nav className="mx-auto w-[min(1100px,92vw)] h-14 flex items-center justify-between px-1">
        <Link href="/" className="font-semibold tracking-tight">JOSÉ</Link>
        {/* Desktop nav */}
        <div className="hidden md:flex gap-4 text-sm text-neutral-300">
          <Link className="h-10 flex items-center" href="/">Home</Link>
          <Link className="h-10 flex items-center" href="/music">Music</Link>
          <Link className="h-10 flex items-center" href="/music-player">Player Demo</Link>
          <Link className="h-10 flex items-center" href="/videos">Videos</Link>
          <Link className="h-10 flex items-center" href="/contact">Contact</Link>
          <Link className="h-10 flex items-center" href="/links">Links</Link>
          <Link className="h-10 flex items-center" href="/test-portfolio">Test Portfolio</Link>
        </div>
        {/* Mobile trigger */}
        <button
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="md:hidden h-9 px-3 rounded-lg border border-white/10 text-sm text-neutral-200"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </nav>

      {/* Mobile overlay menu */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-50 bg-bg/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="mx-auto w-[min(1100px,92vw)] pt-3 pb-[env(safe-area-inset-bottom)]">
            <div className="h-14 flex items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)} className="font-semibold tracking-tight">JOSÉ</Link>
              <button
                aria-label="Close menu"
                className="h-9 px-3 rounded-lg border border-white/10 text-sm text-neutral-200"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="py-4">
              <div className="grid gap-2 text-lg text-neutral-200">
                <Link className="px-2 py-3 rounded-lg bg-white/5 active:bg-white/10" href="/" onClick={() => setOpen(false)}>Home</Link>
                <Link className="px-2 py-3 rounded-lg bg-white/5 active:bg-white/10" href="/music" onClick={() => setOpen(false)}>Music</Link>
                <Link className="px-2 py-3 rounded-lg bg-white/5 active:bg-white/10" href="/music-player" onClick={() => setOpen(false)}>Player Demo</Link>
                <Link className="px-2 py-3 rounded-lg bg-white/5 active:bg-white/10" href="/videos" onClick={() => setOpen(false)}>Videos</Link>
                <Link className="px-2 py-3 rounded-lg bg-white/5 active:bg-white/10" href="/contact" onClick={() => setOpen(false)}>Contact</Link>
                <Link className="px-2 py-3 rounded-lg bg-white/5 active:bg-white/10" href="/links" onClick={() => setOpen(false)}>Links</Link>
                <Link className="px-2 py-3 rounded-lg bg-white/5 active:bg-white/10" href="/test-portfolio" onClick={() => setOpen(false)}>Test Portfolio</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
