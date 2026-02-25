import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    useLightningcss: false,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
