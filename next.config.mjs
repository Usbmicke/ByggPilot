/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Detta är standardinställningen, men att ha den explicit kan hjälpa
    // i vissa fall. Den talar om för Next.js att bilder kan finnas på samma domän.
    domains: [], 
  },
  output: 'standalone',
  experimental: {
    // This option disables the creation of symbolic links, which can cause
    // issues on Windows, especially in environments like OneDrive.
    serverComponentsExternalPackages: ['@google-cloud/secret-manager', 'googleapis'],
  },
};

export default nextConfig;