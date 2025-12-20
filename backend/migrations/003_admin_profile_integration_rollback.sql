-- ============================================================
-- Rollback Migration: Admin Profile Integration
-- Date: November 12, 2025
-- Purpose: Reverse all changes from 003_admin_profile_integration.sql
-- ============================================================

-- ============================================================
-- PART 1: DROP NEW TABLES
-- ============================================================

-- Drop file_downloads table
DROP TABLE IF EXISTS file_downloads;

-- Drop event_notifications table
DROP TABLE IF EXISTS event_notifications;

-- ============================================================
-- PART 2: REMOVE COLUMNS FROM FILES TABLE
-- ============================================================

-- Remove admin profile tracking columns from files table
ALTER TABLE files
DROP COLUMN IF EXISTS uploaded_by_profile_id,
DROP COLUMN IF EXISTS uploaded_by_email,
DROP COLUMN IF EXISTS uploaded_by_name;

-- Drop indexes
DROP INDEX IF EXISTS idx_files_uploaded_by_email ON files;
DROP INDEX IF EXISTS idx_files_uploaded_by_profile ON files;

-- ============================================================
-- PART 3: REMOVE COLUMNS FROM SCHEDULED_EVENTS TABLE
-- ============================================================

-- Remove admin profile tracking columns from scheduled_events table
ALTER TABLE scheduled_events
DROP COLUMN IF EXISTS updated_by_profile_id,
DROP COLUMN IF EXISTS created_by_email,
DROP COLUMN IF EXISTS created_by_name,
DROP COLUMN IF EXISTS created_by_profile_id;

-- Drop indexes
DROP INDEX IF EXISTS idx_events_updated_by_profile ON scheduled_events;
DROP INDEX IF EXISTS idx_events_created_by_email ON scheduled_events;
DROP INDEX IF EXISTS idx_events_created_by_profile ON scheduled_events;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Verify files table structure
DESCRIBE files;

-- Verify scheduled_events table structure
DESCRIBE scheduled_events;

-- Verify tables are dropped
SHOW TABLES LIKE 'file_downloads';
SHOW TABLES LIKE 'event_notifications';

-- ============================================================
-- NOTES
-- ============================================================
-- 1. This rollback script removes all changes made by the migration
-- 2. Data in the original columns (uploaded_by, created_by) is preserved
-- 3. New tables (file_downloads, event_notifications) are completely removed
-- 4. admin_activity_log table is NOT removed as it may be used by other features
-- 5. Run this script only if you need to completely reverse the migration
-- ============================================================
