module.exports = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    output: "standalone",
  },
  serverOptions: {
    hostname: "0.0.0.0",
    port: 3000,
  },
  env: {
    NEXT_PUBLIC_API_URL: "https://brainbytes.onrender.com",
  },
};
