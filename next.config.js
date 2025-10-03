/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lottie.host'],
  },
  // Cấu hình cho Heroku deployment
  output: 'standalone',
  // Cấu hình environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Cấu hình redirects nếu cần
  async redirects() {
    return [
      // Redirect từ old CRA routes nếu có
    ]
  },
  // Cấu hình rewrites cho API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
