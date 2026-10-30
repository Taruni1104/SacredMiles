"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DESTINATIONS_DB } from '@/lib/data';

const PLACES_KEY = 'yatra-bucketlist-places';
const TRIPS_KEY = 'yatra-bucketlist-trips';

export default function BucketListPage() {
    const router = useRouter();

    const [placeIds, setPlaceIds] = useState(() => {
        try {
            return typeof window === 'undefined' ? [] : JSON.parse(window.localStorage.getItem(PLACES_KEY) || '[]');
        } catch {
            return [];
        }
    });

    const [trips, setTrips] = useState(() => {
        try {
            return typeof window === 'undefined' ? [] : JSON.parse(window.localStorage.getItem(TRIPS_KEY) || '[]');
        } catch {
            return [];
        }
    });

    const places = placeIds
        .map(id => DESTINATIONS_DB.find(d => d.id === id))
        .filter(Boolean);

    const removePlace = (id) => {
        const next = placeIds.filter(pid => pid !== id);
        setPlaceIds(next);
        window.localStorage.setItem(PLACES_KEY, JSON.stringify(next));
    };

    const removeTrip = (tripId) => {
        const next = trips.filter(t => t.id !== tripId);
        setTrips(next);
        window.localStorage.setItem(TRIPS_KEY, JSON.stringify(next));
    };

    // Load a saved trip back into the planner's active itinerary and navigate
    const viewTrip = (trip) => {
        window.localStorage.setItem('yatra-itinerary', JSON.stringify(trip.days));
        router.push('/planner');
    };

    return (
        <main className="container py-5">
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-5">
                <div>
                    <p className="section-label">Your saved journeys</p>
                    <h1 className="display-5 mb-2">Bucket List</h1>
                    <p className="text-secondary mb-0">Places you want to visit and trips you want to take.</p>
                </div>
                <Link href="/planner" className="btn btn-forest">Plan a new trip</Link>
            </div>

            {/* ── Saved Places ── */}
            <section className="mb-5">
                <h2 className="h3 mb-3">Places to visit <span className="badge text-bg-light fw-normal fs-6">{places.length}</span></h2>
                {places.length === 0 ? (
                    <div className="alert alert-light border">
                        No places saved yet. Browse <Link href="/tours">destinations</Link> and click "Add to bucket list".
                    </div>
                ) : (
                    <div className="row g-3">
                        {places.map(place => (
                            <div className="col-12 col-sm-6 col-lg-4" key={place.id}>
                                <article className="card h-100 border-0 shadow-sm">
                                    <div className="card-body d-flex flex-column">
                                        <h3 className="h5 mb-1">{place.name}</h3>
                                        <p className="small text-secondary mb-1">{place.state}</p>
                                        <p className="small text-secondary flex-grow-1">{place.description}</p>
                                        <div className="d-flex gap-2 mt-3">
                                            <Link href={`/destinations/${place.id}`} className="btn btn-sm btn-outline-forest">View story</Link>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                type="button"
                                                onClick={() => removePlace(place.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ── Saved Trips ── */}
            <section>
                <h2 className="h3 mb-3">Saved trips <span className="badge text-bg-light fw-normal fs-6">{trips.length}</span></h2>
                {trips.length === 0 ? (
                    <div className="alert alert-light border">
                        No trips saved yet. Generate an itinerary in the <Link href="/planner">Planner</Link> and click "Save trip to bucket list".
                    </div>
                ) : (
                    <div className="row g-3">
                        {trips.map((trip, index) => {
                            // Pull the real destination names from the itinerary days
                            const destinations = (trip.days || [])
                                .filter(day => day.destinationId)
                                .map(day => day.location)
                                .filter(Boolean);

                            return (
                                <div className="col-12 col-md-6" key={trip.id || `trip-${index}`}>
                                    <article className="card border-0 shadow-sm h-100">
                                        <div className="card-body d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                                                <h3 className="h5 mb-0">{trip.title || 'Yatra itinerary'}</h3>
                                                <span className="badge text-bg-light text-nowrap">
                                                    {trip.days?.length || 0} days
                                                </span>
                                            </div>
                                            <p className="small text-secondary mb-2">
                                                {trip.region && trip.region !== 'All India' ? `${trip.region} · ` : ''}
                                                Saved {trip.createdAt ? new Date(trip.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'recently'}
                                            </p>
                                            {destinations.length > 0 && (
                                                <p className="small text-secondary flex-grow-1 mb-3">
                                                    {destinations.slice(0, 4).join(' → ')}
                                                    {destinations.length > 4 && ` +${destinations.length - 4} more`}
                                                </p>
                                            )}
                                            <div className="d-flex gap-2 mt-auto">
                                                <button
                                                    className="btn btn-sm btn-forest"
                                                    type="button"
                                                    onClick={() => viewTrip(trip)}
                                                >
                                                    View trip →
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    type="button"
                                                    onClick={() => removeTrip(trip.id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}
