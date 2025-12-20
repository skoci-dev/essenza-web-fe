/** @type {import('next').NextConfig} */

const nextConfig = {
  basePath: process.env.BASEPATH,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'essenza-backend.jajal.dev',
        port: '',
        pathname: '/media/**'
      },
      {
        protocol: 'https',
        hostname: 'essenza-backend.warawiri.web.id',
        port: '',
        pathname: '/**'
      }
    ]
  },

  // if using multiple language
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/id',
        permanent: true,
        locale: false
      }
    ]
  },

  async rewrites() {
    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

    if (!BACKEND_URL.startsWith('http')) {
      console.error('Rewrite failed: NEXT_PUBLIC_API_URL must start with http:// or https://')
    }

    return [
      {
        source: '/media/uploads/:path*',
        destination: `${BACKEND_URL}/media/uploads/:path*`
      }
    ]
  }
}

export default nextConfig
