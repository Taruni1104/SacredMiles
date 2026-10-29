
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardContent, Button } from '@/components/ui';
import { generateItinerary, getItineraryBudget, DESTINATIONS_DB } from '@/lib/data';
import ItineraryTimeline from '@/components/features/ItineraryTimeline'; // We will reuse or update this
import { getTransportProviderLinks } from '@/lib/transport/provider-links';
import { Calendar, MapPin, Sparkles, Settings } from 'lucide-react';

function PlannerContent() {
    const searchParams = useSearchParams();
    const initialType = searchParams.get('type') || 'balanced';

    // State for inputs
    const [days, setDays] = useState(7);
    const [selectedState, setSelectedState] = useState('All India');
    const [tripType, setTripType] = useState(initialType);
    const [isGenerating, setIsGenerating] = useState(false);
    const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));

    // State for output
    const [itinerary, setItinerary] = useState(() => {
        try {
            return typeof window === 'undefined'
                ? []
                : JSON.parse(window.localStorage.getItem('yatra-itinerary') || '[]');
        } catch (error) {
            console.error('Unable to load saved itinerary:', error);
            return [];
        }
    });

    // Get unique states from DB for dropdown
    const states = ['All India', ...new Set(DESTINATIONS_DB.map(d => d.state))];

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate API delay for effect
        setTimeout(() => {
            const result = generateItinerary(days, selectedState, tripType, startDate);
            setItinerary(result);
            window.localStorage.setItem('yatra-itinerary', JSON.stringify(result));
            setIsGenerating(false);
        }, 800);
    };

    const saveTrip = () => {
        const savedTrips = JSON.parse(window.localStorage.getItem('yatra-bucketlist-trips') || '[]');
        const trip = {
            title: `${days}-day ${tripType} Yatra`,
            days: itinerary,
            createdAt: new Date().toISOString()
        };
        window.localStorage.setItem('yatra-bucketlist-trips', JSON.stringify([trip, ...savedTrips]));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar - Controls */}
            <div className="lg:col-span-4 space-y-6">
                <Card className="border-primary/20 shadow-lg sticky top-24">
                    <CardHeader className="bg-primary/5 border-b pb-4">
                        <h2 className="text-xl font-bold font-playfair flex items-center gap-2">
                            <Settings className="w-5 h-5 text-primary" />
                            Plan Your Yatra
                        </h2>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {/* Days Input */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Duration (Days)
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="3"
                                    max="48"
                                    value={days}
                                    onChange={(e) => setDays(parseInt(e.target.value))}
                                    className="w-full accent-primary h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="font-bold text-2xl w-12 text-center text-primary">{days}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Short Trip</span>
                                <span>Grand Pilgrimage</span>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2" htmlFor="start-date">
                                    <Calendar className="w-4 h-4" /> Start date
                                </label>
                                <input id="start-date" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="form-control" />
                                <p className="small text-muted-foreground mb-0">Your itinerary dates and daily schedule will be calculated from this date.</p>
                            </div>
                        </div>

                        {/* State Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Preference Region
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {states.slice(0, 6).map(st => (
                                    <button
                                        key={st}
                                        onClick={() => setSelectedState(st)}
                                        className={`
                                        text-sm px-3 py-2 rounded-lg border transition-all
                                        ${selectedState === st
                                                ? 'bg-primary text-white border-primary shadow-md'
                                                : 'bg-background hover:bg-secondary/10'
                                            }
                                    `}
                                    >
                                        {st === 'Uttar Pradesh' ? 'UP' : st === 'Andhra Pradesh' ? 'AP' : st === 'Tamil Nadu' ? 'TN' : st}
                                    </button>
                                ))}
                            </div>
                            {/* Fallback simple select for full list if needed, keeping it visual for now */}
                        </div>

                        <Button
                            onClick={handleGenerate}
                            className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20"
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <span className="animate-pulse">Consulting the Stars...</span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Generate Itinerary <Sparkles className="w-5 h-5" />
                                </span>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Right Content - Output */}
            <div className="lg:col-span-8">
                {itinerary.length > 0 ? (
                    <div className="animate-slide-up space-y-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-3xl font-bold font-playfair">Your Spiritual Path</h2>
                                <p className="text-muted-foreground">
                                    {days} Days in {selectedState} • {tripType.charAt(0).toUpperCase() + tripType.slice(1)} Focus
                                </p>
                            </div>
                        </div>
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body d-flex flex-wrap gap-4">
                                <div><strong>Estimated distance</strong><div>{itinerary.reduce((total, day) => total + day.travelDistanceKm, 0)} km</div></div>
                                <div><strong>Estimated budget</strong><div>₹{getItineraryBudget(itinerary).total.toLocaleString('en-IN')}</div></div>
                                <div><strong>Travel and stay</strong><div>₹{(getItineraryBudget(itinerary).transport + getItineraryBudget(itinerary).accommodation).toLocaleString('en-IN')}</div></div>
                                <button type="button" className="btn btn-forest ms-auto" onClick={saveTrip}>Save trip to bucket list</button>
                            </div>
                        </div>
                        <div className="alert alert-light border small">Drag a day to reorder your route. Estimates use straight-line distance and local planning assumptions, not live traffic or booking prices.</div>
                        <section className="card border-0 shadow-sm mb-4">
                            <div className="card-body">
                                <h3 className="h5">Transport booking links</h3>
                                <p className="small text-secondary">These links open official or discovery websites. Yatra does not book, verify availability, or mark any service as confirmed.</p>
                                <div className="vstack gap-3">
                                    {itinerary.filter(day => day.destinationId).map((day, index, travelDays) => {
                                        const origin = index === 0 ? 'your starting point' : travelDays[index - 1].location;
                                        const links = getTransportProviderLinks({ origin, destination: day.location, date: day.date });
                                        return (
                                            <div className="border rounded-3 p-3" key={`${day.destinationId}-transport`}>
                                                <div className="d-flex justify-content-between gap-3 flex-wrap">
                                                    <strong>{origin} → {day.location}</strong>
                                                    <span className="badge text-bg-light">Not booked</span>
                                                </div>
                                                <div className="d-flex flex-wrap gap-2 mt-2">
                                                    {links.map(link => (
                                                        <a key={link.id} href={link.href} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-forest" title={link.description}>
                                                            {link.label}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                        <ItineraryTimeline
                            days={itinerary}
                            onReorder={(sourceIndex, targetIndex) => {
                                const reordered = [...itinerary];
                                const [moved] = reordered.splice(sourceIndex, 1);
                                reordered.splice(targetIndex, 0, moved);
                                const normalized = reordered.map((day, index) => ({ ...day, day: index + 1 }));
                                setItinerary(normalized);
                                window.localStorage.setItem('yatra-itinerary', JSON.stringify(normalized));
                            }}
                        />
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center min-h-[400px] text-center p-8 border-2 border-dashed rounded-2xl animate-fade-in">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-4xl">
                            🗺️
                        </div>
                        <h3 className="text-2xl font-bold mb-2 font-playfair">Ready to Plan?</h3>
                        <p className="text-muted-foreground max-w-md">
                            Adjust the settings on the left to generate a custom itinerary tailored to your spiritual needs.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PlannerPage() {
    return (
        <main className="min-h-screen bg-background py-12">
            <div className="container">
                <Suspense fallback={<div>Loading...</div>}>
                    <PlannerContent />
                </Suspense>
            </div>
        </main>
    );
}
