import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AudioProvider } from "@/components/audio/AudioProvider";

export const metadata: Metadata = {
  title: "JOSÉ — Official Site",
  description: "Music, videos, and updates.",
  openGraph: {
    title: "JOSÉ — Official Site",
    description: "Music, videos, and updates.",
    type: "website",
    url: "https://josevaldez.netlify.app",
    images: [
      {
        url: "https://rlefyrqefcxiifzggwpi.supabase.co/storage/v1/object/public/Photos/Screenshot%202025-09-22%20at%2012.04.29%20PM.png",
        width: 1600,
        height: 900,
        alt: "JOSÉ performing live",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JOSÉ — Official Site",
    description: "Music, videos, and updates.",
    images: [
      "https://rlefyrqefcxiifzggwpi.supabase.co/storage/v1/object/public/Photos/Screenshot%202025-09-22%20at%2012.04.29%20PM.png",
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg text-text">
        <AudioProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AudioProvider>
      </body>
    </html>
  );
}
