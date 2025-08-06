/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        minimumCacheTTL: 86400,
        domains: ['pub-e4f08df325af40158c3446f307ca8267.r2.dev'],
    },
};

export default nextConfig;
