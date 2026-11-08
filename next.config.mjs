/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.platform !== "win32" ? { output: "standalone" } : {}),
  images: {
    unoptimized: true
  }
};

export default nextConfig;
