"use client";

import { useState } from 'react';
import Link from 'next/link';
import { calculateTripBudget } from '@/lib/budget/calculate-budget';

function readItinerary() {
    try {
        return typeof window === 'undefined' ? [] : JSON.parse(window.localStorage.getItem('yatra-itinerary') || '[]');
    } catch (error) {
        console.error('Unable to load itinerary for budget:', error);
        return [];
    }
}

export default function BudgetPage() {
    const [itinerary] = useState(readItinerary);
    const [travelers, setTravelers] = useState(1);
    const [contingencyRate, setContingencyRate] = useState(0.1);
    const budget = calculateTripBudget(itinerary, { travelers, contingencyRate });

    return (
        <main className="container py-5">
            <header className="mb-5">
                <p className="section-label">Transparent planning</p>
                <h1 className="display-5">Trip budget</h1>
                <p className="text-secondary">A local estimate derived from your saved itinerary. Missing prices are identified instead of being presented as quotes.</p>
            </header>
            {itinerary.length === 0 ? <div className="alert alert-light border">Generate an itinerary in the <Link href="/planner">Planner</Link> before reviewing a budget.</div> : (
                <>
                    <div className="row g-3 mb-4">
                        <div className="col-12 col-md-6"><label className="form-label" htmlFor="budget-travelers">Travelers</label><input id="budget-travelers" className="form-control" type="number" min="1" value={travelers} onChange={(event) => setTravelers(Number(event.target.value) || 1)} /></div>
                        <div className="col-12 col-md-6"><label className="form-label" htmlFor="budget-contingency">Contingency</label><select id="budget-contingency" className="form-select" value={contingencyRate} onChange={(event) => setContingencyRate(Number(event.target.value))}><option value="0">None</option><option value="0.1">10%</option><option value="0.15">15%</option><option value="0.2">20%</option></select></div>
                    </div>
                    <div className="row g-3 mb-4">
                        <div className="col-6 col-lg-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><div className="small text-secondary">Estimated total</div><strong>₹{budget.total.toLocaleString('en-IN')}</strong></div></div></div>
                        <div className="col-6 col-lg-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><div className="small text-secondary">Per traveler</div><strong>₹{budget.perTraveler.toLocaleString('en-IN')}</strong></div></div></div>
                        <div className="col-6 col-lg-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><div className="small text-secondary">Average daily</div><strong>₹{budget.averageDaily.toLocaleString('en-IN')}</strong></div></div></div>
                        <div className="col-6 col-lg-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><div className="small text-secondary">Contingency</div><strong>₹{budget.contingency.toLocaleString('en-IN')}</strong></div></div></div>
                    </div>
                    <section className="card border-0 shadow-sm mb-4"><div className="card-body"><h2 className="h4">Cost breakdown</h2>{budget.items.map(item => <div className="d-flex justify-content-between border-bottom py-3" key={item.category}><span>{item.category}<small className="d-block text-secondary">{item.name} · {item.status}{item.optional ? ' · optional' : ''}</small></span><strong>₹{item.amount.toLocaleString('en-IN')}</strong></div>)}<div className="d-flex justify-content-between pt-3"><strong>Contingency reserve</strong><strong>₹{budget.contingency.toLocaleString('en-IN')}</strong></div></div></section>
                    <div className="alert alert-warning"><strong>What is missing:</strong> {budget.missingCategories.join(', ')}. {budget.assumptions}</div>
                </>
            )}
        </main>
    );
}
