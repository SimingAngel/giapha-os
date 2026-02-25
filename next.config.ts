import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  useLightningcss: false,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
