/**
 * lib/planner/budget-engine.js
 *
 * Multi-traveller, travel-mode-aware, accommodation-tier-aware budget engine.
 *
 * All figures are provisional planning assumptions.
 * None are confirmed booking prices, official fees, or guaranteed rates.
 */

import {
    TRANSPORT_RATE_PER_KM,
    TRANSPORT_BASE_INR,
    ACCOMMODATION_RATE,
    FOOD_RATE,
    DARSHAN_ALLOWANCE_INR,
    MISC_FRACTION,
    DEFAULT_CONTINGENCY
} from './constants.js';

/**
 * estimateBudget({ itinerary, inputs })
 *
 * inputs: {
 *   travellers:          number
 *   travelMode:          'car' | 'train' | 'bus' | 'mixed'
 *   accommodation:       'budget' | 'standard' | 'premium'
 *   pace:                'relaxed' | 'balanced' | 'intensive'
 *   contingencyRate:     number (0–0.30)
 * }
 *
 * Returns:
 * {
 *   perPerson:  { transport, accommodation, food, darshan, misc, contingency, total },
 *   group:      { transport, accommodation, food, darshan, misc, contingency, total },
 *   travellers: number,
 *   currency:   'INR',
 *   disclaimer: string
 * }
 */
export function estimateBudget({ itinerary, inputs }) {
    const travellers    = Math.max(1, Number(inputs.travellers) || 1);
    const travelMode    = inputs.travelMode    || 'mixed';
    const accommodation = inputs.accommodation || 'standard';
    const pace          = inputs.pace          || 'balanced';
    const contingency   = Math.min(0.30, Math.max(0, Number(inputs.contingencyRate ?? DEFAULT_CONTINGENCY)));

    const ratePerKm     = TRANSPORT_RATE_PER_KM[travelMode]    ?? TRANSPORT_RATE_PER_KM.mixed;
    const accommodRate  = ACCOMMODATION_RATE[accommodation]    ?? ACCOMMODATION_RATE.standard;
    const foodRate      = FOOD_RATE[pace]                      ?? FOOD_RATE.balanced;

    const destinationDays  = itinerary.filter(d => d.destinationId).length;
    const totalDays        = itinerary.length;
    const nights           = Math.max(0, totalDays - 1);
    const totalDistanceKm  = itinerary.reduce((s, d) => s + (d.travelDistanceKm || 0), 0);

    // ── Per-person calculations ───────────────────────────────────────────────
    // Transport: shared cost split across travellers (car costs scale differently)
    const transportTotal = TRANSPORT_BASE_INR + totalDistanceKm * ratePerKm;
    const transportPerPerson = travelMode === 'car'
        ? Math.round(transportTotal / travellers)   // car cost shared
        : Math.round(transportTotal);               // train/bus: each buys own ticket

    const accommodPerPerson = nights * accommodRate;
    const foodPerPerson     = totalDays * foodRate;
    const darshanPerPerson  = destinationDays * DARSHAN_ALLOWANCE_INR;

    const subtotalPerPerson = transportPerPerson + accommodPerPerson + foodPerPerson + darshanPerPerson;
    const miscPerPerson     = Math.round(subtotalPerPerson * MISC_FRACTION);
    const contingencyPerPerson = Math.round((subtotalPerPerson + miscPerPerson) * contingency);
    const totalPerPerson    = subtotalPerPerson + miscPerPerson + contingencyPerPerson;

    // ── Group totals ──────────────────────────────────────────────────────────
    const groupMultiplier = travelMode === 'car' ? 1 : travellers; // car already shared
    const groupTransport  = travelMode === 'car'
        ? Math.round(transportTotal)
        : Math.round(transportTotal * travellers);
    const groupAccommod   = nights * accommodRate * travellers;
    const groupFood       = totalDays * foodRate * travellers;
    const groupDarshan    = destinationDays * DARSHAN_ALLOWANCE_INR * travellers;
    const groupSubtotal   = groupTransport + groupAccommod + groupFood + groupDarshan;
    const groupMisc       = Math.round(groupSubtotal * MISC_FRACTION);
    const groupContingency = Math.round((groupSubtotal + groupMisc) * contingency);
    const groupTotal      = groupSubtotal + groupMisc + groupContingency;

    // ── Category breakdown for display ───────────────────────────────────────
    const breakdown = [
        { category: 'Intercity transport',   perPerson: transportPerPerson, group: groupTransport,  note: `${totalDistanceKm} km at ₹${ratePerKm}/km (${travelMode})` },
        { category: 'Accommodation',         perPerson: accommodPerPerson,  group: groupAccommod,   note: `${nights} night(s), ${accommodation} tier` },
        { category: 'Food',                  perPerson: foodPerPerson,      group: groupFood,       note: `${totalDays} days at ₹${foodRate}/day/person` },
        { category: 'Darshan & entry',       perPerson: darshanPerPerson,   group: groupDarshan,    note: `₹${DARSHAN_ALLOWANCE_INR}/destination (provisional)` },
        { category: 'Miscellaneous (8%)',    perPerson: miscPerPerson,      group: groupMisc,       note: 'Tips, local transport, incidentals' },
        { category: `Contingency (${Math.round(contingency * 100)}%)`, perPerson: contingencyPerPerson, group: groupContingency, note: 'Buffer for price variations' }
    ];

    return {
        perPerson: {
            transport:    transportPerPerson,
            accommodation: accommodPerPerson,
            food:          foodPerPerson,
            darshan:       darshanPerPerson,
            misc:          miscPerPerson,
            contingency:   contingencyPerPerson,
            total:         totalPerPerson
        },
        group: {
            transport:    groupTransport,
            accommodation: groupAccommod,
            food:          groupFood,
            darshan:       groupDarshan,
            misc:          groupMisc,
            contingency:   groupContingency,
            total:         groupTotal
        },
        breakdown,
        travellers,
        travelMode,
        accommodation,
        currency: 'INR',
        disclaimer: 'All figures are provisional planning assumptions only. They are not confirmed booking prices, official entry fees, or guaranteed rates. Accommodation, food, and transport costs vary by season, provider, and availability.'
    };
}
