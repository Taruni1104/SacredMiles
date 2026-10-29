const STORAGE_VERSION = 1;

const KEYS = {
    expenses: 'yatra-expenses',
    priceReports: 'yatra-price-reports'
};

function readCollection(key) {
    if (typeof window === 'undefined') return [];
    try {
        const parsed = JSON.parse(window.localStorage.getItem(key) || 'null');
        return Array.isArray(parsed?.items) ? parsed.items : [];
    } catch (error) {
        console.error(`Unable to read ${key}:`, error);
        return [];
    }
}

function writeCollection(key, items) {
    window.localStorage.setItem(key, JSON.stringify({
        version: STORAGE_VERSION,
        items,
        updatedAt: new Date().toISOString()
    }));
}

export function getExpenses() {
    return readCollection(KEYS.expenses);
}

export function saveExpenses(expenses) {
    writeCollection(KEYS.expenses, expenses);
}

export function getPriceReports() {
    return readCollection(KEYS.priceReports);
}

export function savePriceReports(reports) {
    writeCollection(KEYS.priceReports, reports);
}
