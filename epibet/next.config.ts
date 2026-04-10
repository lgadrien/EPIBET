import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.in", 
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      }
    ],
  },
};

export default nextConfig;
