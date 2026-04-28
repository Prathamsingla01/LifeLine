import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove output: "export" to enable API routes, middleware, and SSR
  // For GitHub Pages static deploy, set GITHUB_PAGES=true and use output: "export"
  ...(process.env.GITHUB_PAGES === "true"
    ? { output: "export", basePath: "/LifeLine" }
    : {}),
  images: {
    unoptimized: true,
  },
  // Enable standalone output for Docker deployment
  ...(process.env.NODE_ENV === "production" && process.env.GITHUB_PAGES !== "true"
    ? { output: "standalone" }
    : {}),
};

export default nextConfig;
