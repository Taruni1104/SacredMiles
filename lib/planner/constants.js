/**
 * lib/planner/constants.js
 *
 * All tuneable numbers in one place. Nothing here is a confirmed price,
 * fee, or schedule — all values are provisional planning assumptions.
 */

// ── Travel pace ───────────────────────────────────────────────────────────────
export const PACE_CONFIG = {
    relaxed: {
        maxTravelKmPerDay: 200,
        maxDestinationsPerDay: 1,
        bufferHours: 3,          // leisure/rest buffer built into each day
        startHour: 7,            // earliest departure hour
        label: 'Relaxed'
    },
    balanced: {
        maxTravelKmPerDay: 350,
        maxDestinationsPerDay: 2,
        bufferHours: 1.5,
        startHour: 7,
        label: 'Balanced'
    },
    intensive: {
        maxTravelKmPerDay: 500,
        maxDestinationsPerDay: 3,
        bufferHours: 0.5,
        startHour: 6,
        label: 'Intensive'
    }
};

// ── Road distance multipliers (straight-line → approximate road distance) ────
// Source: common India road-distance planning assumption; not route-specific.
export const ROAD_FACTOR = {
    car:   1.30,
    train: 1.20,   // rail distance is generally shorter than road
    bus:   1.35,
    mixed: 1.30
};

// ── Average travel speeds (km/h) ─────────────────────────────────────────────
export const AVG_SPEED_KMH = {
    car:   55,
    train: 70,
    bus:   45,
    mixed: 55
};

// ── Accommodation cost tiers (INR per night per person) ──────────────────────
// Provisional assumption; not a confirmed booking price.
export const ACCOMMODATION_RATE = {
    budget:   800,
    standard: 1800,
    premium:  4500
};

// ── Food per person per day (INR) ─────────────────────────────────────────────
export const FOOD_RATE = {
    relaxed:   600,
    balanced:  900,
    intensive: 750
};

// ── Transport cost per km (INR) ───────────────────────────────────────────────
export const TRANSPORT_RATE_PER_KM = {
    car:   8,    // fuel + tolls estimate
    train: 3,    // second-class rail estimate
    bus:   4,    // state/private bus estimate
    mixed: 5     // blended estimate
};

// ── Base transport (first leg, boarding costs) ────────────────────────────────
export const TRANSPORT_BASE_INR = 600;

// ── Darshan / visit allowance per destination (INR, provisional) ─────────────
export const DARSHAN_ALLOWANCE_INR = 250;

// ── Miscellaneous overhead as fraction of subtotal ───────────────────────────
export const MISC_FRACTION = 0.08;

// ── Default contingency (as decimal, e.g. 0.10 = 10%) ───────────────────────
export const DEFAULT_CONTINGENCY = 0.10;

// ── Maximum daylight travel window (hours) ───────────────────────────────────
export const MAX_TRAVEL_HOURS_PER_DAY = 10;

// ── Destination visit durations (hours) ──────────────────────────────────────
// Supplements time_needed (which is in days) with an hourly model.
// time_needed = 0.5 → VISIT_HOURS.half, time_needed = 1 → VISIT_HOURS.full, etc.
export const VISIT_HOURS = {
    0.5: 3,
    1:   6,
    2:   12   // multi-day destination (e.g. Kedarnath, Vaishno Devi)
};

// ── Nearby radius (km) for cross-state suggestions ───────────────────────────
export const NEARBY_RADIUS_KM = 200;

// ── Indian major cities with approximate coordinates ─────────────────────────
// Used when the user types a starting city not in DESTINATIONS_DB.
export const KNOWN_CITIES = [
    { name: 'Mumbai',          lat: 19.0760, lng: 72.8777 },
    { name: 'Delhi',           lat: 28.6139, lng: 77.2090 },
    { name: 'Bangalore',       lat: 12.9716, lng: 77.5946 },
    { name: 'Chennai',         lat: 13.0827, lng: 80.2707 },
    { name: 'Hyderabad',       lat: 17.3850, lng: 78.4867 },
    { name: 'Kolkata',         lat: 22.5726, lng: 88.3639 },
    { name: 'Pune',            lat: 18.5204, lng: 73.8567 },
    { name: 'Ahmedabad',       lat: 23.0225, lng: 72.5714 },
    { name: 'Visakhapatnam',   lat: 17.6868, lng: 83.2185 },
    { name: 'Jaipur',          lat: 26.9124, lng: 75.7873 },
    { name: 'Lucknow',         lat: 26.8467, lng: 80.9462 },
    { name: 'Bhopal',          lat: 23.2599, lng: 77.4126 },
    { name: 'Kochi',           lat: 9.9312,  lng: 76.2673 },
    { name: 'Bhubaneswar',     lat: 20.2961, lng: 85.8245 },
    { name: 'Guwahati',        lat: 26.1445, lng: 91.7362 },
    { name: 'Amritsar',        lat: 31.6340, lng: 74.8723 },
    { name: 'Varanasi',        lat: 25.3176, lng: 82.9739 },
    { name: 'Nagpur',          lat: 21.1458, lng: 79.0882 },
    { name: 'Coimbatore',      lat: 11.0168, lng: 76.9558 },
    { name: 'Tirupati',        lat: 13.6288, lng: 79.4192 },
    { name: 'Indore',          lat: 22.7196, lng: 75.8577 },
    { name: 'Surat',           lat: 21.1702, lng: 72.8311 },
    { name: 'Patna',           lat: 25.5941, lng: 85.1376 },
    { name: 'Ranchi',          lat: 23.3441, lng: 85.3096 }
];
