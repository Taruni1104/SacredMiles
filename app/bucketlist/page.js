"use client";

import { useState } from 'react';
import Link from 'next/link';
import { DESTINATIONS_DB } from '@/lib/data';

const PLACES_KEY = 'yatra-bucketlist-places';
const TRIPS_KEY = 'yatra-bucketlist-trips';

export default function BucketListPage() {
    const [placeIds, setPlaceIds] = useState(() => {
        try {
            return typeof window === 'undefined' ? [] : JSON.parse(window.localStorage.getItem(PLACES_KEY) || '[]');
        } catch (error) {
            console.error('Unable to load bucket list:', error);
            return [];
        }
    });
    const [trips] = useState(() => {
        try {
            return typeof window === 'undefined' ? [] : JSON.parse(window.localStorage.getItem(TRIPS_KEY) || '[]');
        } catch (error) {
            console.error('Unable to load saved trips:', error);
            return [];
        }
    });

    const places = placeIds.map(id => DESTINATIONS_DB.find(destination => destination.id === id)).filter(Boolean);
    const removePlace = (id) => {
        const nextIds = placeIds.filter(placeId => placeId !== id);
        setPlaceIds(nextIds);
        window.localStorage.setItem(PLACES_KEY, JSON.stringify(nextIds));
    };

    return (
        <main className="container py-5">
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-5">
                <div>
                    <p className="section-label">Your saved journeys</p>
                    <h1 className="display-5 mb-2">Bucket List</h1>
                    <p className="text-secondary mb-0">Keep places you want to visit and trips you want to take.</p>
                </div>
                <Link href="/planner" className="btn btn-forest">Plan a trip</Link>
            </div>
            <section className="mb-5">
                <h2 className="h3 mb-3">Places to visit</h2>
                {places.length === 0 ? <p className="text-secondary">No places saved yet. Add places from <Link href="/tours">Tours</Link>.</p> : (
                    <div className="row g-3">
                        {places.map(place => (
                            <div className="col-12 col-md-6 col-lg-4" key={place.id}>
                                <article className="card h-100 border-0 shadow-sm">
                                    <div className="card-body">
                                        <h3 className="h5">{place.name}</h3>
                                        <p className="small text-secondary">{place.state}</p>
                                        <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => removePlace(place.id)}>Remove</button>
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>
                )}
            </section>
            <section>
                <h2 className="h3 mb-3">Saved trips</h2>
                {trips.length === 0 ? <p className="text-secondary">No trips saved yet. Generate an itinerary in the Planner and save it here.</p> : (
                    <div className="row g-3">
                        {trips.map((trip, index) => (
                            <div className="col-12 col-md-6" key={`${trip.createdAt || 'trip'}-${index}`}>
                                <article className="card border-0 shadow-sm">
                                    <div className="card-body">
                                        <h3 className="h5">{trip.title || 'Yatra itinerary'}</h3>
                                        <p className="small text-secondary mb-0">{trip.days?.length || 0} days · Saved {trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : 'recently'}</p>
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
