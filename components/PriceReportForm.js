"use client";

import { useEffect, useMemo, useState } from 'react';
import { getPriceReports, savePriceReports } from '@/lib/storage';
import { createServerPriceReport, getServerPriceReports, isApiConfigured } from '@/lib/api';

const CATEGORIES = ['Darshan or entry ticket', 'Seva or pooja', 'Accommodation', 'Food or prasadam', 'Parking', 'Local transport', 'Guide charges', 'Other'];

export default function PriceReportForm({ destination, estimate }) {
    const [reports, setReports] = useState(() => getPriceReports().filter(report => report.destinationId === destination.id));
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [amount, setAmount] = useState('');
    const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10));
    const [notes, setNotes] = useState('');
    const [receiptReference, setReceiptReference] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(() => isApiConfigured());

    useEffect(() => {
        if (!isApiConfigured()) return;
        getServerPriceReports(destination.id).then(setReports).catch(apiError => setError(apiError.message)).finally(() => setLoading(false));
    }, [destination.id]);

    const comparableReports = useMemo(() => reports.filter(report => report.category === category && report.currency === 'INR'), [category, reports]);
    const median = comparableReports.length
        ? [...comparableReports].sort((a, b) => a.amount - b.amount)[Math.floor(comparableReports.length / 2)].amount
        : null;

    const submitReport = async (event) => {
        event.preventDefault();
        setError('');
        const numericAmount = Number(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0 || !visitDate) {
            setMessage('Enter a valid amount and visit date.');
            return;
        }

        const report = {
            id: `price-${Date.now()}`,
            destinationId: destination.id,
            category,
            amount: Math.round(numericAmount),
            currency: 'INR',
            visitDate,
            notes: notes.trim(),
            receiptReference: receiptReference.trim(),
            submittedAt: new Date().toISOString(),
            status: 'pending',
            verificationMethod: null,
            reviewer: null
        };
        if (isApiConfigured()) {
            try {
                await createServerPriceReport({
                    destinationId: report.destinationId,
                    category: report.category,
                    amount: report.amount,
                    currency: report.currency,
                    visitDate: report.visitDate,
                    notes: report.notes,
                    receiptReference: report.receiptReference
                });
                setReports(await getServerPriceReports(destination.id));
            } catch (apiError) {
                setError(apiError.message);
                return;
            }
        } else {
            const allReports = getPriceReports();
            savePriceReports([...allReports, report]);
            setReports(current => [...current, report]);
        }
        setAmount('');
        setNotes('');
        setReceiptReference('');
        setMessage('Saved as user-reported and pending review. It is not an official price.');
    };

    return (
        <section className="border-top pt-4 mb-5">
            <h2 className="h4">Report an Actual Price</h2>
            <p className="text-secondary">Share what you paid so future travelers have a more realistic starting point. Reports remain user-reported until reviewed and never replace official pricing.</p>
            {loading && <div className="alert alert-info">Loading your reports…</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                    <form onSubmit={submitReport} className="row g-3">
                        <div className="col-12 col-md-6"><label className="form-label" htmlFor={`price-category-${destination.id}`}>Category</label><select id={`price-category-${destination.id}`} className="form-select" value={category} onChange={(event) => setCategory(event.target.value)}>{CATEGORIES.map(item => <option key={item}>{item}</option>)}</select></div>
                        <div className="col-6 col-md-3"><label className="form-label" htmlFor={`price-amount-${destination.id}`}>Amount (INR)</label><input id={`price-amount-${destination.id}`} className="form-control" type="number" min="1" step="1" required value={amount} onChange={(event) => setAmount(event.target.value)} /></div>
                        <div className="col-6 col-md-3"><label className="form-label" htmlFor={`price-date-${destination.id}`}>Visit date</label><input id={`price-date-${destination.id}`} className="form-control" type="date" required value={visitDate} onChange={(event) => setVisitDate(event.target.value)} /></div>
                        <div className="col-12"><label className="form-label" htmlFor={`price-notes-${destination.id}`}>Notes (optional)</label><textarea id={`price-notes-${destination.id}`} className="form-control" rows="2" value={notes} onChange={(event) => setNotes(event.target.value)} /></div>
                        <div className="col-12"><label className="form-label" htmlFor={`price-receipt-${destination.id}`}>Receipt reference (optional)</label><input id={`price-receipt-${destination.id}`} className="form-control" type="text" placeholder="Private note or reference; do not upload sensitive documents" value={receiptReference} onChange={(event) => setReceiptReference(event.target.value)} /></div>
                        <div className="col-12"><button className="btn btn-forest" type="submit">Submit user report</button></div>
                    </form>
                    {message && <div className="alert alert-info mt-3 mb-0">{message}</div>}
                </div>
            </div>
            <div className="small text-secondary">
                <div>Current planning estimate: <strong>₹{estimate.toLocaleString('en-IN')}</strong> (provisional)</div>
                <div>User reports for this category: <strong>{comparableReports.length}</strong>{median !== null && <> · Median reported amount: <strong>₹{median.toLocaleString('en-IN')}</strong></>}</div>
                {reports.length > 0 && <div className="mt-2">All submitted reports are labeled <span className="badge text-bg-light">User-reported · pending review</span>.</div>}
            </div>
        </section>
    );
}
