const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/shekinah.sv" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};

export default nextConfig;
