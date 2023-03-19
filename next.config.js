/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
};
console.log(process.env.NODE_ENV);
module.exports = nextConfig;
