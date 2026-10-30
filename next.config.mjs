import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    turbopack: {
        root: __dirname,
    },

    // Allow next/image to load Wikimedia Commons thumbnails
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
                pathname: '/**'
            }
        ]
    },

    // Security headers applied to every response
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-XSS-Protection', value: '1; mode=block' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()'
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
