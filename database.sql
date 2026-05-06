-- Create Database
CREATE DATABASE IF NOT EXISTS smart_campus_events;
USE smart_campus_events;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Student', 'Admin') DEFAULT 'Student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    organizer VARCHAR(255) NOT NULL,
    date VARCHAR(100) NOT NULL,
    time VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
    image TEXT,
    description TEXT,
    category VARCHAR(100),
    maxCapacity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventId INT NOT NULL,
    userId INT NOT NULL,
    seats INT DEFAULT 1,
    totalPrice DECIMAL(10, 2) DEFAULT 0.00,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventId INT NOT NULL,
    userId INT NOT NULL,
    userName VARCHAR(255),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert Sample Events
INSERT INTO events (title, organizer, date, time, location, price, image, description, category, maxCapacity) VALUES
('Tech Fest 2026', 'Coding Club', 'May 10, 2026', '10:00 AM - 05:00 PM', 'Main Auditorium', 100.00, 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=1000', 'A grand technical festival showcasing innovation, coding competitions, and guest lectures from industry experts.', 'Technical', 150),
('Cultural Night', 'Arts & Drama Society', 'June 15, 2026', '06:00 PM - 10:00 PM', 'Open Air Theatre', 0.00, 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000', 'A vibrant evening celebrating the diverse cultures on campus through dance, music, and drama performances.', 'Cultural', 500),
('Startup Pitch Day', 'EDC Club', 'July 05, 2026', '02:00 PM - 06:00 PM', 'Seminar Hall-B', 50.00, 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000', 'Got a business idea? Pitch it to a panel of investors and mentors to win seed funding and incubation support.', 'Business', 80),
('Annual Sports Meet', 'Sports Department', 'August 20, 2026', '08:00 AM - 06:00 PM', 'College Ground', 20.00, 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000', 'A day filled with energy and sportsmanship. Compete in athletics, football, basketball, and more.', 'Sports', 300),
('Robotics Workshop', 'Robotics Club', 'September 12, 2026', '10:00 AM - 04:00 PM', 'Lab 402', 200.00, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000', 'Hands-on workshop on building and programming robots using Arduino and Raspberry Pi.', 'Technical', 50),
('Photography Exhibition', 'Media Cell', 'October 05, 2026', '10:00 AM - 06:00 PM', 'Art Gallery', 0.00, 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1000', 'Showcasing the best clicks from our student photographers capturing campus life and nature.', 'Cultural', 200),
('Hackathon 2026', 'Google DSC', 'November 15, 2026', '48 Hours', 'Innovation Hub', 0.00, 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000', 'A 48-hour hackathon where teams compete to build solutions for real-world problems.', 'Technical', 120),
('Music Festival', 'Music Society', 'December 20, 2026', '05:00 PM - 11:00 PM', 'Main Auditorium', 150.00, 'https://images.unsplash.com/photo-1514525253361-bee8d41dfb7a?q=80&w=1000', 'An evening of live music performances by bands and solo artists across various genres.', 'Cultural', 400),
('Business Case Competition', 'Management Club', 'January 10, 2027', '09:00 AM - 05:00 PM', 'Conference Room', 100.00, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000', 'A competition to test your business acumen and problem-solving skills with real-life business cases.', 'Business', 60);
