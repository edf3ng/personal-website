import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three.js and drei ship untranspiled ESM that Next needs to process.
  transpilePackages: ["three"],
  experimental: {
    optimizePackageImports: ["@react-three/drei"],
  },
};

export default withBundleAnalyzer(nextConfig);
