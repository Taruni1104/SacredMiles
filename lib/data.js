
import sourceRegister from './sacredmiles-source-register.json';

export const DESTINATIONS_DB = [
    // Uttar Pradesh
    { id: 'kashi', name: 'Kashi Vishwanath (Varanasi)', state: 'Uttar Pradesh', type: 'temple', time_needed: 1, lat: 25.3109, lng: 82.9739, description: "One of the 12 Jyotirlingas, the spiritual heart of India." },
    { id: 'sarnath', name: 'Sarnath', state: 'Uttar Pradesh', type: 'sightseeing', time_needed: 0.5, lat: 25.3762, lng: 83.0227, description: "Where Lord Buddha preached his first sermon." },
    { id: 'ayodhya', name: 'Ram Janmabhoomi (Ayodhya)', state: 'Uttar Pradesh', type: 'temple', time_needed: 1, lat: 26.7922, lng: 82.1998, description: "The birthplace of Lord Rama." },
    { id: 'mathura', name: 'Krishna Janmabhoomi (Mathura)', state: 'Uttar Pradesh', type: 'temple', time_needed: 0.5, lat: 27.4924, lng: 77.6737, description: "The birthplace of Lord Krishna." },

    // Uttarakhand
    { id: 'haridwar', name: 'Har Ki Pauri (Haridwar)', state: 'Uttarakhand', type: 'temple', time_needed: 1, lat: 29.9457, lng: 78.1642, description: "Famous for the Ganga Aarti and Kumbh Mela." },
    { id: 'rishikesh', name: 'Rishikesh', state: 'Uttarakhand', type: 'sightseeing', time_needed: 1, lat: 30.0869, lng: 78.2676, description: "Yoga capital of the world, suspension bridges." },
    { id: 'kedarnath', name: 'Kedarnath', state: 'Uttarakhand', type: 'temple', time_needed: 2, lat: 30.7352, lng: 79.0669, description: "One of the Chardham, dedicated to Lord Shiva." },

    // Odisha
    { id: 'puri', name: 'Jagannath Temple (Puri)', state: 'Odisha', type: 'temple', time_needed: 1, lat: 19.8135, lng: 85.8312, description: "Char Dham site, famous for Rath Yatra." },
    { id: 'konark', name: 'Sun Temple (Konark)', state: 'Odisha', type: 'sightseeing', time_needed: 0.5, lat: 19.8876, lng: 86.0945, description: "13th-century Sun Temple, a UNESCO World Heritage Site." },

    // Tamil Nadu
    { id: 'rameswaram', name: 'Ramanathaswamy (Rameswaram)', state: 'Tamil Nadu', type: 'temple', time_needed: 1, lat: 9.2876, lng: 79.3129, description: "Jyotirlinga where Lord Rama worshipped Shiva." },
    { id: 'madurai', name: 'Meenakshi Amman (Madurai)', state: 'Tamil Nadu', type: 'temple', time_needed: 0.5, lat: 9.9195, lng: 78.1193, description: "Historic temple known for its towering gopurams." },
    { id: 'kanyakumari', name: 'Vivekananda Rock (Kanyakumari)', state: 'Tamil Nadu', type: 'sightseeing', time_needed: 0.5, lat: 8.0780, lng: 77.5550, description: "Southernmost tip of mainland India." },

    // Andhra Pradesh
    { id: 'tirupati', name: 'Tirumala Venkateswara (Tirupati)', state: 'Andhra Pradesh', type: 'temple', time_needed: 1, lat: 13.6288, lng: 79.4192, description: "Richest and most visited temple in the world." },
    { id: 'srisailam', name: 'Mallikarjuna (Srisailam)', state: 'Andhra Pradesh', type: 'temple', time_needed: 1, lat: 16.0750, lng: 78.8687, description: "Jyotirlinga situated on the banks of Krishna river." },

    // Maharashtra
    { id: 'shirdi', name: 'Sai Baba Temple (Shirdi)', state: 'Maharashtra', type: 'temple', time_needed: 1, lat: 19.7668, lng: 74.4754, description: "Major pilgrimage site of Sai Baba." },
    { id: 'trimbakeshwar', name: 'Trimbakeshwar', state: 'Maharashtra', type: 'temple', time_needed: 0.5, lat: 19.9439, lng: 73.5352, description: "Jyotirlinga near Nashik, source of Godavari river." },

    // Gujarat
    { id: 'dwarka', name: 'Dwarkadhish (Dwarka)', state: 'Gujarat', type: 'temple', time_needed: 1, lat: 22.2442, lng: 68.9685, description: "Ancient kingdom of Lord Krishna, Char Dham site." },
    { id: 'somnath', name: 'Somnath', state: 'Gujarat', type: 'temple', time_needed: 0.5, lat: 20.8880, lng: 70.4012, description: "First among the twelve Aadi Jyotirlingas." },

    // Kerala
    { id: 'padmanabhaswamy', name: 'Padmanabhaswamy Temple (Thiruvananthapuram)', state: 'Kerala', type: 'temple', time_needed: 1, lat: 8.4828, lng: 76.9436, description: "Richest temple in the world, dedicated to Lord Vishnu." },
    { id: 'guruvayur', name: 'Guruvayur Temple', state: 'Kerala', type: 'temple', time_needed: 0.5, lat: 10.5946, lng: 76.0396, description: "Important Krishna temple often called Bhuloka Vaikunta." },

    // Karnataka
    { id: 'hampi', name: 'Virupaksha Temple (Hampi)', state: 'Karnataka', type: 'temple', time_needed: 1, lat: 15.3350, lng: 76.4600, description: "UNESCO World Heritage site, capital of Vijayanagara Empire." },
    { id: 'mysore', name: 'Mysore Palace', state: 'Karnataka', type: 'sightseeing', time_needed: 1, lat: 12.3051, lng: 76.6551, description: "Historical palace and royal residence of the Wadiyar dynasty." },
    { id: 'udupi', name: 'Udupi Sri Krishna Matha', state: 'Karnataka', type: 'temple', time_needed: 0.5, lat: 13.3409, lng: 74.7421, description: "Famous Hindu temple dedicated to Lord Krishna." },

    // Rajasthan
    { id: 'pushkar', name: 'Brahma Temple (Pushkar)', state: 'Rajasthan', type: 'temple', time_needed: 0.5, lat: 26.4880, lng: 74.5510, description: "One of the very few temples dedicated to Lord Brahma." },
    { id: 'jaipur', name: 'Birla Mandir (Jaipur)', state: 'Rajasthan', type: 'temple', time_needed: 0.5, lat: 26.8920, lng: 75.8150, description: "Modern Lakshmi Narayan temple made of white marble." },
    { id: 'udaipur', name: 'City Palace (Udaipur)', state: 'Rajasthan', type: 'sightseeing', time_needed: 1, lat: 24.5764, lng: 73.6835, description: "Massive palace complex on the banks of Lake Pichola." },

    // Madhya Pradesh
    { id: 'mahakaleshwar', name: 'Mahakaleshwar (Ujjain)', state: 'Madhya Pradesh', type: 'temple', time_needed: 1, lat: 23.1848, lng: 75.7677, description: "Jyotirlinga known for its Bhasma Aarti." },
    { id: 'khajuraho', name: 'Khajuraho Group of Monuments', state: 'Madhya Pradesh', type: 'sightseeing', time_needed: 1, lat: 24.8510, lng: 79.9213, description: "UNESCO site famous for Nagara-style architectural symbolism." },

    // West Bengal
    { id: 'kalighat', name: 'Kalighat Kali Temple (Kolkata)', state: 'West Bengal', type: 'temple', time_needed: 1, lat: 22.5204, lng: 88.3411, description: "One of the 51 Shakti Peethas." },
    { id: 'dakshineswar', name: 'Dakshineswar Kali Temple', state: 'West Bengal', type: 'temple', time_needed: 1, lat: 22.6565, lng: 88.3582, description: "Famous temple built by Rani Rashmoni." },

    // Punjab
    { id: 'goldentemple', name: 'Golden Temple (Amritsar)', state: 'Punjab', type: 'temple', time_needed: 1, lat: 31.6200, lng: 74.8765, description: "Holiest Gurdwara of Sikhism, also known as Harmandir Sahib." },

    // Jammu & Kashmir
    { id: 'vaishnodevi', name: 'Vaishno Devi (Katra)', state: 'Jammu & Kashmir', type: 'temple', time_needed: 2, lat: 33.0308, lng: 74.9490, description: "Holy cave shrine of Mata Vaishno Devi." },

    // Assam
    { id: 'kamakhya', name: 'Kamakhya Temple (Guwahati)', state: 'Assam', type: 'temple', time_needed: 1, lat: 26.1664, lng: 91.7067, description: "One of the oldest Shakti Peethas." },

    // Goa
    { id: 'basilica', name: 'Basilica of Bom Jesus', state: 'Goa', type: 'sightseeing', time_needed: 0.5, lat: 15.5009, lng: 73.9116, description: "UNESCO Heritage site holding the remains of St. Francis Xavier." },
    { id: 'shantadurga', name: 'Shanta Durga Temple', state: 'Goa', type: 'temple', time_needed: 0.5, lat: 15.3942, lng: 73.9856, description: "Dedicated to Shantadurga, the goddess who mediates between Vishnu and Shiva." }
];

export function getDestinationBySlug(slug) {
    return DESTINATIONS_DB.find(destination => destination.id === slug);
}

const DESTINATION_RESEARCH = {
    kashi: {
        researchStatus: 'partially-researched',
        verifiedAt: '2026-10-30',
        officialLinks: [
            { label: 'Official Temple Website', url: 'https://www.shrikashivishwanath.org/', type: 'official-website' },
            { label: 'Official Darshan and Puja Services', url: 'https://shrikashivishwanath.org/frontend/home/poojaList', type: 'darshan-booking' },
            { label: 'Official Live Darshan', url: 'https://shrikashivishwanath.org/online/live_darshan', type: 'visitor-information' }
        ],
        sourceReferences: [
            { title: 'Shri Kashi Vishwanath Official Web Portal', publisher: 'Shri Kashi Vishwanath Temple Trust', url: 'https://www.shrikashivishwanath.org/', sourceType: 'official', claim: 'The temple trust portal provides temple services and official visitor resources.', verificationStatus: 'verified', lastChecked: '2026-10-30' }
        ],
        claims: [
            { text: 'The temple trust portal provides official temple services and live darshan resources.', sourceUrl: 'https://www.shrikashivishwanath.org/', classification: 'documented-official-information', verificationStatus: 'verified' }
        ]
    },
    tirupati: {
        researchStatus: 'partially-researched',
        verifiedAt: '2026-10-30',
        officialLinks: [
            { label: 'Official TTD Booking Portal', url: 'https://tirupatibalaji.ap.gov.in/', type: 'official-website' },
            { label: 'Official Darshan, Seva and Accommodation Booking', url: 'https://tirupatibalaji.ap.gov.in/', type: 'darshan-booking' }
        ],
        sourceReferences: [
            { title: 'Tirumala Tirupati Devasthanams Official Booking Portal', publisher: 'Tirumala Tirupati Devasthanams', url: 'https://tirupatibalaji.ap.gov.in/', sourceType: 'official', claim: 'The portal identifies itself as the official TTD booking portal and lists darshan, seva and accommodation services.', verificationStatus: 'verified', lastChecked: '2026-10-30' }
        ],
        claims: [
            { text: 'The TTD portal identifies itself as an official booking portal for darshan, seva and accommodation services.', sourceUrl: 'https://tirupatibalaji.ap.gov.in/', classification: 'documented-official-information', verificationStatus: 'verified' }
        ]
    },
    somnath: {
        researchStatus: 'partially-researched',
        verifiedAt: '2026-10-30',
        officialLinks: [
            { label: 'Official Somnath Trust Website', url: 'https://somnath.org/', type: 'official-website' },
            { label: 'Official Pilgrim Facilities', url: 'https://somnath.org/pilgrim-facilities', type: 'visitor-information' },
            { label: 'Official Special Puja Information', url: 'https://somnath.org/online-donation/#LakshmiPoojan', type: 'seva-booking' }
        ],
        sourceReferences: [
            { title: 'Jay Somnath', publisher: 'Shree Somnath Trust', url: 'https://somnath.org/', sourceType: 'official', claim: 'The Somnath Trust website provides pilgrim facilities and official puja and donation resources.', verificationStatus: 'verified', lastChecked: '2026-10-30' }
        ],
        claims: [
            { text: 'The Somnath Trust website provides official pilgrim facilities and puja resources.', sourceUrl: 'https://somnath.org/', classification: 'documented-official-information', verificationStatus: 'verified' }
        ]
    }
};

const RESEARCH_DESTINATION_ALIASES = {
    kashi: 'Kashi Vishwanath, Varanasi',
    sarnath: 'Sarnath',
    ayodhya: 'Ram Janmabhoomi, Ayodhya',
    mathura: 'Krishna Janmabhoomi, Mathura',
    haridwar: 'Har Ki Pauri, Haridwar',
    rishikesh: 'Rishikesh',
    kedarnath: 'Kedarnath',
    puri: 'Jagannath Temple, Puri',
    konark: 'Sun Temple, Konark',
    rameswaram: 'Ramanathaswamy Temple, Rameswaram',
    madurai: 'Meenakshi Amman Temple, Madurai',
    kanyakumari: 'Vivekananda Rock, Kanyakumari',
    tirupati: 'Tirumala Venkateswara, Tirupati',
    srisailam: 'Mallikarjuna Temple, Srisailam',
    shirdi: 'Sai Baba Temple, Shirdi',
    trimbakeshwar: 'Trimbakeshwar',
    dwarka: 'Dwarkadhish Temple, Dwarka',
    somnath: 'Somnath',
    padmanabhaswamy: 'Padmanabhaswamy Temple, Thiruvananthapuram',
    guruvayur: 'Guruvayur Temple',
    hampi: 'Virupaksha Temple, Hampi',
    mysore: 'Mysore Palace',
    udupi: 'Udupi Sri Krishna Matha',
    pushkar: 'Brahma Temple, Pushkar',
    jaipur: 'Birla Mandir, Jaipur',
    udaipur: 'City Palace, Udaipur',
    mahakaleshwar: 'Mahakaleshwar, Ujjain',
    khajuraho: 'Khajuraho Group of Monuments',
    kalighat: 'Kalighat Kali Temple, Kolkata',
    dakshineswar: 'Dakshineswar Kali Temple',
    goldentemple: 'Golden Temple, Amritsar',
    vaishnodevi: 'Vaishno Devi, Katra',
    kamakhya: 'Kamakhya Temple, Guwahati',
    basilica: 'Basilica of Bom Jesus',
    shantadurga: 'Shanta Durga Temple'
};

function getRegisterEntry(destinationId) {
    const name = RESEARCH_DESTINATION_ALIASES[destinationId];
    return sourceRegister.destinations.find(entry => entry.destination === name);
}

function getRegisterResearch(destination) {
    const entry = getRegisterEntry(destination.id);
    if (!entry) return {};

    const verificationStatus = entry.source_status === 'verified'
        ? 'verified'
        : entry.source_status === 'partially_verified' ? 'partially-verified' : 'unverified';
    const sourceReferences = [{
        title: entry.authority,
        publisher: entry.authority,
        url: entry.primary_url,
        sourceType: entry.authority.includes('Government') || entry.authority.includes('Archaeological') ? 'government-or-heritage' : 'source-discovery',
        claim: entry.purpose,
        verificationStatus,
        lastChecked: entry.last_checked_date
    }];

    if (entry.related_url) {
        sourceReferences.push({
            title: entry.related_authority || 'Related authority source',
            publisher: entry.related_authority || 'Related authority source',
            url: entry.related_url,
            sourceType: 'government-or-heritage',
            claim: 'Related source recorded for follow-up verification.',
            verificationStatus,
            lastChecked: entry.last_checked_date
        });
    }

    return {
        researchStatus: DESTINATION_RESEARCH[destination.id]?.researchStatus || 'source-discovery',
        verifiedAt: entry.last_checked_date,
        researchRegister: entry,
        sourceReferences,
        claims: [{
            text: entry.purpose,
            sourceUrl: entry.primary_url,
            classification: 'research-register-summary',
            verificationStatus
        }]
    };
}

export function getDestinationStory(destination) {
    const research = {
        ...getRegisterResearch(destination),
        ...(DESTINATION_RESEARCH[destination.id] || {}),
        sourceReferences: [
            ...(getRegisterResearch(destination).sourceReferences || []),
            ...(DESTINATION_RESEARCH[destination.id]?.sourceReferences || [])
        ],
        claims: [
            ...(getRegisterResearch(destination).claims || []),
            ...(DESTINATION_RESEARCH[destination.id]?.claims || [])
        ]
    };
    return {
        ...destination,
        slug: destination.id,
        summary: destination.description,
        contentStatus: research.researchStatus || 'awaiting-research',
        verifiedAt: research.verifiedAt || null,
        storySections: research.storySections || [],
        highlights: [],
        quickFacts: [
            { label: 'Region', value: destination.state },
            { label: 'Place type', value: destination.type === 'temple' ? 'Pilgrimage site' : 'Cultural destination' },
            { label: 'Suggested time', value: `${destination.time_needed} day` }
        ],
        practicalInfo: [],
        costEstimates: [
            { name: 'Local visit allowance', amount: 250, currency: 'INR', status: 'provisional assumption', optional: true }
        ],
        relatedDestinationIds: DESTINATIONS_DB
            .filter(candidate => candidate.id !== destination.id && candidate.state === destination.state)
            .slice(0, 3)
            .map(candidate => candidate.id),
        image: null,
        imageCredit: null,
        officialLinks: research.officialLinks || [],
        claims: research.claims || [],
        sourceReferences: research.sourceReferences || []
    };
}

export function addDestinationToItinerary(itinerary, destinationId) {
    const destination = getDestinationBySlug(destinationId);
    if (!destination) return itinerary;
    if (itinerary.some(day => day.destinationId === destinationId)) return itinerary;

    const lastPlannedDay = [...itinerary].reverse().find(day => day.destinationId);
    const previousDestination = lastPlannedDay
        ? getDestinationBySlug(lastPlannedDay.destinationId)
        : null;
    const distance = previousDestination
        ? haversineDistance(previousDestination, destination)
        : 0;
    const travelMinutes = Math.max(45, Math.round(distance * 1.8));
    const lastDate = itinerary.length > 0
        ? new Date(`${itinerary[itinerary.length - 1].date}T00:00:00`)
        : new Date();
    if (Number.isNaN(lastDate.getTime())) lastDate.setTime(Date.now());
    lastDate.setDate(lastDate.getDate() + (itinerary.length > 0 ? 1 : 0));

    return [...itinerary, {
        day: itinerary.length + 1,
        date: formatDate(lastDate),
        destinationId: destination.id,
        location: destination.name,
        description: destination.description,
        coordinates: [destination.lat, destination.lng],
        travelDistanceKm: distance,
        travelMinutes,
        activities: [
            { time: '08:00 AM', activity: distance ? `Travel ${distance} km to ${destination.name}` : `Begin at ${destination.name}`, type: 'travel' },
            { time: '10:00 AM', activity: 'Check-in & Refresh', type: 'meal' },
            { time: '04:00 PM', activity: `${destination.type === 'temple' ? 'Darshan at' : 'Explore'} ${destination.name}`, type: destination.type === 'temple' ? 'darshan' : 'sightseeing' },
            { time: '08:00 PM', activity: 'Dinner & Rest', type: 'meal' }
        ]
    }];
}

export const TRIP_TYPES = [
    {
        id: "pilgrimage",
        title: "Pilgrimage Focused",
        description: "Deep spiritual immersion with priority on temple darshans and rituals.",
        icon: "Om",
        color: "hsl(var(--primary))"
    },
    {
        id: "sightseeing",
        title: "Sightseeing & Culture",
        description: "Explore the history, architecture, and local culture alongside temples.",
        icon: "Camera",
        color: "hsl(var(--secondary))"
    },
    {
        id: "balanced",
        title: "Balanced Journey",
        description: "The perfect blend of spiritual visits and relaxing exploration.",
        icon: "Scale",
        color: "hsl(var(--accent))"
    }
];

const EARTH_RADIUS_KM = 6371;

function haversineDistance(from, to) {
    const latDelta = (to.lat - from.lat) * Math.PI / 180;
    const lngDelta = (to.lng - from.lng) * Math.PI / 180;
    const fromLat = from.lat * Math.PI / 180;
    const toLat = to.lat * Math.PI / 180;
    const value = Math.sin(latDelta / 2) ** 2
        + Math.sin(lngDelta / 2) ** 2 * Math.cos(fromLat) * Math.cos(toLat);
    return Math.round(EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value)));
}

function formatDate(date) {
    return date.toISOString().slice(0, 10);
}

export function calculateBudget(destinations, days) {
    const destinationCount = destinations.length;
    const transport = destinations.reduce((total, destination, index) => {
        if (index === 0) return total;
        return total + Math.max(450, destination.travelDistanceKm * 6);
    }, 900);
    const accommodation = days * 1800;
    const food = days * 900;
    const donations = destinationCount * 250;
    return {
        transport: Math.round(transport),
        accommodation,
        food,
        donations,
        total: Math.round(transport + accommodation + food + donations),
        currency: 'INR'
    };
}

// Generate a dated, route-aware local itinerary. Distances are estimates until
// a routing provider is connected.
// NOTE: The new engine in lib/planner/engine.js supersedes this function.
// This wrapper is kept for backward compatibility with existing imports.
export { generateItinerary } from './planner/engine.js';

export function getItineraryBudget(itinerary) {
    const destinations = itinerary.map(day => DESTINATIONS_DB.find(destination => destination.id === day.destinationId)).filter(Boolean);
    const legacy = calculateBudget(destinations.map((destination, index) => ({
        ...destination,
        travelDistanceKm: itinerary.find(day => day.destinationId === destination.id)?.travelDistanceKm || 0
    })), itinerary.length);
    return legacy;
}
