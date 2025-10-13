import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AudioProvider } from "@/components/audio/AudioProvider";

export const metadata: Metadata = {
  title: "JOSÉ — Official Site",
  description: "Music, videos, and updates.",
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
