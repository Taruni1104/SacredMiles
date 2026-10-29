
"use client";

import { useState } from 'react';
import { DESTINATIONS_DB } from '@/lib/data';
import { MapPin, Search } from 'lucide-react';

export default function ToursPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const destinations = DESTINATIONS_DB;

    const filteredDestinations = destinations.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="container py-5">
                <header className="mx-auto mb-5 text-center" style={{ maxWidth: '42rem' }}>
                    <p className="section-label">Explore with intention</p>
                    <h1 className="display-5 mb-3">Sacred destinations</h1>
                    <p className="text-secondary">
                        Explore the holiest sites of India. Filter by name or interest.
                    </p>

                    <div className="input-group mt-4">
                        <span className="input-group-text bg-white"><Search size={18} /></span>
                        <input
                            type="text"
                            placeholder="Search destinations (e.g., 'Varanasi', 'Jyotirlinga')..."
                            className="form-control"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                <div className="row g-4">
                    {filteredDestinations.map((dest) => (
                        <div className="col-12 col-md-6 col-lg-4" key={dest.id}>
                            <article className="card h-100 border-0 shadow-sm">
                                <div className="destination-image">
                                    <div>
                                    <h2 className="h4 mb-2">{dest.name}</h2>
                                    <div className="small">
                                        <MapPin size={16} className="me-1" />
                                        {dest.state}
                                    </div>
                                </div>
                                </div>
                                <div className="card-body d-flex flex-column">
                                <p className="text-secondary">{dest.description}</p>
                                <span className="badge text-bg-light align-self-start mb-4">
                                        {dest.type.toUpperCase()}
                                    </span>
                                <button type="button" className="btn btn-outline-forest w-100 mt-auto">View details</button>
                                </div>
                            </article>
                        </div>
                    ))}
                </div>

                {filteredDestinations.length === 0 && (
                    <div className="text-center py-5">
                        <p className="text-secondary lead">No destinations found matching your search.</p>
                    </div>
                )}
        </main>
    );
}
