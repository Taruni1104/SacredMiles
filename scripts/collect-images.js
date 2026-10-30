#!/usr/bin/env node
/**
 * scripts/collect-images.js
 *
 * Fetches image metadata from the Wikimedia Commons API for each destination
 * that has an empty gallery. Never invents URLs or attribution.
 *
 * What it does:
 *   1. Reads content/destinations/<id>.json
 *   2. Searches Wikimedia Commons for the destination name
 *   3. For each result, fetches image info (url, thumb, author, licence)
 *   4. Adds entries to the gallery array with usable=false until manually
 *      reviewed and approved
 *   5. Writes the updated JSON back
 *
 * What it does NOT do:
 *   - Mark any image usable=true automatically
 *   - Download image files
 *   - Override an existing gallery entry
 *   - Make more than 1 request/second (rate limit)
 *
 * Usage:
 *   node scripts/collect-images.js
 *   node scripts/collect-images.js --destination kashi
 *   node scripts/collect-images.js --dry-run
 *   node scripts/collect-images.js --limit 5
 *
 * No API key required for Wikimedia Commons search.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ── Config ───────────────────────────────────────────────────────────────────
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'destinations');
const THUMB_SIZE = 640;
const DEFAULT_LIMIT = 8;    // images per destination
const RATE_LIMIT_MS = 1100; // Wikimedia asks for ≥1 s between requests
const USER_AGENT = 'SacredMiles/1.0 (content pipeline; contact: maintainer@sacredmiles.example)';

// ── Helpers ──────────────────────────────────────────────────────────────────
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function httpsGet(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'application/json'
            }
        };
        https.get(url, options, res => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch (e) { reject(new Error(`JSON parse error for ${url}: ${e.message}`)); }
            });
        }).on('error', reject);
    });
}

/**
 * Search Wikimedia Commons for images matching a query.
 * Returns an array of page titles (e.g. "File:Kashi_Vishwanath_Temple.jpg").
 */
async function searchCommons(query, limit) {
    const encoded = encodeURIComponent(query);
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srsearch=${encoded}&srlimit=${limit}&format=json`;
    const result = await httpsGet(url);
    return (result.query?.search || []).map(r => r.title);
}

/**
 * Fetch image metadata for a list of File: page titles.
 * Returns an array of GalleryImage objects (usable=false by default).
 */
async function fetchImageInfo(titles) {
    if (titles.length === 0) return [];
    const titlesParam = encodeURIComponent(titles.join('|'));
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${titlesParam}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=${THUMB_SIZE}&format=json`;
    const result = await httpsGet(url);
    const pages = result.query?.pages || {};
    const images = [];

    for (const page of Object.values(pages)) {
        if (page.missing !== undefined) continue;
        const info = page.imageinfo?.[0];
        if (!info) continue;

        const meta = info.extmetadata || {};
        const license = meta.LicenseShortName?.value || '';
        const author = meta.Artist?.value?.replace(/<[^>]+>/g, '').trim() || null;
        const licenseUrl = meta.LicenseUrl?.value || null;

        // Only include images with a recognised free licence
        const FREE_LICENCE_PREFIXES = ['CC BY', 'CC0', 'Public domain', 'pd-'];
        const isFreeLicence = FREE_LICENCE_PREFIXES.some(prefix =>
            license.toUpperCase().startsWith(prefix.toUpperCase())
        );

        images.push({
            wikimediaFile: page.title,
            thumbUrl: info.thumburl || null,
            fullUrl: info.url || null,
            filePageUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title).replace(/%3A/g, ':')}`,
            title: meta.ObjectName?.value || page.title.replace('File:', ''),
            author,
            license: license || null,
            licenseUrl,
            attributionRequired: isFreeLicence && license.toUpperCase() !== 'PUBLIC DOMAIN' && !license.toUpperCase().includes('CC0'),
            usable: false, // always false until a human reviewer approves
            notes: isFreeLicence
                ? 'Licence appears compatible — requires human review before use.'
                : `Licence "${license}" may not permit reuse — do not mark usable without legal review.`
        });
    }
    return images;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const singleId = args.includes('--destination') ? args[args.indexOf('--destination') + 1] : null;
    const limitArg = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) : DEFAULT_LIMIT;

    if (!fs.existsSync(CONTENT_DIR)) {
        console.error('ERROR: content/destinations/ not found. Run generate-stubs.js first.');
        process.exit(1);
    }

    const files = fs.readdirSync(CONTENT_DIR)
        .filter(f => f.endsWith('.json'))
        .filter(f => singleId ? f === `${singleId}.json` : true);

    if (files.length === 0) {
        console.error('No matching content files found.');
        process.exit(1);
    }

    console.log(`\nSacredMiles — Wikimedia image collector`);
    console.log(`Processing ${files.length} destination(s), up to ${limitArg} images each.\n`);

    const report = [];

    for (const file of files) {
        const filePath = path.join(CONTENT_DIR, file);
        const record = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const id = record.id;

        // Skip if gallery already has entries
        if (record.gallery && record.gallery.length > 0) {
            console.log(`  SKIP  ${id}  (gallery already has ${record.gallery.length} entries)`);
            report.push({ id, status: 'skipped', reason: 'gallery exists', count: record.gallery.length });
            continue;
        }

        console.log(`  FETCH ${id}  (${record.name})`);

        try {
            const searchTerms = [record.name, ...(record.alternativeNames || []).slice(0, 1)];
            const primaryQuery = searchTerms[0];

            await sleep(RATE_LIMIT_MS);
            const titles = await searchCommons(primaryQuery, limitArg);

            if (titles.length === 0) {
                console.log(`    → No results for "${primaryQuery}"`);
                report.push({ id, status: 'no_results', query: primaryQuery, count: 0 });
                continue;
            }

            await sleep(RATE_LIMIT_MS);
            const images = await fetchImageInfo(titles.slice(0, limitArg));

            console.log(`    → Found ${images.length} image(s) (all marked usable=false)`);
            report.push({ id, status: 'fetched', count: images.length });

            if (!dryRun) {
                record.gallery = images;
                fs.writeFileSync(filePath, JSON.stringify(record, null, 2) + '\n');
            } else {
                console.log(`    (dry-run — not written)`);
            }

        } catch (err) {
            console.error(`    ERROR ${id}: ${err.message}`);
            report.push({ id, status: 'error', error: err.message });
        }
    }

    // ── Summary ───────────────────────────────────────────────────────────────
    console.log('\n── Image collection report ──────────────────────────────');
    const fetched = report.filter(r => r.status === 'fetched');
    const skipped = report.filter(r => r.status === 'skipped');
    const noResults = report.filter(r => r.status === 'no_results');
    const errors = report.filter(r => r.status === 'error');

    console.log(`  Fetched images:     ${fetched.length} destinations (${fetched.reduce((s, r) => s + r.count, 0)} images total)`);
    console.log(`  Skipped (existing): ${skipped.length}`);
    console.log(`  No results found:   ${noResults.length}`);
    console.log(`  Errors:             ${errors.length}`);
    if (errors.length > 0) errors.forEach(e => console.log(`    ${e.id}: ${e.error}`));

    console.log('\nIMPORTANT: All collected images are marked usable=false.');
    console.log('A human reviewer must check licence compatibility and mark images usable=true');
    console.log('via the review interface at /review before they appear on destination pages.');

    // Write machine-readable report
    const reportPath = path.join(__dirname, '..', 'content', 'image-collection-report.json');
    if (!dryRun) {
        fs.writeFileSync(reportPath, JSON.stringify({ generatedAt: new Date().toISOString(), report }, null, 2));
        console.log(`\nReport saved to content/image-collection-report.json`);
    }
}

main().catch(err => {
    console.error('FATAL:', err);
    process.exit(1);
});
