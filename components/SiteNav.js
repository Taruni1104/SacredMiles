"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function SiteNav() {
    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

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
                        <Link href="/tours" className="nav-link">Tours</Link>
                        <Link href="/map" className="nav-link">Map</Link>
                        <Link href="/planner" className="nav-link">Planner</Link>
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
                        <button type="button" className="btn btn-link text-decoration-none text-forest p-0">Login</button>
                        <button type="button" className="btn btn-forest">Book Now</button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
