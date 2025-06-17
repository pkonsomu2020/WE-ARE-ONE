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