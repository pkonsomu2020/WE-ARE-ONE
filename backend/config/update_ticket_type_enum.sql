-- Update ticket_type enum to include 'Standard'
-- Run this script to update existing database tables

-- Update event_tickets table
ALTER TABLE event_tickets 
MODIFY COLUMN ticket_type ENUM('WAO Members','Public','Standard') NOT NULL;

-- Update event_payments table  
ALTER TABLE event_payments 
MODIFY COLUMN ticket_type ENUM('WAO Members','Public','Standard') NOT NULL;

-- Verify the changes
DESCRIBE event_tickets;
DESCRIBE event_payments;
