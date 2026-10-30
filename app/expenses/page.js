"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { DESTINATIONS_DB } from '@/lib/data';
import { getExpenses, saveExpenses } from '@/lib/storage';
import { createServerExpense, deleteServerExpense, getServerExpenses, isApiConfigured, updateServerExpense } from '@/lib/api';
import { calculateTripBudget } from '@/lib/budget/calculate-budget';

// Local timezone date to avoid UTC rollback in IST (UTC+5:30)
function getLocalToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const CATEGORIES = ['Intercity transport', 'Local transport', 'Accommodation', 'Food and water', 'Darshan and entry tickets', 'Seva and pooja', 'Shopping and prasadam', 'Parking and tolls', 'Guide fees', 'Miscellaneous'];

function readPlan() {
    try {
        return typeof window === 'undefined' ? [] : JSON.parse(window.localStorage.getItem('yatra-itinerary') || '[]');
    } catch (error) {
        console.error('Unable to load itinerary for expenses:', error);
        return [];
    }
}

function downloadCsv(expenses) {
    const header = ['Title', 'Amount', 'Currency', 'Category', 'Destination', 'Date', 'Notes'];
    const rows = expenses.map(expense => [expense.title, expense.amount, expense.currency, expense.category, expense.destinationName || '', expense.date, expense.notes || '']);
    const csv = [header, ...rows].map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'yatra-expenses.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}

export default function ExpensesPage() {
    const itinerary = useMemo(() => readPlan(), []);
    const [expenses, setExpenses] = useState(() => getExpenses());
    const [isLoading, setIsLoading] = useState(() => isApiConfigured());
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [form, setForm] = useState({ title: '', amount: '', category: CATEGORIES[0], destinationId: '', date: getLocalToday(), notes: '' });
    const [editingId, setEditingId] = useState(null);
    const budget = useMemo(() => {
        // Derive the planned budget from the saved itinerary so it stays in
        // sync with whatever was generated in the Planner.
        if (itinerary.length === 0) return 0;
        return calculateTripBudget(itinerary).total;
    }, [itinerary]);
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = budget - total;
    const categoryTotals = expenses.reduce((totals, expense) => ({ ...totals, [expense.category]: (totals[expense.category] || 0) + expense.amount }), {});

    useEffect(() => {
        if (!isApiConfigured()) return;
        getServerExpenses().then(serverExpenses => {
            setExpenses(serverExpenses);
            setIsLoading(false);
        }).catch(apiError => {
            setError(apiError.message);
            setIsLoading(false);
        });
    }, []);

    const submitExpense = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');
        const amount = Number(form.amount);
        if (!form.title.trim() || !Number.isFinite(amount) || amount <= 0 || !form.date) return;
        const destination = DESTINATIONS_DB.find(item => item.id === form.destinationId);
        const expense = { ...form, id: editingId || `expense-${Date.now()}`, title: form.title.trim(), amount: Math.round(amount), currency: 'INR', destinationName: destination?.name || '', createdAt: editingId ? expenses.find(item => item.id === editingId)?.createdAt : new Date().toISOString() };
        if (isApiConfigured()) {
            try {
                if (editingId) await updateServerExpense(expense);
                else await createServerExpense(expense);
                setExpenses(await getServerExpenses());
                setMessage(editingId ? 'Expense updated.' : 'Expense saved to your account.');
            } catch (apiError) {
                setError(apiError.message);
                return;
            }
        } else {
            const next = editingId ? expenses.map(item => item.id === editingId ? expense : item) : [expense, ...expenses];
            setExpenses(next);
            saveExpenses(next);
        }
        setEditingId(null);
        setForm(current => ({ ...current, title: '', amount: '', notes: '' }));
    };

    const removeExpense = async (id) => {
        if (!window.confirm('Delete this expense?')) return;
        try {
            if (isApiConfigured()) {
                await deleteServerExpense(id);
            }
            const next = expenses.filter(expense => expense.id !== id);
            setExpenses(next);
            if (!isApiConfigured()) saveExpenses(next);
        } catch (apiError) {
            setError(apiError.message);
        }
    };

    const editExpense = (expense) => {
        setEditingId(expense.id);
        setForm({ title: expense.title, amount: String(expense.amount), category: expense.category, destinationId: expense.destinationId || '', date: expense.date, notes: expense.notes || '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="container py-5">
            <header className="mb-5"><p className="section-label">Experience, accounted for</p><h1 className="display-5">Keep the memories. Stay mindful.</h1><p className="text-secondary">{isApiConfigured() ? 'Your expenses are connected to your SacredMiles account.' : 'Local prototype mode: expenses stay in this browser and do not sync across devices.'}</p>{isLoading && <div className="alert alert-info mt-3">Loading your saved expenses…</div>}{error && <div className="alert alert-danger mt-3">{error}</div>}{message && <div className="alert alert-success mt-3">{message}</div>}</header>
            <div className="row g-3 mb-4">
                <div className="col-6 col-lg-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><div className="small text-secondary">Actual spent</div><strong>₹{total.toLocaleString('en-IN')}</strong></div></div></div>
                <div className="col-6 col-lg-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><div className="small text-secondary">Planned budget</div><strong>₹{budget.toLocaleString('en-IN')}</strong></div></div></div>
                <div className="col-6 col-lg-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><div className="small text-secondary">{remaining < 0 ? 'Over budget' : 'Remaining'}</div><strong className={remaining < 0 ? 'text-danger' : ''}>₹{Math.abs(remaining).toLocaleString('en-IN')}</strong></div></div></div>
                <div className="col-6 col-lg-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><div className="small text-secondary">Transactions</div><strong>{expenses.length}</strong></div></div></div>
            </div>
            {remaining < 0 && <div className="alert alert-danger">Your recorded spending is ₹{Math.abs(remaining).toLocaleString('en-IN')} over the planned budget.</div>}
            <section className="card border-0 shadow-sm mb-4"><div className="card-body"><h2 className="h4">{editingId ? 'Edit expense' : 'Add expense'}</h2><form onSubmit={submitExpense} className="row g-3"><div className="col-12 col-md-4"><label className="form-label" htmlFor="expense-title">Title</label><input id="expense-title" className="form-control" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></div><div className="col-6 col-md-2"><label className="form-label" htmlFor="expense-amount">Amount (INR)</label><input id="expense-amount" className="form-control" type="number" min="1" required value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} /></div><div className="col-6 col-md-3"><label className="form-label" htmlFor="expense-category">Category</label><select id="expense-category" className="form-select" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{CATEGORIES.map(category => <option key={category}>{category}</option>)}</select></div><div className="col-6 col-md-3"><label className="form-label" htmlFor="expense-date">Date</label><input id="expense-date" className="form-control" type="date" required max={getLocalToday()} value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></div><div className="col-12 col-md-6"><label className="form-label" htmlFor="expense-destination">Destination (optional)</label><select id="expense-destination" className="form-select" value={form.destinationId} onChange={(event) => setForm({ ...form, destinationId: event.target.value })}><option value="">Not linked to a destination</option>{DESTINATIONS_DB.map(destination => <option key={destination.id} value={destination.id}>{destination.name}</option>)}</select></div><div className="col-12 col-md-6"><label className="form-label" htmlFor="expense-notes">Notes (optional)</label><input id="expense-notes" className="form-control" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></div><div className="col-12"><button className="btn btn-forest" type="submit">{editingId ? 'Save changes' : 'Add expense'}</button>{editingId && <button className="btn btn-link" type="button" onClick={() => { setEditingId(null); setForm({ title: '', amount: '', category: CATEGORIES[0], destinationId: '', date: getLocalToday(), notes: '' }); }}>Cancel</button>}<button className="btn btn-outline-forest ms-2" type="button" onClick={() => downloadCsv(expenses)} disabled={expenses.length === 0}>Export CSV</button></div></form></div></section>
            {expenses.length === 0 ? <div className="alert alert-light border">No expenses recorded yet. Add your first expense above.</div> : <section><h2 className="h4">Recent expenses</h2><div className="vstack gap-2 mb-4">{expenses.map(expense => <article className="card border-0 shadow-sm" key={expense.id}><div className="card-body d-flex justify-content-between gap-3"><div><strong>{expense.title}</strong><div className="small text-secondary">{expense.date} · {expense.category}{expense.destinationName ? ` · ${expense.destinationName}` : ''}</div></div><div className="text-end"><strong>₹{expense.amount.toLocaleString('en-IN')}</strong><div><button className="btn btn-link btn-sm p-0 me-2" type="button" onClick={() => editExpense(expense)}>Edit</button><button className="btn btn-link btn-sm text-danger p-0" type="button" onClick={() => removeExpense(expense.id)}>Delete</button></div></div></div></article>)}</div><h2 className="h4">Category totals</h2>{Object.entries(categoryTotals).map(([category, amount]) => <div className="d-flex justify-content-between border-bottom py-2" key={category}><span>{category}</span><strong>₹{amount.toLocaleString('en-IN')}</strong></div>)}</section>}
            {itinerary.length === 0 && <p className="small text-secondary mt-4">No itinerary is saved yet. Your actual expenses can still be recorded independently; create a plan in the <Link href="/planner">Planner</Link> when ready.</p>}
        </main>
    );
}
