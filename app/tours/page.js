
"use client";

import { useState } from 'react';
import { DESTINATIONS_DB } from '@/lib/data';
import { MapPin, Search } from 'lucide-react';
import Link from 'next/link';

export default function ToursPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [savedPlaces, setSavedPlaces] = useState([]);
    const [stateFilter, setStateFilter] = useState('All states');
    const [typeFilter, setTypeFilter] = useState('All styles');
    const [timeFilter, setTimeFilter] = useState('Any time');
    const destinations = DESTINATIONS_DB;
    const states = [...new Set(destinations.map(destination => destination.state))].sort();

    const toggleSavedPlace = (id) => {
        const next = savedPlaces.includes(id) ? savedPlaces.filter(placeId => placeId !== id) : [...savedPlaces, id];
        setSavedPlaces(next);
        window.localStorage.setItem('yatra-bucketlist-places', JSON.stringify(next));
    };

    const filteredDestinations = destinations.filter(dest => {
        const matchesSearch = [dest.name, dest.state, dest.type].some(value => value.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesState = stateFilter === 'All states' || dest.state === stateFilter;
        const matchesType = typeFilter === 'All styles' || dest.type === typeFilter;
        const matchesTime = timeFilter === 'Any time' || (timeFilter === 'Half day' ? dest.time_needed <= 0.5 : dest.time_needed <= 1);
        return matchesSearch && matchesState && matchesType && matchesTime;
    });

    return (
        <main className="container py-5">
                <header className="mx-auto mb-5 text-center" style={{ maxWidth: '42rem' }}>
                    <p className="section-label">Explore with intention</p>
                    <h1 className="display-5 mb-3">Sacred destinations</h1>
                    <p className="text-secondary">
                        Some places are visited. Others stay with you. Find the story that belongs in your journey.
                    </p>

                    <div className="input-group mt-4">
                        <span className="input-group-text bg-white"><Search size={18} /></span>
                        <input
                            type="text"
                            placeholder="Where is your journey calling you?"
                            className="form-control"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="row g-2 mt-2 text-start">
                        <div className="col-12 col-md-4"><label className="small text-secondary" htmlFor="state-filter">State</label><select id="state-filter" className="form-select" value={stateFilter} onChange={(event) => setStateFilter(event.target.value)}><option>All states</option>{states.map(state => <option key={state}>{state}</option>)}</select></div>
                        <div className="col-6 col-md-4"><label className="small text-secondary" htmlFor="style-filter">Travel style</label><select id="style-filter" className="form-select" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option>All styles</option><option value="temple">Sacred</option><option value="sightseeing">Culture & history</option></select></div>
                        <div className="col-6 col-md-4"><label className="small text-secondary" htmlFor="time-filter">Time available</label><select id="time-filter" className="form-select" value={timeFilter} onChange={(event) => setTimeFilter(event.target.value)}><option>Any time</option><option>Half day</option><option>One day</option></select></div>
                    </div>
                </header>

                <div className="row g-4">
                    {filteredDestinations.map((dest) => (
                        <div className="col-12 col-md-6 col-lg-4" key={dest.id}>
                            <article className="card h-100 border-0 shadow-sm">
                                <div className="destination-image">
                                    <div>
                                    <h2 className="h4 mb-2"><Link href={`/destinations/${dest.id}`} className="text-reset text-decoration-none">{dest.name}</Link></h2>
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
                                <div className="d-grid gap-2 mt-auto">
                                <Link href={`/destinations/${dest.id}`} className="btn btn-forest">Read destination story</Link>
                                <button type="button" className="btn btn-outline-forest w-100" onClick={() => toggleSavedPlace(dest.id)}>
                                    {savedPlaces.includes(dest.id) ? 'Remove from bucket list' : 'Add to bucket list'}
                                </button>
                                </div>
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
