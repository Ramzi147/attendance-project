-- Système de Présence - Université d'Alger
-- Base de données : attendance_system

CREATE DATABASE IF NOT EXISTS attendance_system;
USE attendance_system;

-- Table des sessions de présence
CREATE TABLE attendance_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id VARCHAR(50) NOT NULL,
    group_id VARCHAR(50) NOT NULL,
    date DATETIME NOT NULL,
    opened_by VARCHAR(100) NOT NULL,
    status ENUM('open', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Données de test
INSERT INTO attendance_sessions (course_id, group_id, date, opened_by, status) VALUES 
('AWP', 'AWP-G1', '2025-01-15 10:00:00', 'PROF001', 'open'),
('DBMS', 'DBMS-G1', '2025-01-16 14:00:00', 'PROF002', 'closed'),
('SE', 'SE-G1', '2025-01-17 09:00:00', 'PROF001', 'open');