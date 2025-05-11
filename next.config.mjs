import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

const nextConfig = {
  reactStrictMode: true,
  experimental: {},
};

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default nextConfig;
