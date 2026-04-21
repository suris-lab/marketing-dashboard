import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@google-analytics/data"],
  },
};

export default nextConfig;
