-- ============================================================
-- Migration: Admin Profile Integration
-- Date: November 12, 2025
-- Purpose: Add admin profile tracking across all admin operations
-- ============================================================

-- ============================================================
-- PART 1: FILES TABLE ENHANCEMENTS
-- ============================================================

-- Add admin profile tracking columns to files table
ALTER TABLE files
ADD COLUMN uploaded_by_name VARCHAR(255) NULL AFTER uploaded_by,
ADD COLUMN uploaded_by_email VARCHAR(255) NULL AFTER uploaded_by_name,
ADD COLUMN uploaded_by_profile_id INT NULL AFTER uploaded_by_email;

-- Add indexes for performance
CREATE INDEX idx_files_uploaded_by_email ON files(uploaded_by_email);
CREATE INDEX idx_files_uploaded_by_profile ON files(uploaded_by_profile_id);

-- Add foreign key constraint (optional - can be added after data migration)
-- ALTER TABLE files
-- ADD CONSTRAINT fk_files_uploaded_by_profile
-- FOREIGN KEY (uploaded_by_profile_id) REFERENCES admin_profiles(id) ON DELETE SET NULL;

-- ============================================================
-- PART 2: FILE DOWNLOADS TRACKING TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS file_downloads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  file_id INT NOT NULL,
  downloaded_by_profile_id INT NOT NULL,
  downloaded_by_name VARCHAR(255) NOT NULL,
  downloaded_by_email VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE,
  FOREIGN KEY (downloaded_by_profile_id) REFERENCES admin_profiles(id) ON DELETE CASCADE,
  INDEX idx_file_id (file_id),
  INDEX idx_downloaded_by_profile (downloaded_by_profile_id),
  INDEX idx_downloaded_by_email (downloaded_by_email),
  INDEX idx_downloaded_at (downloaded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PART 3: SCHEDULED EVENTS TABLE ENHANCEMENTS
-- ============================================================

-- Add admin profile tracking columns to scheduled_events table
ALTER TABLE scheduled_events
ADD COLUMN created_by_profile_id INT NULL AFTER created_by,
ADD COLUMN created_by_name VARCHAR(255) NULL AFTER created_by_profile_id,
ADD COLUMN created_by_email VARCHAR(255) NULL AFTER created_by_name,
ADD COLUMN updated_by_profile_id INT NULL AFTER created_by_email;

-- Add indexes for performance
CREATE INDEX idx_events_created_by_profile ON scheduled_events(created_by_profile_id);
CREATE INDEX idx_events_created_by_email ON scheduled_events(created_by_email);
CREATE INDEX idx_events_updated_by_profile ON scheduled_events(updated_by_profile_id);

-- Add foreign key constraints (optional - can be added after data migration)
-- ALTER TABLE scheduled_events
-- ADD CONSTRAINT fk_events_created_by_profile
-- FOREIGN KEY (created_by_profile_id) REFERENCES admin_profiles(id) ON DELETE SET NULL;

-- ALTER TABLE scheduled_events
-- ADD CONSTRAINT fk_events_updated_by_profile
-- FOREIGN KEY (updated_by_profile_id) REFERENCES admin_profiles(id) ON DELETE SET NULL;

-- ============================================================
-- PART 4: EVENT NOTIFICATIONS TABLE (for email tracking)
-- ============================================================

CREATE TABLE IF NOT EXISTS event_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255) NULL,
  notification_type ENUM('reminder', 'invitation', 'update', 'cancellation') NOT NULL,
  email_status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
  error_message TEXT NULL,
  sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES scheduled_events(id) ON DELETE CASCADE,
  INDEX idx_event_id (event_id),
  INDEX idx_recipient_email (recipient_email),
  INDEX idx_email_status (email_status),
  INDEX idx_sent_at (sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PART 5: VERIFY EXISTING TABLES
-- ============================================================

-- Verify admin_activity_log table exists with correct structure
-- (This table should already exist from previous migrations)
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_profile_id INT NOT NULL,
  action VARCHAR(255) NOT NULL,
  description TEXT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  request_data JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_profile_id) REFERENCES admin_profiles(id) ON DELETE CASCADE,
  INDEX idx_admin_profile (admin_profile_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PART 6: DATA MIGRATION (Optional - Update existing records)
-- ============================================================

-- Update existing files with admin profile data where possible
-- This attempts to match the uploaded_by field with admin_profiles email
UPDATE files f
LEFT JOIN admin_profiles ap ON f.uploaded_by = ap.email
SET 
  f.uploaded_by_name = ap.full_name,
  f.uploaded_by_email = ap.email,
  f.uploaded_by_profile_id = ap.id
WHERE ap.id IS NOT NULL;

-- Update existing scheduled_events with admin profile data where possible
-- This attempts to match the created_by field with admin_profiles email or name
UPDATE scheduled_events se
LEFT JOIN admin_profiles ap ON (se.created_by = ap.email OR se.created_by = ap.full_name)
SET 
  se.created_by_profile_id = ap.id,
  se.created_by_name = ap.full_name,
  se.created_by_email = ap.email
WHERE ap.id IS NOT NULL;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check files table updates
SELECT 
  COUNT(*) as total_files,
  SUM(CASE WHEN uploaded_by_profile_id IS NOT NULL THEN 1 ELSE 0 END) as files_with_profile,
  SUM(CASE WHEN uploaded_by_profile_id IS NULL THEN 1 ELSE 0 END) as files_without_profile
FROM files;

-- Check scheduled_events table updates
SELECT 
  COUNT(*) as total_events,
  SUM(CASE WHEN created_by_profile_id IS NOT NULL THEN 1 ELSE 0 END) as events_with_profile,
  SUM(CASE WHEN created_by_profile_id IS NULL THEN 1 ELSE 0 END) as events_without_profile
FROM scheduled_events;

-- List files with uploader information
SELECT 
  f.id,
  f.original_name,
  f.uploaded_by as old_uploaded_by,
  f.uploaded_by_name,
  f.uploaded_by_email,
  f.uploaded_by_profile_id,
  f.created_at
FROM files
ORDER BY f.created_at DESC
LIMIT 10;

-- List events with creator information
SELECT 
  se.id,
  se.title,
  se.created_by as old_created_by,
  se.created_by_name,
  se.created_by_email,
  se.created_by_profile_id,
  se.created_at
FROM scheduled_events
ORDER BY se.created_at DESC
LIMIT 10;

-- ============================================================
-- NOTES
-- ============================================================
-- 1. Foreign key constraints are commented out to allow flexibility
--    Uncomment them after verifying data migration is successful
-- 2. Existing data is migrated where possible by matching emails/names
-- 3. New records will always include admin profile information
-- 4. The admin_activity_log table is created if it doesn't exist
-- 5. Event notifications table is new for tracking email delivery
-- ============================================================
