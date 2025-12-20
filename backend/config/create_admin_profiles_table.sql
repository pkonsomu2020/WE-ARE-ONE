-- Create a separate admin_profiles table for tracking and notifications
-- This keeps the authentication separate from individual admin profiles

CREATE TABLE `admin_profiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `role` varchar(50) DEFAULT 'Admin',
  `status` varchar(20) DEFAULT 'active',
  `email_notifications` tinyint(1) DEFAULT 1,
  `last_activity` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_admin_profile_email` (`email`),
  KEY `idx_admin_profile_phone` (`phone_number`),
  KEY `idx_admin_profile_role` (`role`),
  KEY `idx_admin_profile_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Insert all admin profiles for tracking and notifications
INSERT INTO `admin_profiles` (`full_name`, `email`, `phone_number`, `role`, `status`, `email_notifications`) VALUES
('WAO Super Admin', 'admin@weareone.co.ke', '+254700000000', 'Super Admin', 'active', 1),
('Stacy Agwanda Jacinta', 'stacyagwanda@gmail.com', '0769357562', 'Admin', 'active', 1),
('Stella Brenda Nyanchama', 'stellakirioba@gmail.com', '0748843957', 'Admin', 'active', 1),
('Muriuki V Linnet', 'muriukivapour@gmail.com', '0725422407', 'Admin', 'active', 1),
('Rachael Madawa Lucas', 'rachaellucas94@gmail.com', '0741057186', 'Admin', 'active', 1),
('Cruzz Eltone', 'cruzeltone@gmail.com', '0711853928', 'Admin', 'active', 1),
('Mary Deckline', 'daisymary1190@gmail.com', '0758646028', 'Admin', 'active', 1),
('Apollo Apondi', 'apollopondi99@gmail.com', '0797522400', 'Admin', 'active', 1),
('Glorian Katheu', 'gloriankatheu@gmail.com', '0725381452', 'Admin', 'active', 1),
('Brian Kevin Mwangi', 'kevindoc254@gmail.com', '0727154737', 'Admin', 'active', 1),
('Kevin Koech', 'kevinkoechx@gmail.com', '0715987339', 'Admin', 'active', 1),
('Daniel Mahmoud Alli Anicethy Prodl', 'malikaprodl007@gmail.com', '0758644004', 'Admin', 'active', 1),
('Peter Onsomu', 'pkonsomu2021@gmail.com', '0745343256', 'Admin', 'active', 1);

-- Create admin activity tracking table
CREATE TABLE `admin_activity_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_profile_id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_admin_activity_profile` (`admin_profile_id`),
  KEY `idx_admin_activity_action` (`action`),
  KEY `idx_admin_activity_date` (`created_at`),
  FOREIGN KEY (`admin_profile_id`) REFERENCES `admin_profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Create notification preferences table
CREATE TABLE `admin_notification_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_profile_id` int(11) NOT NULL,
  `notification_type` varchar(100) NOT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_admin_notification` (`admin_profile_id`, `notification_type`),
  KEY `idx_notification_settings_admin` (`admin_profile_id`),
  FOREIGN KEY (`admin_profile_id`) REFERENCES `admin_profiles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Insert default notification settings for all admins
INSERT INTO `admin_notification_settings` (`admin_profile_id`, `notification_type`, `enabled`)
SELECT 
  ap.id,
  notification_type,
  1 as enabled
FROM `admin_profiles` ap
CROSS JOIN (
  SELECT 'new_order' as notification_type
  UNION SELECT 'payment_verification'
  UNION SELECT 'system_maintenance'
  UNION SELECT 'weekly_reports'
  UNION SELECT 'monthly_reports'
  UNION SELECT 'security_alerts'
  UNION SELECT 'feedback_received'
  UNION SELECT 'event_reminders'
) notifications;