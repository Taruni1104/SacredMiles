"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearStoredUser, getStoredUser } from '@/lib/auth';

export default function SiteNav() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
        setUser(getStoredUser());
    }, []);

    const handleLogout = () => {
        clearStoredUser();
        setUser(null);
        router.push('/');
    };

    return (
        <nav className="navbar navbar-expand-md sticky-top site-nav">
            <div className="container">
                <Link href="/" className="brand-mark">Yatra</Link>
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
                        {user && <><Link href="/tours" className="nav-link">Tours</Link><Link href="/map" className="nav-link">Map</Link><Link href="/planner" className="nav-link">Planner</Link><Link href="/bucketlist" className="nav-link">Bucket List</Link></>}
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
                        {user ? <><span className="small text-secondary">Hi, {user.name}</span><button type="button" className="btn btn-outline-forest" onClick={handleLogout}>Logout</button></> : <><Link href="/login" className="btn btn-link text-decoration-none text-forest p-0">Login</Link><Link href="/register" className="btn btn-forest">Register</Link></>}
                    </div>
                </div>
            </div>
        </nav>
    );
}
