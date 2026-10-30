"use client";

import { useState } from 'react';
import Link from 'next/link';
import { BOOKING_STATUSES, createBookingChecklist } from '@/lib/bookings';

function readItinerary() {
    try {
        return typeof window === 'undefined' ? [] : JSON.parse(window.localStorage.getItem('yatra-itinerary') || '[]');
    } catch (error) {
        console.error('Unable to load itinerary for bookings:', error);
        return [];
    }
}

function readSavedBookings(checklist) {
    try {
        const saved = typeof window === 'undefined' ? null : JSON.parse(window.localStorage.getItem('yatra-bookings') || 'null');
        if (!Array.isArray(saved)) return checklist;
        // Merge persisted statuses back onto the freshly generated checklist
        // so adding new itinerary days shows up while old choices are preserved.
        const statusMap = Object.fromEntries(saved.map(item => [item.id, item.status]));
        return checklist.map(item => statusMap[item.id] ? { ...item, status: statusMap[item.id] } : item);
    } catch {
        return checklist;
    }
}

export default function BookingsPage() {
    const [itinerary] = useState(readItinerary);
    const [bookings, setBookings] = useState(() => {
        const checklist = createBookingChecklist(readItinerary());
        return readSavedBookings(checklist);
    });

    const updateStatus = (id, status) => {
        const next = bookings.map(item => item.id === id ? { ...item, status } : item);
        setBookings(next);
        window.localStorage.setItem('yatra-bookings', JSON.stringify(next));
    };

    return (
        <main className="container py-5">
            <header className="mb-5"><p className="section-label">Stay organized</p><h1 className="display-5">Booking checklist</h1><p className="text-secondary">Track your own research and confirmations. Opening an external provider does not mark an item booked.</p></header>
            {itinerary.length === 0 ? <div className="alert alert-light border">Generate an itinerary in the <Link href="/planner">Planner</Link> to create booking tasks.</div> : <div className="vstack gap-3">{bookings.map(item => <article className="card border-0 shadow-sm" key={item.id}><div className="card-body d-flex flex-wrap justify-content-between gap-3 align-items-center"><div><span className="badge text-bg-light me-2">{item.type}</span><strong>{item.title}</strong><p className="small text-secondary mb-0 mt-1">{item.note}</p></div><label className="small">Status<select className="form-select form-select-sm mt-1" value={item.status} onChange={(event) => updateStatus(item.id, event.target.value)}>{BOOKING_STATUSES.map(status => <option key={status}>{status}</option>)}</select></label></div></article>)}</div>}
        </main>
    );
}
