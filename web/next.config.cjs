/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const backend = (process.env.BACKEND_URL || '').replace(/\/+$/, ''); // bez trailing slash
    if (!backend) {
      // Bez BACKEND_URL nie robimy rewrite — łatwiej zdiagnozować
      return [];
    }
    return [
      { source: '/api/backend/:path*', destination: `${backend}/:path*` },
    ];
  },
};

module.exports = nextConfig;
