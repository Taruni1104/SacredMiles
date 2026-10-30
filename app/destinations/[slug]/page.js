import { notFound } from 'next/navigation';
import { getDestinationBySlug } from '@/lib/data';
import { getDestinationContent, getApprovedGallery } from '@/lib/content';
import DestinationStoryContent from '@/components/DestinationStoryContent';

// In Next.js 15+ params is a Promise and must be awaited.
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const destination = getDestinationBySlug(slug);
    const content = getDestinationContent(slug);
    const description = content?.overview || destination?.description || '';
    return destination
        ? { title: `${destination.name} | SacredMiles`, description }
        : { title: 'Destination not found | SacredMiles' };
}

export default async function DestinationStoryPage({ params }) {
    const { slug } = await params;
    const destination = getDestinationBySlug(slug);
    if (!destination) notFound();

    // Load approved structured content if available.
    // If null (draft / not yet approved) the page falls back gracefully to
    // the existing story content from lib/data.js — nothing breaks.
    const content = getDestinationContent(slug);
    const gallery = content ? getApprovedGallery(content) : [];

    return <DestinationStoryContent destination={destination} content={content} gallery={gallery} />;
}
