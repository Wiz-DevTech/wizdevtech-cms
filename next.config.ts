// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // --- IMPORTANT CHANGE ---
  // We have REMOVED 'output: "export"'.
  // The @cloudflare/next-on-pages adapter will handle the build process for Cloudflare.
  // No special output configuration is needed here.

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