/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['147.139.195.214', 'delivery.oabantuqifu.com'],
}

export default nextConfig
