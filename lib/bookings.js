export const BOOKING_STATUSES = [
    'Not researched',
    'Options found',
    'Awaiting selection',
    'Ready to book',
    'Booked',
    'Payment pending',
    'Cancelled',
    'Needs reconfirmation'
];

export function createBookingChecklist(itinerary) {
    return itinerary.flatMap((day, index) => {
        const items = [];
        if (day.destinationId) {
            items.push({
                id: `visit-${day.destinationId}-${index}`,
                type: 'Visit',
                title: `${day.location} visit`,
                status: 'Not researched',
                note: 'Confirm official visitor, darshan, or entry information.'
            });
        }
        if (index > 0 && day.destinationId) {
            items.push({
                id: `transport-${day.destinationId}-${index}`,
                type: 'Transport',
                title: `Travel to ${day.location}`,
                status: 'Ready to book',
                note: 'External provider links are available from the Planner; no booking is confirmed in Yatra.'
            });
        }
        return items;
    });
}
