import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-bg/75 backdrop-blur border-b border-white/5">
      <nav className="mx-auto w-[min(1100px,92vw)] h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">JOSÉ</Link>
        <div className="flex gap-4 text-sm text-neutral-300">
          <Link href="/">Home</Link>
          <Link href="/music">Music</Link>
          <Link href="/videos">Videos</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/links">Links</Link>
        </div>
      </nav>
    </header>
  );
}

