import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },

  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins];
    }

    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        "**/node_modules",
        "**/.next",
        "**/C:/Users/HP/Cookies/**",
        "**/Cookies/**",
      ],
    };

    return config;
  },
};

export default nextConfig;
