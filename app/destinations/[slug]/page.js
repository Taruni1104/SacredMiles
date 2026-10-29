import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDestinationBySlug, getDestinationStory } from '@/lib/data';

export function generateMetadata({ params }) {
    const destination = getDestinationBySlug(params.slug);
    if (!destination) return { title: 'Destination not found | Yatra' };
    return {
        title: `${destination.name} | Yatra`,
        description: destination.description
    };
}

export default function DestinationStoryPage({ params }) {
    const destination = getDestinationBySlug(params.slug);
    if (!destination) notFound();

    const story = getDestinationStory(destination);

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
                </header>

                <section className="card border-0 shadow-sm mb-5">
                    <div className="card-body p-4">
                        <h2 className="h4">The story in a nutshell</h2>
                        <p className="mb-0">This destination currently has a verified summary in Yatra. Its full historical and cultural story will be added only after the relevant official or scholarly sources have been reviewed.</p>
                    </div>
                </section>

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

                {story.storySections.length > 0 ? story.storySections.map(section => (
                    <section className="mb-5" key={section.id}>
                        <h2 className="h3">{section.title}</h2>
                        {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                    </section>
                )) : (
                    <section className="alert alert-light border mb-5">
                        <h2 className="h5">Research status</h2>
                        <p className="mb-0">A complete destination-specific narrative is not published yet. Yatra intentionally avoids turning tradition, legend, or uncertain details into unverified historical fact.</p>
                    </section>
                )}

                <section className="border-top pt-4 mb-5">
                    <h2 className="h4">Before you go</h2>
                    <ul>
                        <li>Check the destination&apos;s official visitor guidance before travelling.</li>
                        <li>Respect local worship, photography, dress, and access rules.</li>
                        <li>Use the Planner for a local itinerary estimate, not live transport or opening-hour information.</li>
                    </ul>
                </section>

                <footer className="border-top pt-4">
                    <p className="small text-secondary mb-3">Sources will be displayed here once destination-specific research has been verified and added to the data record.</p>
                    <Link href="/map" className="btn btn-outline-forest">Back to map</Link>
                    <Link href="/tours" className="btn btn-forest ms-2">Explore destinations</Link>
                </footer>
            </article>
        </main>
    );
}
