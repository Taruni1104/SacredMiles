import { notFound } from 'next/navigation';
import { getDestinationBySlug } from '@/lib/data';
import DestinationStoryContent from '@/components/DestinationStoryContent';

export function generateMetadata({ params }) {
    const destination = getDestinationBySlug(params.slug);
    return destination
        ? { title: `${destination.name} | Yatra`, description: destination.description }
        : { title: 'Destination not found | Yatra' };
}

export default function DestinationStoryPage({ params }) {
    const destination = getDestinationBySlug(params.slug);
    if (!destination) notFound();
    return <DestinationStoryContent destination={destination} />;
}
