"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addDestinationToItinerary, getItineraryBudget } from '@/lib/data';

export default function DestinationActions({ destination, story }) {
    const router = useRouter();

    const addToJourney = () => {
        let currentItinerary = [];
        try {
            currentItinerary = JSON.parse(window.localStorage.getItem('yatra-itinerary') || '[]');
        } catch (error) {
            console.error('Unable to read the current itinerary:', error);
        }

        const nextItinerary = addDestinationToItinerary(currentItinerary, destination.id);
        window.localStorage.setItem('yatra-itinerary', JSON.stringify(nextItinerary));
        window.localStorage.setItem('yatra-itinerary-budget', JSON.stringify(getItineraryBudget(nextItinerary)));
        router.push('/planner');
    };

    return (
        <div className="d-flex flex-wrap gap-2">
            <button type="button" className="btn btn-forest" onClick={addToJourney}>Add to My Journey</button>
            <Link href="/planner" className="btn btn-outline-forest">Plan a Visit</Link>
            <Link href={`/map?destination=${destination.id}`} className="btn btn-outline-forest">View on Map</Link>
            <a href="#visit-cost" className="btn btn-outline-forest">Estimate My Visit Cost</a>
            <Link href="#transport" className="btn btn-outline-forest">Explore Transport</Link>
            <span className="small text-secondary align-self-center">Adding preserves your saved local itinerary.</span>
        </div>
    );
}
