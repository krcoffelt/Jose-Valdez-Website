"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navLinkClass =
    "h-10 flex items-center px-2 rounded-lg transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40";

  // Close menu on route change or escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (open) {
      root.classList.add("nav-open");
    } else {
      root.classList.remove("nav-open");
    }
    return () => root.classList.remove("nav-open");
  }, [open, mounted]);

  return (
    <header className="sticky top-0 z-50 bg-bg/75 backdrop-blur border-b border-white/5 pt-[env(safe-area-inset-top)]">
      <nav className="mx-auto w-[min(1100px,92vw)] h-14 flex items-center gap-4 px-1">
        <Link href="/" className="font-semibold tracking-tight text-lg">JOSE VALDEZ</Link>
        {/* Desktop nav */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-6 text-sm text-neutral-300">
          <Link className={navLinkClass} href="/music">Music</Link>
          <Link className={navLinkClass} href="/links">Links</Link>
        </div>
        {/* Mobile trigger */}
        <button
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="md:hidden h-9 px-3 rounded-lg border border-white/10 text-sm text-neutral-200 ml-auto"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </nav>

      {/* Mobile overlay menu */}
      {open && mounted && createPortal(
        <div
          id="mobile-menu"
          className="fixed inset-0 z-[60] bg-bg/45"
          role="dialog"
          aria-modal="true"
          style={{ backdropFilter: "blur(16px) saturate(1.4)", WebkitBackdropFilter: "blur(16px) saturate(1.4)" }}
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
              <div className="grid gap-2 text-lg text-white/95">
                <Link
                  className="px-3 py-3 rounded-xl bg-white/20 hover:bg-white/25 active:bg-white/30 border border-white/15 backdrop-blur-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
                  href="/music"
                  onClick={() => setOpen(false)}
                >
                  Music
                </Link>
                <Link
                  className="px-3 py-3 rounded-xl bg-white/20 hover:bg-white/25 active:bg-white/30 border border-white/15 backdrop-blur-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
                  href="/links"
                  onClick={() => setOpen(false)}
                >
                  Links
                </Link>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
