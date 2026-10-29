export const AUTH_STORAGE_KEY = 'yatra-user';

export function getStoredUser() {
    if (typeof window === 'undefined') return null;

    try {
        const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEY);
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error('Unable to read local user session:', error);
        return null;
    }
}

export function storeUser(user) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
