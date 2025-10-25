/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://phulonghotels.com:8001',
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://phulonghotels.com:8001',
  },
}

module.exports = nextConfig
