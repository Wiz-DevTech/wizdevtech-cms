// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This is the crucial change for static export to GitHub Pages
  output: "export",

  // Keep your existing configurations
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
