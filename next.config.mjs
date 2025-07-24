/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Detta är standardinställningen, men att ha den explicit kan hjälpa
    // i vissa fall. Den talar om för Next.js att bilder kan finnas på samma domän.
    domains: [], 
  },
};

export default nextConfig;