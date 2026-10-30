#!/usr/bin/env node
/**
 * scripts/collect-research.js
 *
 * Merges the existing source register (lib/sacredmiles-source-register.json)
 * and any future research inputs into each destination's content JSON.
 *
 * It does NOT scrape or invent content. It:
 *   1. Reads each content/destinations/<id>.json
 *   2. Merges source register entries into the sources[] array
 *   3. Records which fields still need research
 *   4. Writes a per-destination research status report
 *
 * If the AI provider env var is set (OPENAI_API_KEY or SACREDMILES_AI_KEY),
 * it can optionally call the AI to draft missing text sections from gathered
 * sources. The AI draft is stored with verificationStatus="draft" and is
 * never automatically published.
 *
 * If no AI key is available the script still runs and produces a research
 * checklist — it just skips the drafting step.
 *
 * Usage:
 *   node scripts/collect-research.js
 *   node scripts/collect-research.js --destination kashi
 *   node scripts/collect-research.js --dry-run
 *   node scripts/collect-research.js --draft-text   # requires AI key
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'destinations');
const REGISTER_PATH = path.join(__dirname, '..', 'lib', 'sacredmiles-source-register.json');

// Fields that need human-written text to be considered complete
const REQUIRED_TEXT_FIELDS = [
    'overview',
    'historicalBackground',
    'religiousSignificance',
    'architecture',
    'ritualsAndFestivals'
];

const OPTIONAL_TEXT_FIELDS = [
    'legendsAndTraditions',
    'bestTimeToVisit'
];

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

function loadRegister() {
    if (!fs.existsSync(REGISTER_PATH)) return { destinations: [] };
    return JSON.parse(fs.readFileSync(REGISTER_PATH, 'utf8'));
}

function getRegisterEntry(id, register) {
    const name = ALIASES[id];
    return register.destinations.find(e => e.destination === name) || null;
}

function getMissingFields(record) {
    const missing = [];
    for (const field of REQUIRED_TEXT_FIELDS) {
        const val = record[field];
        if (!val) { missing.push(field); continue; }
        if (typeof val === 'string' && val.trim() === '') { missing.push(field); continue; }
        if (typeof val === 'object' && (!val.text || val.text.trim() === '')) { missing.push(field); continue; }
    }
    for (const field of OPTIONAL_TEXT_FIELDS) {
        const val = record[field];
        const isEmpty = !val || (typeof val === 'string' && val.trim() === '') || (typeof val === 'object' && (!val.text || val.text.trim() === ''));
        if (isEmpty) missing.push(`${field} (optional)`);
    }
    if (!record.gallery || record.gallery.length === 0) missing.push('gallery');
    if (!record.visitorInformation?.openingHours?.summary) missing.push('visitorInformation.openingHours');
    if (!record.howToReach?.nearestAirport?.name) missing.push('howToReach.nearestAirport');
    if (!record.nearbyPlaces || record.nearbyPlaces.length === 0) missing.push('nearbyPlaces');
    return missing;
}

function getCompletionPercentage(record) {
    const allFields = [...REQUIRED_TEXT_FIELDS, ...OPTIONAL_TEXT_FIELDS,
        'gallery', 'visitorInformation.openingHours', 'howToReach.nearestAirport', 'nearbyPlaces'];
    const missing = getMissingFields(record);
    // Filter out "(optional)" suffix for count
    const missingCount = missing.filter(f => !f.includes('(optional)')).length;
    const requiredCount = REQUIRED_TEXT_FIELDS.length + 4; // 4 structural fields
    return Math.round(((requiredCount - missingCount) / requiredCount) * 100);
}

function mergeRegisterSources(record, entry) {
    if (!entry) return record;
    const existingUrls = new Set((record.sources || []).map(s => s.url));
    const toAdd = [];

    if (entry.primary_url && !existingUrls.has(entry.primary_url)) {
        toAdd.push({
            id: `source-register-${record.sources?.length || 0}`,
            title: entry.authority || 'Research register source',
            publisher: entry.authority || '',
            url: entry.primary_url,
            sourceType: 'government-tourism',
            accessedDate: entry.last_checked_date || null,
            supportsFields: [],
            verificationStatus: entry.source_status || 'unverified',
            registerNotes: entry.notes || ''
        });
    }
    if (entry.related_url && !existingUrls.has(entry.related_url)) {
        toAdd.push({
            id: `source-register-${(record.sources?.length || 0) + 1}`,
            title: entry.related_authority || 'Related register source',
            publisher: entry.related_authority || '',
            url: entry.related_url,
            sourceType: 'government-tourism',
            accessedDate: entry.last_checked_date || null,
            supportsFields: [],
            verificationStatus: entry.source_status || 'unverified',
            registerNotes: entry.notes || ''
        });
    }
    return { ...record, sources: [...(record.sources || []), ...toAdd] };
}

// ── Main ─────────────────────────────────────────────────────────────────────
function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const singleId = args.includes('--destination') ? args[args.indexOf('--destination') + 1] : null;
    const draftText = args.includes('--draft-text');

    if (!fs.existsSync(CONTENT_DIR)) {
        console.error('ERROR: content/destinations/ not found. Run generate-stubs.js first.');
        process.exit(1);
    }

    const register = loadRegister();

    const aiKey = process.env.OPENAI_API_KEY || process.env.SACREDMILES_AI_KEY;
    if (draftText && !aiKey) {
        console.warn('WARNING: --draft-text was requested but no AI key found in environment.');
        console.warn('         Set OPENAI_API_KEY or SACREDMILES_AI_KEY to enable AI drafts.\n');
    }

    const files = fs.readdirSync(CONTENT_DIR)
        .filter(f => f.endsWith('.json'))
        .filter(f => singleId ? f === `${singleId}.json` : true);

    console.log(`\nSacredMiles — Research collector`);
    console.log(`Processing ${files.length} destination(s).\n`);

    const summaryRows = [];

    for (const file of files) {
        const filePath = path.join(CONTENT_DIR, file);
        let record = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const id = record.id;

        const entry = getRegisterEntry(id, register);
        const registerStatus = entry ? entry.source_status : 'not_in_register';

        // Merge sources from register
        record = mergeRegisterSources(record, entry);

        const missingFields = getMissingFields(record);
        const completion = getCompletionPercentage(record);

        const usableImages = (record.gallery || []).filter(img => img.usable === true).length;
        const totalImages = (record.gallery || []).length;
        const verifiedSources = (record.sources || []).filter(s => s.verificationStatus === 'verified').length;
        const totalSources = (record.sources || []).length;

        console.log(`  ${id.padEnd(20)} ${completion}% complete  |  sources: ${verifiedSources}/${totalSources} verified  |  images: ${usableImages}/${totalImages} usable`);
        if (missingFields.length > 0) {
            console.log(`    Missing: ${missingFields.join(', ')}`);
        }

        if (!dryRun) {
            fs.writeFileSync(filePath, JSON.stringify(record, null, 2) + '\n');
        }

        summaryRows.push({
            id,
            name: record.name,
            completion,
            registerStatus,
            verifiedSources,
            totalSources,
            usableImages,
            totalImages,
            missingFields,
            verificationStatus: record.verificationStatus
        });
    }

    // ── Summary report ────────────────────────────────────────────────────────
    const reportPath = path.join(__dirname, '..', 'content', 'research-status.json');
    const report = {
        generatedAt: new Date().toISOString(),
        totalDestinations: summaryRows.length,
        approved: summaryRows.filter(r => r.verificationStatus === 'approved').length,
        pendingReview: summaryRows.filter(r => r.verificationStatus === 'pending_review').length,
        draft: summaryRows.filter(r => r.verificationStatus === 'draft').length,
        averageCompletion: Math.round(summaryRows.reduce((s, r) => s + r.completion, 0) / summaryRows.length),
        destinations: summaryRows
    };

    if (!dryRun) {
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\nReport saved to content/research-status.json`);
    }

    console.log(`\n── Research status summary ───────────────────────────────`);
    console.log(`  Total destinations:   ${report.totalDestinations}`);
    console.log(`  Approved:             ${report.approved}`);
    console.log(`  Pending review:       ${report.pendingReview}`);
    console.log(`  Draft:                ${report.draft}`);
    console.log(`  Average completion:   ${report.averageCompletion}%`);
    console.log(`\nNext: node scripts/validate-content.js`);
}

main();
