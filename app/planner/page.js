"use client";

import { useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { buildItinerary } from '@/lib/planner/engine';
import { DESTINATIONS_DB } from '@/lib/data';
import ItineraryTimeline from '@/components/features/ItineraryTimeline';
import { getTransportProviderLinks } from '@/lib/transport/provider-links';
import {
    Calendar, MapPin, Sparkles, Settings, CheckCircle2, Loader2,
    Users, Wallet, Train, Hotel, ArrowLeft, ChevronDown, ChevronUp,
    AlertTriangle, Info
} from 'lucide-react';

// ── Utilities ─────────────────────────────────────────────────────────────────

function getLocalToday() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function fmt(n) { return Math.round(n).toLocaleString('en-IN'); }

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
    return <div className="small text-secondary fw-semibold text-uppercase mb-1" style={{ letterSpacing: '0.08em', fontSize: '0.7rem' }}>{children}</div>;
}

function FormRow({ label, htmlFor, children, hint }) {
    return (
        <div>
            <label className="form-label mb-1 d-flex align-items-center gap-1 small fw-semibold" htmlFor={htmlFor}>{label}</label>
            {children}
            {hint && <div className="small text-secondary mt-1">{hint}</div>}
        </div>
    );
}

function BudgetSummaryCard({ budget, meta }) {
    const [expanded, setExpanded] = useState(false);
    if (!budget) return null;
    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                    <div>
                        <p className="section-label mb-0">Estimated budget</p>
                        <div className="d-flex align-items-baseline gap-2 mt-1">
                            <span className="h3 mb-0">₹{fmt(budget.perPerson.total)}</span>
                            <span className="text-secondary small">per person</span>
                        </div>
                        {budget.travellers > 1 && (
                            <div className="small text-secondary mt-1">₹{fmt(budget.group.total)} total for {budget.travellers} travellers</div>
                        )}
                    </div>
                    <button className="btn btn-sm btn-outline-forest" onClick={() => setExpanded(e => !e)}>
                        {expanded ? <><ChevronUp size={14} className="me-1" />Hide breakdown</> : <><ChevronDown size={14} className="me-1" />Show breakdown</>}
                    </button>
                </div>

                {/* Quick stats */}
                <div className="row g-2 mb-2">
                    {[
                        { label: 'Transport',     val: `₹${fmt(budget.perPerson.transport)}` },
                        { label: 'Accommodation', val: `₹${fmt(budget.perPerson.accommodation)}` },
                        { label: 'Food',          val: `₹${fmt(budget.perPerson.food)}` },
                        { label: 'Darshan',       val: `₹${fmt(budget.perPerson.darshan)}` }
                    ].map(stat => (
                        <div className="col-6 col-md-3" key={stat.label}>
                            <div className="border rounded-3 p-2 text-center">
                                <div className="small text-secondary">{stat.label}</div>
                                <strong className="small">{stat.val}</strong>
                            </div>
                        </div>
                    ))}
                </div>

                {expanded && (
                    <div className="mt-3">
                        <table className="table table-sm small mb-2">
                            <thead><tr><th>Category</th><th className="text-end">Per person</th><th className="text-end">Group</th><th>Notes</th></tr></thead>
                            <tbody>
                                {budget.breakdown.map(row => (
                                    <tr key={row.category}>
                                        <td>{row.category}</td>
                                        <td className="text-end">₹{fmt(row.perPerson)}</td>
                                        <td className="text-end">₹{fmt(row.group)}</td>
                                        <td className="text-secondary">{row.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <p className="small text-secondary mb-0 mt-2" style={{ fontSize: '0.72rem' }}>
                    <Info size={12} className="me-1" />{budget.disclaimer}
                </p>
            </div>
        </div>
    );
}

function MetaSummaryCard({ meta, warnings }) {
    if (!meta) return null;
    return (
        <div className="vstack gap-3">
            {/* Stats row */}
            <div className="card border-0 shadow-sm">
                <div className="card-body d-flex flex-wrap gap-4 align-items-center">
                    <div className="planner-stat"><div className="planner-stat-label">Days</div><strong>{meta.totalDays}</strong></div>
                    <div className="planner-stat"><div className="planner-stat-label">Destinations</div><strong>{meta.destinationCount}</strong></div>
                    <div className="planner-stat"><div className="planner-stat-label">Distance</div><strong>~{fmt(meta.totalDistanceKm)} km</strong></div>
                    <div className="planner-stat"><div className="planner-stat-label">Pace</div><strong className="text-capitalize">{meta.pace}</strong></div>
                    <div className="planner-stat"><div className="planner-stat-label">Travel mode</div><strong className="text-capitalize">{meta.travelMode}</strong></div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="alert alert-light border small mb-0">
                <Info size={14} className="me-1" />
                {meta.disclaimer}
            </div>

            {/* Warnings */}
            {warnings && warnings.length > 0 && warnings.map((w, i) => (
                <div className="alert alert-warning border small mb-0" key={i}>
                    <AlertTriangle size={14} className="me-1" />{w.message}
                    {w.excluded?.length > 0 && (
                        <ul className="mb-0 mt-1 ps-3">
                            {w.excluded.map(e => <li key={e.name}><strong>{e.name}</strong> — {e.reason}</li>)}
                        </ul>
                    )}
                </div>
            ))}

            {/* Excluded destinations */}
            {meta.excludedDestinations?.length > 0 && (
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <h3 className="h6 mb-2">Destinations not included ({meta.excludedDestinations.length})</h3>
                        <p className="small text-secondary mb-2">These destinations were available but couldn't fit in your selected duration.</p>
                        <div className="d-flex flex-wrap gap-2">
                            {meta.excludedDestinations.map(d => (
                                <span key={d.name} className="badge text-bg-light" title={d.reason}>{d.name}</span>
                            ))}
                        </div>
                        {meta.extensionPlan?.length > 0 && (
                            <p className="small text-secondary mt-2 mb-0">
                                Extend your trip by {Math.ceil(meta.extensionPlan.length * 1.5)} more days to include these destinations.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main planner form ─────────────────────────────────────────────────────────

function PlannerContent() {
    const searchParams = useSearchParams();
    const planRef = useRef(null);

    const states = ['All India', ...new Set(DESTINATIONS_DB.map(d => d.state))].sort();

    // ── Form state ────────────────────────────────────────────────────────────
    const [startingCity,      setStartingCity]      = useState('');
    const [state,             setState]             = useState('All India');
    const [startDate,         setStartDate]         = useState(getLocalToday);
    const [days,              setDays]              = useState(7);
    const [travellers,        setTravellers]        = useState(1);
    const [travelMode,        setTravelMode]        = useState('mixed');
    const [accommodation,     setAccommodation]     = useState('standard');
    const [tripType,          setTripType]          = useState(searchParams.get('type') || 'balanced');
    const [pace,              setPace]              = useState('balanced');
    const [includeReturn,     setIncludeReturn]     = useState(false);
    const [allowNearby,       setAllowNearby]       = useState(false);
    const [contingencyRate,   setContingencyRate]   = useState(10);

    // ── Output state ──────────────────────────────────────────────────────────
    const [result,        setResult]        = useState(null);  // ItineraryResult
    const [itinerary,     setItinerary]     = useState(() => {
        try {
            if (typeof window === 'undefined') return [];
            const raw = window.localStorage.getItem('yatra-itinerary');
            return raw ? JSON.parse(raw) : [];
        } catch { return []; }
    });
    const [isGenerating,  setIsGenerating]  = useState(false);
    const [justGenerated, setJustGenerated] = useState(false);
    const [isSaved,       setIsSaved]       = useState(false);

    // ── Generate handler ──────────────────────────────────────────────────────
    const handleGenerate = () => {
        setIsGenerating(true);
        setJustGenerated(false);
        setIsSaved(false);

        setTimeout(() => {
            const res = buildItinerary({
                startingCity,
                state,
                startDate,
                days,
                travellers,
                travelMode,
                accommodation,
                tripType,
                pace,
                includeReturn,
                allowNearbyStates: allowNearby,
                contingencyRate: contingencyRate / 100
            });

            setResult(res);
            setItinerary(res.days);
            window.localStorage.setItem('yatra-itinerary', JSON.stringify(res.days));

            setIsGenerating(false);
            setJustGenerated(true);
            setTimeout(() => planRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
            setTimeout(() => setJustGenerated(false), 4000);
        }, 600);
    };

    const saveTrip = () => {
        if (isSaved) return;
        const savedTrips = JSON.parse(window.localStorage.getItem('yatra-bucketlist-trips') || '[]');
        const trip = {
            id: `trip-${Date.now()}`,
            title: `${days}-day ${tripType} Yatra${state !== 'All India' ? ` · ${state}` : ''}`,
            style: tripType,
            region: state,
            days: itinerary,
            meta: result?.meta || null,
            createdAt: new Date().toISOString()
        };
        window.localStorage.setItem('yatra-bucketlist-trips', JSON.stringify([trip, ...savedTrips]));
        setIsSaved(true);
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ── Left sidebar: inputs ── */}
            <div className="lg:col-span-4">
                <div className="card border-0 shadow-sm sticky top-24">
                    <div className="card-header bg-transparent border-bottom py-3 px-4">
                        <h2 className="h5 mb-0 d-flex align-items-center gap-2 font-playfair">
                            <Settings size={18} /> Plan Your Yatra
                        </h2>
                    </div>
                    <div className="card-body p-4 vstack gap-3">

                        <SectionLabel>Journey details</SectionLabel>

                        <FormRow label={<><MapPin size={14} /> Starting city</>} htmlFor="starting-city" hint="Type a city, e.g. Mumbai, Delhi, Visakhapatnam">
                            <input
                                id="starting-city" className="form-control form-control-sm"
                                placeholder="e.g. Mumbai"
                                value={startingCity}
                                onChange={e => setStartingCity(e.target.value)}
                            />
                        </FormRow>

                        <FormRow label={<><MapPin size={14} /> Destination state</>} htmlFor="dest-state">
                            <select id="dest-state" className="form-select form-select-sm" value={state} onChange={e => setState(e.target.value)}>
                                {states.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </FormRow>

                        <div className="row g-2">
                            <div className="col-6">
                                <FormRow label={<><Calendar size={14} /> Start date</>} htmlFor="start-date">
                                    <input id="start-date" type="date" className="form-control form-control-sm" value={startDate} min={getLocalToday()} onChange={e => setStartDate(e.target.value)} />
                                </FormRow>
                            </div>
                            <div className="col-6">
                                <FormRow label={<><Calendar size={14} /> Duration</>} htmlFor="days-input">
                                    <input id="days-input" type="number" className="form-control form-control-sm" min={1} max={60} value={days} onChange={e => setDays(Math.max(1, parseInt(e.target.value) || 1))} />
                                </FormRow>
                            </div>
                        </div>

                        <div className="row g-2">
                            <div className="col-6">
                                <FormRow label={<><Users size={14} /> Travellers</>} htmlFor="travellers">
                                    <input id="travellers" type="number" className="form-control form-control-sm" min={1} max={50} value={travellers} onChange={e => setTravellers(Math.max(1, parseInt(e.target.value) || 1))} />
                                </FormRow>
                            </div>
                            <div className="col-6">
                                <FormRow label={<><Wallet size={14} /> Contingency</>} htmlFor="contingency">
                                    <div className="input-group input-group-sm">
                                        <input id="contingency" type="number" className="form-control" min={0} max={30} value={contingencyRate} onChange={e => setContingencyRate(Math.min(30, Math.max(0, parseInt(e.target.value) || 0)))} />
                                        <span className="input-group-text">%</span>
                                    </div>
                                </FormRow>
                            </div>
                        </div>

                        <hr className="my-1" />
                        <SectionLabel>Travel preferences</SectionLabel>

                        <FormRow label={<><Train size={14} /> Travel mode</>} htmlFor="travel-mode">
                            <select id="travel-mode" className="form-select form-select-sm" value={travelMode} onChange={e => setTravelMode(e.target.value)}>
                                <option value="mixed">Mixed (train + bus + car)</option>
                                <option value="train">Train</option>
                                <option value="bus">Bus</option>
                                <option value="car">Car / self-drive</option>
                            </select>
                        </FormRow>

                        <FormRow label={<><Hotel size={14} /> Accommodation</>} htmlFor="accommodation">
                            <select id="accommodation" className="form-select form-select-sm" value={accommodation} onChange={e => setAccommodation(e.target.value)}>
                                <option value="budget">Budget (dharamshala / guesthouse)</option>
                                <option value="standard">Standard (hotel 2–3★)</option>
                                <option value="premium">Premium (hotel 4–5★)</option>
                            </select>
                        </FormRow>

                        <FormRow label={<><Sparkles size={14} /> Journey style</>} htmlFor="trip-type">
                            <select id="trip-type" className="form-select form-select-sm" value={tripType} onChange={e => setTripType(e.target.value)}>
                                <option value="balanced">Balanced</option>
                                <option value="pilgrimage">Pilgrimage focused</option>
                                <option value="sightseeing">Sightseeing & culture</option>
                            </select>
                        </FormRow>

                        <FormRow label="Travel pace" htmlFor="pace">
                            <select id="pace" className="form-select form-select-sm" value={pace} onChange={e => setPace(e.target.value)}>
                                <option value="relaxed">Relaxed (≤200 km/day)</option>
                                <option value="balanced">Balanced (≤350 km/day)</option>
                                <option value="intensive">Intensive (≤500 km/day)</option>
                            </select>
                        </FormRow>

                        <div className="vstack gap-2">
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="include-return" checked={includeReturn} onChange={e => setIncludeReturn(e.target.checked)} />
                                <label className="form-check-label small" htmlFor="include-return">Include return journey day</label>
                            </div>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="allow-nearby" checked={allowNearby} onChange={e => setAllowNearby(e.target.checked)} />
                                <label className="form-check-label small" htmlFor="allow-nearby">Allow nearby states if needed</label>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="btn btn-forest w-100 mt-1 planner-generate-btn"
                            onClick={handleGenerate}
                            disabled={isGenerating}
                        >
                            {isGenerating
                                ? <><Loader2 size={16} className="me-2 animate-spin" />Generating your plan…</>
                                : <><Sparkles size={16} className="me-2" />Build planning preview</>
                            }
                        </button>

                        {justGenerated && (
                            <div className="planner-toast">
                                <CheckCircle2 size={15} />
                                Plan generated! Scroll down to view ↓
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Right: output ── */}
            <div className="lg:col-span-8 space-y-6" ref={planRef}>
                {itinerary.length > 0 && result ? (
                    <div className="animate-slide-up space-y-6">

                        {/* Header */}
                        <div>
                            <p className="section-label">Your itinerary is ready</p>
                            <h2 className="h3 font-playfair mb-1">Your Spiritual Path</h2>
                            <p className="text-secondary">
                                {result.meta.totalDays} days · {result.meta.state} · {result.meta.tripType} · {result.meta.pace} pace
                            </p>
                        </div>

                        {/* Budget */}
                        <BudgetSummaryCard budget={result.budget} meta={result.meta} />

                        {/* Meta / warnings / excluded */}
                        <MetaSummaryCard meta={result.meta} warnings={result.warnings} />

                        {/* Save button */}
                        <div className="d-flex align-items-center gap-3">
                            <button
                                type="button"
                                className={`btn ${isSaved ? 'btn-success' : 'btn-forest'} btn-save-trip`}
                                onClick={saveTrip}
                                disabled={isSaved}
                            >
                                {isSaved ? '✓ Saved to bucket list' : 'Save trip to bucket list'}
                            </button>
                            {isSaved && <Link href="/bucketlist" className="small text-secondary text-decoration-underline">View bucket list →</Link>}
                        </div>

                        {/* Transport booking links */}
                        {itinerary.filter(d => d.destinationId).length > 0 && (
                            <section className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <h3 className="h5 mb-1">Transport booking links</h3>
                                    <p className="small text-secondary mb-3">These open official or search websites. SacredMiles does not book or confirm any service.</p>
                                    <div className="vstack gap-3">
                                        {itinerary.filter(d => d.destinationId).map((day, i, arr) => {
                                            const origin = i === 0 ? (startingCity || 'your starting point') : arr[i - 1].location;
                                            const links = getTransportProviderLinks({ origin, destination: day.location, date: day.date });
                                            return (
                                                <div className="border rounded-3 p-3 transport-row" key={`${day.destinationId}-transport`}>
                                                    <div className="d-flex justify-content-between gap-2 flex-wrap align-items-center">
                                                        <strong className="small">{origin} → {day.location}</strong>
                                                        <div className="d-flex gap-1">
                                                            {day.routeLabel && <span className="badge text-bg-light small">{day.routeLabel}</span>}
                                                            <span className="badge text-bg-light">Not booked</span>
                                                        </div>
                                                    </div>
                                                    {day.travelDistanceKm > 0 && (
                                                        <div className="small text-secondary my-1">~{day.travelDistanceKm} km · ~{Math.round(day.travelMinutes / 60 * 10) / 10} h</div>
                                                    )}
                                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                                        {links.map(link => (
                                                            <a key={link.id} href={link.href} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-forest" title={link.description}>
                                                                {link.label}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Timeline */}
                        <ItineraryTimeline
                            days={itinerary}
                            onReorder={(src, dst) => {
                                const reordered = [...itinerary];
                                const [moved] = reordered.splice(src, 1);
                                reordered.splice(dst, 0, moved);
                                const normalized = reordered.map((d, i) => ({ ...d, day: i + 1 }));
                                setItinerary(normalized);
                                window.localStorage.setItem('yatra-itinerary', JSON.stringify(normalized));
                            }}
                        />
                    </div>
                ) : itinerary.length > 0 ? (
                    /* Loaded from localStorage, no result object */
                    <div className="animate-slide-up space-y-6">
                        <div className="alert alert-light border">
                            <ArrowLeft size={14} className="me-1" />
                            Showing your previously generated itinerary. Adjust settings and click <strong>Build planning preview</strong> to regenerate.
                        </div>
                        <ItineraryTimeline
                            days={itinerary}
                            onReorder={(src, dst) => {
                                const reordered = [...itinerary];
                                const [moved] = reordered.splice(src, 1);
                                reordered.splice(dst, 0, moved);
                                const normalized = reordered.map((d, i) => ({ ...d, day: i + 1 }));
                                setItinerary(normalized);
                                window.localStorage.setItem('yatra-itinerary', JSON.stringify(normalized));
                            }}
                        />
                    </div>
                ) : (
                    <div className="planner-empty animate-fade-in">
                        <div className="planner-empty-icon">🗺️</div>
                        <h3 className="h4 font-playfair mb-2">Ready to Plan?</h3>
                        <p className="text-secondary">
                            Set your starting city, duration, style, and preferences — then click <strong>Build planning preview</strong>.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PlannerPage() {
    return (
        <main className="min-h-screen py-12">
            <div className="container">
                <div className="mb-5">
                    <p className="section-label">Your journey, your way</p>
                    <h1 className="display-5 mb-1">Trip Planner</h1>
                    <p className="text-secondary">Build a personalised, duration-aware pilgrimage itinerary.</p>
                </div>
                <Suspense fallback={<div className="text-center py-5"><Loader2 size={32} className="animate-spin text-secondary" /></div>}>
                    <PlannerContent />
                </Suspense>
            </div>
        </main>
    );
}
