"use client";

import { useState } from 'react';

export default function ReviewActions({ id, currentStatus }) {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const doAction = async (action) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/review/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Update failed');
            setStatus(data.verificationStatus);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column gap-1 w-100">
            {status !== 'approved' && (
                <button
                    className="btn btn-sm btn-success w-100"
                    onClick={() => doAction('approve')}
                    disabled={loading}
                    title="Mark this destination's content as approved for public display"
                >
                    {loading ? '…' : 'Approve'}
                </button>
            )}
            {status !== 'pending_review' && status !== 'approved' && (
                <button
                    className="btn btn-sm btn-warning w-100"
                    onClick={() => doAction('submit')}
                    disabled={loading}
                    title="Submit for review"
                >
                    {loading ? '…' : 'Submit for review'}
                </button>
            )}
            {status !== 'rejected' && (
                <button
                    className="btn btn-sm btn-outline-danger w-100"
                    onClick={() => doAction('reject')}
                    disabled={loading}
                    title="Reject — content will not be shown publicly"
                >
                    {loading ? '…' : 'Reject'}
                </button>
            )}
            {status === 'approved' && (
                <button
                    className="btn btn-sm btn-outline-secondary w-100"
                    onClick={() => doAction('revert_to_draft')}
                    disabled={loading}
                    title="Move back to draft"
                >
                    {loading ? '…' : 'Revert to draft'}
                </button>
            )}
            {error && <div className="small text-danger mt-1">{error}</div>}
        </div>
    );
}
