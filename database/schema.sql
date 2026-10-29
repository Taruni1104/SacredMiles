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

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT sessions_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX sessions_expiry_idx (expires_at)
);

CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    destination_id VARCHAR(80),
    title VARCHAR(180) NOT NULL,
    category VARCHAR(80) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'INR',
    expense_date DATE NOT NULL,
    notes VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT expenses_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX expenses_user_date_idx (user_id, expense_date)
);

CREATE TABLE IF NOT EXISTS price_reports (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    destination_id VARCHAR(80) NOT NULL,
    category VARCHAR(80) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'INR',
    visit_date DATE NOT NULL,
    notes VARCHAR(1000),
    receipt_reference VARCHAR(255),
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    reviewed_at DATETIME,
    reviewer_note VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT price_reports_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX price_reports_destination_idx (destination_id, category, status)
);

-- Import the destination records from lib/data.js during the first database
-- setup, or add INSERT statements for the destinations required by your pilot.
