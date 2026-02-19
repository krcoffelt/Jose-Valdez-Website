import { withContentlayer } from "next-contentlayer";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rlefyrqefcxiifzggwpi.supabase.co",
      },
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
