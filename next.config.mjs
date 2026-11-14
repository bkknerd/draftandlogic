/** @type {import('next').NextConfig} */
// Static export: `next build` writes a plain site to out/, which Netlify serves (same as the old dist/).
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
