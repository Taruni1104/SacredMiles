
"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Leaflet must be loaded dynamically with ssr: false because it uses window object
const MapView = dynamic(() => import('@/components/features/MapView'), {
    loading: () => <div className="w-full bg-muted animate-pulse rounded-xl flex items-center justify-center text-muted-foreground" style={{ height: '600px' }}>Loading Map...</div>,
    ssr: false
});

export default function MapPage() {
    const [itinerary] = useState(() => {
        try {
            const savedItinerary = window.localStorage.getItem('yatra-itinerary');
            return savedItinerary ? JSON.parse(savedItinerary) : [];
        } catch (error) {
            console.error('Unable to load saved itinerary for map:', error);
            return [];
        }
    });

    return (
        <main className="min-h-screen bg-background py-12">
            <div className="container">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="text-4xl font-playfair mb-4">Journey Map</h1>
                    <p className="text-muted-foreground">
                        Visualize your path across the sacred landscape of India.
                    </p>
                </div>

                <div className="bg-card p-4 rounded-2xl shadow-sm border">
                    <MapView itinerary={itinerary} />
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="p-6 bg-secondary/5 rounded-xl">
                        <div className="text-4xl font-bold font-playfair text-secondary mb-2">2,500+</div>
                        <div className="text-sm text-muted-foreground uppercase tracking-wider">Kilometers</div>
                    </div>
                    <div className="p-6 bg-primary/5 rounded-xl">
                        <div className="text-4xl font-bold font-playfair text-primary mb-2">12+</div>
                        <div className="text-sm text-muted-foreground uppercase tracking-wider">Major Temples</div>
                    </div>
                    <div className="p-6 bg-accent/5 rounded-xl">
                        <div className="text-4xl font-bold font-playfair text-accent mb-2">7</div>
                        <div className="text-sm text-muted-foreground uppercase tracking-wider">States</div>
                    </div>
                </div>

            </div>
        </main>
    );
}
