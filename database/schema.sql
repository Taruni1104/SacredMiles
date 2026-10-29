CREATE DATABASE IF NOT EXISTS yatra;
USE yatra;

CREATE TABLE IF NOT EXISTS destinations (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    state VARCHAR(100) NOT NULL,
    type ENUM('temple', 'sightseeing') NOT NULL,
    time_needed DECIMAL(4, 1) NOT NULL DEFAULT 1,
    lat DECIMAL(9, 6) NOT NULL,
    lng DECIMAL(9, 6) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS itineraries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    days INT NOT NULL,
    trip_type VARCHAR(40) NOT NULL,
    start_location VARCHAR(180),
    end_location VARCHAR(180),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Import the destination records from lib/data.js during the first database
-- setup, or add INSERT statements for the destinations required by your pilot.
