const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'localhost' },
      { protocol: 'https', hostname: '*.hf.space' },
      { protocol: 'https', hostname: 'huggingface.co' },
    ],
  },
  async rewrites() {
    // Only apply rewrite if API_URL is provided and doesn't already contain the proxy path
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
