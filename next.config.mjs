/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        minimumCacheTTL: 86400,
        domains: ['pub-e4f08df325af40158c3446f307ca8267.r2.dev'],
    },
};

// NEXTAUTH_URL should be set in your environment variables (.env.local)
// Example GitHub OAuth setup for NextAuth.js:
// GITHUB_CLIENT_ID=your_github_client_id
// GITHUB_CLIENT_SECRET=your_github_client_secret
// NEXTAUTH_URL=http://localhost:3000

export default nextConfig;
