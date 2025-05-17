/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        turbo: {
          loaders: {
            '.mp4': ['file-loader']
          }
        }
      }
}

module.exports = nextConfig 