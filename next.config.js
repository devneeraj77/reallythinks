/** @type {import('next').NextConfig} */
const nextConfig = {
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
