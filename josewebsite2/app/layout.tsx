import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AudioProvider } from "@/components/audio/AudioProvider";

const siteUrl = "https://josevaldez.netlify.app";
const shareImagePath = "/images/hero-bg.webp";
const shareImageUrl = `${siteUrl}${shareImagePath}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "JOSÉ — Official Site",
  description: "Music, videos, and updates.",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico", type: "image/x-icon" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  openGraph: {
    title: "JOSÉ — Official Site",
    description: "Music, videos, and updates.",
    type: "website",
    url: siteUrl,
    images: [
      {
        url: shareImageUrl,
        width: 1536,
        height: 1024,
        alt: "JOSÉ official image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JOSÉ — Official Site",
    description: "Music, videos, and updates.",
    images: [shareImageUrl],
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
