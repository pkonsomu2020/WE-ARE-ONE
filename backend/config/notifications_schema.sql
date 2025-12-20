-- Notifications table for admin notification system
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('success', 'info', 'warning', 'error') DEFAULT 'info',
    source ENUM('event', 'feedback', 'file', 'settings', 'system') DEFAULT 'system',
    action_url VARCHAR(500) NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_created_at (created_at),
    INDEX idx_is_read (is_read),
    INDEX idx_source (source),
    INDEX idx_type (type)
);

-- Insert sample notifications for demo
INSERT INTO notifications (title, message, type, source, action_url, is_read, created_at) VALUES
('Welcome to Admin Portal', 'System initialized successfully. All features are ready to use.', 'success', 'system', '/admin', FALSE, DATE_SUB(NOW(), INTERVAL 5 MINUTE)),
('New Meeting Scheduled', 'Team meeting scheduled for tomorrow at 10:00 AM', 'info', 'event', '/admin/events', FALSE, DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
('Feedback Received', 'New customer feedback submitted for review', 'success', 'feedback', '/admin/feedback', FALSE, DATE_SUB(NOW(), INTERVAL 2 HOUR));