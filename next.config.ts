import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DODO_API_KEY: process.env.DODO_API_KEY,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
  },
};

export default nextConfig;
