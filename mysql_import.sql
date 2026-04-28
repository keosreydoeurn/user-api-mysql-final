-- Import this file to phpMyAdmin
-- Database: myapp

CREATE DATABASE IF NOT EXISTS myapp;
USE myapp;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert your data
INSERT INTO users (name, created_at) VALUES 
('John Doe', '2026-04-28 02:49:56'),
('Jane Smith', '2026-04-28 02:49:56'),
('Bob Johnson', '2026-04-28 02:49:56'),
('lyhour', '2026-04-28 02:52:25'),
('yuna', '2026-04-28 02:54:09');

-- Verify data
SELECT * FROM users;
