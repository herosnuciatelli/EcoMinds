import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '**',
        search: '',
      },
    ],
  }
};

export default nextConfig;
