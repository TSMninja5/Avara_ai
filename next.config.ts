import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "randomuser.me" }],
  },
  basePath: "/Avara_ai",
  assetPrefix: "/Avara_ai/",
};

export default nextConfig;
