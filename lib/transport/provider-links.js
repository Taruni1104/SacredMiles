export function getTransportProviderLinks({ origin, destination, date }) {
    const route = `${origin} to ${destination}`;
    const busQuery = encodeURIComponent(`buses from ${origin} to ${destination} on ${date}`);

    return [
        {
            id: 'uber',
            name: 'Uber',
            description: 'Open the official Uber booking experience for a local cab.',
            href: 'https://m.uber.com/',
            label: 'Open Uber',
            status: 'External booking'
        },
        {
            id: 'rapido',
            name: 'Rapido',
            description: 'Check Rapido availability for eligible local journeys.',
            href: 'https://www.rapido.bike/',
            label: 'Open Rapido',
            status: 'External booking'
        },
        {
            id: 'irctc',
            name: 'IRCTC',
            description: `Search official railway services for ${route}.`,
            href: 'https://www.irctc.co.in/nget/train-search',
            label: 'Open IRCTC',
            status: 'External search'
        },
        {
            id: 'bus-search',
            name: 'Google bus search',
            description: 'Compare bus operators and booking options in Google Search.',
            href: `https://www.google.com/search?q=${busQuery}`,
            label: 'Search buses',
            status: 'Search only'
        }
    ];
}
