"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getStoredUser } from '@/lib/auth';

const PUBLIC_PATHS = ['/', '/login', '/register'];

export default function AuthGate({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    // Start as null (unknown) to avoid SSR mismatch.
    // After mount we know the real auth state.
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        setIsAuthenticated(Boolean(getStoredUser()));
    }, [pathname]);

    useEffect(() => {
        if (isAuthenticated === false && !isPublicPath) {
            router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        }
    }, [isAuthenticated, isPublicPath, pathname, router]);

    // Still loading auth state — render nothing to avoid flash
    if (isAuthenticated === null && !isPublicPath) {
        return (
            <main className="container py-5 text-center">
                <p className="text-secondary">Checking your Yatra account…</p>
            </main>
        );
    }

    // Unauthenticated on a protected page — redirect is in flight
    if (isAuthenticated === false && !isPublicPath) {
        return null;
    }

    return children;
}
