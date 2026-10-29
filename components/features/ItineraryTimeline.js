
"use client";

import { Card, CardContent } from '@/components/ui';
import { Clock, MapPin, Utensils, Plane, Moon, GripVertical } from 'lucide-react';

const ActivityIcon = ({ type }) => {
    switch (type) {
        case 'travel': return <Plane className="w-5 h-5 text-blue-500" />; // Or Train/Bus depending on context
        case 'meal': return <Utensils className="w-5 h-5 text-green-500" />;
        case 'darshan': return <span className="text-xl">🕉️</span>;
        case 'experience': return <Moon className="w-5 h-5 text-purple-500" />;
        case 'sightseeing': return <MapPin className="w-5 h-5 text-red-500" />;
        default: return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
};

export default function ItineraryTimeline({ days, onReorder }) {
    const handleDragStart = (event, index) => {
        event.dataTransfer.setData('text/plain', String(index));
    };

    const handleDrop = (event, targetIndex) => {
        event.preventDefault();
        const sourceIndex = Number(event.dataTransfer.getData('text/plain'));
        if (Number.isInteger(sourceIndex) && sourceIndex !== targetIndex) onReorder(sourceIndex, targetIndex);
    };

    return (
        <div className="relative border-l-2 border-primary/20 ml-4 md:ml-12 space-y-12">
            {days.map((day, index) => (
                <div key={`${day.destinationId || 'rest'}-${index}`} className="relative pl-8 md:pl-12" draggable={Boolean(onReorder)} onDragStart={(event) => handleDragStart(event, index)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, index)}>
                    {/* Timeline Dot */}
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg"></div>

                    <div className="mb-2">
                        <div className="d-flex align-items-center gap-2">
                            {onReorder && <GripVertical size={18} className="text-muted-foreground" aria-label="Drag to reorder day" />}
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">Day {day.day} · {day.date}</span>
                        </div>
                        <h3 className="text-2xl font-bold font-playfair mt-1">{day.location}</h3>
                        <p className="text-muted-foreground italic mb-1">{day.description}</p>
                        {day.travelDistanceKm > 0 && <p className="small text-muted-foreground mb-4">{day.travelDistanceKm} km estimated travel · about {Math.round(day.travelMinutes / 60 * 10) / 10} hours</p>}
                    </div>

                    <div className="space-y-4">
                        {day.activities.map((activity, actIndex) => (
                            <Card key={actIndex} className="hover:shadow-md transition-shadow">
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div className="p-2 bg-muted rounded-full">
                                        <ActivityIcon type={activity.type} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{activity.time}</div>
                                        <div className="text-foreground">{activity.activity}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
