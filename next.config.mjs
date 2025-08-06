/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        minimumCacheTTL: 86400,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pub-e4f08df325af40158c3446f307ca8267.r2.dev',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
