"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearStoredUser, getStoredUser } from '@/lib/auth';
import { apiRequest, isApiConfigured } from '@/lib/api';

export default function SiteNav() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    // mounted tracks whether we're past first render on the client.
    // Until then we render the logged-out shell so server HTML matches.
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
        setMounted(true);
    }, []);

    // Re-read auth state on every route change so the nav updates
    // immediately after login or logout without a full page reload.
    useEffect(() => {
        if (mounted) setUser(getStoredUser());
    }, [pathname, mounted]);

    const handleLogout = async () => {
        if (isApiConfigured()) {
            try {
                await apiRequest('/api/auth/logout', { method: 'POST' });
            } catch (error) {
                console.error('Unable to end server session:', error);
            }
        }
        clearStoredUser();
        setUser(null);
        router.push('/');
    };

    return (
        <nav className="navbar navbar-expand-md sticky-top site-nav">
            <div className="container">
                <Link href="/" className="brand-mark">SacredMiles</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#siteNavigation"
                    aria-controls="siteNavigation"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="siteNavigation">
                    <div className="navbar-nav mx-auto gap-md-3">
                        <Link href="/" className="nav-link">Home</Link>
                        {mounted && user && <><Link href="/tours" className="nav-link">Explore</Link><Link href="/map" className="nav-link">Map</Link><Link href="/planner" className="nav-link">My Journey</Link><Link href="/budget" className="nav-link">Budget</Link><Link href="/expenses" className="nav-link">Expenses</Link><Link href="/bookings" className="nav-link">Bookings</Link><Link href="/bucketlist" className="nav-link">Saved Places</Link></>}
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
                        {mounted && (user ? <><span className="small text-secondary">Hi, {user.name}</span><button type="button" className="btn btn-outline-forest" onClick={handleLogout}>Logout</button></> : <><Link href="/login" className="btn btn-link text-decoration-none text-forest p-0">Login</Link><Link href="/register" className="btn btn-forest">Register</Link></>)}
                    </div>
                </div>
            </div>
        </nav>
    );
}
