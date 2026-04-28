-- Database: user_db
-- Export file for submission

CREATE DATABASE IF NOT EXISTS user_db;
USE user_db;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name) VALUES 
('John Doe'),
('Jane Smith'),
('Bob Johnson'),
('Alice Williams'),
('Charlie Brown');

SELECT * FROM users;

-- Export command: mysqldump -u root -p user_db > database_backup.sql
