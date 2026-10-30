/**
 * app/review/page.js
 *
 * Destination content review dashboard.
 * Server Component — reads content files at request time.
 * Shows all destinations regardless of verification status.
 * Approve/reject actions are handled by the API route.
 *
 * This page is intentionally NOT protected by AuthGate so it can be used
 * during development. Before deploying to production, add authentication.
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import Link from 'next/link';
import ReviewActions from './ReviewActions';

const CONTENT_DIR = join(process.cwd(), 'content', 'destinations');

function loadAllRecords() {
    if (!existsSync(CONTENT_DIR)) return [];
    return readdirSync(CONTENT_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => {
            try { return JSON.parse(readFileSync(join(CONTENT_DIR, f), 'utf8')); }
            catch { return null; }
        })
        .filter(Boolean)
        .sort((a, b) => {
            const order = { pending_review: 0, draft: 1, approved: 2, rejected: 3 };
            return (order[a.verificationStatus] ?? 9) - (order[b.verificationStatus] ?? 9);
        });
}

function completionPercent(record) {
    const fields = ['overview', 'historicalBackground', 'religiousSignificance', 'architecture', 'ritualsAndFestivals'];
    let done = 0;
    for (const f of fields) {
        const v = record[f];
        if (v && (typeof v === 'string' ? v.trim() : v.text?.trim())) done++;
    }
    if (record.gallery?.length > 0) done++;
    if (record.visitorInformation?.openingHours?.summary?.trim()) done++;
    if (record.howToReach?.nearestAirport?.name?.trim()) done++;
    return Math.round((done / 8) * 100);
}

const STATUS_BADGE = {
    draft:          { label: 'Draft',          cls: 'bg-secondary' },
    pending_review: { label: 'Pending review',  cls: 'bg-warning text-dark' },
    approved:       { label: 'Approved',        cls: 'bg-success' },
    rejected:       { label: 'Rejected',        cls: 'bg-danger' }
};

export default function ReviewPage() {
    const records = loadAllRecords();

    const counts = {
        total: records.length,
        approved: records.filter(r => r.verificationStatus === 'approved').length,
        pending: records.filter(r => r.verificationStatus === 'pending_review').length,
        draft: records.filter(r => r.verificationStatus === 'draft').length,
        rejected: records.filter(r => r.verificationStatus === 'rejected').length
    };

    return (
        <main className="container py-5">
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
                <div>
                    <p className="section-label">Internal tool</p>
                    <h1 className="display-5 mb-1">Content Review</h1>
                    <p className="text-secondary mb-0">Only approved records appear on public destination pages.</p>
                </div>
                <Link href="/" className="btn btn-outline-forest">← Back to site</Link>
            </div>

            {/* Summary stats */}
            <div className="row g-3 mb-5">
                {[
                    { label: 'Total', value: counts.total, cls: 'text-dark' },
                    { label: 'Approved', value: counts.approved, cls: 'text-success' },
                    { label: 'Pending review', value: counts.pending, cls: 'text-warning' },
                    { label: 'Draft', value: counts.draft, cls: 'text-secondary' },
                    { label: 'Rejected', value: counts.rejected, cls: 'text-danger' }
                ].map(stat => (
                    <div className="col-6 col-md-4 col-lg-2" key={stat.label}>
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body text-center">
                                <div className={`display-6 fw-bold ${stat.cls}`}>{stat.value}</div>
                                <div className="small text-secondary">{stat.label}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {records.length === 0 ? (
                <div className="alert alert-light border">
                    No content files found in <code>content/destinations/</code>.
                    Run <code>node scripts/generate-stubs.js</code> to create stub files.
                </div>
            ) : (
                <div className="vstack gap-3">
                    {records.map(record => {
                        const badge = STATUS_BADGE[record.verificationStatus] || STATUS_BADGE.draft;
                        const pct = completionPercent(record);
                        const usableImages = record.gallery?.filter(img => img.usable).length || 0;
                        const totalImages = record.gallery?.length || 0;
                        const verifiedSources = record.sources?.filter(s => s.verificationStatus === 'verified' || s.verificationStatus === 'partially_verified').length || 0;

                        return (
                            <article className="card border-0 shadow-sm" key={record.id}>
                                <div className="card-body">
                                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                                        <div className="flex-grow-1">
                                            <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                                                <h2 className="h5 mb-0">{record.name}</h2>
                                                <span className={`badge ${badge.cls}`}>{badge.label}</span>
                                                <span className="badge text-bg-light">{record.category}</span>
                                                <span className="badge text-bg-light">{record.state}</span>
                                            </div>
                                            <p className="small text-secondary mb-2">
                                                {record.overview?.trim() ? record.overview.slice(0, 120) + (record.overview.length > 120 ? '…' : '') : <em>No overview written yet.</em>}
                                            </p>

                                            {/* Progress bars */}
                                            <div className="row g-2 small">
                                                <div className="col-12 col-md-4">
                                                    <div className="text-secondary mb-1">Content {pct}%</div>
                                                    <div className="progress" style={{ height: '6px' }}>
                                                        <div className={`progress-bar ${pct >= 80 ? 'bg-success' : pct >= 40 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${pct}%` }} />
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-4">
                                                    <div className="text-secondary">
                                                        Images: <strong>{usableImages}/{totalImages}</strong> usable
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-4">
                                                    <div className="text-secondary">
                                                        Sources: <strong>{verifiedSources}/{record.sources?.length || 0}</strong> verified
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Missing fields */}
                                            {pct < 100 && (
                                                <div className="mt-2 small text-secondary">
                                                    {!record.overview?.trim() && <span className="badge text-bg-light me-1">overview</span>}
                                                    {!record.historicalBackground?.text?.trim() && <span className="badge text-bg-light me-1">history</span>}
                                                    {!record.religiousSignificance?.text?.trim() && <span className="badge text-bg-light me-1">significance</span>}
                                                    {!record.architecture?.text?.trim() && <span className="badge text-bg-light me-1">architecture</span>}
                                                    {!record.ritualsAndFestivals?.text?.trim() && <span className="badge text-bg-light me-1">rituals</span>}
                                                    {totalImages === 0 && <span className="badge text-bg-light me-1">images</span>}
                                                    {!record.visitorInformation?.openingHours?.summary?.trim() && <span className="badge text-bg-light me-1">hours</span>}
                                                    {!record.howToReach?.nearestAirport?.name?.trim() && <span className="badge text-bg-light me-1">how-to-reach</span>}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="d-flex flex-column gap-2 align-items-end" style={{ minWidth: '9rem' }}>
                                            <Link href={`/destinations/${record.id}`} className="btn btn-sm btn-outline-forest w-100" target="_blank">
                                                Preview ↗
                                            </Link>
                                            <ReviewActions id={record.id} currentStatus={record.verificationStatus} />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            <footer className="mt-5 pt-4 border-top">
                <p className="small text-secondary mb-1">Pipeline commands:</p>
                <div className="d-flex flex-wrap gap-2">
                    {[
                        'node scripts/generate-stubs.js',
                        'node scripts/collect-images.js',
                        'node scripts/collect-research.js',
                        'node scripts/validate-content.js'
                    ].map(cmd => (
                        <code key={cmd} className="border rounded px-2 py-1 small bg-light">{cmd}</code>
                    ))}
                </div>
            </footer>
        </main>
    );
}
