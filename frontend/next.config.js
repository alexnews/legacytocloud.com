/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export only for production build
  // Use: npm run build:static for production
  ...(process.env.STATIC_EXPORT === 'true' ? { output: 'export', distDir: 'out' } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003/api'
  }
}

module.exports = nextConfig
