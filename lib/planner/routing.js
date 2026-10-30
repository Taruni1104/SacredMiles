/**
 * lib/planner/routing.js
 *
 * Road distance and travel time estimates.
 *
 * Strategy (two-tier, honest labelling):
 *   Tier 1 — OSRM public demo (router.project-osrm.org)
 *            Used when NEXT_PUBLIC_ROUTING_PROVIDER !== 'none' and the fetch
 *            succeeds. Labelled "Road estimate (OSRM)".
 *   Tier 2 — Haversine × road factor fallback.
 *            Always available. Labelled "Straight-line estimate".
 *
 * Both tiers are used as planning estimates only. Neither constitutes a
 * confirmed transport schedule, price, or route.
 *
 * This module is isomorphic (works in Node and browser).
 */

import { ROAD_FACTOR, AVG_SPEED_KMH } from './constants.js';

const EARTH_RADIUS_KM = 6371;

// ── Haversine (straight-line) ─────────────────────────────────────────────────
export function haversineKm(from, to) {
    const toRad = deg => (deg * Math.PI) / 180;
    const dLat = toRad(to.lat - from.lat);
    const dLng = toRad(to.lng - from.lng);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
    return Math.round(EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// ── Road distance using factor ────────────────────────────────────────────────
export function roadDistanceKm(from, to, travelMode = 'mixed') {
    const factor = ROAD_FACTOR[travelMode] ?? ROAD_FACTOR.mixed;
    return Math.round(haversineKm(from, to) * factor);
}

// ── Travel time (hours) ───────────────────────────────────────────────────────
export function travelHours(distanceKm, travelMode = 'mixed') {
    const speed = AVG_SPEED_KMH[travelMode] ?? AVG_SPEED_KMH.mixed;
    return distanceKm / speed;
}

export function travelMinutes(distanceKm, travelMode = 'mixed') {
    return Math.round(travelHours(distanceKm, travelMode) * 60);
}

/**
 * getRouteData({ from, to, travelMode })
 *
 * Returns a RouteData object:
 * {
 *   distanceKm: number,
 *   durationMinutes: number,
 *   source: 'osrm' | 'estimate',
 *   label: string   ← always shown to user
 * }
 *
 * Tries OSRM first (client-side only), falls back to estimate.
 * On the server (SSR), always returns estimate immediately.
 */
export async function getRouteData({ from, to, travelMode = 'mixed' }) {
    // Server-side or OSRM disabled → immediate estimate
    const useOsrm =
        typeof window !== 'undefined' &&
        process.env.NEXT_PUBLIC_ROUTING_PROVIDER !== 'none';

    if (useOsrm) {
        try {
            const url =
                `https://router.project-osrm.org/route/v1/driving/` +
                `${from.lng},${from.lat};${to.lng},${to.lat}` +
                `?overview=false&alternatives=false`;
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeout);
            if (res.ok) {
                const data = await res.json();
                const route = data.routes?.[0];
                if (route) {
                    const distanceKm = Math.round(route.distance / 1000);
                    const durationMinutes = Math.round(route.duration / 60);
                    return {
                        distanceKm,
                        durationMinutes,
                        source: 'osrm',
                        label: 'Road distance estimate (OSRM)'
                    };
                }
            }
        } catch {
            // OSRM unavailable — fall through to estimate
        }
    }

    // Fallback estimate
    const distanceKm = roadDistanceKm(from, to, travelMode);
    const durationMinutes = travelMinutes(distanceKm, travelMode);
    return {
        distanceKm,
        durationMinutes,
        source: 'estimate',
        label: 'Approximate estimate (road data unavailable)'
    };
}

/**
 * Synchronous estimate — used during initial itinerary generation where
 * async routing isn't practical. Always labelled as estimate.
 */
export function getRouteEstimate({ from, to, travelMode = 'mixed' }) {
    const distanceKm = roadDistanceKm(from, to, travelMode);
    const durationMinutes = travelMinutes(distanceKm, travelMode);
    return {
        distanceKm,
        durationMinutes,
        source: 'estimate',
        label: 'Approximate estimate'
    };
}
