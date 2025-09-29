-- Create database (run this first)
CREATE DATABASE IF NOT EXISTS donation_app;
USE donation_app;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  gender ENUM('male', 'female', 'other', 'prefer_not_to_say') NOT NULL,
  age INT NOT NULL,
  location VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  emergency_contact_name VARCHAR(255) NOT NULL,
  emergency_contact_phone VARCHAR(20) NOT NULL,
  emergency_contact_relationship VARCHAR(100) NOT NULL,
  live_location TEXT,
  personal_statement TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_phone (phone)
);

-- Admin users (for admin dashboard authentication)
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_admin_email (email)
);

-- Password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_expires (expires_at)
);

-- Support categories table
CREATE TABLE IF NOT EXISTS support_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- User support categories junction table
CREATE TABLE IF NOT EXISTS user_support_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  support_category_id INT NOT NULL,
  other_details TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (support_category_id) REFERENCES support_categories(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_category (user_id, support_category_id)
);

-- Mood Tracker table
CREATE TABLE IF NOT EXISTS moods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  mood_value INT NOT NULL, -- 1-5 scale
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Journal Entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User Settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  dark_mode BOOLEAN DEFAULT FALSE,
  mood_reminders BOOLEAN DEFAULT FALSE,
  data_retention_days INT DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user (user_id)
);

-- Chat Sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  session_name VARCHAR(255) DEFAULT 'New Chat',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chat Messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  sender ENUM('user', 'ai') NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
);

-- Insert default support categories
INSERT IGNORE INTO support_categories (name) VALUES
('Mental Health'),
('Substance Abuse / Addiction Recovery'),
('Domestic Violence'),
('Sexual Abuse'),
('Grief or Loss Support'),
('Financial Assistance'),
('Youth Empowerment'),
('LGBTQ+ Support'),
('Disability Support'),
('Relationship/Family Counseling'),
('Other');

-- Event registrations
CREATE TABLE IF NOT EXISTS event_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id VARCHAR(100) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  experience_text TEXT,
  accept_terms TINYINT(1) DEFAULT 0,
  accept_updates TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_event_id (event_id),
  INDEX idx_email_event (email, event_id)
);

-- Event tickets table (allocations)
CREATE TABLE IF NOT EXISTS event_tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id VARCHAR(100) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  ticket_type ENUM('WAO Members','Public','Standard') NOT NULL,
  amount_paid INT NOT NULL,
  mpesa_code VARCHAR(32) NOT NULL,
  ticket_number VARCHAR(32) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_event_email (event_id, user_email),
  INDEX idx_mpesa_code (mpesa_code)
);

-- M-Pesa verification callbacks log
CREATE TABLE IF NOT EXISTS mpesa_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mpesa_code VARCHAR(32) NOT NULL,
  amount INT DEFAULT NULL,
  msisdn VARCHAR(32) DEFAULT NULL,
  payer_name VARCHAR(255) DEFAULT NULL,
  status VARCHAR(64) NOT NULL,
  raw_response JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_mpesa_code (mpesa_code)
);

-- Event payments (manual verification workflow)
CREATE TABLE IF NOT EXISTS event_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id VARCHAR(100) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  ticket_type ENUM('WAO Members','Public','Standard') NOT NULL,
  amount INT NOT NULL,
  mpesa_code VARCHAR(32) NOT NULL,
  status ENUM('pending_verification','paid','failed') DEFAULT 'pending_verification',
  confirmation_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_event_status (event_id, status),
  UNIQUE KEY uniq_mpesa_code (mpesa_code)
);