/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['down-vn.img.susercontent.com', 'cdn2.fptshop.com.vn'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'down-vn.img.susercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn2.fptshop.com.vn',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
