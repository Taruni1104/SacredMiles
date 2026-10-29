require('dotenv').config({ path: '.env.local' });

const cors = require('cors');
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = Number(process.env.API_PORT || 4000);

app.use(cors());
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

app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok', service: 'yatra-api' });
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
