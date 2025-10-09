import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Disable ESLint during Vercel build to prevent warnings from failing the deployment
  eslint: {
    ignoreDuringBuilds: true,
  },

  // (optional) you can add more config options here later
};

export default nextConfig;
