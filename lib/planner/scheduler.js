/**
 * lib/planner/scheduler.js
 *
 * Builds a timed schedule for a single itinerary day.
 * Returns an array of Activity objects that map onto ItineraryTimeline.
 *
 * No activities, times, or opening hours here are confirmed official
 * schedules. All times are planning estimates.
 */

import { PACE_CONFIG, VISIT_HOURS } from './constants.js';

/**
 * Format decimal hours → "HH:MM AM/PM"
 */
function formatHour(decimalHours) {
    const totalMinutes = Math.round(decimalHours * 60);
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    const ampm = h < 12 ? 'AM' : 'PM';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}

/**
 * buildDaySchedule({ destination, travelRoute, prevOvernightCity, pace, dayType })
 *
 * destination    — DESTINATIONS_DB entry or null (transit/rest day)
 * travelRoute    — { distanceKm, durationMinutes, label } from routing.js
 * prevOvernightCity — name of where the traveller woke up
 * pace           — 'relaxed' | 'balanced' | 'intensive'
 * dayType        — 'destination' | 'transit' | 'rest' | 'return'
 *
 * Returns Activity[]:
 * { time, activity, type, durationMinutes? }
 */
export function buildDaySchedule({ destination, travelRoute, prevOvernightCity, pace, dayType }) {
    const paceConfig = PACE_CONFIG[pace] ?? PACE_CONFIG.balanced;
    const startHour = paceConfig.startHour; // e.g. 7

    if (dayType === 'rest') {
        return [
            { time: formatHour(8),    activity: 'Breakfast and morning rest',         type: 'meal' },
            { time: formatHour(11),   activity: 'Local sightseeing or leisure walk',  type: 'experience' },
            { time: formatHour(13),   activity: 'Lunch',                              type: 'meal' },
            { time: formatHour(16),   activity: 'Evening leisure / local market',     type: 'experience' },
            { time: formatHour(20),   activity: 'Dinner and overnight rest',          type: 'meal' }
        ];
    }

    if (dayType === 'transit') {
        const travelEndHour = startHour + (travelRoute.durationMinutes / 60);
        return [
            { time: formatHour(startHour),    activity: `Depart for next destination`,        type: 'travel', durationMinutes: travelRoute.durationMinutes },
            { time: formatHour(travelEndHour + 0.5), activity: 'Arrive · Check-in and refresh', type: 'meal' },
            { time: formatHour(20),           activity: 'Dinner and overnight rest',          type: 'meal' }
        ];
    }

    if (dayType === 'return') {
        const travelEndHour = startHour + (travelRoute.durationMinutes / 60);
        return [
            { time: formatHour(startHour),          activity: `Check out and depart for ${prevOvernightCity ?? 'starting city'}`, type: 'travel', durationMinutes: travelRoute.durationMinutes },
            { time: formatHour(travelEndHour),       activity: 'Arrive at starting city',      type: 'experience' },
            { time: formatHour(travelEndHour + 1.5), activity: 'Journey complete',             type: 'experience' }
        ];
    }

    // ── destination day ───────────────────────────────────────────────────────
    if (!destination) {
        return buildDaySchedule({ destination: null, travelRoute, prevOvernightCity, pace, dayType: 'rest' });
    }

    const visitHours = VISIT_HOURS[destination.time_needed] ?? 6;
    const travelDurationHours = travelRoute ? travelRoute.durationMinutes / 60 : 0;

    // Shift departure if long travel
    const departureHour = travelRoute?.distanceKm > 300 ? Math.min(startHour - 1, 6) : startHour;
    const arrivalHour = departureHour + travelDurationHours;
    const refreshEndHour = arrivalHour + (arrivalHour > 0 ? 0.75 : 0); // 45 min check-in
    const visitStartHour = Math.max(refreshEndHour, 9); // not before 09:00
    const visitEndHour = visitStartHour + visitHours;

    const activities = [];

    // Departure (only if there's actual travel)
    if (travelRoute && travelRoute.distanceKm > 0) {
        activities.push({
            time: formatHour(departureHour),
            activity: `Depart from ${prevOvernightCity ?? 'previous stop'} · ${travelRoute.distanceKm} km · ${travelRoute.label}`,
            type: 'travel',
            durationMinutes: travelRoute.durationMinutes
        });
        activities.push({
            time: formatHour(arrivalHour),
            activity: `Arrive at ${destination.name} · Check-in and freshen up`,
            type: 'meal'
        });
    }

    // Morning / all-day visit
    if (visitHours >= 12) {
        // Multi-day destination (e.g. Kedarnath): split into two visits
        activities.push({
            time: formatHour(visitStartHour),
            activity: `Begin pilgrimage to ${destination.name}`,
            type: destination.type === 'temple' ? 'darshan' : 'sightseeing'
        });
        activities.push({
            time: formatHour(visitStartHour + 5),
            activity: `Lunch and mid-day rest`,
            type: 'meal'
        });
        activities.push({
            time: formatHour(visitStartHour + 7),
            activity: `Continue darshan / exploration at ${destination.name}`,
            type: destination.type === 'temple' ? 'darshan' : 'sightseeing'
        });
    } else {
        activities.push({
            time: formatHour(visitStartHour),
            activity: destination.type === 'temple'
                ? `Darshan at ${destination.name}`
                : `Explore ${destination.name}`,
            type: destination.type === 'temple' ? 'darshan' : 'sightseeing'
        });
        if (visitEndHour < 20) {
            activities.push({
                time: formatHour(Math.min(visitEndHour + 0.5, 14)),
                activity: 'Lunch and rest',
                type: 'meal'
            });
        }
    }

    // Buffer / local exploration
    if (paceConfig.bufferHours >= 1.5 && visitEndHour < 18) {
        activities.push({
            time: formatHour(Math.max(visitEndHour + 0.5, 16)),
            activity: 'Local market, prasad, and evening walk',
            type: 'experience'
        });
    }

    activities.push({
        time: formatHour(20),
        activity: `Dinner and overnight in ${destination.name.split('(')[0].trim()}`,
        type: 'meal'
    });

    return activities;
}
