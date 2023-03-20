let repo = 'roundar-chart';
let assetPrefix = `/${repo}/`;
let basePath = `/${repo}`;

if (process.env.NODE_ENV == "development") {
  assetPrefix = '';
  basePath = '';
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  assetPrefix,
  basePath,
  images: {
    unoptimized: true,
  }
};

module.exports = nextConfig;
