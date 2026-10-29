
"use client";

import { Card, CardHeader, CardContent, Button } from '@/components/ui';
import { TRIP_TYPES } from '@/lib/data';
import { Camera, Scale } from 'lucide-react';

// Map icon names to components if needed, or modify data.js to store component or name
// For simple demo, we can just use conditional rendering or mapped object
// But since I put "Om" in the data, I need to handle it. 

// Let's create a simple icon mapper
const IconMap = {
    Om: () => <span className="text-4xl">🕉️</span>, // Using emoji for Om as Lucide might not have it, or could use a custom SVG
    Camera: () => <Camera className="w-8 h-8" />,
    Scale: () => <Scale className="w-8 h-8" />
};

export default function TripTypeSelection() {
    return (
        <section className="py-20 bg-background">
            <div className="container">
                <div className="text-center max-w-2xl mx-auto mb-12 animate-slide-up">
                    <h2 className="text-4xl font-playfair text-foreground mb-4">Choose Your Path</h2>
                    <p className="text-muted-foreground text-lg">
                        Every journey is unique. Select the travel style that resonates with your soul.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TRIP_TYPES.map((type, index) => {
                        const IconComponent = IconMap[type.icon] || (() => null);
                        return (
                            <Card
                                key={type.id}
                                className={`animate-slide-up border-t-4`}
                                style={{ animationDelay: `${index * 150}ms`, borderTopColor: type.color }}
                            >
                                <CardHeader className="text-center pt-8">
                                    <div
                                        className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                                        style={{ backgroundColor: `${type.color}20`, color: type.color }}
                                    >
                                        <IconComponent />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                                </CardHeader>
                                <CardContent className="text-center pb-8">
                                    <p className="text-muted-foreground mb-6">{type.description}</p>
                                    <Button
                                        variant="outline"
                                        className="w-full hover:text-white transition-colors"
                                        style={{ '--hover-bg': type.color }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = type.color;
                                            e.currentTarget.style.borderColor = type.color;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.borderColor = 'hsl(var(--input))';
                                        }}
                                    >
                                        Select Journey
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
