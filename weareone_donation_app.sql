-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 21, 2025 at 05:45 PM
-- Server version: 10.6.23-MariaDB
-- PHP Version: 8.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `weareone_donation_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_activity_log`
--

CREATE TABLE `admin_activity_log` (
  `id` int(11) NOT NULL,
  `admin_profile_id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `admin_activity_log`
--

INSERT INTO `admin_activity_log` (`id`, `admin_profile_id`, `action`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, 1, 'test_action', 'Testing activity logger functionality', '127.0.0.1', 'Test Script', '2025-11-13 10:54:48'),
(2, 1, 'verification_test', 'Testing activity logging from verification script', '127.0.0.1', 'Verification Script', '2025-11-13 10:59:28'),
(3, 1, 'comprehensive_test', 'Testing from comprehensive test suite', '127.0.0.1', 'Test Suite', '2025-11-13 11:23:41'),
(4, 13, 'event_created', 'Peter Onsomu created event: Test Event - Terminal Test 2025-11-13', '::ffff:127.0.0.1', 'unknown', '2025-11-13 14:42:30'),
(5, 13, 'event_deleted', 'Peter Onsomu deleted event #5', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-13 15:02:10'),
(6, 13, 'event_deleted', 'Peter Onsomu deleted event #6', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-13 15:02:14'),
(7, 13, 'document_upload', 'Peter Onsomu uploaded document: THE CONSTITUTION FINAL EDIT.pdf', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-13 18:00:51'),
(8, 13, 'document_upload', 'Peter Onsomu uploaded document: CIVIC EDUCATION SOCIAL MEDIA STRATEGY.docx', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-13 18:01:41'),
(9, 13, 'event_created', 'Peter Onsomu created event: WAO_Meetup - Kanunga Falls Meeting', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-13 18:03:29'),
(10, 11, 'document_upload', 'Kevin Koech uploaded 2 documents', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-14 07:52:09'),
(11, 13, 'document_delete', 'Peter Onsomu deleted document #2', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-17 12:24:18'),
(12, 13, 'document_delete', 'Peter Onsomu deleted document #1', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-17 12:24:27');

-- --------------------------------------------------------

--
-- Table structure for table `admin_notification_settings`
--

CREATE TABLE `admin_notification_settings` (
  `id` int(11) NOT NULL,
  `admin_profile_id` int(11) NOT NULL,
  `notification_type` varchar(100) NOT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `admin_notification_settings`
--

INSERT INTO `admin_notification_settings` (`id`, `admin_profile_id`, `notification_type`, `enabled`, `created_at`, `updated_at`) VALUES
(1, 1, 'new_order', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(2, 1, 'payment_verification', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(3, 1, 'system_maintenance', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(4, 1, 'weekly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(5, 1, 'monthly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(6, 1, 'security_alerts', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(7, 1, 'feedback_received', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(8, 1, 'event_reminders', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(9, 6, 'new_order', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(10, 6, 'payment_verification', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(11, 6, 'system_maintenance', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(12, 6, 'weekly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(13, 6, 'monthly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(14, 6, 'security_alerts', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(15, 6, 'feedback_received', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(16, 6, 'event_reminders', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(17, 11, 'new_order', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(18, 11, 'payment_verification', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(19, 11, 'system_maintenance', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(20, 11, 'weekly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(21, 11, 'monthly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(22, 11, 'security_alerts', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(23, 11, 'feedback_received', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(24, 11, 'event_reminders', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(25, 9, 'new_order', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(26, 9, 'payment_verification', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(27, 9, 'system_maintenance', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(28, 9, 'weekly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(29, 9, 'monthly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(30, 9, 'security_alerts', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(31, 9, 'feedback_received', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(32, 9, 'event_reminders', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(33, 4, 'new_order', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(34, 4, 'payment_verification', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(35, 4, 'system_maintenance', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(36, 4, 'weekly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(37, 4, 'monthly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(38, 4, 'security_alerts', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(39, 4, 'feedback_received', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(40, 4, 'event_reminders', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(41, 10, 'new_order', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(42, 10, 'payment_verification', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(43, 10, 'system_maintenance', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(44, 10, 'weekly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(45, 10, 'monthly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(46, 10, 'security_alerts', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(47, 10, 'feedback_received', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(48, 10, 'event_reminders', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(49, 5, 'new_order', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(50, 5, 'payment_verification', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(51, 5, 'system_maintenance', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(52, 5, 'weekly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(53, 5, 'monthly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(54, 5, 'security_alerts', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(55, 5, 'feedback_received', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(56, 5, 'event_reminders', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(57, 13, 'new_order', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(58, 13, 'payment_verification', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(59, 13, 'system_maintenance', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(60, 13, 'weekly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(61, 13, 'monthly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(62, 13, 'security_alerts', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(63, 13, 'feedback_received', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(64, 13, 'event_reminders', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(65, 3, 'new_order', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(66, 3, 'payment_verification', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(67, 3, 'system_maintenance', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(68, 3, 'weekly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(69, 3, 'monthly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(70, 3, 'security_alerts', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(71, 3, 'feedback_received', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(72, 3, 'event_reminders', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(73, 12, 'new_order', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(74, 12, 'payment_verification', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(75, 12, 'system_maintenance', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(76, 12, 'weekly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(77, 12, 'monthly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(78, 12, 'security_alerts', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(79, 12, 'feedback_received', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(80, 12, 'event_reminders', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(81, 7, 'new_order', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(82, 7, 'payment_verification', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(83, 7, 'system_maintenance', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(84, 7, 'weekly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(85, 7, 'monthly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(86, 7, 'security_alerts', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(87, 7, 'feedback_received', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(88, 7, 'event_reminders', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(89, 2, 'new_order', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(90, 2, 'payment_verification', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(91, 2, 'system_maintenance', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(92, 2, 'weekly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(93, 2, 'monthly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(94, 2, 'security_alerts', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(95, 2, 'feedback_received', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(96, 2, 'event_reminders', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(97, 8, 'new_order', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(98, 8, 'payment_verification', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(99, 8, 'system_maintenance', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(100, 8, 'weekly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(101, 8, 'monthly_reports', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(102, 8, 'security_alerts', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(103, 8, 'feedback_received', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28'),
(104, 8, 'event_reminders', 1, '2025-10-24 15:27:28', '2025-10-24 15:27:28');

-- --------------------------------------------------------

--
-- Table structure for table `admin_profiles`
--

CREATE TABLE `admin_profiles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `role` varchar(50) DEFAULT 'Admin',
  `status` varchar(20) DEFAULT 'active',
  `email_notifications` tinyint(1) DEFAULT 1,
  `last_activity` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `can_access_orders` tinyint(1) DEFAULT 0 COMMENT 'Permission to access Orders page'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `admin_profiles`
--

INSERT INTO `admin_profiles` (`id`, `user_id`, `full_name`, `email`, `phone_number`, `role`, `status`, `email_notifications`, `last_activity`, `created_at`, `updated_at`, `can_access_orders`) VALUES
(1, 1, 'WAO Admin', 'admin@weareone.co.ke', '+254745343256', 'Super Admin', 'active', 1, '2025-12-10 12:05:24', '2025-10-24 15:26:37', '2025-12-10 12:05:24', 1),
(2, 2, 'Stacy Agwanda Jacinta', 'stacyagwanda@gmail.com', '0769357562', 'Admin', 'active', 1, '2025-11-14 03:18:52', '2025-10-24 15:26:37', '2025-11-14 03:18:52', 0),
(3, 3, 'Stella Brenda Nyanchama', 'stellakirioba@gmail.com', '0748843957', 'Admin', 'active', 1, NULL, '2025-10-24 15:26:37', '2025-11-11 19:38:18', 0),
(4, 4, 'Muriuki V Linnet', 'muriukivapour@gmail.com', '0725422407', 'Admin', 'active', 1, '2025-11-14 07:30:53', '2025-10-24 15:26:37', '2025-11-14 07:30:53', 0),
(5, 5, 'Rachael Madawa Lucas', 'rachaellucas94@gmail.com', '0741057186', 'Admin', 'active', 1, '2025-11-14 12:20:36', '2025-10-24 15:26:37', '2025-11-14 12:20:36', 0),
(6, 6, 'Cruzz Eltone', 'cruzeltone@gmail.com', '0711853928', 'Admin', 'active', 1, '2025-11-17 13:07:41', '2025-10-24 15:26:37', '2025-11-17 13:07:41', 1),
(7, 7, 'Mary Deckline', 'daisymary1190@gmail.com', '0758646028', 'Admin', 'active', 1, '2025-11-14 05:33:23', '2025-10-24 15:26:37', '2025-11-14 05:33:23', 0),
(8, 8, 'Apollo Apondi', 'apollopondi99@gmail.com', '0797522400', 'Admin', 'active', 1, '2025-11-14 08:47:08', '2025-10-24 15:26:37', '2025-11-14 08:47:08', 0),
(9, 9, 'Glorian Katheu', 'gloriankatheu@gmail.com', '0725381452', 'Admin', 'active', 1, '2025-11-14 06:19:02', '2025-10-24 15:26:37', '2025-11-14 06:19:02', 0),
(10, 10, 'Brian Kevin Mwangi', 'kevindoc254@gmail.com', '0727154737', 'Admin', 'active', 1, '2025-11-14 07:21:58', '2025-10-24 15:26:37', '2025-11-14 07:21:58', 0),
(11, 11, 'Kevin Koech', 'kevinkoechx@gmail.com', '0715987339', 'Admin', 'active', 1, '2025-11-23 16:40:42', '2025-10-24 15:26:37', '2025-11-23 16:40:42', 0),
(12, 12, 'Daniel Mahmoud Alli Anicethy Prodl', 'malikaprodl007@gmail.com', '0758644004', 'Admin', 'active', 1, '2025-11-13 20:56:38', '2025-10-24 15:26:37', '2025-11-13 20:56:38', 0),
(13, 13, 'Peter Onsomu', 'pkonsomu2021@gmail.com', '0745343256', 'Admin', 'active', 1, '2025-11-17 13:06:41', '2025-10-24 15:26:37', '2025-11-17 13:06:41', 1);

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `full_name`, `email`, `password_hash`, `created_at`, `updated_at`) VALUES
(1, 'WAO Admin', 'admin@weareone.co.ke', '$2a$12$QAupIbWrmhpqe/FDUXd2o.vWH2SMKi32RU6LGdD0QboKe0iHpR62G', '2025-08-20 09:16:22', '2025-08-20 09:16:22'),
(2, 'Stacy Agwanda Jacinta', 'stacyagwanda@gmail.com', '$2a$12$lcV69awDEknopc4ECSAe2Oj1Y0RUQ2e/fAcNfMufEwuGHMPoR6vWG', '2025-11-11 19:37:54', '2025-11-14 03:20:46'),
(3, 'Stella Brenda Nyanchama', 'stellakirioba@gmail.com', '$2a$12$cnUt6ox82BadEEBQVJ8TDuUEUXvDAW/jiHoRBuO302rG/FL9gu8ES', '2025-11-11 19:37:54', '2025-11-11 20:54:23'),
(4, 'Muriuki V Linnet', 'muriukivapour@gmail.com', '$2a$12$eREXlmFUNwKn9.82fzYj4eeMux8BMqN89q98knlCC6imbqfa88Wua', '2025-11-11 19:37:54', '2025-11-14 07:34:33'),
(5, 'Rachael Madawa Lucas', 'rachaellucas94@gmail.com', '$2a$12$hfMAZ/Blh8ZeZWMixGnP0u7DgzcfqRI2n.xD7pmYv12BCA6CLzXgu', '2025-11-11 19:37:54', '2025-11-14 12:24:29'),
(6, 'Cruzz Eltone', 'cruzeltone@gmail.com', '$2a$12$YSiDdg/8555nRugzE5brWeE8J1mNEdBDarB.3WvLA1LHtAIjbnpia', '2025-11-11 19:37:54', '2025-11-11 20:54:23'),
(7, 'Mary Deckline', 'daisymary1190@gmail.com', '$2a$12$KUZzNfqAdkHfWuP06.E9XeG3ehHOrnSES64w/Wz8cEyl3f7tsnN/q', '2025-11-11 19:37:54', '2025-11-11 20:54:23'),
(8, 'Apollo Apondi', 'apollopondi99@gmail.com', '$2a$12$TeBmEYf51e4ehOeWYo2XGe45ohXeiNdy7MoRkvQk/tp.yOvnjUC02', '2025-11-11 19:37:54', '2025-11-11 20:54:23'),
(9, 'Glorian Katheu', 'gloriankatheu@gmail.com', '$2a$12$j9YsPgCU6PtG6aRmUX9u2e23fdcCyjQ5Uy5tirBo01HYWeMtsuPrO', '2025-11-11 19:37:54', '2025-11-14 06:21:01'),
(10, 'Brian Kevin Mwangi', 'kevindoc254@gmail.com', '$2a$12$FsKRSGeM548lB554iRcMwOKzxO/bCJR/zn6xQV3LBDJUQpXosvP6W', '2025-11-11 19:37:54', '2025-11-11 20:54:24'),
(11, 'Kevin Koech', 'kevinkoechx@gmail.com', '$2a$12$6.cKjs3KTouTC52dePHXW.7lHJv.oGET5I3gEk9isYQ5om/ZOVD0S', '2025-11-11 19:37:54', '2025-11-14 07:54:48'),
(12, 'Daniel Mahmoud Alli Anicethy Prodl', 'malikaprodl007@gmail.com', '$2a$12$OCefkTX8hPwf79rSXREczOEFu5dvrGfBg5JD2E4eV5ZlbS1nX4DM2', '2025-11-11 19:37:54', '2025-11-11 20:54:24'),
(13, 'Peter Onsomu', 'pkonsomu2021@gmail.com', '$2a$12$b8tdx7LfYJQpdRgfzmBRE.g5vZQMUscVuTEDBXw7sLa0GzUJkE0he', '2025-11-11 19:37:54', '2025-11-13 18:05:48');

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` int(11) NOT NULL,
  `session_id` int(11) NOT NULL,
  `sender` enum('user','ai') NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_sessions`
--

CREATE TABLE `chat_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `session_name` varchar(255) DEFAULT 'New Chat',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `chat_sessions`
--

INSERT INTO `chat_sessions` (`id`, `user_id`, `session_name`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Hello...', '2025-08-13 12:04:23', '2025-08-13 12:04:23'),
(2, NULL, 'Help...', '2025-08-19 04:00:07', '2025-08-19 04:00:07');

-- --------------------------------------------------------

--
-- Table structure for table `event_attendees`
--

CREATE TABLE `event_attendees` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `admin_profile_id` int(11) DEFAULT NULL,
  `external_email` varchar(255) DEFAULT NULL,
  `external_name` varchar(255) DEFAULT NULL,
  `attendance_status` enum('invited','accepted','declined','tentative') DEFAULT 'invited',
  `notification_sent` tinyint(1) DEFAULT 0,
  `notification_sent_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `event_attendees`
--

INSERT INTO `event_attendees` (`id`, `event_id`, `admin_profile_id`, `external_email`, `external_name`, `attendance_status`, `notification_sent`, `notification_sent_at`, `created_at`) VALUES
(1, 1, 1, NULL, NULL, 'invited', 0, NULL, '2025-11-11 11:12:50'),
(2, 1, 2, NULL, NULL, 'invited', 0, NULL, '2025-11-11 11:12:50'),
(3, 1, 3, NULL, NULL, 'invited', 0, NULL, '2025-11-11 11:12:50'),
(4, 1, 4, NULL, NULL, 'invited', 0, NULL, '2025-11-11 11:12:50'),
(5, 1, 5, NULL, NULL, 'invited', 0, NULL, '2025-11-11 11:12:50'),
(6, 1, 6, NULL, NULL, 'invited', 0, NULL, '2025-11-11 11:12:50'),
(7, 1, 7, NULL, NULL, 'invited', 0, NULL, '2025-11-11 11:12:50'),
(8, 1, 8, NULL, NULL, 'invited', 0, NULL, '2025-11-11 11:12:50'),
(9, 1, 9, NULL, NULL, 'invited', 0, NULL, '2025-11-11 11:12:50'),
(10, 1, 10, NULL, NULL, 'invited', 0, NULL, '2025-11-11 11:12:50'),
(11, 1, 11, NULL, NULL, 'invited', 0, NULL, '2025-11-11 11:12:50'),
(12, 1, 12, NULL, NULL, 'invited', 0, NULL, '2025-11-11 11:12:50'),
(13, 1, 13, NULL, NULL, 'invited', 0, NULL, '2025-11-11 11:12:50'),
(31, 5, 1, NULL, NULL, 'invited', 0, NULL, '2025-11-13 14:10:39'),
(32, 5, 2, NULL, NULL, 'invited', 0, NULL, '2025-11-13 14:10:39'),
(33, 5, 3, NULL, NULL, 'invited', 0, NULL, '2025-11-13 14:10:39'),
(34, 5, 4, NULL, NULL, 'invited', 0, NULL, '2025-11-13 14:10:39'),
(35, 5, 5, NULL, NULL, 'invited', 0, NULL, '2025-11-13 14:10:39'),
(36, 5, 6, NULL, NULL, 'invited', 0, NULL, '2025-11-13 14:10:39'),
(37, 5, 7, NULL, NULL, 'invited', 0, NULL, '2025-11-13 14:10:39'),
(38, 5, 8, NULL, NULL, 'invited', 0, NULL, '2025-11-13 14:10:39'),
(39, 5, 9, NULL, NULL, 'invited', 0, NULL, '2025-11-13 14:10:39'),
(40, 5, 10, NULL, NULL, 'invited', 0, NULL, '2025-11-13 14:10:39'),
(41, 5, 11, NULL, NULL, 'invited', 0, NULL, '2025-11-13 14:10:39'),
(42, 5, 12, NULL, NULL, 'invited', 0, NULL, '2025-11-13 14:10:39'),
(43, 5, 13, NULL, NULL, 'invited', 0, NULL, '2025-11-13 14:10:39'),
(58, 7, 1, NULL, NULL, 'invited', 0, NULL, '2025-11-13 18:03:29'),
(59, 7, 2, NULL, NULL, 'invited', 0, NULL, '2025-11-13 18:03:29'),
(60, 7, 3, NULL, NULL, 'invited', 0, NULL, '2025-11-13 18:03:29'),
(61, 7, 4, NULL, NULL, 'invited', 0, NULL, '2025-11-13 18:03:29'),
(62, 7, 5, NULL, NULL, 'invited', 0, NULL, '2025-11-13 18:03:29'),
(63, 7, 6, NULL, NULL, 'invited', 0, NULL, '2025-11-13 18:03:29'),
(64, 7, 7, NULL, NULL, 'invited', 0, NULL, '2025-11-13 18:03:29'),
(65, 7, 8, NULL, NULL, 'invited', 0, NULL, '2025-11-13 18:03:29'),
(66, 7, 9, NULL, NULL, 'invited', 0, NULL, '2025-11-13 18:03:29'),
(67, 7, 10, NULL, NULL, 'invited', 0, NULL, '2025-11-13 18:03:29'),
(68, 7, 11, NULL, NULL, 'invited', 0, NULL, '2025-11-13 18:03:29'),
(69, 7, 12, NULL, NULL, 'invited', 0, NULL, '2025-11-13 18:03:29'),
(70, 7, 13, NULL, NULL, 'invited', 0, NULL, '2025-11-13 18:03:29');

-- --------------------------------------------------------

--
-- Table structure for table `event_notifications`
--

CREATE TABLE `event_notifications` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `notification_type` enum('invitation','reminder','update','cancellation') NOT NULL,
  `recipient_email` varchar(255) NOT NULL,
  `recipient_name` varchar(255) DEFAULT NULL,
  `sent_at` datetime NOT NULL,
  `email_subject` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_status` enum('sent','failed','pending') DEFAULT 'pending',
  `error_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `event_notifications`
--

INSERT INTO `event_notifications` (`id`, `event_id`, `notification_type`, `recipient_email`, `recipient_name`, `sent_at`, `email_subject`, `email_status`, `error_message`, `created_at`) VALUES
(1, 7, 'invitation', 'admin@weareone.co.ke', 'WAO Admin', '2025-11-13 21:03:30', '📅 New Meeting: WAO_Meetup - Kanunga Falls Meeting', 'sent', NULL, '2025-11-13 18:03:30'),
(2, 7, 'invitation', 'stacyagwanda@gmail.com', 'Stacy Agwanda Jacinta', '2025-11-13 21:03:31', '📅 New Meeting: WAO_Meetup - Kanunga Falls Meeting', 'sent', NULL, '2025-11-13 18:03:31'),
(3, 7, 'invitation', 'stellakirioba@gmail.com', 'Stella Brenda Nyanchama', '2025-11-13 21:03:32', '📅 New Meeting: WAO_Meetup - Kanunga Falls Meeting', 'sent', NULL, '2025-11-13 18:03:32'),
(4, 7, 'invitation', 'muriukivapour@gmail.com', 'Muriuki V Linnet', '2025-11-13 21:03:33', '📅 New Meeting: WAO_Meetup - Kanunga Falls Meeting', 'sent', NULL, '2025-11-13 18:03:33'),
(5, 7, 'invitation', 'rachaellucas94@gmail.com', 'Rachael Madawa Lucas', '2025-11-13 21:03:34', '📅 New Meeting: WAO_Meetup - Kanunga Falls Meeting', 'sent', NULL, '2025-11-13 18:03:34'),
(6, 7, 'invitation', 'cruzeltone@gmail.com', 'Cruzz Eltone', '2025-11-13 21:03:35', '📅 New Meeting: WAO_Meetup - Kanunga Falls Meeting', 'sent', NULL, '2025-11-13 18:03:35'),
(7, 7, 'invitation', 'daisymary1190@gmail.com', 'Mary Deckline', '2025-11-13 21:03:36', '📅 New Meeting: WAO_Meetup - Kanunga Falls Meeting', 'sent', NULL, '2025-11-13 18:03:36'),
(8, 7, 'invitation', 'apollopondi99@gmail.com', 'Apollo Apondi', '2025-11-13 21:03:36', '📅 New Meeting: WAO_Meetup - Kanunga Falls Meeting', 'sent', NULL, '2025-11-13 18:03:36'),
(9, 7, 'invitation', 'gloriankatheu@gmail.com', 'Glorian Katheu', '2025-11-13 21:03:37', '📅 New Meeting: WAO_Meetup - Kanunga Falls Meeting', 'sent', NULL, '2025-11-13 18:03:37'),
(10, 7, 'invitation', 'kevindoc254@gmail.com', 'Brian Kevin Mwangi', '2025-11-13 21:03:38', '📅 New Meeting: WAO_Meetup - Kanunga Falls Meeting', 'sent', NULL, '2025-11-13 18:03:38'),
(11, 7, 'invitation', 'kevinkoechx@gmail.com', 'Kevin Koech', '2025-11-13 21:03:39', '📅 New Meeting: WAO_Meetup - Kanunga Falls Meeting', 'sent', NULL, '2025-11-13 18:03:39'),
(12, 7, 'invitation', 'malikaprodl007@gmail.com', 'Daniel Mahmoud Alli Anicethy Prodl', '2025-11-13 21:03:39', '📅 New Meeting: WAO_Meetup - Kanunga Falls Meeting', 'sent', NULL, '2025-11-13 18:03:39'),
(13, 7, 'invitation', 'pkonsomu2021@gmail.com', 'Peter Onsomu', '2025-11-13 21:03:40', '📅 New Meeting: WAO_Meetup - Kanunga Falls Meeting', 'sent', NULL, '2025-11-13 18:03:40'),
(14, 7, 'reminder', 'admin@weareone.co.ke', 'WAO Admin', '2025-11-13 21:04:00', '⏰ Reminder: WAO_Meetup - Kanunga Falls Meeting - Tomorrow', 'sent', NULL, '2025-11-13 18:04:00'),
(15, 7, 'reminder', 'stacyagwanda@gmail.com', 'Stacy Agwanda Jacinta', '2025-11-13 21:04:01', '⏰ Reminder: WAO_Meetup - Kanunga Falls Meeting - Tomorrow', 'sent', NULL, '2025-11-13 18:04:01'),
(16, 7, 'reminder', 'stellakirioba@gmail.com', 'Stella Brenda Nyanchama', '2025-11-13 21:04:02', '⏰ Reminder: WAO_Meetup - Kanunga Falls Meeting - Tomorrow', 'sent', NULL, '2025-11-13 18:04:02'),
(17, 7, 'reminder', 'muriukivapour@gmail.com', 'Muriuki V Linnet', '2025-11-13 21:04:02', '⏰ Reminder: WAO_Meetup - Kanunga Falls Meeting - Tomorrow', 'sent', NULL, '2025-11-13 18:04:02'),
(18, 7, 'reminder', 'rachaellucas94@gmail.com', 'Rachael Madawa Lucas', '2025-11-13 21:04:03', '⏰ Reminder: WAO_Meetup - Kanunga Falls Meeting - Tomorrow', 'sent', NULL, '2025-11-13 18:04:03'),
(19, 7, 'reminder', 'cruzeltone@gmail.com', 'Cruzz Eltone', '2025-11-13 21:04:04', '⏰ Reminder: WAO_Meetup - Kanunga Falls Meeting - Tomorrow', 'sent', NULL, '2025-11-13 18:04:04'),
(20, 7, 'reminder', 'daisymary1190@gmail.com', 'Mary Deckline', '2025-11-13 21:04:05', '⏰ Reminder: WAO_Meetup - Kanunga Falls Meeting - Tomorrow', 'sent', NULL, '2025-11-13 18:04:05'),
(21, 7, 'reminder', 'apollopondi99@gmail.com', 'Apollo Apondi', '2025-11-13 21:04:06', '⏰ Reminder: WAO_Meetup - Kanunga Falls Meeting - Tomorrow', 'sent', NULL, '2025-11-13 18:04:06'),
(22, 7, 'reminder', 'gloriankatheu@gmail.com', 'Glorian Katheu', '2025-11-13 21:04:07', '⏰ Reminder: WAO_Meetup - Kanunga Falls Meeting - Tomorrow', 'sent', NULL, '2025-11-13 18:04:07'),
(23, 7, 'reminder', 'kevindoc254@gmail.com', 'Brian Kevin Mwangi', '2025-11-13 21:04:08', '⏰ Reminder: WAO_Meetup - Kanunga Falls Meeting - Tomorrow', 'sent', NULL, '2025-11-13 18:04:08'),
(24, 7, 'reminder', 'kevinkoechx@gmail.com', 'Kevin Koech', '2025-11-13 21:04:09', '⏰ Reminder: WAO_Meetup - Kanunga Falls Meeting - Tomorrow', 'sent', NULL, '2025-11-13 18:04:09'),
(25, 7, 'reminder', 'malikaprodl007@gmail.com', 'Daniel Mahmoud Alli Anicethy Prodl', '2025-11-13 21:04:10', '⏰ Reminder: WAO_Meetup - Kanunga Falls Meeting - Tomorrow', 'sent', NULL, '2025-11-13 18:04:10'),
(26, 7, 'reminder', 'pkonsomu2021@gmail.com', 'Peter Onsomu', '2025-11-13 21:04:10', '⏰ Reminder: WAO_Meetup - Kanunga Falls Meeting - Tomorrow', 'sent', NULL, '2025-11-13 18:04:10');

-- --------------------------------------------------------

--
-- Table structure for table `event_payments`
--

CREATE TABLE `event_payments` (
  `id` int(11) NOT NULL,
  `event_id` varchar(100) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `ticket_type` enum('WAO Members','Public','Standard') NOT NULL,
  `amount` int(11) NOT NULL,
  `mpesa_code` varchar(32) NOT NULL,
  `status` enum('pending_verification','paid','failed') DEFAULT 'pending_verification',
  `confirmation_message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `event_payments`
--

INSERT INTO `event_payments` (`id`, `event_id`, `full_name`, `email`, `phone`, `ticket_type`, `amount`, `mpesa_code`, `status`, `confirmation_message`, `created_at`, `updated_at`) VALUES
(1, 'movie-night', 'Peter Onsomu', 'pkonsomu2020@gmail.com', '0745343256', 'WAO Members', 800, 'THJ822XDEE', 'paid', NULL, '2025-08-19 17:58:12', '2025-08-20 09:16:47'),
(2, 'movie-night', 'Cruzz Eltone', 'cruzeltone@gmail.com', '0711853928', 'WAO Members', 800, 'THK3611W49', 'paid', NULL, '2025-08-20 11:40:40', '2025-08-21 12:52:18'),
(3, 'movie-night', 'Kevin nyariki nyang\'wara', 'kelvinnyangwara7@gmail.com', '0768732885', 'WAO Members', 800, 'TGD2T135SQ', 'paid', NULL, '2025-08-20 15:36:19', '2025-08-27 18:27:00'),
(4, 'movie-night', 'Lynn Neema', 'lobusubiri@gmail.com', '0796058286', 'WAO Members', 800, 'TGC8OUZHHA,TGC2NNV5DC', 'paid', NULL, '2025-08-20 16:15:27', '2025-08-27 18:26:18'),
(5, 'movie-night', 'Evans Mwangi', 'kingorievans45@gmail.com', '0724534354', 'WAO Members', 800, 'TGO1BSBE9D', 'paid', NULL, '2025-08-20 16:32:04', '2025-08-27 18:27:26'),
(6, 'movie-night', 'Edin Hajj', 'samouwreagan@gmail.com', '0799595264', 'WAO Members', 800, 'CGU7B985WH', 'paid', NULL, '2025-08-20 16:39:06', '2025-08-27 18:27:36'),
(7, 'movie-night', 'Emmanuel Davine', 'emmanueldavine99@gmail.com', '0111283212', 'WAO Members', 800, 'TH14189C52', 'paid', NULL, '2025-08-20 16:43:56', '2025-08-27 18:27:44'),
(8, 'movie-night', 'Farhiya Abdi Noor', 'farhiyaabdinoor11@gmail.com', '0115018969', 'WAO Members', 800, 'TGP2GZ9VZQ', 'paid', NULL, '2025-08-20 17:03:05', '2025-08-27 18:26:40'),
(9, 'movie-night', 'Trinnette Awuor', 'awuortrinnette@gmail.com', '0799276198', 'WAO Members', 800, 'TGS7X2XTWN', 'paid', NULL, '2025-08-20 19:30:18', '2025-08-27 18:27:51'),
(10, 'movie-night', 'Alycia Njeri', 'alycianjeri5515@gmail.com', '0738877880', 'WAO Members', 800, 'TGI9GMI1ED', 'paid', NULL, '2025-08-21 09:02:21', '2025-08-27 18:27:57'),
(11, 'movie-night', 'Bruno Njoga', 'brunonjoga@gmail.com', '0716457537', 'WAO Members', 800, 'TGT736H8NP', 'paid', NULL, '2025-08-21 11:57:01', '2025-08-27 18:28:03'),
(12, 'movie-night', 'Anne wanjiru', 'wwanjiruanne@gmail.com', '0796922321', 'WAO Members', 800, 'TGU74DEQZZ', 'paid', NULL, '2025-08-21 13:14:06', '2025-08-27 18:28:09'),
(13, 'movie-night', 'George', 'georgegachango679@gmail.com', '0705126298', 'WAO Members', 800, 'TGR9P541DB', 'paid', NULL, '2025-08-21 13:41:56', '2025-08-27 18:28:14'),
(14, 'movie-night', 'Evelyne Njeri  Muraguri', 'evelynmuraguri@gmail.com', '0796389697', 'WAO Members', 800, 'TH20K8CAZU', 'paid', NULL, '2025-08-22 05:29:32', '2025-08-27 18:28:22'),
(15, 'movie-night', 'Angela Jerusha', 'jerushaangela501@gmail.com', '0704978331', 'WAO Members', 800, 'TGU17KYWUD', 'paid', NULL, '2025-08-23 09:20:26', '2025-08-27 18:28:27'),
(16, 'movie-night', 'Ibrahim Musa', 'jakkaka73@gmail.com', '0798885899', 'WAO Members', 800, 'TGQ5NVH8S3', 'paid', NULL, '2025-08-24 11:39:05', '2025-08-27 18:28:54'),
(17, 'movie-night', 'Sophie Nganga', 'rachaelsophie254@gmail.com', '0700849594', 'WAO Members', 800, 'TH20J0C5KE', 'paid', NULL, '2025-08-25 10:32:22', '2025-08-27 18:28:48'),
(18, 'movie-night', 'Carolyne Mutindi', 'Carolynemutindi08@gmail.com', '0110600024', 'WAO Members', 800, 'TGF02S5776', 'paid', NULL, '2025-08-26 16:13:37', '2025-08-27 18:28:35'),
(19, 'movie-night', 'Susan Waweru', 'itsuezzy@gmail.com', '0708312712', 'WAO Members', 800, 'TGQ5NYNGMH', 'paid', NULL, '2025-08-27 18:34:58', '2025-08-27 18:43:30'),
(20, 'movie-night', 'MAUREEN CHEROP', 'maureencherry27@gmail.com', '0721834579', 'WAO Members', 800, 'TGQ7NUKAOF', 'paid', NULL, '2025-08-27 19:47:11', '2025-08-27 21:41:48'),
(21, 'movie-night', 'Feizal Ngotho', 'feizalb03@gmail.com', '0116558014', 'WAO Members', 800, 'TGO6DAA8XC', 'paid', NULL, '2025-08-27 20:31:35', '2025-08-27 21:42:05'),
(22, 'movie-night', 'Feizal Ngotho', 'feizalb03@gmail.com', '0116558014', 'WAO Members', 800, 'TGU97SSXRB', 'paid', NULL, '2025-08-27 20:32:16', '2025-08-27 21:41:56'),
(23, 'movie-night', 'ROSE WANJA', 'Lettyrose083@gmail.com', '0794805833', 'WAO Members', 800, 'THR591GBZX', 'paid', NULL, '2025-08-27 21:38:46', '2025-08-27 21:42:17'),
(24, 'movie-night', 'Koech', 'johnybran12@gmail.com', '0715987339', 'WAO Members', 800, 'THT3F2GO47', 'paid', NULL, '2025-08-29 09:02:44', '2025-08-31 15:04:45'),
(25, 'movie-night', 'Max noel', 'nowellowino@gmail.com', '0797286880', 'WAO Members', 800, 'THU0MH', 'paid', NULL, '2025-08-30 19:04:49', '2025-08-31 15:04:34'),
(26, 'movie-night', 'peter onsomu', 'pkonsomu2021@gmail.com', '0745343256', 'WAO Members', 800, 'TISA05V2X3', 'pending_verification', NULL, '2025-09-28 20:12:58', '2025-09-28 20:12:58'),
(27, 'movie-night', 'peter onsomu', 'pkonsomu2021@gmail.com', '0745343256', 'WAO Members', 800, 'TISA05ULQV', 'pending_verification', NULL, '2025-09-28 20:18:31', '2025-09-28 20:18:31'),
(28, 'kanunga-falls', 'peter onsomu', 'pkonsomu2021@gmail.com', '0745343256', 'Standard', 1600, 'TITA05XFJW', 'pending_verification', NULL, '2025-09-29 08:14:24', '2025-09-29 08:14:24'),
(29, 'kanunga-falls', 'peter onsomu', 'pkonsomu2021@gmail.com', '0745343256', 'Standard', 1600, 'TITA05XFJB', 'pending_verification', NULL, '2025-09-29 08:35:54', '2025-09-29 08:35:54'),
(30, 'movie-night', 'peter onsomu', 'pkonsomu2021@gmail.com', '0745343256', 'WAO Members', 800, 'TISA05V2XC', 'pending_verification', NULL, '2025-09-29 08:36:41', '2025-09-29 08:36:41'),
(31, 'kanunga-falls', 'Cruzz Eltone', 'cruzeltone@gmail.com', '0711853928', 'Standard', 1600, 'TJ3606EZA4', 'paid', NULL, '2025-10-03 10:55:00', '2025-10-04 19:41:50'),
(32, 'kanunga-falls', 'peter onsomu', 'pkonsomu2021@gmail.com', '0745343256', 'Standard', 1600, 'TJ2A06A1XG', 'paid', NULL, '2025-10-03 10:55:29', '2025-10-04 19:31:08'),
(33, 'kanunga-falls', 'Lilian Mwende', 'mwendelilian486@gmail.com', '0706530175', 'Standard', 1600, 'TJ4QK6GTGZ', 'paid', NULL, '2025-10-04 08:48:38', '2025-10-06 08:48:23'),
(34, 'kanunga-falls', 'Bravine Chepchirchir', 'bravinesangg@gmail.com', '0719722830', 'Standard', 1600, 'TIU4Q65P1G', 'paid', NULL, '2025-10-05 11:45:23', '2025-10-05 11:46:38'),
(35, 'kanunga-falls', 'Alex Ngure Irungu', 'ngurealex02@gmail.com', '0759769430', 'Standard', 1600, 'ABB1AB5BDE25', 'pending_verification', NULL, '2025-10-06 08:13:34', '2025-10-06 08:13:34'),
(36, 'kanunga-falls', 'Ray Sibanda Komora', 'rayscope59@gmail.com', '0725556499', 'Standard', 1600, 'TJ6DA6MJLG', 'paid', NULL, '2025-10-06 09:13:50', '2025-10-06 09:24:41'),
(37, 'kanunga-falls', 'Bryan Mbugua', 'Bryanndungu018@gmail.com', '0759444282', 'Standard', 1600, 'TJ3H06DNLM', 'paid', NULL, '2025-10-06 09:41:27', '2025-10-06 13:43:56'),
(38, 'kanunga-falls', 'Diana wanjiku waithira', 'dianashee001@gmail.com', '0115868224', 'Standard', 1600, 'TJ2006BK12', 'paid', NULL, '2025-10-06 12:34:22', '2025-10-06 13:43:26'),
(39, 'kanunga-falls', 'Jecinta wangare', 'jecintawangare6@gmail.com', '0708984991', 'Standard', 1600, 'TJ5BT6KX4Y', 'paid', NULL, '2025-10-06 14:02:37', '2025-10-06 20:21:40'),
(40, 'kanunga-falls', 'Anthony Francis', 'francisantony8896@gmail.com', '0758350964', 'Standard', 1600, 'TJ45E6JF6C', 'paid', NULL, '2025-10-06 18:06:35', '2025-10-06 20:21:15'),
(41, 'kanunga-falls', 'Alvin Gachanja', 'alvingachanja23@gmail.com', '0768809823', 'Standard', 1600, 'TJ6A26PEH3', 'paid', NULL, '2025-10-06 19:57:12', '2025-10-07 19:26:32'),
(42, 'kanunga-falls', 'James K.', 'jameskk640@gmail.com', '0758248796', 'Standard', 1600, 'TJ7GC6Q1C7', 'paid', NULL, '2025-10-07 06:47:08', '2025-10-07 19:26:03'),
(43, 'kanunga-falls', 'Bravin', 'brandydevis@gmail.com', '0768226623', 'Standard', 1600, 'TJ7O16RWKB', 'paid', NULL, '2025-10-07 09:51:20', '2025-10-07 19:25:46'),
(44, 'kanunga-falls', 'Hannah Wanjira', 'wanjirah44@gmail.com', '0759185518', 'Standard', 1600, 'TJ75E6RY45', 'paid', NULL, '2025-10-07 10:31:31', '2025-10-07 19:27:00'),
(45, 'kanunga-falls', 'Sharon Gakii', 'sharongakii39@gmail.com', '0725663552', 'Standard', 1600, 'TJ4D36FGWC', 'paid', NULL, '2025-10-07 13:20:54', '2025-10-07 19:28:35'),
(46, 'kanunga-falls', 'Modester Achieng', 'modesterachieng03@gmail.com', '0758146911', 'Standard', 1600, 'TJ8A56TJD5', 'paid', NULL, '2025-10-08 10:22:09', '2025-10-09 12:34:44'),
(47, 'kanunga-falls', 'Veronica  Catherene Muthoni', 'wanjirah44@gmail.com', '+254 114 615017', 'Standard', 1600, 'TJ85E6vix6', 'paid', NULL, '2025-10-08 11:46:41', '2025-10-09 12:35:14'),
(48, 'kanunga-falls', 'Faraj Suleiman', 'farajsuleimanmolu@gmail.com', '0716340427', 'Standard', 1600, 'TJ8PF6T2EG', 'paid', NULL, '2025-10-08 14:05:14', '2025-10-09 12:37:10'),
(49, 'kanunga-falls', 'Samuel Muigai', 'ndungu.muigai01@gmail.com', '0707251073', 'Standard', 1600, 'TJ87T6U6VQ', 'paid', NULL, '2025-10-08 15:23:42', '2025-10-09 12:38:03'),
(50, 'kanunga-falls', 'Everline Olesa', 'olesaeverline@gmail.com', '0799055054', 'Standard', 1600, 'TJ8IJ6X396', 'paid', NULL, '2025-10-08 21:59:17', '2025-10-09 12:40:00'),
(51, 'kanunga-falls', 'Ryan Aghan', 'ryanaghan@gmail.com', '0703329692', 'Standard', 1600, 'TJ9By6Xy1E', 'paid', NULL, '2025-10-09 08:14:23', '2025-10-09 20:29:28'),
(52, 'kanunga-falls', 'Kuria Gachure', 'gachurejohn758@gmail.com', '0799637539', 'Standard', 1600, 'TJ91X6Z4IY', 'paid', NULL, '2025-10-09 08:24:03', '2025-10-09 20:28:51'),
(53, 'kanunga-falls', 'JERUSHA', 'jerushawaithira2@gmail.com', '0702059942', 'Standard', 1600, 'TJ95E6YCOK', 'paid', NULL, '2025-10-09 09:48:14', '2025-10-09 20:24:36'),
(54, 'kanunga-falls', 'Jane Kinyoho', 'janenjerikinyoho500@gmail.com', '0716883675', 'Standard', 1600, 'TJ97W6VHD0', 'paid', NULL, '2025-10-09 12:13:56', '2025-10-09 20:30:02'),
(55, 'kanunga-falls', 'Loreen Grace Wanjiru', 'loraiynwanjiru@gmail.com', '0701699932', 'Standard', 1600, 'TJ6OV6LFHG', 'pending_verification', NULL, '2025-10-09 14:20:47', '2025-10-09 14:20:47'),
(56, 'kanunga-falls', 'Anne Tumaini Mang\'eni', 'Hopeann652@gmail.com', '0748141306', 'Standard', 1600, 'TJ9KM70425', 'paid', NULL, '2025-10-09 16:38:20', '2025-10-09 20:27:51'),
(57, 'kanunga-falls', 'Innocent odongo', 'innocentodongo823@gmail.com', '0757258301', 'Standard', 1600, 'TJ9LG6Z9QB', 'paid', NULL, '2025-10-09 16:57:39', '2025-10-09 20:27:29'),
(58, 'kanunga-falls', 'Evans Ltemuni Lengirasi', 'ltupesltunges@gmail.com', '0795715336', 'Standard', 1600, 'TJ9MI6YT35', 'paid', NULL, '2025-10-09 19:01:20', '2025-10-09 20:28:12'),
(59, 'kanunga-falls', 'Evans Ltemuni Lengirasi', 'ltupesltunges@gmail.com', '0795715336', 'Standard', 1600, 'TJ9M16YT35', 'paid', NULL, '2025-10-09 19:13:47', '2025-10-09 20:26:38'),
(60, 'kanunga-falls', 'Vivian Nyambura', 'viviankahura16@gmail.com', '+254 758 909341', 'Standard', 1600, 'TJ90F6YA9Q ,', 'paid', NULL, '2025-10-09 19:18:35', '2025-10-09 20:25:37'),
(61, 'kanunga-falls', 'Moses Emmanuel Ngairah', 'ngairahm@gmail.com', '0711569208', 'Standard', 1600, 'TJ9OL70HOT', 'paid', NULL, '2025-10-09 19:29:04', '2025-10-09 20:27:07'),
(62, 'kanunga-falls', 'Peter karanja', 'nyamburapkn2004@gmail.com', '0715715464', 'Standard', 1600, 'TJ9QP6YZ08', 'paid', NULL, '2025-10-09 19:47:08', '2025-10-09 20:25:04'),
(63, 'kanunga-falls', 'Kevin Ochieng Onyango', 'kevinchieng254@gmail.com', '0746683343', 'Standard', 1600, 'TJ9J66XZ4I', 'paid', NULL, '2025-10-09 20:13:14', '2025-10-10 09:46:00'),
(64, 'kanunga-falls', 'Lucy mary snaida', 'snaidalucy174@gmail.com', '0113951622', 'Standard', 1600, 'Tj9GF6YIF6', 'paid', NULL, '2025-10-10 00:11:06', '2025-10-10 09:46:21'),
(65, 'kanunga-falls', 'Kevin Nyang\'wara', 'kelvinnyangwara7@gmail.com', '768732885', 'Standard', 1600, 'M-PESA Ref ID: TJA5E70QKP', 'paid', NULL, '2025-10-10 04:44:47', '2025-10-10 09:46:56'),
(66, 'kanunga-falls', 'IBRAHIM NJATHI', 'ibrahimnjathi@gmail.com', '0742533324', 'Standard', 1600, 'TJA2273FWM', 'paid', NULL, '2025-10-10 12:09:07', '2025-10-11 09:39:24'),
(67, 'kanunga-falls', 'Lucy mary snaida', 'snaidalucy174@gmail.com', '0113951622', 'Standard', 1600, 'TJAGF715FY', 'pending_verification', NULL, '2025-10-10 15:00:10', '2025-10-10 15:00:10'),
(68, 'kanunga-falls', 'Pol Jemator', 'jematorpol@gmail.com', '0757095380', 'Standard', 1600, 'TJALH74PCE', 'paid', NULL, '2025-10-10 20:03:04', '2025-10-11 09:40:21'),
(69, 'kanunga-falls', 'Regina Kwamboka', 'reginakwamboka61@gmail.com', '0795742858', 'Standard', 1600, 'TJB8G70P3J', 'paid', NULL, '2025-10-11 05:40:03', '2025-10-11 09:47:58'),
(70, 'kanunga-falls', 'Rhoda wairimu kailemia', 'wairimurhoda254@gmail.com', '0791288619', 'Standard', 1600, 'TJB5E7488T', 'paid', NULL, '2025-10-11 06:06:25', '2025-10-11 09:43:16'),
(71, 'kanunga-falls', 'Eliud theuri', 'eliudtheuri108@gmail.com', '0700845844', 'Standard', 1600, 'TJ90F6YA9Q', 'pending_verification', NULL, '2025-10-11 17:32:21', '2025-10-11 17:32:21'),
(72, 'kanunga-falls', 'peter onsomu', 'pkonsomu2021@gmail.com', '0745343256', 'Standard', 1600, 'TITA05XFJG', 'paid', NULL, '2025-11-11 10:10:44', '2025-11-11 10:55:45');

-- --------------------------------------------------------

--
-- Table structure for table `event_registrations`
--

CREATE TABLE `event_registrations` (
  `id` int(11) NOT NULL,
  `event_id` varchar(100) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `experience_text` text DEFAULT NULL,
  `accept_terms` tinyint(1) DEFAULT 0,
  `accept_updates` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `event_registrations`
--

INSERT INTO `event_registrations` (`id`, `event_id`, `full_name`, `email`, `phone`, `experience_text`, `accept_terms`, `accept_updates`, `created_at`) VALUES
(1, 'movie-night', 'Cruzz Eltone', 'cruzeltone@gmail.com', '0711853928', '4 star', 1, 1, '2025-08-19 08:36:36'),
(2, 'movie-night', 'Mwangi Magdaline', 'magdalinemwangi07@gmail.com', '0740825663', '4 star', 1, 1, '2025-08-19 09:27:02'),
(3, 'movie-night', 'Peter Onsomu', 'pkonsomu2020@gmail.com', '0745343256', NULL, 1, 1, '2025-08-19 17:58:12'),
(4, 'movie-night', 'Cruzz Eltone', 'cruzeltone@gmail.com', '0711853928', '4 star experience', 1, 1, '2025-08-20 11:40:40'),
(5, 'movie-night', 'Kevin nyariki nyang\'wara', 'kelvinnyangwara7@gmail.com', '0768732885', NULL, 1, 1, '2025-08-20 15:36:19'),
(6, 'movie-night', 'Lynn Neema', 'lobusubiri@gmail.com', '0796058286', NULL, 1, 1, '2025-08-20 16:15:27'),
(7, 'movie-night', 'Evans Mwangi', 'kingorievans45@gmail.com', '0724534354', NULL, 1, 1, '2025-08-20 16:32:04'),
(8, 'movie-night', 'Edin Hajj', 'samouwreagan@gmail.com', '0799595264', NULL, 1, 1, '2025-08-20 16:39:06'),
(9, 'movie-night', 'Emmanuel Davine', 'emmanueldavine99@gmail.com', '0111283212', NULL, 1, 1, '2025-08-20 16:43:56'),
(10, 'movie-night', 'Farhiya Abdi Noor', 'farhiyaabdinoor11@gmail.com', '0115018969', 'Good vibes', 1, 1, '2025-08-20 17:03:05'),
(11, 'movie-night', 'Trinnette Awuor', 'awuortrinnette@gmail.com', '0799276198', 'Fun games,talks', 1, 1, '2025-08-20 19:30:18'),
(12, 'movie-night', 'Alycia Njeri', 'alycianjeri5515@gmail.com', '0738877880', NULL, 1, 1, '2025-08-21 09:02:21'),
(13, 'movie-night', 'Bruno Njoga', 'brunonjoga@gmail.com', '0716457537', 'To have fun and explore', 1, 1, '2025-08-21 11:57:01'),
(14, 'movie-night', 'Anne wanjiru', 'wwanjiruanne@gmail.com', '0796922321', 'To be organized and \nhave fun', 1, 1, '2025-08-21 13:14:06'),
(15, 'movie-night', 'George', 'georgegachango679@gmail.com', '0705126298', 'No comment', 1, 1, '2025-08-21 13:41:56'),
(16, 'movie-night', 'Evelyne Njeri  Muraguri', 'evelynmuraguri@gmail.com', '0796389697', 'Fun', 1, 1, '2025-08-22 05:29:32'),
(17, 'movie-night', 'Angela Jerusha', 'jerushaangela501@gmail.com', '0704978331', NULL, 1, 1, '2025-08-23 09:20:26'),
(18, 'movie-night', 'Ibrahim Musa', 'jakkaka73@gmail.com', '0798885899', 'Cool', 1, 1, '2025-08-24 11:39:05'),
(19, 'movie-night', 'Sophie Nganga', 'rachaelsophie254@gmail.com', '0700849594', 'Good vibes and inshallah', 1, 1, '2025-08-25 10:32:22'),
(20, 'movie-night', 'Carolyne Mutindi', 'Carolynemutindi08@gmail.com', '0110600024', NULL, 1, 1, '2025-08-26 16:13:37'),
(21, 'movie-night', 'Susan Waweru', 'itsuezzy@gmail.com', '0708312712', NULL, 1, 1, '2025-08-27 18:34:58'),
(22, 'movie-night', 'MAUREEN CHEROP', 'maureencherry27@gmail.com', '0721834579', NULL, 1, 1, '2025-08-27 19:47:11'),
(23, 'movie-night', 'Feizal Ngotho', 'feizalb03@gmail.com', '0116558014', NULL, 1, 1, '2025-08-27 20:31:36'),
(24, 'movie-night', 'Feizal Ngotho', 'feizalb03@gmail.com', '0116558014', NULL, 1, 1, '2025-08-27 20:32:16'),
(25, 'movie-night', 'ROSE WANJA', 'Lettyrose083@gmail.com', '0794805833', 'Exceptional performance', 1, 1, '2025-08-27 21:38:47'),
(26, 'movie-night', 'Koech', 'johnybran12@gmail.com', '0715987339', NULL, 1, 1, '2025-08-29 09:02:44'),
(27, 'movie-night', 'Max noel', 'nowellowino@gmail.com', '0797286880', 'Having fun', 1, 1, '2025-08-30 19:04:49'),
(28, 'nature-trail', 'Jay', 'ljean1624@gmail.com', '0740874012', 'Vibes', 1, 1, '2025-09-16 09:46:31'),
(29, 'nature-trail', 'NEWTon', 'newtonmurimi82@gmail.com', '0769131179', NULL, 1, 1, '2025-09-16 09:50:30'),
(30, 'nature-trail', 'NEWTon', 'newtonmurimi82@gmail.com', '0769131179', NULL, 1, 1, '2025-09-16 09:50:49'),
(31, 'nature-trail', 'Byron Ouma', 'byronouma02@gmail.com', '0715848500', 'Learn', 1, 1, '2025-09-16 11:07:56'),
(32, 'nature-trail', 'peninah gachu', 'wacukanina@gmail.com', '0718922310', 'Surprise me!!', 1, 0, '2025-09-16 11:36:36'),
(33, 'nature-trail', 'Lynn Neema', 'lobusubiri@gmail.com', '0796058286', NULL, 1, 1, '2025-09-16 11:41:33'),
(34, 'nature-trail', 'Modester Achieng', 'modesterachieng03@gmail.com', '0758146911', 'Having fun\nSocializing', 1, 1, '2025-09-16 22:34:51'),
(35, 'nature-trail', 'Modester Achieng', 'modesterachieng03@gmail.com', '0758146911', 'Having fun\nSocializing', 1, 1, '2025-09-16 22:35:31'),
(36, 'nature-trail', 'Kamau Kaguru', 'bennshown2001@gmail.com', '0724041158', NULL, 1, 0, '2025-09-17 09:24:55'),
(37, 'movie-night', 'peter onsomu', 'pkonsomu2021@gmail.com', '0745343256', NULL, 1, 1, '2025-09-28 20:12:58'),
(38, 'movie-night', 'peter onsomu', 'pkonsomu2021@gmail.com', '0745343256', NULL, 1, 1, '2025-09-28 20:18:31'),
(39, 'kanunga-falls', 'peter onsomu', 'pkonsomu2021@gmail.com', '0745343256', NULL, 1, 1, '2025-09-29 08:14:24'),
(40, 'kanunga-falls', 'peter onsomu', 'pkonsomu2021@gmail.com', '0745343256', NULL, 1, 1, '2025-09-29 08:35:54'),
(41, 'movie-night', 'peter onsomu', 'pkonsomu2021@gmail.com', '0745343256', NULL, 1, 1, '2025-09-29 08:36:41'),
(42, 'kanunga-falls', 'Cruzz Eltone', 'cruzeltone@gmail.com', '0711853928', '5 star', 1, 1, '2025-10-03 10:55:00'),
(43, 'kanunga-falls', 'peter onsomu', 'pkonsomu2021@gmail.com', '0745343256', NULL, 1, 1, '2025-10-03 10:55:29'),
(44, 'kanunga-falls', 'Lilian Mwende', 'mwendelilian486@gmail.com', '0706530175', 'To be able to overcome my anxiety and socialize with ease', 1, 1, '2025-10-04 08:48:38'),
(45, 'kanunga-falls', 'Bravine Chepchirchir', 'bravinesangg@gmail.com', '0719722830', NULL, 1, 1, '2025-10-05 11:45:23'),
(46, 'kanunga-falls', 'Alex Ngure Irungu', 'ngurealex02@gmail.com', '0759769430', NULL, 1, 1, '2025-10-06 08:13:34'),
(47, 'kanunga-falls', 'Ray Sibanda Komora', 'rayscope59@gmail.com', '0725556499', NULL, 1, 1, '2025-10-06 09:13:50'),
(48, 'kanunga-falls', 'Bryan Mbugua', 'Bryanndungu018@gmail.com', '0759444282', NULL, 1, 1, '2025-10-06 09:41:27'),
(49, 'kanunga-falls', 'Diana wanjiku waithira', 'dianashee001@gmail.com', '0115868224', NULL, 1, 1, '2025-10-06 12:34:22'),
(50, 'kanunga-falls', 'Jecinta wangare', 'jecintawangare6@gmail.com', '0708984991', 'Alot of fun.', 1, 1, '2025-10-06 14:02:37'),
(51, 'kanunga-falls', 'Anthony Francis', 'francisantony8896@gmail.com', '0758350964', NULL, 1, 1, '2025-10-06 18:06:35'),
(52, 'kanunga-falls', 'Alvin Gachanja', 'alvingachanja23@gmail.com', '0768809823', NULL, 1, 1, '2025-10-06 19:57:12'),
(53, 'kanunga-falls', 'James K.', 'jameskk640@gmail.com', '0758248796', NULL, 1, 1, '2025-10-07 06:47:08'),
(54, 'kanunga-falls', 'Bravin', 'brandydevis@gmail.com', '0768226623', 'Having fun as always meeting new people and enjoying nature in an organized manner', 1, 1, '2025-10-07 09:51:20'),
(55, 'kanunga-falls', 'Hannah Wanjira', 'wanjirah44@gmail.com', '0759185518', 'Exposure', 1, 1, '2025-10-07 10:31:31'),
(56, 'kanunga-falls', 'Sharon Gakii', 'sharongakii39@gmail.com', '0725663552', NULL, 1, 1, '2025-10-07 13:20:54'),
(57, 'kanunga-falls', 'Modester Achieng', 'modesterachieng03@gmail.com', '0758146911', 'Having fun\nMaking new friends', 1, 0, '2025-10-08 10:22:09'),
(58, 'kanunga-falls', 'Veronica  Catherene Muthoni', 'wanjirah44@gmail.com', '+254 114 615017', 'Fun', 1, 1, '2025-10-08 11:46:41'),
(59, 'kanunga-falls', 'Faraj Suleiman', 'farajsuleimanmolu@gmail.com', '0716340427', NULL, 1, 1, '2025-10-08 14:05:14'),
(60, 'kanunga-falls', 'Samuel Muigai', 'ndungu.muigai01@gmail.com', '0707251073', 'Meet new people and make new friends since I have a hard time making friends', 1, 1, '2025-10-08 15:23:42'),
(61, 'kanunga-falls', 'Everline Olesa', 'olesaeverline@gmail.com', '0799055054', 'To bond with nature and people', 1, 1, '2025-10-08 21:59:17'),
(62, 'kanunga-falls', 'Ryan Aghan', 'ryanaghan@gmail.com', '0703329692', 'Fun activities,,,,making new friends and the adventure', 1, 1, '2025-10-09 08:14:23'),
(63, 'kanunga-falls', 'Kuria Gachure', 'gachurejohn758@gmail.com', '0799637539', 'Alot of fuun', 1, 1, '2025-10-09 08:24:03'),
(64, 'kanunga-falls', 'JERUSHA', 'jerushawaithira2@gmail.com', '0702059942', 'exeptional experience', 1, 1, '2025-10-09 09:48:14'),
(65, 'kanunga-falls', 'Jane Kinyoho', 'janenjerikinyoho500@gmail.com', '0716883675', 'New friends\nConnection with nature\nPhysical exercise', 1, 1, '2025-10-09 12:13:56'),
(66, 'kanunga-falls', 'Loreen Grace Wanjiru', 'loraiynwanjiru@gmail.com', '0701699932', 'Fun,bonding,connections', 1, 1, '2025-10-09 14:20:47'),
(67, 'kanunga-falls', 'Anne Tumaini Mang\'eni', 'Hopeann652@gmail.com', '0748141306', 'I wanna bond and connect with strangers ..connect with nature and just enjoy the moment!', 1, 1, '2025-10-09 16:38:20'),
(68, 'kanunga-falls', 'Innocent odongo', 'innocentodongo823@gmail.com', '0757258301', 'Meet new friends', 1, 1, '2025-10-09 16:57:39'),
(69, 'kanunga-falls', 'Evans Ltemuni Lengirasi', 'ltupesltunges@gmail.com', '0795715336', NULL, 1, 1, '2025-10-09 19:13:47'),
(70, 'kanunga-falls', 'Vivian Nyambura', 'viviankahura16@gmail.com', '+254 758 909341', 'Hopefully I will fight my social anxiety', 1, 1, '2025-10-09 19:18:35'),
(71, 'kanunga-falls', 'Moses Emmanuel Ngairah', 'ngairahm@gmail.com', '0711569208', NULL, 1, 0, '2025-10-09 19:29:04'),
(72, 'kanunga-falls', 'Peter karanja', 'nyamburapkn2004@gmail.com', '0715715464', 'Enjoyment', 1, 1, '2025-10-09 19:47:08'),
(73, 'kanunga-falls', 'Kevin Ochieng Onyango', 'kevinchieng254@gmail.com', '0746683343', 'Just fun and connecting with the group... Making friends too.', 1, 1, '2025-10-09 20:13:14'),
(74, 'kanunga-falls', 'Lucy mary snaida', 'snaidalucy174@gmail.com', '0113951622', NULL, 1, 0, '2025-10-10 00:11:06'),
(75, 'kanunga-falls', 'Kevin Nyang\'wara', 'kelvinnyangwara7@gmail.com', '768732885', NULL, 1, 1, '2025-10-10 04:44:47'),
(76, 'kanunga-falls', 'IBRAHIM NJATHI', 'ibrahimnjathi@gmail.com', '0742533324', 'Good time', 1, 0, '2025-10-10 12:09:07'),
(77, 'kanunga-falls', 'Lucy mary snaida', 'snaidalucy174@gmail.com', '0113951622', NULL, 1, 0, '2025-10-10 15:00:10'),
(78, 'kanunga-falls', 'Pol Jemator', 'jematorpol@gmail.com', '0757095380', 'To have fun', 1, 1, '2025-10-10 20:03:04'),
(79, 'kanunga-falls', 'Regina Kwamboka', 'reginakwamboka61@gmail.com', '0795742858', 'Mad fun', 1, 1, '2025-10-11 05:40:03'),
(80, 'kanunga-falls', 'Rhoda wairimu kailemia', 'wairimurhoda254@gmail.com', '0791288619', NULL, 1, 1, '2025-10-11 06:06:25'),
(81, 'kanunga-falls', 'Eliud theuri', 'eliudtheuri108@gmail.com', '0700845844', NULL, 1, 1, '2025-10-11 17:32:21'),
(82, 'kisumu-hangout-resort', 'peter onsomu', 'pkonsomu2021@gmail.com', '0745343256', 'Good vibes and Inshallah!', 1, 1, '2025-10-16 07:36:43'),
(83, 'kisumu-hangout-resort', 'Mary Deckline', 'daisymary1190@gmail.com', '0714141402', 'To relieve stress', 1, 1, '2025-10-16 12:26:20'),
(84, 'kisumu-hangout-resort', 'Faraji Saidi Zachariah', 'farajisaidi1990@gmail.com', '0714761958', NULL, 1, 1, '2025-10-16 12:32:03'),
(85, 'kisumu-hangout-resort', 'Pascal Oluoch', 'pascaloluoch2020@gmail.com', '+254758827817', NULL, 1, 1, '2025-10-16 12:32:13'),
(86, 'kisumu-hangout-resort', 'Joshua Komu', 'Jskomu45@gmail.com', '0745290212', NULL, 1, 1, '2025-10-16 12:35:27'),
(87, 'kisumu-hangout-resort', 'Eva Maureen Onguko', 'evamaureen16@gmail.com', '0727713857', 'To get emotional support n making new friends', 1, 1, '2025-10-17 07:35:49'),
(88, 'kisumu-hangout-resort', 'Steven ochieng martin', 'stvvnmartin@gmail.com', '0115579895', NULL, 1, 1, '2025-10-17 10:22:12'),
(89, 'kisumu-hangout-resort', 'Aldrid Musomi', 'aldrimusomi@gmail.com', '0798026078', NULL, 1, 1, '2025-10-19 06:59:09'),
(90, 'nature-trail', 'Zack', 'ew183278@gmail.com', '0757697156', 'Fun, interaction, friends', 1, 1, '2025-10-19 08:10:08'),
(91, 'kisumu-hangout-resort', 'Stacynida Agongo', 'stacynida@gmail.com', '0113416933', 'A community open to help each other out especially on mental health challenges', 1, 1, '2025-10-23 17:51:35'),
(92, 'kisumu-hangout-resort', 'Osborne GOGA', 'gogaosborne@gmail.com', '0796646077', NULL, 1, 0, '2025-10-24 12:17:44'),
(93, 'kisumu-hangout-resort', 'Osborne GOGA', 'gogaosborne@gmail.com', '0796646077', NULL, 1, 1, '2025-10-24 12:17:59'),
(94, 'kisumu-hangout-resort', 'Juliet Millicent', 'millyjuliet45@gmail.com', '0714450972', 'To have fun and make new friends', 1, 1, '2025-10-24 17:58:23'),
(95, 'kanunga-falls', 'peter onsomu', 'pkonsomu2021@gmail.com', '0745343256', 'Good vibes!', 1, 1, '2025-11-11 10:10:44'),
(96, 'mombasa-meetup', 'peter onsomu', 'pkonsomu2021@gmail.com', '0745343256', NULL, 1, 1, '2025-11-26 09:43:53'),
(97, 'mombasa-meetup', 'peter onsomu', 'pkonsomu2021@gmail.com', '+254700000000', 'Expectation', 1, 1, '2025-11-26 09:46:37');

-- --------------------------------------------------------

--
-- Table structure for table `event_reminders`
--

CREATE TABLE `event_reminders` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `reminder_type` enum('24_hours','1_hour','30_minutes','custom') NOT NULL,
  `reminder_datetime` datetime NOT NULL,
  `is_sent` tinyint(1) DEFAULT 0,
  `sent_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `event_reminders`
--

INSERT INTO `event_reminders` (`id`, `event_id`, `reminder_type`, `reminder_datetime`, `is_sent`, `sent_at`, `created_at`) VALUES
(1, 1, '1_hour', '2025-11-12 13:12:00', 0, NULL, '2025-11-11 11:12:50'),
(6, 5, '1_hour', '2025-11-13 21:15:00', 0, NULL, '2025-11-13 14:10:39'),
(8, 7, '24_hours', '2025-11-13 21:04:00', 0, NULL, '2025-11-13 18:03:29'),
(9, 7, '1_hour', '2025-11-14 20:04:00', 0, NULL, '2025-11-13 18:03:29');

-- --------------------------------------------------------

--
-- Table structure for table `event_tickets`
--

CREATE TABLE `event_tickets` (
  `id` int(11) NOT NULL,
  `event_id` varchar(100) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `ticket_type` enum('WAO Members','Public','Standard') NOT NULL,
  `amount_paid` int(11) NOT NULL,
  `mpesa_code` varchar(32) NOT NULL,
  `ticket_number` varchar(32) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `event_tickets`
--

INSERT INTO `event_tickets` (`id`, `event_id`, `user_email`, `full_name`, `ticket_type`, `amount_paid`, `mpesa_code`, `ticket_number`, `created_at`) VALUES
(1, 'movie-night', 'pkonsomu2020@gmail.com', 'Peter Onsomu', 'WAO Members', 800, 'THJ822XDEE', 'WAO-273253-64', '2025-08-20 09:16:47'),
(2, 'movie-night', 'cruzeltone@gmail.com', 'Cruzz Eltone', 'WAO Members', 800, 'THK3611W49', 'WAO-782443-25', '2025-08-21 12:52:18'),
(3, 'movie-night', 'lobusubiri@gmail.com', 'Lynn Neema', 'WAO Members', 800, 'TGC8OUZHHA,TGC2NNV5DC', 'WAO-124601-29', '2025-08-27 18:26:18'),
(4, 'movie-night', 'farhiyaabdinoor11@gmail.com', 'Farhiya Abdi Noor', 'WAO Members', 800, 'TGP2GZ9VZQ', 'WAO-700571-46', '2025-08-27 18:26:40'),
(5, 'movie-night', 'kelvinnyangwara7@gmail.com', 'Kevin nyariki nyang\'wara', 'WAO Members', 800, 'TGD2T135SQ', 'WAO-999974-40', '2025-08-27 18:27:00'),
(6, 'movie-night', 'kingorievans45@gmail.com', 'Evans Mwangi', 'WAO Members', 800, 'TGO1BSBE9D', 'WAO-665860-51', '2025-08-27 18:27:26'),
(7, 'movie-night', 'samouwreagan@gmail.com', 'Edin Hajj', 'WAO Members', 800, 'CGU7B985WH', 'WAO-451416-84', '2025-08-27 18:27:36'),
(8, 'movie-night', 'emmanueldavine99@gmail.com', 'Emmanuel Davine', 'WAO Members', 800, 'TH14189C52', 'WAO-614338-61', '2025-08-27 18:27:44'),
(9, 'movie-night', 'awuortrinnette@gmail.com', 'Trinnette Awuor', 'WAO Members', 800, 'TGS7X2XTWN', 'WAO-396362-60', '2025-08-27 18:27:51'),
(10, 'movie-night', 'alycianjeri5515@gmail.com', 'Alycia Njeri', 'WAO Members', 800, 'TGI9GMI1ED', 'WAO-993399-69', '2025-08-27 18:27:57'),
(11, 'movie-night', 'brunonjoga@gmail.com', 'Bruno Njoga', 'WAO Members', 800, 'TGT736H8NP', 'WAO-367263-84', '2025-08-27 18:28:03'),
(12, 'movie-night', 'wwanjiruanne@gmail.com', 'Anne wanjiru', 'WAO Members', 800, 'TGU74DEQZZ', 'WAO-932369-68', '2025-08-27 18:28:09'),
(13, 'movie-night', 'georgegachango679@gmail.com', 'George', 'WAO Members', 800, 'TGR9P541DB', 'WAO-791659-52', '2025-08-27 18:28:14'),
(14, 'movie-night', 'evelynmuraguri@gmail.com', 'Evelyne Njeri  Muraguri', 'WAO Members', 800, 'TH20K8CAZU', 'WAO-734678-65', '2025-08-27 18:28:22'),
(15, 'movie-night', 'jerushaangela501@gmail.com', 'Angela Jerusha', 'WAO Members', 800, 'TGU17KYWUD', 'WAO-798345-75', '2025-08-27 18:28:28'),
(16, 'movie-night', 'Carolynemutindi08@gmail.com', 'Carolyne Mutindi', 'WAO Members', 800, 'TGF02S5776', 'WAO-670919-85', '2025-08-27 18:28:35'),
(17, 'movie-night', 'rachaelsophie254@gmail.com', 'Sophie Nganga', 'WAO Members', 800, 'TH20J0C5KE', 'WAO-327884-72', '2025-08-27 18:28:48'),
(18, 'movie-night', 'jakkaka73@gmail.com', 'Ibrahim Musa', 'WAO Members', 800, 'TGQ5NVH8S3', 'WAO-745464-85', '2025-08-27 18:28:54'),
(19, 'movie-night', 'itsuezzy@gmail.com', 'Susan Waweru', 'WAO Members', 800, 'TGQ5NYNGMH', 'WAO-156014-25', '2025-08-27 18:43:30'),
(20, 'movie-night', 'maureencherry27@gmail.com', 'MAUREEN CHEROP', 'WAO Members', 800, 'TGQ7NUKAOF', 'WAO-382828-81', '2025-08-27 21:41:48'),
(21, 'movie-night', 'feizalb03@gmail.com', 'Feizal Ngotho', 'WAO Members', 800, 'TGU97SSXRB', 'WAO-243178-69', '2025-08-27 21:41:56'),
(22, 'movie-night', 'feizalb03@gmail.com', 'Feizal Ngotho', 'WAO Members', 800, 'TGO6DAA8XC', 'WAO-581464-16', '2025-08-27 21:42:05'),
(23, 'movie-night', 'Lettyrose083@gmail.com', 'ROSE WANJA', 'WAO Members', 800, 'THR591GBZX', 'WAO-473646-64', '2025-08-27 21:42:17'),
(24, 'movie-night', 'nowellowino@gmail.com', 'Max noel', 'WAO Members', 800, 'THU0MH', 'WAO-462604-14', '2025-08-31 15:04:34'),
(25, 'movie-night', 'johnybran12@gmail.com', 'Koech', 'WAO Members', 800, 'THT3F2GO47', 'WAO-507967-66', '2025-08-31 15:04:45'),
(26, 'kanunga-falls', 'pkonsomu2021@gmail.com', 'peter onsomu', 'Standard', 1600, 'TJ2A06A1XG', 'WAO-179831-86', '2025-10-04 19:31:08'),
(27, 'kanunga-falls', 'cruzeltone@gmail.com', 'Cruzz Eltone', 'Standard', 1600, 'TJ3606EZA4', 'WAO-621112-50', '2025-10-04 19:41:50'),
(28, 'kanunga-falls', 'bravinesangg@gmail.com', 'Bravine Chepchirchir', 'Standard', 1600, 'TIU4Q65P1G', 'WAO-296396-40', '2025-10-05 11:46:38'),
(29, 'kanunga-falls', 'mwendelilian486@gmail.com', 'Lilian Mwende', 'Standard', 1600, 'TJ4QK6GTGZ', 'WAO-865523-47', '2025-10-06 08:48:23'),
(30, 'kanunga-falls', 'rayscope59@gmail.com', 'Ray Sibanda Komora', 'Standard', 1600, 'TJ6DA6MJLG', 'WAO-915480-34', '2025-10-06 09:24:41'),
(31, 'kanunga-falls', 'dianashee001@gmail.com', 'Diana wanjiku waithira', 'Standard', 1600, 'TJ2006BK12', 'WAO-966982-21', '2025-10-06 13:43:26'),
(32, 'kanunga-falls', 'Bryanndungu018@gmail.com', 'Bryan Mbugua', 'Standard', 1600, 'TJ3H06DNLM', 'WAO-175321-90', '2025-10-06 13:43:56'),
(33, 'kanunga-falls', 'francisantony8896@gmail.com', 'Anthony Francis', 'Standard', 1600, 'TJ45E6JF6C', 'WAO-911293-72', '2025-10-06 20:21:15'),
(34, 'kanunga-falls', 'jecintawangare6@gmail.com', 'Jecinta wangare', 'Standard', 1600, 'TJ5BT6KX4Y', 'WAO-347575-24', '2025-10-06 20:21:40'),
(35, 'kanunga-falls', 'brandydevis@gmail.com', 'Bravin', 'Standard', 1600, 'TJ7O16RWKB', 'WAO-545576-67', '2025-10-07 19:25:46'),
(36, 'kanunga-falls', 'jameskk640@gmail.com', 'James K.', 'Standard', 1600, 'TJ7GC6Q1C7', 'WAO-806394-34', '2025-10-07 19:26:03'),
(37, 'kanunga-falls', 'alvingachanja23@gmail.com', 'Alvin Gachanja', 'Standard', 1600, 'TJ6A26PEH3', 'WAO-346164-26', '2025-10-07 19:26:32'),
(38, 'kanunga-falls', 'wanjirah44@gmail.com', 'Hannah Wanjira', 'Standard', 1600, 'TJ75E6RY45', 'WAO-439297-86', '2025-10-07 19:27:00'),
(39, 'kanunga-falls', 'sharongakii39@gmail.com', 'Sharon Gakii', 'Standard', 1600, 'TJ4D36FGWC', 'WAO-369989-76', '2025-10-07 19:28:35'),
(40, 'kanunga-falls', 'modesterachieng03@gmail.com', 'Modester Achieng', 'Standard', 1600, 'TJ8A56TJD5', 'WAO-532067-80', '2025-10-09 12:34:44'),
(41, 'kanunga-falls', 'wanjirah44@gmail.com', 'Veronica  Catherene Muthoni', 'Standard', 1600, 'TJ85E6vix6', 'WAO-911725-57', '2025-10-09 12:35:14'),
(42, 'kanunga-falls', 'farajsuleimanmolu@gmail.com', 'Faraj Suleiman', 'Standard', 1600, 'TJ8PF6T2EG', 'WAO-732659-31', '2025-10-09 12:37:10'),
(43, 'kanunga-falls', 'ndungu.muigai01@gmail.com', 'Samuel Muigai', 'Standard', 1600, 'TJ87T6U6VQ', 'WAO-495365-57', '2025-10-09 12:38:03'),
(44, 'kanunga-falls', 'olesaeverline@gmail.com', 'Everline Olesa', 'Standard', 1600, 'TJ8IJ6X396', 'WAO-768709-96', '2025-10-09 12:40:00'),
(45, 'kanunga-falls', 'jerushawaithira2@gmail.com', 'JERUSHA', 'Standard', 1600, 'TJ95E6YCOK', 'WAO-476714-75', '2025-10-09 20:24:36'),
(46, 'kanunga-falls', 'nyamburapkn2004@gmail.com', 'Peter karanja', 'Standard', 1600, 'TJ9QP6YZ08', 'WAO-210086-19', '2025-10-09 20:25:04'),
(47, 'kanunga-falls', 'viviankahura16@gmail.com', 'Vivian Nyambura', 'Standard', 1600, 'TJ90F6YA9Q ,', 'WAO-366194-27', '2025-10-09 20:25:37'),
(48, 'kanunga-falls', 'ltupesltunges@gmail.com', 'Evans Ltemuni Lengirasi', 'Standard', 1600, 'TJ9M16YT35', 'WAO-725232-95', '2025-10-09 20:26:38'),
(49, 'kanunga-falls', 'ngairahm@gmail.com', 'Moses Emmanuel Ngairah', 'Standard', 1600, 'TJ9OL70HOT', 'WAO-412543-73', '2025-10-09 20:27:07'),
(50, 'kanunga-falls', 'innocentodongo823@gmail.com', 'Innocent odongo', 'Standard', 1600, 'TJ9LG6Z9QB', 'WAO-607380-66', '2025-10-09 20:27:29'),
(51, 'kanunga-falls', 'Hopeann652@gmail.com', 'Anne Tumaini Mang\'eni', 'Standard', 1600, 'TJ9KM70425', 'WAO-216351-70', '2025-10-09 20:27:51'),
(52, 'kanunga-falls', 'ltupesltunges@gmail.com', 'Evans Ltemuni Lengirasi', 'Standard', 1600, 'TJ9MI6YT35', 'WAO-738387-13', '2025-10-09 20:28:12'),
(53, 'kanunga-falls', 'gachurejohn758@gmail.com', 'Kuria Gachure', 'Standard', 1600, 'TJ91X6Z4IY', 'WAO-591083-76', '2025-10-09 20:28:51'),
(54, 'kanunga-falls', 'ryanaghan@gmail.com', 'Ryan Aghan', 'Standard', 1600, 'TJ9By6Xy1E', 'WAO-301167-71', '2025-10-09 20:29:28'),
(55, 'kanunga-falls', 'janenjerikinyoho500@gmail.com', 'Jane Kinyoho', 'Standard', 1600, 'TJ97W6VHD0', 'WAO-646631-88', '2025-10-09 20:30:02'),
(56, 'kanunga-falls', 'kevinchieng254@gmail.com', 'Kevin Ochieng Onyango', 'Standard', 1600, 'TJ9J66XZ4I', 'WAO-798122-45', '2025-10-10 09:46:00'),
(57, 'kanunga-falls', 'snaidalucy174@gmail.com', 'Lucy mary snaida', 'Standard', 1600, 'Tj9GF6YIF6', 'WAO-628711-77', '2025-10-10 09:46:21'),
(58, 'kanunga-falls', 'kelvinnyangwara7@gmail.com', 'Kevin Nyang\'wara', 'Standard', 1600, 'M-PESA Ref ID: TJA5E70QKP', 'WAO-544025-91', '2025-10-10 09:46:56'),
(59, 'kanunga-falls', 'ibrahimnjathi@gmail.com', 'IBRAHIM NJATHI', 'Standard', 1600, 'TJA2273FWM', 'WAO-669668-72', '2025-10-11 09:39:24'),
(60, 'kanunga-falls', 'jematorpol@gmail.com', 'Pol Jemator', 'Standard', 1600, 'TJALH74PCE', 'WAO-830841-66', '2025-10-11 09:40:21'),
(61, 'kanunga-falls', 'wairimurhoda254@gmail.com', 'Rhoda wairimu kailemia', 'Standard', 1600, 'TJB5E7488T', 'WAO-657384-73', '2025-10-11 09:43:16'),
(62, 'kanunga-falls', 'reginakwamboka61@gmail.com', 'Regina Kwamboka', 'Standard', 1600, 'TJB8G70P3J', 'WAO-294822-76', '2025-10-11 09:47:58'),
(63, 'kanunga-falls', 'pkonsomu2021@gmail.com', 'peter onsomu', 'Standard', 1600, 'TITA05XFJG', 'WAO-570421-45', '2025-11-11 10:55:45');

-- --------------------------------------------------------

--
-- Table structure for table `feedback_messages`
--

CREATE TABLE `feedback_messages` (
  `id` int(11) NOT NULL,
  `admin_profile_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `type` enum('complaint','suggestion','announcement') NOT NULL,
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `status` enum('new','in_progress','resolved') DEFAULT 'new',
  `subject` varchar(500) NOT NULL,
  `message` text NOT NULL,
  `assigned_to` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feedback_replies`
--

CREATE TABLE `feedback_replies` (
  `id` int(11) NOT NULL,
  `message_id` int(11) NOT NULL,
  `admin_profile_id` int(11) DEFAULT NULL,
  `reply_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` bigint(20) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `uploaded_by` varchar(255) NOT NULL,
  `uploaded_by_name` varchar(255) DEFAULT NULL,
  `uploaded_by_email` varchar(255) DEFAULT NULL,
  `uploaded_by_profile_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `tags` text DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT 0,
  `download_count` int(11) DEFAULT 0,
  `status` varchar(20) DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`id`, `filename`, `original_name`, `file_path`, `file_size`, `mime_type`, `category_id`, `uploaded_by`, `uploaded_by_name`, `uploaded_by_email`, `uploaded_by_profile_id`, `description`, `tags`, `is_public`, `download_count`, `status`, `created_at`, `updated_at`) VALUES
(1, 'file-1763056849235-77564817.pdf', 'THE CONSTITUTION FINAL EDIT.pdf', '/home/weareone/domains/weareone.co.ke/public_html/api/uploads/files/file-1763056849235-77564817.pdf', 760498, 'application/pdf', 1, 'pkonsomu2021@gmail.com', 'Peter Onsomu', 'pkonsomu2021@gmail.com', 13, NULL, NULL, 0, 2, 'deleted', '2025-11-13 18:00:51', '2025-11-17 12:24:27'),
(2, 'file-1763056901542-131566417.docx', 'CIVIC EDUCATION SOCIAL MEDIA STRATEGY.docx', '/home/weareone/domains/weareone.co.ke/public_html/api/uploads/files/file-1763056901542-131566417.docx', 18764, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1, 'pkonsomu2021@gmail.com', 'Peter Onsomu', 'pkonsomu2021@gmail.com', 13, NULL, NULL, 0, 1, 'deleted', '2025-11-13 18:01:41', '2025-11-17 12:24:18'),
(3, 'file-1763106727337-361099512.png', 'lotus hd2-01.png', '/home/weareone/domains/weareone.co.ke/public_html/api/uploads/files/file-1763106727337-361099512.png', 158218, 'image/png', 2, 'kevinkoechx@gmail.com', 'Kevin Koech', 'kevinkoechx@gmail.com', 11, NULL, NULL, 0, 1, 'active', '2025-11-14 07:52:09', '2025-11-17 12:23:56'),
(4, 'file-1763106727807-922258111.png', 'lotus white hd.png', '/home/weareone/domains/weareone.co.ke/public_html/api/uploads/files/file-1763106727807-922258111.png', 397674, 'image/png', 2, 'kevinkoechx@gmail.com', 'Kevin Koech', 'kevinkoechx@gmail.com', 11, NULL, NULL, 0, 2, 'active', '2025-11-14 07:52:09', '2025-11-17 12:23:52');

-- --------------------------------------------------------

--
-- Table structure for table `file_access_log`
--

CREATE TABLE `file_access_log` (
  `id` int(11) NOT NULL,
  `file_id` int(11) NOT NULL,
  `accessed_by` varchar(255) NOT NULL,
  `action` varchar(50) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `file_categories`
--

CREATE TABLE `file_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `color` varchar(7) DEFAULT '#3B82F6',
  `icon` varchar(50) DEFAULT 'folder',
  `created_by` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `file_categories`
--

INSERT INTO `file_categories` (`id`, `name`, `description`, `color`, `icon`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Documents', 'General documents and text files', '#3B82F6', 'file-text', 'admin@weareone.co.ke', '2025-10-24 15:25:16', '2025-10-24 15:25:16'),
(2, 'Images', 'Photos and image files', '#10B981', 'image', 'admin@weareone.co.ke', '2025-10-24 15:25:16', '2025-10-24 15:25:16'),
(3, 'Videos', 'Video files and recordings', '#F59E0B', 'video', 'admin@weareone.co.ke', '2025-10-24 15:25:16', '2025-10-24 15:25:16'),
(4, 'Audio', 'Audio files and recordings', '#8B5CF6', 'music', 'admin@weareone.co.ke', '2025-10-24 15:25:16', '2025-10-24 15:25:16'),
(5, 'Presentations', 'PowerPoint and presentation files', '#EF4444', 'presentation', 'admin@weareone.co.ke', '2025-10-24 15:25:16', '2025-10-24 15:25:16'),
(6, 'Spreadsheets', 'Excel and spreadsheet files', '#059669', 'table', 'admin@weareone.co.ke', '2025-10-24 15:25:16', '2025-10-24 15:25:16'),
(7, 'Archives', 'ZIP, RAR and compressed files', '#6B7280', 'archive', 'admin@weareone.co.ke', '2025-10-24 15:25:16', '2025-10-24 15:25:16'),
(8, 'Reports', 'Reports and analytics files', '#DC2626', 'bar-chart', 'admin@weareone.co.ke', '2025-10-24 15:25:16', '2025-10-24 15:25:16'),
(9, 'Templates', 'Document templates and forms', '#7C3AED', 'layout-template', 'admin@weareone.co.ke', '2025-10-24 15:25:16', '2025-10-24 15:25:16'),
(10, 'Other', 'Miscellaneous files', '#64748B', 'file', 'admin@weareone.co.ke', '2025-10-24 15:25:16', '2025-10-24 15:25:16');

-- --------------------------------------------------------

--
-- Table structure for table `file_downloads`
--

CREATE TABLE `file_downloads` (
  `id` int(11) NOT NULL,
  `file_id` int(11) NOT NULL,
  `downloaded_by_profile_id` int(11) NOT NULL,
  `downloaded_by_name` varchar(255) NOT NULL,
  `downloaded_by_email` varchar(255) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `downloaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `file_downloads`
--

INSERT INTO `file_downloads` (`id`, `file_id`, `downloaded_by_profile_id`, `downloaded_by_name`, `downloaded_by_email`, `ip_address`, `user_agent`, `downloaded_at`) VALUES
(1, 1, 1, 'WAO Admin', 'admin@weareone.co.ke', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-17 12:10:20'),
(2, 4, 1, 'WAO Admin', 'admin@weareone.co.ke', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-17 12:23:51'),
(3, 4, 1, 'WAO Admin', 'admin@weareone.co.ke', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-17 12:23:52'),
(4, 3, 1, 'WAO Admin', 'admin@weareone.co.ke', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-17 12:23:56'),
(5, 2, 1, 'WAO Admin', 'admin@weareone.co.ke', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-17 12:24:01'),
(6, 1, 1, 'WAO Admin', 'admin@weareone.co.ke', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-17 12:24:08');

-- --------------------------------------------------------

--
-- Table structure for table `file_shares`
--

CREATE TABLE `file_shares` (
  `id` int(11) NOT NULL,
  `file_id` int(11) NOT NULL,
  `shared_by` varchar(255) NOT NULL,
  `shared_with` varchar(255) DEFAULT NULL,
  `share_token` varchar(100) NOT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `download_limit` int(11) DEFAULT NULL,
  `download_count` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `journal_entries`
--

CREATE TABLE `journal_entries` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `moods`
--

CREATE TABLE `moods` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `mood_value` int(11) NOT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mpesa_verifications`
--

CREATE TABLE `mpesa_verifications` (
  `id` int(11) NOT NULL,
  `mpesa_code` varchar(32) NOT NULL,
  `amount` int(11) DEFAULT NULL,
  `msisdn` varchar(32) DEFAULT NULL,
  `payer_name` varchar(255) DEFAULT NULL,
  `status` varchar(64) NOT NULL,
  `raw_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`raw_response`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('success','info','warning','error') DEFAULT 'info',
  `source` enum('event','feedback','file','settings','system') DEFAULT 'system',
  `action_url` varchar(500) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `message`, `type`, `source`, `action_url`, `is_read`, `created_at`, `updated_at`) VALUES
(1, 'Welcome to Admin Portal', 'System initialized successfully. All features are ready to use.', 'success', 'system', '/admin', 1, '2025-10-31 20:52:59', '2025-11-14 03:19:36'),
(2, 'New Meeting Scheduled', 'Team meeting scheduled for tomorrow at 10:00 AM', 'info', 'event', '/admin/events', 1, '2025-10-31 20:27:59', '2025-11-14 03:19:36'),
(3, 'Feedback Received', 'New customer feedback submitted for review', 'success', 'feedback', '/admin/feedback', 1, '2025-10-31 18:57:59', '2025-11-14 03:19:36'),
(4, 'File Upload Complete', 'Successfully uploaded THE CONSTITUTION FINAL EDIT.pdf to repository', 'success', 'file', '/admin/files', 1, '2025-11-11 09:28:25', '2025-11-14 03:19:36'),
(5, 'File Upload Complete', 'Successfully uploaded THE CONSTITUTION FINAL EDIT.pdf to repository', 'success', 'file', '/admin/files', 1, '2025-11-11 09:29:07', '2025-11-14 03:19:36'),
(6, 'File Upload Complete', 'Successfully uploaded THE CONSTITUTION FINAL EDIT.pdf to repository', 'success', 'file', '/admin/files', 1, '2025-11-11 10:57:26', '2025-11-14 03:19:36'),
(7, 'Feedback Submitted', 'New announcement: \"High number of people\" has been submitted', 'success', 'feedback', '/admin/feedback', 1, '2025-11-11 10:58:10', '2025-11-14 03:19:36'),
(8, 'Feedback Submitted', 'New announcement: \"High number of people\" has been submitted', 'success', 'feedback', '/admin/feedback', 1, '2025-11-11 10:58:10', '2025-11-14 03:19:36'),
(9, 'Event Scheduled', '\"Internal Meeting\" scheduled for 11/12/2025 at 14:12', 'success', 'event', '/admin/events', 1, '2025-11-11 11:12:50', '2025-11-14 03:19:36'),
(10, 'Profile Updated', 'Your profile information has been successfully updated', 'success', 'settings', '/admin/settings', 1, '2025-11-11 11:14:19', '2025-11-14 03:19:36'),
(11, 'Profile Updated', 'Your profile information has been successfully updated', 'success', 'settings', '/admin/settings', 1, '2025-11-11 11:14:19', '2025-11-14 03:19:36'),
(12, 'Event Scheduled', '\"EVENTS PLANNING WAO\" scheduled for 11/12/2025 at 14:36', 'success', 'event', '/admin/events', 1, '2025-11-11 11:35:54', '2025-11-14 03:19:36'),
(13, 'System Settings Updated', 'System configuration has been successfully updated', 'success', 'settings', '/admin/settings', 1, '2025-11-11 11:36:56', '2025-11-14 03:19:36'),
(14, 'System Settings Updated', 'System configuration has been successfully updated', 'success', 'settings', '/admin/settings', 1, '2025-11-11 11:37:07', '2025-11-14 03:19:36'),
(15, 'Feedback Submitted', 'New suggestion: \"High number of people\" has been submitted', 'success', 'feedback', '/admin/feedback', 1, '2025-11-11 17:58:18', '2025-11-14 03:19:36'),
(16, 'Feedback Submitted', 'New suggestion: \"High number of people\" has been submitted', 'success', 'feedback', '/admin/feedback', 1, '2025-11-11 17:58:19', '2025-11-14 03:19:36'),
(17, 'File Upload Complete', 'Successfully uploaded THE CONSTITUTION FINAL EDIT.pdf to repository', 'success', 'file', '/admin/files', 1, '2025-11-13 14:05:17', '2025-11-14 03:19:36'),
(18, 'Event Scheduled', '\"WAO_Meetup\" scheduled for 11/13/2025 at 22:15', 'success', 'event', '/admin/events', 1, '2025-11-13 14:10:39', '2025-11-14 03:19:36'),
(19, 'Feedback Submitted', 'New suggestion: \"Test Message - Terminal Test 2025-11-13\" has been submitted', 'success', 'feedback', '/admin/feedback', 1, '2025-11-13 14:42:30', '2025-11-14 03:19:36'),
(20, 'Event Scheduled', '\"Test Event - Terminal Test 2025-11-13\" scheduled for 11/14/2025 at 14:00', 'success', 'event', '/admin/events', 1, '2025-11-13 14:42:30', '2025-11-14 03:19:36'),
(21, 'Feedback Submitted', 'New suggestion: \"Test Message - Terminal Test 2025-11-13\" has been submitted', 'success', 'feedback', '/admin/feedback', 1, '2025-11-13 14:54:34', '2025-11-14 03:19:36'),
(22, 'File Upload Complete', 'Successfully uploaded THE CONSTITUTION FINAL EDIT.pdf to repository', 'success', 'file', '/admin/files', 1, '2025-11-13 18:00:54', '2025-11-14 03:19:36'),
(23, 'File Upload Complete', 'Successfully uploaded CIVIC EDUCATION SOCIAL MEDIA STRATEGY.docx to repository', 'success', 'file', '/admin/files', 1, '2025-11-13 18:01:43', '2025-11-14 03:19:36'),
(24, 'Feedback Submitted', 'New announcement: \"High number of people\" has been submitted', 'success', 'feedback', '/admin/feedback', 1, '2025-11-13 18:02:16', '2025-11-14 03:19:36'),
(25, 'Feedback Submitted', 'New announcement: \"High number of people\" has been submitted', 'success', 'feedback', '/admin/feedback', 1, '2025-11-13 18:02:17', '2025-11-14 03:19:36'),
(26, 'Event Scheduled', '\"WAO_Meetup - Kanunga Falls Meeting\" scheduled for 11/14/2025 at 21:04', 'success', 'event', '/admin/events', 1, '2025-11-13 18:03:29', '2025-11-14 03:19:36'),
(27, 'Event Scheduled', '\"WAO_Meetup - Kanunga Falls Meeting\" scheduled for 11/14/2025 at 21:04', 'success', 'event', '/admin/events', 1, '2025-11-13 18:03:29', '2025-11-14 03:19:36'),
(28, 'Password Updated', 'Your account password has been successfully updated', 'success', 'settings', '/admin/settings', 1, '2025-11-13 18:05:48', '2025-11-14 03:19:36'),
(29, 'Password Changed', 'Your account password has been successfully updated', 'success', 'settings', '/admin/settings', 1, '2025-11-13 18:05:49', '2025-11-14 03:19:22'),
(30, 'Password Updated', 'Your account password has been successfully updated', 'success', 'settings', '/admin/settings', 1, '2025-11-14 03:20:46', '2025-11-14 03:20:58'),
(31, 'Password Changed', 'Your account password has been successfully updated', 'success', 'settings', '/admin/settings', 1, '2025-11-14 03:20:47', '2025-11-14 03:20:58'),
(32, 'Password Updated', 'Your account password has been successfully updated', 'success', 'settings', '/admin/settings', 1, '2025-11-14 06:21:01', '2025-11-14 07:23:15'),
(33, 'Password Changed', 'Your account password has been successfully updated', 'success', 'settings', '/admin/settings', 1, '2025-11-14 06:21:02', '2025-11-14 07:23:15'),
(34, 'Password Updated', 'Your account password has been successfully updated', 'success', 'settings', '/admin/settings', 0, '2025-11-14 07:34:33', '2025-11-14 07:34:33'),
(35, 'Password Changed', 'Your account password has been successfully updated', 'success', 'settings', '/admin/settings', 1, '2025-11-14 07:34:34', '2025-11-14 08:40:04'),
(36, 'File Upload Complete', 'Successfully uploaded 2 files to repository', 'success', 'file', '/admin/files', 1, '2025-11-14 07:52:10', '2025-11-14 08:39:45'),
(37, 'Password Updated', 'Your account password has been successfully updated', 'success', 'settings', '/admin/settings', 1, '2025-11-14 07:54:48', '2025-11-14 08:40:08'),
(38, 'Password Changed', 'Your account password has been successfully updated', 'success', 'settings', '/admin/settings', 1, '2025-11-14 07:54:49', '2025-11-14 08:40:24'),
(39, 'Password Updated', 'Your account password has been successfully updated', 'success', 'settings', '/admin/settings', 1, '2025-11-14 12:24:29', '2025-11-20 17:19:21'),
(40, 'File Deleted', 'Successfully deleted CIVIC EDUCATION SOCIAL MEDIA STRATEGY.docx', 'success', 'file', '/admin/files', 1, '2025-11-17 12:24:20', '2025-11-20 17:19:21'),
(41, 'File Deleted', 'Successfully deleted THE CONSTITUTION FINAL EDIT.pdf', 'success', 'file', '/admin/files', 1, '2025-11-17 12:24:28', '2025-11-19 14:12:22');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
(1, 2, '64a5fe83286f1cd2112a646cd631b40a272a10ee3dfe59d38d53ae7dd4568ee7', '2025-08-21 12:08:30', '2025-08-21 11:08:30'),
(2, 4, '2add41b305154c5a5f884c9af060158803a67dc35e2b5d5a53e59e73c04c1076', '2025-08-21 13:11:38', '2025-08-21 12:11:38'),
(3, 4, 'eba58b3e29b7d7b84aaa9ac490a0f12aa2c4587c656850c07ea8c0709248c42c', '2025-08-21 13:12:49', '2025-08-21 12:12:49'),
(4, 2, 'e295d2ac787072c305bbf7799ffb99363e61a33f775698f30773759b47b3490c', '2025-08-21 13:15:26', '2025-08-21 12:15:26'),
(5, 4, 'b4bd574a1bf36418cd79b4774e05d90f5a0917cb6a7a6d338200308006a46fd4', '2025-08-21 13:21:02', '2025-08-21 12:21:02'),
(6, 4, 'c71feffd1f256ac545c3eec613c76c77e66b5de70f047f044fc2f1b810bb4e48', '2025-08-21 16:23:13', '2025-08-21 15:23:13'),
(7, 4, 'e58c2fb31e515a0f76ba3bd0991831efab19ef8eb9efe174b43684ca28e81328', '2025-08-22 22:25:21', '2025-08-22 21:25:21'),
(12, 101, 'd81540dd8d6f24ec6e11d939c6a957b92f46f6682d83e10a42a0e4836104535c', '2025-10-19 20:34:08', '2025-10-19 19:34:08'),
(13, 178, '96f5cc70aa15d156d2f7600781b11b7066dfffd0db425eaebb7cb798d78c879e', '2025-11-16 20:21:51', '2025-11-16 19:21:51'),
(14, 178, '1a27dfad271eb4e344ba0913a9beaee2945c14b0b5132acc855efb56b555912f', '2025-11-16 20:22:05', '2025-11-16 19:22:05'),
(15, 178, '474892f943515042b74404fd293186088f221df17de0645791a90c77d9adb2ab', '2025-11-16 20:24:09', '2025-11-16 19:24:09'),
(16, 178, 'b6cab4c6f22596291dcc25bac267890f798f8b57feea565f511e48bfa228594f', '2025-11-16 20:24:22', '2025-11-16 19:24:22'),
(17, 178, '4b6a5689a52c376fb9f7b28a6664a71e9949761e352a02b94da897ac9ae46e7e', '2025-11-16 20:26:51', '2025-11-16 19:26:51'),
(18, 179, 'c2fb052321f09beec5a54fb93ab2451cc877dde3c6ed27a99088918cdfe4a0f2', '2025-11-23 15:53:29', '2025-11-23 14:53:29');

-- --------------------------------------------------------

--
-- Table structure for table `scheduled_events`
--

CREATE TABLE `scheduled_events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` enum('meeting','organization_event','reminder') NOT NULL DEFAULT 'meeting',
  `description` text DEFAULT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `meeting_link` varchar(500) DEFAULT NULL,
  `created_by` varchar(255) NOT NULL DEFAULT 'Admin',
  `created_by_profile_id` int(11) DEFAULT NULL,
  `created_by_name` varchar(255) DEFAULT NULL,
  `created_by_email` varchar(255) DEFAULT NULL,
  `updated_by_profile_id` int(11) DEFAULT NULL,
  `is_recurring` tinyint(1) DEFAULT 0,
  `recurrence_pattern` varchar(100) DEFAULT NULL,
  `status` enum('scheduled','cancelled','completed') DEFAULT 'scheduled',
  `reminder_sent` tinyint(1) DEFAULT 0,
  `reminder_sent_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `scheduled_events`
--

INSERT INTO `scheduled_events` (`id`, `title`, `type`, `description`, `start_datetime`, `end_datetime`, `location`, `meeting_link`, `created_by`, `created_by_profile_id`, `created_by_name`, `created_by_email`, `updated_by_profile_id`, `is_recurring`, `recurrence_pattern`, `status`, `reminder_sent`, `reminder_sent_at`, `created_at`, `updated_at`) VALUES
(1, 'Internal Meeting', 'meeting', '', '2025-11-12 14:12:00', '2025-11-12 14:18:00', 'Nairobi', '', 'Admin', NULL, NULL, NULL, NULL, 1, 'weekly', 'cancelled', 1, NULL, '2025-11-11 11:12:50', '2025-11-11 11:35:06'),
(5, 'WAO_Meetup', 'meeting', '', '2025-11-13 22:15:00', '2025-11-13 23:19:00', '', '', 'Admin', NULL, NULL, NULL, NULL, 1, '', 'cancelled', 1, NULL, '2025-11-13 14:10:39', '2025-11-13 15:02:09'),
(7, 'WAO_Meetup - Kanunga Falls Meeting', 'meeting', 'WAO_Meetup - Kanunga Falls Meeting', '2025-11-14 21:04:00', '2025-11-14 21:05:00', 'Nairobi', 'Nairobi', 'Admin', 13, 'Peter Onsomu', 'pkonsomu2021@gmail.com', NULL, 1, 'weekly', 'scheduled', 1, '2025-11-13 21:04:10', '2025-11-13 18:03:29', '2025-11-13 18:04:10');

-- --------------------------------------------------------

--
-- Table structure for table `support_categories`
--

CREATE TABLE `support_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `support_categories`
--

INSERT INTO `support_categories` (`id`, `name`) VALUES
(9, 'Disability Support'),
(3, 'Domestic Violence'),
(6, 'Financial Assistance'),
(5, 'Grief or Loss Support'),
(8, 'LGBTQ+ Support'),
(1, 'Mental Health'),
(11, 'Other'),
(10, 'Relationship/Family Counseling'),
(4, 'Sexual Abuse'),
(2, 'Substance Abuse / Addiction Recovery'),
(7, 'Youth Empowerment');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `gender` enum('male','female','other','prefer_not_to_say') NOT NULL,
  `age` int(11) NOT NULL,
  `location` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `emergency_contact_name` varchar(255) NOT NULL,
  `emergency_contact_phone` varchar(20) NOT NULL,
  `emergency_contact_relationship` varchar(100) NOT NULL,
  `live_location` text DEFAULT NULL,
  `personal_statement` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `gender`, `age`, `location`, `password_hash`, `emergency_contact_name`, `emergency_contact_phone`, `emergency_contact_relationship`, `live_location`, `personal_statement`, `created_at`, `updated_at`) VALUES
(1, 'Stephen Ndegwa', 'hostraha001@gmail.com', '0708002001', 'male', 22, 'Nairobi', '$2a$12$s6uito4jJblBoO7INjtccOGlml5HhPXsJpenex3cgvXsK9N02ORVm', 'Stephen Ndegwa', '0708002001', 'P', '-1.2394394, 36.7044732', 'Tesrt', '2025-06-17 06:14:16', '2025-06-17 06:14:16'),
(2, 'Peter Onsomu', 'pkonsomu2020@gmail.com', '0745343256', 'male', 23, 'Kajiado', '$2a$12$Be6IgrIJjdLcDpbX//2qLeOZ8698xk10o3qvi3zJZehl.YscmYI/O', 'Peter Onsomu', '0745343256', 'Sister', '-1.282881, 36.9049787', '', '2025-06-17 09:50:23', '2025-06-17 09:50:23'),
(3, 'Cruzz Eltone', 'cruzeltone@gmail.com', '0711853928', 'male', 21, 'Kajiado', '$2a$12$05bTsqEXEot80b3WEWQs..w7Lycm6xLpUqDY6XWlRzlkFucSLFmIC', 'Hellen Anyango ', '0728597920', 'Mother ', '', '', '2025-06-17 10:38:16', '2025-06-17 10:38:16'),
(4, 'peter onsomu', 'pkonsomu2021@gmail.com', '0793343875', 'male', 23, 'Bungoma', '$2a$12$L4vKL1KDwnV3VbS4C2jIbuHkgHwBjI0NqSRS18dPIdnI0AXfF8gRm', 'Lydia', '0783343973', 'sister', 'Sosian Estate, Upper Savannah ward, Embakasi, Nairobi, Nairobi County, 00518, Kenya', '', '2025-06-17 10:53:27', '2025-08-25 12:16:41'),
(5, 'Koech', 'johnybran12@gmail.com', '0715987339', 'male', 22, 'Nairobi', '$2a$12$tpDwQGure7WeCBNwZriYcelMonhZ.PhVaNEdjabNPWNNfxtrer13i', 'Koech', '0720312447', 'dad', '', '', '2025-06-17 11:25:06', '2025-06-17 11:25:06'),
(6, 'peter onsomu', 'eastassemblyprojectionteam@gmail.com', '0755789354', 'male', 21, 'Busia', '$2a$12$3mCsx34Q6SgPQ7817SBECOE9rSxMHNT1Wdj4mthpAiKmo0IvPX9gG', 'John', '0745343256', 'brother', 'Sosian Estate, Upper Savannah ward, Embakasi, Nairobi, Nairobi County, 00518, Kenya', '', '2025-06-17 11:45:10', '2025-06-17 11:45:10'),
(7, 'peter onsomu', 'onsomupeter2022@students.uonbi.ac.ke', '0712345678', 'male', 22, 'Kakamega', '$2a$12$O4yMWQ4hb76KkDltW18E/u/avrj93rW4b.5MdQKuFho9TEIkDjI7O', 'Lydia', '0783343973', 'sister', 'Pipeline Railway Station, Outer Ring Road, Pipeline, Pipeline ward, Embakasi, Nairobi, Nairobi County, 00501, Kenya', '', '2025-06-17 11:58:44', '2025-06-17 11:58:44'),
(8, 'Patricia Wanjiru Ngugi', 'patriciangugi28@gmail.com', '0759229962', 'female', 20, 'Nairobi', '$2a$12$vGJNDYbRh9VLlhUy6vr14.DR9I/qQxsNhs6LJOm5QKIJDv4EJYUsa', 'Patricia Wanjiru Ngugi', '0759229962', 'Siblings ', 'Jogoo House, Harambee Avenue, City Square sublocation, Starehe location, CBD division, Starehe, Nairobi, Nairobi County, 00300, Kenya', '', '2025-06-17 12:15:20', '2025-06-17 12:15:20'),
(9, 'Jean Louis', 'ljean1624@gmail.com', '0740874012', 'male', 24, 'Nairobi', '$2a$12$tYM8p9ywXt/j/FNSOMF8kurqQaXkpHZKCWYO6TcMUmtWEvoAEQqHi', 'Grace Odhiambo', '0740874012', 'Mother', '', '', '2025-06-18 08:09:29', '2025-06-18 08:09:29'),
(10, 'Esther Muyoka', 'esthermuyoka2022@gmail.com', '0790757545', 'female', 20, 'Nairobi', '$2a$12$YFap6Q0xyWGsLOkaRh5uUuQZcThxDSvP1z0Y2DlndnDp9s6qQNX42', '0790757545', '0794698451', 'Sibling', '', '', '2025-06-18 08:12:16', '2025-06-18 08:12:16'),
(11, 'Claire Gathoni ', 'alexiaclaire96@gmail.com', '0115710013', 'female', 20, 'Nairobi', '$2a$12$9my4U4XvwrxH57zTBPvea.ftJip9u3stcR9ynjP0NokNzhAnpc616', 'Yvonne ', '0720387031', 'Sister ', '', '', '2025-06-18 08:12:31', '2025-06-18 08:12:31'),
(12, 'Mokaya Esther Nyaboke ', 'mokayae937@gmail.com', '0757095998', 'female', 20, 'Nairobi', '$2a$12$5k0QbEeRxRYj1zmPZUTfVOYNM3ZiUP2mdaNGJoTBh8haSl6h45/CC', 'Mbaisi odelia ', '0795422556', 'Parent ', '', '', '2025-06-18 08:16:11', '2025-06-18 08:16:11'),
(13, 'Vivian Nelima Wakwabubi ', 'Veenewa9740@gmail.com', '0783919332', 'female', 19, 'Mombasa', '$2a$12$UG9mf3LgPC31jP3DEeOS.OgHc9afYKA5MM4OlqjL24sw.T4pj//d.', 'Adelite Muchele', '0717990645', 'Mom', '', '', '2025-06-18 08:16:57', '2025-06-18 08:16:57'),
(14, 'waithaka Muthoni', 'waithakateddy045@gmail.com', '+254745710078', 'male', 19, 'Nairobi', '$2a$12$esj.50FR3XbolUN1QFNy0eIXH9HHfqfoww2SSg2T52XVgrKMK6nne', 'Jane Waithaka', '0745710078', 'Parent', '', '', '2025-06-18 08:18:11', '2025-06-18 08:18:11'),
(15, 'Dolphin Binsari Onkundi', 'dollyonkundi@gmail.com', '254758258799', 'female', 22, 'Kiambu', '$2a$12$lPIcMZKJsBz3PfkA5mXI4OKtsnxrtwajMBuseZlFqCMeukVeZbRlm', 'Timothy Maenda', '+254727673671', 'Sibling ', 'Kihara-Gachie-Karura Road, Gachie, Kihara ward, Kabete, Kiambu, Central Kenya, 11403, Kenya', '', '2025-06-18 08:19:43', '2025-06-18 08:19:43'),
(16, 'Patience Midecha', 'patiencemidecha2@gmail.com', '0791020166', 'female', 21, 'Nairobi', '$2a$12$QC6CZQ/nOKvB4.WUmu7ZMeCeItdyNH77Cnnc7zEdVtXJcx1w3Mvjq', 'Joyce Amadi', '0705897749', 'Parent', 'Nkaimurunya ward, Kajiado North, Kajiado County, Rift Valley, 00511, Kenya', '', '2025-06-18 08:20:15', '2025-06-18 08:20:15'),
(17, 'Enock Onderi', 'enockjosephat22@gmail.com', '0704811559', 'male', 24, 'Nairobi', '$2a$12$vrZFMqzfD0UU8Jlt90vtvufngRwOja7KbhNcUO9P3SODAElDuRqOq', 'Rodah', '0743826655', 'Mother ', 'hall, Social Hall, Mathare North Area2, Mathare North sublocation, Kasarani, Nairobi, Nairobi County, 57935, Kenya', '', '2025-06-18 08:21:23', '2025-06-18 08:21:23'),
(18, 'Julius Kimani', 'irungujulius659@gmail.com', '0704039783', 'male', 25, 'Nairobi', '$2a$12$OCcEITIhh4q8LzOjJv3qIuqhj9H2nLW9sB2C48csZ2j1OY5O2oogy', 'Jane Njoki', '0706005231', 'Sibling', 'Kabete Technical Training Institute, Thiongo Road, Mountain View sublocation, Kangemi location, Kangemi division, Westlands, Nairobi, Nairobi County, 29326, Kenya', '', '2025-06-18 08:22:28', '2025-06-18 08:22:28'),
(19, 'Mary Ngima Wanjiru', 'mw0679873@gmail.com', '0758464621', 'female', 21, 'Nairobi', '$2a$12$idKyNPK/1m1QhJUdPJDB3eg56djWxN2wnfzsiG9NpUDcvp84HgpsK', 'Dennis Munene', '0707956154', 'My emergency contact', 'Mawensi Garden, Woodley/Kenyatta/Golf Course ward, Kibra, Nairobi, Nairobi County, 00202, Kenya', '', '2025-06-18 08:26:29', '2025-06-18 08:26:29'),
(20, 'Lynn Neema ', 'lobusubiri@gmail.com', '0796058286', 'female', 21, 'Kajiado', '$2a$12$0qzg7MNDIoP.2oxT/Hrv0euzRb.Q9GWoiQ8wnDOxJ/O4HuYrVX6Ty', 'Mary Atieno ', '0723822693', 'Close friend ', 'Noonkopir, Oloosirkon/Sholinke ward, Kajiado East, Kajiado County, Rift Valley, Kenya', '', '2025-06-18 08:26:39', '2025-06-18 08:26:39'),
(21, 'PURITY MULUKI MUTUA', 'mulukipurity021@gmail.com', '0722124828', 'female', 23, 'Nairobi', '$2a$12$FQZttXGZ1cTdTd2THP5xEei8F8gbcrxBEgPhZ1JmHOwVV2ijNuLcm', 'Mary mutua', '0704722729', 'Sibling', 'Koma Rock Road, Dandora Area I, Dandora Area I ward, Njiru, Nairobi, Nairobi County, 00623, Kenya', '', '2025-06-18 08:26:52', '2025-06-18 08:26:52'),
(22, 'Shadrack Pale', 'shadrack9m@gmail.com', '+254743474588', 'male', 25, 'Nakuru', '$2a$12$mB2Rvl1wVZ1OQ2HpgtlUw.WxWaKs4IhcBZUHxOOt1BHZRcAxWNqmy', 'Max', '0700039916', 'Sibling', '', '', '2025-06-18 08:26:53', '2025-06-18 08:26:53'),
(23, 'Salada Yusuf ', 'saladayusuf@gmail.com', '254114761534', 'female', 22, 'Uasin Gishu', '$2a$12$v2XawTc9hUNnTc9gV4X1TONHe67oribf9FVMl8.e6lcTYY/igoNOW', 'Shukri', '0708109356', 'Sister', '', '', '2025-06-18 08:28:37', '2025-06-18 08:28:37'),
(24, 'SANDRA CHEPNGETICH', 'chepngetichsandra29@gmail.com', '0704283809', 'female', 21, 'Kiambu', '$2a$12$4WtrP5FxVr4OJW3vmhCw8uWw5HQsGFFwjxp4OT11lycuua5auv5nO', 'Beyonce ', '0799876409', 'Friend ', 'Thika, Thika Town, Kiambu, Central Kenya, 01000, Kenya', '', '2025-06-18 08:29:07', '2025-06-18 08:29:07'),
(25, 'Percy Smiley ', 'mumbuacynthia94@gmail.com', '+254717209833', 'female', 30, 'Machakos', '$2a$12$dCgY8UTzd1WEztfMI/EeROlHr008hefyCg7CwJtBY0pC1nz0.O75q', 'Kennedy ', '0745156645', 'Sibling ', 'Dammam, Dammam Governorate, Eastern Province, 32244, Saudi Arabia', 'I am struggling with bipolar condition hoping someday I\'ll be okay completely ', '2025-06-18 08:31:07', '2025-06-18 08:31:07'),
(26, 'Rashid Ngaira ', 'rashidngaira27@gmail.com', '0758263093', 'male', 22, 'Nairobi', '$2a$12$xDyyV3GY6smMMxghOgZn.uMP7zfOg8fXflY58VL2D3yp3XJ/T64gy', 'Hassan Ngaira ', '0726748173', 'Father ', 'Kawangware Road, Village 46, Kawangware ward, Kawangware division, Dagoretti, Nairobi, Nairobi County, 00505, Kenya', '', '2025-06-18 08:31:35', '2025-06-18 08:31:35'),
(27, 'Richard Nyongesa ', 'richardnyongesa25@gmail.com', '0759172927', 'male', 23, 'Nairobi', '$2a$12$ImAXNiEMwYhXxoV3yZ2l7.Y2Oi6C5a.c1Aua95MwAxNVa4UrpM0wW', 'Jenitah Nelima', '0711516505', 'Parent', 'Pipeline, Pipeline ward, Embakasi, Nairobi, Nairobi County, 00501, Kenya', '', '2025-06-18 08:32:32', '2025-06-18 08:32:32'),
(28, 'Harriet Githaiga', 'githaigaharriet@gmail.com', '0723387850', 'female', 20, 'Nairobi', '$2a$12$6kZfK6sZDAb3iyLUKAbDBek/bGgbke/XHRqf3/44BIbg96Rer5u3.', 'Jerusha Njihia', '+254 102 621482', 'Friend ', '-1.257202, 36.7160547', '', '2025-06-18 08:32:40', '2025-06-18 08:32:40'),
(29, 'Eileen Chebet', 'eileenchebet369@gmail.com', '0779017298', 'female', 20, 'Nairobi', '$2a$12$9hRqtm0yJ2cm14dfTfoziOCUO1gIc39UpGvbHFzjbyQGyFyIf0Nay', 'Chebet', '0780795410', 'Friend', 'DT Dobie, Lusaka Road, Landimawe, Landimawe ward, Starehe, Nairobi, Nairobi County, 00200, Kenya', 'I would love some guidance', '2025-06-18 08:35:02', '2025-06-18 08:35:02'),
(30, 'Stacy Agwanda ', 'stacyagwanda@gmail.com', '0769357562', 'female', 23, 'Nairobi', '$2a$12$XNadPQ6iT0suzToa/ah0B.OI/Bqz/vDWB1GA2FFLO.xwYlzmZvShG', 'Shuaib Said', '0790080949', 'Bestfriend ', '', '', '2025-06-18 08:38:22', '2025-06-18 08:38:22'),
(31, 'Angela Jerusha', 'jerushaangela501@gmail.com', '0704978331', 'female', 20, 'Nairobi', '$2a$12$qLv77eiyRWJZ5wugfBuhPO.QF0loJ.nuX42O1RE1MD.KX4CcQyASO', 'Samuel', '0723869619', 'Parent', '', '', '2025-06-18 08:39:02', '2025-06-18 08:39:02'),
(32, 'Lucy Njoki', 'nlucy3754@gmail.com', '0110228131', 'female', 23, 'Nakuru', '$2a$12$lh3vyptI2z8xuyQIC5FOmuZsQ56qIWL27m3GHQ4/OSfgDbQK.HUCW', 'Mum', '0721983012', 'Mum', 'Mburu Gichua Road, Nakuru CBD, Afraha sublocation, Market/Railways, London ward, Nakuru West, Nakuru, Rift Valley, 20100, Kenya', 'Struggling with identity crisis', '2025-06-18 08:40:39', '2025-06-18 08:40:39'),
(33, 'Dennis Saitabau', 'dennisntete28@gmail.com', '0112532012', 'male', 23, 'Kiambu', '$2a$12$ZXmPLcoZ50pAHygjj9CbN.iy7TTwJhM2ou.I97erRlzFHm/dN0O1S', 'Noah', '0797645060', 'Friend ', 'Kihunguro, Gatongora ward, Ruiru, Kiambu, Central Kenya, 01001, Kenya', '', '2025-06-18 08:45:58', '2025-06-18 08:45:58'),
(34, 'Phyllis Oyiera ', 'ambwaphyllis@gmail.com', '0112910118', 'female', 24, 'Nairobi', '$2a$12$9H7jyidfZVDwZE7j3sKPSOu5g6vzAqc70VbiXajuxZnX3iEjbOJ7O', 'Janet', '+254714507708', 'Friend ', '', '', '2025-06-18 08:46:40', '2025-06-18 08:46:40'),
(35, 'Shaneez watiri ', 'shaneezwatiri@gmail.com', '0796677556', 'female', 21, 'Nairobi', '$2a$12$FhX/x3qSW4.SKq9oCLZmc.uaz1ELSUikk/UXFi2G2FmHclNavc2MK', 'Annette Waigwe', '0721176976', 'Sister ', 'Kenya Industrial Research and Development Institute, K.L.B Road, South C, South C ward, Lang\'ata, Nairobi, Nairobi County, 00603, Kenya', '', '2025-06-18 08:47:18', '2025-06-18 08:47:18'),
(36, 'Newton Murimi ', 'newtonmurimi82@gmail.com', '0769131179', 'male', 23, 'Meru', '$2a$12$rJW1bnvqZDuRL3Qt5FYK..ZbroZs6hD3pSHN/.yujUcK03FJ85coG', 'Derrick kibaara ', '0769131179', 'Father ', 'Rainbow Ruiru Resort, 2nd Sunrise Avenue, Kihunguro, Gatongora ward, Ruiru, Kiambu, Central Kenya, 00609, Kenya', '', '2025-06-18 08:47:30', '2025-06-18 08:47:30'),
(37, 'Sophie Nganga', 'rachaelsophie254@gmail.com', '0700849594', 'female', 24, 'Nairobi', '$2a$12$XeaKFtXzz6tK0KYe5jxAq.kGdV3X1JLwx4DxUQT/0tdkGrEa8uWnG', 'Peter Maina', '0796834174', 'Sibling', 'Komarock, Komarock ward, Embakasi, Nairobi, Nairobi County, 00518, Kenya', '', '2025-06-18 08:53:14', '2025-06-18 08:53:14'),
(38, 'Byron Ouma ', 'byronouma02@gmail.com', '0795498655', 'male', 21, 'Kiambu', '$2a$12$mdJOupCVc9E8iW8N3TtrFuxV9IXCP4/fUutlMc2K8OtCIHQaScSw.', 'Ruth ', '+254717067748', 'Friend ', 'Witeithie, Witeithie ward, Juja, Kiambu, Central Kenya, 01000, Kenya', 'An addict for more than 6 years \nChildhood trauma \nMental health ', '2025-06-18 08:53:35', '2025-06-18 08:53:35'),
(39, 'Mary Kwamboka Mageto', 'magetomary40@gmail.com', '0110565160', 'female', 26, 'Kajiado', '$2a$12$soxf0kGowLmUeF3r1XOV0uvk/XwbNTO6aV8BF8XVd2lOpmddAZ6CW', 'Robert Mageto ', '0700225438', 'Sibling(brother)', 'Ongata Rongai ward, Kajiado North, Kajiado County, Rift Valley, 00511, Kenya', 'Am struggling with childhood trauma,which has gravely affected my relationships and equally has diminished my self worth and self preservation... Equally I would appreciate LGBTQ support.', '2025-06-18 08:56:09', '2025-06-18 08:56:09'),
(40, 'Jacqueline mwikali Mutinda ', 'jacquelinemutinda99@gmail.com', '0743185254', 'female', 25, 'Murang\'a', '$2a$12$ZqVIHWcdRKVnJggoOP2DMeR3lZzce./xtuNSaalLqg0eNeGlwA6QW', 'Susan Mwangi ', '0720542703', 'Parents ', '', 'Anxiety,self isolation, body shaming myself,self love', '2025-06-18 08:56:27', '2025-06-18 08:56:27'),
(41, 'Glorian Katheu', 'gloriankatheu@gmail.com', '0725381452', 'female', 19, 'Kajiado', '$2a$12$8HBySyAoxdl6L2O.B69pBuFvNEwemaARzRW0.ImvqJvAsuJeBsrpC', 'Maureen ', '0705627241', 'A close friend', 'Kitengela ward, Kajiado East, Kajiado County, Rift Valley, Kenya', '', '2025-06-18 08:57:25', '2025-06-18 08:57:25'),
(42, 'John Marley ', 'marleyjohn864@gmail.com', '0791260751', 'male', 23, 'Nairobi', '$2a$12$4Eo4tWE2yK0s./7pFectHeAtNCnn.G3bIZFJOjgfNbMbFBpsTtuGG', 'Samuel mwaura', '0106353809', 'Brother ', 'Coast Road, Kabiro, Kabiro ward, Kawangware division, Dagoretti, Nairobi, Nairobi County, 00505, Kenya', '', '2025-06-18 08:58:41', '2025-06-18 08:58:41'),
(43, 'Gerald Williams ', 'geraldwilliams2606@gmail.com', '0757687266', 'male', 19, 'Mombasa', '$2a$12$wKdOnTd.gctnZ6ou6DAJTe6.dzT3vfu1UYp4H69zJp3kI1lwiUw9q', 'Grace kusah', '0721792441', 'Parent ', 'Mwihoko ward, Ruiru, Kiambu, Central Kenya, 00609, Kenya', '', '2025-06-18 09:07:05', '2025-06-18 09:07:05'),
(44, 'Susan Waweru', 'wawerususa5868@gmail.com', '0708312712', 'female', 19, 'Nairobi', '$2a$12$pzokTgRjnzAZeD5yvQTvRe7jeBFK4ZeTZyAOlDLx1DbbanK0jNuQq', 'Samuel Waweru', '0708312712', 'Parent', '', 'Am struggling with anxiety but that is not even it making decisions is hard since i don want to be considered a people pleaser but guilt eats me up if i make a decision and the other parties reaction ', '2025-06-18 09:07:33', '2025-06-18 09:07:33'),
(45, 'Evelyne Muraguri ', 'evelynmuraguri@gmail.com', '0796389697', 'female', 21, 'Nairobi', '$2a$12$1XbP/lWG4n.2tH688teUzuHMOmuEF/NOwC90.yD.B2n1deYpkPI0C', 'Soul sister ', '0793860635', 'Best friend ', 'Government Lane, City Centre sublocation, Starehe location, CBD division, Starehe, Nairobi, Nairobi County, 46464, Kenya', 'I  have been self harming myself due to my past Trauma ', '2025-06-18 09:21:19', '2025-06-18 09:21:19'),
(46, 'Kevin Nyang\'wara ', 'kelvinnyangwara7@gmail.com', '0768732885', 'male', 25, 'Nairobi', '$2a$12$FrLlX.xoJZQuAGyzIS0Xy.dcaikyOC5bzb/v5jpNQe/OOs71Jf0Fi', 'Kevin ', '0724852403', 'Friend ', '', '', '2025-06-18 09:26:55', '2025-06-18 09:26:55'),
(47, 'Martin Oduor', 'martineoduor6@gmail.com', '0768917654', 'male', 25, 'Narok', '$2a$12$GCYbn2.aqclIINMd8sCHde/7lRSNTjwodDg2h.v6OJC9bwvGnJCm6', 'Mary Adhiambo', '0711937759', 'Parent', 'Nairagie Ngare, Keekonyokie ward, Narok East, Narok, Rift Valley, Kenya', '', '2025-06-18 09:34:09', '2025-06-18 09:34:09'),
(48, 'Wayne masese ', 'waynemasese88@gmail.com', '0729029251', 'female', 25, 'Nakuru', '$2a$12$LU//vpoDDqEoZxUUy6cb/OIdlG4egtmJDIFb/Aq1apKlg8VrdPs/.', 'Xyanic', '0793789923', 'Sister', '', '', '2025-06-18 09:57:05', '2025-06-18 09:57:05'),
(49, 'Esther Mungai ', 'mungaiesther84@gmail.com', '0716375682', 'female', 34, 'Nairobi', '$2a$12$VET4CQjI/hz7ob2aUO.Koe/HdjGq2qX4xUN27EzZZ5gnmke7Z6DsK', 'Mary mungai', '0724111879', 'Mother', 'Northview Road, Ngara, Pangani, Starehe, Nairobi, Nairobi County, 30108, Kenya', '', '2025-06-18 10:01:29', '2025-06-18 10:01:29'),
(50, 'Vanessa', 'venessakariuki52@gmail.com', '0792757041', 'female', 18, 'Uasin Gishu', '$2a$12$qC6jTtWLQvfotS6pSqiOiOCVrSenUDWUbm1rRBf.0vpdZD/xmWWca', 'Zawadi', '0757847812', 'Sibling', 'Mwanzo Estate, Kiplombe ward, Turbo, Uasin Gishu County, Rift Valley, 30100, Kenya', 'I struggle with anxiety feel like being alone and distanced with everyone', '2025-06-18 10:46:19', '2025-06-18 10:46:19'),
(51, 'Alvin Ng\'ethe', 'alvinngethe97@gmail.com', '0112334191', 'male', 26, 'Nairobi', '$2a$12$utKtX77e8oq2t5MgsAPj0.5/uGeccm1bmweFDz6tnKUUcqu9cWAV2', 'Lorna', '0716201240', 'Girlfriend ', '', 'Struggling with drugs addiction ', '2025-06-18 11:28:06', '2025-06-18 11:28:06'),
(52, 'Kendrah ', 'karumilka49@gmail.com', '0711618476', 'female', 21, 'Nairobi', '$2a$12$6HOlvJbH8gRwQ9WNU5KJVOgtvNjJasZ9zPQQneTYWJSEIAk5GSXfy', 'Anaya', '+254 701 325739', 'Friend', 'Mwiki ward, Ruiru, Kiambu, Central Kenya, 00608, Kenya', 'Struggling with anxiety and depression ', '2025-06-18 11:51:41', '2025-06-18 11:51:41'),
(53, 'Theresa', 'theresaaddy004@gmail.com', '0705924866', 'female', 23, 'Nairobi', '$2a$12$UI19MrUBtm5ocUD3f4a0feafAilL/3U4ci1La45e1KgjS7fZY9LQW', 'Joan', '0712909022', 'Parent', 'Tena, Umoja II ward, Embakasi, Nairobi, Nairobi County, 56744, Kenya', 'Friends to have fun with.', '2025-06-18 13:02:09', '2025-06-18 13:02:09'),
(54, 'Duncan simiyu', 'biketiduncan@gmail.com', '0768413381', 'male', 25, 'Nairobi', '$2a$12$U3baul5iINYOITR5KwxRteL4Vn.o2KD7XtzvERGhPmZoHUOcRm/Fm', 'Brian', '0790313452', 'Brother ', '', '', '2025-06-18 13:32:46', '2025-06-18 13:32:46'),
(55, 'Annet Wangui ', 'wanguiannet5@gmail.com', '0794142052', 'female', 22, 'Nairobi', '$2a$12$hz0xobET8V2.32jzpXRO.OChoVYGPB4ymNIKUYEDo5vbTqBZzDyam', 'Damaris', '0759015706', 'Sibling ', 'ACK St Monica Utawala, 00100, Utawala Road, Utawala, Njiru, Nairobi, Nairobi County, 00520, Kenya', '', '2025-06-18 14:42:23', '2025-06-18 14:42:23'),
(56, 'JOY', 'mjoy5171@gmail.com', '0113185217', 'female', 21, 'Kiambu', '$2a$12$2iPkujlMUGNRqXlPDbSTgO4MJ6axMszBIgTWYXQLaghZYagVok/7q', 'ELVIS MIGWI', '0111962529', 'Best friend ', '', '', '2025-06-18 15:33:53', '2025-06-18 15:33:53'),
(57, 'Vanesa Neema', 'vanesaneema28@gmail.com', '0793562427', 'female', 22, 'Nairobi', '$2a$12$/Xl/1sQTlQnem6gAiCmPj.e3pNa0GbifJEVl4xDoKGpPzrPzU4IBy', 'Judith okoth', '254721442587', 'Mom', 'Straight Centre, JKUAT Entry Road, Juja, Kiambu, Central Kenya, 01001, Kenya', '', '2025-06-18 15:45:08', '2025-06-18 15:45:08'),
(58, 'LESLIE OTIENO ', 'leslieotieno176@gmail.com', '0712398685', 'female', 28, 'Nairobi', '$2a$12$FlXOfQTEEL7e54ic.HUew.2qDkuOTzWj3B5a7jYkqWokQGpV95CQW', 'GORDON MILTON', '0729684994', 'BROTHER', 'Matopeni ward, Njiru, Nairobi, Nairobi County, 55145, Kenya', '', '2025-06-18 15:53:55', '2025-06-18 15:53:55'),
(59, 'Sheyne Neema ', 'sheynegachanja@gmail.com', '0112216213', 'female', 19, 'Nairobi', '$2a$12$6tUC9WyqePD5GJ9Sr..zMOLKcqXZJnZ0JtBZKHu4Sq2cyX9EzP90.', 'Shakinah Blessing ', '0 743 050899', 'Close friend ', '', '', '2025-06-18 15:55:36', '2025-06-18 15:55:36'),
(60, 'MELVYN IAN KARIUKI', 'Melvynian73@gmail.com', '0712345876', 'male', 20, 'Nakuru', '$2a$12$T79HrQivxeCIh.q.SUAZx.JpPqOJ/MLQ9fkmyRPSyWZFAa3YqnAUK', 'Diana', '0727578497', 'Sibling', 'Subukia, Subukia ward, Subukia, Nakuru, Rift Valley, Kenya', 'I\'ve been struggling with Anxiety and Depression. ', '2025-06-18 16:08:41', '2025-06-18 16:08:41'),
(61, 'Blessing Kendi', 'cesskendik@gmail.com', '0719605088', 'female', 19, 'Nairobi', '$2a$12$ObjPmkqw/e8VhwaPZyMCPuU4fdVQUboU1KWuVvtMgNrjsHxqKYr2m', 'Jemimah ', '0721531278', 'Mother ', '', '', '2025-06-18 17:47:17', '2025-06-18 17:47:17'),
(62, 'jill pazzy', 'abongojill85@gmail.com', '0115819657', 'female', 21, 'Mombasa', '$2a$12$cVOdrPdqSkbtJOGgNyBF1.qWeoCOWUa1goqaXfL.TEHluwPt1KQiW', 'vell', '0702932534', 'bestfriend', '', '', '2025-06-18 18:23:14', '2025-06-18 18:23:14'),
(63, 'Emily Kathini ', 'emilycathy14@gmail.com', '0795205195', 'female', 24, 'Nairobi', '$2a$12$sCegD57ZLCrf3VZKI4m4Iut.v0DQFs9TPriRpp6ddHQhXbIR60HiW', 'Everline Mwendwa', '0706606303', 'Mum', '', 'I am a counselling psychologist looking to connect with like minded people who are passionate about mental health advocacy.', '2025-06-18 18:33:02', '2025-06-18 18:33:02'),
(64, 'Jelda Tum', 'jeldatum@gmail.com', '0721649512', 'female', 22, 'Nairobi', '$2a$12$D4/Z6s1ZAqcO.qspPFB1AODwGD8I/NjSUKCQ61xbIGW3F84tz3R5i', 'Jelda Tum', '0721649512', 'Sister ', '', '', '2025-06-18 19:54:29', '2025-06-18 19:54:29'),
(65, 'Miriam Mwongela ', 'miriammwongela15@gmail.com', '0717019879', 'female', 21, 'Nairobi', '$2a$12$B3I8K4LmSAOEnXOmrpV6R.j.Cyf9MNGsJ/i9O.OZZZ76Mi9uoPqjm', 'Dorcas Mwongela ', '0721289736', 'Parent', '', 'Struggling with attachment issues; emotional and anxiety. \nLearning to love myself and accepting myself ', '2025-06-18 20:08:19', '2025-06-18 20:08:19'),
(66, 'Staicy Kihiko', 'kihikostacy6@gmail.com', '780947482', 'female', 18, 'Kiambu', '$2a$12$LsRtv3eEPTVgpkWd/P/b0eI2lhBsFBEdY0uPJbLAFfkKkTBCihtVu', '0704868092', '780947482', 'Me', '', '', '2025-06-18 20:19:38', '2025-06-18 20:19:38'),
(67, 'Peninah  Gachu', 'wacukanina@gmail.com', '0718922310', 'female', 21, 'Nairobi', '$2a$12$gFCDIXcgMojSA6V7ANuhku782D9B.P57wVQPg06h/Gt3yaux0FyDS', 'Nyna', '0718922310', 'Me ,I said I have nobody ', '', 'I feel like dying everytime  no one wants.me and it\'s okay', '2025-06-19 01:20:32', '2025-06-19 01:20:32'),
(68, 'Arnold Ojiambo', 'arnoldojiambo@gmail.com', '0710319325', 'male', 22, 'Nairobi', '$2a$12$AT0tMLNkIHzpSyfao290UOIfQSrALt.K4IYTy/PF2MPV6Y.6lRr5e', 'Sheila ', '0790634729', 'Sister', '11th Meta close, Uthiru/Ruthimitu ward, Waithaka division, Dagoretti, Nairobi, Nairobi County, 29039, Kenya', '', '2025-06-19 05:34:06', '2025-06-19 05:34:06'),
(69, 'Mike Maina', 'mike.maina2474@gmail.com', '0727745425', 'male', 29, 'Nairobi', '$2a$12$5KoOr6U4VSziiem1p/d0oOxisAfUFP9grxTcNBxQOcCqbLrBCOInK', 'Tracey Nyambura ', '0798159980', 'Sister ', '', '', '2025-06-19 06:10:50', '2025-06-19 06:10:50'),
(70, 'Ruth David', 'ruthabbie6@gmail.com', '0796688498', 'female', 26, 'Mombasa', '$2a$12$rZwwEuw/vD3BwsPT6GG0f.yvp3NLO0RSy./YyuG0rurumc/JqWrIO', 'Mercy David', '0112513266', 'Sibling', 'Likoni, Timbwani ward, Likoni, Mombasa County, Coast, 80110, Kenya', '', '2025-06-26 19:41:47', '2025-06-26 19:41:47'),
(71, 'Winter', 'mwangiwinter@gmail.com', '0794132433', 'female', 20, 'Nairobi', '$2a$12$n2A/PUjhDFK0fU1Pszbb6O3R9gyr3QpQnY4dPrrFWYvW7wAPqdTx.', 'Sean', '0716121471', 'Partner', 'Mathare N Road, Mathare 4A sublocation, Mathare North sublocation, Roysambu division, Kasarani, Nairobi, Nairobi County, 57935, Kenya', '', '2025-06-29 19:32:10', '2025-06-29 19:32:10'),
(72, 'Joan', 'joannataliawanjira@gmail.com', '0799944071', 'female', 28, 'Kiambu', '$2a$12$NB8kp2P.Wq0fBgs6JMnEOO/V0ZnmBG5bDCRew4Dh.drKyc/ZWILaq', 'Mercy Wanjiku', '0740859978', 'Parent', '', '', '2025-07-16 07:59:13', '2025-07-16 07:59:13'),
(73, 'Eleazar Hesbon Ondiala', 'hesboneleazar22@gmail.com', '0797599369', 'male', 24, 'Mombasa', '$2a$12$0tHKncb84997TvqR3AIjVutZNgYkmDZw9wZfEamRg06EUR761WaPW', 'Carolyne  Ondiala', '0723627566', 'Mother', '', '', '2025-07-19 07:29:46', '2025-07-19 07:29:46'),
(74, 'Brian Mwangi', 'brianthumbi76@gmail.com', '0797686382', 'male', 18, 'Nairobi', '$2a$12$FAq96CM9Oso2dunWEREtTeM3pMhjbyK6.1iybeNo6lreYcVwZEiJ2', 'Alice ', '0768270508', 'Parent', 'Mulandi Road, Hospital ward, Thika Town, Kiambu, Central Kenya, 01000, Kenya', '', '2025-07-21 08:31:23', '2025-07-21 08:31:23'),
(75, 'Philis Wanjiru ', 'philiswanjiru97@gmail.com', '0769604898', 'female', 25, 'Nairobi', '$2a$12$atfVZIBGc/YeoQZmM9v28uJRzLBQVZ5nTSZO.U0KmbJaWwJBlwVei', 'Alice Kariuki ', '0726137197', 'Parent ', '', '', '2025-07-24 22:05:42', '2025-07-24 22:05:42'),
(76, 'Christus', 'christus463@gmail.com', '0704516012', 'male', 22, 'Nakuru', '$2a$12$07pZnSkio8OxjiA4XCCWUOcJoRRLo42tE8/XawsGUqMQ47Nm.w/W2', 'Saint', '0731143284', 'personal assasin', '', '', '2025-07-25 19:15:44', '2025-07-25 19:15:44'),
(77, 'Andrew Bahati', 'andrewbahati@gmail.com', '0722714594', 'male', 39, 'Kakamega', '$2a$12$G4PVvcENWJunFXjwO6oBMuhb8FSaN8SQGAKxDbJBpRnADLqgeIleW', 'Wycliffe Madaga', '0722834313', 'Brother', 'Shirungu-Mugai ward, Malava, Kakamega County, Kenya', 'Anxieties, panic, worry, cant sleep', '2025-07-28 23:19:26', '2025-07-28 23:19:26'),
(78, 'Ian kariuki', 'iank18515@gmail.com', '0746086090', 'male', 19, 'Nairobi', '$2a$12$rGPGxaZfPWmp/YZzBsGZXuAvI9KdWZ2X8jIS4J/q7d6NuqpZ570zK', 'Ian', '0795582264', 'Sibling ', '', '', '2025-07-29 14:54:43', '2025-07-29 14:54:43'),
(79, 'KEITH MORGAN KIBOROH', 'kiboroh78@gmail.com', '0759237133', 'male', 19, 'Nakuru', '$2a$12$dKnE3YFZTCAK7iO9s.4kfumbio5TJO5hpNu/Zo1KFf2LxxWZjEUru', 'Bernice Angel', '0759237133', 'Sibling', 'Free Area, Naka D, Nakuru, Nakuru East, Nakuru, Rift Valley, 20100, Kenya', '', '2025-07-29 20:28:39', '2025-07-29 20:28:39'),
(80, 'Juma Kevin', 'knyarwaba20@gmail.com', '0700514422', 'male', 22, 'Nairobi', '$2a$12$El3xg2slBy2CdVzG1JQwQuX0g5AYZnl72mg4qOBGSPpr.gH03Z7GO', 'Daniel Nyarwaba ', '0726651382', 'Parent', 'Matathani ward, Mavoko, Machakos County, Eastern, Kenya', '', '2025-07-30 11:01:31', '2025-07-30 11:01:31'),
(81, 'Maureen Wanjiru', 'gitagiawanjiru@gmail.com', '0742549270', 'female', 22, 'Nairobi', '$2a$12$kc5krtUsOSc.DoyV7hkZLe919MfnJHeCX3PIpAr9y.D1zCcszN5wu', 'Mo', '0790491207', 'Sibling', '', '', '2025-07-30 20:22:25', '2025-07-30 20:22:25'),
(82, 'Alice M', 'amuthonikamande@gmail.com', '0728770702', 'female', 37, 'Nairobi', '$2a$12$c3cm3BLbZBT8C4hO1V3S.OqBbzarkkqJJSp33RJNWmyUeyotGXMKy', 'Cate', '0720687964', 'Sibling ', 'Ngumba, Kasarani sublocation, Kasarani location, Kasarani, Nairobi, Nairobi County, 00623, Kenya', 'I\'m from an abusive marriage with three kids. I worked so hard for the last 10 years ...left with nothing..... I\'m servicing a loan paying rent it\'s not easy but I have to be strong enough ', '2025-07-31 15:46:52', '2025-07-31 15:46:52'),
(83, 'JJ', 'youngxazer@gmail.com', '0743482186', 'male', 20, 'Nairobi', '$2a$12$inMySXZOW8g1guwqXp9XyufLMFDM4OE.ucEJQSKtNRjB8vdhXSone', 'MM', '0705408582', 'S', '', '', '2025-08-02 09:39:12', '2025-08-02 09:39:12'),
(84, 'Kangethe muthunga', 'vickymuthunga@gmail.com', '0797037687', 'male', 22, 'Murang\'a', '$2a$12$NQlT8Q/EDduIlqWblEYEnusJjG1gxUvNnasWlQA3C6C/UGZhxmOEO', 'ephie', '0791262440', 'bro', '', '', '2025-08-03 04:41:49', '2025-08-03 04:41:49'),
(85, 'Owiti Brevard', 'owitibrevard0@gmail.com', '0740546174', 'male', 25, 'Homa Bay', '$2a$12$4gAhngN5E41ZHoQvTaN1EeQLaC8OQLpbAyGHmAKBnbAUUWRWacsBm', 'Owiti Brevard', '0105136141', 'Parent ', '', '', '2025-08-03 17:10:01', '2025-08-03 17:10:01'),
(86, 'Centie', 'innocentmutethia05@gmail.com', '0115930833', 'male', 20, 'Meru', '$2a$12$UxfljjF/ivp8DmA.pulC1uHPHvysSEJJAhVZaRMIyjEu8soNhPAkS', 'Me', '0747930833', 'Siblings ', '', '', '2025-08-05 18:28:55', '2025-08-05 18:28:55'),
(87, 'Beverlyne ', 'mychobeverlyn@gmail.com', '0758403843', 'female', 22, 'Nairobi', '$2a$12$WB6F/6cXTqRZqL7rkGRiJ.4PdLTkClcISWV7vdMyXe2kE.zU8EJ72', 'Masha', '0792012011', 'Friend ', '', 'I am seeking a space to share and get help dealing with family-related traumas and anxieties . I am also seeking a community to offer space to express myself without judgement and a space to grow.', '2025-08-06 17:51:58', '2025-08-06 17:51:58'),
(88, 'Wachira', 'swachiraa@gmail.com', '0796233220', 'male', 25, 'Kiambu', '$2a$12$SqKxH3WrxPKuH4nQvOjkA.d.bxsOa8V5XqKilZJddvAjPOCWrLGfi', 'G man', '0114001988', 'Sibling', '', '', '2025-08-07 06:28:08', '2025-08-07 06:28:08'),
(89, 'Joy Rita Mwende', 'joykimetu@icloud.com', '0768009321', 'female', 26, 'Nakuru', '$2a$12$py0vZ6cl//08pk.U8ct97emPn3eQUH.qB0X9673dhWY4yXClcDVQC', 'Collins', '0707775382', 'Sibling', '', '', '2025-08-09 23:38:33', '2025-08-09 23:38:33'),
(90, 'James kandu', 'jameskandu52@Gmail.com', '+254712722383', 'male', 22, 'Nairobi', '$2a$12$2ysfgG8T6AVqrl8Xm2TiyO1yN4pt2z8BGItnVEtRJenj9dCwjPnda', 'James ', '+254768750293', 'Me ', '', '', '2025-08-10 18:12:52', '2025-08-10 18:12:52'),
(91, 'JULIA KHAYENZELI', 'kashyjulia@gmail.com', '0705788528', 'female', 26, 'Kilifi', '$2a$12$TNdWMtXN2JKp46saBrBBYufMjJWC5XS/6LbdfeQGnktfsF8UzzYW6', 'Salome', '0720147078', 'parent', 'Malindi Town ward, Malindi, Kilifi County, 80200, Kenya', '', '2025-08-11 15:07:43', '2025-08-11 15:07:43'),
(92, 'Magdaline ', 'magdalinemwangi07@gmail.com', '0740825663', 'female', 21, 'Kiambu', '$2a$12$CbrSS0k7iapUGFukJRt7OOrOqNkRsgbm1nAlKiV4Nij0VnsJNzS1q', 'Abednego msm', '0711853928', 'Motherfucker ', 'Nkaimurunya ward, Kajiado North, Kajiado County, 00511, Kenya', '', '2025-08-19 09:33:18', '2025-08-19 09:33:18'),
(93, 'Evans Mwangi', 'kingorievans45@gmail.com', '0724534354', 'male', 23, 'Nairobi', '$2a$12$9bRcGYsF3NTGepEQ4x4hweCCLGi7eX5N5yfoUWhjqP1iRg3tU3Fmm', 'Frida Wangechi', '0719452440', 'Sister', 'Kinoo ward, Kikuyu, Kiambu, 12345, Kenya', '', '2025-08-20 16:31:17', '2025-08-20 16:31:17'),
(94, 'Edin Hajj ', 'samouwreagan@gmail.com', '0799595264', 'male', 24, 'Nairobi', '$2a$12$DnxOiXyv7ENtOhAfJi8JgeOEuESGvJo7lZEDe7eXYGZwMS1HYhuE2', 'Maryam Samo', '0797265255', 'Parent', 'Kayole Spine Road, Komarock, Upper Savannah ward, Embakasi, Nairobi, Nairobi County, 00518, Kenya', '', '2025-08-20 16:38:33', '2025-08-20 16:38:33'),
(95, 'Emmanuel Davine', 'emmanueldavine99@gmail.com', '0111283212', 'male', 23, 'Nairobi', '$2a$12$rA.4e5td3GO4UYF0hi5Ed.dN8xp2HSdKEWWFsh449UFwIW18WS/bW', 'Yvonne', '0792199297', 'Friend', '', '', '2025-08-20 16:42:27', '2025-08-20 16:42:27'),
(96, 'Farhiya Abdi Noor ', 'farhiyaabdinoor11@gmail.com', '0115018969', 'female', 22, 'Nairobi', '$2a$12$0MnMkfHBMdvimGm94z7lRODczQc/rMS.J1JEWxfcoqV18YSSXlTfy', 'Cynthia ', '0798126950', 'Friend ', '', '', '2025-08-20 16:57:22', '2025-08-20 16:57:22'),
(97, 'Trinnette Awuor ', 'awuortrinnette@gmail.com', '0799276198', 'female', 24, 'Kajiado', '$2a$12$KCztrvEWzJnNR0KAccZIrO638LrXCoOKnhG55ElsgX.wz2lJaViE6', 'Risper Okello', '0725957462', 'Grandma ', 'Olkeri ward, Kajiado North, Kajiado County, 00409, Kenya', 'Been struggling with anxiety, mental health since been through a whole lot en still going through it', '2025-08-20 19:27:26', '2025-08-20 19:27:26'),
(98, 'Alycia Njeri ', 'alycianjeri5515@gmail.com', '0768499411', 'female', 19, 'Nairobi', '$2a$12$v7HyInZypEZUjO19o8Ug7.pBBneSEIQF0LQZPree6EFA1o8QIxAjK', 'Mungai', '0738877880', 'Friend', 'Nyayo Highrise Estate, Nyayo Highrise ward, Lang\'ata, Nairobi, Nairobi County, 00202, Kenya', '', '2025-08-21 08:54:09', '2025-08-21 08:54:09'),
(99, 'Bruno Njoga', 'brunonjoga@gmail.com', '0716457537', 'male', 21, 'Nairobi', '$2a$12$dBYDuOIXoC/QIvZlb01FxO33j0TK2LS4KACs42vkdGSrqsJ.m50wq', 'Robert', '0791401340', 'Sibling', 'Matopeni ward, Njiru, Nairobi, Nairobi County, 55145, Kenya', 'Anxiety and mental issues ', '2025-08-21 11:55:16', '2025-08-21 11:55:16'),
(100, 'Anne wanjiru', 'wwanjiruanne@gmail.com', '0796922321', 'female', 28, 'Nairobi', '$2a$12$ufCeowh4tyORF4.kB5OyPe2DWpInqQZuN1oBISXksxhdaGdhK1LwS', 'Cheeru', '0796922321', 'Me', '', '', '2025-08-21 12:43:37', '2025-08-21 12:43:37'),
(101, 'Byll Kisabuli', 'kisabulibilly@gmail.com', '0790902251', 'male', 32, 'Nairobi', '$2a$12$vP06.le36Z2hq64XPiDHIeYuC2zJPi/zCaWqYvWtcfq4UfcYa6phG', 'Herman kisabuli', '072222845', 'Parent', '', '', '2025-08-21 13:09:13', '2025-08-21 13:09:13'),
(102, 'George ', 'georgegachango679@gmail.com', '0705126298', 'male', 22, 'Kiambu', '$2a$12$nGInTismDNRhfwxWcgQSxOqiyDmlFWxnga53qw6/RdAQdr0FHLkmG', 'Faith', '0742689689', 'Siblings', '', '', '2025-08-21 13:39:41', '2025-08-21 13:39:41'),
(103, 'ROSE WANJA', 'Lettyrose083@gmail.com', '0751032126', 'female', 27, 'Nairobi', '$2a$12$Zg.z/grF/nLyStqXcVA5TuxlJAYtG364F1celVFfT9xEe44.qMk8m', 'Anne Wanjiru', '+254 796 922 321', 'Best friend ', '', '', '2025-08-21 16:39:21', '2025-08-21 16:39:21'),
(104, 'Kelvin ', 'keviiam2023@gmail.com', '0724493626', 'male', 29, 'Nairobi', '$2a$12$qOSBoZBN7ElBqMTV5Uyl4.2YGCZfEUTRdeG/5A.LOJfRxZKZis5..', 'Salome', '0703414038', 'Sibling ', 'Pause Road, Kahawa Sukari ward, Ruiru, Kiambu, 00609, Kenya', 'Struggling with grief and abandonment ', '2025-08-22 13:02:19', '2025-08-22 13:02:19'),
(105, 'Ibrahim Musa', 'jakkaka73@gmail.com', '0798885899', 'male', 26, 'Nairobi', '$2a$12$Mwf9QJlA8ug137OwlFVhlelhWqw6bGztGTSvjfYbQYBu9kl.Shlja', '0787295836', '0798885899', 'Friend ', '', '', '2025-08-24 11:38:22', '2025-08-24 11:38:22'),
(106, 'Shelmith kiambi', 'kiambishelmith@gmail.com', '0796219307', 'female', 19, 'Nairobi', '$2a$12$U8oekNuHWST2dAUZ1pn8a.kiy4MVUPOv1N/gcJ87PHSZAQzNKNux2', 'Caleb munene', '0718354463', 'Bestfriend', '', 'In summary\nBalancing myself vs others, self-pressure,relationship and trust,internal battles etc', '2025-08-25 08:43:29', '2025-08-25 08:43:29'),
(107, 'Carolyne Mutindi ', 'Carolynemutindi08@gmail.com', '0110600024', 'female', 22, 'Nairobi', '$2a$12$nebx55eZhFHjVUM0O7njC.9l0QKfaAIKCLw/LaXGjWEZxzAf61AvS', 'None', '0790983015', 'Sibling ', '', '', '2025-08-26 16:07:47', '2025-08-26 16:07:47'),
(108, 'Susan Waweru', 'itsuezzy@gmail.com', '0755005415', 'female', 19, 'Nairobi', '$2a$12$A1bTvUUBoZJB2EhA2F6bk.l4jlr8wfUqKY..p.QIFcbmUIxLYPKn2', 'Samuel', '0725852223', 'Parent', '', '', '2025-08-27 18:33:45', '2025-08-27 18:33:45'),
(109, 'Feizal Ngotho', 'feizalb03@gmail.com', '0116558014', 'male', 22, 'Nairobi', '$2a$12$J8zIpIr1RktkaaGqeVcDcuLwIL2syKihylYibi2zT/JnJm7mV2H6a', 'Kevin Njenga', '0722768994', 'Father', 'Kaputei Road, Kileleshwa sublocation, Kileleshwa location, Kilimani division, Westlands, Nairobi, Nairobi County, 54102, Kenya', '', '2025-08-27 19:33:17', '2025-08-27 19:33:17'),
(110, 'MAUREEN CHEROP ', 'maureencherry27@gmail.com', '0104743884', 'female', 22, 'Nairobi', '$2a$12$XJOnBvrJbUTWaj2Hqmt5LuXHDnGEtfsOiIifCIYm1wnaGFt2IZ1BC', 'Cindy ', '0706054970', 'Cousin ', 'Kiuu ward, Ruiru, Kiambu, 00609, Kenya', 'I just want to find friends and company ', '2025-08-27 19:45:26', '2025-08-27 19:45:26'),
(111, 'Noel', 'nowellowino@gmail.com', '0797286880', 'male', 19, 'Nairobi', '$2a$12$HsaMJpiJ3yjNvQPw77pjG.UCrnTBgK/3GaOGK24qoK293z4gq0uCe', 'Michael ', '0111555187', 'Brother ', '', '', '2025-08-30 13:05:58', '2025-08-30 13:05:58'),
(112, 'Winnie Gideon', 'winnienaisiai@gmail.com', '0757109713', 'female', 25, 'Meru', '$2a$12$OpDrA/2VBKbwSpdwVTauiOgpAa7fPhGFH.CUO3laHq59afijncmGi', 'Winnie', '0764109703', 'cousin', '', '', '2025-08-31 05:42:37', '2025-08-31 05:42:37'),
(113, 'Tabitha Chirure', 'tabbieeneema@gmail.com', '0745531634', 'female', 23, 'Nairobi', '$2a$12$9D23iVh.hGZmLU1IQis3eO84W3s99yT58IQAJdEQDWgTanBfePxqa', 'Timothy', '0748655050', 'Sibling', '', 'Struggling with emotional distress from a previous relationship ', '2025-09-01 15:14:05', '2025-09-01 15:14:05'),
(114, 'Steve Kamau', 'mreu386@gmail.com', '0799835711', 'male', 21, 'Kajiado', '$2a$12$yxtvP.yPRjZPXS/0UfZkHuFfaR5CfFdsolApJ8B4mHxJZ/k.HY8qu', 'Caroline Wambui', '0748462448', 'sibling', '', '', '2025-09-05 04:45:58', '2025-09-05 04:45:58'),
(115, 'Mercy Wacuka', 'M91269645@gmail.com', '0718492653', 'female', 22, 'Nairobi', '$2a$12$Bu8o1D84te.pWlkKA7K5DOiRBNW3yMuuRvuQWiqIWaLFGLbii7MJe', 'James', '0743213802', 'Sibling', '', '', '2025-09-15 17:36:41', '2025-09-15 17:36:41'),
(116, 'Modester Achieng ', 'modesterachieng03@gmail.com', '0758146911', 'female', 22, 'Nairobi', '$2a$12$GqXDtw8V8/tZmHCn9voBPOxWZNBrjCvS5cEulHEDzPI5rtBV/wg42', 'Lucy Atieno', '0712731679', 'Parent', 'Umoja, Umoja II ward, Embakasi, Nairobi, Nairobi County, 56744, Kenya', 'Struggling with anxiety, my past and friendship ', '2025-09-16 22:34:15', '2025-09-16 22:34:15'),
(117, 'Kamau Kaguru ', 'kagurubenkamau@gmail.com', '0724041158', 'male', 24, 'Nairobi', '$2a$12$/WYotqEnbaS7bAancKd0FuwnfkPvr4mnNCIxz9xpW8KUYYudatpRS', 'Zaweria Wanjiku ', '0716631283', 'Sibling ', '', '', '2025-09-17 09:16:56', '2025-09-17 09:16:56'),
(118, 'Kamau Kaguru ', 'bennshown2001@gmail.com', '0752930544', 'male', 24, 'Nairobi', '$2a$12$O5hRLic76QXzeEUVrq.S8uIfNeMSktSFqdg2/uXs595Nh8CtZp7t6', 'Zaweria ', '0716631283', 'Sibling ', 'L10_Ruiru, Mwihoko ward, Ruiru, Kiambu, Kenya', '', '2025-09-17 09:23:43', '2025-09-17 09:23:43'),
(119, 'Moses Emmanuel Ngairah', 'ngairahm@gmail.com', '+254711569208', 'female', 27, 'Nairobi', '$2a$12$sLo0WVCN9IHhdCBkT1qD9.GMV/Fx.n7EC4Qh6Hpzg1F12xTQyk9aq', 'Latisha Kahuho', '+264748460828', 'Friend', 'Sunrise Court, Upper Chokaa, Njiru, Nairobi, Nairobi County, 55145, Kenya', '', '2025-09-26 11:43:22', '2025-09-26 11:43:22'),
(120, 'Lilian Mwende ', 'mwendelilian486@gmail.com', '0706530175', 'female', 26, 'Nairobi', '$2a$12$k.FIY3uuWBVn2ZChhU0yruLdF521bdbY5JlJy8yu/BwgfqSwJa492', 'Eunice Mwakirea', '0725082885', 'mother ', 'Riverside Close, Kileleshwa sublocation, Kileleshwa location, Kilimani division, Westlands, Nairobi, Nairobi County, 97104, Kenya', '', '2025-10-04 08:47:19', '2025-10-04 08:47:19'),
(121, 'Bravine Chepchirchir ', 'bravinesangg@gmail.com', '+254719722830', 'female', 21, 'Nairobi', '$2a$12$B5Y6FUX.pyAqBOZa84eme.IYh3s7yY.dC/3KEJ1Xyvmx/nYnQJZmK', 'Wayne Kipleting', '0791703286', 'Sibling', '', '', '2025-10-05 11:43:56', '2025-10-05 11:43:56'),
(122, 'Alex Ngure Irungu', 'ngurealex02@gmail.com', '0790653503', 'male', 23, 'Nairobi', '$2a$12$1ZDc28fiYKRuvImzTUQ6IOJjs1J0txZ7gT3vaTr3D2IPiaYomSuE.', 'Patrick Irungu ngure', '0714139675', 'Parent ', '', '', '2025-10-06 08:12:50', '2025-10-06 08:12:50'),
(123, 'Ray Sibanda Komora', 'rayscope59@gmail.com', '0725556499', 'male', 36, 'Nairobi', '$2a$12$C8d3iEMAvbOuwTJK8nAKReURNw/yCqazolDRvqqxiNj6BzPZxl8T6', 'Ronald Komora', '0726591980', 'Father', '', '', '2025-10-06 09:12:55', '2025-10-06 09:12:55'),
(124, 'Bryan Mbugua ', 'Bryanndungu018@gmail.com', '0759444282', 'male', 26, 'Kiambu', '$2a$12$NeNT.Xr4bl4t14HIWenPXuXARRmRqghpzN74G/YpIfqUnAKkM2qEO', 'Ryan Mbugua ', '0705687679', 'Sibling', '', '', '2025-10-06 09:39:24', '2025-10-06 09:39:24'),
(125, 'Diana wanjiku waithira ', 'dianashee001@gmail.com', '0115868224', 'female', 23, 'Kiambu', '$2a$12$bHSpG7qo6oPtZ8bjh0tbver75g9.1aHYo01AlZo.JoXbRzCQXYc6q', 'Sissy E', '0718932188', 'Sister ', 'Juja ward, Juja, Kiambu, 01001, Kenya', '', '2025-10-06 12:33:38', '2025-10-06 12:33:38'),
(126, 'Jecinta wangare ', 'jecintawangare6@gmail.com', '0708984991', 'female', 21, 'Nairobi', '$2a$12$z5kh2XqE5Y3JCBIQ7bqArO38/w17L9NP8QpsGTBQmpe7QulKhgRcu', 'Esther ', '0700203010', 'Parent', '', 'I\'m just looking for a community of like minded people who love growth.', '2025-10-06 13:57:52', '2025-10-06 13:57:52'),
(127, 'Anthony Francis ', 'francisantony8896@gmail.com', '0758350964', 'male', 23, 'Nairobi', '$2a$12$ubWQG4xp5jlPsXi9C5gave4j8GwOl6pBN8QuZz1WIsSAytLv1qAY2', 'Jackie', '0791401805', 'Parent ', '', '', '2025-10-06 18:05:50', '2025-10-06 18:05:50'),
(128, 'Alvin Gachanja', 'alvingachanja23@gmail.com', '0768809823', 'male', 22, 'Kiambu', '$2a$12$Lmmei4PouVePm.I9Wu1oVO.Wrh69Ufp/1FfCxQhMO5/.eVRfaLTiC', 'Jane ', '0721326413', 'parent', '', '', '2025-10-06 19:51:30', '2025-10-06 19:51:30'),
(129, 'James K.', 'jameskk640@gmail.com', '0758248796', 'male', 21, 'Nairobi', '$2a$12$V0.unZI5W3QAAPiDmKo7zuC8hL6OaKxpB7bVLwI2Cy6/MiOCh3tBO', 'Annah ', '0748973858', 'Mother', '', '', '2025-10-07 06:45:59', '2025-10-07 06:45:59'),
(130, 'Bravin ', 'brandydevis@gmail.com', '0768226623', 'male', 19, 'Nairobi', '$2a$12$dwFNXVJTAKjztrkRuR/S9uoO0og/pXEAgiceNsoHV2ypdnZYGkJv2', 'HANNAH KINYUA WANJIRA', '+254 708 436601', 'Bestfriend', '', '', '2025-10-07 09:48:57', '2025-10-07 09:48:57'),
(131, 'Hannah', 'Hannahkinyua02@gmail.com', '0708436601', 'female', 21, 'Kiambu', '$2a$12$GRJ8F8cN8394jRi9bhPewunheqNQzISK/N2Jhv64QtIAyYf2tU1VW', 'Gladys ', '0706340568', 'Sibling ', 'Ralph Bunche Road, Kilimani location, Kilimani ward, Kilimani division, Westlands, Nairobi, Nairobi County, 00202, Kenya', 'Am a therapist in progress and id like to interact with people more and understand them', '2025-10-07 10:14:52', '2025-10-07 10:14:52'),
(132, 'Hannah Wanjira ', 'wanjirah44@gmail.com', '0759185518', 'female', 21, 'Kiambu', '$2a$12$XeBVDUvww6r4UEcpQD7.9urRl3UGqQVmvdRcsAk.yMy4LF60prgxC', 'Kanila', '+254 768 226623', 'Friend ', '', '', '2025-10-07 10:27:29', '2025-10-07 10:27:29'),
(133, 'naomi', 'naomiokwemba70@gmail.com', '0716902943', 'female', 28, 'Nairobi', '$2a$12$mrAuoZptgfRhRH2UnXlWLenriGgdIHaiAfAsCgLPZOkLNMsQG19V2', 'hellen', '0708556010', 'mother', '', '', '2025-10-07 12:28:34', '2025-10-07 12:28:34'),
(134, 'Sharon Gakii', 'sharongakii39@gmail.com', '0725663552', 'female', 27, 'Nairobi', '$2a$12$Z9VpVF7fpc5mcdW/zZX.COZSiBrpqDDrA5qCdb6seBo/i2shr9rlK', 'Daniel Gavana', '0711616415', 'Friend', '', '', '2025-10-07 13:15:22', '2025-10-07 13:15:22'),
(135, 'Derick (Pablo)', 'derickrenji04@gmail.com', '0791032701', 'male', 22, 'Nairobi', '$2a$12$DUtJpZBsU3tK0reaUoVwYeLb1wg1bboL7NdSApjBMRAaYtnTtrwVu', 'P', '0733542016', 'Sibling', '', '', '2025-10-08 12:04:59', '2025-10-08 12:04:59'),
(136, 'Faraj Suleiman ', 'farajsuleimanmolu@gmail.com', '0716340427', 'male', 29, 'Nairobi', '$2a$12$z8ymqLukeVDKjJSrceSJBe6gOKa4FI4kU2S/.CKbfewm4B1V09NrO', 'Fardosa', '0718435557', 'Sister ', '', '', '2025-10-08 14:04:39', '2025-10-08 14:04:39'),
(137, 'Samuel Muigai', 'ndungu.muigai01@gmail.com', '0707251073', 'male', 24, 'Nairobi', '$2a$12$4A5DxxwP/UCqQ6Z.xkN9oeb9qqui0ov7Rx4./g.OpXeYK/AKVL4ui', 'Mary Karanja', '0722750347', 'Mother', 'Syokimau, Syokimau-Mulolongo ward, Mavoko, Machakos County, 00519, Kenya', '', '2025-10-08 15:20:56', '2025-10-08 15:20:56'),
(138, 'Everline Olesa ', 'olesaeverline@gmail.com', '0799055054', 'female', 18, 'Nairobi', '$2a$12$pZX4GYDZG.MRUuSc6yid4OymeMIYdd7yIHa8DC82TgW9BMcn43zAW', 'David', '0746159644', 'Sibling ', '', '', '2025-10-08 21:57:40', '2025-10-08 21:57:40'),
(139, 'Ryan Aghan', 'ryanaghan@gmail.com', '0703329692', 'male', 26, 'Nairobi', '$2a$12$lcbbWYP/qKXvVNfkKBUVJeXPX.OuSBgUFnLB41lQ6PmvAOdextGSK', 'Rodgers Aghan', '0726563532', 'Brother', '', '', '2025-10-09 08:11:49', '2025-10-09 08:11:49'),
(140, 'Kuria Gachure ', 'gachurejohn758@gmail.com', '0799637539', 'male', 23, 'Nairobi', '$2a$12$a9bCmT2RS35rhlgaCDh2iee3nJiFApSNm99HCPPWagOt2eltrrAxi', 'Sarah', '0719616271', 'Sister', 'Kingara Road, Kilimani location, Kilimani ward, Kilimani division, Westlands, Nairobi, Nairobi County, 54102, Kenya', '', '2025-10-09 08:23:19', '2025-10-09 08:23:19'),
(141, 'JERUSHA', 'jerushawaithira2@gmail.com', '0702059942', 'female', 20, 'Nairobi', '$2a$12$hVJPpcYvN53U082fCEYY.eCnl14e5s2g47EDF9UnuoYouDgBBvlhS', '0702059942', '0702059942', 'me', '', '', '2025-10-09 09:46:58', '2025-10-09 09:46:58'),
(142, 'Jane Kinyoho', 'janenjerikinyoho500@gmail.com', '0716883675', 'female', 24, 'Kiambu', '$2a$12$Tq7.sZ2YSNe2HNCHLBnvi.v7nSXg8NQRgWl.CYGdcy4k986U5V8j2', 'Mary Ngugi', '0794576894', 'Mother', '', '', '2025-10-09 12:06:07', '2025-10-09 12:06:07'),
(143, 'Loreen Grace Wanjiru', 'loraiynwanjiru@gmail.com', '0701699932', 'female', 23, 'Nairobi', '$2a$12$ZL8clBKj/RDLj6i99dzzy.AtpqbkVEbWVtPxWGXpXMjkBm/Km2NHO', 'Lisper', '+254 713 054975', 'Friend', '', 'I need to be listened to ,friends for connection ', '2025-10-09 14:02:16', '2025-10-09 14:02:16'),
(144, 'Anne Tumaini Mang\'eni ', 'Hopeann652@gmail.com', '0748141306', 'female', 25, 'Busia', '$2a$12$MaVskupUus3F0r7wgy0J5elkAJPgVcxLunlnSDVOmWarVIGHFx3fW', 'Posh', '0705111045', 'Sibling', 'Lucky Summer, Lucky Summer sublocation, Kasarani, Nairobi, Nairobi County, 00623, Kenya', '', '2025-10-09 16:34:11', '2025-10-09 16:34:11'),
(145, 'Innocent odongo', 'innocentodongo823@gmail.com', '0757258301', 'male', 26, 'Nairobi', '$2a$12$mdX4UsoUHQAUEW0JWM5c/uRiBvnGAl/j96YaLBDdAGmEMIW/36FtK', 'Fridah', '0712533628', 'Mum', '', '', '2025-10-09 16:56:00', '2025-10-09 16:56:00'),
(146, 'Frankline wetende ', 'frankwetende@gmail.com', '0116349770', 'male', 19, 'Kisumu', '$2a$12$F85FbV7lNTTlmtMXyzMqou68bwPIY2gfwfqZ.sHZ.sxRKKOlyA.O.', 'Lawrence ', '0746891516', 'Brother', 'Afya Estate, Lolwe, Kisumu Central, Kisumu, City of Kisumu, Kisumu County, 40103, Kenya', '', '2025-10-09 16:57:53', '2025-10-09 16:57:53'),
(147, 'Evans Ltemuni Lengirasi ', 'ltupesltunges@gmail.com', '0795715336', 'male', 26, 'Nairobi', '$2a$12$l7ONbvgncjBVYohM5cLWdOCmgYZY8CL3ChyaktHEtRUVrK/uTch1S', 'Dominic Lengirasi ', '0721270576', 'Parent ', '', '', '2025-10-09 18:59:03', '2025-10-09 18:59:03'),
(148, 'Vivian Nyambura', 'viviankahura16@gmail.com', '+254 758 909341', 'female', 21, 'Kiambu', '$2a$12$2m.aqbPqiLtsi5tE4CqQU.kdaVwfdbnQeXh70O1TFpJctTbVjonvi', '0701229028', '0701229028', 'Parent', '', 'I\'m struggling with anxiety and really wants to fight it , I want to be able to stand up for myself ', '2025-10-09 19:17:27', '2025-10-09 19:17:27'),
(149, 'Peter ', 'nyamburapkn2004@gmail.com', '0715715464', 'male', 22, 'Nairobi', '$2a$12$NgmYWhs08lS4mlRUWyHcDOwAe8s5DfjJFUm4BqDbeQZr98qbui3oG', 'Sammy ', '0711704905', 'Bro ', '', '', '2025-10-09 19:35:31', '2025-10-09 19:35:31'),
(150, 'Kevin Ochieng Onyango ', 'kevinchieng254@gmail.com', '0746683343', 'male', 28, 'Nairobi', '$2a$12$K0x1HOkjpAP3O6ydXONND.vB6DKxAAZLESWE26PXtvB0/J7HHEi/K', 'Kevin Ochieng ', '0791030326', 'Spouse', '', 'I prefer not too yet', '2025-10-09 20:10:12', '2025-10-09 20:10:12'),
(151, 'Lucy mary snaida ', 'snaidalucy174@gmail.com', '0113951622', 'female', 24, 'Nairobi', '$2a$12$t1bRR8rxxCZPi5QofGdfTejBoG3JVQ.YCJ/xz.KGfOKtzM/xxCKle', 'Lucy snaida', '0113951622', 'Sibling', '', '', '2025-10-10 00:09:40', '2025-10-10 00:09:40'),
(152, 'Brian kimani ', 'briankimani10m@gmail.com', '0743625289', 'male', 25, 'Nairobi', '$2a$12$FI11jxptmU4p543c/cRmZeKmCdGceosvlsDD/A9S85ryuHkOtrQhy', 'Brian', '0784797783', 'Single ', '', '', '2025-10-10 10:23:22', '2025-10-10 10:23:22'),
(153, 'Eliud theuri', 'eliudtheuri108@gmail.com', '0700845844', 'male', 21, 'Kiambu', '$2a$12$U5B3YpXBIy5atxGLAKSLLOuOULRnbMMKQoChFU8uJVcuJveeLYmo6', 'Isaac waititu ', '0794130039', 'Parent', '', '', '2025-10-10 12:00:54', '2025-10-10 12:00:54'),
(154, 'IBRAHIM NJATHI', 'ibrahimnjathi@gmail.com', '0742533324', 'male', 27, 'Nairobi', '$2a$12$1goNGw/qiit/nNfkWWt6KuVytoZ.CgcYp.M20meTcHHF5BmLE7CNy', 'Joseph', '0705466307', 'Brother', 'Mwiki location, Mwiki ward, Kasarani division, Kasarani, Nairobi, Nairobi County, 00520, Kenya', '', '2025-10-10 12:06:31', '2025-10-10 12:06:31'),
(155, 'Pol Jemator', 'jematorpol@gmail.com', '0757095380', 'female', 22, 'Nairobi', '$2a$12$amWs3BCDVApnmukY5XCT/OPrDfIeHoH.xRLQt9GnWuvPoUs0f1fQ2', 'Cindy Daisy', '0795411388', 'Friend', 'Ngara West sublocation, Ngara location, CBD division, Starehe, Nairobi, Nairobi County, 00600, Kenya', '', '2025-10-10 20:00:09', '2025-10-10 20:00:09'),
(156, 'Regina Kwamboka', 'reginakwamboka61@gmail.com', '0795742858', 'female', 23, 'Kajiado', '$2a$12$Upx/JXopj8eF2wCa9O8d3O9//EpAOGrrHeMRyH4nSLR2QM4R4QkM.', 'Mother', '0704301515', 'Parent', '', '', '2025-10-11 05:37:44', '2025-10-11 05:37:44'),
(157, 'Rhoda wairimu kailemia', 'wairimurhoda254@gmail.com', '0791288619', 'female', 28, 'Nairobi', '$2a$12$0Ms/PG/x1hU/ypsyrIrMc.zn7adqwqYHgFnYZ58Iiuk.olSwUqnyu', 'Nimo', '0796484106', 'Friend', '', '', '2025-10-11 06:04:52', '2025-10-11 06:04:52'),
(158, 'Mary Deckline ', 'daisymary1190@gmail.com', '0714141402', 'female', 22, 'Kisumu', '$2a$12$6INQKpF7REQeUBxYLQvYvenqtnU8L5h3sk.OeTjh1p029G3dW2VcC', 'Elgah', '0715244108', 'Parent', 'Micheal Welding, P278;Ksm, Gesoko, Manyatta B, Kisumu Central, Kisumu, City of Kisumu, Kisumu County, 40103, Kenya', '', '2025-10-16 12:25:28', '2025-10-16 12:25:28'),
(159, 'Faraji Saidi Zachariah', 'farajisaidi1990@gmail.com', '0714761958', 'male', 35, 'Kisumu', '$2a$12$7hhmpwbJObZd3ujoUEnrEe94O5kytwECQ8joxpzdB3/I0zoWhj3si', 'Aziza auma', '0707082254', 'Mum', '', '', '2025-10-16 12:30:27', '2025-10-16 12:30:27'),
(160, 'Pajero Oluoch', 'pascaloluoch2020@gmail.com', '+254758827817', 'male', 25, 'Uasin Gishu', '$2a$12$pWT9kYp2WypZ/gWL3.LGR.8WLa3OlfjorUM5ExW8HDbO5fA3s6pr6', 'Basil ', '0726912152', 'Brother ', '', '', '2025-10-16 12:31:35', '2025-10-16 12:31:35'),
(161, 'Joshua Komu', 'Jskomu45@gmail.com', '0745290212', 'male', 24, 'Kisumu', '$2a$12$jHJDZ0Ko9JRnFU2fLS3sSebCBpum1pYSabI67AoExskssyeoTBuIu', 'Victor Komu', '0769635578', 'sibling', '', '', '2025-10-16 12:33:33', '2025-10-16 12:33:33'),
(162, 'Steven ochieng martin', 'stvvnmartin@gmail.com', '0115579895', 'male', 22, 'Kisumu', '$2a$12$TufHp9eP3SXL3i4Ev8S4p./Fghy7tgRnXe5e6yvqn.5qY6m8RK/oi', 'Michael ochieng ', '0729882524', 'Parent', 'C675, Shiru, Cheptulu, Shiru ward, Hamisi, Vihiga County, Kenya', '', '2025-10-17 05:37:34', '2025-10-17 05:37:34'),
(163, 'Eva Maureen Onguko', 'evamaureen16@gmail.com', '0727713857', 'female', 40, 'Kisumu', '$2a$12$6QShCUWWb3CTJmPot5H.D.NSHJJS2BtlKAr9aerJgJBji3dYTEr0y', 'Claris Achieng', '0724418221', 'My bestfriend', '', 'Seeking help in terms of emotional support, am from a breakup which is emotiinally draining me down', '2025-10-17 07:33:53', '2025-10-17 07:33:53'),
(164, 'Shirleen Mutoola', 'sirleenmutoola@gmail.com', '0791941892', 'female', 23, 'Kisumu', '$2a$12$WckeB1OrkKHuKHTQRPQZN.orMUMoWVULFIoqx.23CGfxlNJqzEnQe', 'Shirleen Mutoola', '0791941892', 'Me', '', '', '2025-10-18 16:55:33', '2025-10-18 16:55:33'),
(165, 'Lilian ', 'lilianisaiah10@gmail.com', '0790583464', 'female', 32, 'Siaya', '$2a$12$aKCIpTy6WAHzMo5jmQnkIOA/sqpWkYFF2Zaq/SQYF6HHhUyw.KkPm', 'Joh', '0717804443', 'Husband ', 'B9, Baroseno, North Alego ward, Alego Usonga, Siaya County, 40600, Kenya', 'Need new friends ', '2025-10-18 17:13:01', '2025-10-18 17:13:01'),
(166, 'Fwedza Fortune', 'fwedzafortune40@gmail.com', '+254716203644', 'male', 26, 'Nairobi', '$2a$12$q2fhEGtw1Nssmje0aSpKb.RV3a3qwDUrm49LRowDQ6hcwIkBFho7G', 'Fortune Fwedza', '+254107654233', 'Sibling', '', '', '2025-10-18 20:06:53', '2025-10-18 20:06:53'),
(167, 'Aldrid Musomi', 'aldrimusomi@gmail.com', '0798026078', 'male', 22, 'Kisumu', '$2a$12$6ASvwHjvwbiuFtKpcmP6tuV9ckSsvNYzOAU7bX7ynwauGh3BueDIq', 'Tabitha chepk9rir', '0723577846', 'Best friend', 'Kanyakwar, Kanyakwar sublocation, Kisumu Central, Kisumu, Byen Kisumu, Kisumu County, 40100, Kenya', '', '2025-10-19 06:58:41', '2025-10-19 06:58:41'),
(168, 'Zack', 'ew183278@gmail.com', '0757697156', 'male', 27, 'Nairobi', '$2a$12$H/QFB/i/N5MF7iT58koCaeZqudzOwRZFsKXV6bLQne8Q8O.sRklfO', 'Jane', '0705539709', 'Parent', '', '', '2025-10-19 08:06:21', '2025-10-19 08:06:21'),
(169, 'Shayo', 'barabrashayo17@gmail.com', '0741466819', 'female', 21, 'Mombasa', '$2a$12$N4Oz7bd7G30DvmtR0VQUPOfGeYItr52ueAeA9vA5LEAawDYZn4Zd6', '0704685569', '0745463844', 'Sister', 'Fisheries, Bamburi, Shanzu ward, Kisauni, Mombasa County, 80101, Kenya', '', '2025-10-19 09:08:00', '2025-10-19 09:08:00');
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `gender`, `age`, `location`, `password_hash`, `emergency_contact_name`, `emergency_contact_phone`, `emergency_contact_relationship`, `live_location`, `personal_statement`, `created_at`, `updated_at`) VALUES
(170, 'Makenzi michael ', 'Makenzisimon1997@gmail.com', '0708747897', 'male', 28, 'Nairobi', '$2a$12$QoJOQALhClYfIz6Xi5MeWONSV614gQZT7MDIcbZgyf8BlpL3tuIrm', 'Elinah ', '0796044632', 'Wife', '', '', '2025-10-20 09:45:02', '2025-10-20 09:45:02'),
(171, 'Victor Kabui Karanja', 'victorkaranja41@gmail.com', '+254741222300', 'male', 26, 'Nairobi', '$2a$12$NteaJft1uUdrJhzFHZz/yOqPzD63aCs41xtrFZSXB6ntieg83gBfu', 'Joe', '0106721843', 'Brother', '', '', '2025-10-21 16:43:13', '2025-10-21 16:43:13'),
(172, 'DAVID OTIENO OJWANG', 'ojwangdavid280@gmail.com', '0799250462', 'male', 26, 'Nairobi', '$2a$12$1pKnp1wDbppgzMXHqHgUPOYLL1Po1ZRZN83OKCEwY3.9Ilqe7j3bq', 'just me', '0746769754', 'me', '', 'Am trying to pick up my life once again need your support to be strong again.', '2025-10-22 12:10:36', '2025-10-22 12:10:36'),
(173, 'Stacynida Agongo ', 'stacynida@gmail.com', '0113416933', 'female', 23, 'Kisumu', '$2a$12$YcTuhHVRpuOotP4PIi6lOOVdpwvB35j54AJ49w2MhXi.y66wUOpfu', 'Winnie ', '0714065560', 'Sibling ', '', '', '2025-10-23 17:47:48', '2025-10-23 17:47:48'),
(174, 'Osborne GOGA', 'gogaosborne@gmail.com', '0796646077', 'male', 25, 'Kisumu', '$2a$12$u3yClKKozMVBbBpP8RpUF.YSo/n.JtRW7oJYgD8NXPm5tSjpv.E0O', 'Mals', '0725828211', 'Sibling', 'Bandari, Kogony sublocation, Central Kisumu ward, Kisumu, City of Kisumu, Kisumu West, Kisumu County, 40100, Kenya', '', '2025-10-24 12:16:52', '2025-10-24 12:16:52'),
(175, 'Gladys Nafuna', 'nafunagladys54@gmail.com', '0745727988', 'female', 21, 'Kisumu', '$2a$12$eGCfGiNTq047ygExel7w1OnCZm0UcNh2PsihXFFsKt/7b0ZT8Tnty', 'Edith Ayoma', '0716626096', 'Mother', '', '', '2025-10-24 12:51:57', '2025-10-24 12:51:57'),
(176, 'MARYLAURINE ASUMTA ', 'marylaurin2@gmail.com', '0724646880', 'female', 23, 'Kisumu', '$2a$12$F/pXScwwARvWDEUdjhbQ/u58jAl77K2IUN9peGhXtj6adVbIM2T1.', 'MARCUS TEVIN', '0797110260', 'Siblings ', '', '', '2025-10-24 16:40:30', '2025-10-24 16:40:30'),
(177, 'Juliet Millicent ', 'millyjuliet45@gmail.com', '0714450972', 'female', 19, 'Kisumu', '$2a$12$Vmbs8aGGT2kpwmDDRiuM6ugnJWxnNhlc/.AYcv0N5dVCc8dmnIffW', 'Mom', '0792743508', 'Mother ', 'Salina, Migosi, Kisumu Central, Kisumu, City of Kisumu, Kisumu County, 40103, Kenya', '', '2025-10-24 17:57:39', '2025-10-24 17:57:39'),
(178, 'James Chalo', 'jameschalo74@gmail.com', '0792252297', 'male', 19, 'Nairobi', '$2a$12$RKzAL/wMoqYu9nA1b/6fn.RuVdIURFxqBkUEisTXLeaYb4J5O9/LG', 'Chalo', '0792252297', 'Relationship ', '', '', '2025-11-16 18:33:57', '2025-11-16 18:33:57'),
(179, 'Cynthia Muli Sammy ', 'cynthiamulisammy@gmail.com', '0796379643', 'female', 25, 'Nairobi', '$2a$12$CbAuVh6sFX5dMXlBYsnnvef44WVMsl.i4KhBnuW17X.QZksYPR5cO', 'Esther ', '0712917709', 'Mother ', '', '', '2025-11-23 14:52:54', '2025-11-23 14:52:54'),
(180, 'Sharleen Njoki ', 'Sharleennjoki19@gmail.co', '0704717148', 'female', 21, 'Nairobi', '$2a$12$DKm24TMPPyN4HIX5kHjjf.nSf6ems3fNxeaI1rn8.oJl0S0E6q1fi', 'Sandy', '0723760703', 'Sibling ', '', '', '2025-11-24 10:16:27', '2025-11-24 10:16:27'),
(181, 'Josphat Musa', 'josphatmusa47@gmail.com', '0790537897', 'male', 25, 'Nairobi', '$2a$12$Lun.mN0gpnlDHQfqYSKIEuZXAJqfafhHXXW3K7tR.0038yT3pvJia', 'Josphat Musa', '0723135344', 'Parent', '', 'Would like to interact with people and share ideas ', '2025-11-27 20:22:22', '2025-11-27 20:22:22');

-- --------------------------------------------------------

--
-- Table structure for table `user_settings`
--

CREATE TABLE `user_settings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `dark_mode` tinyint(1) DEFAULT 0,
  `mood_reminders` tinyint(1) DEFAULT 0,
  `data_retention_days` int(11) DEFAULT 30,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `user_settings`
--

INSERT INTO `user_settings` (`id`, `user_id`, `dark_mode`, `mood_reminders`, `data_retention_days`, `created_at`, `updated_at`) VALUES
(1, 92, 1, 0, 30, '2025-08-19 09:35:38', '2025-08-19 09:35:38');

-- --------------------------------------------------------

--
-- Table structure for table `user_support_categories`
--

CREATE TABLE `user_support_categories` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `support_category_id` int(11) NOT NULL,
  `other_details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `user_support_categories`
--

INSERT INTO `user_support_categories` (`id`, `user_id`, `support_category_id`, `other_details`) VALUES
(1, 1, 1, NULL),
(2, 1, 2, NULL),
(3, 2, 2, NULL),
(4, 2, 3, NULL),
(5, 3, 1, NULL),
(6, 4, 9, NULL),
(7, 4, 6, NULL),
(8, 5, 11, ''),
(9, 6, 5, NULL),
(10, 6, 7, NULL),
(11, 7, 1, NULL),
(12, 7, 3, NULL),
(13, 8, 11, ''),
(14, 8, 1, NULL),
(15, 8, 2, NULL),
(16, 8, 3, NULL),
(17, 8, 4, NULL),
(18, 8, 5, NULL),
(19, 8, 6, NULL),
(20, 8, 8, NULL),
(21, 8, 9, NULL),
(22, 8, 10, NULL),
(23, 8, 7, NULL),
(24, 9, 1, NULL),
(25, 10, 1, NULL),
(26, 10, 3, NULL),
(27, 10, 4, NULL),
(28, 10, 5, NULL),
(29, 10, 6, NULL),
(30, 10, 7, NULL),
(31, 10, 9, NULL),
(32, 10, 10, NULL),
(33, 10, 11, ''),
(34, 11, 1, NULL),
(35, 11, 5, NULL),
(36, 12, 2, NULL),
(37, 12, 1, NULL),
(38, 12, 10, NULL),
(39, 12, 11, ''),
(40, 13, 1, NULL),
(41, 13, 8, NULL),
(42, 13, 4, NULL),
(43, 14, 10, NULL),
(44, 15, 1, NULL),
(45, 15, 6, NULL),
(46, 15, 7, NULL),
(47, 15, 10, NULL),
(48, 16, 1, NULL),
(49, 16, 4, NULL),
(50, 16, 7, NULL),
(51, 16, 10, NULL),
(52, 17, 10, NULL),
(53, 18, 1, NULL),
(54, 19, 7, NULL),
(55, 20, 1, NULL),
(56, 21, 1, NULL),
(57, 21, 4, NULL),
(58, 21, 10, NULL),
(59, 21, 11, ''),
(60, 22, 11, ''),
(61, 23, 1, NULL),
(62, 23, 4, NULL),
(63, 23, 3, NULL),
(64, 23, 8, NULL),
(65, 24, 1, NULL),
(66, 25, 5, NULL),
(67, 25, 1, NULL),
(68, 25, 7, NULL),
(69, 25, 10, NULL),
(70, 25, 11, ''),
(71, 25, 6, NULL),
(72, 26, 1, NULL),
(73, 26, 7, NULL),
(74, 26, 6, NULL),
(75, 26, 5, NULL),
(76, 26, 11, ''),
(77, 27, 1, NULL),
(78, 28, 1, NULL),
(79, 28, 6, NULL),
(80, 28, 7, NULL),
(81, 28, 10, NULL),
(82, 29, 10, NULL),
(83, 30, 7, NULL),
(84, 30, 1, NULL),
(85, 31, 1, NULL),
(86, 32, 1, NULL),
(87, 32, 5, NULL),
(88, 32, 7, NULL),
(89, 32, 10, NULL),
(90, 33, 1, NULL),
(91, 33, 2, NULL),
(92, 34, 10, NULL),
(93, 34, 1, NULL),
(94, 35, 1, NULL),
(95, 35, 8, NULL),
(96, 35, 11, ''),
(97, 36, 1, NULL),
(98, 36, 2, NULL),
(99, 36, 7, NULL),
(100, 36, 6, NULL),
(101, 36, 10, NULL),
(102, 37, 10, NULL),
(103, 37, 7, NULL),
(104, 37, 1, NULL),
(105, 38, 1, NULL),
(106, 38, 2, NULL),
(107, 38, 3, NULL),
(108, 38, 6, NULL),
(109, 38, 10, NULL),
(110, 39, 1, NULL),
(111, 39, 7, NULL),
(112, 39, 8, NULL),
(113, 39, 10, NULL),
(114, 40, 5, NULL),
(115, 40, 1, NULL),
(116, 40, 11, ''),
(117, 41, 1, NULL),
(118, 42, 11, 'Masturbation '),
(119, 43, 1, NULL),
(120, 43, 7, NULL),
(121, 44, 1, NULL),
(122, 45, 11, 'Self hate'),
(123, 46, 7, NULL),
(124, 47, 5, NULL),
(125, 47, 11, ''),
(126, 47, 1, NULL),
(127, 48, 1, NULL),
(128, 48, 2, NULL),
(129, 48, 3, NULL),
(130, 48, 4, NULL),
(131, 48, 5, NULL),
(132, 48, 6, NULL),
(133, 48, 8, NULL),
(134, 48, 9, NULL),
(135, 48, 10, NULL),
(136, 48, 11, ''),
(137, 49, 1, NULL),
(138, 49, 6, NULL),
(139, 49, 10, NULL),
(140, 50, 1, NULL),
(141, 50, 10, NULL),
(142, 50, 7, NULL),
(143, 51, 2, NULL),
(144, 52, 1, NULL),
(145, 52, 2, NULL),
(146, 52, 4, NULL),
(147, 52, 6, NULL),
(148, 52, 8, NULL),
(149, 52, 10, NULL),
(150, 52, 7, NULL),
(151, 53, 11, 'Fruendship'),
(152, 54, 10, NULL),
(153, 55, 1, NULL),
(154, 56, 1, NULL),
(155, 56, 5, NULL),
(156, 56, 6, NULL),
(157, 56, 10, NULL),
(158, 57, 6, NULL),
(159, 57, 1, NULL),
(160, 57, 5, NULL),
(161, 58, 1, NULL),
(162, 58, 4, NULL),
(163, 58, 6, NULL),
(164, 58, 7, NULL),
(165, 58, 8, NULL),
(166, 58, 10, NULL),
(167, 58, 5, NULL),
(168, 59, 1, NULL),
(169, 59, 4, NULL),
(170, 60, 1, NULL),
(171, 60, 10, NULL),
(172, 60, 7, NULL),
(173, 61, 1, NULL),
(174, 61, 11, ''),
(175, 62, 1, NULL),
(176, 62, 10, NULL),
(177, 62, 5, NULL),
(178, 62, 7, NULL),
(179, 63, 11, 'Connections and partnership with fellow counselling psychologists'),
(180, 64, 11, ''),
(181, 65, 1, NULL),
(182, 65, 8, NULL),
(183, 65, 9, NULL),
(184, 66, 11, ''),
(185, 67, 1, NULL),
(186, 67, 6, NULL),
(187, 67, 10, NULL),
(188, 67, 11, ''),
(189, 67, 7, NULL),
(190, 68, 7, NULL),
(191, 68, 10, NULL),
(192, 68, 5, NULL),
(193, 68, 6, NULL),
(194, 69, 1, NULL),
(195, 69, 6, NULL),
(196, 69, 7, NULL),
(197, 69, 10, NULL),
(198, 70, 5, NULL),
(199, 71, 1, NULL),
(200, 71, 5, NULL),
(201, 71, 4, NULL),
(202, 71, 7, NULL),
(203, 72, 7, NULL),
(204, 72, 6, NULL),
(205, 72, 10, NULL),
(206, 72, 1, NULL),
(207, 73, 7, NULL),
(208, 73, 6, NULL),
(209, 73, 10, NULL),
(210, 74, 1, NULL),
(211, 76, 11, ''),
(212, 77, 1, NULL),
(213, 78, 6, NULL),
(214, 79, 1, NULL),
(215, 79, 3, NULL),
(216, 79, 7, NULL),
(217, 79, 10, NULL),
(218, 80, 1, NULL),
(219, 80, 2, NULL),
(220, 80, 10, NULL),
(221, 80, 6, NULL),
(222, 81, 1, NULL),
(223, 81, 10, NULL),
(224, 82, 6, NULL),
(225, 82, 1, NULL),
(226, 82, 10, NULL),
(227, 84, 1, NULL),
(228, 85, 6, NULL),
(229, 86, 11, ''),
(230, 87, 10, NULL),
(231, 87, 7, NULL),
(232, 87, 1, NULL),
(233, 88, 2, NULL),
(234, 88, 10, NULL),
(235, 88, 7, NULL),
(236, 88, 1, NULL),
(237, 89, 1, NULL),
(238, 90, 1, NULL),
(239, 91, 1, NULL),
(240, 92, 1, NULL),
(241, 93, 1, NULL),
(242, 93, 10, NULL),
(243, 94, 7, NULL),
(244, 94, 1, NULL),
(245, 94, 10, NULL),
(246, 95, 1, NULL),
(247, 95, 10, NULL),
(248, 96, 1, NULL),
(249, 97, 1, NULL),
(250, 97, 4, NULL),
(251, 97, 6, NULL),
(252, 97, 10, NULL),
(253, 98, 7, NULL),
(254, 99, 11, 'Career guidance '),
(255, 99, 1, NULL),
(256, 100, 7, NULL),
(257, 101, 1, NULL),
(258, 101, 2, NULL),
(259, 101, 3, NULL),
(260, 101, 4, NULL),
(261, 101, 7, NULL),
(262, 101, 5, NULL),
(263, 101, 6, NULL),
(264, 101, 8, NULL),
(265, 101, 9, NULL),
(266, 101, 10, NULL),
(267, 102, 1, NULL),
(268, 103, 1, NULL),
(269, 104, 3, NULL),
(270, 104, 5, NULL),
(271, 105, 7, NULL),
(272, 105, 10, NULL),
(273, 105, 11, ''),
(274, 106, 1, NULL),
(275, 106, 10, NULL),
(276, 107, 1, NULL),
(277, 108, 1, NULL),
(278, 109, 1, NULL),
(279, 110, 1, NULL),
(280, 110, 7, NULL),
(281, 110, 10, NULL),
(282, 111, 1, NULL),
(283, 112, 11, ''),
(284, 113, 1, NULL),
(285, 113, 10, NULL),
(286, 114, 1, NULL),
(287, 115, 7, NULL),
(288, 115, 1, NULL),
(289, 116, 1, NULL),
(290, 116, 11, ''),
(291, 117, 1, NULL),
(292, 117, 2, NULL),
(293, 117, 5, NULL),
(294, 117, 6, NULL),
(295, 117, 7, NULL),
(296, 118, 1, NULL),
(297, 118, 2, NULL),
(298, 118, 5, NULL),
(299, 118, 6, NULL),
(300, 119, 5, NULL),
(301, 119, 6, NULL),
(302, 119, 1, NULL),
(303, 120, 1, NULL),
(304, 120, 7, NULL),
(305, 120, 10, NULL),
(306, 121, 1, NULL),
(307, 121, 11, 'Making friends'),
(308, 122, 7, NULL),
(309, 122, 11, ''),
(310, 124, 1, NULL),
(311, 124, 7, NULL),
(312, 125, 1, NULL),
(313, 125, 7, NULL),
(314, 126, 7, NULL),
(315, 127, 11, ''),
(316, 128, 7, NULL),
(317, 129, 2, NULL),
(318, 129, 1, NULL),
(319, 129, 7, NULL),
(320, 130, 1, NULL),
(321, 130, 10, NULL),
(322, 131, 11, 'Personality disorder '),
(323, 131, 1, NULL),
(324, 132, 1, NULL),
(325, 133, 1, NULL),
(326, 134, 1, NULL),
(327, 135, 1, NULL),
(328, 135, 7, NULL),
(329, 135, 10, NULL),
(330, 136, 1, NULL),
(331, 137, 10, NULL),
(332, 138, 1, NULL),
(333, 138, 9, NULL),
(334, 138, 4, NULL),
(335, 138, 3, NULL),
(336, 138, 2, NULL),
(337, 138, 5, NULL),
(338, 138, 8, NULL),
(339, 138, 7, NULL),
(340, 138, 6, NULL),
(341, 138, 10, NULL),
(342, 139, 7, NULL),
(343, 139, 1, NULL),
(344, 141, 1, NULL),
(345, 141, 7, NULL),
(346, 142, 1, NULL),
(347, 142, 7, NULL),
(348, 143, 1, NULL),
(349, 143, 7, NULL),
(350, 143, 11, 'Life advise on my life choices'),
(351, 144, 7, NULL),
(352, 144, 10, NULL),
(353, 144, 5, NULL),
(354, 144, 4, NULL),
(355, 144, 1, NULL),
(356, 145, 5, NULL),
(357, 146, 1, NULL),
(358, 147, 1, NULL),
(359, 148, 1, NULL),
(360, 149, 10, NULL),
(361, 150, 7, NULL),
(362, 150, 8, NULL),
(363, 150, 1, NULL),
(364, 150, 2, NULL),
(365, 151, 7, NULL),
(366, 152, 1, NULL),
(367, 153, 6, NULL),
(368, 154, 7, NULL),
(369, 154, 10, NULL),
(370, 155, 11, 'Making friends'),
(371, 156, 11, 'Making new friends'),
(372, 157, 1, NULL),
(373, 157, 2, NULL),
(374, 158, 1, NULL),
(375, 159, 10, NULL),
(376, 159, 7, NULL),
(377, 159, 6, NULL),
(378, 159, 1, NULL),
(379, 160, 1, NULL),
(380, 160, 7, NULL),
(381, 160, 10, NULL),
(382, 161, 5, NULL),
(383, 161, 1, NULL),
(384, 162, 10, NULL),
(385, 162, 1, NULL),
(386, 162, 5, NULL),
(387, 162, 7, NULL),
(388, 163, 1, NULL),
(389, 163, 10, NULL),
(390, 163, 5, NULL),
(391, 163, 7, NULL),
(392, 163, 6, NULL),
(393, 164, 1, NULL),
(394, 164, 7, NULL),
(395, 164, 6, NULL),
(396, 165, 1, NULL),
(397, 166, 11, ''),
(398, 166, 7, NULL),
(399, 167, 1, NULL),
(400, 167, 7, NULL),
(401, 168, 1, NULL),
(402, 168, 2, NULL),
(403, 168, 3, NULL),
(404, 168, 4, NULL),
(405, 168, 5, NULL),
(406, 168, 7, NULL),
(407, 168, 6, NULL),
(408, 169, 10, NULL),
(409, 170, 2, NULL),
(410, 170, 1, NULL),
(411, 171, 7, NULL),
(412, 171, 10, NULL),
(413, 172, 6, NULL),
(414, 172, 10, NULL),
(415, 173, 1, NULL),
(416, 174, 1, NULL),
(417, 174, 2, NULL),
(418, 174, 3, NULL),
(419, 174, 4, NULL),
(420, 174, 5, NULL),
(421, 174, 6, NULL),
(422, 174, 7, NULL),
(423, 174, 9, NULL),
(424, 174, 10, NULL),
(425, 175, 1, NULL),
(426, 175, 7, NULL),
(427, 176, 1, NULL),
(428, 177, 1, NULL),
(429, 177, 7, NULL),
(430, 177, 8, NULL),
(431, 177, 2, NULL),
(432, 177, 10, NULL),
(433, 178, 7, NULL),
(434, 178, 11, ''),
(435, 179, 1, NULL),
(436, 179, 6, NULL),
(437, 179, 10, NULL),
(438, 180, 7, NULL),
(439, 181, 10, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_activity_log`
--
ALTER TABLE `admin_activity_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_admin_activity_profile` (`admin_profile_id`),
  ADD KEY `idx_admin_activity_action` (`action`),
  ADD KEY `idx_admin_activity_date` (`created_at`);

--
-- Indexes for table `admin_notification_settings`
--
ALTER TABLE `admin_notification_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_admin_notification` (`admin_profile_id`,`notification_type`),
  ADD KEY `idx_notification_settings_admin` (`admin_profile_id`);

--
-- Indexes for table `admin_profiles`
--
ALTER TABLE `admin_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_admin_profile_email` (`email`),
  ADD KEY `idx_admin_profile_phone` (`phone_number`),
  ADD KEY `idx_admin_profile_role` (`role`),
  ADD KEY `idx_admin_profile_status` (`status`),
  ADD KEY `idx_admin_profile_user_id` (`user_id`);

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_admin_email` (`email`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`);

--
-- Indexes for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `event_attendees`
--
ALTER TABLE `event_attendees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_event_attendees_event` (`event_id`),
  ADD KEY `idx_event_attendees_admin` (`admin_profile_id`),
  ADD KEY `idx_event_attendees_status` (`attendance_status`),
  ADD KEY `idx_event_attendees_email` (`external_email`);

--
-- Indexes for table `event_notifications`
--
ALTER TABLE `event_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_event_notifications_event` (`event_id`),
  ADD KEY `idx_event_notifications_type` (`notification_type`),
  ADD KEY `idx_event_notifications_status` (`email_status`),
  ADD KEY `idx_event_notifications_recipient` (`recipient_email`);

--
-- Indexes for table `event_payments`
--
ALTER TABLE `event_payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_mpesa_code` (`mpesa_code`),
  ADD KEY `idx_event_status` (`event_id`,`status`);

--
-- Indexes for table `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_event_id` (`event_id`),
  ADD KEY `idx_email_event` (`email`,`event_id`);

--
-- Indexes for table `event_reminders`
--
ALTER TABLE `event_reminders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_event_reminders_event` (`event_id`),
  ADD KEY `idx_event_reminders_datetime` (`reminder_datetime`),
  ADD KEY `idx_event_reminders_sent` (`is_sent`);

--
-- Indexes for table `event_tickets`
--
ALTER TABLE `event_tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ticket_number` (`ticket_number`),
  ADD KEY `idx_event_email` (`event_id`,`user_email`),
  ADD KEY `idx_mpesa_code` (`mpesa_code`);

--
-- Indexes for table `feedback_messages`
--
ALTER TABLE `feedback_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_feedback_type` (`type`),
  ADD KEY `idx_feedback_status` (`status`),
  ADD KEY `idx_feedback_priority` (`priority`),
  ADD KEY `idx_feedback_admin` (`admin_profile_id`);

--
-- Indexes for table `feedback_replies`
--
ALTER TABLE `feedback_replies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_reply_message` (`message_id`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_files_category` (`category_id`),
  ADD KEY `idx_files_uploaded_by` (`uploaded_by`),
  ADD KEY `idx_files_status` (`status`),
  ADD KEY `idx_files_created` (`created_at`),
  ADD KEY `idx_files_uploaded_by_email` (`uploaded_by_email`),
  ADD KEY `idx_files_uploaded_by_profile` (`uploaded_by_profile_id`);

--
-- Indexes for table `file_access_log`
--
ALTER TABLE `file_access_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_file_access_file` (`file_id`),
  ADD KEY `idx_file_access_user` (`accessed_by`),
  ADD KEY `idx_file_access_action` (`action`);

--
-- Indexes for table `file_categories`
--
ALTER TABLE `file_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_category_name` (`name`);

--
-- Indexes for table `file_downloads`
--
ALTER TABLE `file_downloads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_file_id` (`file_id`),
  ADD KEY `idx_downloaded_by_profile` (`downloaded_by_profile_id`),
  ADD KEY `idx_downloaded_by_email` (`downloaded_by_email`),
  ADD KEY `idx_downloaded_at` (`downloaded_at`);

--
-- Indexes for table `file_shares`
--
ALTER TABLE `file_shares`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_share_token` (`share_token`),
  ADD KEY `idx_file_shares_file` (`file_id`),
  ADD KEY `idx_file_shares_token` (`share_token`);

--
-- Indexes for table `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `moods`
--
ALTER TABLE `moods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `mpesa_verifications`
--
ALTER TABLE `mpesa_verifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_mpesa_code` (`mpesa_code`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_is_read` (`is_read`),
  ADD KEY `idx_source` (`source`),
  ADD KEY `idx_type` (`type`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_token` (`token`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Indexes for table `scheduled_events`
--
ALTER TABLE `scheduled_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_event_date` (`start_datetime`),
  ADD KEY `idx_event_type` (`type`),
  ADD KEY `idx_event_status` (`status`),
  ADD KEY `idx_event_reminder` (`reminder_sent`),
  ADD KEY `idx_scheduled_events_date_type` (`start_datetime`,`type`),
  ADD KEY `idx_events_created_by_profile` (`created_by_profile_id`),
  ADD KEY `idx_events_created_by_email` (`created_by_email`),
  ADD KEY `idx_events_updated_by_profile` (`updated_by_profile_id`);

--
-- Indexes for table `support_categories`
--
ALTER TABLE `support_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_phone` (`phone`);

--
-- Indexes for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user` (`user_id`);

--
-- Indexes for table `user_support_categories`
--
ALTER TABLE `user_support_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_category` (`user_id`,`support_category_id`),
  ADD KEY `support_category_id` (`support_category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_activity_log`
--
ALTER TABLE `admin_activity_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `admin_notification_settings`
--
ALTER TABLE `admin_notification_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `admin_profiles`
--
ALTER TABLE `admin_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `event_attendees`
--
ALTER TABLE `event_attendees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `event_notifications`
--
ALTER TABLE `event_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `event_payments`
--
ALTER TABLE `event_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `event_registrations`
--
ALTER TABLE `event_registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `event_reminders`
--
ALTER TABLE `event_reminders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `event_tickets`
--
ALTER TABLE `event_tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `feedback_messages`
--
ALTER TABLE `feedback_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `feedback_replies`
--
ALTER TABLE `feedback_replies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `file_access_log`
--
ALTER TABLE `file_access_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `file_categories`
--
ALTER TABLE `file_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `file_downloads`
--
ALTER TABLE `file_downloads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `file_shares`
--
ALTER TABLE `file_shares`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `journal_entries`
--
ALTER TABLE `journal_entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `moods`
--
ALTER TABLE `moods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mpesa_verifications`
--
ALTER TABLE `mpesa_verifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `scheduled_events`
--
ALTER TABLE `scheduled_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `support_categories`
--
ALTER TABLE `support_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=182;

--
-- AUTO_INCREMENT for table `user_settings`
--
ALTER TABLE `user_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_support_categories`
--
ALTER TABLE `user_support_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=440;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_activity_log`
--
ALTER TABLE `admin_activity_log`
  ADD CONSTRAINT `admin_activity_log_ibfk_1` FOREIGN KEY (`admin_profile_id`) REFERENCES `admin_profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `admin_notification_settings`
--
ALTER TABLE `admin_notification_settings`
  ADD CONSTRAINT `admin_notification_settings_ibfk_1` FOREIGN KEY (`admin_profile_id`) REFERENCES `admin_profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `admin_profiles`
--
ALTER TABLE `admin_profiles`
  ADD CONSTRAINT `fk_admin_profile_user` FOREIGN KEY (`user_id`) REFERENCES `admin_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `chat_sessions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD CONSTRAINT `chat_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `event_attendees`
--
ALTER TABLE `event_attendees`
  ADD CONSTRAINT `event_attendees_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `scheduled_events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_attendees_ibfk_2` FOREIGN KEY (`admin_profile_id`) REFERENCES `admin_profiles` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `event_notifications`
--
ALTER TABLE `event_notifications`
  ADD CONSTRAINT `event_notifications_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `scheduled_events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `event_reminders`
--
ALTER TABLE `event_reminders`
  ADD CONSTRAINT `event_reminders_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `scheduled_events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `feedback_replies`
--
ALTER TABLE `feedback_replies`
  ADD CONSTRAINT `feedback_replies_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `feedback_messages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `fk_files_category` FOREIGN KEY (`category_id`) REFERENCES `file_categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `file_access_log`
--
ALTER TABLE `file_access_log`
  ADD CONSTRAINT `file_access_log_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `file_downloads`
--
ALTER TABLE `file_downloads`
  ADD CONSTRAINT `file_downloads_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `file_downloads_ibfk_2` FOREIGN KEY (`downloaded_by_profile_id`) REFERENCES `admin_profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `file_shares`
--
ALTER TABLE `file_shares`
  ADD CONSTRAINT `file_shares_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD CONSTRAINT `journal_entries_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `moods`
--
ALTER TABLE `moods`
  ADD CONSTRAINT `moods_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_support_categories`
--
ALTER TABLE `user_support_categories`
  ADD CONSTRAINT `user_support_categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_support_categories_ibfk_2` FOREIGN KEY (`support_category_id`) REFERENCES `support_categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
