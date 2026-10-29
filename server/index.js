require('dotenv').config({ path: '.env.local' });

const cors = require('cors');
const crypto = require('crypto');
const express = require('express');
const mysql = require('mysql2/promise');
const { promisify } = require('util');

const app = express();
const port = Number(process.env.API_PORT || 4000);

const scrypt = promisify(crypto.scrypt);
const sessionDays = 30;
const authAttempts = new Map();

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '100kb' }));

let pool;

function getPool() {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.MYSQL_HOST || '127.0.0.1',
            port: Number(process.env.MYSQL_PORT || 3306),
            database: process.env.MYSQL_DATABASE || 'yatra',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '',
            waitForConnections: true,
            connectionLimit: 5
        });
    }

    return pool;
}

    function getCookie(request, name) {
        const cookies = request.headers.cookie?.split(';') || [];
        const match = cookies.map(cookie => cookie.trim().split('=')).find(([key]) => key === name);
        return match ? decodeURIComponent(match[1]) : null;
    }

    function hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    async function hashPassword(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const derivedKey = await scrypt(password, salt, 64);
        return `${salt}:${derivedKey.toString('hex')}`;
    }

    async function verifyPassword(password, storedHash) {
        const [salt, expectedHex] = storedHash.split(':');
        if (!salt || !expectedHex) return false;
        const derivedKey = await scrypt(password, salt, 64);
        const expected = Buffer.from(expectedHex, 'hex');
        return expected.length === derivedKey.length && crypto.timingSafeEqual(expected, derivedKey);
    }

    async function createSession(userId, response) {
        const token = crypto.randomBytes(32).toString('base64url');
        const expiresAt = new Date(Date.now() + sessionDays * 86400000);
        await getPool().execute(
            'INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
            [userId, hashToken(token), expiresAt]
        );
        const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
        response.setHeader('Set-Cookie', `yatra_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionDays * 86400}${secure}`);
    }

    function authRateLimit(request, response, next) {
        const key = request.ip || request.socket.remoteAddress || 'unknown';
        const now = Date.now();
        const recent = (authAttempts.get(key) || []).filter(timestamp => now - timestamp < 15 * 60 * 1000);
        if (recent.length >= 10) {
            response.status(429).json({ error: 'Too many account attempts. Try again later.' });
            return;
        }
        recent.push(now);
        authAttempts.set(key, recent);
        next();
    }

    async function requireUser(request, response, next) {
        const token = getCookie(request, 'yatra_session');
        if (!token) {
            response.status(401).json({ error: 'Login is required.' });
            return;
        }

        try {
            const [rows] = await getPool().execute(
                `SELECT users.id, users.name, users.email
                 FROM sessions JOIN users ON users.id = sessions.user_id
                 WHERE sessions.token_hash = ? AND sessions.expires_at > NOW()`,
                [hashToken(token)]
            );
            if (!rows[0]) {
                response.status(401).json({ error: 'Your session has expired. Please log in again.' });
                return;
            }
            request.user = rows[0];
            next();
        } catch (error) {
            console.error('Session lookup failed:', error.message);
            response.status(503).json({ error: 'The account service is unavailable.' });
        }
    }

app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok', service: 'yatra-api' });
});

app.post('/api/auth/register', authRateLimit, async (request, response) => {
    const { name, email, password } = request.body || {};
    if (typeof name !== 'string' || name.trim().length < 2 || typeof email !== 'string' || !email.includes('@') || typeof password !== 'string' || password.length < 8) {
        response.status(400).json({ error: 'Name, a valid email, and a password of at least 8 characters are required.' });
        return;
    }

    try {
        const passwordHash = await hashPassword(password);
        const [result] = await getPool().execute(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name.trim(), email.trim().toLowerCase(), passwordHash]
        );
        await createSession(result.insertId, response);
        response.status(201).json({ user: { name: name.trim(), email: email.trim().toLowerCase() } });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            response.status(409).json({ error: 'An account with that email already exists.' });
            return;
        }
        console.error('Registration failed:', error.message);
        response.status(503).json({ error: 'The account service is unavailable.' });
    }
});

app.post('/api/auth/login', authRateLimit, async (request, response) => {
    const { email, password } = request.body || {};
    if (typeof email !== 'string' || typeof password !== 'string') {
        response.status(400).json({ error: 'Email and password are required.' });
        return;
    }

    try {
        const [rows] = await getPool().execute('SELECT id, name, email, password_hash FROM users WHERE email = ?', [email.trim().toLowerCase()]);
        if (!rows[0] || !(await verifyPassword(password, rows[0].password_hash))) {
            response.status(401).json({ error: 'Email or password is incorrect.' });
            return;
        }
        await createSession(rows[0].id, response);
        response.json({ user: { name: rows[0].name, email: rows[0].email } });
    } catch (error) {
        console.error('Login failed:', error.message);
        response.status(503).json({ error: 'The account service is unavailable.' });
    }
});

app.post('/api/auth/logout', async (request, response) => {
    const token = getCookie(request, 'yatra_session');
    if (token) await getPool().execute('DELETE FROM sessions WHERE token_hash = ?', [hashToken(token)]);
    response.setHeader('Set-Cookie', 'yatra_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
    response.status(204).end();
});

app.get('/api/auth/me', requireUser, (request, response) => {
    response.json({ user: request.user });
});

app.get('/api/expenses', requireUser, async (request, response) => {
    try {
        const [rows] = await getPool().execute(
            `SELECT id, title, destination_id AS destinationId, category, amount, currency,
                    expense_date AS expenseDate, notes, created_at AS createdAt, updated_at AS updatedAt
             FROM expenses WHERE user_id = ? ORDER BY expense_date DESC, id DESC`,
            [request.user.id]
        );
        response.json({ items: rows });
    } catch (error) {
        console.error('Expense query failed:', error.message);
        response.status(503).json({ error: 'Expense storage is unavailable.' });
    }
});

app.post('/api/expenses', requireUser, async (request, response) => {
    const { title = '', destinationId, category, amount, currency = 'INR', expenseDate, notes = '' } = request.body || {};
    if (!category || !Number.isFinite(Number(amount)) || Number(amount) <= 0 || !expenseDate || !/^[A-Z]{3}$/.test(currency)) {
        response.status(400).json({ error: 'Category, positive amount, currency, and expense date are required.' });
        return;
    }
    try {
        const [result] = await getPool().execute(
            `INSERT INTO expenses (user_id, destination_id, title, category, amount, currency, expense_date, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [request.user.id, destinationId || null, String(title).slice(0, 180) || 'Trip expense', category, Number(amount), currency, expenseDate, String(notes).slice(0, 1000)]
        );
        response.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error('Expense insert failed:', error.message);
        response.status(503).json({ error: 'Expense storage is unavailable.' });
    }
});

app.put('/api/expenses/:id', requireUser, async (request, response) => {
    const { title = '', destinationId, category, amount, currency = 'INR', expenseDate, notes = '' } = request.body || {};
    if (!category || !Number.isFinite(Number(amount)) || Number(amount) <= 0 || !expenseDate || !/^[A-Z]{3}$/.test(currency)) {
        response.status(400).json({ error: 'Category, positive amount, currency, and expense date are required.' });
        return;
    }
    try {
        const [result] = await getPool().execute(
            `UPDATE expenses SET destination_id = ?, title = ?, category = ?, amount = ?, currency = ?,
             expense_date = ?, notes = ? WHERE id = ? AND user_id = ?`,
            [destinationId || null, String(title).slice(0, 180) || 'Trip expense', category, Number(amount), currency, expenseDate, String(notes).slice(0, 1000), request.params.id, request.user.id]
        );
        if (!result.affectedRows) {
            response.status(404).json({ error: 'Expense not found.' });
            return;
        }
        response.status(204).end();
    } catch (error) {
        console.error('Expense update failed:', error.message);
        response.status(503).json({ error: 'Expense storage is unavailable.' });
    }
});

app.delete('/api/expenses/:id', requireUser, async (request, response) => {
    try {
        const [result] = await getPool().execute('DELETE FROM expenses WHERE id = ? AND user_id = ?', [request.params.id, request.user.id]);
        if (!result.affectedRows) {
            response.status(404).json({ error: 'Expense not found.' });
            return;
        }
        response.status(204).end();
    } catch (error) {
        console.error('Expense delete failed:', error.message);
        response.status(503).json({ error: 'Expense storage is unavailable.' });
    }
});

app.get('/api/price-reports', requireUser, async (request, response) => {
    const destinationId = String(request.query.destinationId || '');
    try {
        const [rows] = await getPool().execute(
            `SELECT id, destination_id AS destinationId, category, amount, currency,
                    visit_date AS visitDate, notes, receipt_reference AS receiptReference,
                    status, created_at AS submittedAt
             FROM price_reports
             WHERE user_id = ? AND (? = '' OR destination_id = ?)
             ORDER BY created_at DESC`,
            [request.user.id, destinationId, destinationId]
        );
        response.json({ items: rows });
    } catch (error) {
        console.error('Price report query failed:', error.message);
        response.status(503).json({ error: 'Price-report storage is unavailable.' });
    }
});

app.post('/api/price-reports', requireUser, async (request, response) => {
    const { destinationId, category, amount, currency = 'INR', visitDate, notes = '', receiptReference = '' } = request.body || {};
    if (!destinationId || !category || !Number.isFinite(Number(amount)) || Number(amount) <= 0 || !visitDate || !/^[A-Z]{3}$/.test(currency)) {
        response.status(400).json({ error: 'Destination, category, positive amount, currency, and visit date are required.' });
        return;
    }
    try {
        const [result] = await getPool().execute(
            `INSERT INTO price_reports
             (user_id, destination_id, category, amount, currency, visit_date, notes, receipt_reference)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [request.user.id, destinationId, category, Number(amount), currency, visitDate, String(notes).slice(0, 1000), String(receiptReference).slice(0, 255)]
        );
        response.status(201).json({ id: result.insertId, status: 'pending' });
    } catch (error) {
        console.error('Price report insert failed:', error.message);
        response.status(503).json({ error: 'Price-report storage is unavailable.' });
    }
});

app.get('/api/destinations', async (_request, response) => {
    try {
        const [rows] = await getPool().query(
            'SELECT id, name, state, type, time_needed, lat, lng, description FROM destinations ORDER BY name'
        );
        response.json(rows);
    } catch (error) {
        console.error('Destination query failed:', error.message);
        response.status(503).json({
            error: 'MySQL is unavailable. Start MySQL and run database/schema.sql.'
        });
    }
});

app.post('/api/itineraries', async (request, response) => {
    const { name, days, tripType, startLocation, endLocation } = request.body || {};

    if (!name || !Number.isInteger(Number(days)) || Number(days) < 3 || !tripType) {
        response.status(400).json({
            error: 'name, tripType, and a duration of at least 3 days are required.'
        });
        return;
    }

    try {
        const [result] = await getPool().execute(
            `INSERT INTO itineraries
             (name, days, trip_type, start_location, end_location)
             VALUES (?, ?, ?, ?, ?)`,
            [name, Number(days), tripType, startLocation || null, endLocation || null]
        );
        response.status(201).json({ id: result.insertId });
    } catch (error) {
        console.error('Itinerary insert failed:', error.message);
        response.status(503).json({
            error: 'MySQL is unavailable. Start MySQL and run database/schema.sql.'
        });
    }
});

app.use((_request, response) => {
    response.status(404).json({ error: 'API route not found.' });
});

app.listen(port, () => {
    console.log(`Yatra API listening on http://localhost:${port}`);
});
