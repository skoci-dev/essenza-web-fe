/** @type {import('next').NextConfig} */
const nextConfig = {
  _apiUrl:  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  basePath: process.env.BASEPATH,
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
    return [
      {
        source: '/media/uploads/:path*',
        destination: `${this._apiUrl}/media/uploads/:path*`,
      },
    ];
  },
}

export default nextConfig
