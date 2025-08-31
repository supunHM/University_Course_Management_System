-- Course API Database Setup Script
-- Run this script in your MySQL database to set up the required database

-- Create the university database
CREATE DATABASE IF NOT EXISTS university;

-- Use the university database
USE university;

-- The Course table will be auto-created by JPA when you start the application
-- But if you want to create it manually, use this:
/*
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    credits INTEGER
);
*/

-- Sample data to test with (run after starting the application)
-- This will insert test data only if the courses don't already exist
INSERT IGNORE INTO courses (code, title, description, credits) VALUES 
('CS101', 'Introduction to Computer Science', 'Basic concepts of programming and computer science', 3),
('MATH201', 'Calculus I', 'Differential and integral calculus', 4),
('ENG100', 'English Composition', 'Academic writing and communication skills', 3),
('CS102', 'Data Structures and Algorithms', 'Study of fundamental data structures and algorithms', 4),
('CS301', 'Database Systems', 'Database design, implementation, and management', 4);

-- Verify the setup
SELECT 'Database setup completed successfully!' as status;
SHOW TABLES;
SELECT * FROM courses;
