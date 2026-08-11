import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 blocks dev assets from non-localhost LAN IPs without this.
  allowedDevOrigins: ["172.24.208.1", "192.168.1.176"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["motion"],
  },
};

export default nextConfig;
