import { withContentlayer } from "next-contentlayer";

const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rlefyrqefcxiifzggwpi.supabase.co",
      },
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.cache = { type: "filesystem" };
    }
    return config;
  },
};

export default withContentlayer(nextConfig);
