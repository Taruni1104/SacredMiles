/**
 * lib/planner/engine.js
 *
 * Deterministic pilgrimage itinerary generation engine.
 *
 * Guarantees:
 *   - Same inputs → same output (pure function, no randomness).
 *   - Each canonical destination appears at most once.
 *   - Impossible travel legs trigger a transit day, not a schedule lie.
 *   - Excluded destinations are reported with reasons.
 *   - Estimates are clearly labelled; no figures are presented as confirmed.
 *
 * Entry point: buildItinerary(inputs) → ItineraryResult
 */

import { DESTINATIONS_DB } from '../data.js';
import { haversineKm, getRouteEstimate } from './routing.js';
import { buildDaySchedule } from './scheduler.js';
import { estimateBudget } from './budget-engine.js';
import {
    PACE_CONFIG,
    VISIT_HOURS,
    NEARBY_RADIUS_KM,
    KNOWN_CITIES,
    MAX_TRAVEL_HOURS_PER_DAY
} from './constants.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
}

/**
 * Resolve a city name or destination ID to { lat, lng, name }.
 * Returns null if not resolvable.
 */
function resolveCity(cityInput) {
    if (!cityInput) return null;
    const q = cityInput.trim().toLowerCase();

    // Try exact destination ID first
    const byId = DESTINATIONS_DB.find(d => d.id === q);
    if (byId) return { lat: byId.lat, lng: byId.lng, name: byId.name };

    // Fuzzy name match against DESTINATIONS_DB
    const byName = DESTINATIONS_DB.find(d => d.name.toLowerCase().includes(q));
    if (byName) return { lat: byName.lat, lng: byName.lng, name: byName.name };

    // Known cities list
    const known = KNOWN_CITIES.find(c => c.name.toLowerCase() === q || c.name.toLowerCase().includes(q));
    if (known) return known;

    return null;
}

/**
 * Filter candidates by state.
 * Returns { inState[], nearby[] }
 *   nearby = destinations in other states within NEARBY_RADIUS_KM of any inState destination.
 */
function filterCandidates({ state, tripType }) {
    let inState = state && state !== 'All India'
        ? DESTINATIONS_DB.filter(d => d.state === state)
        : [...DESTINATIONS_DB];

    // Sort by priority for the trip type
    inState = prioritise(inState, tripType);

    if (state === 'All India') {
        return { inState, nearby: [] };
    }

    // Find nearby destinations in other states
    const nearby = DESTINATIONS_DB
        .filter(d => d.state !== state)
        .filter(d =>
            inState.some(s => haversineKm(s, d) <= NEARBY_RADIUS_KM)
        );

    return { inState, nearby: prioritise(nearby, tripType) };
}

/**
 * Sort destinations by priority for a trip type.
 * Secondary sort: time_needed ascending (shorter first for tight itineraries).
 */
function prioritise(destinations, tripType) {
    return [...destinations].sort((a, b) => {
        // Primary: type preference
        if (tripType === 'pilgrimage') {
            if (a.type === 'temple' && b.type !== 'temple') return -1;
            if (b.type === 'temple' && a.type !== 'temple') return 1;
        } else if (tripType === 'sightseeing') {
            if (a.type === 'sightseeing' && b.type !== 'sightseeing') return -1;
            if (b.type === 'sightseeing' && a.type !== 'sightseeing') return 1;
        }
        // Secondary: shorter time_needed first (more feasible packing)
        return a.time_needed - b.time_needed;
    });
}

/**
 * Nearest-neighbour greedy route from a starting point.
 * Returns an ordered list of destinations.
 */
function greedyRoute(destinations, startCoords) {
    if (destinations.length === 0) return [];
    const remaining = [...destinations];
    const ordered = [];
    let current = startCoords;

    while (remaining.length > 0) {
        let nearest = null;
        let nearestDist = Infinity;
        let nearestIdx = -1;

        for (let i = 0; i < remaining.length; i++) {
            const d = haversineKm(current, remaining[i]);
            if (d < nearestDist) {
                nearestDist = d;
                nearest = remaining[i];
                nearestIdx = i;
            }
        }

        ordered.push(nearest);
        current = { lat: nearest.lat, lng: nearest.lng };
        remaining.splice(nearestIdx, 1);
    }

    return ordered;
}

/**
 * Assign destinations to days, respecting pace and time_needed.
 * Returns { assigned: Destination[], excluded: ExcludedEntry[] }
 *
 * Each destination gets at least time_needed days.
 * Multi-day destinations (time_needed > 1) consume multiple days.
 */
function assignToDays(orderedDestinations, availableDays, pace) {
    const paceConfig = PACE_CONFIG[pace] ?? PACE_CONFIG.balanced;
    const assigned = [];
    const excluded = [];
    let daysUsed = 0;

    for (const dest of orderedDestinations) {
        const daysNeeded = dest.time_needed <= 1 ? 1 : Math.ceil(dest.time_needed);
        if (daysUsed + daysNeeded > availableDays) {
            excluded.push({
                destination: dest,
                reason: `Requires ${daysNeeded} day(s); only ${availableDays - daysUsed} remaining`
            });
        } else {
            // Check if travel from last assigned is feasible within pace
            const lastDest = assigned[assigned.length - 1];
            if (lastDest) {
                const route = getRouteEstimate({ from: lastDest, to: dest, travelMode: 'mixed' });
                const travelHours = route.durationMinutes / 60;
                if (travelHours > MAX_TRAVEL_HOURS_PER_DAY) {
                    // Insert a transit day
                    assigned.push({ _transit: true, from: lastDest, to: dest, route, daysNeeded: 1 });
                    daysUsed++;
                }
            }
            for (let i = 0; i < daysNeeded; i++) {
                assigned.push({ ...dest, _dayIndex: i, _totalDaysNeeded: daysNeeded });
                daysUsed++;
            }
        }
        if (daysUsed >= availableDays) break;
    }

    return { assigned, excluded, daysUsed };
}

// ── Main engine ───────────────────────────────────────────────────────────────

/**
 * buildItinerary(inputs) → ItineraryResult
 *
 * inputs: {
 *   startingCity:        string       — city name or destination ID
 *   state:               string       — 'All India' or a state name
 *   startDate:           string       — YYYY-MM-DD
 *   days:                number
 *   travellers:          number
 *   budgetRange:         { min, max } — INR, informational only
 *   travelMode:          'car' | 'train' | 'bus' | 'mixed'
 *   accommodation:       'budget' | 'standard' | 'premium'
 *   tripType:            'pilgrimage' | 'sightseeing' | 'balanced'
 *   pace:                'relaxed' | 'balanced' | 'intensive'
 *   includeReturn:       boolean
 *   allowNearbyStates:   boolean
 * }
 */
export function buildItinerary(inputs) {
    const {
        startingCity    = '',
        state           = 'All India',
        startDate       = formatDate(new Date()),
        days            = 7,
        travellers      = 1,
        travelMode      = 'mixed',
        accommodation   = 'standard',
        tripType        = 'balanced',
        pace            = 'balanced',
        includeReturn   = false,
        allowNearbyStates = false,
        contingencyRate = 0.10
    } = inputs;

    const dayCount = Math.max(1, parseInt(days) || 7);
    const startCoords = resolveCity(startingCity) ?? { lat: 20.5937, lng: 78.9629, name: 'India' };
    const warnings = [];

    // ── 1. Filter candidates ──────────────────────────────────────────────────
    const { inState, nearby } = filterCandidates({ state, tripType });

    let candidates = [...inState];

    if (state !== 'All India' && inState.length < 2) {
        warnings.push({
            code: 'INSUFFICIENT_DESTINATIONS',
            message: `Only ${inState.length} destination(s) found in ${state}. ${allowNearbyStates ? `Including ${nearby.length} nearby destination(s) from adjacent states.` : 'Enable "allow nearby states" to include more.'}`
        });
        if (allowNearbyStates) candidates = [...inState, ...nearby];
    }

    if (candidates.length === 0) {
        return {
            days: [],
            budget: null,
            meta: { totalDestinations: 0, excludedDestinations: [], warnings: [{ code: 'NO_DESTINATIONS', message: 'No destinations found for the selected criteria.' }] },
            warnings: []
        };
    }

    // ── 2. Route candidates from starting city ────────────────────────────────
    const ordered = greedyRoute(candidates, startCoords);

    // ── 3. Reserve days for return if requested ───────────────────────────────
    const daysForContent = includeReturn ? Math.max(1, dayCount - 1) : dayCount;

    // ── 4. Assign destinations to days ────────────────────────────────────────
    const { assigned, excluded } = assignToDays(ordered, daysForContent, pace);

    if (excluded.length > 0) {
        warnings.push({
            code: 'DESTINATIONS_EXCLUDED',
            message: `${excluded.length} destination(s) could not fit in ${dayCount} days at ${pace} pace.`,
            excluded: excluded.map(e => ({ name: e.destination.name, reason: e.reason }))
        });
    }

    // ── 5. Build day-by-day itinerary ─────────────────────────────────────────
    const start = new Date(`${startDate}T00:00:00`);
    const itineraryDays = [];
    let prevLocation = startCoords;
    let prevLocationName = startingCity || 'your starting point';

    for (let i = 0; i < assigned.length; i++) {
        const item = assigned[i];
        const dayDate = addDays(start, itineraryDays.length);

        if (item._transit) {
            // ── Transit day ───────────────────────────────────────────────────
            const route = item.route;
            itineraryDays.push({
                day: itineraryDays.length + 1,
                date: formatDate(dayDate),
                dayType: 'transit',
                destinationId: null,
                location: `In transit to ${item.to.name}`,
                description: `Travel day: ${prevLocationName} → ${item.to.name}. ${route.label}.`,
                coordinates: [item.to.lat, item.to.lng],
                travelDistanceKm: route.distanceKm,
                travelMinutes: route.durationMinutes,
                routeLabel: route.label,
                overnightCity: item.to.name.split('(')[0].trim(),
                activities: buildDaySchedule({ destination: null, travelRoute: route, prevOvernightCity: prevLocationName, pace, dayType: 'transit' })
            });
            prevLocation = { lat: item.to.lat, lng: item.to.lng };
            prevLocationName = item.to.name;
            continue;
        }

        // ── Destination day ───────────────────────────────────────────────────
        const dest = item;
        const route = getRouteEstimate({ from: prevLocation, to: dest, travelMode });
        const isFirstDayOfDest = dest._dayIndex === 0;
        const isLastDayOfDest  = dest._dayIndex === dest._totalDaysNeeded - 1;

        let dayType = 'destination';
        if (!isFirstDayOfDest) dayType = 'destination-continued';

        itineraryDays.push({
            day: itineraryDays.length + 1,
            date: formatDate(dayDate),
            dayType,
            destinationId: isFirstDayOfDest ? dest.id : null, // only count unique visits
            location: dest.name,
            description: dest.description,
            coordinates: [dest.lat, dest.lng],
            travelDistanceKm: isFirstDayOfDest ? route.distanceKm : 0,
            travelMinutes: isFirstDayOfDest ? route.durationMinutes : 0,
            routeLabel: route.label,
            overnightCity: dest.name.split('(')[0].trim(),
            destinationType: dest.type,
            timeNeeded: dest.time_needed,
            activities: buildDaySchedule({
                destination: dest,
                travelRoute: isFirstDayOfDest ? route : null,
                prevOvernightCity: prevLocationName,
                pace,
                dayType: isFirstDayOfDest ? 'destination' : 'rest'
            })
        });

        if (isLastDayOfDest) {
            prevLocation = { lat: dest.lat, lng: dest.lng };
            prevLocationName = dest.name;
        }
    }

    // ── 6. Fill remaining days with rest days ─────────────────────────────────
    while (itineraryDays.length < daysForContent) {
        const dayDate = addDays(start, itineraryDays.length);
        itineraryDays.push({
            day: itineraryDays.length + 1,
            date: formatDate(dayDate),
            dayType: 'rest',
            destinationId: null,
            location: prevLocationName || 'Rest day',
            description: 'A day for rest, reflection, or local exploration.',
            coordinates: prevLocation ? [prevLocation.lat, prevLocation.lng] : null,
            travelDistanceKm: 0,
            travelMinutes: 0,
            routeLabel: null,
            overnightCity: prevLocationName,
            activities: buildDaySchedule({ destination: null, travelRoute: null, prevOvernightCity: prevLocationName, pace, dayType: 'rest' })
        });
    }

    // ── 7. Return journey (optional) ──────────────────────────────────────────
    if (includeReturn && itineraryDays.length < dayCount) {
        const returnRoute = getRouteEstimate({ from: prevLocation, to: startCoords, travelMode });
        const returnDate = addDays(start, itineraryDays.length);
        itineraryDays.push({
            day: itineraryDays.length + 1,
            date: formatDate(returnDate),
            dayType: 'return',
            destinationId: null,
            location: `Return to ${startingCity || 'starting city'}`,
            description: `Return journey from ${prevLocationName}. ${returnRoute.label}.`,
            coordinates: startCoords ? [startCoords.lat, startCoords.lng] : null,
            travelDistanceKm: returnRoute.distanceKm,
            travelMinutes: returnRoute.durationMinutes,
            routeLabel: returnRoute.label,
            overnightCity: startingCity || 'starting city',
            activities: buildDaySchedule({ destination: null, travelRoute: returnRoute, prevOvernightCity: prevLocationName, pace, dayType: 'return' })
        });
    }

    // Renumber days sequentially
    const finalDays = itineraryDays.map((d, i) => ({ ...d, day: i + 1 }));

    // ── 8. Budget ─────────────────────────────────────────────────────────────
    const budget = estimateBudget({
        itinerary: finalDays,
        inputs: { travellers, travelMode, accommodation, pace, contingencyRate }
    });

    // ── 9. Extension plan (what they could see with more days) ────────────────
    const extensionPlan = excluded.slice(0, 5).map(e => ({
        name: e.destination.name,
        state: e.destination.state,
        reason: e.reason
    }));

    return {
        days: finalDays,
        budget,
        meta: {
            startingCity: startCoords.name,
            state,
            tripType,
            pace,
            travelMode,
            accommodation,
            travellers,
            totalDays: finalDays.length,
            destinationCount: finalDays.filter(d => d.destinationId).length,
            totalDistanceKm: finalDays.reduce((s, d) => s + (d.travelDistanceKm || 0), 0),
            excludedDestinations: excluded.map(e => ({ name: e.destination.name, state: e.destination.state, reason: e.reason })),
            extensionPlan,
            includeReturn,
            disclaimer: 'This itinerary is a planning estimate. Travel distances and times are approximate. Entry fees, accommodation availability, and opening hours should be verified directly before travel.'
        },
        warnings
    };
}

/**
 * Backward-compatible wrapper so existing code using generateItinerary()
 * continues to work without changes.
 */
export function generateItinerary(days, state, type, startDate) {
    const result = buildItinerary({ days, state, tripType: type, startDate, pace: 'balanced', travelMode: 'mixed', accommodation: 'standard', travellers: 1, includeReturn: false, allowNearbyStates: state === 'All India' });
    return result.days;
}
