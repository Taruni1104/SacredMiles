/**
 * lib/content.js
 *
 * Server-side loader for structured destination content files.
 * Only returns content with verificationStatus === 'approved'.
 * All other statuses (draft, pending_review, rejected) are withheld from
 * the public frontend.
 *
 * This module is imported only by Server Components or API routes.
 * Never import it from a Client Component.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CONTENT_DIR = join(process.cwd(), 'content', 'destinations');

/**
 * Load the approved content record for a destination.
 * Returns null if no file exists or if verificationStatus !== 'approved'.
 */
export function getDestinationContent(id) {
    const filePath = join(CONTENT_DIR, `${id}.json`);
    if (!existsSync(filePath)) return null;

    let record;
    try {
        record = JSON.parse(readFileSync(filePath, 'utf8'));
    } catch {
        return null;
    }

    if (record.verificationStatus !== 'approved') return null;
    return record;
}

/**
 * Load the content record regardless of status.
 * Used only by the review interface (/review) — never by public pages.
 */
export function getDestinationContentForReview(id) {
    const filePath = join(CONTENT_DIR, `${id}.json`);
    if (!existsSync(filePath)) return null;
    try {
        return JSON.parse(readFileSync(filePath, 'utf8'));
    } catch {
        return null;
    }
}

/**
 * Returns all destination content records for the review interface.
 */
export function getAllDestinationContentForReview() {
    if (!existsSync(CONTENT_DIR)) return [];
    const { readdirSync } = require('fs');
    return readdirSync(CONTENT_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => {
            try { return JSON.parse(readFileSync(join(CONTENT_DIR, f), 'utf8')); }
            catch { return null; }
        })
        .filter(Boolean);
}

/**
 * Returns only the usable images from a content record's gallery.
 * "usable" means the image has been reviewed and is licence-compatible.
 */
export function getApprovedGallery(content) {
    if (!content?.gallery) return [];
    return content.gallery.filter(img => img.usable === true && img.thumbUrl && img.fullUrl);
}
