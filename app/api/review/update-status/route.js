/**
 * app/api/review/update-status/route.js
 *
 * Updates the verificationStatus of a destination content file.
 * Only usable during development / internal review — add authentication
 * before deploying to a production environment.
 *
 * POST body: { id: string, action: "approve" | "reject" | "submit" | "revert_to_draft" }
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const CONTENT_DIR = join(process.cwd(), 'content', 'destinations');

const ACTION_STATUS_MAP = {
    approve:        'approved',
    reject:         'rejected',
    submit:         'pending_review',
    revert_to_draft: 'draft'
};

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { id, action } = body || {};

    if (!id || typeof id !== 'string' || !/^[a-z0-9_-]+$/.test(id)) {
        return Response.json({ error: 'Invalid destination id' }, { status: 400 });
    }
    if (!ACTION_STATUS_MAP[action]) {
        return Response.json({ error: `Unknown action "${action}". Valid: approve, reject, submit, revert_to_draft` }, { status: 400 });
    }

    const filePath = join(CONTENT_DIR, `${id}.json`);
    if (!existsSync(filePath)) {
        return Response.json({ error: `Content file not found for "${id}"` }, { status: 404 });
    }

    let record;
    try {
        record = JSON.parse(readFileSync(filePath, 'utf8'));
    } catch {
        return Response.json({ error: 'Failed to read content file' }, { status: 500 });
    }

    const newStatus = ACTION_STATUS_MAP[action];
    record.verificationStatus = newStatus;
    if (action === 'approve') {
        record.lastVerified = new Date().toISOString().slice(0, 10);
    }

    try {
        writeFileSync(filePath, JSON.stringify(record, null, 2) + '\n');
    } catch {
        return Response.json({ error: 'Failed to write content file' }, { status: 500 });
    }

    return Response.json({
        id,
        verificationStatus: newStatus,
        message: `Status updated to "${newStatus}"`
    });
}
