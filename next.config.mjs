/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        '@': path.join(__dirname, 'src'),
      },
    };
    return config;
  },
};

export default nextConfig;
