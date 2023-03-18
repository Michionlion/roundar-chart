
const repo = 'roundar-chart';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  // assetPrefix: `/${repo}/`,
  // basePath: `/${repo}`,
  images: {
    unoptimized: true,
  }
};

module.exports = nextConfig;
