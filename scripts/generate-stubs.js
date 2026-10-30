#!/usr/bin/env node
/**
 * scripts/generate-stubs.js
 *
 * Creates an honest stub content file for every destination in DESTINATIONS_DB
 * that does not yet have a file in content/destinations/.
 *
 * A stub is NOT a complete record. It contains only fields derivable from the
 * existing lib/data.js catalogue and the source register. Every text field is
 * empty string so the validator can detect missing content. verificationStatus
 * is always "draft". No content is invented.
 *
 * Usage:
 *   node scripts/generate-stubs.js
 *   node scripts/generate-stubs.js --destination kashi      # single destination
 *   node scripts/generate-stubs.js --dry-run                # preview only
 */

const fs = require('fs');
const path = require('path');

// ── Load destinations ────────────────────────────────────────────────────────
// We require lib/data.js directly. DESTINATIONS_DB is a plain array so this
// works without a build step.
// The destination list is duplicated here from lib/data.js to avoid ESM import
// complexity in a CommonJS script. Keep this in sync manually when lib/data.js changes.
const DESTINATIONS_DB = [
  { id: 'kashi', name: 'Kashi Vishwanath (Varanasi)', state: 'Uttar Pradesh', type: 'temple', lat: 25.3109, lng: 82.9739 },
  { id: 'sarnath', name: 'Sarnath', state: 'Uttar Pradesh', type: 'sightseeing', lat: 25.3762, lng: 83.0227 },
  { id: 'ayodhya', name: 'Ram Janmabhoomi (Ayodhya)', state: 'Uttar Pradesh', type: 'temple', lat: 26.7922, lng: 82.1998 },
  { id: 'mathura', name: 'Krishna Janmabhoomi (Mathura)', state: 'Uttar Pradesh', type: 'temple', lat: 27.4924, lng: 77.6737 },
  { id: 'haridwar', name: 'Har Ki Pauri (Haridwar)', state: 'Uttarakhand', type: 'temple', lat: 29.9457, lng: 78.1642 },
  { id: 'rishikesh', name: 'Rishikesh', state: 'Uttarakhand', type: 'sightseeing', lat: 30.0869, lng: 78.2676 },
  { id: 'kedarnath', name: 'Kedarnath', state: 'Uttarakhand', type: 'temple', lat: 30.7352, lng: 79.0669 },
  { id: 'puri', name: 'Jagannath Temple (Puri)', state: 'Odisha', type: 'temple', lat: 19.8135, lng: 85.8312 },
  { id: 'konark', name: 'Sun Temple (Konark)', state: 'Odisha', type: 'sightseeing', lat: 19.8876, lng: 86.0945 },
  { id: 'rameswaram', name: 'Ramanathaswamy (Rameswaram)', state: 'Tamil Nadu', type: 'temple', lat: 9.2876, lng: 79.3129 },
  { id: 'madurai', name: 'Meenakshi Amman (Madurai)', state: 'Tamil Nadu', type: 'temple', lat: 9.9195, lng: 78.1193 },
  { id: 'kanyakumari', name: 'Vivekananda Rock (Kanyakumari)', state: 'Tamil Nadu', type: 'sightseeing', lat: 8.0780, lng: 77.5550 },
  { id: 'tirupati', name: 'Tirumala Venkateswara (Tirupati)', state: 'Andhra Pradesh', type: 'temple', lat: 13.6288, lng: 79.4192 },
  { id: 'srisailam', name: 'Mallikarjuna (Srisailam)', state: 'Andhra Pradesh', type: 'temple', lat: 16.0750, lng: 78.8687 },
  { id: 'shirdi', name: 'Sai Baba Temple (Shirdi)', state: 'Maharashtra', type: 'temple', lat: 19.7668, lng: 74.4754 },
  { id: 'trimbakeshwar', name: 'Trimbakeshwar', state: 'Maharashtra', type: 'temple', lat: 19.9439, lng: 73.5352 },
  { id: 'dwarka', name: 'Dwarkadhish (Dwarka)', state: 'Gujarat', type: 'temple', lat: 22.2442, lng: 68.9685 },
  { id: 'somnath', name: 'Somnath', state: 'Gujarat', type: 'temple', lat: 20.8880, lng: 70.4012 },
  { id: 'padmanabhaswamy', name: 'Padmanabhaswamy Temple (Thiruvananthapuram)', state: 'Kerala', type: 'temple', lat: 8.4828, lng: 76.9436 },
  { id: 'guruvayur', name: 'Guruvayur Temple', state: 'Kerala', type: 'temple', lat: 10.5946, lng: 76.0396 },
  { id: 'hampi', name: 'Virupaksha Temple (Hampi)', state: 'Karnataka', type: 'temple', lat: 15.3350, lng: 76.4600 },
  { id: 'mysore', name: 'Mysore Palace', state: 'Karnataka', type: 'sightseeing', lat: 12.3051, lng: 76.6551 },
  { id: 'udupi', name: 'Udupi Sri Krishna Matha', state: 'Karnataka', type: 'temple', lat: 13.3409, lng: 74.7421 },
  { id: 'pushkar', name: 'Brahma Temple (Pushkar)', state: 'Rajasthan', type: 'temple', lat: 26.4880, lng: 74.5510 },
  { id: 'jaipur', name: 'Birla Mandir (Jaipur)', state: 'Rajasthan', type: 'temple', lat: 26.8920, lng: 75.8150 },
  { id: 'udaipur', name: 'City Palace (Udaipur)', state: 'Rajasthan', type: 'sightseeing', lat: 24.5764, lng: 73.6835 },
  { id: 'mahakaleshwar', name: 'Mahakaleshwar (Ujjain)', state: 'Madhya Pradesh', type: 'temple', lat: 23.1848, lng: 75.7677 },
  { id: 'khajuraho', name: 'Khajuraho Group of Monuments', state: 'Madhya Pradesh', type: 'sightseeing', lat: 24.8510, lng: 79.9213 },
  { id: 'kalighat', name: 'Kalighat Kali Temple (Kolkata)', state: 'West Bengal', type: 'temple', lat: 22.5204, lng: 88.3411 },
  { id: 'dakshineswar', name: 'Dakshineswar Kali Temple', state: 'West Bengal', type: 'temple', lat: 22.6565, lng: 88.3582 },
  { id: 'goldentemple', name: 'Golden Temple (Amritsar)', state: 'Punjab', type: 'temple', lat: 31.6200, lng: 74.8765 },
  { id: 'vaishnodevi', name: 'Vaishno Devi (Katra)', state: 'Jammu & Kashmir', type: 'temple', lat: 33.0308, lng: 74.9490 },
  { id: 'kamakhya', name: 'Kamakhya Temple (Guwahati)', state: 'Assam', type: 'temple', lat: 26.1664, lng: 91.7067 },
  { id: 'basilica', name: 'Basilica of Bom Jesus', state: 'Goa', type: 'sightseeing', lat: 15.5009, lng: 73.9116 },
  { id: 'shantadurga', name: 'Shanta Durga Temple', state: 'Goa', type: 'temple', lat: 15.3942, lng: 73.9856 }
];

// ── Load source register ─────────────────────────────────────────────────────
const registerPath = path.join(__dirname, '..', 'lib', 'sacredmiles-source-register.json');
let sourceRegister = { destinations: [] };
if (fs.existsSync(registerPath)) {
    sourceRegister = JSON.parse(fs.readFileSync(registerPath, 'utf8'));
}

// ── Parse args ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const singleId = args.includes('--destination') ? args[args.indexOf('--destination') + 1] : null;

const contentDir = path.join(__dirname, '..', 'content', 'destinations');
fs.mkdirSync(contentDir, { recursive: true });

// ── Alias map (matches lib/data.js RESEARCH_DESTINATION_ALIASES) ─────────────
const ALIASES = {
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

function getRegisterEntry(id) {
    const name = ALIASES[id];
    return sourceRegister.destinations.find(e => e.destination === name) || null;
}

function makeStub(dest) {
    const entry = getRegisterEntry(dest.id);
    const sources = [];
    if (entry && entry.primary_url) {
        sources.push({
            id: 'source-0',
            title: entry.authority || 'Unverified candidate source',
            publisher: entry.authority || '',
            url: entry.primary_url,
            sourceType: 'government-tourism',
            accessedDate: entry.last_checked_date || '2026-10-30',
            supportsFields: [],
            verificationStatus: entry.source_status || 'unverified'
        });
    }
    if (entry && entry.related_url) {
        sources.push({
            id: 'source-1',
            title: entry.related_authority || 'Related candidate source',
            publisher: entry.related_authority || '',
            url: entry.related_url,
            sourceType: 'government-tourism',
            accessedDate: entry.last_checked_date || '2026-10-30',
            supportsFields: [],
            verificationStatus: entry.source_status || 'unverified'
        });
    }

    return {
        id: dest.id,
        slug: dest.id,
        name: dest.name,
        alternativeNames: [],
        category: dest.type,
        city: '',
        state: dest.state,
        country: 'India',
        coordinates: { lat: dest.lat, lng: dest.lng },
        overview: '',
        historicalBackground: { text: '', classification: 'documented-fact', sourceIds: [], completeness: 'stub' },
        religiousSignificance: { text: '', classification: 'religious-tradition', sourceIds: [], completeness: 'stub' },
        legendsAndTraditions: { text: '', classification: 'legend', sourceIds: [], completeness: 'stub' },
        architecture: { text: '', classification: 'documented-fact', sourceIds: [], completeness: 'stub' },
        ritualsAndFestivals: { text: '', classification: 'documented-fact', sourceIds: [], completeness: 'stub' },
        thingsToExplore: [],
        visitorInformation: {
            entryFee: { amount: null, currency: 'INR', notes: '', sourceId: null, verificationStatus: 'unverified' },
            openingHours: { summary: '', sourceId: null, verificationStatus: 'unverified' },
            dressCode: '',
            photographyPolicy: '',
            accessibilityNotes: '',
            bestArrivalTime: ''
        },
        bestTimeToVisit: '',
        howToReach: {
            nearestAirport: { name: '', distanceKm: null },
            nearestRailway: { name: '', distanceKm: null },
            roadAccess: '',
            localTransport: ''
        },
        nearbyPlaces: [],
        gallery: [],
        sources,
        verificationStatus: 'draft',
        lastVerified: entry ? entry.last_checked_date : null,
        contentVersion: 1
    };
}

// ── Main ─────────────────────────────────────────────────────────────────────
const targets = singleId
    ? DESTINATIONS_DB.filter(d => d.id === singleId)
    : DESTINATIONS_DB;

if (singleId && targets.length === 0) {
    console.error(`ERROR: No destination with id "${singleId}" found in DESTINATIONS_DB.`);
    process.exit(1);
}

let created = 0, skipped = 0;

for (const dest of targets) {
    const filePath = path.join(contentDir, `${dest.id}.json`);
    if (fs.existsSync(filePath)) {
        console.log(`  SKIP  ${dest.id}.json  (already exists — will not overwrite)`);
        skipped++;
        continue;
    }
    const stub = makeStub(dest);
    if (dryRun) {
        console.log(`  DRY   ${dest.id}.json  would be created`);
    } else {
        fs.writeFileSync(filePath, JSON.stringify(stub, null, 2) + '\n');
        console.log(`  CREATE ${dest.id}.json`);
    }
    created++;
}

console.log(`\nDone. ${dryRun ? 'Dry run — ' : ''}Created: ${created}  Skipped (existing): ${skipped}`);
if (!dryRun && created > 0) {
    console.log('\nNext step: run  node scripts/collect-images.js  to fetch Wikimedia images for each stub.');
}
