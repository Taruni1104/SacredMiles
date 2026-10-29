const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

export function isApiConfigured() {
    return Boolean(API_URL);
}

export async function apiRequest(path, options = {}) {
    if (!API_URL) {
        throw new Error('The optional SacredMiles API is not configured.');
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(payload.error || `API request failed with status ${response.status}.`);
    }
    return payload;
}

export function getApiExpense(expense) {
    return {
        ...expense,
        id: String(expense.id),
        title: expense.title || 'Trip expense',
        amount: Number(expense.amount),
        date: expense.expenseDate || expense.date,
        destinationName: expense.destinationName || ''
    };
}

export async function getServerExpenses() {
    const payload = await apiRequest('/api/expenses');
    return (payload.items || []).map(getApiExpense);
}

export async function createServerExpense(expense) {
    return apiRequest('/api/expenses', {
        method: 'POST',
        body: JSON.stringify({
            title: expense.title,
            destinationId: expense.destinationId || null,
            category: expense.category,
            amount: Number(expense.amount),
            currency: expense.currency || 'INR',
            expenseDate: expense.date,
            notes: expense.notes || ''
        })
    });
}

export async function updateServerExpense(expense) {
    return apiRequest(`/api/expenses/${encodeURIComponent(expense.id)}`, {
        method: 'PUT',
        body: JSON.stringify({
            title: expense.title,
            destinationId: expense.destinationId || null,
            category: expense.category,
            amount: Number(expense.amount),
            currency: expense.currency || 'INR',
            expenseDate: expense.date,
            notes: expense.notes || ''
        })
    });
}

export async function deleteServerExpense(id) {
    return apiRequest(`/api/expenses/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function getServerPriceReports(destinationId) {
    const query = destinationId ? `?destinationId=${encodeURIComponent(destinationId)}` : '';
    const payload = await apiRequest(`/api/price-reports${query}`);
    return payload.items || [];
}

export async function createServerPriceReport(report) {
    return apiRequest('/api/price-reports', {
        method: 'POST',
        body: JSON.stringify(report)
    });
}
