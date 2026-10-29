const DEFAULT_ASSUMPTIONS = {
    transportBase: 900,
    transportPerKm: 6,
    accommodationPerNight: 1800,
    foodPerPersonPerDay: 900,
    localVisitAllowance: 250
};

function createItem(category, name, amount, status = 'provisional assumption', optional = false) {
    return {
        category,
        name,
        quantity: 1,
        unitPrice: Math.round(amount),
        amount: Math.round(amount),
        currency: 'INR',
        status,
        optional
    };
}

export function calculateTripBudget(itinerary, options = {}) {
    const travelers = Math.max(1, Number(options.travelers) || 1);
    const assumptions = { ...DEFAULT_ASSUMPTIONS, ...options.assumptions };
    const destinationDays = itinerary.filter(day => day.destinationId);
    const distance = itinerary.reduce((total, day) => total + (Number(day.travelDistanceKm) || 0), 0);
    const nights = Math.max(0, itinerary.length - 1);

    const items = [
        createItem('Intercity transport', 'Estimated route transport', assumptions.transportBase + distance * assumptions.transportPerKm),
        createItem('Accommodation', `${nights} estimated night${nights === 1 ? '' : 's'}`, nights * assumptions.accommodationPerNight),
        createItem('Food', `${travelers} traveler allowance for ${itinerary.length} days`, travelers * itinerary.length * assumptions.foodPerPersonPerDay),
        createItem('Religious and visit expenses', 'Optional local visit allowance', destinationDays.length * assumptions.localVisitAllowance, 'provisional assumption', true)
    ];

    const categoryTotals = items.reduce((totals, item) => {
        totals[item.category] = (totals[item.category] || 0) + item.amount;
        return totals;
    }, {});
    const subtotal = items.reduce((total, item) => total + item.amount, 0);
    const contingencyRate = Math.min(0.3, Math.max(0, Number(options.contingencyRate) || 0));
    const contingency = Math.round(subtotal * contingencyRate);
    const total = subtotal + contingency;

    return {
        currency: 'INR',
        travelers,
        items,
        categoryTotals,
        subtotal,
        contingencyRate,
        contingency,
        total,
        perTraveler: Math.round(total / travelers),
        averageDaily: itinerary.length ? Math.round(total / itinerary.length) : 0,
        paid: Number(options.paid) || 0,
        remaining: Math.max(0, total - (Number(options.paid) || 0)),
        missingCategories: ['verified fares', 'official entry fees', 'taxes and booking fees', 'insurance and permits'],
        assumptions: 'Distances, rates, accommodation, food, and local allowances are provisional planning assumptions, not quotes.'
    };
}
