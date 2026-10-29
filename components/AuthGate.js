"use client";

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getStoredUser } from '@/lib/auth';

const PUBLIC_PATHS = ['/', '/login', '/register'];

export default function AuthGate({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const isPublicPath = PUBLIC_PATHS.includes(pathname);
    const isAuthenticated = Boolean(getStoredUser());

    useEffect(() => {
        if (!isPublicPath && !isAuthenticated) {
            router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        }
    }, [isAuthenticated, isPublicPath, pathname, router]);

    if (!isPublicPath && !isAuthenticated) {
        return (
            <main className="container py-5 text-center">
                <p className="text-secondary">Checking your Yatra account...</p>
            </main>
        );
    }

    return children;
}
