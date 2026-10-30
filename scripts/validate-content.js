#!/usr/bin/env node
/**
 * scripts/validate-content.js
 *
 * Validates every content/destinations/<id>.json against:
 *   1. All 35 canonical destination IDs have a matching file
 *   2. Required schema fields exist and are non-empty
 *   3. id and slug match the filename
 *   4. coordinates match lib/data.js
 *   5. Sources contain valid-looking URLs
 *   6. Images with usable=true have author, license, and licenseUrl
 *   7. No duplicate destination IDs across files
 *   8. verificationStatus is a valid enum value
 *   9. ContentSection.classification is a valid enum
 *  10. nearbyPlaces reference valid IDs from DESTINATIONS_DB
 *
 * Exits with code 1 if any REQUIRED check fails.
 * Exits with code 0 if only warnings are raised.
 *
 * Usage:
 *   node scripts/validate-content.js
 *   node scripts/validate-content.js --destination kashi
 *   node scripts/validate-content.js --strict    # treat warnings as errors
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'destinations');

const VALID_VERIFICATION_STATUSES = ['draft', 'pending_review', 'approved', 'rejected'];
const VALID_CLASSIFICATIONS = ['documented-fact', 'religious-tradition', 'legend', 'modern-visitor-info'];
const REQUIRED_TOP_FIELDS = ['id', 'slug', 'name', 'category', 'state', 'country', 'coordinates', 'sources', 'verificationStatus', 'lastVerified', 'contentVersion'];
const URL_PATTERN = /^https?:\/\/.+/;

// ── Load canonical IDs ────────────────────────────────────────────────────────
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
const CANONICAL_IDS = new Set(DESTINATIONS_DB.map(d => d.id));

// ── Args ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const singleId = args.includes('--destination') ? args[args.indexOf('--destination') + 1] : null;
const strict = args.includes('--strict');

// ── Validate ──────────────────────────────────────────────────────────────────
const errors = [];   // blocks CI
const warnings = []; // informational

function error(id, msg) { errors.push(`  ERROR   [${id}] ${msg}`); }
function warn(id, msg)  { warnings.push(`  WARN    [${id}] ${msg}`); }

if (!fs.existsSync(CONTENT_DIR)) {
    console.error('ERROR: content/destinations/ does not exist. Run generate-stubs.js first.');
    process.exit(1);
}

const files = fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.json'))
    .filter(f => singleId ? f === `${singleId}.json` : true);

// Check 1: All canonical IDs have a file
if (!singleId) {
    for (const id of CANONICAL_IDS) {
        if (!fs.existsSync(path.join(CONTENT_DIR, `${id}.json`))) {
            error(id, `No content file found. Run generate-stubs.js to create ${id}.json`);
        }
    }
}

// Check 2: No duplicate IDs
const seenIds = new Set();

const completionData = [];

for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    let record;

    try {
        record = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        error(file, `Invalid JSON: ${e.message}`);
        continue;
    }

    const id = record.id || file.replace('.json', '');

    // Duplicate check
    if (seenIds.has(id)) { error(id, 'Duplicate id across content files'); }
    seenIds.add(id);

    // Canonical id check
    if (!CANONICAL_IDS.has(id)) {
        error(id, `id "${id}" is not in DESTINATIONS_DB — do not create non-canonical records`);
    }

    // Filename matches id
    if (file !== `${id}.json`) {
        error(id, `filename "${file}" does not match id "${id}"`);
    }

    // slug matches id
    if (record.slug !== record.id) {
        error(id, `slug "${record.slug}" does not match id "${record.id}"`);
    }

    // Required top-level fields
    for (const field of REQUIRED_TOP_FIELDS) {
        if (record[field] === undefined || record[field] === null || record[field] === '') {
            error(id, `Required field "${field}" is missing or empty`);
        }
    }

    // verificationStatus enum
    if (!VALID_VERIFICATION_STATUSES.includes(record.verificationStatus)) {
        error(id, `verificationStatus "${record.verificationStatus}" is not valid (must be one of: ${VALID_VERIFICATION_STATUSES.join(', ')})`);
    }

    // Coordinates match lib/data.js
    const canonical = DESTINATIONS_DB.find(d => d.id === id);
    if (canonical && record.coordinates) {
        if (record.coordinates.lat !== canonical.lat || record.coordinates.lng !== canonical.lng) {
            error(id, `coordinates (${record.coordinates.lat}, ${record.coordinates.lng}) do not match lib/data.js (${canonical.lat}, ${canonical.lng})`);
        }
    }

    // Sources
    if (!Array.isArray(record.sources) || record.sources.length === 0) {
        error(id, 'sources array is missing or empty');
    } else {
        for (const source of record.sources) {
            if (!source.url || !URL_PATTERN.test(source.url)) {
                error(id, `Source "${source.id || 'unknown'}" has missing or invalid URL: "${source.url}"`);
            }
            if (!['verified', 'partially_verified', 'unverified', 'draft', 'pending_review', 'approved', 'rejected'].includes(source.verificationStatus)) {
                warn(id, `Source "${source.id}" has unexpected verificationStatus: "${source.verificationStatus}"`);
            }
        }
    }

    // Gallery: usable images must have attribution
    if (Array.isArray(record.gallery)) {
        for (const img of record.gallery) {
            if (img.usable === true) {
                if (!img.author) error(id, `Gallery image "${img.wikimediaFile}" is marked usable but has no author`);
                if (!img.license) error(id, `Gallery image "${img.wikimediaFile}" is marked usable but has no license`);
                if (!img.licenseUrl) error(id, `Gallery image "${img.wikimediaFile}" is marked usable but has no licenseUrl`);
                if (!img.fullUrl || !URL_PATTERN.test(img.fullUrl)) error(id, `Gallery image "${img.wikimediaFile}" is marked usable but has no valid fullUrl`);
                if (!img.thumbUrl || !URL_PATTERN.test(img.thumbUrl)) error(id, `Gallery image "${img.wikimediaFile}" is marked usable but has no valid thumbUrl`);
            }
        }
    }

    // ContentSection classification
    const sectionFields = ['historicalBackground', 'religiousSignificance', 'legendsAndTraditions', 'architecture', 'ritualsAndFestivals'];
    for (const field of sectionFields) {
        const section = record[field];
        if (section && section.classification && !VALID_CLASSIFICATIONS.includes(section.classification)) {
            error(id, `${field}.classification "${section.classification}" is not valid`);
        }
    }

    // nearbyPlaces reference valid IDs
    if (Array.isArray(record.nearbyPlaces)) {
        for (const nearby of record.nearbyPlaces) {
            if (nearby.id && !CANONICAL_IDS.has(nearby.id)) {
                warn(id, `nearbyPlaces references non-canonical id "${nearby.id}"`);
            }
        }
    }

    // Approved records must have non-empty overview
    if (record.verificationStatus === 'approved' && (!record.overview || record.overview.trim() === '')) {
        error(id, 'Approved record must have a non-empty overview');
    }

    // Completion percentage
    let complete = 0, total = 8;
    if (record.overview?.trim()) complete++;
    if (record.historicalBackground?.text?.trim()) complete++;
    if (record.religiousSignificance?.text?.trim()) complete++;
    if (record.architecture?.text?.trim()) complete++;
    if (record.ritualsAndFestivals?.text?.trim()) complete++;
    if (record.gallery?.length > 0) complete++;
    if (record.visitorInformation?.openingHours?.summary?.trim()) complete++;
    if (record.howToReach?.nearestAirport?.name?.trim()) complete++;
    completionData.push({ id, name: record.name, pct: Math.round((complete / total) * 100), status: record.verificationStatus });
}

// ── Output ────────────────────────────────────────────────────────────────────
console.log('\nSacredMiles — Content validation report');
console.log(`Files checked: ${files.length}  |  Canonical IDs: ${CANONICAL_IDS.size}\n`);

if (errors.length === 0 && warnings.length === 0) {
    console.log('  ✓ All checks passed.\n');
} else {
    if (errors.length > 0) {
        console.log(`ERRORS (${errors.length}):`);
        errors.forEach(e => console.log(e));
    }
    if (warnings.length > 0) {
        console.log(`\nWARNINGS (${warnings.length}):`);
        warnings.forEach(w => console.log(w));
    }
}

// Completion table
console.log('\n── Content completion ───────────────────────────────────');
completionData.sort((a, b) => b.pct - a.pct);
for (const row of completionData) {
    const bar = '█'.repeat(Math.round(row.pct / 10)) + '░'.repeat(10 - Math.round(row.pct / 10));
    console.log(`  ${row.id.padEnd(20)} ${bar} ${String(row.pct).padStart(3)}%  [${row.status}]`);
}

const allPcts = completionData.map(r => r.pct);
if (allPcts.length) {
    const avg = Math.round(allPcts.reduce((a, b) => a + b, 0) / allPcts.length);
    console.log(`\n  Overall average: ${avg}%`);
}

// Write JSON report
const reportPath = path.join(__dirname, '..', 'content', 'validation-report.json');
fs.writeFileSync(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    filesChecked: files.length,
    canonicalIds: CANONICAL_IDS.size,
    errors: errors.length,
    warnings: warnings.length,
    errorList: errors,
    warningList: warnings,
    completion: completionData
}, null, 2));
console.log(`\nReport saved to content/validation-report.json`);

const exitCode = (errors.length > 0 || (strict && warnings.length > 0)) ? 1 : 0;
if (exitCode === 1) {
    console.log(`\n✗ Validation FAILED (${errors.length} error(s))`);
} else {
    console.log(`\n✓ Validation passed${warnings.length > 0 ? ` with ${warnings.length} warning(s)` : ''}`);
}
process.exit(exitCode);
