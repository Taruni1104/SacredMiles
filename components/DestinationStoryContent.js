import Link from 'next/link';
import DestinationActions from '@/components/DestinationActions';
import { getDestinationBySlug, getDestinationStory } from '@/lib/data';

export default function DestinationStoryContent({ destination }) {
    const story = getDestinationStory(destination);
    const related = story.relatedDestinationIds.map(id => getDestinationBySlug(id)).filter(Boolean);

    return (
        <main className="container py-5">
            <nav aria-label="Breadcrumb" className="small mb-4">
                <Link href="/map">Map</Link><span className="mx-2">/</span><span aria-current="page">{story.name}</span>
            </nav>
            <article className="destination-story mx-auto" style={{ maxWidth: '52rem' }}>
                <header className="mb-5">
                    <p className="section-label">{story.type === 'temple' ? 'Pilgrimage story' : 'Cultural story'} · {story.state}</p>
                    <h1 className="display-4 mb-3">{story.name}</h1>
                    <p className="lead text-secondary">{story.summary}</p>
                    <div className="destination-placeholder rounded-3 p-4 my-4" role="img" aria-label="Image unavailable for this destination">
                        <strong>Destination image pending verification</strong>
                        <p className="mb-0 small">Yatra will add an attributed image when a reliable, permitted asset is available.</p>
                    </div>
                    <DestinationActions destination={destination} story={story} />
                </header>

                <section className="card border-0 shadow-sm mb-5">
                    <div className="card-body p-4">
                        <h2 className="h4">The story in a nutshell</h2>
                        <p className="mb-0">{story.summary} A fuller historical narrative will be published after destination-specific sources are reviewed.</p>
                    </div>
                </section>

                <section className="mb-5">
                    <h2 className="h3">Quick facts</h2>
                    <div className="row g-3">
                        {story.quickFacts.map(fact => <div className="col-12 col-md-4" key={fact.label}><div className="border rounded-3 p-3 h-100"><div className="small text-secondary">{fact.label}</div><strong>{fact.value}</strong></div></div>)}
                    </div>
                </section>

                <section className="alert alert-light border mb-5">
                    <h2 className="h5">Research status</h2>
                    <p className="mb-0">
                        {story.contentStatus === 'partially-researched'
                            ? `This destination has verified official resources and selected source-backed claims. The full narrative remains incomplete. Last checked: ${story.verifiedAt}.`
                            : 'This page currently has a verified summary only. History, tradition, belief, architecture, and legends are not expanded here until they have source references.'}
                    </p>
                </section>

                <section className="border-top pt-4 mb-5">
                    <h2 className="h4">Official resources</h2>
                    <p className="text-secondary">These links were checked against the destination authority. Opening an external website does not complete a booking in Yatra. Never share external-site passwords, OTPs, or payment details with this app.</p>
                    {story.officialLinks.length > 0 ? (
                        <div className="vstack gap-2">
                            {story.officialLinks.map(link => <a key={link.url + link.type} href={link.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-forest text-start">{link.label} <span aria-hidden="true">↗</span></a>)}
                        </div>
                    ) : <div className="alert alert-light border mb-0">No verified official website or booking link is currently recorded for this destination.</div>}
                </section>

                <section id="visit-cost" className="border-top pt-4 mb-5">
                    <h2 className="h4">Visit cost estimate</h2>
                    <p className="text-secondary">Only a provisional local visit allowance is available. It is optional and is not an official ticket, donation, darshan, or seva price.</p>
                    {story.costEstimates.map(cost => <div className="d-flex justify-content-between border-bottom py-2" key={cost.name}><span>{cost.name} <small className="text-secondary">({cost.status})</small></span><strong>₹{cost.amount.toLocaleString('en-IN')}</strong></div>)}
                </section>

                <section id="transport" className="border-top pt-4 mb-5">
                    <h2 className="h4">Explore transport</h2>
                    <p className="text-secondary">Create or update your journey to see external transport links for each itinerary leg. Nothing is booked inside Yatra.</p>
                    <Link href="/planner" className="btn btn-outline-forest">Open planner</Link>
                </section>

                <section className="border-top pt-4 mb-5">
                    <h2 className="h4">Source references</h2>
                    {story.sourceReferences.length > 0 ? <ul className="small">{story.sourceReferences.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a> — {source.publisher}; claim: {source.claim}; checked {source.lastChecked}.</li>)}</ul> : <p className="text-secondary mb-0">No destination-specific source references have been verified yet.</p>}
                    {story.claims.length > 0 && <><h3 className="h6 mt-4">Verified claims</h3><ul className="small mb-0">{story.claims.map(claim => <li key={claim.text}>{claim.text} <a href={claim.sourceUrl} target="_blank" rel="noopener noreferrer">View supporting source</a></li>)}</ul></>}
                </section>

                {related.length > 0 && <section className="border-top pt-4 mb-5"><h2 className="h4">Read related stories</h2><div className="row g-3">{related.map(item => <div className="col-12 col-md-4" key={item.id}><Link href={`/destinations/${item.id}`} className="d-block border rounded-3 p-3 text-decoration-none text-reset h-100"><strong>{item.name}</strong><div className="small text-secondary mt-1">{item.state}</div></Link></div>)}</div></section>}

                <footer className="border-top pt-4">
                    <p className="small text-secondary">Sources and image attribution will appear here when destination-specific research is verified.</p>
                    <Link href="/map" className="btn btn-outline-forest">Back to map</Link>
                    <Link href="/tours" className="btn btn-forest ms-2">Explore destinations</Link>
                </footer>
            </article>
        </main>
    );
}
