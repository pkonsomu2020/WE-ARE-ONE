-- Event Scheduler Database Schema
-- This handles both internal meetings and organization events

-- Main events table for the scheduler
CREATE TABLE IF NOT EXISTS `scheduled_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `type` enum('meeting','organization_event','reminder') NOT NULL DEFAULT 'meeting',
  `description` text DEFAULT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `meeting_link` varchar(500) DEFAULT NULL,
  `created_by` varchar(255) NOT NULL DEFAULT 'Admin',
  `is_recurring` tinyint(1) DEFAULT 0,
  `recurrence_pattern` varchar(100) DEFAULT NULL,
  `status` enum('scheduled','cancelled','completed') DEFAULT 'scheduled',
  `reminder_sent` tinyint(1) DEFAULT 0,
  `reminder_sent_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_event_date` (`start_datetime`),
  KEY `idx_event_type` (`type`),
  KEY `idx_event_status` (`status`),
  KEY `idx_event_reminder` (`reminder_sent`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Event attendees table (links to admin_profiles)
CREATE TABLE IF NOT EXISTS `event_attendees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `admin_profile_id` int(11) DEFAULT NULL,
  `external_email` varchar(255) DEFAULT NULL,
  `external_name` varchar(255) DEFAULT NULL,
  `attendance_status` enum('invited','accepted','declined','tentative') DEFAULT 'invited',
  `notification_sent` tinyint(1) DEFAULT 0,
  `notification_sent_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_event_attendees_event` (`event_id`),
  KEY `idx_event_attendees_admin` (`admin_profile_id`),
  KEY `idx_event_attendees_status` (`attendance_status`),
  FOREIGN KEY (`event_id`) REFERENCES `scheduled_events`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`admin_profile_id`) REFERENCES `admin_profiles`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Event notifications log
CREATE TABLE IF NOT EXISTS `event_notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `notification_type` enum('invitation','reminder','update','cancellation') NOT NULL,
  `recipient_email` varchar(255) NOT NULL,
  `recipient_name` varchar(255) DEFAULT NULL,
  `sent_at` datetime NOT NULL,
  `email_subject` varchar(255) DEFAULT NULL,
  `email_status` enum('sent','failed','pending') DEFAULT 'pending',
  `error_message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_event_notifications_event` (`event_id`),
  KEY `idx_event_notifications_type` (`notification_type`),
  KEY `idx_event_notifications_status` (`email_status`),
  FOREIGN KEY (`event_id`) REFERENCES `scheduled_events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Event reminders schedule
CREATE TABLE IF NOT EXISTS `event_reminders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `reminder_type` enum('24_hours','1_hour','30_minutes','custom') NOT NULL,
  `reminder_datetime` datetime NOT NULL,
  `is_sent` tinyint(1) DEFAULT 0,
  `sent_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_event_reminders_event` (`event_id`),
  KEY `idx_event_reminders_datetime` (`reminder_datetime`),
  KEY `idx_event_reminders_sent` (`is_sent`),
  FOREIGN KEY (`event_id`) REFERENCES `scheduled_events`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Add indexes for better performance
CREATE INDEX `idx_scheduled_events_date_type` ON `scheduled_events` (`start_datetime`, `type`);
CREATE INDEX `idx_event_attendees_email` ON `event_attendees` (`external_email`);
CREATE INDEX `idx_event_notifications_recipient` ON `event_notifications` (`recipient_email`);