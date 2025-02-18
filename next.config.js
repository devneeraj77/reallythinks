/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.app.github.dev'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "authjs.dev",
        pathname: "/img/**", // Allow all images under /img/
      },
    ],
  },
};

module.exports = nextConfig;
