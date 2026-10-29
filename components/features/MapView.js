
"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { DESTINATIONS_DB } from '@/lib/data';

// Fix for Leaflet default icon not loading correctly in Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function MapView({ itinerary = [] }) {
    // Create markers from data - showing all destinations by default for the map page
    const markers = DESTINATIONS_DB.map(dest => {
        if (!dest.lat || !dest.lng) return null;
        return {
            position: [dest.lat, dest.lng],
            title: dest.name,
            description: dest.description
        };
    }).filter(Boolean);

    const pathPositions = itinerary
        .map(day => day.coordinates)
        .filter(Boolean);

    return (
        <MapContainer
            center={[22.5937, 78.9629]} // Center of India
            zoom={5}
            scrollWheelZoom={false}
            className="w-full rounded-xl z-0 shadow-lg border-4 border-white"
            style={{ height: '600px' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {markers.map((marker, idx) => (
                <Marker key={idx} position={marker.position} icon={customIcon}>
                    <Popup>
                        <div className="font-sans">
                            <h3 className="font-bold text-sm mb-1">{marker.title}</h3>
                            <p className="text-xs text-muted-foreground m-0">{marker.description}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            <Polyline
                positions={pathPositions}
                pathOptions={{ color: 'hsl(35, 90%, 50%)', weight: 4, opacity: 0.7, dashArray: '10, 10' }}
            />

        </MapContainer>
    );
}
