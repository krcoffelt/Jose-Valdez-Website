import { withContentlayer } from "next-contentlayer";

const nextConfig = {
  images: { domains: ["rlefyrqefcxiifzggwpi.supabase.co"] },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
};

export default withContentlayer(nextConfig);
