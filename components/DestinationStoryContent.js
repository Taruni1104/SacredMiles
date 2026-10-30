import Link from 'next/link';
import Image from 'next/image';
import DestinationActions from '@/components/DestinationActions';
import { getDestinationBySlug, getDestinationStory } from '@/lib/data';
import PriceReportForm from '@/components/PriceReportForm';

// ── Small presentational helpers ─────────────────────────────────────────────

function ClassificationBadge({ classification }) {
    const map = {
        'documented-fact':      { label: 'Documented',      cls: 'text-bg-success' },
        'religious-tradition':  { label: 'Religious tradition', cls: 'text-bg-warning' },
        'legend':               { label: 'Legend / tradition',  cls: 'text-bg-secondary' },
        'modern-visitor-info':  { label: 'Visitor information', cls: 'text-bg-info' }
    };
    const badge = map[classification];
    if (!badge) return null;
    return <span className={`badge ${badge.cls} ms-2 fw-normal small`}>{badge.label}</span>;
}

function ContentSection({ section, heading }) {
    if (!section?.text?.trim()) return null;
    return (
        <section className="mb-5">
            <h2 className="h4 d-flex align-items-center flex-wrap gap-2">
                {heading}
                <ClassificationBadge classification={section.classification} />
            </h2>
            <p>{section.text}</p>
            {section.completeness !== 'complete' && (
                <p className="small text-secondary fst-italic">
                    This section is {section.completeness === 'stub' ? 'a placeholder stub' : 'partially researched'} and will be expanded as source verification progresses.
                </p>
            )}
        </section>
    );
}

function GallerySection({ gallery }) {
    if (!gallery || gallery.length === 0) return null;
    return (
        <section className="mb-5">
            <h2 className="h4 mb-3">Gallery</h2>
            <div className="row g-3">
                {gallery.map((img, i) => (
                    <div className="col-12 col-sm-6 col-md-4" key={img.wikimediaFile || i}>
                        <figure className="mb-0">
                            <div className="destination-gallery-img rounded overflow-hidden">
                                <Image
                                    src={img.thumbUrl}
                                    alt={img.title || 'Destination photograph'}
                                    width={640}
                                    height={427}
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                    unoptimized
                                />
                            </div>
                            <figcaption className="small text-secondary mt-1">
                                {img.title && <span>{img.title}. </span>}
                                {img.author && <span>By {img.author}. </span>}
                                {img.license && (
                                    <span>
                                        {img.licenseUrl
                                            ? <a href={img.licenseUrl} target="_blank" rel="noopener noreferrer">{img.license}</a>
                                            : img.license
                                        }.{' '}
                                    </span>
                                )}
                                {img.filePageUrl && (
                                    <a href={img.filePageUrl} target="_blank" rel="noopener noreferrer">Source ↗</a>
                                )}
                            </figcaption>
                        </figure>
                    </div>
                ))}
            </div>
        </section>
    );
}

function VisitorInfoSection({ info }) {
    if (!info) return null;
    const hasAny = info.openingHours?.summary || info.entryFee?.notes || info.dressCode || info.photographyPolicy || info.bestArrivalTime;
    if (!hasAny) return null;
    return (
        <section className="mb-5">
            <h2 className="h4 mb-3">Visitor information</h2>
            <div className="row g-3">
                {info.openingHours?.summary && (
                    <div className="col-12 col-md-6">
                        <div className="border rounded-3 p-3 h-100">
                            <div className="small text-secondary mb-1">Opening hours</div>
                            <p className="mb-0">{info.openingHours.summary}</p>
                            {info.openingHours.verificationStatus !== 'verified' && (
                                <p className="small text-secondary mb-0 mt-1">⚠ Verify current hours directly from the official source before travelling.</p>
                            )}
                        </div>
                    </div>
                )}
                {info.entryFee && (
                    <div className="col-12 col-md-6">
                        <div className="border rounded-3 p-3 h-100">
                            <div className="small text-secondary mb-1">Entry fee</div>
                            <p className="mb-0">
                                {info.entryFee.amount !== null
                                    ? (info.entryFee.amount === 0 ? 'Free entry' : `₹${info.entryFee.amount.toLocaleString('en-IN')} ${info.entryFee.currency || 'INR'}`)
                                    : 'Not confirmed'}
                            </p>
                            {info.entryFee.notes && <p className="small text-secondary mb-0 mt-1">{info.entryFee.notes}</p>}
                        </div>
                    </div>
                )}
                {info.dressCode && (
                    <div className="col-12">
                        <div className="border rounded-3 p-3">
                            <div className="small text-secondary mb-1">Dress code</div>
                            <p className="mb-0">{info.dressCode}</p>
                        </div>
                    </div>
                )}
                {info.photographyPolicy && (
                    <div className="col-12 col-md-6">
                        <div className="border rounded-3 p-3 h-100">
                            <div className="small text-secondary mb-1">Photography</div>
                            <p className="mb-0">{info.photographyPolicy}</p>
                        </div>
                    </div>
                )}
                {info.bestArrivalTime && (
                    <div className="col-12 col-md-6">
                        <div className="border rounded-3 p-3 h-100">
                            <div className="small text-secondary mb-1">Best arrival time</div>
                            <p className="mb-0">{info.bestArrivalTime}</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

function HowToReachSection({ howToReach }) {
    if (!howToReach) return null;
    const hasAny = howToReach.nearestAirport?.name || howToReach.nearestRailway?.name || howToReach.roadAccess || howToReach.localTransport;
    if (!hasAny) return null;
    return (
        <section className="border-top pt-4 mb-5">
            <h2 className="h4 mb-3">How to reach</h2>
            <div className="row g-3">
                {howToReach.nearestAirport?.name && (
                    <div className="col-12 col-md-6">
                        <div className="border rounded-3 p-3 h-100">
                            <div className="small text-secondary mb-1">Nearest airport</div>
                            <strong>{howToReach.nearestAirport.name}</strong>
                            {howToReach.nearestAirport.distanceKm && <div className="small text-secondary">{howToReach.nearestAirport.distanceKm} km away</div>}
                        </div>
                    </div>
                )}
                {howToReach.nearestRailway?.name && (
                    <div className="col-12 col-md-6">
                        <div className="border rounded-3 p-3 h-100">
                            <div className="small text-secondary mb-1">Nearest railway station</div>
                            <strong>{howToReach.nearestRailway.name}</strong>
                            {howToReach.nearestRailway.distanceKm && <div className="small text-secondary">{howToReach.nearestRailway.distanceKm} km away</div>}
                        </div>
                    </div>
                )}
                {howToReach.roadAccess && (
                    <div className="col-12">
                        <div className="border rounded-3 p-3">
                            <div className="small text-secondary mb-1">Road access</div>
                            <p className="mb-0">{howToReach.roadAccess}</p>
                        </div>
                    </div>
                )}
                {howToReach.localTransport && (
                    <div className="col-12">
                        <div className="border rounded-3 p-3">
                            <div className="small text-secondary mb-1">Local transport</div>
                            <p className="mb-0">{howToReach.localTransport}</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

function ThingsToExploreSection({ items }) {
    if (!items || items.length === 0) return null;
    return (
        <section className="mb-5">
            <h2 className="h4 mb-3">Things to explore</h2>
            <div className="row g-3">
                {items.map((item, i) => (
                    <div className="col-12 col-md-6" key={i}>
                        <div className="border rounded-3 p-3 h-100">
                            <div className="d-flex justify-content-between gap-2 mb-1">
                                <strong>{item.name}</strong>
                                <span className="badge text-bg-light text-capitalize">{item.type}</span>
                            </div>
                            <p className="small text-secondary mb-0">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DestinationStoryContent({ destination, content = null, gallery = [] }) {
    const story = getDestinationStory(destination);
    const related = story.relatedDestinationIds.map(id => getDestinationBySlug(id)).filter(Boolean);

    // Merge content-file data over the legacy story defaults where available
    const overview = content?.overview || story.summary;
    const bestTimeToVisit = content?.bestTimeToVisit || null;

    return (
        <main className="container py-5">
            <nav aria-label="Breadcrumb" className="small mb-4">
                <Link href="/map">Map</Link>
                <span className="mx-2">/</span>
                <Link href="/tours">Destinations</Link>
                <span className="mx-2">/</span>
                <span aria-current="page">{destination.name}</span>
            </nav>

            <article className="destination-story mx-auto" style={{ maxWidth: '52rem' }}>
                <header className="mb-5">
                    <p className="section-label">
                        {destination.type === 'temple' ? 'Pilgrimage story' : 'Cultural story'} · {destination.state}
                    </p>
                    <h1 className="display-4 mb-3">{destination.name}</h1>
                    {content?.alternativeNames?.length > 0 && (
                        <p className="small text-secondary mb-2">Also known as: {content.alternativeNames.join(', ')}</p>
                    )}
                    <p className="lead text-secondary">{overview}</p>
                    {bestTimeToVisit && (
                        <p className="small"><span className="text-secondary">Best time to visit:</span> {bestTimeToVisit}</p>
                    )}

                    {/* Hero image or placeholder */}
                    {gallery.length > 0 ? (
                        <div className="my-4 rounded overflow-hidden">
                            <Image
                                src={gallery[0].thumbUrl}
                                alt={gallery[0].title || destination.name}
                                width={832}
                                height={468}
                                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                priority
                                unoptimized
                            />
                            <div className="small text-secondary p-2 bg-light">
                                {gallery[0].author && <span>Photo by {gallery[0].author}. </span>}
                                {gallery[0].licenseUrl
                                    ? <a href={gallery[0].licenseUrl} target="_blank" rel="noopener noreferrer">{gallery[0].license}</a>
                                    : gallery[0].license}
                                {gallery[0].filePageUrl && <> · <a href={gallery[0].filePageUrl} target="_blank" rel="noopener noreferrer">Wikimedia Commons ↗</a></>}
                            </div>
                        </div>
                    ) : (
                        <div className="destination-placeholder rounded-3 p-4 my-4" role="img" aria-label="Image unavailable for this destination">
                            <strong>Destination image pending verification</strong>
                            <p className="mb-0 small">SacredMiles will add an attributed photograph when a licence-compatible image has been reviewed and approved.</p>
                        </div>
                    )}

                    <DestinationActions destination={destination} story={story} />
                </header>

                {/* ── Structured content sections (only if content file is approved) ── */}
                {content ? (
                    <>
                        <ContentSection section={content.historicalBackground} heading="Historical background" />
                        <ContentSection section={content.religiousSignificance} heading="Religious significance" />
                        <ContentSection section={content.legendsAndTraditions} heading="Legends and traditions" />
                        <ContentSection section={content.architecture} heading="Architecture" />
                        <ContentSection section={content.ritualsAndFestivals} heading="Rituals and festivals" />
                        <ThingsToExploreSection items={content.thingsToExplore} />
                        <VisitorInfoSection info={content.visitorInformation} />
                        <HowToReachSection howToReach={content.howToReach} />
                        <GallerySection gallery={gallery.slice(1)} /> {/* hero image already shown above */}

                        {/* Nearby places from content file */}
                        {content.nearbyPlaces?.length > 0 && (
                            <section className="mb-5">
                                <h2 className="h4 mb-3">Nearby places</h2>
                                <div className="row g-3">
                                    {content.nearbyPlaces.map(place => (
                                        <div className="col-12 col-md-4" key={place.id || place.name}>
                                            {place.id ? (
                                                <Link href={`/destinations/${place.id}`} className="d-block border rounded-3 p-3 text-decoration-none text-reset h-100">
                                                    <strong>{place.name}</strong>
                                                    {place.distanceKm && <div className="small text-secondary">{place.distanceKm} km away</div>}
                                                    {place.notes && <div className="small text-secondary mt-1">{place.notes}</div>}
                                                </Link>
                                            ) : (
                                                <div className="border rounded-3 p-3 h-100">
                                                    <strong>{place.name}</strong>
                                                    {place.distanceKm && <div className="small text-secondary">{place.distanceKm} km away</div>}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                ) : (
                    /* ── Legacy fallback: summary-only card ── */
                    <section className="card border-0 shadow-sm mb-5">
                        <div className="card-body p-4">
                            <h2 className="h4">The story in a nutshell</h2>
                            <p className="mb-0">{story.summary} A fuller narrative will be published after destination-specific sources are reviewed and approved.</p>
                        </div>
                    </section>
                )}

                {/* ── Quick facts (always shown) ── */}
                <section className="mb-5">
                    <h2 className="h3">Quick facts</h2>
                    <div className="row g-3">
                        {story.quickFacts.map(fact => (
                            <div className="col-12 col-md-4" key={fact.label}>
                                <div className="border rounded-3 p-3 h-100">
                                    <div className="small text-secondary">{fact.label}</div>
                                    <strong>{fact.value}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Research status ── */}
                <section className="alert alert-light border mb-5">
                    <h2 className="h5">Research status</h2>
                    <p className="mb-0">
                        {story.contentStatus === 'partially-researched'
                            ? `This destination has verified official resources and selected source-backed claims. The full narrative remains incomplete. Last checked: ${story.verifiedAt}.`
                            : story.contentStatus === 'source-discovery'
                                ? `A preliminary source register is available, but individual claims require destination-page verification. Last checked: ${story.verifiedAt}.`
                                : 'This page currently has a summary only. Expanded history, tradition, architecture, and visitor information will be added as sources are verified.'}
                    </p>
                </section>

                {/* ── Official resources ── */}
                <section className="border-top pt-4 mb-5">
                    <h2 className="h4">Official resources</h2>
                    <p className="text-secondary">
                        These links were checked against the destination authority. Opening an external website does not complete a booking in SacredMiles. Never share external-site passwords, OTPs, or payment details with this app.
                    </p>
                    {story.officialLinks.length > 0 ? (
                        <div className="vstack gap-2">
                            {story.officialLinks.map(link => (
                                <a key={link.url + link.type} href={link.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-forest text-start">
                                    {link.label} <span aria-hidden="true">↗</span>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="alert alert-light border mb-0">
                            No verified official website or booking link is currently recorded for this destination.
                        </div>
                    )}
                </section>

                {/* ── Cost estimate ── */}
                <section id="visit-cost" className="border-top pt-4 mb-5">
                    <h2 className="h4">Visit cost estimate</h2>
                    <p className="text-secondary">
                        Only a provisional local visit allowance is available. It is not an official ticket, donation, darshan, or seva price.
                    </p>
                    {story.costEstimates.map(cost => (
                        <div className="d-flex justify-content-between border-bottom py-2" key={cost.name}>
                            <span>{cost.name} <small className="text-secondary">({cost.status})</small></span>
                            <strong>₹{cost.amount.toLocaleString('en-IN')}</strong>
                        </div>
                    ))}
                </section>

                <PriceReportForm destination={destination} estimate={story.costEstimates[0].amount} />

                {/* ── Transport ── */}
                <section id="transport" className="border-top pt-4 mb-5">
                    <h2 className="h4">Explore transport</h2>
                    <p className="text-secondary">
                        Create or update your journey to see external transport links for each itinerary leg. Nothing is booked inside SacredMiles.
                    </p>
                    <Link href="/planner" className="btn btn-outline-forest">Open planner</Link>
                </section>

                {/* ── Source references ── */}
                <section className="border-top pt-4 mb-5">
                    <h2 className="h4">Source references</h2>
                    {story.sourceReferences.length > 0 ? (
                        <ul className="small">
                            {story.sourceReferences.map(source => (
                                <li key={source.url}>
                                    <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
                                    {' '}— {source.publisher}; {source.claim}; checked {source.lastChecked}.
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-secondary mb-0">No destination-specific source references have been verified yet.</p>
                    )}
                    {story.claims.length > 0 && (
                        <>
                            <h3 className="h6 mt-4">Verified claims</h3>
                            <ul className="small mb-0">
                                {story.claims.map(claim => (
                                    <li key={claim.text}>
                                        {claim.text}{' '}
                                        <a href={claim.sourceUrl} target="_blank" rel="noopener noreferrer">View supporting source</a>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </section>

                {/* ── Related destinations ── */}
                {related.length > 0 && (
                    <section className="border-top pt-4 mb-5">
                        <h2 className="h4">Read related stories</h2>
                        <div className="row g-3">
                            {related.map(item => (
                                <div className="col-12 col-md-4" key={item.id}>
                                    <Link href={`/destinations/${item.id}`} className="d-block border rounded-3 p-3 text-decoration-none text-reset h-100">
                                        <strong>{item.name}</strong>
                                        <div className="small text-secondary mt-1">{item.state}</div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <footer className="border-top pt-4">
                    <p className="small text-secondary">
                        Sources and image attribution are shown inline with each section. Content marked with classification badges distinguishes documented history from religious tradition and legend.
                    </p>
                    <Link href="/map" className="btn btn-outline-forest">Back to map</Link>
                    <Link href="/tours" className="btn btn-forest ms-2">Explore destinations</Link>
                </footer>
            </article>
        </main>
    );
}
