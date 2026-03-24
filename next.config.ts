import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  turbopack: {
    resolveAlias: {
      '@/*': './src/*',
    },
  },
}

export default nextConfig
