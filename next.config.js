/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  output: "export",
  basePath: isGithubPages ? "/opencs-map" : "",
  assetPrefix: isGithubPages ? "/opencs-map/" : "",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
