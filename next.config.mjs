import { withContentlayer } from "next-contentlayer";

const nextConfig = {
  images: { domains: [] },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
};

export default withContentlayer(nextConfig);
